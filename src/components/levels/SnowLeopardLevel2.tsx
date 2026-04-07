import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import MountainTreelineDiagram from '../diagrams/MountainTreelineDiagram';
import PopulationGrowthCurve from '../diagrams/PopulationGrowthCurve';
import MountainZonationDiagram from '../diagrams/MountainZonationDiagram';
import GlacierDiagram from '../diagrams/GlacierDiagram';
import MountainClimateChangeDiagram from '../diagrams/MountainClimateChangeDiagram';
import MountainWatershedDiagram from '../diagrams/MountainWatershedDiagram';
import AltitudeProfileDiagram from '../diagrams/AltitudeProfileDiagram';
import ClimateZonesDiagram from '../diagrams/ClimateZonesDiagram';
import CorrelationDiagram from '../diagrams/CorrelationDiagram';
import HeatTransferDiagram from '../diagrams/HeatTransferDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';

export default function SnowLeopardLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Altitudinal zonation — vertical ecosystems on a single mountain',
      concept: `A mountain is an ecosystem compressed vertically. As you climb from the base to the summit of a Himalayan peak, you pass through distinct **vegetation zones**, each defined by temperature, precipitation, and oxygen availability:

1. **Tropical/Subtropical zone** (0-1,500 m): broadleaf forests, sal trees, bamboo
2. **Temperate zone** (1,500-3,000 m): oak, rhododendron, maple, mixed forests
3. **Subalpine zone** (3,000-4,000 m): fir, birch, juniper, dense undergrowth
4. **Alpine zone** (4,000-5,000 m): grasses, sedges, dwarf shrubs, no trees
5. **Nival zone** (5,000+ m): bare rock, ice, lichens, mosses — the snow leopard's highest hunting ground

Each zone has its own community of plants, animals, insects, and microbes. The boundaries between zones are called **ecotones** — transition areas rich in biodiversity because species from both adjacent zones overlap there.

This vertical stacking of ecosystems means a single mountain can contain as much biodiversity as hundreds of kilometres of flat terrain.`,
      analogy: 'A mountain is like a multi-storey building where each floor has a completely different climate. The ground floor is tropical, the second floor is temperate, the third is subarctic, and the roof is polar. The elevator (altitude) takes you through climate zones that would normally require travelling thousands of kilometres horizontally.',
      storyConnection: 'The snow leopard patrols the upper floors of this vertical building — primarily the alpine and nival zones. But it follows prey (bharal, tahr) into the subalpine zone in winter when snow pushes animals downhill. Its range overlaps with the ecotone between subalpine and alpine — exactly the boundary zone richest in prey species.',
      checkQuestion: 'Why do tropical mountains (like those in Borneo or the Andes) have more altitudinal zones than mountains at high latitudes (like in Norway)?',
      checkAnswer: 'Tropical mountains start from a warmer base temperature, so they pass through more climate zones before reaching the snow line. A mountain starting at 30°C at its base in Borneo passes through tropical, subtropical, temperate, subalpine, alpine, and nival zones. A Norwegian mountain starting at 5°C might only have subalpine, alpine, and nival. More temperature range = more zones.',
      codeIntro: 'Model and visualise the altitudinal zones of a Sikkim Himalayan mountain.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 8), gridspec_kw={'width_ratios': [1, 2]})
fig.patch.set_facecolor('#1f2937')

# Zone definitions
zones = [
    (0, 1500, 'Tropical/Subtropical', '#22c55e', 'Sal, bamboo, orchids'),
    (1500, 3000, 'Temperate', '#16a34a', 'Oak, rhododendron, maple'),
    (3000, 4000, 'Subalpine', '#65a30d', 'Fir, birch, juniper'),
    (4000, 5000, 'Alpine', '#d97706', 'Grasses, sedges, dwarf shrubs'),
    (5000, 7000, 'Nival', '#94a3b8', 'Lichens, mosses, bare rock'),
]

# Left panel: zone diagram
ax1.set_facecolor('#111827')
for lo, hi, name, color, species in zones:
    ax1.barh(0, 1, bottom=lo, height=hi-lo, color=color, alpha=0.7, edgecolor='white', linewidth=0.5)
    ax1.text(0.5, (lo+hi)/2, f'{name}\\\n{lo}-{hi}m', ha='center', va='center',
             color='white', fontsize=8, fontweight='bold')

# Snow leopard range
ax1.axhline(3500, color='white', linestyle='--', linewidth=1.5)
ax1.axhline(5500, color='white', linestyle='--', linewidth=1.5)
ax1.annotate('Snow leopard\\\nrange', xy=(0.85, 4500), color='white', fontsize=8,
             fontweight='bold', ha='center')

