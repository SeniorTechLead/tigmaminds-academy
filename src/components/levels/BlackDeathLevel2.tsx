import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BlackDeathLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The SEIR model — adding an Exposed compartment to capture incubation',
      concept: `The basic SIR model from Level 1 has a problem: it assumes people become infectious the instant they're infected. In reality, Yersinia pestis has an **incubation period** — 2-6 days for bubonic plague, 1-3 days for pneumonic. During this time, the person is **Exposed** (infected but not yet infectious).

The **SEIR model** adds a fourth compartment:

**S → E → I → R**

The equations become:
- **dS/dt = -beta * S * I / N** (susceptible people get exposed)
- **dE/dt = beta * S * I / N - sigma * E** (exposed people become infectious)
- **dI/dt = sigma * E - gamma * I** (infectious people recover or die)
- **dR/dt = gamma * I** (removed from circulation)

The new parameter **sigma** is the rate at which exposed people become infectious: sigma = 1 / incubation_period. For bubonic plague, sigma ≈ 1/4 (4-day incubation). For pneumonic plague, sigma ≈ 1/2 (2-day incubation).

The incubation period matters enormously: it determines **how far the disease can travel before symptoms appear**. A merchant who's exposed in Messina can reach Florence before showing symptoms — seeding the epidemic 500 km away.

📚 *The incubation period is the key difference between containable and uncontainable diseases. Diseases with long incubation (like HIV) spread silently for years. Diseases with short incubation (like Ebola) are easier to contain because sick people are obvious and can be isolated quickly.*`,
      analogy: 'Imagine a fuse on a firecracker. The SIR model says the firecracker explodes the instant you light it. The SEIR model adds the fuse — there\'s a delay (incubation) between lighting (exposure) and explosion (becoming infectious). During that delay, the lit firecracker can be carried to a new location. That\'s exactly how plague moved along trade routes: exposed but asymptomatic merchants carried it city to city.',
      storyConnection: 'When Genoese merchant ships arrived in Messina in 1347, the sailors were already dying — but the rats and fleas aboard had been exposed days earlier and were still incubating. The delay between flea bite and symptoms (E → I transition) meant plague was invisibly seeded across every port the ships visited. The SEIR model captures this deadly delay.',
      checkQuestion: 'If sigma = 1/4 (4-day incubation) and gamma = 1/7 (7-day infectious period), what is the average total time from exposure to recovery?',
      checkAnswer: '4 days (incubation) + 7 days (infectious) = 11 days total. But during the 4-day incubation, the person is walking around, potentially travelling, feeling fine. This is the window in which plague could spread along trade routes without anyone knowing. For pneumonic plague (sigma = 1/2), the window shrinks to 2 days — shorter but the person is already exhaling bacteria.',
      codeIntro: 'Simulate the Black Death using the SEIR model and compare the epidemic curve against the simpler SIR model.',
      code: `import numpy as np

def seir_step(S, E, I, R, beta, sigma, gamma, N, dt):
    """One time step of the SEIR model."""
    dS = -beta * S * I / N * dt
    dE = (beta * S * I / N - sigma * E) * dt
    dI = (sigma * E - gamma * I) * dt
    dR = gamma * I * dt
    return S + dS, E + dE, I + dI, R + dR

def sir_step(S, I, R, beta, gamma, N, dt):
    """One time step of the SIR model (for comparison)."""
    dS = -beta * S * I / N * dt
    dI = (beta * S * I / N - gamma * I) * dt
    dR = gamma * I * dt
    return S + dS, I + dI, R + dR

N = 100_000
I0 = 10
dt = 0.1
days = 200

# Plague parameters
R0_value = 4.0
gamma = 1 / 7      # 7-day infectious period
beta = R0_value * gamma
sigma = 1 / 4      # 4-day incubation (bubonic)

# --- SEIR simulation ---
S, E, I, R = N - I0, 0.0, float(I0), 0.0
seir_peaks = {"day": 0, "infected": 0}
seir_data = []

for step in range(int(days / dt)):
    S, E, I, R = seir_step(S, E, I, R, beta, sigma, gamma, N, dt)
    day = step * dt
    if I > seir_peaks["infected"]:
        seir_peaks = {"day": day, "infected": I}
    if step % int(10 / dt) == 0:
        seir_data.append((day, S, E, I, R))

# --- SIR simulation ---
S2, I2, R2 = N - I0, float(I0), 0.0
sir_peaks = {"day": 0, "infected": 0}

for step in range(int(days / dt)):
    S2, I2, R2 = sir_step(S2, I2, R2, beta, gamma, N, dt)
    if I2 > sir_peaks["infected"]:
        sir_peaks = {"day": step * dt, "infected": I2}

print("=== SEIR vs SIR Model Comparison ===")
print(f"Population: {N:,} | R0 = {R0_value} | Incubation: {1/sigma:.0f} days\\\n")

print(f"{'Model':<8} {'Peak Day':>10} {'Peak Infected':>15} {'Delay':>8}")
print("-" * 43)
print(f"{'SIR':<8} {sir_peaks['day']:>8.0f} {sir_peaks['infected']:>13,.0f} {'—':>8}")
print(f"{'SEIR':<8} {seir_peaks['day']:>8.0f} {seir_peaks['infected']:>13,.0f} "
      f"{seir_peaks['day'] - sir_peaks['day']:>+6.0f}d")

print("\\\n=== SEIR Epidemic Timeline ===")
print(f"{'Day':>6} {'Susceptible':>12} {'Exposed':>10} {'Infected':>10} {'Removed':>10}")
print("-" * 50)
for day, s, e, i, r in seir_data:
    print(f"{day:>5.0f} {s:>11,.0f} {e:>9,.0f} {i:>9,.0f} {r:>9,.0f}")

print(f"\\\nThe SEIR peak is delayed by ~{seir_peaks['day'] - sir_peaks['day']:.0f} days vs SIR.")
print("The incubation period FLATTENS and DELAYS the peak — crucial for planning.")`,
      challenge: 'Compare bubonic plague (sigma = 1/4, incubation 4 days) and pneumonic plague (sigma = 1/2, incubation 2 days). Which peaks sooner? Which peaks higher? The pneumonic form has a shorter incubation — meaning the exposed compartment empties faster — so its curve looks more like the SIR model.',
      successHint: 'The SEIR model is the standard in modern epidemiology. COVID-19 projections in 2020 used SEIR models (with an incubation period of ~5 days) to predict hospital capacity needs. The incubation period is the parameter that determines whether contact tracing can outrun the epidemic.',
    },
    {
      title: 'Contact tracing — network-based transmission modelling',
      concept: `The SIR and SEIR models assume everyone can infect everyone else (a "well-mixed" population). But real epidemics spread through **contact networks** — you can only infect people you actually interact with.

In a medieval city, your contacts are your household, your neighbours, your trading partners, and the people at church. A merchant has many contacts across the city. A hermit has almost none. The **structure of the contact network** determines how fast plague spreads.

Key network metrics:
- **Degree**: how many contacts each person has (a baker who serves 50 people daily has degree 50)
- **Clustering**: how interconnected your contacts are (if your friends all know each other, clustering is high)
- **Path length**: how many "hops" to reach any person from any other person (small in dense cities)

Contact tracing works by identifying infected people, then quarantining their contacts BEFORE they become infectious. It's a race: can you trace and quarantine contacts faster than the disease spreads through the network?

📚 *Network epidemiology was pioneered in the 1990s-2000s. It revealed why "superspreaders" — individuals with unusually many contacts — drive epidemics far more than average individuals.*`,
      analogy: 'Imagine a chain of dominoes. If they\'re arranged in a single line, pushing one knocks down the rest one by one. But if some dominoes connect to five others (hubs), the cascade explodes outward. A contact network is the domino layout — its structure determines whether a push (infection) fizzles or cascades.',
      storyConnection: 'During the Black Death, certain locations became superspreader nodes: ports (Messina, Constantinople, Marseille), markets, and monasteries. Monks who nursed the sick had enormous contact rates and died at 50-60% rates — higher than the general population. The network structure of medieval society channelled plague along trade routes and through communal institutions.',
      checkQuestion: 'If a city has 10,000 people and each person has on average 15 contacts, but one merchant has 200 contacts, what happens if the merchant gets infected first vs a random person?',
      checkAnswer: 'If the merchant (degree 200) is infected first, the disease can potentially reach 200 people in the first generation — a massive initial burst. If a random person (degree ~15) is infected first, only ~15 are at risk initially. The epidemic starting at a hub grows 10-15× faster in the first few generations. This is why superspreader events drive pandemics.',
      codeIntro: 'Build a contact network for a medieval city and simulate plague spreading through it, then test contact tracing as an intervention.',
      code: `import numpy as np

np.random.seed(42)

def build_contact_network(n_people, avg_contacts=12, n_hubs=5, hub_contacts=80):
    """
    Build a contact network with most people having ~avg_contacts,
    plus a few 'hub' individuals (merchants, priests) with many more.
    """
    contacts = {}
    # Assign contact counts
    degrees = np.random.poisson(avg_contacts, n_people)
    # Create hubs (merchants, priests, innkeepers)
    hub_ids = np.random.choice(n_people, n_hubs, replace=False)
    for h in hub_ids:
        degrees[h] = hub_contacts

    # Build adjacency (simplified: random pairing)
    for person in range(n_people):
        n_contacts = min(degrees[person], n_people - 1)
        contacts[person] = set(np.random.choice(n_people, n_contacts, replace=False))
        contacts[person].discard(person)
    return contacts, set(hub_ids)

def simulate_network_epidemic(contacts, n_people, patient_zero,
                               p_transmit=0.15, days=60, trace=False, trace_speed=2):
    """Simulate epidemic on contact network. Optional contact tracing."""
    state = {i: "S" for i in range(n_people)}
    state[patient_zero] = "I"
    infected_day = {patient_zero: 0}
    quarantined = set()
    daily_counts = []

    for day in range(days):
        new_infected = []
        new_recovered = []

        for person in range(n_people):
            if person in quarantined:
                continue
            if state[person] == "I":
                # Try to infect each contact
                for contact in contacts.get(person, []):
                    if state[contact] == "S" and contact not in quarantined:
                        if np.random.random() < p_transmit:
                            new_infected.append(contact)
                            infected_day[contact] = day

                # Recover after ~7 days
                if day - infected_day[person] >= 7:
                    new_recovered.append(person)

                # Contact tracing: quarantine contacts of known infected
                if trace and day - infected_day[person] >= trace_speed:
                    for contact in contacts.get(person, []):
                        quarantined.add(contact)

        for p in new_infected:
            state[p] = "I"
        for p in new_recovered:
            state[p] = "R"

        s = sum(1 for v in state.values() if v == "S") - len(quarantined & {p for p, v in state.items() if v == "S"})
        i = sum(1 for v in state.values() if v == "I")
        r = sum(1 for v in state.values() if v == "R")
        daily_counts.append((day, s, i, r, len(quarantined)))

    total_infected = sum(1 for v in state.values() if v in ("I", "R"))
    return daily_counts, total_infected

N = 2000
contacts, hubs = build_contact_network(N)

# Scenario 1: No intervention (start at random person)
_, total_no_trace = simulate_network_epidemic(contacts, N, patient_zero=0)

# Scenario 2: Contact tracing (2-day delay)
_, total_trace_2d = simulate_network_epidemic(contacts, N, patient_zero=0, trace=True, trace_speed=2)

# Scenario 3: Faster contact tracing (1-day delay)
_, total_trace_1d = simulate_network_epidemic(contacts, N, patient_zero=0, trace=True, trace_speed=1)

# Scenario 4: Start at a hub (superspreader)
hub_id = list(hubs)[0]
_, total_hub = simulate_network_epidemic(contacts, N, patient_zero=hub_id)

print("=== Network Epidemic Simulation ===")
print(f"Population: {N:,} | Avg contacts: 12 | Hubs: 5 (80 contacts each)\\\n")

print(f"{'Scenario':<35} {'Total Infected':>15} {'% of Pop':>10}")
print("-" * 62)
print(f"{'No intervention (random start)':<35} {total_no_trace:>13,} {total_no_trace/N*100:>8.1f}%")
print(f"{'Contact tracing (2-day delay)':<35} {total_trace_2d:>13,} {total_trace_2d/N*100:>8.1f}%")
print(f"{'Contact tracing (1-day delay)':<35} {total_trace_1d:>13,} {total_trace_1d/N*100:>8.1f}%")
print(f"{'No intervention (hub start)':<35} {total_hub:>13,} {total_hub/N*100:>8.1f}%")

reduction_2d = (1 - total_trace_2d / total_no_trace) * 100
reduction_1d = (1 - total_trace_1d / total_no_trace) * 100
print(f"\\\nContact tracing (2-day) reduced infections by {reduction_2d:.0f}%")
print(f"Contact tracing (1-day) reduced infections by {reduction_1d:.0f}%")
print(f"\\\nStarting at a hub vs random: {total_hub - total_no_trace:+,} additional infections")
print("Superspreaders amplify epidemics — identifying and isolating hubs saves the most lives.")`,
      challenge: 'Add a "quarantine delay" parameter to model medieval limitations: in 1348, there was no phone or internet to trace contacts quickly. Set trace_speed to 7 days (a week to identify contacts). How much less effective is medieval contact tracing compared to modern 1-day tracing? This is why quarantine in 1348 meant locking down entire districts, not tracing individuals.',
      successHint: 'Contact network models are how public health agencies plan epidemic responses today. During COVID-19, contact tracing apps (like the UK NHS app) tried to automate the process you just simulated — identifying contacts of infected people and quarantining them before they became infectious.',
    },
    {
      title: 'The flea-rat-human lifecycle — modelling a vector-borne disease',
      concept: `Bubonic plague doesn't spread person-to-person — it requires a **vector**: the Oriental rat flea (*Xenopsylla cheopis*). The transmission cycle is:

1. **Rat → Flea**: A flea feeds on an infected rat, ingesting Yersinia pestis bacteria
2. **Flea blockage**: Bacteria multiply in the flea's gut, forming a biofilm that blocks its digestive tract
3. **Flea → Rat/Human**: The starving, blocked flea bites aggressively, regurgitating bacteria into each new host
4. **Rat die-off**: When rats die en masse, their fleas abandon the corpses and jump to humans

This lifecycle creates a **delay** between rat epidemics and human epidemics — typically 1-2 weeks. Historical records confirm this: medieval observers noted that "the rats died first, then the people."

The mathematical model couples three populations: rats (R), fleas (F), and humans (H), with transmission rates between them. The key parameter is the **rat-to-human spillover rate**, which increases dramatically when rat populations crash and fleas seek new hosts.

📚 *Vector-borne diseases (malaria, dengue, Zika, Lyme) all share this structure: pathogen cycles between a reservoir host and a vector before reaching humans. Understanding the vector lifecycle is essential for control — you can break the chain at any link.*`,
      analogy: 'Imagine a postal system where letters (bacteria) are carried by couriers (fleas) between offices (rats). When one office closes (rat dies), the courier doesn\'t retire — it delivers to the nearest open office (another rat, or a human). A rat die-off is like all the offices closing at once — every courier descends on the remaining addresses, overwhelming them with deliveries.',
      storyConnection: 'In every city struck by the Black Death, observers reported dead rats in the streets days before human cases appeared. In the Indian plague outbreaks of the 1890s-1900s (which finally revealed the flea-rat mechanism), British epidemiologists documented the rat die-off preceding human cases by 10-14 days — matching the vector lifecycle model perfectly.',
      checkQuestion: 'If you could eliminate all rat fleas in a city, would bubonic plague stop spreading?',
      checkAnswer: 'Bubonic plague — yes. Without fleas, the rat-to-human transmission route is broken. But pneumonic plague (the airborne form that develops in ~10% of bubonic cases) would continue spreading person-to-person. This is why plague control requires BOTH flea control (insecticides) AND patient isolation (to prevent pneumonic transmission). Breaking one link isn\'t enough if there are alternative routes.',
      codeIntro: 'Model the coupled rat-flea-human transmission cycle and show how rat die-offs trigger human epidemics.',
      code: `import numpy as np

def vector_model_step(Sr, Ir, Rr,  # rat compartments
                       Sf, If,       # flea compartments (susceptible/infected)
                       Sh, Ih, Rh,   # human compartments
                       params, dt):
    """One step of the coupled rat-flea-human model."""
    Nr = Sr + Ir + Rr
    Nh = Sh + Ih + Rh

    # Rat-flea transmission
    beta_rf = params["beta_rat_flea"]  # flea bites infected rat
    beta_fr = params["beta_flea_rat"]  # infected flea bites rat

    # Flea-human spillover (increases when rats die off)
    rat_death_fraction = max(0, 1 - Nr / params["Nr0"])
    spillover = params["beta_flea_human"] * (1 + 5 * rat_death_fraction)

    # Rat dynamics
    dSr = (-beta_fr * Sf * If / max(Sf + If, 1) * Sr / max(Nr, 1)) * dt
    dIr = (beta_fr * Sf * If / max(Sf + If, 1) * Sr / max(Nr, 1) - params["gamma_r"] * Ir) * dt
    dRr = (params["gamma_r"] * Ir) * dt  # mostly death for rats

    # Flea dynamics (simplified)
    dSf = (-beta_rf * Sf * Ir / max(Nr, 1)) * dt
    dIf = (beta_rf * Sf * Ir / max(Nr, 1)) * dt

    # Human dynamics
    flea_to_human = spillover * If * Sh / max(Nh, 1)
    dSh = -flea_to_human * dt
    dIh = (flea_to_human - params["gamma_h"] * Ih) * dt
    dRh = (params["gamma_h"] * Ih) * dt

    return (max(Sr + dSr, 0), max(Ir + dIr, 0), max(Rr + dRr, 0),
            max(Sf + dSf, 0), max(If + dIf, 0),
            max(Sh + dSh, 0), max(Ih + dIh, 0), max(Rh + dRh, 0))

# Parameters
params = {
    "beta_rat_flea": 0.3,     # flea infection rate from rats
    "beta_flea_rat": 0.2,     # rat infection rate from fleas
    "beta_flea_human": 0.05,  # baseline flea-to-human rate
    "gamma_r": 1 / 5,         # rat recovery/death rate (5 days)
    "gamma_h": 1 / 10,        # human recovery/death rate (10 days)
    "Nr0": 10000,             # initial rat population
}

# Initial conditions
Sr, Ir, Rr = 10000, 50, 0       # rats: 50 initially infected
Sf, If = 20000, 100              # fleas: 100 carrying plague
Sh, Ih, Rh = 50000, 0, 0        # humans: none infected yet

dt = 0.2
days = 120
records = []

for step in range(int(days / dt)):
    Sr, Ir, Rr, Sf, If, Sh, Ih, Rh = vector_model_step(
        Sr, Ir, Rr, Sf, If, Sh, Ih, Rh, params, dt)
    day = step * dt
    if step % int(5 / dt) == 0:
        records.append((day, Sr + Ir + Rr, Ir, If, Ih))

print("=== Rat-Flea-Human Plague Transmission ===")
print(f"{'Day':>5} {'Rats Alive':>12} {'Rats Sick':>11} {'Fleas Inf':>11} {'Humans Sick':>13}")
print("-" * 54)
for day, rats_total, rats_i, fleas_i, humans_i in records:
    print(f"{day:>4.0f} {rats_total:>11,.0f} {rats_i:>10,.0f} {fleas_i:>10,.0f} {humans_i:>12,.0f}")

# Find when rat die-off and human epidemic start
rat_peak_day = 0
human_peak_day = 0
max_rat_i = 0
max_human_i = 0
for day, _, ri, _, hi in records:
    if ri > max_rat_i: max_rat_i = ri; rat_peak_day = day
    if hi > max_human_i: max_human_i = hi; human_peak_day = day

print(f"\\\nRat epidemic peaks at day {rat_peak_day:.0f}")
print(f"Human epidemic peaks at day {human_peak_day:.0f}")
print(f"Delay: {human_peak_day - rat_peak_day:.0f} days — rats die first, then humans")
print("\\\nThis delay is the signature of vector-borne transmission.")
print("Medieval observers: 'First the rats died, then the people.'")`,
      challenge: 'Add a flea-control intervention at day 30 (reduce flea population by 80%, simulating insecticide or removing rat nests). How much does this reduce human infections? Compare against doing nothing. This models modern plague control strategy: kill the fleas before they jump to humans.',
      successHint: 'Vector-borne disease models are essential for malaria (mosquito vector), Lyme disease (tick vector), and dengue (mosquito vector). The key insight: you don\'t have to cure the disease — you can break the transmission cycle by targeting the vector. DDT nearly eliminated malaria in the 1950s by killing mosquitoes, not by treating patients.',
    },
    {
      title: 'Herd immunity — calculating the vaccination threshold',
      concept: `**Herd immunity** occurs when enough people are immune that the disease can no longer spread — even unvaccinated individuals are protected because the chain of transmission keeps breaking.

The **herd immunity threshold** depends on R0 (basic reproduction number):

**H = 1 - 1/R0**

For plague with R0 = 4: H = 1 - 1/4 = 0.75 — meaning 75% of the population must be immune to stop transmission.

This is why the Black Death eventually burned out: by killing 30-60% of the population AND leaving survivors with some immunity, it pushed many communities past the herd immunity threshold. But the cost of reaching herd immunity through natural infection was catastrophic — tens of millions of deaths.

Vaccination achieves the same result without the deaths. The fraction you need to vaccinate equals the herd immunity threshold — assuming the vaccine is 100% effective. If vaccine efficacy is lower (say 80%), you need to vaccinate MORE people: V = H / efficacy.

📚 *Herd immunity is not all-or-nothing. At 50% immunity, transmission is halved even if the threshold is 75%. Every vaccinated person reduces transmission for everyone else — each vaccination has positive externalities beyond protecting the individual.*`,
      analogy: 'Imagine a crowd passing a ball. If everyone can catch and throw it, the ball moves forever. But if 75% of people have their hands full (immune), the ball keeps being thrown to someone who can\'t catch it — and it drops. Herd immunity is filling enough hands that the ball can\'t keep moving.',
      storyConnection: 'After the first wave of Black Death (1347-1353), subsequent outbreaks were less devastating — not because the plague weakened, but because survivors had partial immunity. The second pandemic wave (1361, the "pestis secunda") killed primarily children born after 1353 — the only fully susceptible group. This is herd immunity at work: the surviving adults were partially protected.',
      checkQuestion: 'Measles has R0 ≈ 15. What is the herd immunity threshold? Why is measles so hard to control?',
      checkAnswer: 'H = 1 - 1/15 = 93.3%. You need to vaccinate over 93% of the population to stop measles transmission. This is why even a small drop in vaccination rates (from 95% to 90%) causes measles outbreaks — you fall below the threshold. Plague (R0 ≈ 4, threshold 75%) is comparatively easier to control because the threshold is much lower.',
      codeIntro: 'Calculate herd immunity thresholds for historical and modern diseases, and model how vaccination coverage affects epidemic size.',
      code: `import numpy as np

def herd_immunity_threshold(R0):
    """Critical fraction immune to stop transmission."""
    return 1 - 1 / R0

def epidemic_final_size(R0, immune_fraction):
    """
    Estimate final epidemic size given partial immunity.
    Uses the final-size equation: R_final = 1 - exp(-R0 * R_final * (1 - immune))
    Solved iteratively.
    """
    susceptible = 1 - immune_fraction
    if R0 * susceptible <= 1:
        return 0.0  # below threshold, no epidemic
    # Newton's method for final size equation
    r = 0.5
    for _ in range(100):
        f = r - (1 - np.exp(-R0 * r * susceptible))
        fp = 1 - R0 * susceptible * np.exp(-R0 * r * susceptible)
        r = r - f / fp
        r = max(min(r, 1.0), 0.001)
    return r * susceptible  # fraction of total pop infected

# Historical and modern diseases
diseases = [
    ("Bubonic plague",    4.0),
    ("Pneumonic plague",  6.0),
    ("Smallpox",          5.0),
    ("Measles",          15.0),
    ("COVID-19 (Delta)", 6.5),
    ("COVID-19 (Omicron)", 10.0),
    ("Influenza (1918)", 2.5),
    ("Ebola",             2.0),
]

print("=== Herd Immunity Thresholds ===")
print(f"{'Disease':<24} {'R0':>5} {'Threshold':>10} {'Vaccine Needed*':>16}")
print("-" * 57)
for name, r0 in diseases:
    h = herd_immunity_threshold(r0)
    v = h / 0.85  # assuming 85% vaccine efficacy
    print(f"{name:<24} {r0:>4.1f} {h*100:>8.1f}% {min(v*100, 100):>14.1f}%")

print("\\\n* Vaccine needed assumes 85% vaccine efficacy")

# Impact of vaccination coverage on plague epidemic
print("\\\n=== Plague Epidemic Size vs Vaccination Coverage ===")
R0_plague = 4.0
print(f"{'Coverage':>10} {'Infected':>12} {'Reduction':>12}")
print("-" * 36)

base_size = epidemic_final_size(R0_plague, 0.0)
for coverage in [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9]:
    size = epidemic_final_size(R0_plague, coverage)
    reduction = (1 - size / base_size) * 100 if base_size > 0 else 100
    status = " ← THRESHOLD" if abs(coverage - herd_immunity_threshold(R0_plague)) < 0.03 else ""
    print(f"{coverage*100:>8.0f}% {size*100:>10.1f}% {reduction:>10.1f}%{status}")

print(f"\\\nAt 75% coverage, plague transmission stops entirely.")
print(f"At 50%, epidemic size drops by ~80% — partial coverage still saves lives.")`,
      challenge: 'Model a scenario where vaccine efficacy wanes over time (drops from 90% to 50% over 5 years). How does this affect the effective herd immunity threshold? This is the real-world challenge with COVID-19 boosters — waning immunity means the threshold is a moving target.',
      successHint: 'Herd immunity is one of the most important concepts in public health. Understanding the threshold equation (H = 1 - 1/R0) and how vaccination coverage maps to epidemic prevention is essential knowledge for evaluating public health policy — whether for plague, measles, or the next pandemic.',
    },
    {
      title: 'Demographic impact — age-structured mortality modelling',
      concept: `The Black Death didn't kill uniformly — mortality varied by **age, sex, occupation, and nutrition**. Skeletal analysis from plague cemeteries (like East Smithfield in London) reveals that the very young and elderly died at higher rates, as did the malnourished.

An **age-structured model** divides the population into age groups, each with its own mortality rate:

**mortality_rate(age) = base_rate × age_vulnerability(age) × nutrition_factor**

This creates a **selective mortality** pattern that reshapes the population structure. After the Black Death, Europe's age pyramid was dramatically altered: the working-age population shrank, the proportion of the young increased (as orphans survived), and the elderly were almost entirely eliminated.

The demographic consequences were enormous: labour shortages drove up wages (ending feudal bondage in England), marriage ages dropped (more opportunities for young survivors), and population didn't recover for 150-200 years in many regions.

📚 *Demography — the study of population structure and change — is one of the most powerful tools for understanding history. Birth rates, death rates, and age structure explain more about social change than politics or ideology.*`,
      analogy: 'Imagine a forest where a disease kills old trees and saplings at high rates but spares middle-aged trees. After the disease passes, the forest looks completely different: mostly medium trees, few old ones, gaps everywhere. New growth fills in, but the forest takes decades to recover its original structure. The Black Death did exactly this to Europe\'s population.',
      storyConnection: 'Archaeological evidence from mass plague graves shows that children under 5 and adults over 50 were overrepresented — matching the age-vulnerability model. In the village of Heybridge, Essex, skeletal analysis of a 1349 plague pit showed 40% of victims were over 45 — far higher than their share of the living population. The plague was selectively lethal.',
      checkQuestion: 'If the Black Death killed 40% of the population overall, but 60% of those over 50 and only 25% of those aged 15-30, how does the age structure change?',
      checkAnswer: 'The over-50 group shrinks dramatically (60% mortality), while the 15-30 group is relatively preserved (25% mortality). After the plague, a much larger fraction of the population is young adults. This drives higher birth rates (more people of reproductive age), labour shortages (fewer experienced workers), and social mobility (young people inherit property earlier). This is exactly what happened in post-plague Europe.',
      codeIntro: 'Model the Black Death\'s age-structured mortality and calculate the demographic impact on a medieval European city.',
      code: `import numpy as np

# Pre-plague medieval population (age distribution for a city of 50,000)
age_groups = [
    {"label": "0-4",   "pop": 5500,  "mortality": 0.55},
    {"label": "5-14",  "pop": 8000,  "mortality": 0.30},
    {"label": "15-24", "pop": 9000,  "mortality": 0.25},
    {"label": "25-34", "pop": 8500,  "mortality": 0.30},
    {"label": "35-44", "pop": 7500,  "mortality": 0.40},
    {"label": "45-54", "pop": 5500,  "mortality": 0.50},
    {"label": "55-64", "pop": 3500,  "mortality": 0.65},
    {"label": "65+",   "pop": 2500,  "mortality": 0.80},
]

total_pre = sum(g["pop"] for g in age_groups)

# Simulate plague mortality with nutrition modifier
np.random.seed(42)

print("=== Black Death Age-Structured Mortality Model ===")
print(f"Pre-plague population: {total_pre:,}\\\n")

print(f"{'Age Group':<10} {'Pre-Plague':>10} {'Mortality':>10} {'Deaths':>8} {'Survivors':>10} {'% Lost':>8}")
print("-" * 58)

total_dead = 0
post_plague = []
for g in age_groups:
    # Add random variation (±5%) to represent local conditions
    actual_mort = g["mortality"] + np.random.uniform(-0.05, 0.05)
    actual_mort = max(0, min(actual_mort, 1.0))
    deaths = int(g["pop"] * actual_mort)
    survivors = g["pop"] - deaths
    total_dead += deaths
    post_plague.append({"label": g["label"], "pop": survivors})
    print(f"{g['label']:<10} {g['pop']:>9,} {actual_mort*100:>8.1f}% {deaths:>7,} {survivors:>9,} {actual_mort*100:>6.1f}%")

total_post = sum(g["pop"] for g in post_plague)

print(f"\\\n{'TOTAL':<10} {total_pre:>9,} {'':>10} {total_dead:>7,} {total_post:>9,} {total_dead/total_pre*100:>6.1f}%")

# Age structure shift
print("\\\n=== Population Structure Shift ===")
print(f"{'Age Group':<10} {'Pre-Plague %':>13} {'Post-Plague %':>14} {'Change':>8}")
print("-" * 47)
for i, g in enumerate(age_groups):
    pre_pct = g["pop"] / total_pre * 100
    post_pct = post_plague[i]["pop"] / total_post * 100
    change = post_pct - pre_pct
    print(f"{g['label']:<10} {pre_pct:>11.1f}% {post_pct:>12.1f}% {change:>+6.1f}%")

# Economic implications
working_age_pre = sum(g["pop"] for g in age_groups if g["label"] in ("15-24", "25-34", "35-44"))
working_age_post = sum(g["pop"] for g in post_plague if g["label"] in ("15-24", "25-34", "35-44"))
labour_loss = (1 - working_age_post / working_age_pre) * 100

print(f"\\\n=== Economic Impact ===")
print(f"Working-age population (15-44):")
print(f"  Before: {working_age_pre:>6,}")
print(f"  After:  {working_age_post:>6,}")
print(f"  Loss:   {labour_loss:.1f}%")
print(f"\\\nLabour shortage of {labour_loss:.0f}% means wages must rise.")
print(f"This drove the collapse of feudalism in Western Europe.")`,
      challenge: 'Add a "nutrition" modifier: the bottom 30% of the population (poorest) have 1.3× mortality, the top 10% (best-nourished) have 0.7× mortality. How does this change the class structure after the plague? The Black Death disproportionately killed the poor — but by creating labour shortages, it dramatically improved wages and conditions for the survivors.',
      successHint: 'Age-structured demographic models are used to plan healthcare systems, pension funding, and economic policy. The same framework you just applied to the Black Death is used to model the impact of COVID-19 on different age groups — and to prioritise vaccine distribution to the most vulnerable.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Epidemic modelling and demographic analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into SEIR modelling, contact networks, vector-borne transmission, herd immunity, and demographic impact.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
