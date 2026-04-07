import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TurtleSlowLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Kleiber\'s law — metabolic rate scales with body mass to the 3/4 power',
      concept: `One of the most universal patterns in biology is Kleiber's law: metabolic rate (B) scales with body mass (M) as B = B0 * M^(3/4). This 3/4 exponent appears across organisms from bacteria to whales, spanning 20 orders of magnitude in mass.

Why 3/4 and not 1 (linear) or 2/3 (surface area)? The surface area hypothesis predicted 2/3 because heat loss scales with surface area (M^(2/3)). But the empirical exponent is consistently closer to 3/4. The best explanation comes from **fractal network theory** (West, Brown, Enquist, 1997): organisms distribute resources through branching networks (blood vessels, bronchi, plant vasculature) that are space-filling fractals. The mathematics of optimal fractal distribution networks predicts exactly the 3/4 exponent.

For turtles, Kleiber's law explains why they can survive on so little food. A 5 kg turtle has a mass-specific metabolic rate about 60% lower than a 50 g mouse. This means less oxygen consumed, less food needed, less heat generated — and consequently slower movement, slower growth, but potentially much longer life.

The relationship is: BMR (watts) = 3.5 * M^0.75 (for reptiles at 25°C, roughly). A 5 kg turtle needs about 0.6 watts of continuous power — equivalent to a tiny LED bulb.`,
      analogy: 'Kleiber\'s law is like fuel efficiency in vehicles. A bus (large mass) uses more total fuel than a bicycle (small mass), but the bus uses far less fuel per passenger-mile. Similarly, a large turtle uses more total energy than a small lizard, but less energy per gram of body tissue. Size brings metabolic efficiency.',
      storyConnection: 'The slow turtle in our story is not lazy — she is metabolically efficient. Her low metabolic rate means she needs a fraction of the food a similarly-sized mammal would require. This efficiency is why she can undertake long journeys that would starve a faster-burning animal. Slowness is the price of endurance.',
      checkQuestion: 'A 100 g lizard has a metabolic rate of 0.1 watts. Using Kleiber\'s law (exponent 0.75), predict the metabolic rate of a 10 kg turtle (100x heavier).',
      checkAnswer: 'B_turtle / B_lizard = (M_turtle / M_lizard)^0.75 = 100^0.75 = 31.6. So B_turtle = 0.1 * 31.6 = 3.16 watts. The turtle is 100x heavier but only uses 31.6x more energy — a 68% savings in mass-specific metabolic rate. This is the power of Kleiber\'s law: bigger animals are disproportionately more energy-efficient.',
      codeIntro: 'Verify Kleiber\'s law with cross-species metabolic data and explore its implications for turtles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Cross-species metabolic data (approximate values)
species_data = {
    'Bacteria': (1e-12, 1e-13), 'Protozoa': (1e-8, 1e-9),
    'Ant': (1e-3, 5e-4), 'Bee': (0.1, 0.01), 'Mouse': (0.03, 0.3),
    'Lizard': (0.1, 0.08), 'Frog': (0.05, 0.04),
    'Turtle (small)': (0.5, 0.15), 'Turtle (large)': (5, 0.6),
    'Rabbit': (2, 4.5), 'Cat': (4, 7), 'Dog': (15, 20),
    'Sheep': (50, 50), 'Human': (70, 80), 'Horse': (500, 350),
    'Cow': (700, 450), 'Elephant': (4000, 2000), 'Whale': (100000, 30000),
}

masses = np.array([v[0] for v in species_data.values()])
bmrs = np.array([v[1] for v in species_data.values()])
names = list(species_data.keys())

# Fit Kleiber's law: log(B) = log(B0) + alpha * log(M)
log_m = np.log10(masses)
log_b = np.log10(bmrs)
alpha, log_b0 = np.polyfit(log_m, log_b, 1)
b0 = 10**log_b0

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Kleiber's law
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Color by type
reptile_idx = [i for i, n in enumerate(names) if 'Turtle' in n or 'Lizard' in n or 'Frog' in n]
mammal_idx = [i for i, n in enumerate(names) if i not in reptile_idx and i > 3]
other_idx = [i for i in range(len(names)) if i not in reptile_idx and i not in mammal_idx]

ax.scatter(masses[mammal_idx], bmrs[mammal_idx], s=40, c='#3b82f6', label='Mammals', zorder=5)
ax.scatter(masses[reptile_idx], bmrs[reptile_idx], s=60, c='#22c55e', marker='s', label='Reptiles', zorder=5)
ax.scatter(masses[other_idx], bmrs[other_idx], s=30, c='#94a3b8', label='Other', zorder=5)

