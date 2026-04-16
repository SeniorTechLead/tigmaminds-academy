import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function EmbalmingLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Preservation Simulator',
      concept: `In this capstone project, you will build a complete **Preservation Simulator** — a Python program that:

1. **Models tissue** with realistic properties (water content, enzyme load, surface area)
2. **Simulates desiccation** using coupled osmosis and evaporation equations
3. **Tracks bacterial populations** growing on and inside the tissue
4. **Predicts preservation quality** over timescales from decades to millennia
5. **Generates a report** comparing treatment strategies

This brings together everything from Levels 1-3: Fick's law, Michaelis-Menten kinetics, terpene chemistry, isotope analysis, and CT reconstruction. The simulator is your tool for answering the core question: **given a body, a climate, and a set of treatment materials, how long will the preservation last?**

The first step is **system design** — defining the classes, their properties, and how they interact. A well-designed system makes the simulation code clean and extensible.

📚 *System design is the most important step in any software project. Get the data structures right and the algorithms follow naturally. Get them wrong and you'll be fighting your own code forever.*`,
      analogy: 'Before performing an embalming, the ancient Egyptians prepared their workspace: laid out tools, mixed natron, prepared resins, and assigned roles to each priest. This preparation — deciding what to do before doing it — is system design. The actual embalming (coding) goes smoothly only if the preparation was thorough.',
      storyConnection: 'The Per Nefer ("House of Beauty") was the embalming workshop — a dedicated facility with specialised zones for washing, evisceration, natron packing, resin application, and wrapping. Each zone had specific materials and procedures. This spatial organisation mirrors object-oriented design: each class (zone) has its own data (materials) and methods (procedures).',
      checkQuestion: 'Why should Tissue, Desiccant, and Environment be separate classes rather than one big "Simulation" class?',
      checkAnswer: 'Separation of concerns: each class manages its own data and behaviour. You can swap a different Desiccant (natron vs salt vs silica gel) without changing the Tissue class. You can test each class independently. And you can combine them in new ways — exactly how real embalming workshops combined different materials for different body parts.',
      codeIntro: 'Design the architecture of the Preservation Simulator — define Tissue, Desiccant, and Environment classes.',
      code: `# Preservation Simulator — System Design
# Step 1: Define the three core classes

import numpy as np

class Tissue:
    """Represents a biological tissue sample with preservation-relevant properties."""
    def __init__(self, name, mass_g, water_pct, enzyme_activity,
                 surface_area_cm2, bacterial_load):
        self.name = name
        self.mass_g = mass_g
        self.water_pct = water_pct               # % by weight
        self.enzyme_activity = enzyme_activity     # relative (0-10)
        self.surface_area = surface_area_cm2       # exposed surface
        self.bacterial_load = bacterial_load        # CFU/g
        self.protein_remaining = 100.0             # % of original
        self.collagen_integrity = 100.0            # % cross-linked collagen

    def __repr__(self):
        return (f"Tissue({self.name}: {self.water_pct:.0f}% water, "
                f"{self.protein_remaining:.0f}% protein, "
                f"{self.bacterial_load:.0e} CFU/g)")

class Desiccant:
    """Represents a drying agent (natron, salt, silica gel, etc.)."""
    def __init__(self, name, absorption_rate, max_capacity_pct,
                 antibacterial_factor, pH):
        self.name = name
        self.absorption_rate = absorption_rate     # g water / g desiccant / day
        self.max_capacity = max_capacity_pct       # max water it can hold (%)
        self.current_saturation = 0.0              # current water absorbed (%)
        self.antibacterial = antibacterial_factor  # 0-1 (1 = fully bactericidal)
        self.pH = pH

    def effectiveness(self):
        """Returns current drying effectiveness (decreases as saturated)."""
        return max(0, 1 - self.current_saturation / self.max_capacity)

class Environment:
    """Represents ambient conditions affecting preservation."""
    def __init__(self, name, temp_C, humidity_pct, airflow_m_per_s, oxygen_pct):
        self.name = name
        self.temp = temp_C
        self.humidity = humidity_pct
        self.airflow = airflow_m_per_s
        self.oxygen = oxygen_pct

    def evaporation_factor(self):
        """How fast water evaporates from exposed surfaces."""
        temp_factor = max(0, (self.temp + 10) / 50)
        humidity_factor = max(0, 1 - self.humidity / 100)
        airflow_factor = 0.5 + 0.5 * min(self.airflow, 2.0)
        return temp_factor * humidity_factor * airflow_factor

# Instantiate the class library
tissues = {
    "skin":     Tissue("Skin",     500,  65,  2.0,  8000, 1e4),
    "muscle":   Tissue("Muscle",   5000, 75,  4.0,  3000, 1e3),
    "liver":    Tissue("Liver",    1500, 70,  8.0,  1200, 1e2),
    "intestine":Tissue("Intestine",1200, 72,  9.0,  5000, 1e12),
    "brain":    Tissue("Brain",    1400, 78,  6.0,  800,  1e2),
}

desiccants = {
    "natron":     Desiccant("Natron",        0.15, 35, 0.8, 10.5),
    "sea_salt":   Desiccant("Sea salt",      0.10, 30, 0.6, 7.0),
    "silica_gel": Desiccant("Silica gel",     0.25, 40, 0.1, 7.0),
    "rice":       Desiccant("Rice (modern)",  0.05, 15, 0.0, 6.5),
}

environments = {
    "egyptian_tomb": Environment("Egyptian tomb",     30, 20, 0.1, 18),
    "open_desert":   Environment("Open desert",       40, 10, 2.0, 21),
    "humid_temple":  Environment("Humid temple",      25, 70, 0.3, 21),
    "underground":   Environment("Underground cave",  15, 50, 0.0, 15),
}

# Display the system architecture
print("=== Preservation Simulator — System Architecture ===\
")
print("TISSUES:")
for key, t in tissues.items():
    print(f"  {t.name:<14} {t.mass_g:>5}g  water={t.water_pct}%  "
          f"enzymes={t.enzyme_activity}  bacteria={t.bacterial_load:.0e}")

print("\
DESICCANTS:")
for key, d in desiccants.items():
    print(f"  {d.name:<14} rate={d.absorption_rate}  capacity={d.max_capacity}%  "
          f"antibac={d.antibacterial}  pH={d.pH}")

print("\
ENVIRONMENTS:")
for key, e in environments.items():
    evap = e.evaporation_factor()
    print(f"  {e.name:<20} {e.temp:>3}°C  RH={e.humidity}%  "
          f"O₂={e.oxygen}%  evap_factor={evap:.2f}")

print("\
Next step: Build the desiccation engine connecting these classes.")`,
      challenge: 'Add a Resin class with properties: viscosity, antibacterial_score, sealing_effectiveness, and volatility_half_life. Define at least three resins (conifer, pistacia, beeswax) with realistic values. This will be integrated into the full simulator as the final preservation layer.',
      successHint: 'Good system design makes everything else easier. You defined three classes with clear responsibilities: Tissue holds biological state, Desiccant manages the drying agent, and Environment controls ambient conditions. This separation lets you mix and match any tissue with any desiccant in any environment — combinatorial power from clean design.',
    },
    {
      title: 'Building the desiccation engine — coupled osmosis and evaporation',
      concept: `The desiccation engine is the core of the simulator. Two physical processes drive water removal simultaneously:

1. **Osmotic transport**: Natron creates a high-salt environment around the tissue. Water moves from inside the tissue (low salt concentration) to the natron (high salt concentration) through osmosis. The rate depends on the concentration gradient and tissue permeability.

2. **Surface evaporation**: Water that reaches the tissue surface evaporates into the air. The rate depends on temperature, humidity, airflow, and the surface area of exposed tissue.

These two processes are **coupled**: osmosis delivers water to the surface, evaporation removes it from the surface. If evaporation is slow (humid environment), water pools at the surface and slows osmosis. If osmosis is slow (dense tissue), the surface dries but the interior stays wet.

The engine must track water content at every time step, updating both osmotic flux and evaporative loss simultaneously.

📚 *Coupled systems — where two or more processes affect each other — are common in engineering: heat and mass transfer in drying, stress and strain in materials, supply and demand in economics. Solving them requires updating all variables at each time step.*`,
      analogy: 'Imagine a bucket brigade fighting a fire: one person fills buckets from a well (osmosis — pulling water from tissue to surface), another throws water on the fire (evaporation — removing water from the surface). If the bucket-filler is slow, the thrower waits with nothing to throw. If the thrower is slow, buckets pile up. Maximum efficiency requires both working at matched speeds.',
      storyConnection: 'The embalmers adjusted their technique to the coupled system: in humid seasons (Nile flood), they used more natron (boosting osmotic drive) and kept bodies in well-ventilated areas (boosting evaporation). In the dry season, less natron was needed because evaporation alone was powerful. They were empirically optimising a coupled transport system.',
      checkQuestion: 'If you increase airflow (faster evaporation) but keep the same amount of natron, what happens to the desiccation rate?',
      checkAnswer: 'Initially it speeds up — the surface dries faster. But eventually osmosis becomes the bottleneck: water can\'t move from the tissue interior to the surface fast enough to keep up with evaporation. The surface becomes bone-dry while the core stays wet. This is why embalmers stuffed natron INSIDE the body cavity — to attack from both sides and reduce the osmotic transport distance.',
      codeIntro: 'Implement the coupled osmosis-evaporation engine and simulate desiccation under different conditions.',
      code: `import numpy as np

class Tissue:
    def __init__(self, name, mass_g, water_pct, surface_area_cm2):
        self.name = name
        self.mass = mass_g
        self.water_pct = water_pct
        self.surface_area = surface_area_cm2

class Desiccant:
    def __init__(self, name, osmotic_strength, capacity_pct):
        self.name = name
        self.osmotic_strength = osmotic_strength  # relative driving force
        self.capacity = capacity_pct
        self.saturation = 0.0

    def effectiveness(self):
        return max(0, 1 - self.saturation / self.capacity)

class Environment:
    def __init__(self, name, temp_C, humidity_pct, airflow):
        self.name = name
        self.temp = temp_C
        self.humidity = humidity_pct
        self.airflow = airflow

def desiccation_engine(tissue, desiccant, environment, days=60, dt=0.1):
    """
    Coupled osmosis + evaporation desiccation model.
    Returns daily water content history.
    """
    water_pct = tissue.water_pct
    history = [water_pct]
    target = 12.0  # preservation target moisture

    for step in np.arange(0, days, dt):
        # Osmotic transport: water from tissue into desiccant
        osmotic_gradient = (water_pct - 5.0) / 100  # driving force
        desiccant_eff = desiccant.effectiveness()
        osmotic_flux = (desiccant.osmotic_strength * osmotic_gradient *
                        desiccant_eff * 0.8)  # g water / day per g tissue

        # Surface evaporation
        temp_factor = max(0, (environment.temp + 10) / 50)
        humidity_factor = max(0, 1 - environment.humidity / 100)
        airflow_factor = 0.5 + 0.5 * min(environment.airflow, 2.0)
        evap_rate = (temp_factor * humidity_factor * airflow_factor *
                     tissue.surface_area / tissue.mass * 0.5)

        # Total water removal (coupled: take the minimum of supply and demand)
        osmotic_limited = osmotic_flux * dt
        evap_limited = evap_rate * dt * water_pct / 100

        # The actual removal is limited by the slower process
        water_removed = min(osmotic_limited, evap_limited) + 0.3 * max(osmotic_limited, evap_limited)
        water_pct = max(3.0, water_pct - water_removed)

        # Update desiccant saturation
        desiccant.saturation += water_removed * tissue.mass / 10000

        # Record daily
        if abs(step % 1.0) < dt:
            history.append(water_pct)

    return history

# Test configurations
configs = [
    ("Natron + Egyptian tomb",
     Tissue("Whole body", 50000, 70, 15000),
     Desiccant("Natron", 3.0, 35),
     Environment("Tomb", 30, 20, 0.1)),
    ("Natron + open desert",
     Tissue("Whole body", 50000, 70, 15000),
     Desiccant("Natron", 3.0, 35),
     Environment("Desert", 40, 10, 2.0)),
    ("Sea salt + humid temple",
     Tissue("Whole body", 50000, 70, 15000),
     Desiccant("Sea salt", 2.0, 30),
     Environment("Temple", 25, 70, 0.3)),
    ("No desiccant + desert (natural)",
     Tissue("Whole body", 50000, 70, 15000),
     Desiccant("None", 0.1, 5),
     Environment("Desert", 40, 10, 2.0)),
]

print("=== Desiccation Engine — Coupled Osmosis + Evaporation ===\
")
print(f"{'Configuration':<34} ", end="")
for d in [0, 5, 10, 20, 30, 40, 60]:
    print(f"{'Day '+str(d):>7}", end="")
print(f" {'Target?':>8}")
print("-" * 100)

for name, tissue, desiccant, env in configs:
    history = desiccation_engine(tissue, desiccant, env)
    row = f"{name:<34} "
    reached_target = False
    target_day = ">60"
    for d in [0, 5, 10, 20, 30, 40, 60]:
        idx = min(d, len(history) - 1)
        row += f"{history[idx]:>6.1f}%"
        if history[idx] <= 12.0 and not reached_target:
            target_day = f"~{d}d"
            reached_target = True
    row += f" {target_day:>8}"
    print(row)

# Analyse coupling effect
print("\
=== Osmosis vs Evaporation Dominance ===")
print("Which process is the bottleneck?\
")

for name, tissue, desiccant, env in configs:
    osmotic_power = desiccant.osmotic_strength * 0.8
    temp_f = max(0, (env.temp + 10) / 50)
    humid_f = max(0, 1 - env.humidity / 100)
    air_f = 0.5 + 0.5 * min(env.airflow, 2.0)
    evap_power = temp_f * humid_f * air_f * tissue.surface_area / tissue.mass * 0.5

    ratio = osmotic_power / max(evap_power, 0.001)
    if ratio > 2:
        bottleneck = "Evaporation-limited"
    elif ratio < 0.5:
        bottleneck = "Osmosis-limited"
    else:
        bottleneck = "Balanced"
    print(f"  {name:<34} Osmotic={osmotic_power:.2f}  Evap={evap_power:.3f}  -> {bottleneck}")`,
      challenge: 'Add an "internal natron packing" mode: after evisceration, natron is placed inside the body cavity, effectively doubling the surface area exposed to desiccant. Run the simulation with internal packing and show how much faster the body reaches the 12% target. This explains why evisceration + internal packing was standard practice.',
      successHint: 'You built a coupled transport model — the same type of simulation used in industrial drying (food processing, paper manufacturing), chemical engineering (reactor design), and environmental science (soil moisture modeling). Coupled systems are harder to solve than single-process models, but they capture reality far more accurately.',
    },
    {
      title: 'Bacterial population tracker — growth, death, and the preservation race',
      concept: `Bacteria are the primary agents of decomposition. Their population dynamics follow a classic pattern:

1. **Lag phase**: bacteria adapt to the new environment (0-6 hours post-mortem)
2. **Exponential growth**: population doubles every generation time τ (6-48 hours, depending on species)
3. **Stationary phase**: nutrients depleted or conditions hostile — growth = death
4. **Death phase**: desiccation, salt, or resin kills bacteria faster than they reproduce

The embalmer's goal is to push bacteria from the exponential phase into the death phase as quickly as possible. Each treatment affects bacteria differently:

- **Natron**: raises osmotic pressure → plasmolysis (water leaves bacterial cells)
- **Resin**: physically coats surfaces, blocks oxygen → asphyxiation
- **Dehydration**: removes the water bacteria need for all metabolic processes
- **Low pH or high pH**: disrupts bacterial membrane proteins

The bacterial population at any time determines the rate of tissue decomposition. If bacteria reach 10⁸ CFU/g before desiccation halts them, visible putrefaction has already occurred.

📚 *CFU/g = colony-forming units per gram. It's the standard measure of bacterial concentration. A fresh human body has ~10³ CFU/g in most tissues, but the gut contains 10¹¹-10¹² CFU/g — the largest bacterial reservoir in the body.*`,
      analogy: 'Imagine a race between two teams: the bacteria are trying to eat the body, and the embalmers are trying to dry it out. If the bacteria get a head start (delayed treatment), they multiply exponentially and win — the body putrefies. If the embalmers act fast (immediate evisceration + natron), they push the bacteria into the death phase before they can do serious damage.',
      storyConnection: 'Herodotus described three tiers of embalming: the most expensive (full evisceration + natron + resin) produced excellent preservation; the cheapest (cedar oil injection only) produced poor results. The difference maps directly to bacterial control: full treatment halted bacteria within days, while minimal treatment only slowed them — allowing weeks of decomposition.',
      checkQuestion: 'If bacteria double every 4 hours and start at 10³ CFU/g, how many are there after 24 hours?',
      checkAnswer: '24 hours = 6 doubling times. Population = 10³ × 2⁶ = 10³ × 64 = 64,000 = 6.4 × 10⁴ CFU/g. After 48 hours (12 doublings): 10³ × 2¹² = 4.1 × 10⁶ CFU/g. Exponential growth is relentless — a 2-day delay turns a manageable bacterial load into a decomposition crisis.',
      codeIntro: 'Build a bacterial population model that responds to embalming treatments and predict the decomposition outcome.',
      code: `import numpy as np

np.random.seed(42)

class BacterialPopulation:
    """Models bacterial growth and death during preservation."""

    def __init__(self, initial_cfu_per_g, generation_time_hr,
                 max_density=1e10):
        self.population = initial_cfu_per_g
        self.gen_time = generation_time_hr
        self.max_density = max_density
        self.history = [initial_cfu_per_g]

    def step(self, hours_dt, water_pct, salt_concentration,
             resin_coverage, temperature_C):
        """Update population for one time step."""
        # Growth rate (depends on water, temperature)
        if water_pct < 15:
            growth_rate = 0  # too dry for growth
        else:
            water_factor = min(1.0, (water_pct - 15) / 55)
            temp_factor = np.exp(-0.5 * ((temperature_C - 37) / 15)**2)
            nutrient_factor = 1 - self.population / self.max_density
            growth_rate = (np.log(2) / self.gen_time *
                          water_factor * temp_factor * max(0, nutrient_factor))

        # Death rate (depends on salt, desiccation, resin)
        salt_kill = salt_concentration * 0.02  # per hour
        desiccation_kill = max(0, (30 - water_pct) / 30) * 0.05
        resin_kill = resin_coverage * 0.03
        death_rate = salt_kill + desiccation_kill + resin_kill

        # Net change
        net_rate = growth_rate - death_rate
        self.population *= np.exp(net_rate * hours_dt)
        self.population = max(1, min(self.population, self.max_density))
        self.history.append(self.population)

        return self.population

def simulate_preservation(treatment_name, initial_cfu, gen_time,
                          water_schedule, salt_schedule,
                          resin_schedule, temp_C, total_hours=480):
    """
    Simulate bacterial dynamics over 20 days of treatment.
    Schedules are functions of time (hours) returning current values.
    """
    bacteria = BacterialPopulation(initial_cfu, gen_time)
    dt = 1.0  # 1-hour steps

    for h in range(total_hours):
        water = water_schedule(h)
        salt = salt_schedule(h)
        resin = resin_schedule(h)
        bacteria.step(dt, water, salt, resin, temp_C)

    return bacteria

# Treatment schedules
def make_water(start, end, rate):
    return lambda h: max(end, start * np.exp(-rate * h))

def make_salt(start_hour, max_conc):
    return lambda h: min(max_conc, max(0, (h - start_hour) * max_conc / 48)) if h > start_hour else 0

def make_resin(apply_hour, coverage):
    return lambda h: coverage if h >= apply_hour else 0

# Define treatment protocols
protocols = [
    ("No treatment (control)",
     make_water(70, 45, 0.001), lambda h: 0, lambda h: 0, 1e3, 6),
    ("Natron only (basic)",
     make_water(70, 12, 0.008), make_salt(2, 3.0), lambda h: 0, 1e3, 6),
    ("Full royal protocol",
     make_water(70, 8, 0.015), make_salt(1, 5.0), make_resin(240, 0.8), 1e3, 6),
    ("Delayed treatment (12hr)",
     make_water(70, 12, 0.008), make_salt(12, 3.0), lambda h: 0, 1e3, 4),
    ("Gut bacteria (intestines)",
     make_water(72, 12, 0.008), make_salt(2, 3.0), lambda h: 0, 1e12, 2),
]

print("=== Bacterial Population Dynamics During Embalming ===\
")
print(f"{'Treatment':<30} ", end="")
checkpoints = [0, 6, 12, 24, 48, 120, 240, 480]
for cp in checkpoints:
    label = f"{cp}h" if cp < 48 else f"{cp//24}d"
    print(f"{label:>9}", end="")
print(f" {'Outcome':>12}")
print("-" * 114)

for name, water_fn, salt_fn, resin_fn, init_cfu, gen_t in protocols:
    bacteria = simulate_preservation(
        name, init_cfu, gen_t, water_fn, salt_fn, resin_fn, 30, 480
    )
    row = f"{name:<30} "
    for cp in checkpoints:
        idx = min(cp, len(bacteria.history) - 1)
        val = bacteria.history[idx]
        if val >= 1e9:
            row += f"{'%.0e' % val:>9}"
        elif val >= 1e6:
            row += f"{'%.0e' % val:>9}"
        else:
            row += f"{'%.0e' % val:>9}"
    # Outcome assessment
    final = bacteria.history[-1]
    if final < 1e2:
        outcome = "PRESERVED"
    elif final < 1e5:
        outcome = "FAIR"
    elif final < 1e8:
        outcome = "DEGRADED"
    else:
        outcome = "PUTREFIED"
    row += f" {outcome:>12}"
    print(row)

# Phase analysis
print("\
=== Bacterial Growth Phases (Full Royal Protocol) ===")
bacteria = simulate_preservation(
    "Royal", 1e3, 6,
    make_water(70, 8, 0.015), make_salt(1, 5.0), make_resin(240, 0.8), 30, 480
)
prev = bacteria.history[0]
for h in range(0, 481, 24):
    curr = bacteria.history[min(h, len(bacteria.history)-1)]
    if h == 0:
        phase = "Initial"
    elif curr > prev * 1.1:
        phase = "GROWTH (exponential)"
    elif curr > prev * 0.9:
        phase = "Stationary"
    else:
        phase = "DEATH (treatment working)"
    print(f"  Hour {h:>3}: {curr:>10.1e} CFU/g  — {phase}")
    prev = curr`,
      challenge: 'Add antibiotic resin: model a resin that has an initial high-kill antibacterial burst (first 48 hours) followed by a sustained low-level effect. This models the volatile terpenes (immediate kill) followed by the non-volatile diterpenes (long-term barrier). How does this two-phase antibacterial strategy compare to a constant-rate resin?',
      successHint: 'Bacterial population dynamics is the foundation of microbiology, epidemiology, and food science. The logistic growth model (with carrying capacity) that you implemented is the same model used to predict epidemic spread, antibiotic dosing schedules, and food spoilage timelines. Understanding bacterial growth is understanding infection, preservation, and fermentation.',
    },
    {
      title: 'Preservation quality predictor — centuries to millennia',
      concept: `Short-term preservation (weeks) depends on desiccation and bacterial control. But **long-term preservation** (centuries to millennia) depends on different factors:

- **Oxidative damage**: slow reaction of tissue with atmospheric oxygen, causing browning and embrittlement
- **Hydrolytic degradation**: residual moisture slowly breaks chemical bonds in collagen and keratin
- **Resin degradation**: resins crack and lose their sealing effectiveness over centuries
- **Environmental stability**: temperature and humidity fluctuations cause expansion/contraction cycles that mechanically stress the tissue

The preservation quality predictor models these slow processes over timescales that no experiment can replicate — predicting whether a mummy preserved today will still be intact in 1,000, 3,000, or 5,000 years.

The key insight: **initial preservation quality sets the ceiling, but environmental stability determines the trajectory**. A perfectly preserved mummy in an unstable environment will degrade faster than a moderately preserved one in a sealed, stable tomb.

📚 *Accelerated aging tests expose materials to extreme conditions (high temperature, UV, humidity) to simulate decades of aging in weeks. The Arrhenius equation links reaction rate to temperature, allowing extrapolation from accelerated tests to real-time predictions.*`,
      analogy: 'A new car comes off the assembly line in perfect condition. Whether it lasts 10 years or 50 depends not just on build quality but on how it is stored: garaged (stable tomb), parked outside (open desert), or left in a swamp (humid environment). The preservation predictor is like a "vehicle lifetime calculator" — it models both initial quality and ongoing degradation.',
      storyConnection: 'The mummies from the Valley of the Kings (sealed tombs, stable temperature, low humidity) are in far better condition than mummies from exposed sites, even when the embalming techniques were identical. Environmental stability — not embalming quality — is the dominant factor for multi-millennial preservation. The tomb is as important as the treatment.',
      checkQuestion: 'If oxidative damage doubles for every 10°C increase in temperature (Arrhenius approximation), how much faster does a mummy degrade at 40°C vs 20°C?',
      checkAnswer: '(40-20)/10 = 2 doublings. Degradation rate is 2² = 4× faster at 40°C. This is why underground tombs (stable 20-25°C) preserve so much better than surface structures (daily swings from 10°C to 45°C). Temperature stability matters enormously for long-term preservation.',
      codeIntro: 'Build a multi-century preservation predictor and compare treatment + environment combinations.',
      code: `import numpy as np

np.random.seed(42)

def preservation_predictor(initial_quality, environment_stability,
                           resin_half_life_yr, temp_C, humidity_pct,
                           max_years=5000):
    """
    Predict preservation quality over millennia.
    Quality starts at initial_quality (0-100) and decays through
    multiple mechanisms.
    """
    quality = initial_quality
    collagen = 100.0  # % intact
    resin_seal = 100.0
    history = {"year": [0], "quality": [quality],
               "collagen": [collagen], "resin": [resin_seal]}

    for year in range(1, max_years + 1):
        # Oxidative damage (Arrhenius: doubles per 10°C)
        oxidative_rate = 0.005 * 2**((temp_C - 20) / 10) * (1 - resin_seal / 200)

        # Hydrolytic damage (depends on residual moisture)
        hydrolytic_rate = 0.002 * humidity_pct / 50

        # Resin degradation (exponential decay)
        resin_seal *= np.exp(-0.693 / resin_half_life_yr)

        # Environmental cycling damage (temperature/humidity fluctuations)
        cycling_rate = 0.001 * (1 - environment_stability)

        # Collagen degradation
        collagen_loss = (oxidative_rate + hydrolytic_rate) * collagen / 100
        collagen = max(0, collagen - collagen_loss)

        # Overall quality
        total_decay = oxidative_rate + hydrolytic_rate + cycling_rate
        quality = max(0, quality - total_decay * quality / 100)

        if year % 100 == 0 or year == 1:
            history["year"].append(year)
            history["quality"].append(quality)
            history["collagen"].append(collagen)
            history["resin"].append(resin_seal)

    return history

# Define scenarios
scenarios = [
    ("Royal tomb (sealed, stable)",     95, 0.95, 2000, 22, 15),
    ("Desert cave (dry, hot)",          85, 0.70, 1500, 35, 10),
    ("Humid temple (wet, warm)",        80, 0.50, 800,  28, 65),
    ("Catacomb (cool, moderate)",       70, 0.80, 1200, 16, 40),
    ("Natural mummy (no treatment)",    40, 0.60, 100,  30, 20),
]

print("=== Multi-Millennium Preservation Predictor ===\
")

# Summary table
time_points = [100, 500, 1000, 2000, 3000, 5000]
print(f"{'Scenario':<34} ", end="")
for t in time_points:
    print(f"{t:>6}yr", end="")
print()
print("-" * (34 + 7 * len(time_points)))

for name, init_q, stability, resin_hl, temp, humid in scenarios:
    h = preservation_predictor(init_q, stability, resin_hl, temp, humid)
    row = f"{name:<34} "
    for t in time_points:
        # Find closest year in history
        idx = min(range(len(h["year"])), key=lambda i: abs(h["year"][i] - t))
        row += f"{h['quality'][idx]:>5.1f}%"
    print(row)

# Detailed analysis for royal tomb
print("\
=== Detailed Degradation: Royal Tomb (Sealed) ===")
h = preservation_predictor(95, 0.95, 2000, 22, 15)
print(f"{'Year':>6} {'Quality':>9} {'Collagen':>10} {'Resin Seal':>11} {'Status'}")
print("-" * 48)
for i in range(len(h["year"])):
    yr = h["year"][i]
    q = h["quality"][i]
    c = h["collagen"][i]
    r = h["resin"][i]
    if q > 80: status = "Excellent"
    elif q > 60: status = "Good"
    elif q > 40: status = "Fair"
    elif q > 20: status = "Poor"
    else: status = "Fragments only"
    if yr <= 3000 or yr % 1000 == 0 or yr == 5000:
        print(f"{yr:>6} {q:>8.1f}% {c:>9.1f}% {r:>10.1f}% {status}")

# Sensitivity analysis
print("\
=== Sensitivity: What Matters Most for 3000-Year Survival? ===")
baseline = preservation_predictor(95, 0.95, 2000, 22, 15)
baseline_val = baseline["quality"][-1]

factors = [
    ("Initial quality 95→70",  70, 0.95, 2000, 22, 15),
    ("Stability 0.95→0.50",    95, 0.50, 2000, 22, 15),
    ("Resin half-life 2000→500",95, 0.95, 500,  22, 15),
    ("Temperature 22→35°C",    95, 0.95, 2000, 35, 15),
    ("Humidity 15→60%",        95, 0.95, 2000, 22, 60),
]

print(f"Baseline quality at 5000 years: {baseline_val:.1f}%\
")
for name, *params in factors:
    h = preservation_predictor(*params)
    val = h["quality"][-1]
    change = val - baseline_val
    print(f"  {name:<32} -> {val:.1f}% ({change:+.1f}%)")`,
      challenge: 'Add a "tomb breach" event: at year 1000, the tomb seal breaks, exposing the mummy to outside air (humidity jumps from 15% to 50%, oxygen increases, temperature fluctuates). Model the accelerated degradation after the breach. This is what happened to many Egyptian tombs — they survived millennia sealed, then degraded rapidly after discovery.',
      successHint: 'Long-term degradation prediction is used in nuclear waste storage (predicting container integrity over 10,000 years), museum conservation (controlling environment to maximise artifact lifespan), and materials science (predicting polymer aging). The Arrhenius-based extrapolation you used is the industry standard for lifetime prediction.',
    },
    {
      title: 'Portfolio presentation — documenting your Preservation Simulator',
      concept: `The final step in any engineering project is **documentation** — recording what you built, why, how it works, and what it tells you. A well-documented project becomes a **portfolio piece** that demonstrates your skills to future employers, collaborators, or universities.

Your Preservation Simulator documentation should include:

1. **Introduction** — what problem does it solve?
2. **Methodology** — what models and assumptions did you use?
3. **Results** — what did you find?
4. **Conclusions** — what would you recommend?
5. **Limitations** — what does the model NOT capture?
6. **Future work** — how could it be improved?

This is the structure of a **technical report** — the standard format in engineering, science, and industry for communicating results.

📚 *The ability to explain technical work clearly is often more valuable than the technical work itself. A brilliant analysis that nobody can understand has zero impact.*`,
      analogy: 'An embalming was documented on papyrus: the materials used, the steps followed, the rituals performed. These records allowed knowledge to transfer across generations of priests. Your documentation serves the same purpose — it preserves your knowledge and methods so that others (including your future self) can understand, verify, and build upon your work.',
      storyConnection: 'The Ritual of Embalming papyrus (Papyrus Boulaq 3) is one of the few surviving descriptions of embalming procedures — written by the priests themselves. It documents materials, timing, and incantations. Without this documentation, much of our understanding of embalming would be lost. Your simulator documentation serves the same purpose for your engineering work.',
      checkQuestion: 'Why is documenting limitations important? Doesn\'t it make your work look weak?',
      checkAnswer: 'The opposite — documenting limitations shows intellectual honesty and engineering maturity. Every model is a simplification. A reader who trusts your results because you didn\'t mention limitations is being misled. A reader who trusts your results despite knowing the limitations is making an informed decision. That\'s what science requires.',
      codeIntro: 'Generate a formatted project documentation page for the Preservation Simulator.',
      code: `# Preservation Simulator — Project Documentation

print("""
================================================================
           PRESERVATION SIMULATOR
              Project Documentation
================================================================

1. INTRODUCTION
---------------
This simulator predicts the preservation outcome of embalming
treatments applied to biological tissue under varying environmental
conditions. It models the coupled physical, chemical, and biological
processes that determine whether a body is preserved or destroyed.

Inspired by 3,000 years of Egyptian embalming practice, the
simulator quantifies what the ancient embalmers discovered
empirically: the interplay of desiccation, bacterial control,
and environmental stability.

2. METHODOLOGY
--------------
The simulator integrates four core models:

  a) Desiccation engine (coupled osmosis + evaporation):
     - Osmotic flux: J = k_osm × (C_tissue - C_surface) × effectiveness
     - Evaporative flux: J = f(T, RH, airflow) × surface_area
     - Coupling: actual rate = min(osmotic, evap) + 0.3 × max

  b) Bacterial population dynamics:
     - Growth: logistic model with water/temperature dependence
     - Death: salt plasmolysis + desiccation + resin asphyxiation
     - Net rate: dN/dt = N × (growth_rate - death_rate)

  c) Enzyme kinetics (Michaelis-Menten):
     - Autolysis rate: v = Vmax × [S] / (Km + [S])
     - Water-dependent: Vmax scales with (water_pct / 30)²
     - Halted below 15% tissue moisture

  d) Long-term degradation (Arrhenius + environmental):
     - Oxidative: rate doubles per 10°C (Arrhenius)
     - Hydrolytic: proportional to humidity
     - Resin decay: exponential with material-specific half-life
     - Cycling damage: proportional to (1 - stability)

3. KEY FINDINGS
---------------
  - The 40-day natron treatment window is physically optimal:
    Fick's law predicts 35-45 days for full-body desiccation
  - Organ removal reduces desiccation time by ~60% by reducing
    the maximum diffusion distance
  - Bacterial control is a RACE: every hour of delay allows
    exponential growth that becomes irreversible
  - Environmental stability matters MORE than initial treatment
    quality for preservation beyond 1,000 years
  - Resin sealing extends preservation by blocking oxidative
    damage — the dominant long-term degradation pathway

4. CONCLUSIONS
--------------
  - Speed of initial treatment is critical (< 6 hours)
  - Evisceration is the single most impactful step
  - Natron desiccation to < 15% moisture halts all biological decay
  - Resin + linen sealing extends preservation from centuries
    to millennia by blocking oxidation
  - Sealed, stable tombs preserve 3-5× longer than open
    environments with identical treatment

5. LIMITATIONS
--------------
  - 1D diffusion model — real bodies are 3D with complex geometry
  - Bacterial model uses single representative species — real
    decomposition involves hundreds of species in succession
  - Resin chemistry simplified — real terpene mixtures have
    complex synergistic interactions
  - No mechanical damage model (earthquake, tomb collapse, looting)
  - Environmental data is synthetic — real tomb conditions vary

6. FUTURE IMPROVEMENTS
----------------------
  - 3D finite element desiccation model (voxel-based, like CT)
  - Multi-species bacterial community model (microbiome dynamics)
  - Stochastic environmental events (floods, tomb breaches)
  - Machine learning calibration against real mummy condition data
  - Integration with CT scan data for body-specific simulations

7. SKILLS DEMONSTRATED
----------------------
  + Object-oriented programming (Python classes, encapsulation)
  + Coupled differential equation systems (osmosis + evaporation)
  + Monte Carlo simulation (bacterial population stochasticity)
  + Michaelis-Menten enzyme kinetics
  + Arrhenius-based lifetime prediction
  + Multi-factor sensitivity analysis
  + Technical report writing

================================================================
""")

# Skills summary for portfolio
skills = [
    ("Python OOP",           "Classes, encapsulation, composition"),
    ("Transport physics",    "Fick's law, osmosis, evaporation coupling"),
    ("Biochemistry",         "Michaelis-Menten kinetics, enzyme denaturation"),
    ("Microbiology",         "Bacterial growth dynamics, population modeling"),
    ("Analytical chemistry", "GC-MS interpretation, isotope analysis"),
    ("Materials science",    "Terpene chemistry, resin degradation"),
    ("Long-term prediction", "Arrhenius extrapolation, degradation modeling"),
    ("Data communication",   "Technical reports, comparative analysis"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  * {skill}: {detail}")

print()
print("Total Python concepts used: classes, NumPy, exponential/logarithmic")
print("functions, coupled systems, Monte Carlo, sensitivity analysis,")
print("and data-driven reporting.")`,
      challenge: 'Turn this documentation into a real portfolio piece. Add a "Key Equation Summary" section that lists the five most important equations used in the simulator (Fick\'s law, Michaelis-Menten, exponential decay, Arrhenius rate, logistic growth) with a one-line explanation of each. This equation reference is the kind of detail that impresses technical reviewers.',
      successHint: 'You have completed a full engineering project cycle: problem definition, system design, implementation, simulation, analysis, and documentation. This simulator combines transport physics, biochemistry, microbiology, materials science, and software engineering into a single coherent tool. It is evidence of genuine interdisciplinary engineering capability — the kind of project that belongs in a university application or job portfolio.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Preservation Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Preservation Simulator covering desiccation, bacterial dynamics, and millennial-scale prediction.
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
