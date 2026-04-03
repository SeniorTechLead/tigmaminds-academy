import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MishingFishLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone: Aquaculture Optimization Model — problem setup and growth dynamics',
      concept: `In this capstone project you will build a complete **Aquaculture Optimization Model** that determines the optimal combination of stocking density, feeding rate, and harvest timing for a fish pond.

This is a multi-objective optimization problem with three competing goals:
1. **Maximize total yield** (kg of fish harvested)
2. **Minimize feed cost** (the largest operating expense)
3. **Maintain water quality** (dissolved oxygen, ammonia)

The model combines everything from Level 3:
- **Von Bertalanffy growth** (from sustainable aquaculture lesson)
- **Carrying capacity constraints** (dissolved oxygen, ammonia)
- **Feed conversion ratio** (increases with stress from overcrowding)
- **Economic optimization** (revenue minus cost)

We start by building the core growth simulation engine. Each fish grows according to the von Bertalanffy function, but growth is modulated by:
- **Stocking density stress**: crowded fish grow slower
- **Feeding rate**: underfed fish grow slower; overfeeding wastes money and pollutes water
- **Temperature**: growth peaks at an optimal temperature and declines outside it
- **Dissolved oxygen**: low DO reduces appetite and growth

This first module builds the growth engine and validates it against expected biological patterns.`,
      analogy: 'Building an aquaculture model is like building a flight simulator. Each subsystem (growth, water quality, economics) must work correctly on its own before you integrate them. A pilot trusts the simulator because every instrument has been individually calibrated. We calibrate each model component before combining them into the full optimization.',
      storyConnection: 'The Mishing people manage their fisheries intuitively, adjusting their harvest based on water conditions, season, and fish behavior. This capstone formalizes that intuition into a mathematical model. The inputs are the same — water temperature, fish density, food availability — but now we can explore thousands of scenarios computationally instead of waiting for generations of trial and error.',
      checkQuestion: 'Why must we model temperature effects on growth? Why not just use the standard von Bertalanffy function directly?',
      checkAnswer: 'Fish are ectotherms — their metabolic rate is directly controlled by water temperature. Growth rate can vary 3-5x between winter and summer. A model that ignores temperature will overpredict growth in cold months and underpredict in warm months. In Northeast India, seasonal temperature swings of 15-20 degrees C are common, making temperature the single largest driver of growth variation.',
      codeIntro: 'Build the core growth simulation engine with temperature and density effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ===== AQUACULTURE OPTIMIZATION MODEL — Module 1: Growth Engine =====

class FishGrowthModel:
    """Von Bertalanffy growth with environmental modifiers."""

    def __init__(self, L_inf=40.0, K=0.3, t0=-0.5,
                 weight_a=0.012, weight_b=3.0,
                 optimal_temp=28.0, temp_sigma=5.0):
        self.L_inf = L_inf      # asymptotic length (cm)
        self.K = K              # growth rate coefficient
        self.t0 = t0            # theoretical age at L=0
        self.weight_a = weight_a  # length-weight: W = a * L^b
        self.weight_b = weight_b
        self.optimal_temp = optimal_temp
        self.temp_sigma = temp_sigma

    def temperature_modifier(self, temp):
        """Gaussian reduction in growth rate away from optimal temperature."""
        return np.exp(-((temp - self.optimal_temp)**2) / (2 * self.temp_sigma**2))

    def density_modifier(self, density, max_density=25.0):
        """Linear reduction in growth with stocking density."""
        return np.clip(1.0 - 0.03 * density, 0.2, 1.0)

    def feeding_modifier(self, feeding_rate, optimal_rate=3.0):
        """Saturation curve: growth increases with feeding but plateaus."""
        return feeding_rate / (feeding_rate + optimal_rate)  # Michaelis-Menten

    def do_modifier(self, dissolved_oxygen, do_critical=3.0, do_optimal=7.0):
        """Growth reduction when DO is low."""
        if dissolved_oxygen >= do_optimal:
            return 1.0
        elif dissolved_oxygen <= do_critical:
            return 0.1
        else:
            return 0.1 + 0.9 * (dissolved_oxygen - do_critical) / (do_optimal - do_critical)

    def daily_growth(self, current_length, temperature, density, feeding_rate, do_level):
        """Compute one day of growth."""
        # Base von Bertalanffy daily increment
        base_dL = self.K * (self.L_inf - current_length) / 365  # daily

        # Apply modifiers
        temp_mod = self.temperature_modifier(temperature)
        dens_mod = self.density_modifier(density)
        feed_mod = self.feeding_modifier(feeding_rate)
        do_mod = self.do_modifier(do_level)

        total_modifier = temp_mod * dens_mod * feed_mod * do_mod
        return max(base_dL * total_modifier, 0)

    def length_to_weight(self, length):
        """Convert length to weight in grams."""
        return self.weight_a * max(length, 0)**self.weight_b

# Simulate growth over one year with seasonal temperature
model = FishGrowthModel()
days = 365
temperatures = 20 + 10 * np.sin(2 * np.pi * (np.arange(days) - 90) / 365)  # peaks in summer

# Test different conditions
conditions = [
    {'name': 'Optimal (low density, good feed, warm)', 'density': 3, 'feed': 4.0, 'do': 7.0},
    {'name': 'Moderate density', 'density': 10, 'feed': 3.0, 'do': 6.0},
    {'name': 'High density (stressed)', 'density': 20, 'feed': 3.0, 'do': 4.0},
    {'name': 'Underfed', 'density': 5, 'feed': 1.0, 'do': 7.0},
]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Aquaculture Growth Engine — Validation', color='white', fontsize=14)

colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']

