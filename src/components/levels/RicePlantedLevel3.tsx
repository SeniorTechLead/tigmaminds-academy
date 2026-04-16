import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RicePlantedLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The paddy ecosystem — a flooded world of biogeochemistry',
      concept: `A rice paddy is not just a field of grain — it is an **engineered wetland ecosystem** with unique biogeochemistry. When a paddy is flooded, the standing water creates distinct chemical zones:\n\n- **Aerobic surface layer** (top 1-2 cm): oxygen diffuses from air, supporting nitrifying bacteria\n- **Anaerobic reduced zone** (below 2 cm): no oxygen, dominated by methanogenic archaea and sulfate reducers\n- **Rhizosphere**: the zone around rice roots where oxygen leaks from aerenchyma tissue, creating micro-aerobic pockets in an anaerobic soil\n\nThis layered structure drives four critical biogeochemical cycles simultaneously:\n1. **Carbon cycle**: organic matter decomposition produces CO2 (aerobic) or CH4 (anaerobic)\n2. **Nitrogen cycle**: complex transformations between NH4+, NO3-, N2O, and N2\n3. **Iron cycle**: Fe³⁺ reduction to Fe²⁺ makes iron available to plants (but can cause toxicity)\n4. **Sulfur cycle**: sulfate reduction produces H2S (toxic to roots at high concentrations)\n\nRice is uniquely adapted to this environment through **aerenchyma** — air channels in stems and roots that transport oxygen from leaves to roots, allowing them to survive in waterlogged, anaerobic soil.`,
      analogy: 'A rice paddy is like a multi-story building with different atmospheres on each floor. The penthouse (surface water) has fresh air. The basement (deep soil) has no oxygen — like a sealed underground bunker. The rice plant is like a ventilation system running from the roof to the basement, pumping air down through its stems to keep its roots alive in the oxygen-free zone.',
      storyConnection: 'The story of the first rice being planted is a story of humans engineering an ecosystem. Flooding a field creates conditions that suppress weeds (most cannot survive waterlogging), recycle nutrients (anaerobic decomposition releases nitrogen and phosphorus), and favor rice (which has aerenchyma). It is ecosystem engineering that began 10,000 years ago in the river deltas of Asia.',
      checkQuestion: 'Why does rice grow better in flooded paddies than in dry upland fields, even though flooding creates an anaerobic soil that is hostile to most plant roots?',
      checkAnswer: 'Three reasons: (1) Rice has aerenchyma tissue that delivers O2 from leaves to roots, so it can breathe in anaerobic soil. (2) Flooding suppresses most weeds, which lack aerenchyma and cannot compete. (3) Anaerobic decomposition releases ammonium (NH4+), which is the preferred nitrogen form for rice. In dry soil, nitrogen is mostly nitrate (NO3-), which leaches easily with rain. The flooded paddy retains nitrogen better. Rice evolved in wetlands and is pre-adapted to flooding; the paddy just replicates its natural habitat.',
      codeIntro: 'Model the biogeochemical layers of a flooded rice paddy and simulate oxygen, nitrogen, and methane profiles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Paddy soil depth profile model
depth_cm = np.linspace(0, 30, 300)  # 0 = surface, 30 = deep soil

# Oxygen profile: exponential decay from surface
def oxygen_profile(depth, surface_O2=8.0, decay_rate=2.0):
    return surface_O2 * np.exp(-decay_rate * depth)

# Ammonium profile: produced in anaerobic zone, consumed at surface
def ammonium_profile(depth, peak_depth=10, peak_conc=5.0):
    return peak_conc * np.exp(-((depth - peak_depth)**2) / 50)

# Methane: produced in deep anaerobic zone
def methane_profile(depth, onset_depth=5, max_conc=3.0):
    return max_conc / (1 + np.exp(-0.5 * (depth - onset_depth)))

# Redox potential
def redox_profile(depth, surface_Eh=400, deep_Eh=-200):
    return surface_Eh + (deep_Eh - surface_Eh) / (1 + np.exp(-0.3 * (depth - 3)))

O2 = oxygen_profile(depth_cm)
NH4 = ammonium_profile(depth_cm)
CH4 = methane_profile(depth_cm)
Eh = redox_profile(depth_cm)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Rice Paddy Ecosystem: Biogeochemical Depth Profiles', color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: O2 profile
ax = axes[0, 0]
ax.plot(O2, depth_cm, color='#3b82f6', linewidth=2.5)
ax.fill_betweenx(depth_cm, 0, O2, color='#3b82f6', alpha=0.1)
ax.set_xlabel('O₂ (mg/L)', color='white')
ax.set_ylabel('Depth (cm)', color='white')
ax.set_title('Oxygen Profile', color='white', fontsize=11)
ax.invert_yaxis()
ax.axhline(2, color='#f59e0b', linewidth=1, linestyle='--', label='Aerobic/Anaerobic boundary')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: NH4+ profile
ax = axes[0, 1]
ax.plot(NH4, depth_cm, color='#22c55e', linewidth=2.5)
ax.fill_betweenx(depth_cm, 0, NH4, color='#22c55e', alpha=0.1)
ax.set_xlabel('NH₄⁺ (mg/L)', color='white')
ax.set_ylabel('Depth (cm)', color='white')
ax.set_title('Ammonium Profile', color='white', fontsize=11)
ax.invert_yaxis()

# Plot 3: CH4 profile
ax = axes[0, 2]
ax.plot(CH4, depth_cm, color='#ef4444', linewidth=2.5)
ax.fill_betweenx(depth_cm, 0, CH4, color='#ef4444', alpha=0.1)
ax.set_xlabel('CH₄ (mg/L)', color='white')
ax.set_ylabel('Depth (cm)', color='white')
ax.set_title('Methane Profile', color='white', fontsize=11)
ax.invert_yaxis()

# Plot 4: Redox potential
ax = axes[1, 0]
ax.plot(Eh, depth_cm, color='#a855f7', linewidth=2.5)
ax.fill_betweenx(depth_cm, -300, Eh, where=Eh<0, color='#ef4444', alpha=0.1, label='Reducing')
ax.fill_betweenx(depth_cm, Eh, 500, where=Eh>0, color='#3b82f6', alpha=0.1, label='Oxidizing')
ax.set_xlabel('Redox potential Eh (mV)', color='white')
ax.set_ylabel('Depth (cm)', color='white')
ax.set_title('Redox Profile', color='white', fontsize=11)
ax.invert_yaxis()
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Combined overview
ax = axes[1, 1]
ax.plot(O2 / 8, depth_cm, color='#3b82f6', linewidth=2, label='O₂ (norm)')
ax.plot(NH4 / 5, depth_cm, color='#22c55e', linewidth=2, label='NH₄⁺ (norm)')
ax.plot(CH4 / 3, depth_cm, color='#ef4444', linewidth=2, label='CH₄ (norm)')
ax.set_xlabel('Normalized concentration', color='white')
ax.set_ylabel('Depth (cm)', color='white')
ax.set_title('Combined Chemical Profiles', color='white', fontsize=11)
ax.invert_yaxis()
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
# Zone labels
ax.axhspan(0, 2, alpha=0.1, color='#3b82f6')
ax.axhspan(2, 30, alpha=0.05, color='#ef4444')
ax.text(0.8, 1, 'Aerobic', color='#3b82f6', fontsize=8)
ax.text(0.8, 15, 'Anaerobic', color='#ef4444', fontsize=8)

# Plot 6: Nutrient cycling diagram
ax = axes[1, 2]
ax.axis('off')
cycles = [
    ('N₂ (atmosphere)', 0.5, 0.9, '#22c55e'),
    ('NH₄⁺ (soil)', 0.2, 0.6, '#22c55e'),
    ('NO₃⁻ (surface)', 0.8, 0.6, '#3b82f6'),
    ('CH₄ (deep soil)', 0.2, 0.2, '#ef4444'),
    ('CO₂ (surface)', 0.8, 0.2, '#f59e0b'),
    ('Rice plant
(uptake)', 0.5, 0.5, '#a855f7'),
]
for label, x, y, color in cycles:
    ax.text(x, y, label, transform=ax.transAxes, ha='center', va='center',
            color=color, fontsize=9, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor=color, alpha=0.8))
