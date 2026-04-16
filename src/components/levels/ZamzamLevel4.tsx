import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ZamzamAquiferDiagram from '../diagrams/ZamzamAquiferDiagram';
import ZamzamDarcyLawDiagram from '../diagrams/ZamzamDarcyLawDiagram';
import ZamzamPorosityDiagram from '../diagrams/ZamzamPorosityDiagram';
import ZamzamWaterCycleDiagram from '../diagrams/ZamzamWaterCycleDiagram';
import WaterCycleDiagram from '../diagrams/WaterCycleDiagram';
import ActivityWellModelDiagram from '../diagrams/ActivityWellModelDiagram';

export default function ZamzamLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Aquifer modelling — multi-layer confined systems',
      concept: `Real aquifers are not single uniform layers. The Zamzam aquifer has at least three distinct zones: a shallow alluvial layer, a fractured metamorphic zone, and deeper crystalline basement rock. Each has different transmissivity and storativity.

A **multi-layer model** treats each geological unit as a separate layer connected by vertical leakage through **aquitards** (semi-permeable layers between aquifers). The leakage rate depends on the head difference between layers and the aquitard’s vertical conductivity:

**Q_leak = K_v / b * (h_upper - h_lower) * A**

Where K_v is vertical conductivity, b is aquitard thickness, and A is the cell area.

The code builds a two-layer aquifer model with leakage, simulating how pumping from the lower layer draws water down from the upper layer through the confining bed.`,
      analogy: 'Imagine a two-storey car park. Each floor has its own entrance (recharge), and water can drip from the upper floor to the lower floor through small cracks in the concrete (leakage). Pumping from the lower floor lowers the water there, increasing the drip rate from above. The system is connected but each floor has its own dynamics.',
      storyConnection: 'The Saudi Geological Survey’s MODFLOW model of the Zamzam aquifer uses at least three layers to represent the different geological formations. Pumping from the deep fractured zone induces leakage from the shallower alluvium, which is where most of the flash-flood recharge enters. This vertical connection is why the well recovers so quickly.',
      checkQuestion: 'If the aquitard between two layers is made of dense clay (very low K_v), what happens to leakage and the lower aquifer’s recovery time?',
      checkAnswer: 'Leakage drops dramatically because Q_leak is proportional to K_v. The lower aquifer recovers slowly because it cannot draw water from above. In practice, this means wells in confined aquifers with thick clay aquitards show larger drawdowns and longer recovery times. The Zamzam aquifer’s fractured confining layers have relatively high K_v, enabling rapid recovery.',
      codeIntro: 'Build a two-layer aquifer model with vertical leakage between layers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Two-layer aquifer with leakage
nx, ny = 40, 40
dx = 25  # metres
T_upper = 2e-3   # transmissivity upper layer (m^2/s)
T_lower = 5e-3   # transmissivity lower layer
S_upper = 0.05   # storativity (unconfined)
S_lower = 0.001  # storativity (confined)
Kv_b = 1e-6      # leakance = K_v / aquitard_thickness (1/s)

dt = 3600  # 1 hour
n_steps = 150

# Initial heads
h_up = np.ones((nx, ny)) * 50.0
h_lo = np.ones((nx, ny)) * 48.0

# Pumping well in lower layer (centre)
cx, cy = nx//2, ny//2
Q_pump = -0.02  # m^3/s (about 20 L/s, close to Zamzam)

# Track well head over time
time_hrs = []
well_head_upper = []
well_head_lower = []

for step in range(n_steps):
    # Stop pumping after 100 steps to see recovery
    Q = Q_pump if step < 100 else 0.0

    # Leakage between layers
    leakage = Kv_b * (h_up - h_lo) * dx**2  # m^3/s per cell

    # Upper layer update
    h_up_new = h_up.copy()
    for i in range(1, nx-1):
        for j in range(1, ny-1):
            laplacian = (h_up[i+1,j] + h_up[i-1,j] + h_up[i,j+1] + h_up[i,j-1] - 4*h_up[i,j])
            h_up_new[i,j] = h_up[i,j] + (T_upper*dt/(S_upper*dx**2)) * laplacian - leakage[i,j]*dt/(S_upper*dx**2)

    # Lower layer update
    h_lo_new = h_lo.copy()
    for i in range(1, nx-1):
        for j in range(1, ny-1):
            laplacian = (h_lo[i+1,j] + h_lo[i-1,j] + h_lo[i,j+1] + h_lo[i,j-1] - 4*h_lo[i,j])
            src = Q / dx**2 if (i == cx and j == cy) else 0
            h_lo_new[i,j] = h_lo[i,j] + (T_lower*dt/(S_lower*dx**2)) * laplacian + leakage[i,j]*dt/(S_lower*dx**2) + src*dt/S_lower

    h_up = h_up_new
    h_lo = h_lo_new
    time_hrs.append((step+1) * dt / 3600)
    well_head_upper.append(h_up[cx, cy])
    well_head_lower.append(h_lo[cx, cy])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

