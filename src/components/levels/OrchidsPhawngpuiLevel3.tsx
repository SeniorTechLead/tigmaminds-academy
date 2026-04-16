import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function OrchidsPhawngpuiLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Evolutionary game theory — honest vs deceptive signaling',
      concept: `Orchid pollination is an **evolutionary game** between honest (reward-giving) and deceptive (no-reward) strategies.

**Honest flowers**: produce nectar (cost C), attracting reliable pollinators (benefit B)
**Deceptive flowers**: skip nectar (save C), but get fewer visits as pollinators learn

This is a **frequency-dependent game**:
- When deceptive orchids are rare, pollinators have not learned to avoid them → high fitness
- When deceptive orchids are common, pollinators avoid all similar flowers → low fitness

The **evolutionarily stable strategy (ESS)** is the mix of honest:deceptive that cannot be invaded by either pure strategy.

The **replicator equation** models this:
\`dp/dt = p × (1-p) × (fitness_honest - fitness_deceptive)\`

📚 *Game theory in biology uses payoff matrices and replicator dynamics. We simulate the frequency of strategies over many generations.*`,
      analogy: 'The honest vs deceptive game is like honest vs fraudulent merchants in a market. When frauds are rare, customers trust everyone (frauds profit). When frauds are common, customers become suspicious (everyone suffers). The market reaches an equilibrium where fraud exists but does not dominate — exactly like deceptive orchids in nature.',
      storyConnection: 'About one-third of orchid species worldwide are deceptive — they offer no nectar reward. On Phawngpui, both honest and deceptive orchids coexist, often in the same habitat. Game theory explains this coexistence: deception is profitable only when it is rare enough that pollinators have not learned to avoid it.',
      checkQuestion: 'Why do deceptive orchids not go extinct if pollinators learn to avoid them?',
      checkAnswer: 'Frequency-dependent selection. As deceptive orchids become rare, the pollinators encounter them less and "forget" to avoid them (or new naive pollinators emerge). This relaxation of avoidance allows the deceptive strategy to recover. The population oscillates around the ESS — deception never completely wins or loses.',
      codeIntro: 'Simulate the evolutionary game between honest and deceptive orchids.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

np.random.seed(42)

def fitness(p_honest, nectar_cost=0.3, visit_benefit=1.0, learning_rate=2.0):
    """Calculate fitness for honest and deceptive strategies."""
    p_deceptive = 1 - p_honest
    # Pollinators learn to avoid deceptive flowers as they become common
    deceptive_visits = visit_benefit * np.exp(-learning_rate * p_deceptive)
    honest_visits = visit_benefit  # always visited

    f_honest = honest_visits - nectar_cost
    f_deceptive = deceptive_visits  # no nectar cost
    return f_honest, f_deceptive

# Replicator dynamics
generations = 300
dt = 0.1

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Multiple starting frequencies
ax1.set_facecolor('#1f2937')
starts = [0.1, 0.3, 0.5, 0.7, 0.9]
colors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa']

for p0, color in zip(starts, colors):
    p = p0
    history = [p]

    for _ in range(generations):
        f_h, f_d = fitness(p)
        f_bar = p * f_h + (1-p) * f_d
        dp = p * (1-p) * (f_h - f_d) * dt
        p = np.clip(p + dp + np.random.normal(0, 0.005), 0.01, 0.99)
        history.append(p)

    ax1.plot(history, color=color, linewidth=2, label=f'p₀={p0}')

