import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KanchenjungaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The energy balance equation — why glaciers melt',
      concept: `A glacier\'s surface gains and loses energy through several processes. The **surface energy balance** determines whether ice melts:

**Q_melt = SW_in - SW_out + LW_in - LW_out + Q_sensible + Q_latent + Q_ground**

Where:
- **SW_in**: incoming shortwave (solar) radiation (~200-300 W/m² at glacier altitude)
- **SW_out**: reflected shortwave = albedo × SW_in (fresh snow albedo ~0.85, dirty ice ~0.3)
- **LW_in**: incoming longwave from atmosphere and clouds
- **LW_out**: emitted longwave = εσT⁴ (Stefan-Boltzmann law)
- **Q_sensible**: heat from warm air touching ice
- **Q_latent**: heat from condensation/evaporation
- **Q_ground**: geothermal heat from below (~0.05 W/m²)

If Q_melt > 0, ice melts. If Q_melt < 0, the surface cools or accumulates frost.

The biggest lever is **albedo**: fresh snow reflects 85% of sunlight, while dirty debris-covered ice reflects only 30%. A thin layer of dust can double the melt rate.

📚 *We will use Python classes to model this multi-component energy system.*`,
      analogy: 'The energy balance is like a budget with many income and expense streams. Solar radiation is a big paycheck (income). Albedo is taxes — the higher the albedo, the more sunlight is "taxed away" (reflected). Longwave emission is rent (always costs energy). If total income exceeds total expenses, the glacier "spends" the surplus on melting.',
      storyConnection: 'Kanchenjunga\'s white peaks are its armor — high albedo reflects sunlight and slows melting. As the story\'s treasures are threatened, so too is this armor: dust from increasing construction, black carbon from fires, and reduced snowfall all darken the glacier surface, accelerating the energy imbalance.',
      checkQuestion: 'If incoming solar radiation is 250 W/m², and albedo drops from 0.85 (fresh snow) to 0.40 (dirty ice), how much extra energy does the surface absorb?',
      checkAnswer: 'Fresh snow absorbs: 250 × (1 - 0.85) = 37.5 W/m². Dirty ice absorbs: 250 × (1 - 0.40) = 150 W/m². Extra absorption: 150 - 37.5 = 112.5 W/m². This is a 4× increase in absorbed solar energy — enough to melt about 3 cm of ice per day.',
      codeIntro: 'Build a surface energy balance model and calculate melt rates for different surface conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class GlacierEnergyBalance:
    """Surface energy balance model for a Himalayan glacier."""

    def __init__(self, altitude_m=5500, latitude=27.7):
        self.altitude = altitude_m
        self.latitude = latitude
        self.sigma = 5.67e-8  # Stefan-Boltzmann constant
        self.Lf = 334000     # Latent heat of fusion (J/kg)
        self.rho_ice = 900    # Ice density (kg/m³)

    def solar_radiation(self, month, cloud_fraction=0.3):
        """Incoming shortwave adjusted for altitude and season."""
        # Solar declination approximation
        day = month * 30
        decl = 23.45 * np.sin(np.radians(360/365 * (day - 81)))
        cos_zenith = max(0.2, np.cos(np.radians(self.latitude - decl)))

        # Clear-sky at altitude (increases ~10% per 1000m)
        base_sw = 1000 * cos_zenith
        altitude_factor = 1 + 0.1 * (self.altitude / 1000)
        sw_clear = base_sw * altitude_factor * 0.75  # atmospheric absorption

        return sw_clear * (1 - 0.6 * cloud_fraction)

    def energy_balance(self, month, albedo=0.7, air_temp=-5, cloud=0.3):
        """Calculate net energy at surface (W/m²)."""
        sw_in = self.solar_radiation(month, cloud)
        sw_net = sw_in * (1 - albedo)

        # Longwave
        lw_in = 0.8 * self.sigma * (air_temp + 273.15)**4 * (1 + 0.2 * cloud)
        lw_out = 0.98 * self.sigma * (273.15)**4  # surface at 0°C when melting
        lw_net = lw_in - lw_out

        # Turbulent fluxes (simplified)
        q_sensible = 10 * air_temp  # rough: 10 W/m² per °C
        q_latent = -5               # sublimation usually negative

        q_total = sw_net + lw_net + q_sensible + q_latent
        return q_total, sw_net, lw_net, q_sensible

    def melt_rate(self, q_melt):
        """Convert energy surplus to melt rate (m/day)."""
        if q_melt <= 0:
            return 0
        # W/m² = J/(s·m²), convert to m ice/day
        melt_m_per_day = q_melt * 86400 / (self.Lf * self.rho_ice)
        return melt_m_per_day

