import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HornbillLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Bird anatomy — built for flight',
      concept: `The great hornbill (Buceros bicornis) is one of the largest birds in the forests of Nagaland, with a wingspan exceeding 1.5 metres. Its body is a masterpiece of natural engineering, optimized over millions of years for life in the canopy.

Key anatomical features:
- **Hollow bones**: bird bones are pneumatized (filled with air spaces connected to the respiratory system). This reduces weight while maintaining strength. A hornbill skeleton weighs only about 5% of its body mass.
- **Casque**: the hornbill's distinctive helmet-like structure is mostly hollow. It acts as a resonating chamber for their booming calls and may play a role in sexual selection.
- **Keeled sternum**: the breastbone has a large ridge (keel) where powerful flight muscles attach. These muscles can make up 15-25% of a bird's body weight.
- **Feathers**: each flight feather is an engineering marvel — a central shaft (rachis) with interlocking barbs that create a smooth, airproof surface. Damaged barbs can be re-zipped by preening.
- **One-way respiratory system**: unlike mammals (who breathe in and out through the same tubes), birds have air sacs that create a one-way flow through the lungs. This extracts oxygen far more efficiently.`,
      analogy: 'A bird is like a high-performance aircraft. Hollow bones are like an aluminum fuselage (strong but light). The keel is like engine mounts. Feathers are like carbon-fibre wing panels (layered for strength). The one-way respiratory system is like a turbocharger — extracting more energy from each breath than a standard engine can.',
      storyConnection: 'In the Nagaland story, the hornbill\'s crown (casque) was said to hold the wisdom of the forest. In reality, the casque is a marvel of biomechanics — lightweight, resonant, and structurally brilliant. The Naga people revered the hornbill not just for its beauty, but because they recognized it as a supreme creation of nature.',
      checkQuestion: 'Bird bones are hollow, yet they are strong enough to withstand the forces of flight. How can hollow be stronger than solid?',
      checkAnswer: 'A hollow tube resists bending better per unit weight than a solid rod. This is the same principle used in bicycle frames, aircraft struts, and scaffolding. The material is placed where stress is highest (the outer surface), and removed where stress is lowest (the centre). Internal struts (trabeculae) inside bird bones add reinforcement exactly where needed, like a truss bridge.',
      codeIntro: 'Compare the strength-to-weight ratio of hollow vs. solid bones.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Comparing hollow tube vs solid rod
# Bending stiffness: I = pi/64 * (D_outer^4 - D_inner^4) for hollow
# Weight proportional to (D_outer^2 - D_inner^2) for hollow

D_outer = 10  # mm
wall_thickness = np.linspace(0.5, 5, 100)  # mm (5 = solid)
D_inner = D_outer - 2 * wall_thickness

# Second moment of area (bending stiffness)
I_hollow = np.pi / 64 * (D_outer**4 - D_inner**4)
I_solid = np.pi / 64 * D_outer**4

# Cross-sectional area (proportional to weight)
A_hollow = np.pi / 4 * (D_outer**2 - D_inner**2)
A_solid = np.pi / 4 * D_outer**2

# Stiffness-to-weight ratio
ratio_hollow = I_hollow / A_hollow
ratio_solid = I_solid / A_solid

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Stiffness-to-weight ratio
ax1.set_facecolor('#111827')
ax1.plot(wall_thickness, ratio_hollow / ratio_solid * 100, color='#22c55e', linewidth=2)
ax1.axhline(100, color='#ef4444', linestyle='--', linewidth=1, label='Solid bone (100%)')
ax1.fill_between(wall_thickness, ratio_hollow / ratio_solid * 100, 100,
                 where=ratio_hollow / ratio_solid * 100 > 100,
                 alpha=0.15, color='#22c55e')
