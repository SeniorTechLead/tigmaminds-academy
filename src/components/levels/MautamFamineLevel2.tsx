import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MautamFamineLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plotting the logistic growth curve',
      concept: `The **logistic growth curve** has a characteristic S-shape (sigmoid). Plotting it reveals three distinct phases:

1. **Lag phase**: population is small, growth is slow (few individuals reproducing)
2. **Exponential phase**: population grows rapidly (abundant resources)
3. **Plateau phase**: population approaches K, growth slows to zero

The inflection point (steepest slope) occurs at P = K/2. This is where the population is growing fastest.

The logistic equation in continuous form:
\`P(t) = K / (1 + ((K - P₀)/P₀) × e^(-rt))\`

📚 *matplotlib's \`plt.axhline()\` draws horizontal reference lines. We use these to mark carrying capacity and the inflection point on our growth curves.*`,
      analogy: 'The S-curve is like filling a bathtub. At first, the water level rises slowly (the tub is empty, water spreads across the large bottom). As the tub narrows toward the top, the level rises faster. Near the rim, you slow the tap and the rise nearly stops. The same water flow produces different rise rates depending on how full the tub is.',
      storyConnection: 'During the Mautam, the rat population follows the S-curve — but with a twist. The carrying capacity itself changes over time as bamboo seeds become available and then run out. Plotting this reveals why the population overshoots: it is chasing a moving target.',
      checkQuestion: 'Why is the maximum growth rate at P = K/2 and not at some other point?',
      checkAnswer: 'The growth rate is r × P × (1 - P/K). This is a quadratic in P, maximized when its derivative equals zero: r × (1 - 2P/K) = 0, giving P = K/2. Below this, there are few individuals to reproduce. Above this, resource competition dominates. The midpoint balances these two effects.',
      codeIntro: 'Plot the classic logistic growth curve and annotate its key features.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

K = 50000  # carrying capacity
P0 = 100   # initial population
r = 0.4    # growth rate

t = np.linspace(0, 40, 500)
P = K / (1 + ((K - P0) / P0) * np.exp(-r * t))

# Growth rate at each point
dPdt = r * P * (1 - P / K)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#111827')

# Population curve
ax1.set_facecolor('#1f2937')
ax1.plot(t, P / 1000, color='#34d399', linewidth=2.5)
ax1.axhline(K / 1000, color='#f87171', linestyle='--', linewidth=1.5, label=f'K = {K//1000}k')
ax1.axhline(K / 2000, color='#fbbf24', linestyle=':', linewidth=1.5, label=f'K/2 = {K//2000}k')

# Mark phases
ax1.axvspan(0, 8, alpha=0.1, color='#60a5fa', label='Lag phase')
ax1.axvspan(8, 22, alpha=0.1, color='#34d399', label='Exponential phase')
ax1.axvspan(22, 40, alpha=0.1, color='#fbbf24', label='Plateau phase')

ax1.set_ylabel('Population (thousands)', color='lightgray', fontsize=11)
ax1.set_title('Logistic Growth — Rat Population During Mautam', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Growth rate curve
ax2.set_facecolor('#1f2937')
ax2.plot(t, dPdt, color='#fbbf24', linewidth=2.5)
ax2.axvline(t[np.argmax(dPdt)], color='white', linestyle=':', alpha=0.5)
ax2.annotate('Maximum growth rate\
(P = K/2)', xy=(t[np.argmax(dPdt)], max(dPdt)),
             xytext=(t[np.argmax(dPdt)] + 5, max(dPdt) * 0.8),
             color='white', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='white'))
ax2.set_xlabel('Time (months)', color='lightgray', fontsize=11)
ax2.set_ylabel('Growth rate (rats/month)', color='lightgray', fontsize=11)
ax2.set_title('Population Growth Rate Over Time', color='white', fontsize=13, fontweight='bold')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/mautam_logistic.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

