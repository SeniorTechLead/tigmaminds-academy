import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GoldenHilsaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fish population dynamics — birth, death, and balance',
      concept: `The golden hilsa is the most prized fish in the rivers of Assam and Bangladesh. But hilsa catches have been declining for decades. Why? To understand, we need **population dynamics**.

A fish population changes based on four factors:
- **Births** (recruitment): new fish entering the population
- **Deaths** (natural mortality): predation, disease, old age
- **Immigration**: fish arriving from elsewhere
- **Emigration**: fish leaving

The basic equation: **N(t+1) = N(t) + Births - Deaths + Immigration - Emigration**

For a closed population: **N(t+1) = N(t) + rN(t)(1 - N(t)/K)**

Where r = intrinsic growth rate and K = carrying capacity (maximum population the environment can support).

When fishing is added, it becomes: **N(t+1) = N(t) + rN(t)(1 - N(t)/K) - Catch**

If Catch > rN(t)(1-N(t)/K), the population SHRINKS. This is **overfishing**.`,
      analogy: 'A fish population is like a bank account. Births are deposits. Deaths are expenses. Fishing is withdrawals. As long as withdrawals are less than interest earned (population growth), the balance stays healthy. But if you withdraw faster than interest accrues, the balance drops toward zero. Overfishing is like spending more than you earn — it depletes the principal.',
      storyConnection: 'In the story, the elders remember when the river was thick with golden hilsa. Now the catch is smaller every year. The fishermen work harder to catch fewer fish. This is the classic overfishing trajectory: as the population declines, catch per unit effort (CPUE) drops, but fishermen compensate by fishing more — accelerating the decline.',
      checkQuestion: 'If a lake has 10,000 fish, the growth rate is 20% per year, and fishermen catch 2,500 per year, is this sustainable?',
      checkAnswer: 'Annual growth = 0.20 × 10,000 × (1 - 10,000/K). If K = 15,000: growth = 0.20 × 10,000 × 0.33 = 667 fish. Catch of 2,500 FAR exceeds growth of 667. The population will crash. Sustainable catch depends on both growth rate AND how close the population is to carrying capacity. At maximum sustainable yield, catch = rK/4 (for logistic growth).',
      codeIntro: 'Model fish population dynamics under different fishing pressures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = 50
K = 10000  # carrying capacity
r = 0.3    # intrinsic growth rate

# Different fishing rates
fishing_rates = [0, 0.1, 0.2, 0.3, 0.4]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']