ax1.set_xlabel('Wall thickness (mm)', color='white')
ax1.set_ylabel('Stiffness/weight vs solid (%)', color='white')
ax1.set_title('Hollow Bones: More Efficient Than Solid', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Annotate typical bird bone
ax1.annotate('Typical bird bone\
(~1mm wall)', xy=(1, ratio_hollow[10] / ratio_solid * 100),
            xytext=(2, 250), color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Weight comparison: bird vs mammal skeleton
ax2.set_facecolor('#111827')
animals = ['Great hornbill', 'Hawk', 'Pigeon', 'Cat (same mass)', 'Human']
skeleton_pct = [5.1, 5.5, 4.4, 13, 15]  # skeleton as % of body mass
colors_list = ['#22c55e', '#22c55e', '#22c55e', '#ef4444', '#ef4444']

bars = ax2.barh(animals, skeleton_pct, color=colors_list, edgecolor='none')
ax2.set_xlabel('Skeleton as % of body mass', color='white')
ax2.set_title('Bird vs Mammal: Skeleton Weight', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, pct in zip(bars, skeleton_pct):
    ax2.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
             f'{pct}%', va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Key insight: hollow structures can be STRONGER per unit weight.")
print(f"  Bird bone (1mm wall): {ratio_hollow[10]/ratio_solid*100:.0f}% the efficiency of solid")
print("  This is why birds have skeleton mass of ~5% body weight")
print("  vs mammals at ~13-15% body weight.")
print()
print("Engineers copied this: airplane fuselages, bicycle frames,")
print("and wind turbine blades all use hollow tube construction.")`,
      challenge: 'What wall thickness gives the BEST stiffness-to-weight ratio? (Look at the peak of the curve.) Why don\'t birds make their bones even thinner than that?',
      successHint: 'Bird anatomy is a masterclass in lightweight engineering. Every gram saved in the skeleton is a gram that does not need to be lifted during every wingbeat — and a hornbill beats its wings thousands of times per hour.',
    },
    {
      title: 'Flight mechanics — the physics of staying airborne',
      concept: `How does a 3-4 kg hornbill stay in the air? The answer involves four forces that act on every flying object:

1. **Lift**: upward force generated by the wings. Created by the wing's airfoil shape — air flows faster over the curved top surface than the flat bottom, creating lower pressure above (Bernoulli) and deflecting air downward (Newton).
2. **Weight**: downward force of gravity. For a hornbill: about 30-40 N.
3. **Thrust**: forward force from flapping wings (or gliding in updrafts).
4. **Drag**: backward force from air resistance.

For steady, level flight: Lift = Weight and Thrust = Drag.

The lift equation: **L = ½ × ρ × v² × S × C_L**

Where:
- ρ = air density (1.225 kg/m³ at sea level)
- v = airspeed
- S = wing area
- C_L = lift coefficient (depends on wing shape and angle of attack)

Hornbills have broad wings with slotted primary feathers (like spread fingers). Each slot reduces induced drag and increases lift at low speeds — essential for manoeuvring through dense forest canopy.`,
      analogy: 'Flying is like surfing — but on air instead of water. The wing is the surfboard, tilted at an angle to the flow. Just as a surfboard generates force by deflecting water, a wing generates lift by deflecting air downward. Newton\'s Third Law: push air down, the air pushes you up.',
      storyConnection: 'The Naga people described the hornbill\'s flight as "rowing through the sky." This is remarkably accurate — a hornbill\'s wingbeats are slow and powerful, pulling the air downward and backward just as oars pull water. The whooshing sound of a hornbill in flight (audible from 800m away) is the sound of those massive wings displacing air.',
      checkQuestion: 'A hornbill weighs about 3.5 kg. Its wing area is approximately 0.3 m². What minimum airspeed does it need to fly? (Use C_L = 1.5 for slow flight)',
      checkAnswer: 'Lift must equal weight: L = mg = 3.5 × 9.8 = 34.3 N. Using L = ½ρv²SC_L: 34.3 = 0.5 × 1.225 × v² × 0.3 × 1.5. Solving: v² = 34.3 / 0.276 = 124.3, so v = 11.1 m/s (about 40 km/h). Below this speed, the hornbill cannot generate enough lift and must land or flap harder.',
      codeIntro: 'Model the four forces of flight and calculate minimum flying speed for different birds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lift vs speed for different birds
speeds = np.linspace(1, 30, 200)  # m/s
rho = 1.225  # kg/m³

birds = {
    'Hummingbird': {'mass': 0.004, 'wing_area': 0.0008, 'CL_max': 1.8, 'color': '#a855f7'},
    'Pigeon': {'mass': 0.35, 'wing_area': 0.06, 'CL_max': 1.6, 'color': '#3b82f6'},
    'Great hornbill': {'mass': 3.5, 'wing_area': 0.30, 'CL_max': 1.5, 'color': '#f59e0b'},
    'Eagle': {'mass': 5.0, 'wing_area': 0.55, 'CL_max': 1.4, 'color': '#22c55e'},
    'Albatross': {'mass': 8.5, 'wing_area': 0.62, 'CL_max': 1.3, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Lift vs speed for hornbill at different angles
ax1.set_facecolor('#111827')
CL_values = [0.5, 1.0, 1.5]  # different angles of attack
hornbill_weight = 3.5 * 9.8  # N

for cl in CL_values:
    lift = 0.5 * rho * speeds**2 * 0.30 * cl
    ax1.plot(speeds, lift, linewidth=2, label=f'C_L = {cl}')

ax1.axhline(hornbill_weight, color='#ef4444', linestyle='--', linewidth=2, label=f'Weight ({hornbill_weight:.1f}N)')
ax1.set_xlabel('Airspeed (m/s)', color='white')
ax1.set_ylabel('Lift force (N)', color='white')
ax1.set_title('Hornbill: Lift vs Speed at Different Angles', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 100)

# Minimum speed for each bird
ax2.set_facecolor('#111827')
bird_names = []
min_speeds = []
wing_loadings = []
bar_colors = []

for name, params in birds.items():
    weight = params['mass'] * 9.8
    v_min = np.sqrt(2 * weight / (rho * params['wing_area'] * params['CL_max']))
    wl = weight / params['wing_area']
    bird_names.append(name)
    min_speeds.append(v_min)
    wing_loadings.append(wl)
    bar_colors.append(params['color'])

bars = ax2.barh(bird_names, min_speeds, color=bar_colors, edgecolor='none')
ax2.set_xlabel('Minimum flight speed (m/s)', color='white')
ax2.set_title('Stall Speed: Slowest They Can Fly', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, v, wl in zip(bars, min_speeds, wing_loadings):
    ax2.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
             f'{v:.1f} m/s ({v*3.6:.0f} km/h)', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Bird flight data:")
print(f"{'Bird':<20} {'Mass':>6} {'Wing area':>10} {'Min speed':>10} {'Wing loading':>13}")
for name, params in birds.items():
    w = params['mass'] * 9.8
    v = np.sqrt(2 * w / (rho * params['wing_area'] * params['CL_max']))
    wl = w / params['wing_area']
    print(f"{name:<20} {params['mass']:>5.3f}kg {params['wing_area']:>8.4f}m² {v:>8.1f}m/s {wl:>10.1f}N/m²")
print()
print("Wing loading (weight/wing area) determines minimum speed.")
print("Low wing loading = slow flight = better maneuverability in forests.")`,
      challenge: 'The hornbill has slotted wingtips (primary feathers spread like fingers). This increases effective wing area by ~15%. Recalculate the minimum speed with wing area = 0.345 m². How much does slotting help?',
      successHint: 'The four forces of flight are the same whether you are analysing a hornbill, a Boeing 747, or a paper airplane. Understanding lift, weight, thrust, and drag is the foundation of all aerospace engineering.',
    },
    {
      title: 'Nesting behavior — the sealed nest strategy',
      concept: `The great hornbill has one of the most remarkable nesting strategies in the bird world. The female enters a natural tree cavity and **seals herself inside** using mud, droppings, and fruit pulp, leaving only a narrow slit. She stays sealed in for 3-4 months while incubating eggs and raising chicks.

During this period:
- The male makes **dozens of trips per day** to deliver food (mainly fruits, especially figs)
- The sealed nest protects the female and chicks from predators (snakes, monitor lizards, raptors)
- The female **moults all her flight feathers** while sealed in — she could not fly even if she wanted to
- She regrows her feathers just as the chicks are ready to emerge
- Temperature and humidity inside the cavity remain stable (natural insulation)

This strategy has costs and benefits:
- **Cost**: the female is entirely dependent on the male. If the male dies, the female and chicks starve.
- **Benefit**: near-zero predation rate for eggs and chicks. Hornbill nesting success (~70-80%) is much higher than most birds (~30-50%).

The male's food delivery is an extraordinary energetic investment — he may lose 20% of his body weight during the nesting period.`,
      analogy: 'The sealed nest is like a biological safe room. Imagine sealing yourself in a bunker with a food delivery slot. Predators cannot get in, the environment is controlled, and all your needs are delivered. The trade-off is total vulnerability if the supply chain breaks — the same risk a sealed hornbill nest faces.',
      storyConnection: 'In the Nagaland story, the hornbill\'s crown represents devotion and sacrifice. This mirrors reality: the male hornbill\'s months of relentless food delivery is one of nature\'s greatest displays of parental investment. The Naga people\'s reverence for the hornbill may stem partly from witnessing this devotion.',
      checkQuestion: 'If the male hornbill makes 30 food deliveries per day for 120 days, each trip covering 2 km round trip, how far does he fly just for food delivery during one nesting season?',
      checkAnswer: 'Total trips: 30 × 120 = 3,600 trips. Total distance: 3,600 × 2 km = 7,200 km. That is roughly the distance from Delhi to London. All while maintaining his own body weight and avoiding predators. This is why male hornbills lose significant body mass during nesting.',
      codeIntro: 'Model the male hornbill\'s energy budget during nesting season.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Male hornbill energy budget during nesting
days = np.arange(1, 121)  # 120-day nesting period

# Energy parameters (simplified, in kJ/day)
basal_metabolism = 450  # kJ/day (resting)
flight_cost_per_trip = 25  # kJ per round trip
trips_per_day = 30

# Food delivery energy
delivery_energy = trips_per_day * flight_cost_per_trip

# Food intake by male (he eats while foraging)
male_intake = 600  # kJ/day — he eats less because he's busy

# Energy balance
daily_surplus = male_intake - basal_metabolism - delivery_energy

# Cumulative energy deficit
cumulative = np.cumsum(np.full_like(days, daily_surplus, dtype=float))

# Male body mass (starts at 3.5kg)
initial_mass = 3.5
energy_per_kg_fat = 37000  # kJ per kg of fat
mass_change = cumulative / energy_per_kg_fat
male_mass = initial_mass + mass_change

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Daily energy budget
ax1.set_facecolor('#111827')
categories = ['Basal\
metabolism', 'Flight\
(delivery)', 'Total\
expenditure', 'Food\
intake']
values = [basal_metabolism, delivery_energy, basal_metabolism + delivery_energy, male_intake]
colors_list = ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e']
bars = ax1.bar(categories, values, color=colors_list, edgecolor='none')
ax1.set_ylabel('Energy (kJ/day)', color='white')
ax1.set_title('Male Hornbill: Daily Energy Budget', color='white', fontsize=13)
ax1.tick_params(colors='gray')
for bar, v in zip(bars, values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 10,
             f'{v}', ha='center', color='white', fontsize=11)

# Mass change over nesting period
ax2.set_facecolor('#111827')
ax2.plot(days, male_mass, color='#ef4444', linewidth=2)
ax2.fill_between(days, male_mass, initial_mass, alpha=0.15, color='#ef4444')
ax2.axhline(initial_mass, color='gray', linestyle='--', linewidth=0.5)
ax2.set_xlabel('Day of nesting', color='white')
ax2.set_ylabel('Male body mass (kg)', color='white')
ax2.set_title('Male Weight Loss During Nesting', color='white', fontsize=13)
ax2.tick_params(colors='gray')
pct_loss = (initial_mass - male_mass[-1]) / initial_mass * 100
ax2.annotate(f'{pct_loss:.0f}% body mass lost', xy=(120, male_mass[-1]),
            xytext=(80, male_mass[-1] + 0.2), color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Nesting success rates comparison
ax3.set_facecolor('#111827')
bird_types = ['Hornbill\
(sealed nest)', 'Eagle\
(open nest)', 'Songbird\
(open nest)',
              'Ground nester\
(plover)', 'Cuckoo\
(brood parasite)']
success_rates = [75, 60, 35, 25, 90]
colors_bar = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
bars = ax3.bar(bird_types, success_rates, color=colors_bar, edgecolor='none')
ax3.set_ylabel('Nesting success rate (%)', color='white')
ax3.set_title('Nesting Success: Sealed vs Open', color='white', fontsize=13)
ax3.tick_params(colors='gray')
for bar, rate in zip(bars, success_rates):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{rate}%', ha='center', color='white', fontsize=10)

# Cumulative food deliveries
ax4.set_facecolor('#111827')
total_trips = days * trips_per_day
total_distance = total_trips * 2  # km (2km round trip)
ax4.plot(days, total_trips, color='#f59e0b', linewidth=2, label='Total trips')
ax4_twin = ax4.twinx()
ax4_twin.plot(days, total_distance, color='#3b82f6', linewidth=2, linestyle='--', label='Total distance (km)')
ax4.set_xlabel('Day of nesting', color='white')
ax4.set_ylabel('Cumulative trips', color='#f59e0b')
ax4_twin.set_ylabel('Distance (km)', color='#3b82f6')
ax4.set_title('Cumulative Food Delivery Effort', color='white', fontsize=13)
ax4.tick_params(colors='gray')
ax4_twin.tick_params(colors='gray')

lines1, labels1 = ax4.get_legend_handles_labels()
lines2, labels2 = ax4_twin.get_legend_handles_labels()
ax4.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Nesting season summary:")
print(f"  Duration: 120 days")
print(f"  Trips per day: {trips_per_day}")
print(f"  Total trips: {trips_per_day * 120:,}")
print(f"  Total flight distance: {trips_per_day * 120 * 2:,} km")
print(f"  Male mass loss: {pct_loss:.0f}%")
print(f"  Daily energy deficit: {abs(daily_surplus)} kJ")
print()
print("The sealed nest is an evolutionary gamble:")
print("  HIGH reward: ~75% nesting success")
print("  HIGH risk: total dependence on one male")`,
      challenge: 'If the male dies on day 60, how many days can the female and chicks survive on stored body fat? Assume the female has 0.4kg of fat reserves and chicks need 200 kJ/day total. At what point is rescue impossible?',
      successHint: 'The sealed nest strategy shows how evolution finds surprising solutions. The trade-off between predation risk and starvation risk is a fundamental concept in behavioral ecology — and the hornbill has found one of nature\'s most extreme answers.',
    },
    {
      title: 'Symbiosis — partnerships in the canopy',
      concept: `No species lives alone. The great hornbill exists within a web of relationships with other species — some beneficial, some harmful, some neutral. These interactions are called **symbiosis** (literally "living together").

Types of symbiosis:
- **Mutualism** (+/+): both species benefit. Hornbills eat fruits and spread seeds — the tree gets its seeds dispersed far from the parent, the hornbill gets food.
- **Commensalism** (+/0): one benefits, the other is unaffected. Small birds follow hornbills to catch insects flushed out by the hornbill's movement through the canopy.
- **Parasitism** (+/−): one benefits at the other's expense. Ticks on hornbills feed on blood, weakening the bird.

The hornbill-fig tree mutualism is one of the most important in tropical forests:
- Figs fruit year-round (unlike most trees), providing reliable food
- Hornbills eat figs and fly long distances (up to 15 km) before defecating the seeds
- These seeds germinate far from the parent tree, reducing competition
- Many tropical tree species depend ENTIRELY on large birds like hornbills for seed dispersal
- Remove hornbills → tree reproduction collapses → forest composition changes within decades`,
      analogy: 'Symbiosis is like a business partnership. Mutualism is a fair trade deal (both profit). Commensalism is like a small shop next to a popular restaurant — the shop gets foot traffic, the restaurant is unaffected. Parasitism is like a pickpocket at a crowded market — one gains at the other\'s expense.',
      storyConnection: 'The story says the hornbill\'s crown was granted by the forest spirits for being the forest\'s most faithful guardian. In ecological terms, this is accurate — by dispersing seeds of dozens of tree species, the hornbill literally builds and maintains the forest. The "crown" is earned through ecological service.',
      checkQuestion: 'If hornbills disappear from a forest, why don\'t the fig trees just drop their seeds below and grow new trees there?',
      checkAnswer: 'Seeds that fall below the parent tree face intense competition — for light (the parent\'s canopy blocks sun), for nutrients (the parent\'s roots dominate the soil), and for survival (seed predators concentrate where seeds are dense). Dispersal to new locations, far from the parent, dramatically increases germination success. Without dispersers, genetic diversity also drops because trees only reproduce locally.',
      codeIntro: 'Model seed dispersal patterns with and without hornbill dispersers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Seed dispersal simulation
n_seeds = 500

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Without dispersers: seeds fall near parent
ax1.set_facecolor('#111827')
parent_x, parent_y = 0, 0
gravity_dist = np.random.exponential(3, n_seeds)  # metres from parent
gravity_angle = np.random.uniform(0, 2*np.pi, n_seeds)
gx = gravity_dist * np.cos(gravity_angle)
gy = gravity_dist * np.sin(gravity_angle)

ax1.scatter(gx, gy, s=5, color='#ef4444', alpha=0.4)
ax1.plot(0, 0, '*', color='#22c55e', markersize=20, label='Parent tree')
circle = plt.Circle((0, 0), 10, fill=False, color='#22c55e', linewidth=2, linestyle='--')
ax1.add_patch(circle)
ax1.set_xlim(-50, 50)
ax1.set_ylim(-50, 50)
ax1.set_title('No dispersers\
(gravity only)', color='white', fontsize=11)
ax1.set_xlabel('Distance (m)', color='white')
ax1.tick_params(colors='gray')
ax1.set_aspect('equal')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# With hornbill dispersers: seeds spread far
ax2.set_facecolor('#111827')
# Some seeds still fall nearby, but many are dispersed far
n_dispersed = int(n_seeds * 0.4)
n_local = n_seeds - n_dispersed

local_dist = np.random.exponential(3, n_local)
local_angle = np.random.uniform(0, 2*np.pi, n_local)
lx = local_dist * np.cos(local_angle)
ly = local_dist * np.sin(local_angle)

# Hornbill-dispersed seeds: 200m-2000m away
hornbill_dist = np.random.uniform(200, 2000, n_dispersed) / 50  # scaled to display
hornbill_angle = np.random.uniform(0, 2*np.pi, n_dispersed)
hx = hornbill_dist * np.cos(hornbill_angle)
hy = hornbill_dist * np.sin(hornbill_angle)

ax2.scatter(lx, ly, s=5, color='#ef4444', alpha=0.4, label='Gravity seeds')
ax2.scatter(hx, hy, s=5, color='#f59e0b', alpha=0.6, label='Hornbill seeds')
ax2.plot(0, 0, '*', color='#22c55e', markersize=20)
circle2 = plt.Circle((0, 0), 10, fill=False, color='#22c55e', linewidth=2, linestyle='--')
ax2.add_patch(circle2)
ax2.set_xlim(-50, 50)
ax2.set_ylim(-50, 50)
ax2.set_title('With hornbill dispersal\
(seeds spread far)', color='white', fontsize=11)
ax2.set_xlabel('Distance (m)', color='white')
ax2.tick_params(colors='gray')
ax2.set_aspect('equal')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Germination success vs distance from parent
ax3.set_facecolor('#111827')
distances = np.linspace(0, 50, 200)

# Janzen-Connell effect: survival increases with distance from parent
seed_density = 100 * np.exp(-distances / 5)  # seeds/m² (falls off)
survival_rate = 1 - np.exp(-distances / 15)  # survival probability (increases)
recruitment = seed_density * survival_rate  # seedlings per m²

ax3.plot(distances, seed_density / 10, color='#ef4444', linewidth=2, label='Seed density')
ax3.plot(distances, survival_rate * 10, color='#22c55e', linewidth=2, label='Survival rate')
ax3.fill_between(distances, recruitment / 5, alpha=0.3, color='#f59e0b')
ax3.plot(distances, recruitment / 5, color='#f59e0b', linewidth=2, label='Seedling recruitment')
ax3.set_xlabel('Distance from parent (m)', color='white')
ax3.set_ylabel('Relative value', color='white')
ax3.set_title('Janzen-Connell Effect:\
Why Distance Matters', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Seed dispersal impact:")
print(f"  Without hornbills: mean dispersal distance = {np.mean(gravity_dist):.1f}m")
print(f"  With hornbills: mean dispersal distance = {np.mean(np.concatenate([local_dist, hornbill_dist*50])):.0f}m")
print()
print("Janzen-Connell effect:")
print("  Seeds near parent: high density but low survival (competition + predators)")
print("  Seeds far from parent: low density but high survival")
print("  Peak recruitment is at INTERMEDIATE distance — exactly where hornbills deposit seeds.")`,
      challenge: 'If hornbills are hunted and their population drops by 80%, how does the seed dispersal pattern change? Reduce n_dispersed to 8% of seeds and replot. What happens to forest regeneration over 50 years?',
      successHint: 'The mutualism between hornbills and trees is a keystone interaction. Remove the hornbill and the entire forest ecosystem shifts — which is why hornbill conservation is really forest conservation.',
    },
    {
      title: 'Seed dispersal — how forests spread',
      concept: `Seeds need to travel. A tree that drops all its seeds directly below itself creates intense competition — most seeds die. Evolution has produced remarkable dispersal mechanisms:

- **Wind (anemochory)**: lightweight seeds with wings or parachutes. Maple samaras spin like helicopters. Dandelion seeds float on breeze. Effective for open habitats but poor in dense forest.
- **Animal (zoochory)**: seeds eaten with fruit and deposited elsewhere. Hornbills are among the most effective zoochorous dispersers because they fly far and eat large fruits.
- **Water (hydrochory)**: seeds float to new locations. Coconuts are the classic example — they can cross oceans.
- **Ballistic (autochory)**: the plant launches its own seeds. Impatiens pods explode when touched, flinging seeds several metres.
- **Gravity (barochory)**: heavy seeds simply fall. Limited dispersal distance.

Seed dispersal distance follows a **dispersal kernel** — a probability distribution showing how far seeds travel. For gravity, the kernel is narrow (most seeds land within metres). For hornbill dispersal, the kernel has a long tail (some seeds travel kilometres).

The shape of the dispersal kernel determines a species' ability to colonise new habitat, recover from disturbance, and migrate in response to climate change.`,
      analogy: 'Seed dispersal strategies are like mail delivery options. Gravity is like dropping a letter on the floor (it goes nowhere). Wind is like paper airplanes (unpredictable, mostly short range). Animal dispersal is like hiring a courier (targeted, long distance). Water is like putting a message in a bottle (very far, very random).',
      storyConnection: 'The hornbill in the story carried wisdom across the forest. In reality, hornbills carry something equally valuable: genetic diversity. By depositing seeds from tree A near tree B (kilometres away), hornbills enable cross-pollination in future generations. They are flying gene banks.',
      checkQuestion: 'Some plants produce seeds with barbs that stick to animal fur. Is this mutualism, commensalism, or parasitism?',
      checkAnswer: 'Commensalism (or very mild parasitism). The plant benefits from dispersal. The animal is minimally affected — the barbs are a minor nuisance, not a significant cost. However, if the barbs cause skin irritation or get tangled in fur, it edges toward parasitism. Classification depends on the magnitude of the cost to the animal.',
      codeIntro: 'Simulate and compare different seed dispersal kernels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Dispersal kernels for different mechanisms
distances = np.linspace(0, 500, 1000)  # metres

# Dispersal kernel functions (probability density)
kernels = {
    'Gravity': {'func': lambda d: np.exp(-d / 2) / 2, 'color': '#ef4444'},
    'Wind': {'func': lambda d: 0.1 * np.exp(-d / 20), 'color': '#3b82f6'},
    'Small bird': {'func': lambda d: 0.02 * np.exp(-d / 50) * (d > 5), 'color': '#f59e0b'},
    'Hornbill': {'func': lambda d: 0.003 * np.exp(-(np.log(d+1) - 5)**2 / 2) * (d > 10), 'color': '#22c55e'},
    'Water': {'func': lambda d: 0.001 * (1 / (1 + (d/200)**2)), 'color': '#a855f7'},
}

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Dispersal kernels
ax1.set_facecolor('#111827')
for name, params in kernels.items():
    pdf = params['func'](distances)
    ax1.plot(distances, pdf, color=params['color'], linewidth=2, label=name)

ax1.set_xlabel('Distance from parent (m)', color='white')
ax1.set_ylabel('Seed density (relative)', color='white')
ax1.set_title('Seed Dispersal Kernels', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 500)

# Cumulative dispersal (what fraction of seeds reach distance d?)
ax2.set_facecolor('#111827')
for name, params in kernels.items():
    pdf = params['func'](distances)
    cdf = np.cumsum(pdf) / np.sum(pdf)
    ax2.plot(distances, (1 - cdf) * 100, color=params['color'], linewidth=2, label=name)

ax2.set_xlabel('Distance from parent (m)', color='white')
ax2.set_ylabel('Seeds reaching beyond this distance (%)', color='white')
ax2.set_title('Dispersal Reach: Fraction of Seeds vs Distance', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 500)

# Spatial pattern after 10 generations
ax3.set_facecolor('#111827')
# Gravity only: seeds cluster
n_gen = 10
n_seeds_per_gen = 20
positions_gravity = [0]
for gen in range(n_gen):
    new_positions = []
    for pos in positions_gravity[-50:]:  # limit for performance
        offspring = pos + np.random.exponential(2, n_seeds_per_gen) * np.random.choice([-1, 1], n_seeds_per_gen)
        new_positions.extend(offspring[:5])  # survival limit
    positions_gravity = new_positions

positions_hornbill = [0]
for gen in range(n_gen):
    new_positions = []
    for pos in positions_hornbill[-50:]:
        # Mix of gravity and hornbill dispersal
        n_grav = 15
        n_horn = 5
        grav_off = pos + np.random.exponential(2, n_grav) * np.random.choice([-1, 1], n_grav)
        horn_off = pos + np.random.lognormal(5, 1, n_horn) * np.random.choice([-1, 1], n_horn)
        new_positions.extend(list(grav_off[:3]) + list(horn_off[:2]))
    positions_hornbill = new_positions

ax3.hist(positions_gravity, bins=50, color='#ef4444', alpha=0.6, label='Gravity only', density=True)
ax3.hist(positions_hornbill, bins=50, color='#22c55e', alpha=0.6, label='With hornbills', density=True)
ax3.set_xlabel('Position (m)', color='white')
ax3.set_ylabel('Tree density', color='white')
ax3.set_title(f'Forest Spread After {n_gen} Generations', color='white', fontsize=13)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Bar chart: dispersal stats
ax4.set_facecolor('#111827')
mechanisms = ['Gravity', 'Wind', 'Small bird', 'Hornbill', 'Water']
mean_dist = [3, 25, 80, 500, 1000]
max_dist = [15, 200, 500, 5000, 50000]

x = np.arange(len(mechanisms))
width = 0.35
bars1 = ax4.bar(x - width/2, mean_dist, width, color='#3b82f6', label='Mean distance (m)')
bars2 = ax4.bar(x + width/2, [m/10 for m in max_dist], width, color='#f59e0b', label='Max distance (m/10)')
ax4.set_xticks(x)
ax4.set_xticklabels(mechanisms, rotation=20, ha='right')
ax4.set_ylabel('Distance (m)', color='white')
ax4.set_title('Dispersal Distances by Mechanism', color='white', fontsize=13)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Dispersal kernel summary:")
print(f"{'Mechanism':<15} {'Mean (m)':>10} {'Max (m)':>10}")
for mech, md, mx in zip(mechanisms, mean_dist, max_dist):
    print(f"{mech:<15} {md:>10} {mx:>10,}")
print()
print("Hornbills disperse seeds 100-200x farther than gravity alone.")
print("This long-distance dispersal is critical for:")
print("  - Colonising new habitat after disturbance")
print("  - Maintaining genetic diversity across populations")
print("  - Forest migration in response to climate change")`,
      challenge: 'Climate change is shifting suitable habitat northward by about 500m per year. Which dispersal mechanism can keep up? Calculate the maximum colonisation speed for each mechanism (max_distance / generation_time, assume 10-year generation).',
      successHint: 'Seed dispersal links botany, ecology, animal behaviour, and even climate science. The hornbill is not just eating fruit — it is shaping the future of the forest.',
    },
    {
      title: 'Conservation — protecting the hornbill and its forest',
      concept: `The great hornbill is classified as **Vulnerable** on the IUCN Red List. Its population is declining due to:

- **Habitat loss**: deforestation removes nesting trees (hornbills need large, old trees with natural cavities)
- **Hunting**: hornbill casques and feathers are used in traditional ceremonies (especially in Nagaland)
- **Logging**: selective logging of large trees disproportionately removes hornbill nest sites
- **Fragmentation**: roads and clearings break continuous forest into isolated patches

Conservation requires data. Scientists use several methods:
- **Nest monitoring**: tracking occupied nests, hatching success, chick survival
- **Population surveys**: counting birds along transects or at fruiting trees
- **GPS tracking**: fitting birds with satellite transmitters to map home ranges
- **Habitat mapping**: using satellite imagery to quantify forest cover and fragmentation

The concept of **Minimum Viable Population** (MVP) is crucial — below a certain number, a population cannot sustain itself due to inbreeding, demographic accidents, and genetic drift. For large birds like hornbills, MVP is estimated at 500-5,000 individuals depending on the model.`,
      analogy: 'Conservation is like maintaining an old building. You cannot just keep the walls (protect a few trees) — you need the foundation (intact soil), the plumbing (rivers and water), the electrical system (pollinators and dispersers), and the roof (forest canopy). Remove any system and the whole building eventually collapses. Protecting the hornbill means protecting the entire forest ecosystem.',
      storyConnection: 'The Naga people\'s traditional reverence for the hornbill was itself a conservation mechanism. Hunting was regulated by cultural rules — only certain clans could hunt hornbills, and only at certain times. When these cultural controls weaken, hornbill populations crash. The story\'s message — respect the hornbill — is also a conservation message.',
      checkQuestion: 'If a forest fragment has 50 hornbills and the MVP is 500, is the population doomed? What could save it?',
      checkAnswer: 'Not necessarily doomed, but at high risk. Solutions: (1) Connect the fragment to other forests via corridors, allowing gene flow. (2) Translocate birds from other populations to increase genetic diversity. (3) Protect and restore habitat to increase carrying capacity. (4) Reduce hunting pressure. The 50-bird population can grow to 500+ if conditions improve — but without intervention, inbreeding and demographic chance will likely cause extinction within decades.',
      codeIntro: 'Simulate a population over time with and without conservation intervention.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Population viability simulation
years = 100
n_simulations = 50

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Scenario 1: No conservation (declining habitat)
ax1.set_facecolor('#111827')
for sim in range(n_simulations):
    pop = np.zeros(years)
    pop[0] = 200  # starting population
    for y in range(1, years):
        growth_rate = 0.02 - 0.001 * y  # declining due to habitat loss
        noise = np.random.normal(0, 0.05)
        pop[y] = max(0, pop[y-1] * (1 + growth_rate + noise))
    color = '#ef4444' if pop[-1] == 0 else '#ef4444'
    ax1.plot(range(years), pop, color=color, alpha=0.15, linewidth=0.5)

ax1.axhline(50, color='#f59e0b', linestyle='--', linewidth=1, label='Critical threshold (50)')
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Population', color='white')
ax1.set_title('No Conservation: Population Collapse', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Scenario 2: With conservation (habitat protected)
ax2.set_facecolor('#111827')
for sim in range(n_simulations):
    pop = np.zeros(years)
    pop[0] = 200
    for y in range(1, years):
        growth_rate = 0.03  # stable, healthy growth
        noise = np.random.normal(0, 0.05)
        carrying_capacity = 500
        pop[y] = max(0, pop[y-1] * (1 + growth_rate * (1 - pop[y-1]/carrying_capacity) + noise))
    ax2.plot(range(years), pop, color='#22c55e', alpha=0.15, linewidth=0.5)

ax2.axhline(500, color='#3b82f6', linestyle='--', linewidth=1, label='Carrying capacity (500)')
ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Population', color='white')
ax2.set_title('With Conservation: Population Recovery', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Threats breakdown
ax3.set_facecolor('#111827')
threats = ['Habitat loss', 'Hunting', 'Logging\
(nest trees)', 'Fragmentation', 'Climate\
change']
impact = [35, 25, 20, 15, 5]
colors_pie = ['#ef4444', '#f59e0b', '#a855f7', '#3b82f6', '#6b7280']
bars = ax3.barh(threats, impact, color=colors_pie, edgecolor='none')
ax3.set_xlabel('Relative impact (%)', color='white')
ax3.set_title('Threats to Great Hornbill Populations', color='white', fontsize=12)
ax3.tick_params(colors='gray')
for bar, pct in zip(bars, impact):
    ax3.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
             f'{pct}%', va='center', color='white', fontsize=10)

# Habitat fragmentation effect
ax4.set_facecolor('#111827')
fragment_sizes = np.linspace(1, 100, 100)  # km²
# Species-area relationship: S = c * A^z
z = 0.25  # typical for birds
c = 5
species_count = c * fragment_sizes**z

# Hornbill needs >50 km² for viable population
ax4.plot(fragment_sizes, species_count, color='#22c55e', linewidth=2, label='Bird species supported')
ax4.axvline(50, color='#f59e0b', linestyle='--', linewidth=1)
ax4.annotate('Minimum fragment size\
for hornbills (~50 km²)',
            xy=(50, c * 50**z), xytext=(60, c * 30**z),
            color='#f59e0b', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax4.set_xlabel('Forest fragment size (km²)', color='white')
ax4.set_ylabel('Bird species supported', color='white')
ax4.set_title('Species-Area Relationship', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Conservation simulation results:")
print("  Without conservation: most populations collapse within 60-80 years")
print("  With conservation: populations stabilize near carrying capacity")
print()
print("Key conservation actions:")
print("  1. Protect large trees (nest sites take 100+ years to grow)")
print("  2. Maintain forest corridors between fragments")
print("  3. Work with communities on sustainable alternatives to hunting")
print("  4. Monitor populations with standardized surveys")
print("  5. Support fig tree regeneration (critical food source)")`,
      challenge: 'Add a third scenario: "Late conservation" — no action for 40 years, then full protection. Does the population recover? How much harder is late conservation compared to early conservation?',
      successHint: 'Conservation is applied ecology — using the science of bird anatomy, flight, nesting, symbiosis, and dispersal to make practical decisions that keep species alive. In Level 2, you will learn the quantitative methods ecologists use to track and manage hornbill populations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Ornithology & Animal Behavior — no prior biology needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
