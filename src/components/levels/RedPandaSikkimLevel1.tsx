import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RedPandaSikkimLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Body temperature — what makes a mammal warm-blooded',
      concept: `**Thermoregulation** is the ability to maintain a stable internal body temperature regardless of the environment. Mammals like the red panda are **endotherms** — they generate their own heat internally through metabolism.

The red panda (*Ailurus fulgens*) lives at elevations of 2,200-4,800 m in Sikkim's cloud forests, where temperatures regularly drop below 0°C. Yet its core body temperature stays at approximately **38°C** — a remarkable 38+ degree difference from the outside air.

Key thermoregulation facts:
- **Normal range**: most mammals maintain 36-40°C
- **Hypothermia**: when core temperature drops below ~35°C (dangerous)
- **Hyperthermia**: when core temperature rises above ~41°C (also dangerous)
- **Comfort zone (thermoneutral zone)**: the range of air temperatures where no extra energy is needed for heating or cooling

The red panda's thermoneutral zone is roughly 10-25°C. Below 10°C, it must burn extra calories to stay warm. Above 25°C (rare at its altitude), it must find ways to cool down.

📚 *We will use Python variables and basic arithmetic to explore the temperature regulation problem.*`,
      analogy: 'Your body is like a house with a thermostat. The heater (metabolism) runs harder when it is cold outside, and air conditioning (sweating, panting) kicks in when it is hot. The goal is always the same: keep the inside at a comfortable temperature. The red panda\'s "house" has excellent insulation (thick fur) but lives in a very cold neighborhood.',
      storyConnection: 'In the story, the red panda of Sikkim thrives in the cold cloud forests of Kanchenjunga\'s foothills. This is not luck — it is the result of millions of years of evolutionary engineering. Every aspect of the red panda\'s body is a thermoregulation solution.',
      checkQuestion: 'If the outside temperature is -10°C and the red panda\'s body is 38°C, what is the temperature gradient across its fur? Why does this gradient matter?',
      checkAnswer: 'The gradient is 38 - (-10) = 48°C. This matters because heat flows from hot to cold — the larger the gradient, the faster heat escapes. The red panda must generate enough metabolic heat to replace what escapes through this 48°C gradient. In summer (15°C), the gradient is only 23°C — half the heat loss, half the metabolic cost.',
      codeIntro: 'Calculate heat loss at different environmental temperatures for the red panda.',
      code: `# Red panda thermoregulation basics

body_temp = 38.0  # °C (core temperature)
fur_insulation = 0.12  # thermal resistance (m²·K/W) — thick fur!

# Environmental temperatures in Sikkim cloud forest
conditions = {
    "Winter night (-10°C)": -10,
    "Winter day (2°C)": 2,
    "Spring morning (8°C)": 8,
    "Thermoneutral (15°C)": 15,
    "Summer day (22°C)": 22,
}

# Surface area of a red panda (roughly 0.3 m²)
surface_area = 0.3  # m²

print("=== Red Panda Heat Loss Calculator ===")
print(f"Body temp: {body_temp}°C | Fur insulation: {fur_insulation} m²·K/W")
print(f"Surface area: {surface_area} m²")
print()
print(f"{'Condition':<30} {'Gradient':>10} {'Heat Loss':>12} {'Calories/hr':>12}")
print("-" * 66)

for name, env_temp in conditions.items():
    gradient = body_temp - env_temp  # °C = K for differences
    heat_loss_watts = surface_area * gradient / fur_insulation
    calories_per_hour = heat_loss_watts * 3600 / 4184  # convert J to kcal

    print(f"{name:<30} {gradient:>8.0f}°C {heat_loss_watts:>10.1f} W {calories_per_hour:>10.1f}")

print()
# Daily calorie need just for thermoregulation
winter_loss = surface_area * 48 / fur_insulation
winter_cal = winter_loss * 3600 * 24 / 4184
summer_loss = surface_area * 16 / fur_insulation
summer_cal = summer_loss * 3600 * 24 / 4184

print(f"Winter heating cost: ~{winter_cal:.0f} kcal/day")
print(f"Summer heating cost: ~{summer_cal:.0f} kcal/day")
print(f"Winter costs {winter_cal/summer_cal:.1f}x more energy than summer!")
print(f"A red panda eats ~1,500 kcal/day (mostly bamboo)")`,
      challenge: 'What if the red panda\'s fur insulation doubled (from 0.12 to 0.24 m²·K/W)? How much would winter energy costs drop? Is there a downside to thicker fur?',
      successHint: 'You have quantified the red panda\'s thermoregulation challenge using real physics. The numbers reveal why high-altitude mammals need either thick fur (insulation) or high metabolism (more food) — and why the red panda uses both strategies.',
    },
    {
      title: 'Surface area to volume ratio — why small animals lose heat faster',
      concept: `The **surface area to volume ratio (SA:V)** is one of the most important concepts in thermoregulation. Heat is generated in the body\'s volume (by metabolism) but lost through its surface.

As an animal gets larger:
- Volume increases as length³ (cubic)
- Surface area increases as length² (square)
- SA:V ratio decreases as 1/length

This means:
- **Small animals** (mouse, 20g): high SA:V → lose heat very fast → must eat constantly
- **Medium animals** (red panda, 5kg): moderate SA:V → manageable heat loss
- **Large animals** (elephant, 5000kg): low SA:V → retain heat easily → may overheat

The red panda weighs 3-6 kg — roughly the size of a large cat. Its SA:V ratio is high enough that heat loss is a real challenge in Sikkim\'s cold forests, but not so high that survival is impossible.

**Bergmann\'s Rule**: within a species, populations in colder climates tend to be larger (lower SA:V). Red pandas in the higher Himalaya are slightly larger than those at lower elevations.

📚 *We will calculate SA:V ratios for different-sized animals and see how size affects heat loss.*`,
      analogy: 'Imagine two snowballs: one the size of a marble, one the size of a basketball. Leave both in the sun. The marble melts first because its surface (where heat enters) is large relative to its volume (where cold is stored). A mouse is the marble — it loses heat through its proportionally enormous surface. An elephant is the basketball.',
      storyConnection: 'The red panda\'s size is not random. At 3-6 kg, it is large enough to survive Sikkim\'s cold but small enough to climb bamboo. Evolution found a sweet spot: large enough for thermal viability, small enough for its arboreal lifestyle.',
      checkQuestion: 'A shrew weighs 5 grams and must eat 80-90% of its body weight daily. A red panda weighs 5 kg and eats about 30% of its body weight. Why the huge difference?',
      checkAnswer: 'The shrew has a vastly higher SA:V ratio (roughly 10× that of the red panda). It loses heat so fast that it must eat almost continuously to fuel its metabolism. If a shrew stops eating for 3-4 hours, it can die of hypothermia. The red panda\'s larger size gives it a thermal buffer — it can sleep for hours without eating.',
      codeIntro: 'Compare SA:V ratios and heat loss rates across animals of different sizes.',
      code: `# Surface area to volume ratio across the animal kingdom

import math

# Model animals as spheres for simplicity
# SA = 4πr², V = (4/3)πr³, SA:V = 3/r

animals = [
    ("Shrew", 0.005),           # 5 g
    ("Mouse", 0.02),            # 20 g
    ("Rat", 0.3),               # 300 g
    ("Red panda", 5.0),         # 5 kg
    ("Dog (medium)", 20.0),     # 20 kg
    ("Human", 70.0),            # 70 kg
    ("Tiger", 200.0),           # 200 kg
    ("Elephant", 5000.0),       # 5000 kg
]

# Assume density ≈ 1000 kg/m³ (close to water)
density = 1000  # kg/m³

print("=== Surface Area to Volume Ratio ===")
print(f"{'Animal':<20} {'Mass(kg)':>10} {'Radius(cm)':>12} {'SA:V(1/cm)':>12} {'Heat Loss':>12}")
print("-" * 70)

sa_vs = []
masses = []
names = []

for name, mass in animals:
    volume = mass / density  # m³
    radius = (3 * volume / (4 * math.pi)) ** (1/3)  # m
    sa = 4 * math.pi * radius**2
    sa_v = sa / volume  # 1/m

    radius_cm = radius * 100
    sa_v_per_cm = sa_v / 100

    # Relative heat loss (proportional to SA:V × gradient)
    # Normalized to red panda = 1.0
    heat_factor = sa_v / (sa / volume)  # will normalize later
    sa_vs.append(sa_v)
    masses.append(mass)
    names.append(name)

    print(f"{name:<20} {mass:>10.3f} {radius_cm:>12.2f} {sa_v_per_cm:>12.2f} ")

# Normalize heat loss to red panda
rp_idx = names.index("Red panda")
rp_sav = sa_vs[rp_idx]
print()
print("=== Relative Heat Loss Rate (Red Panda = 1.0) ===")
for i, (name, sav) in enumerate(zip(names, sa_vs)):
    relative = sav / rp_sav
    bar = "█" * int(relative * 5)
    print(f"  {name:<20} {relative:>6.2f}x  {bar}")

print()
print("Key insight: the shrew loses heat", end=" ")
print(f"{sa_vs[0]/sa_vs[3]:.1f}x faster per unit mass than the red panda!")
print("This is why shrews eat 90% of their body weight daily.")`,
      challenge: 'What body mass would give a mammal the same SA:V ratio as the red panda but twice the surface area? Would this animal be viable in Sikkim\'s forests?',
      successHint: 'You have discovered one of biology\'s fundamental scaling laws. The SA:V ratio explains everything from why elephants have ears (extra surface area to dump heat) to why hummingbirds must feed every 15 minutes. For the red panda, it explains the minimum viable size for a bamboo-eating mammal in the Himalaya.',
    },
    {
      title: 'Conduction, convection, and radiation — three roads for heat',
      concept: `Heat travels from a warm red panda to the cold forest air via three mechanisms:

1. **Conduction**: heat flows through direct contact. When the red panda sleeps on a cold branch, heat conducts from its belly through the fur to the wood. Rate depends on thermal conductivity and temperature gradient.

2. **Convection**: moving air carries heat away. Wind strips the warm air layer near the fur and replaces it with cold air. Forced convection (wind) is much more effective than natural convection (still air).

3. **Radiation**: all objects emit infrared radiation proportional to T⁴ (Stefan-Boltzmann law). The red panda radiates heat to the cold sky and receives radiation from nearby objects (trees, ground).

In practice, for a furry animal at high altitude:
- **Radiation**: 40-50% of total heat loss (largest at night, to clear cold sky)
- **Convection**: 30-40% (dominant in wind)
- **Conduction**: 10-20% (depends on sleeping posture)

The red panda minimizes all three: thick fur reduces conduction, curling up reduces convection exposure, and wrapping its tail over its face reduces radiation from exposed skin.

📚 *We will calculate heat loss through each mechanism separately.*`,
      analogy: 'Imagine holding a hot cup of coffee outdoors in winter. Conduction steals heat through your hands (direct contact). Convection steals it when wind blows across the cup\'s surface (moving air). Radiation steals it invisibly — the cup glows in infrared, beaming heat into the cold sky. The coffee cools fastest in wind (convection), but radiation works even in still air.',
      storyConnection: 'The red panda in the story curls into a ball with its tail wrapped around its nose. This is not cute — it is survival engineering. Curling reduces the exposed surface area (less convection and radiation). The bushy tail is a portable insulation blanket for the face — the one area with thin fur.',
      checkQuestion: 'Why does the red panda lose more heat by radiation on a clear night than a cloudy night?',
      checkAnswer: 'On a clear night, the panda radiates toward the cold sky (~-30°C effective temperature). Clouds are much warmer (~-5°C) and also radiate back toward the panda. The net radiation loss = what the panda emits minus what it receives from the environment. Clouds reduce this net loss dramatically — they act like a thermal blanket over the forest.',
      codeIntro: 'Calculate heat loss by conduction, convection, and radiation for a red panda in different conditions.',
      code: `# Three modes of heat transfer for a red panda

import math

body_temp = 38 + 273.15   # Kelvin
surface_area = 0.3         # m²
sigma = 5.67e-8            # Stefan-Boltzmann constant
emissivity = 0.95          # biological surface

conditions = [
    ("Calm winter night, clear sky", -10, 1.0, -30),
    ("Windy winter night, clear sky", -10, 5.0, -30),
    ("Calm winter night, cloudy", -10, 1.0, -5),
    ("Spring morning, light breeze", 8, 2.0, 0),
    ("Summer day, still air", 20, 0.5, 15),
]

print("=== Heat Loss by Mode — Red Panda at 38°C ===\\n")

for desc, t_air, wind, t_sky in conditions:
    t_air_k = t_air + 273.15
    t_sky_k = t_sky + 273.15

    # Fur surface temperature (intermediate between body and air)
    fur_r = 0.12  # thermal resistance
    # Approximate fur surface temp
    t_fur_k = body_temp - (body_temp - t_air_k) * 0.4  # fur is ~40% as warm as body

    # Conduction (through sleeping surface, ~10% of body area)
    k_wood = 0.15       # W/(m·K), wood thermal conductivity
    contact_area = 0.03  # m² (belly on branch)
    thickness = 0.03     # m (fur + air gap)
    q_cond = k_wood * contact_area * (body_temp - t_air_k) / thickness

    # Convection (forced, turbulent boundary layer)
    # h = 10.45 - wind + 10*sqrt(wind) for rough estimate (W/m²·K)
    h_conv = 10.45 - wind + 10 * math.sqrt(wind)
    q_conv = h_conv * (surface_area * 0.7) * (t_fur_k - t_air_k)  # 70% exposed

    # Radiation (to sky and surroundings)
    q_rad_emit = emissivity * sigma * surface_area * t_fur_k**4
    q_rad_absorb = emissivity * sigma * surface_area * 0.5 * (t_sky_k**4 + t_air_k**4)
    q_rad = q_rad_emit - q_rad_absorb

    total = q_cond + q_conv + q_rad

    print(f"Condition: {desc}")
    print(f"  Air: {t_air}°C | Wind: {wind} m/s | Sky: {t_sky}°C")
    print(f"  Conduction:  {q_cond:6.1f} W ({q_cond/total*100:4.0f}%)")
    print(f"  Convection:  {q_conv:6.1f} W ({q_conv/total*100:4.0f}%)")
    print(f"  Radiation:   {q_rad:6.1f} W ({q_rad/total*100:4.0f}%)")
    print(f"  TOTAL:       {total:6.1f} W → {total*3600/4184:.0f} cal/hr")
    print()

print("Notice: wind dramatically increases convection loss!")
print("Cloudy nights reduce radiation loss significantly.")
print("This is why red pandas seek sheltered, enclosed sleeping spots.")`,
      challenge: 'What if the red panda wraps its tail around its face (reducing exposed area by 15%)? Recalculate the worst case. How many calories per day does this behavior save?',
      successHint: 'You have decomposed heat transfer into its three fundamental modes and seen how environmental conditions shift their relative importance. The red panda\'s behavioral strategies (curling, sheltering, tail-wrapping) directly target whichever mode dominates.',
    },
    {
      title: 'Metabolic rate and food — fueling the internal furnace',
      concept: `**Basal Metabolic Rate (BMR)** is the minimum energy an animal needs to stay alive at rest in its thermoneutral zone. For mammals, BMR scales with body mass:

**BMR = 70 × M^0.75** (Kleiber\'s Law)

Where BMR is in kcal/day and M is mass in kg.

For a 5 kg red panda: BMR = 70 × 5^0.75 = 70 × 3.34 = **234 kcal/day**

But this is the minimum. In Sikkim\'s cold forests:
- Thermoregulation adds 50-100% above BMR in winter
- Activity (climbing, foraging) adds another 50-100%
- Total daily expenditure: **600-900 kcal/day**

The problem: the red panda eats mostly bamboo, which is very low in calories:
- Bamboo leaves: ~2.5 kcal/g dry weight
- Red panda digests only ~25% of bamboo (poor cellulose digestion)
- Effective: ~0.6 kcal/g consumed
- To get 800 kcal, it must eat ~1,300 g of bamboo = ~1.5 kg/day

That is **30% of its body weight** in bamboo every single day!

📚 *We will use Kleiber\'s Law and basic multiplication to explore the metabolic math of survival.*`,
      analogy: 'Imagine your car gets 3 km per liter but you need to drive 100 km daily. You would spend most of your waking hours at the gas station. That is the red panda\'s life — its "fuel" (bamboo) is so low-energy that it must "refuel" (eat) for 10-13 hours per day, every day.',
      storyConnection: 'The story portrays the red panda as gentle and leisurely. In reality, it is in a constant energy crisis. Every calorie counts. Habitat loss that fragments bamboo forests does not just reduce territory — it forces longer travel between food patches, burning calories the panda cannot afford.',
      checkQuestion: 'Why does the red panda eat bamboo if it is so low in calories? Why not switch to a higher-energy diet?',
      checkAnswer: 'Bamboo is incredibly abundant in Sikkim\'s cloud forests — there is virtually unlimited supply. The panda trades food quality for food quantity. Its ancestors likely ate a varied diet, but specialized on bamboo because competition for richer foods (fruits, insects) was fierce. Over millions of years, its jaw, teeth, and a "pseudo-thumb" (wrist bone) evolved for bamboo processing.',
      codeIntro: 'Calculate the red panda\'s daily energy budget: how much it needs, how much bamboo it must eat, and how many hours it spends foraging.',
      code: `# Red panda energy budget

mass = 5.0  # kg

# Basal Metabolic Rate (Kleiber's Law)
bmr = 70 * mass**0.75
print(f"=== Red Panda Energy Budget ({mass} kg) ===\\n")
print(f"Basal Metabolic Rate (BMR): {bmr:.0f} kcal/day")

# Additional costs
thermoreg_winter = bmr * 0.8   # 80% above BMR for heating in winter
thermoreg_summer = bmr * 0.2   # 20% in summer
activity = bmr * 0.6           # climbing, foraging

winter_total = bmr + thermoreg_winter + activity
summer_total = bmr + thermoreg_summer + activity

print(f"\\nWinter total: {winter_total:.0f} kcal/day")
print(f"  BMR: {bmr:.0f} + Heating: {thermoreg_winter:.0f} + Activity: {activity:.0f}")
print(f"Summer total: {summer_total:.0f} kcal/day")
print(f"  BMR: {bmr:.0f} + Cooling: {thermoreg_summer:.0f} + Activity: {activity:.0f}")

# Bamboo consumption
bamboo_cal_per_gram = 0.6  # effective kcal/g after digestion
eating_rate = 4  # grams per minute (slow, methodical chewing)

for season, total_cal in [("Winter", winter_total), ("Summer", summer_total)]:
    bamboo_g = total_cal / bamboo_cal_per_gram
    bamboo_kg = bamboo_g / 1000
    eating_minutes = bamboo_g / eating_rate
    eating_hours = eating_minutes / 60
    pct_day = eating_hours / 24 * 100

    print(f"\\n{season}:")
    print(f"  Bamboo needed: {bamboo_kg:.1f} kg ({bamboo_kg/mass*100:.0f}% of body weight)")
    print(f"  Eating time: {eating_hours:.1f} hours ({pct_day:.0f}% of the day)")

print(f"\\nThe red panda is essentially an eating machine!")
print(f"It spends more time eating than sleeping.")

# Kleiber's Law comparison
print(f"\\n=== Kleiber's Law: BMR Across Species ===")
for name, m in [("Mouse", 0.02), ("Rat", 0.3), ("Red panda", 5),
                ("Dog", 20), ("Human", 70), ("Elephant", 5000)]:
    b = 70 * m**0.75
    per_kg = b / m
    print(f"  {name:15s} {m:7.1f} kg  BMR: {b:8.0f} kcal/day  ({per_kg:.0f} kcal/kg/day)")

print(f"\\nSmaller animals burn MORE calories per kg!")`,
      challenge: 'If habitat fragmentation forces the red panda to walk 2 km more per day between bamboo patches (costing ~50 extra kcal), how much more bamboo must it eat? How many extra minutes of foraging?',
      successHint: 'You have built a complete energy budget using Kleiber\'s Law. The numbers reveal why the red panda is so vulnerable to habitat loss: it already operates at the edge of its energy budget. Any additional cost — colder winters, longer travel, less bamboo — can tip the balance toward starvation.',
    },
    {
      title: 'Insulation — why the red panda\'s fur is a masterpiece',
      concept: `The red panda\'s fur is a sophisticated insulation system:

- **Two layers**: dense woolly underfur (traps air) + longer coarse guard hairs (shed water)
- **Thickness**: 5-7 cm on the body, shorter on face and legs
- **Color**: dark red-brown absorbs solar radiation during the day
- **Sole fur**: even the soles of its feet are fur-covered (unique among most non-arctic mammals)

How fur insulates:
1. Traps **still air** — air is a poor conductor (k = 0.025 W/m·K vs. water at 0.6 W/m·K)
2. Multiple layers create many tiny air pockets
3. Guard hairs prevent wind from penetrating to the underfur
4. When wet, fur loses ~80% of its insulation (water replaces trapped air)

Thermal conductivity comparison:
- Still air: 0.025 W/(m·K)
- Dry fur: 0.04 W/(m·K) (mostly air!)
- Wet fur: 0.20 W/(m·K) — 5× worse!
- Water: 0.60 W/(m·K) — 24× worse than air!

This is why the red panda avoids rain — wet fur is a death sentence in cold weather.

📚 *We will model fur insulation as a series of thermal resistances, like electrical resistors in series.*`,
      analogy: 'Fur works like a down jacket: it does not generate heat — it traps still air, which is a terrible conductor. A 5 cm jacket is really 5 cm of trapped air held in place by feathers or fur fibers. Remove the trapping structure (compress the jacket) and the insulation vanishes. Wet it (replace air with water), and you might as well wear nothing.',
      storyConnection: 'The red panda of Sikkim relies on its fur to survive temperatures that would kill an uninsulated mammal in hours. When the story describes the panda curled on a branch in the mist, it is describing an animal wrapped in one of nature\'s finest insulation technologies — evolved over 5 million years of Himalayan winters.',
      checkQuestion: 'Why does the red panda have fur on the soles of its feet, unlike most mammals?',
      checkAnswer: 'Two reasons: (1) Insulation — when standing on a cold branch or snow, bare paw pads would conduct heat directly to the surface. Sole fur prevents this. (2) Grip — the fur provides traction on icy, mossy branches. Most mammals in warm climates need bare pads for grip on dry surfaces, but the red panda\'s environment is always wet, cold, and mossy.',
      codeIntro: 'Model fur insulation using thermal resistance networks and calculate how wetness degrades performance.',
      code: `# Fur insulation model: thermal resistance network

# Thermal conductivities (W/m·K)
k_air = 0.025
k_fur_dry = 0.04    # mostly trapped air
k_fur_wet = 0.20    # water replaces air
k_skin = 0.37       # biological tissue
k_water = 0.60

# Red panda fur system
fur_thickness = 0.05   # 5 cm = 0.05 m
skin_thickness = 0.003 # 3 mm
body_temp = 38  # °C

surface_area = 0.3  # m²

print("=== Red Panda Fur Insulation Analysis ===\\n")

conditions = [
    ("Dry fur, -10°C", k_fur_dry, -10),
    ("Dry fur, 5°C", k_fur_dry, 5),
    ("Damp fur (30% wet), -10°C", 0.04 + 0.3*(0.20-0.04), -10),
    ("Soaked fur, -10°C", k_fur_wet, -10),
    ("No fur (bare skin), -10°C", k_air, -10),  # just air boundary layer
]

print(f"{'Condition':<35} {'R_total':>10} {'Heat Loss':>12} {'Survival':>12}")
print("-" * 72)

for desc, k_fur, t_env in conditions:
    # Thermal resistance = thickness / (conductivity × area)
    r_skin = skin_thickness / (k_skin * surface_area)
    r_fur = fur_thickness / (k_fur * surface_area)
    r_total = r_skin + r_fur

    gradient = body_temp - t_env
    heat_loss = gradient / r_total  # Watts
    cal_per_hr = heat_loss * 3600 / 4184

    # Can the red panda's metabolism cover this?
    max_metabolic_heat = 25  # Watts (approximate max sustained)
    status = "OK" if heat_loss < max_metabolic_heat else "DANGER"

    print(f"{desc:<35} {r_total:>8.2f} K/W {heat_loss:>8.1f} W {status:>12}")

print()

# Show the multiplier effect of wetness
dry_r = fur_thickness / (k_fur_dry * surface_area)
wet_r = fur_thickness / (k_fur_wet * surface_area)
print(f"Dry fur resistance: {dry_r:.2f} K/W")
print(f"Wet fur resistance: {wet_r:.2f} K/W")
print(f"Wet fur is {dry_r/wet_r:.1f}x WORSE at insulating!")
print()
print("This is why the red panda:")
print("  • Has water-repellent guard hairs")
print("  • Shelters under rock overhangs in rain")
print("  • Grooms frequently to maintain fur loft")
print("  • Can die from hypothermia if caught in freezing rain")`,
      challenge: 'Model what happens if fur thickness is reduced from 5 cm to 3 cm (due to mange or poor nutrition). At what temperature does the heat loss exceed the maximum metabolic capacity?',
      successHint: 'You have modeled insulation using thermal resistance — the same approach engineers use to design building insulation. The 5× degradation from wet fur explains why the red panda\'s rain-avoidance behavior is not preference but necessity. Wet + cold = fatal.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Thermoregulation basics with Python</span>
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
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