for rate, color in zip(fishing_rates, colors):
    pop = np.zeros(years)
    pop[0] = K * 0.8  # start near carrying capacity
    catches = np.zeros(years)

    for t in range(1, years):
        growth = r * pop[t-1] * (1 - pop[t-1] / K)
        catch = rate * pop[t-1]
        pop[t] = max(pop[t-1] + growth - catch, 0)
        catches[t] = catch

    ax1.plot(pop, color=color, linewidth=2, label=f'Fishing rate: {rate:.0%}')

ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Population', color='white')
ax1.set_title('Fish Population Under Different Fishing Pressures', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.axhline(K, color='gray', linestyle=':', alpha=0.3)

# Maximum Sustainable Yield
fishing_rate_range = np.linspace(0, 0.5, 100)
sustainable_catch = []
equilibrium_pop = []

for rate in fishing_rate_range:
    # At equilibrium: growth = catch
    # rN(1-N/K) = rate*N -> N_eq = K(1 - rate/r) if rate < r
    if rate < r:
        N_eq = K * (1 - rate / r)
        catch_eq = rate * N_eq
    else:
        N_eq = 0
        catch_eq = 0
    sustainable_catch.append(catch_eq)
    equilibrium_pop.append(N_eq)

msy = max(sustainable_catch)
msy_rate = fishing_rate_range[np.argmax(sustainable_catch)]

ax2.set_facecolor('#111827')
ax2.plot(fishing_rate_range, sustainable_catch, color='#22c55e', linewidth=2, label='Sustainable catch')
ax2.axhline(msy, color='#f59e0b', linestyle='--', label=f'MSY = {msy:.0f} fish')
ax2.axvline(msy_rate, color='#f59e0b', linestyle=':', alpha=0.5)
ax2.fill_between(fishing_rate_range, sustainable_catch, where=np.array(fishing_rate_range) <= msy_rate,
                 alpha=0.1, color='#22c55e')
ax2.fill_between(fishing_rate_range, sustainable_catch, where=np.array(fishing_rate_range) > msy_rate,
                 alpha=0.1, color='#ef4444')
ax2.annotate(f'MSY rate: {msy_rate:.0%}', xy=(msy_rate, msy),
             xytext=(msy_rate + 0.05, msy + 100), color='#f59e0b', fontsize=10)
ax2.set_xlabel('Fishing rate (fraction of population)', color='white')
ax2.set_ylabel('Annual sustainable catch', color='white')
ax2.set_title('Maximum Sustainable Yield (MSY)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.text(0.05, msy * 0.4, 'Under-fishing\\n(safe)', color='#22c55e', fontsize=10)
ax2.text(0.25, msy * 0.4, 'Over-fishing\\n(collapse)', color='#ef4444', fontsize=10)

plt.tight_layout()
plt.show()

print(f"Maximum Sustainable Yield (MSY): {msy:.0f} fish/year")
print(f"Optimal fishing rate: {msy_rate:.0%} of population")
print(f"Equilibrium population at MSY: {K*(1-msy_rate/r):.0f}")
print()
print("Fish above MSY rate and the population collapses.")
print("Fish below MSY rate and you're leaving fish in the river.")
print("MSY is the sweet spot — but it's surprisingly narrow.")`,
      challenge: 'What happens if K decreases by 30% due to habitat degradation (pollution, dams)? Recalculate MSY. Does the sustainable fishing rate change? This shows how environmental damage compounds overfishing.',
      successHint: 'MSY is the foundational concept in fisheries management. Every fishing quota, every closed season, every net-size regulation traces back to this model. The golden hilsa\'s decline isn\'t mysterious — it\'s mathematics.',
    },
    {
      title: 'Anadromous migration — the hilsa\'s incredible journey',
      concept: `The hilsa is **anadromous** — it lives in the sea but migrates hundreds of kilometers up rivers to spawn (lay eggs) in freshwater. This migration is one of nature's greatest spectacles:

1. **Sea phase**: hilsa mature in the Bay of Bengal, feeding on plankton
2. **Upstream migration**: triggered by monsoon floods, they swim up the Brahmaputra, Ganges, and other rivers
3. **Spawning**: eggs are released in freshwater, fertilized, and drift downstream
4. **Juvenile phase**: young hilsa grow in river estuaries before heading to sea

The migration is energetically expensive — hilsa stop eating during upstream migration and live off stored fat (which is why monsoon hilsa is so delicious — it's fat-rich).

Dams are the biggest threat to anadromous fish. A dam blocks the migration route completely. The Farakka Barrage on the Ganges reduced hilsa catches upstream by 90% within a decade.`,
      analogy: 'Hilsa migration is like a salmon run in reverse geography — from the tropical sea to freshwater rivers. It\'s driven by the same evolutionary logic: spawning in freshwater provides safer nursery habitat (fewer marine predators), and the sea provides better adult feeding grounds. The migration is the commute between "home" (spawning ground) and "office" (feeding ground).',
      storyConnection: 'The story follows a hilsa from the sea upriver, past fishing villages, through rapids, to the spawning ground. The fish is golden because it\'s fat-laden for the journey — it won\'t eat again until it returns to the sea. Every obstacle on the river — a dam, a net, a polluted stretch — threatens not just one fish but an entire generation.',
      checkQuestion: 'The Farakka Barrage was built in 1975 for irrigation and navigation. Hilsa catches upstream dropped 90%. Was the dam worth it?',
      checkAnswer: 'This is a classic trade-off. The dam provides irrigation for millions of farmers and navigation benefits. But the hilsa fishery supported hundreds of thousands of fishermen upstream. A proper cost-benefit analysis must include: (1) irrigation benefits, (2) navigation benefits, (3) lost fishery income, (4) lost food security, (5) ecological damage. Fish ladders (passages that let fish bypass the dam) were never built at Farakka — a $10 million addition to a $1 billion project that could have preserved the fishery.',
      codeIntro: 'Model hilsa migration: energy expenditure, obstacles, and survival probability along the river.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# River profile: distance from sea (km) vs elevation (m)
distance = np.linspace(0, 500, 200)  # km from sea
elevation = 0.05 * distance + 2 * np.sin(distance / 30)  # gradual rise with rapids

# Obstacles
obstacles = {
    'Fishing nets (100km)': {'pos': 100, 'mortality': 0.15},
    'Pollution zone (200km)': {'pos': 200, 'mortality': 0.10},
    'Dam (300km)': {'pos': 300, 'mortality': 0.60},
    'Spawning ground (450km)': {'pos': 450, 'mortality': 0},
}

# Energy model: hilsa starts with 100% energy, loses it swimming upstream
current_speed = 2 + 0.5 * np.sin(distance / 20)  # km/h river current
swimming_cost = 0.002 * current_speed  # energy cost proportional to current
energy = 100 - np.cumsum(swimming_cost * (distance[1] - distance[0]))

# Survival probability along the route
n_fish = 1000
survival = np.ones(len(distance)) * n_fish

for name, obs in obstacles.items():
    idx = np.argmin(np.abs(distance - obs['pos']))
    survival[idx:] *= (1 - obs['mortality'])

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# River profile and energy
ax1.set_facecolor('#111827')
ax1_twin = ax1.twinx()
ax1.plot(distance, elevation, color='#3b82f6', linewidth=2, label='River elevation')
ax1.fill_between(distance, 0, elevation, alpha=0.1, color='#3b82f6')
ax1_twin.plot(distance, energy, color='#f59e0b', linewidth=2, label='Fish energy (%)')

for name, obs in obstacles.items():
    color = '#ef4444' if obs['mortality'] > 0 else '#22c55e'
    ax1.axvline(obs['pos'], color=color, linestyle='--', alpha=0.5)
    ax1.text(obs['pos'], max(elevation) * 0.9, name.split('(')[0],
             color=color, fontsize=8, rotation=90, va='top')

ax1.set_ylabel('Elevation (m)', color='#3b82f6')
ax1_twin.set_ylabel('Energy remaining (%)', color='#f59e0b')
ax1.set_title('Hilsa Migration: River Profile & Energy Budget', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1_twin.tick_params(colors='gray')

# Survival curve
ax2.set_facecolor('#111827')
ax2.plot(distance, survival, color='#22c55e', linewidth=2)
ax2.fill_between(distance, survival, alpha=0.15, color='#22c55e')
ax2.set_xlabel('Distance from sea (km)', color='white')
ax2.set_ylabel('Surviving fish (out of 1000)', color='white')
ax2.set_title('Survival Along Migration Route', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for name, obs in obstacles.items():
    if obs['mortality'] > 0:
        idx = np.argmin(np.abs(distance - obs['pos']))
        ax2.annotate(f"{name}\\n-{obs['mortality']*100:.0f}%",
                     xy=(obs['pos'], survival[idx]),
                     xytext=(obs['pos']+20, survival[idx]+50),
                     color='#ef4444', fontsize=9,
                     arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.tight_layout()
plt.show()

final_survivors = survival[-1]
print(f"Migration outcome (1000 fish starting):")
print(f"  Survivors reaching spawning ground: {final_survivors:.0f}")
print(f"  Overall survival rate: {final_survivors/1000*100:.0f}%")
print()
for name, obs in obstacles.items():
    if obs['mortality'] > 0:
        print(f"  {name}: {obs['mortality']*100:.0f}% mortality")
print()
print(f"The dam alone kills {obstacles['Dam (300km)']['mortality']*100:.0f}% of remaining fish.")
print("Without the dam, survival would be ~{:.0f}%".format(
    1000 * (1-0.15) * (1-0.10) / 1000 * 100))`,
      challenge: 'Add a fish ladder at the dam that reduces mortality from 60% to 10%. How many more fish reach the spawning ground? Calculate the value of the fish ladder in terms of spawning success.',
      successHint: 'The hilsa\'s migration is a gauntlet. Each obstacle reduces the spawning population, which reduces the next generation. Protecting migration routes isn\'t about saving individual fish — it\'s about maintaining the reproductive pipeline that sustains the entire species.',
    },
    {
      title: 'Overfishing and the tragedy of the commons',
      concept: `The hilsa fishery is a classic **tragedy of the commons** — a situation where individuals acting in their own self-interest deplete a shared resource.

Garrett Hardin (1968) described it: imagine a shared grazing field. Each herder benefits by adding one more cow. But if everyone adds a cow, the field is overgrazed and all cows starve. Each individual's rational choice leads to collective disaster.

For hilsa:
- Each fisherman benefits by catching more fish
- But if everyone catches more, the population collapses
- No individual fisherman can save the fishery by fishing less (others will catch "their" fish)
- Only collective action (regulation, quotas, closed seasons) can prevent tragedy

Solutions to the commons problem:
1. **Privatization**: assign fishing rights (Individual Transferable Quotas — ITQs)
2. **Regulation**: government sets total catch limits, gear restrictions, closed seasons
3. **Community management**: fishermen self-organize (Elinor Ostrom, Nobel Prize 2009)
4. **Technology**: fish tracking, satellite monitoring of boats`,
      analogy: 'The tragedy of the commons is like a shared office fridge. Everyone puts food in, but no one takes responsibility for cleaning. Each person thinks "someone else will clean it." Result: the fridge becomes unusable for everyone. The solution: assigned shelf space (privatization), a cleaning schedule (regulation), or a group agreement (community management).',
      storyConnection: 'The fishermen in the story each know that the hilsa population is declining. But each one thinks: "If I don\'t catch them, someone else will." This perfectly captures the tragedy of the commons. The story\'s resolution — the fishermen agreeing to a closed season — mirrors Ostrom\'s community management solution.',
      checkQuestion: 'Iceland introduced Individual Transferable Quotas (ITQs) for its fisheries in 1984. Fish stocks recovered, but small fishermen went bankrupt as big companies bought up quotas. Is this a fair solution?',
      checkAnswer: 'ITQs are economically efficient (total catch is sustainable, the most productive fishermen operate) but socially inequitable (small fishermen lose their livelihoods, coastal communities collapse as fishing rights concentrate in corporate hands). There\'s a trade-off between ecological sustainability and social justice. Some countries address this with community quotas, small-boat exemptions, or use-it-or-lose-it clauses. The "best" solution depends on what you prioritize: ecological health, economic efficiency, or social equity.',
      codeIntro: 'Simulate the tragedy of the commons in a fishery with multiple independent fishermen.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Fishery simulation
K = 10000
r = 0.3
n_fishermen = 20
n_years = 50

def simulate_fishery(strategy, n_years=50):
    pop = K * 0.8
    pop_history = [pop]
    catch_history = [0]
    individual_catch = np.zeros((n_years, n_fishermen))

    for year in range(n_years):
        if strategy == 'open_access':
            # Each fisherman maximizes own catch (greedy)
            effort = 0.02 * n_fishermen  # total fishing rate
        elif strategy == 'quota':
            # MSY-based quota, evenly distributed
            msy_rate = r / 2  # optimal rate at r/2
            effort = min(msy_rate, 0.02 * n_fishermen)
        elif strategy == 'community':
            # Adaptive: reduce effort when population drops
            if pop > K * 0.5:
                effort = 0.02 * n_fishermen
            elif pop > K * 0.3:
                effort = 0.01 * n_fishermen
            else:
                effort = 0.005 * n_fishermen  # near-moratorium

        catch = effort * pop
        growth = r * pop * (1 - pop / K)
        pop = max(pop + growth - catch, 0)
        pop_history.append(pop)
        catch_history.append(catch)

    return pop_history, catch_history

# Three strategies
open_pop, open_catch = simulate_fishery('open_access')
quota_pop, quota_catch = simulate_fishery('quota')
comm_pop, comm_catch = simulate_fishery('community')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Population trajectories
ax1.set_facecolor('#111827')
ax1.plot(open_pop, color='#ef4444', linewidth=2, label='Open access (no rules)')
ax1.plot(quota_pop, color='#3b82f6', linewidth=2, label='Government quota (MSY)')
ax1.plot(comm_pop, color='#22c55e', linewidth=2, label='Community management')
ax1.axhline(K, color='gray', linestyle=':', alpha=0.3, label=f'K = {K}')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Fish population', color='white')
ax1.set_title('Population Under Different Management', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Cumulative catch
ax2.set_facecolor('#111827')
ax2.plot(np.cumsum(open_catch), color='#ef4444', linewidth=2, label='Open access')
ax2.plot(np.cumsum(quota_catch), color='#3b82f6', linewidth=2, label='Quota')
ax2.plot(np.cumsum(comm_catch), color='#22c55e', linewidth=2, label='Community')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Cumulative catch', color='white')
ax2.set_title('Total Fish Caught Over 50 Years', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("50-year outcomes:")
for name, pop, catch in [('Open access', open_pop, open_catch),
                          ('Quota', quota_pop, quota_catch),
                          ('Community', comm_pop, comm_catch)]:
    print(f"  {name}: final pop={pop[-1]:.0f}, total catch={sum(catch):.0f}")`,
      challenge: 'Add a "cheater" to the community management scenario: one fisherman who ignores the rules and catches at the open-access rate. How does one cheater affect the outcome? What if 5 out of 20 cheat?',
      successHint: 'The tragedy of the commons explains why fish stocks worldwide are in crisis. The solution isn\'t to stop fishing — it\'s to manage the commons through quotas, community agreements, or property rights. The golden hilsa can be saved, but only through collective action.',
    },
    {
      title: 'Marine food webs — the hilsa in its ecosystem',
      concept: `The hilsa doesn't exist in isolation. It's part of a **food web** — a network of feeding relationships. Remove the hilsa and the whole ecosystem shifts.

The hilsa's role:
- **Prey**: hilsa eat plankton (phytoplankton and zooplankton). They're a key link between microscopic producers and larger predators.
- **Predator**: hilsa are eaten by dolphins, sharks, large fish, and birds
- **Nutrient transport**: migrating hilsa carry marine nutrients into freshwater (same as salmon)

**Trophic cascades**: removing hilsa can trigger chain reactions:
- Without hilsa eating plankton → plankton blooms → algal blooms → oxygen depletion → fish kills
- Without hilsa as prey → dolphins and predatory fish decline → their prey (small fish) explode → those small fish overgraze on their food

Ecosystems are interconnected. You can't remove one species without affecting dozens of others.`,
      analogy: 'A food web is like a Jenga tower. Remove one block (species) and the tower might wobble but stay standing. Remove a keystone block (keystone species like hilsa) and the whole structure collapses. The question isn\'t "does this block matter?" — every block matters. The question is "which blocks, if removed, cause the most damage?"',
      storyConnection: 'The story describes the river coming alive when the hilsa return — dolphins follow them, birds gather, even the water changes color. When the hilsa don\'t come (due to overfishing), the river is eerily quiet. The golden hilsa isn\'t just a fish — it\'s the heartbeat of the river ecosystem.',
      checkQuestion: 'Sea otters eat sea urchins. Sea urchins eat kelp. What happens if sea otters are removed?',
      checkAnswer: 'Without sea otters: sea urchin population explodes → urchins overgraze kelp → kelp forests disappear → thousands of species that depend on kelp forests (fish, invertebrates, marine mammals) lose their habitat. This actually happened on the Pacific coast. When sea otters were hunted to near-extinction, kelp forests vanished. When otters were protected and recovered, kelp forests regrew. This is a textbook trophic cascade.',
      codeIntro: 'Model a simple aquatic food web and simulate what happens when hilsa are removed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lotka-Volterra food web model
# 4 trophic levels: plankton, hilsa, predatory fish, top predators

def food_web_sim(years, hilsa_fishing_rate=0):
    dt = 0.01
    steps = int(years / dt)

    plankton = np.zeros(steps)
    hilsa = np.zeros(steps)
    pred_fish = np.zeros(steps)
    dolphins = np.zeros(steps)

    # Initial populations (relative units)
    plankton[0] = 500
    hilsa[0] = 200
    pred_fish[0] = 50
    dolphins[0] = 10

    for t in range(1, steps):
        P, H, F, D = plankton[t-1], hilsa[t-1], pred_fish[t-1], dolphins[t-1]

        # Growth rates (Lotka-Volterra with carrying capacity)
        dP = P * (2.0 * (1 - P/1000) - 0.005 * H)
        dH = H * (0.003 * P - 0.3 - 0.004 * F - hilsa_fishing_rate)
        dF = F * (0.003 * H - 0.2 - 0.008 * D)
        dD = D * (0.005 * F + 0.002 * H - 0.15)

        plankton[t] = max(P + dP * dt, 0)
        hilsa[t] = max(H + dH * dt, 0)
        pred_fish[t] = max(F + dF * dt, 0)
        dolphins[t] = max(D + dD * dt, 0)

    # Downsample for plotting
    step = int(1/dt)
    return plankton[::step], hilsa[::step], pred_fish[::step], dolphins[::step]

years = 30

# Normal ecosystem
p_norm, h_norm, f_norm, d_norm = food_web_sim(years, 0)
# Overfished hilsa
p_fish, h_fish, f_fish, d_fish = food_web_sim(years, 0.5)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Normal food web
ax1.set_facecolor('#111827')
t = range(len(p_norm))
ax1.plot(t, p_norm, color='#22c55e', linewidth=2, label='Plankton')
ax1.plot(t, h_norm, color='#f59e0b', linewidth=2, label='Hilsa')
ax1.plot(t, f_norm, color='#3b82f6', linewidth=2, label='Predatory fish')
ax1.plot(t, d_norm, color='#a855f7', linewidth=2, label='Dolphins')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Population (relative)', color='white')
ax1.set_title('Healthy Food Web: Balance', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Overfished
ax2.set_facecolor('#111827')
t2 = range(len(p_fish))
ax2.plot(t2, p_fish, color='#22c55e', linewidth=2, label='Plankton (BLOOMS)')
ax2.plot(t2, h_fish, color='#f59e0b', linewidth=2, label='Hilsa (CRASHED)')
ax2.plot(t2, f_fish, color='#3b82f6', linewidth=2, label='Predatory fish')
ax2.plot(t2, d_fish, color='#a855f7', linewidth=2, label='Dolphins')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Population (relative)', color='white')
ax2.set_title('Overfished Hilsa: Trophic Cascade', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Trophic cascade when hilsa are overfished:")
print(f"  Plankton: {p_norm[-1]:.0f} -> {p_fish[-1]:.0f} (bloom due to reduced grazing)")
print(f"  Hilsa: {h_norm[-1]:.0f} -> {h_fish[-1]:.0f} (crashed)")
print(f"  Predatory fish: {f_norm[-1]:.0f} -> {f_fish[-1]:.0f} (lost prey)")
print(f"  Dolphins: {d_norm[-1]:.0f} -> {d_fish[-1]:.0f} (lost prey)")
print()
print("Removing one species (hilsa) cascades up AND down the food web.")
print("Plankton blooms lead to algal blooms -> oxygen depletion -> dead zones.")`,
      challenge: 'Instead of removing hilsa, add a 5th species: an invasive fish that competes with hilsa for plankton. How does the invasive species change the ecosystem dynamics? Is coexistence possible or does one win?',
      successHint: 'The golden hilsa isn\'t just a fish — it\'s a keystone species connecting plankton to dolphins. Protecting hilsa protects the entire river ecosystem. Overfishing doesn\'t just remove a food source for humans — it unravels the web of life.',
    },
    {
      title: 'Catch-per-unit-effort — detecting decline before it\'s too late',
      concept: `How do you know when a fish population is in trouble? You measure **Catch Per Unit Effort (CPUE)** — the number of fish caught per hour (or per net, per trip, per boat).

CPUE is an index of population abundance:
- **High CPUE**: lots of fish, easy to catch → healthy population
- **Declining CPUE**: harder to catch fish → population declining
- **Low, stable CPUE**: few fish but population has stabilized (at a low level)

The danger: **hyperstability**. Modern fishing technology (GPS, sonar, fish finders) means fishermen can find the remaining fish even as the population crashes. CPUE stays deceptively high until the population collapses suddenly. The fishermen are catching the last fish efficiently.

For hilsa in Bangladesh:
- 1980s CPUE: ~15 kg per boat-day
- 2000s CPUE: ~5 kg per boat-day
- After 65-day fishing ban (2003+): CPUE recovered to ~10 kg per boat-day

CPUE data justified Bangladesh's hilsa management program, which has been remarkably successful.`,
      analogy: 'CPUE is like the time it takes to find a parking spot. When the lot is full (high population), you find one instantly (high CPUE). When it\'s nearly empty, you circle for ages (low CPUE). But if someone installs a "find my parking spot" app (fish finder), you can always find the last spots quickly — making the lot seem fuller than it is. This is hyperstability.',
      storyConnection: 'The old fisherman in the story used to fill his boat in an hour. Now it takes all day for the same catch. His declining CPUE is a warning signal — the hilsa population is dropping. If the fishermen tracked their CPUE systematically, they\'d see the decline years before the population crashes.',
      checkQuestion: 'CPUE has been stable for 5 years. Does this mean the fish population is stable?',
      checkAnswer: 'Not necessarily. If fishing effort INCREASED during those 5 years (more boats, better technology), stable CPUE with increasing effort means the population is DECLINING. True stability requires stable CPUE WITH stable effort. Always look at both numerator (catch) and denominator (effort). A stable CPUE can mask a collapse in progress.',
      codeIntro: 'Track CPUE over time and detect population decline from fishing data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a fishery with declining population
years = np.arange(1990, 2026)
n_years = len(years)

# True population (declining due to overfishing)
K = 10000
r = 0.25
pop = np.zeros(n_years)
pop[0] = K * 0.9

fishing_effort = 100 + 3 * (years - 1990)  # increasing effort (more boats)
fishing_efficiency = 0.001 * (1 + 0.02 * (years - 1990))  # improving technology

catch = np.zeros(n_years)
cpue = np.zeros(n_years)

for t in range(1, n_years):
    growth = r * pop[t-1] * (1 - pop[t-1] / K)
    catch[t-1] = fishing_efficiency[t-1] * fishing_effort[t-1] * pop[t-1]
    pop[t] = max(pop[t-1] + growth - catch[t-1], 100)
    cpue[t-1] = catch[t-1] / fishing_effort[t-1]

catch[-1] = fishing_efficiency[-1] * fishing_effort[-1] * pop[-1]
cpue[-1] = catch[-1] / fishing_effort[-1]

# Intervention at 2010: 65-day fishing ban
ban_year = 2010
ban_idx = ban_year - 1990
for t in range(ban_idx, n_years):
    fishing_effort[t] *= 0.7  # reduced effort due to ban

# Recalculate with ban
pop_ban = np.zeros(n_years)
pop_ban[:ban_idx] = pop[:ban_idx]
catch_ban = catch.copy()
cpue_ban = cpue.copy()

for t in range(ban_idx, n_years):
    growth = r * pop_ban[t-1] * (1 - pop_ban[t-1] / K)
    catch_ban[t] = fishing_efficiency[t] * fishing_effort[t] * pop_ban[t-1] * 0.7
    pop_ban[t] = max(pop_ban[t-1] + growth - catch_ban[t], 100)
    cpue_ban[t] = catch_ban[t] / fishing_effort[t]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Population and CPUE
ax1.set_facecolor('#111827')
ax1_twin = ax1.twinx()
l1 = ax1.plot(years, pop, color='#ef4444', linewidth=2, label='Population (no ban)')
l2 = ax1.plot(years, pop_ban, color='#22c55e', linewidth=2, label='Population (with ban)')
l3 = ax1_twin.plot(years, cpue, color='#ef4444', linewidth=1, linestyle='--', label='CPUE (no ban)')
l4 = ax1_twin.plot(years, cpue_ban, color='#22c55e', linewidth=1, linestyle='--', label='CPUE (with ban)')
ax1.axvline(ban_year, color='#f59e0b', linestyle=':', label='Fishing ban starts')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Population', color='white')
ax1_twin.set_ylabel('CPUE (kg/boat-day)', color='white')
ax1.set_title('Population & CPUE: Effect of Fishing Ban', color='white', fontsize=12)
lines = l1 + l2 + l3 + l4
labels = [l.get_label() for l in lines]
ax1.legend(lines, labels, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')
ax1_twin.tick_params(colors='gray')

# Effort vs CPUE (detecting hyperstability)
ax2.set_facecolor('#111827')
ax2.scatter(fishing_effort[:ban_idx], cpue[:ban_idx], c='#ef4444', s=50, label='Before ban')
ax2.scatter(fishing_effort[ban_idx:], cpue_ban[ban_idx:], c='#22c55e', s=50, label='After ban')
ax2.set_xlabel('Fishing effort (boat-days)', color='white')
ax2.set_ylabel('CPUE (kg/boat-day)', color='white')
ax2.set_title('Effort vs CPUE: Detecting Hyperstability', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

ax2.annotate('CPUE declining with\\nincreasing effort\\n= OVERFISHING', xy=(130, cpue[15]),
             xytext=(140, cpue[15]+3), color='#ef4444', fontsize=9)

plt.tight_layout()
plt.show()

print(f"Without fishing ban (2025): population = {pop[-1]:.0f}, CPUE = {cpue[-1]:.1f}")
print(f"With fishing ban (2025): population = {pop_ban[-1]:.0f}, CPUE = {cpue_ban[-1]:.1f}")
print(f"Ban recovered {(pop_ban[-1] - pop[-1]):.0f} fish ({(pop_ban[-1]/pop[-1]-1)*100:.0f}% improvement)")`,
      challenge: 'Add "hyperstability": fishing efficiency increases by 5% per year instead of 2% (better sonar, GPS). How does this mask the population decline in CPUE data? At what point does the population crash despite stable CPUE?',
      successHint: 'CPUE is the fisherman\'s thermometer — it tells you the health of the fishery before it\'s too late. Bangladesh\'s hilsa management program, guided by CPUE data, is one of the great conservation success stories. The golden hilsa can be saved — the data tells us how.',
    },
    {
      title: 'Sustainable aquaculture — farming the golden hilsa',
      concept: `If we can't catch enough wild hilsa sustainably, can we farm them? **Aquaculture** — farming fish in controlled environments — produces over 50% of the fish humans eat globally.

Hilsa aquaculture challenges:
- Hilsa are anadromous (need both salt and freshwater) — difficult to replicate in farms
- They eat plankton, which is hard to culture at scale
- Spawning in captivity has only recently been achieved (Bangladesh, 2019)
- Genetic diversity must be maintained to avoid domestication bottlenecks

Aquaculture trade-offs:
- **Pro**: reduces pressure on wild stocks
- **Pro**: predictable supply and income for farmers
- **Con**: escaped farm fish can spread disease to wild populations
- **Con**: farm waste (nutrients, antibiotics) pollutes waterways
- **Con**: some aquaculture feeds are made from wild-caught fish (net negative)

The goal is **sustainable aquaculture** that supplements wild fisheries without harming them.`,
      analogy: 'Fish farming is like transitioning from hunting to agriculture. Humans hunted wild animals for millennia before learning to farm them. We are at the same transition point with fish: wild capture is reaching its limits, and farming must fill the gap. But just as early agriculture had problems (soil erosion, monocultures), early aquaculture has growing pains.',
      storyConnection: 'The story ends with the fishermen wondering if the golden hilsa will return next year. Aquaculture offers a partial answer: if we can breed hilsa in captivity, we can ensure supply even if wild populations fluctuate. But the story also warns that farmed fish can never replace the cultural and ecological value of wild hilsa.',
      checkQuestion: 'Salmon aquaculture produces 3 million tons per year. Wild Atlantic salmon populations have crashed. Is aquaculture helping or hurting wild salmon?',
      checkAnswer: 'Both. Helping: it meets demand without additional wild harvest. Hurting: (1) escaped farm salmon interbreed with wild salmon, reducing fitness. (2) Sea lice from farms infect wild juveniles passing nearby. (3) Farm waste degrades habitat. (4) Some salmon feed is made from wild-caught anchovies and sardines. Net assessment: aquaculture is necessary but must be done carefully to avoid undermining the wild populations it is supposed to protect.',
      codeIntro: 'Compare wild fishery yield vs. aquaculture growth trends and project future protein supply.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(1970, 2051)

# Wild capture fisheries (plateaued since 1990s)
wild = 20 + 50 * (1 - np.exp(-0.08 * (years - 1970)))
wild[years > 1995] = wild[years == 1995][0] + np.random.normal(0, 2, np.sum(years > 1995))
wild = np.clip(wild, 0, 100)

# Aquaculture (exponential growth, now surpassing wild)
aqua = 2 * np.exp(0.06 * (years - 1970))
aqua = np.clip(aqua, 0, 200)

# Future projection
future = years > 2024
wild[future] = wild[~future][-1] + np.random.normal(0, 1, np.sum(future))  # flat
aqua[future] = aqua[~future][-1] * (1.03 ** np.arange(np.sum(future)))  # 3% growth

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.stackplot(years, wild, aqua, colors=['#3b82f6', '#22c55e'], alpha=0.7,
              labels=['Wild capture', 'Aquaculture'])
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Production (million tons)', color='white')
ax1.set_title('Global Fish Production: Wild vs Farmed', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.axvline(2024, color='#f59e0b', linestyle=':', label='Now')

# Sustainability metrics
metrics = ['Feed\\nconversion', 'Water\\nuse', 'CO2\\nemissions', 'Land\\nuse', 'Antibiotic\\nuse']
wild_scores = [0, 2, 5, 0, 0]  # 0-10 (lower is better)
aqua_scores = [4, 7, 3, 5, 6]

x = np.arange(len(metrics))
ax2.set_facecolor('#111827')
ax2.bar(x - 0.2, wild_scores, 0.35, color='#3b82f6', label='Wild capture')
ax2.bar(x + 0.2, aqua_scores, 0.35, color='#22c55e', label='Aquaculture')
ax2.set_xticks(x)
ax2.set_xticklabels(metrics, color='gray', fontsize=9)
ax2.set_ylabel('Environmental impact (0-10)', color='white')
ax2.set_title('Environmental Footprint Comparison', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

crossover_year = years[np.argmax(aqua > wild)]
print(f"Aquaculture surpassed wild capture around {crossover_year}")
print(f"2024: Wild={wild[years==2024][0]:.0f}M tons, Aqua={aqua[years==2024][0]:.0f}M tons")
print(f"2050 projection: Wild={wild[-1]:.0f}M tons, Aqua={aqua[-1]:.0f}M tons")
print()
print("Aquaculture is the future of fish protein.")
print("But sustainable aquaculture requires solving feed, waste, and genetic issues.")`,
      challenge: 'Calculate the "fish in, fish out" ratio (FIFO): how many kg of wild fish are used in feed to produce 1 kg of farmed fish? For salmon it is about 1.5:1. For tilapia it is 0.3:1. Which species should aquaculture prioritize?',
      successHint: 'From population dynamics to migration to overfishing to food webs to CPUE to aquaculture — you have traced the golden hilsa from river to plate. The story is about one fish, but the science spans ecology, economics, genetics, and engineering. Saving the hilsa requires all of them working together.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Sustainable Fishing & Marine Biology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for fisheries simulations. Click to start.</p>
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
