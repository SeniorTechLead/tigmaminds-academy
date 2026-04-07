import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KanglaFortLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Draining dynamics — differential equations of moat emptying',
      concept: `When a sluice gate opens, the moat does not drain at a constant rate. As the water level drops, the pressure decreases, which slows the outflow. This creates a **differential equation**:

**dh/dt = -(A_gate / A_moat) x sqrt(2 x g x h)**

Where:
- dh/dt = rate of change of water height
- A_gate = area of the gate opening
- A_moat = surface area of the moat
- h = current water height

This is a **nonlinear ODE** because the rate depends on sqrt(h). We solve it numerically using **Euler's method**: step forward in small time increments, updating h at each step.

The key insight: the moat drains quickly at first (high pressure) and then very slowly at the end (low pressure). The last 10% of water takes longer than the first 50%.`,
      analogy: 'Draining a moat is like deflating a balloon. At first, air rushes out fast because the pressure is high. But as the balloon gets smaller, the pressure drops and the airflow slows. The last bit of air barely trickles out. Water works the same way under gravity.',
      storyConnection: 'Kangla Fort defenders who opened the sluice gates knew they could quickly lower the water level by half — confusing attackers who thought the moat was draining completely. But full drainage took much longer, giving defenders time to prepare.',
      checkQuestion: 'If the moat takes 4 hours to drain from 3m to 1.5m, how long does it take to drain from 1.5m to 0?',
      checkAnswer: 'Much longer than 4 hours. Because flow rate depends on sqrt(h), halving h reduces flow rate by factor sqrt(2) ≈ 1.41. The time to drain from 1.5m to 0 is roughly 4 x sqrt(3/1.5) ≈ 5.7 hours. The total drainage time is about 10 hours, with the second half taking 60% of the total time.',
      codeIntro: 'Solve the moat draining differential equation numerically and plot the water level over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Moat parameters
g = 9.8
A_moat = 1580 * 15       # moat surface area (m²)
gate_width = 2.0
gate_opening = 0.5
A_gate = gate_width * gate_opening
h0 = 3.0                  # initial water height (m)

# Euler's method to solve dh/dt = -(A_gate/A_moat) * sqrt(2*g*h)
dt = 60          # time step: 60 seconds
t_max = 72000    # simulate 20 hours
steps = int(t_max / dt)

t = np.zeros(steps)
h = np.zeros(steps)
h[0] = h0

for i in range(1, steps):
    t[i] = t[i-1] + dt
    if h[i-1] > 0.01:  # stop draining when nearly empty
        dhdt = -(A_gate / A_moat) * np.sqrt(2 * g * h[i-1])
        h[i] = max(0, h[i-1] + dhdt * dt)

