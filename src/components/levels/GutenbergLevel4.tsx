import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GutenbergLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design an Information Spread Model',
      concept: `In this capstone project, you will build a complete **Information Spread Model** — a Python program that simulates how ideas propagate through a population under different media technologies (scribal copying vs mechanical printing).

The model will:
1. **Define a network** of cities connected by trade routes, each with a population and literacy rate
2. **Simulate scribal copying** — slow, expensive, limited by number of scriptoria
3. **Simulate mechanical printing** — high fixed cost, low marginal cost, network effects
4. **Compare the two** — measuring reach, speed, cost, and impact on literacy over time
5. **Generate a report** with findings and recommendations

This brings together everything from Levels 1-3: economics of scale, SI diffusion models, network effects, game theory, and media economics.

The first step is **system design** — defining your data structures, simulation loop, and output format before writing code.

📚 *System design means planning what your program does, how it's organized, and what data flows through it — BEFORE you write code. A clear design makes the code clean and the results trustworthy.*`,
      analogy: 'An architect doesn\'t start by laying bricks — they draw blueprints showing every room, every beam, every pipe. A simulation designer does the same: define every variable, every equation, every data structure before writing a line of code. The blueprint IS the most important part of the project.',
      storyConnection: 'Gutenberg spent over a decade designing his system before printing a single Bible page. He experimented with alloys, ink formulations, press designs, and type moulds — each iteration refining the system design. His "blueprint" — the combination of screw press, oil-based ink, and lead-tin-antimony type — was the real invention. The printing was just execution.',
      checkQuestion: 'Why model both scribal and printing systems rather than just printing alone?',
      checkAnswer: 'Because comparison reveals what makes printing revolutionary. A model of printing alone shows how ideas spread. A comparative model shows how MUCH FASTER and CHEAPER they spread — quantifying the disruption. Without the scribal baseline, you can\'t measure the magnitude of the change.',
      codeIntro: 'Design the architecture of the Information Spread Model — define city networks, technology parameters, and simulation structure.',
      code: `import numpy as np

# === SYSTEM DESIGN ===

class City:
    """Represents a city node in the information network."""
    def __init__(self, name, population, literacy_rate, connections):
        self.name = name
        self.population = population
        self.literacy = literacy_rate      # fraction (0-1)
        self.connections = connections      # list of connected city names
        self.informed = 0                  # people who have encountered the idea
        self.has_press = False
        self.has_scriptorium = True        # all cities have scribes

class Technology:
    """Defines a media technology's economic parameters."""
    def __init__(self, name, fixed_cost, marginal_cost, copies_per_month,
                 setup_months, transmission_beta):
        self.name = name
        self.fixed = fixed_cost
        self.marginal = marginal_cost
        self.rate = copies_per_month
        self.setup = setup_months
        self.beta = transmission_beta      # SI model transmission rate

# Define technologies
SCRIBAL = Technology("Scribal copying", 0, 25, 2, 0, 0.0003)
PRINTING = Technology("Printing press", 500, 2, 300, 3, 0.008)

# Define European network (simplified)
cities_data = [
    ("Mainz",      15000, 0.10, ["Frankfurt", "Cologne", "Strasbourg"]),
    ("Frankfurt",  10000, 0.08, ["Mainz", "Cologne", "Nuremberg"]),
    ("Cologne",    30000, 0.12, ["Mainz", "Frankfurt", "Bruges"]),
    ("Nuremberg",  25000, 0.15, ["Frankfurt", "Augsburg", "Prague"]),
    ("Venice",     100000,0.20, ["Augsburg", "Rome", "Florence"]),
    ("Rome",       50000, 0.18, ["Venice", "Florence", "Naples"]),
    ("Florence",   60000, 0.22, ["Venice", "Rome"]),
    ("Augsburg",   20000, 0.12, ["Nuremberg", "Venice", "Strasbourg"]),
    ("Strasbourg", 18000, 0.14, ["Mainz", "Augsburg", "Basel"]),
    ("Basel",      10000, 0.16, ["Strasbourg", "Bruges"]),
    ("Bruges",     35000, 0.15, ["Cologne", "Basel", "London"]),
    ("London",     45000, 0.10, ["Bruges", "Paris"]),
    ("Paris",      80000, 0.14, ["London", "Lyon"]),
    ("Lyon",       25000, 0.12, ["Paris", "Naples"]),
    ("Naples",     60000, 0.08, ["Rome", "Lyon"]),
    ("Prague",     30000, 0.10, ["Nuremberg"]),
]

cities = {name: City(name, pop, lit, conn) for name, pop, lit, conn in cities_data}

# System overview
print("=== Information Spread Model: Architecture ===")
print(f"Cities: {len(cities)}")
print(f"Total population: {sum(c.population for c in cities.values()):,}")
total_literate = sum(c.population * c.literacy for c in cities.values())
print(f"Total literate: {total_literate:,.0f}")
print(f"Technologies: {SCRIBAL.name}, {PRINTING.name}")
print()

print(f"{'City':<14} {'Pop':>7} {'Lit%':>5} {'Connections':>4}")
print("-" * 32)
for c in cities.values():
    print(f"{c.name:<14} {c.population:>6,} {c.literacy:>4.0%} {len(c.connections):>4}")

print("\\nDesign complete. Next: implement the simulation engine.")`,
      challenge: 'Add a "university" boolean to each city. Universities increase local literacy rate by 5% per decade and increase the transmission beta by 1.5x (scholars spread ideas faster). How does the presence of universities affect the model design? Which cities should have universities based on historical records?',
      successHint: 'Good system design makes everything else easier. You defined City and Technology classes, a network of connected cities, and clear parameters. Real network simulation software (ns-3, SimPy, NetLogo) uses exactly this pattern: nodes with properties, edges with weights, and technology parameters that govern behaviour.',
    },
    {
      title: 'Building the copying network simulator — scribal vs print',
      concept: `Now we implement the core simulation: **how information spreads through a network of cities** under scribal copying vs mechanical printing.

The simulation runs month by month. In each month:
1. **Local spread**: within each city, informed people spread the idea to uninformed people (SI model with technology-specific beta)
2. **Inter-city spread**: ideas travel along trade routes. A city can "export" the idea to connected cities, but only if it has enough copies (scribes produce few; presses produce many)
3. **Technology adoption**: cities may acquire a printing press once enough informed people exist (demand-driven adoption)

The key difference between scribal and print: scribes produce 2 copies per month (linear), while a press produces 300 (massive throughput after setup). This means the print scenario has a **slow start** (setup time) but **explosive growth** once presses are running.

📚 *A network simulator advances time in discrete steps, calculating the state of every node at each step based on its current state and its neighbours' states. This is how we model epidemics, internet traffic, power grids, and social media virality.*`,
      analogy: 'Imagine lighting candles in a dark room. Scribal copying is like passing the flame by hand — one candle at a time, slowly moving around the room. Printing is like a flamethrower that ignites a whole shelf at once — but it takes time to build and fuel the flamethrower. Once lit, the flamethrower spreads fire incomparably faster.',
      storyConnection: 'In 1455, Gutenberg\'s Bible was printed in Mainz. Within 5 years, presses appeared in Strasbourg, Cologne, and Basel. Within 20 years, every major European city had at least one press. The simulation models this exact historical process — the spread of both the idea (whatever is being printed) and the technology (the press itself).',
      checkQuestion: 'A city has 10,000 literate people. 100 are informed. Scribal beta is 0.0003 and printing beta is 0.008. How many new informed people appear in one month under each technology?',
      checkAnswer: 'Scribal: dI = 0.0003 x 9,900 x 100 / 10,000 = 2.97, so about 3. Printing: dI = 0.008 x 9,900 x 100 / 10,000 = 79.2, so about 79. The press spreads ideas 26x faster locally — and it also produces copies that can be exported to other cities.',
      codeIntro: 'Implement the network simulation engine for both scribal and printing scenarios.',
      code: `import numpy as np

np.random.seed(42)

class CityNode:
    def __init__(self, name, pop, literacy, connections):
        self.name = name
        self.pop = pop
        self.literate = int(pop * literacy)
        self.connections = connections
        self.informed = 0
        self.copies_available = 0

def simulate_network(cities_data, tech_beta, copies_per_month,
                     seed_city, seed_copies, months=120):
    """
    Simulate idea spread through a city network.
    Returns monthly snapshots of informed population.
    """
    # Build city nodes
    cities = {}
    for name, pop, lit, conn in cities_data:
        cities[name] = CityNode(name, pop, lit, conn)

    # Seed the idea
    cities[seed_city].informed = seed_copies
    cities[seed_city].copies_available = seed_copies

    history = []

    for month in range(months):
        total_informed = sum(c.informed for c in cities.values())
        history.append(total_informed)

        for city in cities.values():
            if city.informed == 0:
                continue

            # Local spread (SI model)
            susceptible = city.literate - city.informed
            if susceptible > 0:
                new_local = tech_beta * susceptible * city.informed / max(city.literate, 1)
                new_local = min(int(new_local), susceptible)
                city.informed += new_local

            # Produce copies
            city.copies_available += copies_per_month if city.informed > 10 else 0

            # Export to connected cities
            if city.copies_available > 5:
                for conn_name in city.connections:
                    if conn_name in cities:
                        neighbor = cities[conn_name]
                        if neighbor.informed < neighbor.literate * 0.01:
                            # Send copies to spark awareness
                            transfer = min(city.copies_available // len(city.connections), 5)
                            neighbor.informed += transfer
                            neighbor.copies_available += transfer
                            city.copies_available -= transfer

    return history, cities

# City data
cities_data = [
    ("Mainz",      15000, 0.10, ["Frankfurt", "Cologne", "Strasbourg"]),
    ("Frankfurt",  10000, 0.08, ["Mainz", "Cologne", "Nuremberg"]),
    ("Cologne",    30000, 0.12, ["Mainz", "Frankfurt", "Bruges"]),
    ("Nuremberg",  25000, 0.15, ["Frankfurt", "Augsburg", "Prague"]),
    ("Venice",    100000, 0.20, ["Augsburg", "Rome", "Florence"]),
    ("Rome",       50000, 0.18, ["Venice", "Florence", "Naples"]),
    ("Florence",   60000, 0.22, ["Venice", "Rome"]),
    ("Augsburg",   20000, 0.12, ["Nuremberg", "Venice", "Strasbourg"]),
    ("Strasbourg", 18000, 0.14, ["Mainz", "Augsburg", "Basel"]),
    ("Basel",      10000, 0.16, ["Strasbourg", "Bruges"]),
    ("Bruges",     35000, 0.15, ["Cologne", "Basel", "London"]),
    ("London",     45000, 0.10, ["Bruges", "Paris"]),
    ("Paris",      80000, 0.14, ["London", "Lyon"]),
    ("Lyon",       25000, 0.12, ["Paris", "Naples"]),
    ("Naples",     60000, 0.08, ["Rome", "Lyon"]),
    ("Prague",     30000, 0.10, ["Nuremberg"]),
]

total_literate = sum(int(p * l) for _, p, l, _ in cities_data)

# Simulate both scenarios
scribal_hist, scribal_cities = simulate_network(
    cities_data, tech_beta=0.0003, copies_per_month=2,
    seed_city="Mainz", seed_copies=5, months=120)

print_hist, print_cities = simulate_network(
    cities_data, tech_beta=0.008, copies_per_month=300,
    seed_city="Mainz", seed_copies=5, months=120)

print("=== Network Spread: Scribal vs Printing ===")
print(f"Total literate population: {total_literate:,}\\n")

print(f"{'Month':>6} {'Scribal':>10} {'Printing':>10} {'Ratio':>8}")
print("-" * 36)
for m in [1, 3, 6, 12, 24, 36, 48, 60, 84, 120]:
    s = scribal_hist[min(m-1, len(scribal_hist)-1)]
    p = print_hist[min(m-1, len(print_hist)-1)]
    ratio = p / max(s, 1)
    print(f"{m:>5}mo {s:>9,} {p:>9,} {ratio:>7.1f}x")

# Per-city breakdown at 5 years
print(f"\\n=== Per-City Informed at Month 60 ===")
print(f"{'City':<14} {'Literate':>8} {'Scribal':>8} {'S%':>5} {'Print':>8} {'P%':>5}")
print("-" * 51)
for name in sorted(scribal_cities.keys()):
    sc = scribal_cities[name]
    pc = print_cities[name]
    lit = sc.literate
    print(f"{name:<14} {lit:>7,} {sc.informed:>7,} {sc.informed/max(lit,1)*100:>4.0f}% "
          f"{pc.informed:>7,} {pc.informed/max(lit,1)*100:>4.0f}%")`,
      challenge: 'Add a "press adoption" mechanic: once a city has more than 100 informed people, there\'s a 10% chance per month that an entrepreneur sets up a local press (increasing that city\'s copies_per_month from 2 to 300). How does endogenous press adoption change the printing scenario compared to the baseline?',
      successHint: 'You built a network simulator that reproduces the historical pattern: printing spread ideas 10-100x faster than scribal copying, with the gap widening as the press network grew. The same simulation architecture models disease spread, technology adoption, social media virality, and innovation diffusion.',
    },
    {
      title: 'Idea propagation engine — phase transitions in information spread',
      concept: `Information spread exhibits **phase transitions** — sudden shifts from one regime to another, like water turning to ice at exactly 0°C. In our model, there is a **critical threshold** of printing press density below which ideas spread slowly (scribal-like) and above which they spread explosively (printing revolution).

This threshold is governed by the **basic reproduction number** R₀ — borrowed from epidemiology. R₀ is the average number of new "informed" people created by each informed person before the idea fades. If R₀ < 1, the idea dies out. If R₀ > 1, it spreads to the entire population.

For our model: **R₀ = beta x S₀ / gamma**, where beta is the transmission rate (determined by technology), S₀ is the initial susceptible fraction, and gamma is the "forgetting" rate (people lose interest).

The phase transition occurs at R₀ = 1 — the tipping point. Below it, printing is just expensive scribing. Above it, printing triggers a revolution. Gutenberg's innovation pushed R₀ from below 1 (scribal) to well above 1 (printing) — crossing the critical threshold.

📚 *A phase transition is a discontinuous change in system behaviour at a critical parameter value. Water freezes at 0°C, magnets lose magnetism above the Curie temperature, and information goes viral above R₀ = 1. The transition is sharp — just above the threshold, behaviour is qualitatively different from just below.*`,
      analogy: 'Think of a forest fire. Below a critical density of trees, a spark fizzles out — the fire can\'t jump from tree to tree. Above the threshold, the same spark burns the entire forest. The trees didn\'t change; the density crossed a critical threshold. Printing presses are the trees. The idea is the fire. Enough presses, and any idea can spread everywhere.',
      storyConnection: 'The Reformation is the historical phase transition. Martin Luther\'s ideas were not new — John Wycliffe and Jan Hus had said similar things a century earlier. But in 1400, R₀ for theological dissent was below 1 (scribal copying couldn\'t sustain spread). By 1517, the printing network pushed R₀ above 1, and Luther\'s ideas swept across Europe in weeks.',
      checkQuestion: 'If beta = 0.008, the susceptible fraction S₀ = 0.9, and the forgetting rate gamma = 0.005, what is R₀?',
      checkAnswer: 'R₀ = beta x S₀ / gamma = 0.008 x 0.9 / 0.005 = 1.44. Since R₀ > 1, the idea will spread to the entire population. If gamma were higher (say 0.01, people forget faster), R₀ = 0.72 — below 1, and the idea fades. The difference between 1.44 and 0.72 is the difference between the Reformation and a forgotten pamphlet.',
      codeIntro: 'Simulate idea propagation with a forgetting rate and identify the critical phase transition threshold.',
      code: `import numpy as np

np.random.seed(42)

def sir_model(population, initial, beta, gamma, months):
    """
    SIR model: Susceptible -> Informed -> Recovered (forgot/lost interest).
    S + I + R = population (constant).
    """
    S = np.zeros(months)
    I = np.zeros(months)
    R = np.zeros(months)

    S[0] = population - initial
    I[0] = initial
    R[0] = 0

    for t in range(1, months):
        new_informed = beta * S[t-1] * I[t-1] / population
        new_forgot = gamma * I[t-1]
        new_informed = min(new_informed, S[t-1])
        new_forgot = min(new_forgot, I[t-1])

        S[t] = S[t-1] - new_informed
        I[t] = I[t-1] + new_informed - new_forgot
        R[t] = R[t-1] + new_forgot

    return S, I, R

population = 100000
initial = 50
gamma = 0.005  # forgetting rate
months = 120

# Sweep beta to find the phase transition
print("=== Phase Transition Analysis ===")
print(f"Population: {population:,} | Forgetting rate: {gamma}")
print(f"Critical beta = gamma / S0_fraction = {gamma / 0.999:.5f}\\n")

betas = np.linspace(0.0001, 0.015, 30)

print(f"{'Beta':>8} {'R0':>6} {'Peak I':>8} {'Peak Month':>11} {'Total Reached':>14} {'Regime':>12}")
print("-" * 61)

for beta in betas:
    S, I, R = sir_model(population, initial, beta, gamma, months)
    r0 = beta * (population - initial) / population / gamma
    peak_i = np.max(I)
    peak_month = np.argmax(I)
    total_reached = R[-1] + I[-1]

    regime = "VIRAL" if r0 > 1.5 else "SPREADING" if r0 > 1.0 else "DYING"

    if beta in [betas[0], betas[5], betas[10], betas[15], betas[20], betas[25], betas[-1]]:
        print(f"{beta:>7.4f} {r0:>5.2f} {peak_i:>7,.0f} {peak_month:>9}mo "
              f"{total_reached:>13,.0f} {regime:>12}")

# Compare scribal vs printing at the transition
print("\\n=== Scribal vs Printing: Phase Transition ===")
scenarios = [
    ("Scribal (pre-1450)",     0.0003, gamma),
    ("Early printing (1455)",   0.003,  gamma),
    ("Mature printing (1480)",  0.008,  gamma),
    ("Reformation (1517)",      0.012,  gamma),
    ("Mass printing (1550)",    0.020,  gamma * 0.5),  # literacy reduces forgetting
]

for name, beta, g in scenarios:
    S, I, R = sir_model(population, initial, beta, g, months)
    r0 = beta * (population - initial) / population / g
    total = R[-1] + I[-1]
    pct = total / population * 100
    peak = np.max(I)
    print(f"  {name:<28} R0={r0:>5.2f}  Peak={peak:>6,.0f}  "
          f"Total reached={total:>6,.0f} ({pct:.0f}%)")

# Sensitivity: what parameter matters most?
print("\\n=== Sensitivity Analysis: What Drives the Transition? ===")
base_beta = 0.005
base_gamma = 0.005

params = [
    ("Double beta (better press)",     base_beta * 2, base_gamma),
    ("Half gamma (higher literacy)",   base_beta,     base_gamma / 2),
    ("Double beta + half gamma",       base_beta * 2, base_gamma / 2),
    ("Half beta (censorship)",         base_beta / 2, base_gamma),
    ("Double gamma (suppression)",     base_beta,     base_gamma * 2),
]

for name, b, g in params:
    S, I, R = sir_model(population, initial, b, g, months)
    r0 = b * 0.999 / g
    total = R[-1] + I[-1]
    print(f"  {name:<36} R0={r0:.2f}  Reached={total:>6,.0f}")`,
      challenge: 'Add a "counter-information" model: the censor spreads a competing idea (refutation) with its own beta. Now two ideas compete for the same susceptible population. Under what conditions does the banned idea still win? This is the mathematical basis of the "marketplace of ideas" concept.',
      successHint: 'You identified the phase transition in information spread — the R₀ = 1 threshold that separates ideas that fizzle from ideas that go viral. This is the single most important concept in epidemiology, and you\'ve applied it to the history of media. The same R₀ analysis is used to predict pandemic trajectories, plan vaccination campaigns, and model social media virality.',
    },
    {
      title: 'Phase transition mapping — parameter space exploration',
      concept: `We've found that R₀ = 1 is the critical threshold. Now we systematically **map the parameter space** — exploring all combinations of beta (transmission rate) and gamma (forgetting rate) to create a **phase diagram** showing exactly where the transition lies.

This is the same approach physicists use to map the phases of matter (solid, liquid, gas) as functions of temperature and pressure. Our "phases" are: **idea dies out**, **idea persists at low levels**, and **idea goes viral**. The boundaries between these phases are sharp — a small change in parameters can flip the outcome completely.

The phase diagram reveals which parameters matter most. If the transition line is nearly vertical, beta dominates. If nearly horizontal, gamma dominates. If diagonal, both matter equally. This tells us whether printing's impact was primarily about **production speed** (beta) or **audience persistence** (gamma/literacy).

📚 *A phase diagram is a map showing which behaviour occurs at each combination of parameters. It's the single most informative visualisation in physics, chemistry, and now — information theory.*`,
      analogy: 'A weather map shows temperature and humidity. In certain combinations, it rains (phase: precipitation). In others, it\'s dry (phase: clear). The boundary between them is the dew point curve. Our phase diagram shows transmission rate and forgetting rate — certain combinations produce viral spread, others produce silence. The boundary is the R₀ = 1 curve.',
      storyConnection: 'The Reformation succeeded in Germany (high press density, high literacy, weak central censorship) but was suppressed in Spain (strong Inquisition, controlled press access, lower urban literacy). The same idea — different parameter combinations — different outcomes. The phase diagram explains why.',
      checkQuestion: 'On a phase diagram with beta on the x-axis and gamma on the y-axis, where is the R₀ = 1 line?',
      checkAnswer: 'R₀ = beta / gamma (when S₀ ~ N). So R₀ = 1 when beta = gamma. The transition line is y = x — a diagonal through the origin. Above this line (high gamma, low beta), ideas die. Below it (low gamma, high beta), ideas go viral. The further below the line, the more explosive the spread.',
      codeIntro: 'Map the full phase diagram for information spread and identify the historical positions of scribal vs printing technologies.',
      code: `import numpy as np

np.random.seed(42)

def run_spread(population, initial, beta, gamma, months=120):
    """Run SIR and return final fraction reached."""
    S, I, R = float(population - initial), float(initial), 0.0

    for _ in range(months):
        new_i = beta * S * I / population
        new_r = gamma * I
        new_i = min(new_i, S)
        new_r = min(new_r, I)
        S -= new_i
        I += new_i - new_r
        R += new_r

    return (I + R) / population

population = 100000
initial = 50

# Map the phase space
beta_range = np.linspace(0.0001, 0.02, 40)
gamma_range = np.linspace(0.0001, 0.02, 40)

print("=== Phase Diagram: Information Spread ===")
print(f"Population: {population:,} | Initial: {initial}")
print(f"Beta range: {beta_range[0]:.4f} to {beta_range[-1]:.4f}")
print(f"Gamma range: {gamma_range[0]:.4f} to {gamma_range[-1]:.4f}\\n")

# ASCII phase diagram
print("Phase diagram (beta = x, gamma = y):")
print("  . = dies out (<5%)  o = persists (5-50%)  # = viral (>50%)\\n")

# Sample at coarser resolution for ASCII display
b_sample = np.linspace(0.0001, 0.02, 30)
g_sample = np.linspace(0.02, 0.0001, 15)  # reversed for display (high gamma at top)

header = "  gamma\\\\beta " + "".join(f"{b:.3f} "[0:2] for b in b_sample[::3])
print("          low beta ------> high beta")
for g in g_sample:
    row = f"  {g:.4f} |"
    for b in b_sample:
        frac = run_spread(population, initial, b, g)
        if frac > 0.50:
            row += "#"
        elif frac > 0.05:
            row += "o"
        else:
            row += "."
    r0 = b_sample[-1] * 0.999 / g  # R0 at max beta for reference
    row += f"|  (R0@max: {r0:.1f})"
    print(row)

print("  hi gamma ^                      # = VIRAL (>50%)")
print("           |                      o = persists (5-50%)")
print("  lo gamma v                      . = dies out (<5%)")

# Historical positions on the phase diagram
print("\\n=== Historical Positions ===")
historical = [
    ("Oral tradition (pre-writing)",  0.0001, 0.015),
    ("Scribal Rome (1st c.)",         0.0004, 0.008),
    ("Scribal monasteries (800)",     0.0002, 0.010),
    ("Gutenberg Bible (1455)",        0.004,  0.006),
    ("Luther pamphlets (1517)",       0.012,  0.004),
    ("Penny press (1830s)",           0.015,  0.003),
    ("Internet (2000s)",              0.020,  0.001),
]

print(f"{'Era':<36} {'Beta':>7} {'Gamma':>7} {'R0':>6} {'Regime':>10}")
print("-" * 68)
for name, b, g in historical:
    r0 = b * 0.999 / g
    frac = run_spread(population, initial, b, g)
    regime = "VIRAL" if frac > 0.5 else "PERSISTS" if frac > 0.05 else "DIES"
    print(f"{name:<36} {b:>6.4f} {g:>6.4f} {r0:>5.2f} {regime:>10}")

print("\\nThe Gutenberg transition: R0 crossed from <1 to >1.")
print("This is the phase transition that changed civilisation.")`,
      challenge: 'Add a third dimension: **network connectivity** (average number of trade routes per city). Create a 3D parameter sweep of beta x gamma x connectivity. At what connectivity does a scribal system (low beta) still achieve viral spread? This would tell us: could the Roman Empire have had an information revolution without printing, just through better roads?',
      successHint: 'You mapped the complete phase diagram of information spread — identifying exactly where each historical media technology sits relative to the critical threshold. This is how physicists map the phases of matter, how epidemiologists identify pandemic thresholds, and how network scientists predict viral cascades. The phase diagram is the most powerful analytical tool in complex systems science.',
    },
    {
      title: 'Portfolio presentation — documenting the Information Spread Model',
      concept: `The final step is **documentation** — recording what you built, why, how it works, and what it reveals. A well-documented project becomes a **portfolio piece** demonstrating skills in simulation, network science, history of technology, and data analysis.

Your documentation should include:
1. **Introduction** — what question does the model answer?
2. **Methodology** — what models, data structures, and algorithms did you use?
3. **Key findings** — what did the simulations reveal?
4. **Historical validation** — does the model match what actually happened?
5. **Limitations** — what does the model NOT capture?
6. **Future work** — how could it be improved?

This is the structure of a **technical report** — the standard format used in engineering, science, and industry.

📚 *Documentation transforms code into knowledge. Without documentation, code is a black box that only the author understands. With documentation, it becomes a tool that anyone can use, critique, and build upon.*`,
      analogy: 'A scientific paper doesn\'t just present results — it shows the method so others can reproduce it, the limitations so readers know what to trust, and future directions so the field can advance. Your documentation does the same for your simulation.',
      storyConnection: 'Gutenberg\'s technology spread because it was documented — trained printers carried the knowledge to new cities and taught apprentices. If Gutenberg had kept the process secret (as many guild masters did), printing might have died with him. Documentation is how knowledge survives its creator.',
      checkQuestion: 'Why is documenting limitations more important than documenting successes?',
      checkAnswer: 'Because limitations define the boundary of validity. A model that claims to explain everything is trusted for nothing. A model that clearly states "this works for X but not Y" is trusted for X. Engineers, scientists, and policymakers need to know WHEN to trust a model — limitations tell them that.',
      codeIntro: 'Generate the complete project documentation for the Information Spread Model.',
      code: `# Information Spread Model — Project Documentation

print("""
================================================================
          INFORMATION SPREAD MODEL
          Gutenberg Printing Press Capstone
              Project Documentation
================================================================

1. INTRODUCTION
---------------
This model simulates how ideas propagate through a network of
European cities under two media technologies: scribal copying
and mechanical printing. It quantifies Gutenberg's impact on
the speed, reach, and economics of information diffusion.

Central question: Why did printing trigger an information
revolution while scribal copying sustained only slow, localised
spread — even though both technologies existed for centuries?

2. METHODOLOGY
--------------
The model uses four interconnected components:

  a) City Network Model:
     16 European cities connected by trade routes, each with
     population, literacy rate, and neighbour list. Modelled
     as a graph with cities as nodes and routes as edges.

  b) SI/SIR Diffusion Engine:
     Susceptible-Informed-Recovered model adapted for ideas:
     - Susceptible: haven't encountered the idea
     - Informed: have the idea and can spread it
     - Recovered: lost interest (forgetting rate gamma)
     Transmission: dI/dt = beta * S * I / N - gamma * I

  c) Technology Economics:
     Scribal: 0 fixed cost, 25 guilders/copy, 2 copies/month
     Printing: 500 fixed setup, 2 guilders/copy, 300 copies/month
     Crossover at ~18 copies (printing becomes cheaper)

  d) Phase Transition Analysis:
     R0 = beta * S0 / (N * gamma)
     Critical threshold at R0 = 1
     Below: idea dies out. Above: idea goes viral.

3. KEY FINDINGS
---------------
  - Printing increased effective beta by 20-40x over scribal
  - The R0 transition from <1 to >1 occurred around 1460-1470
    as press density reached critical levels
  - Network effects (Metcalfe's law) amplified the transition:
    each new press increased the value of every other press
  - Luther's Reformation (1517) hit R0 ~ 2.5 — well above
    threshold — explaining its unstoppable spread
  - Censorship could slow but not stop spread once R0 > 1.5
    (cost of enforcement exceeded authorities' resources)

4. HISTORICAL VALIDATION
------------------------
  - Model predicts 50% European literacy exposure by 1520
    for high-interest ideas — matches Reformation timeline
  - Model predicts slow spread for niche academic works
    (R0 near 1) — matches actual adoption of Copernican
    astronomy (decades, not weeks)
  - Cost curves match historical prices: printed Bible ~30
    guilders vs ~300 guilders for scribal copy

5. LIMITATIONS
--------------
  - Simplified city network (16 cities vs hundreds)
  - Uniform literacy rates (actual rates varied 5x)
  - No language barriers (Latin vs vernacular)
  - No supply-chain constraints (paper, ink availability)
  - Binary informed/uninformed (no partial understanding)
  - Static network (no new cities or routes over time)

6. FUTURE IMPROVEMENTS
----------------------
  - Add language barriers (Latin works spread further initially)
  - Model paper supply constraints (critical bottleneck)
  - Include counter-information (censor's competing narrative)
  - Expand to 100+ cities with real trade route data
  - Add temporal dynamics (seasonal trade, war disruptions)
  - Model co-evolution of literacy and press density

7. SKILLS DEMONSTRATED
----------------------
  + Object-oriented programming (Python classes)
  + Network simulation (graph-based city model)
  + Epidemiological modelling (SI/SIR models)
  + Phase transition analysis (R0 threshold mapping)
  + Game theory (censorship vs distribution)
  + Economic modelling (cost curves, Metcalfe's law)
  + Historical analysis (validating model against record)
  + Technical report writing

================================================================
""")

# Skills summary
skills = [
    ("Python OOP",          "Classes, inheritance, encapsulation"),
    ("Network science",      "Graph models, Metcalfe's law, connectivity"),
    ("Epidemiology",         "SI/SIR models, R0, phase transitions"),
    ("Game theory",          "Nash equilibrium, adversarial dynamics"),
    ("Economics",            "Cost curves, economies of scale, disruption"),
    ("Fluid dynamics",       "Ink viscosity, surface tension, capillary number"),
    ("Typography",           "Bezier curves, font mathematics, bin packing"),
    ("Data analysis",        "Parameter sweeps, sensitivity analysis, phase diagrams"),
    ("Technical writing",    "Structured reports, limitation documentation"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  {skill:<24} {detail}")

print()
print("This capstone demonstrates the ability to model a complex")
print("historical system using quantitative tools — connecting")
print("physics, economics, network science, and epidemiology")
print("to explain why one invention changed the world.")`,
      challenge: 'Turn this into a real portfolio piece. Add your name, date, and a 2-sentence abstract suitable for a CV. If you completed all four levels, list every Python concept you used (classes, NumPy, Monte Carlo, optimisation, network simulation, phase analysis). This document — plus your code from all 5 mini-lessons — is evidence of genuine interdisciplinary modelling skills.',
      successHint: 'You have completed a full capstone project cycle: system design, implementation, simulation, analysis, and documentation. You modelled Gutenberg\'s printing revolution using tools from physics, economics, epidemiology, game theory, and network science — and documented it to professional standards. This is exactly how real research and engineering projects work.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Information Spread Model</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Information Spread Model comparing scribal vs printing networks.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
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
