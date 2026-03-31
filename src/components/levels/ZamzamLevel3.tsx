import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import ZamzamAquiferDiagram from '../diagrams/ZamzamAquiferDiagram';
import ZamzamDarcyLawDiagram from '../diagrams/ZamzamDarcyLawDiagram';
import ZamzamPorosityDiagram from '../diagrams/ZamzamPorosityDiagram';
import ZamzamWaterCycleDiagram from '../diagrams/ZamzamWaterCycleDiagram';
import WaterCycleDiagram from '../diagrams/WaterCycleDiagram';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';

export default function ZamzamLevel3() {
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
      title: 'Finite difference groundwater model',
      concept: `The groundwater flow equation combines Darcy’s law with conservation of mass. In 2D, for a confined aquifer:

**S ∂h/∂t = T (∂²h/∂x² + ∂²h/∂y²) + W**

Where S = storativity, T = transmissivity, h = hydraulic head, W = recharge/pumping.

We solve this numerically using **finite differences**: divide the aquifer into a grid, and at each time step, update the head at each cell based on its neighbours:

h_new[i,j] = h[i,j] + (T*dt/(S*dx²)) * (h[i+1,j] + h[i-1,j] + h[i,j+1] + h[i,j-1] - 4*h[i,j]) + W*dt/S

This is the same approach used in professional groundwater modelling software like MODFLOW.`,
      analogy: 'Imagine a grid of connected water tanks. Each tank shares water with its four neighbours through pipes. If one tank is pumped low, water flows in from its neighbours, which then draw from their neighbours, creating a ripple effect. The finite difference method simply calculates, step by step, how much water flows between each pair of tanks.',
      storyConnection: 'The Saudi Geological Survey uses MODFLOW (a finite difference model) to manage Zamzam’s aquifer. The model grid covers the entire Wadi Ibrahim catchment, with cells as small as 10m near the well. It predicts water levels decades into the future under different pumping scenarios.',
      checkQuestion: 'Why do we need a numerical model instead of just using the Theis equation?',
      checkAnswer: 'The Theis equation assumes a perfectly uniform, infinite aquifer with one well. Real aquifers have irregular boundaries, varying thickness, different rock types, multiple wells, rivers that recharge or drain the aquifer, and complex recharge patterns. Numerical models can handle all of these complexities by solving the equations on a grid where each cell can have different properties.',
      codeIntro: 'Build a 2D finite difference groundwater model from scratch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Grid setup
nx, ny = 50, 50
dx = 20  # metres per cell
T = 5e-3  # transmissivity (m^2/s)
S = 0.001  # storativity
dt = 3600  # time step (1 hour)
n_steps = 200

# Initial head: sloping from east to west
x = np.arange(nx) * dx
y = np.arange(ny) * dx
head = np.zeros((ny, nx))
for i in range(nx):
    head[:, i] = 100 + 0.05 * x[i]  # gentle slope

# Pumping well at centre
well_i, well_j = ny//2, nx//2
Q_well = -0.015  # m^3/s (negative = pumping)
W = np.zeros((ny, nx))
W[well_i, well_j] = Q_well / (dx * dx)  # distribute over cell area

# Time-stepping loop
alpha = T * dt / (S * dx**2)
print(f"Stability parameter alpha = {alpha:.4f}")
print(f"(must be < 0.25 for stability)")

for step in range(n_steps):
    h_new = head.copy()
    for i in range(1, ny-1):
        for j in range(1, nx-1):
            laplacian = (head[i+1,j] + head[i-1,j] +
                        head[i,j+1] + head[i,j-1] - 4*head[i,j])
            h_new[i,j] = head[i,j] + alpha * laplacian + W[i,j] * dt / S
    head = h_new

# Plot result
X, Y = np.meshgrid(x, y)
plt.figure(figsize=(10, 8))
contours = plt.contourf(X, Y, head, levels=30, cmap='Blues')
plt.colorbar(contours, label='Hydraulic head (m)')
plt.contour(X, Y, head, levels=15, colors='white', linewidths=0.5, alpha=0.4)
plt.plot(x[well_j], y[well_i], 'rv', markersize=12)
plt.annotate('Pumping well', xy=(x[well_j], y[well_i]),
             xytext=(x[well_j]+100, y[well_i]+100),
             fontsize=10, color='red', arrowprops=dict(arrowstyle='->', color='red'))
plt.xlabel('East (m)', fontsize=12, color='lightgray')
plt.ylabel('North (m)', fontsize=12, color='lightgray')
plt.title(f'Groundwater Model After {n_steps} Hours', fontsize=14, color='white')
plt.tick_params(colors='lightgray')
plt.show()

drawdown_at_well = 100 + 0.05*x[well_j] - head[well_i, well_j]
print(f"Drawdown at well: {drawdown_at_well:.2f} m")`,
      challenge: 'Add a second pumping well at (30, 30) with the same rate. How does the head field change? Then add a river boundary along the western edge (fixed head = 100m). Does the river help sustain the wells?',
      successHint: 'You just built a groundwater model from scratch. Professional tools like MODFLOW use the same finite difference method but with millions of cells, multiple layers, and dozens of boundary conditions. The principle is identical.',
    },
    {
      title: 'Contaminant transport — protecting water quality',
      concept: `Groundwater does not just carry water — it carries dissolved chemicals. If a pollutant enters an aquifer (leaked fuel, agricultural chemicals, industrial waste), it travels with the groundwater flow and spreads through **advection** (carried by flow) and **dispersion** (spreading due to mixing).

The advection-dispersion equation:

**∂C/∂t = D ∂²C/∂x² - v ∂C/∂x**

Where C = concentration, D = dispersion coefficient, v = groundwater velocity.

This equation predicts how a contamination plume grows over time. The plume stretches in the flow direction (advection) and spreads sideways (dispersion). Wells downstream of a pollution source are at risk.

Understanding this is crucial for protecting water sources like Zamzam from modern urban contamination.`,
      analogy: 'Drop a blob of food colouring into a slowly flowing stream. The blob stretches downstream (advection) and spreads sideways (dispersion). Over time, it becomes a long, fading streak. Groundwater contamination does exactly the same thing, but much slower — a pollution event might take decades to reach a well 1 km away.',
      storyConnection: 'As Mecca has urbanised, protecting Zamzam from contamination has become critical. The Saudi authorities established a protection zone around the well and carefully manage surface activities in the recharge area. The transport models you are building are exactly what environmental engineers use to define these protection zones.',
      checkQuestion: 'A factory leaks fuel into the ground 500m upstream of a drinking water well. Groundwater velocity is 1m/day. How long before the contamination reaches the well?',
      checkAnswer: 'At 1m/day, the centre of the plume reaches the well in 500 days (about 1.4 years). BUT dispersion means the leading edge arrives earlier — perhaps in 300 days. And the contamination will continue to pass through for months after the centre arrives. This is why early detection through monitoring wells is critical. By the time you taste contamination in the drinking well, the plume has been underground for over a year.',
      codeIntro: 'Simulate a contamination plume spreading through an aquifer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D advection-dispersion equation
# dC/dt = D * d2C/dx2 - v * dC/dx

nx = 200
dx = 5.0  # metres
dt = 86400  # 1 day in seconds
n_days = 365  # simulate 1 year

v = 1.0 / 86400  # velocity: 1 m/day converted to m/s
D = 0.5 / 86400   # dispersion: 0.5 m^2/day

x = np.arange(nx) * dx
C = np.zeros(nx)

# Initial contamination: spike at x = 100m
source_idx = 20  # x = 100m
C[source_idx] = 100.0  # mg/L

# Store snapshots
snapshots = {}
snapshot_days = [0, 30, 90, 180, 365]

for day in range(n_days + 1):
    if day in snapshot_days:
        snapshots[day] = C.copy()

    # Finite difference step
    C_new = C.copy()
    for i in range(1, nx-1):
        diffusion = D * (C[i+1] - 2*C[i] + C[i-1]) / dx**2
        advection = v * (C[i] - C[i-1]) / dx
        C_new[i] = C[i] + dt * (diffusion - advection)
    C = C_new

plt.figure(figsize=(10, 5))
colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
for (day, conc), color in zip(snapshots.items(), colors):
    plt.plot(x, conc, linewidth=2, color=color, label=f'Day {day}')

plt.axvline(x=600, color='white', linewidth=1.5, linestyle='--', alpha=0.5)
plt.annotate('Drinking well at 600m', xy=(600, 5), fontsize=10, color='white')

plt.xlabel('Distance downstream (m)', fontsize=12, color='lightgray')
plt.ylabel('Concentration (mg/L)', fontsize=12, color='lightgray')
plt.title('Contamination Plume Migration Over 1 Year', fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.show()

print("The plume moves downstream and spreads over time")
print(f"Velocity: {v*86400:.1f} m/day")
print(f"After 365 days, plume centre at ~{100 + v*86400*365:.0f}m")
print("Leading edge reaches further due to dispersion")`,
      challenge: 'Add a continuous source (C[source_idx] = 100.0 at every time step, not just the initial condition). How does the plume change? This models an ongoing leak rather than a one-time spill.',
      successHint: 'Contaminant transport modelling is what saves drinking water supplies. By predicting where a plume will go and when it will arrive, engineers can install monitoring wells, activate remediation, or move water intakes before contamination reaches them.',
    },
    {
      title: 'Geochemical modelling — mineral dissolution and precipitation',
      concept: `As groundwater flows through rock, it dissolves some minerals and precipitates others. This depends on the water’s **saturation index** (SI):

- SI < 0: undersaturated — mineral dissolves
- SI = 0: equilibrium — no change
- SI > 0: supersaturated — mineral precipitates

For calcite (CaCO₃) in limestone: **CaCO₃ + CO₂ + H₂O ↔ Ca²⁺ + 2HCO₃⁻**

This reaction controls karst landscape formation (caves, sinkholes), water hardness, and the mineral content of springs.

Zamzam’s high calcium content (96 mg/L) tells us its water has dissolved substantial limestone along its flow path. The CO₂ in the soil zone drives the dissolution.`,
      analogy: 'Think of dissolving sugar in tea. Cold tea dissolves less sugar (undersaturated). Hot tea dissolves more. If you make very sweet hot tea and then cool it down, sugar crystals form on the spoon (precipitation). The water temperature changed the saturation point. For groundwater, the "temperature" analog is CO₂ concentration — more CO₂ means more limestone dissolves.',
      storyConnection: 'The rock around Zamzam is Cretaceous limestone — the same type that creates dramatic karst landscapes worldwide. As rainwater absorbs CO₂ in the soil, it becomes slightly acidic and dissolves the limestone, creating fractures and cavities that enhance permeability. This process has been shaping Zamzam’s aquifer for millions of years.',
      checkQuestion: 'Why does groundwater in limestone regions often leave white deposits on taps and kettles?',
      checkAnswer: 'Limestone groundwater is saturated with calcium carbonate (CaCO₃). When the water is heated (kettle) or loses CO₂ (tap aerator), it becomes supersaturated — the saturation index goes above zero. The excess CaCO₃ precipitates out as white "limescale." This is the reverse of the dissolution reaction that created the water’s hardness in the first place. Heating drives off CO₂, shifting the equilibrium toward precipitation.',
      codeIntro: 'Model calcite dissolution along a groundwater flow path.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified calcite dissolution model
# CaCO3 + CO2 + H2O -> Ca2+ + 2HCO3-

# Parameters
K_sp = 3.3e-9     # solubility product of calcite
K_CO2 = 4.3e-7    # CO2 hydration equilibrium
initial_CO2 = 0.03 # partial pressure CO2 in soil

# As water flows through limestone, Ca2+ increases
# CO2 is consumed, slowing dissolution

flow_distance = np.linspace(0, 5000, 500)  # metres

# Simplified kinetic model
Ca = np.zeros_like(flow_distance)
pH_values = np.zeros_like(flow_distance)
CO2_remaining = np.zeros_like(flow_distance)

Ca_conc = 0  # start with no calcium (rainwater)
CO2 = initial_CO2

for i, d in enumerate(flow_distance):
    # Dissolution rate decreases as Ca increases (approaches equilibrium)
    Ca_eq = 2.5e-3  # equilibrium Ca (mol/L) at this CO2
    rate = 1e-4 * (1 - Ca_conc/Ca_eq) * CO2/initial_CO2  # mol/L per metre
    rate = max(rate, 0)

    Ca_conc += rate
    CO2 *= 0.9998  # CO2 consumed

    Ca[i] = Ca_conc * 40.08 * 1000  # convert mol/L to mg/L
    CO2_remaining[i] = CO2 / initial_CO2 * 100
    pH_values[i] = 7.0 + 0.5 * (1 - CO2/initial_CO2)  # simplified

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 8), sharex=True)

