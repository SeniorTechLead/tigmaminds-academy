import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RubberTripuraLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Polymerisation kinetics — rate equations',
      concept: `The kinetics of addition polymerisation involve three steps:

1. **Initiation**: initiator I → 2R* (radicals), rate = kd[I]
2. **Propagation**: R* + M → R-M* (chain grows), rate = kp[R*][M]
3. **Termination**: 2R* → dead polymer, rate = kt[R*]²

At **steady state**, the radical concentration is constant:
\`[R*] = (kd[I]/kt)^{1/2}\`

The overall polymerisation rate:
\`Rp = kp × (kd/kt)^{1/2} × [I]^{1/2} × [M]\`

The chain length depends on the ratio of propagation to termination:
\`n = kp[M] / (2 × (kd × kt × [I])^{1/2})\`

📚 *We will solve these rate equations numerically and model how monomer concentration decreases over time.*`,
      analogy: 'Imagine a factory where workers (radicals) pick up parts (monomers) and add them to products (chains). The factory starts workers (initiation), workers build products (propagation), and workers quit in pairs (termination). The product rate depends on all three.',
      storyConnection: 'In Tripura\'s rubber trees, the enzyme rubber transferase acts as the initiator. Understanding the kinetics helps agricultural scientists breed trees that polymerise faster, producing more rubber per tapping cycle.',
      checkQuestion: 'If you double the initiator concentration, what happens to the polymerisation rate and chain length?',
      checkAnswer: 'Rate increases by √2 ≈ 1.41× (40% faster). Chain length DECREASES by √2 (shorter chains). More initiators start more chains, but each chain gets fewer monomers. There is a trade-off between speed and chain length.',
      codeIntro: 'Solve the polymerisation kinetics equations and model chain growth over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Rate constants
kd = 1e-5      # initiation rate (1/s)
kp = 1000      # propagation rate (L/mol·s)
kt = 1e7       # termination rate (L/mol·s)

# Initial conditions
I0 = 0.01      # initiator concentration (mol/L)
M0 = 5.0       # monomer concentration (mol/L)

# Time integration (Euler method)
dt = 0.1       # seconds
t_max = 3600   # 1 hour
steps = int(t_max / dt)

t = np.zeros(steps)
M = np.zeros(steps)  # monomer
I = np.zeros(steps)  # initiator
Rstar = np.zeros(steps)  # radical
Rp = np.zeros(steps)  # polymerisation rate

M[0] = M0
I[0] = I0
Rstar[0] = (kd * I0 / kt)**0.5

for i in range(1, steps):
    t[i] = t[i-1] + dt
    # Rate equations
    dI = -kd * I[i-1]
    Rstar[i] = (kd * I[i-1] / kt)**0.5
    dM = -kp * Rstar[i] * M[i-1]

    I[i] = max(0, I[i-1] + dI * dt)
    M[i] = max(0, M[i-1] + dM * dt)
    Rp[i] = kp * Rstar[i] * M[i]

conversion = (M0 - M) / M0 * 100  # percent
chain_length = kp * M / (2 * (kd * kt * I)**0.5 + 1e-20)

