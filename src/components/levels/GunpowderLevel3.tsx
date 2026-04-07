import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GunpowderLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Detonation physics — Chapman-Jouguet theory simplified',
      concept: `There are two fundamentally different ways a chemical reaction can propagate through an explosive: **deflagration** (subsonic burning) and **detonation** (supersonic shock wave).

Gunpowder **deflagrates** — the flame front travels at 100-400 m/s, driven by thermal conduction from the hot reaction zone to unburned material. TNT and nitroglycerin **detonate** — a shock wave compresses and heats the material so rapidly that it reacts in nanoseconds, travelling at 6,000-9,000 m/s.

The **Chapman-Jouguet (CJ) theory** describes the steady-state detonation wave. The key insight: a stable detonation travels at exactly the speed where the reaction energy sustains the shock wave. Too slow, and the shock weakens and dies. Too fast, and the rarefaction wave behind catches up and weakens it.

**CJ detonation velocity**: D_CJ = sqrt(2(γ²-1) × Q)

Where γ is the ratio of specific heats and Q is the energy release per unit mass. Higher energy density = faster detonation = more destructive power.

📚 *Deflagration vs detonation is a sharp divide. Gunpowder CANNOT detonate under normal conditions — its reaction rate is too slow. This is why gunpowder is a propellant (pushes things) rather than a shattering explosive (breaks things). The distinction determines military application.*`,
      analogy: 'Imagine a line of dominoes. If each domino falls and nudges the next (conduction), the wave travels slowly — that\'s deflagration. Now imagine pushing the first domino so hard it creates a shockwave that knocks down all dominoes simultaneously — that\'s detonation. Gunpowder is like gentle dominoes; TNT is like the shockwave.',
      storyConnection: 'Chinese engineers understood the practical difference even without the physics: gunpowder in a cannon PUSHES the cannonball out (deflagration — gas pressure builds over milliseconds). But pack gunpowder into a mine under a fortress wall and ignite it — the confined deflagration, while not a true detonation, shatters the wall because the gas has nowhere to go. The Song Dynasty used both applications extensively.',
      checkQuestion: 'TNT detonates at ~6,900 m/s. Gunpowder deflagrates at ~400 m/s. If both are used in a 1-metre charge, how long does each take to react completely?',
      checkAnswer: 'TNT: 1 m / 6,900 m/s = 0.000145 s = 145 microseconds. Gunpowder: 1 m / 400 m/s = 0.0025 s = 2.5 milliseconds. TNT reacts 17× faster. This speed difference is why TNT shatters steel while gunpowder pushes projectiles — the loading rate determines whether material yields (slow) or fractures (fast).',
      codeIntro: 'Calculate Chapman-Jouguet detonation velocities and compare explosive performance parameters.',
      code: `import numpy as np

def cj_velocity(Q_kj_kg, gamma=1.25):
    """
    Simplified Chapman-Jouguet detonation velocity.
    D = sqrt(2 * (gamma^2 - 1) * Q)
    Q in J/kg, returns m/s
    """
    Q = Q_kj_kg * 1000  # convert kJ/kg to J/kg
    return np.sqrt(2 * (gamma**2 - 1) * Q)

def cj_pressure(density, D_cj, gamma=1.25):
    """CJ detonation pressure: P_cj = rho * D^2 / (gamma + 1)"""
    return density * D_cj**2 / (gamma + 1)

# Explosive comparison
explosives = [
    {"name": "Black powder",      "Q": 2700,  "rho": 1600, "type": "deflagration"},
    {"name": "TNT",               "Q": 4184,  "rho": 1654, "type": "detonation"},
    {"name": "Nitroglycerin",     "Q": 6700,  "rho": 1600, "type": "detonation"},
    {"name": "RDX",               "Q": 5360,  "rho": 1816, "type": "detonation"},
    {"name": "PETN",              "Q": 5810,  "rho": 1770, "type": "detonation"},
    {"name": "Ammonium nitrate",  "Q": 1590,  "rho": 1725, "type": "detonation"},
]

print("=== Chapman-Jouguet Detonation Analysis ===\\\n")
print(f"{'Explosive':<22} {'Q (kJ/kg)':>10} {'D_CJ (m/s)':>11} {'P_CJ (GPa)':>11} {'Type':>14}")
print("-" * 70)

for ex in explosives:
    D = cj_velocity(ex["Q"])
    P = cj_pressure(ex["rho"], D) / 1e9  # GPa
    print(f"{ex['name']:<22} {ex['Q']:>8} {D:>9.0f} {P:>9.1f} {ex['type']:>14}")

# Actual vs CJ velocity (CJ overpredicts for deflagrating materials)
print("\\\n=== Actual vs CJ-Predicted Velocity ===")
actual = {"Black powder": 400, "TNT": 6900, "Nitroglycerin": 7700,
          "RDX": 8750, "PETN": 8400, "Ammonium nitrate": 5270}

for ex in explosives:
    D_cj = cj_velocity(ex["Q"])
    D_actual = actual[ex["name"]]
    ratio = D_actual / D_cj
    note = "(deflagration - CJ not applicable)" if ex["type"] == "deflagration" else ""
    print(f"  {ex['name']:<22} CJ: {D_cj:>6.0f}  Actual: {D_actual:>6}  "
          f"Ratio: {ratio:.2f} {note}")

print()
print("For true detonations, CJ theory predicts velocity within ~20%.")
print("Black powder does not detonate — CJ theory gives a hypothetical")
print("upper bound that is never reached in practice.")`,
      challenge: 'The CJ pressure determines whether an explosive can shatter steel (needs >10 GPa). Calculate which explosives can and cannot breach a steel plate with yield strength of 500 MPa. What minimum detonation velocity is needed? This is the basis of military explosive selection.',
      successHint: 'Chapman-Jouguet theory is the foundation of detonation physics — used to design everything from mining charges to shaped-charge warheads to rocket motor igniters. You now understand the fundamental distinction between deflagration and detonation, and why gunpowder is useful precisely BECAUSE it does not detonate.',
    },
    {
      title: 'Cannon design optimisation — barrel length vs muzzle velocity',
      concept: `A longer barrel gives the expanding gas more time to push the projectile, increasing muzzle velocity. But there are **diminishing returns**: once the powder is fully burned, the gas only expands — pressure drops, and friction accumulates.

The relationship follows a logarithmic curve: **v ∝ sqrt(ln(1 + L/L₀))** where L is barrel length and L₀ is a characteristic length related to the chamber volume.

There is an **optimal barrel length** beyond which adding more barrel DECREASES velocity because friction losses exceed the remaining gas expansion benefit. This optimum depends on the charge mass, bore diameter, and propellant burn rate.

Cannon designers must also consider: weight (longer barrel = heavier = harder to transport), barrel droop (long barrels sag under gravity, reducing accuracy), and cost.

📚 *The "expansion ratio" — barrel volume / chamber volume — is the key parameter. For black powder, the optimal expansion ratio is roughly 6-10. Going beyond this wastes barrel length. Modern smokeless powder has an optimal ratio of 15-25 because it generates more gas per gram.*`,
      analogy: 'Imagine pushing a child on a swing. The first push gives a big speed increase. The second push adds less (they\'re already moving). The fifth push adds almost nothing — they\'re moving too fast for your push to matter. A longer barrel is like more pushes: helpful at first, but with diminishing returns.',
      storyConnection: 'Ming cannon designers discovered this empirically: very short-barrelled "bombards" were powerful but inaccurate. Very long-barrelled culverins were accurate but heavy and expensive. The optimal design — medium barrel, moderate weight — became the standard field gun. European armies went through the same optimisation process independently, arriving at remarkably similar barrel-length-to-bore ratios.',
      checkQuestion: 'A cannon has a 1.5 m barrel and achieves 300 m/s muzzle velocity. Doubling the barrel to 3 m gives 380 m/s. Tripling to 4.5 m gives 410 m/s. Why are the returns diminishing?',
      checkAnswer: 'By the time the projectile has travelled 1.5 m, most of the powder has burned. In the remaining barrel length, the gas is only expanding (no new gas generated), so pressure drops rapidly. Meanwhile, friction accumulates linearly with barrel length. The net push per metre decreases as the barrel gets longer.',
      codeIntro: 'Model muzzle velocity as a function of barrel length and find the optimal design for different cannon types.',
      code: `import numpy as np

def muzzle_velocity(barrel_length, charge_g, bore_mm, proj_g,
                    burn_rate=10, friction_coeff=0.02):
    """
    Simplified model: gas expansion with friction losses.
    Returns muzzle velocity in m/s.
    """
    bore_area = np.pi * (bore_mm / 2000)**2  # m²
    proj_mass = proj_g / 1000
    charge_kg = charge_g / 1000
    R_gas = 300
    T = 2500
    chamber_length = 0.05  # effective chamber length (m)

    # Total gas moles (simplified)
    gas_total = charge_kg * R_gas * T  # P*V product at full burn

    # Integration over barrel length
    n_steps = 500
    dx = barrel_length / n_steps
    vel = 0.0

    for i in range(n_steps):
        x = (i + 0.5) * dx + chamber_length
        volume = bore_area * x

        # Fraction of powder burned (exponential approach)
        burn_fraction = 1 - np.exp(-x / (burn_rate * 0.01))

        # Pressure
        P = gas_total * burn_fraction / volume

        # Net force (gas push minus friction)
        F_gas = P * bore_area
        F_friction = friction_coeff * proj_mass * 9.81 + 0.05 * F_gas
        F_net = max(F_gas - F_friction, 0)

        # Acceleration
        acc = F_net / proj_mass
        vel += acc * dx / max(vel, 1)  # dt = dx/v

    return vel

# Barrel length sweep for a Ming cannon
charge = 200    # g powder
bore = 80       # mm
proj = 2000     # g (2 kg stone ball)
lengths = np.arange(0.2, 5.0, 0.1)

print("=== Barrel Length Optimisation ===")
print(f"Charge: {charge}g | Bore: {bore}mm | Projectile: {proj}g\\\n")
print(f"{'Length (m)':>10} {'Velocity (m/s)':>15} {'Energy (kJ)':>12} {'Efficiency':>12}")
print("-" * 51)

velocities = []
best_v, best_L = 0, 0
for L in lengths:
    v = muzzle_velocity(L, charge, bore, proj)
    velocities.append(v)
    if v > best_v:
        best_v = v
        best_L = L

# Print at selected lengths
for L in [0.3, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0]:
    idx = int((L - 0.2) / 0.1)
    if 0 <= idx < len(velocities):
        v = velocities[idx]
        energy = 0.5 * (proj/1000) * v**2 / 1000
        eff = energy / (charge/1000 * 2700) * 100  # energy / chemical energy
        print(f"{L:>8.1f}m {v:>13.0f} {energy:>10.1f} {eff:>10.1f}%")

print(f"\\\nOptimal barrel length: {best_L:.1f} m")
print(f"Peak muzzle velocity:  {best_v:.0f} m/s")

# Compare weapon types
print("\\\n=== Optimal Barrel Length by Weapon Type ===")
weapons = [
    ("Hand cannon",   20, 25, 30),
    ("Field cannon",  200, 80, 2000),
    ("Naval cannon",  1000, 150, 15000),
    ("Siege bombard", 3000, 300, 80000),
]

for name, ch, bo, pr in weapons:
    best_v, best_L = 0, 0
    for L in np.arange(0.1, 6.0, 0.05):
        v = muzzle_velocity(L, ch, bo, pr)
        if v > best_v:
            best_v, best_L = v, L
    barrel_cal = best_L / (bo / 1000)
    print(f"  {name:<16} Optimal: {best_L:>4.1f}m ({barrel_cal:.0f} calibres)  "
          f"Muzzle: {best_v:>5.0f} m/s")`,
      challenge: 'Add a "weight penalty" to the optimisation: each metre of barrel adds 50 kg to the cannon\'s weight, reducing its mobility score. Find the barrel length that maximises a combined score of (muzzle_velocity × 0.6 + mobility × 0.4). This is the real trade-off that military engineers face.',
      successHint: 'You just performed the same optimisation that cannon designers have done for 600 years — balancing range, weight, cost, and manufacturing difficulty. Modern artillery still follows these physics: the M777 howitzer\'s barrel is precisely optimised for its propellant charge, bore diameter, and projectile weight.',
    },
    {
      title: 'The Tsiolkovsky rocket equation applied to black powder rockets',
      concept: `Chinese engineers invented rockets in the 13th century — bamboo tubes packed with gunpowder that propelled themselves through the air. The physics of ANY rocket — from a Song Dynasty fire arrow to a SpaceX Falcon 9 — is described by the **Tsiolkovsky rocket equation**:

**Δv = v_e × ln(m₀ / m_f)**

Where Δv is the change in velocity, v_e is the exhaust velocity (how fast the gas leaves the nozzle), m₀ is the initial mass (rocket + propellant), and m_f is the final mass (rocket after propellant is burned).

The **mass ratio** (m₀/m_f) is everything: a rocket that is 90% propellant (mass ratio 10) achieves Δv = v_e × ln(10) = 2.3 × v_e. A rocket that is 50% propellant (mass ratio 2) achieves only Δv = v_e × ln(2) = 0.69 × v_e.

For black powder: v_e ≈ 600-800 m/s (exhaust velocity). For modern solid rockets: v_e ≈ 2,500-3,000 m/s. For liquid hydrogen/oxygen: v_e ≈ 4,400 m/s. Higher exhaust velocity means more Δv for the same mass ratio.

📚 *The natural logarithm (ln) in the equation means doubling the propellant mass does NOT double the velocity — you get diminishing returns. To double Δv, you need to SQUARE the mass ratio. This is the fundamental challenge of rocketry.*`,
      analogy: 'Imagine standing on a skateboard and throwing bricks backward. Each brick you throw pushes you forward a bit. But as you throw more bricks, you\'re lighter, so each brick gives a bigger push. The rocket equation captures this: the lighter you get as you burn fuel, the more each remaining kilogram of fuel accelerates you.',
      storyConnection: 'Song Dynasty "fire arrows" (huo jian) were the world\'s first rockets: a bamboo tube filled with gunpowder, strapped to an arrow shaft. The expanding gas shot out the back, pushing the arrow forward at speeds impossible for a bow. By the 14th century, Chinese engineers were building multi-stage rocket arrays — clusters of rockets that fired sequentially for sustained propulsion.',
      checkQuestion: 'A Chinese fire arrow has total mass 500 g with 200 g of gunpowder (v_e = 700 m/s). What is its theoretical Δv?',
      checkAnswer: 'Mass ratio = 500/300 = 1.667. Δv = 700 × ln(1.667) = 700 × 0.511 = 358 m/s. Real velocity is lower due to gravity and air drag, but 358 m/s gives a rough upper bound — more than double the ~150 m/s of a longbow arrow.',
      codeIntro: 'Apply the Tsiolkovsky equation to analyse Chinese black powder rockets and compare with modern rocketry.',
      code: `import numpy as np

def tsiolkovsky_dv(v_exhaust, m_initial, m_final):
    """Tsiolkovsky rocket equation: Δv = v_e × ln(m0/mf)"""
    return v_exhaust * np.log(m_initial / m_final)

def rocket_range(dv, launch_angle_deg=45, g=9.81):
    """Simplified range assuming ballistic trajectory after burnout."""
    angle = np.radians(launch_angle_deg)
    return dv**2 * np.sin(2 * angle) / g

# Chinese black powder rockets through history
print("=== Chinese Rocket Evolution ===\\\n")
rockets = [
    {"name": "Fire arrow (1232)",     "m_total": 0.5,  "m_prop": 0.2,
     "v_e": 600,  "description": "Bamboo tube on arrow shaft"},
    {"name": "Fire lance rocket",     "m_total": 2.0,  "m_prop": 1.0,
     "v_e": 650,  "description": "Larger tube, iron shrapnel"},
    {"name": "Huolongjing rocket",    "m_total": 5.0,  "m_prop": 3.0,
     "v_e": 700,  "description": "14th-century military rocket"},
    {"name": "Korean Hwacha arrow",   "m_total": 0.8,  "m_prop": 0.4,
     "v_e": 680,  "description": "Mass-produced rocket arrow"},
    {"name": "Wan Hu's chair (legend)", "m_total": 100, "m_prop": 70,
     "v_e": 700,  "description": "47 rockets, first 'astronaut'"},
]

print(f"{'Rocket':<24} {'Mass Ratio':>10} {'Δv (m/s)':>10} {'Range (m)':>10}")
print("-" * 56)

for r in rockets:
    m_final = r["m_total"] - r["m_prop"]
    mass_ratio = r["m_total"] / m_final
    dv = tsiolkovsky_dv(r["v_e"], r["m_total"], m_final)
    rng = rocket_range(dv)
    print(f"{r['name']:<24} {mass_ratio:>8.2f} {dv:>8.0f} {rng:>10.0f}")

# Compare with modern rockets
print("\\\n=== Historical vs Modern Rocket Performance ===\\\n")
modern = [
    ("Black powder (1232)",      700,   0.6, "First rockets"),
    ("Congreve rocket (1804)",   800,   0.7, "Napoleonic wars"),
    ("V-2 (1944)",              2050,   0.75, "First ballistic missile"),
    ("Solid booster (modern)",  2700,   0.85, "SRB technology"),
    ("Liquid H2/O2 (modern)",   4400,   0.90, "Space launch"),
    ("Ion thruster",           30000,   0.70, "Deep space probes"),
]

print(f"{'Rocket':<28} {'v_e (m/s)':>10} {'Prop frac':>10} {'Δv (m/s)':>10}")
print("-" * 60)
for name, ve, prop_frac, desc in modern:
    mr = 1 / (1 - prop_frac)
    dv = tsiolkovsky_dv(ve, mr, 1)
    print(f"{name:<28} {ve:>8} {prop_frac:>8.0%} {dv:>10.0f}")

print()
print("The same equation governs ALL rockets — from 13th-century")
print("Chinese fire arrows to SpaceX Falcon 9. The physics is")
print("identical; only the exhaust velocity and mass ratio differ.")`,
      challenge: 'Design a two-stage black powder rocket where the first stage burns and drops away, then the second stage fires. Use the rocket equation for each stage separately. Show that staging achieves higher Δv than a single stage of the same total mass. This is why multi-stage rockets exist.',
      successHint: 'The Tsiolkovsky rocket equation is the most important equation in spaceflight. Every rocket ever built is constrained by it. You now understand the fundamental limit: exhaust velocity sets the ceiling, and the logarithmic mass ratio means getting to orbit requires extreme engineering. Chinese fire arrows were the first step on a path that leads directly to the Moon.',
    },
    {
      title: 'Military operations research — siege warfare modelling',
      concept: `Operations research (OR) was formalised in World War II, but its principles were applied intuitively by military commanders for centuries. **Siege warfare** is a classic OR problem: the attacker must breach the defender's fortifications while managing limited resources (ammunition, troops, food, time).

Key variables: **bombardment rate** (cannonballs per hour), **wall degradation** (damage per hit), **defender repair rate** (how fast they fix damage), **attacker attrition** (losses from defender fire), and **supply consumption** (powder, food, water).

The siege succeeds when cumulative wall damage exceeds the wall's structural capacity AND the attacker still has enough troops for an assault. It fails if the attacker runs out of supplies or troops first.

This is a **system of differential equations** — or, in our discrete simulation, a step-by-step model that advances day by day.

📚 *Lanchester's laws (1916) formalised military attrition mathematics. His "square law" shows that combat power scales with the SQUARE of troop numbers — an army twice as large is FOUR times as effective. This makes concentration of force the most important tactical principle.*`,
      analogy: 'A siege is like a chess game against the clock. The attacker trades pieces (cannonballs, troops) to damage the defender\'s position (walls). The defender trades time to repair damage. The attacker wins if they breach the wall before running out of resources. The defender wins if they survive until the attacker gives up.',
      storyConnection: 'The Mongol siege of Xiangyang (1267-1273) lasted six years — the longest siege in medieval Chinese history. The Song defenders\' walls withstood conventional bombardment for five years. The Mongols finally brought in Muslim engineers who built counterweight trebuchets (later replaced by gunpowder weapons in subsequent sieges) capable of breaching the walls. This siege changed Chinese military engineering forever.',
      checkQuestion: 'An attacker fires 50 cannonballs per day, each doing 0.1% damage to the wall. The defender repairs 2% per day. Will the wall ever be breached?',
      checkAnswer: 'Daily damage = 50 × 0.1% = 5%. Daily repair = 2%. Net damage = 3% per day. The wall is breached at 100% damage in 100/3 ≈ 34 days. But if the defender increases repair to 5%, net damage = 0 — the siege stalls indefinitely. This is why attackers concentrate fire to overwhelm repair capacity.',
      codeIntro: 'Simulate a gunpowder-era siege with bombardment, repair, attrition, and supply logistics.',
      code: `import numpy as np

np.random.seed(42)

def simulate_siege(attacker_troops, defender_troops,
                   cannons, powder_supply_kg,
                   wall_strength=100, max_days=365):
    """
    Simulate a medieval gunpowder siege day by day.
    Returns outcome and daily state history.
    """
    wall_hp = wall_strength
    att_troops = attacker_troops
    def_troops = defender_troops
    powder = powder_supply_kg
    history = []

    for day in range(1, max_days + 1):
        # Bombardment (each cannon fires ~10 shots/day, 2kg powder each)
        active_cannons = min(cannons, int(powder / 20))  # need 20kg/cannon/day
        shots = active_cannons * int(np.random.normal(10, 2))
        powder -= active_cannons * 20

        # Wall damage (each hit does 0.05-0.15% damage)
        damage_per_shot = np.random.uniform(0.05, 0.15)
        total_damage = shots * damage_per_shot
        wall_hp -= total_damage

        # Defender repairs (proportional to defender troops)
        repair_rate = 0.001 * def_troops / 1000  # % per day per 1000 troops
        wall_hp = min(wall_hp + repair_rate * 100, wall_strength)

        # Attrition: defender sorties and artillery fire back
        att_losses = int(np.random.normal(def_troops * 0.002, 5))
        def_losses = int(np.random.normal(att_troops * 0.001, 3))
        att_troops = max(0, att_troops - max(0, att_losses))
        def_troops = max(0, def_troops - max(0, def_losses))

        # Supply consumption (2kg food per troop per day)
        daily_food = att_troops * 2

        history.append({
            "day": day, "wall_hp": wall_hp,
            "att": att_troops, "def": def_troops,
            "powder": powder, "shots": shots
        })

        # Check outcomes
        if wall_hp <= 0:
            return "BREACH", day, history
        if powder <= 0 and wall_hp > 30:
            return "OUT_OF_POWDER", day, history
        if att_troops < defender_troops * 0.5:
            return "ATTACKER_ROUTED", day, history
        if def_troops <= 0:
            return "DEFENDER_ELIMINATED", day, history

    return "SIEGE_LIFTED", max_days, history

# Scenario: Ming fortress siege
scenarios = [
    ("Weak assault",      5000, 2000, 5,  5000),
    ("Standard siege",   10000, 2000, 15, 20000),
    ("Overwhelming force", 25000, 2000, 40, 80000),
    ("Low supplies",     15000, 2000, 20, 8000),
]

print("=== Gunpowder Siege Simulation ===\\\n")
for name, att, defn, guns, powder in scenarios:
    outcome, days, hist = simulate_siege(att, defn, guns, powder)

    final = hist[-1]
    print(f"{name}:")
    print(f"  Outcome: {outcome} (Day {days})")
    print(f"  Wall integrity: {max(0, final['wall_hp']):.0f}%")
    print(f"  Attacker remaining: {final['att']:,} / {att:,}")
    print(f"  Defender remaining: {final['def']:,} / {defn:,}")
    print(f"  Powder remaining: {max(0, final['powder']):,.0f} kg")
    print()

# Monte Carlo: probability of breach
print("=== Breach Probability (1000 simulations) ===")
results = []
for _ in range(1000):
    outcome, days, _ = simulate_siege(12000, 2000, 20, 25000)
    results.append(outcome)

breach = results.count("BREACH") + results.count("DEFENDER_ELIMINATED")
print(f"Breach probability: {breach/10:.1f}%")
print(f"Avg siege duration: {np.mean([r[1] for r in [simulate_siege(12000, 2000, 20, 25000) for _ in range(100)]]):.0f} days")`,
      challenge: 'Add a "reinforcement" event: on day 30, the defender receives 1,000 fresh troops. How does this change the breach probability? Model two scenarios: with and without reinforcement. This illustrates why cutting supply lines was as important as bombardment in siege warfare.',
      successHint: 'Operations research transforms military intuition into mathematics. The siege model you built uses the same principles as modern military simulations — Lanchester attrition, logistics modelling, and Monte Carlo probability assessment. OR is now used in business (supply chains), healthcare (resource allocation), and urban planning.',
    },
    {
      title: 'Technology diffusion networks — Silk Road graph analysis',
      concept: `Gunpowder was invented in China around 850 CE and reached Europe by ~1280 CE — a diffusion process spanning 400+ years and 8,000+ km. How do technologies spread across networks of trading cities and cultural contacts?

**Network diffusion** models treat each city as a **node** and each trade route as an **edge** with a "transmission probability" — the chance that knowledge passes along that route per unit time.

Key concepts:
- **Degree centrality**: how many connections a node has (trade routes)
- **Betweenness centrality**: how many shortest paths pass through a node (chokepoints)
- **Diffusion speed**: how fast an innovation reaches all nodes, depending on network structure

Cities with high betweenness centrality (like Samarkand on the Silk Road) are **gatekeepers** — technology diffusion slows dramatically if they are disrupted.

📚 *Network analysis applies to disease spread, social media virality, and supply chain disruption. The mathematics is identical: nodes, edges, and propagation rules.*`,
      analogy: 'Imagine a rumour spreading through a school. If everyone knows everyone (dense network), the rumour reaches everyone in a day. If there are isolated cliques connected by one "popular kid" (high betweenness), the rumour stalls if that kid is absent. The Silk Road network had similar chokepoints — cities whose disruption could delay technology transfer by decades.',
      storyConnection: 'Gunpowder knowledge travelled from China through Central Asia to the Islamic world and then to Europe. The key relay nodes were Dunhuang (China\'s western gateway), Samarkand (Silk Road hub), Baghdad (Islamic scholarly centre), and Constantinople (gateway to Europe). Each transfer required not just physical proximity but cultural exchange — scholars, merchants, and soldiers who could understand and replicate the technology.',
      checkQuestion: 'If Samarkand (a key node) is destroyed, how would this affect the diffusion of a new technology from China to Europe?',
      checkAnswer: 'Dramatically. Samarkand sat at the intersection of the northern and southern Silk Road routes. Without it, trade would divert to longer, less-travelled routes — slowing diffusion by decades or more. This is exactly what happened during the Mongol invasions: destruction of Central Asian cities temporarily disrupted east-west knowledge transfer (before the Pax Mongolica re-established routes).',
      codeIntro: 'Model the Silk Road as a network graph and simulate gunpowder diffusion across it.',
      code: `import numpy as np

np.random.seed(42)

# Silk Road network: cities and trade routes
cities = [
    "Chang'an", "Dunhuang", "Kashgar", "Samarkand", "Merv",
    "Baghdad", "Constantinople", "Venice", "Cairo", "Delhi",
    "Karakorum", "Hormuz", "Guangzhou", "Hangzhou", "Bukhara"
]

# Adjacency: (city_a, city_b, transmission_probability_per_decade)
routes = [
    ("Chang'an", "Dunhuang", 0.9),
    ("Chang'an", "Hangzhou", 0.95),
    ("Chang'an", "Guangzhou", 0.8),
    ("Dunhuang", "Kashgar", 0.7),
    ("Kashgar", "Samarkand", 0.6),
    ("Samarkand", "Bukhara", 0.8),
    ("Samarkand", "Merv", 0.7),
    ("Bukhara", "Merv", 0.6),
    ("Merv", "Baghdad", 0.6),
    ("Baghdad", "Constantinople", 0.5),
    ("Baghdad", "Cairo", 0.6),
    ("Constantinople", "Venice", 0.7),
    ("Cairo", "Venice", 0.4),
    ("Hormuz", "Baghdad", 0.5),
    ("Guangzhou", "Hormuz", 0.3),
    ("Delhi", "Samarkand", 0.4),
    ("Delhi", "Hormuz", 0.4),
    ("Karakorum", "Chang'an", 0.6),
    ("Karakorum", "Samarkand", 0.5),
]

# Build adjacency structure
adj = {c: [] for c in cities}
for a, b, p in routes:
    adj[a].append((b, p))
    adj[b].append((a, p))

# Calculate centrality metrics
print("=== Silk Road Network Analysis ===\\\n")
print(f"{'City':<18} {'Degree':>7} {'Connections':>40}")
print("-" * 67)
for c in cities:
    neighbors = [n for n, p in adj[c]]
    print(f"{c:<18} {len(adj[c]):>5}   {', '.join(neighbors)}")

# Simulate diffusion from Chang'an
def simulate_diffusion(adj, source, n_sims=500, max_decades=50):
    """Simulate technology diffusion. Returns average arrival decade."""
    arrival_times = {c: [] for c in cities}

    for sim in range(n_sims):
        has_tech = {c: False for c in cities}
        has_tech[source] = True
        arrival = {c: max_decades for c in cities}
        arrival[source] = 0

        for decade in range(1, max_decades + 1):
            new_adopters = []
            for city in cities:
                if not has_tech[city]:
                    for neighbor, prob in adj[city]:
                        if has_tech[neighbor] and np.random.random() < prob:
                            new_adopters.append(city)
                            arrival[city] = decade
                            break
            for c in new_adopters:
                has_tech[c] = True

        for c in cities:
            arrival_times[c].append(arrival[c])

    return {c: np.mean(times) for c, times in arrival_times.items()}

# Normal diffusion
avg_arrival = simulate_diffusion(adj, "Chang'an")

print("\\\n=== Gunpowder Diffusion (decades after invention) ===")
sorted_cities = sorted(avg_arrival.items(), key=lambda x: x[1])
for city, decades in sorted_cities:
    years = decades * 10
    bar = "█" * int(decades * 2)
    print(f"  {city:<18} {decades:>4.1f} decades ({years:>4.0f} years)  {bar}")

# Historical comparison
print("\\\nHistorical record:")
print("  Gunpowder invented: ~850 CE (Chang'an)")
print("  Reached Islamic world: ~1240 CE (~390 years)")
print("  Reached Europe: ~1280 CE (~430 years)")`,
      challenge: 'Remove Samarkand from the network (simulate its destruction) and re-run the diffusion. How many extra decades does it take for gunpowder to reach Venice? Now add a "sea route" from Guangzhou to Cairo with probability 0.2. Does the maritime route compensate for losing Samarkand? This models the historical shift from overland to maritime trade.',
      successHint: 'Network analysis and diffusion modelling are used today to track disease outbreaks (epidemiology), model information spread on social media, optimise supply chains, and plan telecommunications networks. The same graph theory that explains gunpowder\'s journey along the Silk Road explains how a tweet goes viral or how a virus becomes a pandemic.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Detonation physics, rocket equations, and network analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers detonation theory, cannon optimisation, rocket equations, siege modelling, and technology diffusion networks.
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
