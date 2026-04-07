import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IronSmithsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Iron-carbon phase diagram',
      concept: `The **iron-carbon phase diagram** is the most important diagram in metallurgy. It maps which phases (solid structures) exist at every combination of temperature and carbon content.

Key regions:
- **Ferrite** (α): BCC iron with very little carbon (< 0.02%). Soft, magnetic.
- **Austenite** (γ): FCC iron dissolving up to 2.14% carbon. Exists above 727°C.
- **Cementite** (Fe₃C): iron carbide, 6.67% carbon. Very hard, very brittle.
- **Pearlite**: layered ferrite + cementite. The "default" structure on slow cooling.

Critical temperatures:
- **A₁ (727°C)**: austenite ↔ pearlite transformation
- **A₃**: ferrite ↔ austenite boundary (depends on carbon %)

The **eutectoid point** at 0.77% C, 727°C is where pearlite forms — the most common steel composition.

📚 *matplotlib's \`fill_between\` and \`fill\` create colored regions on a plot, perfect for phase diagrams where different areas represent different structures.*`,
      analogy: 'A phase diagram is like a weather map for materials. Instead of latitude and longitude, the axes are temperature and composition. Instead of rain/snow/sun, the regions show different crystal structures. Just as weather determines what you wear, the phase diagram determines what properties the metal has.',
      storyConnection: 'The Lushai smiths did not have a phase diagram, but they knew its contents by experience. They knew that iron heated to "cherry red" (about 750°C) and quenched in water became hard. They knew that adding charcoal powder during heating changed the iron\'s behavior. The phase diagram explains all of these observations.',
      checkQuestion: 'Why is 0.77% carbon called the eutectoid composition?',
      checkAnswer: 'At exactly 0.77% C, austenite transforms directly into pearlite at 727°C. Below 0.77% C, you get ferrite + pearlite. Above 0.77%, you get cementite + pearlite. The eutectoid is the "sweet spot" where the transformation is cleanest — it is the most common composition for structural steel.',
      codeIntro: 'Plot the iron-carbon phase diagram with colored regions for each phase.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 8))
fig.patch.set_facecolor('#111827')
ax.set_facecolor('#1f2937')

# Phase boundaries (simplified)
c = np.linspace(0, 2.14, 200)

# A3 line: ferrite to austenite (slopes down from 912°C at 0%C to 727°C at 0.77%C)
a3 = np.where(c <= 0.77, 912 - (912-727) * c / 0.77, np.nan)

# Acm line: austenite to austenite+cementite (slopes up from 727°C at 0.77% to ~1148°C at 2.14%)
acm = np.where(c >= 0.77, 727 + (1148-727) * (c-0.77)/(2.14-0.77), np.nan)

# Solidus/liquidus (simplified)
liquidus = 1538 - (1538-1148) * c / 2.14
solidus = np.where(c <= 0.77, 1538 - (1538-727) * c / 2.14,
                    727 + (1148-727) * (c-0.77)/(2.14-0.77))

# Draw phase regions
# Ferrite region
ax.fill_between([0, 0.02, 0.02, 0], [0, 0, 727, 912], color='#34d399', alpha=0.3)
ax.text(0.005, 400, 'α\\n(Ferrite)', color='#34d399', fontsize=11, fontweight='bold', ha='center')

# Austenite region
ax.fill_between(c[c<=0.77], a3[c<=0.77], 1538, color='#60a5fa', alpha=0.2)
ax.fill_between(c[c>=0.77], acm[c>=0.77], liquidus[c>=0.77], color='#60a5fa', alpha=0.2, where=~np.isnan(acm[c>=0.77]))
ax.text(0.5, 1000, 'γ\\n(Austenite)', color='#60a5fa', fontsize=13, fontweight='bold', ha='center')

# Pearlite/ferrite+cementite region
ax.fill_between([0, 2.14, 2.14, 0], [0, 0, 727, 727], color='#fbbf24', alpha=0.15)
ax.text(1.0, 350, 'Ferrite + Cementite\\n(Pearlite below 0.77%C)', color='#fbbf24', fontsize=10, ha='center')

# Phase boundary lines
ax.plot(c[c<=0.77], a3[c<=0.77], color='#34d399', linewidth=2.5, label='A₃ line')
ax.plot(c[c>=0.77], acm[c>=0.77], color='#f87171', linewidth=2.5, label='Acm line')
ax.axhline(727, color='#fbbf24', linewidth=2, linestyle='--', label='A₁ (727°C)')
ax.plot(c, liquidus, color='white', linewidth=2, linestyle=':', label='Liquidus')

