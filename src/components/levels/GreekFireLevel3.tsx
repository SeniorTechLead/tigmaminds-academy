import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GreekFireLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Computational combustion — 1D flame propagation model',
      concept: `A flame propagates through a fuel mixture at a speed determined by the balance between **heat generation** (from the reaction) and **heat diffusion** (into the unburned fuel ahead). The **laminar flame speed** S_L is the fundamental quantity:

**S_L = √(α × k_rxn)**

Where α is the thermal diffusivity of the mixture (how fast heat spreads) and k_rxn is the reaction rate (Arrhenius). Typical laminar flame speeds: hydrogen ~3 m/s, methane ~0.4 m/s, naphtha ~0.5 m/s.

To model flame propagation computationally, we discretise a 1D domain (a tube of fuel mixture) into cells, and advance in time steps. Each cell has a temperature and fuel concentration. The flame advances when a cell gets hot enough to ignite.

The governing equation is the **energy equation with reaction source**:
**∂T/∂t = α × ∂²T/∂x² + Q_rxn / (ρ × Cp)**

This is a **partial differential equation (PDE)** — temperature depends on both position (x) and time (t). We solve it numerically using finite differences.

📚 *Finite differences approximate derivatives using neighbouring grid values: ∂²T/∂x² ≈ (T[i+1] − 2T[i] + T[i−1]) / Δx². This turns calculus into arithmetic that a computer can execute.*`,
      analogy: 'Imagine a row of dominoes. Pushing the first one over releases energy that knocks over the next, which knocks over the next. The "flame speed" is how fast the chain reaction propagates. If the dominoes are closer together (higher thermal diffusivity) or release more energy (higher reaction rate), the wave moves faster.',
      storyConnection: 'Greek Fire was designed to spread rapidly across a ship\'s surface — the naphtha component had a high flame speed, while the pine resin and sulphur ensured the flame front advanced through viscous, adherent pools of fuel rather than just skimming across the surface. Understanding flame propagation explains why Greek Fire was so hard to contain once ignited.',
      checkQuestion: 'If thermal diffusivity doubles but reaction rate stays the same, by what factor does the flame speed change?',
      checkAnswer: 'S_L = √(α × k_rxn). If α doubles: S_L_new = √(2α × k_rxn) = √2 × √(α × k_rxn) = √2 × S_L ≈ 1.41 × S_L. Flame speed increases by 41%. The square root means doubling a parameter gives less than double the speed — diminishing returns.',
      codeIntro: 'Build a 1D flame propagation model using finite differences to simulate Greek Fire spreading along a surface.',
      code: `import numpy as np

# 1D flame propagation simulation
# Domain: 1m tube of Greek Fire mixture

L = 1.0          # domain length (m)
nx = 200         # number of cells
dx = L / nx
dt = 0.00005     # time step (s) — must be small for stability
n_steps = 6000

# Material properties (Greek Fire mixture)
alpha = 1.5e-4   # thermal diffusivity (m²/s) — enhanced by volatile components
rho = 900        # density (kg/m³)
Cp = 1800        # specific heat (J/kg·K)
Q_rxn = 3.5e6    # heat of reaction (J/kg of fuel)
Ea = 70000       # activation energy (J/mol)
A_rxn = 5e8      # pre-exponential factor
R = 8.314

# Initial conditions
T = np.ones(nx) * 300.0     # ambient temperature (K)
fuel = np.ones(nx) * 1.0    # fuel concentration (0 to 1)

# Ignition: heat the left 5 cells to 1200 K
T[:5] = 1200.0
fuel[:5] = 0.0  # fuel consumed at ignition point

# Track flame front position over time
flame_positions = []
flame_times = []

print("=== 1D Flame Propagation Simulation ===")
print(f"Domain: {L}m | Cells: {nx} | dt: {dt*1000:.3f}ms")
print(f"{'Time (ms)':<12} {'Flame pos (cm)':>16} {'Peak T (°C)':>14} {'Fuel left (%)':>14}")
print("-" * 58)

for step in range(n_steps):
    T_new = T.copy()

    for i in range(1, nx - 1):
        # Diffusion term: alpha * d²T/dx²
        diffusion = alpha * (T[i+1] - 2*T[i] + T[i-1]) / dx**2

        # Reaction term (Arrhenius)
        if fuel[i] > 0.01 and T[i] > 400:  # threshold for reaction
            k_rate = A_rxn * np.exp(-Ea / (R * T[i]))
            reaction = Q_rxn * fuel[i] * k_rate / (rho * Cp)
            fuel[i] -= k_rate * fuel[i] * dt  # consume fuel
            fuel[i] = max(fuel[i], 0)
        else:
            reaction = 0

        T_new[i] = T[i] + dt * (diffusion + reaction)

    # Boundary conditions (insulated ends)
    T_new[0] = T_new[1]
    T_new[-1] = T_new[-2]
    T = T_new

    # Detect flame front (where T first exceeds 600 K)
    front_cells = np.where((T > 600) & (fuel > 0.1))[0]
    if len(front_cells) > 0:
        flame_pos = front_cells[-1] * dx
    else:
        flame_pos = np.argmax(T > 600) * dx

    if step % 1000 == 0:
        time_ms = step * dt * 1000
        flame_positions.append(flame_pos)
        flame_times.append(time_ms)
        fuel_pct = np.mean(fuel) * 100
        print(f"{time_ms:<12.1f} {flame_pos*100:>14.1f} {np.max(T)-273:>12.0f} {fuel_pct:>12.1f}")

# Estimate flame speed
if len(flame_positions) > 2:
    positions = np.array(flame_positions)
    times = np.array(flame_times)
    valid = positions > 0.01
    if np.sum(valid) > 1:
        speed = np.polyfit(times[valid], positions[valid], 1)[0] * 1000  # m/s
        print(f"\\\nEstimated flame speed: {speed:.2f} m/s")
        print(f"(Typical naphtha: 0.4-0.6 m/s | Hydrogen: 2-3 m/s)")`,
      challenge: 'Add a "water barrier" at x = 0.5m — a 2cm region with very high heat capacity (simulating a soaked area). Does the flame front slow down, stop, or push through? What thickness of water barrier is needed to stop Greek Fire? (Hint: quicklime releases heat in the wet zone.)',
      successHint: 'You just built a computational fluid dynamics (CFD) combustion model — the same class of simulation used to design jet engines, predict wildfire spread, and model explosions. The finite difference method for PDEs is one of the most widely used numerical techniques in all of engineering.',
    },
    {
      title: 'Adhesion physics — surface energy, wetting, and the Young equation',
      concept: `Greek Fire's deadliest feature was its **adhesion** — it stuck to surfaces and could not be scraped or washed off. This is governed by **surface energy** and **wetting physics**.

When a liquid droplet lands on a surface, it either spreads out (wets) or beads up (doesn't wet). The **contact angle** θ determines which:
- θ < 90°: the liquid wets the surface (it spreads — like water on glass)
- θ > 90°: the liquid doesn't wet (it beads — like water on a waxed car)
- θ ≈ 0°: complete wetting (the liquid spreads into a thin film)

**Young's equation** relates the contact angle to surface energies:
**cos(θ) = (γ_SV − γ_SL) / γ_LV**

Where γ_SV is the solid-vapour surface energy, γ_SL is the solid-liquid interface energy, and γ_LV is the liquid-vapour surface tension.

Greek Fire was formulated to have very LOW surface tension (it spread easily) and strong chemical affinity for wood and canvas — giving a contact angle near 0° on ship surfaces.

📚 *Surface energy is the energy cost of creating a unit area of surface. High surface energy surfaces (metals, glass) attract liquids. Low surface energy surfaces (wax, Teflon) repel them.*`,
      analogy: 'Honey poured on a plate spreads out and sticks — low contact angle, high adhesion. Mercury on the same plate beads up into a ball — high contact angle, no adhesion. Greek Fire was engineered to behave like honey on wood: spread thin, stick hard, and resist removal.',
      storyConnection: 'Historical accounts describe Greek Fire clinging to shields, armour, and clothing even when soldiers rolled on the ground or jumped into the sea. The pine resin component was the key adhesion agent — its sticky, viscous nature gave the mixture a near-zero contact angle on organic surfaces (wood, canvas, leather) while the naphtha provided the volatile fuel.',
      checkQuestion: 'If a liquid has a contact angle of 10° on wood and 85° on metal, which surface does it wet better? Which would Greek Fire damage more?',
      checkAnswer: 'Wood — the 10° contact angle means the liquid spreads into a thin, wide film with maximum surface contact. On metal at 85°, the liquid pools into thick droplets with less surface contact. Greek Fire on a wooden ship spread across the hull; on a metal shield it pooled in spots that could be scraped off — which is why Byzantine soldiers used polished bronze shields.',
      codeIntro: 'Model wetting and adhesion of Greek Fire on different ship materials using the Young equation and spreading coefficient.',
      code: `import numpy as np

def contact_angle(gamma_sv, gamma_sl, gamma_lv):
    """Young's equation: cos(theta) = (gamma_sv - gamma_sl) / gamma_lv"""
    cos_theta = (gamma_sv - gamma_sl) / gamma_lv
    cos_theta = np.clip(cos_theta, -1, 1)  # physical bounds
    return np.degrees(np.arccos(cos_theta))

def spreading_coefficient(gamma_sv, gamma_sl, gamma_lv):
    """S = gamma_sv - gamma_sl - gamma_lv. S > 0 means spontaneous spreading."""
    return gamma_sv - gamma_sl - gamma_lv

def work_of_adhesion(gamma_lv, theta_deg):
    """W_adh = gamma_lv * (1 + cos(theta)) — energy to detach liquid from surface."""
    return gamma_lv * (1 + np.cos(np.radians(theta_deg)))

# Surface energies (mN/m = mJ/m²)
surfaces = {
    "Oak wood":        {"gamma_sv": 50, "desc": "rough, porous"},
    "Canvas (sail)":   {"gamma_sv": 42, "desc": "fibrous, absorbent"},
    "Leather (armour)":{"gamma_sv": 38, "desc": "treated animal hide"},
    "Bronze (shield)": {"gamma_sv": 70, "desc": "polished metal"},
    "Wet stone":       {"gamma_sv": 55, "desc": "damp harbour wall"},
    "Oiled wood":      {"gamma_sv": 25, "desc": "pre-treated hull"},
}

# Greek Fire liquid properties
gamma_lv_fire = 28   # mN/m — low surface tension (naphtha + resin blend)
gamma_lv_water = 72  # mN/m — water for comparison

print("=== Wetting Analysis: Greek Fire vs Water ===")
print(f"Greek Fire surface tension: {gamma_lv_fire} mN/m")
print(f"Water surface tension: {gamma_lv_water} mN/m\\\n")
print(f"{'Surface':<20} {'θ fire (°)':>10} {'θ water (°)':>12} {'S_fire':>8} {'W_adh fire':>12}")
print("-" * 64)

for name, props in surfaces.items():
    gsv = props["gamma_sv"]
    # Estimate solid-liquid interface energy (Owens-Wendt approximation)
    gsl_fire = gsv + gamma_lv_fire - 2 * np.sqrt(gsv * gamma_lv_fire * 0.8)
    gsl_water = gsv + gamma_lv_water - 2 * np.sqrt(gsv * gamma_lv_water * 0.3)

    theta_fire = contact_angle(gsv, gsl_fire, gamma_lv_fire)
    theta_water = contact_angle(gsv, gsl_water, gamma_lv_water)
    S_fire = spreading_coefficient(gsv, gsl_fire, gamma_lv_fire)
    W_adh = work_of_adhesion(gamma_lv_fire, theta_fire)

    wets = "SPREADS" if theta_fire < 30 else "wets" if theta_fire < 90 else "beads"
    print(f"{name:<20} {theta_fire:>8.1f} {theta_water:>10.1f} {S_fire:>8.1f} {W_adh:>10.1f} {wets}")

# Adhesive force vs gravity (can fire drip off a vertical surface?)
print("\\\n=== Adhesion vs Gravity on Vertical Surfaces ===")
print("Can Greek Fire cling to a vertical hull?\\\n")

for thickness_mm in [0.5, 1.0, 2.0, 5.0, 10.0]:
    t = thickness_mm / 1000  # metres
    rho_fire = 900
    mass_per_m2 = rho_fire * t
    gravity_force = mass_per_m2 * 9.81   # N/m² pulling down

    # Adhesive force (simplified): W_adh / characteristic_length
    char_length = 0.001  # 1 mm wetting length
    adhesive_force = 55 / char_length  # N/m² (using W_adh ~ 55 mJ/m²)
    sticks = "CLINGS" if adhesive_force > gravity_force else "DRIPS"

    print(f"  {thickness_mm:>4.1f}mm layer: gravity = {gravity_force:>6.1f} N/m²  "
          f"adhesion = {adhesive_force:>8.0f} N/m²  → {sticks}")`,
      challenge: 'The Byzantines\' enemies eventually learned to coat their ships with vinegar-soaked hides (wet animal skin). Model this as a surface with gamma_sv = 30 mN/m. How does the contact angle change? Does this explain why the countermeasure partially worked but wasn\'t a complete defence?',
      successHint: 'Surface energy and wetting physics are behind every coating, adhesive, paint, and waterproofing system in modern engineering. The same Young equation you applied here is used to design non-stick cookware, self-cleaning windows, and biomedical implant surfaces.',
    },
    {
      title: 'Recipe optimisation — multi-objective: burn time, adhesion, water resistance',
      concept: `The Byzantine alchemists faced a **multi-objective optimisation** problem: they needed Greek Fire to simultaneously:
1. **Burn long** (high fuel content, slow burn rate)
2. **Stick to surfaces** (high resin content for adhesion)
3. **Resist water** (quicklime content for exothermic reaction with water)
4. **Flow through the siphon** (low enough viscosity to pump)

These objectives **conflict**: more resin increases adhesion but also increases viscosity (harder to pump). More quicklime improves water resistance but makes the mixture unstite and harder to store.

When objectives conflict, there is no single "best" solution — instead, there is a **Pareto frontier**: a set of solutions where improving one objective requires sacrificing another. A point on the Pareto frontier is called **Pareto optimal** — no objective can be improved without making another worse.

📚 *Pareto optimality is named after Vilfredo Pareto (1906). It's the mathematical framework for trade-offs: in engineering design, economic policy, medical treatment, and military strategy.*`,
      analogy: 'Choosing a car involves trade-offs: fast cars are expensive, cheap cars are slow, fuel-efficient cars are usually less powerful. The "best" car depends on what you value most. The Pareto frontier is the set of cars where you can\'t improve one attribute without losing another — the frontier of what\'s achievable.',
      storyConnection: 'Historical records suggest the Byzantine formula was refined over centuries. Early versions were probably simple naphtha — effective but short-burning and easily doused. Later versions added resin (adhesion), quicklime (water resistance), and sulphur (toxicity). Each addition was an optimisation step along the Pareto frontier of incendiary effectiveness.',
      checkQuestion: 'A recipe with 80% naphtha burns hot but doesn\'t stick. A recipe with 40% naphtha and 40% resin sticks but burns cooler. Can you find a recipe that is both hotter AND stickier than both?',
      checkAnswer: 'No — if such a recipe existed, the first two wouldn\'t be on the Pareto frontier. The frontier represents the fundamental trade-off: more naphtha = more heat but less stickiness. You can only move ALONG the frontier, not beyond it. To push the frontier outward, you need a fundamentally new ingredient (like quicklime, which adds heat without reducing adhesion).',
      codeIntro: 'Find the Pareto frontier for Greek Fire recipe optimisation across competing objectives.',
      code: `import numpy as np

np.random.seed(42)

def evaluate_recipe(naphtha, resin, quicklime, sulphur):
    """
    Evaluate a Greek Fire recipe on four objectives.
    All fractions should sum to ~1.0.
    Returns (burn_time, adhesion, water_resistance, pumpability).
    """
    total = naphtha + resin + quicklime + sulphur
    if total < 0.01:
        return (0, 0, 0, 0)

    # Normalise
    n, r, q, s = naphtha/total, resin/total, quicklime/total, sulphur/total

    # Burn time (seconds): dominated by naphtha, extended by resin
    burn_time = 120 * n + 80 * r + 10 * q + 40 * s
    # Random variation
    burn_time *= np.random.uniform(0.9, 1.1)

    # Adhesion score (0-100): dominated by resin
    adhesion = 90 * r + 20 * n + 5 * q + 30 * s
    # Resin-naphtha synergy (resin dissolves in naphtha)
    adhesion += 50 * r * n

    # Water resistance (0-100): dominated by quicklime
    water_resistance = 10 * n + 15 * r + 95 * q + 20 * s
    # Quicklime-water exothermic bonus
    water_resistance += 40 * q * (1 - q)  # peak at moderate quicklime

    # Pumpability (0-100): inverse of viscosity
    viscosity = 1 + 8 * r + 3 * q + 0.5 * s  # resin thickens most
    pumpability = 100 / viscosity

    return (burn_time, adhesion, water_resistance, pumpability)

# Generate random recipes
n_recipes = 5000
recipes = []

for _ in range(n_recipes):
    fracs = np.random.dirichlet([3, 2, 1, 0.5])  # biased towards naphtha
    n, r, q, s = fracs
    bt, ad, wr, pu = evaluate_recipe(n, r, q, s)
    recipes.append({
        "naphtha": n, "resin": r, "quicklime": q, "sulphur": s,
        "burn_time": bt, "adhesion": ad, "water_resist": wr, "pumpability": pu
    })

# Find Pareto frontier (non-dominated solutions)
def is_dominated(a, b):
    """Return True if b dominates a (b is better in all objectives)."""
    return (b["burn_time"] >= a["burn_time"] and
            b["adhesion"] >= a["adhesion"] and
            b["water_resist"] >= a["water_resist"] and
            b["pumpability"] >= a["pumpability"] and
            (b["burn_time"] > a["burn_time"] or
             b["adhesion"] > a["adhesion"] or
             b["water_resist"] > a["water_resist"] or
             b["pumpability"] > a["pumpability"]))

pareto = []
for i, r in enumerate(recipes):
    dominated = False
    for j, s in enumerate(recipes):
        if i != j and is_dominated(r, s):
            dominated = True
            break
    if not dominated:
        pareto.append(r)

print(f"=== Greek Fire Recipe Optimisation ===")
print(f"Tested {n_recipes} random recipes")
print(f"Pareto-optimal recipes: {len(pareto)}\\\n")

# Show top recipes by different priorities
priorities = [
    ("Max burn time", "burn_time"),
    ("Max adhesion", "adhesion"),
    ("Max water resistance", "water_resist"),
    ("Max pumpability", "pumpability"),
]

for label, key in priorities:
    best = max(pareto, key=lambda r: r[key])
    print(f"{label}:")
    print(f"  Naphtha: {best['naphtha']*100:.0f}% | Resin: {best['resin']*100:.0f}% | "
          f"Quicklime: {best['quicklime']*100:.0f}% | Sulphur: {best['sulphur']*100:.0f}%")
    print(f"  Burn: {best['burn_time']:.0f}s | Adhesion: {best['adhesion']:.0f} | "
          f"Water: {best['water_resist']:.0f} | Pump: {best['pumpability']:.0f}")
    print()

# Balanced recipe (weighted score)
print("=== Balanced Recipe (equal weight to all objectives) ===")
for r in pareto:
    r["balanced"] = (r["burn_time"]/120 + r["adhesion"]/80 +
                     r["water_resist"]/80 + r["pumpability"]/80)
balanced = max(pareto, key=lambda r: r["balanced"])
print(f"Naphtha: {balanced['naphtha']*100:.0f}% | Resin: {balanced['resin']*100:.0f}% | "
      f"Quicklime: {balanced['quicklime']*100:.0f}% | Sulphur: {balanced['sulphur']*100:.0f}%")
print(f"Burn: {balanced['burn_time']:.0f}s | Adhesion: {balanced['adhesion']:.0f} | "
      f"Water: {balanced['water_resist']:.0f} | Pump: {balanced['pumpability']:.0f}")`,
      challenge: 'Add a fifth objective: "toxicity" (sulphur produces SO₂ gas, which chokes nearby defenders too). Now the siphon operator needs to be protected. Add a constraint: recipes with >15% sulphur are rejected because they endanger the crew. How does this constraint reshape the Pareto frontier?',
      successHint: 'Multi-objective optimisation with Pareto frontiers is how engineers design real systems: aircraft (speed vs fuel vs range), drugs (efficacy vs side effects vs cost), and policies (economic growth vs environmental impact). You just applied the same framework to ancient incendiary chemistry.',
    },
    {
      title: 'Naval warfare modelling — ship-to-ship engagement simulation',
      concept: `Greek Fire was a **weapon system**, not just a chemical. Its effectiveness depended on the entire engagement: ship speed, wind direction, siphon range, target vulnerability, and the defender's countermeasures.

We can model a naval engagement as a **discrete event simulation**: at each time step, both ships make decisions (close range, fire, evade, deploy countermeasures), and the outcome depends on the physics of Greek Fire (range, spread, adhesion) combined with tactical factors.

Key variables:
- **Closing speed**: Byzantine dromons were fast galleys (~7 knots under oar)
- **Siphon range**: 25-50 metres (limited by pump pressure)
- **Wind**: affects both ship speed and fire spread
- **Fire spread rate**: governed by the flame propagation physics from Mini-Lesson 1
- **Countermeasures**: wet hides, sand buckets, diving underwater

This is an **agent-based model**: each ship is an "agent" with its own state and decision rules.

📚 *Agent-based modelling simulates systems by defining individual actors (agents) with behaviours, then letting them interact. The system-level outcome EMERGES from individual decisions — it's not programmed directly.*`,
      analogy: 'A chess game: each piece follows simple rules, but the interaction of all pieces creates complex strategy. Our naval simulation gives each ship simple rules (close if confident, fire when in range, evade if damaged), and the battle outcome emerges from the interaction — just as in real naval combat.',
      storyConnection: 'In the Siege of Constantinople (674-678 CE), the Byzantine navy used Greek Fire to destroy the Arab fleet — perhaps the most decisive naval weapon deployment in history. The Byzantines won not because Greek Fire was chemically superior, but because they combined it with superior tactics: fast dromons that closed range quickly, experienced siphon operators, and coordinated attacks that overwhelmed enemy countermeasures.',
      checkQuestion: 'A Byzantine dromon closes at 7 knots (3.6 m/s) towards an Arab galley. The siphon has a 40m range. How many seconds of approach are within siphon range if the enemy is also closing at 5 knots (2.6 m/s)?',
      checkAnswer: 'Closing speed = 3.6 + 2.6 = 6.2 m/s (heading towards each other). Time to cross 40m of siphon range: 40 / 6.2 = 6.5 seconds. That\'s barely 6 seconds of firing time — which is why accuracy and fire spread rate were critical. Every second of siphon contact had to count.',
      codeIntro: 'Simulate a Byzantine-vs-Arab naval engagement with Greek Fire, tactics, and countermeasures.',
      code: `import numpy as np

np.random.seed(42)

class Ship:
    def __init__(self, name, speed_knots, hp, has_siphon=False,
                 siphon_range=0, fire_damage=0, countermeasures=0):
        self.name = name
        self.speed = speed_knots * 0.514  # convert to m/s
        self.hp = hp
        self.max_hp = hp
        self.has_siphon = has_siphon
        self.siphon_range = siphon_range
        self.fire_damage = fire_damage
        self.countermeasures = countermeasures
        self.on_fire = 0       # fire intensity (0-100)
        self.fuel_remaining = 50  # litres of Greek Fire

    def take_fire_damage(self, intensity):
        """Apply fire damage, reduced by countermeasures."""
        effective = intensity * (1 - 0.5 * self.countermeasures)
        self.on_fire = min(100, self.on_fire + effective)
        damage = self.on_fire * 0.3
        self.hp -= damage
        return damage

def simulate_engagement(byzantine, arab, initial_distance=200):
    """Simulate a 1v1 naval engagement."""
    distance = initial_distance
    dt = 1.0  # 1-second time steps
    log = []

    for t in range(300):  # max 5 minutes
        # Both ships close distance
        closing_speed = byzantine.speed + arab.speed * 0.5  # Arab tries to evade
        distance -= closing_speed * dt
        distance = max(0, distance)

        # Byzantine fires siphon if in range and has fuel
        greek_fire_hit = False
        if (byzantine.has_siphon and distance <= byzantine.siphon_range
                and byzantine.fuel_remaining > 0 and distance > 5):
            # Hit probability decreases with distance and wave motion
            hit_prob = max(0.1, 1 - distance / (byzantine.siphon_range * 1.5))
            hit_prob *= np.random.uniform(0.7, 1.0)  # wave/wind randomness

            if np.random.random() < hit_prob:
                intensity = byzantine.fire_damage * (1 - distance / 100)
                arab.take_fire_damage(intensity)
                byzantine.fuel_remaining -= 2  # 2L per second of firing
                greek_fire_hit = True

        # Existing fire continues to damage
        if arab.on_fire > 5:
            arab.on_fire *= 0.98  # slight decay from crew fighting fire
            arab.hp -= arab.on_fire * 0.1

        # Arab fires arrows/rams if close
        if distance < 30:
            arrow_damage = np.random.uniform(1, 5) * (1 - arab.on_fire / 100)
            byzantine.hp -= arrow_damage

        # Log every 10 seconds
        if t % 10 == 0:
            log.append({
                "t": t, "dist": distance,
                "byz_hp": byzantine.hp, "arab_hp": arab.hp,
                "fire": arab.on_fire, "fuel": byzantine.fuel_remaining
            })

        # End conditions
        if arab.hp <= 0 or byzantine.hp <= 0:
            break

    return log, byzantine, arab

# Run multiple engagements with varying conditions
print("=== Naval Engagement Simulation ===")
print("Byzantine Dromon vs Arab Galley — 200 engagements\\\n")

byz_wins = 0
arab_wins = 0
draws = 0

for i in range(200):
    byz = Ship("Dromon", speed_knots=7, hp=500, has_siphon=True,
               siphon_range=40, fire_damage=25, countermeasures=0.3)
    arab = Ship("Galley", speed_knots=5, hp=400, has_siphon=False,
                countermeasures=np.random.uniform(0, 0.5))

    log, byz_end, arab_end = simulate_engagement(byz, arab,
        initial_distance=np.random.uniform(100, 300))

    if arab_end.hp <= 0 and byz_end.hp > 0:
        byz_wins += 1
    elif byz_end.hp <= 0:
        arab_wins += 1
    else:
        draws += 1

print(f"Byzantine wins: {byz_wins} ({byz_wins/2:.0f}%)")
print(f"Arab wins:      {arab_wins} ({arab_wins/2:.0f}%)")
print(f"Draws:          {draws} ({draws/2:.0f}%)")

# Detailed single engagement
print("\\\n=== Detailed Engagement Log ===")
byz = Ship("Dromon", 7, 500, True, 40, 25, 0.3)
arab = Ship("Galley", 5, 400, False, countermeasures=0.2)
log, byz_end, arab_end = simulate_engagement(byz, arab, 200)

print(f"{'Time':>6} {'Dist':>6} {'Byz HP':>8} {'Arab HP':>8} {'Fire':>6} {'Fuel':>6}")
print("-" * 42)
for entry in log:
    print(f"{entry['t']:>5}s {entry['dist']:>5.0f}m {entry['byz_hp']:>7.0f} "
          f"{entry['arab_hp']:>7.0f} {entry['fire']:>5.1f} {entry['fuel']:>5.0f}L")

winner = "Byzantine" if arab_end.hp <= 0 else "Arab" if byz_end.hp <= 0 else "Draw"
print(f"\\\nResult: {winner} victory")`,
      challenge: 'Add wind direction as a factor: tailwind doubles siphon range (fire carries further) but headwind halves it. Run 200 engagements with random wind. How much does a favourable wind change the win rate? This explains why Byzantine admirals chose to attack downwind.',
      successHint: 'Agent-based combat simulation is used by every modern military for training, doctrine development, and weapons evaluation. The same techniques model epidemics (agents = people), traffic (agents = cars), and financial markets (agents = traders). Emergent behaviour from simple rules is one of the deepest ideas in computational science.',
    },
    {
      title: 'Secret-keeping game theory — information asymmetry and strategic advantage',
      concept: `The recipe for Greek Fire was one of history's best-kept military secrets — guarded for nearly 700 years (672-1261 CE). Why invest so much effort in secrecy rather than simply making more Greek Fire?

**Game theory** provides the answer through the concept of **information asymmetry**: when one player knows something the other doesn't, the informed player has a strategic advantage that is often worth MORE than the secret itself.

In a **signalling game**, the Byzantines' possession of Greek Fire sent a signal: "We have a weapon you can't counter." This **deterrence effect** prevented attacks that never happened — saving far more ships than Greek Fire ever burned.

The **Nash equilibrium** of the secrecy game: if the enemy knows you have an unknown weapon, their optimal strategy is caution. If the secret leaks, they develop countermeasures, and the weapon's value drops dramatically. The optimal Byzantine strategy: maintain secrecy, use the weapon sparingly (to maintain fear without revealing too much), and invest in disinformation.

📚 *Information asymmetry is the foundation of modern economics. George Akerlof won the Nobel Prize (2001) for showing how it affects markets, negotiations, and competition.*`,
      analogy: 'A poker player with a strong hand has two options: show the hand immediately (win this pot) or keep it hidden (win this pot AND make opponents fearful in future hands). Secrecy multiplies the value of a strong position. The Byzantines played poker with Greek Fire — the mystery was as powerful as the weapon.',
      storyConnection: 'Emperor Constantine VII wrote that Greek Fire was revealed by an angel and that revealing its secret was punishable by death. This religious framing served a game-theoretic purpose: it made potential traitors believe the consequences were supernatural, not just legal. The Byzantines maintained information asymmetry for centuries by combining religious taboo, execution threats, compartmentalised knowledge (no single person knew the full recipe), and deliberate disinformation.',
      checkQuestion: 'If the Byzantines used Greek Fire in every naval battle, would it remain effective? Why or why not?',
      checkAnswer: 'No — frequent use would give enemies samples to analyse, opportunities to observe the delivery system, and motivation to develop countermeasures. The optimal strategy is RARE, decisive use — enough to maintain fear, too infrequent to allow reverse engineering. This is the game-theoretic concept of "optimal revelation" — revealing just enough to deter, not enough to be countered.',
      codeIntro: 'Model the game theory of weapon secrecy — information asymmetry, deterrence value, and optimal use frequency.',
      code: `import numpy as np

np.random.seed(42)

def deterrence_value(secrecy_level, weapon_power, enemy_intel):
    """
    Deterrence = weapon_power × secrecy × uncertainty_fear.
    Secrecy amplifies the perceived threat (enemies imagine the worst).
    """
    uncertainty_fear = 1 + 2 * secrecy_level * (1 - enemy_intel)
    return weapon_power * uncertainty_fear

def leak_probability(uses_per_decade, spies, defectors):
    """Probability the secret leaks per decade."""
    use_leak = 1 - (1 - 0.03) ** uses_per_decade  # 3% leak chance per use
    spy_leak = 1 - (1 - 0.05) ** spies            # 5% per spy per decade
    defect_leak = 1 - (1 - 0.1) ** defectors       # 10% per defector
    return 1 - (1 - use_leak) * (1 - spy_leak) * (1 - defect_leak)

def simulate_secrecy(uses_per_decade=2, decades=70, weapon_power=100):
    """Simulate the lifetime value of a secret weapon over centuries."""
    secrecy = 1.0
    enemy_intel = 0.0
    total_value = 0
    spies = 3
    defectors = 0

    history = []
    for d in range(decades):
        # Calculate deterrence value this decade
        deter = deterrence_value(secrecy, weapon_power, enemy_intel)
        # Direct combat value (proportional to uses)
        combat = uses_per_decade * weapon_power * (1 - enemy_intel * 0.5)
        decade_value = deter + combat
        total_value += decade_value

        # Check for leaks
        p_leak = leak_probability(uses_per_decade, spies, defectors)
        if np.random.random() < p_leak:
            intel_gain = np.random.uniform(0.05, 0.2)
            enemy_intel = min(1.0, enemy_intel + intel_gain)
            secrecy = max(0, secrecy - intel_gain)

        # Defectors increase over time
        if d % 10 == 0 and d > 0:
            defectors += np.random.randint(0, 2)

        history.append({
            "decade": d + 1, "secrecy": secrecy,
            "enemy_intel": enemy_intel, "deterrence": deter,
            "combat": combat, "total": decade_value
        })

    return total_value, history

# Compare strategies: rare use vs frequent use
print("=== Game Theory of Weapon Secrecy ===")
print("Simulating 700 years (70 decades) of Greek Fire\\\n")

strategies = [
    ("Conservative (1 use/decade)", 1),
    ("Moderate (3 uses/decade)", 3),
    ("Aggressive (8 uses/decade)", 8),
    ("Heavy use (15 uses/decade)", 15),
]

n_sims = 200
print(f"{'Strategy':<32} {'Mean value':>12} {'Median yrs':>12} {'Secret kept':>12}")
print("-" * 70)

for name, uses in strategies:
    values = []
    secret_durations = []
    for _ in range(n_sims):
        val, hist = simulate_secrecy(uses_per_decade=uses)
        values.append(val)
        # How long was secrecy >50%?
        secret_yrs = sum(1 for h in hist if h["secrecy"] > 0.5) * 10
        secret_durations.append(secret_yrs)

    print(f"{name:<32} {np.mean(values):>10,.0f} {np.median(secret_durations):>10.0f}yr "
          f"{np.mean(np.array(secret_durations) >= 500)*100:>10.0f}%")

# Detailed timeline for moderate strategy
print("\\\n=== Detailed Timeline (Moderate Strategy) ===")
_, history = simulate_secrecy(uses_per_decade=3, decades=70)
print(f"{'Decade':>8} {'Year':>6} {'Secrecy':>8} {'Intel':>8} {'Deter':>8} {'Combat':>8}")
print("-" * 48)
for h in history[::5]:  # every 50 years
    year = 672 + h["decade"] * 10
    print(f"{h['decade']:>7} {year:>6} {h['secrecy']:>7.2f} {h['enemy_intel']:>7.2f} "
          f"{h['deterrence']:>7.0f} {h['combat']:>7.0f}")

# Information value calculation
print("\\\n=== Value of Information Asymmetry ===")
with_secret, _ = simulate_secrecy(uses_per_decade=3)
# Without secrecy (enemy knows everything)
without = 3 * 100 * 70  # just combat value, no deterrence
print(f"With secrecy:    {with_secret:>10,.0f} total strategic value")
print(f"Without secrecy: {without:>10,.0f} total strategic value")
print(f"Value of secrecy: {with_secret - without:>10,.0f} ({(with_secret/without - 1)*100:.0f}% bonus)")`,
      challenge: 'Add a "disinformation" investment: each decade, the Byzantines can spend resources to INCREASE enemy uncertainty (reduce enemy_intel by 10%). How much disinformation investment is optimal? At what point does the cost of disinformation exceed the deterrence benefit? This is the economics of modern intelligence agencies.',
      successHint: 'You just applied game theory to military strategy — the same framework used in nuclear deterrence policy, corporate competition, cybersecurity, and diplomatic negotiations. Information asymmetry is one of the most powerful concepts in strategic thinking: what your opponent doesn\'t know can be more valuable than what you do know.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and simulation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers computational combustion, adhesion physics, recipe optimisation, naval warfare simulation, and game theory.
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
