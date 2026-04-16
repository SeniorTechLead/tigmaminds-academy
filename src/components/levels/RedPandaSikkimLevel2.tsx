import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RedPandaSikkimLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plotting the thermal comfort zone — when does the panda sweat?',
      concept: `The **thermoneutral zone (TNZ)** is the range of ambient temperatures where a mammal can maintain its body temperature through passive means alone — no shivering, no sweating, no metabolic adjustments.

Below the **Lower Critical Temperature (LCT)**, the animal must increase metabolism to generate more heat. Above the **Upper Critical Temperature (UCT)**, it must actively cool (panting, sweating, behavioral avoidance).

For the red panda:
- LCT: approximately 10°C (below this, heating costs rise)
- UCT: approximately 25°C (above this, heat stress begins)
- TNZ: 10-25°C (a 15°C comfort window)

Within the TNZ, metabolic rate is at baseline. Outside it, metabolic rate increases linearly with the distance from the TNZ boundary.

Sikkim\'s climate data shows that red panda habitat spends:
- ~40% of the year below the LCT (winter months)
- ~5% above the UCT (rare summer days at lower elevations)
- ~55% within the TNZ

📚 *We will use matplotlib to visualize metabolic rate as a function of environmental temperature.*`,
      analogy: 'The TNZ is like the temperature setting on your thermostat. Between 18-25°C, your heating and cooling systems are both off (minimum energy bill). Below 18°C, the heater kicks on — the colder it gets, the harder it runs. Above 25°C, the AC kicks on. The wider your TNZ, the lower your average energy bill.',
      storyConnection: 'The red panda of Sikkim lives in a climate that pushes it below its LCT for nearly half the year. This is not comfortable — it is a constant metabolic challenge. The story\'s serene panda is actually burning through calories just to keep its internal furnace running.',
      checkQuestion: 'Why is the red panda\'s TNZ relatively narrow (15°C) compared to a dog\'s (roughly 20°C)?',
      checkAnswer: 'The red panda is smaller (higher SA:V ratio = faster heat loss), has lower aerobic capacity (less able to generate surplus heat), and evolved in a consistently cold environment (less need for heat tolerance). Dogs, especially larger breeds, have better cardiovascular systems for heat generation and more variable habitats requiring broader tolerance.',
      codeIntro: 'Plot the metabolic rate curve showing the thermoneutral zone and the cost of cold/heat stress.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Red panda thermoregulation model
lct = 10     # Lower Critical Temperature (°C)
uct = 25     # Upper Critical Temperature (°C)
bmr = 9.7    # Basal metabolic rate (Watts) — 234 kcal/day

temps = np.linspace(-20, 35, 200)
metabolic_rate = np.zeros_like(temps)

for i, t in enumerate(temps):
    if t < lct:
        # Below LCT: metabolic rate increases to compensate heat loss
        metabolic_rate[i] = bmr + 0.8 * (lct - t)
    elif t > uct:
        # Above UCT: metabolic rate increases for active cooling
        metabolic_rate[i] = bmr + 1.2 * (t - uct)
    else:
        # Within TNZ: basal rate
        metabolic_rate[i] = bmr

fig, ax = plt.subplots(figsize=(10, 6))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# TNZ region
ax.axvspan(lct, uct, alpha=0.2, color='#22c55e', label='Thermoneutral Zone')

# Metabolic rate curve
ax.plot(temps, metabolic_rate, color='#f97316', linewidth=2.5, label='Metabolic Rate')

# Critical temperatures
ax.axvline(x=lct, color='#3b82f6', linestyle='--', alpha=0.7, label=f'LCT ({lct}°C)')
ax.axvline(x=uct, color='#ef4444', linestyle='--', alpha=0.7, label=f'UCT ({uct}°C)')
ax.axhline(y=bmr, color='gray', linestyle=':', alpha=0.5, label=f'BMR ({bmr} W)')

# Mark Sikkim conditions
sikkim_temps = {'Winter night': -8, 'Winter day': 3, 'Spring': 14, 'Summer': 22}
for label, t in sikkim_temps.items():
    mr = bmr + max(0, 0.8*(lct-t)) + max(0, 1.2*(t-uct))
    ax.plot(t, mr, 'o', markersize=8, color='white', zorder=5)
    ax.annotate(label, (t, mr+0.5), color='white', fontsize=8, ha='center')