ax1.plot(time_hrs, well_head_lower, color='#3b82f6', linewidth=2, label='Lower aquifer (pumped)')
ax1.plot(time_hrs, well_head_upper, color='#10b981', linewidth=2, label='Upper aquifer')
ax1.axvline(100, color='#ef4444', linewidth=1, linestyle='--', alpha=0.5)
ax1.text(101, 49, 'Pump OFF', color='#ef4444', fontsize=10)
ax1.set_xlabel('Time (hours)', fontsize=11)
ax1.set_ylabel('Hydraulic head (m)', fontsize=11)
ax1.set_title('Zamzam: Pump Test with Two-Layer Aquifer', fontsize=12)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

# Contour map of lower layer at end of pumping
ax2.contourf(h_lo, levels=20, cmap='Blues_r')
ax2.plot(cy, cx, 'r*', markersize=15)
ax2.set_title('Lower Aquifer Head (end of pumping)', fontsize=12)
ax2.set_xlabel('Grid X', fontsize=10)
ax2.set_ylabel('Grid Y', fontsize=10)
plt.colorbar(ax2.contourf(h_lo, levels=20, cmap='Blues_r'), ax=ax2, label='Head (m)')

plt.tight_layout()
plt.show()

print(f"Max drawdown (lower): {48 - min(well_head_lower):.2f} m")
print(f"Recovery after pump-off: head = {well_head_lower[-1]:.2f} m")`,
      challenge: 'Increase the leakance (Kv_b) by 10x and observe faster recovery. Then add a second pumping well 200m away and see how the cones of depression interact. Which scenario depletes the aquifer faster?',
      successHint: 'Multi-layer models are the standard tool for real aquifer management. The MODFLOW software used by the Saudi Geological Survey for Zamzam implements exactly this kind of layer-by-layer calculation, just on much finer grids.',
    },
    {
      title: 'Contamination transport — advection-dispersion simulation',
      concept: `Groundwater contamination is one of the world’s most serious environmental threats. Once a pollutant enters an aquifer, it moves with the water (**advection**) and spreads by molecular mixing and tortuous flow paths (**dispersion**).

The **advection-dispersion equation (ADE)** governs this:

**∂C/∂t = D ∂²C/∂x² - v ∂C/∂x - λc**

Where C is concentration, D is the dispersion coefficient, v is groundwater velocity (from Darcy’s law), and λ is a decay rate for biodegradable contaminants.

