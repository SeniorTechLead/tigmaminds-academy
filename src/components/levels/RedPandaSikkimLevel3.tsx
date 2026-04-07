import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RedPandaSikkimLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Newton\'s Law of Cooling — modeling heat loss over time',
      concept: `**Newton\'s Law of Cooling** states that the rate of heat loss is proportional to the temperature difference between an object and its environment:

**dT/dt = -k(T - T_env)**

Where:
- **T** = object temperature
- **T_env** = environmental temperature
- **k** = cooling constant (depends on insulation, surface area, etc.)
- **dT/dt** = rate of temperature change

The solution is exponential: **T(t) = T_env + (T₀ - T_env) × e^(-kt)**

For a red panda, this models what happens if metabolism fails (hypothermia). With thick fur, k is small (~0.02 per minute) — the panda cools slowly, buying time. Without fur, k would be ~0.1 — cooling 5× faster.

The cooling constant k depends on:
- Surface area (larger = faster cooling)
- Insulation (thicker fur = smaller k)
- Wind speed (increases convection = larger k)
- Wetness (water replaces trapped air = much larger k)

📚 *We will solve this differential equation numerically using Euler\'s method and compare scenarios.*`,
      analogy: 'Newton\'s Law of Cooling is like the rate you lose money when you stop earning. If you have $1000 (38°C) and your rent is proportional to your balance (temperature difference), you lose money fast at first, then slower as your balance drops. Good insulation (fur) is like having a low rent rate — your savings last longer.',
      storyConnection: 'If a red panda in Sikkim\'s forest is injured and cannot maintain its metabolism (like a hibernating animal that cannot wake up), it will cool according to Newton\'s law. The rate of cooling — determined by fur quality and environmental temperature — determines survival time. This is the mathematics of rescue windows.',
      checkQuestion: 'If two red pandas are injured in -10°C conditions, one with dry fur (k=0.02) and one with wet fur (k=0.08), how long until each reaches 30°C (hypothermia onset)?',
      checkAnswer: 'Using T(t) = T_env + (T₀ - T_env)e^(-kt): 30 = -10 + 48e^(-kt), so 40 = 48e^(-kt), e^(-kt) = 40/48 = 0.833, -kt = ln(0.833) = -0.182, t = 0.182/k. Dry: t = 0.182/0.02 = 9.1 minutes. Wet: t = 0.182/0.08 = 2.3 minutes. The wet panda reaches hypothermia 4× faster — matching the insulation ratio.',
      codeIntro: 'Simulate cooling curves for a red panda under different conditions using numerical integration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def cooling_euler(T0, T_env, k, duration_min, dt=0.1):
    """Solve Newton's Law of Cooling using Euler's method."""
    steps = int(duration_min / dt)
    T = np.zeros(steps)
    t = np.zeros(steps)
    T[0] = T0

    for i in range(1, steps):
        dT = -k * (T[i-1] - T_env)
        T[i] = T[i-1] + dT * dt
        t[i] = t[i-1] + dt

    return t, T

T0 = 38  # body temp

scenarios = [
    ('Dry fur, calm (-10°C)', -10, 0.02, '#22c55e'),
    ('Dry fur, windy (-10°C)', -10, 0.04, '#f59e0b'),
    ('Wet fur, calm (-10°C)', -10, 0.08, '#ef4444'),
    ('Dry fur, calm (5°C)', 5, 0.02, '#3b82f6'),
    ('No fur, calm (-10°C)', -10, 0.15, '#ec4899'),
]

fig, axes = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Cooling curves
ax = axes[0]
ax.set_facecolor('#1f2937')

for label, T_env, k, color in scenarios:
    t, T = cooling_euler(T0, T_env, k, 60)
    ax.plot(t, T, color=color, linewidth=2, label=label)

ax.axhline(y=35, color='gold', linestyle='--', alpha=0.7, label='Mild hypothermia (35°C)')
ax.axhline(y=30, color='#ef4444', linestyle='--', alpha=0.7, label='Severe hypothermia (30°C)')

ax.set_xlabel('Time (minutes)', color='white', fontsize=12)
ax.set_ylabel('Core Temperature (°C)', color='white', fontsize=12)
ax.set_title("Newton's Law of Cooling  -  Red Panda", color='white', fontsize=13, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7, loc='lower left')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Time to hypothermia vs k
ax = axes[1]
ax.set_facecolor('#1f2937')

k_values = np.linspace(0.01, 0.2, 100)
T_env = -10
T_hypo = 30  # severe hypothermia

# Analytical: t = -ln((T_hypo - T_env)/(T0 - T_env)) / k
time_to_hypo = -np.log((T_hypo - T_env) / (T0 - T_env)) / k_values

ax.plot(k_values, time_to_hypo, '#ef4444', linewidth=2.5)
ax.fill_between(k_values, time_to_hypo, alpha=0.15, color='#ef4444')