inflection_t = t[np.argmax(dPdt)]
print(f"Inflection point at t = {inflection_t:.1f} months")
print(f"Maximum growth rate: {max(dPdt):.0f} rats/month")
print(f"Time to reach 90% of K: {t[np.argmin(np.abs(P - 0.9*K))]:.1f} months")`,
      challenge: 'Plot three curves with different r values (0.2, 0.4, 0.8) on the same graph. How does the growth rate affect the time to reach carrying capacity? All three reach the same K — only the speed differs.',
      successHint: 'You plotted the classic logistic growth curve — one of the most important models in biology. The S-shape appears everywhere: bacterial growth, technology adoption, market saturation, and epidemic curves.',
    },
    {
      title: 'Predator-prey dynamics — the Lotka-Volterra model',
      concept: `Rats do not exist in isolation. They interact with **predators** (snakes, owls, cats) in a feedback loop described by the **Lotka-Volterra equations**:

Prey (rats): \`dR/dt = αR - βRF\`
Predators (snakes): \`dF/dt = δRF - γF\`

Where:
- α = rat birth rate
- β = predation rate (how effectively predators catch rats)
- δ = predator reproduction efficiency (how much food a rat provides)
- γ = predator death rate

This creates **oscillating populations**: rats increase → predators increase → rats decrease → predators decrease → cycle repeats.

📚 *We use numpy arrays for both populations and iterate with a simple Euler method. Plotting both on the same axes reveals the predator-prey cycle.*`,
      analogy: 'Predator-prey dynamics are like a seesaw. When rats are abundant (seesaw tips one way), predators thrive and multiply. But as predators become numerous, they eat too many rats, and the seesaw tips the other way. Then predators starve, their numbers drop, and rats recover. The seesaw never stops rocking.',
      storyConnection: 'During the Mautam, predator populations also surge — snakes, raptors, and wild cats feast on the rat bounty. But predator reproduction is slower than rat reproduction, so the predators cannot keep up with the rat boom. This time lag between prey and predator response is what allows the rat population to reach plague levels.',
      checkQuestion: 'In the Lotka-Volterra model, do the predator and prey populations peak at the same time?',
      checkAnswer: 'No. The prey peaks first, then the predator peaks after a time lag (because predators need time to reproduce after the food increase). The prey population is already declining when predators reach their peak. This phase lag is a fundamental property of predator-prey systems.',
      codeIntro: 'Simulate and plot the Lotka-Volterra predator-prey cycle for rats and their predators.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Lotka-Volterra parameters
alpha = 0.4    # rat birth rate
beta = 0.005   # predation rate
delta = 0.001  # predator efficiency
gamma = 0.3    # predator death rate

dt = 0.01
t_max = 60
steps = int(t_max / dt)
t = np.linspace(0, t_max, steps)

R = np.zeros(steps)  # rats
F = np.zeros(steps)  # predators (foxes/snakes)
R[0] = 500
F[0] = 20

for i in range(steps - 1):
    dR = (alpha * R[i] - beta * R[i] * F[i]) * dt
    dF = (delta * R[i] * F[i] - gamma * F[i]) * dt
    R[i+1] = max(R[i] + dR, 1)
    F[i+1] = max(F[i] + dF, 1)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#111827')

# Time series
ax1.set_facecolor('#1f2937')
ax1.plot(t, R, color='#34d399', linewidth=2, label='Rats (prey)')
ax1_twin = ax1.twinx()
ax1_twin.plot(t, F, color='#f87171', linewidth=2, label='Predators')
ax1.set_xlabel('Time (months)', color='lightgray')
ax1.set_ylabel('Rat population', color='#34d399', fontsize=11)
ax1_twin.set_ylabel('Predator population', color='#f87171', fontsize=11)
ax1.set_title('Predator-Prey Oscillations (Lotka-Volterra)', color='white', fontsize=13, fontweight='bold')
ax1.tick_params(colors='lightgray')
ax1_twin.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')
for s in ax1_twin.spines.values(): s.set_color('#374151')

lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax1_twin.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')

