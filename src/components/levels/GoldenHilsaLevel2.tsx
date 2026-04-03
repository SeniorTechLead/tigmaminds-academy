import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GoldenHilsaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stock-recruitment models and the Ricker curve',
      concept: `**Stock-recruitment** models predict juvenile fish (recruits) from adult spawners. Two classic models exist:

- **Beverton-Holt**: R = aS/(b+S). Recruitment saturates but never declines. More spawners always means more (or equal) recruits.
- **Ricker**: R = aS*exp(-bS). Recruitment peaks at intermediate stock, then DECREASES due to overcrowding, cannibalism, and oxygen depletion.

For hilsa, the Ricker model fits best because very high spawner density reduces egg survival. There is an optimal spawning stock biomass that maximizes recruitment. Going above it is counterproductive.

The critical concept is the **replacement line**: the minimum recruitment needed to maintain the population. If the Ricker curve drops below the replacement line at low stock sizes, the population faces a **recruitment failure threshold** and can collapse suddenly.`,
      analogy: 'Stock-recruitment is like planting a garden. A few seeds produce a few plants. More seeds produce more. But cram too many seeds into a small bed and they compete for water and light, producing fewer healthy plants than moderate seeding. The Ricker model captures this overcrowding effect exactly.',
      storyConnection: 'The story describes a year when the river was packed with spawning hilsa, yet the next year the catch was poor. This is the Ricker effect: too many spawners competing for limited spawning habitat reduces recruitment. The sweet spot is moderate density with adequate space for each egg.',
      checkQuestion: 'If you double the number of spawning salmon in a river, will you get double the juveniles?',
      checkAnswer: 'Not according to the Ricker model. Doubling spawners beyond the optimal level can DECREASE juveniles due to competition for spawning sites, adults disturbing laid eggs, oxygen depletion, and disease spread. The dome shape of the Ricker curve means there is a clear peak beyond which more spawners means fewer recruits.',
      codeIntro: 'Compare Beverton-Holt and Ricker stock-recruitment models.',
      code: `import numpy as np
import matplotlib.pyplot as plt

stock = np.linspace(0, 1000, 200)

# Beverton-Holt: R = aS/(b+S)
a_bh, b_bh = 5, 200
recruit_bh = a_bh * stock / (b_bh + stock)

# Ricker: R = aS*exp(-bS)
a_r, b_r = 0.02, 0.002
recruit_ricker = a_r * stock * np.exp(-b_r * stock)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(stock, recruit_bh, color='#3b82f6', linewidth=2, label='Beverton-Holt')
ax1.plot(stock, recruit_ricker * 200, color='#22c55e', linewidth=2, label='Ricker (scaled)')
ax1.axvline(1/b_r, color='#f59e0b', linestyle='--', alpha=0.5, label=f'Ricker optimum ({1/b_r:.0f})')
ax1.set_xlabel('Spawning stock', color='white')
ax1.set_ylabel('Recruitment', color='white')
ax1.set_title('Stock-Recruitment Models', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Effect of fishing on Ricker recruitment
ax2.set_facecolor('#111827')
for rate, col, lab in [(0, '#22c55e', '0%'), (0.3, '#3b82f6', '30%'), (0.5, '#f59e0b', '50%'), (0.7, '#ef4444', '70%')]:
    surv = stock * (1 - rate)
    rec = a_r * surv * np.exp(-b_r * surv) * 200
    ax2.plot(stock, rec, color=col, linewidth=2, label=f'Fishing: {lab}')

ax2.set_xlabel('Original stock', color='white')
ax2.set_ylabel('Recruitment', color='white')
ax2.set_title('How Fishing Changes the Ricker Curve', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

opt = 1 / b_r
max_rec = a_r * opt * np.exp(-1) * 200
print(f"Ricker optimal stock: {opt:.0f}")
print(f"Maximum recruitment: {max_rec:.1f}")
print("Moderate fishing can INCREASE recruitment by moving toward the optimum.")
print("Heavy fishing pushes stock below the optimum, crashing recruitment.")`,
      challenge: 'At very high fishing rates (70%+), find the stock level where recruitment drops below the replacement line. This is the point of no return for the fishery.',
      successHint: 'Stock-recruitment models are the mathematical bridge between fishing pressure and population sustainability. The Ricker curve explains why both too many and too few spawners can be problematic.',
    },
    {
      title: 'Age-structured population models with Leslie matrices',
      concept: `Simple models treat all fish identically. But a 5-year-old hilsa produces 10x more eggs than a 1-year-old. **Age-structured models** use Leslie matrices to track each age class.

A Leslie matrix encodes:
- First row: fecundity (offspring per individual at each age)
- Sub-diagonal: survival probability from one age to the next
- The dominant eigenvalue determines population growth rate

Key insight: removing older, more fecund fish (which nets catch because they are bigger) has a disproportionate impact on reproduction. A single large female hilsa may carry 500,000 eggs; a small one carries 50,000. Targeting large fish is like firing a company's most productive employees.`,
      analogy: 'An age-structured population is like a workforce with interns, mid-career employees, and senior executives. Losing one executive hurts more than losing three interns because the executive generates more value. Fishing nets that target large fish selectively remove the most reproductively valuable individuals.',
      storyConnection: 'The old fisherman explains that the big hilsa, the golden ones heavy with eggs, are the most prized and most targeted. But these are the breeding females carrying hundreds of thousands of eggs. Each large female caught represents not one fish lost but potentially thousands of future fish never born.',
      checkQuestion: 'Minimum size limits say keep fish above 25cm. Why not set a MAXIMUM size limit instead?',
      checkAnswer: 'A maximum size limit (slot limit) would protect the most fecund spawners. A 5kg hilsa produces 20x more eggs than a 1kg hilsa. Some fisheries now use slot limits: keep medium fish, release both small (too young) and large (too valuable as spawners). This balances harvest with reproductive protection.',
      codeIntro: 'Build a Leslie matrix model and simulate age-structured population dynamics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Leslie matrix for hilsa (5 age classes)
leslie = np.array([
    [0,    0.01, 0.04, 0.10, 0.16],
    [0.30, 0,    0,    0,    0   ],
    [0,    0.50, 0,    0,    0   ],
    [0,    0,    0.40, 0,    0   ],
    [0,    0,    0,    0.20, 0.10],
])

n0 = np.array([1000, 300, 150, 60, 20])
years = 30

# Unfished
pop_unfished = np.zeros((5, years))
pop_unfished[:, 0] = n0
for t in range(1, years):
    pop_unfished[:, t] = leslie @ pop_unfished[:, t-1]

# Size-selective fishing (50% extra mortality on age 2+)
leslie_f = leslie.copy()
for i in range(2, 5):
    for j in range(5):
        if leslie_f[i, j] > 0 and i != 0:
            leslie_f[i, j] *= 0.5

pop_fished = np.zeros((5, years))
pop_fished[:, 0] = n0
for t in range(1, years):
    pop_fished[:, t] = leslie_f @ pop_fished[:, t-1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

colors_age = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
labels_age = ['Age 0', 'Age 1', 'Age 2', 'Age 3', 'Age 4+']

ax1.set_facecolor('#111827')
ax1.stackplot(range(years), pop_unfished, colors=colors_age, alpha=0.7, labels=labels_age)
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Population', color='white')
ax1.set_title('Unfished Population Age Structure', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper left')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.plot(np.sum(pop_unfished, axis=0), color='#22c55e', linewidth=2, label='Unfished')
ax2.plot(np.sum(pop_fished, axis=0), color='#ef4444', linewidth=2, label='Size-selective fishing')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Total population', color='white')
ax2.set_title('Impact of Targeting Large Fish', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

eig_u = max(np.abs(np.linalg.eigvals(leslie)))
eig_f = max(np.abs(np.linalg.eigvals(leslie_f)))

plt.tight_layout()
plt.show()

print(f"Growth rate (unfished): {eig_u:.3f} ({'growing' if eig_u > 1 else 'declining'})")
print(f"Growth rate (fished): {eig_f:.3f} ({'growing' if eig_f > 1 else 'declining'})")
print("Size-selective fishing removes the most fecund individuals,")
print("shifting the population toward younger, less productive fish.")`,
      challenge: 'Implement a slot limit that only removes age class 2 (medium fish), protecting juveniles (0-1) and large spawners (3-4+). Compare population growth to unrestricted fishing.',
      successHint: 'Age-structured models reveal what simple models miss: not all fish contribute equally to population growth. Protecting large spawners is one of the most impactful management strategies.',
    },
    {
      title: 'Marine protected areas and spillover effects',
      concept: `**Marine Protected Areas (MPAs)** are zones where fishing is restricted or banned. They serve as refuges where fish grow larger, live longer, and produce more eggs.

The magic of MPAs is the **spillover effect**: adult fish and larvae drift from the MPA into surrounding waters, enhancing catches nearby. Bangladesh designated 6 hilsa sanctuaries totaling 350 km of river. Result: hilsa catches INCREASED by 40-60% within 5 years.

MPA design principles:
- Larger MPAs are more effective (>100 km2 ideal)
- Networks of smaller connected MPAs can work too
- No-take zones (all extraction banned) are most effective
- Community involvement in design and enforcement is critical`,
      analogy: 'An MPA is like a seed bank. You set aside part of your field where you never harvest. The plants grow tall, produce seeds, and those seeds blow into harvested areas, replenishing them. The lost yield from the protected area is more than compensated by increased yield in surrounding areas.',
      storyConnection: 'The story resolves with fishermen agreeing to leave a stretch of river unfished during spawning season. This is a seasonal MPA. Combined with spatial protection, it gives the hilsa safe space to reproduce.',
      checkQuestion: 'Fishermen near an MPA complain that the best fishing spots are inside the protected area. Are they right to complain?',
      checkAnswer: 'Short-term: yes, they lose access. Long-term: no. Studies consistently show catches OUTSIDE MPAs increase within 3-5 years due to spillover. The MPA is an investment with short-term cost for long-term gain. Compensation during the transition period is essential for fairness.',
      codeIntro: 'Simulate an MPA with spillover effects on surrounding fishery.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n_cells = 50
years = 30
mpa_start, mpa_end = 20, 30
is_mpa = np.zeros(n_cells, dtype=bool)
is_mpa[mpa_start:mpa_end] = True
K, r = 100, 0.3
fishing_rate = 0.25

pop_no_mpa = np.ones((years, n_cells)) * K * 0.5
pop_mpa = np.ones((years, n_cells)) * K * 0.5

for t in range(1, years):
    for pop, has_mpa in [(pop_no_mpa, False), (pop_mpa, True)]:
        for i in range(n_cells):
            growth = r * pop[t-1, i] * (1 - pop[t-1, i] / K)
            fishing = 0 if (has_mpa and is_mpa[i]) else fishing_rate * pop[t-1, i]
            diffusion = 0
            if i > 0: diffusion += 0.05 * (pop[t-1, i-1] - pop[t-1, i])
            if i < n_cells-1: diffusion += 0.05 * (pop[t-1, i+1] - pop[t-1, i])
            pop[t, i] = max(pop[t-1, i] + growth - fishing + diffusion, 0)

catch_no = fishing_rate * pop_no_mpa[:, ~is_mpa].sum(axis=1)
catch_mpa_arr = fishing_rate * pop_mpa[:, ~is_mpa].sum(axis=1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(range(n_cells), pop_no_mpa[-1], color='#ef4444', linewidth=2, label='No MPA')
ax1.plot(range(n_cells), pop_mpa[-1], color='#22c55e', linewidth=2, label='With MPA')
ax1.axvspan(mpa_start, mpa_end, alpha=0.2, color='#3b82f6', label='MPA zone')
ax1.set_xlabel('Position along coast', color='white')
ax1.set_ylabel('Fish density', color='white')
ax1.set_title(f'Population Distribution at Year {years}', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.plot(catch_no, color='#ef4444', linewidth=2, label='Catch without MPA')
ax2.plot(catch_mpa_arr, color='#22c55e', linewidth=2, label='Catch WITH MPA')
crossover = np.argmax(catch_mpa_arr > catch_no)
if crossover > 0:
    ax2.axvline(crossover, color='#f59e0b', linestyle='--')
    ax2.annotate(f'Crossover: Year {crossover}', xy=(crossover, catch_mpa_arr[crossover]),
                 xytext=(crossover+3, catch_mpa_arr[crossover]+30), color='#f59e0b')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Total catch', color='white')
ax2.set_title('The Paradox: Protection INCREASES Catch', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Year {years}: pop no MPA={pop_no_mpa[-1].sum():.0f}, with MPA={pop_mpa[-1].sum():.0f}")
print(f"Catch no MPA={catch_no[-1]:.0f}, with MPA={catch_mpa_arr[-1]:.0f}")`,
      challenge: 'Vary MPA size from 5 to 25 cells. Plot catch vs MPA size. Is there an optimal MPA size that maximizes surrounding catch? Typically 20-30% of total area is optimal.',
      successHint: 'MPAs are among the most powerful tools in marine conservation. The counter-intuitive result that protecting fish INCREASES total catch makes them a win-win for conservation and fisheries.',
    },
    {
      title: 'Mixed-stock fisheries and genetic identification',
      concept: `Different hilsa populations in different rivers may be genetically distinct **stocks**. A mixed-stock fishery catches fish from multiple stocks simultaneously, which can mask the decline of a vulnerable stock behind the abundance of a healthy one.

Recent genetic studies found Brahmaputra hilsa, Ganges hilsa, and Myanmar hilsa are genetically distinct and should be managed as separate conservation units.

Stock identification methods include microsatellites (DNA markers), otolith chemistry (ear bone mineral analysis), stable isotopes, and parasite load analysis. Without stock-specific data, a fishery manager might set quotas that accidentally drive a small stock to extinction while the total catch looks sustainable.`,
      analogy: 'Stock identification is like wine terroir. Two wines may look identical, but chemical analysis reveals one is from Burgundy and the other from Napa. You cannot manage all wine as just wine, and you cannot manage all hilsa as just hilsa. Each stock has unique characteristics requiring tailored management.',
      storyConnection: 'The fishermen in the story notice some hilsa are slightly different: a deeper gold, different scale patterns. These are not random variations but clues to genetic stock identity. The golden hilsa may belong to a specific river population, and managing that population separately could be key to saving it.',
      checkQuestion: 'A fishery catches 10,000 hilsa. Genetic analysis shows 70% from Stock A (healthy, 50,000 fish) and 30% from Stock B (endangered, 2,000 fish). Is the total catch sustainable?',
      checkAnswer: 'No. Stock B is being decimated: 3,000 fish caught from a population of 2,000 means harvest exceeds the entire stock. The healthy Stock A masks Stock B collapse. Management must account for stock composition or risk losing Stock B entirely.',
      codeIntro: 'Simulate a mixed-stock fishery where one stock masks another\'s decline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
years = 40
K_a, K_b = 50000, 5000
r = 0.25

pop_a = np.zeros(years); pop_b = np.zeros(years)
pop_a[0] = K_a * 0.8; pop_b[0] = K_b * 0.8
catch_a = np.zeros(years); catch_b = np.zeros(years)
fishing_effort = 0.2

for t in range(1, years):
    total = pop_a[t-1] + pop_b[t-1]
    frac_a = pop_a[t-1] / total if total > 0 else 0.5
    target = fishing_effort * total
    catch_a[t] = target * frac_a
    catch_b[t] = target * (1 - frac_a)
    pop_a[t] = max(pop_a[t-1] + r*pop_a[t-1]*(1-pop_a[t-1]/K_a) - catch_a[t], 0)
    pop_b[t] = max(pop_b[t-1] + r*pop_b[t-1]*(1-pop_b[t-1]/K_b) - catch_b[t], 0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(pop_a, color='#22c55e', linewidth=2, label=f'Stock A (K={K_a:,})')
ax1.plot(pop_b * 10, color='#ef4444', linewidth=2, label=f'Stock B x10 (K={K_b:,})')
ax1.plot(pop_a + pop_b, '--', color='white', linewidth=1, label='Total (what managers see)')
ax1.set_xlabel('Year', color='white'); ax1.set_ylabel('Population', color='white')
ax1.set_title('Hidden Decline: Stock B Collapses Unnoticed', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.stackplot(range(years), catch_a, catch_b, colors=['#22c55e', '#ef4444'], alpha=0.7,
              labels=['Catch from A', 'Catch from B'])
ax2.plot(catch_a + catch_b, color='white', linewidth=2, label='Total catch')
ax2.set_xlabel('Year', color='white'); ax2.set_ylabel('Catch', color='white')
ax2.set_title("Total Catch Hides Stock B's Collapse", color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Year {years-1}: Stock A={pop_a[-1]:,.0f} ({pop_a[-1]/K_a*100:.0f}% of K)")
print(f"  Stock B={pop_b[-1]:,.0f} ({pop_b[-1]/K_b*100:.0f}% of K)")
print("Without genetic monitoring, Stock B extinction is invisible.")`,
      challenge: 'Add genetic monitoring: every 5 years, test 100 fish for stock identity. When Stock B drops below 10% of catch, implement a targeted closure. How early must intervention happen to save Stock B?',
      successHint: 'Mixed-stock fisheries are one of the most dangerous blind spots in management. Genetic stock identification turns a single fishery into distinct populations, each needing its own management.',
    },
    {
      title: 'Climate change impacts on hilsa fisheries',
      concept: `Climate change reshapes fish ecosystems through:
- **Temperature rise**: warmer water increases metabolism but not food supply, so fish grow faster but smaller
- **Ocean acidification**: CO2 lowers seawater pH, disrupting fish behavior
- **Changed monsoon timing**: disrupts migration cues for anadromous fish like hilsa
- **Sea level rise**: saltwater intrusion reduces freshwater spawning habitat
- **Hypoxia**: warmer water holds less dissolved oxygen, creating dead zones

For hilsa specifically, monsoon timing changes disrupt migration. Sea level rise pushes spawning grounds further upstream. The hilsa migration is finely tuned to monsoon floods; disrupting the monsoon disrupts the entire reproductive cycle.`,
      analogy: 'Climate change for fish is like turning up the thermostat in a house with no AC. First mildly uncomfortable (increased metabolism), then unbearable (thermal stress), eventually some rooms become uninhabitable (dead zones). Fish can only move to cooler rooms (poleward migration), but tropical freshwater species have nowhere to go.',
      storyConnection: 'The elders notice hilsa arrive later each year, the monsoon is less predictable, the river runs lower. These observations match climate projections. The golden hilsa migration is tuned to monsoon timing, and disrupting the monsoon disrupts the fish.',
      checkQuestion: 'Tropical freshwater fish cannot easily migrate to cooler habitats unlike ocean fish that shift poleward. What are their options?',
      checkAnswer: 'Very few: move to deeper cooler water (limited in shallow rivers), shift to higher-elevation tributaries (smaller, less food), adjust behavior (nocturnal activity), or adapt genetically (too slow for current change rates). Tropical freshwater species are among the most climate-vulnerable organisms on Earth.',
      codeIntro: 'Model temperature effects on hilsa growth and project population under climate scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

temp = np.linspace(15, 40, 200)
t_opt = 28
growth = np.exp(-((temp - t_opt) / 6) ** 2)
metabolism = 2.3 ** ((temp - 20) / 10)
metabolism /= metabolism[np.argmin(np.abs(temp - 28))]
net = growth - 0.5 * metabolism

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(temp, growth, color='#22c55e', linewidth=2, label='Growth rate')
ax1.plot(temp, metabolism, color='#ef4444', linewidth=2, label='Metabolic cost')
ax1.plot(temp, np.clip(net / max(net), 0, 1), color='#f59e0b', linewidth=2, label='Net energy')
ax1.axvspan(t_opt-3, t_opt+3, alpha=0.1, color='#22c55e')
for yr, t_add, col in [('Now', 0, '#3b82f6'), ('2050', 2, '#f59e0b'), ('2100', 4, '#ef4444')]:
    ax1.axvline(28 + t_add, color=col, linestyle='--', alpha=0.7, label=f'{yr} ({28+t_add}C)')
ax1.set_xlabel('Water temperature (C)', color='white')
ax1.set_ylabel('Relative rate', color='white')
ax1.set_title('Thermal Performance Curve', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

yrs = np.arange(2025, 2101)
scenarios = {'Stable': 28*np.ones(76), 'RCP 4.5': 28+2*(yrs-2025)/75, 'RCP 8.5': 28+4*(yrs-2025)/75}
ax2.set_facecolor('#111827')
for (nm, ts), col in zip(scenarios.items(), ['#22c55e', '#f59e0b', '#ef4444']):
    pop = [10000]
    for tv in ts[1:]:
        idx = np.argmin(np.abs(temp - tv))
        r_eff = 0.25 * growth[idx] * min(1, max(0, net[idx]/max(net)))
        pop.append(max(pop[-1]*(1 + r_eff*(1 - pop[-1]/15000) - 0.1), 0))
    ax2.plot(yrs, pop, color=col, linewidth=2, label=nm)
ax2.set_xlabel('Year', color='white'); ax2.set_ylabel('Population', color='white')
ax2.set_title('Hilsa Population Under Climate Scenarios', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate projections for hilsa:")
for nm, ts in scenarios.items():
    idx = np.argmin(np.abs(temp - ts[-1]))
    print(f"  {nm}: temp={ts[-1]:.1f}C, growth factor={growth[idx]:.2f}")`,
      challenge: 'Add monsoon disruption: in RCP 8.5, monsoon arrives 2 weeks later each decade, reducing spawning success by 5% per decade. How does this compound with temperature effects?',
      successHint: 'Climate change makes every other threat to the golden hilsa worse. Overfishing plus habitat loss plus climate change creates a triple crisis that demands integrated management addressing all three simultaneously.',
    },
    {
      title: 'Bayesian stock assessment under uncertainty',
      concept: `Traditional fisheries models assume we know exact parameter values. **Bayesian methods** quantify uncertainty by computing probability distributions rather than point estimates.

Bayes' theorem: P(model|data) = P(data|model) * P(model) / P(data)

Instead of "the population is 50,000," Bayesian analysis gives "the population is 50,000 plus or minus 15,000 with 95% confidence." This lets managers set quotas based on risk tolerance: "set the quota so there is only a 5% chance of overfishing."

As more data arrives (catch records, surveys), the posterior distribution narrows. Bayesian stock assessment is now the global standard for major fisheries agencies.`,
      analogy: 'Bayesian analysis is like a doctor refining a diagnosis. Before tests (prior): 30% chance of condition X. After blood test (data): 75% chance. After MRI: 95% chance. Each piece of evidence updates the probability. Fisheries assessment works identically with each year of catch data.',
      storyConnection: 'The fishermen disagree about how many hilsa remain. Bayesian analysis combines their estimates (priors) with catch data (likelihood) to produce a rigorous, uncertainty-quantified assessment. The truth usually lies between the optimists and pessimists, and Bayesian methods find it.',
      checkQuestion: 'A model says 20% chance the population is below the safe threshold. Should restrictions be imposed?',
      checkAnswer: 'Consider the asymmetry: if the population IS below threshold and you do nothing, it collapses (catastrophic, irreversible). If it is NOT below threshold and you restrict, fishermen lose income temporarily (costly but reversible). A 20% risk of irreversible collapse justifies precautionary restrictions. This is the precautionary principle.',
      codeIntro: 'Implement a simplified Bayesian stock assessment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
true_pop = 6000
prior_mean, prior_std = 8000, 3000
n_obs = 15
observed = true_pop/10000*10 + np.random.normal(0, 1.5, n_obs)
observed = np.clip(observed, 0.5, 15)

pop_range = np.linspace(1000, 15000, 500)
prior = np.exp(-0.5*((pop_range-prior_mean)/prior_std)**2)
prior /= prior.sum()

def lik(data, N):
    exp_cpue = N/10000*10
    return np.prod(np.exp(-0.5*((data-exp_cpue)/1.5)**2))

likes = np.array([lik(observed, N) for N in pop_range])
likes /= likes.sum()
posterior = prior * likes
posterior /= posterior.sum()

more = true_pop/10000*10 + np.random.normal(0, 1.5, 10)
all_data = np.concatenate([observed, more])
likes2 = np.array([lik(all_data, N) for N in pop_range])
likes2 /= likes2.sum()
post2 = prior * likes2
post2 /= post2.sum()

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(pop_range, prior*500, color='#3b82f6', linewidth=2, label='Prior')
ax1.plot(pop_range, posterior*500, color='#f59e0b', linewidth=2, label='15 observations')
ax1.plot(pop_range, post2*500, color='#22c55e', linewidth=2, label='25 observations')
ax1.axvline(true_pop, color='#ef4444', linestyle='--', linewidth=2, label=f'True: {true_pop:,}')
ax1.set_xlabel('Population estimate', color='white')
ax1.set_ylabel('Probability', color='white')
ax1.set_title('Bayesian Updating', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

thresh = 5000
risks = [prior[pop_range<thresh].sum()*100, posterior[pop_range<thresh].sum()*100, post2[pop_range<thresh].sum()*100]
ax2.set_facecolor('#111827')
bars = ax2.bar(['Prior', '15 obs', '25 obs'], risks, color=['#3b82f6','#f59e0b','#22c55e'], width=0.5)
ax2.axhline(20, color='#ef4444', linestyle='--', label='20% risk threshold')
ax2.set_ylabel('P(pop < 5000) %', color='white')
ax2.set_title('Risk Assessment Improves with Data', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
for b, v in zip(bars, risks):
    ax2.text(b.get_x()+b.get_width()/2, v+1, f'{v:.1f}%', ha='center', color='white')

plt.tight_layout()
plt.show()

pm = np.average(pop_range, weights=post2)
ps = np.sqrt(np.average((pop_range-pm)**2, weights=post2))
print(f"Prior: {prior_mean:,} +/- {prior_std:,}")
print(f"Posterior (25 obs): {pm:,.0f} +/- {ps:,.0f}")
print(f"True: {true_pop:,}")`,
      challenge: 'Start with a very wrong prior (mean=12,000 when true is 6,000). How many observations are needed before the posterior converges to the truth? This shows Bayesian analysis overcomes initial bias given enough data.',
      successHint: 'Bayesian methods transform uncertainty from a paralyzing unknown into a quantified, manageable risk. For the golden hilsa, this means decisions based on evidence and probability rather than guesswork and politics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Marine Biology & Fisheries Science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced fisheries models. Click to start.</p>
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
