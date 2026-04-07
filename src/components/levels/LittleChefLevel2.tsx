import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LittleChefLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Spherification chemistry — turning liquids into spheres',
      concept: `**Spherification** is the signature technique of molecular gastronomy: turning any flavoured liquid into jelly-like spheres that burst in the mouth.

**Basic spherification:**
1. Mix sodium alginate (from seaweed) into the flavoured liquid
2. Drop spoonfuls into a calcium chloride (CaCl2) bath
3. Ca2+ ions cross-link alginate chains, forming a gel membrane
4. Result: a sphere with a thin gel skin and liquid interior

**Chemistry:** Alginate is a polysaccharide from brown seaweed with carboxylate groups (-COO-) along its backbone. Ca2+ bridges two carboxylate groups from different chains — the **"egg-box" model**. This creates a 3D gel network.

**Variables:**
- Alginate concentration: 0.5-1% (too low: fragile; too high: rubbery)
- CaCl2 concentration: 0.5-1% (too high: bitter taste)
- pH: alginate gels poorly below pH 3.5
- Temperature: works at any temperature (unlike gelatin)`,
      analogy: 'Spherification is like building a chain-link fence. Alginate chains are the wire links. Calcium ions are the connectors joining links from different wires. Without calcium: loose wires (liquid). With calcium: a mesh (gel membrane).',
      storyConnection: 'The little chef could turn Assam tea into tea "caviar" — tiny spheres bursting with flavour. Imagine ou tenga spheres on top of fish curry, or jaggery spheres melting over pitha. Molecular gastronomy meets Assamese cuisine.',
      checkQuestion: 'Why can\'t you make lime juice spheres using basic spherification?',
      checkAnswer: 'Lime juice has pH ~2, and alginate does not gel well below pH 3.5. At low pH, carboxylate groups become protonated and cannot bind calcium. Solution: use reverse spherification (calcium in the juice, drop into alginate) or add sodium citrate to raise pH.',
      codeIntro: 'Model the alginate-calcium gelation process.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

time_seconds = np.linspace(0, 120, 200)

D_ca = 0.001
alginate_concs = [0.5, 0.75, 1.0, 1.5]
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

ax1.set_facecolor('#111827')
for conc, color in zip(alginate_concs, colors):
    D_eff = D_ca / (1 + conc * 2)
    thickness = np.sqrt(2 * D_eff * time_seconds)
    ax1.plot(time_seconds, thickness, color=color, linewidth=2, label=f'{conc}% alginate')