fig, axes = plt.subplots(2, 2, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

t_min = t / 60

axes[0,0].plot(t_min, M, color='#34d399', linewidth=2)
axes[0,0].set_ylabel('[Monomer] (mol/L)', color='white')
axes[0,0].set_title('Monomer Consumption', color='white', fontsize=11)

axes[0,1].plot(t_min, conversion, color='#f59e0b', linewidth=2)
axes[0,1].set_ylabel('Conversion (%)', color='white')
axes[0,1].set_title('Polymerisation Progress', color='white', fontsize=11)

axes[1,0].plot(t_min, Rp, color='#f87171', linewidth=2)
axes[1,0].set_ylabel('Rate (mol/L·s)', color='white')
axes[1,0].set_xlabel('Time (min)', color='white')
axes[1,0].set_title('Polymerisation Rate', color='white', fontsize=11)

axes[1,1].plot(t_min, chain_length, color='#60a5fa', linewidth=2)
axes[1,1].set_ylabel('Chain length (units)', color='white')
axes[1,1].set_xlabel('Time (min)', color='white')
axes[1,1].set_title('Instantaneous Chain Length', color='white', fontsize=11)

plt.suptitle('Rubber Polymerisation Kinetics', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.savefig('kinetics.png', dpi=100, facecolor='#1f2937')
plt.show()

print(f"Final conversion: {conversion[-1]:.1f}%")
print(f"Final monomer: {M[-1]:.3f} mol/L")
print(f"Average chain length: {np.mean(chain_length[chain_length > 0]):.0f} units")`,
      challenge: 'Run the simulation with 3 different initiator concentrations (0.005, 0.01, 0.02 mol/L). Verify that doubling [I] increases rate by √2 and decreases chain length by √2.',
      successHint: 'Polymerisation kinetics explains why rubber processing requires precise control of temperature, initiator, and time. Small changes in conditions create large changes in the product.',
    },
    {
      title: 'Viscoelasticity — the Maxwell and Kelvin models',
      concept: `Rubber is **viscoelastic** — it behaves as both a viscous fluid and an elastic solid, depending on the timescale.

**Maxwell model** (spring + dashpot in series):
\`dσ/dt + σ/τ = E × dε/dt\`
- Good for **stress relaxation**: rubber under constant strain slowly loses stress

**Kelvin-Voigt model** (spring + dashpot in parallel):
\`σ = E × ε + η × dε/dt\`
- Good for **creep**: rubber under constant stress slowly stretches

The **relaxation time** τ = η/E determines the transition:
- Fast loading (t << τ): rubber acts elastic (bouncy)
- Slow loading (t >> τ): rubber acts viscous (flows)

📚 *We will solve both ODE models numerically and compare stress relaxation and creep behaviour.*`,
      analogy: 'Push your finger into memory foam. It deforms slowly (viscous), but eventually springs back (elastic). That dual behaviour — part fluid, part solid — is viscoelasticity. Rubber does the same, but much faster.',
      storyConnection: 'When a tyre made from Tripura rubber rolls on a road, it deforms and recovers thousands of times per minute. The balance between elastic (bounce back) and viscous (absorb energy) determines ride comfort and grip. This balance is viscoelasticity.',
      checkQuestion: 'If rubber has relaxation time τ = 0.1 seconds and you apply a sudden strain, how long until the stress drops to 37% of its initial value?',
      checkAnswer: 'The stress decays as σ(t) = σ₀ × exp(-t/τ). At t = τ = 0.1s, σ = σ₀ × exp(-1) = 0.368σ₀ ≈ 37%. One relaxation time reduces stress to 1/e of its initial value.',
      codeIntro: 'Model stress relaxation and creep using the Maxwell and Kelvin-Voigt models.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Maxwell model: stress relaxation
E = 2e6       # elastic modulus (Pa)
eta = 1e5     # viscosity (Pa·s)
tau = eta / E  # relaxation time (s)

t = np.linspace(0, 1, 500)

# Stress relaxation: constant strain applied at t=0
strain_0 = 0.5  # 50% strain
stress_maxwell = E * strain_0 * np.exp(-t / tau)

# Kelvin-Voigt: creep under constant stress
stress_applied = 1e6  # 1 MPa
strain_kelvin = (stress_applied / E) * (1 - np.exp(-t / tau))

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Stress relaxation
axes[0].plot(t, stress_maxwell / 1e6, color='#f87171', linewidth=2.5)
axes[0].axhline(y=0, color='#9ca3af', linestyle=':', alpha=0.3)
axes[0].axvline(x=tau, color='#f59e0b', linestyle='--', alpha=0.7, label=f'τ = {tau:.3f}s')
axes[0].plot(tau, E * strain_0 * np.exp(-1) / 1e6, 'o', color='#f59e0b', markersize=10)
axes[0].set_xlabel('Time (s)', color='white', fontsize=11)
axes[0].set_ylabel('Stress (MPa)', color='white', fontsize=11)
axes[0].set_title('Maxwell: Stress Relaxation', color='white', fontsize=12)
axes[0].legend(facecolor='#374151', labelcolor='white')
axes[0].annotate(f'37% at t=τ', xy=(tau + 0.02, E * strain_0 * np.exp(-1) / 1e6),
                 color='white', fontsize=10)

# Creep
axes[1].plot(t, strain_kelvin * 100, color='#34d399', linewidth=2.5)
axes[1].axhline(y=stress_applied / E * 100, color='#9ca3af', linestyle=':', alpha=0.5, label='Final strain')
axes[1].axvline(x=tau, color='#f59e0b', linestyle='--', alpha=0.7, label=f'τ = {tau:.3f}s')
axes[1].set_xlabel('Time (s)', color='white', fontsize=11)
axes[1].set_ylabel('Strain (%)', color='white', fontsize=11)
axes[1].set_title('Kelvin-Voigt: Creep', color='white', fontsize=12)
axes[1].legend(facecolor='#374151', labelcolor='white')

plt.tight_layout()
plt.savefig('viscoelastic.png', dpi=100, facecolor='#1f2937')
plt.show()

print(f"Relaxation time τ = η/E = {eta}/{E:.0e} = {tau:.4f} s")
print(f"\
Stress Relaxation (Maxwell):")
print(f"  Initial stress: {E * strain_0 / 1e6:.2f} MPa")
print(f"  Stress at t=τ:  {E * strain_0 * np.exp(-1) / 1e6:.2f} MPa (37%)")
print(f"  Stress at t=3τ: {E * strain_0 * np.exp(-3) / 1e6:.2f} MPa (5%)")
print(f"\
Creep (Kelvin-Voigt):")
print(f"  Final strain: {stress_applied / E * 100:.1f}%")
print(f"  At t=τ: {(stress_applied / E * (1-np.exp(-1))) * 100:.1f}% (63%)")`,
      challenge: 'Combine Maxwell and Kelvin elements to build a Standard Linear Solid model. This requires solving a 2nd-order ODE — how does it improve the fit?',
      successHint: 'Viscoelasticity is the reason rubber can simultaneously absorb energy (dashpot) and spring back (spring). No purely elastic or purely viscous material could replace rubber in tyres.',
    },
    {
      title: 'Polymer chain statistics — random walks',
      concept: `A polymer chain in solution behaves like a **random walk**: each segment points in a random direction relative to the previous one.

The **end-to-end distance** of a random walk with N steps of length l:
\`R = l × √N\`

This means a chain of 10,000 units (each 0.5 nm) has:
- **Contour length** (fully stretched): 10,000 × 0.5 = 5,000 nm
- **End-to-end distance** (random coil): 0.5 × √10,000 = 50 nm

The chain is 100× shorter than its stretched length! This coiled state is the source of rubber\'s elasticity — stretching straightens the random coil.

The probability of finding a particular end-to-end distance follows a **Gaussian distribution**:
\`P(R) ∝ R² × exp(-3R²/(2Nl²))\`

📚 *We will simulate random walks in 2D and 3D to model polymer chain conformations.*`,
      analogy: 'A person walking randomly (turning in a random direction every step) ends up much closer to their starting point than someone walking in a straight line. After 10,000 steps of 1 metre each, the random walker is only ~100 metres away, not 10,000. Polymer chains do the same.',
      storyConnection: 'The rubber molecules in Tripura\'s latex are tangled random coils. When the latex dries and is stretched, these coils straighten. The mathematics of random walks explains why rubber can stretch 500-700% before breaking — the chains have enormous "slack" in their coiled form.',
      checkQuestion: 'If you double the chain length (N) from 5,000 to 10,000 units, by what factor does the end-to-end distance increase?',
      checkAnswer: 'R ∝ √N, so doubling N increases R by √2 ≈ 1.41×. The chain is twice as long but only 41% more spread out. This square-root relationship is the fundamental scaling law of polymer physics.',
      codeIntro: 'Simulate random walks to model polymer chain conformations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def random_walk_2d(n_steps, step_length=1.0):
    """Generate a 2D random walk."""
    angles = np.random.uniform(0, 2 * np.pi, n_steps)
    dx = step_length * np.cos(angles)
    dy = step_length * np.sin(angles)
    x = np.cumsum(dx)
    y = np.cumsum(dy)
    return x, y

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')

chain_lengths = [100, 1000, 5000]
colors = ['#34d399', '#f59e0b', '#f87171']

for ax, N, color in zip(axes, chain_lengths, colors):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

    x, y = random_walk_2d(N, 0.5)
    ax.plot(x, y, color=color, linewidth=0.3, alpha=0.7)
    ax.plot(0, 0, 'o', color='white', markersize=8, label='Start')
    ax.plot(x[-1], y[-1], 's', color='#ef4444', markersize=8, label='End')

    R = np.sqrt(x[-1]**2 + y[-1]**2)
    R_theory = 0.5 * np.sqrt(N)
    contour = N * 0.5

    ax.set_title(f'N={N}, R={R:.1f}nm\
Contour={contour:.0f}nm', color='white', fontsize=10)
    ax.set_aspect('equal')
    ax.legend(facecolor='#374151', labelcolor='white', fontsize=7)

plt.suptitle('Polymer Random Walks (2D projection)', color='white', fontsize=13)
plt.tight_layout()
plt.savefig('random_walk.png', dpi=100, facecolor='#1f2937')
plt.show()

# Statistical analysis
print("RANDOM WALK STATISTICS (1000 chains each)")
print("=" * 55)
print(f"{'N':>6} | {'Contour (nm)':>12} | {'<R> (nm)':>10} | {'Theory':>8} | {'Ratio':>6}")
print("-" * 55)

for N in [100, 500, 1000, 5000, 10000]:
    R_values = []
    for _ in range(1000):
        x, y = random_walk_2d(N, 0.5)
        R = np.sqrt(x[-1]**2 + y[-1]**2)
        R_values.append(R)
    R_mean = np.mean(R_values)
    R_theory = 0.5 * np.sqrt(N) * np.sqrt(2/np.pi) * np.sqrt(2)  # 2D correction
    contour = N * 0.5
    print(f"{N:>6} | {contour:>12.0f} | {R_mean:>10.1f} | {R_theory:>8.1f} | {contour/R_mean:>5.0f}x")`,
      challenge: 'Extend to 3D random walks and compute the radius of gyration Rg = R/√6. Verify against the theoretical value.',
      successHint: 'Random walk statistics explain why rubber can stretch so far — a chain 5000 nm long coils into a ball only 50 nm across, leaving 99% of its length as "hidden slack" that unfolds when stretched.',
    },
    {
      title: 'Vulcanisation kinetics — modelling the cure',
      concept: `Vulcanisation is a chemical reaction that must be carefully controlled. The **cure curve** (modulus vs time at constant temperature) shows three phases:

1. **Scorch period**: induction time before cross-linking begins
2. **Cure phase**: rapid cross-link formation — modulus rises
3. **Overcure/Reversion**: too much heating degrades chains — modulus may drop

The cure can be modelled as:
\`G(t) = G₀ + (G∞ - G₀) × (1 - exp(-(t-ts)^n/τ^n))\` for t > ts

where ts is scorch time, τ is cure time constant, and n controls curve shape.

Engineers use **cure meters** (rheometers) to measure this curve and determine:
- **Optimum cure time** (t90): time to reach 90% of maximum modulus
- **Scorch safety**: minimum time before cure begins (for processing)

📚 *We will model cure curves at different temperatures and find the optimal processing conditions.*`,
      analogy: 'Baking a cake: there is an initial period where nothing seems to happen (scorch/preheat), then rapid rising (cure), then the cake is done. Overbaking makes it dry and crumbly (reversion). The baker must know the exact timing — and so must the rubber engineer.',
      storyConnection: 'Tripura\'s raw rubber is shipped to factories where it is vulcanised under precise conditions. The cure curve determines factory settings — temperature, time, and sulphur content. Getting it wrong wastes rubber and energy.',
      checkQuestion: 'If t90 is 15 minutes at 150°C and cure time halves for every 10°C increase, what is t90 at 170°C?',
      checkAnswer: '(170-150)/10 = 2 halvings. t90 = 15 / 2² = 15/4 = 3.75 minutes. But faster curing also means less scorch safety — the factory has less time to shape the rubber before it stiffens.',
      codeIntro: 'Model vulcanisation cure curves at different temperatures and find optimal cure times.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def cure_curve(t, G0, Ginf, ts, tau, n, reversion_rate=0):
    """Model the vulcanisation cure curve."""
    G = np.full_like(t, G0, dtype=float)
    curing = t > ts
    t_cure = t[curing] - ts
    G[curing] = G0 + (Ginf - G0) * (1 - np.exp(-(t_cure / tau)**n))
    # Reversion (overcure)
    if reversion_rate > 0:
        overcure = t > (ts + 3 * tau)
        t_over = t[overcure] - (ts + 3 * tau)
        G[overcure] *= np.exp(-reversion_rate * t_over)
    return G

t = np.linspace(0, 40, 500)  # minutes

# Different temperatures
temps = {
    '140°C': {'G0': 0.1, 'Ginf': 2.5, 'ts': 5.0, 'tau': 8.0, 'n': 2.0, 'rev': 0.01},
    '150°C': {'G0': 0.1, 'Ginf': 2.8, 'ts': 3.0, 'tau': 5.0, 'n': 2.0, 'rev': 0.02},
    '160°C': {'G0': 0.1, 'Ginf': 3.0, 'ts': 1.5, 'tau': 3.0, 'n': 2.0, 'rev': 0.04},
    '170°C': {'G0': 0.1, 'Ginf': 3.0, 'ts': 0.8, 'tau': 1.8, 'n': 2.0, 'rev': 0.08},
}

colors = ['#34d399', '#f59e0b', '#f87171', '#a78bfa']

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

for (name, params), color in zip(temps.items(), colors):
    G = cure_curve(t, **params)
    ax.plot(t, G, color=color, linewidth=2.5, label=name)

    # Find t90
    G90 = params['G0'] + 0.9 * (params['Ginf'] - params['G0'])
    t90_idx = np.argmin(np.abs(G - G90))
    ax.plot(t[t90_idx], G[t90_idx], 'o', color=color, markersize=8)
    ax.annotate(f't90={t[t90_idx]:.1f}m', xy=(t[t90_idx], G[t90_idx]),
                xytext=(t[t90_idx] + 1, G[t90_idx] + 0.15),
                color=color, fontsize=8)

ax.set_xlabel('Time (minutes)', color='white', fontsize=12)
ax.set_ylabel('Modulus (MPa)', color='white', fontsize=12)
ax.set_title('Vulcanisation Cure Curves — Temperature Effect', color='white', fontsize=13)
ax.legend(facecolor='#374151', labelcolor='white')

plt.tight_layout()
plt.savefig('cure.png', dpi=100, facecolor='#1f2937')
plt.show()

print("CURE ANALYSIS")
print("=" * 55)
print(f"{'Temp':>6} | {'Scorch':>7} | {'t90':>5} | {'Max G':>6} | {'Reversion'}")
print("-" * 55)
for name, params in temps.items():
    G = cure_curve(t, **params)
    G90 = params['G0'] + 0.9 * (params['Ginf'] - params['G0'])
    t90_idx = np.argmin(np.abs(G - G90))
    rev = "Yes" if params['rev'] > 0.03 else "Mild" if params['rev'] > 0.01 else "No"
    print(f"{name:>6} | {params['ts']:>5.1f}m | {t[t90_idx]:>4.1f}m | {G.max():>5.2f} | {rev}")`,
      challenge: 'Add sulphur content as a variable (more sulphur → higher Ginf but more reversion). Find the optimal sulphur/temperature combination.',
      successHint: 'Cure curve modelling saves factories millions by predicting the exact conditions needed. Too little curing wastes quality; too much wastes time and causes reversion.',
    },
    {
      title: 'Swelling equilibrium — Flory-Rehner theory',
      concept: `When vulcanised rubber is placed in a solvent (like toluene), it **swells** — the solvent molecules enter the network and push the chains apart. The swelling stops when:

**Elastic retraction** (chains resist being stretched) = **Mixing energy** (solvent wants to enter)

The **Flory-Rehner equation**:
\`ln(1-φ) + φ + χφ² = -ν × V₁ × (φ^{1/3} - φ/2)\`

where:
- φ = polymer volume fraction (after swelling)
- χ = Flory interaction parameter (polymer-solvent affinity)
- ν = cross-link density
- V₁ = molar volume of solvent

This is used industrially to MEASURE cross-link density — swell a sample, measure how much it expands, and calculate ν.

📚 *We will solve the Flory-Rehner equation numerically to predict swelling and extract cross-link density.*`,
      analogy: 'A sponge in water swells until its internal tension balances the water pressure. More cross-links = stiffer sponge = less swelling. Rubber in solvent works identically — cross-link density determines how much it swells.',
      storyConnection: 'Tripura\'s rubber quality is tested by swelling experiments. A sample is soaked in toluene, and the degree of swelling reveals the cross-link density. This simple lab test tells you everything about how well the rubber was vulcanised.',
      checkQuestion: 'If a rubber sample doubles its volume when swollen, what is the polymer volume fraction φ?',
      checkAnswer: 'If volume doubles, half is rubber and half is solvent. φ = V_rubber / V_total = V / 2V = 0.5. Lower φ means more swelling (less cross-linking).',
      codeIntro: 'Solve the Flory-Rehner equation to predict rubber swelling and measure cross-link density.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Flory-Rehner equation components
def flory_rehner_lhs(phi, chi):
    """Mixing term (left-hand side)."""
    return np.log(1 - phi) + phi + chi * phi**2

def flory_rehner_rhs(phi, nu, V1):
    """Elastic term (right-hand side)."""
    return -nu * V1 * (phi**(1/3) - phi / 2)

# Find equilibrium phi by solving LHS = RHS
def find_equilibrium(chi, nu, V1, tol=1e-6):
    """Find equilibrium polymer fraction by bisection."""
    lo, hi = 0.01, 0.99
    for _ in range(100):
        mid = (lo + hi) / 2
        diff = flory_rehner_lhs(mid, chi) - flory_rehner_rhs(mid, nu, V1)
        if diff < 0:
            lo = mid
        else:
            hi = mid
        if abs(diff) < tol:
            break
    return mid

V1 = 106.2e-6   # molar volume of toluene (m³/mol)
chi = 0.39       # Flory parameter for NR-toluene

# Sweep cross-link densities
nu_values = np.logspace(-2, 2, 50)  # mol/m³
phi_values = [find_equilibrium(chi, nu, V1) for nu in nu_values]
swell_ratios = [1/phi for phi in phi_values]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

ax1.semilogx(nu_values, phi_values, color='#34d399', linewidth=2.5)
ax1.set_xlabel('Cross-link density ν (mol/m³)', color='white', fontsize=11)
ax1.set_ylabel('Equilibrium φ (polymer fraction)', color='white', fontsize=11)
ax1.set_title('Polymer Fraction vs Cross-linking', color='white', fontsize=12)

ax2.semilogx(nu_values, swell_ratios, color='#f59e0b', linewidth=2.5)
ax2.set_xlabel('Cross-link density ν (mol/m³)', color='white', fontsize=11)
ax2.set_ylabel('Swell ratio (V_swollen / V_dry)', color='white', fontsize=11)
ax2.set_title('Swelling vs Cross-linking', color='white', fontsize=12)

# Mark typical rubber types
for nu, name, color in [(0.5, 'Soft', '#60a5fa'), (5, 'Tyre', '#f87171'), (50, 'Hard', '#a78bfa')]:
    phi_eq = find_equilibrium(chi, nu, V1)
    ax1.plot(nu, phi_eq, 'o', color=color, markersize=10, zorder=5)
    ax1.annotate(name, xy=(nu, phi_eq + 0.03), color=color, fontsize=9, ha='center')
    ax2.plot(nu, 1/phi_eq, 'o', color=color, markersize=10, zorder=5)
    ax2.annotate(name, xy=(nu, 1/phi_eq + 0.3), color=color, fontsize=9, ha='center')

plt.tight_layout()
plt.savefig('swelling.png', dpi=100, facecolor='#1f2937')
plt.show()

print("SWELLING EXPERIMENT RESULTS")
print("=" * 50)
print(f"{'ν (mol/m³)':>12} | {'φ':>6} | {'Swell ratio':>11} | Type")
print("-" * 50)
for nu, name in [(0.1, 'Very soft'), (0.5, 'Soft'), (2, 'Medium'),
                 (5, 'Tyre'), (20, 'Hard'), (100, 'Ebonite')]:
    phi = find_equilibrium(chi, nu, V1)
    print(f"{nu:>12.1f} | {phi:>6.3f} | {1/phi:>11.1f}x | {name}")`,
      challenge: 'If a lab measures swell ratio = 4.5 for a Tripura rubber sample, what is its cross-link density? Implement a reverse calculation.',
      successHint: 'The Flory-Rehner equation turns a simple lab measurement (how much does it swell?) into a fundamental material property (cross-link density). This is elegant applied physics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Polymer Modelling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
