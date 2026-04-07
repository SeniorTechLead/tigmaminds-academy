import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BlackDeathLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stochastic epidemic simulation — individual-based modelling',
      concept: `The SEIR model from Level 2 uses **deterministic** equations — given the same inputs, you always get the same output. But real epidemics are **stochastic** (random): whether a particular flea bites a particular person is a coin flip, not a certainty.

An **individual-based model (IBM)** simulates each person as a separate entity with their own state (S, E, I, R), contacts, and random events. At each time step, each infected person has a *probability* of transmitting to each of their contacts — not a certainty.

This matters for two critical phenomena that deterministic models miss:
- **Stochastic extinction**: when the number of infected is small (start of an epidemic), random chance can kill the outbreak before it takes off. A single infected merchant might recover without infecting anyone.
- **Superspreader events**: one person at a crowded market might infect 30 people, while another infected person isolating at home infects zero.

The key insight: **small numbers are noisy**. When 10,000 are infected, the SEIR model is accurate. When 3 are infected, randomness dominates. The early phase of every epidemic is a stochastic race between transmission and recovery.

📚 *Individual-based models are computationally expensive (you simulate every person) but capture phenomena that aggregate models miss. Modern epidemic forecasting uses hybrid approaches: IBM for early stages, SEIR for large-scale dynamics.*`,
      analogy: 'The SEIR model is like predicting election results from polling averages — accurate for large populations. The individual-based model is like simulating each voter\'s decision with a coin flip weighted by their preferences. For a national election, both give similar results. For a local election with 20 voters, the coin-flip model captures uncertainty that the average cannot.',
      storyConnection: 'The Black Death didn\'t spread uniformly — some villages were annihilated while neighbouring ones were untouched. The village of Eyam in Derbyshire famously quarantined itself in 1665-66, and even within that small population, transmission was highly stochastic: some households lost every member while adjacent houses were spared entirely. Only an individual-based model can reproduce this patchy, unpredictable pattern.',
      checkQuestion: 'If an infected person has a 10% chance of transmitting to each of their 15 contacts, what is the probability they infect ZERO people?',
      checkAnswer: 'P(zero infections) = (1 - 0.10)^15 = 0.90^15 = 0.206 — about 21%. So roughly 1 in 5 infected people infect nobody at all, even with 15 contacts and 10% transmission probability. This is stochastic extinction at the individual level — and it\'s why many potential outbreaks fizzle before they start.',
      codeIntro: 'Build an individual-based stochastic epidemic model and run multiple simulations to see the range of possible outcomes.',
      code: `import numpy as np

np.random.seed(42)

def stochastic_epidemic(n_people=5000, n_initial=3, p_transmit=0.03,
                         avg_contacts=12, incubation=4, infectious=7, n_days=150):
    """Individual-based stochastic SEIR model."""
    state = np.array(["S"] * n_people, dtype="U1")
    day_entered = np.zeros(n_people, dtype=int)

    contacts = []
    for i in range(n_people):
        n_c = max(1, int(np.random.poisson(avg_contacts)))
        c = np.random.choice(n_people, min(n_c, n_people - 1), replace=False)
        contacts.append(c[c != i])

    seeds = np.random.choice(n_people, n_initial, replace=False)
    for s in seeds:
        state[s] = "I"; day_entered[s] = 0

    daily_I = []
    for day in range(1, n_days + 1):
        for e in np.where(state == "E")[0]:
            if day - day_entered[e] >= incubation: state[e] = "I"
        for inf in np.where(state == "I")[0]:
            if day - day_entered[inf] >= incubation + infectious: state[inf] = "R"
        for inf in np.where(state == "I")[0]:
            for c in contacts[inf]:
                if state[c] == "S" and np.random.random() < p_transmit:
                    state[c] = "E"; day_entered[c] = day

        current_I = np.sum(state == "I")
        daily_I.append(current_I)
        if current_I == 0 and np.sum(state == "E") == 0 and day > 10:
            break

    total_infected = np.sum((state == "I") | (state == "R"))
    peak_I = max(daily_I) if daily_I else 0
    peak_day = daily_I.index(peak_I) + 1 if peak_I > 0 else 0
    return total_infected, peak_I, peak_day

n_runs = 30
results = []
for run in range(n_runs):
    total, peak, peak_d = stochastic_epidemic()
    results.append({"total": total, "peak": peak, "peak_day": peak_d})

totals = np.array([r["total"] for r in results])
fizzled = np.sum(totals < 50)

print("=== Stochastic Epidemic Simulation (Individual-Based) ===")
print(f"Population: 5,000 | Initial infected: 3 | {n_runs} runs\\n")
print(f"{'Run':>4} {'Total Infected':>15} {'Peak':>8} {'Peak Day':>10} {'Outcome':>12}")
print("-" * 51)
for i, r in enumerate(results[:10]):
    outcome = "FIZZLED" if r["total"] < 50 else "EPIDEMIC"
    print(f"{i+1:>4} {r['total']:>14,} {r['peak']:>7,} {r['peak_day']:>8} {outcome:>12}")

print(f"\\n=== Summary ({n_runs} runs) ===")
print(f"  Fizzled: {fizzled}/{n_runs} ({fizzled/n_runs*100:.0f}%)")
epidemic_totals = totals[totals >= 50]
if len(epidemic_totals) > 0:
    print(f"  Epidemic median: {np.median(epidemic_totals):,.0f} infected")
    print(f"  Range: {epidemic_totals.min():,} - {epidemic_totals.max():,}")
print(f"\\n{fizzled/n_runs*100:.0f}% of introductions fizzled — the SEIR model misses this.")`,
      challenge: 'Increase the initial infected from 3 to 20 (a whole ship crew). How does this change the fizzle rate? With more initial infections, stochastic extinction becomes unlikely — explaining why the Black Death, arriving on ships with many infected sailors AND thousands of infected fleas, almost never fizzled out in port cities.',
      successHint: 'Individual-based models are the gold standard in computational epidemiology. They were used to model COVID-19 school reopenings, Ebola containment strategies, and influenza pandemic planning. The key advantage over SEIR: they capture the stochastic variability that determines whether an introduction becomes a pandemic or fizzles out.',
    },
    {
      title: 'Spatial epidemic modelling — 2D lattice with local transmission',
      concept: `Epidemics don't just move through contact networks — they move through **physical space**. Plague spread outward from Messina like a wave, reaching Florence in 3 months, Paris in 6 months, and London in 12 months. The speed of spread depended on distance, trade routes, and geography.

A **spatial model** places people on a 2D grid (lattice) where infection can only pass to nearby cells. This produces **travelling waves** of infection — a spatial pattern the non-spatial SEIR model cannot capture.

Key parameters for spatial spread:
- **Local transmission radius**: how far the disease can jump in one time step (for plague: flea jumping distance ~1 m, but rat travel can extend this to ~100 m)
- **Long-range transmission**: rare events where the disease jumps far (a merchant travels to a distant city, seeding a new focus)
- **Barriers**: rivers, mountains, or quarantine cordons that block spread

The spatial model reveals why the Black Death took 6 years to cross Europe (not 6 weeks) — it spread as a wave front at the speed of rat and human travel, not instantaneously.

📚 *Spatial epidemiology — mapping where disease occurs and how it spreads through space — is one of the oldest branches of epidemiology. John Snow's 1854 cholera map of London (plotting cases around the Broad Street pump) is the founding document of modern epidemiology.*`,
      analogy: 'Drop a pebble in still water. The ripple spreads outward in a circle — fast at first, then slowing. An epidemic on a 2D lattice spreads the same way: a circular wave front expanding outward from the source. Barriers (like a seawall) block the wave on one side. Long-range jumps (like a second pebble) create new wave centres far away.',
      storyConnection: 'The Black Death entered Europe at Messina (Sicily) in October 1347. By spring 1348 it had reached Florence and Venice. By summer 1348, Paris and London. By 1350, Scandinavia. By 1353, Moscow. The spatial pattern is a classic travelling wave, modified by trade routes (long-range jumps) and geography (mountain barriers delayed spread).',
      checkQuestion: 'If the plague wave front moves at 2 km per day overland, how long does it take to cross the 1,000 km from Marseille to Paris?',
      checkAnswer: '1,000 / 2 = 500 days ≈ 16 months. Historical records show plague reached Paris about 10-12 months after Marseille — faster than pure overland spread because merchants carried it along river routes (the Rhone and Seine), creating long-range jumps that accelerated the wave front.',
      codeIntro: 'Simulate plague spreading across a 2D grid representing a medieval landscape, with local transmission and long-range trade jumps.',
      code: `import numpy as np

np.random.seed(42)

def spatial_epidemic(grid_size=50, n_days=100, p_local=0.3,
                      p_longrange=0.002, recovery_days=10, barriers=None):
    """2D lattice epidemic: 0=susceptible, 1=infected, 2=recovered."""
    grid = np.zeros((grid_size, grid_size), dtype=int)
    day_infected = np.full((grid_size, grid_size), -1, dtype=int)
    grid[grid_size - 2, 2] = 1
    day_infected[grid_size - 2, 2] = 0
    if barriers:
        for r, c in barriers:
            grid[r, c] = -1

    daily_infected = []
    for day in range(1, n_days + 1):
        new_inf = []
        for r, c in np.argwhere(grid == 1):
            if day - day_infected[r, c] >= recovery_days:
                grid[r, c] = 2; continue
            for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                nr, nc = r+dr, c+dc
                if 0 <= nr < grid_size and 0 <= nc < grid_size:
                    if grid[nr,nc] == 0 and np.random.random() < p_local:
                        new_inf.append((nr, nc))
            if np.random.random() < p_longrange:
                jr, jc = np.random.randint(0, grid_size, 2)
                if grid[jr, jc] == 0: new_inf.append((jr, jc))
        for nr, nc in new_inf:
            if grid[nr,nc] == 0:
                grid[nr,nc] = 1; day_infected[nr,nc] = day
        daily_infected.append(np.sum(grid == 1))
    return daily_infected

daily_open = spatial_epidemic()
barrier_cells = [(25, c) for c in range(10, 40)]
daily_barrier = spatial_epidemic(barriers=barrier_cells)

print("=== Spatial Epidemic Model (50×50 grid) ===")
print(f"Source: bottom-left corner (port city)\\n")

for label, data in [("Open terrain", daily_open), ("With barrier", daily_barrier)]:
    peak = max(data)
    peak_day = data.index(peak) + 1
    total = sum(1 for d in data if d > 0)
    print(f"{label}: peak = {peak:,} cells on day {peak_day}, active for {total} days")

delay = daily_barrier.index(max(daily_barrier)) - daily_open.index(max(daily_open))
print(f"\\nBarrier delayed peak by {delay} days.")
print("Barriers slow but don't stop the wave — plague goes around")
print("or jumps over via long-range trade transmission.")`,
      challenge: 'Add a second seed point (a second port city) in the top-right corner, infected on day 30. This models the Black Death entering Europe through multiple ports simultaneously. How does the two-front invasion change the time to full coverage? This is exactly what happened: plague entered through Messina, Genoa, Venice, and Marseille nearly simultaneously.',
      successHint: 'Spatial epidemic models are used to plan quarantine cordons, predict wildfire spread, model invasive species expansion, and simulate the spread of information on social media. The travelling-wave pattern you observed — outward expansion from a point source with long-range jumps — is a universal phenomenon in spatially-extended systems.',
    },
    {
      title: 'Economic modelling — labour shortage, wage increase, and feudalism decline',
      concept: `The Black Death killed 30-60% of Europe's population in 6 years. The immediate demographic catastrophe triggered a cascade of **economic consequences** that fundamentally restructured European society:

1. **Labour supply collapse**: with half the workers dead, surviving labourers became scarce
2. **Wage explosion**: scarcity drives up prices — including the price of labour (wages). English agricultural wages doubled within a decade of 1348
3. **Land surplus**: with fewer people, marginal farmland was abandoned. Per-capita land holdings increased
4. **Feudalism decline**: serfs who had been bound to land could now demand wages, move freely, and negotiate terms — lords who refused lost their workers to those who paid more
5. **Innovation pressure**: expensive labour incentivised labour-saving technology (water mills, improved ploughs, enclosure)

This is a **macroeconomic model**: supply and demand for labour, mediated by population change. The mathematics: wages are proportional to the marginal product of labour, which increases when the labour-to-land ratio decreases (fewer workers on the same amount of land means each worker is more productive and more valuable).

📚 *The Malthusian model predicts that population growth eventually outstrips food production, causing famine and population decline. The Black Death was an exogenous shock that achieved the same "population reduction" — but via epidemic rather than famine — resetting the Malthusian cycle and triggering centuries of improved living standards.*`,
      analogy: 'Imagine a company with 100 employees suddenly losing 40 to a competitor. The remaining 60 can demand higher salaries, better conditions, and more autonomy — because the company desperately needs them and can\'t easily replace them. The employees who stay become more valuable precisely because so many left. This is exactly what happened to European labourers after 1348.',
      storyConnection: 'In England, the Statute of Labourers (1351) tried to freeze wages at pre-plague levels — a direct government response to the wage explosion. It failed completely. Peasant mobility increased, the Peasants\' Revolt of 1381 demanded an end to serfdom, and by 1500, feudal labour obligations had effectively disappeared in Western Europe. The Black Death didn\'t just kill people — it killed feudalism.',
      checkQuestion: 'If the population drops by 40% but the amount of farmland stays the same, what happens to output per worker?',
      checkAnswer: 'Each surviving worker now has more land to farm (land per worker increases by 67%: from L/N to L/0.6N). Due to diminishing returns, output per worker doesn\'t increase by 67% — but it does increase significantly. With a typical agricultural production function (Y = A × L^0.4 × N^0.6), output per worker increases by about 45%. This is why wages rose — each worker produced more and could demand a share of that increased output.',
      codeIntro: 'Model the economic cascade: population collapse to wage increase to feudalism decline, using a simple macroeconomic framework.',
      code: `import numpy as np

def marginal_product(land, labour, alpha=0.4):
    """Wage = dY/dN = (1-alpha) * (Land/Labour)^alpha"""
    return (1 - alpha) * (land / labour) ** alpha

land = 100; pop_1340 = 100
base_wage = marginal_product(land, pop_1340)

print("=== Black Death Economic Impact Model ===")
print(f"Production: Y = Land^0.4 × Labour^0.6\\n")
print(f"{'Mortality':>10} {'Pop':>5} {'Wage Index':>11} {'Land/Worker':>12}")
print("-" * 40)

for mort in [0.0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60]:
    pop = pop_1340 * (1 - mort)
    wage = marginal_product(land, pop)
    land_per = land / pop
    print(f"{mort*100:>8.0f}% {pop:>4.0f} {wage/base_wage*100:>9.0f}% "
          f"{land_per/(land/pop_1340)*100:>10.0f}%")

print("\\n=== 200-Year Post-Plague Trajectory ===")
print(f"{'Year':>6} {'Pop':>5} {'Wage':>7} {'Serfdom':>9} {'Innovation':>11}")
print("-" * 40)

pop = 60.0  # 40% mortality
for year_offset in range(0, 201, 25):
    year = 1348 + year_offset
    if year_offset > 0:
        pop = min(pop * (1.005) ** 25, 120)
    wage_idx = marginal_product(land, pop) / base_wage * 100
    serfdom = max(0, 100 - (wage_idx - 100) * 1.5)
    innovation = min(100, 20 + (wage_idx - 100) * 0.8)
    print(f"{year:>6} {pop:>4.0f} {wage_idx:>5.0f}% {serfdom:>7.0f}% {innovation:>9.0f}%")

print(f"\\n40% mortality → wages double → feudalism collapses in 2 generations.")
print(f"Population takes ~150 years to recover → sustained high wages.")`,
      challenge: 'Model the Eastern European case, where feudalism STRENGTHENED after the plague (the "second serfdom"). In the East, lords had enough political power to force serfs to stay. Add a "lord power index" that, when high, suppresses wage increases and maintains serfdom despite labour scarcity. This explains the economic divergence between Western and Eastern Europe after 1348.',
      successHint: 'You just modelled one of the most important economic transitions in history using a Cobb-Douglas production function — the same framework economists use to analyse GDP, wage policy, and immigration impacts today. The Black Death is a natural experiment in what happens when labour supply drops suddenly — and the economics are clear: scarce labour becomes expensive labour.',
    },
    {
      title: 'Comparative pandemics — plague vs smallpox vs COVID-19',
      concept: `History offers multiple "natural experiments" in pandemic dynamics: the Black Death (1347-1353), smallpox in the Americas (1520+), the 1918 influenza, and COVID-19 (2020+). Each had different pathogens, transmission routes, and mortality patterns — but the same underlying epidemic mathematics.

Comparing pandemics reveals which parameters matter most:

| Parameter | Plague | Smallpox | 1918 Flu | COVID-19 |
|-----------|--------|----------|----------|----------|
| R0 | 2-6 | 5-7 | 2-3 | 2-10 |
| CFR | 40-90% | 30% | 2-3% | 0.5-1% |
| Incubation | 2-6 days | 10-14 days | 1-4 days | 2-14 days |
| Transmission | Flea/airborne | Airborne | Airborne | Airborne |

The mathematical framework is the same — SEIR dynamics — but the parameter values produce radically different outcomes. Plague's high CFR means it burns out quickly (kills hosts before they transmit much). COVID-19's low CFR but high R0 means it spreads widely because most people survive to transmit.

📚 *The Case Fatality Rate (CFR) and R0 together determine a pandemic's total impact. High R0 + low CFR = widespread but survivable (COVID). Low R0 + high CFR = contained but devastating (Ebola). High R0 + high CFR = civilisation-threatening (pneumonic plague, hypothetical engineered pathogen).*`,
      analogy: 'Compare a house fire (high "mortality" — destroys everything it touches, but spreads slowly and is contained to one building) with a slow gas leak (low immediate danger but spreads through the entire building before anyone notices). Plague is the house fire — devastating but localised. COVID is the gas leak — subtle but pervasive. Both are dangerous, but they require completely different response strategies.',
      storyConnection: 'The Black Death killed 30-60% of Europe\'s population. Smallpox killed 90% of the indigenous American population after 1492. The 1918 flu killed 50-100 million worldwide. COVID-19 killed 7+ million officially (20+ million estimated). Each pandemic reshaped the world — but the mechanisms, response options, and outcomes were strikingly different. Understanding these differences is essential for preparing for the next pandemic.',
      checkQuestion: 'Why did smallpox kill 90% of the indigenous American population but only 30% of Europeans exposed to it?',
      checkAnswer: 'Europeans had co-evolved with smallpox for millennia — those most susceptible had been selected out over generations, and partial immunity existed from childhood exposure. Indigenous Americans had zero prior exposure, no genetic adaptation, and no partial immunity. When a fully susceptible population encounters a high-R0 pathogen, the attack rate approaches 100% and the CFR reflects the full virulence of the disease.',
      codeIntro: 'Run SEIR simulations for four historical pandemics side-by-side and compare their epidemic curves and total impact.',
      code: `import numpy as np

def seir_simulate(N, I0, R0_val, incubation, infectious, cfr, days=365):
    """Run SEIR simulation, return summary."""
    beta, sigma, gamma, dt = R0_val/infectious, 1/incubation, 1/infectious, 0.1
    S, E, I, R = float(N-I0), 0.0, float(I0), 0.0
    peak_I, peak_day = 0, 0
    for step in range(int(days/dt)):
        dS = -beta*S*I/N*dt; dE = (beta*S*I/N - sigma*E)*dt
        dI = (sigma*E - gamma*I)*dt; dR = gamma*I*dt
        S += dS; E += dE; I += dI; R += dR
        if I > peak_I: peak_I = I; peak_day = step*dt
    total = N - S
    return {"attack": total/N, "dead": total*cfr, "peak_day": peak_day, "peak_I": peak_I}

pandemics = [
    ("Black Death (bubonic)",   4.0, 4,  7,  0.50),
    ("Black Death (pneumonic)", 6.0, 2,  5,  0.95),
    ("Smallpox (Americas)",     5.5, 12, 14, 0.30),
    ("1918 Influenza",          2.5, 2,  5,  0.025),
    ("COVID-19 (Delta)",        6.0, 5,  10, 0.008),
    ("COVID-19 (Omicron)",     10.0, 3,  7,  0.003),
    ("Ebola",                   1.8, 10, 10, 0.50),
]

N = 100_000
print("=== Comparative Pandemic Simulation (pop 100,000) ===\\n")
print(f"{'Pandemic':<26} {'R0':>4} {'CFR':>6} {'Attack%':>8} {'Deaths':>8} {'Peak Day':>9}")
print("-" * 63)
for name, r0, inc, inf, cfr in pandemics:
    r = seir_simulate(N, 10, r0, inc, inf, cfr)
    print(f"{name:<26} {r0:>3.1f} {cfr*100:>4.1f}% {r['attack']*100:>6.1f}% "
          f"{r['dead']:>7,.0f} {r['peak_day']:>7.0f}")

print("\\n=== Danger Matrix (deaths per 100k) ===")
print(f"{'':>8}", end="")
for cfr in [0.01, 0.05, 0.10, 0.30, 0.50]:
    print(f" CFR{cfr*100:>3.0f}%", end="")
print()
for r0 in [1.5, 2.0, 3.0, 5.0, 8.0]:
    print(f"R0={r0:>3.1f}", end="")
    for cfr in [0.01, 0.05, 0.10, 0.30, 0.50]:
        r = seir_simulate(N, 10, r0, 4, 7, cfr)
        print(f" {r['dead']:>7,.0f}", end="")
    print()

print("\\nHigh R0 + high CFR = civilisation-ending (top-right corner).")
print("The Black Death sat squarely in the danger zone.")`,
      challenge: 'Add a "medical intervention" modifier: for modern pandemics, reduce the CFR by 50% (simulating hospitals, antivirals, ventilators). How much does this change the death toll? For medieval plague, no medical intervention existed — the CFR was the raw biological lethality. This comparison quantifies how much modern medicine actually matters vs epidemic containment.',
      successHint: 'Comparative pandemic analysis is how public health agencies prepare for future threats. The WHO maintains a list of "priority pathogens" rated by R0 and CFR — the same two parameters you just explored. Understanding the danger matrix (R0 vs CFR) is essential for evaluating pandemic preparedness policies.',
    },
    {
      title: 'Vaccine and intervention optimisation — minimising deaths with limited resources',
      concept: `During a pandemic, resources are always limited: not enough vaccines, not enough hospital beds, not enough contact tracers. The question becomes: **how do you allocate limited resources to minimise total deaths?**

This is an **optimisation problem** with constraints:
- **Vaccine allocation**: vaccinate the elderly (highest mortality) or essential workers (highest contact rate)?
- **Quarantine allocation**: quarantine infected individuals (reducing transmission) or vulnerable populations (reducing mortality)?
- **Hospital allocation**: treat the sickest (highest individual benefit) or the most contagious (highest population benefit)?

The optimal strategy depends on the disease parameters. For high-CFR diseases (plague), protecting the vulnerable saves the most lives. For high-R0 diseases (COVID), reducing transmission saves the most lives. For diseases that are both (pneumonic plague), you need BOTH strategies simultaneously.

📚 *Resource allocation in epidemics is a branch of operations research — the same mathematics used to schedule airlines, allocate server capacity, and plan military logistics. The core technique: maximise an objective function (lives saved) subject to constraints (limited resources).*`,
      analogy: 'Imagine fighting a forest fire with limited water. You can spray water on the fire front (reduce spread), spray it on buildings (reduce damage), or create firebreaks (quarantine). The optimal strategy depends on the fire: a slow fire near houses → protect buildings. A fast fire in open land → slow the front. Limited water forces you to choose — and the wrong choice costs lives.',
      storyConnection: 'Medieval cities tried every intervention they could think of: quarantine (Venice invented the 40-day "quarantina"), cordon sanitaire (Milan sealed its gates), flight (the wealthy fled to the countryside), and prayer (flagellant processions). Some worked (quarantine, cordons) and some made things worse (flagellant processions spread plague between cities). Data-driven resource allocation would have saved millions of lives.',
      checkQuestion: 'You have 10,000 vaccine doses and a city of 50,000. The elderly (5,000 people) have 10× mortality but low contact rates. Essential workers (10,000 people) have normal mortality but 3× contact rates. Who should you vaccinate first?',
      checkAnswer: 'It depends on whether you\'re minimising deaths or minimising infections. To minimise deaths: vaccinate the elderly (highest per-person benefit). To minimise total infections (and thus total deaths indirectly): vaccinate essential workers (highest transmission reduction). For most real pandemics, vaccinating high-contact individuals first minimises TOTAL deaths because reducing transmission protects everyone — including the unvaccinated elderly.',
      codeIntro: 'Model different intervention strategies and find the optimal resource allocation for a plague-like epidemic.',
      code: `import numpy as np

np.random.seed(42)

def simulate_intervention(N=50000, R0_val=4.0, cfr=0.40,
                           vax_doses=0, vax_target="none",
                           quarantine=0.0, hospital=False):
    """Age-structured SEIR with interventions."""
    beta, sigma, gamma, dt = R0_val/7, 1/4, 1/7, 0.2
    groups = [("elderly", 0.10, 3.0, 0.7), ("adult", 0.60, 1.0, 1.2),
              ("young",   0.30, 0.3, 1.5)]
    # Allocate vaccines by priority
    order = {"elderly": ["elderly","adult","young"],
             "high_contact": ["young","adult","elderly"],
             "none": []}
    vaxed = {g[0]: 0 for g in groups}
    remaining = vax_doses
    for g_name in order.get(vax_target, []):
        frac = next(g[1] for g in groups if g[0] == g_name)
        v = min(remaining, int(frac * N))
        vaxed[g_name] = v; remaining -= v

    total_dead = 0
    for g_name, frac, cfr_m, contact_m in groups:
        gN = int(frac * N)
        gS = gN - vaxed[g_name] - (10 if g_name == "adult" else 0)
        gE, gI, gR = 0.0, float(10 if g_name == "adult" else 0), float(vaxed[g_name])
        eff_beta = beta * contact_m * (1 - quarantine * 0.6)
        for _ in range(int(200 / dt)):
            tot = gS + gE + gI + gR
            dS = -eff_beta * gS * gI / max(tot,1) * dt
            dE = (eff_beta * gS * gI / max(tot,1) - sigma * gE) * dt
            dI = (sigma * gE - gamma * gI) * dt
            dR = gamma * gI * dt
            gS += dS; gE += dE; gI += dI; gR += dR
        g_inf = gN - gS - vaxed[g_name]
        g_cfr = cfr * cfr_m * (0.6 if hospital else 1.0)
        total_dead += max(0, g_inf * g_cfr)
    return total_dead

strategies = [
    ("No intervention",        0,     "none",         0.0, False),
    ("Vaccinate elderly",      10000, "elderly",      0.0, False),
    ("Vaccinate high-contact", 10000, "high_contact", 0.0, False),
    ("Quarantine (30%)",       0,     "none",         0.3, False),
    ("Quarantine (60%)",       0,     "none",         0.6, False),
    ("Hospital only",          0,     "none",         0.0, True),
    ("Combined (best)",        10000, "high_contact", 0.3, True),
]

print("=== Intervention Optimisation: Plague Epidemic ===")
print(f"Population: 50,000 | R0 = 4.0 | Base CFR = 40%\\n")
print(f"{'Strategy':<28} {'Deaths':>8} {'Reduction':>10}")
print("-" * 48)

baseline = None
for name, vax, target, quar, hosp in strategies:
    dead = simulate_intervention(vax_doses=vax, vax_target=target, quarantine=quar, hospital=hosp)
    if baseline is None: baseline = dead
    red = (1 - dead/baseline) * 100 if baseline > 0 else 0
    print(f"{name:<28} {dead:>7,.0f} {red:>8.1f}%")

print(f"\\nCombined intervention is optimal — layered defences multiply.")
print(f"Medieval cities had ONLY quarantine. Modern response layers all three.")`,
      challenge: 'Add a cost constraint: vaccines cost 10 units each, quarantine costs 2 units per person per day, hospital beds cost 100 units per day. Given a budget of 500,000 units, find the optimal allocation across all three interventions. This is the real-world resource allocation problem facing every health ministry during a pandemic.',
      successHint: 'Intervention optimisation is the core task of epidemic response planning. The WHO, CDC, and every national health agency use models like this to decide how to allocate vaccines, hospital beds, and containment resources. The key insight: layered interventions (defence in depth) are far more effective than any single strategy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced epidemic modelling and systemic analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers stochastic simulation, spatial modelling, economic cascades, comparative pandemics, and intervention optimisation.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