model = GlacierEnergyBalance(altitude_m=5500)

# Compare fresh snow vs dirty ice in June
print("=== Energy Balance Comparison (June, 5500m) ===\\\n")
for surface, albedo in [("Fresh snow", 0.85), ("Old snow", 0.60), ("Dirty ice", 0.35)]:
    q, sw, lw, qs = model.energy_balance(month=6, albedo=albedo, air_temp=2)
    melt = model.melt_rate(q)
    print(f"{surface} (α={albedo}):")
    print(f"  SW absorbed: {sw:+.0f} W/m²  LW net: {lw:+.0f} W/m²  Sensible: {qs:+.0f} W/m²")
    print(f"  Net energy:  {q:+.0f} W/m²  →  Melt: {melt*100:.1f} cm/day")
    print()

# Seasonal melt cycle
months = np.arange(1, 13)
temps = np.array([-15, -12, -8, -3, 1, 4, 5, 4, 2, -3, -8, -13])
melt_fresh = []
melt_dirty = []
for m, t in zip(months, temps):
    q1, *_ = model.energy_balance(m, albedo=0.75, air_temp=t)
    q2, *_ = model.energy_balance(m, albedo=0.40, air_temp=t)
    melt_fresh.append(model.melt_rate(q1) * 30 * 100)  # cm/month
    melt_dirty.append(model.melt_rate(q2) * 30 * 100)

print(f"Annual melt — clean glacier: {sum(melt_fresh):.0f} cm")
print(f"Annual melt — dirty glacier: {sum(melt_dirty):.0f} cm")
print(f"Darkening increases melt by {sum(melt_dirty)/max(sum(melt_fresh),1):.1f}x")`,
      challenge: 'Add black carbon deposition: reduce albedo by 0.05 each month from March to August (fire season). How much extra annual melt does this cause?',
      successHint: 'You have built a physics-based energy balance model using a Python class. The albedo effect is not hypothetical — black carbon from cooking fires and vehicles is measurably darkening Himalayan glaciers, accelerating their demise.',
    },
    {
      title: 'Glen\'s Flow Law — the constitutive equation of ice',
      concept: `**Glen\'s Flow Law** describes how ice deforms under stress:

**ε̇ = A · τⁿ**

Where:
- **ε̇** (epsilon-dot) = strain rate (deformation per unit time, s⁻¹)
- **A** = flow rate factor (depends on temperature, ~10⁻¹⁶ to 10⁻¹⁵ s⁻¹ Pa⁻³)
- **τ** (tau) = shear stress (Pa)
- **n** = flow law exponent (≈ 3 for glacier ice)

The cubic exponent means ice behaves highly nonlinearly:
- Double the stress → 8× the deformation rate
- This is why thick glaciers flow much faster than thin ones

The shear stress at the base of a glacier:
**τ_base = ρ · g · h · sin(α)**

Where ρ = ice density, g = gravity, h = thickness, α = slope.

Temperature dependence of A follows an Arrhenius relationship:
**A = A₀ · exp(-Q/(R·T))**

Warmer ice flows faster — a glacier at -2°C deforms ~10× faster than one at -30°C. This is why Himalayan glaciers (relatively warm) flow faster than polar glaciers.