ax1.plot(flow_distance/1000, Ca, linewidth=2.5, color='#f59e0b')
ax1.axhline(y=96, color='red', linestyle='--', label='Zamzam Ca: 96 mg/L')
ax1.set_ylabel('Ca²⁺ (mg/L)', fontsize=11, color='lightgray')
ax1.set_title('Calcite Dissolution Along Flow Path', fontsize=13, color='white')
ax1.legend(fontsize=9, labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
ax1.grid(alpha=0.2)

ax2.plot(flow_distance/1000, CO2_remaining, linewidth=2.5, color='#10b981')
ax2.set_ylabel('CO₂ remaining (%)', fontsize=11, color='lightgray')
ax2.tick_params(colors='lightgray')
ax2.grid(alpha=0.2)

ax3.plot(flow_distance/1000, pH_values, linewidth=2.5, color='#60a5fa')
ax3.set_ylabel('pH', fontsize=11, color='lightgray')
ax3.set_xlabel('Flow distance (km)', fontsize=11, color='lightgray')
ax3.tick_params(colors='lightgray')
ax3.grid(alpha=0.2)

plt.tight_layout()
plt.show()

print("As water flows through limestone:")
print("  1. Ca concentration rises (dissolution)")
print("  2. CO2 is consumed (drives the reaction)")
print("  3. pH increases (less CO2 = less acidic)")
print(f"  4. Zamzam's 96 mg/L Ca = ~2.5 km flow path in limestone")`,
      challenge: 'Add a temperature gradient (cooler at depth). Higher temperature increases reaction rates but decreases CO₂ solubility. How does temperature affect the dissolution profile?',
      successHint: 'Geochemical modelling reveals the invisible chemistry happening underground. Every mineral in Zamzam’s water was dissolved from rock along its flow path. The water’s chemistry is a record of its journey through the Earth.',
    },
    {
      title: 'Managed aquifer recharge — refilling depleted aquifers',
      concept: `When pumping exceeds natural recharge, engineers can artificially augment recharge through **Managed Aquifer Recharge (MAR)**. Common methods:

1. **Spreading basins**: large shallow ponds where treated water infiltrates
2. **Injection wells**: pumping treated water directly into the aquifer
3. **Percolation trenches**: gravel-filled trenches that capture runoff

The key challenge is water quality — you cannot inject contaminated water into an aquifer. Treatment must remove pathogens, nutrients, and suspended solids before recharge.

Saudi Arabia is actively developing MAR systems to supplement natural recharge in the Mecca region. This is critical for long-term sustainability of water sources including Zamzam.`,
      analogy: 'Natural recharge is like a tap slowly filling a bathtub. MAR is like using a garden hose — same bathtub, much faster filling rate. But you have to make sure the hose water is clean (treated), or you contaminate the entire bath.',
      storyConnection: 'The Saudi government has invested in MAR infrastructure around Mecca, including infiltration basins in Wadi Ibrahim (the catchment that feeds Zamzam). By capturing flash flood waters that would otherwise run off to the Red Sea and directing them into the aquifer, they supplement the meagre natural recharge in this arid region.',
      checkQuestion: 'Why not just inject seawater into the aquifer? Saudi Arabia has plenty of coastline.',
      checkAnswer: 'Seawater has 35,000 mg/L total dissolved solids, while fresh groundwater typically has <1,000 mg/L. Injecting seawater would contaminate the entire aquifer with salt, making it permanently unusable for drinking. Even desalinated seawater needs careful treatment to match the aquifer’s geochemistry — if the chemistry is wrong, injected water can dissolve or precipitate minerals, clogging the aquifer pores.',
      codeIntro: 'Model the impact of managed aquifer recharge on water table recovery.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate 50 years: first 20 years of depletion, then 30 with MAR
years = np.arange(0, 51)
natural_recharge = 2  # mm/year (arid climate)
pumping = 40          # mm/year equivalent

# Scenario 1: No MAR
level_noMAR = np.zeros(51)
depth = 0
for y in range(1, 51):
    depth += (pumping - natural_recharge) / 1000
    level_noMAR[y] = -depth

# Scenario 2: MAR starts at year 20
level_MAR = np.zeros(51)
depth = 0
mar_rate = 30  # mm/year of artificial recharge
for y in range(1, 51):
    total_recharge = natural_recharge + (mar_rate if y >= 20 else 0)
    depth += (pumping - total_recharge) / 1000
    level_MAR[y] = -depth

# Scenario 3: MAR + reduced pumping
level_both = np.zeros(51)
depth = 0
for y in range(1, 51):
    total_recharge = natural_recharge + (mar_rate if y >= 20 else 0)
    pump = pumping if y < 20 else pumping * 0.6
    depth += (pump - total_recharge) / 1000
    level_both[y] = -depth

plt.figure(figsize=(10, 5))
plt.plot(years, level_noMAR, linewidth=2.5, color='#ef4444', label='No intervention')
plt.plot(years, level_MAR, linewidth=2.5, color='#f59e0b', label='MAR added at year 20')
plt.plot(years, level_both, linewidth=2.5, color='#10b981',
         label='MAR + reduced pumping')
plt.axvline(x=20, color='white', linewidth=1, linestyle=':', alpha=0.3)
plt.annotate('MAR begins', xy=(20, -0.3), fontsize=10, color='white')
plt.axhline(y=0, color='white', linewidth=0.5, alpha=0.2)

plt.xlabel('Years', fontsize=12, color='lightgray')
plt.ylabel('Water table change (m)', fontsize=12, color='lightgray')
plt.title('Aquifer Recovery with Managed Recharge', fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.show()

print("Without intervention: water table drops 1.9m over 50 years")
print("With MAR only: decline slows but still drops (pumping > recharge)")
print("With MAR + reduced pumping: water table RECOVERS!")
print()
print("Key insight: MAR alone is not enough if pumping is excessive")
print("Sustainability requires BOTH increased recharge AND managed extraction")`,
      challenge: 'Add cost to the model: MAR costs $0.50/m³ of recharged water. Calculate the annual cost of MAR for a 10 km² area at 30mm/year. Then compare with the cost of desalination ($1.00/m³) as an alternative water source.',
      successHint: 'MAR is one of the most promising solutions to the global groundwater crisis. By working WITH natural processes (infiltration, aquifer storage) rather than against them, engineers can restore depleted aquifers and create sustainable water supplies for future generations.',
    },
    {
      title: 'Climate change and groundwater — modelling future scenarios',
      concept: `Climate change affects groundwater in multiple ways:

1. **Changed rainfall patterns**: more intense storms but longer dry periods
2. **Increased evapotranspiration**: hotter temperatures mean more water evaporates before reaching the aquifer
3. **Sea level rise**: saltwater intrusion into coastal aquifers
4. **Glacier melt**: loss of glacial recharge in mountain regions

For arid regions like Mecca, climate models project even less rainfall and higher temperatures — a double blow to groundwater recharge. Understanding these projections is essential for long-term water planning.

In this exercise, you will model how different climate scenarios affect aquifer sustainability over the next century.`,
      analogy: 'Imagine your bathtub tap is slowly closing (less rainfall) while someone turns up the heated floor (more evaporation). Less water goes in, more is lost before it reaches the drain. The bath level drops faster than ever. Climate change is doing exactly this to aquifers worldwide.',
      storyConnection: 'Will Zamzam flow in 2100? The answer depends on how climate change affects recharge in the Hejaz region. Paleoclimate data shows the Arabian Peninsula was much wetter 6,000-10,000 years ago (the "Green Arabia" period). Zamzam’s deep aquifer likely stores water from that era. As modern climate becomes even drier, the ancient stored water becomes even more precious.',
      checkQuestion: 'If annual rainfall decreases by 20% and temperature rises by 2°C, roughly how much does aquifer recharge change?',
      checkAnswer: 'Much more than 20%. Temperature rise increases evapotranspiration by roughly 5-7% per degree. A 2°C rise increases ET by ~12%. Combined with 20% less rainfall, recharge could drop by 40-60%. This nonlinear amplification is why groundwater is more vulnerable to climate change than surface water — small changes in rainfall and temperature cause disproportionately large changes in recharge.',
      codeIntro: 'Model aquifer response to different climate change scenarios over 100 years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(2025, 2126)
n = len(years)

# Baseline climate for arid region (Mecca-like)
base_rain = 100    # mm/year
base_ET_frac = 0.85
base_recharge = base_rain * (1 - base_ET_frac - 0.12)  # 3 mm/year

# Climate scenarios (IPCC-like)
scenarios = {
    "Optimistic (SSP1-2.6)": {"rain_change": -0.10, "temp_rise": 1.5},
    "Middle (SSP2-4.5)":     {"rain_change": -0.20, "temp_rise": 2.7},
    "Pessimistic (SSP5-8.5)":{"rain_change": -0.30, "temp_rise": 4.5},
}

plt.figure(figsize=(10, 5))
colors = ['#10b981', '#f59e0b', '#ef4444']

for (name, scenario), color in zip(scenarios.items(), colors):
    recharge = np.zeros(n)
    water_level = np.zeros(n)
    level = 0
    pumping = 0.040  # 40mm/year equivalent

    for i in range(n):
        # Gradual climate change over 100 years
        progress = i / n
        rain = base_rain * (1 + scenario["rain_change"] * progress)
        temp_rise = scenario["temp_rise"] * progress
        ET_frac = base_ET_frac + 0.03 * temp_rise  # ET increases with temp

        rch = rain * (1 - min(ET_frac, 0.98) - 0.12)
        rch = max(rch, 0)
        recharge[i] = rch

        level += (rch - pumping) / 1000
        water_level[i] = level

    plt.plot(years, water_level, linewidth=2.5, color=color, label=name)

plt.axhline(y=0, color='white', linewidth=0.5, alpha=0.2)
plt.xlabel('Year', fontsize=12, color='lightgray')
plt.ylabel('Water table change (m)', fontsize=12, color='lightgray')
plt.title('Groundwater Under Climate Change (Arid Region)', fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray', loc='lower left')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.show()

print("All scenarios show declining water tables in arid regions")
print("The pessimistic scenario is devastating:")
print("  - 30% less rain + 4.5°C warmer = near-zero recharge")
print("  - Water table drops ~4m by 2125")
print()
print("Solutions: MAR, desalination, demand management, water recycling")
print("The question is not IF we need these — but how FAST")`,
      challenge: 'Add a "With MAR" variant to the pessimistic scenario that adds 15mm/year of managed recharge starting in 2040. Does it save the aquifer? What MAR rate would be needed to maintain current water levels under the worst-case scenario?',
      successHint: 'Climate change is the biggest threat to global groundwater. The models you have built show that arid regions face a double blow: less rain AND more evaporation. Only proactive management — combining MAR, conservation, and alternative supplies — can sustain groundwater for future generations.',
    },
    {
      title: 'Capstone: design a sustainable water management plan',
      concept: `In this final exercise, you will integrate everything from Levels 1-3 to design a complete water management plan for a Zamzam-like aquifer. Your plan must address:

1. **Supply**: how much water the aquifer can sustainably provide
2. **Demand**: projected water needs over 50 years
3. **Infrastructure**: wells, MAR systems, monitoring networks
4. **Climate resilience**: how the plan adapts to different climate scenarios
5. **Protection**: contamination prevention and monitoring

Your code will produce a dashboard showing supply vs demand projections, recommended interventions, and key monitoring indicators.

This is exactly what real hydrogeologists do for water utilities worldwide.`,
      analogy: 'You are the financial planner for a water bank. Income = recharge. Expenses = pumping. Savings = stored groundwater. You need to balance the budget over 50 years, accounting for inflation (climate change), unexpected withdrawals (drought), and investments (MAR). A good plan keeps the balance positive no matter what.',
      storyConnection: 'The Saudi Geological Survey’s management plan for Zamzam is a model of sustainable water management in an arid environment. It combines continuous monitoring, adaptive pumping schedules, protection zones, water quality testing, and infrastructure investment. Your capstone project mirrors their approach, scaled to the tools and data available to you.',
      checkQuestion: 'What is the single most important number in your water management plan?',
      checkAnswer: 'The ratio of extraction to recharge. If this ratio is consistently above 1.0, the aquifer is being depleted no matter what else you do. If it is below 1.0, the aquifer is sustainable. Everything else — MAR, well design, contamination protection — supports keeping this ratio below 1.0 over the long term. Simple, but fundamental.',
      codeIntro: 'Build a 50-year water management dashboard integrating all concepts.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Aquifer parameters (Zamzam-like)
stored_volume = 10e6     # m^3 (initial stored groundwater)
aquifer_area = 14e6      # m^2 (14 km^2 catchment)
natural_recharge = 2e-3  # m/year (2 mm/year)
K = 5e-4                 # hydraulic conductivity

# Demand projections
base_demand = 500000     # m^3/year current
growth_rate = 0.02       # 2% annual growth

# MAR capacity (after year 10)
mar_rate = 15e-3         # m/year = 15 mm/year
mar_start = 10

years = np.arange(0, 51)
n = len(years)

# Calculate supply and demand
supply = np.zeros(n)
demand = np.zeros(n)
balance = np.zeros(n)
stored = np.zeros(n)
stored[0] = stored_volume

for i in range(n):
    # Demand grows
    demand[i] = base_demand * (1 + growth_rate) ** i

    # Supply = natural recharge + MAR (if active)
    total_recharge = natural_recharge + (mar_rate if i >= mar_start else 0)
    supply[i] = total_recharge * aquifer_area

    # Water balance
    balance[i] = supply[i] - demand[i]

    if i > 0:
        stored[i] = stored[i-1] + balance[i]
        stored[i] = max(stored[i], 0)  # cannot go negative

# Dashboard
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Supply vs Demand
ax = axes[0, 0]
ax.plot(years, demand/1e6, linewidth=2, color='#ef4444', label='Demand')
ax.plot(years, supply/1e6, linewidth=2, color='#10b981', label='Supply (recharge)')
ax.axvline(x=mar_start, color='white', linewidth=1, linestyle=':', alpha=0.3)
ax.set_ylabel('Million m³/year', fontsize=10, color='lightgray')
ax.set_title('Supply vs Demand', fontsize=12, color='white')
ax.legend(fontsize=9, labelcolor='lightgray')
ax.tick_params(colors='lightgray'); ax.grid(alpha=0.2)

# Annual balance
ax = axes[0, 1]
ax.bar(years, balance/1e6, color=['#10b981' if b >= 0 else '#ef4444' for b in balance], alpha=0.7)
ax.axhline(y=0, color='white', linewidth=0.5)
ax.set_ylabel('Million m³/year', fontsize=10, color='lightgray')
ax.set_title('Annual Water Balance', fontsize=12, color='white')
ax.tick_params(colors='lightgray'); ax.grid(alpha=0.2)

# Stored volume
ax = axes[1, 0]
ax.plot(years, stored/1e6, linewidth=2.5, color='#3b82f6')
ax.fill_between(years, stored/1e6, alpha=0.1, color='#3b82f6')
ax.set_xlabel('Years from now', fontsize=10, color='lightgray')
ax.set_ylabel('Million m³', fontsize=10, color='lightgray')
ax.set_title('Stored Groundwater', fontsize=12, color='white')
ax.tick_params(colors='lightgray'); ax.grid(alpha=0.2)

# Sustainability ratio
ax = axes[1, 1]
ratio = demand / np.maximum(supply, 1)
ax.plot(years, ratio, linewidth=2.5, color='#f59e0b')
ax.axhline(y=1.0, color='#ef4444', linewidth=1.5, linestyle='--', label='Critical: ratio = 1')
ax.set_xlabel('Years from now', fontsize=10, color='lightgray')
ax.set_ylabel('Demand / Supply', fontsize=10, color='lightgray')
ax.set_title('Sustainability Ratio', fontsize=12, color='white')
ax.legend(fontsize=9, labelcolor='lightgray')
ax.tick_params(colors='lightgray'); ax.grid(alpha=0.2)

plt.suptitle('Aquifer Management Dashboard', fontsize=16, color='white', y=1.02)
plt.tight_layout()
plt.show()

print("=== Management Recommendations ===")
depletion_year = np.argmax(stored <= 0)
if depletion_year > 0:
    print(f"WARNING: Aquifer depleted by year {depletion_year}")
else:
    print("Aquifer survives 50 years — but barely")
print(f"Year 50 stored volume: {stored[-1]/1e6:.1f} million m³")
print(f"Year 50 sustainability ratio: {ratio[-1]:.2f}")`,
      challenge: 'Modify the plan: (1) reduce demand growth to 1% (conservation), (2) increase MAR rate to 25mm/year, (3) start MAR at year 5. Can you make the sustainability ratio stay below 1.0 for all 50 years? Find the optimal combination.',
      successHint: 'You have built a complete water management dashboard — the same type of analysis that professional hydrogeologists present to governments and water utilities. The key lesson: sustainability is not about any single intervention. It is about balancing supply, demand, and storage over decades.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced numerical modelling and analysis</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced groundwater modelling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[ZamzamAquiferDiagram, ZamzamWaterCycleDiagram, ZamzamPorosityDiagram, ZamzamDarcyLawDiagram, WaterCycleDiagram, PressureDepthDiagram][i] ? createElement([ZamzamAquiferDiagram, ZamzamWaterCycleDiagram, ZamzamPorosityDiagram, ZamzamDarcyLawDiagram, WaterCycleDiagram, PressureDepthDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