ax.set_xlabel('Environmental Temperature (°C)', color='white', fontsize=12)
ax.set_ylabel('Metabolic Rate (Watts)', color='white', fontsize=12)
ax.set_title('Red Panda Thermoregulation: Metabolic Rate vs. Temperature', color='white', fontsize=13, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('tnz.png', dpi=100, facecolor='#1f2937')
plt.show()

# Energy cost by season
print("=== Seasonal Energy Cost (Red Panda) ===")
for season, t_avg in [("Winter", -2), ("Spring", 12), ("Summer", 20), ("Autumn", 8)]:
    mr = bmr + max(0, 0.8*(lct-t_avg)) + max(0, 1.2*(t_avg-uct))
    daily_kcal = mr * 86400 / 4184
    extra_pct = (mr - bmr) / bmr * 100
    print(f"  {season}: {t_avg:+3d}°C → {mr:.1f} W → {daily_kcal:.0f} kcal/day (+{extra_pct:.0f}% above BMR)")`,
      challenge: 'If climate change raises average winter temperatures by 3°C (from -2°C to 1°C), how much energy does the red panda save? Is warming good or bad for the red panda?',
      successHint: 'You have created a classic thermoregulation plot used in comparative physiology. The V-shaped metabolic curve is universal to endotherms. For the red panda, the narrow TNZ and cold Sikkim climate mean thermoregulation is a major energy drain — making food availability the key survival factor.',
    },
    {
      title: 'Fur depth vs. heat loss — the insulation gradient',
      concept: `Not all parts of a red panda have equal insulation. Fur depth varies dramatically:
- **Back and flanks**: 5-7 cm (maximum protection from rain and cold)
- **Belly**: 3-4 cm (less when curled, more when exposed)
- **Tail**: 4-5 cm (bushy, used as a blanket)
- **Face**: 1-2 cm (short for sensory function)
- **Paws**: 1-2 cm (shorter for dexterity)

This creates an **insulation map** where different body regions lose heat at different rates. The face and paws, with their thin fur, act as thermal windows — they radiate more heat per unit area than the well-insulated torso.

In cold conditions, the red panda reduces blood flow to its extremities (vasoconstriction), allowing paw and ear temperatures to drop close to ambient. This saves heat by reducing the gradient at poorly insulated surfaces — a strategy called **regional heterothermy**.

📚 *We will use matplotlib to create a heat loss map and a stacked area chart showing contributions from different body regions.*`,
      analogy: 'Think of a house with different insulation in different rooms. The attic (back) has thick insulation — barely any heat escapes. The windows (face and paws) have thin insulation — heat pours out. You cannot eliminate the windows (the panda needs to see and grip), so you minimize their area and draw the curtains (vasoconstriction) when it is coldest.',
      storyConnection: 'When the story describes the red panda wrapped in its own tail on a cold Sikkim night, it is not a cozy image — it is survival triage. The tail insulates the face (the biggest thermal window), and curling minimizes exposed belly and paw area. Every posture change is a thermoregulation decision.',
      checkQuestion: 'Why does the red panda not just grow thick fur everywhere, including its face and paws?',
      checkAnswer: 'Thick fur on the face would block whiskers (critical for navigating dense bamboo at night) and impair vision. Thick fur on paws would reduce grip on icy branches and prevent the dexterous manipulation needed to strip bamboo leaves. Evolution trades thermal efficiency for functional necessity — the panda must see, feel, and grip to eat, even if it costs heat.',
      codeIntro: 'Map heat loss across different body regions and show how posture changes affect total heat loss.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Body region data
regions = {
    'Back/flanks': {'area': 0.12, 'fur_cm': 6.0, 'k': 0.04},
    'Belly':       {'area': 0.06, 'fur_cm': 3.5, 'k': 0.04},
    'Tail':        {'area': 0.04, 'fur_cm': 4.5, 'k': 0.04},
    'Face/ears':   {'area': 0.03, 'fur_cm': 1.5, 'k': 0.05},
    'Legs':        {'area': 0.03, 'fur_cm': 2.5, 'k': 0.04},
    'Paws':        {'area': 0.02, 'fur_cm': 1.0, 'k': 0.06},
}

body_temp = 38
temps = np.linspace(-15, 25, 100)

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

# Panel 1: Heat loss by region at -10°C
ax = axes[0]
ax.set_facecolor('#1f2937')
t_env = -10
gradient = body_temp - t_env
names = []
losses = []
areas = []

for (name, data), color in zip(regions.items(), colors):
    fur_m = data['fur_cm'] / 100
    q = data['k'] * data['area'] * gradient / fur_m
    names.append(name)
    losses.append(q)
    areas.append(data['area'])

ax.barh(names, losses, color=colors, alpha=0.8)
ax.set_xlabel('Heat Loss (W)', color='white', fontsize=11)
ax.set_title(f'Heat Loss by Region ({t_env}°C)', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')

# Panel 2: Stacked area over temperature range
ax = axes[1]
ax.set_facecolor('#1f2937')
all_losses = []
for name, data in regions.items():
    fur_m = data['fur_cm'] / 100
    q_arr = data['k'] * data['area'] * np.maximum(body_temp - temps, 0) / fur_m
    all_losses.append(q_arr)

ax.stackplot(temps, *all_losses, labels=list(regions.keys()),
             colors=colors, alpha=0.8)
ax.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax.set_ylabel('Heat Loss (W)', color='white', fontsize=11)
ax.set_title('Stacked Heat Loss', color='white', fontsize=12, fontweight='bold')
ax.legend(loc='upper right', facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Posture comparison
ax = axes[2]
ax.set_facecolor('#1f2937')

postures = {
    'Stretched out': {'factor': {'Back/flanks': 1, 'Belly': 1, 'Tail': 1, 'Face/ears': 1, 'Legs': 1, 'Paws': 1}},
    'Curled up': {'factor': {'Back/flanks': 1, 'Belly': 0.3, 'Tail': 0.5, 'Face/ears': 1, 'Legs': 0.5, 'Paws': 0.4}},
    'Curled + tail wrap': {'factor': {'Back/flanks': 1, 'Belly': 0.3, 'Tail': 0.3, 'Face/ears': 0.3, 'Legs': 0.5, 'Paws': 0.4}},
}

posture_names = list(postures.keys())
posture_totals = []

for pname, pdata in postures.items():
    total = 0
    for rname, rdata in regions.items():
        fur_m = rdata['fur_cm'] / 100
        factor = pdata['factor'][rname]
        q = rdata['k'] * (rdata['area'] * factor) * (body_temp - (-10)) / fur_m
        total += q
    posture_totals.append(total)

bars = ax.bar(posture_names, posture_totals, color=['#ef4444', '#f59e0b', '#22c55e'], alpha=0.8)
for bar, val in zip(bars, posture_totals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
            f'{val:.1f}W', ha='center', color='white', fontsize=10)
ax.set_title('Posture Effect (-10°C)', color='white', fontsize=12, fontweight='bold')
ax.set_ylabel('Total Heat Loss (W)', color='white', fontsize=11)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

plt.tight_layout()
plt.savefig('insulation_map.png', dpi=100, facecolor='#1f2937')
plt.show()

# Summary
print(f"At -10°C:")
print(f"  Stretched: {posture_totals[0]:.1f} W")
print(f"  Curled:    {posture_totals[1]:.1f} W ({(1-posture_totals[1]/posture_totals[0])*100:.0f}% reduction)")
print(f"  +Tail:     {posture_totals[2]:.1f} W ({(1-posture_totals[2]/posture_totals[0])*100:.0f}% reduction)")
print(f"\
Tail-wrapping saves {(posture_totals[0]-posture_totals[2])*24*3600/4184:.0f} kcal/day!")`,
      challenge: 'Add vasoconstriction: reduce the face/ear and paw temperature from 38°C to 15°C in the curled+tail posture. How much additional heat is saved?',
      successHint: 'You have built a body-region heat loss model with posture adjustment. The stacked area chart clearly shows that the face and paws contribute disproportionately to heat loss. The tail-wrap behavior saves enough energy to cover hours of foraging — a real survival advantage.',
    },
    {
      title: 'Seasonal weight cycles — plotting the energy rollercoaster',
      concept: `Red pandas in Sikkim undergo predictable seasonal weight changes:
- **Autumn** (Oct-Nov): weight peaks at 5.5-6 kg as the panda builds fat reserves before winter
- **Winter** (Dec-Feb): weight drops to 4-4.5 kg as reserves are burned for heating
- **Spring** (Mar-Apr): weight stabilizes as bamboo growth resumes
- **Summer** (May-Sep): gradual weight gain during the monsoon growing season

This cycle of **fat storage and depletion** is a survival strategy. Fat serves as:
1. **Energy reserve**: 1 kg of fat = ~7,700 kcal — enough for 10 days of heating
2. **Insulation**: subcutaneous fat adds an extra thermal barrier
3. **Water reserve**: fat metabolism produces water

The cycle is tightly linked to bamboo availability:
- New bamboo shoots (spring) are high in protein and calories
- Mature bamboo leaves (autumn) provide steady but lower calories
- Winter bamboo is sparse and low quality

If a red panda enters winter underweight (due to habitat disturbance or disease), it may not survive to spring.

📚 *We will use numpy arrays and matplotlib to model and visualize the annual weight cycle.*`,
      analogy: 'The weight cycle is like a financial year. You save during the good months (autumn = fat gain) and spend during the lean months (winter = fat loss). If your savings (fat reserve) are not enough to cover the lean period, you go bankrupt (die of starvation). The red panda budgets its body weight like a careful accountant.',
      storyConnection: 'The story shows the red panda in its lush green forest, but this beauty hides a harsh truth: the panda must gain 1-1.5 kg of fat in autumn or face death in winter. Every bamboo leaf eaten in September is a deposit toward a life-or-death winter savings account.',
      checkQuestion: 'If a 6 kg red panda loses 1.5 kg over winter, and fat has 7,700 kcal/kg, how many days of heating does this fat provide? Assume winter heating costs 400 kcal/day above BMR.',
      checkAnswer: '1.5 kg × 7,700 kcal/kg = 11,550 kcal of energy. At 400 kcal/day of heating cost: 11,550/400 = 29 days. Winter in Sikkim lasts about 90 days, so fat alone covers only 1/3 of winter. The panda must continue foraging throughout winter — it cannot hibernate.',
      codeIntro: 'Model the red panda\'s annual weight cycle driven by food intake and energy expenditure.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monthly model
months = np.arange(12)
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

# Monthly average temperature in Sikkim red panda habitat (°C)
temps = np.array([-2, 1, 6, 11, 14, 16, 17, 16, 14, 10, 5, 0])

# Food intake (kcal/day) — seasonal bamboo availability
food_intake = np.array([550, 580, 700, 850, 900, 850, 800, 820, 880, 920, 750, 600])

# Energy expenditure (kcal/day) — BMR + thermoregulation + activity
bmr = 234  # kcal/day (Kleiber's law, 5 kg)
thermoreg = np.array([310, 280, 200, 100, 30, 10, 5, 10, 30, 80, 200, 280])  # heating cost
activity = np.array([100, 110, 130, 150, 160, 150, 140, 150, 160, 150, 120, 100])  # climbing, foraging
total_expend = bmr + thermoreg + activity

# Net energy and weight change
net_energy = food_intake - total_expend  # kcal/day
# 1 kg fat ≈ 7700 kcal
weight_change_per_month = net_energy * 30 / 7700  # kg/month

# Cumulative weight starting from October (peak preparation)
# Start in January with 4.8 kg
weight = [4.8]
for i in range(11):
    w = weight[-1] + weight_change_per_month[i]
    weight.append(max(w, 3.5))  # minimum viable weight
weight = np.array(weight[:12])

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Red Panda Annual Energy & Weight Cycle', color='white', fontsize=14, fontweight='bold')

# Panel 1: Energy budget
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
x = np.arange(12)
ax.bar(x - 0.2, food_intake, 0.35, color='#22c55e', alpha=0.8, label='Food intake')
ax.bar(x + 0.2, total_expend, 0.35, color='#ef4444', alpha=0.8, label='Expenditure')
ax.set_xticks(x)
ax.set_xticklabels(month_names, fontsize=8, color='white')
ax.set_ylabel('kcal/day', color='white')
ax.set_title('Monthly Energy Budget', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

# Panel 2: Net energy
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
colors = ['#22c55e' if n >= 0 else '#ef4444' for n in net_energy]
ax.bar(x, net_energy, color=colors, alpha=0.8)
ax.axhline(y=0, color='white', linewidth=0.5)
ax.set_xticks(x)
ax.set_xticklabels(month_names, fontsize=8, color='white')
ax.set_ylabel('Net Energy (kcal/day)', color='white')
ax.set_title('Energy Surplus/Deficit', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

# Panel 3: Weight cycle
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
ax.plot(x, weight, 'o-', color='#f59e0b', linewidth=2.5, markersize=8)
ax.fill_between(x, weight, weight.min(), alpha=0.2, color='#f59e0b')
ax.axhline(y=4.0, color='#ef4444', linestyle='--', alpha=0.7, label='Danger zone (<4 kg)')
ax.set_xticks(x)
ax.set_xticklabels(month_names, fontsize=8, color='white')
ax.set_ylabel('Body Weight (kg)', color='white')
ax.set_title('Annual Weight Cycle', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Expenditure breakdown
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
ax.stackplot(x, np.full(12, bmr), thermoreg, activity,
            labels=['BMR', 'Thermoregulation', 'Activity'],
            colors=['#3b82f6', '#8b5cf6', '#22c55e'], alpha=0.8)
ax.set_xticks(x)
ax.set_xticklabels(month_names, fontsize=8, color='white')
ax.set_ylabel('kcal/day', color='white')
ax.set_title('Expenditure Breakdown', color='white', fontsize=11, fontweight='bold')
ax.legend(loc='upper right', facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('weight_cycle.png', dpi=100, facecolor='#1f2937')
plt.show()

print(f"Peak weight: {weight.max():.1f} kg (month: {month_names[weight.argmax()]})")
print(f"Minimum weight: {weight.min():.1f} kg (month: {month_names[weight.argmin()]})")
print(f"Annual weight swing: {weight.max()-weight.min():.1f} kg")
print(f"Winter deficit months: {sum(1 for n in net_energy if n < 0)}")`,
      challenge: 'Reduce food intake by 20% in winter (simulating bamboo scarcity from forest fragmentation). Does the panda drop below 4 kg? In which month?',
      successHint: 'You have modeled a complete annual energy cycle with four-panel visualization. The critical insight is that winter survival depends on autumn preparation — any disruption to the autumn fattening period cascades into a life-threatening winter deficit.',
    },
    {
      title: 'Temperature sensors — mapping the forest microclimate',
      concept: `The temperature a red panda experiences is not the weather station temperature. **Microclimates** vary dramatically over short distances in a forest:

- **Canopy level** (15-20 m): windier, warmer in sun, colder at night (radiative cooling)
- **Mid-canopy** (5-10 m): sheltered, moderate temperature swings
- **Ground level** (0-1 m): coldest at night (cold air sinks), warmest in sun patches
- **Tree hollow**: remarkably stable — buffered by the tree\'s thermal mass

Red pandas exploit microclimates strategically:
- **Daytime**: bask on south-facing branches (solar heating)
- **Night**: sleep in tree hollows or on sheltered branches (less radiative cooling)
- **Rain**: shelter under dense canopy or rock overhangs
- **Wind**: descend from exposed canopy to sheltered mid-level

Temperature loggers deployed in Sikkim\'s red panda habitat show that a tree hollow can be 8-12°C warmer than exposed canopy on a clear winter night.

📚 *We will simulate microclimate data from multiple sensors and use matplotlib to create a rich multi-location comparison.*`,
      analogy: 'A forest microclimate is like the different rooms in a house. The attic (canopy) is hottest in summer, coldest in winter. The basement (ground) stays cool. The interior rooms (tree hollows) are most stable. The red panda is like a person without heating — it moves between rooms to find the most comfortable spot.',
      storyConnection: 'The story shows the red panda choosing its sleeping spot carefully. This is not whimsy — it is microclimate optimization. The panda\'s knowledge of its forest\'s thermal landscape is as detailed as a map, built through years of experience. Losing old-growth trees means losing the best thermal shelters.',
      checkQuestion: 'Why are tree hollows warmer than exposed branches on cold nights?',
      checkAnswer: 'Three reasons: (1) The tree\'s mass acts as a thermal buffer — wood absorbs heat during the day and releases it slowly at night. (2) The hollow blocks wind (no convective cooling). (3) The hollow blocks the cold sky — the panda radiates heat to warm wood surfaces instead of the -30°C sky. It is essentially a natural insulated shelter.',
      codeIntro: 'Simulate and plot 24-hour temperature data from multiple microclimate sensors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
hours = np.linspace(0, 24, 145)  # 10-minute intervals

# Base temperature cycle (winter day in Sikkim)
base = 2 + 8 * np.sin(2 * np.pi * (hours - 6) / 24)  # peak at noon
base = np.maximum(base, -6)  # cap minimum

# Microclimate modifications
locations = {
    'Exposed canopy': {
        'offset': 2, 'amplitude': 1.5, 'noise': 1.5,
        'color': '#ef4444', 'style': '-'
    },
    'Mid-canopy branch': {
        'offset': 0, 'amplitude': 0.8, 'noise': 0.8,
        'color': '#f59e0b', 'style': '-'
    },
    'Ground level': {
        'offset': -3, 'amplitude': 1.2, 'noise': 1.0,
        'color': '#3b82f6', 'style': '-'
    },
    'Tree hollow': {
        'offset': 4, 'amplitude': 0.3, 'noise': 0.5,
        'color': '#22c55e', 'style': '-'
    },
}

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Forest Microclimate — Red Panda Habitat, Sikkim (Winter Day)',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: All sensors overlaid
ax = axes[0, 0]
ax.set_facecolor('#1f2937')

all_temps = {}
for name, props in locations.items():
    temp = base + props['offset'] + props['amplitude'] * np.sin(2*np.pi*(hours-3)/24)
    temp += np.random.normal(0, props['noise'], len(hours)) * 0.3
    all_temps[name] = temp
    ax.plot(hours, temp, color=props['color'], linewidth=2, label=name)

ax.axhline(y=0, color='cyan', linestyle=':', alpha=0.5, label='Freezing')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('24-Hour Temperature Profiles', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.set_xticks([0, 4, 8, 12, 16, 20, 24])
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Temperature range per location
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
names = list(all_temps.keys())
mins = [all_temps[n].min() for n in names]
maxs = [all_temps[n].max() for n in names]
means = [all_temps[n].mean() for n in names]
ranges = [mx - mn for mn, mx in zip(mins, maxs)]
clrs = [locations[n]['color'] for n in names]

ax.barh(names, ranges, color=clrs, alpha=0.8)
for i, (name, rng) in enumerate(zip(names, ranges)):
    ax.text(rng + 0.2, i, f'{rng:.1f}°C', color='white', va='center', fontsize=10)
ax.set_xlabel('Temperature Range (°C)', color='white')
ax.set_title('Daily Temperature Swing', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')

# Panel 3: Heat loss comparison for red panda
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
body_temp = 38
insulation_r = 0.12 * 0.3  # fur resistance × area

for name, props in locations.items():
    heat_loss = (body_temp - all_temps[name]) / insulation_r
    heat_loss = np.maximum(heat_loss, 0)
    ax.plot(hours, heat_loss, color=props['color'], linewidth=2, label=name)

ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Heat Loss (W)', color='white')
ax.set_title('Red Panda Heat Loss by Location', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.set_xticks([0, 4, 8, 12, 16, 20, 24])
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Optimal location by hour
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
loc_names = list(all_temps.keys())
# Warmest location at each time
best_idx = np.argmax([all_temps[n] for n in loc_names], axis=0)

for i, name in enumerate(loc_names):
    mask = best_idx == i
    if mask.any():
        ax.scatter(hours[mask], all_temps[name][mask], color=locations[name]['color'],
                  s=10, label=name, alpha=0.8)

ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Optimal Location by Hour', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.set_xticks([0, 4, 8, 12, 16, 20, 24])
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('microclimate.png', dpi=100, facecolor='#1f2937')
plt.show()

# Daily energy savings
for name in all_temps:
    daily_loss = np.mean(np.maximum(body_temp - all_temps[name], 0) / insulation_r) * 24
    daily_kcal = daily_loss * 3600 / 4184
    print(f"{name:25s}: avg heat loss = {daily_kcal:.0f} kcal/day")

hollow_save = (np.mean(np.maximum(body_temp - all_temps['Exposed canopy'], 0) / insulation_r) -
              np.mean(np.maximum(body_temp - all_temps['Tree hollow'], 0) / insulation_r))
print(f"\
Sleeping in a hollow vs exposed saves {hollow_save*24*3600/4184:.0f} kcal/day!")`,
      challenge: 'Add a "logged tree" scenario: remove the tree hollow option and force the panda to sleep at mid-canopy. What is the energy cost of losing that shelter?',
      successHint: 'You have created a complete microclimate analysis with optimal location mapping. The tree hollow is clearly the best thermal shelter, saving hundreds of calories per day. This is why old-growth forest with large hollow trees is critical red panda habitat — young replanted forests lack these thermal refuges.',
    },
    {
      title: 'Climate change and heat stress — an unexpected threat',
      concept: `Paradoxically, global warming threatens the red panda not only through habitat loss but through **heat stress**. As temperatures rise:

1. **More days above UCT**: the panda must spend energy on cooling instead of saving it
2. **Reduced snow cover**: less insulation for ground-dwelling prey and bamboo rhizomes
3. **Bamboo die-off**: some bamboo species flower and die simultaneously every 30-120 years. Warming may trigger these events unpredictably.
4. **Altitude squeeze**: suitable habitat shifts upward, but the mountain is finite — eventually there is no higher to go
5. **Parasite expansion**: warmer temperatures bring new diseases and parasites to previously too-cold habitats

The "altitude squeeze" is critical:
- Current habitat: 2,200-4,800 m
- With 2°C warming: suitable zone shifts to ~2,800-5,400 m
- But above 4,800 m there is no bamboo forest — just rock and ice
- Net result: suitable habitat shrinks dramatically

Red panda populations in Sikkim are estimated at only 200-300 individuals. The altitude squeeze could fragment this into isolated pockets too small to be genetically viable.

📚 *We will visualize the altitude squeeze and habitat loss using matplotlib.*`,
      analogy: 'Imagine you live on a hillside where the flood line is rising from below and the snow line is dropping from above. Each year, your habitable zone shrinks. You can move uphill, but the hill has a peak. The red panda is in this exact situation — warmth pushing from below, treeline pushing from above, and only so much mountain to retreat into.',
      storyConnection: 'The story celebrates the red panda\'s harmony with Sikkim\'s cloud forests. But climate change is rewriting the rules of that habitat. The forest zone is shifting upward, and the panda must follow — but Kanchenjunga\'s slopes become too steep and barren above 4,800 m. The story\'s setting is literally disappearing.',
      checkQuestion: 'If the red panda\'s suitable altitude band shifts upward by 300 m per °C of warming, and Sikkim experiences 3°C of warming by 2100, how much does the band shift?',
      checkAnswer: '300 × 3 = 900 m upward shift. Current range: 2,200-4,800 m. New range: 3,100-5,700 m. But bamboo does not grow above ~4,800 m, so the actual upper limit stays at 4,800 m. Effective range shrinks from 2,600 m wide to 1,700 m — a 35% reduction. And the upper regions are steeper with less area, so habitat area shrinks even more than the elevation range suggests.',
      codeIntro: 'Model and visualize how climate change squeezes the red panda\'s habitat band.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Altitude-habitat model
altitudes = np.arange(1000, 6000, 50)

def habitat_suitability(alt, warming=0):
    """Red panda habitat suitability score (0-1) at given altitude and warming."""
    # Shift lower and upper bounds with warming
    lower = 2200 + 300 * warming  # lower limit moves up
    upper = 4800                   # upper limit fixed (bamboo ceiling)
    optimal = (lower + upper) / 2

    if lower >= upper:
        return np.zeros_like(alt)

    score = np.exp(-0.5 * ((alt - optimal) / ((upper - lower)/4))**2)
    score[alt < lower] = 0
    score[alt > upper] = 0
    return score

# Mountain area at each altitude (cone approximation)
# Mountain gets narrower higher up
mountain_area = 100 * np.exp(-0.0008 * (altitudes - 2000))
mountain_area[altitudes < 1500] = 100

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Red Panda Habitat Squeeze Under Climate Change',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Suitability at different warming levels
ax = axes[0]
ax.set_facecolor('#1f2937')
warmings = [0, 1, 2, 3]
colors_w = ['#22c55e', '#f59e0b', '#f97316', '#ef4444']

for w, c in zip(warmings, colors_w):
    suit = habitat_suitability(altitudes, w)
    ax.plot(suit, altitudes, color=c, linewidth=2, label=f'+{w}°C')

ax.set_xlabel('Habitat Suitability', color='white', fontsize=11)
ax.set_ylabel('Altitude (m)', color='white', fontsize=11)
ax.set_title('Suitability Profiles', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Effective habitat area
ax = axes[1]
ax.set_facecolor('#1f2937')
hab_areas = []
for w, c in zip(warmings, colors_w):
    suit = habitat_suitability(altitudes, w)
    eff_area = suit * mountain_area
    hab_areas.append(eff_area.sum() * 50 / 1e6)  # km²-ish
    ax.fill_between(altitudes, 0, eff_area, alpha=0.3, color=c)
    ax.plot(altitudes, eff_area, color=c, linewidth=2, label=f'+{w}°C: {hab_areas[-1]:.0f} units')

ax.set_xlabel('Altitude (m)', color='white', fontsize=11)
ax.set_ylabel('Effective Habitat Area', color='white', fontsize=11)
ax.set_title('Available Habitat', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Habitat loss vs warming
ax = axes[2]
ax.set_facecolor('#1f2937')
warming_range = np.linspace(0, 4, 50)
habitat_remaining = []
for w in warming_range:
    suit = habitat_suitability(altitudes, w)
    eff = (suit * mountain_area).sum()
    habitat_remaining.append(eff)

habitat_remaining = np.array(habitat_remaining)
habitat_pct = habitat_remaining / habitat_remaining[0] * 100

ax.plot(warming_range, habitat_pct, '#ef4444', linewidth=2.5)
ax.fill_between(warming_range, habitat_pct, alpha=0.2, color='#ef4444')
ax.axhline(y=50, color='gold', linestyle='--', alpha=0.7, label='50% habitat loss')
ax.axhline(y=25, color='#ef4444', linestyle='--', alpha=0.7, label='75% habitat loss')

# Find critical thresholds
w_50 = warming_range[np.argmax(habitat_pct < 50)] if np.any(habitat_pct < 50) else None
if w_50:
    ax.axvline(x=w_50, color='gold', linestyle=':', alpha=0.5)
    ax.annotate(f'50% loss at +{w_50:.1f}°C', (w_50, 52), color='gold', fontsize=9)

ax.set_xlabel('Warming (°C)', color='white', fontsize=11)
ax.set_ylabel('Habitat Remaining (%)', color='white', fontsize=11)
ax.set_title('Habitat vs. Warming', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('habitat_squeeze.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Habitat Area Summary ===")
for w, area in zip(warmings, hab_areas):
    pct = area / hab_areas[0] * 100
    print(f"+{w}°C warming: {area:.0f} units ({pct:.0f}% of current)")

print(f"\
Sikkim's ~250 red pandas already occupy fragmented habitat.")
print(f"Losing 50%+ of suitable area could fragment populations beyond recovery.")`,
      challenge: 'Add a bamboo die-off event at year 2050 that eliminates bamboo between 3,000-3,500 m for 5 years. How does this affect the habitat suitability curve during the die-off?',
      successHint: 'You have modeled the altitude squeeze — one of the most important concepts in conservation biology under climate change. The nonlinear relationship between warming and habitat loss means that the difference between 1.5°C and 3°C of warming is not twice the impact — it could be the difference between survival and extinction for the red panda.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Thermoregulation data visualization with matplotlib</span>
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
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