The code simulates a contaminant plume spreading through a 1D aquifer, showing how advection carries the plume downstream while dispersion spreads it out. It then evaluates whether the plume reaches a well before natural attenuation reduces it to safe levels.`,
      analogy: 'Drop food colouring into a slow-flowing stream. The dye moves downstream with the water (advection) while simultaneously spreading sideways and mixing with clean water (dispersion). Given enough distance and time, the dye becomes undetectable. Groundwater contamination follows the same physics, just much slower — plumes can take decades to travel a few kilometres.',
      storyConnection: 'Protecting the Zamzam well from contamination is a constant concern. The Saudi authorities maintain a strict exclusion zone around the recharge area. The ADE tells them how fast a potential spill would travel toward the well and how much natural dilution and attenuation would occur along the way. This is critical for setting buffer zone distances.',
      checkQuestion: 'If groundwater velocity doubles, does the contaminant reach the well in half the time? What about the concentration when it arrives?',
      checkAnswer: 'The arrival time is approximately halved (advection is proportional to velocity). However, the concentration may be HIGHER because there is less time for dispersion to dilute the plume and less time for biodegradation to break it down. Faster flow = faster arrival with less attenuation. This is why high-permeability aquifers require larger protection zones.',
      codeIntro: 'Simulate contaminant transport through an aquifer using the advection-dispersion equation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D advection-dispersion
L = 2000     # aquifer length (m)
nx = 200
dx = L / nx
x = np.linspace(0, L, nx)

v = 0.5 / 86400  # groundwater velocity (m/s) = 0.5 m/day
D = 5e-6         # dispersion coefficient (m^2/s)
lam = 1e-8       # decay rate (1/s) for biodegradable contaminant

dt = 3600        # 1 hour
n_days = 500
n_steps = int(n_days * 86400 / dt)

C = np.zeros(nx)
# Initial spill at x = 200m
spill_idx = int(200 / dx)
C[spill_idx-2:spill_idx+3] = 100  # mg/L

well_idx = int(1000 / dx)  # well at 1000m

# Store snapshots
snapshots = {}
snap_days = [0, 50, 150, 300, 500]
snapshots[0] = C.copy()

well_conc = []
days = []

for step in range(1, n_steps + 1):
    C_new = C.copy()
    for i in range(1, nx-1):
        advection = -v * (C[i] - C[i-1]) / dx
        dispersion = D * (C[i+1] - 2*C[i] + C[i-1]) / dx**2
        decay = -lam * C[i]
        C_new[i] = C[i] + dt * (advection + dispersion + decay)
    C_new = np.maximum(C_new, 0)
    C = C_new

    day = step * dt / 86400
    if int(day) in snap_days and int(day) not in [d for d in snapshots]:
        snapshots[int(day)] = C.copy()
    if step % 24 == 0:  # daily
        well_conc.append(C[well_idx])
        days.append(day)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7']
for (day, snap), col in zip(sorted(snapshots.items()), colors):
    ax1.plot(x, snap, color=col, linewidth=2, label=f'Day {day}')
ax1.axvline(1000, color='white', linewidth=1, linestyle=':', alpha=0.4)
ax1.text(1020, 80, 'Well', color='white', fontsize=10)
ax1.set_xlabel('Distance (m)', fontsize=11)
ax1.set_ylabel('Concentration (mg/L)', fontsize=11)
ax1.set_title('Contaminant Plume Migration', fontsize=12)
ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

ax2.plot(days, well_conc, color='#ef4444', linewidth=2)
ax2.axhline(10, color='#f59e0b', linewidth=1.5, linestyle='--')
ax2.text(50, 12, 'Safe limit (10 mg/L)', color='#f59e0b', fontsize=10)
ax2.set_xlabel('Time (days)', fontsize=11)
ax2.set_ylabel('Concentration at well (mg/L)', fontsize=11)
ax2.set_title('Contamination Arrival at Zamzam Well', fontsize=12)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

peak = max(well_conc)
peak_day = days[well_conc.index(peak)]
print(f"Peak concentration at well: {peak:.2f} mg/L on day {peak_day:.0f}")
safe = peak < 10
print(f"Exceeds safe limit? {'YES - well contaminated!' if not safe else 'No - natural attenuation sufficient'}")`,
      challenge: 'Move the spill source to 500m from the well and increase initial concentration to 500 mg/L. Does the plume still attenuate below safe limits? What buffer distance is needed to protect the well?',
      successHint: 'Contamination transport modelling is used worldwide to design wellhead protection zones, assess pollution risks, and plan remediation. The same ADE governs river pollution, ocean oil spills, and atmospheric dispersion of emissions.',
    },
    {
      title: 'Desalination physics — reverse osmosis from first principles',
      concept: `Saudi Arabia is the world’s largest producer of desalinated water. When natural groundwater is insufficient, seawater is turned into drinking water using **reverse osmosis (RO)**.

Normal osmosis: water moves through a semi-permeable membrane from low salt concentration to high (diluting the salty side). **Reverse osmosis** applies pressure exceeding the **osmotic pressure** to force water the other way — from salty to fresh.

Osmotic pressure: **π = iMRT**
Where i = van’t Hoff factor, M = molarity, R = gas constant, T = temperature.

For seawater (35 g/L NaCl, ~0.6 M, i≈2): π ≈ 2 × 0.6 × 8.314 × 298 / 1000 ≈ **27 atm**

To desalinate, you need to apply > 27 atm (typically 55-80 atm in practice).

The code calculates energy requirements and compares RO to other methods.`,
      analogy: 'Imagine a room divided by a screen door. On one side: a huge crowd (salty water). On the other: an empty room (fresh water). People naturally move toward the empty room (osmosis). To reverse the flow, you would need to physically push people back through the screen from the crowded side — that requires force (pressure). The more crowded the room, the harder you push.',
      storyConnection: 'Saudi Arabia desalinates over 7 million cubic metres of seawater daily, supplementing groundwater from sources like Zamzam. Understanding the energy cost of desalination helps appreciate why protecting natural aquifers is so critical — groundwater is essentially free water, while desalination costs $0.50-1.50 per cubic metre.',
      checkQuestion: 'Why is the minimum practical pressure for RO (55-80 atm) so much higher than the theoretical osmotic pressure (27 atm)?',
      checkAnswer: 'Several factors: (1) You need a pressure differential above osmotic pressure, not just equal to it, to drive water at a useful rate. (2) As water is removed, the remaining brine becomes more concentrated, increasing osmotic pressure. (3) Membrane fouling and concentration polarisation create additional resistance. (4) Energy recovery devices are imperfect. Practical systems operate at 2-3x theoretical minimum pressure.',
      codeIntro: 'Calculate desalination energy requirements and compare water sources.',
      code: `import numpy as np
import matplotlib.pyplot as plt

R = 8.314  # J/(mol*K)
T = 298    # K (25 C)

# Osmotic pressure vs salinity
salinities = np.linspace(0.1, 70, 200)  # g/L NaCl
M = salinities / 58.44  # molarity
i = 1.85  # van't Hoff factor for NaCl
pi = i * M * R * T / 101325  # atm

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

ax1.plot(salinities, pi, color='#3b82f6', linewidth=2.5)
ax1.axhline(27, color='#f59e0b', linewidth=1.5, linestyle='--')
ax1.text(5, 28.5, 'Seawater (35 g/L) = 27 atm', color='#f59e0b', fontsize=10)
ax1.scatter([35], [27], color='#f59e0b', s=80, zorder=5)

# Mark Zamzam water (low salinity ~2 g/L)
zam_pi = i * (2/58.44) * R * T / 101325
ax1.scatter([2], [zam_pi], color='#10b981', s=80, zorder=5)
ax1.text(5, zam_pi + 1, 'Zamzam (~2 g/L)', color='#10b981', fontsize=10)

ax1.set_xlabel('Salinity (g/L NaCl)', fontsize=11)
ax1.set_ylabel('Osmotic Pressure (atm)', fontsize=11)
ax1.set_title('Osmotic Pressure vs Salinity', fontsize=12)
ax1.grid(alpha=0.3)

# Energy comparison of water sources
sources = ['Zamzam\
(groundwater)', 'Treated\
wastewater', 'Brackish\
RO', 'Seawater\
RO', 'Distillation']
energy = [0.1, 0.5, 1.5, 3.5, 10]  # kWh per m^3
cost = [0.05, 0.30, 0.50, 1.00, 2.50]  # $/m^3

bars = ax2.bar(sources, energy, color=['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7'],
               width=0.6, edgecolor='none')
ax2.set_ylabel('Energy (kWh/m³)', fontsize=11)
ax2.set_title('Energy Cost of Water Production Methods', fontsize=12)
ax2.grid(axis='y', alpha=0.3)
ax2.tick_params(labelsize=10)

for bar, c in zip(bars, cost):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
             f'\{c:.2f}/m³', ha='center', fontsize=10, color='lightgray')

plt.tight_layout()
plt.show()

print("=== Water Source Comparison ===")
for s, e, c in zip(sources, energy, cost):
    print(f"  {s.replace(chr(10),' '):20s}: {e:>5.1f} kWh/m³, \{c:.2f}/m³")
print()
print("Zamzam: naturally filtered, mineral-rich, near-zero energy")
print("Protecting aquifers is 35x cheaper than desalination!")`,
      challenge: 'Calculate how many solar panels (each producing 400W for 6 hours/day) Saudi Arabia would need to desalinate its daily 7 million m³ at 3.5 kWh/m³. Is 100% solar-powered desalination feasible?',
      successHint: 'Desalination is a triumph of applied physics and engineering, but it is energy-intensive. Understanding the thermodynamic minimum energy helps evaluate the true cost of water and why aquifer conservation is always the first priority.',
    },
    {
      title: 'Water budget analysis — balancing inputs and outputs',
      concept: `A **water budget** is the fundamental accounting tool in hydrology: water in = water out + change in storage.

For the Zamzam aquifer:
**Inputs**: rainfall recharge, wadi flood infiltration, lateral inflow from surrounding rock.
**Outputs**: well pumping, natural spring discharge, evapotranspiration from shallow groundwater.
**Storage change**: rise or fall in the water table.

If inputs > outputs, storage increases (water table rises). If outputs > inputs, storage decreases (water table falls). Sustainability means balancing these over the long term.

The code builds a complete annual water budget for the Zamzam catchment and projects sustainability over 50 years under different management scenarios.`,
      analogy: 'A water budget is like a bank account. Your salary is the input (rain). Your expenses are the output (pumping, evaporation). Your bank balance is storage (aquifer level). If you spend more than you earn each month, your balance drops. You can survive on savings for a while, but eventually you go bankrupt. Sustainable water management means never spending more than you earn, averaged over years.',
      storyConnection: 'The Saudi Geological Survey publishes an annual water budget for the Zamzam aquifer. Average annual recharge is estimated at 2.5-4 million m³. Current pumping extracts about 2.9 million m³ per year. This is within the sustainable yield, but barely — any increase in pumping or decrease in rainfall (due to climate change) could tip the balance.',
      checkQuestion: 'If climate change reduces annual rainfall by 20%, and demand increases by 15% due to population growth, what happens to the aquifer?',
      checkAnswer: 'Recharge drops by 20% (fewer flood events, less infiltration) while pumping increases by 15%. The deficit grows from both sides. Without intervention (demand reduction, artificial recharge, or supplemental desalinated water), the aquifer depletes. This is the scenario facing many aquifers worldwide, including parts of India’s Indo-Gangetic plain.',
      codeIntro: 'Build a 50-year water budget projection for the Zamzam aquifer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(1, 51)
n = len(years)

# Baseline values (million m^3/year)
base_recharge = 3.5
base_pumping = 2.9
storage_init = 50.0  # estimated aquifer storage (million m^3)

# Scenario 1: Status quo
recharge_1 = np.full(n, base_recharge)
pumping_1 = np.full(n, base_pumping)

# Scenario 2: Climate change (-2%/decade) + demand growth (+1.5%/year)
recharge_2 = base_recharge * (1 - 0.002 * years)
pumping_2 = base_pumping * (1.015 ** years)

# Scenario 3: Managed - artificial recharge + conservation
recharge_3 = base_recharge * (1 - 0.002 * years) + 0.5  # +0.5 MAR
pumping_3 = base_pumping * np.ones(n)  # capped at current

def simulate(recharge, pumping, storage_init):
    storage = [storage_init]
    for i in range(n):
        s = storage[-1] + recharge[i] - pumping[i]
        storage.append(max(0, s))
    return np.array(storage[1:])

s1 = simulate(recharge_1, pumping_1, storage_init)
s2 = simulate(recharge_2, pumping_2, storage_init)
s3 = simulate(recharge_3, pumping_3, storage_init)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

ax1.plot(years, s1, color='#3b82f6', linewidth=2.5, label='Status quo')
ax1.plot(years, s2, color='#ef4444', linewidth=2.5, label='Climate change + growth')
ax1.plot(years, s3, color='#10b981', linewidth=2.5, label='Managed (MAR + cap)')
ax1.axhline(10, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5)
ax1.text(2, 12, 'Critical minimum', color='#f59e0b', fontsize=10)
ax1.set_xlabel('Year', fontsize=11)
ax1.set_ylabel('Aquifer storage (million m³)', fontsize=11)
ax1.set_title('Zamzam Aquifer: 50-Year Projections', fontsize=12)
ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

# Sustainability ratio: pumping / recharge
ratio_1 = pumping_1 / recharge_1
ratio_2 = pumping_2 / recharge_2
ratio_3 = pumping_3 / recharge_3

ax2.plot(years, ratio_1, color='#3b82f6', linewidth=2.5, label='Status quo')
ax2.plot(years, ratio_2, color='#ef4444', linewidth=2.5, label='Climate + growth')
ax2.plot(years, ratio_3, color='#10b981', linewidth=2.5, label='Managed')
ax2.axhline(1.0, color='white', linewidth=1.5, linestyle='--', alpha=0.5)
ax2.text(2, 1.05, 'Unsustainable (>1.0)', color='#ef4444', fontsize=10)
ax2.set_xlabel('Year', fontsize=11)
ax2.set_ylabel('Pumping / Recharge ratio', fontsize=11)
ax2.set_title('Sustainability Ratio Over Time', fontsize=12)
ax2.legend(fontsize=9)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

for name, stor in [('Status quo', s1), ('Climate+growth', s2), ('Managed', s3)]:
    depletion_year = np.where(stor <= 10)[0]
    if len(depletion_year) > 0:
        print(f"  {name:20s}: critical by year {depletion_year[0]+1}")
    else:
        print(f"  {name:20s}: sustainable for 50+ years (final = {stor[-1]:.1f} M m³)")`,
      challenge: 'Add a fourth scenario: desalination supplementing 1 million m³/year starting from year 10, combined with MAR and demand caps. What is the optimal combination that keeps storage above 20 million m³ for 100 years?',
      successHint: 'Water budgets are the foundation of all water resource management. Every country, every city, every farm needs one. The maths is simple — it is just addition and subtraction — but the consequences of getting it wrong are devastating.',
    },
    {
      title: 'Well placement optimisation — maximising yield while protecting the resource',
      concept: `Where you place a well matters enormously. Too close to the aquifer boundary and yield is limited. Too close to a contaminant source and the water is unsafe. Too close to another well and they interfere, each reducing the other’s yield.

**Well interference** occurs when the cones of depression of two wells overlap. Each well lowers the water table around it, and if the cones overlap, the effective drawdown at each well is the sum of both cones — more than either would experience alone.

Optimal placement maximises total yield while keeping the drawdown at every well below a critical threshold (often the top of the aquifer’s screened interval).

The code optimises the placement of multiple wells across an aquifer using the Theis equation for superposed drawdowns.`,
      analogy: 'Imagine drawing water from a lake with straws. One straw works fine. But if you cluster ten straws in the same spot, each straw gets less water because they are all competing for the same local supply. Spread the straws across the lake and each one draws efficiently. Well placement is the same problem at an aquifer scale.',
      storyConnection: 'The Zamzam well is the primary extraction point, but modern water supply in Makkah uses dozens of additional wells spread across the catchment. The Saudi authorities optimised their placement using numerical modelling to ensure that: (1) total supply meets demand, (2) no well draws the water table below the critical level, and (3) the Zamzam well remains unaffected.',
      checkQuestion: 'Two wells 500m apart each produce 10 L/s with a drawdown of 5m. If moved to 100m apart, what happens to drawdown?',
      checkAnswer: 'Drawdown at each well increases significantly because the cones of depression overlap more. Using the Theis equation, drawdown from a nearby well at 100m is much larger than at 500m (logarithmic relationship). The combined drawdown at each well could exceed the aquifer thickness, causing the wells to go dry. This is why minimum well spacing regulations exist.',
      codeIntro: 'Optimise well placement in an aquifer to maximise yield.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Theis-based drawdown (simplified steady-state: Thiem equation)
# s = Q / (2*pi*T) * ln(R/r)
T = 5e-3   # transmissivity (m^2/s)
R = 2000   # radius of influence (m)

def drawdown(x_obs, y_obs, wells, T, R):
    """Total drawdown at (x_obs, y_obs) from all wells"""
    s_total = 0
    for wx, wy, Q in wells:
        r = np.sqrt((x_obs - wx)**2 + (y_obs - wy)**2)
        r = max(r, 0.15)  # well radius
        if r < R:
            s_total += Q / (2 * np.pi * T) * np.log(R / r)
    return s_total

# Aquifer grid
nx, ny = 100, 100
x = np.linspace(0, 2000, nx)
y = np.linspace(0, 2000, ny)
X, Y = np.meshgrid(x, y)

# Scenario A: clustered wells (poor placement)
wells_a = [(900,900,0.01), (950,950,0.01), (1000,1000,0.01), (1050,1050,0.01)]

# Scenario B: optimally spread wells
wells_b = [(500,500,0.01), (500,1500,0.01), (1500,500,0.01), (1500,1500,0.01)]

def compute_field(wells):
    S = np.zeros_like(X)
    for i in range(nx):
        for j in range(ny):
            S[j, i] = drawdown(x[i], y[j], wells, T, R)
    return S

S_a = compute_field(wells_a)
S_b = compute_field(wells_b)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

levels = np.linspace(0, 15, 20)
c1 = ax1.contourf(X, Y, S_a, levels=levels, cmap='Reds')
for wx, wy, _ in wells_a:
    ax1.plot(wx, wy, 'k*', markersize=12)
ax1.set_title('Clustered Wells (poor)', fontsize=12)
ax1.set_xlabel('X (m)', fontsize=10)
ax1.set_ylabel('Y (m)', fontsize=10)
plt.colorbar(c1, ax=ax1, label='Drawdown (m)')

c2 = ax2.contourf(X, Y, S_b, levels=levels, cmap='Blues')
for wx, wy, _ in wells_b:
    ax2.plot(wx, wy, 'k*', markersize=12)
ax2.set_title('Spread Wells (optimal)', fontsize=12)
ax2.set_xlabel('X (m)', fontsize=10)
ax2.set_ylabel('Y (m)', fontsize=10)
plt.colorbar(c2, ax=ax2, label='Drawdown (m)')

plt.tight_layout()
plt.show()

# Compare max drawdown
max_a = max(drawdown(wx, wy, wells_a, T, R) for wx, wy, _ in wells_a)
max_b = max(drawdown(wx, wy, wells_b, T, R) for wx, wy, _ in wells_b)
print(f"Clustered: max drawdown at well = {max_a:.2f} m")
print(f"Spread:    max drawdown at well = {max_b:.2f} m")
print(f"Spreading wells reduces drawdown by {(1 - max_b/max_a)*100:.0f}%")`,
      challenge: 'Add a contamination source at (1800, 1000). Calculate the capture zone of each well layout — does either layout draw contaminated water toward the wells? Adjust placements to avoid contamination while maintaining yield.',
      successHint: 'Well placement optimisation is a real engineering problem solved using numerical models and optimisation algorithms. The same mathematics applies to placing oil wells, geothermal boreholes, and groundwater monitoring stations.',
    },
    {
      title: 'Capstone — integrated water management system for an arid city',
      concept: `This capstone integrates everything from Levels 1 through 4: Darcy’s law, aquifer modelling, contamination transport, desalination, water budgets, and well optimisation into a single comprehensive water management dashboard.

You will design a water system for a hypothetical arid city of 500,000 people with:
- A groundwater aquifer (limited recharge)
- A desalination plant (energy-intensive)
- Demand that grows 2% annually
- A contamination risk from upstream industry

The goal: keep the city supplied for 50 years without depleting the aquifer or exceeding the energy budget.

**Level 1**: You learned what groundwater is and how it moves.
**Level 2**: You applied Darcy’s law and calculated pumping tests.
**Level 3**: You built numerical models and analysed contamination.
**Level 4**: You combined everything into a management system.

This progression — from qualitative understanding to quantitative modelling to integrated system design — is how real hydrogeologists work.`,
      analogy: 'A water management system is like running a small country’s economy. You have income (recharge, desalination), expenses (demand), savings (aquifer storage), risks (contamination, drought), and infrastructure costs (wells, pipelines, plants). The goal is long-term prosperity — meeting everyone’s needs today without bankrupting the future.',
      storyConnection: 'The Saudi government manages exactly this kind of integrated system for Makkah and its 2 million permanent residents (plus up to 4 million during Hajj). They balance Zamzam groundwater, regional aquifers, desalinated water piped from Jeddah, and recycled wastewater — all coordinated to meet one of the world’s most challenging water demands in one of the driest environments on Earth.',
      checkQuestion: 'What would happen to the system if both a severe drought (50% recharge reduction) and a desalination plant failure occurred simultaneously?',
      checkAnswer: 'This is the worst-case scenario. Groundwater becomes the sole supply, but with 50% less recharge, the aquifer is pumped far beyond sustainable yield. Water rationing would be necessary within weeks. This is why redundancy is critical — real water systems always have backup supplies, emergency reserves, and inter-city connections. Saudi Arabia maintains a strategic water reserve for exactly this scenario.',
      codeIntro: 'Build an integrated water management dashboard for an arid city.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# City parameters
population_init = 500_000
growth_rate = 0.02  # 2% annual
per_capita_demand = 0.25  # m^3/day (250 litres)
years = 50

# Water sources
aquifer_storage = 100  # million m^3
aquifer_recharge = 8   # million m^3/year
max_pump_rate = 12     # million m^3/year
desal_capacity = 15    # million m^3/year
desal_energy = 3.5     # kWh/m^3
energy_budget = 60     # million kWh/year

# Simulate
pop = population_init * (1 + growth_rate) ** np.arange(years)
demand = pop * per_capita_demand * 365 / 1e6  # million m^3/year

storage = [aquifer_storage]
gw_used = []
desal_used = []
deficit = []
energy_used = []

for yr in range(years):
    d = demand[yr]
    # Priority: groundwater first (cheaper), desal to cover gap
    gw = min(d, max_pump_rate, storage[-1] + aquifer_recharge)
    ds = min(d - gw, desal_capacity)
    e = ds * desal_energy
    short = max(0, d - gw - ds)

    new_storage = storage[-1] + aquifer_recharge - gw
    storage.append(max(0, new_storage))

    gw_used.append(gw)
    desal_used.append(ds)
    deficit.append(short)
    energy_used.append(e)

storage = np.array(storage[1:])
yrs = np.arange(1, years + 1)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))

