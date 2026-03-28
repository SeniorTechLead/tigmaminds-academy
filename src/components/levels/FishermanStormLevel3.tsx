import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';
import MonsoonDiagram from '../diagrams/MonsoonDiagram';
import CycloneCrossSectionDiagram from '../diagrams/CycloneCrossSectionDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';
import BuoyancyDiagram from '../diagrams/BuoyancyDiagram';
import ClimateFactorsDiagram from '../diagrams/ClimateFactorsDiagram';

export default function FishermanStormLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Atmospheric Pressure & Pressure Systems',
      concept: `Every square meter of Earth\'s surface has roughly 10,000 kilograms of air sitting above it. That column of air exerts a force we call **atmospheric pressure** — about 101,325 Pascals (1 atm) at sea level. Small regional differences in this pressure drive all weather.

When air warms, it rises and leaves behind a region of **low pressure** at the surface. When air cools, it sinks and creates **high pressure**. The atmosphere constantly tries to equalize these differences: air flows from high-pressure regions toward low-pressure regions. This flow is **wind**. The steeper the pressure difference over a given distance — the **pressure gradient** — the stronger the wind.

Meteorologists draw lines of equal pressure on weather maps called **isobars**. Tightly packed isobars mean a steep gradient and strong winds. Widely spaced isobars mean gentle breezes. A low-pressure center with concentric isobars closing inward is a storm. A high-pressure center with outward isobars is calm, clear weather. Reading isobars is like reading a topographic map — the "valleys" are lows and the "hills" are highs, and air flows "downhill" from high to low.`,
      analogy: 'Pressure gradients work like water on a tilted table. Pour water on one end (high pressure) and it flows toward the lower end (low pressure). The steeper you tilt the table, the faster the water moves. Isobars are the contour lines showing how steep the tilt is at each point.',
      storyConnection: 'The fisherman\'s daughter on the Brahmaputra learned to read the sky before setting out. When the barometric pressure dropped rapidly, the old fishermen knew a storm was building over the Bay of Bengal. That pressure drop — air rushing upward into a growing low — was the first sign that a cyclone was feeding off the warm ocean surface hundreds of kilometers to the south.',
      checkQuestion: 'If isobars on a weather map are very close together over the Bay of Bengal but far apart over central Assam, where would you expect stronger winds and why?',
      checkAnswer: 'Over the Bay of Bengal. Close isobars indicate a steep pressure gradient — a large pressure difference over a short distance. Air accelerates down this gradient, producing strong winds. Over central Assam, the wide spacing means a gentle gradient and light winds. Wind speed is proportional to the pressure gradient, not to the absolute pressure value.',
      codeIntro: 'Simulate a pressure field with a low-pressure center, compute the pressure gradient, and visualize isobars and wind vectors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a 2D pressure field with a low-pressure center
# Simulating a Bay of Bengal cyclone-like pattern
nx, ny = 100, 100
x = np.linspace(0, 1000, nx)  # km
y = np.linspace(0, 1000, ny)  # km
X, Y = np.meshgrid(x, y)

# Low-pressure center at (600, 500) — over Bay of Bengal
cx, cy = 600, 500
r = np.sqrt((X - cx)**2 + (Y - cy)**2)

# Pressure field: ambient 1013 hPa with a Gaussian low
p_ambient = 1013.0  # hPa
p_drop = 60.0       # maximum pressure deficit (strong cyclone)
sigma = 200.0       # radius of influence in km
P = p_ambient - p_drop * np.exp(-r**2 / (2 * sigma**2))

# Compute pressure gradient (force per unit mass ~ -grad(P))
dpdy, dpdx = np.gradient(P, y[1] - y[0], x[1] - x[0])

# Wind is proportional to negative pressure gradient
# (simplified — ignoring Coriolis for now)
wind_u = -dpdx * 50  # scale factor for visualization
wind_v = -dpdy * 50

# Compute wind speed
wind_speed = np.sqrt(wind_u**2 + wind_v**2)

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left: isobar map
ax = axes[0]
ax.set_facecolor('#111827')
levels = np.arange(950, 1020, 4)
cs = ax.contour(X, Y, P, levels=levels, colors='#60a5fa', linewidths=0.8)
ax.clabel(cs, fontsize=7, fmt='%.0f hPa', colors='white')
ax.plot(cx, cy, 'r+', markersize=15, markeredgewidth=2)
ax.set_title('Isobar Map (pressure contours)', color='white', fontsize=12)
ax.set_xlabel('East-West (km)', color='white')
ax.set_ylabel('North-South (km)', color='white')
ax.tick_params(colors='gray')
ax.annotate('LOW', (cx + 15, cy + 15), color='#ef4444', fontsize=14, fontweight='bold')

# Right: wind vectors + speed
ax = axes[1]
ax.set_facecolor('#111827')
skip = 6
im = ax.pcolormesh(X, Y, wind_speed, cmap='YlOrRd', shading='auto')
ax.quiver(X[::skip, ::skip], Y[::skip, ::skip],
          wind_u[::skip, ::skip], wind_v[::skip, ::skip],
          color='white', alpha=0.7, scale=80, width=0.003)
ax.plot(cx, cy, 'r+', markersize=15, markeredgewidth=2)
ax.set_title('Wind speed & direction (gradient flow)', color='white', fontsize=12)
ax.set_xlabel('East-West (km)', color='white')
ax.set_ylabel('North-South (km)', color='white')
ax.tick_params(colors='gray')
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Wind speed (relative)', color='white')
cbar.ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Atmospheric Pressure Analysis")
print("=" * 50)
print(f"Ambient pressure: {p_ambient:.0f} hPa")
print(f"Center pressure:  {P[ny//2, 60]:.1f} hPa (at cyclone center)")
print(f"Pressure deficit: {p_drop:.0f} hPa")
print(f"Max wind speed:   {wind_speed.max():.2f} (relative units)")
print(f"Min wind speed:   {wind_speed[ny//2, 60]:.4f} (at center — the eye)")
print()
print("Key insight: wind is ZERO at the exact center (eye)")
print("and MAXIMUM where the isobars are most tightly packed.")
print("The pressure gradient drives the wind, not pressure itself.")`,
      challenge: 'Add a second high-pressure system at (200, 500). Observe how the wind pattern changes between the two systems. Where is the "squeeze zone" with the strongest winds?',
      successHint: 'Pressure gradients are the engine of all weather. Every cyclone, monsoon, and sea breeze starts with uneven heating creating pressure differences. The atmosphere is a giant heat engine constantly trying to reach equilibrium — and never succeeding.',
    },
    {
      title: 'Coriolis Effect & Cyclone Formation',
      concept: `Earth rotates. This single fact transforms simple pressure-gradient winds into spinning cyclones. The **Coriolis effect** is not a real force — it is an apparent deflection that arises because we observe motion from a rotating reference frame.