ax1.axhspan(0.3, 0.8, alpha=0.1, color='#22c55e')
ax1.text(100, 0.55, 'Optimal gel\\\nthickness', color='#22c55e', fontsize=9, ha='center')
ax1.set_xlabel('Time in CaCl\₂ bath (seconds)', color='white')
ax1.set_ylabel('Gel membrane thickness (mm)', color='white')
ax1.set_title('Spherification: Gel Growth Over Time', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

pH = np.linspace(2, 8, 100)
gel_strength = np.where(pH < 3, 0.1,
                np.where(pH < 3.5, 0.1 + 0.9 * (pH - 3) / 0.5,
                np.where(pH < 6, 1.0, 0.8)))

ax2.set_facecolor('#111827')
ax2.plot(pH, gel_strength, color='#a855f7', linewidth=2)
ax2.fill_between(pH, gel_strength, alpha=0.15, color='#a855f7')

juices = [('Lime', 2.2), ('Orange', 3.5), ('Apple', 3.8), ('Tea', 5.0), ('Water', 7.0)]
for name, juice_pH in juices:
    idx = np.argmin(np.abs(pH - juice_pH))
    ax2.plot(juice_pH, gel_strength[idx], 'o', color='#f59e0b', markersize=10)
    ax2.annotate(name, (juice_pH, gel_strength[idx]), xytext=(5, 10),
                 textcoords='offset points', color='#f59e0b', fontsize=9)

ax2.axvline(3.5, color='#ef4444', linestyle='--', alpha=0.5)
ax2.text(3.6, 0.3, 'pH limit', color='#ef4444', fontsize=8)
ax2.set_xlabel('pH of liquid', color='white')
ax2.set_ylabel('Relative gel strength', color='white')
ax2.set_title('Alginate Gel Strength vs pH', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Spherification recipe:")
print("  Basic: 0.5% alginate in liquid -> drop into 0.5% CaCl2")
print("  Reverse: 1% CaCl2 in liquid -> drop into 0.5% alginate")
print("  Timing: 30s = thin skin, 60s = medium, 120s+ = thick")`,
      challenge: 'Calculate the calcium diffusion coefficient needed to create a 0.5mm membrane in exactly 30 seconds.',
      successHint: 'Spherification shows how a single chemical reaction can be precisely controlled to create textures impossible in traditional cooking.',
    },
    {
      title: 'Sous vide physics — precision temperature cooking',
      concept: `**Sous vide** cooks food in a sealed bag in precisely controlled water (±0.1°C). The physics: every point in the food reaches the same temperature.

**Heat transfer:** dT/dt = alpha * d2T/dx2, where alpha ≈ 0.14 mm2/s for meat. A 4cm steak takes ~80 minutes to equilibrate.

**Temperature targets (steak):**
- 50°C: rare (myosin denatures, actin intact)
- 55°C: medium-rare (collagen softening begins)
- 60°C: medium (actin denaturing)
- 70°C: well-done (all proteins denatured)

A traditionally cooked steak has a 35°C gradient (90°C surface to 55°C centre). Sous vide: 55°C everywhere.

**Safety:** Pasteurisation is time × temperature. At 55°C, ~90 minutes achieves the same kill as 72°C for 15 seconds.`,
      analogy: 'Traditional cooking heats a room with a blowtorch — the nearest wall is scorching while the far wall is cold. Sous vide sets central heating to exactly 55°C and waits — eventually every point reaches 55°C.',
      storyConnection: 'The little chef cooks fish curry at a rolling boil (100°C). Sous vide would let him cook fish at exactly 52°C — barely opaque, incredibly tender. Traditional uses high heat/short time; sous vide uses low heat/long time. Both control protein denaturation.',
      checkQuestion: 'Sous vide cooks at 50-65°C for hours. Is this safe given that the bacterial danger zone is 4-60°C?',
      checkAnswer: 'Yes, because pasteurisation depends on both temperature AND time. At 55°C, holding for ~90 minutes achieves the same bacterial kill as 72°C for 15 seconds. The vacuum bag prevents recontamination. Food safety tables specify exact time-temperature requirements.',
      codeIntro: 'Simulate heat penetration: traditional searing vs. sous vide.',
      code: `import numpy as np
import matplotlib.pyplot as plt

thickness = 40  # mm
dx = 0.5
nx = int(thickness / dx)
x = np.linspace(0, thickness, nx)
alpha = 0.14  # mm2/s

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Sous vide simulation
ax1.set_facecolor('#111827')
T_sv = np.full(nx, 5.0)
T_bath = 55.0
dt = dx**2 / (4 * alpha)

times_to_plot = {0: None, 300: None, 900: None, 1800: None, 3600: None, 5400: None}
colors_sv = ['#3b82f6', '#60a5fa', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']
time_labels = ['0 min', '5 min', '15 min', '30 min', '60 min', '90 min']

for step in range(int(5400 / dt) + 1):
    current_time = step * dt
    for t_plot in list(times_to_plot.keys()):
        if times_to_plot[t_plot] is None and abs(current_time - t_plot) < dt:
            times_to_plot[t_plot] = T_sv.copy()

    T_new = T_sv.copy()
    for i in range(1, nx-1):
        T_new[i] = T_sv[i] + alpha * dt / dx**2 * (T_sv[i+1] - 2*T_sv[i] + T_sv[i-1])
    T_new[0] = T_bath
    T_new[-1] = T_bath
    T_sv = T_new

for (t, profile), color, label in zip(times_to_plot.items(), colors_sv, time_labels):
    if profile is not None:
        ax1.plot(x, profile, color=color, linewidth=2, label=label)

ax1.axhline(55, color='white', linestyle=':', alpha=0.3)
ax1.set_xlabel('Position in steak (mm)', color='white')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('Sous Vide (55°C bath)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_ylim(0, 100)
ax1.tick_params(colors='gray')

# Traditional searing simulation
ax2.set_facecolor('#111827')
T_trad = np.full(nx, 20.0)
T_pan = 230.0

times_trad_plot = {0: None, 30: None, 60: None, 120: None, 180: None, 300: None}
time_labels_t = ['0s', '30s', '60s', '120s', '180s', '300s']

for step in range(int(300 / dt) + 1):
    current_time = step * dt
    for t_plot in list(times_trad_plot.keys()):
        if times_trad_plot[t_plot] is None and abs(current_time - t_plot) < dt:
            times_trad_plot[t_plot] = T_trad.copy()

    T_new = T_trad.copy()
    for i in range(1, nx-1):
        T_new[i] = T_trad[i] + alpha * dt / dx**2 * (T_trad[i+1] - 2*T_trad[i] + T_trad[i-1])
    T_new[0] = T_pan
    T_new[-1] = T_pan
    T_trad = T_new

for (t, profile), color, label in zip(times_trad_plot.items(), colors_sv, time_labels_t):
    if profile is not None:
        ax2.plot(x, profile, color=color, linewidth=2, label=label)

ax2.axhline(55, color='white', linestyle=':', alpha=0.3)
ax2.set_xlabel('Position in steak (mm)', color='white')
ax2.set_ylabel('Temperature (°C)', color='white')
ax2.set_title('Traditional Searing (230°C pan)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.set_ylim(0, 100)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sous vide (90 min): 55°C everywhere (±0.5°C)")
print("Traditional (5 min): 55°C centre, 90°C+ surface")
print("Best approach: sous vide THEN quick sear (reverse sear)")`,
      challenge: 'Calculate sous vide time for a 6cm steak. Time scales as thickness squared. How much longer than a 4cm steak?',
      successHint: 'Sous vide is applied heat transfer physics. The same equations governing heat flow through walls and pipes describe how a steak cooks.',
    },
    {
      title: 'Caramelisation vs Maillard — two paths to browning',
      concept: `Two distinct browning reactions dominate cooking:

**Caramelisation:** sugar alone heated above decomposition temperature (160-200°C). Products: diacetyl, maltol, furanones. Flavour: sweet, buttery, slightly bitter.

**Maillard reaction:** amino acids + reducing sugars above 140°C. Products: melanoidins, pyrazines, Strecker aldehydes (1000+ compounds). Flavour: complex, savoury, "browned."

**Key difference:** Caramelisation is pyrolysis (heat breaking sugar). Maillard is a chemical reaction between two molecule types. Most browning in cooking is Maillard, not caramelisation.

**Why wet cooking never browns:** Water keeps temperature at 100°C. Both reactions need >140°C. Only when surface water evaporates can the surface temperature rise high enough for browning. This is the fundamental wet-vs-dry cooking divide.`,
      analogy: 'Caramelisation is a solo performance — sugar alone breaking apart under heat. Maillard is a duet — sugar and amino acid combining to produce entirely new compounds neither could make alone. The duet is far more complex.',
      storyConnection: 'When the little chef sears fish in mustard oil, both reactions happen. Fish protein + sugars undergo Maillard. Sugar in the marinade caramelises. He controls both by managing temperature: too low = no browning, too high = bitter charring.',
      checkQuestion: 'Slowly cooked onions turn sweet and brown over 45 minutes. Is this Maillard or caramelisation?',
      checkAnswer: 'Primarily Maillard (onions contain both sugars and amino acids). The slow cooking dehydrates the surface, allowing temperature to exceed 100°C, triggering browning. The sweetness comes from concentrated natural sugars plus Maillard products with sweet notes (maltol, furaneol).',
      codeIntro: 'Model both browning reactions and compare their temperature dependence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

temp = np.linspace(80, 250, 200)
R = 8.314

Ea_maillard = 80000
rate_maillard = np.exp(-Ea_maillard / (R * (temp + 273))) * np.where(temp > 110, 1, 0.01)
rate_maillard /= np.max(rate_maillard)

Ea_caramel = 120000
rate_caramel = np.exp(-Ea_caramel / (R * (temp + 273))) * np.where(temp > 150, 1, 0.01)
rate_caramel /= np.max(rate_caramel)

rate_burning = np.where(temp > 190, np.exp(-150000 / (R * (temp + 273))), 0)
rate_burning /= (np.max(rate_burning) + 1e-10)

ax1.set_facecolor('#111827')
ax1.plot(temp, rate_maillard, color='#f59e0b', linewidth=2, label='Maillard reaction')
ax1.plot(temp, rate_caramel, color='#a855f7', linewidth=2, label='Caramelisation')
ax1.plot(temp, rate_burning, color='#ef4444', linewidth=2, label='Burning/charring')

ax1.axvspan(140, 165, alpha=0.1, color='#f59e0b')
ax1.axvspan(165, 190, alpha=0.1, color='#a855f7')
ax1.axvspan(200, 250, alpha=0.1, color='#ef4444')
ax1.text(152, 0.9, 'Optimal\\\nMaillard', color='#f59e0b', fontsize=8, ha='center')
ax1.text(177, 0.9, 'Optimal\\\ncaramel', color='#a855f7', fontsize=8, ha='center')
ax1.text(225, 0.9, 'DANGER', color='#ef4444', fontsize=8, ha='center')

ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Reaction rate (normalised)', color='white')
ax1.set_title('Browning Reaction Rates', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
compounds = {
    'HMF (honey-like)': {'onset': 120, 'peak': 160, 'color': '#fbbf24'},
    'Pyrazines (roasty)': {'onset': 140, 'peak': 175, 'color': '#f59e0b'},
    'Diacetyl (buttery)': {'onset': 160, 'peak': 180, 'color': '#a855f7'},
    'Melanoidins (brown)': {'onset': 130, 'peak': 170, 'color': '#92400e'},
    'Acrolein (acrid)': {'onset': 200, 'peak': 230, 'color': '#ef4444'},
}

for name, props in compounds.items():
    onset = props['onset']
    peak = props['peak']
    color = props['color']
    amount = np.where(temp < onset, 0,
                       np.exp(-((temp - peak)**2) / (2 * 15**2)) * (1 - np.exp(-0.1 * (temp - onset))))
    ax2.plot(temp, np.clip(amount, 0, 1), color=color, linewidth=2, label=name)

ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Relative production', color='white')
ax2.set_title('Flavour Compounds from Browning', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper left')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Temperature guide:")
print("  140-160°C: golden, sweet-caramel (mostly Maillard)")
print("  160-180°C: deep brown, roasty (both reactions)")
print("  180-200°C: dark, complex (max flavour before burning)")
print("  >200°C: charring, bitter, potentially toxic")`,
      challenge: 'Cook pure sugar vs sugar + amino acid at the same temperature and compare colour/flavour development.',
      successHint: 'Understanding these two reactions gives precise control over flavour. Searing maximises Maillard; caramel sauce uses caramelisation. The best cooks use both intentionally.',
    },
    {
      title: 'Gel chemistry — agar, gelatin, and texture engineering',
      concept: `**Gels** are solid-like materials mostly made of liquid (98% water in a gelatin dessert).

**Gelatin** (animal collagen): melts at 25-35°C (melts in mouth), sets at <15°C, destroyed by proteases (pineapple).
**Agar** (seaweed): melts at 85°C, sets at 35-40°C, survives proteases and room temperature.

The melting-setting gap (**hysteresis**) is key: agar has a 50°C gap (very stable); gelatin has a 20°C gap (requires refrigeration).

**Other gelling agents:** Carrageenan (dairy gels), pectin (jams), methylcellulose (gels when HEATED — opposite of gelatin), xanthan gum (thickener).`,
      analogy: 'A gel is like a sponge made of molecular chains. Gelatin makes a soft sponge that dissolves in warm water. Agar makes a tough sponge that survives hot water but snaps cleanly when bitten.',
      storyConnection: 'Assamese sweets often use agar rather than gelatin. Agar sets at room temperature — practical in warm climates without refrigeration. The little chef could make Assam tea jelly firm enough for a hot Jorhat afternoon.',
      checkQuestion: 'Why does fresh pineapple destroy gelatin but not agar?',
      checkAnswer: 'Pineapple contains bromelain, a protease that cuts protein chains. Gelatin is a protein (collagen), so bromelain chops it apart. Agar is a polysaccharide (sugar chain), not a protein, so bromelain cannot affect it. Cooking pineapple first denatures bromelain.',
      codeIntro: 'Compare gelatin and agar: melting curves, setting curves, and texture profiles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

temp = np.linspace(0, 100, 200)

gelatin_melt = 1 / (1 + np.exp(0.5 * (temp - 32)))
gelatin_set = 1 / (1 + np.exp(0.5 * (temp - 15)))
agar_melt = 1 / (1 + np.exp(0.3 * (temp - 85)))
agar_set = 1 / (1 + np.exp(0.3 * (temp - 38)))

ax1.set_facecolor('#111827')
ax1.plot(temp, gelatin_melt, color='#f59e0b', linewidth=2, label='Gelatin (heating)')
ax1.plot(temp, gelatin_set, color='#f59e0b', linewidth=2, linestyle='--', label='Gelatin (cooling)')
ax1.fill_between(temp, gelatin_set, gelatin_melt, alpha=0.1, color='#f59e0b')
ax1.plot(temp, agar_melt, color='#22c55e', linewidth=2, label='Agar (heating)')
ax1.plot(temp, agar_set, color='#22c55e', linewidth=2, linestyle='--', label='Agar (cooling)')
ax1.fill_between(temp, agar_set, agar_melt, alpha=0.1, color='#22c55e')

ax1.axvline(37, color='#ef4444', linestyle=':', alpha=0.5)
ax1.text(38, 0.9, 'Body temp', color='#ef4444', fontsize=8)
ax1.axvline(25, color='white', linestyle=':', alpha=0.3)
ax1.text(26, 0.1, 'Room temp', color='gray', fontsize=8)

ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Gel strength', color='white')
ax1.set_title('Gel Melting/Setting Hysteresis', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Texture radar
categories = ['Firmness', 'Elasticity', 'Brittleness', 'Melt-in-\\\nmouth', 'Clarity']
N = len(categories)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

gels = {
    'Gelatin': ([3, 8, 2, 10, 7], '#f59e0b'),
    'Agar': ([8, 2, 9, 1, 9], '#22c55e'),
    'Carrageenan': ([6, 5, 5, 6, 8], '#3b82f6'),
    'Pectin': ([5, 3, 7, 4, 4], '#a855f7'),
}

ax2 = plt.subplot(122, polar=True)
ax2.set_facecolor('#111827')
for name, (values, color) in gels.items():
    v = values + values[:1]
    ax2.plot(angles, v, 'o-', linewidth=2, label=name, color=color)
    ax2.fill(angles, v, alpha=0.05, color=color)

ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(categories, color='white', fontsize=9)
ax2.set_ylim(0, 10)
ax2.set_title('Gel Texture Profiles', color='white', fontsize=12, pad=20)
ax2.legend(loc='upper left', bbox_to_anchor=(-0.2, 1.15), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Gel selection guide:")
print("  Melt-in-mouth -> Gelatin (pannacotta)")
print("  Firm + stable -> Agar (room-temp desserts)")
print("  Creamy -> Carrageenan (dairy desserts)")
print("  Spreadable -> Pectin (jam, marmalade)")`,
      challenge: 'Design a layered dessert: agar bottom (sets first at 38°C), gelatin top (sets at 15°C). At what temperature must each layer be poured?',
      successHint: 'Gel chemistry is where physics meets food design. The right gelling agent and concentration create any texture from barely-set pannacotta to firm yokan.',
    },
    {
      title: 'Foam science — meringue, bread, and the physics of bubbles',
      concept: `A **foam** is gas trapped in a liquid or solid matrix. Cooking foams include: whipped cream (fat-stabilised), meringue (protein-stabilised), bread (CO2 in gluten), idli (CO2 in fermented batter).

**Foam stability depends on:**
1. **Surface tension**: surfactants (proteins, fats) lower it, making bubbles easier
2. **Viscosity**: thicker liquids trap bubbles longer
3. **Elasticity**: protein films stretch without breaking
4. **Drainage**: gravity pulls liquid down, thinning walls
5. **Ostwald ripening**: small bubbles shrink while large ones grow (pressure difference)

**Why fat kills egg white foam:** Fat molecules compete with protein for the bubble surface but form weaker films. Even a speck of yolk (fat) prevents stable foam formation.`,
      analogy: 'A foam is like a bubble bath. Each bubble is a liquid film balloon surrounding trapped air. Soap (surfactant) makes the film stretchy. In cooking, proteins and fats are the "soap" making food foams possible.',
      storyConnection: 'The little chef\'s perfect idli is a solid foam — CO2 bubbles from fermentation, set by steaming. Too few bubbles: dense. Too many: crumbly. Fermentation time controls bubble count; steaming sets the protein matrix around them.',
      checkQuestion: 'Why whip egg whites in a copper bowl?',
      checkAnswer: 'Copper ions react with conalbumin (an egg protein), creating a more stable film. The copper-protein complex is harder to denature, so the foam is more resistant to overwhipping and drainage. Clean copper = strongest possible foam.',
      codeIntro: 'Model foam drainage and Ostwald ripening.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

time = np.linspace(0, 60, 200)

heights = [0.2, 0.5, 0.8]
height_labels = ['Bottom (20%)', 'Middle (50%)', 'Top (80%)']
colors = ['#3b82f6', '#22c55e', '#f59e0b']

ax1.set_facecolor('#111827')
for h, label, color in zip(heights, height_labels, colors):
    initial_liquid = 0.15
    if h < 0.3:
        liquid_frac = initial_liquid + 0.3 * (1 - np.exp(-time / 20))
    elif h < 0.6:
        liquid_frac = initial_liquid * np.exp(-time / 30)
    else:
        liquid_frac = initial_liquid * np.exp(-time / 10)
    ax1.plot(time, liquid_frac, color=color, linewidth=2, label=label)

ax1.set_xlabel('Time (minutes)', color='white')
ax1.set_ylabel('Liquid fraction', color='white')
ax1.set_title('Foam Drainage', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
initial_radii = np.random.lognormal(mean=np.log(0.5), sigma=0.5, size=200)
times_or = [0, 5, 15, 30, 60]
colors_or = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']

for t_or, color in zip(times_or, colors_or):
    mean_r = np.mean(initial_radii)
    evolved = initial_radii + (mean_r - initial_radii) * (1 - np.exp(-t_or / 30)) * 0.5
    evolved = evolved * (1 + t_or / 100)
    evolved = evolved[evolved > 0.1]
    ax2.hist(evolved, bins=20, alpha=0.4, color=color, edgecolor='none',
             label=f't={t_or} min (n={len(evolved)})', density=True)

ax2.set_xlabel('Bubble radius (mm)', color='white')
ax2.set_ylabel('Probability density', color='white')
ax2.set_title('Ostwald Ripening: Bubbles Coarsen', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Foam failure mechanisms:")
print("  1. Drainage: gravity thins bubble walls")
print("  2. Ostwald ripening: small bubbles feed large ones")
print("  3. Coalescence: thin walls rupture")
print()
print("Stabilisation: proteins (elastic films), sugar (viscosity),")
print("fats (mechanical barrier), heat-setting (permanent structure)")`,
      challenge: 'Model how sugar increases foam stability by slowing drainage (increasing viscosity). Compare whipped egg white alone vs meringue.',
      successHint: 'Every bread, cake, souffle, and idli is an engineered foam. Understanding foam physics lets you troubleshoot any recipe that falls flat.',
    },
    {
      title: 'Thermal processing and food safety — pasteurisation science',
      concept: `**Pasteurisation** kills pathogens using first-order kinetics: a fixed fraction dies per unit time.

**D-value**: time to kill 90% at a specific temperature. **z-value**: temperature increase to reduce D by 10x.

**Standard processes:**
- LTLT: 63°C for 30 min (traditional milk)
- HTST: 72°C for 15 sec (most milk today)
- UHT: 135°C for 2-5 sec (shelf-stable)

**The key insight:** time and temperature are interchangeable. Every z-value increase in temperature reduces required time by 10x.

**F-value:** equivalent minutes at 121°C for commercial sterilisation. Standard: F=3 min = 12D reduction of C. botulinum.`,
      analogy: 'Pasteurisation is like weeding a garden. Each pass removes 90% (D-value). After 6 passes: 0.0001% remain. Aggressive weeding (high temp) = fast passes. Gentle weeding (low temp) = slow passes. Both clear the garden eventually.',
      storyConnection: 'The little chef\'s preserved bamboo shoot pickle works through combined hurdles: low pH, high salt, and cooking heat. No single treatment is extreme, but together they ensure safety. This "hurdle technology" is the basis of traditional food preservation worldwide.',
      checkQuestion: 'Why can\'t you sterilise food at 60°C even if held for hours?',
      checkAnswer: 'Bacterial spores (C. botulinum) have D-values of 10-20 minutes at 100°C. At 60°C, the D-value would be thousands of minutes. A 12D reduction would take days, during which the food would spoil from enzymes. Sterilisation requires >100°C in a pressure vessel.',
      codeIntro: 'Model microbial death kinetics and calculate pasteurisation time-temperature combinations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

time = np.linspace(0, 30, 200)
D_ref = 4.0
T_ref = 60
z = 6.0

temperatures = [55, 60, 65, 70, 72]
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']

ax1.set_facecolor('#111827')
for T, color in zip(temperatures, colors):
    D = D_ref * 10**((T_ref - T) / z)
    log_reduction = time / D
    survivors = 1e6 * 10**(-log_reduction)
    ax1.semilogy(time, survivors, color=color, linewidth=2, label=f'{T}°C (D={D:.2f} min)')

ax1.axhline(1, color='white', linestyle='--', alpha=0.3)
ax1.text(25, 2, 'Sterility', color='white', fontsize=8, ha='center')
ax1.set_xlabel('Time (minutes)', color='white')
ax1.set_ylabel('Surviving organisms', color='white')
ax1.set_title('Microbial Death Curves (z=6°C)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_ylim(1e-2, 1e7)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
T_range = np.linspace(50, 80, 100)
D_range = D_ref * 10**((T_ref - T_range) / z)
time_6D = 6 * D_range
time_12D = 12 * D_range

ax2.semilogy(T_range, time_6D, color='#22c55e', linewidth=2, label='6D (pasteurisation)')
ax2.semilogy(T_range, time_12D, color='#ef4444', linewidth=2, label='12D (sterilisation)')

processes = [
    (63, 30, 'LTLT milk', '#f59e0b'),
    (72, 0.25, 'HTST milk', '#3b82f6'),
    (60, 45, 'Sous vide chicken', '#a855f7'),
]
for T, t, name, color in processes:
    ax2.plot(T, t, 'o', color=color, markersize=10)
    ax2.annotate(name, (T, t), xytext=(3, 5), textcoords='offset points', color=color, fontsize=9)

ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Required time (minutes)', color='white')
ax2.set_title('Time-Temperature Equivalence', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Pasteurisation time-temperature (Salmonella, 6D):")
for T in [55, 60, 63, 65, 70, 72, 75]:
    D = D_ref * 10**((T_ref - T) / z)
    t_6D = 6 * D
    if t_6D > 60:
        print(f"  {T}°C: {t_6D/60:.1f} hours")
    elif t_6D > 1:
        print(f"  {T}°C: {t_6D:.1f} min")
    else:
        print(f"  {T}°C: {t_6D*60:.0f} seconds")
print()
print("Every 6°C increase -> 10x faster pasteurisation")`,
      challenge: 'Calculate safety parameters for Assamese fish pickle (pH 4.0, processed at 70°C). Below pH 4.6, C. botulinum cannot grow, simplifying requirements.',
      successHint: 'Food safety is applied microbiology. The D-value framework transforms preservation from guesswork into engineering. From bamboo shoot pickle to industrial canning, the same equations govern safety.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Deep Dive
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Molecular Gastronomy</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for molecular gastronomy simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
