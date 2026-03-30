import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import ZamzamAquiferDiagram from '../diagrams/ZamzamAquiferDiagram';
import ZamzamPorosityDiagram from '../diagrams/ZamzamPorosityDiagram';
import ZamzamDarcyLawDiagram from '../diagrams/ZamzamDarcyLawDiagram';
import ZamzamWaterCycleDiagram from '../diagrams/ZamzamWaterCycleDiagram';
import WaterCycleDiagram from '../diagrams/WaterCycleDiagram';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';

export default function ZamzamLevel1() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Where does well water come from?',
      concept: `When you dig a well, you are not tapping an underground river (those are rare). You are reaching a layer of rock or sediment whose tiny pores are **completely filled with water**. This water-saturated layer is called an **aquifer**, and the top of the saturated zone is called the **water table**.

Rain falls on the surface, soaks into soil, trickles down through gaps between rock grains, and eventually fills every available pore space below the water table. This process is called **recharge**. It can take days, years, or even thousands of years for water to travel from the surface into a deep aquifer.

In the code below, you will model the water table as a function of rainfall and depth. The key idea: the water table is not flat \u2014 it rises after rain and falls during dry periods.

\uD83D\uDCDA *An aquifer is not a cave full of water. It is solid rock with tiny pores filled with water, like a sponge.*`,
      analogy: 'Think of a kitchen sponge sitting on a plate. Pour water onto the sponge. The water soaks in and fills the holes (pores). If you keep adding water, eventually the bottom half of the sponge is completely saturated \u2014 that is the aquifer. The boundary where dry sponge meets wet sponge is the water table. Squeeze the sponge (pump a well) and water flows out. Stop squeezing and it slowly refills from rain above.',
      storyConnection: 'The Well of Zamzam has provided water in the middle of a desert for thousands of years. How? It taps a deep aquifer beneath Mecca \u2014 water that seeped into rock formations from rainfall in the surrounding Hejaz mountains, potentially thousands of years ago. The well is a window into an underground reservoir.',
      checkQuestion: 'If you dig two wells 100 metres apart, will they have the same water level?',
      checkAnswer: 'Not necessarily. The water table is not perfectly flat \u2014 it roughly follows the surface topography but is smoother. A well on a hilltop will have a deeper water table than a well in a valley. The water table slopes from high ground toward rivers and coasts, driven by gravity. Two wells 100m apart on a slope will have different water levels.',
      codeIntro: 'Model the water table depth based on rainfall over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate 12 months of rainfall (mm/month)
months = np.arange(1, 13)
month_names = ['Jan','Feb','Mar','Apr','May','Jun',
               'Jul','Aug','Sep','Oct','Nov','Dec']
rainfall = np.array([5, 3, 8, 25, 45, 80, 120, 110, 60, 20, 8, 4])

# Water table depth below surface (metres)
# Starts at 15m, rises with rain, falls without
base_depth = 15.0
water_table = np.zeros(12)
depth = base_depth

for i in range(12):
    # Rain recharges aquifer (lowers water table depth)
    recharge = rainfall[i] * 0.01  # 1% of rain reaches aquifer
    # Natural discharge (water flows to rivers/springs)
    discharge = 0.08
    depth = depth - recharge + discharge
    water_table[i] = depth

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6), sharex=True)

ax1.bar(months, rainfall, color='#60a5fa', alpha=0.7)
ax1.set_ylabel('Rainfall (mm)', fontsize=11, color='lightgray')
ax1.set_title('Rainfall and Water Table Depth', fontsize=13, color='white')
ax1.tick_params(colors='lightgray')

ax2.plot(months, water_table, 'o-', color='#10b981', linewidth=2.5)
ax2.invert_yaxis()  # deeper = further down
ax2.set_ylabel('Water table depth (m)', fontsize=11, color='lightgray')
ax2.set_xlabel('Month', fontsize=11, color='lightgray')
ax2.set_xticks(months)
ax2.set_xticklabels(month_names, fontsize=9)
ax2.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