ax.set_title('Paddy Nutrient Cycling', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Rice Paddy Biogeochemistry")
print("=" * 50)
print()
print("Depth zones:")
print("  0-2 cm: Aerobic (O₂ > 2 mg/L, Eh > +200 mV)")
print("  2-30 cm: Anaerobic (O₂ < 0.1 mg/L, Eh < -100 mV)")
print()
print("Key processes:")
print("  Surface: nitrification (NH₄⁺ → NO₃⁻), CH₄ oxidation")
print("  Deep: methanogenesis (organic C → CH₄), NH₄⁺ production")
print("  Rhizosphere: O₂ leak from aerenchyma creates micro-aerobic zones")
print()
print("Rice adaptation: aerenchyma delivers O₂ to roots in anaerobic soil")
print("This is why rice thrives where other crops drown.")`,
      challenge: 'Add the iron cycle to the model: Fe³⁺ is reduced to Fe²⁺ in anaerobic conditions, making iron available for plant uptake but potentially toxic at high concentrations. Model the Fe²⁺ profile and calculate the depth at which iron toxicity occurs (>300 mg/L Fe²⁺).',
      successHint: 'The paddy ecosystem is a masterclass in biogeochemistry. A few centimeters of water transform a field into a stratified system with distinct chemical zones, each supporting different microbial communities and nutrient transformations. Understanding this system is essential for optimizing rice production while minimizing environmental impact.',
    },
    {
      title: 'Nitrogen cycling in flooded fields — the invisible engine of rice productivity',
      concept: `Nitrogen is the most limiting nutrient for rice growth, and its cycling in flooded paddies is extraordinarily complex. The paddy's layered structure creates a **coupled nitrification-denitrification** system that both provides and removes nitrogen.\n\n**Nitrogen transformations in paddies:**\n1. **Biological N fixation**: cyanobacteria (Anabaena, Nostoc) in floodwater fix atmospheric N₂ → NH₄⁺ (5-80 kg N/ha/season)\n2. **Mineralization**: decomposition of organic matter releases NH₄⁺ in anaerobic soil\n3. **Nitrification**: NH₄⁺ → NO₂⁻ → NO₃⁻ (only in aerobic surface layer and rhizosphere)\n4. **Denitrification**: NO₃⁻ → N₂O → N₂ (in anaerobic zone — nitrogen LOST to atmosphere)\n5. **Ammonium volatilization**: NH₄⁺ → NH₃ gas (at high pH, significant N loss)\n6. **Plant uptake**: rice preferentially absorbs NH₄⁺ (unlike most crops which prefer NO₃⁻)\n\nThe **nitrogen use efficiency (NUE)** of flooded rice is notoriously low: only 30-40% of applied fertilizer N is taken up by the plant. The rest is lost through denitrification (20-30%), volatilization (10-20%), and leaching (5-10%). Improving NUE is one of the biggest challenges in rice science.`,
      analogy: 'Nitrogen cycling in a paddy is like a complex plumbing system with leaks. You pour water (nitrogen fertilizer) into the top, but it flows through pipes (microbial transformations) that have multiple drain points (denitrification, volatilization, leaching). By the time it reaches the faucet (plant roots), only 30-40% of the original water remains. Engineering better pipes (controlled-release fertilizers, nitrification inhibitors) reduces the leaks.',
      storyConnection: 'When the first rice was planted in the river deltas of Assam, the natural nitrogen cycle — biological fixation by cyanobacteria, mineralization of organic matter — provided enough nitrogen for modest yields. The Green Revolution added synthetic fertilizer, boosting yields 3-4x but creating nitrogen pollution. The next revolution must be smarter nitrogen management.',
      checkQuestion: 'A farmer applies 120 kg N/ha of urea to a flooded rice paddy. If NUE is 35%, how much nitrogen does the rice actually absorb, and where does the rest go?',
      checkAnswer: 'The rice absorbs 120 × 0.35 = 42 kg N/ha. The remaining 78 kg N/ha is lost: denitrification ~30 kg (as N₂ and N₂O — a potent greenhouse gas), ammonia volatilization ~18 kg (urea hydrolyzes to NH₃ which evaporates at high pH), leaching to groundwater ~12 kg (as NO₃⁻), and runoff ~8 kg. This 65% loss is both economically wasteful and environmentally damaging. Solutions: deep placement of urea (reduces volatilization), use of nitrification inhibitors (reduces denitrification), split application (match N supply to plant demand).',
      codeIntro: 'Model the complete nitrogen cycle in a flooded rice paddy including all transformation pathways and loss mechanisms.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Nitrogen cycle model for flooded rice paddy
def paddy_nitrogen_model(days=120, N_applied_kg_ha=120, n_splits=1):
    """Simulate nitrogen transformations over a rice growing season."""
    dt = 1  # daily timestep
    n_steps = days
    
    # State variables (kg N/ha)
    NH4_soil = np.zeros(n_steps)
    NO3_soil = np.zeros(n_steps)
    N_plant = np.zeros(n_steps)
    N_lost_denit = np.zeros(n_steps)
    N_lost_vol = np.zeros(n_steps)
    N_lost_leach = np.zeros(n_steps)
    N_fixed = np.zeros(n_steps)
    
    # Initial conditions
    NH4_soil[0] = 10  # background soil N
    
    # Apply fertilizer
    fert_days = np.linspace(10, 80, n_splits).astype(int) if n_splits > 1 else [10]
    fert_per_split = N_applied_kg_ha / n_splits
    
    # Rate constants
    k_nitrification = 0.08    # day⁻¹ (NH4 → NO3)
    k_denitrification = 0.12  # day⁻¹ (NO3 → N2)
    k_volatilization = 0.03   # day⁻¹ (NH4 → NH3 gas)
    k_leaching = 0.02         # day⁻¹ (NO3 → groundwater)
    k_fixation = 0.5          # kg N/ha/day (BNF)
    k_mineralization = 0.3    # kg N/ha/day
    
    for t in range(1, n_steps):
        # Add fertilizer
        fert_input = fert_per_split if t in fert_days else 0
        
        # Plant uptake rate (sigmoid growth curve)
        growth_phase = 1 / (1 + np.exp(-0.05 * (t - 60)))  # peaks mid-season
        uptake_rate = 1.5 * growth_phase  # kg N/ha/day max
        
        # Transformations
        nitrification = k_nitrification * NH4_soil[t-1]
        denitrification = k_denitrification * NO3_soil[t-1]
        volatilization = k_volatilization * NH4_soil[t-1]
        leaching = k_leaching * NO3_soil[t-1]
        fixation = k_fixation * (1 + 0.3 * np.sin(2 * np.pi * t / 30))  # seasonal
        mineralization = k_mineralization
        
        # Plant uptake (prefers NH4+)
        nh4_uptake = min(uptake_rate * 0.7, NH4_soil[t-1] * 0.3)
        no3_uptake = min(uptake_rate * 0.3, NO3_soil[t-1] * 0.3)
        
        # Update state
        NH4_soil[t] = max(0, NH4_soil[t-1] + fert_input + fixation + mineralization
                          - nitrification - volatilization - nh4_uptake)
        NO3_soil[t] = max(0, NO3_soil[t-1] + nitrification
                          - denitrification - leaching - no3_uptake)
        N_plant[t] = N_plant[t-1] + nh4_uptake + no3_uptake
        N_lost_denit[t] = N_lost_denit[t-1] + denitrification
        N_lost_vol[t] = N_lost_vol[t-1] + volatilization
        N_lost_leach[t] = N_lost_leach[t-1] + leaching
        N_fixed[t] = N_fixed[t-1] + fixation
    
    nue = N_plant[-1] / N_applied_kg_ha * 100
    return {
        'days': np.arange(n_steps), 'NH4': NH4_soil, 'NO3': NO3_soil,
        'plant': N_plant, 'denit': N_lost_denit, 'vol': N_lost_vol,
        'leach': N_lost_leach, 'fixed': N_fixed, 'NUE': nue,
    }

# Run scenarios
single = paddy_nitrogen_model(n_splits=1)
split3 = paddy_nitrogen_model(n_splits=3)
low_n = paddy_nitrogen_model(N_applied_kg_ha=60, n_splits=2)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Nitrogen Cycling in Flooded Rice Paddies', color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: N pools over time
ax = axes[0, 0]
ax.plot(single['days'], single['NH4'], color='#22c55e', linewidth=2, label='NH₄⁺ soil')
ax.plot(single['days'], single['NO3'], color='#3b82f6', linewidth=2, label='NO₃⁻ soil')
ax.plot(single['days'], single['plant'], color='#a855f7', linewidth=2, label='Plant N')
ax.set_xlabel('Days after transplanting', color='white')
ax.set_ylabel('N (kg/ha)', color='white')
ax.set_title('Nitrogen Pools (single application)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: N losses
ax = axes[0, 1]
ax.fill_between(single['days'], 0, single['denit'], color='#ef4444', alpha=0.7, label='Denitrification')
ax.fill_between(single['days'], single['denit'], single['denit']+single['vol'],
                color='#f59e0b', alpha=0.7, label='Volatilization')
ax.fill_between(single['days'], single['denit']+single['vol'],
                single['denit']+single['vol']+single['leach'],
                color='#64748b', alpha=0.7, label='Leaching')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Cumulative N loss (kg/ha)', color='white')
ax.set_title('Nitrogen Loss Pathways', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: NUE comparison
ax = axes[0, 2]
scenarios = ['Single
application', '3-split
application', 'Low N
(60 kg, 2-split)']
nues = [single['NUE'], split3['NUE'], low_n['NUE']]
colors_nue = ['#ef4444', '#22c55e', '#3b82f6']
ax.bar(range(len(scenarios)), nues, color=colors_nue, edgecolor='none', width=0.6)
ax.set_xticks(range(len(scenarios)))
ax.set_xticklabels(scenarios, color='white', fontsize=9)
ax.set_ylabel('Nitrogen Use Efficiency (%)', color='white')
ax.set_title('NUE by Management Strategy', color='white', fontsize=11)
for i, n in enumerate(nues):
    ax.text(i, n + 1, f'{n:.0f}%', ha='center', color='white', fontsize=12, fontweight='bold')

# Plot 4: Split vs single application
ax = axes[1, 0]
ax.plot(single['days'], single['plant'], color='#ef4444', linewidth=2, label=f'Single (NUE={single[\"NUE\"]:.0f}%)')
ax.plot(split3['days'], split3['plant'], color='#22c55e', linewidth=2, label=f'3-split (NUE={split3[\"NUE\"]:.0f}%)')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Plant N uptake (kg/ha)', color='white')
ax.set_title('Plant N Uptake: Split vs Single', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: N budget pie chart
ax = axes[1, 1]
total_in = 120 + single['fixed'][-1]
budget = [single['plant'][-1], single['denit'][-1], single['vol'][-1], single['leach'][-1],
          total_in - single['plant'][-1] - single['denit'][-1] - single['vol'][-1] - single['leach'][-1]]
labels = ['Plant uptake', 'Denitrification', 'Volatilization', 'Leaching', 'Soil residual']
colors_b = ['#22c55e', '#ef4444', '#f59e0b', '#64748b', '#3b82f6']
ax.pie([max(0, b) for b in budget], labels=labels, autopct='%1.0f%%',
       colors=colors_b, textprops={'color': 'white', 'fontsize': 8})
ax.set_title('Nitrogen Budget (120 kg N/ha)', color='white', fontsize=11)

# Plot 6: BNF contribution
ax = axes[1, 2]
ax.plot(single['days'], single['fixed'], color='#06b6d4', linewidth=2.5)
ax.fill_between(single['days'], 0, single['fixed'], color='#06b6d4', alpha=0.1)
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Cumulative BNF (kg N/ha)', color='white')
ax.set_title(f'Biological N Fixation: {single[\"fixed\"][-1]:.0f} kg/ha', color='white', fontsize=11)
ax.annotate('Cyanobacteria +
Azolla contribution', xy=(80, single['fixed'][80]),
            color='#06b6d4', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.show()

print("Paddy Nitrogen Cycle Model")
print("=" * 50)
print()
print(f"Applied: 120 kg N/ha | Season: 120 days")
print(f"BNF contribution: {single['fixed'][-1]:.0f} kg N/ha")
print()
print(f"{'Scenario':<25} {'Plant N':>8} {'NUE':>6} {'Denit':>8} {'Vol':>6}")
print("-" * 55)
for name, data in [('Single application', single), ('3-split', split3), ('Low N 2-split', low_n)]:
    print(f"{name:<25} {data['plant'][-1]:>7.0f} {data['NUE']:>5.0f}% {data['denit'][-1]:>7.0f} {data['vol'][-1]:>5.0f}")
print()
print("Split application increases NUE by matching N supply to plant demand.")
print("This is the simplest and most effective N management strategy.")`,
      challenge: 'Add a nitrification inhibitor (e.g., DCD) to the model: it reduces the nitrification rate by 60% for 30 days after each application. How does this affect NUE and N₂O emissions? N₂O is produced as a byproduct of both nitrification and denitrification — model both pathways.',
      successHint: 'Nitrogen management in rice paddies is a global challenge. Improving NUE from 35% to 50% would save ~20 million tonnes of synthetic N fertilizer annually, reducing costs, greenhouse gas emissions, and water pollution. The science is understood; the challenge is implementation at scale.',
    },
    {
      title: 'Methane emissions from rice — the climate impact of paddy agriculture',
      concept: `Rice paddies are the **largest anthropogenic source of methane** (CH₄) after fossil fuels and livestock. Globally, rice paddies emit 25-100 million tonnes of CH₄ per year — about 10-15% of total anthropogenic methane.\n\nMethane is produced by **methanogenic archaea** in the anaerobic soil layer. These ancient microorganisms convert organic matter to CH₄ through two pathways:\n1. **Acetoclastic methanogenesis**: CH₃COOH → CH₄ + CO₂ (dominant, ~70%)\n2. **Hydrogenotrophic methanogenesis**: CO₂ + 4H₂ → CH₄ + 2H₂O (~30%)\n\nMethane escapes to the atmosphere through three routes:\n- **Ebullition** (bubbling): ~10% — gas bubbles rise through standing water\n- **Diffusion**: ~5% — dissolved CH₄ diffuses through water surface\n- **Plant transport**: ~85% — CH₄ enters roots, travels through aerenchyma to atmosphere\n\nThe rice plant itself is the primary methane chimney. The same aerenchyma that delivers O₂ to roots also vents CH₄ to the atmosphere.\n\nMitigation strategies:\n- **Alternate wetting and drying (AWD)**: drain paddies periodically to allow O₂ into soil, oxidizing CH₄\n- **Mid-season drainage**: one drainage event can reduce CH₄ by 40%\n- **Direct-seeded rice**: no transplanting flood = less early-season CH₄\n- **Straw management**: incorporating straw increases CH₄; removing it reduces emissions`,
      analogy: 'A rice paddy producing methane is like a compost heap sealed underwater. When organic matter decomposes without oxygen, it produces methane instead of CO₂. The rice plant acts as a chimney, venting the methane from the anaerobic depths to the atmosphere. Draining the paddy is like opening the compost heap — oxygen rushes in, bacteria switch from methane production to methane consumption.',
      storyConnection: 'The first rice paddy was a revolutionary invention for food production, but it created an unintended climate consequence. Methane from rice paddies contributes about 1.5% of total global warming. The story of rice is a story of trade-offs: feeding billions of people while managing the environmental footprint of flooded agriculture.',
      checkQuestion: 'If alternate wetting and drying (AWD) reduces methane emissions by 40% but also reduces yield by 5%, is it worth it from a climate perspective? Assume 5 tonnes/ha yield and 300 kg CH₄/ha/season emissions.',
      checkAnswer: 'AWD reduces CH₄ from 300 to 180 kg/ha (saving 120 kg CH₄). Methane has a GWP of 28 (over 100 years), so the climate benefit is 120 × 28 = 3,360 kg CO₂e/ha. The yield loss is 5 tonnes × 5% = 250 kg rice/ha. At ~$0.30/kg rice, that is $75/ha income loss. At a social cost of carbon of $50/tonne CO₂e, the climate benefit is worth $168/ha. So yes, AWD is worth it — the climate benefit ($168) exceeds the yield cost ($75). This is why AWD is one of the most recommended climate-smart rice practices.',
      codeIntro: 'Model methane production, oxidation, and emission from rice paddies under different water management regimes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Methane emission model for rice paddies
def methane_model(days=120, water_regime='continuous', straw_incorporated=True):
    """Simulate CH4 production, oxidation, and emission."""
    dt = 1
    CH4_produced = np.zeros(days)
    CH4_oxidized = np.zeros(days)
    CH4_emitted = np.zeros(days)
    water_level = np.zeros(days)  # cm
    soil_temp = np.zeros(days)
    
    for t in range(days):
        # Soil temperature (seasonal curve)
        soil_temp[t] = 25 + 5 * np.sin(2 * np.pi * (t + 30) / 365)
        
        # Water management
        if water_regime == 'continuous':
            water_level[t] = 5  # 5 cm standing water
        elif water_regime == 'AWD':
            cycle = t % 14  # 14-day cycle
            water_level[t] = 5 if cycle < 10 else 0  # flood 10, drain 4
        elif water_regime == 'midseason_drain':
            water_level[t] = 0 if 40 < t < 55 else 5
        
        # CH4 production (methanogenesis)
        # Higher when: warm, flooded, organic matter available
        temp_factor = np.exp(0.1 * (soil_temp[t] - 25))  # Q10 ≈ 2.7
        flood_factor = 1.0 if water_level[t] > 0 else 0.05  # 95% reduction when drained
        substrate_factor = 1.3 if straw_incorporated else 0.8  # straw = more substrate
        # Root exudates increase mid-season
        root_factor = 0.5 + 0.5 * (1 / (1 + np.exp(-0.1 * (t - 50))))
        
        CH4_produced[t] = 3.0 * temp_factor * flood_factor * substrate_factor * root_factor
        
        # CH4 oxidation (methanotrophs at aerobic interfaces)
        oxidation_rate = 0.1 if water_level[t] > 0 else 0.6  # much higher when drained
        CH4_oxidized[t] = CH4_produced[t] * oxidation_rate
        
        # Net emission
        CH4_emitted[t] = max(0, CH4_produced[t] - CH4_oxidized[t])
    
    total_emission_kg_ha = np.sum(CH4_emitted)  # simplified
    return {
        'days': np.arange(days), 'produced': CH4_produced, 'oxidized': CH4_oxidized,
        'emitted': CH4_emitted, 'water': water_level, 'temp': soil_temp,
        'total_kg_ha': total_emission_kg_ha,
    }

continuous = methane_model('continuous')
awd = methane_model(water_regime='AWD')
mid_drain = methane_model(water_regime='midseason_drain')
no_straw = methane_model(straw_incorporated=False)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Methane Emissions from Rice Paddies: Water Management Impact', color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Daily emissions under continuous flooding
ax = axes[0, 0]
ax.fill_between(continuous['days'], 0, continuous['produced'], color='#ef4444', alpha=0.3, label='Produced')
ax.fill_between(continuous['days'], 0, continuous['emitted'], color='#ef4444', alpha=0.7, label='Emitted')
ax.plot(continuous['days'], continuous['oxidized'], color='#22c55e', linewidth=1.5, label='Oxidized')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('CH₄ flux (kg/ha/day)', color='white')
ax.set_title('Continuous Flooding', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: AWD effect on emissions
ax = axes[0, 1]
ax.fill_between(awd['days'], 0, awd['emitted'], color='#3b82f6', alpha=0.7, label='AWD emissions')
ax.plot(awd['days'], awd['water'] / 5 * max(awd['emitted']), color='#06b6d4',
        linewidth=1, linestyle='--', alpha=0.5, label='Water level (scaled)')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('CH₄ flux (kg/ha/day)', color='white')
ax.set_title(f'AWD: {(1-awd[\"total_kg_ha\"]/continuous[\"total_kg_ha\"])*100:.0f}% reduction', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Cumulative emissions comparison
ax = axes[0, 2]
for data, name, color in [
    (continuous, 'Continuous', '#ef4444'),
    (awd, 'AWD', '#3b82f6'),
    (mid_drain, 'Mid-drain', '#22c55e'),
    (no_straw, 'No straw', '#f59e0b')]:
    cum = np.cumsum(data['emitted'])
    ax.plot(data['days'], cum, color=color, linewidth=2.5, label=f'{name}: {data[\"total_kg_ha\"]:.0f} kg')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Cumulative CH₄ (kg/ha)', color='white')
ax.set_title('Cumulative Emissions by Strategy', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Climate impact (CO2e)
ax = axes[1, 0]
regimes = ['Continuous', 'AWD', 'Mid-drain', 'No straw']
totals = [continuous['total_kg_ha'], awd['total_kg_ha'], mid_drain['total_kg_ha'], no_straw['total_kg_ha']]
co2e = [t * 28 / 1000 for t in totals]  # tonnes CO2e per ha
colors_r = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b']
ax.bar(range(len(regimes)), co2e, color=colors_r, edgecolor='none', width=0.6)
ax.set_xticks(range(len(regimes)))
ax.set_xticklabels(regimes, color='white', fontsize=9)
ax.set_ylabel('Tonnes CO₂e/ha/season', color='white')
ax.set_title('Climate Impact (GWP₁₀₀ = 28)', color='white', fontsize=11)
for i, c in enumerate(co2e):
    ax.text(i, c + 0.2, f'{c:.1f}', ha='center', color='white', fontsize=10)

# Plot 5: Global rice CH4 context
ax = axes[1, 1]
sources = ['Fossil fuels', 'Livestock', 'Rice paddies', 'Biomass
burning', 'Waste', 'Wetlands']
ch4_mt = [100, 90, 30, 25, 60, 180]
colors_s = ['#64748b', '#a855f7', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
ax.barh(range(len(sources)), ch4_mt, color=colors_s, edgecolor='none', height=0.6)
ax.set_yticks(range(len(sources)))
ax.set_yticklabels(sources, color='white', fontsize=9)
ax.set_xlabel('CH₄ emissions (Mt/year)', color='white')
ax.set_title('Global Methane Sources', color='white', fontsize=11)

# Plot 6: Emission pathway breakdown
ax = axes[1, 2]
pathways = ['Plant
transport', 'Ebullition', 'Diffusion']
pcts = [85, 10, 5]
colors_p = ['#22c55e', '#f59e0b', '#3b82f6']
ax.pie(pcts, labels=pathways, autopct='%1.0f%%', colors=colors_p,
       textprops={'color': 'white', 'fontsize': 10})
ax.set_title('CH₄ Emission Pathways', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Rice Paddy Methane Emissions")
print("=" * 50)
print()
print(f"{'Regime':<15} {'CH4 (kg/ha)':>12} {'CO2e (t/ha)':>12} {'Reduction':>10}")
print("-" * 50)
for name, data in [('Continuous', continuous), ('AWD', awd), ('Mid-drain', mid_drain), ('No straw', no_straw)]:
    red = (1 - data['total_kg_ha'] / continuous['total_kg_ha']) * 100
    print(f"{name:<15} {data['total_kg_ha']:>12.0f} {data['total_kg_ha']*28/1000:>12.1f} {red:>9.0f}%")
print()
print("AWD is the most practical mitigation: 35-45% CH₄ reduction")
print("with only 0-5% yield penalty. Adopted on millions of hectares in Asia.")`,
      challenge: 'Model the N₂O trade-off: AWD reduces CH₄ but can increase N₂O emissions (another greenhouse gas with GWP=265) during the drying phases when nitrification-denitrification is enhanced. Calculate the net climate benefit including both CH₄ reduction and N₂O increase. Is AWD still a net climate win?',
      successHint: 'Rice methane is a solvable climate problem. AWD, mid-season drainage, and straw management can reduce emissions by 30-50% with minimal yield loss. The challenge is adoption at scale — there are 160 million hectares of rice paddies worldwide, and most smallholder farmers have never heard of AWD.',
    },
    {
      title: 'Green Revolution genetics — how IRRI changed the world',
      concept: `The **Green Revolution** (1960s-70s) transformed rice from a low-yielding traditional crop into a high-producing modern one. The key innovation was **semi-dwarf varieties** — rice plants that are shorter, sturdier, and divert more energy into grain rather than stem.\n\nThe story centers on **IR8** ("Miracle Rice"), released in 1966 by the International Rice Research Institute (IRRI) in the Philippines:\n\n- **Traditional varieties**: 150-180 cm tall, long droopy leaves, 1-2 tonnes/ha yield. They "lodge" (fall over) when fertilized heavily because the tall stem cannot support heavy grain.\n- **IR8**: 100-120 cm tall, erect leaves, responds to fertilizer, 6-10 tonnes/ha yield. The key gene: **sd1** (semi-dwarf 1), which reduces gibberellin biosynthesis.\n\n**The sd1 gene**: encodes GA20 oxidase, an enzyme in the gibberellin pathway. A loss-of-function mutation reduces stem elongation. This is the same principle as in wheat (Rht genes from Norin 10, Nobel Prize to Norman Borlaug).\n\nThe Green Revolution's impact:\n- Rice yields tripled globally (1960: 2 t/ha → 2000: 6 t/ha)\n- Prevented mass famine in Asia (estimated 1 billion lives saved)\n- But created dependence on fertilizer, irrigation, and pesticides\n- Reduced genetic diversity (farmers abandoned thousands of traditional varieties)\n\nThe challenge now: breeding varieties for climate adaptation, nutrient efficiency, and disease resistance — the **Second Green Revolution**.`,
      analogy: 'The sd1 mutation is like lowering the center of gravity in a sports car. A tall SUV topples in sharp turns (traditional rice lodges under heavy grain). A low sports car handles beautifully at high speed (semi-dwarf rice stays upright even with heavy grain loads). The same "engine" (photosynthetic capacity) drives both, but the chassis design (plant architecture) determines performance.',
      storyConnection: 'When the first rice was planted in Assam\'s river valleys, it was a tall, graceful plant adapted to the monsoon floods. The Green Revolution replaced these varieties with short, sturdy ones optimized for yield. Assam\'s traditional rice varieties (Joha, Bao, Komal) are now endangered genetic resources — living links to the story of the first rice.',
      checkQuestion: 'The sd1 mutation reduces gibberellin levels, making rice shorter. If you applied exogenous gibberellin to an sd1 mutant rice plant, what would happen?',
      checkAnswer: 'The plant would grow taller, partially restoring the tall phenotype. The sd1 mutation reduces GA biosynthesis, not GA response. The GA receptor and signaling pathway are intact, so exogenous GA can "bypass" the mutation. This confirms that sd1 is a biosynthesis mutant, not a signaling mutant. In practice, this means the semi-dwarf trait can be overcome by GA application — which is how rice breeders test whether a new dwarf mutant is in the GA pathway or an alternative pathway.',
      codeIntro: 'Model the genetics of the Green Revolution: semi-dwarf gene effects on yield, lodging resistance, and fertilizer response.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Green Revolution genetics model

def rice_yield_model(height_cm, fertilizer_kg_ha, variety='modern'):
    """Model rice yield as function of plant height and fertilizer input."""
    # Photosynthetic capacity (higher for erect-leaf modern varieties)
    if variety == 'modern':
        photo_capacity = 1.0
    else:
        photo_capacity = 0.7  # traditional droopy leaves shade lower leaves
    
    # Harvest index: fraction of biomass that is grain
    # Shorter plants have higher HI (less stem, more grain)
    HI = 0.55 - 0.002 * (height_cm - 100)  # modern ~0.50, traditional ~0.35
    HI = np.clip(HI, 0.25, 0.55)
    
    # Fertilizer response (diminishing returns)
    biomass = 8000 * photo_capacity * (1 - np.exp(-fertilizer_kg_ha / 80))  # kg/ha total
    
    # Lodging risk: tall + heavy grain = falls over
    lodging_risk = 1 / (1 + np.exp(-0.02 * (height_cm * fertilizer_kg_ha / 100 - 200)))
    lodging_loss = lodging_risk * 0.5  # up to 50% yield loss from lodging
    
    grain_yield = biomass * HI * (1 - lodging_loss) / 1000  # tonnes/ha
    return grain_yield, HI, lodging_risk

fertilizer_range = np.linspace(0, 200, 100)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Green Revolution Genetics: Semi-Dwarf Rice', color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Yield vs fertilizer for different heights
ax = axes[0, 0]
for height, color, label in [(170, '#ef4444', 'Traditional (170cm)'),
                               (130, '#f59e0b', 'Semi-tall (130cm)'),
                               (100, '#22c55e', 'Semi-dwarf (100cm)')]:
    yields = [rice_yield_model(height, f, 'modern' if height <= 130 else 'traditional')[0]
              for f in fertilizer_range]
    ax.plot(fertilizer_range, yields, color=color, linewidth=2.5, label=label)
ax.set_xlabel('Fertilizer N (kg/ha)', color='white')
ax.set_ylabel('Grain yield (t/ha)', color='white')
ax.set_title('Yield Response: Height Matters', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Lodging risk
ax = axes[0, 1]
for height, color, label in [(170, '#ef4444', '170cm'), (130, '#f59e0b', '130cm'), (100, '#22c55e', '100cm')]:
    lodging = [rice_yield_model(height, f)[2] * 100 for f in fertilizer_range]
    ax.plot(fertilizer_range, lodging, color=color, linewidth=2.5, label=label)
ax.set_xlabel('Fertilizer N (kg/ha)', color='white')
ax.set_ylabel('Lodging risk (%)', color='white')
ax.set_title('Lodging: Tall Plants Fall Over', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Harvest index comparison
ax = axes[0, 2]
heights = np.linspace(80, 180, 50)
his = [0.55 - 0.002 * (h - 100) for h in heights]
his = np.clip(his, 0.25, 0.55)
ax.plot(heights, his, color='#a855f7', linewidth=2.5)
ax.fill_between(heights, 0, his, color='#a855f7', alpha=0.1)
ax.axhline(0.50, color='#22c55e', linewidth=1, linestyle='--', label='Modern (HI~0.50)')
ax.axhline(0.35, color='#ef4444', linewidth=1, linestyle='--', label='Traditional (HI~0.35)')
ax.set_xlabel('Plant height (cm)', color='white')
ax.set_ylabel('Harvest Index', color='white')
ax.set_title('Harvest Index vs Height', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Historical yield timeline
ax = axes[1, 0]
years = [1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020]
yields_global = [2.0, 2.2, 2.5, 2.8, 3.2, 3.5, 3.9, 4.0, 4.2, 4.3, 4.4, 4.6, 4.7]
yields_asia = [1.8, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 4.8, 5.0, 5.2, 5.3, 5.5, 5.6]
ax.plot(years, yields_global, color='#3b82f6', linewidth=2.5, marker='o', markersize=5, label='Global avg')
ax.plot(years, yields_asia, color='#22c55e', linewidth=2.5, marker='s', markersize=5, label='Asia avg')
ax.axvline(1966, color='#f59e0b', linewidth=2, linestyle='--', label='IR8 release (1966)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Rice yield (t/ha)', color='white')
ax.set_title('Global Rice Yield Revolution', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Genetic diversity loss
ax = axes[1, 1]
decades = ['1950s', '1970s', '1990s', '2010s']
varieties_in_use = [10000, 5000, 2000, 500]
ax.bar(range(len(decades)), varieties_in_use, color=['#22c55e', '#f59e0b', '#ef4444', '#7f1d1d'],
       edgecolor='none', width=0.6)
ax.set_xticks(range(len(decades)))
ax.set_xticklabels(decades, color='white', fontsize=10)
ax.set_ylabel('Rice varieties in active cultivation', color='white')
ax.set_title('Genetic Diversity Loss', color='white', fontsize=11)
for i, v in enumerate(varieties_in_use):
    ax.text(i, v + 200, f'{v:,}', ha='center', color='white', fontsize=10)
ax.annotate('95% reduction
in 60 years', xy=(2.5, 3000), color='#ef4444',
            fontsize=10, fontweight='bold')

# Plot 6: Key genes of Green Revolution
ax = axes[1, 2]
ax.axis('off')
genes = [
    ('sd1', 'Semi-dwarf', 'Gibberellin biosynthesis', 'Yield +200%'),
    ('Xa21', 'Blight resistance', 'Receptor kinase', 'Disease -90%'),
    ('Sub1A', 'Submergence tolerance', 'Ethylene response', 'Flood survival 14d'),
    ('SPIKE', 'More grains', 'Cytokinin signaling', 'Yield +15%'),
    ('OsSWEET', 'Blight susceptibility', 'Sugar transporter', 'CRISPR target'),
]
ax.text(0.5, 0.95, 'Key Rice Genes', transform=ax.transAxes, ha='center',
        color='#f59e0b', fontsize=12, fontweight='bold')
for i, (gene, trait, function, impact) in enumerate(genes):
    ax.text(0.05, 0.80 - i * 0.16, f'{gene}', transform=ax.transAxes,
            color='#22c55e', fontsize=11, fontweight='bold', fontfamily='monospace')
    ax.text(0.25, 0.80 - i * 0.16, f'{trait} | {function}', transform=ax.transAxes,
            color='white', fontsize=9)
    ax.text(0.25, 0.73 - i * 0.16, f'Impact: {impact}', transform=ax.transAxes,
            color='#f59e0b', fontsize=8)

plt.tight_layout()
plt.show()

print("Green Revolution Genetics")
print("=" * 50)
print()
print("IR8 (1966): The Miracle Rice")
print("  Key gene: sd1 (semi-dwarf 1)")
print("  Mechanism: reduced gibberellin → shorter stem")
print("  Impact: yield from 2 to 6-10 t/ha")
print()
print("Yield model at 120 kg N/ha:")
for h, name in [(170, 'Traditional'), (130, 'Semi-tall'), (100, 'Semi-dwarf')]:
    y, hi, lodge = rice_yield_model(h, 120, 'modern' if h <= 130 else 'traditional')
    print(f"  {name} ({h}cm): {y:.1f} t/ha (HI={hi:.2f}, lodge={lodge*100:.0f}%)")
print()
print("The Green Revolution saved ~1 billion people from famine.")
print("The challenge now: sustaining yields while reducing environmental impact.")`,
      challenge: 'Model the "yield plateau" problem: global rice yields have been increasing more slowly since 2000 (~0.5%/year vs 2%/year in the 1970s). Is this because we are approaching a biological ceiling, or because new varieties are not reaching farmers? Simulate both hypotheses and determine which better fits the historical data.',
      successHint: 'The Green Revolution is the greatest application of genetics to food security in human history. A single gene (sd1) enabled rice to feed billions. But the story is incomplete: genetic diversity was sacrificed for yield, and environmental costs were deferred. The next green revolution must be greener.',
    },
    {
      title: 'Water footprint of rice — the hidden cost of the world\'s most important crop',
      concept: `Rice is the most **water-intensive** major crop. Producing 1 kg of rice requires approximately **2,500 liters of water** — compared to 900 L for wheat and 500 L for maize.\n\nThe water footprint has three components:\n- **Green water** (~45%): rainwater stored in soil and consumed by the crop through evapotranspiration\n- **Blue water** (~45%): irrigation water withdrawn from rivers, lakes, or aquifers\n- **Grey water** (~10%): water needed to dilute pollutants (fertilizer runoff) to acceptable quality\n\nWhy rice needs so much water:\n1. **Standing water**: 5-10 cm of water must be maintained for 80-100 days\n2. **Seepage and percolation**: water drains through soil to groundwater (major loss)\n3. **Evapotranspiration**: hot, humid conditions mean high evaporation from open water surfaces\n4. **Inefficient irrigation**: many paddies use flood irrigation with >50% losses\n\nGlobal context:\n- Rice uses 34-43% of the world's irrigation water\n- Irrigated rice covers 79 million hectares globally\n- Groundwater depletion in rice-growing regions (Punjab, North China Plain) is a crisis\n\nSolutions: System of Rice Intensification (SRI), drip irrigation, aerobic rice varieties, AWD, and shifting production to rain-fed regions.`,
      analogy: 'Growing rice with flood irrigation is like watering a garden with a fire hose. Most of the water misses the plants entirely — it evaporates, drains through the soil, or runs off. More precise methods (like SRI or drip irrigation) are like using a watering can — you deliver water exactly where and when the plant needs it, using a fraction of the total volume.',
      storyConnection: 'The river deltas of Assam where the first rice was planted are water-rich environments — the monsoon provides abundant rainwater, and the Brahmaputra provides irrigation. But as rice cultivation expanded to drier regions (Punjab, Rajasthan), the water footprint became a crisis. The story of rice is increasingly a story of water — where it comes from, how much we use, and whether it will last.',
      checkQuestion: 'If India\'s rice production (120 million tonnes) has an average water footprint of 2,500 L/kg, what is the total water use? How does this compare to India\'s total available renewable freshwater (~1,900 km³/year)?',
      checkAnswer: 'Total water for rice: 120 × 10⁶ tonnes × 2,500 L/kg = 300 × 10¹² L = 300 km³/year. India\'s total renewable freshwater is ~1,900 km³/year, so rice alone uses about 16% of India\'s entire freshwater supply. When you add wheat, sugarcane, and other crops, agriculture uses ~80% of India\'s water. This is why water management in rice is not just an agronomic issue — it is a national security issue.',
      codeIntro: 'Build a water footprint calculator for rice production under different management systems and climatic conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Water footprint model for rice production
def rice_water_footprint(days=120, irrigation_method='flood', rainfall_mm=800,
                         ET_mm_day=5, soil_percolation_mm_day=5):
    """Calculate water footprint components for rice production."""
    green_water = 0  # rainwater used by crop
    blue_water = 0   # irrigation water
    grey_water = 0   # pollution dilution
    
    daily_rain = rainfall_mm / days * (1 + 0.5 * np.sin(2 * np.pi * np.arange(days) / days))
    
    for day in range(days):
        # Crop water demand
        crop_ET = ET_mm_day * (0.5 + 0.5 * min(1, day / 40))  # increases with growth
        
        # Standing water maintenance
        if irrigation_method == 'flood':
            standing_water_need = 5  # mm/day to maintain 5cm
            percolation = soil_percolation_mm_day
        elif irrigation_method == 'AWD':
            cycle = day % 14
            standing_water_need = 5 if cycle < 10 else 0
            percolation = soil_percolation_mm_day * (1 if cycle < 10 else 0.3)
        elif irrigation_method == 'SRI':
            standing_water_need = 2  # minimal flooding
            percolation = soil_percolation_mm_day * 0.5
        elif irrigation_method == 'drip':
            standing_water_need = 0
            percolation = soil_percolation_mm_day * 0.2
        
        total_demand = crop_ET + standing_water_need + percolation
        rain_supply = daily_rain[day]
        
        green_used = min(rain_supply, total_demand)
        irrigation_needed = max(0, total_demand - rain_supply)
        
        green_water += green_used
        blue_water += irrigation_needed
    
    # Grey water (fertilizer pollution)
    grey_water = 500  # mm baseline for flood
    if irrigation_method == 'drip':
        grey_water = 200
    
    # Convert to L/kg (assume 5 t/ha yield)
    yield_kg_ha = 5000
    total_mm = green_water + blue_water + grey_water
    total_L_per_kg = total_mm * 10 / (yield_kg_ha / 1000)  # 1mm on 1ha = 10,000 L
    
    return {
        'green_mm': green_water, 'blue_mm': blue_water, 'grey_mm': grey_water,
        'total_mm': total_mm,
        'green_L_kg': green_water * 10000 / yield_kg_ha,
        'blue_L_kg': blue_water * 10000 / yield_kg_ha,
        'grey_L_kg': grey_water * 10000 / yield_kg_ha,
        'total_L_kg': total_mm * 10000 / yield_kg_ha,
    }

methods = ['flood', 'AWD', 'SRI', 'drip']
results = {m: rice_water_footprint(irrigation_method=m) for m in methods}

# Climate scenarios
climates = {
    'Assam (wet)': {'rainfall_mm': 1200, 'ET_mm_day': 4},
    'Punjab (moderate)': {'rainfall_mm': 600, 'ET_mm_day': 5},
    'Rajasthan (dry)': {'rainfall_mm': 200, 'ET_mm_day': 7},
}
climate_results = {c: rice_water_footprint(**params) for c, params in climates.items()}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Water Footprint of Rice: Methods & Climate Impact', color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_m = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7']

# Plot 1: Water footprint by method (L/kg)
ax = axes[0, 0]
x = np.arange(len(methods))
for i, m in enumerate(methods):
    r = results[m]
    ax.bar(i, r['green_L_kg'], 0.6, color='#22c55e', label='Green' if i == 0 else None, edgecolor='none')
    ax.bar(i, r['blue_L_kg'], 0.6, bottom=r['green_L_kg'], color='#3b82f6',
           label='Blue' if i == 0 else None, edgecolor='none')
    ax.bar(i, r['grey_L_kg'], 0.6, bottom=r['green_L_kg']+r['blue_L_kg'], color='#64748b',
           label='Grey' if i == 0 else None, edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels([m.upper() for m in methods], color='white', fontsize=9)
ax.set_ylabel('Water footprint (L/kg rice)', color='white')
ax.set_title('Water Footprint by Irrigation Method', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Water savings
ax = axes[0, 1]
baseline = results['flood']['total_L_kg']
savings = [(1 - results[m]['total_L_kg'] / baseline) * 100 for m in methods]
ax.bar(range(len(methods)), savings, color=colors_m, edgecolor='none', width=0.6)
ax.set_xticks(range(len(methods)))
ax.set_xticklabels([m.upper() for m in methods], color='white', fontsize=9)
ax.set_ylabel('Water saving vs flood (%)', color='white')
ax.set_title('Water Savings by Method', color='white', fontsize=11)
for i, s in enumerate(savings):
    ax.text(i, s + 1, f'{s:.0f}%', ha='center', color='white', fontsize=10)

# Plot 3: Climate effect
ax = axes[0, 2]
climate_names = list(climate_results.keys())
for i, (name, r) in enumerate(climate_results.items()):
    color = ['#22c55e', '#f59e0b', '#ef4444'][i]
    ax.bar(i, r['total_L_kg'], 0.6, color=color, edgecolor='none')
    ax.text(i, r['total_L_kg'] + 50, f\"{r['total_L_kg']:.0f}\", ha='center', color='white', fontsize=10)
ax.set_xticks(range(len(climate_names)))
ax.set_xticklabels(climate_names, color='white', fontsize=8)
ax.set_ylabel('Water footprint (L/kg)', color='white')
ax.set_title('Climate Effect on Water Footprint', color='white', fontsize=11)

# Plot 4: Global comparison
ax = axes[1, 0]
crops = ['Rice
(flood)', 'Rice
(SRI)', 'Wheat', 'Maize', 'Potato', 'Soybean']
wf = [results['flood']['total_L_kg'], results['SRI']['total_L_kg'], 900, 500, 250, 2000]
colors_crop = ['#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#ec4899']
ax.barh(range(len(crops)), wf, color=colors_crop, edgecolor='none', height=0.6)
ax.set_yticks(range(len(crops)))
ax.set_yticklabels(crops, color='white', fontsize=9)
ax.set_xlabel('Water footprint (L/kg)', color='white')
ax.set_title('Crop Water Footprint Comparison', color='white', fontsize=11)

# Plot 5: India rice water budget
ax = axes[1, 1]
states = ['Punjab', 'UP', 'W Bengal', 'Assam', 'AP/TS']
rice_Mt = [12, 15, 16, 5, 14]
water_km3 = [r * 2.5 for r in rice_Mt]  # approx km³
ax.bar(range(len(states)), water_km3, color='#3b82f6', edgecolor='none', width=0.6)
ax.bar(range(len(states)), rice_Mt, color='#22c55e', edgecolor='none', width=0.3)
ax.set_xticks(range(len(states)))
ax.set_xticklabels(states, color='white', fontsize=9)
ax.set_ylabel('Rice (Mt) / Water (km³)', color='white')
ax.set_title('India: Rice Production & Water Use', color='white', fontsize=11)

# Plot 6: Future projection
ax = axes[1, 2]
years = np.arange(2020, 2051)
demand = 520 * (1.01 ** (years - 2020))  # 1% annual growth in rice demand
supply_flood = 1900 * np.ones_like(years) * 0.16  # 16% of freshwater to rice
supply_optimized = supply_flood * (1 + 0.01 * (years - 2020))  # improving efficiency
ax.plot(years, demand, color='#ef4444', linewidth=2.5, label='Water demand (BAU)')
ax.plot(years, supply_flood, color='#3b82f6', linewidth=2.5, label='Supply (current efficiency)')
ax.plot(years, supply_optimized, color='#22c55e', linewidth=2.5, linestyle='--', label='Supply (improving efficiency)')
ax.fill_between(years, supply_flood, demand, where=demand > supply_flood, alpha=0.1, color='#ef4444')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Water (km³/year)', color='white')
ax.set_title('India Rice Water Gap Projection', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Rice Water Footprint Analysis")
print("=" * 55)
print()
print(f"{'Method':<10} {'Green':>8} {'Blue':>8} {'Grey':>8} {'Total':>8} {'Save':>6}")
print(f"{'':10} {'L/kg':>8} {'L/kg':>8} {'L/kg':>8} {'L/kg':>8} {'%':>6}")
print("-" * 55)
for m in methods:
    r = results[m]
    save = (1 - r['total_L_kg'] / results['flood']['total_L_kg']) * 100
    print(f"{m.upper():<10} {r['green_L_kg']:>8.0f} {r['blue_L_kg']:>8.0f} {r['grey_L_kg']:>8.0f} {r['total_L_kg']:>8.0f} {save:>5.0f}%")
print()
print("Drip irrigation saves ~60% water but requires infrastructure investment.")
print("SRI saves ~35% with minimal investment — the best bang for the buck.")
print("The future of rice is water-smart agriculture.")`,
      challenge: 'Model a "virtual water trade" scenario: if India exports 10 million tonnes of rice, how much virtual water is exported? Compare this to importing rice from a wet region (e.g., Myanmar with 1,500 L/kg footprint) vs growing it domestically in Punjab (3,500 L/kg). What is the global water saving from optimizing the rice trade?',
      successHint: 'Water is the hidden cost of rice production. Every plate of rice carries 2,500 liters of embedded water. As climate change intensifies droughts and groundwater depletion accelerates, the water footprint of rice will become as important as its carbon footprint. The story of the first rice being planted near water is more relevant than ever.',
    },
    {
      title: 'IRRI and high-yield varieties — the science of feeding billions',
      concept: `The **International Rice Research Institute (IRRI)**, established in 1960 in the Philippines, is the world\'s premier rice research center. It has released over 1,000 improved rice varieties that are grown on more than 60% of the world\'s rice land.\n\nKey IRRI innovations:\n\n1. **IR8 (1966)**: The first semi-dwarf variety. Doubled yields worldwide. Called "Miracle Rice."\n2. **IR36 (1976)**: Resistant to 8 major diseases and pests. Most widely planted rice variety in history.\n3. **IR64 (1985)**: Combined high yield with excellent grain quality. Standard for tropical rice.\n4. **IR72 (1988)**: Achieved 10+ t/ha in optimal conditions — close to the theoretical maximum.\n5. **IRRI Submergence-tolerant varieties (2000s)**: Carry the Sub1A gene, surviving 2 weeks underwater.\n6. **Golden Rice (2000s)**: Engineered with beta-carotene to fight vitamin A deficiency.\n\n**Yield potential** — the theoretical maximum yield of rice is limited by:\n- Solar radiation capture efficiency (~4.5% of PAR)\n- Photosynthetic efficiency (C3 pathway: ~2.5% solar → biomass)\n- Harvest index (~0.55)\n- Theoretical max: ~15 t/ha in tropical conditions\n- Current best: ~10-12 t/ha (still room to improve)\n\nThe **New Plant Type (NPT)** concept aims to increase yield potential by changing plant architecture: fewer but larger tillers, larger panicles, and even higher harvest index.`,
      analogy: 'IRRI is the NASA of rice. Just as NASA pushes the boundaries of space exploration, IRRI pushes the boundaries of rice productivity. Each new variety (IR8, IR36, IR64) is like a new spacecraft — more capable, more resilient, reaching further into hostile environments (floods, droughts, diseases). The gene bank at IRRI, holding 130,000 rice varieties, is like a library of blueprints for every rice "spacecraft" ever designed.',
      storyConnection: 'The story of the first rice planted in Assam represents one of 130,000 rice varieties preserved in gene banks worldwide. Each traditional variety — Joha, Bao, Komal from Assam; Basmati from Punjab; Jasmine from Thailand — is a unique genetic solution to a local environment. IRRI\'s mission is to use this diversity to create varieties that can feed the world while adapting to climate change.',
      checkQuestion: 'The theoretical maximum rice yield is ~15 t/ha, but the current best is ~10-12 t/ha. What are the three biggest bottlenecks preventing rice from reaching its theoretical potential?',
      checkAnswer: '(1) Photosynthetic efficiency: rice uses the C3 pathway, which wastes ~30% of fixed carbon through photorespiration. Converting rice to C4 photosynthesis (the IRRI C4 Rice Project) could increase yield by 50%. (2) Respiration losses: rice loses 40-60% of photosynthetic products to maintenance respiration, especially at high temperatures. (3) Sink limitation: even when plants produce enough carbohydrates, the grain sometimes cannot store them all — the panicle has a limited number of grain sites. Increasing spikelet number per panicle is a current breeding target.',
      codeIntro: 'Model rice yield potential, analyze how different IRRI varieties have increased yields over 60 years, and project future gains.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Rice yield potential model

def yield_potential(solar_radiation_MJ_m2_day=20, growing_days=120,
                   RUE=1.4, HI=0.50, C3_C4='C3'):
    """Calculate theoretical yield potential.\"\"\"
    # Radiation interception (fraction of PAR intercepted by canopy)
    PAR_fraction = 0.48  # PAR is ~48% of total solar
    interception = 0.85  # mature canopy intercepts ~85% of PAR
    
    # Radiation Use Efficiency (g biomass / MJ PAR intercepted)
    if C3_C4 == 'C4':
        RUE = RUE * 1.5  # C4 is ~50% more efficient
    
    total_PAR = solar_radiation_MJ_m2_day * PAR_fraction * growing_days  # MJ/m²
    intercepted_PAR = total_PAR * interception
    total_biomass = intercepted_PAR * RUE  # g/m²
    grain_yield = total_biomass * HI / 100  # t/ha
    
    return grain_yield

# IRRI variety timeline
varieties = {
    'Peta (trad.)': {'year': 1960, 'yield': 2.0, 'height': 170, 'HI': 0.30, 'resist': 0},
    'IR8': {'year': 1966, 'yield': 6.0, 'height': 100, 'HI': 0.50, 'resist': 2},
    'IR36': {'year': 1976, 'yield': 7.0, 'height': 98, 'HI': 0.48, 'resist': 8},
    'IR64': {'year': 1985, 'yield': 7.5, 'height': 95, 'HI': 0.50, 'resist': 6},
    'IR72': {'year': 1988, 'yield': 10.0, 'height': 90, 'HI': 0.52, 'resist': 5},
    'NSIC Rc222': {'year': 2007, 'yield': 9.0, 'height': 95, 'HI': 0.53, 'resist': 7},
    'IRRI NPT': {'year': 2020, 'yield': 11.0, 'height': 90, 'HI': 0.55, 'resist': 8},
}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('IRRI & High-Yield Varieties: 60 Years of Rice Science', color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Yield potential by pathway
ax = axes[0, 0]
solar_range = np.linspace(10, 30, 50)
for hi, color, label in [(0.45, '#f59e0b', 'HI=0.45 (current)'),
                           (0.55, '#22c55e', 'HI=0.55 (NPT)'),
                           (0.60, '#3b82f6', 'HI=0.60 (theoretical)')]:
    yields_c3 = [yield_potential(s, HI=hi) for s in solar_range]
    ax.plot(solar_range, yields_c3, color=color, linewidth=2, label=f'C3, {label}')
c4_yields = [yield_potential(s, HI=0.55, C3_C4='C4') for s in solar_range]
ax.plot(solar_range, c4_yields, color='#a855f7', linewidth=2, linestyle='--', label='C4, HI=0.55')
ax.set_xlabel('Solar radiation (MJ/m²/day)', color='white')
ax.set_ylabel('Yield potential (t/ha)', color='white')
ax.set_title('Theoretical Yield Potential', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: IRRI variety timeline
ax = axes[0, 1]
var_names = list(varieties.keys())
years_v = [varieties[v]['year'] for v in var_names]
yields_v = [varieties[v]['yield'] for v in var_names]
colors_v = plt.cm.viridis(np.linspace(0.2, 0.9, len(var_names)))
for i, (name, y, yld) in enumerate(zip(var_names, years_v, yields_v)):
    ax.scatter(y, yld, s=200, color=colors_v[i], edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(name, (y, yld), textcoords='offset points', xytext=(8, 5),
                color='white', fontsize=7)
ax.plot(years_v, yields_v, color='gray', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Yield potential (t/ha)', color='white')
ax.set_title('IRRI Variety Evolution', color='white', fontsize=11)

# Plot 3: Height vs HI vs yield
ax = axes[0, 2]
heights_v = [varieties[v]['height'] for v in var_names]
his_v = [varieties[v]['HI'] for v in var_names]
sc = ax.scatter(heights_v, his_v, c=yields_v, s=200, cmap='YlGn',
               edgecolor='white', linewidth=1, vmin=2, vmax=12)
plt.colorbar(sc, ax=ax, label='Yield (t/ha)')
for i, name in enumerate(var_names):
    ax.annotate(name.split('(')[0].strip()[:8], (heights_v[i], his_v[i]),
                textcoords='offset points', xytext=(5, 5), color='white', fontsize=7)
ax.set_xlabel('Plant height (cm)', color='white')
ax.set_ylabel('Harvest Index', color='white')
ax.set_title('Height vs HI (color=yield)', color='white', fontsize=11)

# Plot 4: Breeding pipeline
ax = axes[1, 0]
stages = ['Crossing', 'F1-F6
selection', 'Yield
trials', 'Multi-loc.
testing', 'Release']
years_stage = [1, 3, 2, 2, 1]
colors_stage = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
start = 0
for label, dur, color in zip(stages, years_stage, colors_stage):
    ax.barh(0, dur, left=start, height=0.4, color=color, edgecolor='none')
    ax.text(start + dur/2, 0, f'{label}
({dur}yr)', ha='center', va='center',
            color='white', fontsize=7, fontweight='bold')
    start += dur
ax.set_xlabel('Years', color='white')
ax.set_title(f'Breeding Pipeline: {sum(years_stage)} years to new variety', color='white', fontsize=11)
ax.set_yticks([])
ax.set_xlim(-0.5, sum(years_stage) + 0.5)

# Plot 5: Yield gap analysis
ax = axes[1, 1]
regions = ['Global
avg', 'India
avg', 'China
avg', 'Japan
avg', 'Exp.
station']
yield_actual = [4.7, 3.8, 7.0, 6.8, 10.5]
yield_potential_r = [8, 7, 9, 8.5, 12]
ax.bar(np.arange(len(regions)) - 0.15, yield_actual, 0.3, color='#f59e0b', label='Actual', edgecolor='none')
ax.bar(np.arange(len(regions)) + 0.15, yield_potential_r, 0.3, color='#22c55e', label='Attainable', edgecolor='none')
ax.set_xticks(range(len(regions)))
ax.set_xticklabels(regions, color='white', fontsize=8)
ax.set_ylabel('Yield (t/ha)', color='white')
ax.set_title('Yield Gap: Actual vs Attainable', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
for i in range(len(regions)):
    gap = yield_potential_r[i] - yield_actual[i]
    ax.annotate(f'Gap: {gap:.1f}', (i, yield_potential_r[i] + 0.2),
                ha='center', color='#ef4444', fontsize=8)

# Plot 6: Gene bank diversity
ax = axes[1, 2]
collections = ['IRRI
(Philippines)', 'NBPGR
(India)', 'NIAS
(Japan)', 'CNRRI
(China)', 'AfricaRice']
accessions = [130000, 90000, 40000, 70000, 20000]
colors_gb = ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#a855f7']
ax.barh(range(len(collections)), accessions, color=colors_gb, edgecolor='none', height=0.6)
ax.set_yticks(range(len(collections)))
ax.set_yticklabels(collections, color='white', fontsize=9)
ax.set_xlabel('Accessions (varieties stored)', color='white')
ax.set_title('Global Rice Gene Banks', color='white', fontsize=11)
for i, a in enumerate(accessions):
    ax.text(a + 2000, i, f'{a:,}', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("IRRI & High-Yield Rice Varieties")
print("=" * 55)
print()
print(f"{'Variety':<15} {'Year':>6} {'Yield':>6} {'Height':>8} {'HI':>6}")
print("-" * 45)
for name, data in varieties.items():
    print(f"{name:<15} {data['year']:>6} {data['yield']:>5.1f}t {data['height']:>6}cm {data['HI']:>5.2f}")
print()
print("Yield potential analysis:")
for label, hi, pathway in [('Current C3', 0.50, 'C3'), ('NPT C3', 0.55, 'C3'), ('C4 rice', 0.55, 'C4')]:
    yp = yield_potential(20, HI=hi, C3_C4=pathway)
    print(f"  {label}: {yp:.1f} t/ha (at 20 MJ/m²/day solar)")
print()
print("The yield gap (actual vs attainable) averages 40% globally.")
print("Closing this gap through better management could feed 1 billion more people")
print("WITHOUT needing any new genetic improvement.")`,
      challenge: 'Model the C4 Rice Project: if IRRI successfully engineers C4 photosynthesis into rice (a 20-year, $20M project), calculate the global impact: (1) additional yield per hectare, (2) total additional production (160M ha × yield gain), (3) additional people fed (250 kg rice/person/year), and (4) water savings (more yield per unit water). Is the $20M investment justified by the potential food security gain?',
      successHint: 'IRRI represents the best of agricultural science: systematic, data-driven, and oriented toward the most important crop for the most food-insecure people. From IR8 to CRISPR-edited varieties, the story is one of continuous innovation to feed a growing world on a changing planet. The story of the first rice planted is still being written.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Agricultural Scientist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (rice biology & ecosystem fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for paddy ecosystem, biogeochemistry, and agricultural science simulations. Click to start.</p>
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