# Phase portrait
ax2.set_facecolor('#1f2937')
ax2.plot(R, F, color='#a78bfa', linewidth=1, alpha=0.7)
ax2.plot(R[0], F[0], 'o', color='#34d399', markersize=8, label='Start')
ax2.set_xlabel('Rat population', color='lightgray', fontsize=11)
ax2.set_ylabel('Predator population', color='lightgray', fontsize=11)
ax2.set_title('Phase Portrait — Population Cycles', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/mautam_lotka.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print(f"Rat population range: {R.min():.0f} to {R.max():.0f}")
print(f"Predator population range: {F.min():.0f} to {F.max():.0f}")
print(f"Cycle period: ~{t_max / (np.diff(np.where(np.diff(np.sign(np.diff(R))))[0]).mean() * dt / 2):.1f} months")`,
      challenge: 'Add a "Mautam pulse" — at month 20, multiply the rat birth rate by 5 for 6 months. How does the predator-prey cycle respond? Does it return to the original oscillation or shift to a new pattern?',
      successHint: 'You simulated the Lotka-Volterra equations — the foundation of mathematical ecology. The phase portrait reveals that populations trace closed loops: a beautiful mathematical structure underlying the messy reality of nature.',
    },
    {
      title: 'Food web visualization — who eats whom',
      concept: `A **food web** shows all the feeding relationships in an ecosystem. During the Mautam, the food web changes dramatically:

Normal food web:
- Bamboo → insects → birds/lizards → raptors
- Forest plants → deer → leopards
- Grain crops → small rodents → snakes/owls

Mautam food web:
- Bamboo seeds → RATS (massive population) → snakes/owls/cats
- Rats → grain crops (rats become the dominant consumer)
- Everything → rats (rats eat anything when seeds run out)

Each species has a **trophic level**:
- Level 1: Producers (plants, bamboo)
- Level 2: Primary consumers (herbivores, seed-eaters)
- Level 3: Secondary consumers (predators)
- Level 4: Tertiary consumers (top predators)

📚 *We use matplotlib bar charts and annotations to build food web diagrams. \`plt.barh()\` creates horizontal bars, good for showing relative biomass at each trophic level.*`,
      analogy: 'A food web is like an organizational chart, but for eating. The CEO (top predator) depends on middle managers (secondary consumers), who depend on workers (primary consumers), who depend on raw materials (producers). If the supply chain is disrupted at any level, everyone above feels the impact.',
      storyConnection: 'The Mautam disrupts the entire Mizoram food web. The sudden bamboo seed availability is like dumping free food into an ecosystem — it reshuffles every feeding relationship. Rats, normally a minor player, become the dominant species, outcompeting other seed-eaters and overwhelming predators.',
      checkQuestion: 'Why do rats specifically benefit from the bamboo flowering more than other seed-eating species?',
      checkAnswer: 'Rats have three advantages: (1) extremely fast reproduction (short gestation, large litters), (2) omnivorous diet (they can eat anything when seeds run out), and (3) adaptability to human environments (they can transition from forest to farm fields). Other seed-eaters like birds reproduce more slowly and cannot exploit the resource pulse as effectively.',
      codeIntro: 'Visualize the Mizoram food web before, during, and after the Mautam.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

phases = ['Before Mautam', 'During Mautam', 'After Mautam (Famine)']

# Biomass at each trophic level (relative units)
data = {
    'Before Mautam': {
        'Bamboo/Plants': 100, 'Seeds': 5, 'Insects': 30,
        'Rats': 10, 'Birds': 15, 'Snakes': 8,
        'Raptors': 3, 'Grain crops': 50
    },
    'During Mautam': {
        'Bamboo/Plants': 20, 'Seeds': 200, 'Insects': 40,
        'Rats': 150, 'Birds': 20, 'Snakes': 25,
        'Raptors': 8, 'Grain crops': 50
    },
    'After Mautam (Famine)': {
        'Bamboo/Plants': 10, 'Seeds': 2, 'Insects': 15,
        'Rats': 100, 'Birds': 10, 'Snakes': 30,
        'Raptors': 12, 'Grain crops': 10
    }
}

colors_map = {
    'Bamboo/Plants': '#22c55e', 'Seeds': '#86efac', 'Insects': '#a3e635',
    'Rats': '#f87171', 'Birds': '#60a5fa', 'Snakes': '#c084fc',
    'Raptors': '#fbbf24', 'Grain crops': '#34d399'
}

for ax, phase in zip(axes, phases):
    ax.set_facecolor('#1f2937')
    d = data[phase]
    species = list(d.keys())
    values = list(d.values())
    colors = [colors_map[s] for s in species]

    bars = ax.barh(species, values, color=colors, edgecolor='none', height=0.7)
    ax.set_xlabel('Relative biomass', color='lightgray', fontsize=9)
    ax.set_title(phase, color='white', fontsize=12, fontweight='bold')
    ax.tick_params(colors='lightgray', labelsize=8)
    ax.set_xlim(0, 220)
    for s in ax.spines.values(): s.set_color('#374151')

    # Highlight rats
    rat_idx = species.index('Rats')
    bars[rat_idx].set_edgecolor('white')
    bars[rat_idx].set_linewidth(2)

plt.suptitle('Mizoram Food Web Changes During Mautam Cycle',
             color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/mautam_foodweb.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Key changes during Mautam:")
print(f"  Rat biomass: {data['Before Mautam']['Rats']} → {data['During Mautam']['Rats']} → {data['After Mautam (Famine)']['Rats']}")
print(f"  Grain crops: {data['Before Mautam']['Grain crops']} → {data['During Mautam']['Grain crops']} → {data['After Mautam (Famine)']['Grain crops']}")
print(f"  Seed supply: {data['Before Mautam']['Seeds']} → {data['During Mautam']['Seeds']} → {data['After Mautam (Famine)']['Seeds']}")
print("\
The famine occurs because rats (biomass 100) turn to grain crops (biomass 10)")
print("when bamboo seeds (biomass 2) are exhausted.")`,
      challenge: 'Add a "predator introduction" scenario where snake populations are artificially doubled before the Mautam. Does this reduce the rat peak enough to prevent crop destruction? Plot the comparison.',
      successHint: 'You visualized food web dynamics across the Mautam cycle. This comparative visualization reveals how a single ecological event (bamboo flowering) cascades through an entire ecosystem — a concept called trophic cascade in ecology.',
    },
    {
      title: 'Spatial spread — mapping the rat invasion',
      concept: `Rat populations do not just grow — they **spread spatially**. The Mautam effect radiates outward from bamboo forests into agricultural areas. This follows a **diffusion** model:

\`∂P/∂t = D × ∂²P/∂x² + r × P × (1 - P/K)\`

This is the **Fisher-KPP equation**: logistic growth plus spatial diffusion. It produces **traveling waves** of invasion.

Key parameters:
- **D** = diffusion coefficient (how fast rats spread)
- **r** = growth rate
- Wave speed: \`v = 2√(Dr)\`

The invasion front moves at a constant speed once established, regardless of the population behind it. This speed determines how long communities have to prepare.

📚 *We discretize space into a grid and use finite differences to approximate the spatial derivative. This is the same technique used in weather forecasting and fluid dynamics.*`,
      analogy: 'The rat invasion spreads like a drop of ink in water. The ink (rats) starts concentrated in one area (bamboo forest) and gradually diffuses outward. But unlike simple diffusion, rats also reproduce — so the ink "generates more ink" as it spreads. This makes the invasion front move faster than pure diffusion.',
      storyConnection: 'Mizo villages closest to dense bamboo forests are hit first by the rat plague. The invasion then spreads to more distant agricultural areas over weeks. Understanding this spatial spread helps communities plan: villages farther from bamboo forest have more time to prepare defenses.',
      checkQuestion: 'If the diffusion coefficient D = 0.5 km²/month and the growth rate r = 0.3/month, what is the invasion wave speed?',
      checkAnswer: 'Wave speed = 2√(Dr) = 2√(0.5 × 0.3) = 2√(0.15) = 2 × 0.387 = 0.775 km/month. The rat front advances at about 0.8 km per month. A village 5 km from the bamboo forest has about 6.5 months to prepare.',
      codeIntro: 'Simulate the spatial spread of the rat invasion as a traveling wave using the Fisher-KPP equation.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Spatial grid
L = 20.0      # km (total distance)
nx = 200
dx = L / nx
x = np.linspace(0, L, nx)

# Time parameters
dt = 0.01
t_max = 20.0
steps = int(t_max / dt)

# Parameters
D = 0.3    # diffusion coefficient (km²/month)
r = 0.25   # growth rate
K = 1.0    # normalized carrying capacity

# Initial condition: rats concentrated near bamboo forest (x=0)
P = np.zeros(nx)
P[:10] = 0.9  # high density near forest

# Store snapshots
snapshots = {}
snap_times = [0, 3, 6, 10, 15, 20]

for step in range(steps):
    t = step * dt

    if any(abs(t - st) < dt/2 for st in snap_times):
        snapshots[f't={t:.0f}'] = P.copy()

    # Finite difference for diffusion + logistic growth
    P_new = P.copy()
    for i in range(1, nx - 1):
        diffusion = D * (P[i+1] - 2*P[i] + P[i-1]) / dx**2
        growth = r * P[i] * (1 - P[i] / K)
        P_new[i] = P[i] + (diffusion + growth) * dt

    # Boundary conditions
    P_new[0] = K  # bamboo forest stays at capacity
    P_new[-1] = P_new[-2]  # no-flux boundary
    P = np.clip(P_new, 0, K * 1.1)

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#111827')
ax.set_facecolor('#1f2937')

colors = ['#34d399', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6', '#f87171']
for (label, snap), color in zip(snapshots.items(), colors):
    ax.plot(x, snap, color=color, linewidth=2.5, label=label + ' months')
    # Mark invasion front (where P first exceeds 0.1)
    front_idx = np.where(snap > 0.1)[0]
    if len(front_idx) > 0:
        front_x = x[front_idx[-1]]
        ax.plot(front_x, 0.1, 'v', color=color, markersize=8)

ax.set_xlabel('Distance from bamboo forest (km)', color='lightgray', fontsize=12)
ax.set_ylabel('Rat density (normalized)', color='lightgray', fontsize=12)
ax.set_title('Rat Invasion Wave — Spatial Spread from Bamboo Forest',
             color='white', fontsize=14, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray',
          fontsize=10, loc='upper right')
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/mautam_spatial.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

# Calculate wave speed
wave_speed = 2 * np.sqrt(D * r)
print(f"Theoretical wave speed: {wave_speed:.2f} km/month")
print(f"Time for front to reach 10 km: ~{10/wave_speed:.0f} months")
print(f"Time for front to reach 20 km: ~{20/wave_speed:.0f} months")
print(f"\
Village warning times:")
for dist in [2, 5, 10, 15]:
    print(f"  {dist} km from forest: ~{dist/wave_speed:.0f} months warning")`,
      challenge: 'Add a "barrier" at x = 10 km (like a river or cleared zone) that reduces the diffusion coefficient by 90%. Does the barrier slow the invasion enough to protect villages behind it? Plot the result.',
      successHint: 'You simulated a reaction-diffusion equation — one of the most powerful models in mathematical biology. The same equation describes tumor growth, species invasion, chemical reactions, and even the spread of fire. The traveling wave solution predicts invasion speed from just two parameters.',
    },
    {
      title: 'Intervention strategies — comparing control methods',
      concept: `How can communities reduce the impact of the Mautam? Several strategies exist, each with different effectiveness and cost:

1. **Trapping**: removes individuals directly. Reduces P by a constant amount per effort.
2. **Poisoning**: kills rats but also harms predators. Reduces P but also reduces predator population.
3. **Predator introduction**: brings in cats, owls. Increases predation rate β.
4. **Crop protection**: fencing, storage. Does not reduce rats but protects food supply.
5. **Early harvest**: harvest crops before the rat wave arrives. Timing-dependent.

Each strategy can be modeled as a modification to the population equations. We want to find the **optimal combination** that minimizes crop loss at minimum cost.

📚 *We compare strategies by running the same simulation with different parameters and plotting all outcomes together. matplotlib's subplot grid makes side-by-side comparison easy.*`,
      analogy: 'Choosing intervention strategies is like defending a castle. You can build walls (crop protection), hire archers (trapping), use catapults (poisoning — effective but damages your own fields), recruit allies (predators), or move your treasure out early (early harvest). The best defense combines multiple approaches.',
      storyConnection: 'The Mizoram government and communities have tried various strategies across Mautam events. The 2007 Mautam saw coordinated rat hunts, grain stockpiling, and military-supplied food aid. Comparing the 1959 and 2007 outcomes shows that preparedness makes a dramatic difference — but modeling can help optimize further.',
      checkQuestion: 'Why might poisoning be counterproductive in the long run?',
      checkAnswer: 'Poison kills rats but also kills their predators (snakes eat poisoned rats, secondary poisoning). With fewer predators, the next rat recovery is faster and peaks higher. This is called "trophic rebound" — removing top predators releases prey populations from control. The cure can be worse than the disease.',
      codeIntro: 'Simulate and compare five Mautam intervention strategies.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

months = 36

def simulate(strategy_name, trap_rate=0, poison_rate=0, pred_boost=1.0,
             crop_protect=0, early_harvest_month=None):
    rats = 5000.0
    preds = 50.0
    crops = 100.0
    rat_hist, crop_hist = [rats], [crops]

    for m in range(months):
        # Mautam food pulse
        food = 10.0 if 6 <= m <= 18 else 1.0

        # Rat dynamics
        birth = 0.15 * food * rats
        pred_kill = 0.003 * preds * rats * pred_boost
        trap_kill = trap_rate * rats
        poison_kill = poison_rate * rats
        rats = max(rats + birth - pred_kill - trap_kill - poison_kill, 50)

        # Predator dynamics
        pred_birth = 0.0005 * rats * preds
        pred_death = 0.2 * preds
        poison_pred_loss = poison_rate * 0.5 * preds  # secondary poisoning
        preds = max(preds + pred_birth - pred_death - poison_pred_loss, 5)

        # Crop damage
        if m >= 18:  # post-Mautam crop destruction
            damage = 0.00005 * rats * (1 - crop_protect)
            crops = max(crops - damage, 0)

        # Early harvest
        if early_harvest_month and m == early_harvest_month:
            crops = max(crops - 20, 0)  # harvest costs some yield

        rat_hist.append(rats)
        crop_hist.append(crops)

    return rat_hist, crop_hist

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

strategies = [
    ('No intervention', {}),
    ('Trapping (5%/mo)', {'trap_rate': 0.05}),
    ('Poisoning (10%/mo)', {'poison_rate': 0.1}),
    ('Predator boost (2x)', {'pred_boost': 2.0}),
    ('Crop protection (70%)', {'crop_protect': 0.7}),
]

colors = ['#6b7280', '#34d399', '#f87171', '#a78bfa', '#fbbf24']
t = range(months + 1)

for (name, params), color in zip(strategies, colors):
    rats, crops = simulate(name, **params)
    ax1.plot(t, [r/1000 for r in rats], color=color, linewidth=2, label=name)
    ax2.plot(t, crops, color=color, linewidth=2, label=name)

for ax in [ax1, ax2]:
    ax.set_facecolor('#1f2937')
    ax.set_xlabel('Month', color='lightgray')
    ax.tick_params(colors='lightgray')
    ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=8)
    for s in ax.spines.values(): s.set_color('#374151')
    ax.axvspan(6, 18, alpha=0.1, color='#fbbf24')

ax1.set_ylabel('Rat population (thousands)', color='lightgray')
ax1.set_title('Rat Population Under Different Strategies', color='white', fontsize=12, fontweight='bold')
ax2.set_ylabel('Crop survival (%)', color='lightgray')
ax2.set_title('Crop Survival Under Different Strategies', color='white', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.savefig('/tmp/mautam_interventions.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Final crop survival by strategy:")
for (name, params), color in zip(strategies, colors):
    _, crops = simulate(name, **params)
    print(f"  {name:<30}: {crops[-1]:.1f}%")`,
      challenge: 'Create a "combined" strategy that uses trapping + crop protection + predator boost. Is the combination better than the sum of individual strategies? This is called synergy — when combined effects exceed the sum of parts.',
      successHint: 'You compared intervention strategies quantitatively using simulation. This is how real policy decisions should be made: model the options, compare outcomes, and choose the combination that best balances effectiveness and cost.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Population Dynamics</span>
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
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