Imagine standing at the North Pole and throwing a ball southward. While the ball is in the air, the Earth rotates underneath it from west to east. To you (rotating with Earth), the ball appears to curve to the right. In the Southern Hemisphere the deflection is to the left. At the equator there is no deflection — the Coriolis parameter f = 2 * omega * sin(latitude) is zero there.

When air rushes inward toward a low-pressure center in the Northern Hemisphere, Coriolis deflects it to the right. Instead of flowing straight in, the air spirals **counterclockwise** around the low. This creates a cyclone. The balance between the inward pressure gradient force and the outward Coriolis deflection is called **geostrophic balance** — winds blow parallel to the isobars rather than across them. Near the surface, friction slows the wind and breaks this balance slightly, allowing air to spiral inward and feed the storm. At the center, the strongest rotation and an area of forced subsidence create the characteristic **eye** — a patch of eerily calm, clear sky surrounded by the most violent winds in the eyewall.`,
      analogy: 'Sit on a spinning merry-go-round and try to roll a ball to a friend on the opposite side. The ball appears to curve away because the platform rotates underneath it. You would swear a sideways force pushed it — that is the Coriolis effect. The faster the merry-go-round spins (higher latitude), the stronger the apparent deflection.',
      storyConnection: 'Cyclones that strike the Bay of Bengal and push flood waters up the Brahmaputra form because the warm tropical ocean provides energy while the Coriolis effect provides spin. The fisherman\'s daughter watched the spiral cloud bands on a borrowed radio weather report — those spiral arms are the visible signature of Coriolis deflection organizing chaotic updrafts into a single rotating engine of destruction.',
      checkQuestion: 'Why do tropical cyclones almost never form within 5 degrees of the equator, even though sea surface temperatures there are very warm?',
      checkAnswer: 'The Coriolis parameter f = 2 * omega * sin(latitude) approaches zero near the equator. Without sufficient Coriolis deflection, inward-flowing air cannot be organized into rotation. The air simply converges and rises without spinning. You need enough Coriolis force to initiate and sustain the spin, which requires at least ~5 degrees latitude. This is why cyclones form in the tropical belt but never on the equator itself.',
      codeIntro: 'Model air parcels flowing toward a low-pressure center with and without the Coriolis effect. Watch how Coriolis transforms radial inflow into a spinning cyclone.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate air parcel trajectories toward a low-pressure center
# With and without Coriolis effect

dt = 60.0       # time step in seconds
n_steps = 800
lat = 20.0      # degrees N (Bay of Bengal)
omega = 7.2921e-5  # Earth\'s angular velocity (rad/s)
f = 2 * omega * np.sin(np.radians(lat))  # Coriolis parameter

# Low-pressure center at origin
# Pressure gradient force: points inward, magnitude decreases with distance
def pressure_gradient_force(x, y, strength=0.0003):
    r = np.sqrt(x**2 + y**2) + 1.0  # avoid division by zero
    fx = -strength * x / r
    fy = -strength * y / r
    return fx, fy

def simulate_parcels(use_coriolis=True, friction=0.00001):
    """Simulate air parcels from 8 directions."""
    n_parcels = 12
    angles = np.linspace(0, 2 * np.pi, n_parcels, endpoint=False)
    r0 = 300000.0  # initial distance: 300 km

    all_trajectories = []
    for angle in angles:
        x, y = r0 * np.cos(angle), r0 * np.sin(angle)
        vx, vy = 0.0, 0.0
        traj = [(x, y)]
        for _ in range(n_steps):
            pgfx, pgfy = pressure_gradient_force(x, y)
            # Acceleration = pressure gradient + Coriolis + friction
            ax_total = pgfx - friction * vx
            ay_total = pgfy - friction * vy
            if use_coriolis:
                ax_total += f * vy   # Coriolis: +fv in x
                ay_total += -f * vx  # Coriolis: -fu in y
            vx += ax_total * dt
            vy += ay_total * dt
            x += vx * dt
            y += vy * dt
            traj.append((x, y))
        all_trajectories.append(np.array(traj))
    return all_trajectories

traj_no_cor = simulate_parcels(use_coriolis=False)
traj_cor = simulate_parcels(use_coriolis=True)

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

titles = ['WITHOUT Coriolis (no rotation)', 'WITH Coriolis (Northern Hemisphere)']
datasets = [traj_no_cor, traj_cor]
colors = plt.cm.Set3(np.linspace(0, 1, 12))

for ax, trajs, title in zip(axes, datasets, titles):
    ax.set_facecolor('#111827')
    for i, traj in enumerate(trajs):
        ax.plot(traj[:, 0] / 1000, traj[:, 1] / 1000,
                color=colors[i], linewidth=1, alpha=0.8)
        ax.plot(traj[0, 0] / 1000, traj[0, 1] / 1000,
                'o', color=colors[i], markersize=4)
        ax.plot(traj[-1, 0] / 1000, traj[-1, 1] / 1000,
                's', color=colors[i], markersize=3)
    ax.plot(0, 0, 'r+', markersize=20, markeredgewidth=3)
    ax.annotate('LOW', (5, 5), color='#ef4444', fontsize=14, fontweight='bold')
    ax.set_title(title, color='white', fontsize=12)
    ax.set_xlabel('East-West (km)', color='white')
    ax.set_ylabel('North-South (km)', color='white')
    ax.set_aspect('equal')
    ax.tick_params(colors='gray')
    ax.set_xlim(-400, 400)
    ax.set_ylim(-400, 400)
    ax.grid(True, alpha=0.1, color='gray')

plt.tight_layout()
plt.show()

print("Coriolis Effect Simulation")
print("=" * 50)
print(f"Latitude: {lat}° N")
print(f"Coriolis parameter f = {f:.6e} s⁻¹")
print()
print("WITHOUT Coriolis: parcels flow straight toward the center")
print("  -> no rotation, air just piles up, no organized storm")
print()
print("WITH Coriolis: parcels curve right (NH), creating CCW rotation")
print("  -> organized cyclonic spiral, air never reaches center")
print("  -> this is why the 'eye' exists: Coriolis prevents convergence")
print()
print("At the equator, f = 0 -> no spin -> no cyclones.")
print("This is why Bay of Bengal cyclones form around 10-15°N.")`,
      challenge: 'Change the latitude to -20 (Southern Hemisphere) and observe the direction of rotation. Then try lat=2 (near equator) — can a cyclone form? What happens to the trajectories?',
      successHint: 'The Coriolis effect is subtle — only 0.00007 radians per second — but over hundreds of kilometers and many hours, it bends wind into the spiral patterns visible from space. Understanding this "fictitious force" is key to understanding every large-scale weather system on Earth.',
    },
    {
      title: 'Sea Surface Temperature & Storm Energy',
      concept: `A cyclone is a heat engine. It converts thermal energy from the ocean into the kinetic energy of wind. The fuel is **water vapor**: warm ocean water evaporates, and when that vapor condenses into clouds high in the atmosphere, it releases **latent heat** — roughly 2.5 million joules per kilogram of water. This heat warms the air column, which lowers surface pressure further, which draws in more air, which evaporates more water. This positive feedback loop is what makes cyclones self-sustaining.

The critical threshold is a **sea surface temperature (SST) of about 26.5°C** (80°F), and the warmth must extend to a depth of at least 50 meters. Below this temperature, evaporation rates are too low to sustain the feedback loop. Above it, the ocean becomes a practically unlimited energy source. The Bay of Bengal in pre-monsoon season (April-May) and post-monsoon season (October-November) routinely reaches 28-30°C — ideal cyclone fuel.

The relationship between SST and evaporation follows the **Clausius-Clapeyron equation**: for every 1°C increase in temperature, the saturation vapor pressure increases by about 7%. Warmer oceans do not just provide more energy — they provide exponentially more moisture to the atmosphere. A cyclone passing over a patch of 30°C water has access to far more latent heat than one over 27°C water, which is why SST is the single best predictor of a cyclone's potential intensity.`,
      analogy: 'Think of SST as the size of the fuel tank in a car engine. Below 26.5°C the tank is essentially empty — the engine sputters and dies. Above that threshold, the tank is full and the engine roars. A warm ocean patch is like driving over a series of gas stations: the cyclone keeps refueling. A cold wake left behind by a previous storm is like a stretch of highway with no gas — the cyclone weakens.',
      storyConnection: 'The fisherman\'s daughter knew that late October was the most dangerous time on the water. The Bay of Bengal surface was still bath-warm from summer, storing immense energy. When the old fishermen said "the sea is angry," they were sensing the same thing satellite sensors now measure: SST values that signal the ocean is primed to birth a monster storm. The warm Brahmaputra outflow into the Bay even adds a lens of fresh, warm water that resists mixing — trapping heat near the surface.',
      checkQuestion: 'A cyclone passes over a region of ocean and SST drops from 29°C to 25°C in its wake. Why does the SST drop, and what would happen to a second cyclone following the same path a few days later?',
      checkAnswer: 'The cyclone\'s strong winds churn the ocean, mixing cold deep water up to the surface. Evaporation also removes heat. The cold wake (25°C, below the 26.5°C threshold) means a second cyclone following the same track would lose its energy source and weaken significantly. This is called "negative feedback" — the cyclone poisons its own fuel supply. It takes 1-2 weeks for solar heating to restore SST. This is one reason why back-to-back major cyclones on the same track are rare.',
      codeIntro: 'Model the Clausius-Clapeyron relationship, compute evaporation rates vs SST, and simulate how a cyclone\'s energy budget depends on ocean temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Clausius-Clapeyron: saturation vapor pressure vs temperature
def saturation_vapor_pressure(T_celsius):
    """August-Roche-Magnus formula for saturation vapor pressure (hPa)."""
    return 6.1094 * np.exp((17.625 * T_celsius) / (T_celsius + 243.04))

# Temperature range
T = np.linspace(15, 35, 200)
e_sat = saturation_vapor_pressure(T)

# Latent heat release rate (proportional to evaporation)
L_v = 2.5e6  # J/kg latent heat of vaporization
rho_air = 1.2  # kg/m³
C_e = 0.0012   # bulk transfer coefficient
U_wind = 30.0  # typical cyclone wind speed (m/s)

# Evaporation rate ~ C_e * U * (e_sat(SST) - e_air) / pressure
# Simplified: assume ambient humidity ~70% at reference temp 20°C
e_air = 0.7 * saturation_vapor_pressure(20)
evap_rate = C_e * U_wind * (saturation_vapor_pressure(T) - e_air)
evap_rate = np.maximum(evap_rate, 0)  # no negative evaporation

# Energy flux to atmosphere (W/m²)
energy_flux = L_v * rho_air * evap_rate

# Maximum potential intensity (simplified Emanuel 1986)
# V_max ~ sqrt(C_k/C_d * (SST - T_outflow) * L_v * delta_q / T_outflow)
T_outflow = -70 + 273.15  # outflow temperature ~-70°C in Kelvin
T_sst_K = T + 273.15
delta_q = (saturation_vapor_pressure(T) - e_air) / 1013.0  # mixing ratio proxy
V_max = np.sqrt(np.maximum(0.9 * (T_sst_K - T_outflow) * L_v * np.abs(delta_q) / T_outflow, 0))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Clausius-Clapeyron curve
ax = axes[0, 0]
ax.plot(T, e_sat, color='#f59e0b', linewidth=2)
ax.axvline(26.5, color='#ef4444', linestyle='--', linewidth=1.5, label='Cyclone threshold (26.5°C)')
ax.fill_between(T, 0, e_sat, where=(T >= 26.5), alpha=0.15, color='#ef4444')
ax.set_title('Clausius-Clapeyron: Saturation Vapor Pressure', color='white')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Saturation vapor pressure (hPa)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2. Evaporation rate vs SST
ax = axes[0, 1]
ax.plot(T, evap_rate * 1000, color='#22c55e', linewidth=2)
ax.axvline(26.5, color='#ef4444', linestyle='--', linewidth=1.5)
ax.set_title('Evaporation Rate vs Sea Surface Temperature', color='white')
ax.set_xlabel('SST (°C)', color='white')
ax.set_ylabel('Evaporation rate (×10⁻³)', color='white')

# 3. Energy flux to atmosphere
ax = axes[1, 0]
ax.plot(T, energy_flux / 1000, color='#a855f7', linewidth=2)
ax.axvline(26.5, color='#ef4444', linestyle='--', linewidth=1.5)
ax.fill_between(T, 0, energy_flux / 1000, where=(T >= 26.5), alpha=0.15, color='#a855f7')
ax.set_title('Latent Heat Flux to Atmosphere', color='white')
ax.set_xlabel('SST (°C)', color='white')
ax.set_ylabel('Energy flux (kW/m²)', color='white')

# 4. Maximum potential intensity
ax = axes[1, 1]
ax.plot(T, V_max, color='#3b82f6', linewidth=2)
ax.axvline(26.5, color='#ef4444', linestyle='--', linewidth=1.5)
ax.axhline(33, color='#f59e0b', linestyle=':', linewidth=1, label='Cat 1 threshold (33 m/s)')
ax.axhline(50, color='#f97316', linestyle=':', linewidth=1, label='Cat 3 threshold (50 m/s)')
ax.axhline(70, color='#ef4444', linestyle=':', linewidth=1, label='Cat 5 threshold (70 m/s)')
ax.set_title('Maximum Potential Intensity vs SST', color='white')
ax.set_xlabel('SST (°C)', color='white')
ax.set_ylabel('Max wind speed (m/s)', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# 7% rule verification
e26 = saturation_vapor_pressure(26)
e27 = saturation_vapor_pressure(27)
pct_increase = (e27 - e26) / e26 * 100

print("Sea Surface Temperature & Cyclone Energy")
print("=" * 50)
print(f"Clausius-Clapeyron 7% rule check:")
print(f"  e_sat(26°C) = {e26:.2f} hPa")
print(f"  e_sat(27°C) = {e27:.2f} hPa")
print(f"  Increase:     {pct_increase:.1f}% (theoretical: ~7%)")
print()
print(f"Energy flux at 25°C: {energy_flux[np.argmin(np.abs(T-25))]/1000:.1f} kW/m²")
print(f"Energy flux at 28°C: {energy_flux[np.argmin(np.abs(T-28))]/1000:.1f} kW/m²")
print(f"Energy flux at 31°C: {energy_flux[np.argmin(np.abs(T-31))]/1000:.1f} kW/m²")
print()
print("Bay of Bengal pre-monsoon SST: 28-30°C -> massive energy available")
print("This is why the Bay produces the deadliest cyclones on Earth.")`,
      challenge: 'Add a "cold wake" simulation: after a cyclone passes, SST drops by 3-4°C in a 200km-wide swath. Plot the original and post-cyclone SST field, and calculate how much the energy flux drops in the wake.',
      successHint: 'The ocean is the battery and Clausius-Clapeyron is the voltage regulator. Understanding this thermodynamic relationship is the key to understanding why small changes in SST translate to large changes in storm intensity — and why climate scientists are so concerned about warming oceans.',
    },
    {
      title: 'Numerical Weather Prediction',
      concept: `Weather forecasting was revolutionized when Lewis Fry Richardson proposed in 1922 that you could predict weather by solving the equations of fluid dynamics on a grid. He was right — but it took decades of computer development before the idea became practical. Modern **numerical weather prediction (NWP)** discretizes the atmosphere into millions of grid cells (typically 10-25 km on a side, with 50-100 vertical levels) and advances the state forward in time by solving the **primitive equations**: conservation of mass, momentum, and energy applied to a thin fluid on a rotating sphere.

At each time step (typically 1-10 minutes), the model computes how temperature, pressure, humidity, and wind change in every grid cell based on its current state and interactions with neighboring cells. This includes advection (air moving stuff around), pressure gradient forces, Coriolis deflection, radiation from the sun, heat exchange with the ocean, cloud formation, and turbulent mixing. Processes smaller than the grid scale — individual clouds, turbulence, convection — must be **parameterized**: approximated by statistical formulas rather than resolved directly.

Why do forecasts degrade with time? Because the atmosphere is a **chaotic system**: tiny differences in initial conditions amplify exponentially. Edward Lorenz discovered in 1963 that even rounding a number from 0.506127 to 0.506 changed the entire forecast after a few simulated days. This is the "butterfly effect." Modern ensemble forecasting runs the same model 20-50 times with slightly different initial conditions. Where the ensembles agree, we are confident. Where they diverge, uncertainty is high. This is why a 3-day cyclone track forecast is much more reliable than a 7-day one.`,
      analogy: 'Imagine predicting the path of a billiard ball after 50 collisions. Each collision amplifies tiny errors in your estimate of the ball\'s angle and speed. After 5 collisions your prediction is good. After 15, it is decent. After 50, you are essentially guessing. NWP faces the same problem: each time step is a "collision" where small errors grow. Ensemble forecasting is like running the billiard simulation 50 times with slightly different starting angles and seeing where the balls cluster.',
      storyConnection: 'When Cyclone Aila hit the Bay of Bengal in 2009, numerical weather models predicted its track days in advance — but the exact landfall location was uncertain by hundreds of kilometers. For fishing communities along the Brahmaputra delta, that uncertainty was the difference between evacuation and catastrophe. The fisherman\'s daughter\'s village relied on forecasts that were run on supercomputers thousands of kilometers away — models that discretized their entire world into 25 km boxes.',
      checkQuestion: 'If a weather model uses 25 km grid cells, can it directly simulate a thunderstorm that is 5 km wide? What approach does the model use instead?',
      checkAnswer: 'No. The thunderstorm is smaller than the grid cell, so it cannot be resolved directly. The model uses parameterization: a set of statistical formulas that estimate the aggregate effect of many sub-grid thunderstorms based on grid-scale variables like humidity, temperature, and wind shear. This is one of the largest sources of error in weather models, because parameterizations are approximations — they capture average behavior but miss individual storm details.',
      codeIntro: 'Build a simplified 2D atmospheric model: discretize a pressure field, solve for wind using the momentum equation with Coriolis, and advance the system forward in time. Then demonstrate chaos by running two nearly identical simulations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified 2D shallow-water model on a grid
# Demonstrates: discretization, time-stepping, and chaos

np.random.seed(42)

# Grid setup
nx, ny = 50, 50
Lx, Ly = 2000e3, 2000e3  # 2000 km domain
dx = Lx / nx
dy = Ly / ny
dt = 300.0  # 5-minute time step
n_steps = 200  # ~16 hours of simulation

# Initialize height field (proxy for pressure)
x = np.linspace(0, Lx, nx)
y = np.linspace(0, Ly, ny)
X, Y = np.meshgrid(x, y)

def create_initial_condition(perturbation=0.0):
    """Create initial pressure field with optional tiny perturbation."""
    H0 = 10000.0  # mean height (m)
    # Low-pressure center
    cx, cy = Lx * 0.6, Ly * 0.5
    r = np.sqrt((X - cx)**2 + (Y - cy)**2)
    h = H0 - 500 * np.exp(-r**2 / (300e3)**2)
    # Add tiny perturbation to test chaos
    h += perturbation * np.random.randn(ny, nx)
    return h

def simple_advection_step(h, u, v, dt, dx, dy):
    """One time step of advection using upwind scheme."""
    # Compute gradients
    dhdx = np.zeros_like(h)
    dhdy = np.zeros_like(h)
    dhdx[:, 1:-1] = (h[:, 2:] - h[:, :-2]) / (2 * dx)
    dhdy[1:-1, :] = (h[2:, :] - h[:-2, :]) / (2 * dy)
    # Advect
    h_new = h - dt * (u * dhdx + v * dhdy)
    return h_new

# Run two simulations: one unperturbed, one with tiny perturbation
results = {}
for label, pert in [('Control', 0.0), ('Perturbed (+0.01m)', 0.01)]:
    h = create_initial_condition(pert)
    snapshots = [h.copy()]
    f = 5e-5  # Coriolis parameter

    for step in range(n_steps):
        # Geostrophic wind from pressure gradient
        dhdx = np.zeros_like(h)
        dhdy = np.zeros_like(h)
        dhdx[:, 1:-1] = (h[:, 2:] - h[:, :-2]) / (2 * dx)
        dhdy[1:-1, :] = (h[2:, :] - h[:-2, :]) / (2 * dy)

        g = 9.81
        u = -g / f * dhdy  # geostrophic wind
        v = g / f * dhdx

        h = simple_advection_step(h, u, v, dt, dx, dy)
        # Simple boundary: hold edges fixed
        h[0, :] = h[1, :]
        h[-1, :] = h[-2, :]
        h[:, 0] = h[:, 1]
        h[:, -1] = h[:, -2]

        if step in [50, 100, 199]:
            snapshots.append(h.copy())
    results[label] = snapshots

# Compute difference between runs
diffs = []
for i in range(len(results['Control'])):
    diffs.append(results['Perturbed (+0.01m)'][i] - results['Control'][i])

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')

times = ['t=0', 't=4h', 't=8h', 't=16h']

for col in range(4):
    # Top row: control run
    ax = axes[0, col]
    ax.set_facecolor('#111827')
    im = ax.pcolormesh(X / 1e3, Y / 1e3, results['Control'][col],
                       cmap='RdBu_r', shading='auto')
    ax.set_title(f'Control — {times[col]}', color='white', fontsize=10)
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

    # Bottom row: difference (chaos amplification)
    ax = axes[1, col]
    ax.set_facecolor('#111827')
    vmax = max(np.abs(diffs[col]).max(), 0.01)
    im = ax.pcolormesh(X / 1e3, Y / 1e3, diffs[col],
                       cmap='RdBu_r', shading='auto',
                       vmin=-vmax, vmax=vmax)
    ax.set_title(f'Difference — {times[col]}', color='white', fontsize=10)
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

axes[0, 0].set_ylabel('Control run (km)', color='white')
axes[1, 0].set_ylabel('Error growth (km)', color='white')

plt.tight_layout()
plt.show()

print("Numerical Weather Prediction: Chaos Demonstration")
print("=" * 55)
print(f"Grid: {nx}x{ny} cells, {dx/1000:.0f} km resolution")
print(f"Time step: {dt:.0f} seconds")
print(f"Initial perturbation: 0.01 meters (1 cm!)")
print()
for i, t in enumerate(times):
    max_diff = np.abs(diffs[i]).max()
    mean_diff = np.abs(diffs[i]).mean()
    print(f"  {t}: max error = {max_diff:.4f} m, mean error = {mean_diff:.6f} m")
print()
print("Even a 1 cm perturbation grows over time — that\'s chaos.")
print("This is why weather forecasts beyond 10 days are unreliable.")
print("Ensemble forecasting: run 50 models, see where they agree.")`,
      challenge: 'Run an "ensemble" of 10 simulations with random perturbations of different magnitudes (0.001 to 0.1 m). At each time snapshot, compute the ensemble spread. How quickly does the spread saturate?',
      successHint: 'Numerical weather prediction is humanity\'s most successful application of physics to prediction. Yet chaos guarantees a fundamental limit. The art of forecasting is quantifying uncertainty honestly — telling a fisherman not just "the storm is coming" but "there is a 70% chance it hits within 100 km of here."',
    },
    {
      title: 'Storm Surge & Coastal Flooding',
      concept: `When a cyclone approaches the coast, it pushes a dome of ocean water ahead of it. This **storm surge** — water piled up by wind stress and low atmospheric pressure — is responsible for more cyclone deaths than wind itself. The Bay of Bengal is the deadliest basin on Earth for storm surge because of its unique funnel-shaped geometry.

Two mechanisms create storm surge. First, low atmospheric pressure at the cyclone center causes the ocean surface to bulge upward — roughly 1 cm per 1 hPa of pressure deficit (the **inverse barometer effect**). A powerful cyclone with a 70 hPa pressure deficit lifts the ocean 0.7 meters before wind does anything. Second, sustained onshore winds push water against the coast. The surge height depends on wind speed, the angle of approach, and how long the wind blows. Over shallow continental shelves, this wind-driven component can be enormous — 5 to 10 meters.

**Bathymetry** — the underwater topography — is the critical amplifier. The Bay of Bengal's northern coast has a vast, shallow continental shelf that slopes gently for hundreds of kilometers. When the surge wave enters shallow water, it has nowhere to go but up. The Ganges-Brahmaputra delta compounds this: dozens of river channels funnel the surge inland. The 1970 Bhola cyclone killed 300,000-500,000 people in Bangladesh with a 10-meter surge. Cyclone Aila in 2009 sent a 3-meter surge up the Sundarbans. The Brahmaputra delta communities — including fishing villages like the one in our story — live at ground level in the most surge-vulnerable landscape on Earth.`,
      analogy: 'Storm surge is like pushing water in a bathtub toward one end by blowing across the surface. In a deep bathtub (deep ocean), the water barely rises. But if you put a ramp at one end (shallow continental shelf), the water climbs the ramp and overflows. The Bay of Bengal is a bathtub with a long, gentle ramp on the north side — and 150 million people live on that ramp.',
      storyConnection: 'The fisherman\'s daughter knew the river could rise faster than a person can run. When monsoon floods merged with a cyclone\'s storm surge pushing up the Brahmaputra, the water came from both directions — rain-swollen river from upstream and ocean surge from downstream. Her village, barely above sea level on the delta, had no high ground to retreat to. Understanding surge physics is not academic for delta communities — it is survival knowledge.',
      checkQuestion: 'Two cyclones of equal wind speed approach different coastlines. Cyclone A hits a coast with a narrow, steep continental shelf (drops to 100m depth within 10 km). Cyclone B hits a coast with a wide, shallow shelf (only 20m deep for 200 km offshore). Which produces a higher storm surge and why?',
      checkAnswer: 'Cyclone B produces a much higher surge. On the wide, shallow shelf, the wind pushes water with nowhere to go — it piles up against the coast because the shallow water prevents the surge from dispersing downward or offshore. On the steep shelf (Cyclone A), the deep water allows the surge energy to spread over a greater volume, reducing the surface rise. This is exactly why the Bay of Bengal (wide shallow shelf) produces catastrophic surges while deep-water coastlines are relatively protected.',
      codeIntro: 'Model storm surge using a 1D shallow-water equation along a continental shelf profile. Compare surge heights for different shelf geometries and cyclone intensities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D storm surge model along a cross-shelf transect
# Simplified: steady-state wind setup on a sloping shelf

def compute_surge(shelf_profile_depth, dx, wind_stress, pressure_deficit_hPa,
                  rho_water=1025, g=9.81):
    """
    Compute storm surge along a 1D shelf profile.
    Uses simplified momentum balance: wind stress + pressure gradient = gravity.
    """
    n = len(shelf_profile_depth)
    # Inverse barometer effect: 1 cm per 1 hPa
    ib_surge = pressure_deficit_hPa * 0.01  # meters

    # Wind setup: iterative solution
    # eta(x) = integral from x to coast of (tau / (rho * g * (h + eta))) dx
    eta = np.zeros(n)

    # Integrate from offshore toward coast
    for i in range(n - 2, -1, -1):
        h = max(shelf_profile_depth[i], 0.5)  # minimum depth 0.5m
        eta[i] = eta[i + 1] + wind_stress / (rho_water * g * (h + eta[i + 1])) * dx

    return eta + ib_surge

# Distance from coast (0 = coast, positive = offshore)
n_points = 500
x_offshore = np.linspace(0, 300e3, n_points)  # 0 to 300 km

# Bay of Bengal profile: wide, shallow shelf
bob_depth = 5.0 + 0.0005 * x_offshore  # very gentle slope: 5m at coast, ~155m at 300km

# Steep shelf profile (e.g., Pacific island)
steep_depth = 5.0 + 0.01 * x_offshore  # steep: 5m at coast, ~3005m at 300km
steep_depth = np.minimum(steep_depth, 200)  # cap at 200m for comparison

# Wind stress for different cyclone categories
rho_air = 1.2
Cd = 0.002
categories = {
    'Cat 1 (33 m/s)': {'wind': 33, 'dp': 30},
    'Cat 3 (50 m/s)': {'wind': 50, 'dp': 50},
    'Cat 5 (70 m/s)': {'wind': 70, 'dp': 80},
}

dx = x_offshore[1] - x_offshore[0]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Shelf profiles
ax = axes[0, 0]
ax.fill_between(x_offshore / 1e3, -bob_depth, 0, alpha=0.3, color='#3b82f6', label='Bay of Bengal (gentle)')
ax.fill_between(x_offshore / 1e3, -steep_depth, 0, alpha=0.3, color='#f59e0b', label='Steep shelf')
ax.plot(x_offshore / 1e3, -bob_depth, color='#3b82f6', linewidth=2)
ax.plot(x_offshore / 1e3, -steep_depth, color='#f59e0b', linewidth=2)
ax.axhline(0, color='white', linewidth=0.5)
ax.set_title('Continental Shelf Profiles', color='white')
ax.set_xlabel('Distance offshore (km)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(-200, 5)

# 2. Surge on Bay of Bengal shelf for different categories
ax = axes[0, 1]
colors_cat = ['#22c55e', '#f59e0b', '#ef4444']
for (cat_name, params), color in zip(categories.items(), colors_cat):
    tau = rho_air * Cd * params['wind']**2
    surge = compute_surge(bob_depth, dx, tau, params['dp'])
    ax.plot(x_offshore / 1e3, surge, color=color, linewidth=2, label=f"{cat_name}: {surge[0]:.1f}m")
ax.set_title('Storm Surge — Bay of Bengal Shelf', color='white')
ax.set_xlabel('Distance offshore (km)', color='white')
ax.set_ylabel('Surge height (m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3. Surge comparison: BoB vs steep shelf (Cat 3)
ax = axes[1, 0]
tau_cat3 = rho_air * Cd * 50**2
surge_bob = compute_surge(bob_depth, dx, tau_cat3, 50)
surge_steep = compute_surge(steep_depth, dx, tau_cat3, 50)
ax.plot(x_offshore / 1e3, surge_bob, color='#3b82f6', linewidth=2,
        label=f'Bay of Bengal: {surge_bob[0]:.1f}m at coast')
ax.plot(x_offshore / 1e3, surge_steep, color='#f59e0b', linewidth=2,
        label=f'Steep shelf: {surge_steep[0]:.1f}m at coast')
ax.set_title('Same Cyclone, Different Shelves (Cat 3)', color='white')
ax.set_xlabel('Distance offshore (km)', color='white')
ax.set_ylabel('Surge height (m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Surge at coast vs wind speed
ax = axes[1, 1]
wind_speeds = np.linspace(20, 80, 60)
surge_at_coast_bob = []
surge_at_coast_steep = []
for ws in wind_speeds:
    tau = rho_air * Cd * ws**2
    dp = ws * 1.1  # rough pressure deficit estimate
    s_bob = compute_surge(bob_depth, dx, tau, dp)
    s_steep = compute_surge(steep_depth, dx, tau, dp)
    surge_at_coast_bob.append(s_bob[0])
    surge_at_coast_steep.append(s_steep[0])

ax.plot(wind_speeds, surge_at_coast_bob, color='#3b82f6', linewidth=2, label='Bay of Bengal')
ax.plot(wind_speeds, surge_at_coast_steep, color='#f59e0b', linewidth=2, label='Steep shelf')
ax.axhline(3, color='gray', linestyle=':', linewidth=1, label='Aila 2009 (~3m)')
ax.axhline(10, color='#ef4444', linestyle=':', linewidth=1, label='Bhola 1970 (~10m)')
ax.set_title('Surge at Coast vs Wind Speed', color='white')
ax.set_xlabel('Maximum wind speed (m/s)', color='white')
ax.set_ylabel('Surge height at coast (m)', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Storm Surge Analysis")
print("=" * 50)
print(f"Bay of Bengal shelf: gentle slope, 5m at coast to 155m at 300km")
print(f"Steep shelf: 5m at coast to 200m within 20km")
print()
for cat_name, params in categories.items():
    tau = rho_air * Cd * params['wind']**2
    surge = compute_surge(bob_depth, dx, tau, params['dp'])
    print(f"  {cat_name}: {surge[0]:.1f}m surge on BoB shelf")
print()
print(f"Key finding: same Cat 3 cyclone produces:")
print(f"  {surge_bob[0]:.1f}m surge on gentle Bay of Bengal shelf")
print(f"  {surge_steep[0]:.1f}m surge on steep shelf")
print(f"  That\'s a {surge_bob[0]/max(surge_steep[0],0.01):.1f}x amplification from bathymetry alone.")
print()
print("Bathymetry is destiny. The Bay of Bengal's shallow shelf")
print("is why it produces the deadliest storm surges on Earth.")`,
      challenge: 'Add a river channel to the model: a 2 km-wide section where the depth is only 3m (simulating the Brahmaputra mouth). How does the surge funnel up the channel compared to the open coast?',
      successHint: 'Storm surge is a problem of geometry as much as meteorology. The same cyclone can produce a 2-meter surge on one coast and a 10-meter surge on another. For Brahmaputra delta communities, the gentle shelf and funnel-shaped coastline multiply every storm into a potential catastrophe.',
    },
    {
      title: 'Climate Change & Cyclone Intensity',
      concept: `The relationship between global warming and tropical cyclones is one of the most important questions in climate science. The physics is grounded in the **Clausius-Clapeyron equation**: for every 1°C of warming, the atmosphere can hold about 7% more water vapor. More moisture means more latent heat available to fuel storms. The theoretical maximum intensity of a cyclone — set by the temperature difference between the warm ocean surface and the cold upper atmosphere — increases with warming.

Observations over the past 40 years show a clear trend: the proportion of the most intense cyclones (Category 4 and 5) has **increased** significantly, even though the total number of cyclones per year has not clearly increased and may even decrease in some basins. This is the key nuance — warming does not necessarily produce more storms, but the storms that do form have access to more energy and can reach higher intensities. Think of it as upgrading the engine in fewer cars rather than putting more cars on the road.

For the Bay of Bengal, the implications are severe. SSTs are rising at about 0.1-0.2°C per decade. With the Clausius-Clapeyron scaling, that means roughly 1-2% more moisture per decade available to cyclones. Combined with rising sea levels that amplify storm surge, and the already extreme vulnerability of the Ganges-Brahmaputra delta, the risk to coastal communities is compounding. Sea level rise of even 30 cm means a storm surge that previously stopped at the village edge now reaches its center. For millions of people in low-lying delta regions, climate change is not a future abstraction — it is a measurable increase in flood risk with every passing year.`,
      analogy: 'Imagine a boxing league where climate change does not add more boxers, but gives each boxer a protein shake before every fight. The number of matches stays the same, but the punches are harder. A heavyweight who used to peak at 90% of maximum power now routinely hits 95%. Individually, each fight is more dangerous — even if the schedule has not changed.',
      storyConnection: 'The fisherman\'s daughter heard the elders say storms were different now — the water came higher, stayed longer, and took more houses each time. The elders were right: SSTs in the Bay of Bengal have warmed, sea levels have risen 3-4 mm per year, and cyclones that form now tap into a more energetic ocean. The same Brahmaputra delta that has sustained fishing communities for centuries is becoming incrementally more dangerous with each decade. The science explains what the elders already felt.',
      checkQuestion: 'If global average temperature rises by 2°C and Clausius-Clapeyron predicts 7% more moisture per degree, how much more moisture would be available to fuel cyclones? Does this mean cyclone wind speeds also increase by 14%?',
      checkAnswer: 'Two degrees of warming gives about 14% more atmospheric moisture (1.07^2 = 1.1449, so ~14.5%). However, wind speed does not increase by 14% because the relationship between moisture and intensity is not linear. Maximum potential intensity scales roughly with the square root of the energy available, so a 14% increase in moisture translates to roughly a 5-7% increase in maximum wind speed. This matters: a 7% increase in wind speed means roughly a 22% increase in wind damage potential (damage scales as wind speed cubed). Small percentages in physics mean large percentages in impact.',
      codeIntro: 'Model how Clausius-Clapeyron scaling affects cyclone potential intensity under different warming scenarios. Project changes in storm surge risk for the Bay of Bengal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Climate change impacts on cyclone intensity
# Using Clausius-Clapeyron scaling and simplified MPI theory

# Clausius-Clapeyron: 7% more moisture per degree C
def moisture_scaling(delta_T):
    """Fractional increase in available moisture for delta_T warming."""
    return 1.07**delta_T

# Maximum Potential Intensity (simplified Emanuel theory)
# V_max proportional to sqrt(SST - T_outflow) * sqrt(moisture)
def max_potential_intensity(sst_C, T_out_C=-70, base_sst=28.0, base_vmax=65.0):
    """Estimate MPI given SST. Calibrated to ~65 m/s at 28°C."""
    sst_K = sst_C + 273.15
    T_out_K = T_out_C + 273.15
    base_sst_K = base_sst + 273.15
    ratio = (sst_K - T_out_K) / (base_sst_K - T_out_K)
    cc_factor = moisture_scaling(sst_C - base_sst)
    return base_vmax * np.sqrt(ratio * cc_factor)

# Warming scenarios
delta_T_range = np.linspace(0, 4, 100)
warming_labels = ['Pre-industrial', '+1.5°C (Paris target)', '+2°C', '+3°C', '+4°C']
warming_values = [0, 1.5, 2.0, 3.0, 4.0]

# SST range
sst_range = np.linspace(24, 34, 100)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Clausius-Clapeyron moisture scaling
ax = axes[0, 0]
moisture_pct = (moisture_scaling(delta_T_range) - 1) * 100
ax.plot(delta_T_range, moisture_pct, color='#3b82f6', linewidth=2.5)
for label, dT in zip(warming_labels[1:], warming_values[1:]):
    m = (moisture_scaling(dT) - 1) * 100
    ax.plot(dT, m, 'o', color='#ef4444', markersize=8)
    ax.annotate(f'+{m:.0f}%', (dT + 0.1, m + 1), color='white', fontsize=8)
ax.set_title('Clausius-Clapeyron: More Moisture', color='white')
ax.set_xlabel('Warming (°C)', color='white')
ax.set_ylabel('Additional moisture (%)', color='white')

# 2. MPI vs SST
ax = axes[0, 1]
vmax = max_potential_intensity(sst_range)
ax.plot(sst_range, vmax, color='#a855f7', linewidth=2.5)
ax.axhline(33, color='#22c55e', linestyle=':', linewidth=1, alpha=0.7, label='Cat 1')
ax.axhline(50, color='#f59e0b', linestyle=':', linewidth=1, alpha=0.7, label='Cat 3')
ax.axhline(70, color='#ef4444', linestyle=':', linewidth=1, alpha=0.7, label='Cat 5')
ax.axvline(26.5, color='gray', linestyle='--', linewidth=1, label='Cyclone threshold')
ax.fill_between([28, 30], 0, 100, alpha=0.1, color='#f59e0b', label='BoB range')
ax.set_title('Max Potential Intensity vs SST', color='white')
ax.set_xlabel('Sea Surface Temperature (°C)', color='white')
ax.set_ylabel('Maximum wind speed (m/s)', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(20, 100)

# 3. Shift in intensity distribution
ax = axes[0, 2]
np.random.seed(42)
# Current distribution of cyclone intensities (Weibull-like)
current_intensities = np.random.weibull(2.5, 1000) * 40 + 15
future_intensities = current_intensities * 1.07  # 7% intensity increase
bins = np.linspace(10, 100, 40)
ax.hist(current_intensities, bins=bins, alpha=0.5, color='#3b82f6',
        label='Current climate', density=True)
ax.hist(future_intensities, bins=bins, alpha=0.5, color='#ef4444',
        label='+2°C warming', density=True)
ax.axvline(64, color='#f59e0b', linestyle='--', linewidth=2, label='Cat 4 threshold')
cat4_current = np.sum(current_intensities >= 64) / len(current_intensities) * 100
cat4_future = np.sum(future_intensities >= 64) / len(future_intensities) * 100
ax.set_title('Intensity Distribution Shift', color='white')
ax.set_xlabel('Max wind speed (m/s)', color='white')
ax.set_ylabel('Density', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Wind damage scaling (cube law)
ax = axes[1, 0]
wind_increase_pct = np.linspace(0, 15, 100)
damage_increase_pct = ((1 + wind_increase_pct / 100)**3 - 1) * 100
ax.plot(wind_increase_pct, damage_increase_pct, color='#ef4444', linewidth=2.5)
ax.fill_between(wind_increase_pct, 0, damage_increase_pct, alpha=0.1, color='#ef4444')
for wp, label in [(5, '+5%'), (7, '+7%'), (10, '+10%')]:
    dp = ((1 + wp/100)**3 - 1) * 100
    ax.plot(wp, dp, 'o', color='#f59e0b', markersize=8)
    ax.annotate(f'{dp:.0f}% damage', (wp + 0.3, dp + 2), color='white', fontsize=8)
ax.set_title('Wind Speed → Damage (Cube Law)', color='white')
ax.set_xlabel('Wind speed increase (%)', color='white')
ax.set_ylabel('Damage potential increase (%)', color='white')

# 5. Sea level rise + storm surge compound risk
ax = axes[1, 1]
base_surge = np.array([2, 3, 5, 7, 10])  # historical surge heights
slr_scenarios = [0, 0.3, 0.5, 1.0]  # sea level rise in meters
colors_slr = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
bar_width = 0.18
x_pos = np.arange(len(base_surge))
for i, (slr, color) in enumerate(zip(slr_scenarios, colors_slr)):
    ax.bar(x_pos + i * bar_width, base_surge + slr, bar_width,
           color=color, alpha=0.8, label=f'SLR +{slr}m')
ax.set_title('Storm Surge + Sea Level Rise', color='white')
ax.set_xlabel('Cyclone severity', color='white')
ax.set_ylabel('Total water level (m)', color='white')
ax.set_xticks(x_pos + 1.5 * bar_width)
ax.set_xticklabels(['Weak', 'Moderate', 'Strong', 'Severe', 'Extreme'])
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6. Bay of Bengal SST trend
ax = axes[1, 2]
years = np.arange(1980, 2101)
# Historical SST trend + projection
sst_historical = 27.5 + 0.015 * (years[years <= 2025] - 1980)
sst_rcp45 = sst_historical[-1] + 0.02 * (years[(years > 2025) & (years <= 2100)] - 2025)
sst_rcp85 = sst_historical[-1] + 0.04 * (years[(years > 2025) & (years <= 2100)] - 2025)

ax.plot(years[years <= 2025], sst_historical, color='#3b82f6', linewidth=2, label='Observed')
ax.plot(years[(years > 2025) & (years <= 2100)], sst_rcp45, color='#f59e0b',
        linewidth=2, linestyle='--', label='Moderate emissions')
ax.plot(years[(years > 2025) & (years <= 2100)], sst_rcp85, color='#ef4444',
        linewidth=2, linestyle='--', label='High emissions')
ax.axhline(26.5, color='gray', linestyle=':', linewidth=1)
ax.annotate('Cyclone threshold', (1982, 26.6), color='gray', fontsize=8)
ax.set_title('Bay of Bengal SST Projection', color='white')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('SST (°C)', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Climate Change & Cyclone Intensity")
print("=" * 50)
print(f"Clausius-Clapeyron scaling:")
print(f"  +1.5°C warming -> {(moisture_scaling(1.5)-1)*100:.1f}% more moisture")
print(f"  +2.0°C warming -> {(moisture_scaling(2.0)-1)*100:.1f}% more moisture")
print(f"  +3.0°C warming -> {(moisture_scaling(3.0)-1)*100:.1f}% more moisture")
print()
print(f"Category 4+ cyclones (>64 m/s):")
print(f"  Current climate: {cat4_current:.1f}% of storms")
print(f"  +2°C warming:    {cat4_future:.1f}% of storms")
print(f"  Relative increase: {(cat4_future/max(cat4_current,0.01)-1)*100:.0f}%")
print()
print(f"Damage cube law:")
print(f"  +5% wind speed -> +{((1.05)**3-1)*100:.0f}% damage potential")
print(f"  +7% wind speed -> +{((1.07)**3-1)*100:.0f}% damage potential")
print(f"  +10% wind speed -> +{((1.10)**3-1)*100:.0f}% damage potential")
print()
print("The message: small physical changes produce large human impacts.")
print("For Brahmaputra delta communities, every tenth of a degree matters.")`,
      challenge: 'Combine all factors: for a +2°C warming scenario, compute the compound risk increase — more intense winds, higher base sea level, more moisture. Express the total risk multiplier compared to today. How much more dangerous is a "once-in-50-year" cyclone under warming?',
      successHint: 'Climate change and cyclone science connect physics, chemistry, and human vulnerability. The Clausius-Clapeyron equation — derived from 19th-century thermodynamics — predicts 21st-century disaster risk. Understanding these quantitative relationships is essential for adaptation planning in vulnerable regions like the Brahmaputra delta.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Ocean Science & Storm Physics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (data visualization fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real scientific computing. Click to start.</p>
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
            diagram={[PressureDepthDiagram, MonsoonDiagram, CycloneCrossSectionDiagram, LinearGraphDiagram, BuoyancyDiagram, ClimateFactorsDiagram][i] ? createElement([PressureDepthDiagram, MonsoonDiagram, CycloneCrossSectionDiagram, LinearGraphDiagram, BuoyancyDiagram, ClimateFactorsDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