# Fit line
m_range = np.logspace(-13, 6, 100)
ax.plot(m_range, b0 * m_range**alpha, color='#f59e0b', linewidth=2, label=f'Fit: B = {b0:.2e} × M^{alpha:.3f}')
ax.plot(m_range, b0 * m_range**0.667, color='#ef4444', linewidth=1, linestyle='--', label='Surface area (M^0.67)')

ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Metabolic rate (watts)', color='white')
ax.set_title(f"Kleiber's law: exponent = {alpha:.3f}", color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Mass-specific metabolic rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
specific_bmr = bmrs / masses  # watts per kg
ax.scatter(masses[mammal_idx], specific_bmr[mammal_idx], s=40, c='#3b82f6', label='Mammals')
ax.scatter(masses[reptile_idx], specific_bmr[reptile_idx], s=60, c='#22c55e', marker='s', label='Reptiles')
ax.plot(m_range, b0 * m_range**(alpha-1), color='#f59e0b', linewidth=2)
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Specific BMR (W/kg)', color='white')
ax.set_title('Bigger = more efficient (per gram)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Turtle vs mammal comparison
ax = axes[0, 2]
ax.set_facecolor('#111827')
comparison_masses = [0.5, 1, 5, 10, 50]
turtle_bmr = [b0 * m**alpha * 0.15 for m in comparison_masses]  # reptile factor ~0.15x mammal
mammal_bmr = [b0 * m**alpha for m in comparison_masses]
x = np.arange(len(comparison_masses))
ax.bar(x - 0.2, mammal_bmr, 0.35, color='#3b82f6', label='Mammal')
ax.bar(x + 0.2, turtle_bmr, 0.35, color='#22c55e', label='Turtle')
ax.set_xticks(x)
ax.set_xticklabels([f'{m}kg' for m in comparison_masses], color='white')
ax.set_ylabel('BMR (watts)', color='white')
ax.set_title('Turtle vs mammal metabolic rate', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Energy budget over a year
ax = axes[1, 0]
ax.set_facecolor('#111827')
turtle_mass = 5  # kg
days = np.arange(365)
# Turtles slow down in winter
activity_factor = 0.5 + 0.5 * np.sin(2 * np.pi * (days - 80) / 365)
activity_factor = np.maximum(activity_factor, 0.1)
daily_energy_kJ = b0 * turtle_mass**alpha * 0.15 * activity_factor * 86400 / 1000
cumulative_kJ = np.cumsum(daily_energy_kJ)
ax.plot(days, daily_energy_kJ, color='#22c55e', linewidth=2, label='Daily cost')
ax2 = ax.twinx()
ax2.plot(days, cumulative_kJ / 1000, color='#f59e0b', linewidth=2, label='Cumulative (MJ)')
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Daily energy (kJ)', color='#22c55e')
ax2.set_ylabel('Cumulative (MJ)', color='#f59e0b')
ax.set_title('Annual energy budget (5 kg turtle)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 5: Food requirement comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
animals = ['Mouse\\n(30g)', 'Lizard\\n(100g)', 'Turtle\\n(5kg)', 'Cat\\n(4kg)', 'Human\\n(70kg)']
# grams of food per day per kg body mass
food_per_kg = [15, 3, 1.5, 5, 3.5]
colors_food = ['#3b82f6', '#22c55e', '#22c55e', '#3b82f6', '#3b82f6']
ax.bar(animals, food_per_kg, color=colors_food, width=0.6)
ax.set_ylabel('g food per kg body mass per day', color='white')
ax.set_title('Food efficiency: turtles win', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Residual analysis (how far each species deviates from the fit)
ax = axes[1, 2]
ax.set_facecolor('#111827')
predicted = b0 * masses**alpha
residuals = np.log10(bmrs / predicted)
colors_res = ['#22c55e' if i in reptile_idx else '#3b82f6' if i in mammal_idx else '#94a3b8' for i in range(len(names))]
ax.barh(range(len(names)), residuals, color=colors_res, height=0.7)
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, fontsize=7, color='white')
ax.axvline(0, color='gray', linewidth=1)
ax.set_xlabel('log10(observed/predicted)', color='white')
ax.set_title("Deviations from Kleiber's law", color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Kleiber's law fit: B = {b0:.2e} * M^{alpha:.3f}")
print(f"  Theoretical exponent: 0.750")
print(f"  Fitted exponent: {alpha:.3f}")
print(f"  R² = {np.corrcoef(log_m, log_b)[0,1]**2:.4f}")
print(f"\\n5 kg turtle vs 5 kg mammal:")
print(f"  Mammal BMR: {b0 * 5**alpha:.2f} W")
print(f"  Turtle BMR: {b0 * 5**alpha * 0.15:.2f} W (reptile ~15% of mammal)")
print(f"  Turtle needs {(1/0.15-1)*100:.0f}% less food per day")`,
      challenge: 'The 3/4 exponent predicts that heart rate also scales as M^(-1/4). Verify this by looking up heart rates for animals of different sizes. Does the prediction hold? What does this imply about total lifetime heartbeats?',
      successHint: 'Kleiber\'s law is one of the most important patterns in biology. It connects ecology, physiology, and evolutionary theory. The same scaling laws predict population density, forest tree size distributions, and even city infrastructure needs.',
    },
    {
      title: 'Rate of living theory — why slow metabolism predicts long life',
      concept: `The rate of living theory proposes that organisms have a roughly fixed amount of metabolic energy to spend over a lifetime. Faster metabolism burns through this budget quickly (short life); slower metabolism stretches it out (long life). This is formalized as:

Lifetime energy expenditure = BMR * lifespan ≈ constant (per gram of tissue)

For mammals, lifetime energy per gram is roughly 1200 kJ/g. A mouse (lifespan ~2 years, BMR ~0.5 W/g) burns through this in 2 years. An elephant (lifespan ~70 years, BMR ~0.003 W/g) takes 70 years to spend the same budget.

Turtles break this pattern spectacularly. A Galápagos tortoise can live 175+ years with a metabolic rate that implies a lifetime expenditure far exceeding the mammalian "constant." How? The theory is incomplete. Additional factors include:

- **Oxidative damage**: higher metabolism produces more reactive oxygen species (ROS), accelerating cellular damage. Turtles have excellent antioxidant defenses.
- **Telomere dynamics**: turtle telomeres show negligible shortening — their cells do not "count" divisions the way mammalian cells do.
- **Negligible senescence**: some turtles show no increase in mortality rate with age. They do not age in the mammalian sense.`,
      analogy: 'The rate of living theory is like a candle. A thin candle (high surface area to volume, like a mouse) burns brightly but briefly. A thick candle (low ratio, like a turtle) burns dimly but lasts much longer. But turtles are like a candle made of extra-durable wax — they last even longer than their burning rate predicts.',
      storyConnection: 'The story asks "why is the turtle slow?" The deep answer is: because slowness and longevity are two sides of the same metabolic coin. The turtle is slow because she burns energy slowly, and she lives long because she burns energy slowly. Her pace is not a limitation but a life-extension strategy written into her biochemistry.',
      checkQuestion: 'If the rate of living theory were perfectly true, and you doubled a turtle\'s metabolic rate (by keeping it at a higher temperature), what would happen to its lifespan?',
      checkAnswer: 'Its lifespan would halve. The total lifetime energy expenditure is roughly constant, so doubling the rate of spending cuts the time in half. In practice, ectotherms kept at higher temperatures do tend to live shorter lives — but the relationship is not perfectly inverse because repair mechanisms also speed up with temperature. The theory gives the right direction but overestimates the effect.',
      codeIntro: 'Analyze the rate of living theory across species and explore the turtle longevity anomaly.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Species data: (mass_kg, bmr_watts, lifespan_years, type)
species = [
    ('Shrew', 0.003, 0.035, 1.5, 'mammal'),
    ('Mouse', 0.03, 0.3, 2.5, 'mammal'),
    ('Hamster', 0.12, 0.8, 3, 'mammal'),
    ('Rat', 0.3, 1.5, 3.5, 'mammal'),
    ('Rabbit', 2, 4.5, 9, 'mammal'),
    ('Cat', 4, 7, 15, 'mammal'),
    ('Dog', 15, 20, 12, 'mammal'),
    ('Sheep', 50, 50, 12, 'mammal'),
    ('Human', 70, 80, 79, 'mammal'),
    ('Horse', 500, 350, 30, 'mammal'),
    ('Elephant', 4000, 2000, 70, 'mammal'),
    ('Bowhead whale', 80000, 25000, 200, 'mammal'),
    ('Green anole', 0.005, 0.002, 5, 'reptile'),
    ('Gecko', 0.05, 0.01, 15, 'reptile'),
    ('Iguana', 2, 0.4, 20, 'reptile'),
    ('Box turtle', 0.5, 0.05, 100, 'reptile'),
    ('Sea turtle', 150, 8, 80, 'reptile'),
    ('Galapagos tortoise', 250, 10, 175, 'reptile'),
    ('Tuatara', 0.5, 0.03, 100, 'reptile'),
    ('Crocodile', 200, 15, 70, 'reptile'),
]

names = [s[0] for s in species]
masses = np.array([s[1] for s in species])
bmrs = np.array([s[2] for s in species])
lifespans = np.array([s[3] for s in species])
types = [s[4] for s in species]

# Derived quantities
specific_bmr = bmrs / masses  # W/kg
lifetime_energy = bmrs * lifespans * 365.25 * 24 * 3600 / 1000  # kJ total
lifetime_energy_per_kg = lifetime_energy / masses  # kJ/kg

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

mammal_mask = np.array([t == 'mammal' for t in types])
reptile_mask = ~mammal_mask

# Plot 1: Specific BMR vs lifespan (rate of living test)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(specific_bmr[mammal_mask], lifespans[mammal_mask], s=50, c='#3b82f6', label='Mammals')
ax.scatter(specific_bmr[reptile_mask], lifespans[reptile_mask], s=50, c='#22c55e', marker='s', label='Reptiles')
# Fit inverse relationship for mammals
m_fit = np.polyfit(np.log10(specific_bmr[mammal_mask]), np.log10(lifespans[mammal_mask]), 1)
x_fit = np.logspace(-1, 2, 50)
ax.plot(x_fit, 10**(m_fit[1]) * x_fit**m_fit[0], '--', color='#3b82f6', linewidth=2)
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Specific BMR (W/kg)', color='white')
ax.set_ylabel('Lifespan (years)', color='white')
ax.set_title(f'Rate of living: slope = {m_fit[0]:.2f}', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Annotate turtles
for i in range(len(names)):
    if 'turtle' in names[i].lower() or 'tortoise' in names[i].lower() or 'Tuatara' in names[i]:
        ax.annotate(names[i], (specific_bmr[i], lifespans[i]), fontsize=7,
                   color='#22c55e', xytext=(5, 5), textcoords='offset points')

# Plot 2: Lifetime energy per kg
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.scatter(masses[mammal_mask], lifetime_energy_per_kg[mammal_mask]/1e6, s=50, c='#3b82f6', label='Mammals')
ax.scatter(masses[reptile_mask], lifetime_energy_per_kg[reptile_mask]/1e6, s=50, c='#22c55e', marker='s', label='Reptiles')
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Lifetime energy (MJ/kg)', color='white')
ax.set_title('Lifetime energy budget per kg', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Longevity quotient (observed / predicted)
ax = axes[0, 2]
ax.set_facecolor('#111827')
# Predict lifespan from mass using mammal regression
pred_lifespan = 10**(m_fit[1]) * specific_bmr**m_fit[0]
lq = lifespans / pred_lifespan  # longevity quotient
sorted_idx = np.argsort(lq)
colors_lq = ['#22c55e' if reptile_mask[i] else '#3b82f6' for i in sorted_idx]
ax.barh(range(len(names)), lq[sorted_idx], color=colors_lq, height=0.7)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_idx], fontsize=7, color='white')
ax.axvline(1, color='#f59e0b', linewidth=2, linestyle='--', label='Expected')
ax.set_xlabel('Longevity quotient (observed/predicted)', color='white')
ax.set_title('Who lives longer than expected?', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Temperature effect on metabolic rate (Q10)
ax = axes[1, 0]
ax.set_facecolor('#111827')
temps = np.linspace(10, 40, 100)
Q10 = 2.5  # typical Q10 for reptiles
ref_bmr = 0.05  # watts for a small turtle at 25C
bmr_at_temp = ref_bmr * Q10**((temps - 25) / 10)
ax.plot(temps, bmr_at_temp, color='#22c55e', linewidth=2)
ax.fill_between(temps, bmr_at_temp, alpha=0.2, color='#22c55e')
ax.axvline(25, color='gray', linewidth=1, linestyle='--', label='Reference (25°C)')
ax.set_xlabel('Body temperature (°C)', color='white')
ax.set_ylabel('Metabolic rate (W)', color='white')
ax.set_title(f'Q10 effect: BMR doubles every 10°C (Q10={Q10})', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Predicted lifespan at different temperatures
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Assume rate-of-living: lifespan inversely proportional to BMR
ref_lifespan = 100  # years at 25°C
lifespan_at_temp = ref_lifespan * (ref_bmr / bmr_at_temp)
ax.plot(temps, lifespan_at_temp, color='#a855f7', linewidth=2)
ax.fill_between(temps, lifespan_at_temp, alpha=0.2, color='#a855f7')
ax.set_xlabel('Average body temperature (°C)', color='white')
ax.set_ylabel('Predicted lifespan (years)', color='white')
ax.set_title('Rate of living prediction', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.annotate(f'At 20°C: {ref_lifespan * Q10**(5/10):.0f} yrs', (20, ref_lifespan * Q10**(5/10)),
           fontsize=9, color='#22c55e')
ax.annotate(f'At 30°C: {ref_lifespan / Q10**(5/10):.0f} yrs', (30, ref_lifespan / Q10**(5/10)),
           fontsize=9, color='#ef4444')

# Plot 6: Heartbeat lifetime budget
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Heart rate scales as M^(-0.25)
heart_rates = 200 * masses**(-0.25)  # beats per minute (approximate)
total_beats = heart_rates * 60 * 24 * 365 * lifespans / 1e9  # billions
ax.scatter(masses[mammal_mask], total_beats[mammal_mask], s=50, c='#3b82f6', label='Mammals')
ax.scatter(masses[reptile_mask], total_beats[reptile_mask], s=50, c='#22c55e', marker='s', label='Reptiles')
ax.axhline(np.mean(total_beats[mammal_mask]), color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Mammal mean: {np.mean(total_beats[mammal_mask]):.1f}B')
ax.set_xscale('log')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Lifetime heartbeats (billions)', color='white')
ax.set_title('Total heartbeats ≈ constant?', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Rate of living analysis:")
print(f"  Mammal trend: lifespan ~ BMR^{m_fit[0]:.2f} (expect -1.0)")
print(f"  Turtle longevity quotients:")
for i in range(len(names)):
    if 'turtle' in names[i].lower() or 'tortoise' in names[i].lower():
        print(f"    {names[i]}: LQ = {lq[i]:.1f}x (lives {lq[i]:.1f}x longer than predicted)")
print(f"  Mammal lifetime heartbeats: {np.mean(total_beats[mammal_mask]):.1f} billion (mean)")`,
      challenge: 'Add birds to the dataset (parrots live 80+ years, hummingbirds only 5). Birds have high metabolic rates but some are extremely long-lived. Does the rate of living theory explain bird longevity? What additional factor might be needed?',
      successHint: 'The rate of living theory is a useful approximation but not the full story. Modern longevity research focuses on DNA repair efficiency, telomere biology, and oxidative stress resistance. Turtles excel at all three, which is why they outlive even the rate-of-living prediction.',
    },
    {
      title: 'Energy efficiency of locomotion — why walking slowly can be optimal',
      concept: `Every form of locomotion has an energy cost that depends on speed. The **cost of transport (COT)** is the energy required to move one kilogram of body mass one meter:

COT (J/kg/m) = metabolic_power / (mass * speed)

For most animals, COT follows a U-shaped curve: very slow speeds are inefficient (high fixed costs spread over little distance), very fast speeds are inefficient (aerodynamic drag, muscle inefficiency at high power), and there is an **optimal speed** that minimizes COT.

For turtles, the optimal speed is remarkably low because:
- Their rigid body plan (shell) eliminates the trunk flexion that aids locomotion in other reptiles
- Their limb geometry provides high torque at low speed but poor leverage for fast movement
- Their low metabolic rate means the fixed costs (maintaining posture, neural activity) are relatively low, shifting the optimal speed downward

The total cost of a journey = COT * mass * distance. At the optimal speed, total cost is minimized. Going faster wastes energy on inefficient locomotion. Going slower wastes energy on prolonged fixed costs. The turtle's characteristic slow, steady pace is the mathematical optimum for its body plan.`,
      analogy: 'COT is like fuel economy in a car. Driving at 30 km/h wastes fuel idling at low gear. Driving at 200 km/h wastes fuel fighting air resistance. The sweet spot for most cars is around 80-100 km/h. For a turtle, the "sweet spot" is much lower — like a heavy truck whose optimal speed is 60 km/h because it cannot efficiently overcome its own inertia at higher speeds.',
      storyConnection: 'The other animals in the story mock the turtle for being slow. But the turtle\'s pace is not a failure of effort — it is an optimization. At her preferred speed, she converts food into forward motion more efficiently than any of her faster critics. She will arrive later but having spent less energy getting there.',
      checkQuestion: 'A turtle walking at 0.1 m/s has a COT of 10 J/kg/m. At 0.3 m/s, the COT rises to 15 J/kg/m. For a 5 km journey, how much more energy does the faster speed cost?',
      checkAnswer: 'At 0.1 m/s: Energy = 10 * 5 * 5000 = 250,000 J = 250 kJ. At 0.3 m/s: Energy = 15 * 5 * 5000 = 375,000 J = 375 kJ. The faster speed costs 125 kJ more — a 50% energy penalty for tripling the speed. The time savings (50,000 s vs 16,667 s, saving ~9 hours) must be weighed against the 50% increase in food requirement. For an animal with limited food access, the slow speed is rational.',
      codeIntro: 'Model the cost of transport for different locomotion modes and find the turtle\'s optimal walking speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def cost_of_transport(speed, mass, mode='turtle'):
    """Cost of transport (J/kg/m) as function of speed."""
    if mode == 'turtle':
        # High fixed cost, moderate speed-dependent cost
        fixed = 8.0  # J/kg/m at optimal speed
        optimal_v = 0.08  # m/s
        # U-shaped: fixed/speed + drag*speed
        drag_coeff = 150  # accounts for shell drag and limb inefficiency
        cot = fixed * optimal_v / np.maximum(speed, 0.001) + drag_coeff * speed
        return cot
    elif mode == 'lizard':
        fixed = 5.0
        optimal_v = 0.5
        drag_coeff = 8
        return fixed * optimal_v / np.maximum(speed, 0.001) + drag_coeff * speed
    elif mode == 'mammal':
        # Based on Taylor et al. regression
        fixed = 3.5
        optimal_v = 1.5
        drag_coeff = 1.5
        return fixed * optimal_v / np.maximum(speed, 0.001) + drag_coeff * speed
    elif mode == 'bird_walking':
        fixed = 4.0
        optimal_v = 0.8
        drag_coeff = 3
        return fixed * optimal_v / np.maximum(speed, 0.001) + drag_coeff * speed

mass_turtle = 5  # kg
speeds = np.linspace(0.01, 2.0, 500)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: COT for turtle
ax = axes[0, 0]
ax.set_facecolor('#111827')
cot_turtle = cost_of_transport(speeds, mass_turtle, 'turtle')
ax.plot(speeds, cot_turtle, color='#22c55e', linewidth=2)
opt_idx = np.argmin(cot_turtle)
ax.plot(speeds[opt_idx], cot_turtle[opt_idx], 'o', color='#f59e0b', markersize=10,
        label=f'Optimal: {speeds[opt_idx]:.2f} m/s ({cot_turtle[opt_idx]:.1f} J/kg/m)')
ax.set_xlabel('Speed (m/s)', color='white')
ax.set_ylabel('COT (J/kg/m)', color='white')
ax.set_title('Turtle cost of transport', color='white', fontsize=11)
ax.set_ylim(0, 200)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Compare locomotion modes
ax = axes[0, 1]
ax.set_facecolor('#111827')
modes = [('turtle', '#22c55e', 'Turtle'), ('lizard', '#f59e0b', 'Lizard'),
         ('mammal', '#3b82f6', 'Mammal'), ('bird_walking', '#a855f7', 'Bird (walking)')]
for mode, clr, name in modes:
    cot = cost_of_transport(speeds, 5, mode)
    ax.plot(speeds, cot, color=clr, linewidth=2, label=name)
    opt = np.argmin(cot)
    ax.plot(speeds[opt], cot[opt], 'o', color=clr, markersize=8)
ax.set_xlabel('Speed (m/s)', color='white')
ax.set_ylabel('COT (J/kg/m)', color='white')
ax.set_title('Locomotion mode comparison', color='white', fontsize=11)
ax.set_ylim(0, 150)
ax.set_xlim(0, 2)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Total energy for a 1 km journey
ax = axes[0, 2]
ax.set_facecolor('#111827')
distance = 1000  # meters
for mode, clr, name in modes:
    cot = cost_of_transport(speeds, 5, mode)
    total_energy = cot * 5 * distance / 1000  # kJ
    ax.plot(speeds, total_energy, color=clr, linewidth=2, label=name)
ax.set_xlabel('Speed (m/s)', color='white')
ax.set_ylabel('Total energy for 1 km (kJ)', color='white')
ax.set_title('Journey energy cost', color='white', fontsize=11)
ax.set_ylim(0, 500)
ax.set_xlim(0, 2)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Time-energy trade-off
ax = axes[1, 0]
ax.set_facecolor('#111827')
cot_t = cost_of_transport(speeds, mass_turtle, 'turtle')
time_hours = distance / np.maximum(speeds, 0.001) / 3600
energy_kJ = cot_t * mass_turtle * distance / 1000
valid = (speeds > 0.02) & (speeds < 0.5)
ax.plot(time_hours[valid], energy_kJ[valid], color='#22c55e', linewidth=2)
opt_time = distance / speeds[opt_idx] / 3600
opt_energy = cot_t[opt_idx] * mass_turtle * distance / 1000
ax.plot(opt_time, opt_energy, 'o', color='#f59e0b', markersize=10,
        label=f'Optimal: {opt_time:.1f}h, {opt_energy:.0f}kJ')
ax.set_xlabel('Travel time (hours)', color='white')
ax.set_ylabel('Energy cost (kJ)', color='white')
ax.set_title('Time vs energy trade-off', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Mass scaling of COT minimum
ax = axes[1, 1]
ax.set_facecolor('#111827')
mass_range = np.logspace(-2, 3, 50)
min_cot_values = []
opt_speeds_mass = []
for m in mass_range:
    # COT scales as M^(-0.25) approximately
    cot = cost_of_transport(speeds, m, 'turtle')
    cot_adjusted = cot * (m / 5)**(-0.25)
    min_cot_values.append(np.min(cot_adjusted))
    opt_speeds_mass.append(speeds[np.argmin(cot_adjusted)])
ax.plot(mass_range, min_cot_values, color='#22c55e', linewidth=2, label='Min COT')
ax2 = ax.twinx()
ax2.plot(mass_range, opt_speeds_mass, color='#f59e0b', linewidth=2, label='Optimal speed')
ax.set_xscale('log')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Min COT (J/kg/m)', color='#22c55e')
ax2.set_ylabel('Optimal speed (m/s)', color='#f59e0b')
ax.set_title('Size affects optimal strategy', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 6: Power output at different speeds
ax = axes[1, 2]
ax.set_facecolor('#111827')
cot_t = cost_of_transport(speeds, mass_turtle, 'turtle')
power_W = cot_t * mass_turtle * speeds
valid = speeds < 0.5
ax.plot(speeds[valid], power_W[valid], color='#a855f7', linewidth=2)
ax.axhline(0.6, color='#ef4444', linewidth=2, linestyle='--', label='Max sustainable power (BMR)')
ax.set_xlabel('Speed (m/s)', color='white')
ax.set_ylabel('Power output (W)', color='white')
ax.set_title('Power demand vs sustainable power', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
# Find max sustainable speed
max_speed = speeds[np.argmin(np.abs(power_W - 0.6))]
ax.axvline(max_speed, color='#f59e0b', linewidth=1, linestyle='--')
ax.annotate(f'Max sustained: {max_speed:.2f} m/s', (max_speed + 0.02, 0.65),
           fontsize=9, color='#f59e0b')

plt.tight_layout()
plt.show()

print("Cost of transport analysis:")
print(f"  Turtle optimal speed: {speeds[opt_idx]:.2f} m/s ({speeds[opt_idx]*3600:.0f} m/hr)")
print(f"  Minimum COT: {cot_turtle[opt_idx]:.1f} J/kg/m")
print(f"  1 km at optimal speed: {cot_turtle[opt_idx]*5*1000/1000:.0f} kJ, {1000/speeds[opt_idx]/3600:.1f} hours")
print(f"  Max sustainable speed: {max_speed:.2f} m/s")
print(f"  Energy at max speed: {cost_of_transport(np.array([max_speed]), 5, 'turtle')[0]*5*1000/1000:.0f} kJ/km")`,
      challenge: 'Add incline effects: uphill locomotion adds m*g*sin(theta) to the energy cost per meter. How does the optimal speed change on a 10% grade? Plot the optimal speed as a function of incline.',
      successHint: 'Cost of transport analysis is used by biomechanists studying animal locomotion, engineers designing robots, and even urban planners optimizing pedestrian infrastructure. The U-shaped COT curve is universal across all forms of locomotion.',
    },
    {
      title: 'Longevity trade-offs — the disposable soma theory',
      concept: `Why do organisms age at all? The **disposable soma theory** (Kirkwood, 1977) provides an elegant answer: organisms must allocate limited energy between reproduction and body maintenance. An organism that puts all energy into maintenance would live forever but never reproduce. One that puts all energy into reproduction would breed prolifically but die quickly.

The optimal allocation depends on environmental mortality. In high-mortality environments (predators, disease), investing in maintenance is wasted — you will be killed before old age anyway. Better to reproduce fast. In low-mortality environments (like inside a protective shell), maintenance pays off because you have many years of potential reproduction ahead.

This is formalized as:
Fitness = integral over lifetime of: reproduction_rate(t) * survival(t) dt

where survival(t) depends on both external mortality (predation) and internal mortality (aging, determined by maintenance investment).

Turtles are the perfect test case. Protected by their shell (low external mortality), they invest heavily in maintenance and repair, producing the remarkable longevity, slow growth, delayed maturity, and extended reproductive span that defines chelonian life history. The shell is not just armor — it is a license to invest in longevity.`,
      analogy: 'The disposable soma theory is like deciding how to maintain a car. If you live in a demolition derby zone (high external mortality), do not bother with oil changes — the car will be wrecked before the engine fails. If you live on a quiet country road (low external mortality), maintain the car perfectly because it needs to last 30 years. The turtle lives on the country road.',
      storyConnection: 'The story\'s turtle is slow, careful, protected by her shell. Every one of these traits is connected through the disposable soma theory. The shell reduces external mortality, which selects for longevity investment, which means slow growth and metabolism, which means slow movement. The entire life history strategy is an integrated package, not individual traits.',
      checkQuestion: 'If a population of turtles loses its shell protection (hypothetically, a mutation makes the shell thin and weak), what would happen to their life history traits over evolutionary time?',
      checkAnswer: 'External mortality would increase dramatically. Selection would shift investment from maintenance to reproduction: earlier maturity, larger clutches, faster growth, shorter lifespan, higher metabolic rate. Over many generations, these "shell-less turtles" would converge on a lizard-like life history. The shell is the keystone trait that enables the entire slow-and-steady strategy. Remove it and the optimization shifts completely.',
      codeIntro: 'Model the disposable soma allocation problem and show how external mortality rate determines optimal investment in longevity vs. reproduction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def lifetime_fitness(maint_fraction, external_mortality, max_age=200):
    """Compute lifetime reproductive output for a given maintenance allocation."""
    repro_fraction = 1 - maint_fraction

    # Aging rate inversely proportional to maintenance investment
    # Higher maintenance = slower aging
    aging_rate = 0.02 * (1 - maint_fraction)**2 / max(maint_fraction, 0.01)**1.5

    # Reproduction rate proportional to reproductive investment
    # But also requires maturity (delayed by high maintenance)
    maturity_age = 5 + 15 * maint_fraction  # more maintenance = slower growth = later maturity
    repro_rate = repro_fraction * 10  # eggs per year at full investment

    # Survival curve
    ages = np.arange(0, max_age)
    internal_survival = np.exp(-aging_rate * np.maximum(ages - maturity_age * 0.5, 0))
    external_survival = np.exp(-external_mortality * ages)
    total_survival = internal_survival * external_survival

    # Reproductive output
    reproductive = np.where(ages >= maturity_age, repro_rate, 0)
    fitness = np.sum(reproductive * total_survival)

    return fitness, total_survival, ages, maturity_age, aging_rate

# Sweep maintenance fraction for different mortality rates
maint_range = np.linspace(0.05, 0.95, 100)
external_morts = [0.005, 0.02, 0.05, 0.15, 0.3]

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Fitness vs maintenance allocation
ax = axes[0, 0]
ax.set_facecolor('#111827')
optimal_maints = []
for em, clr in zip(external_morts, ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']):
    fitnesses = [lifetime_fitness(m, em)[0] for m in maint_range]
    ax.plot(maint_range * 100, fitnesses, color=clr, linewidth=2, label=f'Ext mort={em}')
    optimal_maints.append(maint_range[np.argmax(fitnesses)])
ax.set_xlabel('% Energy to maintenance', color='white')
ax.set_ylabel('Lifetime fitness', color='white')
ax.set_title('Disposable soma trade-off', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Optimal maintenance vs external mortality
ax = axes[0, 1]
ax.set_facecolor('#111827')
em_range = np.linspace(0.001, 0.4, 50)
opt_maints = []
for em in em_range:
    fitnesses = [lifetime_fitness(m, em)[0] for m in maint_range]
    opt_maints.append(maint_range[np.argmax(fitnesses)])
ax.plot(em_range, np.array(opt_maints) * 100, color='#22c55e', linewidth=2)
# Mark turtle and mouse
ax.annotate('Turtle\\n(low ext mort)', (0.01, opt_maints[1]*100), fontsize=9, color='#22c55e',
           xytext=(0.08, 75), arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax.annotate('Mouse\\n(high ext mort)', (0.3, opt_maints[-5]*100), fontsize=9, color='#ef4444',
           xytext=(0.2, 30), arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax.set_xlabel('External mortality rate', color='white')
ax.set_ylabel('Optimal % to maintenance', color='white')
ax.set_title('Shell protection -> invest in longevity', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Survivorship curves at optimal allocation
ax = axes[0, 2]
ax.set_facecolor('#111827')
for em, clr, name in zip([0.005, 0.05, 0.15], ['#22c55e', '#f59e0b', '#ef4444'], ['Turtle', 'Lizard', 'Mouse']):
    opt_m = maint_range[np.argmax([lifetime_fitness(m, em)[0] for m in maint_range])]
    _, surv, ages, mat_age, _ = lifetime_fitness(opt_m, em)
    ax.plot(ages[:100], surv[:100], color=clr, linewidth=2, label=f'{name} (maint={opt_m:.0%})')
    ax.axvline(mat_age, color=clr, linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Survival probability', color='white')
ax.set_title('Survivorship at optimal allocation', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Maturity age vs external mortality
ax = axes[1, 0]
ax.set_facecolor('#111827')
mat_ages = [5 + 15 * m for m in opt_maints]
ax.plot(em_range, mat_ages, color='#a855f7', linewidth=2)
ax.set_xlabel('External mortality rate', color='white')
ax.set_ylabel('Age at maturity (years)', color='white')
ax.set_title('Safe environment = delayed maturity', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Life history strategy space
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Each point is a strategy with different maintenance allocation
strats = np.linspace(0.1, 0.9, 20)
for em, clr, name in zip([0.005, 0.05, 0.15], ['#22c55e', '#f59e0b', '#ef4444'], ['Turtle', 'Lizard', 'Mouse']):
    lifespans = []
    repro_rates = []
    for m in strats:
        _, surv, ages, mat, _ = lifetime_fitness(m, em)
        # Median lifespan
        half_idx = np.searchsorted(-surv, -0.5)
        lifespans.append(ages[min(half_idx, len(ages)-1)])
        repro_rates.append((1 - m) * 10)
    ax.plot(repro_rates, lifespans, 'o-', color=clr, linewidth=1.5, markersize=4, label=name)
    # Mark optimal
    opt_m = maint_range[np.argmax([lifetime_fitness(m, em)[0] for m in maint_range])]
    _, surv_opt, ages_opt, _, _ = lifetime_fitness(opt_m, em)
    half_opt = np.searchsorted(-surv_opt, -0.5)
    ax.plot((1 - opt_m) * 10, ages_opt[min(half_opt, len(ages_opt)-1)],
            '*', color=clr, markersize=15, zorder=5)
ax.set_xlabel('Reproductive rate (eggs/year)', color='white')
ax.set_ylabel('Median lifespan (years)', color='white')
ax.set_title('Life history trade-off space (star=optimal)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Population growth rate comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
strategies = {
    'Turtle strategy\\n(high maint)': (0.7, 0.005),
    'Balanced': (0.4, 0.05),
    'Mouse strategy\\n(low maint)': (0.15, 0.15),
}
for (name, (m, em)), clr in zip(strategies.items(), ['#22c55e', '#f59e0b', '#ef4444']):
    fit, surv, ages, mat, aging = lifetime_fitness(m, em)
    repro = np.where(ages >= mat, (1-m)*10, 0)
    cumulative_repro = np.cumsum(repro * surv)
    ax.plot(ages[:80], cumulative_repro[:80], color=clr, linewidth=2, label=name)
ax.set_xlabel('Age', color='white')
ax.set_ylabel('Cumulative offspring', color='white')
ax.set_title('Cumulative reproduction', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Disposable soma analysis:")
for em, om in zip(external_morts, optimal_maints):
    print(f"  External mortality {em}: optimal maintenance = {om:.0%}")
print(f"\\nThe shell is the key innovation:")
print(f"  Without shell (ext mort ~0.15): optimal maintenance = {opt_maints[-5]*100:.0f}% -> short-lived")
print(f"  With shell (ext mort ~0.005): optimal maintenance = {opt_maints[1]*100:.0f}% -> long-lived")`,
      challenge: 'Add a "repair efficiency" parameter that differs between species: turtles have better DNA repair per unit of maintenance investment. How does this shift the optimal strategy? Does it explain why turtles live even longer than the basic model predicts?',
      successHint: 'The disposable soma theory unifies aging biology with life history theory. It explains why turtles live long, why mice live short, why opossums on predator-free islands evolve longer lifespans, and why domesticated animals (protected from predators) tend to live longer than wild ones.',
    },
    {
      title: 'Telomere dynamics — the molecular clock of aging',
      concept: `Telomeres are protective caps at the ends of chromosomes, made of repetitive DNA sequences (TTAGGG in vertebrates). Each cell division shortens telomeres by 50-200 base pairs because DNA polymerase cannot fully replicate chromosome ends. When telomeres reach a critical length, the cell enters **senescence** (stops dividing) or **apoptosis** (programmed death).

The rate of telomere shortening is a molecular predictor of aging:
Telomere_length(age) = L0 - rate * age - stress_factor * cumulative_damage

Where:
- **L0**: initial telomere length (varies by species: humans ~10 kb, turtles ~20-50 kb)
- **rate**: base shortening rate per year
- **stress_factor**: oxidative damage accelerates shortening

Turtles are remarkable because they show **negligible telomere shortening** with age. Some species maintain telomere length throughout their entire 100+ year lifespan. This is achieved through:
- Higher **telomerase** activity (the enzyme that rebuilds telomeres)
- Better **oxidative stress management** (less damage per cell division)
- Lower **cell division rate** (fewer opportunities for shortening)

This explains why turtles show negligible senescence: their cells do not accumulate the molecular damage that triggers aging in mammals.`,
      analogy: 'Telomeres are like the plastic tips (aglets) on shoelaces. Each time you tie and untie your shoes (cell division), the aglet wears down a little. Eventually the lace frays (cellular senescence). Turtles are like shoes with self-repairing aglets — their telomerase enzyme rebuilds the tips almost as fast as they wear down.',
      storyConnection: 'The story\'s turtle is old — perhaps very old. But she moves with the same deliberate purpose as she did decades ago. At the molecular level, her cells are barely aging. The telomeres in her blood cells are nearly as long as when she was young. She is living proof that aging is not inevitable — it is a tunable biological parameter.',
      checkQuestion: 'If you could artificially activate telomerase in human cells to maintain telomere length, would this prevent aging? What might go wrong?',
      checkAnswer: 'It would prevent one mechanism of aging (replicative senescence) but not others (protein damage, mitochondrial dysfunction, epigenetic drift). More importantly, telomerase activation is a hallmark of cancer cells — cancer cells activate telomerase to become immortal. Increasing telomerase systemically could dramatically increase cancer risk. Turtles manage this risk because they have evolved other cancer-suppression mechanisms alongside their telomerase activity. The turtle solution requires the whole package, not just one component.',
      codeIntro: 'Model telomere dynamics across species and simulate how turtle-specific adaptations prevent age-related decline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def telomere_model(initial_length, shortening_rate, telomerase_activity,
                   oxidative_stress, max_age, cell_division_rate=1.0):
    """Simulate telomere length over a lifetime."""
    ages = np.arange(0, max_age, 0.5)
    length = np.zeros_like(ages, dtype=float)
    length[0] = initial_length

    for i in range(1, len(ages)):
        dt = ages[i] - ages[i-1]
        # Shortening from cell division
        divisions = cell_division_rate * dt
        shortening = shortening_rate * divisions

        # Additional oxidative damage
        oxidative_loss = oxidative_stress * dt * 0.01 * (1 + ages[i] * 0.01)

        # Telomerase restoration
        restoration = telomerase_activity * dt

        # Net change
        length[i] = length[i-1] - shortening - oxidative_loss + restoration

        # Random fluctuation
        length[i] += np.random.normal(0, 0.05)
        length[i] = max(length[i], 0)

    return ages, length

# Species parameters
species_params = {
    'Human': {'L0': 10, 'rate': 0.05, 'telomerase': 0.01, 'oxstress': 0.5, 'max_age': 100, 'div_rate': 1.0},
    'Mouse': {'L0': 50, 'rate': 0.8, 'telomerase': 0.3, 'oxstress': 2.0, 'max_age': 4, 'div_rate': 3.0},
    'Turtle': {'L0': 30, 'rate': 0.03, 'telomerase': 0.025, 'oxstress': 0.1, 'max_age': 150, 'div_rate': 0.3},
    'Tortoise': {'L0': 40, 'rate': 0.02, 'telomerase': 0.02, 'oxstress': 0.05, 'max_age': 200, 'div_rate': 0.2},
}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
sp_colors = {'Human': '#3b82f6', 'Mouse': '#ef4444', 'Turtle': '#22c55e', 'Tortoise': '#a855f7'}

# Plot 1: Telomere length over lifetime
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, params in species_params.items():
    ages, lengths = telomere_model(params['L0'], params['rate'], params['telomerase'],
                                    params['oxstress'], params['max_age'], params['div_rate'])
    # Normalize age to fraction of max lifespan
    ax.plot(ages / params['max_age'] * 100, lengths, color=sp_colors[name], linewidth=2, label=name)
ax.axhline(4, color='gray', linewidth=1, linestyle='--', label='Senescence threshold')
ax.set_xlabel('% of maximum lifespan', color='white')
ax.set_ylabel('Telomere length (kb)', color='white')
ax.set_title('Telomere dynamics by species', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Absolute age comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
for name, params in species_params.items():
    ages, lengths = telomere_model(params['L0'], params['rate'], params['telomerase'],
                                    params['oxstress'], params['max_age'], params['div_rate'])
    ax.plot(ages, lengths, color=sp_colors[name], linewidth=2, label=name)
ax.axhline(4, color='gray', linewidth=1, linestyle='--')
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Telomere length (kb)', color='white')
ax.set_title('Telomere length vs absolute age', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Contribution of each factor
ax = axes[0, 2]
ax.set_facecolor('#111827')
factors = ['Cell division\\nrate', 'Shortening\\nper division', 'Telomerase\\nactivity', 'Oxidative\\nstress']
human_vals = [1.0, 0.05, 0.01, 0.5]
turtle_vals = [0.3, 0.03, 0.025, 0.1]
x = np.arange(4)
ax.bar(x - 0.2, human_vals, 0.35, color='#3b82f6', label='Human')
ax.bar(x + 0.2, turtle_vals, 0.35, color='#22c55e', label='Turtle')
ax.set_xticks(x)
ax.set_xticklabels(factors, fontsize=8, color='white')
ax.set_ylabel('Parameter value', color='white')
ax.set_title('Why turtles maintain telomeres', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Telomerase sensitivity analysis
ax = axes[1, 0]
ax.set_facecolor('#111827')
telomerase_levels = [0, 0.01, 0.02, 0.03, 0.04]
for ta, clr in zip(telomerase_levels, ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6']):
    ages, lengths = telomere_model(30, 0.03, ta, 0.1, 150, 0.3)
    ax.plot(ages, lengths, color=clr, linewidth=2, label=f'Telomerase={ta}')
ax.axhline(4, color='gray', linewidth=1, linestyle='--')
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Telomere length (kb)', color='white')
ax.set_title('Telomerase activity is the key', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Cell-level senescence simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_cells = 1000
for name, params in [('Human', species_params['Human']), ('Turtle', species_params['Turtle'])]:
    ages_check = np.linspace(0, params['max_age'], 50)
    pct_senescent = []
    for age in ages_check:
        # Each cell has slightly different telomere dynamics
        cell_lengths = params['L0'] + np.random.normal(0, 2, n_cells)
        net_loss = (params['rate'] * params['div_rate'] - params['telomerase'] + params['oxstress'] * 0.01) * age
        cell_lengths -= net_loss + np.random.normal(0, 1, n_cells) * np.sqrt(age)
        pct_senescent.append((cell_lengths < 4).mean() * 100)
    ax.plot(ages_check, pct_senescent, color=sp_colors[name], linewidth=2, label=name)
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('% senescent cells', color='white')
ax.set_title('Cellular senescence accumulation', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Mortality rate vs age (Gompertz law)
ax = axes[1, 2]
ax.set_facecolor('#111827')
for name, clr in [('Human', '#3b82f6'), ('Turtle', '#22c55e')]:
    p = species_params[name]
    ages = np.linspace(1, p['max_age'] * 0.9, 100)
    if name == 'Human':
        # Gompertz: mortality increases exponentially with age
        mortality = 0.001 * np.exp(0.08 * ages)
    else:
        # Turtle: near-constant mortality (negligible senescence)
        mortality = 0.01 + 0.0001 * ages
    ax.plot(ages, mortality, color=clr, linewidth=2, label=name)
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Annual mortality rate', color='white')
ax.set_title('Mortality rate: Gompertz vs constant', color='white', fontsize=11)
ax.set_yscale('log')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Telomere dynamics summary:")
for name, params in species_params.items():
    ages, lengths = telomere_model(params['L0'], params['rate'], params['telomerase'],
                                    params['oxstress'], params['max_age'], params['div_rate'])
    below_threshold = np.searchsorted(-lengths, -4)
    threshold_age = ages[min(below_threshold, len(ages)-1)] if below_threshold < len(ages) else float('inf')
    print(f"  {name}: L0={params['L0']}kb, reaches senescence threshold at age {threshold_age:.0f}")
print(f"\\nKey turtle advantages:")
print(f"  3x lower cell division rate -> fewer shortening events")
print(f"  2.5x higher telomerase -> active maintenance")
print(f"  5x lower oxidative stress -> less damage per division")`,
      challenge: 'Simulate the cancer-longevity trade-off: higher telomerase activity delays senescence but increases the probability that a cell becomes cancerous (bypasses growth controls). Find the optimal telomerase activity that maximizes healthy lifespan given cancer risk. Compare the optimal for turtles (which have extra tumor suppressors) vs. humans.',
      successHint: 'Telomere biology is one of the most active areas of aging research. The 2009 Nobel Prize in Physiology or Medicine was awarded for the discovery of telomerase. Turtle telomere research is contributing to our understanding of aging and cancer in all vertebrates, including humans.',
    },
    {
      title: 'Allometric scaling networks — connecting metabolism, speed, lifespan, and heart rate',
      concept: `The scaling laws we have explored are not independent — they are connected through a mathematical network of allometric relationships. If BMR scales as M^0.75 and lifespan scales as M^0.25, then total lifetime energy scales as M^0.75 * M^0.25 = M^1.0 — a linear relationship.

The complete network of quarter-power scaling laws:
- **BMR** ~ M^0.75 (Kleiber's law)
- **Lifespan** ~ M^0.25 (longer for bigger animals)
- **Heart rate** ~ M^(-0.25) (slower for bigger animals)
- **Total heartbeats** ~ M^0 (approximately constant: ~1.5 billion)
- **Growth rate** ~ M^(-0.25) (slower for bigger animals)
- **Population density** ~ M^(-0.75) (fewer big animals per area)

All these 1/4 power exponents emerge from the same underlying theory: organisms distribute resources through space-filling fractal networks, and the geometry of these networks constrains the exponents to multiples of 1/4.

For turtles, these scaling laws predict slow growth, slow heart rate, long life, and low population density — exactly what we observe. But turtles exceed the predictions for longevity, suggesting additional molecular mechanisms (telomere maintenance, DNA repair) that extend life beyond the allometric expectation.`,
      analogy: 'The allometric scaling network is like a spreadsheet where changing one cell updates all the others through formulas. If you change body mass, the scaling laws automatically predict metabolic rate, lifespan, heart rate, and population density. The formulas are the quarter-power laws, and they all trace back to one fundamental principle: fractal resource distribution.',
      storyConnection: 'The turtle in our story embodies every prediction of allometric scaling: slow pace (M^0.25 optimal speed), low energy needs (M^0.75 metabolism), long life (M^0.25 lifespan), steady heartbeat (M^-0.25 heart rate). She is a living demonstration of how body size determines an entire way of being in the world.',
      checkQuestion: 'If total lifetime heartbeats are approximately constant (~1.5 billion) across mammals, and a turtle has a heart rate of 10 beats per minute, how many years would the "heartbeat budget" predict for the turtle?',
      checkAnswer: '1.5 billion / (10 * 60 * 24 * 365) = 1.5e9 / 5,256,000 = 285 years. This is remarkably close to the upper bound of tortoise longevity (the oldest known tortoise, Jonathan, was over 190 years old). The heartbeat budget is not a precise predictor, but it gives the right order of magnitude and suggests that turtles are pushing the limits of the vertebrate plan.',
      codeIntro: 'Build a complete allometric scaling dashboard connecting all the quarter-power laws and showing where turtles fit.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Complete allometric scaling model
def allometric_predictions(mass_kg, type='mammal'):
    """Predict all life history traits from body mass using quarter-power laws."""
    factor = 1.0 if type == 'mammal' else 0.15  # ectotherm factor for BMR
    longevity_factor = 1.0 if type == 'mammal' else 3.0  # turtles live 3x longer than predicted

    bmr_W = 3.5 * mass_kg**0.75 * factor
    heart_rate_bpm = 240 * mass_kg**(-0.25) * (factor**0.33)
    lifespan_yr = 12 * mass_kg**0.25 * longevity_factor
    growth_rate = 0.5 * mass_kg**(-0.25) * factor  # relative growth per year
    pop_density = 10 * mass_kg**(-0.75)  # individuals per km²
    home_range = 0.1 * mass_kg**1.0  # km²
    speed_optimal = 0.5 * mass_kg**0.25 * (factor**0.5)  # m/s

    total_heartbeats = heart_rate_bpm * 60 * 24 * 365 * lifespan_yr

    return {
        'BMR (W)': bmr_W,
        'Heart rate (bpm)': heart_rate_bpm,
        'Lifespan (yr)': lifespan_yr,
        'Growth rate': growth_rate,
        'Pop density (/km²)': pop_density,
        'Home range (km²)': home_range,
        'Optimal speed (m/s)': speed_optimal,
        'Total heartbeats': total_heartbeats,
    }

# Generate predictions across mass range
mass_range = np.logspace(-2, 4, 100)
mammal_preds = {k: [] for k in allometric_predictions(1).keys()}
reptile_preds = {k: [] for k in allometric_predictions(1).keys()}
for m in mass_range:
    mp = allometric_predictions(m, 'mammal')
    rp = allometric_predictions(m, 'reptile')
    for k in mp:
        mammal_preds[k].append(mp[k])
        reptile_preds[k].append(rp[k])

# Real species data points for validation
real_species = [
    ('Mouse', 0.03, 'mammal', {'BMR (W)': 0.3, 'Heart rate (bpm)': 600, 'Lifespan (yr)': 2.5}),
    ('Rabbit', 2, 'mammal', {'BMR (W)': 4.5, 'Heart rate (bpm)': 200, 'Lifespan (yr)': 9}),
    ('Human', 70, 'mammal', {'BMR (W)': 80, 'Heart rate (bpm)': 70, 'Lifespan (yr)': 79}),
    ('Elephant', 4000, 'mammal', {'BMR (W)': 2000, 'Heart rate (bpm)': 30, 'Lifespan (yr)': 70}),
    ('Box turtle', 0.5, 'reptile', {'BMR (W)': 0.05, 'Heart rate (bpm)': 15, 'Lifespan (yr)': 100}),
    ('Sea turtle', 150, 'reptile', {'BMR (W)': 8, 'Heart rate (bpm)': 10, 'Lifespan (yr)': 80}),
    ('Giant tortoise', 250, 'reptile', {'BMR (W)': 10, 'Heart rate (bpm)': 8, 'Lifespan (yr)': 175}),
]

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

plot_vars = ['BMR (W)', 'Heart rate (bpm)', 'Lifespan (yr)',
             'Optimal speed (m/s)', 'Pop density (/km²)', 'Total heartbeats']

for idx, var in enumerate(plot_vars):
    ax = axes.flat[idx]
    ax.set_facecolor('#111827')

    # Scaling lines
    ax.plot(mass_range, mammal_preds[var], color='#3b82f6', linewidth=2, label='Mammal scaling')
    ax.plot(mass_range, reptile_preds[var], color='#22c55e', linewidth=2, label='Reptile/Turtle scaling')

    # Real data points
    for name, mass, type_, data in real_species:
        if var in data:
            clr = '#3b82f6' if type_ == 'mammal' else '#22c55e'
            marker = 'o' if type_ == 'mammal' else 's'
            ax.scatter([mass], [data[var]], s=60, c=clr, marker=marker, zorder=5, edgecolors='white')
            ax.annotate(name, (mass, data[var]), fontsize=7, color='white',
                       xytext=(5, 5), textcoords='offset points')

    ax.set_xscale('log')
    ax.set_yscale('log')
    ax.set_xlabel('Body mass (kg)', color='white')
    ax.set_ylabel(var, color='white')

    # Extract exponent for title
    m_vals = np.array(mammal_preds[var])
    log_fit = np.polyfit(np.log10(mass_range), np.log10(np.maximum(m_vals, 1e-10)), 1)
    ax.set_title(f'{var} ~ M^{log_fit[0]:.2f}', color='white', fontsize=10)

    if idx == 0:
        ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Summary table
print("=== ALLOMETRIC SCALING NETWORK ===")
print(f"{'Trait':<25} {'Exponent':<10} {'Mouse (30g)':<15} {'Human (70kg)':<15} {'Turtle (5kg)':<15} {'Tortoise (250kg)':<15}")
print("-" * 95)
for var in plot_vars:
    m_vals = np.array(mammal_preds[var])
    exp = np.polyfit(np.log10(mass_range), np.log10(np.maximum(m_vals, 1e-10)), 1)[0]
    mp_mouse = allometric_predictions(0.03, 'mammal')
    mp_human = allometric_predictions(70, 'mammal')
    rp_turtle = allometric_predictions(5, 'reptile')
    rp_tortoise = allometric_predictions(250, 'reptile')
    print(f"{var:<25} {exp:<10.2f} {mp_mouse[var]:<15.2g} {mp_human[var]:<15.2g} {rp_turtle[var]:<15.2g} {rp_tortoise[var]:<15.2g}")

print(f"\\nKey insight: all exponents are multiples of 1/4.")
print(f"This emerges from fractal network geometry.")
print(f"Turtles follow the reptile scaling but exceed lifespan predictions by 2-3x.")
print(f"Total heartbeats: mammals ~1.5B, turtles ~2-3B (turtle hearts are more durable).")`,
      challenge: 'Plot a "scaling web" diagram showing how all the quarter-power laws connect. Start from BMR = M^0.75 and derive all other exponents mathematically. Show that the network is self-consistent: you can derive any exponent from any two others.',
      successHint: 'Allometric scaling is one of the deepest patterns in biology. It connects organisms across 20 orders of magnitude in mass, from bacteria to whales. The quarter-power laws are as fundamental to biology as Newton\'s laws are to physics. Understanding them gives you a framework for predicting the properties of any organism from its body mass alone.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Computational Scientist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology and scaling fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for metabolic scaling and longevity analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
