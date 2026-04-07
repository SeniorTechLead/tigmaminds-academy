import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BlackDeathLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The SIR model — simulating a plague epidemic with differential equations',
      concept: `The **SIR model** divides a population into three compartments: **Susceptible** (can catch the disease), **Infected** (currently sick and contagious), and **Recovered** (immune or dead — removed from transmission). Every epidemic in history follows this basic structure.

The model is governed by two rates: **beta** (transmission rate — how fast the disease spreads) and **gamma** (recovery rate — how fast people stop being infectious). These rates produce three differential equations:

**dS/dt = -beta * S * I / N** (susceptible people get infected)
**dI/dt = beta * S * I / N - gamma * I** (new infections minus recoveries)
**dR/dt = gamma * I** (infected people recover or die)

For the Black Death, Yersinia pestis had devastating parameters. The **pneumonic** form (airborne) had a case fatality rate near 95%. The **bubonic** form (flea-borne) killed about 50-60% of victims. Recovery time averaged about **7 days** for those who survived, but most didn't — they moved to the "Removed" compartment through death rather than immunity.

The key insight: these three simple equations predict the entire shape of an epidemic — the exponential rise, the peak, and the eventual decline as susceptible people run out. The Black Death didn't stop because of medicine. It stopped because it ran out of victims.

📚 *The SIR model was formalized by Kermack and McKendrick in 1927, but the underlying dynamics governed every epidemic for millennia before anyone wrote the equations. The Black Death of 1347-1353 killed 75-200 million people across Eurasia — a catastrophe perfectly described by these three equations.*`,
      analogy: 'Imagine a forest fire. Green trees are Susceptible — they can burn. Burning trees are Infected — they spread fire. Ash is Recovered — it can\'t burn again. The fire spreads faster when green trees are dense (high S), slows as fuel runs out, and dies when there aren\'t enough green trees left to sustain it. An epidemic works identically — the "fuel" is susceptible people.',
      storyConnection: 'When the Black Death arrived in Messina, Sicily in October 1347, virtually the entire population was Susceptible — no one had immunity to Yersinia pestis. The SIR model predicts exactly what happened: explosive spread through a fully susceptible population, overwhelming death, and eventual burnout only when most of the population had been infected.',
      checkQuestion: 'In the SIR model, what happens to dI/dt (the change in infected people) when beta * S / N equals gamma?',
      checkAnswer: 'When beta * S / N = gamma, the equation dI/dt = beta * S * I / N - gamma * I becomes dI/dt = 0. This is the epidemic peak — the moment when new infections exactly balance recoveries. After this point, I decreases because there aren\'t enough susceptible people left to sustain exponential growth. The epidemic is declining even though many people are still infected.',
      codeIntro: 'Simulate the Black Death sweeping through a medieval city of 100,000 using the SIR differential equations.',
      code: `import numpy as np

def sir_model(S, I, R, beta, gamma, N, dt):
    """One step of the SIR model using Euler's method."""
    dS = -beta * S * I / N * dt
    dI = (beta * S * I / N - gamma * I) * dt
    dR = gamma * I * dt
    return S + dS, I + dI, R + dR

# === Black Death parameters ===
N = 100_000          # Medieval city population
I0 = 10              # Initial infected (sailors from Messina)
S0 = N - I0
R0_init = 0          # No one recovered yet

# Plague parameters (pneumonic form)
R0_value = 4.0       # Basic reproduction number
gamma = 1 / 7        # Recovery rate: ~7 days infectious period
beta = R0_value * gamma  # Transmission rate derived from R0

days = 200
dt = 0.1
steps = int(days / dt)

# Arrays to store results
t = np.linspace(0, days, steps)
S = np.zeros(steps)
I = np.zeros(steps)
R = np.zeros(steps)

S[0], I[0], R[0] = S0, I0, R0_init

# Run simulation
for i in range(1, steps):
    S[i], I[i], R[i] = sir_model(S[i-1], I[i-1], R[i-1], beta, gamma, N, dt)

# Find key moments
peak_idx = np.argmax(I)
peak_day = t[peak_idx]
peak_infected = I[peak_idx]

# Final toll
final_recovered = R[-1]
mortality_rate = 0.60  # 60% case fatality for bubonic plague
dead = final_recovered * mortality_rate
survived = final_recovered * (1 - mortality_rate)

print("=== Black Death SIR Simulation ===")
print(f"City population: {N:,}")
print(f"Initial infected: {I0}")
print(f"R0 = {R0_value}, beta = {beta:.4f}, gamma = {gamma:.4f}")
print(f"\\\n--- Epidemic Timeline ---")

milestones = [0.01, 0.05, 0.10, 0.25, 0.50]
for frac in milestones:
    threshold = frac * N
    idx = np.argmax(R > threshold)
    if idx > 0:
        print(f"  {frac*100:>5.0f}% infected by day {t[idx]:.0f}")

print(f"\\\n--- Peak ---")
print(f"  Peak infected on day {peak_day:.0f}")
print(f"  Peak simultaneous cases: {peak_infected:,.0f} ({peak_infected/N*100:.1f}%)")

print(f"\\\n--- Final Toll ---")
print(f"  Total infected: {final_recovered:,.0f} ({final_recovered/N*100:.1f}%)")
print(f"  Dead (60% fatality): {dead:,.0f}")
print(f"  Survived with immunity: {survived:,.0f}")
print(f"  Never infected: {S[-1]:,.0f}")

print(f"\\\n--- Epidemic Curve (weekly snapshots) ---")
print(f"{'Day':>5} {'Susceptible':>12} {'Infected':>10} {'Removed':>10}")
print("-" * 40)
for day in range(0, days + 1, 7):
    idx = min(int(day / dt), steps - 1)
    print(f"{day:>5} {S[idx]:>12,.0f} {I[idx]:>10,.0f} {R[idx]:>10,.0f}")
    if I[idx] < 1 and day > 30:
        print("  (epidemic ended)")
        break

print(f"\\\nThe Black Death didn't stop because of medicine.")
print(f"It stopped because {final_recovered/N*100:.0f}% of the population")
print(f"had already been infected — the fire ran out of fuel.")`,
      challenge: 'Change the case fatality rate to 95% (pneumonic plague) and re-run the simulation. The total infected stays the same — only the death count changes. Why? Because transmission dynamics depend on beta and gamma, not on whether victims die or recover. The SIR model treats death and recovery identically — both remove people from the transmission chain.',
      successHint: 'You simulated the deadliest pandemic in human history using three differential equations. The same SIR framework was used to model COVID-19 in 2020, Ebola in 2014, and influenza in 1918. The mathematics hasn\'t changed — only the parameters differ.',
    },
    {
      title: 'R-naught (R₀) — the number that determines everything',
      concept: `**R₀** (pronounced "R-naught") is the **basic reproduction number** — the average number of new infections caused by a single infected person in a fully susceptible population. It is the single most important number in epidemiology.

The rule is brutally simple:
- **R₀ > 1**: the epidemic grows (each person infects more than one other)
- **R₀ = 1**: the epidemic is stable (each person infects exactly one other)
- **R₀ < 1**: the epidemic dies out (each person infects fewer than one other)

R₀ is calculated from three factors: **R₀ = beta / gamma**, where beta is the transmission rate and gamma is the recovery rate. Equivalently: **R₀ = (contact rate) × (transmission probability per contact) × (duration of infectiousness)**.

For the Black Death, R₀ varied by form. **Bubonic plague** (flea-borne): R₀ ≈ 1.5-3. **Pneumonic plague** (airborne): R₀ ≈ 3-5. The pneumonic form spread person-to-person through respiratory droplets — no flea needed — and was almost always fatal within 3 days.

As an epidemic progresses, the **effective R** drops below R₀ because susceptible people are being depleted. The epidemic peaks exactly when the effective R crosses below 1. This threshold determines **herd immunity**: the fraction of the population that must be immune to stop transmission is **1 - 1/R₀**.

📚 *For plague with R₀ = 4, herd immunity requires 1 - 1/4 = 75% of the population to be immune. The Black Death achieved this the hard way — by infecting (and mostly killing) 75% of Europe. Modern vaccines achieve the same threshold without the death.*`,
      analogy: 'R₀ is like a chain letter. If each person who receives it forwards it to 3 people (R₀ = 3), the letters multiply explosively: 1 → 3 → 9 → 27 → 81. If each person forwards to 0.5 people on average (R₀ = 0.5), half the chains die at each step and the letter vanishes. R₀ = 1 is the exact tipping point between explosion and extinction.',
      storyConnection: 'The Black Death spread along medieval trade routes at a speed determined by its R₀. Cities with dense populations and rat infestations had higher effective R₀ values — Florence lost 60-80% of its population. Rural areas with dispersed populations had lower effective R₀ and lost fewer people. The same disease, different R₀, vastly different outcomes.',
      checkQuestion: 'If plague has R₀ = 4, what fraction of the population must be immune to achieve herd immunity and stop the epidemic?',
      checkAnswer: 'Herd immunity threshold = 1 - 1/R₀ = 1 - 1/4 = 0.75 = 75%. Three quarters of the population must be immune to stop transmission. With no vaccine, the only way to reach this threshold was through infection — and with a 60% mortality rate, that meant roughly 45% of the entire population had to die before the epidemic burned out.',
      codeIntro: 'Calculate R₀ for different plague forms and see how it determines epidemic size, peak, and herd immunity.',
      code: `import numpy as np

def simulate_epidemic(N, R0, gamma, days=300, dt=0.1):
    """Simulate SIR epidemic and return key statistics."""
    beta = R0 * gamma
    steps = int(days / dt)
    S, I, R = float(N - 1), 1.0, 0.0
    peak_I, peak_day = 0, 0

    for step in range(steps):
        dS = -beta * S * I / N * dt
        dI = (beta * S * I / N - gamma * I) * dt
        dR = gamma * I * dt
        S, I, R = S + dS, I + dI, R + dR
        if I > peak_I:
            peak_I = I
            peak_day = step * dt
    return {
        'total_infected': R, 'peak_infected': peak_I,
        'peak_day': peak_day, 'never_infected': S,
        'herd_immunity': 1 - 1/R0 if R0 > 1 else 0
    }

N = 100_000
gamma = 1 / 7  # 7-day infectious period

# Compare different R0 values
print("=== How R0 Determines Everything ===\\\n")
print(f"Population: {N:,} | Infectious period: 7 days\\\n")
print(f"{'R0':>4} {'Total Infected':>16} {'Peak Cases':>12} "
      f"{'Peak Day':>10} {'Herd Imm.':>10}")
print("-" * 56)

for R0 in [0.8, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0]:
    result = simulate_epidemic(N, R0, gamma)
    ti = result['total_infected']
    print(f"{R0:>4.1f} {ti:>12,.0f} ({ti/N*100:>4.1f}%)"
          f" {result['peak_infected']:>10,.0f}"
          f" {result['peak_day']:>8.0f}"
          f" {result['herd_immunity']:>8.0%}")

# Real disease comparisons
print(f"\\\n=== R0 of Real Diseases ===\\\n")
diseases = [
    ("Measles", 15.0, "Airborne virus"),
    ("Smallpox", 6.0, "Airborne/contact"),
    ("Pneumonic plague", 4.5, "Respiratory droplets"),
    ("COVID-19 (original)", 2.5, "Respiratory aerosol"),
    ("Bubonic plague", 2.0, "Flea vector"),
    ("Ebola", 1.8, "Direct body fluids"),
    ("Seasonal flu", 1.3, "Respiratory droplets"),
    ("MERS", 0.7, "Poor human adaptation"),
]

print(f"{'Disease':<25} {'R0':>5} {'Herd Imm.':>10} {'Transmission'}")
print("-" * 62)
for name, r0, route in diseases:
    hi = f"{(1-1/r0)*100:.0f}%" if r0 > 1 else "N/A"
    print(f"{name:<25} {r0:>5.1f} {hi:>10} {route}")

# The effective R during an epidemic
print(f"\\\n=== Effective R During the Black Death ===\\\n")
print(f"R_effective = R0 * (S/N)")
print(f"As susceptible people are removed, R_eff drops.\\\n")

R0 = 4.0
print(f"{'% Susceptible':>15} {'R_effective':>12} {'Status'}")
print("-" * 42)
for s_frac in [1.0, 0.9, 0.75, 0.5, 0.25, 0.10]:
    r_eff = R0 * s_frac
    status = "GROWING" if r_eff > 1 else "DECLINING" if r_eff < 1 else "PEAK"
    print(f"{s_frac*100:>13.0f}% {r_eff:>12.2f} {status:>12}")

print(f"\\\nR_eff crosses 1.0 when S/N = 1/R0 = {1/R0:.0%}")
print(f"This is the herd immunity threshold: {(1-1/R0):.0%} must be immune.")
print(f"\\\nThe Black Death reached this threshold through mass death.")
print(f"Modern vaccines reach it through controlled immunization.")`,
      challenge: 'Calculate how many people would need to be vaccinated to prevent a plague epidemic. With R₀ = 4, you need 75% vaccination coverage. But vaccines aren\'t 100% effective — if the plague vaccine is 85% effective, what coverage percentage do you actually need? (Answer: 75% / 0.85 = 88.2% — nearly everyone.)',
      successHint: 'You calculated the most important number in epidemiology. R₀ governed every pandemic decision during COVID-19 — lockdowns, mask mandates, and vaccination targets were all based on driving the effective R below 1. The same mathematics that explains the Black Death guided the 21st-century pandemic response.',
    },
    {
      title: 'The chain of infection — breaking links to stop plague',
      concept: `Every infectious disease requires a **chain of infection** with six links: **pathogen → reservoir → portal of exit → mode of transmission → portal of entry → susceptible host**. Break any single link and transmission stops. This is the foundation of all disease control.

For the Black Death, the chain was: **Yersinia pestis** (pathogen) → **rats** (reservoir) → **flea bites on rats** (portal of exit) → **flea bites on humans** (mode of transmission and portal of entry) → **humans with no immunity** (susceptible host). The pneumonic form added a second chain: infected lungs → coughing → respiratory droplets → inhaled by others.

Medieval people didn't understand germ theory — that wouldn't come for another 500 years. But they accidentally discovered effective interventions by trial and error. **Quarantine** broke the transmission link. **Burning infected clothing** eliminated flea reservoirs. **Fleeing cities** reduced contact with susceptible hosts.

The most effective intervention was one nobody planned: **the death of rats**. When rat populations crashed from plague, the fleas lost their preferred host and jumped to humans in desperation. But once enough rats died, the flea population also crashed — breaking the vector link entirely.

📚 *The word "quarantine" comes from the Italian "quaranta giorni" — 40 days. Venice imposed the first formal quarantine in 1377, requiring ships to anchor offshore for 40 days before landing. They didn't know about bacteria, but they observed that 40 days was long enough for the disease to reveal itself or die out. The empirical observation was correct — plague's incubation period is 2-6 days, so 40 days provided an enormous safety margin.*`,
      analogy: 'A chain of infection is literally a chain — and a chain is only as strong as its weakest link. You don\'t need to understand metallurgy to break a chain; you just need to find and cut one link. Medieval quarantine officers didn\'t understand microbiology — they just cut the transmission link and it worked. Modern epidemiology identifies ALL six links and attacks the weakest one.',
      storyConnection: 'Milan was one of the few major cities that avoided devastation during the Black Death. When plague appeared, the city\'s lord Luchino Visconti ordered the first three houses with plague cases to be bricked up — with the inhabitants still inside. Brutal, but it broke the chain of infection. Milan lost only about 15% of its population while Florence lost 60-80%.',
      checkQuestion: 'Which link in the chain of infection did the Venetian quarantine target, and why was 40 days effective even though they didn\'t know the incubation period?',
      checkAnswer: 'Quarantine targeted the mode of transmission link — it physically separated potentially infected people from susceptible hosts. 40 days was effective because plague\'s incubation period is only 2-6 days. Anyone carrying plague would develop symptoms (or die) long before the 40 days ended. If no symptoms appeared after 40 days, the people were almost certainly not infected. The Venetians found the right answer through observation rather than theory.',
      codeIntro: 'Model the chain of infection — simulate how breaking each link affects plague transmission.',
      code: `import numpy as np

def plague_chain_model(N, days, interventions):
    """
    Model plague with chain-of-infection interventions.
    Each intervention reduces a specific transmission parameter.
    """
    # Base plague parameters
    base_beta_bubonic = 0.3    # bubonic (flea) transmission
    base_beta_pneumonic = 0.5  # pneumonic (airborne) transmission
    gamma = 1 / 7             # recovery rate
    flea_ratio = 0.7          # fraction of transmission via fleas
    air_ratio = 0.3           # fraction via respiratory

    # Apply interventions
    flea_factor = interventions.get('flea_control', 1.0)
    quarantine_factor = interventions.get('quarantine', 1.0)
    rat_factor = interventions.get('rat_control', 1.0)
    hygiene_factor = interventions.get('hygiene', 1.0)

    beta_bubonic = base_beta_bubonic * flea_factor * rat_factor
    beta_pneumonic = base_beta_pneumonic * quarantine_factor * hygiene_factor
    beta = flea_ratio * beta_bubonic + air_ratio * beta_pneumonic

    dt = 0.1
    steps = int(days / dt)
    S, I, R = float(N - 5), 5.0, 0.0
    peak_I = 0

    for _ in range(steps):
        dS = -beta * S * I / N * dt
        dI = (beta * S * I / N - gamma * I) * dt
        dR = gamma * I * dt
        S, I, R = S + dS, I + dI, R + dR
        peak_I = max(peak_I, I)

    return R, peak_I, beta / gamma  # total infected, peak, effective R0

N = 100_000
days = 365

print("=== Chain of Infection: Breaking Links ===\\\n")
print("The 6 links: Pathogen → Reservoir → Exit → Transmission → Entry → Host\\\n")

# Scenario definitions
scenarios = [
    ("No intervention (1347 baseline)",
     {}, "Florence, Siena, most cities"),
    ("Kill rats (break reservoir link)",
     {'rat_control': 0.3}, "Reduces flea population"),
    ("Flea control (break vector link)",
     {'flea_control': 0.2}, "Burning clothes, sulfur fumigation"),
    ("Quarantine (break transmission link)",
     {'quarantine': 0.3}, "Venice 40-day isolation"),
    ("Hygiene / masks (break entry link)",
     {'hygiene': 0.5}, "Plague doctor masks (accidentally helpful)"),
    ("Milan strategy (multiple links)",
     {'quarantine': 0.3, 'rat_control': 0.5, 'flea_control': 0.5},
     "Bricked up houses, strict isolation"),
    ("All interventions combined",
     {'rat_control': 0.3, 'flea_control': 0.2,
      'quarantine': 0.3, 'hygiene': 0.5},
     "Modern-equivalent response"),
]

print(f"{'Scenario':<40} {'R_eff':>6} {'Total Inf.':>12} {'Deaths (60%)':>12}")
print("-" * 74)

for name, interventions, note in scenarios:
    total, peak, r_eff = plague_chain_model(N, days, interventions)
    deaths = total * 0.60
    print(f"{name:<40} {r_eff:>6.2f} {total:>10,.0f} {deaths:>10,.0f}")

# Link-by-link analysis
print(f"\\\n=== Which Link is Weakest? ===\\\n")
links = [
    ("Pathogen (antibiotics)", {'flea_control': 0.1, 'quarantine': 0.1},
     "Kills Y. pestis directly — not available until 1940s"),
    ("Reservoir (rat control)", {'rat_control': 0.3},
     "Eliminate rat populations near humans"),
    ("Vector (flea control)", {'flea_control': 0.2},
     "Insecticides, burning infested materials"),
    ("Transmission (quarantine)", {'quarantine': 0.3},
     "Physical separation of sick from healthy"),
    ("Entry (masks/hygiene)", {'hygiene': 0.5},
     "Reduce pathogen reaching new host"),
    ("Host (vaccination)", {'quarantine': 0.2, 'flea_control': 0.2},
     "Make host immune — approximated here"),
]

print(f"{'Link Broken':<30} {'R_eff':>6} {'Lives Saved':>14}")
print("-" * 52)
baseline_deaths, _, _ = plague_chain_model(N, days, {})
baseline_deaths *= 0.60

for name, intervention, description in links:
    total, _, r_eff = plague_chain_model(N, days, intervention)
    deaths = total * 0.60
    saved = baseline_deaths - deaths
    print(f"{name:<30} {r_eff:>6.2f} {saved:>12,.0f}")
    print(f"  → {description}")

print(f"\\\n--- Key Insight ---")
print(f"You don't need to understand the pathogen to stop it.")
print(f"Venice stopped plague with quarantine 500 years before")
print(f"anyone identified Yersinia pestis under a microscope.")
print(f"Breaking ANY link in the chain works.")`,
      challenge: 'Research the actual mortality rates of major European cities during the Black Death. Milan (~15%), Florence (~60-80%), Venice (~60%), London (~30-40%). Can you adjust the intervention parameters to match each city\'s known strategy and reproduce their approximate death tolls?',
      successHint: 'You modeled the chain of infection — the same framework used by the WHO and CDC to plan responses to every outbreak. During COVID-19, masks targeted the entry link, lockdowns targeted transmission, and vaccines targeted host susceptibility. The chain-of-infection model hasn\'t changed since Venice invented quarantine in 1377.',
    },
    {
      title: 'Quarantine mathematics — the 40-day Venetian experiment',
      concept: `Venice\'s quarantine was the world\'s first systematic public health intervention. Ships arriving during plague outbreaks were forced to anchor at the island of **Lazaretto Nuovo** for **40 days** ("quaranta giorni") before anyone could disembark. The mathematics behind this policy — though the Venetians didn't formalize it — is elegant and powerful.

Quarantine works by **reducing the effective reproduction number** (R_eff). If infected individuals are isolated before they can transmit the disease, each one infects fewer people. The key equation is:

**R_eff = R₀ × (1 - q)** where q is the fraction of infectious people successfully quarantined.

If you can quarantine enough people to push R_eff below 1, the epidemic dies. The threshold is: **q > 1 - 1/R₀**. For plague with R₀ = 4, you need to quarantine at least 75% of infectious individuals.

The 40-day period was critical for another reason: it accounts for the **full incubation and infectious period** with a massive safety margin. Bubonic plague has a 2-6 day incubation period and a ~7-day course. Even if someone was infected on the last day before quarantine began, they would show symptoms (and could be isolated or would die) within 2 weeks — leaving 26 days of additional buffer.

Quarantine also **flattens the epidemic curve** — it doesn't necessarily reduce the total number infected, but it spreads cases over a longer period so that care capacity isn't overwhelmed. Medieval hospitals were crude, but even basic nursing (water, rest) improved survival.

📚 *"Flatten the curve" became a household phrase during COVID-19, but Venice invented the concept in 1377. Their 40-day quarantine was based on pure empirical observation — they noticed that when they isolated ships, fewer people in the city died. They didn't need to understand virology to save lives.*`,
      analogy: 'Quarantine is like a firebreak in a forest fire. You can\'t extinguish the fire (you can\'t cure plague), but you can cut a gap in the trees so the fire can\'t jump across. The wider the gap (longer quarantine), the more effective it is. Venice\'s 40-day quarantine was an enormous firebreak — far wider than needed — which is exactly why it worked so well.',
      storyConnection: 'The island of Lazaretto Nuovo in the Venetian lagoon served as the world\'s first quarantine station. Archaeological excavations have found mass graves with over 1,500 plague victims — people who developed symptoms during quarantine and were isolated on the island rather than entering Venice. The quarantine worked: Venice suffered fewer plague deaths than almost any comparable city.',
      checkQuestion: 'For plague with R₀ = 4, what minimum fraction of infectious people must be quarantined to stop the epidemic, and why is 100% quarantine not necessary?',
      checkAnswer: 'You need q > 1 - 1/R₀ = 1 - 1/4 = 0.75. Quarantining 75% of infectious people is sufficient because each remaining infectious person now infects only R₀ × (1-0.75) = 4 × 0.25 = 1 person. At R_eff = 1, the epidemic is stable and can\'t grow. In practice, you want R_eff well below 1, so quarantining 85-90% provides a good safety margin.',
      codeIntro: 'Model the Venetian quarantine system — calculate how isolation duration and coverage affect epidemic curves.',
      code: `import numpy as np

def sir_quarantine(N, R0, gamma, q_coverage, q_delay, days=365):
    """
    SIR model with quarantine.
    q_coverage: fraction of infected who are quarantined
    q_delay: days before quarantine takes effect (detection lag)
    """
    beta = R0 * gamma
    dt = 0.1
    steps = int(days / dt)

    S, I, Q, R = float(N - 5), 5.0, 0.0, 0.0
    q_rate = q_coverage / max(q_delay, 0.1)

    weekly = []
    for step in range(steps):
        day = step * dt
        new_infections = beta * S * I / N * dt
        new_quarantined = q_rate * I * dt if day > 14 else 0
        new_recovered_I = gamma * I * dt
        new_recovered_Q = gamma * Q * dt

        S -= new_infections
        I += new_infections - new_quarantined - new_recovered_I
        Q += new_quarantined - new_recovered_Q
        R += new_recovered_I + new_recovered_Q

        I = max(I, 0)
        if step % int(7 / dt) == 0:
            weekly.append((day, S, I, Q, R))

    return weekly, R

N = 100_000
gamma = 1 / 7
R0 = 4.0

# Compare quarantine strategies
print("=== Venetian Quarantine Mathematics ===\\\n")
print(f"Population: {N:,} | R0 = {R0} | Infectious period = 7 days\\\n")

strategies = [
    ("No quarantine", 0.0, 0),
    ("Weak (30% coverage, 7-day delay)", 0.30, 7),
    ("Moderate (50% coverage, 5-day delay)", 0.50, 5),
    ("Venice-style (75% coverage, 3-day delay)", 0.75, 3),
    ("Milan-style (90% coverage, 1-day delay)", 0.90, 1),
    ("Perfect quarantine (95%, immediate)", 0.95, 0.5),
]

print(f"{'Strategy':<45} {'R_eff':>6} {'Total Inf.':>12} {'Dead (60%)':>10}")
print("-" * 76)

for name, coverage, delay in strategies:
    r_eff = R0 * (1 - coverage) if delay < 3 else R0 * (1 - coverage * 0.7)
    weekly, total = sir_quarantine(N, R0, gamma, coverage, delay)
    dead = total * 0.60
    print(f"{name:<45} {r_eff:>6.2f} {total:>10,.0f} {dead:>8,.0f}")

# The 40-day calculation
print(f"\\\n=== Why 40 Days? ===\\\n")
print(f"Plague timeline for an infected person:")
print(f"  Incubation: 2-6 days (infected but no symptoms)")
print(f"  Illness onset: day 3-7")
print(f"  Death or recovery: day 7-14")
print(f"  Maximum possible infectious period: ~21 days\\\n")

for q_days in [7, 14, 21, 30, 40, 60]:
    # Probability of undetected case passing through
    # Using exponential decay model for symptom onset
    mean_incubation = 4  # days
    prob_no_symptoms = np.exp(-q_days / mean_incubation)
    safety_margin = q_days - 14  # days beyond max infectious period
    status = "SAFE" if safety_margin >= 14 else "RISKY" if safety_margin >= 0 else "UNSAFE"
    print(f"  {q_days:>2} days: P(undetected) = {prob_no_symptoms:.2e}"
          f"  Safety margin: {safety_margin:>+3d} days  [{status}]")

print(f"\\\nVenice chose 40 days: P(undetected) = {np.exp(-40/4):.2e}")
print(f"That's a 1-in-22,000 chance of missing a case — extremely safe.")

# Flatten the curve demonstration
print(f"\\\n=== Flattening the Curve ===\\\n")
print(f"Without quarantine vs. Venice-style (75% quarantine):\\\n")

no_q, _ = sir_quarantine(N, R0, gamma, 0.0, 0)
venice, _ = sir_quarantine(N, R0, gamma, 0.75, 3)

print(f"{'Week':>5} {'No Quarantine':>14} {'Venice (75%)':>14} {'Reduction':>10}")
print("-" * 46)
for i in range(min(len(no_q), len(venice), 30)):
    nq_I = no_q[i][2] if i < len(no_q) else 0
    v_I = venice[i][2] if i < len(venice) else 0
    reduction = (1 - v_I / nq_I) * 100 if nq_I > 10 else 0
    week = int(no_q[i][0] / 7) if i < len(no_q) else i
    if nq_I > 5 or v_I > 5:
        print(f"{week:>5} {nq_I:>12,.0f} {v_I:>12,.0f} {reduction:>8.0f}%")

print(f"\\\nQuarantine flattens and delays the peak, buying time")
print(f"for the population to develop partial herd immunity.")`,
      challenge: 'Venice was a port city — new infections could arrive on every ship. Modify the model to add a constant inflow of 2 infected people per week from arriving ships. How does this change the quarantine coverage needed? (Hint: with ongoing importation, R_eff < 1 is not enough — you also need to quarantine arrivals.)',
      successHint: 'You modeled the mathematics behind the world\'s first public health policy. The same quarantine math was used for Ebola containment in West Africa, COVID-19 travel bans, and even agricultural quarantines that prevent plant diseases from crossing borders. Venice invented epidemiological mathematics 600 years before the field existed.',
    },
    {
      title: 'Geographic spread — the wave of death across Europe',
      concept: `The Black Death didn't appear everywhere at once. It arrived in **Messina, Sicily in October 1347** and spread outward in a wave, reaching **Paris by June 1348**, **London by September 1348**, and **Scandinavia by 1349**. The speed of this wave — approximately **2-5 km per day** — was determined by the speed of medieval trade and travel.

Geographic spread of disease follows a **reaction-diffusion model**: the "reaction" is local epidemic growth (the SIR model within each city), and the "diffusion" is movement of infected people (or infected rats/fleas) between cities. The combined equation is:

**∂I/∂t = beta * S * I / N - gamma * I + D * ∂²I/∂x²**

The first two terms are the familiar SIR dynamics. The third term (**D × ∂²I/∂x²**) is diffusion — the spread of infection through space. D is the **diffusion coefficient**, determined by how fast and far people travel.

In medieval Europe, diffusion was governed by **trade routes**: sea routes (fast, ~80-100 km/day by ship) and land routes (slow, ~20-30 km/day by horse or cart). The plague followed major trade routes almost exactly — it didn't spread randomly across the landscape but jumped from **port to port** and **market town to market town**.

The wave speed is approximately **v = 2 × sqrt(D × (beta - gamma))** — it depends on both the diffusion rate (how fast people travel) and the epidemic growth rate (how infectious the disease is).

📚 *The Black Death map shows clear "fingers" along trade routes rather than smooth concentric circles. This is because medieval travel was not random — it followed roads and sea lanes. The disease reached Marseille (a major port) months before it reached rural Provence, only 100 km inland. Trade networks are disease networks.*`,
      analogy: 'Drop a single drop of ink into still water and it spreads in a smooth circle. But drop ink onto a paper towel and it races along the fibers, creating jagged fingers that spread much faster in some directions than others. The Black Death spread like ink on a paper towel — racing along the "fibers" of trade routes while slowly seeping into the spaces between.',
      storyConnection: 'Twelve Genoese galleys fleeing the Siege of Caffa (modern Feodosia, Crimea) carried plague to Messina in October 1347. Legend says the Mongol besiegers catapulted plague-infected corpses over the walls — possibly the first biological weapon. Whether true or not, the trade route from the Black Sea to Sicily was the highway the plague took into Europe.',
      checkQuestion: 'Why did the Black Death reach London (by sea from continental ports) before it reached rural villages only 50 km from already-infected cities?',
      checkAnswer: 'Sea travel was 4-5 times faster than overland travel. A ship could carry plague from Bordeaux to London (800+ km by sea) in about 10 days, while overland diffusion at 2-5 km/day would take 10-25 days to cover just 50 km. The disease jumped between port cities first, then slowly diffused inland from each infected port. This "leap-frog" pattern is characteristic of diseases spreading through transportation networks.',
      codeIntro: 'Simulate plague spreading across a network of medieval European cities connected by trade routes.',
      code: `import numpy as np

# Medieval European city network
cities = {
    'Caffa':     {'pop': 20000,  'lat': 45.0, 'lon': 35.4},
    'Messina':   {'pop': 30000,  'lat': 38.2, 'lon': 15.6},
    'Genoa':     {'pop': 80000,  'lat': 44.4, 'lon': 8.9},
    'Venice':    {'pop': 110000, 'lat': 45.4, 'lon': 12.3},
    'Florence':  {'pop': 95000,  'lat': 43.8, 'lon': 11.3},
    'Marseille': {'pop': 25000,  'lat': 43.3, 'lon': 5.4},
    'Paris':     {'pop': 200000, 'lat': 48.9, 'lon': 2.3},
    'Bordeaux':  {'pop': 30000,  'lat': 44.8, 'lon': -0.6},
    'London':    {'pop': 80000,  'lat': 51.5, 'lon': -0.1},
    'Barcelona': {'pop': 35000,  'lat': 41.4, 'lon': 2.2},
    'Hamburg':   {'pop': 20000,  'lat': 53.6, 'lon': 10.0},
    'Bergen':    {'pop': 7000,   'lat': 60.4, 'lon': 5.3},
    'Moscow':    {'pop': 30000,  'lat': 55.8, 'lon': 37.6},
}

# Trade route connections (city pairs with travel time in days)
routes = [
    ('Caffa', 'Messina', 25, 'sea'),
    ('Messina', 'Genoa', 8, 'sea'),
    ('Messina', 'Venice', 12, 'sea'),
    ('Genoa', 'Florence', 7, 'land'),
    ('Genoa', 'Marseille', 5, 'sea'),
    ('Venice', 'Florence', 8, 'land'),
    ('Venice', 'Hamburg', 30, 'land'),
    ('Marseille', 'Barcelona', 6, 'sea'),
    ('Marseille', 'Paris', 20, 'land'),
    ('Bordeaux', 'Paris', 15, 'land'),
    ('Bordeaux', 'London', 7, 'sea'),
    ('Marseille', 'Bordeaux', 12, 'land'),
    ('Paris', 'London', 5, 'sea'),
    ('Hamburg', 'Bergen', 8, 'sea'),
    ('Hamburg', 'Paris', 20, 'land'),
    ('Moscow', 'Hamburg', 45, 'land'),
    ('Bergen', 'London', 10, 'sea'),
]

# Simulate spread
gamma = 1 / 7
R0 = 4.0
beta = R0 * gamma

# Track infection arrival and local epidemic
city_names = list(cities.keys())
n = len(city_names)
arrival_day = {c: float('inf') for c in city_names}
arrival_day['Caffa'] = 0  # origin

# BFS-like spread with travel times and stochastic delay
print("=== The Black Death: Geographic Spread ===\\\n")
print("Starting point: Caffa (Crimea), October 1347\\\n")

# Dijkstra-like spread through trade network
changed = True
while changed:
    changed = False
    for c1, c2, travel_days, route_type in routes:
        # Add delay for local epidemic to produce travelers
        epidemic_delay = 14  # days for local epidemic to generate cases
        for src, dst in [(c1, c2), (c2, c1)]:
            new_arrival = arrival_day[src] + travel_days + epidemic_delay
            if new_arrival < arrival_day[dst]:
                arrival_day[dst] = new_arrival
                changed = True

# Sort by arrival and display
sorted_cities = sorted(arrival_day.items(), key=lambda x: x[1])

print(f"{'City':<14} {'Arrival Day':>12} {'~Date':>16} {'Pop':>9}")
print("-" * 54)

base_date = "Oct 1347"
for city, day in sorted_cities:
    months = int(day / 30)
    month_names = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May',
                   'Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    year = 1347 + (months + 9) // 12
    month = month_names[months % 12]
    pop = cities[city]['pop']
    print(f"{city:<14} {day:>10.0f} {month:>5} {year} {pop:>9,}")

# Local epidemic in each city
print(f"\\\n=== Local Epidemics ===\\\n")
print(f"{'City':<14} {'Peak Day':>9} {'Dead (60%)':>12} {'% Killed':>9}")
print("-" * 47)

total_dead = 0
total_pop = 0
for city, start_day in sorted_cities:
    pop = cities[city]['pop']
    # Quick SIR for each city
    S, I, R = float(pop - 2), 2.0, 0.0
    dt = 0.5
    peak_day, peak_I = 0, 0
    for step in range(int(200 / dt)):
        dS = -beta * S * I / pop * dt
        dI = (beta * S * I / pop - gamma * I) * dt
        dR = gamma * I * dt
        S, I, R = S + dS, I + dI, R + dR
        if I > peak_I:
            peak_I = I
            peak_day = step * dt
    dead = R * 0.60
    total_dead += dead
    total_pop += pop
    pct = dead / pop * 100
    print(f"{city:<14} {start_day + peak_day:>7.0f} {dead:>10,.0f} {pct:>7.1f}%")

print(f"\\\n{'TOTAL':<14} {'':>9} {total_dead:>10,.0f}"
      f" {total_dead/total_pop*100:>7.1f}%")
print(f"\\\nThe wave took ~{sorted_cities[-1][1]/30:.0f} months to cross Europe")
print(f"Speed: governed by trade routes, not random diffusion")`,
      challenge: 'What if Messina had refused entry to the Genoese galleys in October 1347? Modify the simulation to remove the Caffa-Messina route and see how long the plague would have been delayed. (It would have arrived via a different route — but even a few months\' delay could have saved tens of thousands of lives.)',
      successHint: 'You simulated epidemic geography — the same network models used to predict COVID-19 spread via air travel, track influenza across continents, and plan vaccine distribution. Modern epidemiologists use airline passenger data instead of medieval trade routes, but the mathematics is identical: reaction (local epidemic) plus diffusion (movement between cities).',
    },
    {
      title: 'Population recovery — the economics of mass death',
      concept: `The Black Death killed approximately **30-60% of Europe's population** between 1347 and 1353. The demographic recovery took over **200 years** — Europe didn't return to its pre-plague population until the mid-1500s. But the social and economic consequences were revolutionary.

Population recovery follows **logistic growth**: dP/dt = r × P × (1 - P/K), where P is population, r is the growth rate, and K is the carrying capacity. After the plague, P was far below K, so growth was initially fast. But medieval growth rates were low — high birth rates were offset by high infant mortality, famine, and recurring plague outbreaks.

The economic effects were immediate and dramatic. With **30-60% fewer workers**, labor became scarce. The laws of supply and demand applied ruthlessly: **wages rose 50-100%** within a generation. Peasants who had been bound to the land under feudalism could now demand better terms or simply leave — there was always a labor-hungry lord elsewhere.

This triggered a **fundamental restructuring of European society**. Feudalism weakened. Serfdom declined. The **Statute of Laborers (1351)** in England tried to freeze wages at pre-plague levels — it failed completely because the labor shortage gave workers overwhelming bargaining power. The same pattern appeared across Europe.

The plague also drove **technological innovation**. With fewer workers, there was incentive to develop labor-saving technology: better plows, water mills, printing presses. Some historians argue the Black Death was a necessary precondition for the Renaissance and the Industrial Revolution.

📚 *The Malthusian interpretation: before 1347, Europe was overpopulated relative to its agricultural technology. The plague, horrifically, "reset" the population to a level where per-capita resources were abundant. The survivors were, on average, wealthier, better-fed, and more empowered than their pre-plague ancestors. This is the grim mathematics of population economics.*`,
      analogy: 'Imagine a crowded bus where everyone is standing. If half the passengers get off, the remaining passengers get seats. They didn\'t earn the seats — they got them through the misfortune of others. But the effect is real: more space, more comfort, more resources per person. The Black Death emptied Europe\'s "bus," and the survivors found themselves with more land, higher wages, and greater freedom.',
      storyConnection: 'England\'s Peasants\' Revolt of 1381 was a direct consequence of the Black Death. Workers who had gained economic power through the labor shortage refused to accept the Statute of Laborers\' wage caps. The revolt failed militarily, but the economic forces it represented were unstoppable — serfdom continued to decline, and wages continued to rise. The plague had permanently shifted the balance of power from lords to laborers.',
      checkQuestion: 'Why did it take 200 years for Europe\'s population to recover, even though birth rates were high?',
      checkAnswer: 'Three factors slowed recovery. First, recurring plague outbreaks hit every 10-20 years for the next two centuries, repeatedly culling the population. Second, medieval growth rates were low — even with abundant resources, infant mortality (~30-40%) limited net growth. Third, the initial recovery was from a much-reduced base: if you lose 50% of 75 million people, you need 37.5 million new people just to return to baseline, and at ~0.5-1% annual growth that takes 70-140 years.',
      codeIntro: 'Model Europe\'s population recovery after the Black Death — demographics, economics, and the end of feudalism.',
      code: `import numpy as np

def logistic_growth(P, r, K, dt):
    """One step of logistic population growth."""
    dP = r * P * (1 - P / K) * dt
    return P + dP

# === Population Recovery Model ===
K = 75_000_000         # Pre-plague carrying capacity
P_pre = 73_000_000     # Population in 1340 (near capacity)
mortality = 0.50       # 50% plague mortality
P_post = P_pre * (1 - mortality)
base_growth_rate = 0.005  # 0.5% annual growth (medieval)

# Simulate with recurring plague outbreaks
years = 300  # 1347 to 1647
dt = 1  # year steps
P = np.zeros(years)
P[0] = P_post

# Recurring plague years (approximate historical dates)
plague_years = {
    13: 0.10,   # 1360-61: Second pandemic wave
    22: 0.08,   # 1369: Third wave
    28: 0.05,   # 1375
    53: 0.08,   # 1400
    78: 0.05,   # 1425
    103: 0.04,  # 1450
    128: 0.03,  # 1475
    153: 0.02,  # 1500
}

for year in range(1, years):
    # Growth rate increases when population is far below K
    r = base_growth_rate * (1 + 0.3 * (1 - P[year-1] / K))
    P[year] = logistic_growth(P[year-1], r, K, dt)

    # Apply plague outbreaks
    if year in plague_years:
        P[year] *= (1 - plague_years[year])

print("=== Population Recovery After the Black Death ===\\\n")
print(f"Pre-plague population (1340): {P_pre:>14,}")
print(f"Plague mortality: {mortality:.0%}")
print(f"Post-plague population (1350): {P_post:>13,}")
print(f"Carrying capacity: {K:>22,}")

print(f"\\\n--- Recovery Timeline ---\\\n")
print(f"{'Year':>6} {'Population':>14} {'% of Pre-Plague':>16} {'Event'}")
print("-" * 56)

events = {
    0: "Black Death ends",
    13: "Second plague wave",
    22: "Third plague wave",
    53: "Population still depressed",
    103: "Slow recovery continues",
    153: "Approaching recovery",
    203: "~Full recovery",
}

for year in range(0, years, 10):
    yr = 1350 + year
    pop = P[year]
    pct = pop / P_pre * 100
    event = events.get(year, "")
    # Also show plague years
    if year in plague_years:
        event = f"PLAGUE (-{plague_years[year]:.0%})"
    print(f"{yr:>6} {pop:>12,.0f} {pct:>14.1f}% {event}")

# Find recovery year
for i in range(years):
    if P[i] >= P_pre * 0.95:
        print(f"\\\n95% recovery reached by ~{1350 + i}")
        print(f"Time to recover: ~{i} years")
        break

# === Economic Model ===
print(f"\\\n=== Economics of the Labor Shortage ===\\\n")
print(f"With {mortality:.0%} fewer workers, labor supply crashed.\\\n")

# Simple supply-demand wage model
labor_pre = 1.0  # normalized pre-plague labor supply
wage_pre = 1.0   # normalized pre-plague wage

print(f"{'Year':>6} {'Labor Supply':>14} {'Wage Index':>12}"
      f" {'Land/Worker':>12} {'Status'}")
print("-" * 60)

for year in range(0, 200, 10):
    yr = 1350 + year
    labor = P[year] / P_pre
    # Wage inversely proportional to labor supply (supply-demand)
    wage = wage_pre / labor
    land_per_worker = 1.0 / labor  # same land, fewer workers
    if wage > 2.0:
        status = "Feudalism collapsing"
    elif wage > 1.5:
        status = "Workers empowered"
    elif wage > 1.1:
        status = "Wages rising"
    else:
        status = "Pre-plague equilibrium"
    print(f"{yr:>6} {labor:>12.2f}x {wage:>10.2f}x"
          f" {land_per_worker:>10.2f}x {status}")

# === Social Changes ===
print(f"\\\n=== Social Consequences ===\\\n")
changes = [
    (1349, "Flagellant movement", "Religious response to plague"),
    (1351, "Statute of Laborers", "England: wage freeze attempt — FAILED"),
    (1358, "Jacquerie revolt", "France: peasant rebellion"),
    (1378, "Ciompi revolt", "Florence: wool workers revolt"),
    (1381, "Peasants' Revolt", "England: workers demand rights"),
    (1400, "Serfdom declining", "Workers can leave, demand terms"),
    (1450, "Innovation wave", "Labor-saving technology adopted"),
    (1453, "Gutenberg press", "Printing — fewer scribes needed"),
    (1500, "Feudalism ending", "Labor market permanently changed"),
]

for year, event, description in changes:
    pop_ratio = P[year - 1350] / P_pre if year >= 1350 else 1.0
    print(f"  {year}: {event}")
    print(f"         {description} (pop: {pop_ratio:.0%} of pre-plague)\\\n")

print(f"The Black Death killed millions — but it also ended feudalism,")
print(f"raised wages, empowered workers, and drove innovation.")
print(f"This is the grim calculus of population economics:")
print(f"fewer people + same resources = more per person.")`,
      challenge: 'The Malthusian trap says that pre-industrial populations always grow back to the carrying capacity, eliminating any gains from the plague. But Europe didn\'t just recover to the same state — it developed new technology that raised K itself. Add a carrying capacity that increases by 0.1% per year after 1400 (representing agricultural innovation) and see how this changes the long-term trajectory.',
      successHint: 'You modeled demographic recovery and its economic consequences — the same population dynamics studied in ecology, economics, and urban planning. The labor shortage after the Black Death produced effects identical to modern economic theory: scarce labor commands higher wages, which drives automation and social change. The 14th century proved that population dynamics are economic dynamics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Epidemiology and population mathematics through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model SIR epidemics, R₀ calculations, chains of infection, quarantine mathematics, geographic spread, and population recovery.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
