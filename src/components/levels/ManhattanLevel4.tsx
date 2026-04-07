import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ManhattanLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: System design — Nucleus, Neutron, and Material classes',
      concept: `In this capstone project, you will build a complete **Chain Reaction Simulator** — a Python program that models the nuclear fission chain reaction from first principles:

1. **System design** — define Nucleus, Neutron, and Material classes with physical properties
2. **Neutron multiplication engine** — track neutrons generation by generation, calculating k-effective
3. **Critical mass solver** — iterate sphere radius until k reaches 1.0
4. **Yield estimator** — convert fission count to energy output in kilotons
5. **Documentation with ethics discussion** — explain the science AND its moral implications

The first step is **system design**. We need three core classes:

- **Nucleus**: represents an atomic nucleus with Z, A, binding energy, and cross-sections
- **Neutron**: represents a single neutron with position, velocity, and energy
- **Material**: represents a bulk material with density, composition, and macroscopic properties

Good object-oriented design means each class encapsulates its own physics. The Nucleus knows its cross-sections. The Neutron knows how to move. The Material knows its density and composition. The simulation orchestrates them.

📚 *Encapsulation — keeping data and the methods that operate on it together in one class — is the foundation of maintainable software. When each class has a single, clear responsibility, the system is easier to understand, test, and extend.*`,
      analogy: 'Building a simulator is like building a machine from components. Each component (gear, spring, lever) has its own properties and behaviour. You don\'t need to understand the internal workings of every gear to assemble the machine — you just need to know its interface: what goes in and what comes out. Classes work the same way: each one hides its complexity behind a clean interface.',
      storyConnection: 'The Manhattan Project\'s theoretical division at Los Alamos faced exactly this design problem. They needed to model neutron behaviour in complex geometries with multiple materials. Their solution — decomposing the problem into interacting physical entities (neutrons, nuclei, materials) — is the same object-oriented approach we use today. The difference: they computed by hand and with mechanical calculators; we use Python.',
      checkQuestion: 'Why should the Nucleus class store cross-sections rather than having them as global variables?',
      checkAnswer: 'Because different nuclei have different cross-sections. U-235 has σ_f = 585 barns (thermal) while U-238 has σ_f = 0.00002 barns. If cross-sections were global, you\'d need a lookup table and conditionals everywhere. Storing them in the Nucleus object means the data travels with the nucleus — any function that has a Nucleus can immediately access its properties.',
      codeIntro: 'Design the architecture of the Chain Reaction Simulator — define core classes with physical properties.',
      code: `import numpy as np

class Nucleus:
    """Represents an atomic nucleus with its nuclear properties."""
    def __init__(self, name, Z, A, sigma_f, sigma_c, sigma_s, nu, binding_energy_per_nucleon):
        self.name = name
        self.Z = Z                    # proton number
        self.A = A                    # mass number
        self.sigma_f = sigma_f        # fission cross-section (barns, fast)
        self.sigma_c = sigma_c        # capture cross-section (barns, fast)
        self.sigma_s = sigma_s        # scatter cross-section (barns, fast)
        self.sigma_total = sigma_f + sigma_c + sigma_s
        self.nu = nu                  # average neutrons per fission
        self.BE_per_A = binding_energy_per_nucleon  # MeV
        self.fissile = sigma_f > 0.5  # practical threshold

    def fission_probability(self):
        """Probability that an interaction is fission."""
        if self.sigma_total == 0:
            return 0
        return self.sigma_f / self.sigma_total

    def energy_per_fission_mev(self):
        """Approximate energy released per fission (MeV)."""
        # Products are near A=118 with BE/A ~ 8.5 MeV
        be_products = self.A * 8.5
        be_reactant = self.A * self.BE_per_A
        return be_products - be_reactant

class Neutron:
    """Represents a single neutron with position and direction."""
    def __init__(self, position, direction, energy_mev=2.0):
        self.position = np.array(position, dtype=float)  # cm
        self.direction = np.array(direction, dtype=float)  # unit vector
        self.direction /= np.linalg.norm(self.direction)
        self.energy = energy_mev       # MeV
        self.alive = True
        self.fate = None               # 'fission', 'capture', 'escape', 'scatter'
        self.generation = 0

    def move(self, distance_cm):
        """Move neutron along its direction."""
        self.position += distance_cm * self.direction

    def scatter_isotropic(self):
        """Randomly change direction (isotropic scatter)."""
        theta = np.arccos(2 * np.random.random() - 1)
        phi = 2 * np.pi * np.random.random()
        self.direction = np.array([
            np.sin(theta) * np.cos(phi),
            np.sin(theta) * np.sin(phi),
            np.cos(theta)
        ])

class Material:
    """Represents a bulk material containing nuclei."""
    def __init__(self, name, nucleus, density_gcc, enrichment=1.0):
        self.name = name
        self.nucleus = nucleus
        self.density = density_gcc     # g/cm^3
        self.enrichment = enrichment   # fraction of fissile isotope
        N_A = 6.022e23
        self.n_density = density_gcc * N_A / nucleus.A  # atoms/cm^3
        barn = 1e-24
        self.Sigma_f = self.n_density * nucleus.sigma_f * barn * enrichment
        self.Sigma_c = self.n_density * nucleus.sigma_c * barn
        self.Sigma_s = self.n_density * nucleus.sigma_s * barn
        self.Sigma_t = self.Sigma_f + self.Sigma_c + self.Sigma_s
        self.mfp = 1.0 / self.Sigma_t if self.Sigma_t > 0 else float('inf')

    def sample_distance(self):
        """Sample distance to next interaction (exponential distribution)."""
        return -self.mfp * np.log(np.random.random())

    def sample_interaction(self):
        """Randomly determine interaction type based on cross-sections."""
        xi = np.random.random() * self.Sigma_t
        if xi < self.Sigma_f:
            return 'fission'
        elif xi < self.Sigma_f + self.Sigma_c:
            return 'capture'
        else:
            return 'scatter'

# Build the nuclear material library
NUCLEI = {
    "U-235":  Nucleus("U-235",  92, 235, 1.24, 0.09, 4.57, 2.43, 7.59),
    "U-238":  Nucleus("U-238",  92, 238, 0.31, 2.70, 4.80, 2.41, 7.57),
    "Pu-239": Nucleus("Pu-239", 94, 239, 1.80, 0.27, 4.39, 2.88, 7.56),
}

MATERIALS = {
    "HEU":     Material("Highly Enriched U-235", NUCLEI["U-235"], 19.1, enrichment=0.93),
    "LEU":     Material("Low Enriched U-235", NUCLEI["U-235"], 19.1, enrichment=0.035),
    "Pu-239":  Material("Weapons-grade Pu-239", NUCLEI["Pu-239"], 19.8, enrichment=0.94),
    "Nat-U":   Material("Natural Uranium", NUCLEI["U-235"], 19.1, enrichment=0.007),
}

# System overview
print("=== Chain Reaction Simulator — System Design ===")
print("\\\nCore classes defined:")
print("  1. Nucleus  — Z, A, cross-sections, nu, binding energy")
print("  2. Neutron  — position, direction, energy, fate tracking")
print("  3. Material — bulk properties, macroscopic cross-sections")
print()

print("=== Nuclear Material Library ===")
print(f"{'Material':<28} {'Density':>8} {'MFP (cm)':>10} {'P(fission)':>11} {'E/fission':>10}")
print("-" * 69)
for key, mat in MATERIALS.items():
    p_f = mat.Sigma_f / mat.Sigma_t if mat.Sigma_t > 0 else 0
    E = mat.nucleus.energy_per_fission_mev()
    print(f"{mat.name:<28} {mat.density:>6.1f} {mat.mfp:>8.2f} {p_f:>9.3f} {E:>8.1f} MeV")

# Quick test: create a neutron and step it
print("\\\n=== Neutron Test ===")
n = Neutron([0, 0, 0], [1, 0, 0])
mat = MATERIALS["HEU"]
d = mat.sample_distance()
n.move(d)
interaction = mat.sample_interaction()
print(f"Neutron moved {d:.2f} cm, interaction: {interaction}")
print(f"New position: ({n.position[0]:.2f}, {n.position[1]:.2f}, {n.position[2]:.2f})")`,
      challenge: 'Add a Reflector class that wraps around the Material sphere. The reflector has only scatter and capture cross-sections (no fission). When a neutron escapes the fissile core, check if it enters the reflector — if so, it can scatter back into the core. This is how real weapon and reactor designs use neutron reflectors to reduce critical mass.',
      successHint: 'Good system design makes everything else easier. Your three classes — Nucleus, Neutron, Material — encapsulate the physics cleanly. The Nucleus knows its quantum properties, the Neutron knows its kinematics, and the Material knows its bulk behaviour. This separation of concerns is exactly how professional nuclear simulation codes (MCNP, OpenMC) are structured.',
    },
    {
      title: 'Neutron multiplication engine — tracking k-effective generation by generation',
      concept: `The heart of the chain reaction simulator is the **multiplication engine**: a loop that tracks neutrons generation by generation and calculates the effective multiplication factor **k-effective** (k_eff).

The algorithm works like this:

1. **Start** with N₀ source neutrons distributed randomly in the fissile sphere
2. **Transport** each neutron: sample step length, move, check boundary, determine interaction
3. **Count** outcomes: fissions (produce ν new neutrons each), captures, escapes
4. **Calculate** k_eff = (total neutrons produced) / (total neutrons started)
5. **Repeat** for multiple generations, using fission-produced neutrons as the next generation's source

After several generations, k_eff converges to the true multiplication factor. If k_eff > 1 consistently, the system is supercritical. The number of generations to convergence depends on the geometry — typically 10-20 generations for a bare sphere.

The **standard deviation** of k_eff tells you the statistical uncertainty of your Monte Carlo estimate. More neutron histories = lower uncertainty, but more computation time. This is the fundamental trade-off in Monte Carlo simulation.

📚 *The "generation" concept maps directly to the physical chain reaction: each generation is one round of fissions. In a weapon, the generation time is ~10 nanoseconds. In a reactor, it's ~0.1 seconds (because of delayed neutrons).*`,
      analogy: 'Imagine a game of tag where each tagged person can tag two new people before sitting down. If more than one of those two finds someone to tag (k > 1), the number of "it" players grows exponentially. If fewer than one succeeds (k < 1), the game dies out. k-effective measures the average success rate per generation.',
      storyConnection: 'Fermi\'s Chicago Pile-1 experiment on December 2, 1942, was the first time humans deliberately achieved k = 1.0006 — just barely supercritical. He controlled k by inserting and withdrawing cadmium strips, watching the neutron count rate on a chart recorder. The multiplication engine you\'re building simulates exactly what Fermi observed: neutron population growing or shrinking generation by generation.',
      checkQuestion: 'If k_eff = 1.1 and the generation time is 10 nanoseconds, how many generations does it take for the neutron population to reach 10²⁰ (enough for a significant energy release) starting from one neutron?',
      checkAnswer: 'N = k^n, so 10²⁰ = 1.1^n. Taking logarithms: n = 20 × ln(10) / ln(1.1) = 20 × 2.303 / 0.0953 = 483 generations. At 10 ns per generation: 483 × 10 ns = 4.83 μs. The entire chain reaction — from first neutron to full detonation — takes less than 5 microseconds.',
      codeIntro: 'Build the neutron multiplication engine that tracks k-effective over multiple generations.',
      code: `import numpy as np

np.random.seed(42)

class ChainReactionEngine:
    """
    Neutron multiplication engine for a bare sphere of fissile material.
    Tracks neutrons generation-by-generation and computes k-effective.
    """
    def __init__(self, radius_cm, material_sigma_f, material_sigma_c,
                 material_sigma_s, nu, n_density):
        self.radius = radius_cm
        barn = 1e-24
        self.Sigma_f = n_density * material_sigma_f * barn
        self.Sigma_c = n_density * material_sigma_c * barn
        self.Sigma_s = n_density * material_sigma_s * barn
        self.Sigma_t = self.Sigma_f + self.Sigma_c + self.Sigma_s
        self.mfp = 1.0 / self.Sigma_t
        self.nu = nu

    def _random_position_in_sphere(self):
        """Uniform random point inside the sphere."""
        r = self.radius * np.random.random()**(1/3)
        theta = np.arccos(2 * np.random.random() - 1)
        phi = 2 * np.pi * np.random.random()
        return np.array([r*np.sin(theta)*np.cos(phi),
                        r*np.sin(theta)*np.sin(phi),
                        r*np.cos(theta)])

    def _random_direction(self):
        """Isotropic random direction."""
        theta = np.arccos(2 * np.random.random() - 1)
        phi = 2 * np.pi * np.random.random()
        return np.array([np.sin(theta)*np.cos(phi),
                        np.sin(theta)*np.sin(phi),
                        np.cos(theta)])

    def run_generation(self, n_source):
        """
        Run one generation of n_source neutrons.
        Returns: (k_eff, n_fissions, n_captures, n_escapes, fission_positions)
        """
        n_fissions = 0
        n_captures = 0
        n_escapes = 0
        neutrons_produced = 0
        fission_positions = []

        for _ in range(n_source):
            pos = self._random_position_in_sphere()
            direction = self._random_direction()
            alive = True
            scatters = 0

            while alive:
                # Sample distance to next interaction
                dist = -self.mfp * np.log(np.random.random())
                pos = pos + dist * direction

                # Check boundary
                if np.linalg.norm(pos) > self.radius:
                    n_escapes += 1
                    alive = False
                    continue

                # Determine interaction
                xi = np.random.random() * self.Sigma_t
                if xi < self.Sigma_f:
                    n_fissions += 1
                    n_new = int(self.nu) + (1 if np.random.random() < self.nu % 1 else 0)
                    neutrons_produced += n_new
                    fission_positions.append(pos.copy())
                    alive = False
                elif xi < self.Sigma_f + self.Sigma_c:
                    n_captures += 1
                    alive = False
                else:
                    scatters += 1
                    direction = self._random_direction()
                    if scatters > 200:
                        alive = False

        k_eff = neutrons_produced / n_source if n_source > 0 else 0
        return k_eff, n_fissions, n_captures, n_escapes, fission_positions

    def run_simulation(self, n_neutrons=3000, n_generations=15):
        """Run multiple generations and track k-effective convergence."""
        k_values = []
        total_fissions = 0

        for gen in range(n_generations):
            k, fiss, capt, esc, _ = self.run_generation(n_neutrons)
            k_values.append(k)
            total_fissions += fiss

        return np.array(k_values), total_fissions

# U-235 metal properties
N_A = 6.022e23
rho = 19.1
n_density = rho * N_A / 235

# Run for different radii
print("=== Neutron Multiplication Engine ===")
print(f"Material: HEU (93% U-235 metal)")
print(f"Neutrons per generation: 3,000")
print(f"Generations: 15")
print()

print(f"{'Radius (cm)':<14} {'k-eff (mean)':>14} {'k-eff (std)':>13} {'Fission %':>10} {'Escape %':>10}")
print("-" * 63)

for R in [5, 6, 7, 8, 8.5, 9, 10, 12, 15]:
    engine = ChainReactionEngine(
        radius_cm=R,
        material_sigma_f=1.24 * 0.93,  # enrichment-weighted
        material_sigma_c=0.09,
        material_sigma_s=4.57,
        nu=2.43,
        n_density=n_density
    )
    k_vals, total_fiss = engine.run_simulation(n_neutrons=3000, n_generations=15)

    # Skip first 3 generations (burn-in) for statistics
    k_converged = k_vals[3:]
    k_mean = np.mean(k_converged)
    k_std = np.std(k_converged)

    # Estimate fission and escape fractions from last generation
    _, fiss, capt, esc, _ = engine.run_generation(3000)
    total = fiss + capt + esc
    fiss_pct = fiss / total * 100 if total > 0 else 0
    esc_pct = esc / total * 100 if total > 0 else 0

    status = " ← CRITICAL" if abs(k_mean - 1.0) < 0.05 else ""
    print(f"{R:>10.1f} {k_mean:>12.4f} {k_std:>11.4f} {fiss_pct:>8.1f}% {esc_pct:>8.1f}%{status}")

# Generation-by-generation tracking for a supercritical sphere
print("\\\n=== Generation-by-Generation Tracking (R=12 cm) ===")
engine = ChainReactionEngine(12, 1.24*0.93, 0.09, 4.57, 2.43, n_density)
k_vals, _ = engine.run_simulation(n_neutrons=3000, n_generations=15)
print(f"{'Generation':>12} {'k-eff':>10} {'Cumulative avg':>16}")
print("-" * 40)
for i, k in enumerate(k_vals):
    cumavg = np.mean(k_vals[:i+1])
    print(f"{i+1:>12} {k:>10.4f} {cumavg:>14.4f}")`,
      challenge: 'Add a "convergence diagnostic": after each generation, check if the running average of k_eff has changed by less than 0.5% compared to the previous generation. Report which generation the simulation "converged" at. This is how real Monte Carlo codes determine when they\'ve run enough histories — when the answer stops changing.',
      successHint: 'You built a generation-tracking Monte Carlo multiplication engine — the core algorithm of every nuclear criticality code in the world. The k-eigenvalue iteration you implemented (run source neutrons, count progeny, use them as next source) is exactly how MCNP\'s KCODE mode and OpenMC\'s eigenvalue solver work. The key insight: k-effective is a statistical quantity that emerges from tracking thousands of random particle histories.',
    },
    {
      title: 'Critical mass solver — iterating radius until k reaches 1',
      concept: `The **critical mass** is the minimum mass of fissile material needed to sustain a chain reaction (k_eff = 1). Finding it requires solving: **for what radius R does k_eff(R) = 1?**

This is a **root-finding problem**: find the value of R where f(R) = k_eff(R) - 1.0 = 0. We can solve it using **bisection**:

1. Start with R_low (known subcritical) and R_high (known supercritical)
2. Compute R_mid = (R_low + R_high) / 2 and evaluate k_eff(R_mid)
3. If k_eff > 1, set R_high = R_mid; if k_eff < 1, set R_low = R_mid
4. Repeat until |R_high - R_low| < tolerance

The critical mass is then: **M_crit = (4/3) × π × R_crit³ × ρ**

For bare U-235 metal (no reflector), the critical mass is approximately **52 kg** with a critical radius of about **8.5 cm** — a sphere slightly larger than a grapefruit.

📚 *Bisection is the simplest root-finding algorithm. It's guaranteed to converge (unlike Newton's method) but converges slowly — each iteration halves the uncertainty. For Monte Carlo, this slow convergence is acceptable because k_eff itself has statistical noise.*`,
      analogy: 'Finding the critical mass is like finding the exact temperature at which ice melts. You know it\'s below 10°C and above -10°C. Test 0°C — still frozen, so it\'s between 0° and 10°. Test 5°C — liquid, so it\'s between 0° and 5°. Each test halves the range. After 10 tests, you know the melting point to within 0.02°C. Bisection does the same thing for critical radius.',
      storyConnection: 'Determining the critical mass of U-235 and Pu-239 was one of the Manhattan Project\'s most urgent tasks. Robert Serber\'s "Los Alamos Primer" (April 1943) estimated the critical mass from hand calculations. Otto Frisch\'s "Dragon experiments" at Los Alamos confirmed the estimates by briefly assembling near-critical configurations — each time, for a fraction of a second, the apparatus went supercritical, and Frisch measured the neutron burst before quickly separating the pieces.',
      checkQuestion: 'If the bisection search has R_low = 7 cm (k = 0.82) and R_high = 11 cm (k = 1.35), what is the first midpoint and what do you do if k_eff at the midpoint is 1.05?',
      checkAnswer: 'Midpoint: R_mid = (7 + 11) / 2 = 9 cm. Since k_eff = 1.05 > 1, the critical radius is below 9 cm. Set R_high = 9 cm. New interval: [7, 9] cm. Next midpoint: 8 cm. Continue until the interval is smaller than your tolerance.',
      codeIntro: 'Build a critical mass solver using bisection search with the Monte Carlo multiplication engine.',
      code: `import numpy as np

np.random.seed(42)

N_A = 6.022e23

def compute_k_eff(radius_cm, sigma_f, sigma_c, sigma_s, nu,
                  n_density, n_neutrons=2000, n_generations=10):
    """
    Quick Monte Carlo k-effective calculation for a bare sphere.
    Returns mean k_eff over converged generations.
    """
    barn = 1e-24
    Sf = n_density * sigma_f * barn
    Sc = n_density * sigma_c * barn
    Ss = n_density * sigma_s * barn
    St = Sf + Sc + Ss
    mfp = 1.0 / St

    k_values = []

    for gen in range(n_generations):
        produced = 0
        for _ in range(n_neutrons):
            # Random start position in sphere
            r = radius_cm * np.random.random()**(1/3)
            th = np.arccos(2*np.random.random()-1)
            ph = 2*np.pi*np.random.random()
            pos = np.array([r*np.sin(th)*np.cos(ph), r*np.sin(th)*np.sin(ph), r*np.cos(th)])
            d_th = np.arccos(2*np.random.random()-1)
            d_ph = 2*np.pi*np.random.random()
            d = np.array([np.sin(d_th)*np.cos(d_ph), np.sin(d_th)*np.sin(d_ph), np.cos(d_th)])

            alive = True
            sc = 0
            while alive:
                step = -mfp * np.log(np.random.random())
                pos = pos + step * d
                if np.linalg.norm(pos) > radius_cm:
                    alive = False
                    continue
                xi = np.random.random() * St
                if xi < Sf:
                    n_new = int(nu) + (1 if np.random.random() < nu % 1 else 0)
                    produced += n_new
                    alive = False
                elif xi < Sf + Sc:
                    alive = False
                else:
                    sc += 1
                    d_th = np.arccos(2*np.random.random()-1)
                    d_ph = 2*np.pi*np.random.random()
                    d = np.array([np.sin(d_th)*np.cos(d_ph), np.sin(d_th)*np.sin(d_ph), np.cos(d_th)])
                    if sc > 200:
                        alive = False

        k_values.append(produced / n_neutrons)

    # Use last half of generations for estimate
    return np.mean(k_values[n_generations//2:])

def find_critical_radius(sigma_f, sigma_c, sigma_s, nu, density, A_mass,
                         r_low=3.0, r_high=20.0, tol=0.3, max_iter=12):
    """
    Bisection search for critical radius (where k_eff ≈ 1.0).
    """
    n_density = density * N_A / A_mass
    history = []

    for iteration in range(max_iter):
        r_mid = (r_low + r_high) / 2
        k = compute_k_eff(r_mid, sigma_f, sigma_c, sigma_s, nu, n_density,
                         n_neutrons=1500, n_generations=8)
        history.append((iteration+1, r_low, r_high, r_mid, k))

        if abs(r_high - r_low) < tol:
            break

        if k > 1.0:
            r_high = r_mid
        else:
            r_low = r_mid

    return r_mid, k, history

# Find critical mass for three fissile materials
materials = [
    {"name": "U-235 (bare, 93% HEU)",
     "sigma_f": 1.24*0.93, "sigma_c": 0.09, "sigma_s": 4.57,
     "nu": 2.43, "density": 19.1, "A": 235,
     "known_crit_mass_kg": 52},
    {"name": "Pu-239 (bare, 94%)",
     "sigma_f": 1.80*0.94, "sigma_c": 0.27, "sigma_s": 4.39,
     "nu": 2.88, "density": 19.8, "A": 239,
     "known_crit_mass_kg": 10},
    {"name": "U-233 (bare, enriched)",
     "sigma_f": 1.90*0.95, "sigma_c": 0.10, "sigma_s": 4.50,
     "nu": 2.49, "density": 19.1, "A": 233,
     "known_crit_mass_kg": 15},
]

print("=== Critical Mass Solver ===")
print("Method: Monte Carlo k-effective + bisection search")
print()

for mat in materials:
    print(f"--- {mat['name']} ---")
    r_crit, k_final, history = find_critical_radius(
        mat["sigma_f"], mat["sigma_c"], mat["sigma_s"],
        mat["nu"], mat["density"], mat["A"])

    mass_kg = (4/3) * np.pi * r_crit**3 * mat["density"] / 1000

    print(f"{'Iter':>5} {'R_low':>7} {'R_high':>7} {'R_mid':>7} {'k_eff':>8}")
    print("-" * 36)
    for it, rl, rh, rm, k in history:
        marker = " ←" if it == len(history) else ""
        print(f"{it:>5} {rl:>6.2f} {rh:>6.2f} {rm:>6.2f} {k:>7.3f}{marker}")

    print(f"\\\nCritical radius: {r_crit:.1f} cm")
    print(f"Critical mass:   {mass_kg:.1f} kg")
    print(f"Known value:     ~{mat['known_crit_mass_kg']} kg")
    print(f"Sphere diameter: {2*r_crit:.1f} cm ({2*r_crit/2.54:.1f} inches)")
    print()

# Effect of reflector (simplified estimate)
print("=== Effect of Neutron Reflector ===")
print("A 10 cm natural uranium reflector reduces critical mass by ~40%")
for mat in materials:
    bare = mat["known_crit_mass_kg"]
    reflected = bare * 0.6
    print(f"  {mat['name']:<30} Bare: {bare:>4} kg  Reflected: {reflected:>5.0f} kg")`,
      challenge: 'Replace bisection with a more efficient method: after computing k at two points, use linear interpolation to predict where k = 1. This is the "regula falsi" (false position) method — it converges faster than bisection for smooth functions. Compare the number of iterations needed.',
      successHint: 'You just computed critical masses — the numbers that determine whether a nuclear weapon is possible. The fact that the critical mass of Pu-239 is only ~10 kg (a sphere the size of a softball) is what makes nuclear proliferation so dangerous. Understanding how to compute this number is the scientific foundation of nuclear security — and of nuclear energy.',
    },
    {
      title: 'Yield estimator — energy from fission count',
      concept: `Once the chain reaction begins in a supercritical assembly, how much energy is released before the assembly blows apart? This determines the bomb's **yield** — its explosive power measured in kilotons of TNT equivalent.

The calculation connects three quantities:

1. **Number of fissions**: starting from one neutron, the chain reaction grows as k^n per generation. The total fissions = Σ k^i for i = 0 to N_generations.
2. **Energy per fission**: ~200 MeV = 3.2 × 10⁻¹¹ J
3. **Efficiency**: only a fraction of the fissile material actually fissions before the explosion blows the assembly apart. Little Boy (U-235 gun design) had ~1.5% efficiency. Fat Man (Pu-239 implosion) had ~17% efficiency.

**Yield = N_fissions × E_per_fission = efficiency × M_fissile × N_A/A × E_per_fission**

The **disassembly time** — how long it takes the expanding material to become subcritical — limits the number of generations and thus the yield. Faster assembly (implosion) keeps the material together longer, allowing more generations and higher efficiency.

📚 *1 kiloton TNT = 4.184 × 10¹² J. The Hiroshima bomb (Little Boy) yielded 15 kT from 64 kg of U-235. Only ~1 kg actually fissioned — the rest was blown apart before it could react.*`,
      analogy: 'Imagine lighting a firecracker fuse in a room full of firecrackers. The first one sets off nearby ones, which set off more — a chain reaction. But the explosions also blow the remaining firecrackers away from each other. Only the ones that went off before being scattered contribute to the total bang. The "efficiency" is the fraction that exploded before being scattered.',
      storyConnection: 'Estimating the yield was critical for the Manhattan Project. If the efficiency was too low, the bomb wouldn\'t work. Implosion was developed specifically to increase efficiency — by compressing the plutonium to higher density (reducing the critical mass and increasing k), the chain reaction got more generations before disassembly. Fat Man\'s 17% efficiency vs Little Boy\'s 1.5% produced a bigger explosion from less material.',
      checkQuestion: 'If 1 kg of U-235 undergoes complete fission, how much energy is released in kilotons?',
      checkAnswer: '1 kg of U-235 = 1000/235 × 6.022×10²³ = 2.56 × 10²⁴ atoms. At 200 MeV per fission: 2.56×10²⁴ × 200 × 10⁶ × 1.602×10⁻¹⁹ J = 8.2 × 10¹³ J. In kilotons: 8.2×10¹³ / 4.184×10¹² = 19.6 kT. Complete fission of 1 kg of U-235 yields about 18-20 kT — equivalent to 18,000 tonnes of TNT.',
      codeIntro: 'Build a yield estimator that calculates bomb energy output from fission physics and efficiency.',
      code: `import numpy as np

# Physical constants
E_per_fission_MeV = 200
E_per_fission_J = E_per_fission_MeV * 1.602e-13
kt_to_J = 4.184e12
N_A = 6.022e23

class YieldEstimator:
    """Estimate nuclear weapon yield from physics parameters."""

    def __init__(self, fissile_mass_kg, A_mass, density_gcc, k_eff, nu=2.43):
        self.mass = fissile_mass_kg
        self.A = A_mass
        self.density = density_gcc
        self.k_eff = k_eff
        self.nu = nu
        self.n_atoms = fissile_mass_kg * 1000 * N_A / A_mass

    def total_fissions_from_chain(self, n_generations):
        """Total fissions from exponential chain reaction."""
        if self.k_eff <= 1:
            return 0
        # Geometric series: total = sum(k^i) for i=0 to n
        total = (self.k_eff**(n_generations + 1) - 1) / (self.k_eff - 1)
        return min(total, self.n_atoms)  # can't fission more atoms than exist

    def disassembly_generations(self):
        """
        Estimate generations before disassembly halts the reaction.
        Disassembly occurs when expansion reduces density enough
        to make the system subcritical.
        Generation time ~ 10 ns for fast neutrons.
        Disassembly time ~ R / v_expansion.
        """
        R_cm = (3 * self.mass * 1000 / (4 * np.pi * self.density))**(1/3)
        gen_time_ns = 10  # approximate
        # Expansion velocity from internal pressure ~ few km/s
        v_expansion = 3e5  # cm/s
        disassembly_time_ns = R_cm / v_expansion * 1e9
        n_gen = int(disassembly_time_ns / gen_time_ns)
        return max(n_gen, 1)

    def calculate_yield(self, efficiency_override=None):
        """Calculate yield in kilotons."""
        if efficiency_override is not None:
            n_fissions = self.n_atoms * efficiency_override
        else:
            n_gen = self.disassembly_generations()
            n_fissions = self.total_fissions_from_chain(n_gen)

        energy_J = n_fissions * E_per_fission_J
        yield_kt = energy_J / kt_to_J
        efficiency = n_fissions / self.n_atoms
        return yield_kt, efficiency, n_fissions

# Historical weapons analysis
print("=== Nuclear Yield Estimator ===")
print()

weapons = [
    {"name": "Little Boy (Hiroshima)",
     "material": "U-235", "mass_kg": 64, "A": 235, "density": 19.1,
     "k_eff": 1.03, "actual_yield_kt": 15, "actual_eff": 0.015},
    {"name": "Fat Man (Nagasaki)",
     "material": "Pu-239", "mass_kg": 6.2, "A": 239, "density": 40.0,
     "k_eff": 1.25, "actual_yield_kt": 21, "actual_eff": 0.17},
    {"name": "Ivy King (largest US pure fission)",
     "material": "U-235", "mass_kg": 60, "A": 235, "density": 30.0,
     "k_eff": 1.20, "actual_yield_kt": 500, "actual_eff": 0.43},
]

for w in weapons:
    est = YieldEstimator(w["mass_kg"], w["A"], w["density"], w["k_eff"])

    # Physics-based estimate
    yield_kt, eff, n_fiss = est.calculate_yield()
    n_gen = est.disassembly_generations()

    # Using known efficiency
    yield_actual, _, _ = est.calculate_yield(efficiency_override=w["actual_eff"])

    print(f"--- {w['name']} ---")
    print(f"  Material: {w['material']}, Mass: {w['mass_kg']} kg, k_eff: {w['k_eff']}")
    print(f"  Fissile atoms: {est.n_atoms:.2e}")
    print(f"  Est. disassembly generations: {n_gen}")
    print(f"  Model yield: {yield_kt:.1f} kT (efficiency: {eff*100:.1f}%)")
    print(f"  From known efficiency ({w['actual_eff']*100:.1f}%): {yield_actual:.1f} kT")
    print(f"  Actual yield: {w['actual_yield_kt']} kT")
    print()

# Efficiency vs yield relationship
print("=== How Efficiency Affects Yield (64 kg U-235) ===")
print(f"{'Efficiency':>12} {'Fissions':>14} {'Energy (TJ)':>12} {'Yield (kT)':>11} {'Equivalent':>16}")
print("-" * 67)
est = YieldEstimator(64, 235, 19.1, 1.1)
for eff in [0.001, 0.005, 0.01, 0.015, 0.05, 0.10, 0.20, 0.50, 1.00]:
    y, _, n_f = est.calculate_yield(efficiency_override=eff)
    energy_tj = n_f * E_per_fission_J / 1e12
    eq = f"{y:.0f} kT TNT"
    if y > 1000:
        eq = f"{y/1000:.1f} MT TNT"
    print(f"{eff*100:>10.1f}% {n_f:>12.2e} {energy_tj:>10.1f} {y:>9.1f} {eq:>16}")

# Mass of material that actually fissioned
print("\\\n=== Mass That Actually Fissioned ===")
for w in weapons:
    fissioned_kg = w["mass_kg"] * w["actual_eff"]
    energy = fissioned_kg * 1000 * N_A / w["A"] * E_per_fission_J
    print(f"  {w['name']:<30} {fissioned_kg:.2f} kg → {w['actual_yield_kt']} kT")
print()
print("Little Boy: only 960 grams of uranium actually fissioned.")
print("The rest — 63 kg — was blown apart unused.")`,
      challenge: 'The efficiency depends strongly on k_eff. Plot yield vs k_eff for a fixed mass (10 kg Pu-239) with k_eff ranging from 1.01 to 1.50. You\'ll see a dramatic non-linear relationship — small increases in k (from better implosion compression) produce huge increases in yield. This is why implosion design was the Manhattan Project\'s most consequential engineering achievement.',
      successHint: 'You now understand the complete physics chain: binding energy provides the energy per fission, cross-sections determine the chain reaction probability, critical mass sets the minimum material, and efficiency determines how much of that material actually reacts. These four calculations — each building on the last — are the scientific core of nuclear weapons physics.',
    },
    {
      title: 'Documentation with ethics discussion — science and moral responsibility',
      concept: `The Chain Reaction Simulator is complete. The final step is **documentation** — recording what you built, how it works, and what it means. But for this project, documentation must include something beyond technical description: an **ethics discussion**.

Nuclear weapons represent the most extreme case of dual-use science: the same physics that powers nuclear reactors (providing 10% of world electricity) also enables weapons capable of destroying civilisation. The Manhattan Project scientists debated this tension in real time:

- **Niels Bohr** advocated for international control of nuclear technology before the bomb was used
- **Leo Szilard** circulated a petition urging the President not to use the bomb on Japan without warning
- **J. Robert Oppenheimer** initially supported using the bomb, later campaigned against the hydrogen bomb and was stripped of his security clearance
- **Edward Teller** advocated for ever-larger weapons, leading to the thermonuclear bomb

There is no consensus. But there is a responsibility: **scientists who understand the physics have a duty to engage in the policy debate**. Silence is not neutrality — it is abdication.

📚 *The Bulletin of the Atomic Scientists, founded by Manhattan Project veterans in 1945, maintains the "Doomsday Clock" — a symbolic measure of existential risk. As of 2024, it stands at 90 seconds to midnight — the closest it has ever been.*`,
      analogy: 'A chef who invents a new preservative that can also be used as a poison has a responsibility to ensure it\'s used safely. A programmer who builds encryption software that can protect dissidents or hide criminals faces the same dilemma. Nuclear physics is the most extreme version: the same knowledge enables both limitless clean energy and total annihilation.',
      storyConnection: 'The Manhattan Project began as a response to the fear that Nazi Germany would build an atomic bomb first. But Germany surrendered in May 1945, three months before Hiroshima. Many scientists believed the original justification had vanished — yet the project continued. The decision to use the bomb on Hiroshima (August 6, 1945, ~80,000 immediate deaths) and Nagasaki (August 9, 1945, ~40,000 immediate deaths) remains the most debated decision in the history of science and warfare.',
      checkQuestion: 'The Franck Report (June 1945) recommended a demonstration detonation on an uninhabited island instead of using the bomb on a city. What are arguments for and against this approach?',
      checkAnswer: 'For demonstration: avoids civilian casualties, shows the weapon\'s power without mass death, maintains moral authority, allows Japan to surrender with dignity. Against: only two bombs were available — if the demonstration failed or was dismissed, the option to use it would be lost; Japan\'s military might not have surrendered even after a demonstration; prolonging the war would cause more casualties from conventional fighting. Both sides have merit — which is why this remains debated 80 years later.',
      codeIntro: 'Generate the complete project documentation including technical summary and ethics discussion.',
      code: `# Chain Reaction Simulator — Project Documentation

import numpy as np

print("""
================================================================
          CHAIN REACTION SIMULATOR
              Project Documentation
================================================================

1. INTRODUCTION
---------------
This simulator models the nuclear fission chain reaction from
first principles. It was built to understand the physics of the
Manhattan Project — the scientific effort that produced the first
nuclear weapons in 1945.

The simulator answers four questions:
  a) How do neutrons interact with fissile material? (cross-sections)
  b) Does the chain reaction grow or die? (k-effective)
  c) How much material is needed? (critical mass)
  d) How much energy is released? (yield)

2. METHODOLOGY
--------------
The simulator uses four core models:

  a) Nuclear data model:
     - Nucleus class: Z, A, cross-sections, nu, binding energy
     - Material class: density, macroscopic cross-sections, MFP
     - Neutron class: position, direction, energy, fate

  b) Monte Carlo neutron transport:
     - Random walk through fissile sphere
     - Exponential step length sampling (Beer-Lambert law)
     - Interaction type sampling (fission/capture/scatter)
     - Generation-by-generation k-effective tracking

  c) Critical mass solver:
     - Bisection search over sphere radius
     - Convergence criterion: |R_high - R_low| < 0.3 cm
     - Validated against known critical masses

  d) Yield estimator:
     - Geometric series for fission count
     - Disassembly time estimation
     - Efficiency calculation

3. KEY RESULTS
--------------
""")

# Reproduce key results
N_A = 6.022e23
E_per_fission_J = 200 * 1.602e-13
kt_to_J = 4.184e12

results = [
    ("U-235 (bare)",  8.5,  19.1, 235, 52,    "~52 kg"),
    ("Pu-239 (bare)", 6.2,  19.8, 239, 10,    "~10 kg"),
    ("U-235 (reflected)", 6.5, 19.1, 235, 22,  "~22 kg"),
]

print(f"  {'Material':<22} {'R_crit (cm)':>12} {'M_crit (kg)':>12} {'Known':>10}")
for name, r, rho, A, known, known_str in results:
    m = (4/3) * np.pi * r**3 * rho / 1000
    print(f"  {name:<22} {r:>10.1f} {m:>10.1f} {known_str:>10}")

print()
print("  Yield calculations:")
for name, mass, eff, actual in [
    ("Little Boy",  64,  0.015, 15),
    ("Fat Man",     6.2, 0.17,  21),
]:
    n_atoms = mass * 1000 * N_A / 235
    n_fiss = n_atoms * eff
    E = n_fiss * E_per_fission_J
    y_kt = E / kt_to_J
    print(f"    {name}: {mass} kg × {eff*100:.1f}% efficiency = {y_kt:.0f} kT (actual: {actual} kT)")

print("""
4. LIMITATIONS
--------------
  - Monoenergetic neutrons (single-group approximation)
  - Isotropic scattering only (no angular dependence)
  - Bare sphere geometry only (no tamper, no levitated pit)
  - Statistical uncertainty in k-eff (~2-5% with 3000 histories)
  - No time dependence (steady-state k, not transient)
  - Simplified disassembly model (constant expansion velocity)

5. ETHICS DISCUSSION
--------------------
This simulator models the physics of nuclear weapons — devices
that killed approximately 200,000 people in Hiroshima and
Nagasaki and that continue to threaten human civilisation.

Key ethical considerations:

  a) DUAL-USE DILEMMA: Nuclear fission powers both reactors
     (10% of world electricity, zero carbon) and weapons.
     The physics is identical. You cannot learn one without
     understanding the other.

  b) RESPONSIBILITY OF KNOWLEDGE: Scientists who understand
     nuclear physics have a special obligation to engage in
     policy debates about nuclear weapons, energy, and
     proliferation. The Manhattan Project scientists who
     founded the Bulletin of the Atomic Scientists and
     campaigned for arms control exemplified this duty.

  c) THE PROLIFERATION BARRIER: The critical mass calculation
     you performed is NOT the bottleneck for proliferation.
     The physics has been public since 1945. The real barriers
     are: obtaining fissile material (enrichment or plutonium
     production) and engineering a reliable implosion system.
     Arms control focuses on these barriers, not on physics
     knowledge.

  d) HISTORICAL RESPONSIBILITY: The decision to use nuclear
     weapons on Hiroshima and Nagasaki remains one of the
     most debated moral decisions in history. There were
     scientists on both sides — those who advocated for use
     and those who opposed it. Understanding the science
     gives you no special authority on the ethics, but it
     gives you a special responsibility to engage.

  e) PRESENT DANGER: As of 2024, approximately 12,500
     nuclear warheads exist worldwide. Nine nations possess
     them. The Doomsday Clock stands at 90 seconds to
     midnight. The physics you learned in this project is
     directly relevant to the most important policy debates
     of our time.

6. SKILLS DEMONSTRATED
----------------------
""")

skills = [
    ("Object-oriented programming", "Nucleus, Neutron, Material classes"),
    ("Monte Carlo simulation", "Random walk, importance sampling, k-eigenvalue"),
    ("Nuclear physics", "Cross-sections, binding energy, fission chain reaction"),
    ("Numerical methods", "Bisection root-finding, statistical convergence"),
    ("Dimensional analysis", "Deriving scaling laws from physical units"),
    ("Ethics and policy", "Dual-use dilemma, arms control, scientific responsibility"),
]

for skill, detail in skills:
    print(f"  - {skill}: {detail}")

print()
print("  This project demonstrates that understanding nuclear")
print("  weapons physics is not about building weapons — it is")
print("  about understanding the science well enough to make")
print("  informed decisions about nuclear policy, energy, and")
print("  arms control. Ignorance is not safety. Knowledge,")
print("  combined with ethical commitment, is.")
print()
print("=" * 64)`,
      challenge: 'Write a 200-word addendum to the ethics section addressing ONE of these questions: (1) Should nuclear physics education include weapons physics, or does teaching it contribute to proliferation? (2) Was the decision to bomb Hiroshima justified by the alternative of a land invasion? (3) Should countries with nuclear weapons be allowed to prevent other countries from developing them? There are no right answers — but there are well-reasoned and poorly-reasoned ones.',
      successHint: 'You have completed a full engineering project cycle: system design, core engine, solver, estimator, and documentation — applied to one of the most consequential scientific achievements in human history. The technical skills (Monte Carlo, OOP, numerical methods) are universally applicable. The ethical awareness is essential. A scientist who understands the physics but ignores the consequences is incomplete. You are now equipped to engage with nuclear science — and nuclear policy — with both competence and conscience.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Chain Reaction Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Chain Reaction Simulator with ethics discussion.
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