# Plot 1: Length over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
for ci, cond in enumerate(conditions):
    lengths = [5.0]  # starting length (cm)
    for d in range(days):
        dL = model.daily_growth(lengths[-1], temperatures[d], cond['density'],
                                cond['feed'], cond['do'])
        lengths.append(lengths[-1] + dL)
    ax.plot(range(days+1), lengths, color=colors[ci], linewidth=2, label=cond['name'])
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Length (cm)', color='white')
ax.set_title('Fish length growth trajectories', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Weight over time
ax = axes[0, 1]
ax.set_facecolor('#111827')
for ci, cond in enumerate(conditions):
    lengths = [5.0]
    for d in range(days):
        dL = model.daily_growth(lengths[-1], temperatures[d], cond['density'],
                                cond['feed'], cond['do'])
        lengths.append(lengths[-1] + dL)
    weights = [model.length_to_weight(l) for l in lengths]
    ax.plot(range(days+1), weights, color=colors[ci], linewidth=2, label=cond['name'])
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Weight (g)', color='white')
ax.set_title('Fish weight growth trajectories', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Temperature and modifier over the year
ax = axes[1, 0]
ax.set_facecolor('#111827')
temp_mods = [model.temperature_modifier(t) for t in temperatures]
ax.plot(range(days), temperatures, color='#ef4444', linewidth=2, label='Temperature (C)')
ax2 = ax.twinx()
ax2.plot(range(days), temp_mods, color='#22c55e', linewidth=2, label='Growth modifier')
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Temperature (C)', color='#ef4444')
ax2.set_ylabel('Growth modifier', color='#22c55e')
ax.set_title('Seasonal temperature effect on growth', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 4: Modifier surfaces
ax = axes[1, 1]
ax.set_facecolor('#111827')
densities = np.linspace(0, 25, 50)
feeds = np.linspace(0, 8, 50)
D, F = np.meshgrid(densities, feeds)
growth_mod = np.zeros_like(D)
for i in range(len(feeds)):
    for j in range(len(densities)):
        dm = model.density_modifier(D[i, j])
        fm = model.feeding_modifier(F[i, j])
        growth_mod[i, j] = dm * fm
im = ax.contourf(D, F, growth_mod, levels=20, cmap='viridis')
plt.colorbar(im, ax=ax, label='Combined growth modifier')
ax.set_xlabel('Stocking density (fish/m3)', color='white')
ax.set_ylabel('Feeding rate (% body weight/day)', color='white')
ax.set_title('Density x Feeding interaction', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Growth Engine Validation:")
print(f"{'Condition':<40} {'Final length':>12} {'Final weight':>12}")
print("-" * 66)
for ci, cond in enumerate(conditions):
    lengths = [5.0]
    for d in range(days):
        dL = model.daily_growth(lengths[-1], temperatures[d], cond['density'],
                                cond['feed'], cond['do'])
        lengths.append(lengths[-1] + dL)
    final_w = model.length_to_weight(lengths[-1])
    print(f"{cond['name']:<40} {lengths[-1]:>10.1f} cm {final_w:>10.0f} g")
print()
print("Module 1 complete. Growth engine responds correctly to all modifiers.")
print("Next: water quality dynamics and feed economics.")`,
      challenge: 'Add a stochastic component: each day, temperature varies by +/- 2 degrees randomly. Run 50 simulations and plot the mean +/- standard deviation growth trajectory. How much uncertainty does daily temperature variation add to the final weight prediction?',
      successHint: 'A growth engine is the foundation of any aquaculture model. Every downstream calculation — feed requirement, harvest timing, economic projection — depends on accurate growth prediction. Getting this module right is worth more than getting the optimization algorithm right.',
    },
    {
      title: 'Capstone Module 2: Water quality dynamics — the hidden constraint',
      concept: `Water quality is the binding constraint in aquaculture. A pond can hold many fish, but the water can only support a limited biomass.

The two critical water quality parameters are:

**Dissolved Oxygen (DO)**:
- Fish consume O2 through respiration: DO_demand = biomass * metabolic_rate
- Oxygen enters through surface aeration and photosynthesis
- DO_supply = k_a * (DO_sat - DO) + photosynthesis
- When DO < 3 mg/L, fish stop feeding. Below 1 mg/L, mass mortality begins.

**Ammonia (NH3)**:
- Fish excrete ammonia as a metabolic waste product
- Ammonia_production = biomass * excretion_rate
- Nitrifying bacteria convert ammonia to nitrite then nitrate (the nitrogen cycle)
- Ammonia_removal = bacterial_rate * ammonia_concentration
- Toxic NH3 fraction depends on pH and temperature
- At NH3 > 0.05 mg/L, chronic stress begins. Above 0.5 mg/L, acute toxicity.

**Water exchange** dilutes both pollutants:
- daily_exchange_rate = fraction of pond volume replaced per day
- Higher exchange = better water quality but higher pumping cost

The water quality model runs alongside the growth model, creating a feedback loop: more fish produce more waste, which degrades water quality, which slows growth, which changes waste production.`,
      analogy: 'Water quality in a fish pond is like air quality in a submarine. The crew (fish) consumes oxygen and produces CO2 (ammonia). The scrubber system (bacteria, aeration) removes waste and replenishes oxygen. If you add more crew than the scrubber can handle, air quality degrades, people get sick, and they become less productive. The submarine has a hard crew limit set by its life support capacity, not its physical space.',
      storyConnection: 'The Mishing people fish in rivers — effectively infinite water exchange. This is why traditional river fishing has no water quality constraint. But when you move fish into a pond (aquaculture), you must replicate what the river does naturally: supply oxygen, remove waste, and maintain the chemical balance. The pond is an engineered river.',
      checkQuestion: 'Why is ammonia more toxic at higher pH and temperature? This is not just chemistry trivia — it directly affects stocking decisions.',
      checkAnswer: 'Ammonia exists in two forms: ionized (NH4+, relatively non-toxic) and un-ionized (NH3, highly toxic). The equilibrium shifts toward toxic NH3 at higher pH and temperature. At pH 7 and 20C, only 0.4% is toxic NH3. At pH 9 and 30C, it jumps to 36%. This means tropical aquaculture (warm water, often high pH from photosynthesis) has a much lower safe ammonia threshold than temperate systems. Stocking density must be lower in warm, alkaline water.',
      codeIntro: 'Build the water quality module and couple it with the growth engine to create a dynamic simulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ===== Module 2: Water Quality Dynamics =====

class WaterQualityModel:
    """Dissolved oxygen and ammonia dynamics in a fish pond."""

    def __init__(self, volume=1000, surface_area=500, depth=2.0):
        self.volume = volume        # m3
        self.surface_area = surface_area  # m2
        self.depth = depth          # m

        # DO parameters
        self.k_aeration = 0.5      # reaeration coefficient (day^-1)
        self.photosynthesis_rate = 3.0  # mg/L/day (daytime only)
        self.respiration_rate = 1.5    # mg/L/day (algae/bacteria at night)

        # Ammonia parameters
        self.excretion_rate = 0.03  # g NH3/kg fish/day
        self.nitrification_rate = 0.15  # fraction removed per day by bacteria

        # Temperature effects
        self.do_sat_20 = 9.1       # DO saturation at 20C (mg/L)

    def do_saturation(self, temp):
        """DO saturation decreases with temperature."""
        return self.do_sat_20 * np.exp(-0.0035 * (temp - 20))

    def metabolic_rate(self, temp, weight_g):
        """Oxygen consumption rate (mg O2/kg/hour)."""
        # Allometric scaling: smaller fish have higher mass-specific metabolism
        base_rate = 300 * (weight_g / 100)**(-0.2)  # mg O2/kg/hr
        # Temperature effect (Q10 = 2)
        q10_factor = 2**((temp - 20) / 10)
        return base_rate * q10_factor

    def ammonia_toxicity_fraction(self, pH, temp):
        """Fraction of total ammonia that is toxic NH3."""
        pKa = 0.09018 + 2729.92 / (temp + 273.15)
        fraction = 1 / (1 + 10**(pKa - pH))
        return fraction

    def simulate_day(self, do_current, nh3_current, biomass_kg,
                     avg_weight_g, temp, pH, feed_rate_pct,
                     water_exchange=0.1):
        """Simulate one day of water quality dynamics."""

        # --- Dissolved Oxygen ---
        do_sat = self.do_saturation(temp)

        # Aeration (surface gas exchange)
        aeration = self.k_aeration * (do_sat - do_current)

        # Photosynthesis (only effective during daylight ~ 12 hrs)
        photo = self.photosynthesis_rate * 0.5  # average over 24hr

        # Fish respiration (main O2 consumer)
        met_rate = self.metabolic_rate(temp, avg_weight_g)
        fish_respiration = met_rate * biomass_kg * 24 / 1000 / self.volume  # mg/L/day

        # Background respiration (sediment + bacteria)
        background = self.respiration_rate

        do_change = aeration + photo - fish_respiration - background
        do_new = max(do_current + do_change, 0)

        # Water exchange effect on DO
        do_new = do_new * (1 - water_exchange) + do_sat * water_exchange

        # --- Ammonia ---
        # Production from fish
        nh3_production = self.excretion_rate * biomass_kg / self.volume  # mg/L/day

        # Feed waste (uneaten feed decomposes)
        feed_waste = 0.005 * feed_rate_pct * biomass_kg / self.volume

        # Nitrification (bacterial removal)
        nitrification = self.nitrification_rate * nh3_current

        # Water exchange
        nh3_change = nh3_production + feed_waste - nitrification
        nh3_new = max(nh3_current + nh3_change, 0)
        nh3_new = nh3_new * (1 - water_exchange)

        # Toxic fraction
        toxic_fraction = self.ammonia_toxicity_fraction(pH, temp)
        toxic_nh3 = nh3_new * toxic_fraction

        return do_new, nh3_new, toxic_nh3

# Simulate water quality over a year with increasing fish biomass
wq = WaterQualityModel()
days = 365
temperatures = 20 + 10 * np.sin(2 * np.pi * (np.arange(days) - 90) / 365)

# Simulate 3 scenarios: low, medium, high stocking
scenarios = [
    {'name': 'Low density (3/m3)', 'n_fish': 3000, 'exchange': 0.1},
    {'name': 'Medium density (10/m3)', 'n_fish': 10000, 'exchange': 0.1},
    {'name': 'High density (20/m3)', 'n_fish': 20000, 'exchange': 0.1},
]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Water Quality Dynamics Module', color='white', fontsize=14)
colors = ['#22c55e', '#f59e0b', '#ef4444']

# Storage for all scenarios
all_do = []
all_nh3 = []
all_toxic = []

for si, scenario in enumerate(scenarios):
    do_vals = [8.0]  # starting DO
    nh3_vals = [0.01]  # starting ammonia
    toxic_vals = [0.0]

    # Fish grow over time (simplified)
    start_weight = 10.0  # grams
    for d in range(days):
        # Simple growth (weight doubles over year at optimal)
        current_weight = start_weight * np.exp(0.003 * d * (temperatures[d] / 28))
        biomass = scenario['n_fish'] * current_weight / 1000  # kg

        do_new, nh3_new, toxic_nh3 = wq.simulate_day(
            do_vals[-1], nh3_vals[-1], biomass, current_weight,
            temperatures[d], pH=7.5, feed_rate_pct=3.0,
            water_exchange=scenario['exchange']
        )
        do_vals.append(do_new)
        nh3_vals.append(nh3_new)
        toxic_vals.append(toxic_nh3)

    all_do.append(do_vals)
    all_nh3.append(nh3_vals)
    all_toxic.append(toxic_vals)

# Plot 1: DO over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
for si, scenario in enumerate(scenarios):
    ax.plot(range(days+1), all_do[si], color=colors[si], linewidth=1.5, label=scenario['name'])
ax.axhline(5.0, color='#f59e0b', linestyle='--', linewidth=1, label='Stress threshold')
ax.axhline(3.0, color='#ef4444', linestyle='--', linewidth=1, label='Critical DO')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Dissolved oxygen (mg/L)', color='white')
ax.set_title('Dissolved oxygen over time', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Ammonia over time
ax = axes[0, 1]
ax.set_facecolor('#111827')
for si, scenario in enumerate(scenarios):
    ax.plot(range(days+1), all_nh3[si], color=colors[si], linewidth=1.5, label=scenario['name'])
ax.axhline(1.0, color='#ef4444', linestyle='--', linewidth=1, label='Toxic threshold')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Total ammonia (mg/L)', color='white')
ax.set_title('Ammonia accumulation', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Toxic NH3 fraction
ax = axes[1, 0]
ax.set_facecolor('#111827')
for si, scenario in enumerate(scenarios):
    ax.plot(range(days+1), all_toxic[si], color=colors[si], linewidth=1.5, label=scenario['name'])
ax.axhline(0.05, color='#f59e0b', linestyle='--', linewidth=1, label='Chronic stress (0.05 mg/L)')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Toxic NH3 (mg/L)', color='white')
ax.set_title('Toxic ammonia (pH and temperature dependent)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Water exchange sensitivity
ax = axes[1, 1]
ax.set_facecolor('#111827')
exchange_rates = np.linspace(0.02, 0.3, 20)
final_do_10k = []
final_nh3_10k = []
for ex in exchange_rates:
    do_val = 8.0
    nh3_val = 0.01
    for d in range(days):
        cw = start_weight * np.exp(0.003 * d * (temperatures[d] / 28))
        biomass = 10000 * cw / 1000
        do_val, nh3_val, _ = wq.simulate_day(do_val, nh3_val, biomass, cw,
                                              temperatures[d], 7.5, 3.0, ex)
    final_do_10k.append(do_val)
    final_nh3_10k.append(nh3_val)

ax.plot(exchange_rates * 100, final_do_10k, color='#3b82f6', linewidth=2, label='Final DO')
ax2 = ax.twinx()
ax2.plot(exchange_rates * 100, final_nh3_10k, color='#ef4444', linewidth=2, label='Final NH3')
ax.axhline(5.0, color='#3b82f6', linestyle=':', alpha=0.5)
ax.set_xlabel('Water exchange rate (%/day)', color='white')
ax.set_ylabel('DO (mg/L)', color='#3b82f6')
ax2.set_ylabel('NH3 (mg/L)', color='#ef4444')
ax.set_title('Water exchange sensitivity (10 fish/m3)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Water Quality Summary at Day 365:")
print(f"{'Scenario':<30} {'Final DO':>10} {'Final NH3':>10} {'Toxic NH3':>10}")
print("-" * 62)
for si, scenario in enumerate(scenarios):
    print(f"{scenario['name']:<30} {all_do[si][-1]:>8.1f} mg/L {all_nh3[si][-1]:>8.2f} mg/L {all_toxic[si][-1]:>8.3f} mg/L")
print()
print("Module 2 complete. Water quality constrains viable stocking density.")
print("High density with low exchange leads to DO crash and ammonia buildup.")`,
      challenge: 'Add a "critical event" detector: when DO drops below 3 mg/L for 3 consecutive days, trigger a 20% mortality event. How does this change the long-term dynamics? Does the population self-correct (fewer fish = better water quality)?',
      successHint: 'Water quality is the invisible hand of aquaculture. You can stock as many fish as you want, but the water decides how many survive. This module is the reality check on all growth projections.',
    },
    {
      title: 'Capstone Module 3: Feed economics and harvest timing optimization',
      concept: `Feed is the largest cost in aquaculture (50-70% of operating expenses). Optimizing feed strategy is where the real money is made or lost.

**Feed conversion ratio (FCR)** is the key metric:
- FCR = kg feed consumed / kg fish weight gained
- A FCR of 1.5 means 1.5 kg of feed produces 1 kg of fish
- FCR increases with fish size (larger fish are less efficient converters)
- FCR increases with stocking density (stress reduces feed utilization)
- FCR increases with poor water quality (low DO = poor appetite)

**Harvest timing** is a classic optimization problem:
- Fish grow fastest when young (high marginal growth)
- Feed cost per kg gained increases as fish age (diminishing returns)
- Market price may depend on fish size (premium for larger fish)
- The optimal harvest time is when marginal revenue = marginal cost

**The economic model**:
- Revenue = total_weight * price_per_kg(weight)
- Cost = total_feed * feed_price + fixed_costs
- Profit = Revenue - Cost
- Marginal profit = d(Revenue)/dt - d(Cost)/dt
- Harvest when marginal profit = 0 (or turns negative)

This is the same calculus that determines when to harvest any crop. The biological growth curve meets the economic cost curve, and the intersection defines the optimal timing.`,
      analogy: 'Harvest timing is like deciding when to sell a stock. Holding longer means the stock might grow more (fish get bigger). But holding costs money (feed, electricity, labor), and the growth rate slows over time (diminishing marginal returns). The optimal sell time is not when the stock peaks — it is when the daily gain drops below the daily holding cost. Professional fish farmers think like financial traders.',
      storyConnection: 'The Mishing people harvest seasonally, timed to fish migration and breeding cycles. They do not harvest during spawning season (which would be like killing the golden goose). Their timing is optimized for sustainability across generations, not for single-season profit. The modern aquaculture model optimizes for economic return within one cycle, but must be constrained by sustainability considerations.',
      checkQuestion: 'A farmer can harvest at month 8 (fish average 300g, price $4/kg) or month 12 (fish average 500g, price $5/kg). Feed for the extra 4 months costs $2000. The pond has 5000 fish. When should the farmer harvest?',
      checkAnswer: 'At month 8: Revenue = 5000 * 0.3 kg * $4 = $6000. At month 12: Revenue = 5000 * 0.5 kg * $5 = $12,500. Extra revenue from waiting = $12,500 - $6,000 = $6,500. Extra cost = $2,000. Net gain from waiting = $4,500. The farmer should wait. But this ignores mortality risk, opportunity cost (could start a new cycle), and the time value of money. In practice, you need the full model.',
      codeIntro: 'Build the economic module and find the optimal harvest day using marginal analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ===== Module 3: Feed Economics & Harvest Optimization =====

class AquacultureEconomics:
    """Economic model for fish pond operations."""

    def __init__(self, n_fish, pond_volume, feed_price=1.5, fixed_daily_cost=20):
        self.n_fish = n_fish
        self.pond_volume = pond_volume
        self.feed_price = feed_price          # $/kg feed
        self.fixed_daily_cost = fixed_daily_cost  # $/day (labor, electricity)

    def market_price(self, avg_weight_g):
        """Price per kg depends on fish size (premium for larger fish)."""
        if avg_weight_g < 200:
            return 3.0   # small, low value
        elif avg_weight_g < 400:
            return 4.5   # medium, standard price
        elif avg_weight_g < 600:
            return 5.5   # large, premium
        else:
            return 6.0   # extra large

    def fcr(self, avg_weight_g, density, do_level):
        """Feed conversion ratio: increases with size, density, and poor water quality."""
        base_fcr = 1.2 + 0.001 * avg_weight_g  # larger fish = higher FCR
        density_penalty = 1 + 0.02 * density
        do_penalty = 1.0 if do_level > 5 else 1.5 if do_level > 3 else 2.5
        return base_fcr * density_penalty * do_penalty

    def daily_feed_cost(self, biomass_kg, avg_weight_g, density, do_level, feed_rate_pct):
        """Daily feed cost."""
        feed_kg = biomass_kg * feed_rate_pct / 100
        return feed_kg * self.feed_price

    def daily_revenue_rate(self, biomass_kg, avg_weight_g, growth_rate_g):
        """Marginal revenue: value of growth added today."""
        price = self.market_price(avg_weight_g)
        weight_gain_kg = self.n_fish * growth_rate_g / 1000
        return weight_gain_kg * price

# Run full simulation: growth + water quality + economics
from types import SimpleNamespace

def run_full_simulation(n_fish, pond_volume, feed_rate_pct, water_exchange,
                        days=540, start_weight_g=10):
    """Run integrated simulation returning daily data."""
    density = n_fish / pond_volume
    temperatures = 20 + 10 * np.sin(2 * np.pi * (np.arange(days) - 90) / 365)

    # Growth parameters
    L_inf, K, t0 = 40.0, 0.3, -0.5
    weight_a, weight_b = 0.012, 3.0
    opt_temp, temp_sigma = 28.0, 5.0

    econ = AquacultureEconomics(n_fish, pond_volume)

    # Initialize
    weight_g = start_weight_g
    length = (weight_g / weight_a)**(1/weight_b)
    do_level = 8.0
    nh3_level = 0.01

    data = {
        'weight': [], 'biomass': [], 'do': [], 'nh3': [],
        'daily_feed_cost': [], 'daily_revenue': [], 'daily_fixed': [],
        'cumulative_cost': [], 'cumulative_revenue': [],
        'marginal_profit': [], 'total_profit': [],
    }

    cum_cost = 0
    cum_revenue_if_harvested = 0

    for d in range(days):
        temp = temperatures[d % 365]

        # Growth modifiers
        temp_mod = np.exp(-((temp - opt_temp)**2) / (2 * temp_sigma**2))
        dens_mod = max(0.2, 1.0 - 0.03 * density)
        feed_mod = feed_rate_pct / (feed_rate_pct + 3.0)
        do_mod = 1.0 if do_level > 7 else max(0.1, (do_level - 3) / 4)

        # Daily growth
        dL = K * (L_inf - length) / 365 * temp_mod * dens_mod * feed_mod * do_mod
        length = length + max(dL, 0)
        new_weight = weight_a * max(length, 0)**weight_b
        growth_g = new_weight - weight_g
        weight_g = new_weight

        biomass_kg = n_fish * weight_g / 1000

        # Water quality (simplified)
        do_sat = 9.1 * np.exp(-0.0035 * (temp - 20))
        do_level = do_level + 0.5 * (do_sat - do_level) - 0.0005 * biomass_kg + 1.5 * 0.5 - 1.0
        do_level = max(do_level * (1 - water_exchange) + do_sat * water_exchange, 0.5)

        nh3_level = max(nh3_level + 0.03 * biomass_kg / pond_volume - 0.15 * nh3_level, 0)
        nh3_level *= (1 - water_exchange)

        # Economics
        feed_cost = econ.daily_feed_cost(biomass_kg, weight_g, density, do_level, feed_rate_pct)
        fixed_cost = econ.fixed_daily_cost
        cum_cost += feed_cost + fixed_cost

        price = econ.market_price(weight_g)
        current_value = biomass_kg * price
        marginal = econ.daily_revenue_rate(biomass_kg, weight_g, growth_g) - feed_cost - fixed_cost

        data['weight'].append(weight_g)
        data['biomass'].append(biomass_kg)
        data['do'].append(do_level)
        data['nh3'].append(nh3_level)
        data['daily_feed_cost'].append(feed_cost)
        data['daily_revenue'].append(current_value)
        data['daily_fixed'].append(fixed_cost)
        data['cumulative_cost'].append(cum_cost)
        data['total_profit'].append(current_value - cum_cost)
        data['marginal_profit'].append(marginal)

    for key in data:
        data[key] = np.array(data[key])
    return data

# Run simulation
sim = run_full_simulation(n_fish=5000, pond_volume=1000, feed_rate_pct=3.0,
                          water_exchange=0.1, days=540)

# Find optimal harvest day
optimal_day = np.argmax(sim['total_profit'])
# Also find when marginal profit first goes negative
marginal_zero = np.where(sim['marginal_profit'] < 0)[0]
marginal_day = marginal_zero[0] if len(marginal_zero) > 0 else len(sim['total_profit']) - 1

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Aquaculture Economics — Harvest Optimization', color='white', fontsize=14)

days_range = range(len(sim['weight']))

# Plot 1: Fish weight over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(days_range, sim['weight'], color='#22c55e', linewidth=2)
ax.axvline(optimal_day, color='#f59e0b', linestyle='--', label=f'Optimal harvest (day {optimal_day})')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Average weight (g)', color='white')
ax.set_title('Fish growth trajectory', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 2: Revenue vs Cost
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(days_range, sim['daily_revenue'], color='#22c55e', linewidth=2, label='Pond value')
ax.plot(days_range, sim['cumulative_cost'], color='#ef4444', linewidth=2, label='Cumulative cost')
ax.axvline(optimal_day, color='#f59e0b', linestyle='--')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('$ USD', color='white')
ax.set_title('Revenue vs cumulative cost', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 3: Total profit curve
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(days_range, sim['total_profit'], color='#a855f7', linewidth=2)
ax.axhline(0, color='gray', linestyle=':', linewidth=1)
ax.axvline(optimal_day, color='#f59e0b', linestyle='--', label=f'Max profit day {optimal_day}')
ax.scatter([optimal_day], [sim['total_profit'][optimal_day]], color='#f59e0b', s=100, zorder=5)
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Total profit ($)', color='white')
ax.set_title('Profit curve (harvest timing)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 4: Marginal profit (daily)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(days_range, sim['marginal_profit'], color='#3b82f6', linewidth=1.5)
ax.axhline(0, color='#ef4444', linestyle='--', linewidth=1)
ax.axvline(marginal_day, color='#f59e0b', linestyle='--', label=f'Marginal profit = 0 at day {marginal_day}')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Marginal profit ($/day)', color='white')
ax.set_title('Marginal profit (when to stop)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 5: Water quality
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(days_range, sim['do'], color='#3b82f6', linewidth=1.5, label='DO')
ax.axhline(5.0, color='#f59e0b', linestyle=':', linewidth=1, label='DO stress')
ax2 = ax.twinx()
ax2.plot(days_range, sim['nh3'], color='#ef4444', linewidth=1.5, label='NH3')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('DO (mg/L)', color='#3b82f6')
ax2.set_ylabel('NH3 (mg/L)', color='#ef4444')
ax.set_title('Water quality constraints', color='white', fontsize=10)
ax.legend(loc='upper left', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 6: Daily feed cost
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.plot(days_range, sim['daily_feed_cost'], color='#ef4444', linewidth=1.5)
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Daily feed cost ($)', color='white')
ax.set_title('Feed cost increases with biomass', color='white', fontsize=10)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Harvest Optimization Results:")
print(f"  Optimal harvest day: {optimal_day}")
print(f"  Fish weight at harvest: {sim['weight'][optimal_day]:.0f} g")
print(f"  Total biomass: {sim['biomass'][optimal_day]:.0f} kg")
print(f"  Cumulative cost: \${sim['cumulative_cost'][optimal_day]:.0f}")
print(f"  Revenue at harvest: \${sim['daily_revenue'][optimal_day]:.0f}")
print(f"  Maximum profit: \${sim['total_profit'][optimal_day]:.0f}")
print(f"  Marginal profit hits zero at day: {marginal_day}")`,
      challenge: 'Run the simulation for 3 different stocking densities (3, 8, 15 fish/m3) and find the optimal harvest day for each. Plot all three profit curves on one chart. Which density gives the highest total profit? Which gives the highest profit per fish?',
      successHint: 'This is the complete decision model: biology (growth) feeds into chemistry (water quality) feeds into economics (profit). Changing any input — stocking density, feed price, temperature — ripples through the entire system. This is why aquaculture management is hard and why models are valuable.',
    },
    {
      title: 'Capstone Module 4: Multi-parameter optimization — finding the global optimum',
      concept: `Now we combine all three modules into a single optimization. We want to find the combination of:
1. **Stocking density** (fish/m3)
2. **Feeding rate** (% body weight/day)
3. **Harvest day** (when to sell)

that maximizes profit subject to water quality constraints (DO > 3 mg/L, NH3 < 1 mg/L).

This is a **constrained optimization** problem. We use a **grid search** approach:
- Define a range for each parameter
- Simulate every combination
- Record profit and constraint violations
- Find the combination with maximum profit that satisfies all constraints

Grid search is brute-force but reliable. For 3 parameters with 20 values each, we need 20 x 20 x 20 = 8,000 simulations. Each simulation runs the full growth + water quality + economics pipeline.

More sophisticated approaches include:
- **Gradient descent**: follow the gradient of profit with respect to parameters
- **Genetic algorithms**: evolve a population of parameter combinations
- **Bayesian optimization**: use a surrogate model to guide the search

But grid search gives us the full landscape, showing how profit depends on each parameter and where constraints bite.`,
      analogy: 'Multi-parameter optimization is like tuning a guitar with three strings simultaneously. Each string (parameter) affects the overall sound (profit). You cannot tune one string at a time because they interact — tightening one changes the tension on the bridge, affecting the others. You need to find the combination where all three are in harmony. Grid search is like trying every possible tuning and picking the best one.',
      storyConnection: 'The Mishing people optimize their fishing practice across multiple dimensions simultaneously: trap design, placement, season, target species, water level, and harvest timing. They do not optimize one variable at a time — they consider the whole system. This capstone model does the same thing computationally.',
      checkQuestion: 'If the optimal stocking density assuming unlimited water exchange is 15 fish/m3, but your farm only has 5% daily water exchange, what happens to the true optimum?',
      checkAnswer: 'The true optimum drops significantly. With only 5% water exchange, high stocking density causes DO depletion and ammonia buildup, which reduces growth and increases mortality. The water quality constraint becomes binding before the economic optimum is reached. The constrained optimum might be 6-8 fish/m3 instead of 15. This is why you must model the constraints explicitly, not just the objective function.',
      codeIntro: 'Run a grid search over stocking density, feeding rate, and harvest day to find the global profit optimum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ===== Module 4: Multi-Parameter Optimization =====

def quick_simulate(n_fish_per_m3, feed_rate, harvest_day, pond_volume=1000):
    """Fast simulation for optimization grid search."""
    n_fish = int(n_fish_per_m3 * pond_volume)
    density = n_fish_per_m3
    days = min(harvest_day, 540)

    # Parameters
    L_inf, K, t0 = 40.0, 0.3, -0.5
    weight_a, weight_b = 0.012, 3.0

    weight_g = 10.0
    length = (weight_g / weight_a)**(1/weight_b)
    do_level = 8.0
    nh3_level = 0.01
    cum_cost = 0
    constraint_violated = False
    feed_price = 1.5
    fixed_daily = 20

    for d in range(days):
        temp = 20 + 10 * np.sin(2 * np.pi * (d - 90) / 365)

        # Growth
        temp_mod = np.exp(-((temp - 28)**2) / 50)
        dens_mod = max(0.2, 1.0 - 0.03 * density)
        feed_mod = feed_rate / (feed_rate + 3.0)
        do_mod = 1.0 if do_level > 7 else max(0.1, (do_level - 3) / 4)

        dL = K * (L_inf - length) / 365 * temp_mod * dens_mod * feed_mod * do_mod
        length += max(dL, 0)
        weight_g = weight_a * max(length, 0)**weight_b
        biomass_kg = n_fish * weight_g / 1000

        # Water quality
        do_sat = 9.1 * np.exp(-0.0035 * (temp - 20))
        do_level = do_level + 0.5 * (do_sat - do_level) - 0.0005 * biomass_kg + 0.25
        do_level = max(do_level * 0.9 + do_sat * 0.1, 0.5)

        nh3_level = max(nh3_level + 0.03 * biomass_kg / pond_volume - 0.15 * nh3_level, 0)
        nh3_level *= 0.9

        if do_level < 3.0 or nh3_level > 1.0:
            constraint_violated = True

        # Costs
        feed_cost = biomass_kg * feed_rate / 100 * feed_price
        cum_cost += feed_cost + fixed_daily

    # Revenue
    if weight_g < 200: price = 3.0
    elif weight_g < 400: price = 4.5
    elif weight_g < 600: price = 5.5
    else: price = 6.0

    revenue = biomass_kg * price
    profit = revenue - cum_cost

    return profit, constraint_violated, weight_g, biomass_kg, do_level, nh3_level

# Grid search
density_range = np.arange(1, 21, 1)      # fish/m3
feed_range = np.arange(1.0, 6.5, 0.5)    # % body weight/day
harvest_range = np.arange(180, 541, 30)   # days

print("Running grid search...")
print(f"  Densities: {len(density_range)} values ({density_range[0]}-{density_range[-1]})")
print(f"  Feed rates: {len(feed_range)} values ({feed_range[0]}-{feed_range[-1]})")
print(f"  Harvest days: {len(harvest_range)} values ({harvest_range[0]}-{harvest_range[-1]})")
print(f"  Total simulations: {len(density_range) * len(feed_range) * len(harvest_range)}")

results = []
best_profit = -np.inf
best_params = None

for dens in density_range:
    for feed in feed_range:
        for harvest in harvest_range:
            profit, violated, wt, bio, do_val, nh3_val = quick_simulate(dens, feed, harvest)
            results.append({
                'density': dens, 'feed': feed, 'harvest': harvest,
                'profit': profit, 'violated': violated, 'weight': wt,
                'biomass': bio, 'do': do_val, 'nh3': nh3_val
            })
            if not violated and profit > best_profit:
                best_profit = profit
                best_params = results[-1].copy()

# Extract data for visualization
all_density = np.array([r['density'] for r in results])
all_feed = np.array([r['feed'] for r in results])
all_harvest = np.array([r['harvest'] for r in results])
all_profit = np.array([r['profit'] for r in results])
all_violated = np.array([r['violated'] for r in results])

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Multi-Parameter Optimization Results', color='white', fontsize=14)

# Plot 1: Profit vs density (averaging over other params)
ax = axes[0, 0]
ax.set_facecolor('#111827')
mean_profit_by_density = []
for d in density_range:
    mask = (all_density == d) & (~all_violated)
    if mask.sum() > 0:
        mean_profit_by_density.append(all_profit[mask].mean())
    else:
        mean_profit_by_density.append(np.nan)
ax.plot(density_range, mean_profit_by_density, 'o-', color='#22c55e', linewidth=2)
ax.axvline(best_params['density'], color='#f59e0b', linestyle='--',
           label=f"Optimal: {best_params['density']}/m3")
ax.set_xlabel('Stocking density (fish/m3)', color='white')
ax.set_ylabel('Mean feasible profit ($)', color='white')
ax.set_title('Profit vs density', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Profit vs feed rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
mean_profit_by_feed = []
for f in feed_range:
    mask = (all_feed == f) & (~all_violated)
    if mask.sum() > 0:
        mean_profit_by_feed.append(all_profit[mask].mean())
    else:
        mean_profit_by_feed.append(np.nan)
ax.plot(feed_range, mean_profit_by_feed, 'o-', color='#3b82f6', linewidth=2)
ax.axvline(best_params['feed'], color='#f59e0b', linestyle='--',
           label=f"Optimal: {best_params['feed']}%")
ax.set_xlabel('Feed rate (% body weight/day)', color='white')
ax.set_ylabel('Mean feasible profit ($)', color='white')
ax.set_title('Profit vs feed rate', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Profit vs harvest day
ax = axes[0, 2]
ax.set_facecolor('#111827')
mean_profit_by_harvest = []
for h in harvest_range:
    mask = (all_harvest == h) & (~all_violated)
    if mask.sum() > 0:
        mean_profit_by_harvest.append(all_profit[mask].mean())
    else:
        mean_profit_by_harvest.append(np.nan)
ax.plot(harvest_range, mean_profit_by_harvest, 'o-', color='#a855f7', linewidth=2)
ax.axvline(best_params['harvest'], color='#f59e0b', linestyle='--',
           label=f"Optimal: day {best_params['harvest']}")
ax.set_xlabel('Harvest day', color='white')
ax.set_ylabel('Mean feasible profit ($)', color='white')
ax.set_title('Profit vs harvest timing', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Density x Feed heatmap (at optimal harvest day)
ax = axes[1, 0]
ax.set_facecolor('#111827')
opt_h = best_params['harvest']
profit_grid = np.full((len(feed_range), len(density_range)), np.nan)
for r in results:
    if r['harvest'] == opt_h and not r['violated']:
        fi = np.where(feed_range == r['feed'])[0][0]
        di = np.where(density_range == r['density'])[0][0]
        profit_grid[fi, di] = r['profit']
im = ax.imshow(profit_grid, origin='lower', aspect='auto', cmap='viridis',
               extent=[density_range[0], density_range[-1], feed_range[0], feed_range[-1]])
plt.colorbar(im, ax=ax, label='Profit ($)')
ax.plot(best_params['density'], best_params['feed'], 'r*', markersize=15)
ax.set_xlabel('Stocking density (fish/m3)', color='white')
ax.set_ylabel('Feed rate (%/day)', color='white')
ax.set_title(f'Profit heatmap (harvest day {opt_h})', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 5: Constraint violation map
ax = axes[1, 1]
ax.set_facecolor('#111827')
violation_grid = np.zeros((len(feed_range), len(density_range)))
for r in results:
    if r['harvest'] == opt_h:
        fi = np.where(feed_range == r['feed'])[0][0]
        di = np.where(density_range == r['density'])[0][0]
        if r['violated']:
            violation_grid[fi, di] = 1
im = ax.imshow(violation_grid, origin='lower', aspect='auto', cmap='RdYlGn_r',
               extent=[density_range[0], density_range[-1], feed_range[0], feed_range[-1]])
ax.set_xlabel('Stocking density (fish/m3)', color='white')
ax.set_ylabel('Feed rate (%/day)', color='white')
ax.set_title('Constraint violations (red = infeasible)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 6: Best solution summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
summary_text = f"""OPTIMAL SOLUTION

Stocking density:  {best_params['density']} fish/m3
Feed rate:         {best_params['feed']}% body weight/day
Harvest day:       {best_params['harvest']}

Fish weight:       {best_params['weight']:.0f} g
Total biomass:     {best_params['biomass']:.0f} kg
Final DO:          {best_params['do']:.1f} mg/L
Final NH3:         {best_params['nh3']:.2f} mg/L

PROFIT:            \${best_params['profit']:.0f}
Constraints:       All satisfied"""
ax.text(0.1, 0.9, summary_text, transform=ax.transAxes, fontsize=11,
        verticalalignment='top', fontfamily='monospace', color='#22c55e',
        bbox=dict(boxstyle='round', facecolor='#111827', edgecolor='#22c55e'))

plt.tight_layout()
plt.show()

# Print top 5 solutions
feasible = [r for r in results if not r['violated']]
feasible.sort(key=lambda x: x['profit'], reverse=True)
print("\\nTop 5 feasible solutions:")
print(f"{'Rank':<6} {'Density':>8} {'Feed%':>8} {'Harvest':>8} {'Profit':>10} {'Weight':>8}")
print("-" * 52)
for i, r in enumerate(feasible[:5]):
    print(f"{i+1:<6} {r['density']:>7}/m3 {r['feed']:>7.1f}% {r['harvest']:>7}d \${r['profit']:>9.0f} {r['weight']:>6.0f}g")`,
      challenge: 'Add a second objective: minimize environmental impact (total ammonia released over the cycle). Use the Pareto frontier concept — find all solutions where you cannot improve profit without worsening environmental impact and vice versa. Plot the Pareto frontier.',
      successHint: 'You have built a complete decision support system for aquaculture management. This is the kind of model that consulting firms charge thousands of dollars to build. The core skills — simulation, optimization, constraint handling — apply to any operational planning problem.',
    },
    {
      title: 'Capstone Module 5: Sensitivity analysis and Monte Carlo risk assessment',
      concept: `A model is only useful if you know when to trust it. **Sensitivity analysis** tells you which parameters matter most, and **Monte Carlo simulation** tells you how much uncertainty to expect.

**Sensitivity analysis** asks: if I change one input by 10%, how much does the output change?
- **High sensitivity**: small input change causes large output change. This parameter needs accurate measurement.
- **Low sensitivity**: output is robust to this input. Rough estimates are fine.
- The **tornado diagram** shows sensitivities of all parameters side by side.

**Monte Carlo simulation** asks: given uncertainty in all inputs simultaneously, what is the distribution of possible outcomes?
- Assign probability distributions to each uncertain input (temperature, feed price, mortality rate)
- Run thousands of simulations, each drawing random values
- Analyze the distribution of results: mean profit, 90% confidence interval, probability of loss

This is how real investment decisions are made. Instead of a single profit number, you get a probability distribution: "There is a 75% chance of profit between $5,000 and $15,000, and a 10% chance of losing money."

Every aquaculture project proposal should include a Monte Carlo risk assessment. A project that looks profitable on average might have a 30% chance of bankruptcy once you account for uncertainty.`,
      analogy: 'Sensitivity analysis is like a doctor checking which vital signs matter most for a diagnosis. Blood pressure might be critical; hair color is irrelevant. Monte Carlo simulation is like running the patient through 10,000 possible futures: some where they exercise, some where they do not, some where they catch a cold. The distribution of outcomes tells you the real prognosis, not just the single "most likely" trajectory.',
      storyConnection: 'The Mishing people have an implicit risk model. They fish in rivers (low investment, low risk) rather than building intensive ponds (high investment, high risk). They diversify across multiple trap locations and species. They adjust effort based on conditions. This is intuitive risk management. The Monte Carlo approach makes it quantitative.',
      checkQuestion: 'Your model predicts a mean profit of $10,000 with a standard deviation of $8,000. Should you invest?',
      checkAnswer: 'The coefficient of variation is 80% — extremely high risk. Assuming a normal distribution, there is about a 10% chance of losing $200 or more, and a 5% chance of losing $3,000+. Whether to invest depends on your risk tolerance. If this $10,000 investment represents your entire savings, absolutely not. If it is 1% of a diversified portfolio, the expected return might justify the risk. The mean alone tells you nothing about the decision.',
      codeIntro: 'Run a full Monte Carlo simulation and sensitivity analysis on the aquaculture model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ===== Module 5: Monte Carlo Risk Assessment =====

def simulate_with_uncertainty(params):
    """Run one simulation with uncertain parameters."""
    density = params['density']
    feed_rate = params['feed_rate']
    harvest_day = params['harvest_day']
    temp_offset = params.get('temp_offset', 0)
    feed_price = params.get('feed_price', 1.5)
    fish_price_mult = params.get('fish_price_mult', 1.0)
    mortality_rate = params.get('mortality_rate', 0.001)  # daily
    pond_volume = 1000

    n_fish = int(density * pond_volume)
    L_inf, K, t0 = 40.0, 0.3, -0.5
    weight_a, weight_b = 0.012, 3.0

    weight_g = 10.0
    length = (weight_g / weight_a)**(1/weight_b)
    do_level = 8.0
    nh3_level = 0.01
    cum_cost = 0
    alive = n_fish

    for d in range(harvest_day):
        temp = 20 + temp_offset + 10 * np.sin(2 * np.pi * (d - 90) / 365)

        # Mortality
        daily_deaths = int(alive * mortality_rate)
        if do_level < 3:
            daily_deaths += int(alive * 0.02)  # extra mortality from low DO
        alive = max(alive - daily_deaths, 0)

        current_density = alive / pond_volume

        # Growth
        temp_mod = np.exp(-((temp - 28)**2) / 50)
        dens_mod = max(0.2, 1.0 - 0.03 * current_density)
        feed_mod = feed_rate / (feed_rate + 3.0)
        do_mod = 1.0 if do_level > 7 else max(0.1, (do_level - 3) / 4)

        dL = K * (L_inf - length) / 365 * temp_mod * dens_mod * feed_mod * do_mod
        length += max(dL, 0)
        weight_g = weight_a * max(length, 0)**weight_b
        biomass_kg = alive * weight_g / 1000

        # Water quality
        do_sat = 9.1 * np.exp(-0.0035 * (temp - 20))
        do_level = do_level + 0.5 * (do_sat - do_level) - 0.0005 * biomass_kg + 0.25
        do_level = max(do_level * 0.9 + do_sat * 0.1, 0.5)
        nh3_level = max(nh3_level + 0.03 * biomass_kg / pond_volume - 0.15 * nh3_level, 0) * 0.9

        # Costs
        feed_cost = biomass_kg * feed_rate / 100 * feed_price
        cum_cost += feed_cost + 20  # fixed daily

    # Revenue
    if weight_g < 200: price = 3.0
    elif weight_g < 400: price = 4.5
    elif weight_g < 600: price = 5.5
    else: price = 6.0
    price *= fish_price_mult

    revenue = biomass_kg * price
    profit = revenue - cum_cost
    survival = alive / n_fish if n_fish > 0 else 0

    return profit, revenue, cum_cost, weight_g, survival

# Use optimal parameters from Module 4 as baseline
base_params = {
    'density': 8, 'feed_rate': 3.5, 'harvest_day': 360,
    'temp_offset': 0, 'feed_price': 1.5, 'fish_price_mult': 1.0,
    'mortality_rate': 0.001
}

# ===== Sensitivity Analysis =====
param_ranges = {
    'density': (4, 12),
    'feed_rate': (2.0, 5.0),
    'harvest_day': (240, 480),
    'temp_offset': (-5, 5),
    'feed_price': (1.0, 2.5),
    'fish_price_mult': (0.7, 1.3),
    'mortality_rate': (0.0005, 0.003),
}

sensitivities = {}
for param_name, (low, high) in param_ranges.items():
    params_low = base_params.copy()
    params_high = base_params.copy()
    params_low[param_name] = low
    params_high[param_name] = high
    profit_low = simulate_with_uncertainty(params_low)[0]
    profit_high = simulate_with_uncertainty(params_high)[0]
    sensitivities[param_name] = (profit_low, profit_high)

# ===== Monte Carlo Simulation =====
n_simulations = 2000
mc_profits = []
mc_revenues = []
mc_survivals = []

for _ in range(n_simulations):
    params = base_params.copy()
    params['density'] = np.random.uniform(6, 10)
    params['feed_rate'] = np.random.uniform(2.5, 4.5)
    params['harvest_day'] = int(np.random.uniform(300, 420))
    params['temp_offset'] = np.random.normal(0, 2)
    params['feed_price'] = np.random.uniform(1.0, 2.0)
    params['fish_price_mult'] = np.random.uniform(0.8, 1.2)
    params['mortality_rate'] = np.random.uniform(0.0005, 0.002)

    profit, revenue, cost, weight, survival = simulate_with_uncertainty(params)
    mc_profits.append(profit)
    mc_revenues.append(revenue)
    mc_survivals.append(survival)

mc_profits = np.array(mc_profits)
mc_revenues = np.array(mc_revenues)
mc_survivals = np.array(mc_survivals)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Risk Assessment: Sensitivity Analysis & Monte Carlo', color='white', fontsize=14)

# Plot 1: Tornado diagram
ax = axes[0, 0]
ax.set_facecolor('#111827')
base_profit = simulate_with_uncertainty(base_params)[0]
sorted_params = sorted(sensitivities.keys(),
                       key=lambda k: abs(sensitivities[k][1] - sensitivities[k][0]))
y_pos = range(len(sorted_params))
for i, param in enumerate(sorted_params):
    low_p, high_p = sensitivities[param]
    ax.barh(i, high_p - base_profit, left=base_profit, color='#22c55e', height=0.6, alpha=0.8)
    ax.barh(i, low_p - base_profit, left=base_profit, color='#ef4444', height=0.6, alpha=0.8)
ax.axvline(base_profit, color='white', linestyle='-', linewidth=1)
ax.set_yticks(y_pos)
ax.set_yticklabels(sorted_params, color='white', fontsize=8)
ax.set_xlabel('Profit ($)', color='white')
ax.set_title('Tornado Diagram (sensitivity)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 2: Profit distribution
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.hist(mc_profits, bins=40, color='#3b82f6', edgecolor='none', alpha=0.8)
ax.axvline(np.mean(mc_profits), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Mean: \${np.mean(mc_profits):.0f}')
ax.axvline(np.percentile(mc_profits, 10), color='#ef4444', linestyle='--', linewidth=1.5,
           label=f'P10: \${np.percentile(mc_profits, 10):.0f}')
ax.axvline(np.percentile(mc_profits, 90), color='#22c55e', linestyle='--', linewidth=1.5,
           label=f'P90: \${np.percentile(mc_profits, 90):.0f}')
ax.axvline(0, color='white', linestyle=':', linewidth=1)
ax.set_xlabel('Profit ($)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f'Profit distribution (n={n_simulations})', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Cumulative distribution
ax = axes[0, 2]
ax.set_facecolor('#111827')
sorted_profits = np.sort(mc_profits)
cumulative = np.arange(1, len(sorted_profits) + 1) / len(sorted_profits)
ax.plot(sorted_profits, cumulative, color='#a855f7', linewidth=2)
ax.axhline(0.5, color='gray', linestyle=':', linewidth=1)
ax.axvline(np.median(mc_profits), color='#f59e0b', linestyle='--',
           label=f'Median: \${np.median(mc_profits):.0f}')
prob_loss = (mc_profits < 0).mean()
ax.axvline(0, color='#ef4444', linestyle='--', label=f'P(loss): {prob_loss:.1%}')
ax.set_xlabel('Profit ($)', color='white')
ax.set_ylabel('Cumulative probability', color='white')
ax.set_title('Cumulative distribution function', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Profit vs survival scatter
ax = axes[1, 0]
ax.set_facecolor('#111827')
sc = ax.scatter(mc_survivals * 100, mc_profits, c=mc_profits, cmap='RdYlGn',
                s=10, alpha=0.5, edgecolors='none')
ax.set_xlabel('Survival rate (%)', color='white')
ax.set_ylabel('Profit ($)', color='white')
ax.set_title('Profit vs fish survival', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 5: Revenue vs Cost scatter
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.scatter(mc_revenues, mc_profits, c=mc_profits, cmap='RdYlGn',
           s=10, alpha=0.5, edgecolors='none')
ax.axhline(0, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Revenue ($)', color='white')
ax.set_ylabel('Profit ($)', color='white')
ax.set_title('Revenue vs profit', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 6: Risk summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
risk_text = f"""RISK ASSESSMENT SUMMARY

Monte Carlo: {n_simulations} simulations

Mean profit:     \${np.mean(mc_profits):>10,.0f}
Median profit:   \${np.median(mc_profits):>10,.0f}
Std deviation:   \${np.std(mc_profits):>10,.0f}

10th percentile: \${np.percentile(mc_profits, 10):>10,.0f}
25th percentile: \${np.percentile(mc_profits, 25):>10,.0f}
75th percentile: \${np.percentile(mc_profits, 75):>10,.0f}
90th percentile: \${np.percentile(mc_profits, 90):>10,.0f}

Probability of loss: {prob_loss:>8.1%}
Max loss:        \${mc_profits.min():>10,.0f}
Max profit:      \${mc_profits.max():>10,.0f}

CV (risk/return): {np.std(mc_profits)/abs(np.mean(mc_profits))*100:>7.0f}%"""

ax.text(0.1, 0.95, risk_text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', fontfamily='monospace', color='#22c55e',
        bbox=dict(boxstyle='round', facecolor='#111827', edgecolor='#22c55e'))

plt.tight_layout()
plt.show()

print("Capstone complete.")
print("You have built a full aquaculture optimization + risk model.")
print("This combines: growth biology, water chemistry, economics,")
print("optimization, and probabilistic risk assessment.")`,
      challenge: 'Add a "disease event" that has a 15% chance of occurring between days 150-250, killing 40% of fish. How does this change the profit distribution? What is the new probability of loss? Should the farmer buy insurance?',
      successHint: 'Congratulations — you have built a professional-grade decision support system. The same framework (simulation + optimization + Monte Carlo) is used in finance, manufacturing, energy, and healthcare. The fish pond is a microcosm of every complex system that requires balancing multiple objectives under uncertainty.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Aquaculture Optimization Model
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (computational biology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete aquaculture optimization model in Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