# Eutectoid point
ax.plot(0.77, 727, 'o', color='#f87171', markersize=12, zorder=5)
ax.annotate('Eutectoid\\\n(0.77%C, 727°C)', xy=(0.77, 727),
            xytext=(1.3, 800), color='white', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='white'))

ax.set_xlabel('Carbon Content (wt%)', color='lightgray', fontsize=12)
ax.set_ylabel('Temperature (°C)', color='lightgray', fontsize=12)
ax.set_title('Iron-Carbon Phase Diagram', color='white', fontsize=14, fontweight='bold')
ax.set_xlim(0, 2.2)
ax.set_ylim(0, 1600)
ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/iron_phase.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()
print("The iron-carbon phase diagram is the 'map' of all steel metallurgy.")
print("Every heat treatment follows a path on this diagram.")`,
      challenge: 'Mark the path a blacksmith follows when making a knife: start at 0.5% C at room temperature, heat to 850°C (austenite), then quench to room temperature. What phases does the steel pass through?',
      successHint: 'You plotted the iron-carbon phase diagram — the most referenced diagram in materials science. Every steel product, from paperclips to skyscrapers, is designed using this diagram.',
    },
    {
      title: 'Cooling curves and phase transformations',
      concept: `A **cooling curve** tracks temperature over time as a material cools. Phase transformations appear as **plateaus** or **kinks** — the temperature stalls because latent heat is released.

For steel cooling from austenite:
- At the A₁ temperature (727°C), cooling slows as austenite transforms to pearlite
- The plateau duration depends on carbon content and cooling rate
- Faster cooling compresses the plateau (or skips it entirely in quenching)

The **TTT diagram** (Time-Temperature-Transformation) shows how fast you must cool to get each phase:
- Cool slowly → pearlite (soft)
- Cool at medium rate → bainite (tough)
- Cool very fast → martensite (hard)

📚 *We plot temperature vs. time data and use \`plt.annotate()\` to label phase transitions on the curve.*`,
      analogy: 'A cooling curve is like a speed bump. When you drive at constant speed (steady cooling), you hit a bump (phase transformation) that forces you to slow down. The bump absorbs your kinetic energy (latent heat). Bigger bumps (more transformation) cause more slowdown. If you drive fast enough (quenching), you can jump over the bump entirely.',
      storyConnection: 'The Lushai smiths judged cooling by color. Cherry red (750°C) → dark red (600°C) → black heat (below 400°C). They knew that the color change from bright to dark happened faster in water than in air. They were reading the cooling curve with their eyes.',
      checkQuestion: 'Why does the temperature plateau during a phase transformation?',
      checkAnswer: 'Phase transformation releases latent heat (the energy stored in the crystal structure). This heat counteracts the cooling, maintaining the temperature until the transformation is complete. The plateau ends when all the material has transformed. If you cool faster than the heat can be released, you can suppress the transformation entirely.',
      codeIntro: 'Simulate cooling curves for iron at different cooling rates, showing phase transformation plateaus.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

def cooling_curve(T_start, T_env, k, dt=0.1, t_max=300):
    """Simulate cooling with phase transformation plateaus."""
    t_list = [0]
    T_list = [T_start]
    T = T_start

    # Phase transformation at ~727°C releases latent heat
    transform_T = 727
    transform_width = 30  # temperature range of transformation
    latent_heat_factor = 0.4  # slows cooling by this fraction

    for i in range(int(t_max / dt)):
        t = (i + 1) * dt

        # Normal cooling rate
        dT = -k * (T - T_env) * dt

        # Slow down during phase transformation
        if abs(T - transform_T) < transform_width:
            proximity = 1 - abs(T - transform_T) / transform_width
            dT *= (1 - latent_heat_factor * proximity)

        T += dT
        t_list.append(t)
        T_list.append(T)

        if T < T_env + 5:
            break

    return np.array(t_list), np.array(T_list)

fig, ax = plt.subplots(figsize=(10, 7))
fig.patch.set_facecolor('#111827')
ax.set_facecolor('#1f2937')

cooling_methods = [
    ('Water quench', 0.15, '#60a5fa'),
    ('Oil quench', 0.03, '#fbbf24'),
    ('Air cool', 0.008, '#34d399'),
    ('Furnace cool', 0.002, '#f87171'),
]