# Demand vs supply
axes[0,0].stackplot(yrs, gw_used, desal_used, deficit,
                    colors=['#3b82f6', '#10b981', '#ef4444'],
                    labels=['Groundwater', 'Desalination', 'Deficit'], alpha=0.8)
axes[0,0].plot(yrs, demand, 'w--', linewidth=2, label='Total demand')
axes[0,0].set_ylabel('Million m³/year', fontsize=10)
axes[0,0].set_title('Water Supply vs Demand', fontsize=12)
axes[0,0].legend(fontsize=9, loc='upper left')
axes[0,0].grid(alpha=0.2)

# Aquifer storage
axes[0,1].fill_between(yrs, storage, color='#3b82f6', alpha=0.3)
axes[0,1].plot(yrs, storage, color='#3b82f6', linewidth=2.5)
axes[0,1].axhline(20, color='#ef4444', linewidth=1.5, linestyle='--')
axes[0,1].text(2, 22, 'Emergency minimum', color='#ef4444', fontsize=10)
axes[0,1].set_ylabel('Storage (million m³)', fontsize=10)
axes[0,1].set_title('Aquifer Storage Level', fontsize=12)
axes[0,1].grid(alpha=0.2)

# Energy use
axes[1,0].bar(yrs, energy_used, color='#f59e0b', alpha=0.7, width=0.8)
axes[1,0].axhline(energy_budget, color='#ef4444', linewidth=1.5, linestyle='--')
axes[1,0].text(2, energy_budget + 1, 'Energy budget', color='#ef4444', fontsize=10)
axes[1,0].set_xlabel('Year', fontsize=10)
axes[1,0].set_ylabel('Energy (million kWh)', fontsize=10)
axes[1,0].set_title('Desalination Energy Use', fontsize=12)
axes[1,0].grid(alpha=0.2)