# Mark scenarios
for label, te, k, color in scenarios:
    if te == -10:
        t_h = -np.log((T_hypo - te) / (T0 - te)) / k
        ax.plot(k, t_h, 'o', color=color, markersize=10, zorder=5)
        ax.annotate(label.split(',')[0], (k, t_h+1), color=color, fontsize=8, ha='center')

ax.set_xlabel('Cooling Constant k (min⁻¹)', color='white', fontsize=12)
ax.set_ylabel('Time to 30°C (minutes)', color='white', fontsize=12)
ax.set_title('Survival Time vs. Insulation Quality', color='white', fontsize=13, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('cooling.png', dpi=100, facecolor='#1f2937')
plt.show()

# Summary
print("=== Time to Severe Hypothermia (30°C) at -10°C ===")
for label, te, k, _ in scenarios:
    if te == -10:
        t_h = -np.log((30 - te) / (T0 - te)) / k
        print(f"  {label}: {t_h:.1f} minutes")

print("\\nDry fur buys critical rescue time!")
print("Wet fur in cold = emergency situation.")`,
      challenge: 'Add metabolism: modify the equation to dT/dt = -k(T-T_env) + M, where M is metabolic heat production (about 0.5°C/min at full metabolism). At what ambient temperature can the panda maintain 38°C indefinitely?',
      successHint: 'You have solved a first-order ODE both numerically (Euler) and analytically. The exponential decay captures the essential physics of heat loss, and the comparison between dry and wet fur quantifies why rain + cold is the deadliest combination for the red panda.',
    },
    {
      title: 'The bioheat equation — temperature inside the body',
      concept: `Inside the red panda\'s body, temperature is not uniform. The **bioheat equation** (Pennes equation) models temperature distribution in living tissue:

**ρc ∂T/∂t = k∇²T + ρ_b c_b ω_b (T_a - T) + q_m**

Where:
- **ρc ∂T/∂t**: rate of thermal energy storage (density × specific heat × temp change rate)
- **k∇²T**: heat conduction through tissue
- **ρ_b c_b ω_b (T_a - T)**: blood perfusion term — blood flow brings heat from the core
- **q_m**: metabolic heat generation

Key insight: **blood perfusion** is the body\'s heat distribution system. Increase blood flow (vasodilation) → warm the extremity. Decrease flow (vasoconstriction) → let the extremity cool.

The red panda uses this selectively:
- Core (organs): maximum perfusion, always ~38°C
- Limbs: variable perfusion — warm when active, cold when resting
- Ears: thin, high SA:V — used as heat radiators in warm weather
- Paw pads: counter-current heat exchangers (described next)

📚 *We will solve the 1D bioheat equation numerically to model temperature through a cross-section of the red panda\'s body.*`,
      analogy: 'The bioheat equation describes how the body\'s central heating (blood) distributes warmth. The core is the furnace. Blood vessels are the pipes. Well-heated rooms (vital organs) have big pipes with full flow. Poorly heated rooms (extremities) have small pipes that can be turned down. The thermostat (brain) decides which rooms get heat based on outside temperature.',
      storyConnection: 'The red panda\'s ability to selectively warm and cool different body parts is a sophisticated survival tool. When the story\'s panda extends its legs to bask in a sunbeam, it is opening blood flow to warm its extremities. When it curls up, it is closing the valves, conserving core heat for vital organs.',
      checkQuestion: 'Why does the red panda\'s ear temperature vary from 35°C (warm day) to 10°C (cold night)?',
      checkAnswer: 'Ears are thin with high SA:V and minimal insulation — they lose heat rapidly. In warm conditions, the body deliberately increases blood flow to the ears, using them as radiators to dump excess heat. In cold conditions, vasoconstriction drastically reduces blood flow, allowing ear temperature to plummet. This is selective thermoregulation — the brain decides which body parts to sacrifice to protect the core.',
      codeIntro: 'Solve the 1D bioheat equation through a cross-section from core to skin to fur to air.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def solve_bioheat_1d(n=200, L=0.08, T_env=-10, perfusion_rate=0.005):
    """
    1D bioheat equation: core to skin to fur to air.
    L: total thickness (m)  -  core(0) to fur surface(L)
    """
    dx = L / n
    x = np.linspace(0, L, n)

    # Material properties along the cross-section
    # Regions: core tissue (0-3cm), muscle (3-4cm), skin (4-4.5cm), fur (4.5-8cm)
    k = np.where(x < 0.03, 0.5,      # core tissue conductivity
        np.where(x < 0.04, 0.4,       # muscle
        np.where(x < 0.045, 0.37,     # skin
                 0.04)))                # fur

    # Metabolic heat generation (W/m³)  -  only in living tissue
    qm = np.where(x < 0.03, 5000,    # core (liver, organs)
         np.where(x < 0.04, 2000,     # muscle
         np.where(x < 0.045, 500,     # skin
                  0)))                  # fur (dead tissue)

    # Blood perfusion  -  only in living tissue
    wb = np.where(x < 0.03, perfusion_rate,
         np.where(x < 0.04, perfusion_rate * 0.5,
         np.where(x < 0.045, perfusion_rate * 0.3,
                  0)))

    rho_b = 1060   # blood density
    cb = 3770      # blood specific heat
    T_arterial = 38

    # Solve steady state: 0 = d/dx(k dT/dx) + wb*rho_b*cb*(Ta-T) + qm
    # Use relaxation method
    T = np.linspace(38, T_env, n)  # initial guess

    for iteration in range(5000):
        T_new = T.copy()
        for i in range(1, n-1):
            conduction = (k[i+1]*(T[i+1]-T[i]) - k[i]*(T[i]-T[i-1])) / dx**2
            perfusion = wb[i] * rho_b * cb * (T_arterial - T[i])
            T_new[i] = T[i] + 0.0001 * (conduction + perfusion + qm[i])

        # Boundary conditions
        T_new[0] = 38      # core fixed at 38°C
        T_new[-1] = T_env  # fur surface = ambient

        T = T_new

    return x * 100, T  # return in cm

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Different environmental temperatures
ax = axes[0]
ax.set_facecolor('#1f2937')
for t_env, color, label in [(-10, '#3b82f6', '-10°C'), (0, '#22c55e', '0°C'),
                              (10, '#f59e0b', '10°C'), (20, '#ef4444', '20°C')]:
    x, T = solve_bioheat_1d(T_env=t_env)
    ax.plot(x, T, color=color, linewidth=2, label=f'Env: {label}')

# Mark tissue boundaries
for bnd, label in [(3, 'Core|Muscle'), (4, 'Muscle|Skin'), (4.5, 'Skin|Fur')]:
    ax.axvline(x=bnd, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Depth from core (cm)', color='white', fontsize=11)
ax.set_ylabel('Temperature (°C)', color='white', fontsize=11)
ax.set_title('Temperature Profile', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Effect of blood perfusion (vasoconstriction)
ax = axes[1]
ax.set_facecolor('#1f2937')
for perf, color, label in [(0.01, '#ef4444', 'Vasodilation'),
                             (0.005, '#f59e0b', 'Normal'),
                             (0.001, '#3b82f6', 'Vasoconstriction')]:
    x, T = solve_bioheat_1d(T_env=-10, perfusion_rate=perf)
    ax.plot(x, T, color=color, linewidth=2, label=label)

for bnd in [3, 4, 4.5]:
    ax.axvline(x=bnd, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Depth from core (cm)', color='white', fontsize=11)
ax.set_title('Blood Flow Effect (-10°C)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Skin temperature vs environment
ax = axes[2]
ax.set_facecolor('#1f2937')
env_temps = np.arange(-20, 30, 2)
skin_temps_normal = []
skin_temps_constrict = []

for te in env_temps:
    x, T = solve_bioheat_1d(T_env=te, perfusion_rate=0.005)
    skin_idx = np.argmin(np.abs(x - 4.2))  # skin position
    skin_temps_normal.append(T[skin_idx])

    x, T = solve_bioheat_1d(T_env=te, perfusion_rate=0.001)
    skin_temps_constrict.append(T[skin_idx])

ax.plot(env_temps, skin_temps_normal, '#f59e0b', linewidth=2, label='Normal perfusion')
ax.plot(env_temps, skin_temps_constrict, '#3b82f6', linewidth=2, label='Vasoconstriction')
ax.plot(env_temps, env_temps, ':', color='gray', alpha=0.5, label='Skin = Ambient')
ax.set_xlabel('Environmental Temp (°C)', color='white', fontsize=11)
ax.set_ylabel('Skin Temperature (°C)', color='white', fontsize=11)
ax.set_title('Skin Temp Control', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('bioheat.png', dpi=100, facecolor='#1f2937')
plt.show()

print("The core stays at 38°C regardless of environment.")
print("Vasoconstriction lets skin cool, reducing heat loss gradient.")
print("This is how the red panda survives -10°C with manageable energy cost.")`,
      challenge: 'Model frostbite: what happens if skin temperature drops below -2°C? At what environmental temperature and perfusion rate does this occur? Add a frostbite danger line to the skin temperature plot.',
      successHint: 'You have solved the Pennes bioheat equation — the foundational model of biomedical heat transfer. The vasoconstriction comparison shows how the red panda actively manages its thermal gradient. This same equation is used in surgical planning, burn treatment, and hypothermia research.',
    },
    {
      title: 'Counter-current heat exchange — the panda\'s vascular trick',
      concept: `The red panda\'s legs contain a remarkable heat-saving device: **counter-current heat exchangers (CCHE)**. Arteries carrying warm blood from the core run adjacent to veins carrying cool blood back from the extremities.

As warm arterial blood flows toward the paws, it transfers heat to the adjacent cool venous blood. By the time arterial blood reaches the paw, it has already cooled significantly. The venous blood, pre-warmed, returns to the core without creating a thermal shock.

Result: paw temperature can be near ambient (5-10°C) while core stays at 38°C, with minimal net heat loss.

The physics:
- Two parallel flows in opposite directions
- Heat transfers across the thin vessel walls
- The closer the flows (thinner walls, tighter arrangement), the more efficient the exchange
- Efficiency can reach 80-95% — recovering almost all the heat that would otherwise be lost to the paw

Counter-current exchangers are found in:
- Arctic foxes, wolves, penguins (feet)
- Dolphins, whales (fins and flukes)
- Tuna (body core — rare in fish!)
- Even human hands (when cold-adapted)

📚 *We will model the CCHE as a system of coupled differential equations and solve numerically.*`,
      analogy: 'Imagine two people walking in opposite directions along a narrow hallway, passing items between them. Person A (artery) starts with 10 coins (heat) and gives 1 to Person B (vein) with each step. Person B starts with 0 and accumulates coins as they walk. By the end, A has 2 coins (cool paw) and B has 8 (warm blood returning to core). Only 2 coins were "lost" to the paw instead of 10.',
      storyConnection: 'The red panda in the story walks on icy branches with bare paws, seemingly unbothered. This is not stoicism — it is engineering. The counter-current exchanger pre-cools the arterial blood before it reaches the paws, so the paw temperature is already low before contacting the ice. Less gradient = less heat loss.',
      checkQuestion: 'Why do red pandas not just send fully warm blood (38°C) to their paws?',
      checkAnswer: 'If 38°C blood reached paws in -10°C air, the 48°C gradient would cause enormous heat loss. The paw surface area is small but the gradient is extreme. Counter-current exchange pre-cools the blood to ~10°C, reducing the paw-to-air gradient from 48°C to 20°C — a 60% reduction in heat loss through the paws.',
      codeIntro: 'Model a counter-current heat exchanger in the red panda\'s leg, solving coupled differential equations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def counter_current_exchange(L=0.15, n=100, T_core=38, T_paw_env=0,
                              flow_rate=0.001, exchange_coeff=50):
    """
    Model counter-current heat exchanger in red panda leg.
    L: leg length (m)
    T_core: arterial input temperature
    T_paw_env: paw environment temperature
    """
    dx = L / n
    x = np.linspace(0, L, n)  # 0=body, L=paw

    # Arterial (warm, flowing toward paw) and venous (cool, flowing toward body)
    T_artery = np.full(n, T_core)
    T_vein = np.full(n, T_paw_env)

    # Iterative solution (relaxation)
    for _ in range(2000):
        T_a_new = T_artery.copy()
        T_v_new = T_vein.copy()

        for i in range(1, n):
            # Artery loses heat to adjacent vein
            heat_exchange = exchange_coeff * (T_artery[i] - T_vein[i]) * dx
            T_a_new[i] = T_artery[i-1] - heat_exchange / (flow_rate * 4184)

        # Vein: heat gain from artery (flowing in reverse direction)
        # Boundary: vein at paw = arterial at paw (blood turns around)
        T_v_new[n-1] = T_a_new[n-1]
        for i in range(n-2, -1, -1):
            heat_exchange = exchange_coeff * (T_a_new[i] - T_v_new[i]) * dx
            T_v_new[i] = T_vein[i+1] + heat_exchange / (flow_rate * 4184)

        T_artery = T_a_new
        T_vein = T_v_new

    return x * 100, T_artery, T_vein  # x in cm

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Standard CCHE
ax = axes[0]
ax.set_facecolor('#1f2937')
x, Ta, Tv = counter_current_exchange()
ax.plot(x, Ta, '#ef4444', linewidth=2.5, label='Artery (to paw →)')
ax.plot(x, Tv, '#3b82f6', linewidth=2.5, label='Vein (to core ←)')
ax.fill_between(x, Ta, Tv, alpha=0.15, color='#f59e0b')
ax.annotate(f'Core: {Ta[0]:.0f}°C', (0, Ta[0]+1), color='#ef4444', fontsize=9)
ax.annotate(f'Paw: {Ta[-1]:.0f}°C', (x[-1]-3, Ta[-1]-2), color='#ef4444', fontsize=9)
ax.annotate(f'Return: {Tv[0]:.0f}°C', (0, Tv[0]-2), color='#3b82f6', fontsize=9)
ax.set_xlabel('Distance from body (cm)', color='white', fontsize=11)
ax.set_ylabel('Blood Temperature (°C)', color='white', fontsize=11)
ax.set_title('Counter-Current Heat Exchanger', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Effect of exchange coefficient (CCHE efficiency)
ax = axes[1]
ax.set_facecolor('#1f2937')
efficiencies = []
coeffs = [5, 20, 50, 100, 200]
for coeff, color in zip(coeffs, ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6']):
    x, Ta, Tv = counter_current_exchange(exchange_coeff=coeff)
    paw_temp = Ta[-1]
    heat_saved = (Tv[0] - 0) / (38 - 0)  # fraction of heat recovered
    efficiencies.append(heat_saved * 100)
    ax.plot(x, Ta, color=color, linewidth=2, label=f'k={coeff}: paw={paw_temp:.0f}°C')

ax.set_xlabel('Distance from body (cm)', color='white', fontsize=11)
ax.set_title('Exchange Efficiency', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Heat recovery efficiency
ax = axes[2]
ax.set_facecolor('#1f2937')
ax.bar(range(len(coeffs)), efficiencies, color=['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'])
ax.set_xticks(range(len(coeffs)))
ax.set_xticklabels([str(c) for c in coeffs], color='white')
ax.set_xlabel('Exchange Coefficient', color='white', fontsize=11)
ax.set_ylabel('Heat Recovery (%)', color='white', fontsize=11)
ax.set_title('CCHE Efficiency', color='white', fontsize=12, fontweight='bold')
for i, eff in enumerate(efficiencies):
    ax.text(i, eff+1, f'{eff:.0f}%', ha='center', color='white', fontsize=10)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

plt.tight_layout()
plt.savefig('cche.png', dpi=100, facecolor='#1f2937')
plt.show()

x, Ta, Tv = counter_current_exchange()
print(f"Artery at core: {Ta[0]:.1f}°C → at paw: {Ta[-1]:.1f}°C")
print(f"Vein at paw: {Tv[-1]:.1f}°C → at core: {Tv[0]:.1f}°C")
print(f"Heat recovered: {(Tv[0]-Tv[-1])/(Ta[0]-Tv[-1])*100:.0f}%")
print(f"\\nWithout CCHE: paw at 38°C, gradient to -10°C = 48°C")
print(f"With CCHE: paw at {Ta[-1]:.0f}°C, gradient to 0°C = {Ta[-1]:.0f}°C")
print(f"Heat loss reduction: {(1 - Ta[-1]/38)*100:.0f}%")`,
      challenge: 'Model what happens during exercise (increased flow rate from 0.001 to 0.005 kg/s). Does the CCHE still work well, or does high flow overwhelm the exchange? Plot the comparison.',
      successHint: 'You have modeled a counter-current heat exchanger — one of nature\'s most elegant engineering solutions. The same principle is used in industrial heat recovery systems, submarine cooling, and even spacecraft thermal management. The red panda evolved it millions of years before humans reinvented it.',
    },
    {
      title: 'Energy budget simulation — a complete daily thermoregulation model',
      concept: `A complete energy budget model integrates all the pieces: metabolism, heat loss through multiple pathways, food intake, and behavioral thermoregulation.

The energy balance equation for the red panda:

**dE/dt = M_basal + M_activity - Q_conduction - Q_convection - Q_radiation + Q_solar + E_food - E_waste**

Where:
- **M_basal**: basal metabolic heat production
- **M_activity**: additional heat from movement
- **Q_conduction/convection/radiation**: heat losses
- **Q_solar**: heat gained from sunlight (basking)
- **E_food**: caloric intake from bamboo
- **E_waste**: energy lost in feces and urine

The panda\'s behavioral responses modify these terms:
- **Curling up**: reduces Q_convection and Q_radiation (less exposed area)
- **Basking**: increases Q_solar dramatically
- **Foraging intensity**: increases both E_food and M_activity
- **Shelter seeking**: reduces Q_convection (wind protection)

The model must operate on a minute-by-minute basis to capture behavioral transitions.

📚 *We will build a complete simulation class that models a day in the life of a red panda.*`,
      analogy: 'The energy budget is like a company\'s financial model. Revenue (food + solar heating) comes in at certain times (daylight, feeding bouts). Expenses (heat loss) run continuously but vary with conditions (weather, posture). The treasurer (the panda\'s brain) constantly adjusts behavior to avoid bankruptcy (hypothermia). Our simulation is the spreadsheet that tracks every transaction.',
      storyConnection: 'The story shows the red panda moving through its day — waking, stretching, climbing, eating, sleeping. Each of these activities has a precise energy cost and benefit. The simulation reveals that the panda\'s daily routine is not random but optimized: it basks when solar gain exceeds foraging benefit, and forages when bamboo calories exceed basking warmth.',
      checkQuestion: 'Why does the red panda bask in the morning sun before going to forage, even though it is hungry after a cold night?',
      checkAnswer: 'Solar basking in the early morning warms the panda\'s body with free energy (no metabolic cost). This reduces the thermoregulation burden, allowing more metabolic energy to go toward activity. If it started foraging immediately in the cold, it would spend more total energy on thermoregulation + movement than if it warmed up first. The 30-minute basking session is an energy investment with positive return.',
      codeIntro: 'Simulate a complete 24-hour energy budget for a red panda in Sikkim\'s winter forest.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class RedPandaDay:
    """Simulate 24 hours of red panda thermoregulation."""

    def __init__(self, body_mass=5.0, fur_r=0.12, sa=0.3):
        self.mass = body_mass
        self.fur_r = fur_r
        self.sa = sa
        self.bmr_watts = 70 * body_mass**0.75 * 4184 / 86400  # kcal/day → W
        self.body_temp = 38
        self.energy_reserve = 3000  # kcal of fat

    def environment(self, hour):
        """Sikkim winter day conditions."""
        temp = -5 + 10 * np.sin(2 * np.pi * (hour - 6) / 24)
        temp = max(temp, -10)
        wind = 2 + 3 * np.sin(2 * np.pi * (hour - 14) / 24)  # windier afternoon
        wind = max(wind, 0.5)
        solar = max(0, 300 * np.sin(np.pi * (hour - 6) / 12)) if 6 < hour < 18 else 0
        return temp, max(wind, 0.5), solar

    def behavior(self, hour):
        """Behavioral schedule."""
        if 0 <= hour < 5:    return 'sleeping_curled', 0.3
        elif 5 <= hour < 7:  return 'waking_basking', 0.7
        elif 7 <= hour < 12: return 'foraging', 1.5
        elif 12 <= hour < 14: return 'resting_basking', 0.5
        elif 14 <= hour < 18: return 'foraging', 1.5
        elif 18 <= hour < 20: return 'grooming', 0.8
        else:                 return 'sleeping_curled', 0.3

    def heat_loss(self, t_env, wind, behavior_name):
        gradient = self.body_temp - t_env
        # Posture factor
        area_factor = 0.5 if 'curled' in behavior_name else 0.85
        effective_sa = self.sa * area_factor

        # Conduction
        q_cond = 0.04 * 0.03 * gradient / 0.03  # belly on branch

        # Convection
        h = 10 + 5 * np.sqrt(wind)
        wind_factor = 0.3 if 'curled' in behavior_name else 1.0
        q_conv = h * effective_sa * gradient * 0.3 * wind_factor

        # Radiation
        sigma = 5.67e-8
        t_sky = t_env - 20  # clear sky is colder
        q_rad = 0.95 * sigma * effective_sa * ((self.body_temp+273)**4 - (t_sky+273)**4) * 0.5

        return q_cond + q_conv + q_rad

    def simulate(self, dt_minutes=5):
        n_steps = int(24 * 60 / dt_minutes)
        times = np.linspace(0, 24, n_steps)

        data = {k: np.zeros(n_steps) for k in
                ['temp', 'wind', 'solar', 'heat_loss', 'metabolism',
                 'solar_gain', 'food_gain', 'net_energy', 'reserve',
                 'activity_cost']}
        behaviors = []

        for i, hour in enumerate(times):
            t_env, wind, solar = self.environment(hour)
            beh_name, activity_mult = self.behavior(hour)
            behaviors.append(beh_name)

            # Heat loss
            ql = self.heat_loss(t_env, wind, beh_name)

            # Metabolism (must at least match heat loss)
            met = max(self.bmr_watts * activity_mult, ql * 0.8)

            # Solar gain (basking)
            solar_absorbed = 0
            if 'basking' in beh_name and solar > 0:
                solar_absorbed = solar * 0.3 * 0.6  # 30% of body absorbs, 60% efficiency

            # Food (only while foraging)
            food_rate = 0
            if 'foraging' in beh_name:
                food_rate = 15  # Watts equivalent (~13 kcal/hr)

            # Activity cost
            activity_cost = self.bmr_watts * max(0, activity_mult - 1)

            net = met + solar_absorbed + food_rate - ql - activity_cost
            self.energy_reserve += net * dt_minutes * 60 / 4184  # to kcal

            data['temp'][i] = t_env
            data['wind'][i] = wind
            data['solar'][i] = solar
            data['heat_loss'][i] = ql
            data['metabolism'][i] = met
            data['solar_gain'][i] = solar_absorbed
            data['food_gain'][i] = food_rate
            data['net_energy'][i] = net
            data['reserve'][i] = self.energy_reserve
            data['activity_cost'][i] = activity_cost

        return times, data, behaviors

panda = RedPandaDay()
times, data, behaviors = panda.simulate()

fig, axes = plt.subplots(2, 2, figsize=(13, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('A Day in the Life: Red Panda Energy Budget (Winter)',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Environment
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
ax.plot(times, data['temp'], '#3b82f6', linewidth=2, label='Temperature (°C)')
ax2 = ax.twinx()
ax2.plot(times, data['solar'], '#f59e0b', linewidth=2, label='Solar (W/m²)')
ax.set_ylabel('Temperature (°C)', color='#3b82f6')
ax2.set_ylabel('Solar Radiation', color='#f59e0b')
ax.set_title('Environment', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax2.tick_params(colors='#f59e0b')
ax.grid(alpha=0.15)

# Panel 2: Energy flows
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
ax.plot(times, data['heat_loss'], '#ef4444', linewidth=1.5, label='Heat loss')
ax.plot(times, data['metabolism'], '#22c55e', linewidth=1.5, label='Metabolism')
ax.plot(times, data['food_gain'], '#f59e0b', linewidth=1.5, label='Food intake')
ax.plot(times, data['solar_gain'], '#fbbf24', linewidth=1.5, label='Solar gain')
ax.set_ylabel('Power (W)', color='white')
ax.set_title('Energy Flows', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Net energy
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
colors = ['#22c55e' if n >= 0 else '#ef4444' for n in data['net_energy']]
ax.scatter(times, data['net_energy'], c=colors, s=5, alpha=0.7)
ax.axhline(y=0, color='white', linewidth=0.5)
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Net Energy (W)', color='white')
ax.set_title('Energy Balance (green=surplus, red=deficit)', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Energy reserve
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
ax.plot(times, data['reserve'], '#f59e0b', linewidth=2.5)
ax.fill_between(times, data['reserve'], data['reserve'].min(), alpha=0.2, color='#f59e0b')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Fat Reserve (kcal)', color='white')
ax.set_title('Energy Reserve Over Day', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

for ax in axes.flat:
    ax.set_xticks([0, 4, 8, 12, 16, 20, 24])

plt.tight_layout()
plt.savefig('daily_budget.png', dpi=100, facecolor='#1f2937')
plt.show()

reserve_change = data['reserve'][-1] - data['reserve'][0]
print(f"Starting reserve: {data['reserve'][0]:.0f} kcal")
print(f"Ending reserve:   {data['reserve'][-1]:.0f} kcal")
print(f"Daily change:     {reserve_change:+.0f} kcal")
print(f"\\nForaging hours: ~10h  Sleeping: ~9h  Basking: ~4h")`,
      challenge: 'Run the simulation for a summer day (base temp +5°C, more solar) and compare the energy reserve trajectory. Does the panda gain or lose weight in summer?',
      successHint: 'You have built a complete bioenergetic simulation — the kind of model used in conservation biology to assess habitat viability. The day shows the panda\'s tight energy margins: most of its waking hours go to eating, and even moderate disruptions can tip the balance negative.',
    },
    {
      title: 'Torpor and metabolic suppression — the emergency shutdown',
      concept: `When energy reserves are critically low, some mammals enter **torpor** — a controlled reduction in body temperature and metabolic rate to conserve energy.

Unlike true hibernation (months-long, deep torpor), the red panda uses **daily torpor**:
- Body temperature drops from 38°C to 25-30°C (much less than hibernators who go to 5°C)
- Metabolic rate drops to 50-70% of BMR
- Heart rate drops from ~80 to ~40 bpm
- Duration: a few hours, typically coldest part of the night
- Arousal: spontaneous warming in early morning (costs energy but less than staying warm all night)

Energy savings from torpor:
- Reduced temperature gradient (30°C body - (-10°C) = 40°C vs. 48°C) → 17% less heat loss
- Reduced metabolic rate → 30-50% less heat generation needed
- Combined: saves 200-400 kcal per night in deep winter

The decision to enter torpor is governed by:
- Fat reserves (below threshold → torpor more likely)
- Air temperature (colder → more beneficial)
- Food availability (scarce food → torpor is the better option)

📚 *We will model torpor as a coupled system: temperature drops, metabolic rate follows, heat loss adjusts.*`,
      analogy: 'Torpor is like putting your phone in low-power mode. The screen dims (body cools), background apps shut down (reduced metabolism), and only essential functions continue (heartbeat, breathing). You lose some performance but extend battery life dramatically. The panda uses this overnight "power saving mode" to stretch its energy reserves through the coldest hours.',
      storyConnection: 'When the story describes the red panda curled and motionless through a Sikkim winter night, it may actually be in torpor — not just sleeping but in a reduced metabolic state. This is not weakness but wisdom: the panda has evolved a controlled shutdown to survive nights that would kill a less adapted animal.',
      checkQuestion: 'Why does the red panda not enter deep hibernation like a bear (body temp near 0°C for months)?',
      checkAnswer: 'Three reasons: (1) The red panda\'s small size means it cannot store enough fat for months of hibernation. Bears have 100× more fat reserves. (2) Bamboo is available year-round in Sikkim — scarce in winter but not absent. Daily foraging is still possible. (3) Deep hibernation requires time to arouse (hours for a bear). The red panda needs to be able to wake quickly to escape predators (snow leopards, martens). Daily torpor takes minutes to reverse.',
      codeIntro: 'Model the torpor cycle: controlled cooling, metabolic suppression, and arousal warming.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class TorporModel:
    """Model red panda daily torpor cycle."""

    def __init__(self):
        self.mass = 5.0
        self.bmr = 9.7  # Watts
        self.t_body_normal = 38
        self.t_body_torpor = 28
        self.specific_heat = 3500  # J/(kg·°C) body tissue

    def simulate_night(self, t_env=-10, use_torpor=True, duration_hours=12):
        dt = 1  # minutes
        n = int(duration_hours * 60 / dt)
        times = np.linspace(0, duration_hours, n)

        t_body = np.zeros(n)
        met_rate = np.zeros(n)
        heat_loss = np.zeros(n)
        energy_spent = np.zeros(n)
        state = []

        t_body[0] = self.t_body_normal
        cumulative_energy = 0

        for i in range(1, n):
            hour = times[i]

            # Torpor schedule
            if use_torpor and 2 < hour < 8:
                # Entering/in torpor
                target = self.t_body_torpor
                met_factor = 0.5  # 50% of BMR
                current_state = 'torpor'
            elif use_torpor and 8 <= hour < 9:
                # Arousal (rewarming)
                target = self.t_body_normal
                met_factor = 2.0  # elevated metabolism for rewarming
                current_state = 'arousal'
            else:
                target = self.t_body_normal
                met_factor = 1.0
                current_state = 'normal'

            state.append(current_state)

            # Body temperature regulation
            if t_body[i-1] > target:
                cooling_rate = 0.03  # °C/min (passive cooling)
                t_body[i] = t_body[i-1] - cooling_rate * dt
                t_body[i] = max(t_body[i], target)
            elif t_body[i-1] < target:
                warming_rate = 0.05  # °C/min (active warming costs energy)
                t_body[i] = t_body[i-1] + warming_rate * dt
                t_body[i] = min(t_body[i], target)
            else:
                t_body[i] = target

            # Metabolic rate
            met_rate[i] = self.bmr * met_factor

            # Heat loss
            gradient = t_body[i] - t_env
            insulation = 0.12 * 0.3  # fur_r × area
            heat_loss[i] = gradient / insulation * 0.5  # curled posture

            # Energy accounting (Watts × minutes → kcal)
            energy_cost = (met_rate[i] + max(0, heat_loss[i] - met_rate[i])) * dt * 60 / 4184
            cumulative_energy += energy_cost
            energy_spent[i] = cumulative_energy

        return times, t_body, met_rate, heat_loss, energy_spent, state

model = TorporModel()

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Daily Torpor: Red Panda Night Energy Conservation',
             color='white', fontsize=14, fontweight='bold')

# Compare torpor vs no torpor
t1, tb1, mr1, hl1, e1, s1 = model.simulate_night(use_torpor=True)
t2, tb2, mr2, hl2, e2, s2 = model.simulate_night(use_torpor=False)

# Body temperature
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
ax.plot(t1, tb1, '#3b82f6', linewidth=2.5, label='With torpor')
ax.plot(t2, tb2, '#ef4444', linewidth=2, linestyle='--', label='Without torpor')
ax.axhline(y=28, color='#3b82f6', linestyle=':', alpha=0.5)
ax.set_ylabel('Body Temperature (°C)', color='white')
ax.set_title('Core Temperature', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Metabolic rate
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
ax.plot(t1, mr1, '#3b82f6', linewidth=2, label='Torpor')
ax.plot(t2, mr2, '#ef4444', linewidth=2, linestyle='--', label='No torpor')
ax.set_ylabel('Metabolic Rate (W)', color='white')
ax.set_title('Metabolic Rate', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Heat loss
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
ax.plot(t1, hl1, '#3b82f6', linewidth=2, label='Torpor')
ax.plot(t2, hl2, '#ef4444', linewidth=2, linestyle='--', label='No torpor')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Heat Loss (W)', color='white')
ax.set_title('Heat Loss', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Cumulative energy
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
ax.plot(t1, e1, '#3b82f6', linewidth=2.5, label='With torpor')
ax.plot(t2, e2, '#ef4444', linewidth=2.5, label='Without torpor')
ax.fill_between(t1, e1, e2, alpha=0.2, color='#22c55e')
savings = e2[-1] - e1[-1]
ax.annotate(f'Savings: {savings:.0f} kcal', (9, (e1[-1]+e2[-1])/2),
           color='#22c55e', fontsize=12, fontweight='bold')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Cumulative Energy (kcal)', color='white')
ax.set_title('Total Energy Cost', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('torpor.png', dpi=100, facecolor='#1f2937')
plt.show()

print(f"=== 12-Hour Night Energy Cost at -10°C ===")
print(f"Without torpor: {e2[-1]:.0f} kcal")
print(f"With torpor:    {e1[-1]:.0f} kcal")
print(f"Savings:        {savings:.0f} kcal ({savings/e2[-1]*100:.0f}%)")
print(f"\\nThat's {savings:.0f} kcal = ~{savings/0.6:.0f}g of bamboo saved per night!")
print(f"Over 90 winter nights: ~{savings*90/1000:.0f} kg less bamboo needed!")`,
      challenge: 'Model deeper torpor (target 20°C instead of 28°C). How much more energy is saved? Is there a point of diminishing returns — why not go even lower?',
      successHint: 'You have modeled a complex thermoregulatory behavior with coupled temperature and metabolic dynamics. Torpor is a remarkable survival adaptation — it transforms the red panda from a species that barely survives winter into one that can endure it. The energy savings are not trivial: they represent hundreds of grams of bamboo that do not need to be found in scarce winter conditions.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced heat transfer modeling with differential equations</span>
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