for name, k, color in cooling_methods:
    t, T = cooling_curve(900, 25, k)
    ax.plot(t, T, color=color, linewidth=2.5, label=name)

    # Mark when it crosses 727°C
    cross_idx = np.argmin(np.abs(T - 727))
    ax.plot(t[cross_idx], 727, 'o', color=color, markersize=8)

# Phase transformation zone
ax.axhspan(697, 757, alpha=0.15, color='#fbbf24')
ax.annotate('Phase transformation zone\\\n(austenite → pearlite/bainite)', xy=(100, 727),
            color='#fbbf24', fontsize=10, ha='center')

# Martensite start temperature
ax.axhline(220, color='#a78bfa', linestyle=':', linewidth=1.5)
ax.text(250, 230, 'Ms (martensite start)', color='#a78bfa', fontsize=9)

ax.set_xlabel('Time (seconds)', color='lightgray', fontsize=12)
ax.set_ylabel('Temperature (°C)', color='lightgray', fontsize=12)
ax.set_title('Cooling Curves — Different Quenching Media', color='white', fontsize=14, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=10)
ax.set_ylim(0, 950)
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/iron_cooling.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

for name, k, _ in cooling_methods:
    t, T = cooling_curve(900, 25, k)
    cross_idx = np.argmin(np.abs(T - 727))
    rate_at_727 = k * (T[cross_idx] - 25)
    phase = "Martensite" if rate_at_727 > 50 else "Bainite" if rate_at_727 > 10 else "Pearlite"
    print(f"{name:<15}: reaches 727°C at t={t[cross_idx]:.1f}s, rate={rate_at_727:.1f}°C/s → {phase}")`,
      challenge: 'Add a "tempering" curve: after water quenching to 25°C, reheat to 400°C (takes 60s), hold for 120s, then air cool. Plot the complete thermal history. This is the full heat treatment cycle for a quality blade.',
      successHint: 'You simulated cooling curves with phase transformation effects. These curves are measured in real metallurgy labs using thermocouples inserted into cooling samples. The data directly determines which microstructure forms — and therefore which mechanical properties the metal will have.',
    },
    {
      title: 'Hardness vs. carbon content',
      concept: `The **hardness** of steel depends strongly on carbon content and heat treatment:

- Pure iron (0% C): ~80 HV (Vickers hardness) — very soft
- 0.2% C steel (mild): ~150 HV annealed, ~400 HV quenched
- 0.5% C steel (medium): ~200 HV annealed, ~600 HV quenched
- 0.8% C steel (high): ~250 HV annealed, ~800 HV quenched
- 1.0% C steel (tool): ~270 HV annealed, ~850 HV quenched

The relationship is roughly:
\`HV_quenched ≈ 300 + 1000 × %C\` (for martensite)
\`HV_annealed ≈ 80 + 250 × %C\` (for pearlite)

But above ~0.8% C, hardness plateaus because excess carbon forms brittle cementite rather than strengthening the martensite.

📚 *matplotlib scatter plots with color mapping (\`c=\` parameter and \`cmap=\`) create visually rich data visualizations that encode an extra dimension as color.*`,
      analogy: 'Carbon in steel is like salt in food. A little salt (0.2% C) makes bland food better (mild steel). More salt (0.5-0.8% C) creates intense flavor (hard steel). But too much salt (> 1% C) makes food inedible (brittle steel). There is a sweet spot — just as chefs balance seasoning, metallurgists balance carbon.',
      storyConnection: 'The Lushai smiths controlled carbon content by how long they held the iron in the charcoal bed and how many times they folded and hammered it. More charcoal exposure = more carbon absorbed. They knew that tools needed more time in the fire than agricultural implements — empirical carbon control.',
      checkQuestion: 'Why does hardness plateau above 0.8% carbon instead of continuing to increase?',
      checkAnswer: 'At 0.8% C (eutectoid), the microstructure is 100% pearlite (or martensite if quenched). Above 0.8%, excess carbon forms cementite along grain boundaries. This cementite network is like a web of glass — it does not increase hardness much but makes the steel brittle. The optimal hardness-to-toughness ratio is near the eutectoid.',
      codeIntro: 'Plot hardness versus carbon content for both annealed and quenched steel.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

carbon = np.linspace(0, 1.2, 100)