📚 *We will solve differential equations numerically to model glacier velocity profiles.*`,
      analogy: 'Glen\'s Flow Law is like describing how toothpaste flows. Apply gentle pressure and nothing happens. Apply moderate pressure and it moves slowly. Push hard and it squirts out. Ice is similar — it resists small stresses but yields dramatically to large ones. The cubic law captures this nonlinear "stubborn then sudden" behavior.',
      storyConnection: 'The glaciers of Kanchenjunga are not rigid walls guarding treasures — they are flowing, deforming rivers of ice governed by precise mathematical laws. Glen\'s Flow Law lets us predict how quickly they move and how they respond to warming. The treasures are guarded by physics, not magic.',
      checkQuestion: 'If stress doubles, by what factor does the strain rate increase for n = 3? For n = 4?',
      checkAnswer: 'For n = 3: strain rate increases by 2³ = 8×. For n = 4: 2⁴ = 16×. The higher the exponent, the more sensitive ice is to stress changes. This nonlinearity means glacier response to climate change can be abrupt — small increases in thickness (from more rain) can cause disproportionate speedup.',
      codeIntro: 'Compute and plot the velocity profile through a glacier using Glen\'s Flow Law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def glen_velocity_profile(H, alpha_deg, A=2.4e-24, n=3, rho=900, g=9.81, nz=100):
    """
    Compute velocity profile through glacier thickness.
    H: ice thickness (m)
    alpha_deg: surface slope (degrees)
    Returns: z (height above bed), u (horizontal velocity)
    """
    alpha = np.radians(alpha_deg)
    z = np.linspace(0, H, nz)  # 0 = bed, H = surface

    # Velocity from internal deformation (no sliding)
    # u(z) = (2A/(n+1)) * (rho*g*sin(alpha))^n * (H^(n+1) - (H-z)^(n+1))
    tau_factor = (rho * g * np.sin(alpha)) ** n
    u = (2 * A / (n + 1)) * tau_factor * (H**(n+1) - (H - z)**(n+1))

    return z, u

H = 200  # m thickness
alpha = 5  # degrees

z, u = glen_velocity_profile(H, alpha)
u_m_per_year = u * 3.15e7  # convert m/s to m/year

fig, axes = plt.subplots(1, 3, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')
for ax in axes:
    ax.set_facecolor('#1f2937')

# Velocity profile
ax = axes[0]
ax.plot(u_m_per_year, z, '#60a5fa', linewidth=2.5)
ax.fill_betweenx(z, 0, u_m_per_year, alpha=0.2, color='#3b82f6')
ax.set_xlabel('Velocity (m/year)', color='white', fontsize=11)
ax.set_ylabel('Height above bed (m)', color='white', fontsize=11)
ax.set_title('Velocity Profile (n=3)', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.2)

# Effect of n
ax = axes[1]
for n_val, color in [(1, '#22c55e'), (3, '#3b82f6'), (5, '#ef4444')]:
    z_n, u_n = glen_velocity_profile(H, alpha, n=n_val)
    u_n_yr = u_n * 3.15e7
    ax.plot(u_n_yr, z_n, color=color, linewidth=2, label=f'n = {n_val}')
ax.set_xlabel('Velocity (m/year)', color='white', fontsize=11)
ax.set_title('Effect of Flow Exponent', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.2)

# Effect of thickness
ax = axes[2]
for thick, color in [(100, '#22c55e'), (200, '#3b82f6'), (300, '#ef4444')]:
    z_h, u_h = glen_velocity_profile(thick, alpha)
    u_h_yr = u_h * 3.15e7
    ax.plot(u_h_yr, z_h / thick, color=color, linewidth=2, label=f'H = {thick}m')
ax.set_xlabel('Velocity (m/year)', color='white', fontsize=11)
ax.set_ylabel('Normalized height (z/H)', color='white', fontsize=11)
ax.set_title('Effect of Thickness', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.2)

plt.tight_layout()
plt.savefig('glen_flow.png', dpi=100, facecolor='#1f2937')
plt.show()

surface_v = u_m_per_year[-1]
print(f"Surface velocity: {surface_v:.1f} m/year ({surface_v/365:.2f} m/day)")
print(f"Basal velocity: {u_m_per_year[0]:.1f} m/year (no sliding)")
print(f"\\\nWith n=3, most deformation happens near the base")
print(f"The top 50% of the glacier moves as a nearly rigid block")`,
      challenge: 'Add basal sliding: add a constant 15 m/year to the entire velocity profile. How does the profile shape change? What fraction of total motion is now from sliding?',
      successHint: 'You have solved Glen\'s Flow Law analytically and visualized the characteristic velocity profiles. The "plug flow" shape (rigid top, shearing base) is observed in every glacier on Earth — a beautiful confirmation of the physics.',
    },
    {
      title: 'Numerical glacier evolution — the shallow ice approximation',
      concept: `The **Shallow Ice Approximation (SIA)** models how glacier thickness evolves over time. It combines mass conservation with Glen\'s Flow Law:

**∂h/∂t = ∇ · (D ∇s) + ḃ**

Where:
- **h** = ice thickness
- **s** = surface elevation = bed + h
- **D** = diffusivity = (2A/(n+2)) · (ρg)ⁿ · h^(n+2) · |∇s|^(n-1)
- **ḃ** = mass balance (accumulation - ablation)

This is a nonlinear diffusion equation. Unlike heat diffusion (linear), the diffusivity itself depends on thickness and slope, making the equation strongly nonlinear.

We solve it numerically using the **finite difference method**:
1. Discretize the glacier into grid cells
2. Calculate D at each cell from current h and slope
3. Calculate flux between cells: q = -D · ds/dx
4. Update thickness: h_new = h_old + dt · (dq/dx + ḃ)
5. Repeat

This is the same approach used in research ice-sheet models like PISM and Elmer/Ice.

📚 *We will implement a 1D glacier evolution model using numpy and finite differences.*`,
      analogy: 'Think of the glacier as a pile of very thick syrup on a tilted counter. The syrup spreads out over time — thicker parts push outward faster (nonlinear diffusion). Adding more syrup at the top (accumulation) and wiping it away at the bottom (ablation) determines whether the pile grows or shrinks. Our simulation tracks this spreading second by second.',
      storyConnection: 'The SIA lets us simulate how Kanchenjunga\'s glaciers will evolve over the next century. Will the five treasures remain locked in ice, or will they be exposed? The answer depends on the mass balance — which depends on how much we warm the planet.',
      checkQuestion: 'Why is the equation called "shallow ice"? What does that assumption mean?',
      checkAnswer: 'The "shallow" assumption means the glacier is much wider than it is thick — like a pancake, not a cube. This simplifies the stress calculation: shear stress at the base depends only on local thickness and slope, not on what is happening far away. This works well for ice sheets and most valley glaciers, but fails at ice cliffs and calving fronts where the aspect ratio is not shallow.',
      codeIntro: 'Build a 1D glacier evolution model using the Shallow Ice Approximation and simulate 500 years of evolution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def glacier_sia_1d(nx=100, dx=200, dt_years=0.05, n_years=500):
    """1D Shallow Ice Approximation glacier model."""
    A = 2.4e-24        # Glen's flow parameter
    n = 3               # Glen's exponent
    rho = 900           # Ice density
    g = 9.81

    dt = dt_years * 3.15e7  # convert to seconds
    nt = int(n_years / dt_years)

    # Bed topography: valley with headwall
    x = np.arange(nx) * dx
    bed = 5500 - 0.05 * x + 200 * np.exp(-((x - 2000)/1000)**2)

    # Initial ice: thin layer
    h = np.maximum(50 - 0.005 * x, 0)

    # Mass balance: linear with elevation
    ela = 5200  # equilibrium line altitude

    snapshots = []
    snap_times = [0, 50, 100, 200, 500]

    for step in range(nt):
        t_yr = step * dt_years

        surface = bed + h

        # Mass balance (m/yr ice equivalent)
        b = 0.005 * (surface - ela)  # 5mm w.e. per meter above ELA
        b = np.clip(b, -3, 2)        # cap melt and accumulation

        # SIA diffusivity
        dsdx = np.zeros(nx)
        dsdx[1:-1] = (surface[2:] - surface[:-2]) / (2 * dx)

        D = (2 * A / (n + 2)) * (rho * g)**n * h**(n+2) * np.abs(dsdx)**(n-1)

        # Flux
        flux = np.zeros(nx)
        flux[1:-1] = -0.5 * (D[1:-1] + D[:-2]) * (surface[1:-1] - surface[:-2]) / dx

        # Thickness update
        dqdx = np.zeros(nx)
        dqdx[1:-1] = (flux[2:] - flux[:-2]) / (2 * dx)

        h += (dqdx + b / 3.15e7 * dt) * dt / 3.15e7
        h = np.maximum(h, 0)

        if any(abs(t_yr - t) < dt_years/2 for t in snap_times):
            snapshots.append((t_yr, h.copy()))

    return x, bed, snapshots

x, bed, snapshots = glacier_sia_1d()

fig, ax = plt.subplots(figsize=(12, 6))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Bed
ax.fill_between(x/1000, bed, bed.min()-100, color='#6b7280', alpha=0.5)
ax.plot(x/1000, bed, color='#9ca3af', linewidth=1.5, label='Bedrock')

# Ice at different times
colors = ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8']
for (t, h), c in zip(snapshots, colors):
    surface = bed + h
    mask = h > 0.5
    if mask.any():
        ax.fill_between(x[mask]/1000, bed[mask], surface[mask], alpha=0.4, color=c)
        ax.plot(x[mask]/1000, surface[mask], color=c, linewidth=1.5, label=f't = {t:.0f} yr')

ax.axhline(y=5200, color='gold', linestyle='--', alpha=0.7, label='ELA (5200m)')
ax.set_xlabel('Distance (km)', color='white', fontsize=12)
ax.set_ylabel('Elevation (m)', color='white', fontsize=12)
ax.set_title('Glacier Evolution — Shallow Ice Approximation', color='white', fontsize=14, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('sia_evolution.png', dpi=100, facecolor='#1f2937')
plt.show()

final_h = snapshots[-1][1]
print(f"Max ice thickness at t=500yr: {final_h.max():.0f} m")
print(f"Glacier length: {np.sum(final_h > 0.5) * 0.2:.1f} km")
print(f"Total ice volume: {np.sum(final_h) * 200:.0f} m³ per meter width")`,
      challenge: 'Raise the ELA by 200m (from 5200 to 5400) at year 300 to simulate warming. Run the model for another 200 years and plot the before/after comparison.',
      successHint: 'You have built a real ice-sheet model! The SIA is used by glaciologists worldwide. Your 1D version captures the essential physics: glacier advance is slow (diffusion), retreat is fast (positive feedback), and the ELA controls the equilibrium size.',
    },
    {
      title: 'Glacial lake outburst floods — modeling catastrophic drainage',
      concept: `**Glacial Lake Outburst Floods (GLOFs)** occur when a glacial lake breaches its dam — typically a moraine (pile of debris) left by a retreating glacier. The resulting flood can be devastating.

The 2023 South Lhonak Lake GLOF in Sikkim killed 40+ people and destroyed the Chungthang Dam. The lake had grown from 0.2 km² to 1.0 km² over 20 years as the glacier retreated.

The physics of a GLOF involves:
1. **Trigger**: ice avalanche, moraine failure, piping (internal erosion)
2. **Breach growth**: once water flows through a crack, it erodes the moraine, widening the breach
3. **Peak discharge**: governed by lake volume and breach dimensions
4. **Flood routing**: wave propagates downstream, attenuating with distance

The **breach outflow equation** (simplified):
Q = C_d × B × (H - z)^(3/2)

Where Q = discharge, C_d = discharge coefficient, B = breach width, H = lake level, z = breach bottom elevation.

As water flows out, B increases (erosion) and H decreases (draining). The race between these determines peak discharge.

📚 *We will numerically solve coupled differential equations for breach growth and lake drainage.*`,
      analogy: 'Imagine poking a hole in the bottom of a full bathtub. Water rushes out, enlarging the hole. The bigger the hole, the faster the water drains, but the lower the water level, the weaker the flow. Peak outflow happens when the hole is large but the tub is still fairly full — a critical moment. A GLOF is this process at catastrophic scale.',
      storyConnection: 'In 2023, Sikkim experienced the fury of a GLOF firsthand. The five treasures story speaks of Kanchenjunga\'s protection — but the melting glaciers create new dangers. The very retreat that reveals the mountain\'s "treasures" also fills lakes that become loaded weapons.',
      checkQuestion: 'Why does peak GLOF discharge occur before the lake is fully drained?',
      checkAnswer: 'Peak discharge requires both a large breach AND high water level. Initially the breach is small (low Q despite high H). Later the lake is nearly empty (low H despite large breach). The peak occurs at the intermediate point where the product of breach area and water head is maximum — typically when the lake is about 30-50% drained.',
      codeIntro: 'Simulate a GLOF from a moraine-dammed lake using coupled differential equations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def simulate_glof(lake_area=1e6, lake_depth=40, breach_width0=2,
                  erosion_rate=0.005, dt=60):
    """
    Simulate a Glacial Lake Outburst Flood.
    lake_area: m² (1 km² = 1e6 m²)
    lake_depth: initial depth (m)
    breach_width0: initial breach width (m)
    erosion_rate: breach widening rate (m/s per m^0.5 of flow)
    dt: time step (seconds)
    """
    Cd = 1.5         # discharge coefficient
    g = 9.81

    H = lake_depth    # water level above breach base
    B = breach_width0 # breach width
    z = 0             # breach bottom (doesn't erode in this simple model)

    time_hrs = []
    discharge = []
    levels = []
    widths = []

    t = 0
    max_time = 48 * 3600  # 48 hours

    while t < max_time and H > 0.1:
        # Discharge through breach
        Q = Cd * B * np.sqrt(2 * g) * max(H, 0)**1.5

        # Lake level change (dH/dt = -Q / A)
        dH = -Q / lake_area * dt
        H = max(H + dH, 0)

        # Breach erosion (widens proportional to flow velocity)
        flow_vel = np.sqrt(2 * g * max(H, 0))
        dB = erosion_rate * flow_vel * dt
        B += dB

        time_hrs.append(t / 3600)
        discharge.append(Q)
        levels.append(H)
        widths.append(B)

        t += dt

    return (np.array(time_hrs), np.array(discharge),
            np.array(levels), np.array(widths))

t, Q, H, B = simulate_glof()

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('GLOF Simulation — South Lhonak Lake Type Event',
             color='white', fontsize=14, fontweight='bold')

plots = [
    (axes[0,0], Q, '#ef4444', 'Discharge (m³/s)', 'Flood Discharge'),
    (axes[0,1], H, '#3b82f6', 'Lake Level (m)', 'Lake Drainage'),
    (axes[1,0], B, '#f59e0b', 'Breach Width (m)', 'Breach Growth'),
]

for ax, data, color, ylabel, title in plots:
    ax.set_facecolor('#1f2937')
    ax.plot(t, data, color=color, linewidth=2)
    ax.fill_between(t, data, alpha=0.2, color=color)
    ax.set_xlabel('Time (hours)', color='white', fontsize=10)
    ax.set_ylabel(ylabel, color='white', fontsize=10)
    ax.set_title(title, color='white', fontsize=12, fontweight='bold')
    ax.tick_params(colors='white')
    ax.grid(alpha=0.2)

# Phase diagram
ax = axes[1,1]
ax.set_facecolor('#1f2937')
sc = ax.scatter(H, Q, c=t, cmap='plasma', s=2, alpha=0.8)
ax.set_xlabel('Lake Level (m)', color='white', fontsize=10)
ax.set_ylabel('Discharge (m³/s)', color='white', fontsize=10)
ax.set_title('Phase Diagram (color = time)', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.2)
plt.colorbar(sc, ax=ax, label='Hours')

plt.tight_layout()
plt.savefig('glof.png', dpi=100, facecolor='#1f2937')
plt.show()

peak_Q = Q.max()
peak_t = t[Q.argmax()]
drain_time = t[np.argmax(H < 1)] if np.any(H < 1) else t[-1]
print(f"Peak discharge: {peak_Q:.0f} m³/s at t = {peak_t:.1f} hours")
print(f"For comparison: normal Teesta flow ~ 50 m³/s")
print(f"Peak flood is {peak_Q/50:.0f}x normal river flow")
print(f"Lake mostly drained by t = {drain_time:.1f} hours")
print(f"Final breach width: {B[-1]:.0f} m")`,
      challenge: 'Run three scenarios: small lake (0.5 km²), medium (1 km²), large (2 km²). How does peak discharge scale with lake size? Plot all three on the same axes.',
      successHint: 'You have built a GLOF model that captures the essential dynamics: the breach-discharge feedback loop, the characteristic peak, and the rapid drainage. This is the same physics used in hazard assessment for Himalayan glacial lakes — including the one that devastated Sikkim in 2023.',
    },
    {
      title: 'Climate projections — Kanchenjunga\'s glaciers in 2100',
      concept: `Climate models project future glacier health using **Representative Concentration Pathways (RCPs)** — scenarios of greenhouse gas emissions:

- **RCP 2.6**: Strong mitigation. Warming ~1.5°C by 2100. Himalayan glaciers lose 30-50% of mass.
- **RCP 4.5**: Moderate action. Warming ~2.5°C. Glaciers lose 50-70%.
- **RCP 8.5**: Business as usual. Warming ~4.5°C. Glaciers lose 60-90%.

The projection method:
1. Global climate models (GCMs) provide temperature and precipitation changes
2. **Downscaling**: adjust GCM output to mountain-scale resolution
3. **Glacier model**: feed downscaled climate into mass balance + flow models
4. **Ensemble**: run many models, report range of outcomes

Key feedbacks that accelerate loss:
- **Albedo feedback**: darker ice absorbs more heat → more melt → more darkening
- **Elevation feedback**: as ice thins, surface descends into warmer air
- **Area feedback**: smaller glacier catches less snow
- **Debris feedback**: retreating glaciers leave insulating debris (can slow or speed melt)

Kanchenjunga\'s glaciers are projected to lose 40-80% of their volume by 2100, depending on emissions.

📚 *We will implement multiple projection scenarios and use class-based modeling to compare outcomes.*`,
      analogy: 'Climate projections are like weather forecasts for decades. We cannot predict the exact temperature on March 15, 2087. But we can predict the trend — like knowing summer will be hotter than winter. The RCP scenarios are like asking: "If we drive at 60 km/h vs 120 km/h, when do we reach the cliff edge?"',
      storyConnection: 'The five treasures of Kanchenjunga were promised to be revealed in humanity\'s time of greatest need. Climate models tell us that time may come within this century. The glaciers that hold Sikkim\'s water supply are on a trajectory determined by choices we make today.',
      checkQuestion: 'Why do all RCP scenarios show significant glacier loss, even the optimistic RCP 2.6?',
      checkAnswer: 'Because of "committed warming" — even if we stop all emissions today, the planet will continue warming for decades due to: (1) thermal inertia of the oceans, (2) CO₂ already in the atmosphere lasting centuries, (3) glaciers taking decades to adjust to current temperatures. The climate system has momentum, like a supertanker that cannot stop instantly.',
      codeIntro: 'Project Kanchenjunga glacier volume to 2100 under three emission scenarios with feedback effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class GlacierProjection:
    """Project glacier volume under different climate scenarios."""

    def __init__(self, initial_volume=50, initial_area=80, ela_2020=5400):
        self.V0 = initial_volume   # km³
        self.A0 = initial_area     # km²
        self.ela_2020 = ela_2020   # m

    def project(self, scenario, years):
        """Run projection for given RCP scenario."""
        warming_rates = {
            'RCP 2.6': 0.015,  # °C/year
            'RCP 4.5': 0.025,
            'RCP 8.5': 0.045,
        }
        rate = warming_rates[scenario]

        V = np.zeros(len(years))
        A = np.zeros(len(years))
        ELA = np.zeros(len(years))
        V[0] = self.V0
        A[0] = self.A0
        ELA[0] = self.ela_2020

        for i in range(1, len(years)):
            dt = years[i] - years[i-1]
            dT = rate * (years[i] - 2020)

            # ELA rises ~150m per °C of warming
            ELA[i] = self.ela_2020 + 150 * dT

            # Volume-area scaling: A = c * V^gamma
            gamma = 0.67
            c = self.A0 / self.V0**gamma

            # Mass balance depends on ELA position and area
            fraction_above_ela = max(0, 1 - (ELA[i] - self.ela_2020) / 1500)
            mass_balance = -0.5 * (1 + dT * 0.3)  # m w.e./yr, worsening

            # Albedo feedback: darker as glacier shrinks
            albedo_factor = 1 + 0.1 * (1 - V[i-1] / self.V0)

            # Volume change
            dV = mass_balance * A[i-1] * 1e-3 * albedo_factor * dt
            V[i] = max(V[i-1] + dV, 0)
            A[i] = c * max(V[i], 0.01)**gamma

        return V, A, ELA

model = GlacierProjection()
years = np.arange(2020, 2101)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

scenarios = {
    'RCP 2.6': ('#22c55e', 'Strong mitigation'),
    'RCP 4.5': ('#f59e0b', 'Moderate action'),
    'RCP 8.5': ('#ef4444', 'Business as usual'),
}

for scenario, (color, label) in scenarios.items():
    V, A, ELA = model.project(scenario, years)

    axes[0].plot(years, V, color=color, linewidth=2.5, label=f'{scenario}: {label}')
    axes[0].fill_between(years, V, alpha=0.1, color=color)

    axes[1].plot(years, A, color=color, linewidth=2.5, label=scenario)

    axes[2].plot(years, ELA, color=color, linewidth=2.5, label=scenario)

titles = ['Glacier Volume (km³)', 'Glacier Area (km²)', 'ELA (m)']
ylabels = ['Volume', 'Area', 'Elevation']

for ax, title, ylabel in zip(axes, titles, ylabels):
    ax.set_facecolor('#1f2937')
    ax.set_title(title, color='white', fontsize=13, fontweight='bold')
    ax.set_xlabel('Year', color='white', fontsize=11)
    ax.set_ylabel(ylabel, color='white', fontsize=11)
    ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
    ax.tick_params(colors='white')
    ax.grid(alpha=0.2)

plt.tight_layout()
plt.savefig('projections.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Kanchenjunga Glacier Projections for 2100 ===\\\n")
for scenario, (color, label) in scenarios.items():
    V, A, ELA = model.project(scenario, years)
    loss = (1 - V[-1] / model.V0) * 100
    print(f"{scenario} ({label}):")
    print(f"  Volume remaining: {V[-1]:.1f} km³ ({100-loss:.0f}% of current)")
    print(f"  Area remaining:   {A[-1]:.1f} km²")
    print(f"  ELA rise:         {ELA[-1] - model.ela_2020:.0f} m")
    print()

print("The difference between scenarios = the power of policy choices")`,
      challenge: 'Add a "net zero by 2050" scenario where warming rate drops to 0 after 2050. How much better is the outcome than RCP 4.5?',
      successHint: 'You have built a multi-scenario glacier projection model with nonlinear feedbacks. The gap between RCP 2.6 and RCP 8.5 represents the impact of human choices. Every fraction of a degree matters when glaciers are at stake — and 1.9 billion people depend on them.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced glacier modeling with differential equations</span>
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
