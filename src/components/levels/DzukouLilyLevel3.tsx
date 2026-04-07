import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DzukouLilyLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fick\'s Law — how CO₂ diffuses into leaves at altitude',
      concept: `**Fick's First Law of Diffusion** describes how gases move from high to low concentration:

**J = -D × (dC/dx)**

Where:
- J = flux (amount per area per time)
- D = diffusion coefficient (depends on gas, temperature, pressure)
- dC/dx = concentration gradient

At altitude, two things change:
1. **CO₂ partial pressure drops** (less CO₂ per volume of air)
2. **Diffusion coefficient increases** (less air resistance to molecular motion)

These partially cancel out, but not completely. Net CO₂ uptake drops by about 15-20% at 2,450 m compared to sea level.

Plants compensate by:
- Opening stomata wider (but losing more water)
- Increasing leaf surface area
- Concentrating Rubisco (the CO₂-fixing enzyme)

📚 *Python **classes** let us bundle data and behavior. A class is like a blueprint for creating objects that hold related variables and functions together.*`,
      analogy: 'Imagine trying to catch butterflies (CO₂ molecules) in a field. At sea level, the field is crowded with butterflies — easy to catch many. At altitude, there are fewer butterflies (lower partial pressure), but they fly slower through thinner air (higher diffusion coefficient). You catch fewer per hour, but not as few as the lower butterfly count suggests.',
      storyConnection: 'The Dzukou Lily photosynthesizes at 75% of sea-level air pressure. Every leaf is an engineering marvel — wider stomata, more chloroplasts, optimized enzyme concentrations — all to capture enough CO₂ in thin mountain air.',
      checkQuestion: 'Why does the diffusion coefficient increase at altitude even though there are fewer gas molecules?',
      checkAnswer: 'The diffusion coefficient D is inversely proportional to total pressure: D ∝ 1/P. At lower pressure, molecules have longer mean free paths (travel farther between collisions). So each CO₂ molecule diffuses faster at altitude. But there are fewer CO₂ molecules to begin with, so the net flux still decreases.',
      codeIntro: 'Build a class that models CO₂ diffusion into a leaf at any altitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class LeafGasExchange:
    """Models CO₂ diffusion into a leaf stomata at altitude."""

    def __init__(self, altitude_m):
        self.altitude = altitude_m
        self.P0 = 101325  # sea level pressure Pa
        self.T0 = 288.15  # sea level temp K
        self.L = 0.0065   # lapse rate K/m
        self.g = 9.81; self.M = 0.029; self.R = 8.314
        self.CO2_fraction = 420e-6  # 420 ppm

    def pressure(self):
        exp = self.g * self.M / (self.R * self.L)
        return self.P0 * (1 - self.L * self.altitude / self.T0) ** exp

    def temperature(self):
        return self.T0 - self.L * self.altitude

    def co2_partial_pressure(self):
        return self.pressure() * self.CO2_fraction

    def diffusion_coeff(self):
        # D scales as T^1.75 / P (Chapman-Enskog theory simplified)
        T = self.temperature()
        P = self.pressure()
        D_ref = 1.6e-5  # m²/s at standard conditions
        return D_ref * (T / self.T0) ** 1.75 * (self.P0 / P)

    def co2_flux(self, stomatal_width_um=12):
        """Fick's law: J = D * deltaC / dx"""
        # Concentration difference (outside - inside leaf)
        C_out = self.co2_partial_pressure() / (self.R * self.temperature())  # mol/m³
        C_in = C_out * 0.7  # inside leaf, CO₂ is ~70% of outside (being consumed)
        delta_C = C_out - C_in
        dx = stomatal_width_um * 1e-6  # convert μm to m
        D = self.diffusion_coeff()
        return D * delta_C / dx  # mol/(m²·s)

# Compare sea level to Dzukou
altitudes = np.arange(0, 4001, 250)
fluxes = []
for alt in altitudes:
    leaf = LeafGasExchange(alt)
    fluxes.append(leaf.co2_flux())

