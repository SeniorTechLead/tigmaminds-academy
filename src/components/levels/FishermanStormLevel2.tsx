import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FishermanStormLevel2() {
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
      title: 'Pressure gradient force — the engine of all winds',
      concept: `In Level 1, we learned that wind flows from high to low pressure. Now let's quantify it. The **pressure gradient force (PGF)** is the force per unit mass that drives air from high to low pressure:

**PGF = -(1/ρ) × (ΔP/Δx)**

Where ρ is air density, ΔP is the pressure change, and Δx is the distance. The negative sign means the force points FROM high TO low pressure.

Key implications:
- Tightly packed isobars (lines of equal pressure) → strong PGF → strong wind
- Widely spaced isobars → weak PGF → light wind
- PGF is always perpendicular to isobars, pointing toward lower pressure
- On a weather map, you can estimate wind speed just by looking at isobar spacing

In a cyclone, the PGF is enormous near the eyewall — isobars are squeezed together over just 50-100 km, creating a pressure gradient of ~30 hPa over that distance. This is what drives 200+ km/h eyewall winds.`,
      analogy: 'The pressure gradient force is like the slope of a hill for a rolling ball. A steep hill (tight isobars) makes the ball accelerate fast (strong wind). A gentle slope (wide isobars) produces a lazy roll (light breeze). The steepness IS the force — you can measure how fast the ball will roll just by measuring the slope, before the ball even starts moving.',
      storyConnection: 'As the cyclone approached in the story, the fisherman\'s daughter noticed the barometric pressure dropping rapidly. That rapid drop over a short distance is exactly the PGF at work. Old sailors had mercury barometers; a sharp drop meant a storm was building its pressure gradient. Today, atmospheric pressure sensors on weather buoys measure PGF directly across the Bay of Bengal.',
      checkQuestion: 'Two weather maps show the same low-pressure system. In Map A, the isobars are 100 km apart. In Map B, they\'re 50 km apart. Which map shows stronger winds, and by how much?',
      checkAnswer: 'Map B shows winds roughly twice as strong. PGF is inversely proportional to distance: if ΔP is the same but Δx is halved, PGF doubles. Since wind speed is proportional to PGF (approximately, in a simplified model), the winds in B are about 2× stronger. This is why meteorologists read isobar spacing — it\'s a direct visual indicator of wind speed.',
      codeIntro: 'Calculate PGF from pressure data and relate it to observed wind speeds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pressure gradient force calculations
# PGF = -(1/rho) * dP/dx

rho = 1.225  # air density at sea level (kg/m3)

# Create isobar patterns at different spacings
x = np.linspace(0, 500, 200)  # km
y = np.linspace(0, 500, 200)
X, Y = np.meshgrid(x, y)

# Scenario 1: Gentle gradient (high pressure system)
P_gentle = 1020 - 0.01 * X
# Scenario 2: Moderate gradient (approaching front)
P_moderate = 1020 - 0.04 * X
# Scenario 3: Steep gradient (cyclone)
P_steep = 1020 - 0.12 * X

scenarios = [
    ('Gentle (high pressure)', P_gentle, 0.01),
    ('Moderate (weather front)', P_moderate, 0.04),
    ('Steep (cyclone approach)', P_steep, 0.12),
]

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

for ax, (label, P, gradient) in zip(axes, scenarios):
    ax.set_facecolor('#111827')
    cs = ax.contour(X, Y, P, levels=10, colors='white', linewidths=1)
    ax.clabel(cs, fontsize=7, fmt='%.0f')

    # PGF
    pgf = gradient * 100 / rho  # hPa/km to Pa/m, divided by rho
    # Approximate wind speed (geostrophic approximation simplified)
    wind_approx = pgf * 1000 / 5e-5 / 3.6 if pgf > 0.01 else pgf * 8000  # very rough

    # Draw wind arrows
    skip = 20
    u = np.ones_like(X) * pgf * 100  # rightward (from high to low)
    v = np.zeros_like(Y)
    ax.quiver(X[::skip, ::skip], Y[::skip, ::skip],
             u[::skip, ::skip], v[::skip, ::skip],
             color='#ef4444', alpha=0.5, scale=50)

    ax.set_title(f'{label}\\nGradient: {gradient} hPa/km\\nWind: ~{wind_approx:.0f} km/h',
                color='white', fontsize=10)
    ax.set_xlabel('km', color='white')
    ax.tick_params(colors='gray')

axes[0].set_ylabel('km', color='white')
plt.tight_layout()
plt.show()

print("Pressure Gradient Force summary:")
for label, P, gradient in scenarios:
    pgf = gradient * 100 / rho  # m/s^2
    print(f"  {label}:")
    print(f"    Gradient: {gradient} hPa/km = {gradient*100:.0f} Pa/km")
    print(f"    PGF: {pgf:.4f} m/s²")`,
      challenge: 'In a cyclone, the pressure drops from 1010 hPa to 940 hPa over 200 km (from outer edge to center). Calculate the average PGF. Then calculate it over just the 30 km of the eyewall (where 40 hPa of that drop occurs). How do they compare?',
      successHint: 'The pressure gradient force is the master equation of meteorology. Every wind on Earth — from sea breezes to jet streams to tornadoes — starts with a pressure difference. PGF turns that difference into motion.',
    },
    {
      title: 'Geostrophic wind — when forces balance in the sky',
      concept: `If the pressure gradient force were the only force, wind would blow directly from high to low pressure and quickly equalize. But it doesn't — thanks to the Coriolis effect. When PGF and Coriolis force reach a balance, the result is **geostrophic wind**: air that flows PARALLEL to isobars, not across them.

**How it works:**
1. PGF pushes air from high to low pressure
2. As the air moves, the Coriolis effect deflects it to the right (Northern Hemisphere)
3. Deflection continues until the air is moving parallel to the isobars
4. At that point, PGF (pointing from high to low) exactly balances Coriolis (pointing from low to high)
5. The wind is in "geostrophic balance" — it flows along the isobars

**Geostrophic wind speed: V_g = (1/ρf) × (ΔP/Δn)**

Where f is the Coriolis parameter and Δn is the distance perpendicular to the isobars.

This balance works well above ~1 km altitude where friction is minimal. Near the surface, friction slows the wind and allows it to cross isobars at an angle — that's why surface wind spirals into cyclones instead of circling them perfectly.`,
      analogy: 'Geostrophic wind is like a car on a banked curve. Gravity (PGF) pulls it downward (toward low pressure). The bank angle (Coriolis) pushes it to the side. When perfectly balanced, the car drives along the curve (parallel to isobars) without drifting up or down. Too fast = drifts up (away from low). Too slow = drifts down (toward low). The balance speed is the geostrophic wind.',
      storyConnection: 'The large-scale winds that steer cyclones across the Bay of Bengal are geostrophic — they follow the pressure patterns of the surrounding atmosphere. The cyclone in the story didn\'t move randomly; it was steered by these balanced winds. Forecasters predict cyclone tracks by analyzing the geostrophic flow in which the cyclone is embedded.',
      checkQuestion: 'In the Southern Hemisphere, the Coriolis effect deflects to the LEFT. How does this change geostrophic wind around a low-pressure system?',
      checkAnswer: 'The wind still flows parallel to isobars, but it circles CLOCKWISE around a low (opposite to the Northern Hemisphere). PGF still points toward the low, but Coriolis deflects leftward. Balance is achieved with the low to the RIGHT of the wind direction (instead of left, as in the NH). This is why Southern Hemisphere cyclones spin clockwise.',
      codeIntro: 'Simulate the development of geostrophic balance — watch the Coriolis effect redirect the wind.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Time evolution of wind adjusting to geostrophic balance
# Start with PGF only, then watch Coriolis deflect until balance
dt = 60  # seconds
total_time = 24 * 3600  # 24 hours
steps = int(total_time / dt)

# Parameters
rho = 1.225  # kg/m3
f = 1e-4  # Coriolis parameter (mid-latitudes)
dpdx = 0  # no east-west gradient
dpdy = -0.002  # Pa/m (pressure decreases northward)

# PGF (points north, toward low pressure)
pgf_x = -(1/rho) * dpdx
pgf_y = -(1/rho) * dpdy

# Geostrophic wind (analytical solution)
vg_x = -(1/(rho * f)) * dpdy
vg_y = (1/(rho * f)) * dpdx

# Simulate with damping (friction)
friction_coeff = 1e-5  # small friction

u_hist = [0]
v_hist = [0]
u, v = 0.0, 0.0

for step in range(steps):
    # Accelerations
    du = pgf_x + f * v - friction_coeff * u
    dv = pgf_y - f * u - friction_coeff * v
    u += du * dt
    v += dv * dt
    if step % 60 == 0:  # record every hour
        u_hist.append(u)
        v_hist.append(v)

u_hist = np.array(u_hist)
v_hist = np.array(v_hist)
hours = np.arange(len(u_hist))

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Wind components over time
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(hours, u_hist, color='#ef4444', linewidth=2, label='u (east-west)')
ax1.plot(hours, v_hist, color='#3b82f6', linewidth=2, label='v (north-south)')
ax1.axhline(vg_x, color='#ef4444', linestyle='--', alpha=0.5, label=f'Geostrophic u = {vg_x:.1f} m/s')
ax1.axhline(vg_y, color='#3b82f6', linestyle='--', alpha=0.5, label=f'Geostrophic v = {vg_y:.1f} m/s')
ax1.set_xlabel('Hours', color='white')
ax1.set_ylabel('Wind speed (m/s)', color='white')
ax1.set_title('Wind Adjusting to Geostrophic Balance', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Hodograph (trajectory in u-v space)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.plot(u_hist, v_hist, color='#22c55e', linewidth=1.5, alpha=0.7)
ax2.plot(u_hist[0], v_hist[0], 'o', color='#f59e0b', markersize=10, label='Start')
ax2.plot(u_hist[-1], v_hist[-1], 's', color='#ef4444', markersize=10, label='End')
ax2.plot(vg_x, vg_y, '*', color='white', markersize=15, label='Geostrophic')
ax2.set_xlabel('u (m/s, east)', color='white')
ax2.set_ylabel('v (m/s, north)', color='white')
ax2.set_title('Hodograph (Wind Trajectory)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_aspect('equal')

# Force balance diagram
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# At geostrophic balance
scale = 50
ax3.arrow(0, 0, 0, pgf_y*scale, head_width=0.1, head_length=0.05, color='#ef4444', linewidth=2)
ax3.text(0.15, pgf_y*scale/2, 'PGF\n(toward low)', color='#ef4444', fontsize=10)

cor_x = f * vg_y
cor_y = -f * vg_x
ax3.arrow(0, 0, 0, -pgf_y*scale, head_width=0.1, head_length=0.05, color='#3b82f6', linewidth=2)
ax3.text(-0.8, -pgf_y*scale/2, 'Coriolis\n(away from low)', color='#3b82f6', fontsize=10)

ax3.arrow(0, 0, vg_x*3, 0, head_width=0.05, head_length=0.1, color='#22c55e', linewidth=2)
ax3.text(vg_x*1.5, 0.15, f'Geostrophic wind\n({vg_x:.1f} m/s, eastward)', color='#22c55e', fontsize=10)

# Isobars
for p_offset in [-0.5, 0, 0.5]:
    ax3.axhline(p_offset, color='gray', linestyle=':', alpha=0.3)

ax3.text(2.5, 0.55, 'LOW PRESSURE', color='gray', fontsize=9, ha='center')
ax3.text(2.5, -0.55, 'HIGH PRESSURE', color='gray', fontsize=9, ha='center')
ax3.set_title('Force Balance at Geostrophic Equilibrium', color='white', fontsize=12)
ax3.set_xlim(-1.5, 5)
ax3.set_ylim(-0.8, 0.8)
ax3.tick_params(colors='gray')

# Geostrophic wind vs latitude
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
latitudes = np.arange(10, 80, 1)
f_lat = 2 * 7.292e-5 * np.sin(np.radians(latitudes))
vg_lat = np.abs(dpdy) / (rho * f_lat)

ax4.plot(latitudes, vg_lat, color='#f59e0b', linewidth=2)
ax4.set_xlabel('Latitude (degrees)', color='white')
ax4.set_ylabel('Geostrophic wind speed (m/s)', color='white')
ax4.set_title('Same Pressure Gradient, Different Latitudes', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.annotate('Tropics: fast wind\n(weak Coriolis)', xy=(15, vg_lat[5]), color='#ef4444', fontsize=9)
ax4.annotate('High latitudes: slow wind\n(strong Coriolis)', xy=(60, vg_lat[50]), color='#22c55e', fontsize=9)

plt.tight_layout()
plt.show()

print(f"Geostrophic wind: {vg_x:.1f} m/s eastward ({vg_x*3.6:.0f} km/h)")
print(f"PGF: {abs(dpdy/rho):.5f} m/s² (northward)")
print(f"Coriolis: {f*vg_x:.5f} m/s² (southward, balancing PGF)")
print(f"\\nThe wind blows PARALLEL to isobars, not across them.")
print(f"This is why weather maps show isobars — they're wind direction indicators.")`,
      challenge: 'Near the surface, friction reduces the wind speed by ~30% and turns it ~20-30° toward low pressure. Modify the simulation to include friction. How does the trajectory change?',
      successHint: 'Geostrophic balance is the default state of large-scale atmospheric flow. Understanding it is essential for reading weather maps, predicting wind, and understanding why weather systems move the way they do.',
    },
    {
      title: 'Cyclone intensity scales — measuring a storm\'s punch',
      concept: `Not all cyclones are equal. The **Saffir-Simpson Hurricane Wind Scale** (used in the Atlantic) and the **IMD intensity classification** (used in the Indian Ocean) categorize storms by their maximum sustained wind speed.

**IMD Classification:**
| Category | Wind Speed | Damage |
|---|---|---|
| Depression | < 52 km/h | Minimal |
| Deep Depression | 52-61 km/h | Light |
| Cyclonic Storm | 62-88 km/h | Moderate |
| Severe Cyclonic Storm | 89-117 km/h | Extensive |
| Very Severe | 118-166 km/h | Devastating |
| Extremely Severe | 167-221 km/h | Catastrophic |
| Super Cyclonic Storm | > 221 km/h | Total destruction |

**Key insight**: damage scales with wind speed CUBED. A 200 km/h storm doesn't cause twice the damage of a 100 km/h storm — it causes roughly EIGHT times the damage. This is because:
- Wind force on a surface ∝ v²
- Power (force × velocity) ∝ v³
- Additionally, stronger winds launch heavier debris`,
      analogy: 'Cyclone categories are like earthquake magnitudes — the scale seems linear (Cat 1, 2, 3...) but the damage is exponential. Going from Cat 3 to Cat 5 is not like going from 3 to 5 on a ruler. It\'s like going from a firecracker to a stick of dynamite. The numbers hide the exponential reality.',
      storyConnection: 'The cyclone in the story was powerful enough to capsize boats and flood the coast — likely a Severe or Very Severe cyclonic storm. The fisherman\'s daughter\'s survival depended on recognizing the severity fast enough to take shelter. In real life, the difference between a Cyclonic Storm and a Super Cyclonic Storm is the difference between roof damage and the building being gone.',
      checkQuestion: 'If wind damage scales with v³, and a Cat 1 cyclone (120 km/h) causes $1 million in damage, how much damage would a Cat 5 (260 km/h) cause by the same formula?',
      checkAnswer: 'Damage ∝ v³, so ratio = (260/120)³ = (2.17)³ = 10.2. The Cat 5 would cause roughly $10.2 million — over 10 times more damage from only about twice the wind speed. This is why intensity matters so much, and why a small increase in maximum wind speed means a huge increase in destructive potential.',
      codeIntro: 'Visualize the non-linear relationship between wind speed and destructive power.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wind speed vs destructive power
wind_speeds = np.linspace(30, 300, 200)  # km/h
wind_ms = wind_speeds / 3.6

# Force ∝ v^2, Power ∝ v^3
force = wind_ms ** 2
power = wind_ms ** 3

# Normalize to Cat 1 values
cat1_speed = 120 / 3.6
force_normalized = force / (cat1_speed ** 2)
power_normalized = power / (cat1_speed ** 3)

# IMD categories
categories = [
    ('Depression', 0, 52, '#22c55e'),
    ('Deep Depression', 52, 61, '#84cc16'),
    ('Cyclonic Storm', 62, 88, '#f59e0b'),
    ('Severe', 89, 117, '#ef4444'),
    ('Very Severe', 118, 166, '#dc2626'),
    ('Extremely Severe', 167, 221, '#991b1b'),
    ('Super Cyclonic', 222, 300, '#7f1d1d'),
]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Power vs wind speed
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(wind_speeds, power_normalized, color='#ef4444', linewidth=2)
ax1.fill_between(wind_speeds, power_normalized, alpha=0.1, color='#ef4444')

for name, lo, hi, color in categories:
    ax1.axvspan(lo, hi, alpha=0.1, color=color)
    mid = (lo + hi) / 2
    if mid < 250:
        p_at_mid = (mid/3.6)**3 / cat1_speed**3
        ax1.text(mid, p_at_mid + 0.5, name.split()[0], color=color, fontsize=7,
                ha='center', rotation=90)

ax1.set_xlabel('Wind speed (km/h)', color='white')
ax1.set_ylabel('Destructive power (relative to Cat 1)', color='white')
ax1.set_title('Wind Speed vs Destructive Power (v³)', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 20)

# Comparison: linear vs actual damage
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
cat_speeds = [50, 70, 100, 140, 200, 250]
cat_names = ['Dep', 'CS', 'SCS', 'VSCS', 'ESCS', 'SuCS']
linear_damage = np.array(cat_speeds) / cat_speeds[0]
actual_damage = (np.array(cat_speeds) / cat_speeds[0]) ** 3

x_pos = np.arange(len(cat_names))
ax2.bar(x_pos - 0.15, linear_damage, width=0.3, color='#3b82f6', alpha=0.7, label='If damage were linear')
ax2.bar(x_pos + 0.15, actual_damage, width=0.3, color='#ef4444', alpha=0.7, label='Actual (v³ scaling)')
ax2.set_xticks(x_pos)
ax2.set_xticklabels(cat_names, color='white')
ax2.set_ylabel('Relative damage', color='white')
ax2.set_title('Linear Perception vs Cubic Reality', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Historical Bay of Bengal cyclones
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
storms = {
    'Bhola 1970': 185, 'Odisha 1999': 260, 'Sidr 2007': 215,
    'Nargis 2008': 215, 'Phailin 2013': 215, 'Fani 2019': 240,
    'Amphan 2020': 240, 'Yaas 2021': 140, 'Mocha 2023': 280,
}

storm_names = list(storms.keys())
storm_speeds = list(storms.values())
storm_colors = []
for speed in storm_speeds:
    for name, lo, hi, color in categories:
        if lo <= speed <= hi:
            storm_colors.append(color)
            break
    else:
        storm_colors.append('#7f1d1d')

bars = ax3.barh(storm_names, storm_speeds, color=storm_colors, alpha=0.8)
for bar, speed in zip(bars, storm_speeds):
    ax3.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
            f'{speed} km/h', color='white', fontsize=8, va='center')

ax3.set_xlabel('Maximum sustained wind (km/h)', color='white')
ax3.set_title('Major Bay of Bengal Cyclones', color='white', fontsize=12)
ax3.tick_params(colors='gray')
ax3.set_yticklabels(storm_names, color='white', fontsize=8)

# Wind speed distribution in a cyclone
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
r = np.linspace(1, 500, 500)
Rm = 40  # radius of max wind
Vmax = 220  # km/h

# Holland model (simplified)
V = Vmax * (Rm / r) ** 0.5 * np.exp(0.5 * (1 - (Rm/r)))
V = np.minimum(V, Vmax)

ax4.plot(r, V, color='#ef4444', linewidth=2)
ax4.fill_between(r, V, alpha=0.1, color='#ef4444')

# Mark wind thresholds
for name, lo, hi, color in categories:
    if lo > 30 and lo < 250:
        idx = np.argmin(np.abs(V - lo))
        if idx > 0:
            ax4.axhline(lo, color=color, linestyle=':', alpha=0.4)
            ax4.text(400, lo + 3, name.split()[0], color=color, fontsize=7)

ax4.set_xlabel('Radius from center (km)', color='white')
ax4.set_ylabel('Wind speed (km/h)', color='white')
ax4.set_title('Wind Profile: Category Zones by Radius', color='white', fontsize=12)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Damage scaling:")
for name, lo, hi, _ in categories:
    mid = (lo + hi) / 2
    power_ratio = (mid / 70) ** 3  # relative to a Cyclonic Storm
    print(f"  {name:20s}: {lo:3d}-{hi:3d} km/h, power = {power_ratio:.1f}x Cyclonic Storm")`,
      challenge: 'The potential maximum intensity a cyclone can reach depends on sea surface temperature and upper-atmosphere temperature. Model this relationship: Vmax ∝ sqrt(SST - T_outflow). At what SST can a Super Cyclonic Storm form?',
      successHint: 'Intensity scales help communicate risk to the public, but the cubic damage relationship means that small differences in peak wind speed have enormous consequences. A Cat 4 and a Cat 5 sound similar; their impacts are vastly different.',
    },
    {
      title: 'Numerical weather prediction — computers that see the future',
      concept: `Modern cyclone forecasts rely on **numerical weather prediction (NWP)** — using supercomputers to simulate the atmosphere by solving the fundamental equations of fluid dynamics.

The process:
1. **Observation**: satellites, weather stations, buoys, aircraft, and radiosondes measure temperature, pressure, humidity, and wind globally
2. **Data assimilation**: observations are merged with a previous forecast to create the best possible "initial state"
3. **Model integration**: the equations of motion (Navier-Stokes), thermodynamics, and moisture physics are solved forward in time on a 3D grid
4. **Post-processing**: raw model output is adjusted based on known biases and local effects
5. **Ensemble forecasting**: the model is run 20-50 times with slightly different initial conditions to estimate uncertainty

The atmosphere is divided into millions of grid cells (~10-25 km horizontally, ~50 layers vertically). At each cell, the computer calculates temperature, pressure, humidity, and wind at every time step (typically 10-30 seconds). A 7-day global forecast requires ~10¹⁵ calculations.`,
      analogy: 'NWP is like simulating a chess game forward move by move. The current board position (observations) is known. The rules (physics equations) are known. The computer plays out every possible next move (ensemble members) and reports the most likely outcome. The further ahead you "play" (longer forecast), the more uncertain the result — because small differences in the opening position compound over many moves.',
      storyConnection: 'When the cyclone formed in the Bay of Bengal, NWP models at IMD and international centers were already running forecasts. The fisherman\'s daughter received a warning because a supercomputer solved millions of equations and predicted that the storm would intensify and hit their coast in 48 hours. Without NWP, they would have had hours of warning instead of days.',
      checkQuestion: 'Why is it impossible to make accurate weather forecasts beyond about 10-14 days, even with perfect models?',
      checkAnswer: 'The atmosphere is a chaotic system — tiny differences in initial conditions grow exponentially over time (the "butterfly effect"). Even with perfect physics, our observations have finite precision. A 0.001°C temperature error today becomes a 1°C error in 10 days and a 10°C error in 20 days. Chaos sets a fundamental limit on deterministic weather prediction. This is why we use ensemble (probabilistic) forecasting for longer ranges.',
      codeIntro: 'Simulate how ensemble forecasting works — multiple slightly different starting points diverge over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified ensemble forecast demonstration
# Lorenz-like system (simplified): x_{n+1} = a*x_n*(1-x_n)
# Small differences in initial conditions grow exponentially

a = 3.9  # chaos parameter (>3.57 = chaotic)

# True trajectory
x0_true = 0.5
n_steps = 50
true_traj = [x0_true]
for i in range(n_steps):
    true_traj.append(a * true_traj[-1] * (1 - true_traj[-1]))

# Ensemble: 30 members with slightly perturbed initial conditions
n_ensemble = 30
perturbation = 1e-6  # tiny perturbation

ensemble = []
for member in range(n_ensemble):
    x0 = x0_true + np.random.uniform(-perturbation, perturbation)
    traj = [x0]
    for i in range(n_steps):
        traj.append(a * traj[-1] * (1 - traj[-1]))
    ensemble.append(traj)

ensemble = np.array(ensemble)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# All ensemble members
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
for member in ensemble:
    ax1.plot(member, color='#3b82f6', alpha=0.15, linewidth=0.8)
ax1.plot(true_traj, color='#ef4444', linewidth=2, label='Truth')
ax1.plot(np.mean(ensemble, axis=0), color='#22c55e', linewidth=2, linestyle='--', label='Ensemble mean')
ax1.set_xlabel('Time step', color='white')
ax1.set_ylabel('State variable', color='white')
ax1.set_title(f'Ensemble Forecast ({n_ensemble} members)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Spread over time
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
spread = np.std(ensemble, axis=0)
ax2.plot(spread, color='#f59e0b', linewidth=2)
ax2.fill_between(range(len(spread)), spread, alpha=0.2, color='#f59e0b')
ax2.set_xlabel('Time step', color='white')
ax2.set_ylabel('Ensemble spread (std dev)', color='white')
ax2.set_title('Forecast Uncertainty Grows with Time', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Cyclone track ensemble
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Simulate cyclone track ensemble
n_tracks = 20
base_lat = np.linspace(12, 20, 40)
base_lon = np.linspace(88, 83, 40)

for i in range(n_tracks):
    lat_noise = np.cumsum(np.random.normal(0, 0.03, 40))
    lon_noise = np.cumsum(np.random.normal(0, 0.03, 40))
    ax3.plot(base_lon + lon_noise, base_lat + lat_noise, color='#3b82f6', alpha=0.3, linewidth=1)

ax3.plot(base_lon, base_lat, color='#ef4444', linewidth=2, label='Consensus track')
ax3.set_xlabel('Longitude', color='white')
ax3.set_ylabel('Latitude', color='white')
ax3.set_title('Cyclone Track Ensemble (spaghetti plot)', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Forecast skill vs lead time
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
lead_times = np.arange(0, 169, 12)  # hours
# Track error (km) — real-world improvement over decades
track_error_2000 = 50 + lead_times * 3.5
track_error_2010 = 30 + lead_times * 2.5
track_error_2020 = 20 + lead_times * 1.8
track_error_2025 = 15 + lead_times * 1.5

ax4.plot(lead_times, track_error_2000, color='#ef4444', linewidth=2, label='2000')
ax4.plot(lead_times, track_error_2010, color='#f59e0b', linewidth=2, label='2010')
ax4.plot(lead_times, track_error_2020, color='#3b82f6', linewidth=2, label='2020')
ax4.plot(lead_times, track_error_2025, color='#22c55e', linewidth=2, label='2025')
ax4.set_xlabel('Forecast lead time (hours)', color='white')
ax4.set_ylabel('Track error (km)', color='white')
ax4.set_title('Cyclone Track Forecast Improvement', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Numerical Weather Prediction key facts:")
print(f"  Ensemble members: {n_ensemble}")
print(f"  Initial perturbation: ±{perturbation}")
print(f"  Spread at step 10: {spread[10]:.4f}")
print(f"  Spread at step 30: {spread[30]:.4f}")
print(f"  Spread at step 50: {spread[50]:.4f}")
print(f"\\nSmall errors grow exponentially — this is chaos.")
print(f"Ensemble forecasting acknowledges this by giving probabilities, not certainties.")`,
      challenge: 'Change the Lorenz parameter from 3.9 to 3.5 (less chaotic) and to 4.0 (maximally chaotic). How does the ensemble spread change? At what parameter value does the system become predictable?',
      successHint: 'NWP is one of humanity\'s greatest scientific achievements. Every day, supercomputers solve the equations of atmospheric physics to predict tomorrow\'s weather with remarkable accuracy. Ensemble forecasting honestly represents what we know and what we don\'t.',
    },
    {
      title: 'Climate models — the long view beyond weather',
      concept: `Weather forecasts predict the next 1-10 days. **Climate models** project decades to centuries. They use the same physics but ask a different question: not "will it rain next Tuesday?" but "will monsoons be stronger in 2100?"

The difference:
- **Weather**: specific state of the atmosphere at a specific time (chaotic, unpredictable beyond ~10 days)
- **Climate**: statistical average of weather over 30+ years (much more predictable)

Climate models divide Earth into a 3D grid (~100 km resolution) and simulate:
- Atmosphere (wind, temperature, humidity)
- Oceans (currents, temperature, salinity)
- Land surface (vegetation, soil moisture, ice)
- Carbon cycle (CO₂ emissions, absorption by oceans and forests)

For cyclones and the Bay of Bengal, climate projections suggest:
- Fewer total cyclones but more intense ones (Cat 4-5)
- Higher storm surge due to sea level rise
- Changes in monsoon patterns affecting cyclone steering`,
      analogy: 'The difference between weather and climate is like the difference between a single coin toss and the statistics of 1000 tosses. You can\'t predict the next toss (weather), but you can predict that heads will come up ~50% of the time (climate). Climate models don\'t predict specific future storms — they predict the statistical properties of all future storms.',
      storyConnection: 'The fisherman\'s daughter\'s world is changing. The Bay of Bengal is warming, sea levels are rising, and cyclone patterns are shifting. Her grandchildren may face fewer storms but more violent ones, with higher storm surges reaching further inland. Climate models are the tools that help communities plan for this future — building higher shelters, relocating villages, adapting agriculture.',
      checkQuestion: 'If we can\'t predict weather beyond 10 days, how can climate models project 100 years into the future?',
      checkAnswer: 'Because climate models predict averages, not specific events. You can\'t predict which way a heated pot of water will boil (turbulent), but you can predict that it WILL boil at 100°C (thermodynamic). Similarly, doubling CO₂ changes the average temperature by ~3°C — the specific weather on any given day is unpredictable, but the statistics shift predictably. It\'s statistics, not fortune-telling.',
      codeIntro: 'Build a simple energy balance climate model and explore climate sensitivity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple Energy Balance Model
# dT/dt = (1/C) * (S*(1-alpha)/4 - epsilon*sigma*T^4 + RF)
# S = solar constant, alpha = albedo, epsilon = emissivity, RF = radiative forcing

sigma = 5.67e-8  # Stefan-Boltzmann constant
S = 1361         # solar constant (W/m2)
alpha = 0.30     # Earth's albedo
C = 4.2e8        # heat capacity (J/m2/K, represents mixed ocean layer)
epsilon = 0.62   # effective emissivity (accounts for greenhouse effect)

dt = 365.25 * 24 * 3600  # 1 year in seconds
n_years = 300

# Scenario 1: Pre-industrial (stable)
# Scenario 2: Gradual CO2 increase (RF grows)
# Scenario 3: Abrupt CO2 doubling
# Scenario 4: CO2 doubling then halt

scenarios = {
    'Pre-industrial': np.zeros(n_years),
    'Gradual increase': np.linspace(0, 4, n_years),
    'Abrupt 2x CO2': np.ones(n_years) * 3.7,
    '2x CO2 + halt at yr 150': np.concatenate([np.linspace(0, 3.7, 150), np.ones(150) * 3.7]),
}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Temperature evolution
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
colors = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6']

for (name, RF), color in zip(scenarios.items(), colors):
    T = 288.0  # initial temperature (K)
    temps = [T]
    for year in range(n_years - 1):
        incoming = S * (1 - alpha) / 4 + RF[year]
        outgoing = epsilon * sigma * T ** 4
        dT = (incoming - outgoing) / C * dt
        T += dT
        temps.append(T)
    ax1.plot(range(n_years), np.array(temps) - 288, color=color, linewidth=2, label=name)

ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Temperature change (K)', color='white')
ax1.set_title('Climate Response to CO2 Forcing', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.axhline(0, color='gray', linestyle=':', alpha=0.3)

# Climate sensitivity exploration
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
sensitivities = np.linspace(1.5, 6.0, 100)  # degrees C per doubling
RF_2x = 3.7  # W/m2 for CO2 doubling

# Equilibrium: RF = lambda * dT, where lambda = RF_2x / sensitivity
warming_2100 = sensitivities * 0.7  # transient is ~70% of equilibrium

ax2.fill_between(sensitivities, warming_2100, alpha=0.15, color='#ef4444')
ax2.plot(sensitivities, warming_2100, color='#ef4444', linewidth=2)
ax2.axvspan(2.5, 4.0, alpha=0.1, color='#f59e0b', label='IPCC likely range')
ax2.axvline(3.0, color='#f59e0b', linestyle='--', label='Best estimate (3°C)')
ax2.set_xlabel('Climate sensitivity (°C per CO2 doubling)', color='white')
ax2.set_ylabel('Transient warming by 2100 (°C)', color='white')
ax2.set_title('How Much Will It Warm?', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Bay of Bengal projections
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
decades = ['2020s', '2040s', '2060s', '2080s', '2100s']
cyclone_freq_low = [5.0, 4.8, 4.5, 4.2, 3.8]   # total cyclones per year (decreasing)
cyclone_freq_intense = [1.5, 1.8, 2.2, 2.7, 3.2]  # intense cyclones (increasing)

x_pos = np.arange(len(decades))
ax3.bar(x_pos - 0.15, cyclone_freq_low, width=0.3, color='#3b82f6', alpha=0.7, label='All cyclones')
ax3.bar(x_pos + 0.15, cyclone_freq_intense, width=0.3, color='#ef4444', alpha=0.7, label='Intense (Cat 4+)')
ax3.set_xticks(x_pos)
ax3.set_xticklabels(decades, color='white')
ax3.set_ylabel('Cyclones per year', color='white')
ax3.set_title('Bay of Bengal Cyclone Projections', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Sea level rise + storm surge
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
years_future = np.arange(2020, 2101)
slr_low = (years_future - 2020) * 0.003     # 0.3m by 2100
slr_mid = (years_future - 2020) * 0.005     # 0.5m by 2100
slr_high = (years_future - 2020) * 0.010    # 1.0m by 2100

base_surge = 4  # meters (typical severe cyclone)

ax4.fill_between(years_future, base_surge + slr_low, base_surge + slr_high, alpha=0.2, color='#ef4444')
ax4.plot(years_future, base_surge + slr_mid, color='#ef4444', linewidth=2, label='Surge + SLR (mid)')
ax4.axhline(base_surge, color='#3b82f6', linestyle='--', label=f'Current surge ({base_surge}m)')
ax4.set_xlabel('Year', color='white')
ax4.set_ylabel('Total flood height (m)', color='white')
ax4.set_title('Storm Surge + Sea Level Rise', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate model projections for Bay of Bengal:")
print("  Fewer total cyclones (less favorable conditions overall)")
print("  More intense cyclones (warmer water = more fuel)")
print("  Higher storm surges (sea level rise + intensity increase)")
print("  Changing monsoon patterns (affects cyclone steering)")
print("\\nClimate sensitivity (best estimate): 3.0°C per CO2 doubling")
print("This means: if CO2 doubles from pre-industrial, equilibrium warming ~ 3°C")`,
      challenge: 'Modify the energy balance model to include ice-albedo feedback: as temperature rises, albedo decreases (less ice). Set albedo = 0.30 - 0.02 * max(dT, 0). How does this change the warming? This is a positive feedback loop.',
      successHint: 'Climate models are our only tool for seeing the long-term future of Earth\'s atmosphere. They\'re imperfect, but their core physics is well-tested and their projections are the basis for global climate policy. Understanding their strengths and limitations is essential for informed citizenship.',
    },
    {
      title: 'Disaster preparedness — engineering survival',
      concept: `The science of cyclones means nothing if communities can't survive them. **Disaster preparedness** is the engineering discipline that translates atmospheric science into saved lives.

The system has four phases:
1. **Mitigation**: reduce risk before disaster (build cyclone shelters, plant mangroves, enforce building codes)
2. **Preparedness**: plan for disaster (warning systems, evacuation routes, stockpile supplies, community drills)
3. **Response**: act during disaster (evacuation, search and rescue, emergency shelter, medical aid)
4. **Recovery**: rebuild after disaster (infrastructure repair, economic support, psychological care, lessons learned)

India's cyclone preparedness transformation:
- **1970 (Bhola)**: 300,000-500,000 dead — essentially no warning system
- **1999 (Odisha)**: 10,000 dead — warnings existed but couldn't reach people
- **2013 (Phailin)**: 45 dead — mass evacuation of 1 million people in 48 hours
- **2020 (Amphan)**: 128 dead — 3 million evacuated during a pandemic

The 100x reduction in deaths is not because storms got weaker. It's because preparedness got better.`,
      analogy: 'Disaster preparedness is like a fire escape plan in a building. You hope you never need it, but when the fire alarm rings, every second counts. The plan was designed when there was no fire, tested with drills, and works automatically when panic sets in. Cyclone preparedness works the same way — the time to plan is before the storm, not during it.',
      storyConnection: 'The fisherman\'s daughter survived because she knew what to do. She read the signs, sought shelter, and waited out the storm. Her survival was not luck — it was preparedness, inherited from generations of coastal wisdom. Modern disaster management formalizes this wisdom into systems: warning channels, shelter networks, evacuation protocols. The story\'s lesson — that knowledge saves lives — is the founding principle of disaster risk reduction.',
      checkQuestion: 'Cyclone Phailin (2013) and the Odisha Super Cyclone (1999) hit nearly the same coastline with similar wind speeds. Phailin killed 45 people; the 1999 cyclone killed 10,000+. What changed?',
      checkAnswer: 'Multiple improvements: (1) Cell phones reached rural areas, enabling direct warnings to individuals. (2) 2,000+ cyclone shelters were built after 1999. (3) Evacuation was ordered 48 hours early and enforced. (4) Community-based disaster management trained local leaders. (5) NDRF (National Disaster Response Force) was created in 2006. The science was similar; the preparedness infrastructure was transformed.',
      codeIntro: 'Model the relationship between warning time, shelter availability, and lives saved.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Disaster preparedness effectiveness model
# Lives saved = f(warning_time, shelter_capacity, community_training)

population_at_risk = 500000  # coastal population

# Model: lives saved = pop * (1 - mortality_rate)
# mortality_rate = base_rate * (1 - warning_factor) * (1 - shelter_factor) * (1 - training_factor)

base_mortality = 0.05  # 5% without any intervention (severe cyclone)

# Warning time effect (diminishing returns after 48 hours)
warning_hours = np.linspace(0, 96, 100)
warning_factor = 1 - np.exp(-0.05 * warning_hours)

# Shelter capacity effect
shelter_pct = np.linspace(0, 100, 100)  # % of population with shelter access
shelter_factor = shelter_pct / 100

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Warning time vs lives saved
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
deaths_by_warning = population_at_risk * base_mortality * (1 - warning_factor)
ax1.plot(warning_hours, deaths_by_warning, color='#ef4444', linewidth=2)
ax1.fill_between(warning_hours, deaths_by_warning, alpha=0.15, color='#ef4444')
ax1.set_xlabel('Warning time (hours)', color='white')
ax1.set_ylabel('Expected deaths', color='white')
ax1.set_title('Deaths vs Warning Time (500K at risk)', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Mark real events
events = [(0, 25000, 'Bhola 1970\n(no warning)'),
          (12, 10000, 'Odisha 1999\n(late warning)'),
          (48, 45, 'Phailin 2013\n(48h evacuation)')]
for hrs, deaths, label in events:
    ax1.plot(hrs, deaths, 'o', color='#f59e0b', markersize=8)
    ax1.annotate(label, xy=(hrs, deaths), xytext=(hrs+5, deaths+2000),
                color='#f59e0b', fontsize=8)

# Combined factors heatmap
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
W, S = np.meshgrid(warning_hours, shelter_pct)
w_factor = 1 - np.exp(-0.05 * W)
s_factor = S / 100
combined_deaths = population_at_risk * base_mortality * (1 - w_factor) * (1 - s_factor * 0.8)
combined_deaths = np.log10(np.maximum(combined_deaths, 1))

cs = ax2.contourf(W, S, combined_deaths, levels=20, cmap='RdYlGn_r')
plt.colorbar(cs, ax=ax2, label='log10(deaths)')
ax2.set_xlabel('Warning time (hours)', color='white')
ax2.set_ylabel('Shelter access (%)', color='white')
ax2.set_title('Combined Effect: Warning + Shelter', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Cost-effectiveness of interventions
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
interventions = {
    'Cell towers\\n(warning reach)': {'cost': 50, 'lives_saved_per_event': 8000},
    'Cyclone shelters\\n(2000 built)': {'cost': 200, 'lives_saved_per_event': 5000},
    'Mangrove\\nrestoration': {'cost': 30, 'lives_saved_per_event': 2000},
    'Early warning\\nradar': {'cost': 100, 'lives_saved_per_event': 3000},
    'Community\\ntraining': {'cost': 10, 'lives_saved_per_event': 4000},
    'Evacuation\\nroads': {'cost': 300, 'lives_saved_per_event': 6000},
}

names = list(interventions.keys())
costs = [v['cost'] for v in interventions.values()]
lives = [v['lives_saved_per_event'] for v in interventions.values()]
cost_per_life = [c / l * 1e6 for c, l in zip(costs, lives)]

colors = plt.cm.RdYlGn_r(np.linspace(0.2, 0.8, len(names)))
ax3.scatter(costs, lives, s=[c*2 for c in costs], c=cost_per_life, cmap='RdYlGn_r',
           edgecolors='white', linewidth=0.5)
for name, cost, life in zip(names, costs, lives):
    ax3.annotate(name, xy=(cost, life), xytext=(cost+10, life+200),
                color='white', fontsize=8)

ax3.set_xlabel('Cost (million USD)', color='white')
ax3.set_ylabel('Lives saved per event', color='white')
ax3.set_title('Cost vs Impact of Interventions', color='white', fontsize=12)
ax3.tick_params(colors='gray')

# Timeline of India's disaster preparedness
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
timeline = [
    (1970, 'Bhola: 300K dead'),
    (1977, 'Andhra cyclone: 10K dead'),
    (1999, 'Odisha: 10K dead → reforms begin'),
    (2005, 'NDMA established'),
    (2006, 'NDRF created'),
    (2013, 'Phailin: 45 dead (1M evacuated)'),
    (2019, 'Fani: 64 dead (1.2M evacuated)'),
    (2020, 'Amphan: 128 dead (3M evacuated, during COVID)'),
]

y_positions = range(len(timeline))
colors_tl = ['#ef4444', '#ef4444', '#f59e0b', '#3b82f6', '#3b82f6', '#22c55e', '#22c55e', '#22c55e']

for (year, event), y, color in zip(timeline, y_positions, colors_tl):
    ax4.barh(y, 2025 - year, left=year, color=color, alpha=0.3, height=0.6)
    ax4.text(year + 1, y, f'{year}: {event}', color=color, fontsize=8, va='center')

ax4.set_xlabel('Year', color='white')
ax4.set_title('India\'s Disaster Preparedness Journey', color='white', fontsize=12)
ax4.set_yticks([])
ax4.set_xlim(1965, 2030)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key takeaway: the same cyclones hit India today as in 1970.")
print("The difference is preparedness, not nature.")
print("\\nCost-effectiveness winners:")
for name, data in sorted(interventions.items(), key=lambda x: x[1]['cost']/x[1]['lives_saved_per_event']):
    cpl = data['cost'] / data['lives_saved_per_event'] * 1e6
    print(f"  {name.replace(chr(10), ' ')}: {cpl:,.0f} per life saved")`,
      challenge: 'A government has $100 million to spend on disaster preparedness. Using the cost-effectiveness data above, design the optimal portfolio of interventions. Which combination saves the most lives?',
      successHint: 'Disaster preparedness is where atmospheric science meets civil engineering, social science, economics, and politics. India\'s 100x improvement in cyclone survival is one of the greatest public health achievements of the 21st century — and it\'s replicable anywhere with the political will to invest in preparedness over response.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Atmospheric Dynamics — builds on Level 1 concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for atmospheric modeling. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