# Population and per-capita availability
avail = (np.array(gw_used) + np.array(desal_used)) * 1e6 / pop / 365 * 1000  # litres/day
axes[1,1].plot(yrs, avail, color='#a855f7', linewidth=2.5)
axes[1,1].axhline(100, color='#ef4444', linewidth=1.5, linestyle='--')
axes[1,1].text(2, 105, 'WHO minimum (100 L/day)', color='#ef4444', fontsize=10)
axes[1,1].set_xlabel('Year', fontsize=10)
axes[1,1].set_ylabel('Litres per person per day', fontsize=10)
axes[1,1].set_title('Per-Capita Water Availability', fontsize=12)
axes[1,1].grid(alpha=0.2)

plt.tight_layout()
plt.show()

# Summary
crisis_yr = np.where(np.array(deficit) > 0)[0]
print("=== 50-Year Water Management Summary ===")
print(f"  Population: {population_init:,} → {int(pop[-1]):,}")
print(f"  Demand: {demand[0]:.1f} → {demand[-1]:.1f} M m³/yr")
print(f"  Final aquifer: {storage[-1]:.1f} M m³")
if len(crisis_yr) > 0:
    print(f"  DEFICIT starts year {crisis_yr[0]+1}")
else:
    print("  No deficit — system is sustainable!")`,
      challenge: 'Modify the system to include: (1) a drought in years 15-20 (50% less recharge), (2) a desalination plant expansion in year 10 (double capacity), (3) water conservation measures reducing per-capita demand by 1% per year. Find the configuration that avoids any deficit for 100 years.',
      successHint: 'You have built a complete water management system — the same type of analysis used by governments and engineering firms worldwide. From Hajar’s desperate search for water to a 50-year computational model, the Zamzam story bridges four thousand years of water science. The equations are your tools. The aquifer is your responsibility.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone water management and advanced modelling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises involve advanced aquifer modelling and water management. Click to start Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[ZamzamAquiferDiagram, ZamzamWaterCycleDiagram, ZamzamPorosityDiagram, ZamzamDarcyLawDiagram, WaterCycleDiagram, ActivityWellModelDiagram][i] ? createElement([ZamzamAquiferDiagram, ZamzamWaterCycleDiagram, ZamzamPorosityDiagram, ZamzamDarcyLawDiagram, WaterCycleDiagram, ActivityWellModelDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