fluxes = np.array(fluxes)
relative_flux = fluxes / fluxes[0] * 100

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

for ax in [ax1, ax2]:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Absolute flux
ax1.plot(altitudes, fluxes * 1e6, color='#10b981', linewidth=2.5)
ax1.axvline(x=2450, color='#f59e0b', linestyle='--', alpha=0.7)
ax1.set_xlabel('Altitude (m)', color='white', fontsize=11)
ax1.set_ylabel('CO₂ Flux (μmol/m²/s)', color='white', fontsize=11)
ax1.set_title('Absolute CO₂ Flux into Leaf', color='white', fontsize=13, fontweight='bold')

# Relative flux
ax2.plot(altitudes, relative_flux, color='#f87171', linewidth=2.5)
ax2.axhline(y=100, color='white', linestyle=':', alpha=0.3)
ax2.axvline(x=2450, color='#f59e0b', linestyle='--', alpha=0.7)
dzukou_leaf = LeafGasExchange(2450)
dzukou_pct = dzukou_leaf.co2_flux() / LeafGasExchange(0).co2_flux() * 100
ax2.scatter([2450], [dzukou_pct], color='#f59e0b', s=80, zorder=5)
ax2.annotate(f'Dzukou: {dzukou_pct:.1f}%', xy=(2450, dzukou_pct),
             xytext=(2800, dzukou_pct + 5), color='#f59e0b', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.set_xlabel('Altitude (m)', color='white', fontsize=11)
ax2.set_ylabel('% of Sea Level Flux', color='white', fontsize=11)
ax2.set_title('Relative CO₂ Uptake', color='white', fontsize=13, fontweight='bold')

plt.suptitle("Fick's Law: CO₂ Diffusion at Altitude", color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print(f"At Dzukou Valley (2,450 m):")
print(f"  CO₂ flux = {dzukou_pct:.1f}% of sea level")
print(f"  The lily must compensate for a {100-dzukou_pct:.1f}% reduction in CO₂ supply")`,
      challenge: 'Model a plant that compensates by opening stomata 30% wider at altitude. Modify stomatal_width_um and show how much CO₂ flux recovers. What is the water-loss trade-off?',
      successHint: 'You have built an object-oriented model of gas exchange that captures the real physics of photosynthesis at altitude. This same framework applies to any mountain plant on Earth.',
    },
    {
      title: 'Coupled ODEs — photosynthesis and respiration dynamics',
      concept: `A plant's carbon balance is governed by two competing processes:
1. **Photosynthesis**: converts CO₂ + light → sugar (builds carbon)
2. **Respiration**: converts sugar → energy + CO₂ (burns carbon)

These can be modeled as **coupled ordinary differential equations (ODEs)**:

**dC/dt = P(T, UV, CO₂) - R(T, C)**

Where:
- C = carbon stored in the plant
- P = photosynthesis rate (depends on temperature, UV, CO₂)
- R = respiration rate (depends on temperature and carbon reserves)

At altitude, P is reduced (less CO₂, more UV damage) while R increases at night (cold stress requires more energy). The plant survives only if P > R integrated over the growing season.

📚 *Euler's method solves ODEs numerically: y(t+dt) = y(t) + dy/dt × dt. It is the simplest numerical integrator.*`,
      analogy: 'Think of the plant as a bank account. Photosynthesis is income (deposits). Respiration is expenses (withdrawals). At altitude, income drops (less CO₂) and winter expenses rise (cold-stress costs). The plant "survives" if its account never hits zero. Our ODE model tracks this balance hour by hour.',
      storyConnection: 'The Dzukou Lily has only a 180-day window to earn enough carbon for next year\'s growth, flowering, and seed production — all while paying the extra costs of UV protection and cold tolerance. It is a remarkable metabolic balancing act.',
      checkQuestion: 'Why does respiration increase at cold temperatures for mountain plants?',
      checkAnswer: 'Cold temperatures damage cell membranes and denature some proteins. The plant must spend energy on repair: producing antifreeze proteins, replacing damaged membranes, and maintaining ion gradients across cell walls. While the RATE of respiration per unit time may decrease (Q10 effect), the TOTAL respiration cost over a long cold season is high because the cold lasts so long. Additionally, cold-hardening itself costs energy.',
      codeIntro: 'Simulate a lily\'s carbon balance through an entire growing season using Euler\'s method.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ODE model of plant carbon balance
def photosynthesis_rate(T, light, co2_factor):
    """Photosynthesis depends on temperature and light."""
    # Peaks at ~22°C, drops at extremes
    T_opt = 22; T_sigma = 8
    T_factor = np.exp(-0.5 * ((T - T_opt) / T_sigma) ** 2)
    return 0.05 * light * T_factor * co2_factor

def respiration_rate(T, carbon):
    """Respiration increases with temperature (Q10 rule) and carbon reserves."""
    Q10 = 2.0  # respiration doubles per 10°C increase
    R_base = 0.005
    return R_base * Q10 ** ((T - 20) / 10) * (carbon / (carbon + 5))

# Simulate 365 days
days = np.arange(0, 365, 0.25)  # quarter-day resolution
dt = 0.25

# Environmental drivers at Dzukou (2,450 m)
day_of_year = days % 365
temp = 12 + 10 * np.sin(2 * np.pi * (day_of_year - 100) / 365)  # peaks in Jul
temp += 5 * np.sin(2 * np.pi * days * 4)  # diurnal variation (simplified)
light = np.maximum(0, np.sin(2 * np.pi * (days % 1) - 0.25))  # day/night cycle
light *= (0.5 + 0.5 * np.sin(2 * np.pi * (day_of_year - 80) / 365))  # seasonal
co2_factor = 0.82  # 82% of sea-level CO₂ flux at 2,450 m

# Euler integration
carbon = np.zeros_like(days)
carbon[0] = 10.0  # initial carbon reserves (g)
photo_total = np.zeros_like(days)
resp_total = np.zeros_like(days)

for i in range(1, len(days)):
    P = photosynthesis_rate(temp[i], light[i], co2_factor)
    R = respiration_rate(temp[i], carbon[i-1])
    carbon[i] = carbon[i-1] + (P - R) * dt
    carbon[i] = max(carbon[i], 0)  # can't go negative
    photo_total[i] = photo_total[i-1] + P * dt
    resp_total[i] = resp_total[i-1] + R * dt

# Daily averages for cleaner plotting
day_indices = np.arange(0, 365)
daily_carbon = [np.mean(carbon[int(d*4):int((d+1)*4)]) for d in day_indices]
daily_temp = [np.mean(temp[int(d*4):int((d+1)*4)]) for d in day_indices]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax in [ax1, ax2]:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Temperature
ax1.plot(day_indices, daily_temp, color='#f87171', linewidth=1.5)
ax1.axhline(y=0, color='#60a5fa', linestyle=':', alpha=0.5, label='Freezing')
ax1.fill_between(day_indices, daily_temp, 0,
                 where=[t < 0 for t in daily_temp], alpha=0.3, color='#60a5fa', label='Frost risk')
ax1.set_ylabel('Temperature (°C)', color='white', fontsize=11)
ax1.set_title('Environmental Conditions & Carbon Balance — Dzukou Lily', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Carbon balance
ax2.plot(day_indices, daily_carbon, color='#10b981', linewidth=2.5, label='Carbon reserves')
ax2.axhline(y=carbon[0], color='white', linestyle=':', alpha=0.3, label='Starting reserves')
bloom_start, bloom_end = 182, 243
ax2.axvspan(bloom_start, bloom_end, alpha=0.15, color='#f59e0b', label='Flowering (costly)')
ax2.fill_between(day_indices, daily_carbon, alpha=0.15, color='#10b981')
ax2.set_ylabel('Carbon Reserves (g)', color='white', fontsize=11)
ax2.set_xlabel('Day of Year', color='white', fontsize=11)
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
month_starts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
ax2.set_xticks(month_starts)
ax2.set_xticklabels(months, fontsize=9)

plt.tight_layout()
plt.show()

print(f"Season start carbon: {carbon[0]:.1f} g")
print(f"Season end carbon:   {daily_carbon[-1]:.1f} g")
print(f"Net carbon gain:     {daily_carbon[-1] - carbon[0]:.1f} g")
print(f"Total photosynthesis: {photo_total[-1]:.1f} g")
print(f"Total respiration:    {resp_total[-1]:.1f} g")
print(f"Efficiency: {(daily_carbon[-1] - carbon[0])/photo_total[-1]*100:.1f}% of photosynthate retained")`,
      challenge: 'Reduce co2_factor to 0.70 (simulating an even higher altitude). At what altitude does the lily\'s carbon balance go negative — meaning it cannot survive? This is the plant\'s altitudinal limit.',
      successHint: 'You have simulated the fundamental metabolic constraint that limits where plants can grow. The altitudinal tree line, the distribution of alpine flowers, and the structure of entire mountain ecosystems are determined by this carbon balance.',
    },
    {
      title: 'Stomatal optimization — the photosynthesis-water trade-off',
      concept: `Stomata are tiny pores on leaf surfaces that let CO₂ in for photosynthesis — but also let water vapor out (transpiration). This creates an **optimization problem**:

- **Open stomata** → more CO₂ → more photosynthesis → but more water loss
- **Closed stomata** → less water loss → but less CO₂ → less photosynthesis

The optimal strategy maximizes carbon gain per unit water lost, known as **water use efficiency (WUE)**:

**WUE = A / E**

Where A = net photosynthesis (CO₂ assimilation) and E = transpiration (water loss).

At altitude, this trade-off intensifies: the plant needs wider stomata to compensate for lower CO₂, but dry mountain air pulls water out faster.

📚 *Python's scipy.optimize module finds optimal values. But we can also use brute-force search over a range of values — less elegant but very clear.*`,
      analogy: 'A stoma is like a window in winter. Open it to let fresh air in (CO₂ for the plant), but you also let heat escape (water for the plant). The optimal strategy is to open it just enough to breathe but not so much that you freeze. Mountain plants face an extreme version: the "air" is thin (low CO₂) and the "cold" is intense (dry air pulls water fast).',
      storyConnection: 'The Dzukou Lily thrives in Nagaland\'s monsoon moisture. But even in monsoon season, altitude makes the air drier than lowlands. The lily\'s stomatal control is a finely tuned compromise — open enough to photosynthesize in thin air, closed enough to conserve water between rains.',
      checkQuestion: 'Why do mountain plants often have smaller, more numerous stomata rather than fewer large stomata?',
      checkAnswer: 'Many small stomata provide finer control than a few large ones. The plant can open some and close others depending on local leaf conditions. Small stomata also close faster (shorter closing distance), which helps during sudden dry gusts. Additionally, the total pore area per leaf can be precisely tuned by adjusting how many stomata develop — a genetic adaptation to average conditions.',
      codeIntro: 'Find the optimal stomatal aperture that maximizes water use efficiency at Dzukou Valley.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def photosynthesis(aperture, co2_factor, temp):
    """CO₂ assimilation rate (μmol/m²/s) as function of stomatal aperture."""
    # Conductance proportional to aperture
    g_co2 = 0.4 * aperture  # mol/m²/s
    # CO₂ supply limited by conductance
    C_ambient = 420 * co2_factor  # ppm at altitude
    C_internal = C_ambient * (1 - 1 / (1 + 2 * g_co2))
    # Michaelis-Menten kinetics for Rubisco
    Vcmax = 80  # max carboxylation
    Km = 270    # half-saturation
    T_factor = np.exp(-0.5 * ((temp - 25) / 10) ** 2)
    return Vcmax * C_internal / (Km + C_internal) * T_factor

def transpiration(aperture, vpd):
    """Water loss rate (mmol/m²/s) as function of stomatal aperture."""
    g_h2o = 0.4 * aperture * 1.6  # H₂O diffuses 1.6x faster than CO₂
    return g_h2o * vpd

# Parameters for Dzukou Valley
co2_factor = 0.82  # altitude CO₂ reduction
temp = 18           # °C summer temperature
vpd_values = [0.5, 1.0, 1.5, 2.0]  # vapor pressure deficit (kPa)
apertures = np.linspace(0.01, 1.0, 200)

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

colors = ['#10b981', '#f59e0b', '#f87171', '#a78bfa']

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Plot 1: Photosynthesis vs aperture
for vpd, c in zip(vpd_values, colors):
    A = [photosynthesis(a, co2_factor, temp) for a in apertures]
    axes[0].plot(apertures, A, color=c, linewidth=2)
axes[0].set_xlabel('Stomatal Aperture', color='white', fontsize=11)
axes[0].set_ylabel('Photosynthesis (μmol/m²/s)', color='white', fontsize=11)
axes[0].set_title('CO₂ Assimilation', color='white', fontsize=12, fontweight='bold')

# Plot 2: Transpiration vs aperture
for vpd, c in zip(vpd_values, colors):
    E = [transpiration(a, vpd) for a in apertures]
    axes[1].plot(apertures, E, color=c, linewidth=2, label=f'VPD={vpd}')
axes[1].set_xlabel('Stomatal Aperture', color='white', fontsize=11)
axes[1].set_ylabel('Transpiration (mmol/m²/s)', color='white', fontsize=11)
axes[1].set_title('Water Loss', color='white', fontsize=12, fontweight='bold')
axes[1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Plot 3: Water Use Efficiency
for vpd, c in zip(vpd_values, colors):
    A = np.array([photosynthesis(a, co2_factor, temp) for a in apertures])
    E = np.array([transpiration(a, vpd) for a in apertures])
    WUE = A / (E + 0.01)
    axes[2].plot(apertures, WUE, color=c, linewidth=2, label=f'VPD={vpd}')
    opt_idx = np.argmax(WUE)
    axes[2].scatter([apertures[opt_idx]], [WUE[opt_idx]], color=c, s=60, zorder=5)

axes[2].set_xlabel('Stomatal Aperture', color='white', fontsize=11)
axes[2].set_ylabel('WUE (μmol CO₂ / mmol H₂O)', color='white', fontsize=11)
axes[2].set_title('Water Use Efficiency', color='white', fontsize=12, fontweight='bold')
axes[2].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

plt.suptitle('Stomatal Optimization — Dzukou Lily', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

# Find optimal apertures
print("Optimal stomatal aperture at each VPD:")
for vpd in vpd_values:
    A = np.array([photosynthesis(a, co2_factor, temp) for a in apertures])
    E = np.array([transpiration(a, vpd) for a in apertures])
    WUE = A / (E + 0.01)
    opt_idx = np.argmax(WUE)
    print(f"  VPD = {vpd} kPa → optimal aperture = {apertures[opt_idx]:.2f}, WUE = {WUE[opt_idx]:.2f}")`,
      challenge: 'Compare sea-level (co2_factor=1.0) vs Dzukou (0.82). Does the optimal stomatal aperture shift at altitude? By how much?',
      successHint: 'You have solved a real optimization problem from plant physiology. The trade-off between carbon gain and water loss drives stomatal evolution worldwide.',
    },
    {
      title: 'Population viability analysis — will the lily survive?',
      concept: `**Population Viability Analysis (PVA)** uses stochastic simulation to predict whether a population will survive over decades or centuries. It models:

- **Demographic stochasticity**: random variation in births/deaths
- **Environmental stochasticity**: year-to-year variation in conditions
- **Catastrophes**: rare events (fire, flood, disease) that kill many individuals
- **Allee effects**: small populations decline faster (harder to find mates, inbreeding)

The key output is **extinction probability** — the fraction of simulations where the population hits zero.

A standard approach: run 1,000 simulations of 100 years each. If >5% go extinct, the population is at risk.

📚 *Stochastic simulations use random numbers to model uncertainty. Running many simulations (Monte Carlo method) reveals the range of possible outcomes.*`,
      analogy: 'PVA is like running a financial stress test. You simulate 1,000 possible futures for a bank, each with random market crashes and booms. If too many futures end in bankruptcy, the bank needs more capital. Similarly, if too many simulation runs end with zero lilies, the population needs conservation intervention.',
      storyConnection: 'The Dzukou Lily faces real threats: tourism trampling, climate change, invasive species. PVA tells conservationists how urgent the threat is. A 2% annual decline might seem small, but PVA reveals it could lead to 60% extinction probability within 50 years.',
      checkQuestion: 'Why do we need 1,000 simulations instead of just one very detailed simulation?',
      checkAnswer: 'One simulation gives one possible future — but the real future depends on random events we cannot predict. Maybe next year has a drought, maybe it does not. By running 1,000 simulations with different random events, we map out the entire range of possible outcomes. The fraction of runs that go extinct IS the extinction probability. This is the Monte Carlo method — using randomness to approximate complex probabilities.',
      codeIntro: 'Run a population viability analysis for the Dzukou Lily under different scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def run_pva(N0, years, growth_rate, env_sd, catastrophe_prob, catastrophe_severity, n_sims):
    """Run Population Viability Analysis."""
    trajectories = np.zeros((n_sims, years + 1))
    trajectories[:, 0] = N0

    for sim in range(n_sims):
        N = N0
        for yr in range(1, years + 1):
            # Environmental stochasticity
            r = np.random.normal(growth_rate, env_sd)
            # Allee effect: growth declines when population is small
            allee_factor = N / (N + 100) if N > 0 else 0
            r_eff = r * allee_factor
            # Demographic stochasticity
            if N > 0 and N < 1000:
                N = np.random.poisson(max(0, N * np.exp(r_eff)))
            elif N > 0:
                N = int(N * np.exp(r_eff))
            # Catastrophe?
            if np.random.random() < catastrophe_prob:
                N = int(N * (1 - catastrophe_severity))
            trajectories[sim, yr] = N

    return trajectories

np.random.seed(42)
years = 100
n_sims = 500
N0 = 50000  # initial population

scenarios = {
    'Status quo (stable)':     dict(growth_rate=0.02, env_sd=0.05, catastrophe_prob=0.02, catastrophe_severity=0.3),
    'Tourism pressure':        dict(growth_rate=0.00, env_sd=0.08, catastrophe_prob=0.05, catastrophe_severity=0.2),
    'Climate change':          dict(growth_rate=-0.01, env_sd=0.10, catastrophe_prob=0.03, catastrophe_severity=0.4),
    'Active conservation':     dict(growth_rate=0.03, env_sd=0.04, catastrophe_prob=0.01, catastrophe_severity=0.2),
}

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
colors = ['#10b981', '#f59e0b', '#f87171', '#60a5fa']

print("Population Viability Analysis — Dzukou Lily")
print("=" * 55)

for idx, (name, params) in enumerate(scenarios.items()):
    ax = axes[idx // 2][idx % 2]
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

    trajs = run_pva(N0, years, n_sims=n_sims, **params)

    # Plot sample trajectories
    for i in range(min(50, n_sims)):
        ax.plot(range(years+1), trajs[i], color=colors[idx], alpha=0.05, linewidth=0.5)

    # Plot median and percentiles
    median = np.median(trajs, axis=0)
    p10 = np.percentile(trajs, 10, axis=0)
    p90 = np.percentile(trajs, 90, axis=0)
    ax.plot(range(years+1), median, color=colors[idx], linewidth=2.5, label='Median')
    ax.fill_between(range(years+1), p10, p90, alpha=0.2, color=colors[idx], label='10-90th %ile')

    extinct_count = np.sum(trajs[:, -1] == 0)
    extinct_pct = extinct_count / n_sims * 100

    ax.set_title(f'{name}', color='white', fontsize=12, fontweight='bold')
    ax.set_xlabel('Year', color='white', fontsize=10)
    ax.set_ylabel('Population', color='white', fontsize=10)
    ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

    status = "SAFE" if extinct_pct < 5 else "AT RISK" if extinct_pct < 20 else "ENDANGERED"
    print(f"  {name:25s} | Extinction: {extinct_pct:5.1f}% | Median final: {median[-1]:>8,.0f} | {status}")

plt.suptitle('Dzukou Lily — 100-Year Population Viability', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()`,
      challenge: 'Add a 5th scenario: "Protected reserve + climate change" where growth_rate=-0.005 but catastrophe_prob is reduced to 0.01 by active management. Does protection offset climate effects?',
      successHint: 'You have built a real conservation tool. PVA is used by the IUCN to classify species as Vulnerable, Endangered, or Critically Endangered. The method you just coded is the same one used to decide whether to list the Dzukou Lily as protected.',
    },
    {
      title: 'Adaptive trait simulation — evolving UV resistance',
      concept: `**Natural selection** acts on variation. In a population of lilies, some individuals produce more anthocyanins (better UV protection) and some produce less (save energy for growth).

We can simulate this with an **agent-based model** where each plant has:
- A **genotype** (inherited anthocyanin production level)
- A **fitness** that depends on UV exposure and anthocyanin level
- **Reproduction** proportional to fitness (more fit → more offspring)
- **Mutation** (small random changes in offspring genotype)

Over generations, the population should evolve toward the optimal anthocyanin level for its altitude.

📚 *Agent-based models simulate individual entities with their own properties. Each "agent" (plant) follows simple rules, but complex population-level patterns emerge.*`,
      analogy: 'Imagine a classroom where students take a test (UV exposure). Students who studied the right amount (optimal anthocyanins) score well. Those who studied too little (low pigment) fail from UV damage. Those who studied too much (high pigment) pass but had no time for other subjects (growth). The next generation of students inherits study habits from the top scorers. Over many generations, the class converges on the optimal study time.',
      storyConnection: 'The Dzukou Lily we see today is the product of thousands of generations of this exact selection process. Its anthocyanin level is not random — it has been precisely tuned by evolution to match the UV conditions at 2,450 m in Nagaland.',
      checkQuestion: 'If UV levels increase due to ozone depletion, can the lily evolve fast enough to adapt?',
      checkAnswer: 'It depends on two factors: (1) the rate of UV increase vs the generation time of the lily (typically 3-5 years to reproductive maturity), and (2) the existing genetic variation in the population. If there are already individuals with higher anthocyanin production (standing variation), evolution can act quickly. If the population is genetically uniform (low variation), adaptation is slow. This is why maintaining genetic diversity is a conservation priority.',
      codeIntro: 'Simulate the evolution of UV resistance over 200 generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_evolution(n_plants, n_generations, uv_level, mutation_rate=0.05, mutation_size=0.5):
    """Simulate evolution of anthocyanin production."""
    # Each plant has an anthocyanin level (genotype)
    # Start with random variation around a low baseline
    population = np.random.normal(3.0, 1.0, n_plants)
    population = np.clip(population, 0, 20)

    history = {'mean': [], 'std': [], 'max': [], 'min': []}

    for gen in range(n_generations):
        # Fitness: balance UV protection vs growth cost
        # UV damage decreases with anthocyanin (sigmoid)
        uv_damage = 1 / (1 + np.exp(0.8 * (population - uv_level)))
        uv_survival = 1 - 0.9 * uv_damage  # high damage = low survival

        # Growth cost: anthocyanins use energy
        growth_cost = 1 - 0.03 * population  # 3% growth penalty per anthocyanin unit
        growth_cost = np.clip(growth_cost, 0.1, 1.0)

        # Total fitness = survival × growth
        fitness = uv_survival * growth_cost
        fitness = np.clip(fitness, 0, None)

        # Record stats
        history['mean'].append(np.mean(population))
        history['std'].append(np.std(population))
        history['max'].append(np.max(population))
        history['min'].append(np.min(population))

        # Selection: reproduce proportional to fitness
        probs = fitness / fitness.sum()
        parents = np.random.choice(len(population), size=n_plants, p=probs)
        offspring = population[parents]

        # Mutation
        mutants = np.random.random(n_plants) < mutation_rate
        offspring[mutants] += np.random.normal(0, mutation_size, mutants.sum())
        offspring = np.clip(offspring, 0, 20)

        population = offspring

    return history

# Run for different UV levels (different altitudes)
uv_scenarios = {
    'Sea level (UV=3)': 3,
    'Foothills (UV=5)': 5,
    'Dzukou 2450m (UV=8)': 8,
    'High alpine (UV=12)': 12,
}

n_gen = 200
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.5))
fig.patch.set_facecolor('#1f2937')
colors = ['#60a5fa', '#10b981', '#f59e0b', '#f87171']

for ax in [ax1, ax2]:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

for (name, uv), color in zip(uv_scenarios.items(), colors):
    h = simulate_evolution(500, n_gen, uv)
    ax1.plot(h['mean'], color=color, linewidth=2, label=name)
    ax1.fill_between(range(n_gen),
                     np.array(h['mean']) - np.array(h['std']),
                     np.array(h['mean']) + np.array(h['std']),
                     alpha=0.15, color=color)

ax1.set_xlabel('Generation', color='white', fontsize=11)
ax1.set_ylabel('Mean Anthocyanin Level', color='white', fontsize=11)
ax1.set_title('Evolution of UV Resistance', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Final distributions
for (name, uv), color in zip(uv_scenarios.items(), colors):
    h = simulate_evolution(500, n_gen, uv)
    final_mean = h['mean'][-1]
    final_std = h['std'][-1]
    x = np.linspace(0, 20, 200)
    y = np.exp(-0.5 * ((x - final_mean) / max(final_std, 0.1)) ** 2)
    ax2.plot(x, y, color=color, linewidth=2, label=f'{name}: μ={final_mean:.1f}')
    ax2.fill_between(x, y, alpha=0.15, color=color)

ax2.set_xlabel('Anthocyanin Level', color='white', fontsize=11)
ax2.set_ylabel('Frequency', color='white', fontsize=11)
ax2.set_title('Final Population Distributions', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()

print("\\nEvolution converges to optimal anthocyanin levels matching local UV:")
for (name, uv), color in zip(uv_scenarios.items(), colors):
    h = simulate_evolution(500, n_gen, uv)
    print(f"  {name:30s} → anthocyanin level: {h['mean'][-1]:.1f} (UV optimum: ~{uv:.0f})")`,
      challenge: 'Simulate sudden climate change: run 100 generations at UV=5, then abruptly shift to UV=10 for 100 more. How many generations does the population need to re-adapt? What happens if genetic variation (mutation_rate) is low?',
      successHint: 'You have simulated natural selection in action. The population self-organizes to match its environment, demonstrating how the Dzukou Lily\'s purple coloring is an evolutionary adaptation, not a coincidence.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Mathematical Ecology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib. Click to start.</p>
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