ax1.axhline(history[-1], color='white', linestyle=':', alpha=0.5)
ax1.set_xlabel('Generation', color='lightgray', fontsize=12)
ax1.set_ylabel('Fraction honest orchids', color='lightgray', fontsize=12)
ax1.set_title('Evolutionary Dynamics: Honest vs Deceptive', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Fitness landscape
ax2.set_facecolor('#1f2937')
p_range = np.linspace(0.01, 0.99, 100)
f_h_vals = []
f_d_vals = []
for p in p_range:
    fh, fd = fitness(p)
    f_h_vals.append(fh)
    f_d_vals.append(fd)

ax2.plot(p_range, f_h_vals, color='#34d399', linewidth=2.5, label='Honest fitness')
ax2.plot(p_range, f_d_vals, color='#f87171', linewidth=2.5, label='Deceptive fitness')

# ESS point (where fitnesses cross)
cross_idx = np.argmin(np.abs(np.array(f_h_vals) - np.array(f_d_vals)))
ax2.plot(p_range[cross_idx], f_h_vals[cross_idx], 'o', color='white', markersize=12, zorder=5)
ax2.annotate(f'ESS: {p_range[cross_idx]:.0%} honest', xy=(p_range[cross_idx], f_h_vals[cross_idx]),
             xytext=(p_range[cross_idx]+0.15, f_h_vals[cross_idx]+0.1), color='white', fontsize=11,
             arrowprops=dict(arrowstyle='->', color='white'))

ax2.set_xlabel('Fraction honest orchids', color='lightgray', fontsize=12)
ax2.set_ylabel('Fitness', color='lightgray', fontsize=12)
ax2.set_title('Fitness Landscape', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/orchid_game.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print(f"Evolutionarily Stable Strategy: ~{p_range[cross_idx]*100:.0f}% honest")
print(f"At ESS: honest fitness = {f_h_vals[cross_idx]:.3f}, deceptive fitness = {f_d_vals[cross_idx]:.3f}")`,
      challenge: 'What happens if you add a third strategy: "partial reward" orchids that produce 50% nectar? Can this intermediate strategy invade the honest-deceptive equilibrium? Model the 3-strategy game.',
      successHint: 'You applied evolutionary game theory to orchid pollination — explaining why deception persists in nature. The ESS concept is one of the most powerful ideas in evolutionary biology, explaining everything from animal aggression to bacterial cooperation.',
    },
    {
      title: 'Phenological synchrony — timing is everything',
      concept: `**Phenology** is the timing of biological events (flowering, insect emergence, migration). For pollination, the orchid and pollinator must be active at the same time — **phenological synchrony**.

Climate change can disrupt synchrony if:
- Orchids respond to photoperiod (day length — unchanged by warming)
- Pollinators respond to temperature (shifts with warming)

The **mismatch** is modeled as:
\`mismatch(t) = |flower_peak(t) - pollinator_peak(t)|\`

Even a 1-2 week mismatch can reduce pollination by 50% or more.

We model both phenological curves as Gaussians:
\`activity(day) = exp(-(day - peak_day)² / (2σ²))\`

The **overlap integral** measures how well they synchronize:
\`overlap = ∫ flower(day) × pollinator(day) dd\`

📚 *numpy's element-wise multiplication of arrays computes the overlap product. Summing the product approximates the integral — numerical integration.*`,
      analogy: 'Phenological synchrony is like a scheduled meeting. If both parties show up at the right time, business gets done (pollination). If one party arrives too early or too late, the meeting fails. Climate change is like one party switching to a different time zone without telling the other — the meeting time drifts apart.',
      storyConnection: 'Phawngpui orchids flower in precise windows — some only for two weeks in April, others in August. Their pollinators emerge in synchronized windows. As Mizoram\'s climate warms, these windows may shift at different rates, threatening the synchrony that took millions of years to establish.',
      checkQuestion: 'Why would an orchid respond to day length while its pollinator responds to temperature?',
      checkAnswer: 'Orchids (plants) can measure photoperiod with photoreceptors — a reliable, unchanging cue. Insects often track accumulated heat (degree-days) to time their emergence — because their development rate depends on temperature. When climate was stable, both cues predicted the same timing. As climate warms, temperature-based timing shifts earlier while photoperiod stays fixed — creating mismatch.',
      codeIntro: 'Model phenological synchrony between orchids and pollinators under climate change.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

days = np.arange(1, 366)

def activity_curve(peak_day, sigma=15):
    return np.exp(-(days - peak_day)**2 / (2 * sigma**2))

# Current synchrony
orchid_peak = 120  # May 1 (day 120) — driven by photoperiod
moth_peak = 122    # May 3 — driven by temperature

# Climate scenarios (warming shifts moth emergence earlier)
scenarios = {
    'Current': 0,
    '+1°C (2040)': -7,    # moth 7 days earlier
    '+2°C (2060)': -15,   # moth 15 days earlier
    '+3°C (2080)': -25,   # moth 25 days earlier
}

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#111827')

for ax, (scenario, shift) in zip(axes.flat, scenarios.items()):
    ax.set_facecolor('#1f2937')

    orchid = activity_curve(orchid_peak, sigma=12)
    moth = activity_curve(moth_peak + shift, sigma=10)

    overlap = np.sum(orchid * moth) / np.sum(orchid)
    mismatch = abs(orchid_peak - (moth_peak + shift))

    ax.fill_between(days, orchid, alpha=0.3, color='#34d399', label='Orchid flowering')
    ax.fill_between(days, moth, alpha=0.3, color='#fbbf24', label='Moth activity')
    ax.plot(days, orchid, color='#34d399', linewidth=2)
    ax.plot(days, moth, color='#fbbf24', linewidth=2)

    # Overlap region
    overlap_curve = np.minimum(orchid, moth)
    ax.fill_between(days, overlap_curve, alpha=0.5, color='#60a5fa')

    ax.set_title(f'{scenario} (overlap: {overlap:.0%})', color='white', fontsize=11, fontweight='bold')
    ax.set_xlim(60, 180)
    ax.set_ylim(0, 1.1)
    if ax in axes[1]: ax.set_xlabel('Day of year', color='lightgray')
    ax.set_ylabel('Activity', color='lightgray')
    ax.tick_params(colors='lightgray')
    for s in ax.spines.values(): s.set_color('#374151')
    if ax == axes[0][0]: ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=8)

plt.suptitle('Phenological Synchrony Under Climate Change',
             color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/orchid_phenology.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Phenological mismatch analysis:")
print(f"{'Scenario':<20} {'Mismatch':>10} {'Overlap':>10} {'Pollination':>12}")
print("-" * 55)
for scenario, shift in scenarios.items():
    orchid = activity_curve(orchid_peak, sigma=12)
    moth = activity_curve(moth_peak + shift, sigma=10)
    overlap = np.sum(orchid * moth) / np.sum(orchid)
    mismatch = abs(orchid_peak - (moth_peak + shift))
    poll_success = overlap * 100
    print(f"{scenario:<20} {mismatch:>8} days {overlap:>9.0%} {poll_success:>10.0f}%")`,
      challenge: 'What if the orchid can evolve to shift its flowering time? Add a slow evolutionary response (1 day per decade). Does this rescue the synchrony? What if the rate of warming accelerates?',
      successHint: 'You modeled phenological mismatch — one of the most documented effects of climate change on species interactions. The overlap integral quantifies the threat precisely, showing that even moderate warming can devastate specialist pollination relationships.',
    },
    {
      title: 'Spatial population dynamics — metapopulation model',
      concept: `Orchid populations on Blue Mountain exist as a **metapopulation**: multiple small populations (patches) connected by seed dispersal.

The **Levins metapopulation model**:
\`dp/dt = c × p × (1-p) - e × p\`

Where:
- p = fraction of patches occupied
- c = colonization rate (seeds reaching empty patches)
- e = extinction rate (local populations dying out)

Equilibrium: \`p* = 1 - e/c\`

For the metapopulation to survive: c > e (colonization must exceed extinction).

Orchids have special challenges:
- Seeds are tiny (wind-dispersed) but need mycorrhizal fungi to germinate
- Colonization is rare because seeds must land near compatible fungi
- Local extinction is common in small, isolated patches

📚 *We extend the Levins model to a spatially explicit grid where each cell can be occupied or empty. This captures the spatial structure that the basic model ignores.*`,
      analogy: 'A metapopulation is like a chain of campfires in the wind. Each fire (population) can go out (local extinction), but sparks (seeds) can fly to dead sites and relight them (colonization). The chain survives as long as new fires start faster than old ones die. If the wind is too strong (high extinction), all fires go out. If there is no wind (no dispersal), dead fires stay dead.',
      storyConnection: 'Phawngpui\'s orchids grow in scattered patches — on specific trees, at specific elevations, near specific streams. Each patch is a small population that can go extinct independently. Seed dispersal connects them, but orchid seeds are notoriously bad at establishing new populations. The metapopulation structure determines the species\' long-term survival.',
      checkQuestion: 'Why is the colonization rate (c) so low for orchids compared to other plants?',
      checkAnswer: 'Orchid seeds are among the smallest in the plant kingdom — they contain no food reserves. To germinate, they must land within millimeters of compatible mycorrhizal fungi that will provide nutrients. This double requirement (right location + right fungus) makes successful colonization extremely rare. A million seeds might produce one new plant.',
      codeIntro: 'Simulate a spatially explicit metapopulation model for Phawngpui orchids.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

np.random.seed(42)

# Grid metapopulation
grid_size = 20
n_patches = grid_size * grid_size
years = 100

# Parameters
colonization_rate = 0.15   # probability of colonizing adjacent empty patch
extinction_rate = 0.05     # probability of local extinction per year
dispersal_range = 2        # patches (seed dispersal distance)

# Initialize: 30% of patches occupied
grid = np.random.random((grid_size, grid_size)) < 0.3

occupancy_history = [grid.sum() / n_patches]
grids_snapshots = {0: grid.copy()}

for year in range(1, years + 1):
    new_grid = grid.copy()

    for i in range(grid_size):
        for j in range(grid_size):
            if grid[i, j]:  # occupied patch
                # Local extinction
                if np.random.random() < extinction_rate:
                    new_grid[i, j] = False
                # Colonize neighbors
                for di in range(-dispersal_range, dispersal_range + 1):
                    for dj in range(-dispersal_range, dispersal_range + 1):
                        ni, nj = i + di, j + dj
                        if 0 <= ni < grid_size and 0 <= nj < grid_size:
                            if not grid[ni, nj]:
                                dist = np.sqrt(di**2 + dj**2)
                                p_col = colonization_rate * np.exp(-dist)
                                if np.random.random() < p_col:
                                    new_grid[ni, nj] = True

    grid = new_grid
    occupancy_history.append(grid.sum() / n_patches)

    if year in [10, 30, 60, 100]:
        grids_snapshots[year] = grid.copy()

fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#111827')

# Spatial snapshots
snap_years = [0, 10, 30, 60, 100]
for ax, yr in zip(axes.flat[:5], snap_years):
    ax.set_facecolor('#1f2937')
    ax.imshow(grids_snapshots[yr].astype(float), cmap='Greens', vmin=0, vmax=1)
    occ = grids_snapshots[yr].sum() / n_patches
    ax.set_title(f'Year {yr} ({occ:.0%} occupied)', color='white', fontsize=10, fontweight='bold')
    ax.set_xticks([]); ax.set_yticks([])

# Occupancy time series
ax = axes[1][2]
ax.set_facecolor('#1f2937')
ax.plot(occupancy_history, color='#34d399', linewidth=2.5)

# Levins equilibrium
p_star = max(0, 1 - extinction_rate / colonization_rate)
ax.axhline(p_star, color='#fbbf24', linestyle='--', label=f'Levins eq: {p_star:.2f}')
ax.set_xlabel('Year', color='lightgray')
ax.set_ylabel('Fraction occupied', color='lightgray')
ax.set_title('Metapopulation Dynamics', color='white', fontsize=10, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=8)
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

plt.suptitle('Orchid Metapopulation on Phawngpui', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/orchid_metapop.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print(f"Levins equilibrium occupancy: {p_star:.0%}")
print(f"Simulated final occupancy: {occupancy_history[-1]:.0%}")
print(f"Colonization rate: {colonization_rate}, Extinction rate: {extinction_rate}")
print(f"c/e ratio: {colonization_rate/extinction_rate:.1f} (must be > 1 for survival)")`,
      challenge: 'Model habitat fragmentation: remove a band of patches across the middle of the grid (simulating a road or deforestation). How does this barrier affect the metapopulation? Does splitting the population into two halves matter?',
      successHint: 'You simulated a spatially explicit metapopulation — a standard tool in conservation biology. The model reveals that orchid survival depends not just on local conditions but on the connectivity between populations. Habitat corridors that allow seed dispersal are critical for long-term persistence.',
    },
    {
      title: 'Coevolutionary dynamics — Red Queen hypothesis',
      concept: `The **Red Queen hypothesis** states that species must constantly evolve just to maintain their current fitness — because their partners and competitors are also evolving.

For orchid-pollinator coevolution:
\`d(orchid_trait)/dt = α × (pollinator_trait - orchid_trait + offset)\`
\`d(pollinator_trait)/dt = β × (orchid_trait - pollinator_trait - offset)\`

This creates an **evolutionary chase**: the orchid evolves to force pollen contact, the pollinator evolves to avoid it (or to access nectar more efficiently).

The dynamics can show:
- **Coevolutionary stasis**: traits stabilize at a matched equilibrium
- **Arms race**: traits escalate indefinitely
- **Oscillation**: traits cycle as each species alternately leads

Which outcome occurs depends on the relative evolution rates (α, β) and the strength of selection.

📚 *Coupled differential equations describe coevolutionary dynamics. We solve them numerically and analyze the resulting trajectories in trait space.*`,
      analogy: 'The Red Queen hypothesis is named after the Red Queen in Alice in Wonderland: "It takes all the running you can do, to keep in the same place." In a coevolutionary race, neither species can stop evolving — if the orchid stops adapting, the pollinator will evolve past it, breaking the relationship. Both must run to stay matched.',
      storyConnection: 'The orchids of Phawngpui are locked in Red Queen dynamics with their pollinators. The extraordinary specificity we observe — nectar spurs exactly matching tongue lengths, scents precisely tuned to moth receptors — is not a static achievement but a dynamic balance maintained by continuous reciprocal evolution.',
      checkQuestion: 'Can the Red Queen race ever end?',
      checkAnswer: 'Yes, in three ways: (1) Extinction of one partner ends the race permanently. (2) A third species enters as an alternative partner, relaxing selection. (3) Physical or developmental constraints prevent further trait change (you cannot evolve a 1-meter tongue). In practice, most coevolutionary races eventually end in extinction or partner switching — the current pairings are just snapshots of an ongoing process.',
      codeIntro: 'Simulate Red Queen coevolutionary dynamics between an orchid and its specific moth pollinator.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

np.random.seed(42)
generations = 500
dt = 0.1

def simulate_red_queen(alpha, beta, offset, noise=0.02):
    orchid_trait = 10.0   # spur length (mm)
    poll_trait = 10.0     # tongue length (mm)
    o_hist, p_hist = [orchid_trait], [poll_trait]

    for _ in range(generations):
        # Orchid wants spur slightly longer than tongue
        do = alpha * (poll_trait - orchid_trait + offset)
        # Pollinator wants tongue to reach nectar
        dp = beta * (orchid_trait - poll_trait - offset * 0.3)

        orchid_trait += do * dt + np.random.normal(0, noise)
        poll_trait += dp * dt + np.random.normal(0, noise)

        orchid_trait = max(orchid_trait, 1)
        poll_trait = max(poll_trait, 1)

        o_hist.append(orchid_trait)
        p_hist.append(poll_trait)

    return o_hist, p_hist

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#111827')

scenarios = [
    ('Stasis (balanced rates)', 0.3, 0.3, 2.0),
    ('Arms race (orchid leads)', 0.5, 0.2, 3.0),
    ('Oscillation (pollinator fast)', 0.2, 0.5, 2.0),
    ('Rapid escalation', 0.5, 0.5, 3.0),
]

for ax, (title, alpha, beta, offset) in zip(axes.flat, scenarios):
    ax.set_facecolor('#1f2937')
    o, p = simulate_red_queen(alpha, beta, offset)

    ax.plot(o, color='#34d399', linewidth=1.5, label='Orchid spur')
    ax.plot(p, color='#fbbf24', linewidth=1.5, label='Moth tongue')
    ax.plot([abs(oi - pi) for oi, pi in zip(o, p)], color='#f87171',
            linewidth=1, alpha=0.5, label='Mismatch')

    ax.set_title(title, color='white', fontsize=11, fontweight='bold')
    ax.set_ylabel('Trait (mm)', color='lightgray')
    if ax in axes[1]: ax.set_xlabel('Generation', color='lightgray')
    ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=7)
    ax.tick_params(colors='lightgray')
    for s in ax.spines.values(): s.set_color('#374151')

plt.suptitle('Red Queen Coevolutionary Dynamics', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/orchid_redqueen.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

for title, alpha, beta, offset in scenarios:
    o, p = simulate_red_queen(alpha, beta, offset)
    final_mismatch = abs(o[-1] - p[-1])
    escalation = o[-1] / o[0]
    print(f"{title}: spur {o[0]:.0f}→{o[-1]:.0f}mm ({escalation:.1f}x), mismatch={final_mismatch:.1f}mm")`,
      challenge: 'What happens when a second orchid species enters the system, competing for the same moth? Add a third equation and simulate 3-species coevolution. Does competition accelerate or slow the arms race?',
      successHint: 'You simulated Red Queen dynamics — one of the deepest ideas in evolutionary biology. The constant evolutionary pressure to maintain coevolutionary fit explains the extraordinary specificity of orchid pollination and the relentless pace of biological adaptation.',
    },
    {
      title: 'Adaptive landscape — fitness in trait space',
      concept: `An **adaptive landscape** (or fitness landscape) is a surface where each point represents a combination of traits and the height represents fitness. Evolution moves populations "uphill" toward fitness peaks.

For orchids, the landscape has:
- **Peaks**: trait combinations matching available pollinators
- **Valleys**: mismatched combinations (wrong scent + wrong shape)
- **Ridges**: correlated traits that maintain function

The landscape can shift over time:
- New pollinators → new peaks appear
- Climate change → existing peaks move
- Competitor arrival → peaks split

**Wright's shifting balance theory**: populations on local peaks can occasionally cross valleys (via genetic drift) to reach higher peaks.

📚 *2D fitness landscapes are visualized as contour plots or surface plots. numpy's meshgrid creates the trait space, and a fitness function assigns height to each point.*`,
      analogy: 'The adaptive landscape is like a mountain range in fog. You can only see the slope immediately around you (local fitness gradient). You climb uphill (evolve toward higher fitness), but you might reach a local peak — not the highest mountain, just the nearest one. To reach the true summit, you would have to descend into a valley first (lose fitness temporarily).',
      storyConnection: 'Each Phawngpui orchid species sits on a different peak of the adaptive landscape. The diversity of orchid species represents the diversity of peaks — each a viable combination of scent, shape, color, and timing matched to a specific pollinator. Speciation occurs when a population crosses a valley and colonizes a new peak.',
      checkQuestion: 'Why do organisms get "stuck" on local fitness peaks?',
      checkAnswer: 'Natural selection always moves populations uphill — it cannot see the global landscape. To reach a higher peak, the population would have to cross a fitness valley (evolve through a disadvantageous intermediate). This requires genetic drift (random) or a shift in the environment that fills in the valley. Large populations rarely cross valleys because drift is weak.',
      codeIntro: 'Construct and visualize the adaptive landscape for orchid traits on Phawngpui.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Two traits: scent intensity (x) and spur length (y)
x = np.linspace(0, 10, 200)
y = np.linspace(0, 10, 200)
X, Y = np.meshgrid(x, y)

# Fitness landscape with multiple peaks (each = a viable pollinator match)
def fitness_landscape(X, Y):
    # Peak 1: bee orchid (moderate scent, short spur)
    f1 = 3.0 * np.exp(-((X-3)**2 + (Y-2)**2) / 2)
    # Peak 2: moth orchid (strong scent, long spur)
    f2 = 4.0 * np.exp(-((X-7)**2 + (Y-8)**2) / 3)
    # Peak 3: fly orchid (low scent, medium spur)
    f3 = 2.5 * np.exp(-((X-2)**2 + (Y-6)**2) / 1.5)
    # Peak 4: beetle orchid (moderate everything)
    f4 = 2.0 * np.exp(-((X-6)**2 + (Y-4)**2) / 2)
    return f1 + f2 + f3 + f4

Z = fitness_landscape(X, Y)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Contour landscape
ax1.set_facecolor('#1f2937')
cf = ax1.contourf(X, Y, Z, levels=20, cmap='viridis')
ax1.contour(X, Y, Z, levels=10, colors='white', linewidths=0.5, alpha=0.3)
plt.colorbar(cf, ax=ax1, label='Fitness')

# Mark peaks and species
peaks = [(3, 2, 'Dendrobium\
(bee)'), (7, 8, 'Aerides\
(moth)'),
         (2, 6, 'Bulbophyllum\
(fly)'), (6, 4, 'Coelogyne\
(beetle)')]
for px, py, name in peaks:
    ax1.plot(px, py, '*', color='white', markersize=15)
    ax1.annotate(name, xy=(px, py), xytext=(px+0.5, py+0.5),
                 color='white', fontsize=9, fontweight='bold')

# Evolutionary trajectory
np.random.seed(42)
traj_x, traj_y = [1.0], [1.0]
for _ in range(200):
    cx, cy = traj_x[-1], traj_y[-1]
    # Gradient ascent with noise
    dx = 0.01 * (fitness_landscape(np.array([[cx+0.1]]), np.array([[cy]]))[0,0] -
                  fitness_landscape(np.array([[cx-0.1]]), np.array([[cy]]))[0,0])
    dy = 0.01 * (fitness_landscape(np.array([[cx]]), np.array([[cy+0.1]]))[0,0] -
                  fitness_landscape(np.array([[cx]]), np.array([[cy-0.1]]))[0,0])
    cx += dx + np.random.normal(0, 0.15)
    cy += dy + np.random.normal(0, 0.15)
    traj_x.append(np.clip(cx, 0, 10))
    traj_y.append(np.clip(cy, 0, 10))

ax1.plot(traj_x, traj_y, color='#f87171', linewidth=1.5, alpha=0.8)
ax1.plot(traj_x[0], traj_y[0], 'o', color='#f87171', markersize=8, label='Start')
ax1.plot(traj_x[-1], traj_y[-1], 's', color='#f87171', markersize=8, label='End')

ax1.set_xlabel('Scent intensity', color='lightgray', fontsize=12)
ax1.set_ylabel('Spur length', color='lightgray', fontsize=12)
ax1.set_title('Adaptive Landscape — Orchid Trait Space', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=8)
ax1.tick_params(colors='lightgray')

# Cross-section through landscape
ax2.set_facecolor('#1f2937')
for y_val, color, label in [(2, '#34d399', 'y=2 (bee spur)'),
                              (6, '#fbbf24', 'y=6 (fly spur)'),
                              (8, '#f87171', 'y=8 (moth spur)')]:
    idx = np.argmin(np.abs(y - y_val))
    ax2.plot(x, Z[idx, :], color=color, linewidth=2.5, label=label)

ax2.set_xlabel('Scent intensity', color='lightgray', fontsize=12)
ax2.set_ylabel('Fitness', color='lightgray', fontsize=12)
ax2.set_title('Fitness Cross-Sections', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/orchid_landscape.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Fitness peaks (orchid species):")
for px, py, name in peaks:
    f = fitness_landscape(np.array([[px]]), np.array([[py]]))[0,0]
    print(f"  {name.replace(chr(10), ' ')}: scent={px}, spur={py}, fitness={f:.2f}")
print(f"\
Evolutionary trajectory: ({traj_x[0]:.1f},{traj_y[0]:.1f}) → ({traj_x[-1]:.1f},{traj_y[-1]:.1f})")`,
      challenge: 'Shift the fitness landscape (simulate climate change moving the moth peak from (7,8) to (5,6)). Does the orchid population track the moving peak? At what speed of peak movement does the population fail to keep up and go extinct?',
      successHint: 'You built an adaptive landscape — one of the most important conceptual tools in evolutionary biology. The landscape visualization explains why orchid diversity exists (multiple peaks), why species are stable (sitting on peaks), and why speciation occurs (populations crossing valleys to new peaks). The orchids of Phawngpui each represent a peak in trait space, shaped by millions of years of evolutionary hill-climbing.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Evolutionary Modeling & Dynamics</span>
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
