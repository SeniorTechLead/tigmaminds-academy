import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ZhengHeLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Wave response modelling — ship motion in regular waves (RAO)',
      concept: `When a ship encounters waves, it responds with six motions: surge, sway, heave (linear) and roll, pitch, yaw (rotational). The relationship between wave input and ship response is captured by the **Response Amplitude Operator (RAO)**.

The RAO is a frequency-dependent transfer function: **RAO(ω) = response amplitude / wave amplitude**. At low wave frequencies (long waves), the ship rides the waves smoothly — RAO near 1.0. At high frequencies (short waves), the ship barely responds — RAO near 0. At the **natural frequency** of the ship, resonance occurs and the RAO peaks — the ship rolls or pitches violently.

For roll motion, the RAO depends on the metacentric height (GM), the roll damping, and the ship's moment of inertia. The natural roll period is approximately: **T_roll = 2π × k / √(g × GM)**, where k is the radius of gyration (typically 0.35-0.45 × beam).

Zheng He's wide treasure ships had short natural roll periods (~8-10 seconds) — matching common ocean wave periods and creating a risk of roll resonance in beam seas.

📚 *Resonance occurs when the forcing frequency matches the natural frequency. At resonance, even small waves can cause enormous roll angles — potentially capsizing the ship. Naval architects design ships to avoid resonance at common wave periods.*`,
      analogy: 'Push a child on a swing — if you push at exactly the right rhythm (the swing\'s natural frequency), the swing goes higher and higher with very little effort. Push at the wrong rhythm, and nothing much happens. A ship in waves is the same: waves at the ship\'s natural roll frequency build up enormous rolling. Waves at other frequencies barely affect it.',
      storyConnection: 'Zheng He\'s fleet operated during the monsoon seasons, when Indian Ocean wave periods are typically 6-10 seconds. The treasure ships\' natural roll period fell squarely in this range, meaning the crew would have experienced severe rolling in beam seas. This explains historical accounts of the fleet preferring to run before the monsoon rather than sailing across it — avoiding beam seas minimised roll resonance.',
      checkQuestion: 'A ship has GM = 3.0 m and beam = 50 m (radius of gyration k = 0.4 × 50 = 20 m). What is the natural roll period? If ocean waves have a 9-second period, is the ship at risk of resonance?',
      checkAnswer: 'T_roll = 2π × 20 / √(9.81 × 3.0) = 125.7 / 5.42 = 23.2 seconds. With a 9-second wave period, the ship is NOT at resonance — the ratio is 9/23.2 = 0.39, well below 1.0. However, if GM were smaller (top-heavy loading), the roll period would increase toward the wave period.',
      codeIntro: 'Model ship roll response in regular waves and identify resonance conditions.',
      code: `import numpy as np

def roll_rao(wave_period, T_natural, damping_ratio=0.05):
    """
    Calculate roll RAO for a given wave period.
    Uses single-degree-of-freedom oscillator model.
    """
    r = T_natural / wave_period  # frequency ratio (inverted for period)
    rao = 1.0 / np.sqrt((1 - r**2)**2 + (2 * damping_ratio * r)**2)
    return rao

def natural_roll_period(beam, GM):
    """Natural roll period in seconds."""
    k = 0.4 * beam  # radius of gyration
    return 2 * np.pi * k / np.sqrt(9.81 * GM)

# Ship parameters
ships = [
    {"name": "Treasure ship",  "beam": 50, "GM": 3.0, "damping": 0.04},
    {"name": "War junk",       "beam": 8,  "GM": 1.0, "damping": 0.06},
    {"name": "Caravel",        "beam": 7,  "GM": 0.8, "damping": 0.05},
    {"name": "Galleon",        "beam": 12, "GM": 1.5, "damping": 0.05},
    {"name": "Container ship", "beam": 48, "GM": 2.0, "damping": 0.03},
]

print("=== Natural Roll Periods ===")
for s in ships:
    T_n = natural_roll_period(s["beam"], s["GM"])
    print(f"{s['name']:<20} Beam: {s['beam']:>3}m  GM: {s['GM']:.1f}m  "
          f"Roll period: {T_n:.1f}s")

# RAO analysis for treasure ship
T_n_treasure = natural_roll_period(50, 3.0)
print(f"\
=== Roll RAO: Treasure Ship (T_natural = {T_n_treasure:.1f}s) ===")
print(f"{'Wave Period (s)':<16} {'RAO':>6} {'Roll in 2m wave':>16} {'Risk':>10}")
print("-" * 50)

for T_wave in [4, 6, 8, 10, 12, 15, 18, 20, 22, 24, 28]:
    rao = roll_rao(T_wave, T_n_treasure, 0.04)
    roll_deg = rao * 2.0 * 3.0  # 2m wave amplitude, approximate conversion
    risk = "RESONANCE" if rao > 3.0 else "HIGH" if rao > 2.0 else "moderate" if rao > 1.2 else "low"
    print(f"{T_wave:>13}s {rao:>7.1f} {roll_deg:>14.1f}° {risk:>10}")

# Effect of loading condition on resonance
print(f"\
=== Loading Effect on Roll Resonance ===")
print("Treasure ship with varying GM (cargo loading changes GM)")
print(f"{'GM (m)':<8} {'T_natural (s)':>14} {'Danger wave (s)':>16} {'Ocean match?':>13}")
print("-" * 53)

for gm in [5.0, 4.0, 3.0, 2.0, 1.5, 1.0, 0.5]:
    T_n = natural_roll_period(50, gm)
    danger_low = T_n * 0.8
    danger_high = T_n * 1.2
    # Indian Ocean monsoon waves: 6-12 second periods
    matches = "YES - DANGER" if (danger_low < 12 and danger_high > 6) else "no"
    print(f"{gm:<7.1f} {T_n:>12.1f} {danger_low:>7.1f}-{danger_high:.1f} {matches:>13}")`,
      challenge: 'Add pitch motion: the natural pitch period depends on the ship\'s length and the longitudinal metacentric height. For the treasure ship (120 m), calculate the pitch period and check if head-sea waves can cause pitch resonance. Pitch resonance is even more dangerous than roll — it can cause the bow to plunge underwater (called "pooping").',
      successHint: 'RAO analysis is the foundation of seakeeping — the branch of naval architecture that predicts how ships behave in waves. Every modern ship undergoes RAO analysis during design, using computational tools that are more sophisticated but follow exactly the same physics you just modelled.',
    },
    {
      title: 'Fleet logistics — provisioning 28,000 people for months at sea',
      concept: `Zheng He's fleet carried approximately **28,000 people** across the Indian Ocean — sailors, soldiers, merchants, translators, doctors, and craftsmen. Keeping them alive for months at sea required solving a massive logistics problem.

The key constraints:
- **Water**: each person needs ~3 litres/day. For 28,000 people over 30 days: 2,520,000 litres = 2,520 tonnes.
- **Food**: ~1.5 kg/day per person (rice, dried fish, salted meat, vegetables). 30 days × 28,000 = 1,260 tonnes.
- **Ship capacity**: each supply ship (~500 tonnes cargo) carries limited provisions.
- **Spoilage**: food and water degrade over time — spoilage rate increases with temperature and time.

This is a **linear programming** problem: maximise the fleet's range (days at sea) subject to constraints on ship capacity, crew requirements, and spoilage rates.

📚 *Fleet logistics is a supply chain problem at sea — the same mathematics used by Amazon to route packages, by militaries to supply armies, and by airlines to schedule flights.*`,
      analogy: 'Imagine packing for a camping trip with 100 friends, but your car can only carry 500 kg. You need water (heavy), food (perishable), tents (bulky), and fuel (dangerous). You can\'t carry everything, so you must optimise: what mix of supplies maximises the number of days you can camp? Zheng He faced this problem 10,000× larger.',
      storyConnection: 'Historical records describe Zheng He\'s fleet carrying rice, fresh water in sealed compartments, live animals (chickens, pigs), dried and salted fish, preserved vegetables, and medicinal herbs. The fleet\'s 62 large vessels included dedicated supply ships, water tankers, and horse transports — a logistical operation unmatched until the D-Day invasion of 1944.',
      checkQuestion: 'If each person needs 3 litres of water per day, the fleet has 28,000 people, and each supply ship carries 400 tonnes of water, how many supply ships are needed for a 30-day voyage?',
      checkAnswer: 'Daily water: 28,000 × 3 = 84,000 litres = 84 tonnes. 30-day total: 84 × 30 = 2,520 tonnes. Ships needed: 2,520 / 400 = 6.3, so 7 ships dedicated entirely to fresh water. In reality, more were needed because wooden barrels leak and water goes stale.',
      codeIntro: 'Model fleet provisioning requirements and optimise the supply ship allocation.',
      code: `import numpy as np

class FleetProvision:
    """Model fleet provisioning for a long voyage."""

    def __init__(self, crew_size, voyage_days):
        self.crew = crew_size
        self.days = voyage_days

        # Daily requirements per person (kg)
        self.water_per_day = 3.0      # litres ≈ kg
        self.rice_per_day = 0.8
        self.protein_per_day = 0.4    # dried fish, salted meat
        self.vegetables_per_day = 0.3
        self.fuel_per_day = 0.05      # cooking fuel per person

    def total_requirements(self):
        """Calculate total provisions needed."""
        items = {
            "Fresh water":  self.crew * self.days * self.water_per_day / 1000,
            "Rice":         self.crew * self.days * self.rice_per_day / 1000,
            "Dried protein": self.crew * self.days * self.protein_per_day / 1000,
            "Vegetables":   self.crew * self.days * self.vegetables_per_day / 1000,
            "Cooking fuel":  self.crew * self.days * self.fuel_per_day / 1000,
        }
        return items  # all in tonnes

    def spoilage_model(self):
        """Model food spoilage over voyage duration."""
        results = []
        for day in range(1, self.days + 1):
            # Spoilage rates (fraction lost per day, increases with time)
            water_loss = 0.002 * day / self.days      # barrels leak more as wood dries
            rice_loss = 0.001                           # rice keeps well
            protein_loss = 0.003 * (1 + day / 30)     # accelerates
            veg_loss = 0.02 * (1 + day / 15)          # spoils fastest
            results.append({
                "day": day,
                "water_remaining": max(0, 1 - water_loss * day),
                "rice_remaining": max(0, 1 - rice_loss * day),
                "protein_remaining": max(0, 1 - protein_loss * day),
                "veg_remaining": max(0, 1 - veg_loss * day),
            })
        return results

# Zheng He's fleet
fleet = FleetProvision(crew_size=28000, voyage_days=60)
reqs = fleet.total_requirements()

print("=== Fleet Provisioning: Zheng He's Armada ===")
print(f"Crew: {fleet.crew:,} | Voyage: {fleet.days} days\
")

total_tonnes = 0
print(f"{'Provision':<20} {'Total (tonnes)':>14} {'Per ship (62 ships)':>20}")
print("-" * 56)
for item, tonnes in reqs.items():
    per_ship = tonnes / 62
    print(f"{item:<20} {tonnes:>12.0f} {per_ship:>18.1f}")
    total_tonnes += tonnes

print(f"{'TOTAL':<20} {total_tonnes:>12.0f} {total_tonnes/62:>18.1f}")
print(f"\
Total provisions: {total_tonnes:,.0f} tonnes")

# Ship allocation
ship_capacity = 500  # tonnes per supply ship
ships_needed = int(np.ceil(total_tonnes / ship_capacity))
print(f"Supply ships needed (@ {ship_capacity}t each): {ships_needed}")
print(f"Remaining ships for cargo/military: {62 - ships_needed}")

# Spoilage analysis
print("\
=== Spoilage Over Voyage ===")
spoilage = fleet.spoilage_model()
print(f"{'Day':>4} {'Water %':>8} {'Rice %':>8} {'Protein %':>10} {'Veg %':>8}")
print("-" * 40)
for s in spoilage:
    if s["day"] % 10 == 0 or s["day"] == 1:
        print(f"{s['day']:>4} {s['water_remaining']*100:>7.1f} {s['rice_remaining']*100:>7.1f} "
              f"{s['protein_remaining']*100:>9.1f} {s['veg_remaining']*100:>7.1f}")

# Maximum range analysis
print("\
=== Maximum Voyage Range ===")
print("(Range limited by first provision to run out after spoilage)")
for extra_factor in [1.0, 1.25, 1.5, 2.0]:
    # Find the day when any essential provision drops below crew needs
    max_day = fleet.days
    for s in spoilage:
        if s["veg_remaining"] * extra_factor < 0.3:  # 30% minimum threshold
            max_day = min(max_day, s["day"])
            break
    print(f"  Provisions × {extra_factor:.2f}: safe range = {max_day} days")`,
      challenge: 'Add port resupply: the fleet can stop at Champa (day 10), Malacca (day 20), and Calicut (day 35) to take on fresh water and vegetables. Model how port stops extend the maximum voyage range. This is why historical trade routes followed coastlines with known ports — not the shortest path, but the most sustainable one.',
      successHint: 'You just solved a real logistics optimisation problem — the same class of problem that modern militaries, shipping companies, and space agencies face. The mathematics of provisioning (consumption rates, spoilage models, capacity constraints) is identical whether you\'re supplying Zheng He\'s fleet or the International Space Station.',
    },
    {
      title: 'Comparative naval architecture — junk vs caravel vs galleon',
      concept: `Three ship types dominated the 15th-century oceans: the Chinese **junk**, the Portuguese **caravel**, and the Spanish **galleon**. Each represented a different engineering philosophy.

**Chinese junk**: flat bottom, no keel, watertight bulkheads, balanced lug sails with battens. Strengths: cargo capacity, stability, compartmentalised flooding. Weaknesses: poor windward performance, structural limits at large scale.

**Caravel**: deep keel, carvel-planked, lateen sails. Strengths: windward sailing, speed, manoeuvrability. Weaknesses: small cargo capacity, no bulkheads, fragile in heavy seas.

**Galleon**: hybrid design, deep keel, square + lateen sails, gun decks. Strengths: firepower, ocean range, balanced performance. Weaknesses: heavy, expensive, high centre of gravity (top-heavy from gun decks).

Comparing these designs quantitatively reveals the engineering trade-offs each culture made — and why no single design was "best" for all purposes.

📚 *Naval architecture is always about trade-offs: speed vs capacity, stability vs manoeuvrability, cost vs durability. The "best" ship depends entirely on the mission.*`,
      analogy: 'Compare an SUV (junk: stable, high capacity, not fast), a sports car (caravel: fast, nimble, small), and a pickup truck (galleon: versatile, powerful, heavy). Each is "best" for its purpose. Arguing that one is objectively superior to the others misses the point — the right vehicle depends on the job.',
      storyConnection: 'Zheng He\'s treasure ships and Columbus\'s Santa Maria were separated by only 87 years (1405 vs 1492), yet they represent radically different engineering traditions. The treasure ship was perhaps 5× the displacement of the Santa Maria. Yet Columbus\'s ships could sail closer to the wind — a capability that proved decisive for Atlantic crossing where monsoon patterns couldn\'t be relied upon.',
      checkQuestion: 'A junk has 10 watertight compartments and a caravel has none. If both hit a reef and flood one compartment, which survives?',
      checkAnswer: 'The junk survives — it loses only 10% of its buoyancy (one compartment out of ten). The caravel floods entirely and sinks, because water from the breach spreads through the entire hull. Watertight bulkheads are the single greatest safety feature in ship design — they\'re mandatory on every modern ship.',
      codeIntro: 'Build a quantitative comparison framework for historical ship types.',
      code: `import numpy as np

class ShipDesign:
    """Quantitative model of a historical ship type."""

    def __init__(self, name, length, beam, draft, disp_tonnes,
                 sail_area, n_compartments, crew, cargo_tonnes,
                 windward_angle, max_speed_kts):
        self.name = name
        self.L = length
        self.B = beam
        self.T = draft
        self.disp = disp_tonnes
        self.sail_area = sail_area
        self.compartments = n_compartments
        self.crew = crew
        self.cargo = cargo_tonnes
        self.windward = windward_angle  # minimum angle to wind
        self.max_speed = max_speed_kts

    def stability_index(self):
        """Relative stability (higher = more stable)."""
        return self.B / self.T  # beam-to-draft ratio

    def cargo_efficiency(self):
        """Cargo per tonne of displacement."""
        return self.cargo / self.disp

    def sail_ratio(self):
        """Sail area per tonne (power-to-weight)."""
        return self.sail_area / self.disp

    def survivability(self):
        """Probability of surviving a hull breach."""
        if self.compartments <= 1:
            return 0.1  # no bulkheads = very low survivability
        return 1 - 1 / self.compartments

    def range_days(self, provisions_tonnes):
        """Estimated range based on crew provisions."""
        daily_consumption = self.crew * 4.5 / 1000  # tonnes/day
        return provisions_tonnes / daily_consumption

ships = [
    ShipDesign("Zheng He Treasure Ship", 120, 50, 7.5, 20000,
               3000, 12, 500, 2500, 70, 5),
    ShipDesign("Chinese War Junk", 30, 8, 2.5, 300,
               250, 8, 60, 50, 65, 7),
    ShipDesign("Supply Ship (Zheng He)", 60, 25, 5, 3000,
               800, 10, 100, 1500, 75, 4),
    ShipDesign("Portuguese Caravel", 25, 7, 2, 100,
               200, 1, 25, 20, 45, 8),
    ShipDesign("Spanish Galleon", 40, 12, 4, 500,
               600, 3, 200, 150, 55, 7),
    ShipDesign("Carrack (Nau)", 35, 10, 3.5, 400,
               450, 2, 150, 120, 60, 6),
]

print("=== Comparative Naval Architecture ===\
")

# Performance matrix
print(f"{'Ship':<28} {'Stab':>5} {'Cargo%':>7} {'Sail/t':>7} {'Surv%':>6} {'Wind°':>6} {'Spd':>4}")
print("-" * 65)
for s in ships:
    print(f"{s.name:<28} {s.stability_index():>4.1f} {s.cargo_efficiency()*100:>5.1f}% "
          f"{s.sail_ratio():>6.2f} {s.survivability()*100:>4.0f}% "
          f"{s.windward:>4.0f}° {s.max_speed:>3.0f}kt")

# Scoring system (weighted comparison)
print("\
=== Weighted Scoring (mission-dependent) ===")
missions = {
    "Trade (cargo volume)":   {"stab": 0.2, "cargo": 0.4, "surv": 0.2, "wind": 0.1, "speed": 0.1},
    "Exploration (range)":    {"stab": 0.15, "cargo": 0.15, "surv": 0.2, "wind": 0.3, "speed": 0.2},
    "Military (combat)":      {"stab": 0.3, "cargo": 0.1, "surv": 0.25, "wind": 0.15, "speed": 0.2},
    "Diplomacy (prestige)":   {"stab": 0.25, "cargo": 0.3, "surv": 0.15, "wind": 0.1, "speed": 0.2},
}

for mission, weights in missions.items():
    print(f"\
{mission}:")
    scores = []
    for s in ships:
        # Normalise each metric to 0-1 range
        stab_n = min(s.stability_index() / 10, 1)
        cargo_n = s.cargo_efficiency()
        surv_n = s.survivability()
        wind_n = 1 - (s.windward - 40) / 50  # lower windward angle = better
        speed_n = s.max_speed / 10

        score = (weights["stab"] * stab_n + weights["cargo"] * cargo_n +
                 weights["surv"] * surv_n + weights["wind"] * wind_n +
                 weights["speed"] * speed_n)
        scores.append((s.name, score))

    scores.sort(key=lambda x: x[1], reverse=True)
    for rank, (name, score) in enumerate(scores, 1):
        marker = " <-- BEST" if rank == 1 else ""
        print(f"  {rank}. {name:<28} Score: {score:.3f}{marker}")`,
      challenge: 'Add a "technology transfer" analysis: if you gave the Chinese junk a deep keel (improving windward performance to 50 degrees) and the caravel watertight bulkheads (8 compartments), how do the scores change? This thought experiment reveals which innovations had the most impact — and why technology exchange between civilisations accelerates progress.',
      successHint: 'Comparative engineering analysis — quantifying trade-offs across designs — is how engineers make design decisions today. You built a multi-criteria scoring system, the same framework used to select aircraft designs, evaluate software architectures, and compare medical treatments.',
    },
    {
      title: 'Structural scaling analysis — why 120 m in wood is at the limit',
      concept: `Scaling a ship up doesn't preserve its structural margins. As length increases, the forces grow **faster** than the structure's ability to resist them. This is the **square-cube law** applied to ships.

**Weight** scales as L³ (volume). **Strength** of the hull girder scales as L² × t (cross-section area). **Bending moment** from waves scales as L² × wave height. As the ship gets longer, the ratio of bending moment to hull strength worsens.

For a wooden ship, the critical failure mode is **hogging** (the bow and stern droop, the midship rises — like a banana) or **sagging** (the opposite — midship droops). The bending stress is: **σ = M / Z**, where M is the wave bending moment and Z is the hull section modulus.

At approximately 100-120 m, wooden hulls reach a fundamental limit: the bending stresses approach the strength of wood, and no amount of additional framing can prevent the hull from flexing, leaking, and eventually breaking apart. This is why Zheng He's treasure ships are at the extreme limit of wooden shipbuilding — and why some historians debate whether the reported dimensions are accurate.

📚 *The square-cube law explains why you can't simply scale things up: an ant scaled to elephant size would collapse under its own weight, because mass grows as the cube of size but structural strength only grows as the square.*`,
      analogy: 'Take a wooden ruler and support it at both ends. It barely bends under its own weight. Now imagine a 10-metre wooden plank supported the same way — it sags dramatically in the middle. The plank is only 30× longer, but its weight increased 30³ = 27,000× while its bending strength only increased 30² = 900×. This is why long wooden ships break in the middle.',
      storyConnection: 'The treasure ship\'s reported dimensions (120 m × 50 m) place it at the absolute structural limit for wooden construction. The Chinese solution was innovative: watertight bulkheads acted as internal bracing, the flat bottom distributed loads over a wide area, and the flexible junk construction allowed the hull to flex without catastrophic failure. Whether these innovations were sufficient for a 120 m vessel remains debated among naval historians.',
      checkQuestion: 'If you double a ship\'s length (2× L), how much does the wave bending moment increase? How much does the hull section modulus increase (assuming proportional scaling)?',
      checkAnswer: 'Bending moment scales as L² × wave height. If the ship is in waves proportional to its size, M ~ L³. Section modulus Z scales as L² × t, and if plank thickness scales with L, Z ~ L³. So they scale together — BUT the hull weight scales as L³ too, adding to the bending loads. This additional weight-induced bending is what breaks the scaling.',
      codeIntro: 'Analyse the structural scaling limits of wooden ships — find the maximum feasible length.',
      code: `import numpy as np

def hull_bending_analysis(length, beam, depth, draft, plank_thickness):
    """
    Calculate hogging/sagging bending stress for a wooden hull.
    Simplified strip-theory approach.
    """
    # Ship weight (tonnes)
    Cb = 0.6  # block coefficient
    rho_wood = 600  # kg/m³ average (hull structure)
    # Structural weight ~ 30% of displacement
    displacement = length * beam * draft * Cb * 1025 / 1000  # tonnes
    structural_weight = displacement * 0.30

    # Wave bending moment (DNV simplified formula, adapted)
    # M_wave = 0.11 × C × L² × B × Cb × 10⁻³ (kN·m)
    C = min(length / 3, 10.75)  # wave coefficient
    M_wave = 0.11 * C * length**2 * beam * Cb  # kN·m (simplified)

    # Still-water bending moment (from weight distribution)
    M_sw = structural_weight * 9.81 * length / 12  # kN·m (approximate)

    # Total bending moment
    M_total = M_wave + M_sw

    # Hull section modulus (simplified box girder)
    # Z = (B × D² / 6) - (B_inner × D_inner² / 6)
    # Inner dimensions = outer minus plank thickness
    t = plank_thickness
    D = depth
    B_outer = beam
    I_outer = B_outer * D**3 / 12
    I_inner = (B_outer - 2*t) * (D - 2*t)**3 / 12
    I_hull = I_outer - I_inner
    Z_hull = I_hull / (D / 2)  # m³

    # Bending stress
    sigma = M_total / Z_hull / 1000  # MPa

    return displacement, M_wave, M_sw, M_total, Z_hull, sigma

# Analyse scaling from 30m to 150m
print("=== Structural Scaling Analysis: Wooden Ships ===")
print(f"{'Length':>7} {'Beam':>5} {'Disp(t)':>8} {'M_wave':>9} {'M_total':>9} "
      f"{'Z_hull':>8} {'Stress':>8} {'Status':>10}")
print("-" * 68)

teak_strength = 5.5  # MPa (across grain — the weak direction for bending)
wood_long_strength = 50  # MPa (along grain — governs keel/plank bending)
# Use a blended effective strength for the hull girder
effective_strength = 20  # MPa (conservative estimate for hull girder)

for L in [30, 40, 50, 60, 80, 100, 120, 140, 160]:
    # Proportional scaling (beam = L/2.4 for junk proportions)
    B = L / 2.4
    D = L / 12    # depth
    T = L / 16    # draft
    t = 0.08 + L * 0.0005  # plank thickness scales weakly with length

    disp, Mw, Msw, Mt, Z, sigma = hull_bending_analysis(L, B, D, T, t)

    sf = effective_strength / sigma if sigma > 0 else float('inf')
    status = "SAFE" if sf > 3 else "marginal" if sf > 1.5 else "FAILS"
    print(f"{L:>6}m {B:>4.0f}m {disp:>7.0f} {Mw:>8.0f} {Mt:>8.0f} "
          f"{Z:>7.2f} {sigma:>7.1f} {status:>10}")

# What saves the treasure ship?
print("\
=== Design Features That Extend the Limit ===")
base_L = 120
base_B = 50
base_D = 10
base_T = 7.5
base_t = 0.14

_, _, _, _, _, base_stress = hull_bending_analysis(base_L, base_B, base_D, base_T, base_t)

features = [
    ("Baseline (no features)", 1.0),
    ("Watertight bulkheads (+30% Z)", 0.70),
    ("Thicker planking (200mm)", 0.80),  # increased t
    ("Internal keelson bracing", 0.75),
    ("Flexible construction (allows deflection)", 0.65),
    ("All features combined", 0.40),
]

print(f"\
Baseline stress at {base_L}m: {base_stress:.1f} MPa")
print(f"Effective wood strength: {effective_strength} MPa\
")

for name, reduction in features:
    effective_stress = base_stress * reduction
    sf = effective_strength / effective_stress
    viable = "VIABLE" if sf > 1.5 else "borderline" if sf > 1.0 else "fails"
    print(f"  {name:<42} Stress: {effective_stress:>5.1f} MPa  SF: {sf:.1f}  {viable}")`,
      challenge: 'Modern steel ships reach 400 m (container ships) with ease. Calculate the stress for a 400 m steel hull (yield strength 250 MPa) using the same scaling model. What is the safety factor? This comparison reveals why the transition from wood to iron/steel in the 1850s was the most important revolution in naval architecture.',
      successHint: 'You just discovered the fundamental scaling limit of wooden shipbuilding — a limit that stood for millennia until iron and steel arrived. The square-cube law appears everywhere in engineering: it limits insect size, building height, aircraft wingspan, and bridge span. Understanding scaling is one of the most powerful tools in an engineer\'s toolkit.',
    },
    {
      title: 'Monsoon wind optimisation — seasonal routing for maximum efficiency',
      concept: `The Indian Ocean is unique among the world's oceans: its wind patterns **reverse** with the seasons. The **summer monsoon** (June-September) blows from the southwest. The **winter monsoon** (November-February) blows from the northeast. This creates a natural "conveyor belt" for sailing ships.

Zheng He's navigators exploited this pattern brilliantly: they departed China in winter (northeast monsoon pushing them southwest toward India and Africa) and returned in summer (southwest monsoon pushing them northeast back to China).

**Optimal routing** means choosing departure dates and waypoints that maximise favourable winds and minimise time spent waiting or fighting headwinds. This is a **dynamic programming** problem: the best route depends on the season, which changes as you travel.

The wind speed and direction at any point can be modelled as: **V(lat, lon, month) = V_base × cos(2π × (month - phase) / 12)**, where the phase shifts with latitude (monsoon arrives later at higher latitudes).

📚 *The monsoon (from Arabic "mawsim" = season) is caused by differential heating of land and sea. In summer, the Asian continent heats up, creating low pressure that draws moist air from the Indian Ocean. In winter, the land cools, and the flow reverses.*`,
      analogy: 'Imagine a river that flows south in winter and north in summer. A clever boatman would sail south in winter (riding the current) and north in summer (riding the current again) — getting a free ride both ways. The Indian Ocean monsoon is exactly this: a wind "river" that reverses direction with the seasons.',
      storyConnection: 'Zheng He departed Nanjing in winter (typically November-January) when the northeast monsoon would carry his fleet southwest through the South China Sea and across the Indian Ocean. He timed his return for the southwest monsoon (May-August). Mistiming the monsoon meant months of waiting in port — or worse, fighting headwinds across open ocean.',
      checkQuestion: 'If the northeast monsoon blows at 15 knots and a ship can make 5 knots against the wind but 8 knots with it, how much time does correct timing save on a 3,000 nm voyage?',
      checkAnswer: 'With monsoon: 3,000 / 8 = 375 hours = 15.6 days. Against monsoon: 3,000 / 5 = 600 hours = 25 days. Savings: 9.4 days. But in reality, the difference is larger because sailing against the monsoon also means fighting waves and current — realistic time savings could be 2-3 weeks.',
      codeIntro: 'Model seasonal wind patterns across the Indian Ocean and optimise Zheng He\'s route timing.',
      code: `import numpy as np

def monsoon_wind(lat, lon, month):
    """
    Model monsoon wind speed and direction at a given location and month.
    Returns (speed_knots, direction_degrees_from).
    """
    # Monsoon phase: NE monsoon peaks in January, SW monsoon peaks in July
    # Wind reversal happens around April and October
    phase = np.cos(2 * np.pi * (month - 1) / 12)  # +1 in Jan, -1 in Jul

    # Base wind speed (stronger at lower latitudes)
    base_speed = 12 + 5 * np.cos(np.radians(lat)) * abs(phase)

    # Direction: NE in winter (phase > 0), SW in summer (phase < 0)
    if phase > 0.1:
        direction = 45  # NE monsoon (blows FROM northeast)
    elif phase < -0.1:
        direction = 225  # SW monsoon (blows FROM southwest)
    else:
        direction = 0  # transition period — light/variable
        base_speed *= 0.3

    # Latitude modulation (monsoon weaker at high latitudes)
    lat_factor = np.cos(np.radians(max(abs(lat) - 5, 0) * 2))
    speed = base_speed * max(lat_factor, 0.2)

    return speed, direction

def voyage_speed(ship_speed, wind_speed, wind_dir, heading):
    """
    Estimate effective speed based on wind angle.
    wind_dir: direction wind blows FROM
    heading: direction ship is going TO
    """
    # Angle between wind and heading
    wind_angle = abs(((wind_dir + 180) - heading + 180) % 360 - 180)

    # Simplified speed model
    if wind_angle < 30:  # nearly dead downwind — good
        return ship_speed + wind_speed * 0.3
    elif wind_angle < 90:  # broad reach — best
        return ship_speed + wind_speed * 0.4
    elif wind_angle < 135:  # beam to close reach
        return ship_speed + wind_speed * 0.15
    else:  # beating into wind
        return max(ship_speed - wind_speed * 0.3, 1.0)

# Route waypoints with headings
route_legs = [
    {"from": "Nanjing",   "to": "Fuzhou",    "lat": 29, "lon": 119, "heading": 200, "dist_nm": 400},
    {"from": "Fuzhou",    "to": "Champa",    "lat": 19, "lon": 114, "heading": 210, "dist_nm": 900},
    {"from": "Champa",    "to": "Malacca",   "lat": 7,  "lon": 106, "heading": 240, "dist_nm": 800},
    {"from": "Malacca",   "to": "Ceylon",    "lat": 5,  "lon": 85,  "heading": 270, "dist_nm": 1400},
    {"from": "Ceylon",    "to": "Calicut",   "lat": 8,  "lon": 78,  "heading": 330, "dist_nm": 400},
    {"from": "Calicut",   "to": "Hormuz",    "lat": 18, "lon": 65,  "heading": 315, "dist_nm": 1200},
    {"from": "Hormuz",    "to": "Mogadishu", "lat": 12, "lon": 52,  "heading": 210, "dist_nm": 1500},
]

base_speed = 4.0  # knots (treasure ship cruising)

# Compare departure months
print("=== Monsoon Route Optimisation ===")
print("Outbound: Nanjing to Mogadishu\
")

for depart_month in [1, 3, 6, 9, 11]:
    month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    total_days = 0
    current_month = depart_month

    for leg in route_legs:
        wind_spd, wind_dir = monsoon_wind(leg["lat"], leg["lon"], current_month)
        eff_speed = voyage_speed(base_speed, wind_spd, wind_dir, leg["heading"])
        days = leg["dist_nm"] / (eff_speed * 24)
        total_days += days
        current_month = ((depart_month - 1 + int(total_days / 30)) % 12) + 1

    print(f"  Depart {month_names[depart_month]:>3}: Total voyage = {total_days:>5.0f} days "
          f"({total_days/30:.1f} months)", end="")
    if depart_month in [11, 1]:
        print(" << OPTIMAL (NE monsoon)")
    elif depart_month in [6]:
        print(" << WORST (against monsoon)")
    else:
        print()

# Detailed leg analysis for optimal departure (November)
print("\
=== Leg-by-Leg Analysis (November departure) ===")
print(f"{'Leg':<25} {'Wind':>5} {'Dir':>5} {'Eff Spd':>8} {'Days':>6}")
print("-" * 51)

month = 11
total = 0
for leg in route_legs:
    w_spd, w_dir = monsoon_wind(leg["lat"], leg["lon"], month)
    eff = voyage_speed(base_speed, w_spd, w_dir, leg["heading"])
    days = leg["dist_nm"] / (eff * 24)
    total += days
    dirs = {45: "NE", 225: "SW", 0: "var"}
    d_str = dirs.get(int(w_dir), f"{w_dir:.0f}")
    name = f"{leg['from']}->{leg['to']}"
    print(f"{name:<25} {w_spd:>4.0f}kt {d_str:>4} {eff:>6.1f}kt {days:>5.0f}")
    month = ((10 + int(total / 30)) % 12) + 1

print(f"\
Total outbound: {total:.0f} days ({total/30:.1f} months)")`,
      challenge: 'Model the return voyage (Mogadishu to Nanjing) departing in different months. The optimal return uses the southwest monsoon (June-August). Calculate the complete round-trip time for the best departure combination. Zheng He\'s actual voyages took about 2 years — does your model agree?',
      successHint: 'You just built a seasonal routing optimiser — the same type of tool that modern shipping companies use to plan fuel-efficient routes based on weather forecasts. The mathematics of wind routing (vector decomposition, time-dependent optimisation) is used by every cargo ship, racing yacht, and transoceanic flight today.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers wave response, fleet logistics, comparative naval architecture, structural scaling, and monsoon routing.
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