print("Notice: water table rises (shallower) during rainy months")
print("and falls (deeper) during dry months.")
print(f"Shallowest: {min(water_table):.1f}m in the monsoon")
print(f"Deepest: {max(water_table):.1f}m in the dry season")`,
      challenge: 'Change the recharge factor from 0.01 to 0.05 (sandier soil lets more water through). How does the water table respond? Then try 0.001 (clay soil). Which soil type keeps a more stable water table?',
      successHint: 'You just modelled the water cycle underground. The water table is a dynamic surface that responds to rainfall and pumping. Every well on Earth depends on this balance between recharge and discharge.',
    },
    {
      title: 'Porosity and permeability \u2014 can water flow through rock?',
      concept: `Two words that sound similar but mean very different things:

**Porosity** = how much empty space is inside a rock (percentage of total volume that is pore space). Clay has HIGH porosity (40-70%) \u2014 lots of tiny spaces.

**Permeability** = how easily water can FLOW through the rock. Clay has VERY LOW permeability \u2014 the pores are so tiny and disconnected that water gets stuck.

Gravel has lower porosity (25-40%) but HIGH permeability \u2014 the pores are large and connected, so water flows freely.

This distinction is critical for wells. You want to drill into a rock that is both porous (holds water) AND permeable (releases it). Sandstone and gravel are ideal. Clay holds water but will not release it \u2014 you could drill a well into clay and get almost nothing.

