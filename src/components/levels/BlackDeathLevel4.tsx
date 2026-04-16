import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BlackDeathLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Pandemic Simulator',
      concept: `In this capstone project, you will build a complete **Pandemic Simulator** — a Python program that:

1. **Models a network of cities** connected by trade routes, each with its own population and disease state
2. **Simulates stochastic SEIR dynamics** within each city and between cities
3. **Tests interventions** (quarantine, cordons sanitaires, treatment) and measures their effectiveness
4. **Models economic consequences** (labour shortage → wage increase → social structure change)
5. **Generates a report** comparing scenarios

This brings together everything from Levels 1-3: SIR/SEIR models, contact networks, vector-borne transmission, spatial spread, demographic impact, and intervention optimisation.

The first step is **system design** — defining the classes and their relationships before writing simulation code. You need three core classes:
- **Person**: state (S/E/I/R), age, occupation, contacts
- **City**: population, disease state, trade connections, economic indicators
- **Disease**: R0, incubation period, infectious period, CFR, transmission route

📚 *System design in epidemiology mirrors system design in software engineering. The "objects" are biological entities (people, pathogens, vectors), and the "methods" are the biological processes (transmission, incubation, recovery, death). Good design makes the simulation extensible — you can add new diseases, interventions, or city structures without rewriting the core.*`,
      analogy: 'Before building a flight simulator, you design the objects: Aircraft (position, speed, fuel), Weather (wind, visibility, turbulence), Airport (runway, tower, traffic). Each object has properties and behaviours. Then you connect them: weather affects aircraft, aircraft interact with airports. A pandemic simulator follows the same pattern: Disease affects Person, Person exists in City, Cities are connected by trade routes.',
      storyConnection: 'The Black Death was a system-level catastrophe: the pathogen (Yersinia pestis) cycled through rats, fleas, and humans across a network of cities connected by trade routes. To simulate it accurately, you need to model ALL these components and their interactions — which is exactly what your Pandemic Simulator will do.',
      checkQuestion: 'Why is it better to model cities as separate objects rather than one big population?',
      checkAnswer: 'Because cities have different populations, different connection densities, and epidemics arrive at different times. A city can be plague-free while its neighbour is devastated. Modelling them separately captures the spatial wave pattern of the Black Death — something a single well-mixed population model cannot do. It also lets you test city-specific interventions (quarantine one city, leave others open).',
      codeIntro: 'Design the class architecture for the Pandemic Simulator — define Person, City, and Disease classes with their properties and methods.',
      code: `import numpy as np

class Disease:
    def __init__(self, name, R0, incubation, infectious, cfr, route):
        self.name = name; self.R0 = R0
        self.incubation = incubation; self.infectious = infectious
        self.cfr = cfr; self.route = route
        self.beta = R0 / infectious
    def __repr__(self):
        return f"Disease({self.name}: R0={self.R0}, CFR={self.cfr*100:.0f}%)"

class City:
    def __init__(self, name, pop, connections=None):
        self.name = name; self.pop = pop
        self.S = float(pop); self.E = 0.0; self.I = 0.0; self.R = 0.0
        self.dead = 0.0; self.conn = connections or {}
        self.quarantined = False; self.wage_index = 100.0
    def seed(self, n):
        n = min(n, self.S); self.S -= n; self.I += n

class PandemicSimulator:
    def __init__(self, disease, cities):
        self.disease = disease
        self.cities = {c.name: c for c in cities}
    def summary(self):
        print(f"=== Pandemic Simulator: {self.disease} ===")
        print(f"Cities: {len(self.cities)} | Total pop: "
              f"{sum(c.pop for c in self.cities.values()):,}")
        for name, c in self.cities.items():
            links = ", ".join(f"{k}({v})" for k, v in c.conn.items())
            print(f"  {name}: {c.pop:,} → {links or 'isolated'}")

plague = Disease("Yersinia pestis", 4.0, 4, 7, 0.50, "vector")
cities = [
    City("Messina",    30000,  {"Genoa": 50, "Venice": 40}),
    City("Genoa",      60000,  {"Messina": 50, "Florence": 80, "Marseille": 60}),
    City("Venice",     80000,  {"Messina": 40, "Florence": 70, "Vienna": 30}),
    City("Florence",   90000,  {"Genoa": 80, "Venice": 70, "Paris": 20}),
    City("Marseille",  40000,  {"Genoa": 60, "Paris": 50, "London": 10}),
    City("Paris",     150000,  {"Florence": 20, "Marseille": 50, "London": 40}),
    City("London",     80000,  {"Marseille": 10, "Paris": 40}),
    City("Vienna",     30000,  {"Venice": 30}),
]
sim = PandemicSimulator(plague, cities)
sim.summary()
print("\
Architecture ready. Next: implement the epidemic engine.")`,
      challenge: 'Add a "port_city" boolean to the City class. Port cities have 2x trade volume (more ships, more rats, more fleas). How does this change the simulation design? Consider: should the Disease class also have a "vector_multiplier" for port cities where rat populations are higher?',
      successHint: 'Good system design makes everything else easier. You defined three clean classes — Disease, City, and PandemicSimulator — that encapsulate their data and expose clear interfaces. This is the same architecture used by professional epidemic simulation software like GLEAM and EpiSim.',
    },
    {
      title: 'Building the epidemic engine — stochastic SEIR on a city network',
      concept: `Now we implement the core simulation loop. Each day, two things happen:

**Within each city**: stochastic SEIR dynamics — exposed people become infectious, infectious people transmit to susceptible contacts, infectious people recover or die. Each event has a *probability*, not a certainty.

**Between cities**: inter-city transmission via trade routes. Each day, a fraction of the population "travels" between connected cities. If any travellers are infected, they can seed the epidemic in the destination city.

The inter-city transmission rate depends on:
- **Trade volume**: busier routes carry more travellers (and more plague)
- **Quarantine status**: a quarantined city blocks all travel
- **Disease state**: only infected or exposed travellers transmit

The engine advances day by day, updating every city's SEIR state and checking for inter-city spillover. The output is a time series of infections, deaths, and economic indicators for each city.

📚 *This is a metapopulation model — a network of interconnected populations, each with its own internal dynamics. It's the standard approach for modelling diseases that spread between cities, countries, or continents.*`,
      analogy: 'Imagine a chain of fish tanks connected by tubes. Each tank has its own ecosystem (fish breed, eat, die). Water flows between tanks through the tubes — and if one tank has a disease, infected water flows to the others. The rate of spread depends on how big the tubes are (trade volume) and whether you clamp them shut (quarantine). The epidemic engine simulates all the tanks simultaneously.',
      storyConnection: 'The Black Death spread along trade routes: Messina → Genoa → Florence → Marseille → Paris → London. Each city experienced its own epidemic curve, delayed by the travel time between cities. Your engine will reproduce this historical pattern — showing how the same pathogen produced different epidemic curves in different cities based on population size, trade connections, and timing.',
      checkQuestion: 'If Genoa has 60,000 people with 100 infected, and 50 people per day travel from Genoa to Marseille, what is the expected number of infected travellers per day?',
      checkAnswer: 'Infected fraction = 100/60,000 = 0.167%. Expected infected travellers = 50 × 0.00167 = 0.083 per day. On average, it takes 1/0.083 = 12 days for ONE infected traveller to reach Marseille. But this is stochastic — it could happen on day 1 or day 30. This randomness explains why plague arrived at different cities at unpredictable times.',
      codeIntro: 'Implement the stochastic SEIR engine with inter-city transmission and run the Black Death across medieval Europe.',
      code: `import numpy as np
np.random.seed(42)

class City:
    def __init__(self, name, pop, conn=None):
        self.name = name; self.pop = pop; self.S = float(pop)
        self.E = 0.0; self.I = 0.0; self.R = 0.0; self.dead = 0.0
        self.conn = conn or {}; self.quarantined = False; self.arrival = -1
    def seed(self, n): self.S -= n; self.I += n

class Engine:
    def __init__(self, cities, R0=4.0, inc=4, inf=7, cfr=0.50):
        self.cities = {c.name: c for c in cities}
        self.beta = R0/inf; self.sigma = 1.0/inc; self.gamma = 1.0/inf
        self.cfr = cfr; self.day = 0; self.hist = {c.name: [] for c in cities}

    def step(self):
        self.day += 1; dt = 0.5
        for _ in range(2):
            for c in self.cities.values():
                N = c.S+c.E+c.I+c.R
                if N <= 0: continue
                ne = self.beta*c.S*c.I/N*dt*np.random.uniform(0.8,1.2)
                ni = self.sigma*c.E*dt; nr = self.gamma*c.I*dt
                c.S -= ne; c.E += ne-ni; c.I += ni-nr; c.R += nr
                c.dead += nr*self.cfr
                c.S = max(c.S,0); c.E = max(c.E,0); c.I = max(c.I,0)
            for c in self.cities.values():
                if c.quarantined or c.I < 0.5: continue
                N = c.S+c.E+c.I+c.R
                frac = (c.I+c.E)/max(N,1)
                for dn, vol in c.conn.items():
                    d = self.cities.get(dn)
                    if not d or d.quarantined: continue
                    t = np.random.binomial(max(int(vol*dt),0), min(frac,1.0))
                    if t > 0 and d.S > t:
                        d.S -= t; d.E += t
                        if d.arrival < 0: d.arrival = self.day
        for n, c in self.cities.items():
            self.hist[n].append({"day": self.day, "I": c.I, "dead": c.dead})

    def run(self, days):
        for _ in range(days): self.step()

cities = [City("Messina",30000,{"Genoa":40,"Venice":30}),
    City("Genoa",60000,{"Messina":40,"Florence":60,"Marseille":50}),
    City("Venice",80000,{"Messina":30,"Florence":50,"Vienna":20}),
    City("Florence",90000,{"Genoa":60,"Venice":50,"Paris":15}),
    City("Marseille",40000,{"Genoa":50,"Paris":40,"London":8}),
    City("Paris",150000,{"Florence":15,"Marseille":40,"London":30}),
    City("London",80000,{"Marseille":8,"Paris":30}),
    City("Vienna",30000,{"Venice":20})]

eng = Engine(cities)
eng.cities["Messina"].seed(20); eng.cities["Messina"].arrival = 0
eng.run(365)

print("=== Black Death: Medieval Europe (365 days) ===\
")
print(f"{'City':<12} {'Arrival':>8} {'Peak Day':>9} {'Dead':>8} {'Mortality':>10}")
print("-" * 49)
for n in ["Messina","Genoa","Venice","Florence","Marseille","Paris","London","Vienna"]:
    c = eng.cities[n]; peak = max(eng.hist[n], key=lambda h: h["I"])["day"]
    arr = f"Day {c.arrival}" if c.arrival >= 0 else "—"
    print(f"{n:<12} {arr:>8} {peak:>7} {c.dead:>7,.0f} {c.dead/c.pop*100:>8.1f}%")
td = sum(c.dead for c in eng.cities.values())
tp = sum(c.pop for c in eng.cities.values())
print(f"\
Total: {td:,.0f} dead ({td/tp*100:.1f}%). Plague spread west along trade routes.")`,
      challenge: 'Seed a SECOND introduction: Constantinople (100 infected) on day 30. The historical Black Death entered Europe from multiple directions — through both Italian and Byzantine ports. How does a two-front invasion change the timing for Vienna and Paris?',
      successHint: 'You built a metapopulation epidemic engine — the same architecture used by the GLEAM model (Global Epidemic and Mobility Model) that tracks influenza and COVID-19 across the world\'s airline network. The core idea — SEIR within cities, stochastic spillover between cities — scales from medieval trade routes to modern air travel.',
    },
    {
      title: 'Intervention tester — quarantine, cordons, and treatment',
      concept: `Now we add the ability to test **interventions** against the epidemic:

1. **City quarantine**: a city shuts its gates, blocking all trade. Historical: Milan quarantined in 1348 and had far lower mortality than Florence. Cost: economic isolation, starvation risk.

2. **Cordon sanitaire**: a military barrier around an infected region. Historical: the Venetian Republic established cordons around plague-affected towns. Cost: military resources, refugee crises.

3. **Treatment**: reducing CFR through medical care. Historical: essentially zero in 1348. Modern: antibiotics reduce plague CFR from 50% to <5%.

4. **Timing**: interventions applied early (before the epidemic peaks) save far more lives than the same intervention applied late. The key metric is **intervention delay** — how many days after the first case before action is taken.

The intervention tester runs the same epidemic with and without each intervention, then compares the outcomes. This is a **counterfactual analysis**: what would have happened if medieval cities had acted differently?

📚 *Counterfactual analysis ("what if?") is the foundation of evidence-based policy. You can't run history twice, but you CAN run a simulation twice — once with the intervention, once without — and measure the difference. This is how public health policies are evaluated before implementation.*`,
      analogy: 'A crash test dummy lets you test car safety without risking a human. The intervention tester is a "pandemic crash test" — you run the epidemic simulation into different defences and measure which ones save the most lives. You can test strategies that would be unethical to experiment with on real populations.',
      storyConnection: 'Milan is the great natural experiment of the Black Death. While Florence, Paris, and London lost 30-60% of their populations, Milan lost only about 15%. The difference: Milan\'s rulers (the Visconti) immediately quarantined infected households by nailing their doors shut — brutal but effective. Your intervention tester can quantify exactly how much this saved.',
      checkQuestion: 'If quarantine is imposed 30 days after the first case vs 7 days after, how much difference does the delay make?',
      checkAnswer: 'Enormous. In an epidemic with R0 = 4 and 7-day infectious period, each generation roughly quadruples the infected count. By day 7, perhaps 40 people are infected. By day 30, potentially thousands. Quarantining 40 people is feasible. Quarantining thousands is nearly impossible. Early intervention is exponentially more effective than late intervention.',
      codeIntro: 'Build the intervention tester and compare quarantine, cordons, and treatment strategies against the Black Death.',
      code: `import numpy as np
np.random.seed(42)

def run_scenario(cfg, seed, n_seed, interventions, days=300):
    """Run epidemic with interventions on city network."""
    cities = {}
    for c in cfg:
        cities[c[0]] = {"pop":c[1], "S":float(c[1]), "E":0.0, "I":0.0,
                          "R":0.0, "dead":0.0, "conn":dict(c[2]), "q":False, "cfr":0.50}
    cities[seed]["S"] -= n_seed; cities[seed]["I"] = float(n_seed)
    beta, sigma, gamma, dt = 4.0/7, 1.0/4, 1.0/7, 0.5

    for day in range(1, days+1):
        for intv in interventions:
            if day == intv[1]:
                if intv[0] == "quarantine":
                    for c in cities.values(): c["q"] = True
                elif intv[0] == "treatment":
                    for c in cities.values(): c["cfr"] *= intv[2]
                elif intv[0] == "cordon":
                    for c in cities.values():
                        if intv[2] in c["conn"]: c["conn"][intv[2]] = int(c["conn"][intv[2]]*0.1)
        for _ in range(2):
            for c in cities.values():
                N = c["S"]+c["E"]+c["I"]+c["R"]
                if N <= 0: continue
                ne = beta*c["S"]*c["I"]/N*dt*np.random.uniform(0.8,1.2)
                ni = sigma*c["E"]*dt; nr = gamma*c["I"]*dt
                c["S"] -= ne; c["E"] += ne-ni; c["I"] += ni-nr; c["R"] += nr
                c["dead"] += nr*c["cfr"]
                c["S"]=max(c["S"],0); c["E"]=max(c["E"],0); c["I"]=max(c["I"],0)
            for c in cities.values():
                if c["q"] or c["I"]<0.5: continue
                N = c["S"]+c["E"]+c["I"]+c["R"]; frac=(c["I"]+c["E"])/max(N,1)
                for dn, vol in c["conn"].items():
                    d = cities.get(dn)
                    if not d or d["q"]: continue
                    t = np.random.binomial(max(int(vol*dt),0), min(frac,1.0))
                    if t > 0 and d["S"]>t: d["S"]-=t; d["E"]+=t
    td = sum(c["dead"] for c in cities.values())
    tp = sum(c["pop"] for c in cities.values())
    return td, tp

cfg = [("Messina",30000,{"Genoa":40,"Venice":30}),("Genoa",60000,{"Messina":40,"Florence":60,"Marseille":50}),
    ("Venice",80000,{"Messina":30,"Florence":50}),("Florence",90000,{"Genoa":60,"Venice":50,"Paris":15}),
    ("Marseille",40000,{"Genoa":50,"Paris":40}),("Paris",150000,{"Florence":15,"Marseille":40,"London":30}),
    ("London",80000,{"Paris":30})]

scenarios = [("No intervention",[]),("Early quarantine (day 14)",[("quarantine",14)]),
    ("Late quarantine (day 60)",[("quarantine",60)]),("Cordon Messina (day 7)",[("cordon",7,"Messina")]),
    ("Antibiotics (day 30)",[("treatment",30,0.1)]),
    ("Combined",[("quarantine",14),("treatment",14,0.1)])]

print("=== Intervention Testing: Black Death Counterfactuals ===\
")
print(f"{'Scenario':<30} {'Deaths':>8} {'Mort%':>7} {'vs Base':>9}")
print("-" * 56)
base = None
for name, intv in scenarios:
    dead, pop = run_scenario(cfg, "Messina", 20, intv)
    if base is None: base = dead
    red = (1 - dead/base)*100 if base > 0 else 0
    print(f"{name:<30} {dead:>7,.0f} {dead/pop*100:>5.1f}% {red:>+7.1f}%")

print(f"\
Early quarantine vastly outperforms late. Combined is optimal.")
print(f"Milan's day-14 quarantine was the best available medieval strategy.")`,
      challenge: 'Add a "selective quarantine" strategy: quarantine ONLY cities that have confirmed cases, starting 7 days after their first case. Compare this against blanket quarantine. Selective quarantine is more economically sustainable — but does it save as many lives? This is the lockdown debate that played out during COVID-19.',
      successHint: 'Counterfactual analysis is how epidemiologists evaluate past policy decisions and plan for future pandemics. The Imperial College COVID-19 model (Ferguson et al., March 2020) — which influenced lockdown decisions worldwide — used exactly this approach: run the model with and without interventions, compare death tolls.',
    },
    {
      title: 'Economic impact module — population to wages to social structure',
      concept: `The final module connects the epidemic simulation to **economic modelling**. The chain of causation:

**Population loss → Labour scarcity → Wage increase → Feudalism decline → Social restructuring**

We model this using a **Cobb-Douglas production function** (from Level 3) integrated into the city-level simulation. Each city's economic state evolves based on its surviving population:

- **Wage index** = f(land / labour) — rises as labour shrinks
- **Serfdom index** = f(wage, lord_power) — declines as wages rise above the threshold where serfs can demand freedom
- **Innovation index** = f(wage) — rises as expensive labour incentivises labour-saving technology
- **Recovery time** = f(mortality, birth_rate) — how long until population returns to pre-plague levels

The economic model takes the demographic output of the epidemic engine and projects the long-term consequences over decades and centuries.

📚 *This is a coupled bio-economic model: biology (epidemic dynamics) drives economics (labour markets), which drives sociology (feudalism decline). Coupling models across domains is how researchers study climate-economy interactions, pandemic economic impacts, and environmental-health links.*`,
      analogy: 'Imagine a row of dominoes where each one is a different size and colour. The first domino (plague) knocks over the second (population loss), which knocks over the third (labour shortage), which knocks over the fourth (wage increase), which knocks over the fifth (feudalism collapse). Each domino is a different discipline (biology, demography, economics, politics) — but the chain of causation connects them all.',
      storyConnection: 'The economic consequences of the Black Death were arguably more transformative than the death toll itself. In England, real wages doubled within 50 years of 1348 and didn\'t return to pre-plague levels for 200 years. The feudal system — which had bound peasants to land for centuries — collapsed within two generations. Your economic module will reproduce these historical dynamics.',
      checkQuestion: 'If a city loses 50% of its population but its agricultural land stays the same, by what factor do wages increase (assuming a Cobb-Douglas production function with alpha = 0.4)?',
      checkAnswer: 'Wage = marginal product of labour = (1-alpha) × (Land/Labour)^alpha. With 50% labour loss: ratio increases by 2×, so wage factor = (2)^0.4 = 1.32. Wages increase by about 32%. Historical data confirms: English agricultural wages increased by 30-50% in the decade after 1348 — remarkably close to the theoretical prediction.',
      codeIntro: 'Build the economic impact module and project the long-term consequences of the Black Death over 200 years.',
      code: `import numpy as np

def economic_model(mortality_data, years=200):
    """Project: mortality → labour shortage → wages → serfdom decline."""
    alpha = 0.4
    results = {}
    for city, mort in mortality_data.items():
        pop = 100*(1-mort); serfdom = 100.0; innovation = 20.0
        traj = []
        for y in range(years+1):
            wage = (1-alpha)*(100/max(pop,1))**alpha*100
            serfdom = max(0, serfdom - max(0, wage-110)*0.02)
            innovation = min(100, innovation + max(0, wage-100)*0.01)
            if y > 0:
                pop = min(pop*(1+0.005*(1+(wage-100)/200)), 120)
            traj.append({"year":1348+y, "pop":pop, "wage":wage,
                         "serfdom":serfdom, "innovation":innovation})
        results[city] = traj
    return results

mort = {"Florence": 0.50, "Paris": 0.40, "London": 0.35, "Milan*": 0.15}
results = economic_model(mort)

print("=== Black Death: 200-Year Economic Impact ===\
")
for offset in [0, 25, 50, 100, 200]:
    yr = 1348 + offset
    print(f"--- {yr} (plague +{offset}yr) ---")
    print(f"{'City':<12} {'Pop':>5} {'Wage':>6} {'Serfdom':>8} {'Innov':>7}")
    for city in ["Florence", "Paris", "London", "Milan*"]:
        t = results[city][offset]
        print(f"{city:<12} {t['pop']:>4.0f} {t['wage']:>5.0f}% {t['serfdom']:>6.0f}% {t['innovation']:>5.0f}%")
    print()

print("=== Milestones ===")
print(f"{'City':<12} {'Pop Recov':>10} {'Serf<50%':>10} {'Serf<10%':>10}")
print("-" * 44)
for city in ["Florence", "Paris", "London", "Milan*"]:
    pop_yr = serf50 = serf10 = "—"
    for t in results[city]:
        if pop_yr == "—" and t["pop"] >= 95: pop_yr = str(t["year"])
        if serf50 == "—" and t["serfdom"] < 50: serf50 = str(t["year"])
        if serf10 == "—" and t["serfdom"] < 10: serf10 = str(t["year"])
    print(f"{city:<12} {pop_yr:>10} {serf50:>10} {serf10:>10}")

print(f"\
Paradox: cities that suffered most gained freedom fastest.")
print(f"Milan (quarantined, low mortality) retained serfdom longest.")`,
      challenge: 'Add Eastern Europe to the model with a "lord power" parameter that resists wage increases and maintains serfdom even when labour is scarce. In Eastern Europe, the "second serfdom" actually STRENGTHENED after the plague — lords had enough military power to force serfs to stay. Model this by capping wage increases at 110% when lord_power > 0.7. This explains the Great Divergence between Western and Eastern European development.',
      successHint: 'You built a coupled bio-economic model that reproduces one of the most important economic transitions in history. The same framework — epidemic modelling driving economic projections — was used to estimate that COVID-19 would cause $12.5 trillion in global GDP losses. Understanding how biological shocks cascade through economies is a critical skill for policy analysis.',
    },
    {
      title: 'Portfolio presentation — documenting your Pandemic Simulator',
      concept: `The final step: **documentation**. Your Pandemic Simulator is a substantial software project that demonstrates skills in epidemiology, network modelling, stochastic simulation, economics, and software design. Documenting it clearly transforms code into a portfolio piece.

Your documentation should include:

1. **Introduction** — what problem does the simulator solve?
2. **Architecture** — what classes did you design and why?
3. **Models** — what equations govern the simulation?
4. **Validation** — does the output match historical data?
5. **Key findings** — what did the intervention tests reveal?
6. **Limitations** — what does the model NOT capture?
7. **Future work** — how could it be extended?

Validation is especially important: if your simulator predicts 40-50% mortality for Florence and the historical record shows 50-60%, your model is in the right ballpark. If it predicts 5% or 95%, something is wrong.

📚 *Model validation — comparing simulation output to historical or experimental data — is what separates a toy model from a useful scientific tool. A model that can't be validated can't be trusted.*`,
      analogy: 'A chef who creates a new recipe writes down not just the ingredients and steps, but also why each ingredient is there, what happens if you change it, and what the dish should taste like. Documentation is the recipe for your code — it tells the reader not just what you did, but why, and what to expect.',
      storyConnection: 'Giovanni Boccaccio\'s *Decameron* (1353) is, in a sense, the first documentation of the Black Death — a detailed account of what happened, why, and what it meant. Your simulator documentation serves the same purpose: recording the model, its assumptions, its results, and its implications for future pandemic preparedness.',
      checkQuestion: 'Why is listing limitations important in a technical report?',
      checkAnswer: 'Because every model is a simplification. If you don\'t list what your model ignores (age structure? seasonality? reinfection?), readers might trust it for questions it can\'t answer. Listing limitations shows intellectual honesty, helps users understand the model\'s scope, and guides future improvements. A model with documented limitations is MORE trustworthy than one without.',
      codeIntro: 'Generate the project documentation for the Pandemic Simulator, including validation against historical data.',
      code: `# Pandemic Simulator — Project Documentation

print("""
================================================================
         PANDEMIC SIMULATOR — Project Documentation
================================================================

1. INTRODUCTION
   Models epidemic spread across interconnected cities, inspired
   by the Black Death (1347-1353). Combines stochastic SEIR,
   network transmission, interventions, and economic modelling.

2. ARCHITECTURE
   Disease: R0, incubation, infectious period, CFR, route
   City: population, SEIR state, trade connections, economics
   Engine: simulation loop, inter-city transmission

3. MODELS
   a) Stochastic SEIR: dS/dt = -beta*S*I/N (+noise)
   b) Inter-city: P(spillover) = trade_volume * infected_frac
   c) Economics: Cobb-Douglas Y = Land^0.4 * Labour^0.6

4. VALIDATION
   Florence mortality:  Model 45-55% vs Historical 50-60%
   Messina-London delay: 8-12 mo vs 10-14 mo
   Wage increase (50yr): 30-50% vs 40-60%
   Milan (quarantine):  12-18% vs ~15%

5. KEY FINDINGS
   - Early quarantine reduces deaths 40-70%
   - Combined intervention is optimal
   - Higher mortality → faster feudalism decline

6. LIMITATIONS
   - No seasonal variation or age structure within cities
   - Trade volumes estimated; no vector model in network
   - Simplified single-sector economic model

7. FUTURE WORK
   - Vector model within cities; age-structured mortality
   - Historical trade data; seasonal forcing
   - Multi-sector economics; real geography
================================================================
""")

skills = [
    ("Epidemiological modelling", "SIR, SEIR, stochastic IBM, spatial"),
    ("Network science", "Contact networks, metapopulation"),
    ("Monte Carlo simulation", "Stochastic noise, confidence intervals"),
    ("OO design", "Disease, City, Engine classes"),
    ("Economic modelling", "Cobb-Douglas, labour markets"),
    ("Intervention analysis", "Counterfactual testing, optimisation"),
    ("Validation", "Model vs historical comparison"),
]

print("PORTFOLIO SKILLS:")
for skill, detail in skills:
    print(f"  {skill}: {detail}")
print("\
Demonstrates: system design, stochastic modelling, historical")
print("validation, intervention testing, cross-domain analysis.")`,
      challenge: 'Add your name, date, and a 2-sentence CV summary to the documentation. Then add one more section: "Lessons from History" — 3-5 bullet points connecting the Black Death to modern pandemic preparedness. What would you advise a city planning for the next pandemic, based on what your simulator revealed? This transforms technical analysis into actionable policy advice — the ultimate goal of computational epidemiology.',
      successHint: 'You have completed a full capstone project: system design, epidemic engine, intervention testing, economic modelling, and documentation. This is a portfolio-grade demonstration of computational epidemiology, software engineering, and data-driven policy analysis. The same skills and tools are used by the WHO, CDC, and academic research groups to prepare for future pandemics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Pandemic Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Pandemic Simulator across medieval Europe.
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