ax1.set_xlim(0, 1)
ax1.set_ylim(0, 7000)
ax1.set_ylabel('Altitude (m)', color='white')
ax1.set_xticks([])
ax1.set_title('Altitudinal Zones', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Right panel: temperature and species richness profiles
alt = np.linspace(0, 7000, 200)
temp = 25 - 6.5 * alt / 1000  # lapse rate

# Species richness peaks at mid-altitude (mid-domain effect)
richness = 100 * np.exp(-((alt - 2000)**2) / (2 * 1200**2))

ax2.set_facecolor('#111827')
ax2_twin = ax2.twiny()

ax2.plot(temp, alt, color='#ef4444', linewidth=2, label='Temperature')
ax2_twin.plot(richness, alt, color='#22c55e', linewidth=2, label='Species richness')
ax2_twin.fill_betweenx(alt, richness, alpha=0.1, color='#22c55e')

ax2.set_xlabel('Temperature (°C)', color='#ef4444')
ax2_twin.set_xlabel('Relative species richness', color='#22c55e')
ax2.set_ylabel('Altitude (m)', color='white')
ax2.set_title('Temperature & Biodiversity vs Altitude', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='#22c55e')
ax2.axvline(0, color='gray', linestyle=':', linewidth=0.5)

for lo, hi, name, color, _ in zones:
    ax2.axhspan(lo, hi, alpha=0.05, color=color)

plt.tight_layout()
plt.show()

print("Altitudinal zones of Sikkim Himalaya:")
for lo, hi, name, color, species in zones:
    t_lo = 25 - 6.5 * lo / 1000
    t_hi = 25 - 6.5 * hi / 1000
    print(f"  {name} ({lo}-{hi}m): {t_hi:.0f} to {t_lo:.0f}°C — {species}")
print()
print("Peak biodiversity: ~2,000 m (temperate zone)")
print("Snow leopard range: 3,500-5,500 m")`,
      challenge: 'Add a precipitation profile: rainfall peaks around 2,000-3,000 m (orographic lift) and decreases above and below. Plot it as a third variable. How does it correlate with species richness?',
      successHint: 'Altitudinal zonation is why mountains are biodiversity hotspots. Protecting a single mountain can preserve multiple complete ecosystems. This is the basis of vertical conservation strategies.',
    },
    {
      title: 'Treeline physics — why trees stop growing at a specific altitude',
      concept: `If you climb any mountain, you'll reach a point where trees simply stop. This is the **treeline** (or timberline), typically between 3,000 and 4,000 m in the Himalayas. Above it, only grasses, shrubs, and mosses survive. But why?

The treeline is set by temperature, not altitude directly. Trees stop growing where the **mean growing-season temperature drops below about 6.4°C**. This threshold is remarkably consistent worldwide.

Why 6.4°C? Trees are tall structures that must invest heavily in wood (lignin + cellulose). Wood construction requires sustained warmth over months. Below the threshold:
- **Photosynthesis** still works, but barely produces surplus energy
- **Respiration** (energy consumed by living cells) doesn't decrease as fast as photosynthesis
- The **carbon balance** goes negative: the tree burns more sugar to stay alive than it can produce
- **Xylem** (water transport tubes) can freeze, causing fatal air bubbles (embolism)

The treeline is essentially an **energy budget boundary** — below it, trees can't earn enough carbon to pay for their structure.`,
      analogy: 'The treeline is like a business that can no longer cover its costs. A tree is an expensive organism — it has to build and maintain a massive wooden trunk, branches, and root system (fixed costs). In warm temperatures, photosynthesis earns enough "revenue" to cover these costs plus growth. As it gets colder, revenue drops while maintenance costs barely change. At the treeline, the business breaks even. Above it, the tree would "go bankrupt" — spending more energy than it earns.',
      storyConnection: 'The snow leopard\'s habitat begins near the treeline. Above the trees, the landscape opens into alpine meadows and rocky slopes where the leopard\'s camouflage is most effective. The treeline is a critical ecological boundary: below it, the leopard competes with common leopards in forested terrain. Above it, the snow leopard reigns supreme.',
      checkQuestion: 'Climate change is causing treelines to move upward worldwide. Why might this be bad for alpine species like the snow leopard?',
      checkAnswer: 'As trees colonise higher ground, alpine meadow habitat shrinks. Snow leopards and their prey (bharal, marmots) depend on open, treeless terrain. Trees block sight lines needed for hunting, provide cover for competing predators, and change the microclimate. Species adapted to life above the treeline have nowhere to go if the treeline rises to the summit — they are squeezed off the top of the mountain.',
      codeIntro: 'Model the carbon balance of a tree at different altitudes to find the treeline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

altitudes = np.linspace(0, 5000, 300)
temp = 25 - 6.5 * altitudes / 1000  # temperature at each altitude

# Photosynthesis rate (depends strongly on temperature)
# Peaks around 25°C, drops to near zero below 5°C
photo = np.maximum(0, 20 * (1 - ((temp - 25) / 30)**2))

# Respiration rate (decreases with temperature but less steeply)
# Q10 rule: respiration roughly doubles for every 10°C increase
resp = 3 * 2**((temp - 15) / 10)

# Net carbon gain
net_carbon = photo - resp

# Find treeline (where net carbon = 0 above the threshold)
treeline_idx = np.where((net_carbon[1:] <= 0) & (net_carbon[:-1] > 0))[0]
treeline_alt = altitudes[treeline_idx[0]] if len(treeline_idx) > 0 else 3500
treeline_temp = 25 - 6.5 * treeline_alt / 1000

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Carbon fluxes
ax1.set_facecolor('#111827')
ax1.plot(altitudes / 1000, photo, color='#22c55e', linewidth=2, label='Photosynthesis')
ax1.plot(altitudes / 1000, resp, color='#ef4444', linewidth=2, label='Respiration')
ax1.fill_between(altitudes / 1000, photo, resp, where=photo > resp, alpha=0.15, color='#22c55e', label='Surplus (growth)')
ax1.fill_between(altitudes / 1000, photo, resp, where=photo <= resp, alpha=0.15, color='#ef4444', label='Deficit (death)')
ax1.axvline(treeline_alt / 1000, color='#f59e0b', linestyle='--', linewidth=2)
ax1.annotate(f'Treeline\\\n{treeline_alt:.0f}m ({treeline_temp:.1f}°C)', xy=(treeline_alt / 1000, 10),
             xytext=(treeline_alt / 1000 + 0.3, 14), color='#f59e0b', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.set_ylabel('Carbon flux (arbitrary units)', color='white')
ax1.set_title('Why Trees Stop: The Carbon Balance', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Net carbon
ax2.set_facecolor('#111827')
ax2.plot(altitudes / 1000, net_carbon, color='#3b82f6', linewidth=2)
ax2.fill_between(altitudes / 1000, net_carbon, 0, where=net_carbon > 0, alpha=0.2, color='#22c55e')
ax2.fill_between(altitudes / 1000, net_carbon, 0, where=net_carbon <= 0, alpha=0.2, color='#ef4444')
ax2.axhline(0, color='gray', linewidth=1, linestyle=':')
ax2.axvline(treeline_alt / 1000, color='#f59e0b', linestyle='--', linewidth=2)
ax2.set_xlabel('Altitude (km)', color='white')
ax2.set_ylabel('Net carbon gain', color='white')
ax2.set_title('Net Carbon: Positive = Growth Possible', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Model treeline altitude: {treeline_alt:.0f} m")
print(f"Temperature at treeline: {treeline_temp:.1f}°C")
print(f"Observed Himalayan treeline: ~3,500-4,000 m")
print(f"Global treeline threshold: ~6.4°C mean growing season temp")
print()
print("Above the treeline, only low-growing plants survive.")
print("They avoid the carbon cost of building a trunk.")`,
      challenge: 'Simulate climate change: increase the base temperature from 25°C to 27°C (a 2°C warming). How much does the treeline move upward? This is roughly the expected warming by 2100 under moderate scenarios.',
      successHint: 'The treeline is a living thermometer — its position records centuries of temperature history. Studying treeline shifts through tree rings and fossil pollen is a key method in paleoclimatology.',
    },
    {
      title: 'Glaciology basics — rivers of ice that shape mountains',
      concept: `The high Himalayas are carved not by rivers of water but by rivers of **ice** — glaciers. A glacier forms when snow accumulates year after year, compressing into dense ice. When the ice mass becomes heavy enough, gravity pulls it slowly downhill.

Key glacier physics:
- **Accumulation zone**: upper area where snowfall exceeds melting (net gain)
- **Ablation zone**: lower area where melting exceeds snowfall (net loss)
- **Equilibrium line**: boundary between the two — where gain equals loss
- **Flow**: glaciers move 10-300 metres per year, deforming internally under their own weight (plastic flow) and sliding over bedrock on a thin water layer (basal sliding)

Glaciers shape mountains through **erosion**:
- **Plucking**: ice freezes onto bedrock and rips chunks away
- **Abrasion**: rocks embedded in the glacier grind the valley floor smooth
- Results: U-shaped valleys, cirques, moraines, aretes, and horns

Sikkim has **84 glaciers** covering about 440 km². The Zemu Glacier (26 km long) is one of the largest in the Eastern Himalayas. These glaciers are the water towers of Asia — feeding rivers that sustain over a billion people downstream.`,
      analogy: 'A glacier is like a slow-motion conveyor belt made of ice. Snow falls on one end (the accumulation zone), rides the belt downhill, and melts off the other end (the ablation zone). If more snow falls than melts, the belt extends forward (glacier advance). If more melts than falls, the belt retreats. The "belt" moves so slowly you cannot see it, but over centuries it carves entire valleys.',
      storyConnection: 'The snow leopard crosses glaciers as part of its territory — sometimes 100+ square kilometres. The glaciers provide freshwater streams where prey animals drink, and the moraines (debris piles) create sheltered spots where bharal graze. The leopard\'s wide, padded paws grip ice as effectively as they grip rock.',
      checkQuestion: 'Himalayan glaciers are sometimes called the "Third Pole" because they contain more ice than anywhere outside the Arctic and Antarctic. Why should people in Kolkata or Dhaka care about these glaciers melting?',
      checkAnswer: 'The Ganges and Brahmaputra rivers depend on glacier meltwater, especially during pre-monsoon months when rainfall is low. If glaciers disappear, rivers lose their dry-season flow. This threatens drinking water, irrigation, and hydropower for hundreds of millions of people. Short-term, accelerated melting causes floods and glacial lake outbursts. Long-term, the rivers shrink.',
      codeIntro: 'Model glacier mass balance and flow over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Glacier profile: altitude along the glacier (0 = terminus, 10 = head)
distance = np.linspace(0, 10, 100)  # km from terminus
altitude = 4000 + 400 * distance + 50 * np.sin(distance)  # simplified profile

# Mass balance: positive at high altitude, negative at low
equilibrium_line = 5200  # metres
mass_balance = (altitude - equilibrium_line) * 0.003  # m water equivalent/year

# Ice thickness profile
thickness = np.maximum(0, 200 * np.sin(np.pi * distance / 10) * (1 + 0.3 * (altitude - 4000) / 4000))

# Flow velocity (proportional to thickness and slope)
slope = np.gradient(altitude, distance * 1000)
velocity = 0.1 * thickness * np.abs(slope)  # simplified, m/year

fig, axes = plt.subplots(3, 1, figsize=(10, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Zemu Glacier Model — Sikkim', color='white', fontsize=14)

# Cross-section
ax1 = axes[0]
ax1.set_facecolor('#111827')
ax1.fill_between(distance, altitude - thickness, altitude, color='#93c5fd', alpha=0.6, label='Ice')
ax1.plot(distance, altitude, color='white', linewidth=1.5, label='Surface')
ax1.plot(distance, altitude - thickness, color='#6b7280', linewidth=1, label='Bedrock')
ax1.axhline(equilibrium_line, color='#f59e0b', linestyle='--', linewidth=1.5, label=f'Equilibrium line ({equilibrium_line}m)')
ax1.set_ylabel('Altitude (m)', color='white')
ax1.set_title('Glacier Cross-Section', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Annotate zones
ax1.annotate('ABLATION ZONE\\\n(net melting)', xy=(2, 4600), color='#ef4444', fontsize=9, fontweight='bold')
ax1.annotate('ACCUMULATION ZONE\\\n(net snowfall)', xy=(7, 7200), color='#3b82f6', fontsize=9, fontweight='bold')

# Mass balance
ax2 = axes[1]
ax2.set_facecolor('#111827')
ax2.plot(distance, mass_balance, color='#22c55e', linewidth=2)
ax2.fill_between(distance, mass_balance, 0, where=mass_balance > 0, alpha=0.2, color='#3b82f6', label='Accumulation')
ax2.fill_between(distance, mass_balance, 0, where=mass_balance <= 0, alpha=0.2, color='#ef4444', label='Ablation')
ax2.axhline(0, color='gray', linewidth=1, linestyle=':')
ax2.set_ylabel('Mass balance (m w.e./yr)', color='white')
ax2.set_title('Mass Balance Along Glacier', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Flow velocity
ax3 = axes[2]
ax3.set_facecolor('#111827')
ax3.plot(distance, velocity, color='#a855f7', linewidth=2)
ax3.fill_between(distance, velocity, alpha=0.15, color='#a855f7')
ax3.set_xlabel('Distance from terminus (km)', color='white')
ax3.set_ylabel('Flow velocity (m/year)', color='white')
ax3.set_title('Ice Flow Velocity', color='white', fontsize=11)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_mass = np.trapz(mass_balance, distance * 1000)
print(f"Net mass balance: {total_mass:.0f} m³ water equiv/m width")
if total_mass < 0:
    print("Glacier is RETREATING (losing more ice than gaining)")
else:
    print("Glacier is ADVANCING (gaining more ice than losing)")
print()
print("Sikkim glacier facts:")
print("  84 glaciers, ~440 km² total area")
print("  Zemu Glacier: 26 km long, largest in eastern Himalayas")
print("  Retreating at ~10-15 m/year due to climate change")`,
      challenge: 'Simulate climate change: raise the equilibrium line by 200 m (from 5200 to 5400 m). How does this change the mass balance? How much more of the glacier is now in the ablation zone?',
      successHint: 'Glaciology is one of the most important fields in climate science. Glacier retreat is a visible, measurable indicator of warming — and it has direct consequences for billions of people who depend on glacier-fed rivers.',
    },
    {
      title: 'Mountain watershed hydrology — from snowflake to river',
      concept: `Every drop of water that falls on a mountain has a journey to make. **Watershed hydrology** traces that journey — from precipitation (snow or rain) through the mountain landscape to rivers, lakes, and eventually the sea.

A **watershed** (or catchment) is the area of land where all water drains to a single outlet. Mountain watersheds have unique characteristics:
- **Snow storage**: winter precipitation is stored as snowpack, released as meltwater in spring/summer
- **Steep gradients**: water moves fast, causing erosion but also generating hydropower potential
- **Shallow soils**: less water infiltration, more surface runoff
- **Glacial contribution**: glaciers provide baseflow during dry seasons

The **hydrograph** of a mountain river shows a distinctive pattern: low flow in winter (water locked as ice), rising flow in spring (snowmelt), peak flow in summer (monsoon + continued melt), and declining flow in autumn.

Sikkim's rivers (Teesta, Rangit) follow this pattern exactly. The Teesta River's flow is 60% glacier/snow melt and 40% monsoon rain — making it extremely vulnerable to both climate change and erratic monsoons.`,
      analogy: 'A mountain watershed is like a bank account. Snow and rain are deposits. Evaporation, plant use, and river outflow are withdrawals. Glaciers are the savings account — built up over centuries, providing steady withdrawals even when deposits (rainfall) are low. Climate change is like the bank slowly liquidating your savings: short-term you feel richer (more meltwater), long-term you go broke.',
      storyConnection: 'The snow leopard\'s territory follows watershed boundaries. Water defines where prey animals can live and graze. Every stream that emerges from a glacier becomes a lifeline that supports the entire food chain below: alpine grasses → bharal → snow leopard. The leopard\'s survival is ultimately tied to the health of the watershed.',
      checkQuestion: 'If a glacier provides 60% of a river\'s dry-season flow and that glacier disappears entirely over 50 years, what happens to the river?',
      checkAnswer: 'In the short term (0-20 years), the river actually gets MORE water as the glacier melts faster. This is called "peak water." After peak water, flow starts declining. Once the glacier is gone, the river loses 60% of its dry-season flow. It becomes a monsoon-only river — flooding in summer, near-dry in winter. Communities downstream must adapt to dramatically different water availability.',
      codeIntro: 'Model a mountain river\'s annual hydrograph showing snowmelt, glacier melt, and rainfall contributions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monthly data for a Sikkim mountain river (Teesta-like)
months = np.arange(1, 13)
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

# Components of river flow (m³/s, simplified)
# Snowmelt: peaks in April-May
snowmelt = 20 * np.exp(-((months - 4.5)**2) / 2)

# Glacier melt: peaks in June-August
glacier_melt = 30 * np.exp(-((months - 7)**2) / 3)

# Monsoon rainfall: peaks July-August
rainfall_runoff = np.array([5, 5, 8, 15, 25, 80, 150, 160, 100, 40, 10, 5])

# Baseflow (groundwater, always present)
baseflow = np.full(12, 10)

total = snowmelt + glacier_melt + rainfall_runoff + baseflow

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Stacked area chart
ax1.set_facecolor('#111827')
ax1.fill_between(months, 0, baseflow, color='#6b7280', alpha=0.7, label='Baseflow')
ax1.fill_between(months, baseflow, baseflow + snowmelt, color='#93c5fd', alpha=0.7, label='Snowmelt')
ax1.fill_between(months, baseflow + snowmelt, baseflow + snowmelt + glacier_melt,
                 color='#60a5fa', alpha=0.7, label='Glacier melt')
ax1.fill_between(months, baseflow + snowmelt + glacier_melt, total,
                 color='#22c55e', alpha=0.7, label='Rainfall runoff')
ax1.plot(months, total, color='white', linewidth=2, label='Total flow')
ax1.set_xticks(months)
ax1.set_xticklabels(month_names)
ax1.set_ylabel('Flow (m³/s)', color='white')
ax1.set_title('Mountain River Annual Hydrograph — Teesta (Sikkim)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Pie chart of annual contributions
ax2.set_facecolor('#111827')
annual = [np.sum(baseflow), np.sum(snowmelt), np.sum(glacier_melt), np.sum(rainfall_runoff)]
labels = ['Baseflow', 'Snowmelt', 'Glacier melt', 'Rainfall']
colors = ['#6b7280', '#93c5fd', '#60a5fa', '#22c55e']
explode = (0, 0, 0.05, 0.05)
wedges, texts, autotexts = ax2.pie(annual, labels=labels, colors=colors, autopct='%1.0f%%',
                                     explode=explode, textprops={'color': 'white', 'fontsize': 10})
for t in autotexts:
    t.set_fontsize(9)
    t.set_color('white')
ax2.set_title('Annual Water Source Contributions', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Teesta River flow breakdown:")
total_annual = sum(annual)
for label, val in zip(labels, annual):
    print(f"  {label}: {val/total_annual*100:.0f}%")
print()
print("Critical insight: glacier + snow = {:.0f}% of total".format(
    (annual[1] + annual[2]) / total_annual * 100))
print("In dry season (Nov-Mar), this rises to >60%")
print("Losing glaciers means losing dry-season water security")`,
      challenge: 'Create a "2070 scenario" where glacier melt is zero and snowmelt is halved. Plot the new hydrograph alongside the current one. What happens to dry-season flow?',
      successHint: 'Watershed hydrology is the foundation of water resource management. Every dam, irrigation system, and hydropower plant is designed around the hydrograph. Understanding it is critical for planning in a changing climate.',
    },
    {
      title: 'Climate change in mountains — warming at the top of the world',
      concept: `Mountains are warming **faster** than lowlands. This phenomenon, called **elevation-dependent warming (EDW)**, means high-altitude regions are experiencing 2-3 times the global average temperature increase. The Himalayas have warmed by about **1.5°C** since 1900 — more than twice the global average.

Why mountains warm faster:
- **Snow-albedo feedback**: as snow and ice melt, dark rock is exposed, which absorbs more sunlight, causing more warming and more melting
- **Cloud changes**: shifts in cloud cover at altitude amplify warming
- **Water vapour**: increased moisture at altitude acts as a greenhouse gas
- **Reduced aerosol cooling**: cleaner mountain air means less particle-based cooling

Consequences:
- Glaciers retreating at 10-70 m/year across the Himalayas
- Treeline moving upward ~5-10 m per decade
- Permafrost thawing, destabilising slopes (more landslides)
- Glacial lake outburst floods (GLOFs) — lakes forming behind unstable moraine dams
- Snow leopard habitat shrinking as alpine zone compresses`,
      analogy: 'Elevation-dependent warming is like a fever that hits your head hardest. If the planet has a 1°C "fever," the mountains experience 2-3°C. The snow-albedo feedback is the reason: removing white, reflective snow is like taking off a white hat in the sun — your head (mountain) absorbs far more heat. And once the hat (snow) starts disappearing, it accelerates its own loss.',
      storyConnection: 'The snow leopard\'s promise to protect the mountain is being tested by climate change. The leopard\'s habitat is being squeezed from below (treeline rising, forests expanding upward) and from above (there is no altitude left above the summit). Climate models predict a 30% reduction in suitable snow leopard habitat by 2070. The "ghost of the mountains" may become an actual ghost.',
      checkQuestion: 'If the treeline moves up 100 m and the snow line moves up 200 m, what happens to the alpine zone (the area between the treeline and the snow line)?',
      checkAnswer: 'The alpine zone shrinks. If the treeline rises faster than the snow line, the alpine zone expands temporarily. But if the snow line rises faster (which is happening in the Himalayas), the alpine zone compresses. Since the alpine zone is where bharal graze and snow leopards hunt, this compression directly reduces the habitat available to both predator and prey.',
      codeIntro: 'Model the snow-albedo feedback and project habitat loss for snow leopards under warming scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Temperature change by altitude (elevation-dependent warming)
altitudes = np.linspace(0, 6000, 300)

# Global warming scenarios (°C above pre-industrial)
scenarios = {
    'Current (+1.2°C)': 1.2,
    'Paris target (+1.5°C)': 1.5,
    'Moderate (+2.5°C)': 2.5,
    'High (+4.0°C)': 4.0,
}

# Elevation amplification factor (increases with altitude)
amplification = 1 + 0.5 * (altitudes / 3000)  # peaks at 2x at 6000m

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left: warming by altitude for each scenario
ax1.set_facecolor('#111827')
colors_scen = ['#22c55e', '#f59e0b', '#f97316', '#ef4444']
for (name, warming), color in zip(scenarios.items(), colors_scen):
    local_warming = warming * amplification
    ax1.plot(local_warming, altitudes / 1000, color=color, linewidth=2, label=name)

ax1.axhspan(3.5, 5.5, alpha=0.1, color='#a855f7')
ax1.annotate('Snow leopard\\\nhabitat', xy=(5, 4.5), color='#a855f7', fontsize=9, fontweight='bold')
ax1.set_xlabel('Local warming (°C)', color='white')
ax1.set_ylabel('Altitude (km)', color='white')
ax1.set_title('Elevation-Dependent Warming', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Right: snow leopard habitat area under each scenario
# Suitable habitat: between treeline and snow line
base_treeline = 3500
base_snowline = 5500
habitat_data = {}

for name, warming in scenarios.items():
    # Treeline rises ~100m per 1°C warming
    treeline = base_treeline + warming * amplification[150] * 100
    # Snow line rises ~150m per 1°C warming
    snowline = base_snowline + warming * amplification[250] * 150
    # Habitat = area between (simplified as altitude range)
    habitat = max(0, snowline - treeline)
    habitat_data[name] = {'treeline': treeline, 'snowline': snowline, 'habitat': habitat}

ax2.set_facecolor('#111827')
names = list(habitat_data.keys())
habitats = [d['habitat'] for d in habitat_data.values()]
baseline_habitat = base_snowline - base_treeline
habitat_pct = [h / baseline_habitat * 100 for h in habitats]

bars = ax2.bar(range(len(names)), habitat_pct, color=colors_scen, alpha=0.8)
ax2.axhline(100, color='gray', linestyle=':', linewidth=1, label='Pre-industrial')
ax2.set_xticks(range(len(names)))
ax2.set_xticklabels([n.split('(')[0].strip() for n in names], color='white', fontsize=8)
ax2.set_ylabel('Habitat remaining (%)', color='white')
ax2.set_title('Snow Leopard Habitat Under Warming Scenarios', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, pct in zip(bars, habitat_pct):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2, f'{pct:.0f}%',
             ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print("Snow leopard habitat projections:")
print(f"  Pre-industrial: {base_treeline}m - {base_snowline}m = {baseline_habitat}m range")
for name, d in habitat_data.items():
    loss = (1 - d['habitat'] / baseline_habitat) * 100
    print(f"  {name}: {d['treeline']:.0f}m - {d['snowline']:.0f}m = {d['habitat']:.0f}m range ({loss:.0f}% loss)")`,
      challenge: 'Add the effect of reduced snow cover: under the +4°C scenario, assume the effective upper boundary drops by an additional 300 m because snow cover becomes patchy. How does this change the habitat estimate?',
      successHint: 'Mountain climate change is not a future problem — it is happening now. Glaciers are retreating, treelines are advancing, and species are shifting ranges. Understanding the physics of elevation-dependent warming is essential for conservation planning.',
    },
    {
      title: 'High-altitude research stations — science at the edge',
      concept: `How do scientists study mountain ecosystems, glaciers, and climate change at 4,000+ metres? Through a network of **high-altitude research stations** — permanent or seasonal facilities where researchers live and work in extreme conditions.

Key research activities:
- **Weather monitoring**: automated weather stations record temperature, wind, humidity, and radiation at altitudes where data is scarce
- **Glacier mass balance**: stakes drilled into ice are measured annually to track thickness changes
- **Biodiversity surveys**: camera traps, DNA sampling, and transect surveys document species
- **Air quality**: high-altitude stations measure "background" atmospheric composition, free from urban pollution
- **Seismology**: monitoring earthquake activity and landslide risk

India's notable stations:
- **NCPOR** operates stations in Ladakh and Sikkim for glacier monitoring
- **Pyramid Lab** (Nepal, 5,050 m) — one of the highest research labs on Earth
- **Changsil** (Uttarakhand, 5,600 m) — India's highest weather station

Challenges: equipment freezes, solar panels get buried in snow, batteries drain fast in cold, researchers need weeks to acclimatise, and evacuation in emergencies is difficult. Most stations now use **automated sensors** that transmit data via satellite.`,
      analogy: 'A high-altitude research station is like a space station on Earth. The environment is hostile — thin air, extreme cold, no nearby supply chain. Equipment must be designed for extreme conditions. Researchers rotate in and out like astronauts. And the data collected is irreplaceable because no other location provides the same vantage point. The mountain summit is as remote as orbit, just vertical instead of horizontal.',
      storyConnection: 'Camera traps at research stations in Sikkim and Ladakh have given us most of what we know about snow leopard populations. Without these stations, the "ghost of the mountains" would truly be a ghost — invisible and unstudied. One camera trap image can confirm a leopard\'s presence in a region, guide conservation policy, and protect thousands of square kilometres of habitat.',
      checkQuestion: 'Why is data from high-altitude weather stations especially valuable for climate science, even though they monitor remote, uninhabited areas?',
      checkAnswer: 'High-altitude stations provide "clean" data unaffected by urban heat islands, pollution, and local land-use changes. They measure the atmosphere closer to its baseline state. They also fill critical gaps in the global observation network — most weather stations are in lowland urban areas. Mountain data is essential for validating climate models, tracking glacier health, and understanding elevation-dependent warming.',
      codeIntro: 'Simulate a research station\'s sensor network: temperature logger, solar panel output, and battery management at 5,000 m.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 30-day simulation at 5,000 m altitude
hours = np.arange(0, 30 * 24)
days = hours / 24

# Temperature: daily cycle + random weather
base_temp = -15  # °C at 5000m in winter
daily_cycle = 10 * np.sin(2 * np.pi * (hours - 6) / 24)  # peaks at noon
weather_noise = 3 * np.cumsum(np.random.randn(len(hours)) * 0.1)
weather_noise -= np.mean(weather_noise)
temp = base_temp + daily_cycle + weather_noise + np.random.randn(len(hours)) * 1.5

# Solar radiation (W/m²): high at altitude but only during day
solar_base = 800  # higher at altitude due to thin air
hour_of_day = hours % 24
solar = np.where((hour_of_day >= 7) & (hour_of_day <= 17),
                 solar_base * np.sin(np.pi * (hour_of_day - 7) / 10), 0)
# Cloud cover reduces solar randomly
cloud_factor = np.random.uniform(0.3, 1.0, len(hours))
solar = solar * cloud_factor

# Battery level (charged by solar, drained by sensors)
battery = np.zeros(len(hours))
battery[0] = 80  # start at 80%
charge_rate = 0.03  # % per W/m² per hour
drain_rate = 0.4  # % per hour (sensors, heaters, comms)

for i in range(1, len(hours)):
    charge = solar[i] * charge_rate
    drain = drain_rate * (1 + 0.01 * max(0, -temp[i]))  # cold drains faster
    battery[i] = np.clip(battery[i-1] + charge - drain, 0, 100)

fig, axes = plt.subplots(3, 1, figsize=(12, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Research Station Sensors — 5,000 m, 30 Days', color='white', fontsize=14)

# Temperature
ax1 = axes[0]
ax1.set_facecolor('#111827')
ax1.plot(days, temp, color='#3b82f6', linewidth=0.8, alpha=0.8)
ax1.axhline(-25, color='#ef4444', linestyle='--', linewidth=1, label='Equipment danger (-25°C)')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('Temperature', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Solar radiation
ax2 = axes[1]
ax2.set_facecolor('#111827')
ax2.fill_between(days, solar, color='#f59e0b', alpha=0.5)
ax2.set_ylabel('Solar (W/m²)', color='white')
ax2.set_title('Solar Radiation', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Battery
ax3 = axes[2]
ax3.set_facecolor('#111827')
ax3.plot(days, battery, color='#22c55e', linewidth=1.5)
ax3.fill_between(days, battery, alpha=0.1, color='#22c55e')
ax3.axhline(20, color='#ef4444', linestyle='--', linewidth=1, label='Critical low (20%)')
ax3.axhline(90, color='#22c55e', linestyle='--', linewidth=1, label='Fully charged (90%)')
ax3.set_ylabel('Battery (%)', color='white')
ax3.set_xlabel('Days', color='white')
ax3.set_title('Battery Level', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')
ax3.set_ylim(0, 100)

plt.tight_layout()
plt.show()

critical_hours = np.sum(battery < 20)
min_temp = np.min(temp)
avg_solar = np.mean(solar[solar > 0])
print(f"30-day station performance:")
print(f"  Min temperature: {min_temp:.1f}°C")
print(f"  Avg daytime solar: {avg_solar:.0f} W/m²")
print(f"  Hours below critical battery: {critical_hours}")
print(f"  Battery reached 0%: {'YES — data loss!' if np.any(battery < 1) else 'No — system survived'}")
print()
print("Real challenges at 5,000 m:")
print("  - Batteries lose 20-40% capacity in extreme cold")
print("  - Solar panels can be buried by snowfall")
print("  - Satellite transmitters need clear sky")
print("  - Equipment failures may take weeks to fix")`,
      challenge: 'Add a wind turbine as a secondary power source. Assume wind power = 0.05% per hour × wind_speed². Generate random wind data (mean 30 km/h, std 15 km/h). Does the turbine prevent the battery from going critical?',
      successHint: 'You have now covered the complete mountain ecosystem from Level 1 physics through Level 2 ecology. Atmospheric pressure, temperature, oxygen, weather, adaptation, glaciers, watersheds, climate change, and the science of studying it all — each connected by the snow leopard\'s story of survival at the top of the world.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Mountain Ecology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[AltitudeProfileDiagram, LinearGraphDiagram, PopulationGrowthCurve, ClimateZonesDiagram, HeatTransferDiagram, CorrelationDiagram][i] ? createElement([AltitudeProfileDiagram, LinearGraphDiagram, PopulationGrowthCurve, ClimateZonesDiagram, HeatTransferDiagram, CorrelationDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