t_hours = t / 3600

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(t_hours, h, color='#3b82f6', linewidth=2)
ax1.axhline(y=h0/2, color='#f59e0b', linestyle='--', alpha=0.7, label=f'Half level ({h0/2}m)')
ax1.set_title('Moat Water Level During Draining', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Time (hours)', color='white')
ax1.set_ylabel('Water height (m)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax1.grid(True, alpha=0.2, color='white')

# Flow rate over time
flow_rate = np.where(h > 0.01, A_gate * np.sqrt(2 * g * h) * 1000, 0)
ax2.plot(t_hours, flow_rate, color='#ef4444', linewidth=2)
ax2.set_title('Outflow Rate Over Time', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Time (hours)', color='white')
ax2.set_ylabel('Flow rate (litres/s)', color='white')
ax2.tick_params(colors='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('drain_sim.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

half_idx = np.argmin(np.abs(h - h0/2))
empty_idx = np.argmin(np.abs(h - 0.05))
print(f"Time to half level: {t_hours[half_idx]:.1f} hours")
print(f"Time to nearly empty: {t_hours[empty_idx]:.1f} hours")
print(f"Ratio: the second half takes {(t_hours[empty_idx]-t_hours[half_idx])/t_hours[half_idx]:.1f}x longer")`,
      challenge: 'Add a second sluice gate (double A_gate). How much faster does the moat drain? Is it exactly half the time?',
      successHint: 'You just solved a real differential equation numerically. Euler\'s method is simple but powerful — it is the gateway to computational fluid dynamics.',
    },
    {
      title: 'Earth pressure on retaining walls — Rankine theory',
      concept: `The moat banks are essentially **retaining walls** — they hold back the surrounding earth while the moat is empty, and hold back water when it is full. The **lateral earth pressure** on a wall depends on:

**sigma_h = K x rho_soil x g x z**

Where:
- K = earth pressure coefficient (depends on soil type and wall movement)
- rho_soil = soil density (~1800 kg/m³)
- z = depth below ground surface

For **active pressure** (wall moves away from soil): K_a = (1 - sin(phi)) / (1 + sin(phi))
For **passive pressure** (wall pushes into soil): K_p = (1 + sin(phi)) / (1 - sin(phi))

Where phi is the **angle of internal friction** of the soil (~30° for typical Imphal valley soil).

The total force on the wall is the area under the pressure triangle: **F = 0.5 x K x rho x g x H²**`,
      analogy: 'Earth pressure on a retaining wall is like crowd pressure at a concert. The people at the back push on those in front, who push on those at the barrier. The pressure increases with depth in the crowd — exactly like soil pressure increases with depth.',
      storyConnection: 'The Kangla moat banks had to resist both earth pressure from the outside and water pressure from inside. If either side failed, the moat would collapse or flood the fort. The engineers balanced these opposing forces — a sophisticated structural challenge.',
      checkQuestion: 'Why does the moat bank feel more pressure at the bottom than at the top?',
      checkAnswer: 'Each layer of soil has all the layers above it pressing down on it. At the top, there is zero overburden. At 3m depth, there are 3m x 1800 kg/m³ = 5,400 kg of soil per square metre pressing down. This vertical pressure creates horizontal pressure via the coefficient K, pushing outward on the wall.',
      codeIntro: 'Calculate and plot the earth pressure distribution on the Kangla Fort moat bank.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Soil parameters for Imphal valley
rho_soil = 1800    # kg/m³
g = 9.8            # m/s²
phi = 30           # angle of internal friction (degrees)
phi_rad = np.radians(phi)
H = 4.0            # wall height (metres)

# Rankine coefficients
Ka = (1 - np.sin(phi_rad)) / (1 + np.sin(phi_rad))
Kp = (1 + np.sin(phi_rad)) / (1 - np.sin(phi_rad))

z = np.linspace(0, H, 100)

# Active pressure (moat side — wall moves away)
sigma_active = Ka * rho_soil * g * z
# Passive pressure (fort side — wall pushed into)
sigma_passive = Kp * rho_soil * g * z
# Water pressure (when moat is full to 3m)
h_water = 3.0
sigma_water = np.where(z <= h_water, 1000 * g * z, 1000 * g * h_water)

fig, ax = plt.subplots(1, 1, figsize=(8, 6))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax.plot(sigma_active/1000, z, color='#ef4444', linewidth=2, label=f'Active earth (Ka={Ka:.2f})')
ax.plot(sigma_passive/1000, z, color='#34d399', linewidth=2, label=f'Passive earth (Kp={Kp:.2f})')
ax.plot(sigma_water/1000, z, color='#3b82f6', linewidth=2, linestyle='--', label='Water pressure')
ax.fill_betweenx(z, 0, sigma_active/1000, alpha=0.15, color='#ef4444')
ax.fill_betweenx(z, 0, sigma_water/1000, alpha=0.1, color='#3b82f6')

ax.invert_yaxis()
ax.set_title('Pressure on Kangla Moat Bank vs Depth', color='white', fontsize=13, fontweight='bold')
ax.set_xlabel('Pressure (kPa)', color='white')
ax.set_ylabel('Depth below surface (m)', color='white')
ax.tick_params(colors='white')
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax.grid(True, alpha=0.2, color='white')

# Total forces
F_active = 0.5 * Ka * rho_soil * g * H**2
F_water = 0.5 * 1000 * g * h_water**2
print(f"Ka (active) = {Ka:.3f}, Kp (passive) = {Kp:.3f}")
print(f"Total active earth force: {F_active/1000:.1f} kN per metre of wall")
print(f"Total water force (3m): {F_water/1000:.1f} kN per metre of wall")
print(f"Net force on bank: {abs(F_active - F_water)/1000:.1f} kN/m")

plt.tight_layout()
plt.savefig('earth_pressure.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()`,
      challenge: 'What happens to the earth pressure coefficients if the soil friction angle increases to 35 degrees? Recalculate Ka and Kp. Stronger soil = lower active pressure. Why?',
      successHint: 'Rankine earth pressure theory is used every day by civil engineers designing retaining walls, basement walls, and embankments. You just applied it to an ancient fort.',
    },
    {
      title: 'Seepage analysis — where does the moat leak?',
      concept: `No moat is perfectly waterproof. Water slowly **seeps** through the soil beneath and around the moat. The rate of seepage depends on:

**Darcy's Law: Q = K x A x (dh/dL)**

Where:
- Q = flow rate of seepage (m³/s)
- K = hydraulic conductivity of soil (m/s)
- A = cross-sectional area of flow
- dh/dL = hydraulic gradient (head difference / flow path length)

Clay-rich soils have very low K (10⁻⁹ m/s) — they are nearly waterproof. Sandy soils have high K (10⁻⁴ m/s) — water passes right through.

The Kangla Fort builders likely lined the moat bottom with clay to reduce seepage. We can model seepage as a 2D problem using a grid of cells with different soil types.`,
      analogy: 'Seepage through soil is like water moving through a sponge. A dense sponge (clay) barely lets any water through. A loose sponge (sand) lets water pour through immediately. The hydraulic conductivity K tells you how "spongy" the soil is.',
      storyConnection: 'If the Kangla moat leaked too much, it would drain between rain events and become crossable. The builders needed to ensure the moat held water year-round — which meant understanding and controlling seepage through the moat bed.',
      checkQuestion: 'If the moat bottom is made of clay (K = 10⁻⁹ m/s) and the depth is 3m, how much water seeps through per day per square metre?',
      checkAnswer: 'Seepage rate = K x gradient. If the moat is 3m deep and sits on impermeable bedrock at 10m depth, the gradient ≈ 3/10 = 0.3. Flow per m² = 10⁻⁹ x 0.3 = 3 x 10⁻¹⁰ m³/s = 0.026 mL/day. That is virtually nothing — clay is an excellent sealant.',
      codeIntro: 'Model seepage through different soil layers beneath the Kangla moat.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hydraulic conductivity of different soil types (m/s)
soils = {
    'Gravel':    1e-2,
    'Sand':      1e-4,
    'Silt':      1e-6,
    'Clay':      1e-9,
    'Rammed earth': 5e-8,
}

moat_depth = 3.0       # metres of water
flow_path = 5.0        # distance to water table (metres)
gradient = moat_depth / flow_path
moat_bottom_area = 1580 * 5  # bottom area (length x bottom width)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Log-scale bar chart of conductivity
names = list(soils.keys())
K_values = list(soils.values())
colors = ['#ef4444', '#f59e0b', '#a78bfa', '#34d399', '#60a5fa']
ax1.barh(names, K_values, color=colors, edgecolor='white', linewidth=0.5)
ax1.set_xscale('log')
ax1.set_title('Hydraulic Conductivity by Soil Type', color='white', fontsize=11, fontweight='bold')
ax1.set_xlabel('K (m/s) — log scale', color='white')
ax1.tick_params(colors='white')

# Seepage rate comparison
seepage_rates = [K * gradient * moat_bottom_area * 86400 for K in K_values]  # m³/day
ax2.barh(names, seepage_rates, color=colors, edgecolor='white', linewidth=0.5)
ax2.set_xscale('log')
ax2.set_title('Daily Seepage Through Moat Bottom', color='white', fontsize=11, fontweight='bold')
ax2.set_xlabel('Seepage (m³/day) — log scale', color='white')
ax2.tick_params(colors='white')

plt.tight_layout()
plt.savefig('seepage.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Seepage analysis for Kangla Fort moat:")
print(f"Hydraulic gradient: {gradient:.2f}")
print(f"Moat bottom area: {moat_bottom_area:,} m²")
print()
for name, K in soils.items():
    Q = K * gradient * moat_bottom_area
    Q_day = Q * 86400
    print(f"{name:15s}: K={K:.1e} m/s → seepage = {Q_day:.4f} m³/day ({Q_day*1000:.1f} litres/day)")`,
      challenge: 'If the moat bottom is 50% clay and 50% sand, what is the effective hydraulic conductivity? (Hint: for layers in parallel, K_eff = weighted average. For layers in series, 1/K_eff = sum of 1/Ki.) Which arrangement leaks less?',
      successHint: 'Darcy\'s Law governs groundwater flow worldwide. You just used it to evaluate an ancient waterproofing strategy. Modern engineers use the same law for dams, landfills, and contamination cleanup.',
    },
    {
      title: 'Flood routing — the St. Venant equations simplified',
      concept: `When monsoon rains hit and river levels rise, a **flood wave** travels downstream toward the Kangla moat. How fast does this wave arrive? How high will it be?

The full **St. Venant equations** (shallow water equations) describe flood waves:
1. **Continuity**: dA/dt + dQ/dx = 0 (water is conserved)
2. **Momentum**: dQ/dt + d(Q²/A)/dx + gA(dh/dx) = gA(S₀ - Sf)

For our purposes, we simplify to the **kinematic wave** model:
Q = alpha x A^beta

Where alpha and beta depend on channel shape and roughness. This gives us a single equation we can solve with Euler\'s method to track the flood wave as it approaches the fort.`,
      analogy: 'A flood wave in a river is like a traffic jam on a highway. When cars pile up (rain starts), a wave of congestion moves backward. The wave speed depends on the "density" of traffic. In a river, the flood wave speed depends on water depth and channel shape — and it can move faster or slower than the actual water.',
      storyConnection: 'The Kangla Fort commanders needed warning time before a flood hit the moat. By understanding how flood waves travel, they could predict when to close sluice gates and prepare defences — perhaps hours or even days in advance.',
      checkQuestion: 'Can a flood wave travel faster than the water itself?',
      checkAnswer: 'Yes! The wave celerity (speed of the flood peak) can be 1.5-2x faster than the average water velocity. This is because the wave is a pressure disturbance, not a mass of water moving downstream. Think of a "wave" in a sports stadium — the wave moves around the stadium, but the people stay in their seats.',
      codeIntro: 'Simulate a flood wave approaching Kangla Fort using the kinematic wave model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Kinematic wave flood routing
# Channel parameters
L = 10000        # river length to fort (m)
dx = 100         # spatial step (m)
dt = 30          # time step (seconds)
nx = int(L / dx) + 1
nt = 2000

alpha = 1.5      # kinematic wave parameter
beta = 1.67      # for wide rectangular channel

# Initial conditions — base flow
Q = np.ones(nx) * 5.0  # base flow 5 m³/s
Q_history = np.zeros((nt, nx))
Q_history[0] = Q.copy()

# Upstream boundary — flood hydrograph
t_peak = 600     # peak at step 600
Q_peak = 50.0    # peak flow
for n in range(1, nt):
    # Upstream flood pulse (triangular hydrograph)
    if n < t_peak:
        Q[0] = 5.0 + (Q_peak - 5.0) * (n / t_peak)
    elif n < 2 * t_peak:
        Q[0] = Q_peak - (Q_peak - 5.0) * ((n - t_peak) / t_peak)
    else:
        Q[0] = 5.0

    # Solve kinematic wave equation (explicit upwind scheme)
    for i in range(1, nx):
        A = (Q[i] / alpha) ** (1 / beta)
        c = alpha * beta * A ** (beta - 1)  # wave celerity
        courant = c * dt / dx
        Q[i] = Q[i] - courant * (Q[i] - Q[i-1])
        Q[i] = max(Q[i], 0.1)

    Q_history[n] = Q.copy()

# Plot results
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

times_to_plot = [0, 400, 800, 1200, 1600]
x_km = np.linspace(0, L/1000, nx)
colors_wave = ['#6b7280', '#3b82f6', '#f59e0b', '#ef4444', '#34d399']
for idx, t_step in enumerate(times_to_plot):
    hours = t_step * dt / 3600
    ax1.plot(x_km, Q_history[t_step], color=colors_wave[idx], linewidth=2, label=f't={hours:.1f}h')

ax1.set_title('Flood Wave Moving Toward Kangla Fort', color='white', fontsize=11, fontweight='bold')
ax1.set_xlabel('Distance from upstream (km)', color='white')
ax1.set_ylabel('Flow rate (m³/s)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax1.grid(True, alpha=0.2, color='white')

# Hydrograph at the fort (last cell)
t_hours = np.arange(nt) * dt / 3600
ax2.plot(t_hours, Q_history[:, 0], color='#3b82f6', linewidth=2, label='Upstream')
ax2.plot(t_hours, Q_history[:, -1], color='#ef4444', linewidth=2, label='At fort')
ax2.set_title('Flood Hydrograph — Upstream vs Fort', color='white', fontsize=11, fontweight='bold')
ax2.set_xlabel('Time (hours)', color='white')
ax2.set_ylabel('Flow rate (m³/s)', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('flood_wave.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

peak_upstream = np.max(Q_history[:, 0])
peak_fort = np.max(Q_history[:, -1])
delay = (np.argmax(Q_history[:, -1]) - np.argmax(Q_history[:, 0])) * dt / 3600
print(f"Peak upstream: {peak_upstream:.1f} m³/s")
print(f"Peak at fort: {peak_fort:.1f} m³/s (attenuated by {(1-peak_fort/peak_upstream)*100:.0f}%)")
print(f"Travel time: {delay:.1f} hours")`,
      challenge: 'What happens if you increase the channel roughness (decrease alpha to 1.0)? The wave should slow down and attenuate more. Verify this by running the simulation.',
      successHint: 'You just modelled flood wave propagation — a core problem in hydrology. Real flood warning systems use similar (but more complex) models to predict when rivers will overflow.',
    },
    {
      title: 'Fortification optimisation — the ideal moat shape',
      concept: `Given a fixed volume of earth to excavate, what moat shape provides the **maximum defensive benefit**? This is an **optimization problem**.

A wider, shallower moat covers more ground but is easier to wade through. A narrow, deep moat is harder to cross but covers less area. The optimal shape maximizes a **defence score** that combines:
- **Depth factor**: deeper = harder to cross (exponential benefit)
- **Width factor**: wider = more exposure time for attackers (linear benefit)
- **Volume constraint**: the total excavation volume is fixed

We can use a **class** to encapsulate the moat design and evaluate different configurations systematically.`,
      analogy: 'Moat optimization is like choosing the shape of a swimming pool. A lap pool (long and narrow) is good for swimming laps. A splash pool (wide and shallow) is good for playing. An optimal moat is like designing a pool that is both hard to swim across AND hard to walk through — you need to balance depth and width.',
      storyConnection: 'The Kangla Fort builders did not just dig randomly. The moat\'s dimensions were a deliberate engineering choice: wide enough to prevent attackers from throwing grappling hooks across, deep enough to prevent wading, and shaped to resist bank collapse.',
      checkQuestion: 'If you have enough labour to excavate 50,000 cubic metres, should you make the moat 20m wide x 2m deep or 10m wide x 4m deep? (Assume 1580m perimeter.)',
      checkAnswer: 'Volume check: 20x2x1580 = 63,200 (too much). 10x4x1580 = 63,200 (also too much at full perimeter). For 50,000 m³: 20x2 = 40m² cross-section → length = 1,250m. Or 10x4 = 40m² → same. But the deeper moat is far more effective: at 4m depth, an armoured soldier cannot touch the bottom, and water pressure makes swimming nearly impossible. Depth wins.',
      codeIntro: 'Build a MoatDesign class and optimise the moat shape for maximum defence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class MoatDesign:
    def __init__(self, width, depth, perimeter=1580):
        self.width = width
        self.depth = depth
        self.perimeter = perimeter

    def volume(self):
        # Trapezoidal cross-section (bottom = 60% of top width)
        bottom_width = self.width * 0.6
        area = 0.5 * (self.width + bottom_width) * self.depth
        return area * self.perimeter

    def defence_score(self):
        # Depth matters exponentially (hard to cross when deep)
        depth_factor = 1 - np.exp(-self.depth / 1.5)
        # Width matters linearly (more exposure time)
        width_factor = min(self.width / 20, 1.0)
        return depth_factor * 0.6 + width_factor * 0.4

    def __repr__(self):
        return f"Moat({self.width:.0f}m x {self.depth:.1f}m, vol={self.volume():,.0f}m³, score={self.defence_score():.3f})"

# Fixed excavation budget
target_volume = 50000  # m³

# Try all combinations
widths = np.arange(5, 30, 0.5)
best_score = 0
best_design = None
results = []

for w in widths:
    # Solve for depth given width and volume
    bottom_w = w * 0.6
    cross_area = target_volume / 1580
    d = cross_area / (0.5 * (w + w * 0.6))
    if d > 0.5 and d < 8:
        design = MoatDesign(w, d)
        score = design.defence_score()
        results.append((w, d, score))
        if score > best_score:
            best_score = score
            best_design = design

results = np.array(results)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(results[:, 0], results[:, 1], 'o-', color='#3b82f6', markersize=3)
ax1.set_title('Width vs Depth (Fixed Volume)', color='white', fontsize=11, fontweight='bold')
ax1.set_xlabel('Width (m)', color='white')
ax1.set_ylabel('Depth (m)', color='white')
ax1.tick_params(colors='white')
ax1.grid(True, alpha=0.2, color='white')

ax2.plot(results[:, 0], results[:, 2], 'o-', color='#34d399', markersize=3)
best_idx = np.argmax(results[:, 2])
ax2.plot(results[best_idx, 0], results[best_idx, 2], 'o', color='#ef4444', markersize=12, label='Optimal')
ax2.set_title('Defence Score vs Width', color='white', fontsize=11, fontweight='bold')
ax2.set_xlabel('Width (m)', color='white')
ax2.set_ylabel('Defence score', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('moat_optimize.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()
print(f"Optimal design: {best_design}")
print(f"Budget: {target_volume:,} m³ excavation")`,
      challenge: 'Change the defence_score formula to weight depth more heavily (0.8 depth, 0.2 width). How does the optimal design change? What about 0.5/0.5 weighting?',
      successHint: 'You just solved a constrained optimization problem using a Python class. This approach — define an objective function, sweep parameter space, find the best — is the foundation of all engineering design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Hydraulic Modelling</span>
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
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