# Hardness models
hv_annealed = 80 + 250 * carbon
hv_quenched = np.minimum(300 + 1000 * carbon, 300 + 1000 * 0.8 + 50 * (carbon - 0.8))
hv_tempered = hv_quenched * 0.65  # tempering reduces hardness ~35%

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Hardness curves
ax1.set_facecolor('#1f2937')
ax1.plot(carbon, hv_annealed, color='#34d399', linewidth=2.5, label='Annealed (pearlite)')
ax1.plot(carbon, hv_quenched, color='#f87171', linewidth=2.5, label='Quenched (martensite)')
ax1.plot(carbon, hv_tempered, color='#fbbf24', linewidth=2.5, label='Quenched + Tempered')

# Application zones
apps = [
    (0.05, 0.25, 'Structural\\nsteel', '#34d399'),
    (0.25, 0.55, 'Axles,\\ngears', '#60a5fa'),
    (0.55, 0.85, 'Blades,\\nsprings', '#fbbf24'),
    (0.85, 1.2, 'Tool\\nsteel', '#f87171'),
]
for x1, x2, label, color in apps:
    ax1.axvspan(x1, x2, alpha=0.08, color=color)
    ax1.text((x1+x2)/2, 50, label, color=color, fontsize=8, ha='center', va='bottom')

