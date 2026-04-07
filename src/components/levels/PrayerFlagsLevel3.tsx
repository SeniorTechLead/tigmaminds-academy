import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PrayerFlagsLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Free radical chain reactions — the chemistry of UV damage',
      concept: `When UV breaks a bond in a dye molecule, it creates **free radicals** — atoms or fragments with unpaired electrons. These radicals are extremely reactive and trigger **chain reactions**:

**Initiation**: R-R + UV → 2R• (UV splits a bond, creating two radicals)
**Propagation**: R• + O₂ → ROO• (radical reacts with oxygen)
                ROO• + RH → ROOH + R• (new radical formed — chain continues!)
**Termination**: R• + R• → R-R (two radicals combine, stopping the chain)

One UV photon can destroy **hundreds of dye molecules** through this chain reaction. This is why even moderate UV causes significant fading.

The rate equations:
- d[R•]/dt = k_init × [RR] × I_UV - k_term × [R•]² (radical concentration)
- d[Dye]/dt = -k_prop × [ROO•] × [Dye] (dye destruction)

**Antioxidants** (like hindered amine light stabilizers, HALS) break the chain by scavenging radicals before they propagate. One HALS molecule can terminate thousands of radical chains.

📚 *We will model the radical chain reaction kinetics and see how antioxidants change the outcome.*`,
      analogy: 'A free radical chain reaction is like a fire. The UV photon is the match (initiation). Each flame (radical) ignites a new piece of fuel (propagation). One match can burn down a forest. Termination is when two flames meet and extinguish each other. An antioxidant is a firefighter — one firefighter can extinguish many flames before they spread.',
      storyConnection: 'The rapid fading of prayer flags is not just one photon destroying one dye molecule — it is a radical chain reaction where each photon triggers a cascade. Understanding this amplification explains why even cloudy days contribute to fading: a few photons start chains that destroy many molecules.',
      checkQuestion: 'If one UV photon initiates a chain that destroys an average of 200 dye molecules, and a prayer flag receives 10¹⁸ photons per day, how many dye molecules are destroyed daily?',
      checkAnswer: '10¹⁸ × 200 = 2×10²⁰ molecules destroyed per day. A typical dye molecule weighs about 350 g/mol, so that is (2×10²⁰/6×10²³) × 350 ≈ 0.12 mg of dye per day. A flag starts with about 1-2 g of dye, so at this rate, all dye would be destroyed in about 10,000-20,000 days (~30-50 years) — but radical chains actually accelerate as the polymer breaks down, so real fading is much faster.',
      codeIntro: 'Model the free radical chain reaction and demonstrate the amplification effect.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def radical_chain(I_uv=1e-6, k_init=0.001, k_prop=10, k_term=1e7,
                  dye_initial=1.0, antioxidant=0, dt=0.001, t_max=10):
    """
    Model radical chain reaction in dye degradation.
    I_uv: UV intensity (arbitrary units)
    k_init: initiation rate constant
    k_prop: propagation rate constant
    k_term: termination rate constant
    antioxidant: concentration of radical scavenger
    """
    n = int(t_max / dt)
    t = np.linspace(0, t_max, n)
    R = np.zeros(n)      # radical concentration
    dye = np.zeros(n)    # dye concentration
    R[0] = 0
    dye[0] = dye_initial

    k_scav = 1000  # scavenging rate by antioxidant

    for i in range(1, n):
        # Initiation: UV creates radicals
        init_rate = k_init * I_uv * dye[i-1]

        # Propagation: radicals destroy dye
        prop_rate = k_prop * R[i-1] * dye[i-1]

        # Termination: radical-radical combination
        term_rate = k_term * R[i-1]**2

        # Antioxidant scavenging
        scav_rate = k_scav * R[i-1] * antioxidant

        # Update concentrations
        dR = init_rate - term_rate - scav_rate
        R[i] = max(0, R[i-1] + dR * dt)

        dDye = -prop_rate
        dye[i] = max(0, dye[i-1] + dDye * dt)

    return t, R, dye

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Free Radical Chain Reaction — Dye Photodegradation',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Basic chain reaction
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
t, R, dye = radical_chain()
ax.plot(t, dye*100, '#ef4444', linewidth=2.5, label='Dye remaining')
ax2 = ax.twinx()
ax2.plot(t, R*1e6, '#f59e0b', linewidth=1.5, linestyle='--', label='Radical conc. (×10⁶)')
ax.set_xlabel('Time (arbitrary)', color='white')
ax.set_ylabel('Dye (%)', color='#ef4444', fontsize=11)
ax2.set_ylabel('Radical Conc.', color='#f59e0b', fontsize=11)
ax.set_title('Chain Reaction Dynamics', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax2.tick_params(colors='#f59e0b')
ax.grid(alpha=0.15)

# Panel 2: UV intensity effect
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
for uv, color, label in [(0.5e-6, '#22c55e', 'Low UV'), (1e-6, '#f59e0b', 'Medium UV'),
                           (2e-6, '#ef4444', 'High UV'), (4e-6, '#ec4899', 'Extreme UV')]:
    t, R, dye = radical_chain(I_uv=uv)
    ax.plot(t, dye*100, color=color, linewidth=2, label=label)
ax.set_xlabel('Time', color='white')
ax.set_ylabel('Dye Remaining (%)', color='white')
ax.set_title('Effect of UV Intensity', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Antioxidant protection
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
for aox, color, label in [(0, '#ef4444', 'No antioxidant'),
                            (0.001, '#f59e0b', 'Low HALS'),
                            (0.005, '#22c55e', 'Medium HALS'),
                            (0.02, '#3b82f6', 'High HALS')]:
    t, R, dye = radical_chain(antioxidant=aox, t_max=20)
    ax.plot(t, dye*100, color=color, linewidth=2.5, label=label)
ax.axhline(y=50, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Time', color='white')
ax.set_ylabel('Dye Remaining (%)', color='white')
ax.set_title('Antioxidant (HALS) Protection', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Chain length amplification
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
k_props = np.linspace(1, 50, 20)
dye_at_t5 = []
for kp in k_props:
    t, R, dye = radical_chain(k_prop=kp, t_max=5)
    dye_at_t5.append(dye[-1] * 100)

ax.plot(k_props, dye_at_t5, '#ef4444', linewidth=2.5, marker='o', markersize=4)
ax.fill_between(k_props, dye_at_t5, 100, alpha=0.15, color='#ef4444')
ax.set_xlabel('Propagation Rate (k_prop)', color='white', fontsize=11)
ax.set_ylabel('Dye Remaining at t=5 (%)', color='white', fontsize=11)
ax.set_title('Chain Length Amplification', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('radicals.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Chain Reaction Summary ===")
t, R, dye_no_aox = radical_chain(t_max=10)
t, R, dye_with_aox = radical_chain(t_max=10, antioxidant=0.01)
print(f"Without antioxidant: {dye_no_aox[-1]*100:.1f}% dye remaining at t=10")
print(f"With HALS:           {dye_with_aox[-1]*100:.1f}% dye remaining at t=10")
print(f"HALS extends dye life by {(dye_with_aox[-1]-dye_no_aox[-1])/dye_no_aox[-1]*100:.0f}%")`,
      challenge: 'Model "oxygen depletion": in sealed packaging, oxygen runs out and the chain reaction stops. Add an O₂ term that decreases as radicals consume it. Does the chain reaction self-limit?',
      successHint: 'You have modeled a free radical chain reaction with coupled differential equations. The amplification effect explains why UV is so destructive: one photon starts a chain that destroys hundreds of molecules. Antioxidants (HALS) are the key to extending textile life outdoors.',
    },
    {
      title: 'Weibull distribution — statistical modeling of textile failure',
      concept: `Real textile failure is **probabilistic**, not deterministic. The **Weibull distribution** models the probability that a flag fails before time t:

**F(t) = 1 - exp(-(t/η)^β)**

Where:
- **F(t)** = probability of failure by time t
- **η** (eta) = characteristic life (63.2% of flags fail by this time)
- **β** (beta) = shape parameter
  - β < 1: decreasing failure rate (infant mortality)
  - β = 1: constant failure rate (exponential, random failure)
  - β > 1: increasing failure rate (wear-out, aging)

For prayer flags, β > 1 (typically 2-4) because failure is dominated by wear-out mechanisms (UV + wind + rain). Flags that survive the first few months become gradually more likely to fail as damage accumulates.

The Weibull model enables:
- **Reliability prediction**: what fraction of flags survive 12 months?
- **Replacement planning**: when should a monastery replace all flags?
- **Quality comparison**: do thicker fabrics have higher η?

📚 *We will fit Weibull distributions to simulated failure data and extract reliability parameters.*`,
      analogy: 'The Weibull distribution is like predicting when lightbulbs burn out. Not all bulbs fail at exactly the same time — there is a spread. β tells you the shape of the spread: if β is high, most bulbs fail near the same time (tight cluster). If β is low, some fail early and some last forever (wide spread). Prayer flags are like lightbulbs in the sun — they all wear out, but the timing varies.',
      storyConnection: 'A monastery in Sikkim strings 108 prayer flags at Losar (Tibetan New Year). Some tear after 3 months, others survive over a year. The Weibull distribution captures this variation — it tells the monks when to expect most flags to need replacement, enabling them to plan the traditional re-stringing ceremony.',
      checkQuestion: 'If β = 3 and η = 10 months, what fraction of flags survive 12 months?',
      checkAnswer: 'Survival probability S(t) = exp(-(t/η)^β) = exp(-(12/10)³) = exp(-1.728) = 0.178. About 17.8% of flags survive 12 months. This means ~82% have failed — torn, blown away, or completely faded. At 6 months: S(6) = exp(-(6/10)³) = exp(-0.216) = 0.806 — about 81% survive. Most failures happen between months 6 and 12.',
      codeIntro: 'Fit Weibull distributions to prayer flag failure data and create reliability curves.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def weibull_pdf(t, beta, eta):
    """Weibull probability density function."""
    return (beta/eta) * (t/eta)**(beta-1) * np.exp(-(t/eta)**beta)

def weibull_cdf(t, beta, eta):
    """Weibull cumulative distribution (probability of failure by time t)."""
    return 1 - np.exp(-(t/eta)**beta)

def weibull_survival(t, beta, eta):
    """Survival probability (probability of surviving past time t)."""
    return np.exp(-(t/eta)**beta)

# Simulated failure data for 108 prayer flags
np.random.seed(42)
beta_true = 3.2
eta_true = 10  # months
n_flags = 108

failure_times = eta_true * np.random.weibull(beta_true, n_flags)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Weibull Reliability Analysis — Prayer Flag Lifetime',
             color='white', fontsize=14, fontweight='bold')

t = np.linspace(0.1, 25, 200)

# Panel 1: Histogram of failure times with fitted Weibull
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
ax.hist(failure_times, bins=15, density=True, color='#3b82f6', alpha=0.6, edgecolor='white', label='Observed failures')
ax.plot(t, weibull_pdf(t, beta_true, eta_true), '#ef4444', linewidth=2.5, label=f'Weibull (β={beta_true}, η={eta_true})')
ax.set_xlabel('Failure Time (months)', color='white', fontsize=11)
ax.set_ylabel('Probability Density', color='white', fontsize=11)
ax.set_title('Failure Time Distribution', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Survival curves for different fabric qualities
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
fabrics = [
    ('Thin cotton (traditional)', 2.8, 8, '#ef4444'),
    ('Standard cotton', 3.2, 10, '#f59e0b'),
    ('Heavy cotton', 3.5, 14, '#22c55e'),
    ('Polyester blend', 4.0, 20, '#3b82f6'),
]
for name, beta, eta, color in fabrics:
    ax.plot(t, weibull_survival(t, beta, eta)*100, color=color, linewidth=2.5, label=name)

ax.axhline(y=50, color='gray', linestyle='--', alpha=0.5, label='50% survival')
ax.set_xlabel('Months', color='white', fontsize=11)
ax.set_ylabel('Survival Probability (%)', color='white', fontsize=11)
ax.set_title('Reliability by Fabric Type', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Hazard rate (instantaneous failure risk)
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
for name, beta, eta, color in fabrics:
    # h(t) = (beta/eta)(t/eta)^(beta-1)
    hazard = (beta/eta) * (t/eta)**(beta-1)
    ax.plot(t, hazard, color=color, linewidth=2, label=name)

ax.set_xlabel('Months', color='white', fontsize=11)
ax.set_ylabel('Hazard Rate (failures/month)', color='white', fontsize=11)
ax.set_title('Instantaneous Failure Risk', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)
ax.set_ylim(0, 1)

# Panel 4: Weibull plot (log-log linearization)
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
# Sort failure times and compute empirical CDF
sorted_failures = np.sort(failure_times)
n = len(sorted_failures)
ranks = np.arange(1, n+1)
F_empirical = (ranks - 0.3) / (n + 0.4)  # median rank estimator

# Weibull plot: ln(ln(1/(1-F))) vs ln(t)
y_plot = np.log(np.log(1 / (1 - F_empirical)))
x_plot = np.log(sorted_failures)

ax.scatter(x_plot, y_plot, color='#3b82f6', s=15, alpha=0.7)
# Fit line
coeffs = np.polyfit(x_plot, y_plot, 1)
x_fit = np.linspace(min(x_plot), max(x_plot), 50)
ax.plot(x_fit, np.polyval(coeffs, x_fit), '#ef4444', linewidth=2, label=f'β={coeffs[0]:.2f}')

beta_est = coeffs[0]
eta_est = np.exp(-coeffs[1]/coeffs[0])
ax.set_xlabel('ln(time)', color='white', fontsize=11)
ax.set_ylabel('ln(ln(1/(1-F)))', color='white', fontsize=11)
ax.set_title(f'Weibull Plot (β={beta_est:.2f}, η={eta_est:.1f}mo)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('weibull.png', dpi=100, facecolor='#1f2937')
plt.show()

# Summary
print(f"=== Weibull Analysis of {n_flags} Prayer Flags ===")
print(f"Estimated β: {beta_est:.2f} (true: {beta_true})")
print(f"Estimated η: {eta_est:.1f} months (true: {eta_true})")
print(f"Mean life: {np.mean(failure_times):.1f} months")
print(f"Median life: {np.median(failure_times):.1f} months")
print(f"Survived 6 months: {np.sum(failure_times > 6)}/{n_flags} ({np.sum(failure_times > 6)/n_flags*100:.0f}%)")
print(f"Survived 12 months: {np.sum(failure_times > 12)}/{n_flags} ({np.sum(failure_times > 12)/n_flags*100:.0f}%)")`,
      challenge: 'Model seasonal variation: flags strung in April (pre-monsoon) should have lower η than flags strung in October (post-monsoon). Fit separate Weibull distributions and compare.',
      successHint: 'You have implemented Weibull reliability analysis — the standard tool for failure prediction in engineering. The Weibull plot linearization technique is used in aerospace, automotive, and materials science to characterize product lifetimes.',
    },
    {
      title: 'Coupled degradation model — UV, wind, and rain together',
      concept: `Real degradation involves **coupled differential equations** where multiple mechanisms interact:

**dS/dt = -k_UV(S) × I_UV × f(moisture) - k_wind(S) × stress × g(temp) - k_hydro × moisture × h(S)**

Where S = material state (0 = destroyed, 1 = pristine), and each term depends on the current state and environmental conditions.

The coupling is critical:
- UV weakens the material → wind does more damage
- Rain wets the material → UV penetrates deeper, hydrolysis accelerates
- Temperature cycling opens cracks → rain enters, freezes, expands

This creates a **positive feedback loop**: damage from one mechanism enables damage from others. The result is nonlinear degradation — slow at first, then accelerating as feedback loops kick in.

The mathematical challenge is that these ODEs are **stiff** — the rates span several orders of magnitude. Simple Euler methods may be unstable; we need adaptive step sizing.

📚 *We will solve the coupled system numerically and visualize the synergistic degradation.*`,
      analogy: 'Coupled degradation is like a team of demolition workers. The UV worker knocks holes in walls (weakens fibers). The wind worker pushes on the weakened walls (mechanical fatigue). The rain worker pours water through the holes (hydrolysis). Each worker makes the others more effective. Separately, demolition takes months. Together, the building falls in weeks.',
      storyConnection: 'A prayer flag on Goecha La faces all three enemies simultaneously: intense UV, relentless wind, and monsoon rain. The coupled model explains why flags at high passes deteriorate so much faster than the sum of individual rates would predict — the synergy between mechanisms is the key to understanding real-world degradation.',
      checkQuestion: 'Why is coupled degradation faster than the sum of individual rates?',
      checkAnswer: 'Because each mechanism makes the material more vulnerable to the others. UV creates microcracks → rain penetrates → hydrolysis weakens chains → wind tears easier. Without UV, rain cannot penetrate. Without rain, UV damage heals less (moisture enables radical chains). The cross-coupling terms (UV×moisture, wind×UV_damage) represent these synergistic interactions, and they grow as damage accumulates.',
      codeIntro: 'Build and solve a coupled degradation model for prayer flag fabric under realistic Sikkim conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class CoupledDegradation:
    """Coupled UV-wind-moisture degradation model."""

    def __init__(self):
        # State variables (all 0-1 scale, 1 = pristine)
        self.color = 1.0      # dye integrity
        self.strength = 1.0   # fiber strength
        self.surface = 1.0    # surface integrity (cracks, pores)

    def environment(self, month):
        """Monthly environmental conditions in Sikkim (high altitude)."""
        # UV intensity (0-1 scale)
        uv = [0.6, 0.7, 0.8, 0.9, 0.85, 0.5, 0.3, 0.4, 0.6, 0.8, 0.7, 0.6]
        # Wind stress (0-1)
        wind = [0.7, 0.7, 0.6, 0.5, 0.6, 0.8, 0.9, 0.85, 0.7, 0.5, 0.6, 0.7]
        # Moisture (0-1)
        moisture = [0.1, 0.1, 0.15, 0.25, 0.4, 0.8, 0.95, 0.9, 0.7, 0.2, 0.1, 0.1]
        # Temperature amplitude (for cycling damage)
        temp_amp = [15, 15, 12, 10, 8, 5, 4, 5, 8, 12, 15, 15]

        m = int(month) % 12
        return uv[m], wind[m], moisture[m], temp_amp[m]

    def simulate(self, months=24, dt=0.1):
        """Simulate degradation over time."""
        n = int(months / dt)
        t = np.linspace(0, months, n)

        color_hist = np.zeros(n)
        strength_hist = np.zeros(n)
        surface_hist = np.zeros(n)

        color = self.color
        strength = self.strength
        surface = self.surface

        for i in range(n):
            month = t[i]
            uv, wind, moisture, temp_amp = self.environment(month)

            # UV degradation of color (faster when surface is damaged)
            surface_exposure = 1 + 2 * (1 - surface)  # damaged surface exposes more dye
            d_color = -0.08 * uv * color * surface_exposure * (1 + 0.5 * moisture) * dt

            # UV + moisture degradation of fiber strength
            d_strength_uv = -0.04 * uv * strength * (1 + moisture * 1.5) * dt
            # Wind fatigue of fiber strength (worse when already weakened)
            d_strength_wind = -0.03 * wind * (1.5 - strength) * dt  # accelerates as strength drops
            # Hydrolysis
            d_strength_hydro = -0.02 * moisture * strength * (1 + 0.3 * (1-surface)) * dt

            # Surface degradation
            d_surface_uv = -0.05 * uv * surface * dt
            d_surface_wind = -0.02 * wind * (1 - strength * 0.5) * dt  # weaker fiber = more surface damage
            d_surface_thermal = -0.01 * temp_amp / 15 * surface * dt

            color = max(0, color + d_color)
            strength = max(0, strength + d_strength_uv + d_strength_wind + d_strength_hydro)
            surface = max(0, surface + d_surface_uv + d_surface_wind + d_surface_thermal)

            color_hist[i] = color
            strength_hist[i] = strength
            surface_hist[i] = surface

        return t, color_hist, strength_hist, surface_hist

model = CoupledDegradation()
t, color, strength, surface = model.simulate(months=24)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Coupled Degradation Model — Prayer Flag at Dzongri (4020m)',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: All three state variables
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
ax.plot(t, color*100, '#f59e0b', linewidth=2.5, label='Color')
ax.plot(t, strength*100, '#ef4444', linewidth=2.5, label='Fiber Strength')
ax.plot(t, surface*100, '#3b82f6', linewidth=2.5, label='Surface Integrity')
# Monsoon bands
for yr in range(2):
    ax.axvspan(5+yr*12, 9+yr*12, alpha=0.1, color='cyan')
ax.set_xlabel('Months', color='white', fontsize=11)
ax.set_ylabel('Condition (%)', color='white', fontsize=11)
ax.set_title('Multi-Property Degradation', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Compare coupled vs uncoupled
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
# Uncoupled model (no synergy)
strength_uncoupled = 100 * np.exp(-0.06 * t)  # simple exponential
ax.plot(t, strength*100, '#ef4444', linewidth=2.5, label='Coupled (realistic)')
ax.plot(t, strength_uncoupled, '#ef4444', linewidth=2, linestyle='--', label='Uncoupled (no synergy)')
synergy_gap = strength_uncoupled - strength*100
ax.fill_between(t, strength*100, strength_uncoupled, alpha=0.2, color='#f59e0b', label='Synergy effect')
ax.set_xlabel('Months', color='white')
ax.set_ylabel('Fiber Strength (%)', color='white')
ax.set_title('Synergy Accelerates Degradation', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Environmental conditions
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
monthly_t = np.arange(0, 24, 0.5)
uv_arr = [model.environment(m)[0] for m in monthly_t]
wind_arr = [model.environment(m)[1] for m in monthly_t]
moist_arr = [model.environment(m)[2] for m in monthly_t]
ax.plot(monthly_t, uv_arr, '#f59e0b', linewidth=2, label='UV')
ax.plot(monthly_t, wind_arr, '#22c55e', linewidth=2, label='Wind')
ax.plot(monthly_t, moist_arr, '#3b82f6', linewidth=2, label='Moisture')
ax.set_xlabel('Months', color='white')
ax.set_ylabel('Intensity (0-1)', color='white')
ax.set_title('Environmental Conditions', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Degradation rate (derivative)
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
# Compute numerical derivative
dt_arr = t[1] - t[0]
d_color = -np.gradient(color, dt_arr)
d_strength = -np.gradient(strength, dt_arr)
ax.plot(t, d_color, '#f59e0b', linewidth=2, label='Color loss rate')
ax.plot(t, d_strength, '#ef4444', linewidth=2, label='Strength loss rate')
ax.set_xlabel('Months', color='white')
ax.set_ylabel('Degradation Rate (per month)', color='white')
ax.set_title('Instantaneous Degradation Rate', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('coupled.png', dpi=100, facecolor='#1f2937')
plt.show()

# Find when each property drops below 20%
for prop, data, name in [(color, 'Color', 'Color'), (strength, 'Strength', 'Strength')]:
    idx = np.argmax(data < 0.2)
    if idx > 0:
        print(f"{name} drops below 20% at month {t[idx]:.1f}")
    else:
        print(f"{name} still above 20% at month 24")

print(f"\\nAt month 12: Color={color[int(12/24*len(t))]*100:.0f}%, Strength={strength[int(12/24*len(t))]*100:.0f}%")`,
      challenge: 'Add a "UV stabilizer" treatment: reduce UV sensitivity by 50%. How many extra months of life does this give? Is it more effective than reducing wind exposure?',
      successHint: 'You have built a coupled degradation model with three interacting state variables — the kind of model used in real materials science for predicting outdoor product lifetimes. The synergy visualization quantifies exactly how much worse coupled degradation is compared to isolated mechanisms.',
    },
    {
      title: 'Freeze-thaw cycling — thermal fatigue in mountain textiles',
      concept: `At high altitudes in Sikkim, temperatures regularly cross 0°C between day and night. When water in fabric freezes, it expands ~9%, creating mechanical stress in the fiber structure. Repeated freeze-thaw cycling is a powerful degradation mechanism:

1. Moisture enters fiber through cracks and pores
2. Nighttime: water freezes, expanding 9% → creates new microcracks
3. Daytime: ice melts → water penetrates deeper into new cracks
4. Repeat: each cycle extends the crack network

The damage per cycle follows a power law:
**Damage(n) = A × n^α**

Where n = number of cycles, A = material-dependent constant, α = damage accumulation exponent (typically 1.5-2.5 for textiles).

At Goecha La (4,940 m):
- ~200 freeze-thaw days per year
- Temperature swings of 20-30°C common
- Combined with UV damage: ice crystals form preferentially in UV-weakened zones

📚 *We will model freeze-thaw damage accumulation and its synergy with UV degradation.*`,
      analogy: 'Freeze-thaw is like wedging. Stone masons used to split rocks by drilling small holes, filling them with water, and waiting for winter. The water would freeze, expand, and crack the rock. Prayer flags undergo the same process — water enters tiny UV-created pores, freezes, and widens them. Each cycle is one more wedge blow.',
      storyConnection: 'The high passes of Sikkim are among the most extreme environments for any textile material. Goecha La sees temperatures swing from +10°C in afternoon sun to -15°C at night. A wet prayer flag goes through this cycle every day — 365 freeze-thaw cycles per year, each one a tiny act of destruction that the spiritual tradition embraces as the flag\'s purpose being fulfilled.',
      checkQuestion: 'Why does freeze-thaw damage accelerate over time (power law with α > 1)?',
      checkAnswer: 'Because damage from each cycle creates entry points for more water in the next cycle. Cycle 1 creates a few microcracks. Water enters those cracks in cycle 2 and creates more. By cycle 100, the crack network is extensive and each cycle affects a much larger volume of material. The positive feedback (damage enables more damage) produces the accelerating power law.',
      codeIntro: 'Model freeze-thaw cycling damage with UV synergy for prayer flags at different altitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def freeze_thaw_damage(n_cycles, A=0.001, alpha=1.8, uv_damage=0):
    """
    Cumulative freeze-thaw damage.
    n_cycles: number of freeze-thaw cycles
    A: material constant
    alpha: damage acceleration exponent
    uv_damage: pre-existing UV damage (0-1) that amplifies freeze-thaw
    """
    cycles = np.arange(1, n_cycles + 1)
    # UV damage opens pores, amplifying freeze-thaw
    amplification = 1 + 3 * uv_damage  # up to 4x at full UV damage
    damage = A * amplification * cycles**alpha
    damage = np.minimum(damage, 1.0)  # cap at total failure
    integrity = 1 - damage
    return cycles, integrity

# Compare altitudes (different number of freeze-thaw days)
altitudes = {
    'Gangtok (1650m)': {'ft_days': 20, 'uv_dam_rate': 0.03},
    'Pelling (2150m)': {'ft_days': 60, 'uv_dam_rate': 0.035},
    'Dzongri (4020m)': {'ft_days': 180, 'uv_dam_rate': 0.045},
    'Goecha La (4940m)': {'ft_days': 280, 'uv_dam_rate': 0.055},
}

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Freeze-Thaw Cycling — Prayer Flag Thermal Fatigue',
             color='white', fontsize=14, fontweight='bold')

colors = {'Gangtok (1650m)': '#22c55e', 'Pelling (2150m)': '#3b82f6',
          'Dzongri (4020m)': '#f59e0b', 'Goecha La (4940m)': '#ef4444'}

# Panel 1: Damage over one year at each altitude
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
for loc, data in altitudes.items():
    cycles, integrity = freeze_thaw_damage(data['ft_days'])
    ax.plot(cycles, integrity*100, color=colors[loc], linewidth=2.5, label=loc)

ax.set_xlabel('Freeze-Thaw Cycles', color='white', fontsize=11)
ax.set_ylabel('Fiber Integrity (%)', color='white', fontsize=11)
ax.set_title('Freeze-Thaw Damage (1 year)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: With vs without UV pre-damage
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
for uv, color, label in [(0, '#22c55e', 'No UV damage'), (0.2, '#f59e0b', '20% UV damage'),
                           (0.5, '#ef4444', '50% UV damage'), (0.8, '#ec4899', '80% UV damage')]:
    cycles, integrity = freeze_thaw_damage(200, uv_damage=uv)
    ax.plot(cycles, integrity*100, color=color, linewidth=2.5, label=label)

ax.set_xlabel('Freeze-Thaw Cycles', color='white', fontsize=11)
ax.set_ylabel('Fiber Integrity (%)', color='white', fontsize=11)
ax.set_title('UV-Freeze/Thaw Synergy', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Monthly simulation (UV accumulates, then FT acts on weakened fabric)
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
months = np.arange(0, 25)
# Dzongri: monthly FT cycles and UV
ft_per_month = [25, 25, 20, 10, 5, 0, 0, 0, 5, 15, 25, 25]

for loc in ['Dzongri (4020m)', 'Goecha La (4940m)']:
    data = altitudes[loc]
    uv_damage = 0
    integrity = 1.0
    monthly_integrity = [1.0]

    for m in range(24):
        month_idx = m % 12
        # UV accumulates
        uv_damage = min(1, uv_damage + data['uv_dam_rate'])

        # Freeze-thaw this month
        ft_this_month = ft_per_month[month_idx] * data['ft_days'] / 180
        if ft_this_month > 0:
            _, integ = freeze_thaw_damage(int(ft_this_month), uv_damage=uv_damage)
            integrity *= integ[-1] if len(integ) > 0 else 1.0

        monthly_integrity.append(max(0, integrity))

    ax.plot(range(25), [i*100 for i in monthly_integrity], color=colors[loc],
            linewidth=2.5, label=loc)

ax.set_xlabel('Months', color='white', fontsize=11)
ax.set_ylabel('Cumulative Integrity (%)', color='white', fontsize=11)
ax.set_title('Monthly Progression', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Power law exponent effect
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
for alpha_val, color in [(1.0, '#22c55e'), (1.5, '#3b82f6'), (2.0, '#f59e0b'), (2.5, '#ef4444')]:
    cycles, integrity = freeze_thaw_damage(300, alpha=alpha_val)
    ax.plot(cycles, integrity*100, color=color, linewidth=2, label=f'α = {alpha_val}')

ax.set_xlabel('Cycles', color='white', fontsize=11)
ax.set_ylabel('Integrity (%)', color='white', fontsize=11)
ax.set_title('Damage Acceleration (α effect)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('freeze_thaw.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Freeze-Thaw Summary ===")
for loc, data in altitudes.items():
    cycles, integrity = freeze_thaw_damage(data['ft_days'], uv_damage=0.3)
    final = integrity[-1] * 100
    print(f"{loc:25s}: {data['ft_days']} cycles/yr → {final:.0f}% integrity after 1 year")`,
      challenge: 'Model the "first winter" effect: a flag strung in April goes through summer (no FT, lots of UV) then hits winter (heavy FT on UV-weakened fabric). Compare with a flag strung in October (winter first, then UV). Which survives longer?',
      successHint: 'You have modeled thermal fatigue with power-law damage accumulation and UV synergy. The freeze-thaw mechanism is critical for understanding material degradation at high altitudes — it applies not just to prayer flags but to roads, buildings, and any outdoor material in mountain environments.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced materials degradation modeling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
