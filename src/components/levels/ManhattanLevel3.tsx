import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ManhattanLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Monte Carlo neutron transport simulation — tracking particles through matter',
      concept: `When a neutron enters a fissile material, its fate is determined by probability: it might scatter, be absorbed, or cause fission — each with a probability given by the cross-sections. The neutron's path is a **random walk** through the material, with each step length drawn from an exponential distribution based on the mean free path.

**Monte Carlo neutron transport** simulates thousands of individual neutron histories, tracking each one step by step:

1. **Sample step length**: distance to next interaction = -λ × ln(random), where λ is the mean free path
2. **Determine interaction type**: fission, capture, or scatter (weighted by cross-sections)
3. **If fission**: the neutron is absorbed, and 2-3 new neutrons are born
4. **If scatter**: the neutron changes direction and energy, continues walking
5. **If capture**: the neutron disappears (absorbed without fission)
6. **If escape**: the neutron leaves the material boundary

The ratio of neutrons produced to neutrons lost (per generation) is the **multiplication factor k**. If k > 1, the chain reaction grows exponentially. If k < 1, it dies out.

📚 *Stanislaw Ulam and John von Neumann developed Monte Carlo methods at Los Alamos specifically for this problem — tracking neutrons through weapons-grade material. It was one of the first applications of electronic computers.*`,
      analogy: 'Imagine releasing a ball into a pinball machine. It bounces off bumpers (scatter), sometimes falls into holes (capture), and sometimes hits a special bumper that releases two more balls (fission). If each ball produces more than one new ball on average before escaping or being captured, the number of balls grows exponentially — that\'s a chain reaction.',
      storyConnection: 'The Manhattan Project scientists couldn\'t solve the neutron transport equations analytically — the geometry was too complex and the physics too random. Ulam\'s insight was to use the ENIAC computer to simulate individual neutron paths, letting the statistics of thousands of random walks reveal the answer. This was revolutionary: instead of solving equations, they ran experiments inside a computer.',
      checkQuestion: 'If you simulate 10,000 neutron histories in a sphere of U-235 and find that 12,500 new neutrons are produced from fission while 10,000 were started, what is k?',
      checkAnswer: 'k = neutrons produced / neutrons started = 12,500 / 10,000 = 1.25. Since k > 1, this sphere is supercritical — the chain reaction will grow exponentially, with each generation having 25% more neutrons than the last. The doubling time depends on the neutron generation time (~10 nanoseconds for fast neutrons).',
      codeIntro: 'Build a Monte Carlo neutron transport simulation for a sphere of fissile material.',
      code: `import numpy as np

np.random.seed(42)

class NeutronTransport:
    """
    Monte Carlo neutron transport in a sphere of fissile material.
    Simplified: 1D spherical geometry, monoenergetic neutrons.
    """
    def __init__(self, radius_cm, sigma_f, sigma_c, sigma_s, nu, n_density):
        """
        radius_cm: sphere radius
        sigma_f: fission cross-section (barns)
        sigma_c: capture cross-section (barns)
        sigma_s: scatter cross-section (barns)
        nu: average neutrons per fission
        n_density: number density (atoms/cm^3)
        """
        self.radius = radius_cm
        barn = 1e-24
        self.Sigma_f = n_density * sigma_f * barn  # macroscopic cross-sections
        self.Sigma_c = n_density * sigma_c * barn
        self.Sigma_s = n_density * sigma_s * barn
        self.Sigma_t = self.Sigma_f + self.Sigma_c + self.Sigma_s
        self.nu = nu
        self.mfp = 1.0 / self.Sigma_t

    def simulate(self, n_histories=5000):
        """Run Monte Carlo simulation. Returns k-effective."""
        neutrons_produced = 0
        fissions = 0
        captures = 0
        escapes = 0
        scatters_total = 0

        for _ in range(n_histories):
            # Start neutron at random position within sphere
            r = self.radius * np.random.random()**(1/3)
            # Random direction (isotropic)
            theta = np.arccos(2 * np.random.random() - 1)
            phi = 2 * np.pi * np.random.random()
            # Unit direction vector
            ux = np.sin(theta) * np.cos(phi)
            uy = np.sin(theta) * np.sin(phi)
            uz = np.cos(theta)

            pos = np.array([r * np.sin(theta) * np.cos(phi),
                           r * np.sin(theta) * np.sin(phi),
                           r * np.cos(theta)])

            alive = True
            n_scatters = 0

            while alive:
                # Sample distance to next interaction
                dist = -self.mfp * np.log(np.random.random())

                # Move neutron
                pos = pos + dist * np.array([ux, uy, uz])
                r_new = np.linalg.norm(pos)

                # Check if escaped
                if r_new > self.radius:
                    escapes += 1
                    alive = False
                    continue

                # Determine interaction type
                xi = np.random.random() * self.Sigma_t
                if xi < self.Sigma_f:
                    # Fission
                    fissions += 1
                    n_new = int(self.nu) + (1 if np.random.random() < self.nu % 1 else 0)
                    neutrons_produced += n_new
                    alive = False
                elif xi < self.Sigma_f + self.Sigma_c:
                    # Capture
                    captures += 1
                    alive = False
                else:
                    # Scatter — isotropic new direction
                    n_scatters += 1
                    scatters_total += 1
                    theta = np.arccos(2 * np.random.random() - 1)
                    phi = 2 * np.pi * np.random.random()
                    ux = np.sin(theta) * np.cos(phi)
                    uy = np.sin(theta) * np.sin(phi)
                    uz = np.cos(theta)

                    if n_scatters > 500:
                        alive = False  # prevent infinite loops

        k_eff = neutrons_produced / n_histories
        return k_eff, fissions, captures, escapes, scatters_total

# U-235 metal properties
N_A = 6.022e23
rho = 19.1  # g/cm^3
A_mass = 235
n_density = rho * N_A / A_mass

print("=== Monte Carlo Neutron Transport ===")
print(f"Material: U-235 metal (density {rho} g/cm³)")
print(f"Number density: {n_density:.3e} atoms/cm³")
print(f"Mean free path: {1/(n_density * (1.24+99+10)*1e-24):.2f} cm (fast neutrons)")
print()

# Scan different sphere radii
print(f"{'Radius (cm)':<14} {'k-eff':>8} {'Fissions':>10} {'Captures':>10} {'Escapes':>10} {'Status':>14}")
print("-" * 68)

for R in [3, 5, 7, 8, 9, 10, 12, 15]:
    sim = NeutronTransport(
        radius_cm=R,
        sigma_f=1.24,    # fast fission cross-section (barns)
        sigma_c=0.09,    # fast capture
        sigma_s=4.57,    # fast elastic scatter
        nu=2.43,         # neutrons per fission
        n_density=n_density
    )
    k, f, c, e, s = sim.simulate(n_histories=2000)
    status = "SUPERCRITICAL" if k > 1.0 else "SUBCRITICAL" if k < 0.95 else "NEAR CRITICAL"
    print(f"{R:>10.0f} {k:>8.3f} {f:>10} {c:>10} {e:>10} {status:>14}")

print()
print("k > 1 means chain reaction grows (supercritical)")
print("k < 1 means chain reaction dies (subcritical)")
print("k = 1 is exactly critical — steady state")`,
      challenge: 'Add a neutron reflector — a 5 cm shell of natural uranium around the fissile sphere. Reflected neutrons that would have escaped get a second chance to cause fission. How much does the reflector reduce the critical radius? (Historically, the reflector reduced the critical mass of the Fat Man bomb by about 40%.)',
      successHint: 'You just built a Monte Carlo neutron transport code — the same class of simulation that runs on supercomputers at Los Alamos, Oak Ridge, and every nuclear laboratory in the world. The modern descendants of this code (MCNP, Serpent, OpenMC) use the same algorithm you implemented: sample step length, determine interaction, track particles.',
    },
    {
      title: 'Reactor criticality control — delayed neutrons and control rods',
      concept: `A nuclear reactor maintains a steady chain reaction at exactly **k = 1** (critical). But how do you control a process where neutron generations are only ~10 nanoseconds apart? If k = 1.001, the power doubles in milliseconds — far too fast for any mechanical control system.

The answer is **delayed neutrons**. About 0.65% of fission neutrons are not emitted instantly — they come from the radioactive decay of fission products, seconds to minutes later. These delayed neutrons have an average lifetime of ~13 seconds.

When the reactor operates in the range 1 < k < 1 + β (where β = 0.0065 is the delayed neutron fraction), the chain reaction grows on the timescale of delayed neutrons (seconds) rather than prompt neutrons (nanoseconds). This regime is called **delayed critical** — and it's the only regime where human control is possible.

If k exceeds 1 + β (prompt critical), the chain reaction grows on the prompt neutron timescale — an uncontrollable exponential that leads to a power excursion or meltdown.

📚 *Control rods contain neutron-absorbing materials (boron, cadmium, hafnium) that capture neutrons without fission. Inserting rods reduces k; withdrawing them increases k. The operator adjusts rod positions to maintain k = 1.*`,
      analogy: 'Imagine a bathtub with the tap running and the drain open. If the inflow slightly exceeds the drain, the water level rises slowly — you can adjust the tap easily. This is delayed critical. Now imagine the inflow is a fire hose: the tub fills in seconds and overflows before you can react. That\'s prompt critical. Delayed neutrons are like having a slow-filling tap instead of a fire hose — they give you time to adjust.',
      storyConnection: 'Enrico Fermi achieved the first sustained nuclear chain reaction on December 2, 1942, under the bleachers at the University of Chicago. He controlled the reaction by slowly withdrawing cadmium control rods, monitoring the neutron count rate. The delayed neutron fraction gave him the seconds he needed between rod adjustments. Without delayed neutrons, controlling a reactor would be impossible — the chain reaction would go from critical to explosive faster than any human could react.',
      checkQuestion: 'If a reactor has k = 1.003 and the delayed neutron fraction is β = 0.0065, is the reactor delayed critical or prompt critical?',
      checkAnswer: 'Delayed critical. Since k < 1 + β (1.003 < 1.0065), the excess reactivity is less than the delayed neutron fraction. The power will rise on a timescale of seconds (controlled by delayed neutrons), not nanoseconds. The operator can insert control rods to bring k back to 1.000.',
      codeIntro: 'Simulate reactor power dynamics with delayed neutrons and control rod adjustments.',
      code: `import numpy as np

def reactor_kinetics(k_eff, beta=0.0065, lambda_d=0.08, dt=0.01,
                     t_max=30.0, prompt_lifetime=1e-4):
    """
    Point kinetics model with one delayed neutron group.

    k_eff: multiplication factor
    beta: delayed neutron fraction (0.0065 for U-235)
    lambda_d: delayed neutron decay constant (1/s)
    dt: time step (seconds)
    prompt_lifetime: mean prompt neutron lifetime (seconds)
    """
    rho = (k_eff - 1) / k_eff  # reactivity

    # Initial conditions
    n = 1.0       # normalised neutron population
    C = beta * n / (lambda_d * prompt_lifetime)  # delayed precursor concentration

    times = np.arange(0, t_max, dt)
    power = np.zeros(len(times))
    power[0] = n

    for i in range(1, len(times)):
        # Point kinetics equations
        dn = ((rho - beta) / prompt_lifetime) * n + lambda_d * C
        dC = (beta / prompt_lifetime) * n - lambda_d * C

        n += dn * dt
        C += dC * dt
        n = max(n, 0)
        C = max(C, 0)
        power[i] = n

    return times, power

# Compare delayed critical vs prompt critical
print("=== Reactor Kinetics — Delayed vs Prompt Critical ===")
print()

beta = 0.0065
scenarios = [
    ("Subcritical (k=0.995)",       0.995),
    ("Exactly critical (k=1.000)",  1.000),
    ("Delayed critical (k=1.002)",  1.002),
    ("Delayed critical (k=1.005)",  1.005),
    ("At prompt critical (k=1.0065)", 1.0 + beta),
    ("Prompt supercritical (k=1.01)", 1.01),
]

for name, k in scenarios:
    rho = (k - 1) / k
    times, power = reactor_kinetics(k, t_max=10.0)

    # Find power at key times
    p_1s = power[min(100, len(power)-1)]   # at 1 second
    p_5s = power[min(500, len(power)-1)]   # at 5 seconds
    p_10s = power[-1]                       # at 10 seconds

    regime = "PROMPT CRITICAL" if k > 1 + beta else "DELAYED CRITICAL" if k > 1 else "SUBCRITICAL" if k < 1 else "CRITICAL"
    print(f"{name}:")
    print(f"  Reactivity ρ = {rho*100:.4f}%  |  Regime: {regime}")
    print(f"  Power at 1s: {p_1s:.3f}  |  5s: {p_5s:.3f}  |  10s: {p_10s:.3f}")
    if p_10s > 100:
        print(f"  WARNING: Power increased {p_10s:.0f}× in 10 seconds!")
    print()

# Control rod insertion scenario
print("=== Control Rod Insertion Scenario ===")
print("Reactor at k=1.003, operator inserts rods at t=5s to bring k=0.998")
print()

dt = 0.01
t_max = 20.0
times = np.arange(0, t_max, dt)
n = 1.0
C = beta * n / (0.08 * 1e-4)
power_scenario = []

for i, t in enumerate(times):
    # Control rod insertion at t=5s
    k = 1.003 if t < 5.0 else 0.998
    rho = (k - 1) / k

    dn = ((rho - beta) / 1e-4) * n + 0.08 * C
    dC = (beta / 1e-4) * n - 0.08 * C
    n += dn * dt
    C += dC * dt
    n = max(n, 0)
    C = max(C, 0)
    power_scenario.append(n)

# Report key moments
checkpoints = [0, 2, 4, 5, 6, 8, 10, 15, 20]
print(f"{'Time (s)':<10} {'Power':>10} {'Status':>20}")
print("-" * 42)
for t in checkpoints:
    idx = min(int(t / dt), len(power_scenario) - 1)
    p = power_scenario[idx]
    status = "Rods OUT, k=1.003" if t < 5 else "Rods IN, k=0.998"
    print(f"{t:<10} {p:>10.4f} {status:>20}")

print()
print("Note: Power doesn't drop instantly after rod insertion.")
print("Delayed neutron precursors continue producing neutrons for")
print("several seconds — the 'delayed neutron tail'.")`,
      challenge: 'Simulate a SCRAM (emergency shutdown): all control rods drop at once, reducing k from 1.003 to 0.95. How quickly does power fall to 1% of its initial value? Why does it take longer than you might expect? (Answer: delayed neutrons sustain a residual power level even after the prompt chain reaction stops.)',
      successHint: 'You just simulated the point kinetics equations that govern every nuclear reactor in the world. The interplay between prompt and delayed neutrons is what makes nuclear power controllable — and what makes prompt criticality so dangerous. Understanding this dynamic is the foundation of nuclear reactor safety.',
    },
    {
      title: 'Taylor-Sedov blast wave solution — how a nuclear fireball expands',
      concept: `When a nuclear bomb detonates, it releases an enormous amount of energy in a tiny volume in a fraction of a microsecond. This creates a **blast wave** — a spherical shock front that expands outward, compressing and heating the air.

G.I. Taylor and Leonid Sedov independently derived an elegant analytical solution for how the blast wave radius grows with time:

**R(t) = C × (E/ρ₀)^(1/5) × t^(2/5)**

where E is the total energy released, ρ₀ is the ambient air density, t is time after detonation, and C ≈ 1.033 is a dimensionless constant.

This is a **self-similar** solution: the blast wave at any time looks like a scaled-up version of itself at any earlier time. The radius grows as t^(2/5) — initially very fast, then decelerating as the shock wave weakens.

Taylor famously used declassified photographs of the Trinity test (which showed the fireball radius at known times) to estimate the bomb's yield — a calculation that confirmed the classified value within 10%.

📚 *Dimensional analysis is the key: the only combination of E, ρ₀, and t that gives a length is (E/ρ₀)^(1/5) × t^(2/5). This single insight, without solving any differential equations, gives the scaling law.*`,
      analogy: 'Drop a stone in a pond. The ripple radius grows with time — fast at first, then slowing. A nuclear blast wave is a 3D version of this, but in air instead of water, and driven by an instantaneous energy release instead of a dropped stone. The t^(2/5) law tells you exactly how far the shock front has traveled at any time.',
      storyConnection: 'G.I. Taylor derived this solution during World War II for the British government. When the US published photographs of the Trinity test in 1947 (showing the fireball at measured times), Taylor used his formula to calculate the yield: approximately 20 kilotons. The US government was furious — Taylor had deduced classified information from publicly available photographs using nothing but physics.',
      checkQuestion: 'Using R = C × (E/ρ₀)^(1/5) × t^(2/5) with C = 1.033, E = 8.4×10¹³ J (20 kT), and ρ₀ = 1.225 kg/m³, what is the blast radius at t = 0.001 seconds?',
      checkAnswer: 'R = 1.033 × (8.4e13/1.225)^(1/5) × (0.001)^(2/5) = 1.033 × (6.857e13)^0.2 × 0.001^0.4 = 1.033 × 894.5 × 0.01585 = 14.6 m. In one millisecond, the fireball is already 30 metres across — expanding at many times the speed of sound.',
      codeIntro: 'Implement the Taylor-Sedov blast wave solution and estimate bomb yield from fireball photographs.',
      code: `import numpy as np

# Constants
C_taylor = 1.033    # dimensionless Taylor-Sedov constant (gamma=1.4)
rho_air = 1.225     # kg/m^3 (sea level)
kt_to_joules = 4.184e12  # 1 kiloton TNT = 4.184e12 J

def blast_radius(E_joules, t_seconds, rho=rho_air):
    """Taylor-Sedov blast wave radius."""
    return C_taylor * (E_joules / rho)**(1/5) * t_seconds**(2/5)

def blast_velocity(E_joules, t_seconds, rho=rho_air):
    """Shock front velocity = dR/dt = (2/5) × R/t."""
    R = blast_radius(E_joules, t_seconds, rho)
    return 0.4 * R / t_seconds

def estimate_yield(radius_m, time_s, rho=rho_air):
    """Estimate yield from observed radius and time."""
    return rho * (radius_m / (C_taylor * time_s**(2/5)))**5

# Trinity test — 20 kilotons
E_trinity = 20 * kt_to_joules
print("=== Taylor-Sedov Blast Wave — Trinity Test (20 kT) ===")
print(f"Energy: {E_trinity:.3e} J")
print(f"Air density: {rho_air} kg/m³")
print()

print(f"{'Time':>12} {'Radius (m)':>12} {'Velocity (m/s)':>16} {'Mach number':>12} {'Temp (K)*':>10}")
print("-" * 64)

# Track blast wave from microseconds to seconds
times = [1e-6, 1e-5, 1e-4, 1e-3, 0.01, 0.025, 0.05, 0.1, 0.5, 1.0, 5.0]
speed_of_sound = 343  # m/s

for t in times:
    R = blast_radius(E_trinity, t)
    V = blast_velocity(E_trinity, t)
    mach = V / speed_of_sound
    # Rankine-Hugoniot: temperature behind strong shock
    # T_behind ~ T_ambient × (2×gamma×M² - (gamma-1)) × ((gamma-1)×M² + 2) / ((gamma+1)²×M²)
    gamma = 1.4
    if mach > 1:
        T_ratio = (2*gamma*mach**2 - (gamma-1)) * ((gamma-1)*mach**2 + 2) / ((gamma+1)**2 * mach**2)
        T_behind = 288 * T_ratio
    else:
        T_behind = 288
    t_str = f"{t*1e6:.0f} μs" if t < 1e-3 else f"{t*1e3:.1f} ms" if t < 1 else f"{t:.1f} s"
    print(f"{t_str:>12} {R:>10.1f} {V:>14.0f} {mach:>10.1f} {min(T_behind, 1e8):>10.0f}")

# Taylor's yield estimation from Trinity photographs
print("\\n=== Yield Estimation from Photographs ===")
print("(Simulating Taylor's analysis of declassified Trinity photos)")
print()

# Actual Trinity measurements (approximate)
observations = [
    (0.0001, 11.1),
    (0.0004, 19.9),
    (0.0010, 25.4),
    (0.0040, 42.0),
    (0.0100, 59.0),
    (0.0250, 80.0),
    (0.0620, 108.0),
]

print(f"{'Time (ms)':>10} {'R observed (m)':>16} {'Yield estimate (kT)':>20}")
print("-" * 48)

yields = []
for t, R_obs in observations:
    Y = estimate_yield(R_obs, t) / kt_to_joules
    yields.append(Y)
    print(f"{t*1000:>8.1f} {R_obs:>14.1f} {Y:>18.1f}")

mean_yield = np.mean(yields)
std_yield = np.std(yields)
print(f"\\nEstimated yield: {mean_yield:.1f} ± {std_yield:.1f} kT")
print(f"Actual yield:    ~20 kT")
print(f"Taylor's method accuracy: {abs(mean_yield - 20)/20*100:.0f}% error")

# Scaling to other yields
print("\\n=== Blast Radius at 1 Second for Different Yields ===")
for yield_kt in [0.001, 0.1, 1, 10, 20, 100, 1000, 50000]:
    E = yield_kt * kt_to_joules
    R = blast_radius(E, 1.0)
    name = "Davy Crockett" if yield_kt < 0.01 else "Hiroshima" if yield_kt == 20 else "Tsar Bomba" if yield_kt == 50000 else ""
    print(f"  {yield_kt:>8.3f} kT: R(1s) = {R:>8.1f} m  {name}")`,
      challenge: 'The Taylor-Sedov solution breaks down when the shock velocity drops to the speed of sound (Mach 1). At what radius does this happen for a 20 kT blast? This is the transition from a "strong shock" to a "weak shock" — beyond this distance, the blast wave becomes an ordinary sound wave and the Taylor-Sedov model no longer applies.',
      successHint: 'The Taylor-Sedov solution is one of the most celebrated results in fluid dynamics — an exact analytical solution derived from dimensional analysis and self-similarity. Taylor\'s ability to estimate a classified nuclear yield from public photographs is a legendary example of what physics can accomplish with minimal data but deep understanding.',
    },
    {
      title: 'Nuclear waste decay chains — half-life calculations and long-term hazard',
      concept: `Nuclear fission produces hundreds of radioactive isotopes. Each decays at its own rate, characterized by its **half-life** (t₁/₂) — the time for half the atoms to decay. The decay follows:

**N(t) = N₀ × 2^(-t/t₁/₂) = N₀ × e^(-λt)**

where λ = ln(2)/t₁/₂ is the decay constant.

Many fission products decay through **chains**: parent → daughter → granddaughter, each with its own half-life. The activity of daughter isotopes depends on both their own decay rate and the rate at which they're produced by the parent. This is described by the **Bateman equations**.

For a simple two-step chain A → B → C (stable):
**N_B(t) = N_A0 × λ_A/(λ_B - λ_A) × [e^(-λ_At) - e^(-λ_Bt)]**

The activity (decays per second) is: **A = λ × N** (measured in becquerels, 1 Bq = 1 decay/s).

📚 *The total radioactivity of spent nuclear fuel decreases rapidly at first (short-lived isotopes decay quickly) but then plateaus at a level sustained by long-lived isotopes like Cs-137 (t₁/₂ = 30 years) and I-129 (t₁/₂ = 15.7 million years). This is why nuclear waste remains hazardous for thousands of years.*`,
      analogy: 'Imagine a series of water tanks connected by pipes of different widths. Water flows from tank A to tank B to tank C. If the pipe from A to B is narrow (long half-life), tank B fills slowly. If the pipe from B to C is wide (short half-life), tank B drains fast and never holds much water. The "activity" of each tank is its flow rate — how fast water is passing through. The Bateman equations calculate this for every tank in the chain.',
      storyConnection: 'The Manhattan Project created the world\'s first significant quantities of nuclear waste — at Hanford, Oak Ridge, and Los Alamos. The scientists understood individual decay rates but dramatically underestimated the long-term waste problem. Today, 80 years later, Hanford\'s waste tanks still leak radioactive cesium and strontium into the soil — isotopes with 30-year half-lives that will remain dangerous for centuries.',
      checkQuestion: 'Cs-137 has a half-life of 30.17 years. If a waste canister initially contains 10¹⁵ atoms of Cs-137, how many remain after 100 years?',
      checkAnswer: 'N = 10¹⁵ × 2^(-100/30.17) = 10¹⁵ × 2^(-3.315) = 10¹⁵ × 0.1004 = 1.004 × 10¹⁴ atoms. About 10% remains — still highly radioactive. After 300 years (~10 half-lives): 10¹⁵ × 2^(-10) ≈ 10¹² atoms — reduced by a factor of 1,000 but still significant.',
      codeIntro: 'Model radioactive decay chains, calculate activity over time, and assess long-term waste hazard.',
      code: `import numpy as np

# Key fission products and their half-lives
isotopes = {
    "I-131":   {"half_life_years": 0.022,    "yield_pct": 2.9,  "category": "short"},
    "Sr-90":   {"half_life_years": 28.8,     "yield_pct": 5.7,  "category": "medium"},
    "Cs-137":  {"half_life_years": 30.17,    "yield_pct": 6.1,  "category": "medium"},
    "Kr-85":   {"half_life_years": 10.76,    "yield_pct": 0.3,  "category": "medium"},
    "Tc-99":   {"half_life_years": 211000,   "yield_pct": 6.1,  "category": "long"},
    "I-129":   {"half_life_years": 15700000, "yield_pct": 0.7,  "category": "long"},
    "Pu-239":  {"half_life_years": 24100,    "yield_pct": 0,    "category": "actinide"},
    "Am-241":  {"half_life_years": 432,      "yield_pct": 0,    "category": "actinide"},
}

def decay_constant(half_life_years):
    return np.log(2) / half_life_years

def remaining_fraction(t_years, half_life_years):
    return 2**(-t_years / half_life_years)

def activity_bq(n_atoms, half_life_years):
    """Activity in becquerels (decays per second)."""
    lambda_s = np.log(2) / (half_life_years * 365.25 * 24 * 3600)
    return n_atoms * lambda_s

# Assume 1 kg of spent fuel, approximately 3% fission products
N_A = 6.022e23
total_fission_atoms = 0.03 * 1000 * N_A / 235  # ~3% of 1 kg U-235 fissioned

print("=== Fission Product Inventory (per kg spent fuel) ===")
print(f"{'Isotope':<10} {'Half-life':>14} {'Initial atoms':>14} {'Activity (GBq)':>15}")
print("-" * 55)

initial_atoms = {}
for name, props in isotopes.items():
    if props["yield_pct"] > 0:
        n0 = total_fission_atoms * props["yield_pct"] / 100
        initial_atoms[name] = n0
        act = activity_bq(n0, props["half_life_years"]) / 1e9  # GBq
        hl = props["half_life_years"]
        hl_str = f"{hl:.3f} yr" if hl < 1 else f"{hl:.1f} yr" if hl < 1000 else f"{hl:.0f} yr"
        print(f"{name:<10} {hl_str:>14} {n0:>12.2e} {act:>13.1f}")

# Decay over time — total activity
print("\\n=== Total Activity Over Time ===")
time_points = [0.01, 0.1, 1, 10, 30, 100, 300, 1000, 10000, 100000, 1000000]
print(f"{'Time':>12} {'Total (GBq)':>12} {'Dominant isotope':>20} {'Fraction of initial':>20}")
print("-" * 66)

initial_total = 0
for name, props in isotopes.items():
    if name in initial_atoms:
        initial_total += activity_bq(initial_atoms[name], props["half_life_years"])

for t in time_points:
    total_act = 0
    max_act = 0
    dominant = ""
    for name, props in isotopes.items():
        if name not in initial_atoms:
            continue
        remaining = initial_atoms[name] * remaining_fraction(t, props["half_life_years"])
        act = activity_bq(remaining, props["half_life_years"])
        total_act += act
        if act > max_act:
            max_act = act
            dominant = name

    total_gbq = total_act / 1e9
    fraction = total_act / initial_total if initial_total > 0 else 0
    t_str = f"{t:.2f} yr" if t < 1 else f"{t:.0f} yr" if t < 1e6 else f"{t/1e6:.0f} Myr"
    print(f"{t_str:>12} {total_gbq:>10.1f} {dominant:>20} {fraction:>18.6f}")

# Bateman equation: Sr-90 -> Y-90 -> Zr-90 (stable)
print("\\n=== Decay Chain: Sr-90 → Y-90 → Zr-90 (stable) ===")
t_half_Sr = 28.8    # years
t_half_Y  = 0.00731  # years (2.67 days)
lam_Sr = decay_constant(t_half_Sr)
lam_Y  = decay_constant(t_half_Y)
N_Sr0 = initial_atoms.get("Sr-90", 1e20)

print(f"{'Time (yr)':>10} {'Sr-90':>12} {'Y-90':>12} {'Zr-90 (stable)':>16}")
print("-" * 52)
for t in [0, 0.1, 1, 10, 30, 100, 300]:
    N_Sr = N_Sr0 * np.exp(-lam_Sr * t)
    N_Y = N_Sr0 * lam_Sr / (lam_Y - lam_Sr) * (np.exp(-lam_Sr * t) - np.exp(-lam_Y * t))
    N_Zr = N_Sr0 - N_Sr - N_Y
    print(f"{t:>10.1f} {N_Sr/N_Sr0:>10.4f} {N_Y/N_Sr0:>10.6f} {N_Zr/N_Sr0:>14.4f}")`,
      challenge: 'How long must nuclear waste be stored before its activity drops below the activity of the original uranium ore it came from? This "crossover time" is the theoretical minimum storage period. Calculate it for a 1 GW reactor producing 200 kg of fission products per year. (Answer: approximately 300,000 years — which is why geological disposal in stable rock formations is the only viable long-term solution.)',
      successHint: 'Radioactive decay chains are the foundation of nuclear waste management — one of the most important and difficult engineering challenges of the 21st century. The mathematics you applied (exponential decay, Bateman equations, activity calculations) is used by every nuclear engineer designing waste storage facilities. The timescales involved — thousands to millions of years — demand engineering solutions unlike anything else in human experience.',
    },
    {
      title: 'Arms race game theory — Nash equilibrium and nuclear strategy',
      concept: `The Cold War nuclear arms race is one of history's most consequential examples of **game theory** — the mathematical study of strategic decision-making between competing actors.

Consider two nations, each choosing between "arm" (build nuclear weapons) and "disarm." This is a **Prisoner's Dilemma**:

|          | B: Arm    | B: Disarm |
|----------|-----------|-----------|
| A: Arm   | (-5, -5)  | (10, -10) |
| A: Disarm| (-10, 10) | (5, 5)    |

The **Nash equilibrium** is (Arm, Arm): neither player can improve their outcome by unilaterally changing strategy. Even though both nations would be better off disarming (5, 5), the rational choice for each individual nation is to arm — because disarming while the other arms is the worst possible outcome (-10).

This is the **tragedy of rational self-interest**: individually rational decisions lead to collectively irrational outcomes. The arms race produced 70,000 nuclear warheads — enough to destroy civilization multiple times over.

📚 *A Nash equilibrium is a set of strategies where no player can benefit by changing their strategy while the other players keep theirs unchanged. It's not necessarily the best outcome — just the stable one.*`,
      analogy: 'Imagine two shops on the same street, each deciding whether to stay open late. If both close early, they share customers equally (both happy). If one stays open while the other closes, the open shop takes all the customers. So both stay open late — exhausted and spending more on electricity, but neither can afford to close while the other stays open. This is a Nash equilibrium: stable, but not optimal.',
      storyConnection: 'The Manhattan Project didn\'t just build a bomb — it launched the nuclear arms race. The US monopoly lasted only four years before the Soviet Union tested its own bomb in 1949. Each side then built thousands of warheads, driven by the game theory dynamic: "If we don\'t build more, they\'ll have the advantage." The result was Mutually Assured Destruction (MAD) — a Nash equilibrium where the "rational" strategy was to maintain arsenals capable of destroying civilization.',
      checkQuestion: 'In the Prisoner\'s Dilemma payoff matrix above, why is (Arm, Arm) the Nash equilibrium even though (Disarm, Disarm) gives both players a better outcome?',
      checkAnswer: 'Because each player looks at the other\'s strategy and asks: "Can I do better by switching?" If B is arming, A gets -5 by arming and -10 by disarming — arming is better. If B is disarming, A gets 10 by arming and 5 by disarming — arming is STILL better. Arming is a "dominant strategy" for both players, so they both arm, even though mutual disarmament is better for both.',
      codeIntro: 'Model the nuclear arms race as a game theory problem and explore strategies for escaping the Prisoner\'s Dilemma.',
      code: `import numpy as np

np.random.seed(42)

def prisoners_dilemma_payoff(a_arms, b_arms):
    """
    Payoff matrix for nuclear arms race.
    Returns (payoff_A, payoff_B).
    Arms = True, Disarm = False.
    """
    if a_arms and b_arms:
        return (-5, -5)      # both spend heavily, both vulnerable
    elif a_arms and not b_arms:
        return (10, -10)     # A dominates, B is defenseless
    elif not a_arms and b_arms:
        return (-10, 10)     # B dominates, A is defenseless
    else:
        return (5, 5)        # mutual cooperation — best collective outcome

# Find Nash equilibrium
print("=== Nuclear Arms Race — Payoff Matrix ===")
print()
print("              B: ARM    B: DISARM")
print(f"  A: ARM    ({-5:>3},{-5:>3})   ({10:>3},{-10:>3})")
print(f"  A: DISARM ({-10:>3},{10:>3})   ({5:>3},{5:>3})")
print()

# Check Nash equilibrium conditions
strategies = [(True, "ARM"), (False, "DISARM")]
print("=== Nash Equilibrium Analysis ===")
for b_strat, b_name in strategies:
    for a_strat, a_name in strategies:
        pay_a, pay_b = prisoners_dilemma_payoff(a_strat, b_strat)
        # Can A improve by switching?
        alt_pay_a, _ = prisoners_dilemma_payoff(not a_strat, b_strat)
        can_improve = "YES" if alt_pay_a > pay_a else "NO"
        print(f"If B={b_name}, A={a_name}: A gets {pay_a}. "
              f"Switch to {'DISARM' if a_strat else 'ARM'}? A gets {alt_pay_a}. "
              f"Improve? {can_improve}")
print()
print("Nash Equilibrium: (ARM, ARM) — neither player can improve by switching.")
print("Pareto Optimal:   (DISARM, DISARM) — but unstable without enforcement.")

# Iterated Prisoner's Dilemma — strategies over many rounds
def play_iterated(strategy_a, strategy_b, rounds=100):
    """Play iterated PD. Strategies are functions of history."""
    history_a, history_b = [], []
    score_a, score_b = 0, 0

    for round_num in range(rounds):
        a = strategy_a(history_a, history_b, round_num)
        b = strategy_b(history_b, history_a, round_num)
        pay_a, pay_b = prisoners_dilemma_payoff(a, b)
        score_a += pay_a
        score_b += pay_b
        history_a.append(a)
        history_b.append(b)

    return score_a, score_b

# Define strategies
def always_arm(my_hist, opp_hist, round_num):
    return True

def always_disarm(my_hist, opp_hist, round_num):
    return False

def tit_for_tat(my_hist, opp_hist, round_num):
    """Start cooperative, then copy opponent's last move."""
    if round_num == 0:
        return False  # start with disarm
    return opp_hist[-1]  # copy what they did last

def grudger(my_hist, opp_hist, round_num):
    """Cooperate until betrayed, then always arm."""
    if any(opp_hist):  # if opponent ever armed
        return True
    return False

def random_strategy(my_hist, opp_hist, round_num):
    return np.random.random() < 0.5

strategies = {
    "Always Arm":    always_arm,
    "Always Disarm": always_disarm,
    "Tit-for-Tat":  tit_for_tat,
    "Grudger":       grudger,
    "Random":        random_strategy,
}

print("\\n=== Iterated Arms Race (100 rounds) ===")
print(f"{'Strategy A':<18} {'Strategy B':<18} {'Score A':>9} {'Score B':>9} {'Winner':>10}")
print("-" * 66)

for name_a, func_a in strategies.items():
    for name_b, func_b in strategies.items():
        if name_a <= name_b:  # avoid duplicates
            sa, sb = play_iterated(func_a, func_b, rounds=100)
            winner = name_a if sa > sb else name_b if sb > sa else "Tie"
            print(f"{name_a:<18} {name_b:<18} {sa:>9} {sb:>9} {winner:>10}")

# Tournament: which strategy has highest total score?
print("\\n=== Tournament Results (total score vs all opponents) ===")
totals = {name: 0 for name in strategies}
for name_a, func_a in strategies.items():
    for name_b, func_b in strategies.items():
        sa, _ = play_iterated(func_a, func_b, rounds=100)
        totals[name_a] += sa

for name, total in sorted(totals.items(), key=lambda x: x[1], reverse=True):
    print(f"  {name:<18} Total: {total:>6}")

print()
print("Robert Axelrod's tournaments (1980) showed that Tit-for-Tat")
print("consistently wins iterated PD tournaments — it's cooperative")
print("but retaliatory, forgiving but not exploitable.")
print("This became the mathematical basis for arms control treaties.")`,
      challenge: 'Implement a "Tit-for-Two-Tats" strategy (forgive one defection, retaliate after two consecutive defections). Run the tournament again. Does it beat Tit-for-Tat? In a noisy environment (where moves are sometimes misread), more forgiving strategies tend to outperform strict reciprocity — which is why arms control treaties include verification mechanisms to prevent misunderstandings.',
      successHint: 'Game theory transformed nuclear strategy from guesswork into rigorous analysis. The Prisoner\'s Dilemma explains why arms races happen, why they\'re hard to stop, and what treaty structures can escape the trap. John Nash, John von Neumann, and Thomas Schelling (all Nobel laureates) developed this framework — and it applies to every strategic interaction from business competition to climate agreements.',
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
            Level 3 covers Monte Carlo neutron transport, reactor kinetics, blast wave physics, decay chains, and nuclear game theory.
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