In the code, you will calculate how much water different rock types can hold and how fast they release it.`,
      analogy: 'Imagine two rooms. Room A has 1000 tiny locked drawers (clay) \u2014 lots of storage space, but you cannot get anything out quickly. Room B has 50 large open shelves (gravel) \u2014 less total storage, but you can grab things instantly. Porosity is the total storage space; permeability is how fast you can retrieve items.',
      storyConnection: 'Zamzam sits in fractured limestone and alluvial deposits \u2014 rock types with good porosity AND permeability. The fractures in the limestone act like highways for water, allowing the well to produce 11-18.5 litres per second despite being in a desert. Without permeable rock, there would be no well.',
      checkQuestion: 'A farmer drills a well into a thick clay layer and gets almost no water, even though the clay is completely saturated. Why?',
      checkAnswer: 'Clay has high porosity (40-70% pore space) so it holds plenty of water. But its permeability is extremely low \u2014 the pores are microscopic (nanometres) and poorly connected. Water cannot flow through the tiny passages fast enough to supply a well pump. The farmer needs to drill deeper into a sandstone or gravel layer where the pores are large and connected.',
      codeIntro: 'Compare storage capacity and flow rate for different rock types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Rock properties
rocks = {
    "Gravel":    {"porosity": 0.30, "permeability": 1e-1,  "color": "#a16207"},
    "Sand":      {"porosity": 0.35, "permeability": 1e-3,  "color": "#ca8a04"},
    "Sandstone": {"porosity": 0.20, "permeability": 1e-5,  "color": "#d97706"},
    "Limestone": {"porosity": 0.15, "permeability": 1e-6,  "color": "#64748b"},
    "Clay":      {"porosity": 0.50, "permeability": 1e-10, "color": "#78716c"},
}

names = list(rocks.keys())
porosity = [rocks[r]["porosity"] * 100 for r in names]
perm = [rocks[r]["permeability"] for r in names]
colors = [rocks[r]["color"] for r in names]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Porosity bar chart
ax1.barh(names, porosity, color=colors, alpha=0.7)
ax1.set_xlabel('Porosity (%)', fontsize=11, color='lightgray')
ax1.set_title('How Much Water Can It Hold?', fontsize=13, color='white')
ax1.tick_params(colors='lightgray')

# Permeability (log scale!)
ax2.barh(names, perm, color=colors, alpha=0.7)
ax2.set_xscale('log')
ax2.set_xlabel('Permeability (m/s) - LOG SCALE', fontsize=11, color='lightgray')
ax2.set_title('How Fast Does Water Flow?', fontsize=13, color='white')
ax2.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

print("SURPRISE: Clay has the HIGHEST porosity (most storage)")
print("but the LOWEST permeability (water cannot flow through)")
print()
print("Gravel: best for wells (large connected pores)")
print("Clay: worst for wells (tiny disconnected pores)")
print()
print("Zamzam's aquifer = fractured limestone + alluvial gravel")
print("= good storage AND good flow")`,
      challenge: 'Add "Fractured Rock" with porosity 0.05 and permeability 1e-2. Even though it has very low porosity, its permeability is high. Why? (Fractures act as open highways for water, even in rock with almost no pore space.)',
      successHint: 'The porosity-permeability distinction is one of the most important concepts in hydrogeology. A geologist searching for water needs both: storage (porosity) AND the ability to extract it (permeability).',
    },
    {
      title: 'Darcy\u2019s law \u2014 the equation for groundwater flow',
      concept: `In 1856, a French engineer named Henry Darcy ran a simple experiment: he pushed water through a column of sand and measured how fast it flowed. He discovered that the flow rate depends on three things:

**Q = K \u00D7 A \u00D7 (\u0394h / L)**

Where:
- **Q** = flow rate (m\u00B3/s) \u2014 how much water per second
- **K** = hydraulic conductivity (m/s) \u2014 how easily water moves through the material
- **A** = cross-sectional area (m\u00B2) \u2014 how wide the flow path is
- **\u0394h** = head difference (m) \u2014 the height difference driving the flow
- **L** = length of flow path (m)

The ratio \u0394h/L is called the **hydraulic gradient** \u2014 steeper gradient means faster flow. Think of it like a hill: a steeper slope makes a ball roll faster.

This single equation governs almost all groundwater flow on Earth. In the code, you will use it to predict how much water a well can pump.`,
      analogy: 'Imagine water flowing down a tilted pipe filled with marbles. The tilt (\u0394h/L) is the driving force \u2014 more tilt, faster flow. The size of gaps between marbles (K) determines resistance \u2014 big gaps (gravel) allow fast flow, tiny gaps (clay) resist. The pipe width (A) determines total volume. Darcy\u2019s law is just: flow = driving force \u00D7 ease \u00D7 width.',
      storyConnection: 'The Zamzam well produces 11-18.5 litres per second. Using Darcy\u2019s law, hydrogeologists calculated that its aquifer has an unusually high hydraulic conductivity for the region, likely due to fractured limestone beneath the Haram. The law explains both why the well has never run dry and how fast it can replenish.',
      checkQuestion: 'If you double the head difference (\u0394h), what happens to the flow rate?',
      checkAnswer: 'The flow rate doubles. Darcy\u2019s law is linear \u2014 Q is directly proportional to \u0394h/L. Doubling the driving force doubles the flow. This is why wells at the bottom of hills often produce more water: the head difference between the recharge area (hilltop) and the well is greater.',
      codeIntro: 'Calculate groundwater flow rates using Darcy\u2019s law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Darcy's Law: Q = K * A * (delta_h / L)

# Scenario: well near a hill
K = 1e-4        # hydraulic conductivity (m/s) - sandy aquifer
A = 50.0        # cross-section area (m^2)
L = 500.0       # distance from recharge to well (m)

# Vary the head difference
delta_h = np.linspace(0, 50, 100)  # metres
Q = K * A * (delta_h / L)          # m^3/s
Q_litres = Q * 1000                # litres/s

plt.figure(figsize=(10, 5))
plt.plot(delta_h, Q_litres, linewidth=2.5, color='#3b82f6')
plt.fill_between(delta_h, Q_litres, alpha=0.1, color='#3b82f6')

# Mark Zamzam's approximate output
plt.axhline(y=15, color='#f59e0b', linewidth=1.5, linestyle='--',
            label='Zamzam output (~15 L/s)')
plt.annotate('Zamzam: ~15 L/s', xy=(35, 15), fontsize=10,
             color='#f59e0b')

plt.xlabel('Head difference (m)', fontsize=12, color='lightgray')
plt.ylabel('Flow rate (litres/s)', fontsize=12, color='lightgray')
plt.title("Darcy's Law: Flow Rate vs Head Difference", fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.show()

print("Darcy's Law: Q = K * A * (delta_h / L)")
print(f"K = {K} m/s (sandy aquifer)")
print(f"A = {A} m^2")
print(f"L = {L} m")
print()
print("The flow rate is LINEAR with head difference.")
print("Double the head = double the flow.")
print()
# Calculate what K Zamzam needs
Q_zamzam = 0.015  # 15 L/s = 0.015 m^3/s
K_zamzam = Q_zamzam / (A * (30 / L))
print(f"For Zamzam to produce 15 L/s with 30m head:")
print(f"K needed = {K_zamzam:.2e} m/s")
print("That's fractured limestone - highly permeable!")`,
      challenge: 'Try changing K to 1e-6 (clay). What happens to the flow rate? Now try K = 1e-2 (gravel). Plot all three K values on the same chart to see how material type dominates flow rate.',
      successHint: 'Darcy\u2019s law is the foundation of hydrogeology. With just four measurements (K, A, \u0394h, L), you can predict how much water any aquifer will yield. Every water well on Earth obeys this equation.',
    },
    {
      title: 'Water quality \u2014 what dissolves in groundwater?',
      concept: `Groundwater is not pure H\u2082O. As it trickles through rock, it dissolves minerals. Limestone (CaCO\u2083) dissolves to give calcium and carbonate ions \u2014 this is what makes water "hard." Sandstone gives silica. Volcanic rock gives sodium, potassium, and sulfate.

The mineral content of groundwater tells a geologist exactly what rock the water has passed through. It is like a chemical fingerprint of the aquifer.

Zamzam water has been extensively analysed. Its mineral profile includes:
- **Calcium**: 96 mg/L (from limestone dissolution)
- **Sodium**: 133 mg/L (from salt-bearing formations)
- **Magnesium**: 38.9 mg/L (from dolomite rock)
- **Total Dissolved Solids**: 1000 mg/L

In the code, you will compare Zamzam\u2019s mineral content with other famous water sources and see how geology shapes water chemistry.`,
      analogy: 'Imagine pouring water over a chocolate bar versus a glass marble. The chocolate dissolves into the water, changing its taste and colour. The marble does not. Groundwater passing through limestone is like water flowing over chocolate \u2014 it picks up dissolved minerals. The longer the contact time and the more soluble the rock, the more "flavour" the water acquires.',
      storyConnection: 'Pilgrims have noted Zamzam\u2019s distinctive taste for centuries. That taste comes from its specific mineral profile, which in turn comes from the specific rock formations it passes through \u2014 Cretaceous limestone, alluvial sediments, and Precambrian basement rock beneath Mecca. The geology of the Hejaz region is written in every sip.',
      checkQuestion: 'If two wells are 1 km apart but tap different rock layers, will their water taste the same?',
      checkAnswer: 'Almost certainly not. If one well taps limestone and the other taps sandstone, their mineral profiles will be completely different. The limestone well will have high calcium and carbonate. The sandstone well will have high silica. Water chemistry is a direct reflection of aquifer geology. This is why bottled water brands taste different \u2014 each comes from a different geological setting.',
      codeIntro: 'Compare mineral content of Zamzam with other water sources.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Mineral content in mg/L for famous water sources
waters = {
    "Zamzam": {"Ca": 96, "Na": 133, "Mg": 38.9, "K": 43.3, "TDS": 1000},
    "Evian":  {"Ca": 80, "Na": 6.5, "Mg": 26, "K": 1, "TDS": 309},
    "Fiji":   {"Ca": 18, "Na": 18, "Mg": 15, "K": 5, "TDS": 222},
    "Tap (avg)": {"Ca": 30, "Na": 20, "Mg": 10, "K": 2, "TDS": 200},
}

minerals = ["Ca", "Na", "Mg", "K"]
x = np.arange(len(minerals))
width = 0.2
colors = ['#f59e0b', '#60a5fa', '#10b981', '#94a3b8']

plt.figure(figsize=(10, 5))
for i, (name, data) in enumerate(waters.items()):
    values = [data[m] for m in minerals]
    plt.bar(x + i * width, values, width, label=name, color=colors[i], alpha=0.8)

plt.xlabel('Mineral', fontsize=12, color='lightgray')
plt.ylabel('Concentration (mg/L)', fontsize=12, color='lightgray')
plt.title('Mineral Fingerprint: Zamzam vs Other Waters', fontsize=14, color='white')
plt.xticks(x + 1.5 * width, ['Calcium', 'Sodium', 'Magnesium', 'Potassium'],
           fontsize=11, color='lightgray')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2, axis='y')
plt.tick_params(colors='lightgray')
plt.show()

print("Zamzam has the HIGHEST mineral content of any major water source")
print("  - High calcium: long contact with limestone (CaCO3)")
print("  - High sodium: contact with salt-bearing formations")
print("  - High potassium: unusual - suggests volcanic rock contact")
print()
for name, data in waters.items():
    print(f"  {name:10s}: TDS = {data['TDS']} mg/L")
print()
print("Higher TDS = more dissolved minerals = stronger taste")
print("Zamzam's unique taste IS its geological fingerprint")`,
      challenge: 'Add "Distilled" water (all minerals = 0, TDS = 0) and "Sea Water" (Na = 10,800, Ca = 412, Mg = 1,290, K = 380, TDS = 35,000). You will need to adjust the y-axis scale. How does Zamzam compare to seawater?',
      successHint: 'Every water source has a unique mineral fingerprint determined by its geology. Hydrogeochemistry \u2014 the study of water chemistry \u2014 lets scientists trace where water came from, how old it is, and what rocks it passed through.',
    },
    {
      title: 'Water pressure and depth \u2014 why deep wells flow',
      concept: `Water pressure increases with depth. At the surface, pressure equals atmospheric pressure (about 101 kPa). For every metre of water depth, pressure increases by about **9.81 kPa** (the density of water \u00D7 gravity).

This is why deep aquifers are under pressure. If you drill into a **confined aquifer** (one trapped between two impermeable layers), the water is under so much pressure that it may rise in the well above the aquifer level. If the pressure is high enough, water shoots out of the ground without pumping \u2014 this is called an **artesian well**.

The formula is: **P = \u03C1gh**
- P = pressure (Pa)
- \u03C1 = water density (1000 kg/m\u00B3)
- g = gravity (9.81 m/s\u00B2)
- h = depth (m)

In the code, you will calculate pressure at different depths and determine whether a well would be artesian.`,
      analogy: 'Imagine stacking books on your hand. Each book adds weight. At the bottom of the stack, your hand feels a lot of pressure. Water works the same way: each metre of water above you adds 9.81 kPa of pressure. At 100 metres depth, there is nearly 10 atmospheres of pressure \u2014 enough to push water up through a narrow pipe all by itself.',
      storyConnection: 'Zamzam is traditionally described as "springing forth" when first discovered \u2014 water rising from the ground. This is consistent with artesian conditions: a confined aquifer under enough pressure to push water to the surface. The geological setting (a valley between hills with impermeable clay layers) is exactly the geometry that creates artesian flow.',
      checkQuestion: 'A well is drilled to 200m into a confined aquifer. The water rises to 5m below the surface. Is this an artesian well?',
      checkAnswer: 'Almost. A "flowing artesian" well is one where water rises ABOVE the surface and flows without pumping. This well\u2019s water rises to 5m below the surface \u2014 it is an artesian well (water rises above the aquifer level) but not a "flowing" one. You still need a small pump to lift the last 5 metres. If the well were in a lower area (a valley), the same aquifer pressure might push water above the surface.',
      codeIntro: 'Calculate water pressure at different depths and model artesian flow.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# P = rho * g * h
rho = 1000    # water density (kg/m^3)
g = 9.81      # gravity (m/s^2)

depths = np.linspace(0, 200, 100)  # metres
pressure = rho * g * depths        # Pascals
pressure_atm = pressure / 101325   # convert to atmospheres

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Pressure vs depth
ax1.plot(pressure_atm, depths, linewidth=2.5, color='#3b82f6')
ax1.invert_yaxis()
ax1.set_xlabel('Pressure (atmospheres)', fontsize=11, color='lightgray')
ax1.set_ylabel('Depth (metres)', fontsize=11, color='lightgray')
ax1.set_title('Water Pressure Increases with Depth', fontsize=13, color='white')
ax1.axhline(y=30, color='#f59e0b', linestyle='--', label='Zamzam depth (~30m)')
ax1.legend(fontsize=9, labelcolor='lightgray')
ax1.grid(alpha=0.2)
ax1.tick_params(colors='lightgray')

# Artesian well simulation
# Confined aquifer at 100m depth
# Recharge elevation at 150m above well
recharge_h = 150  # metres above the well
aquifer_depth = 100
potentiometric_surface = recharge_h - aquifer_depth  # how high water rises

well_depths = np.array([50, 80, 100, 120, 150])
water_rise = np.minimum(recharge_h - well_depths, well_depths)
artesian = water_rise > well_depths  # does it overflow?

ax2.barh(range(len(well_depths)), water_rise,
         color=['#10b981' if a else '#60a5fa' for a in artesian], alpha=0.7)
ax2.set_yticks(range(len(well_depths)))
ax2.set_yticklabels([f'{d}m deep' for d in well_depths], color='lightgray')
ax2.set_xlabel('Water rise (metres above aquifer)', fontsize=11, color='lightgray')
ax2.set_title('Does the Well Flow? (Recharge at 150m)', fontsize=13, color='white')
ax2.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

print(f"At 30m depth: pressure = {rho*g*30/101325:.1f} atm")
print(f"At 100m depth: pressure = {rho*g*100/101325:.1f} atm")
print(f"At 200m depth: pressure = {rho*g*200/101325:.1f} atm")
print()
print("An artesian well flows when the recharge area")
print("is higher than the wellhead — pressure pushes water up!")`,
      challenge: 'Model a well at sea level that taps an aquifer recharged from mountains 500m above. How high does the water rise? In practice, friction losses reduce the rise. Add a friction factor that reduces the effective head by 30%. Does it still flow?',
      successHint: 'Water pressure is what makes wells work. Understanding P = \u03C1gh lets you predict whether a well will flow, how much pumping it needs, and how deep you need to drill. Artesian wells are nature\u2019s free pumps, powered by gravity and geology.',
    },
    {
      title: 'Sustainable pumping \u2014 when wells run dry',
      concept: `A well can only produce water as fast as the aquifer can supply it. If you pump faster than the aquifer recharges, the water table drops. This creates a **cone of depression** \u2014 a funnel-shaped dip in the water table centred on the well.

Pump even faster or for longer, and the cone deepens until the well runs dry. Worse, if many wells are pumping from the same aquifer, their cones of depression overlap, and the entire regional water table drops.

The rule for sustainability: **pumping rate must not exceed recharge rate**. In arid regions like Mecca, recharge is very low (maybe 20mm/year), so groundwater is a finite resource that took thousands of years to accumulate.

In the code, you will simulate what happens when you pump at different rates and see how the water table responds over decades.`,
      analogy: 'Imagine a bathtub with the tap running slowly (recharge) and you pulling the plug halfway (pumping). If the drain is small, the tub stays full. If you open the drain wider than the tap flow, the tub empties. Groundwater is the tub, rain is the tap, and your well is the drain. Pump faster than it rains, and the tub eventually runs dry.',
      storyConnection: 'The Saudi Geological Survey carefully manages Zamzam\u2019s pumping rate to ensure sustainability. During Hajj, when millions of pilgrims draw water, the well is pumped at 18.5 L/s for short periods, then allowed to recover. The management strategy is based on the same equations you are coding: balance pumping with recharge to ensure the well never runs dry.',
      checkQuestion: 'In the last 50 years, many wells in northern India have dried up. What went wrong?',
      checkAnswer: 'Over-pumping. India\u2019s Green Revolution (1960s onward) encouraged farmers to drill millions of tube wells for irrigation. Each well pumps more water than monsoon rain can recharge. The water tables in Punjab, Haryana, and Rajasthan have dropped by 10-50 metres. Some aquifers that took 10,000 years to fill are being emptied in decades. This is the world\u2019s largest groundwater crisis, affecting 600 million people.',
      codeIntro: 'Simulate long-term water table response to different pumping rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate 50 years of pumping
years = np.arange(0, 51)
recharge_rate = 20  # mm/year reaching aquifer

# Three pumping scenarios
scenarios = [
    ("Sustainable (= recharge)", 20, '#10b981'),
    ("Moderate over-pumping (2x)", 40, '#f59e0b'),
    ("Heavy over-pumping (5x)", 100, '#ef4444'),
]

plt.figure(figsize=(10, 5))
for name, pump_rate, color in scenarios:
    water_level = np.zeros(51)
    level = 0  # start at equilibrium
    for y in range(1, 51):
        net_change = recharge_rate - pump_rate  # mm/year
        level += net_change / 1000  # convert to metres
        water_level[y] = level

    plt.plot(years, water_level, linewidth=2.5, color=color, label=name)

plt.axhline(y=0, color='white', linewidth=0.5, alpha=0.3)
plt.xlabel('Years', fontsize=12, color='lightgray')
plt.ylabel('Water table change (metres)', fontsize=12, color='lightgray')
plt.title('What Happens When You Over-Pump?', fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.show()

print("Sustainable pumping: water table stays stable")
print("2x over-pumping: drops 1m per year = 50m in 50 years")
print("5x over-pumping: drops 4m per year = 200m in 50 years!")
print()
print("Zamzam's management strategy:")
print("  - Pump at 18.5 L/s during peak (Hajj)")
print("  - Reduce to 11 L/s off-peak")
print("  - Monitor water level continuously")
print("  - Allow recovery between pumping cycles")
print()
print("Result: Zamzam has flowed for ~4000 years and counting")`,
      challenge: 'Add a fourth scenario: "Smart pumping" that pumps 40 mm/year for 6 months then 0 for 6 months (seasonal cycling). Does the water table stabilise? This simulates real-world managed aquifer recharge.',
      successHint: 'Groundwater is renewable but not unlimited. The difference between a well that lasts millennia (Zamzam) and one that runs dry in decades comes down to one question: are you pumping faster than nature recharges? Every water management plan on Earth starts with this equation.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for hydrology simulations. Click to start.</p>
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
            diagram={[ZamzamAquiferDiagram, ZamzamPorosityDiagram, ZamzamDarcyLawDiagram, ZamzamWaterCycleDiagram, PressureDepthDiagram, WaterCycleDiagram][i] ? createElement([ZamzamAquiferDiagram, ZamzamPorosityDiagram, ZamzamDarcyLawDiagram, ZamzamWaterCycleDiagram, PressureDepthDiagram, WaterCycleDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