ax1.set_xlabel('Carbon Content (wt%)', color='lightgray', fontsize=12)
ax1.set_ylabel('Vickers Hardness (HV)', color='lightgray', fontsize=12)
ax1.set_title('Steel Hardness vs Carbon Content', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Toughness vs hardness tradeoff
toughness = 100 / (1 + 0.005 * hv_quenched)  # inverse relationship
ax2.set_facecolor('#1f2937')
scatter = ax2.scatter(hv_quenched, toughness, c=carbon, cmap='RdYlGn_r',
                       s=40, alpha=0.8, edgecolors='none')
plt.colorbar(scatter, ax=ax2, label='Carbon %')

# Optimal zone
ax2.axvspan(500, 700, alpha=0.15, color='#fbbf24')
ax2.annotate('Optimal zone\\\n(blade steel)', xy=(600, 40), color='#fbbf24',
             fontsize=11, ha='center', fontweight='bold')

ax2.set_xlabel('Hardness (HV)', color='lightgray', fontsize=12)
ax2.set_ylabel('Toughness (relative)', color='lightgray', fontsize=12)
ax2.set_title('Hardness-Toughness Tradeoff', color='white', fontsize=13, fontweight='bold')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/iron_hardness.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Application guide:")
for c_pct, app in [(0.1, "Nails, wire"), (0.3, "Structural beams"),
                    (0.5, "Axles, crankshafts"), (0.7, "Knives, swords"),
                    (0.9, "Drill bits, files"), (1.1, "Razor blades")]:
    hv = min(300 + 1000*c_pct, 1100)
    print(f"  {c_pct:.1f}% C: {hv:.0f} HV → {app}")`,
      challenge: 'The Lushai smiths likely produced iron with 0.3-0.8% carbon. Plot the range of properties they could achieve. What applications were possible, and which were out of reach?',
      successHint: 'You plotted the fundamental relationship between carbon content and steel properties. The hardness-toughness tradeoff is the central challenge of metallurgy: you cannot maximize both simultaneously. Every steel application represents a compromise on this curve.',
    },
    {
      title: 'Corrosion — why iron rusts',
      concept: `**Corrosion** is iron returning to its natural oxide state. The reaction:

\`4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃\` (rust)

This is an **electrochemical** process requiring:
1. **Anode** (iron dissolves): Fe → Fe²⁺ + 2e⁻
2. **Cathode** (oxygen is reduced): O₂ + 2H₂O + 4e⁻ → 4OH⁻
3. **Electrolyte** (water with dissolved salts carries ions)

The rate of corrosion depends on:
- **Humidity**: more moisture = faster rust
- **Salt**: ions increase conductivity of water = much faster
- **Temperature**: higher T = faster reaction
- **pH**: acids accelerate corrosion

Iron corrodes at about **0.1 mm/year** in normal conditions, but up to **1 mm/year** in saltwater.

📚 *We model corrosion as an exponential process and plot the remaining thickness over time using matplotlib.*`,
      analogy: 'Rusting is like iron "breathing backwards." When iron was smelted, we used energy to remove oxygen from iron ore. Rusting is iron naturally combining with oxygen again — releasing that stored energy as heat (too slowly to notice). Iron "wants" to be an oxide; pure iron is an unstable, energy-rich state.',
      storyConnection: 'The Lushai smiths fought corrosion constantly. Iron tools left untreated in Mizoram\'s humid climate would rust within weeks. They used animal fat, beeswax, and oil to coat their ironwork — early forms of corrosion protection. Some also discovered that heating iron until it turned blue-black created a protective oxide layer (bluing).',
      checkQuestion: 'Why does stainless steel resist corrosion while regular steel rusts?',
      checkAnswer: 'Stainless steel contains 10-18% chromium. Chromium forms a thin, invisible oxide layer (Cr₂O₃) that is self-healing — if scratched, it reforms immediately. This "passivation layer" blocks oxygen and water from reaching the iron underneath. Regular steel lacks this protective layer.',
      codeIntro: 'Model iron corrosion rates under different environmental conditions.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

years = np.linspace(0, 50, 500)
initial_thickness = 10  # mm

# Corrosion rates (mm/year) for different environments
environments = {
    'Dry indoor': 0.01,
    'Rural outdoor': 0.05,
    'Urban/industrial': 0.1,
    'Coastal': 0.3,
    'Saltwater immersed': 0.8,
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

colors = ['#34d399', '#22d3ee', '#fbbf24', '#f87171', '#a78bfa']

# Thickness remaining over time
ax1.set_facecolor('#1f2937')
for (env, rate), color in zip(environments.items(), colors):
    thickness = initial_thickness - rate * years
    thickness = np.maximum(thickness, 0)
    ax1.plot(years, thickness, color=color, linewidth=2.5, label=f'{env} ({rate} mm/yr)')

    # Mark when 50% is lost
    half_life = initial_thickness / (2 * rate)
    if half_life <= 50:
        ax1.plot(half_life, initial_thickness/2, 'o', color=color, markersize=6)

ax1.axhline(initial_thickness * 0.5, color='gray', linestyle=':', alpha=0.5)
ax1.text(48, initial_thickness * 0.52, '50% loss', color='gray', fontsize=9, ha='right')
ax1.set_xlabel('Years', color='lightgray', fontsize=12)
ax1.set_ylabel('Remaining thickness (mm)', color='lightgray', fontsize=12)
ax1.set_title('Iron Corrosion Over Time', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Mass loss as bar chart
ax2.set_facecolor('#1f2937')
env_names = list(environments.keys())
rates = list(environments.values())
mass_loss_10yr = [r * 10 for r in rates]  # mm lost in 10 years

bars = ax2.barh(env_names, mass_loss_10yr, color=colors, edgecolor='none', height=0.6)
ax2.set_xlabel('Metal lost in 10 years (mm)', color='lightgray', fontsize=12)
ax2.set_title('10-Year Corrosion by Environment', color='white', fontsize=13, fontweight='bold')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

for bar, val in zip(bars, mass_loss_10yr):
    ax2.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             f'{val:.1f} mm', color='lightgray', va='center', fontsize=10)

plt.tight_layout()
plt.savefig('/tmp/iron_corrosion.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Lushai iron tools in Mizoram's humid climate (coastal-like):")
print(f"  Corrosion rate: ~0.3 mm/year")
print(f"  A 5mm thick blade loses 50% in {5/(2*0.3):.0f} years")
print(f"  With oil coating (reduces rate 80%): {5/(2*0.3*0.2):.0f} years")
print(f"  With modern galvanizing (zinc coat): effectively zero for 30+ years")`,
      challenge: 'Model the effect of a protective coating that degrades over time. Start with 90% corrosion reduction that decreases by 5% per year. When does the coating become ineffective? Plot coated vs. uncoated steel over 30 years.',
      successHint: 'You modeled corrosion — the reverse of smelting. Understanding corrosion is crucial for infrastructure (bridges, pipelines), preservation (historical artifacts), and everyday life (cars, tools). The Lushai smiths\' anti-corrosion techniques were early materials engineering.',
    },
    {
      title: 'Alloy design — mixing metals for better properties',
      concept: `An **alloy** is a mixture of metals (or metal + non-metal) with properties different from either component. Key iron alloys:

- **Carbon steel**: Fe + C (0.05-2%). The most common alloy.
- **Stainless steel**: Fe + Cr (10-18%) + Ni (8-10%). Corrosion resistant.
- **Tool steel**: Fe + W (5-18%) + Mo + V. Extreme hardness.
- **Cast iron**: Fe + C (2-4%) + Si. Brittle but easy to cast.

Alloy properties follow **mixing rules** (approximately):
\`Property_alloy ≈ Σ (fraction_i × Property_i)\`

But interactions between elements create **synergies** — the alloy may be stronger than any individual component. This is the magic of metallurgy.

📚 *Radar charts (polar plots) in matplotlib show multiple properties simultaneously, ideal for comparing alloy compositions.*`,
      analogy: 'Alloying is like cooking a curry. Rice alone is bland. Spices alone are inedible. But the right combination of rice, spices, vegetables, and oil creates something far better than any ingredient alone. Metallurgy is "cooking" with elements — the recipe determines the result.',
      storyConnection: 'The Lushai smiths worked primarily with carbon steel — iron plus carbon from charcoal. They may have also added small amounts of other materials (sand for silicon, bone ash for phosphorus) without understanding the chemistry. Modern alloy design formalizes what traditional smiths discovered through generations of experimentation.',
      checkQuestion: 'Why is stainless steel not used for everything if it resists corrosion?',
      checkAnswer: 'Stainless steel is expensive (chromium and nickel are costly), harder to machine, cannot be heat-treated to extreme hardness like carbon steel, and is heavier than aluminum alternatives. For many applications (buildings, cars, railways), regular carbon steel with paint or galvanizing is much cheaper and perfectly adequate.',
      codeIntro: 'Compare the properties of different iron alloys using radar charts and property calculations.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Alloy properties (normalized 0-100 scale)
alloys = {
    'Pure Iron': {
        'Hardness': 20, 'Toughness': 70, 'Corrosion Res.': 15,
        'Weldability': 90, 'Cost Efficiency': 80, 'Machinability': 60
    },
    'Carbon Steel (0.5%C)': {
        'Hardness': 55, 'Toughness': 60, 'Corrosion Res.': 15,
        'Weldability': 70, 'Cost Efficiency': 85, 'Machinability': 65
    },
    'Stainless (304)': {
        'Hardness': 45, 'Toughness': 65, 'Corrosion Res.': 90,
        'Weldability': 60, 'Cost Efficiency': 35, 'Machinability': 40
    },
    'Tool Steel (W1)': {
        'Hardness': 95, 'Toughness': 30, 'Corrosion Res.': 10,
        'Weldability': 20, 'Cost Efficiency': 25, 'Machinability': 35
    },
    'Cast Iron': {
        'Hardness': 65, 'Toughness': 15, 'Corrosion Res.': 25,
        'Weldability': 10, 'Cost Efficiency': 90, 'Machinability': 80
    },
}

# Radar chart
fig, axes = plt.subplots(1, 5, figsize=(18, 4), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#111827')

categories = list(list(alloys.values())[0].keys())
N = len(categories)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

colors = ['#6b7280', '#34d399', '#60a5fa', '#f87171', '#fbbf24']

for ax, (name, props), color in zip(axes, alloys.items(), colors):
    ax.set_facecolor('#1f2937')
    values = [props[cat] for cat in categories] + [props[categories[0]]]

    ax.fill(angles, values, alpha=0.25, color=color)
    ax.plot(angles, values, color=color, linewidth=2)

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels([c[:4] for c in categories], fontsize=6, color='lightgray')
    ax.set_yticks([25, 50, 75])
    ax.set_yticklabels(['', '', ''], fontsize=6)
    ax.set_ylim(0, 100)
    ax.set_title(name, color=color, fontsize=9, fontweight='bold', pad=15)
    ax.tick_params(colors='lightgray')
    ax.spines['polar'].set_color('#374151')

plt.suptitle('Iron Alloy Property Comparison', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/iron_alloys.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

# Summary table
print("ALLOY COMPARISON TABLE")
print("=" * 70)
print(f"{'Alloy':<22}", end="")
for cat in categories:
    print(f" {cat[:8]:>8}", end="")
print()
print("-" * 70)
for name, props in alloys.items():
    print(f"{name:<22}", end="")
    for cat in categories:
        print(f" {props[cat]:>8}", end="")
    print()

# Best alloy for each application
print("\\\nBest alloy by application:")
print(f"  Kitchen knife:    Carbon Steel (hard, cheap, sharpenable)")
print(f"  Surgical tool:    Stainless (corrosion-free, sterilizable)")
print(f"  Cutting tool:     Tool Steel (extreme hardness)")
print(f"  Engine block:     Cast Iron (cheap, machinable, vibration dampening)")`,
      challenge: 'Design a hypothetical "ideal blade alloy" by choosing the best value from each category. Is it achievable? Why or why not? Plot your ideal alloy alongside the real ones.',
      successHint: 'You compared alloy properties using radar charts — a standard technique in materials selection. The key insight is that no single alloy is best at everything. Engineering is about choosing the right material for the right application, exactly as the Lushai smiths chose different compositions for different tools.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Iron & Steel Science</span>
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
