import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FerrymanLevel3() {
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
      title: 'Archimedes\' principle — why boats float and cargo sinks',
      concept: `Every ferry on the Brahmaputra River obeys a 2,200-year-old law discovered by Archimedes: **any object immersed in a fluid experiences an upward buoyant force equal to the weight of the fluid it displaces**. This single principle determines whether a boat floats or sinks, how much cargo it can carry, and how deep it sits in the water.

Mathematically: F_buoyancy = rho_fluid * g * V_displaced, where rho_fluid is the fluid density (1000 kg/m^3 for fresh water), g is gravitational acceleration (9.81 m/s^2), and V_displaced is the volume of fluid pushed aside by the submerged part of the hull.

A boat floats when the buoyant force equals its total weight: rho_water * g * V_displaced = m_boat * g. This simplifies to V_displaced = m_boat / rho_water. A 1000 kg boat must displace 1 m^3 of water. The **draft** (depth the hull sits below the waterline) depends on the hull shape — a wide, flat hull has a small draft for the same displacement because it spreads the displaced volume over a larger area.

The key design constraint is **freeboard** — the distance from the waterline to the deck. If cargo pushes the boat down so freeboard approaches zero, the next wave will flood the deck. The ferryman must know exactly how much cargo he can load before the freeboard becomes dangerous. This is why every commercial vessel has a **Plimsoll line** — a mark on the hull showing the maximum safe loading depth for different water conditions (fresh water, salt water, tropical, winter).`,
      analogy: 'Think of floating in a swimming pool. When you spread out flat (like a raft), you float high because your body displaces a thin, wide layer of water. When you curl into a ball, you sink lower because the same weight is concentrated into a smaller area, requiring deeper submersion to displace enough water. A ferry hull is designed to be the "spread out flat" version — maximizing the waterplane area so the boat sits high even when heavily loaded.',
      storyConnection: 'The ferryman in the story must carry villagers, livestock, and goods across the Brahmaputra — one of the widest rivers in the world, notorious for strong currents and monsoon flooding. He learned from his father to read the waterline: "When the third plank disappears below the water, stop loading." That third plank was his Plimsoll line — an intuitive understanding of Archimedes\' principle passed down through generations.',
      checkQuestion: 'A rectangular ferry is 10 m long, 3 m wide, and has a hull depth of 1.2 m. If the total loaded mass is 8000 kg, what is the draft? What is the freeboard?',
      checkAnswer: 'Draft = V_displaced / (L * W) = (m / rho_water) / (L * W) = (8000 / 1000) / (10 * 3) = 8 / 30 = 0.267 m. Freeboard = hull depth - draft = 1.2 - 0.267 = 0.933 m. This is generous freeboard. But if the load doubles to 16000 kg, draft = 0.533 m and freeboard = 0.667 m. At 30000 kg, draft = 1.0 m and freeboard is only 0.2 m — dangerously low in river conditions.',
      codeIntro: 'Model buoyancy for different hull shapes and calculate how draft and freeboard change with cargo loading.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Archimedes' principle: buoyancy calculations for river ferries
g = 9.81
rho_water = 1000  # kg/m^3 (fresh water, Brahmaputra)

class FerryHull:
    """Model different hull cross-section shapes."""
    def __init__(self, name, length, beam, depth, shape='rectangular', color='gray'):
        self.name = name
        self.L = length  # m
        self.B = beam  # m (width)
        self.D = depth  # m (hull depth)
        self.shape = shape
        self.color = color

    def waterplane_area(self, draft):
        """Area of hull at waterline (depends on shape)."""
        if self.shape == 'rectangular':
            return self.L * self.B
        elif self.shape == 'V_hull':
            # V-hull gets wider as draft increases
            effective_beam = self.B * (draft / self.D)
            return self.L * effective_beam
        elif self.shape == 'round':
            # Semi-circular cross-section
            if draft <= self.B / 2:
                r = self.B / 2
                theta = 2 * np.arccos(1 - draft / r)
                chord = 2 * r * np.sin(theta / 2)
                return self.L * chord
            return self.L * self.B

    def displaced_volume(self, draft):
        """Volume displaced at given draft."""
        if self.shape == 'rectangular':
            return self.L * self.B * draft
        elif self.shape == 'V_hull':
            # Triangular cross-section
            effective_beam = self.B * (draft / self.D)
            return self.L * 0.5 * effective_beam * draft
        elif self.shape == 'round':
            r = self.B / 2
            if draft <= r:
                # Circular segment area
                theta = 2 * np.arccos(1 - draft / r)
                segment_area = 0.5 * r**2 * (theta - np.sin(theta))
                return self.L * segment_area
            return self.L * np.pi * r**2 / 2

    def draft_for_mass(self, mass):
        """Find draft that balances buoyancy with weight."""
        target_vol = mass / rho_water
        # Binary search for draft
        lo, hi = 0, self.D
        for _ in range(50):
            mid = (lo + hi) / 2
            if self.displaced_volume(mid) < target_vol:
                lo = mid
            else:
                hi = mid
        return (lo + hi) / 2

    def freeboard(self, mass):
        return self.D - self.draft_for_mass(mass)

# Define ferry designs
ferries = [
    FerryHull("Flat-bottom barge", 12, 4, 1.0, 'rectangular', '#3b82f6'),
    FerryHull("V-hull speedboat", 8, 2.5, 1.2, 'V_hull', '#ef4444'),
    FerryHull("Round-bottom (traditional)", 10, 3, 1.1, 'round', '#22c55e'),
]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Hull cross-sections
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for i, ferry in enumerate(ferries):
    offset = i * 6
    if ferry.shape == 'rectangular':
        xs = [-ferry.B/2 + offset, ferry.B/2 + offset, ferry.B/2 + offset,
              -ferry.B/2 + offset, -ferry.B/2 + offset]
        ys = [0, 0, -ferry.D, -ferry.D, 0]
    elif ferry.shape == 'V_hull':
        xs = [-ferry.B/2 + offset, offset, ferry.B/2 + offset, -ferry.B/2 + offset]
        ys = [0, -ferry.D, 0, 0]
    elif ferry.shape == 'round':
        theta = np.linspace(0, np.pi, 50)
        r = ferry.B / 2
        xs = list(r * np.cos(theta) + offset)
        ys = list(-r * np.sin(theta))
        xs.append(xs[0])
        ys.append(ys[0])

    ax.fill(xs, ys, color=ferry.color, alpha=0.3)
    ax.plot(xs, ys, color=ferry.color, linewidth=2)
    ax.text(offset, 0.15, ferry.name.split('(')[0].strip(), ha='center',
            color=ferry.color, fontsize=7, fontweight='bold')

ax.axhline(0, color='#06b6d4', linewidth=1, alpha=0.5)
ax.set_xlabel('Position (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.set_title('Hull cross-sections', color='white', fontsize=11)
ax.text(-3, 0.05, 'Waterline', color='#06b6d4', fontsize=8)

# Plot 2: Draft vs cargo mass
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

masses = np.linspace(500, 20000, 200)
for ferry in ferries:
    drafts = [ferry.draft_for_mass(m) for m in masses]
    ax.plot(masses / 1000, drafts, color=ferry.color, linewidth=2, label=ferry.name)
    ax.axhline(ferry.D, color=ferry.color, linestyle=':', alpha=0.3)

ax.set_xlabel('Total mass (tonnes)', color='white')
ax.set_ylabel('Draft (m)', color='white')
ax.set_title('Draft vs loading', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Freeboard vs cargo
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for ferry in ferries:
    freeboards = [ferry.freeboard(m) for m in masses]
    ax.plot(masses / 1000, freeboards, color=ferry.color, linewidth=2, label=ferry.name)

ax.axhline(0.2, color='#ef4444', linestyle='--', alpha=0.7, label='Min safe freeboard (0.2m)')
ax.axhline(0, color='white', linewidth=1)
ax.set_xlabel('Total mass (tonnes)', color='white')
ax.set_ylabel('Freeboard (m)', color='white')
ax.set_title('Freeboard (safety margin)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(-0.2, 1.2)

# Plot 4: Maximum safe cargo
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

max_cargos = []
empty_masses = [2000, 1500, 1800]  # kg
for ferry, empty in zip(ferries, empty_masses):
    # Find mass where freeboard = 0.2m
    for m in np.arange(empty, 30000, 100):
        if ferry.freeboard(m) < 0.2:
            max_cargos.append((m - empty) / 1000)
            break
    else:
        max_cargos.append(25)

bars = ax.bar(range(len(ferries)), max_cargos,
              color=[f.color for f in ferries], alpha=0.8)
ax.set_xticks(range(len(ferries)))
ax.set_xticklabels([f.name.split('(')[0].strip() for f in ferries],
                    color='white', fontsize=8)
ax.set_ylabel('Max safe cargo (tonnes)', color='white')
ax.set_title('Cargo capacity comparison', color='white', fontsize=11)

for bar, mc in zip(bars, max_cargos):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
            f'{mc:.1f}t', ha='center', va='bottom', color='white', fontsize=10)

# Plot 5: Waterline visualization for loaded ferry
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ferry = ferries[0]  # Flat-bottom barge
load_masses = [3000, 6000, 10000, 15000]
load_colors = ['#22c55e', '#f59e0b', '#ef4444', '#dc2626']

for mass, color in zip(load_masses, load_colors):
    draft = ferry.draft_for_mass(mass)
    fb = ferry.freeboard(mass)
    # Draw hull
    xs = [-ferry.B/2, ferry.B/2, ferry.B/2, -ferry.B/2, -ferry.B/2]
    ys = [-draft + ferry.D, -draft + ferry.D, -draft, -draft, -draft + ferry.D]
    ax.plot(xs, [y - ferry.D + draft for y in ys], color=color, linewidth=1.5, alpha=0.7)
    ax.text(ferry.B/2 + 0.2, -draft + ferry.D/2,
            f'{mass/1000:.0f}t: draft={draft:.2f}m',
            color=color, fontsize=7, va='center')

ax.axhline(0, color='#06b6d4', linewidth=2, label='Waterline')
ax.fill_between([-3, 3], [-1.5], [0], color='#06b6d4', alpha=0.1)
ax.set_xlabel('Beam (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Barge at different loads', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(-3, 5)

# Plot 6: Stability — metacentric height
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Metacentric height GM = BM - BG
# BM = I_waterplane / V_displaced
# For rectangular: I = L * B^3 / 12
beams = np.linspace(1, 6, 100)
mass = 8000  # 8 tonnes
for ferry in ferries:
    GMs = []
    for B in beams:
        ferry_temp = FerryHull("temp", ferry.L, B, ferry.D, ferry.shape)
        draft = ferry_temp.draft_for_mass(mass)
        V_disp = ferry_temp.displaced_volume(draft)
        if ferry.shape == 'rectangular':
            I_wp = ferry.L * B**3 / 12
        else:
            I_wp = ferry.L * B**3 / 16  # Approximate
        BM = I_wp / max(V_disp, 0.01)
        BG = draft / 2  # Approximate
        GM = BM - BG
        GMs.append(GM)
    ax.plot(beams, GMs, color=ferry.color, linewidth=2, label=ferry.name)

ax.axhline(0, color='#ef4444', linestyle='--', alpha=0.7, label='Capsize boundary')
ax.set_xlabel('Beam width (m)', color='white')
ax.set_ylabel('Metacentric height GM (m)', color='white')
ax.set_title('Stability (GM > 0 = stable)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Archimedes' Principle — Ferry Analysis:")
print(f"Water density: {rho_water} kg/m^3 (Brahmaputra fresh water)")
print()
for ferry, empty, mc in zip(ferries, empty_masses, max_cargos):
    draft = ferry.draft_for_mass(empty + mc * 1000)
    print(f"{ferry.name}:")
    print(f"  Dimensions: {ferry.L}m x {ferry.B}m x {ferry.D}m")
    print(f"  Max safe cargo: {mc:.1f} tonnes")
    print(f"  Draft at max load: {draft:.2f}m")
    print(f"  Freeboard at max: {ferry.freeboard(empty + mc * 1000):.2f}m")
    print()
print("The flat-bottom barge carries the most cargo because its wide,")
print("rectangular cross-section displaces the most water per unit draft.")`,
      challenge: 'Add salt water (rho = 1025 kg/m^3) to the analysis. How does the maximum cargo change? This is why the Plimsoll line has separate marks for fresh water (F) and salt water (S) — the same boat floats higher in denser salt water.',
      successHint: 'Archimedes\' principle is the foundation of every vessel ever built — from a bamboo raft to an aircraft carrier. Understanding buoyancy, draft, and freeboard lets you predict exactly how a boat will respond to loading. Next we add the dynamic effects of flowing water.',
    },
    {
      title: 'Bernoulli\'s equation — energy conservation in flowing water',
      concept: `When the ferryman crosses the Brahmaputra, he is not moving through still water — the river flows at 2-5 m/s during monsoon season. Understanding the forces on a moving boat in flowing water requires **Bernoulli's equation**, which is really just conservation of energy applied to a fluid:

P + 0.5 * rho * v^2 + rho * g * h = constant (along a streamline)

This says that pressure energy (P), kinetic energy (0.5 * rho * v^2), and potential energy (rho * g * h) are interchangeable. When fluid speeds up, its pressure drops. When it rises, its pressure drops. The total "energy budget" is constant.

For a boat, Bernoulli's equation explains several critical phenomena:
- **Bow pressure**: Water piles up at the front of the boat (stagnation point), creating high pressure. This is the resistance you feel pushing against the current.
- **Suction along the hull**: Water accelerates as it flows around the curved hull, reducing pressure on the sides. This is why boats are streamlined — faster flow = lower pressure = less drag.
- **Stern wake**: Behind the boat, pressure recovers as flow decelerates. If the hull shape is poor, the flow **separates** from the hull, creating a turbulent wake that dramatically increases drag.
- **Venturi effect**: When the river narrows (between bridge piers, for example), water speeds up and pressure drops. This creates suction that pulls the boat sideways — a known hazard for ferries near bridges.

The **dynamic pressure** q = 0.5 * rho * v^2 is the key quantity. At 3 m/s in water, q = 0.5 * 1000 * 9 = 4500 Pa = 0.045 atm. This seems small, but applied over the large frontal area of a ferry hull, it creates thousands of Newtons of force.`,
      analogy: 'Bernoulli\'s equation is like a household budget with three accounts: savings (pressure), spending (velocity), and investment (height). If you transfer money from savings to spending (pressure drops as velocity increases), the total stays the same. A boat moving through water is like a financial advisor trying to minimize "spending" (drag) by keeping the flow smooth — any turbulence is like wasteful spending that cannot be recovered.',
      storyConnection: 'The ferryman in the story knows that the river narrows between the sandbanks near Guwahati. He always slows down there, not because of shallow water, but because the current accelerates through the narrows (Venturi effect) and creates unpredictable cross-currents. His grandfather lost a boat to the suction near a bridge pier. The ferryman understood Bernoulli\'s equation through bitter experience, even if he never knew the name.',
      checkQuestion: 'The Brahmaputra flows at 4 m/s. A bridge has piers that reduce the channel width by half. What is the water velocity between the piers? What is the pressure difference between open river and between piers?',
      checkAnswer: 'By continuity (conservation of mass), A1*v1 = A2*v2. If width halves, v2 = 2 * v1 = 8 m/s. Pressure difference from Bernoulli: delta_P = 0.5 * rho * (v2^2 - v1^2) = 0.5 * 1000 * (64 - 16) = 24,000 Pa = 24 kPa. This is a substantial pressure drop — enough to create dangerous suction forces on a nearby ferry. The force on a 2m^2 hull surface = 48 kN — enough to capsize a small boat.',
      codeIntro: 'Apply Bernoulli\'s equation to model pressure distributions around a ferry hull and through river constrictions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bernoulli's equation applied to ferry hydrodynamics
rho = 1000  # kg/m^3
g = 9.81

# Model flow around a 2D hull cross-section using potential flow
# Approximate hull as an ellipse, use conformal mapping

def flow_around_ellipse(U_inf, a, b, x_grid, y_grid):
    """Potential flow around an ellipse (Joukowski-type)."""
    # Map to circle of radius R = (a+b)/2
    R = (a + b) / 2

    # Complex coordinates
    z = x_grid + 1j * y_grid

    # Avoid points inside the ellipse
    r = np.sqrt((x_grid / a)**2 + (y_grid / b)**2)
    mask = r > 1.05  # Outside ellipse

    # Velocity from uniform flow + doublet (circle flow)
    # For circle: w = U*(z + R^2/z)
    # Velocity = dw/dz = U*(1 - R^2/z^2)
    with np.errstate(divide='ignore', invalid='ignore'):
        dw_dz = U_inf * (1 - R**2 / z**2)
        u = np.real(dw_dz)
        v = -np.imag(dw_dz)

    u[~mask] = 0
    v[~mask] = 0

    # Pressure from Bernoulli: P + 0.5*rho*V^2 = P_inf + 0.5*rho*U_inf^2
    V_squared = u**2 + v**2
    Cp = 1 - V_squared / U_inf**2  # Pressure coefficient

    return u, v, Cp, mask

# Create grid
nx, ny = 200, 150
x = np.linspace(-3, 5, nx)
y = np.linspace(-2, 2, ny)
X, Y = np.meshgrid(x, y)

# Hull dimensions (half-widths)
a_hull = 1.5  # semi-length
b_hull = 0.5  # semi-beam

U_inf = 3.0  # m/s river current

u, v, Cp, mask = flow_around_ellipse(U_inf, a_hull, b_hull, X, Y)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Streamlines and velocity field
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

speed = np.sqrt(u**2 + v**2)
ax.streamplot(X, Y, u, v, color=speed, cmap='coolwarm', density=2, linewidth=0.8, arrowsize=0.5)
ellipse = plt.matplotlib.patches.Ellipse((0, 0), 2*a_hull, 2*b_hull,
                                          color='#f59e0b', alpha=0.8)
ax.add_patch(ellipse)
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title(f'Flow around hull (U={U_inf} m/s)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.set_xlim(-3, 5)
ax.set_ylim(-2, 2)

# Plot 2: Pressure coefficient map
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

Cp_plot = Cp.copy()
Cp_plot[~mask] = np.nan
im = ax.contourf(X, Y, Cp_plot, levels=np.linspace(-3, 1, 30), cmap='RdBu_r')
ellipse2 = plt.matplotlib.patches.Ellipse((0, 0), 2*a_hull, 2*b_hull,
                                           color='#f59e0b', alpha=0.8)
ax.add_patch(ellipse2)
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Pressure coefficient Cp', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title('Pressure distribution', color='white', fontsize=11)
ax.set_aspect('equal')
ax.set_xlim(-3, 5)

# Plot 3: Pressure along hull surface
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

theta_hull = np.linspace(0, 2 * np.pi, 200)
x_hull = a_hull * np.cos(theta_hull)
y_hull = b_hull * np.sin(theta_hull)

# Cp on ellipse surface (for circle approximation)
R = (a_hull + b_hull) / 2
Cp_surface = 1 - 4 * np.sin(theta_hull)**2  # Exact for circle

ax.plot(np.degrees(theta_hull), Cp_surface, color='#3b82f6', linewidth=2)
ax.fill_between(np.degrees(theta_hull), 0, Cp_surface,
                where=Cp_surface > 0, alpha=0.2, color='#ef4444', label='High pressure')
ax.fill_between(np.degrees(theta_hull), 0, Cp_surface,
                where=Cp_surface < 0, alpha=0.2, color='#3b82f6', label='Low pressure (suction)')
ax.axhline(0, color='gray', linestyle='-', alpha=0.3)
ax.set_xlabel('Angle around hull (0°=bow, 180°=stern)', color='white')
ax.set_ylabel('Pressure coefficient Cp', color='white')
ax.set_title('Pressure on hull surface', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Mark key points
ax.annotate('Stagnation\\n(bow)', xy=(0, 1), fontsize=8, color='#ef4444', ha='center')
ax.annotate('Max suction\\n(beam)', xy=(90, -3), fontsize=8, color='#3b82f6', ha='center')

# Plot 4: Venturi effect at bridge piers
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

river_width = 200  # m
pier_width = 15  # m
n_piers = 5
gaps = n_piers + 1

channel_widths = np.linspace(river_width, river_width - n_piers * pier_width, 100)
velocities = U_inf * river_width / channel_widths
pressures = 0.5 * rho * (U_inf**2 - velocities**2)  # Pressure drop

gap_width = (river_width - n_piers * pier_width) / gaps
velocity_between = U_inf * river_width / (gaps * gap_width)

# Plot velocity profile across river
x_river = np.linspace(0, river_width, 500)
v_profile = np.ones_like(x_river) * U_inf

# Between piers: higher velocity
for i in range(n_piers):
    pier_center = (i + 1) * river_width / (n_piers + 1)
    # Near piers, velocity increases
    for j, xr in enumerate(x_river):
        dist = abs(xr - pier_center)
        if dist < gap_width:
            v_profile[j] = velocity_between * (1 + 0.3 * np.exp(-dist / 5))

ax.plot(x_river, v_profile, color='#06b6d4', linewidth=2)
ax.axhline(U_inf, color='gray', linestyle='--', alpha=0.5, label=f'Open river ({U_inf} m/s)')

# Draw piers
for i in range(n_piers):
    pier_center = (i + 1) * river_width / (n_piers + 1)
    ax.axvspan(pier_center - pier_width/2, pier_center + pier_width/2,
               color='#94a3b8', alpha=0.3)

ax.set_xlabel('Position across river (m)', color='white')
ax.set_ylabel('Flow velocity (m/s)', color='white')
ax.set_title('Venturi effect at bridge piers', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Bernoulli energy budget
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

velocities_demo = np.linspace(0, 6, 100)
P_static = 0.5 * rho * (U_inf**2 - velocities_demo**2)  # Relative to freestream
KE = 0.5 * rho * velocities_demo**2
total = P_static + KE

ax.fill_between(velocities_demo, 0, KE, alpha=0.4, color='#ef4444', label='Kinetic (0.5ρv²)')
ax.fill_between(velocities_demo, KE, KE + np.maximum(P_static, 0), alpha=0.4,
                color='#3b82f6', label='Pressure (P)')
ax.axhline(0.5 * rho * U_inf**2, color='white', linestyle='--', alpha=0.5,
           label=f'Total energy ({0.5*rho*U_inf**2:.0f} Pa)')
ax.set_xlabel('Flow velocity (m/s)', color='white')
ax.set_ylabel('Energy density (Pa)', color='white')
ax.set_title("Bernoulli's energy budget", color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 20000)

# Plot 6: Force on hull vs river speed
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

U_range = np.linspace(0, 8, 100)
A_frontal = b_hull * 2 * 0.8  # Approximate frontal area (m^2)
Cd = 0.8  # Drag coefficient for bluff body

F_drag = 0.5 * rho * U_range**2 * Cd * A_frontal
F_stagnation = 0.5 * rho * U_range**2 * A_frontal  # Stagnation force

ax.plot(U_range, F_drag / 1000, color='#ef4444', linewidth=2, label='Drag force')
ax.plot(U_range, F_stagnation / 1000, color='#f59e0b', linewidth=2, linestyle='--',
        label='Stagnation force')
ax.axvline(3, color='gray', linestyle=':', alpha=0.5)
ax.text(3.2, F_drag[60] / 1000, f'{F_drag[75]/1000:.1f} kN at 3 m/s',
        color='white', fontsize=8)
ax.set_xlabel('River current (m/s)', color='white')
ax.set_ylabel('Force (kN)', color='white')
ax.set_title('Hydrodynamic force vs speed', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Bernoulli's Equation — River Ferry Analysis:")
print(f"River current: {U_inf} m/s")
print(f"Dynamic pressure: {0.5 * rho * U_inf**2:.0f} Pa")
print(f"Hull frontal area: {A_frontal:.2f} m^2")
print(f"Drag force at {U_inf} m/s: {0.5 * rho * U_inf**2 * Cd * A_frontal:.0f} N")
print()
print(f"Bridge: {n_piers} piers in {river_width}m river")
print(f"Velocity between piers: {velocity_between:.1f} m/s ({velocity_between/U_inf:.1f}x)")
print(f"Pressure drop: {0.5 * rho * (velocity_between**2 - U_inf**2):.0f} Pa")`,
      challenge: 'Add a headwind of 10 m/s to the analysis. The wind creates additional aerodynamic drag on the above-water superstructure. Calculate the total force (hydrodynamic + aerodynamic) and the engine power needed to maintain 3 m/s speed against both.',
      successHint: 'Bernoulli\'s equation explains why streamlined hulls are faster, why bridge piers are dangerous, and why the ferryman angles across the current instead of fighting it head-on. Next we quantify the friction forces that Bernoulli alone cannot capture.',
    },
    {
      title: 'Viscosity and drag — the friction tax on every boat',
      concept: `Bernoulli's equation assumes **inviscid** (frictionless) flow. In reality, water has viscosity — it resists being sheared. This viscous resistance creates **skin friction drag**, which is often the dominant drag force on streamlined vessels.

**Viscosity** (mu) is a fluid's resistance to deformation. Water has dynamic viscosity mu = 1.0e-3 Pa*s at 20°C. When water flows past a hull, the layer immediately touching the hull has zero velocity (no-slip condition), and the velocity increases gradually away from the surface. This thin region of velocity transition is the **boundary layer**.

The boundary layer creates **shear stress** on the hull: tau = mu * (dv/dy), where dv/dy is the velocity gradient normal to the surface. Integrating this shear stress over the entire wetted surface gives the total skin friction drag.

For a flat plate (approximating one side of a hull), the boundary layer thickness grows with distance from the leading edge: delta ~ 5 * x / sqrt(Re_x), where Re_x = rho * U * x / mu is the **local Reynolds number**. The skin friction coefficient decreases as: Cf = 0.664 / sqrt(Re_x) for laminar flow, and Cf = 0.027 / Re_x^(1/7) for turbulent flow.

The transition from laminar to turbulent flow occurs at Re_x ~ 5 * 10^5. For a ferry in the Brahmaputra at 3 m/s, this transition happens only 17 cm from the bow — meaning nearly the entire hull is in turbulent flow, which has higher skin friction than laminar flow.`,
      analogy: 'Viscosity is like the friction between pages in a thick book. Try to slide one page sideways and the neighboring pages resist — they are "viscous." The faster you try to slide, the harder they resist. Water molecules behave the same way. The hull is like a page being pulled through the book. The boundary layer is the zone of pages (water layers) that are dragged along by the hull, each moving slightly slower than the one closer to the hull.',
      storyConnection: 'The ferryman in the story paints the bottom of his boat with a special mixture of mustard oil and tree resin every season. He says it makes the boat "slip through the water like a fish." In fluid mechanics terms, the coating reduces hull roughness, keeping the turbulent boundary layer thinner and reducing skin friction drag. Modern antifouling paints do the same thing — preventing barnacle growth that increases roughness and drag by up to 40%.',
      checkQuestion: 'A ferry hull is 10 m long and moves at 3 m/s in water (mu = 1e-3 Pa*s, rho = 1000 kg/m^3). What is the Reynolds number at the stern? Is the flow laminar or turbulent?',
      checkAnswer: 'Re_L = rho * U * L / mu = 1000 * 3 * 10 / 0.001 = 30,000,000 = 3 * 10^7. The flow is highly turbulent (transition at Re ~ 5*10^5). The boundary layer at the stern is about delta = 0.37 * L / Re_L^0.2 = 0.37 * 10 / (3e7)^0.2 = 0.37 * 10 / 31.6 = 0.117 m = 11.7 cm thick. Despite being only 12 cm thick on a 10 m hull, this boundary layer creates substantial drag.',
      codeIntro: 'Calculate boundary layer development along a ferry hull and compute the total skin friction drag.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Viscosity and boundary layer drag on a ferry hull
rho = 1000  # kg/m^3
mu = 1.0e-3  # Pa*s (water at 20°C)
nu = mu / rho  # kinematic viscosity

hull_length = 10  # m
U = 3.0  # m/s

# Reynolds number at stern
Re_L = rho * U * hull_length / mu

# Boundary layer calculations along hull
x = np.linspace(0.001, hull_length, 500)
Re_x = rho * U * x / mu

# Transition point
Re_transition = 5e5
x_transition = Re_transition * nu / U

# Boundary layer thickness
delta_laminar = 5 * x / np.sqrt(Re_x)
delta_turbulent = 0.37 * x / Re_x**0.2

# Combined: laminar up to transition, turbulent after
delta = np.where(x < x_transition, delta_laminar, delta_turbulent)

# Skin friction coefficient
Cf_laminar = 0.664 / np.sqrt(Re_x)
Cf_turbulent = 0.027 / Re_x**(1/7)
Cf = np.where(x < x_transition, Cf_laminar, Cf_turbulent)

# Wall shear stress
tau_w = 0.5 * rho * U**2 * Cf

# Different hull roughness effects
roughness_factors = {
    'Smooth (new paint)': 1.0,
    'Light fouling': 1.2,
    'Moderate fouling': 1.5,
    'Heavy barnacles': 2.0,
    'Unpainted wood': 1.8,
}

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Boundary layer growth
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.fill_between(x, 0, delta * 1000, alpha=0.3, color='#3b82f6')
ax.plot(x, delta * 1000, color='#3b82f6', linewidth=2, label='Boundary layer')
ax.plot(x, delta_laminar * 1000, color='#22c55e', linewidth=1, linestyle='--', label='If all laminar')
ax.plot(x, delta_turbulent * 1000, color='#ef4444', linewidth=1, linestyle='--', label='If all turbulent')
ax.axvline(x_transition, color='#f59e0b', linestyle=':', alpha=0.7,
           label=f'Transition at x={x_transition*100:.0f}cm')
ax.set_xlabel('Distance from bow (m)', color='white')
ax.set_ylabel('Boundary layer thickness (mm)', color='white')
ax.set_title('Boundary layer development', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Skin friction coefficient
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.semilogy(x, Cf, color='#a855f7', linewidth=2, label='Actual Cf')
ax.semilogy(x, Cf_laminar, color='#22c55e', linewidth=1, linestyle='--', label='Laminar Cf')
ax.semilogy(x, Cf_turbulent, color='#ef4444', linewidth=1, linestyle='--', label='Turbulent Cf')
ax.axvline(x_transition, color='#f59e0b', linestyle=':', alpha=0.7)
ax.set_xlabel('Distance from bow (m)', color='white')
ax.set_ylabel('Cf (skin friction coefficient)', color='white')
ax.set_title('Local friction coefficient', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Shear stress on hull
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(x, tau_w, color='#06b6d4', linewidth=2)
ax.fill_between(x, 0, tau_w, alpha=0.2, color='#06b6d4')
ax.set_xlabel('Distance from bow (m)', color='white')
ax.set_ylabel('Wall shear stress (Pa)', color='white')
ax.set_title('Shear stress distribution', color='white', fontsize=11)

# Total friction drag
wetted_beam = 3.0  # m (wetted perimeter for both sides)
F_friction = np.trapz(tau_w * wetted_beam * 2, x)  # Both sides
ax.text(5, max(tau_w) * 0.7, f'Total friction drag: {F_friction:.0f} N',
        color='white', fontsize=9, bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#06b6d4'))

# Plot 4: Effect of hull roughness
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

drag_forces = {}
r_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
for (name, factor), color in zip(roughness_factors.items(), r_colors):
    F = F_friction * factor
    drag_forces[name] = F
    ax.barh(name, F / 1000, color=color, alpha=0.8)

ax.set_xlabel('Friction drag (kN)', color='white')
ax.set_title('Hull condition effect on drag', color='white', fontsize=11)
for spine in ax.spines.values():
    spine.set_color('gray')

# Plot 5: Velocity profile in boundary layer
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# At x = 5m (mid-hull)
x_probe = 5.0
Re_probe = rho * U * x_probe / mu
delta_probe = 0.37 * x_probe / Re_probe**0.2

y_bl = np.linspace(0, delta_probe * 2, 200)
# 1/7 power law profile for turbulent BL
u_profile = U * np.minimum((y_bl / delta_probe)**(1/7), 1.0)

ax.plot(u_profile, y_bl * 1000, color='#f59e0b', linewidth=2, label=f'x = {x_probe}m')

# Also at x = 0.1m (laminar)
x_lam = 0.1
delta_lam = 5 * x_lam / np.sqrt(rho * U * x_lam / mu)
y_lam = np.linspace(0, delta_lam * 2, 200)
u_lam = U * np.minimum(y_lam / delta_lam * (2 - y_lam / delta_lam), 1.0)
ax.plot(u_lam, y_lam * 1000, color='#22c55e', linewidth=2, label=f'x = {x_lam}m (laminar)')

ax.set_xlabel('Velocity (m/s)', color='white')
ax.set_ylabel('Distance from hull (mm)', color='white')
ax.set_title('Velocity profiles in boundary layer', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axvline(U, color='gray', linestyle='--', alpha=0.3, label='Free stream')

# Plot 6: Total drag breakdown (friction + pressure)
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

speeds = np.linspace(0.5, 6, 50)
A_frontal = 1.0  # m^2
Cd_form = 0.4  # Form drag coefficient
wetted_area = hull_length * wetted_beam * 2  # m^2

# Average Cf for whole hull
Cf_avg = 0.075 / (np.log10(rho * speeds * hull_length / mu) - 2)**2  # ITTC 1957 formula

F_friction_arr = 0.5 * rho * speeds**2 * Cf_avg * wetted_area
F_form = 0.5 * rho * speeds**2 * Cd_form * A_frontal
F_total = F_friction_arr + F_form

ax.fill_between(speeds, 0, F_friction_arr / 1000, alpha=0.4, color='#3b82f6', label='Skin friction')
ax.fill_between(speeds, F_friction_arr / 1000, F_total / 1000, alpha=0.4, color='#ef4444', label='Form (pressure)')
ax.plot(speeds, F_total / 1000, color='white', linewidth=2, label='Total drag')
ax.set_xlabel('Speed (m/s)', color='white')
ax.set_ylabel('Drag force (kN)', color='white')
ax.set_title('Drag breakdown', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Power required
power = F_total * speeds  # Watts
ax2 = ax.twinx()
ax2.plot(speeds, power / 1000, color='#f59e0b', linewidth=2, linestyle='--', label='Power (kW)')
ax2.tick_params(colors='gray')
ax2.set_ylabel('Power required (kW)', color='#f59e0b')
ax2.legend(loc='center right', fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Viscosity and Drag Summary:")
print(f"Hull: {hull_length}m long, speed {U} m/s")
print(f"Re at stern: {Re_L:.2e} (highly turbulent)")
print(f"Transition at x = {x_transition*100:.1f} cm from bow")
print(f"BL thickness at stern: {delta[-1]*1000:.1f} mm")
print()
print(f"Friction drag (smooth): {F_friction:.0f} N = {F_friction/1000:.2f} kN")
print(f"Friction with barnacles: {F_friction*2:.0f} N (+{(2-1)*100:.0f}%)")
print()
print("Hull roughness effect:")
for name, F in drag_forces.items():
    print(f"  {name:<25} {F:.0f} N ({F/F_friction*100:.0f}%)")`,
      challenge: 'The Brahmaputra water temperature drops to 10°C in winter (mu increases to 1.3e-3 Pa*s) and rises to 30°C in summer (mu drops to 0.8e-3 Pa*s). How does temperature affect boundary layer thickness and drag? Calculate the seasonal variation in fuel consumption for the ferry.',
      successHint: 'Viscosity and boundary layers are why streamlined shapes reduce drag — they minimize the velocity gradients and therefore the shear stress. Every ship, submarine, and underwater vehicle is designed with boundary layer control in mind.',
    },
    {
      title: 'Reynolds number — predicting flow behavior from a single ratio',
      concept: `The **Reynolds number** is the single most important dimensionless number in fluid mechanics. It predicts whether flow will be smooth (laminar) or chaotic (turbulent), whether vortices will form, and how drag scales with speed. It is defined as:

Re = rho * U * L / mu = U * L / nu

where rho is density, U is velocity, L is a characteristic length (hull length, pipe diameter, etc.), mu is dynamic viscosity, and nu = mu / rho is kinematic viscosity.

Physically, Re is the ratio of **inertial forces** (which push the fluid to keep moving) to **viscous forces** (which try to damp out disturbances):
- Low Re (< 1): Viscous forces dominate. Flow is perfectly smooth, reversible, and predictable. This is the world of bacteria swimming, sap flowing in trees, and microfluidic chips.
- Moderate Re (1-2000): Transitional. Flow can be either laminar or turbulent depending on disturbances.
- High Re (> 10^4): Inertial forces dominate. Flow is turbulent, chaotic, and unpredictable in detail (though statistically predictable). This is the world of boats, aircraft, and most engineering flows.

For the ferryman, Re matters in several ways. The hull operates at Re ~ 10^7 (turbulent). But the river itself has Re ~ 10^8, meaning the background flow is turbulent with eddies and vortices that affect navigation. And the propeller blade operates at Re ~ 10^5, right in the transition zone where small changes in surface roughness can flip the flow from laminar to turbulent, dramatically changing thrust.`,
      analogy: 'Reynolds number is like the signal-to-noise ratio in communication. Low Re is like a quiet library — you can hear every whisper clearly (viscous forces maintain order). High Re is like a rock concert — individual sounds are drowned out by the chaotic noise (inertial forces create turbulent mixing). And just like you need different strategies for communicating in a library versus a concert, engineers need different approaches for low-Re versus high-Re flows.',
      storyConnection: 'The ferryman in the story notices that the river flows smoothly in narrow channels during the dry season (moderate Re due to lower velocity), but becomes wildly turbulent during monsoon floods (high Re from high velocity and depth). He also knows that his small wooden rudder works differently in calm water versus rapids. Without knowing the math, he has intuited that flow behavior changes fundamentally with speed and size — the essence of Reynolds number scaling.',
      checkQuestion: 'A model boat 1/10 the size of the real ferry is tested in a tank. If the real ferry travels at 3 m/s, what speed should the model travel at to match the Reynolds number? Is this practical?',
      checkAnswer: 'For Re to match: Re_model = Re_real. Since L_model = L_real/10 and nu is the same, we need U_model = U_real * L_real / L_model = 3 * 10 = 30 m/s (108 km/h). This is completely impractical for a tank test. This is why naval engineers use Re-corrected empirical formulas or CFD instead of direct scale models. Or they use a different fluid (more viscous) to achieve matching Re at lower speeds.',
      codeIntro: 'Explore how Reynolds number determines flow regime, drag scaling, and the behavior of flows at different scales.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Reynolds number analysis
rho = 1000
mu = 1e-3
nu = mu / rho

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Reynolds number for different boats and conditions
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

scenarios = [
    ('Kayak (3m, 2 m/s)', 3, 2, '#22c55e'),
    ('Ferry (10m, 3 m/s)', 10, 3, '#3b82f6'),
    ('Cargo ship (100m, 8 m/s)', 100, 8, '#f59e0b'),
    ('Tanker (300m, 10 m/s)', 300, 10, '#ef4444'),
    ('Submarine (100m, 15 m/s)', 100, 15, '#a855f7'),
]

for name, L, U, color in scenarios:
    Re = rho * U * L / mu
    ax.barh(name.split('(')[0].strip(), np.log10(Re), color=color, alpha=0.8)
    ax.text(np.log10(Re) + 0.1, name.split('(')[0].strip(),
            f'Re = {Re:.1e}', va='center', color=color, fontsize=7)

ax.set_xlabel('log10(Re)', color='white')
ax.set_title('Reynolds numbers of watercraft', color='white', fontsize=11)
ax.axvline(np.log10(5e5), color='gray', linestyle='--', alpha=0.5)
ax.text(np.log10(5e5), -0.5, 'Transition', color='gray', fontsize=7)

# Plot 2: Drag coefficient vs Reynolds number
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

Re_range = np.logspace(0, 8, 1000)

# Sphere drag coefficient (well-known curve)
Cd_sphere = np.piecewise(Re_range,
    [Re_range < 1, (Re_range >= 1) & (Re_range < 1000),
     (Re_range >= 1000) & (Re_range < 2e5), Re_range >= 2e5],
    [lambda Re: 24/Re, lambda Re: 24/Re * (1 + 0.15*Re**0.687),
     lambda Re: 0.44 * np.ones_like(Re), lambda Re: 0.1 * np.ones_like(Re)])

# Flat plate friction coefficient
Cf_plate_lam = 1.328 / np.sqrt(Re_range)
Cf_plate_turb = 0.075 / (np.log10(Re_range) - 2)**2

ax.loglog(Re_range, Cd_sphere, color='#ef4444', linewidth=2, label='Sphere Cd')
ax.loglog(Re_range, Cf_plate_lam, color='#22c55e', linewidth=2, linestyle='--', label='Flat plate Cf (laminar)')
ax.loglog(Re_range, Cf_plate_turb, color='#3b82f6', linewidth=2, linestyle='--', label='Flat plate Cf (turbulent)')

# Mark ferry operating point
Re_ferry = rho * 3 * 10 / mu
ax.axvline(Re_ferry, color='#f59e0b', linestyle=':', alpha=0.5)
ax.text(Re_ferry * 1.5, 0.5, 'Ferry', color='#f59e0b', fontsize=8)

ax.set_xlabel('Reynolds number', color='white')
ax.set_ylabel('Drag/friction coefficient', color='white')
ax.set_title('Cd vs Re (universal curves)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Flow visualization at different Re
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Simulate streamlines around cylinder at different Re
theta = np.linspace(0, 2 * np.pi, 100)
r_cyl = 1

regimes = [
    ('Re = 1 (Stokes)', 1, '#22c55e'),
    ('Re = 100 (steady wake)', 100, '#f59e0b'),
    ('Re = 10000 (turbulent)', 10000, '#ef4444'),
]

for i, (name, Re, color) in enumerate(regimes):
    offset_y = i * 4
    # Draw cylinder
    ax.plot(r_cyl * np.cos(theta), r_cyl * np.sin(theta) + offset_y,
            color=color, linewidth=2)
    ax.fill(r_cyl * np.cos(theta), r_cyl * np.sin(theta) + offset_y,
            color=color, alpha=0.2)

    # Simplified streamlines
    x_stream = np.linspace(-3, 5, 50)
    for y_off in np.linspace(-2, 2, 8):
        y_stream = np.ones_like(x_stream) * (y_off + offset_y)
        # Deflection around cylinder
        for j, xs in enumerate(x_stream):
            r = np.sqrt(xs**2 + y_off**2)
            if r > r_cyl * 1.1:
                y_stream[j] += y_off * r_cyl**2 / r**2 * 0.5
            elif r <= r_cyl * 1.1 and xs > 0:
                y_stream[j] = offset_y + y_off * 0.5  # Simplified wake
        ax.plot(x_stream, y_stream, color=color, linewidth=0.3, alpha=0.5)

    ax.text(-3, offset_y + 2.5, name, color=color, fontsize=8, fontweight='bold')

ax.set_xlim(-4, 6)
ax.set_title('Flow regimes (schematic)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.axis('off')

# Plot 4: Scale model analysis
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

scales = [1, 1/2, 1/5, 1/10, 1/20, 1/50]
L_full = 10  # m
U_full = 3  # m/s
Re_full = rho * U_full * L_full / mu

model_speeds = [U_full * L_full / (s * L_full) for s in scales]  # To match Re
model_Re = [rho * u * s * L_full / mu for u, s in zip(model_speeds, scales)]

ax.semilogy([f'1:{int(1/s)}' for s in scales], model_speeds, 'o-',
            color='#a855f7', linewidth=2, markersize=8)
ax.set_xlabel('Model scale', color='white')
ax.set_ylabel('Required model speed (m/s)', color='white')
ax.set_title('Speed for Re matching', color='white', fontsize=11)

for i, (s, u) in enumerate(zip(scales, model_speeds)):
    ax.annotate(f'{u:.1f} m/s', (i, u), textcoords="offset points",
                xytext=(10, 5), color='white', fontsize=7)

ax.axhline(U_full, color='#22c55e', linestyle='--', alpha=0.5, label='Full-scale speed')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Turbulence energy spectrum
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Kolmogorov energy spectrum E(k) ~ k^(-5/3)
k = np.logspace(-1, 3, 500)  # wavenumber
E_k = k**(-5/3)  # Kolmogorov -5/3 law
E_k *= 1e-3  # Scale factor

ax.loglog(k, E_k, color='#06b6d4', linewidth=2, label='E(k) ~ k^{-5/3}')
ax.set_xlabel('Wavenumber k (1/m)', color='white')
ax.set_ylabel('Energy spectrum E(k)', color='white')
ax.set_title('Turbulent energy cascade', color='white', fontsize=11)

# Mark scales
ax.axvline(2*np.pi/10, color='#22c55e', linestyle='--', alpha=0.5)
ax.text(2*np.pi/10, 1e-4, 'Hull scale', color='#22c55e', fontsize=7, rotation=90)
ax.axvline(2*np.pi/0.1, color='#ef4444', linestyle='--', alpha=0.5)
ax.text(2*np.pi/0.1, 1e-4, 'BL scale', color='#ef4444', fontsize=7, rotation=90)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Re map of Brahmaputra conditions
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

depths = np.linspace(1, 20, 50)  # River depth as char. length
velocities = np.linspace(0.5, 8, 50)
D, V = np.meshgrid(depths, velocities)
Re_river = rho * V * D / mu

im = ax.contourf(depths, velocities, np.log10(Re_river),
                  levels=np.arange(5, 9, 0.25), cmap='viridis')
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('log10(Re)', color='white')
cbar.ax.tick_params(colors='gray')

# Mark Brahmaputra conditions
ax.scatter(10, 3, c='#ef4444', s=150, zorder=5, edgecolors='white', linewidths=2)
ax.annotate('Brahmaputra\\n(dry season)', (10, 3), textcoords="offset points",
            xytext=(10, 10), color='#ef4444', fontsize=8)
ax.scatter(15, 6, c='#f59e0b', s=150, zorder=5, edgecolors='white', linewidths=2)
ax.annotate('Brahmaputra\\n(monsoon)', (15, 6), textcoords="offset points",
            xytext=(10, -15), color='#f59e0b', fontsize=8)

ax.set_xlabel('River depth (m)', color='white')
ax.set_ylabel('Current velocity (m/s)', color='white')
ax.set_title('River Reynolds number', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Reynolds Number Analysis:")
print(f"Ferry: Re = {Re_ferry:.2e} (turbulent)")
print(f"Transition Re = 5e5 at x = {x_transition:.3f}m from bow")
print()
print("Scale model challenge:")
for s, u in zip(scales, model_speeds):
    print(f"  Scale 1:{int(1/s)}: need {u:.1f} m/s model speed")
print()
print("The Reynolds number tells you everything about flow character.")
print("Match Re, and you match the flow physics — regardless of scale.")`,
      challenge: 'The Brahmaputra carries heavy silt during monsoon (water density increases to ~1050 kg/m^3, viscosity to ~1.5e-3 Pa*s). Recalculate Re and drag for silty water. Does the silt make the ferry faster or slower?',
      successHint: 'Reynolds number is the master key to fluid mechanics. It tells you whether to expect laminar or turbulent flow, how drag scales with speed, and whether a scale model test is valid. Every fluid dynamics problem starts with calculating Re.',
    },
    {
      title: 'Buoyancy calculations — stability and capsizing',
      concept: `A boat that floats is not necessarily safe — it must also be **stable**. Stability means that when the boat tilts (due to waves, wind, or cargo shifting), it generates a restoring force that brings it back upright. An unstable boat capsizes.

Stability is governed by three key points:
- **G (center of gravity)**: Where the total weight acts. Depends on cargo placement. Higher cargo raises G.
- **B (center of buoyancy)**: The centroid of the submerged hull volume. When the boat tilts, B shifts to the side that submerges more deeply.
- **M (metacenter)**: The point where the vertical line through the new B (when tilted) intersects the original vertical centerline. M is a geometric property of the hull shape.

The **metacentric height** GM = KM - KG (where K is the keel) determines stability:
- GM > 0: Stable. Restoring moment brings the boat upright.
- GM = 0: Neutrally stable. The boat stays at whatever angle it is pushed to.
- GM < 0: Unstable. The boat capsizes.

For small heel angles, the righting moment = W * GM * sin(theta), where W is total weight and theta is the heel angle. Larger GM means a stiffer boat (returns faster but rolls more sharply). Too large GM makes the ride uncomfortable; too small risks capsizing.

The metacentric height is calculated as: BM = I_waterplane / V_displaced, where I is the second moment of area of the waterplane shape about its longitudinal axis. For a rectangular waterplane: I = L * B^3 / 12. Wider boats are more stable.`,
      analogy: 'Stability is like balancing a ball on a surface. On a concave bowl (stable, GM > 0), the ball rolls back to the center when pushed. On a flat table (neutral, GM = 0), it stays wherever you push it. On a convex dome (unstable, GM < 0), it rolls off when pushed even slightly. The hull shape determines whether the "surface" the boat sits on is a bowl, a table, or a dome.',
      storyConnection: 'The ferryman in the story always loads heavy cargo (rice sacks, clay pots) in the bottom of the hull and makes passengers sit low. He refuses to carry tall stacks of bamboo upright. He learned this rule from his grandfather after a capsizing accident: "keep the weight low." This is the principle of keeping G below M — maintaining positive metacentric height by lowering the center of gravity.',
      checkQuestion: 'A rectangular ferry (L = 10m, B = 3m) has a displacement of 8 m^3 and KG = 0.6m. The center of buoyancy KB = 0.15m. Is the ferry stable?',
      checkAnswer: 'BM = I / V = (10 * 3^3 / 12) / 8 = 22.5 / 8 = 2.81m. KM = KB + BM = 0.15 + 2.81 = 2.96m. GM = KM - KG = 2.96 - 0.6 = 2.36m. GM is positive and large — the ferry is very stable. But if cargo raises KG to 2.5m, GM = 2.96 - 2.5 = 0.46m — still stable but with much less margin. At KG = 3.0m, GM = -0.04m — the ferry would capsize.',
      codeIntro: 'Calculate stability parameters and simulate capsizing behavior for different loading conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Buoyancy and stability calculations
g = 9.81
rho = 1000

class StabilityAnalyzer:
    def __init__(self, length, beam, draft, displacement, KG):
        self.L = length
        self.B = beam
        self.T = draft  # draft
        self.disp = displacement  # m^3
        self.KG = KG

    def KB(self):
        """Center of buoyancy above keel (rectangular hull)."""
        return self.T / 2

    def BM(self):
        """Metacentric radius."""
        I = self.L * self.B**3 / 12
        return I / self.disp

    def KM(self):
        return self.KB() + self.BM()

    def GM(self):
        return self.KM() - self.KG

    def righting_moment(self, theta_deg, weight):
        """Righting moment at heel angle theta."""
        theta = np.radians(theta_deg)
        # For small angles: RM = W * GM * sin(theta)
        # For larger angles, need GZ curve
        if abs(theta_deg) < 15:
            return weight * self.GM() * np.sin(theta)
        else:
            # Approximate GZ for larger angles
            GZ = self.GM() * np.sin(theta) + 0.5 * self.BM() * np.sin(theta) * np.cos(theta) * (np.tan(theta)**2 - 1) * 0.1
            return weight * GZ

    def GZ_curve(self, angles_deg, weight):
        """GZ (righting lever) curve."""
        GZ = []
        for theta in angles_deg:
            RM = self.righting_moment(theta, weight)
            GZ.append(RM / weight)
        return np.array(GZ)

# Base ferry
mass = 8000  # kg
disp = mass / rho  # 8 m^3

# Different loading conditions
conditions = [
    {'name': 'Light load (low CG)', 'KG': 0.5, 'color': '#22c55e'},
    {'name': 'Normal load', 'KG': 0.8, 'color': '#3b82f6'},
    {'name': 'Heavy deck cargo', 'KG': 1.2, 'color': '#f59e0b'},
    {'name': 'Top-heavy (DANGER)', 'KG': 1.8, 'color': '#ef4444'},
]

draft = disp / (10 * 3)  # For L=10, B=3

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Stability diagram (cross-section showing G, B, M)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

B = 3.0
# Draw hull cross-section
hull_x = [-B/2, B/2, B/2, -B/2, -B/2]
hull_y = [0, 0, -draft, -draft, 0]
ax.fill(hull_x, hull_y, color='#94a3b8', alpha=0.3)
ax.plot(hull_x, hull_y, color='#94a3b8', linewidth=2)

# Water
ax.fill_between([-2, 2], [-0.5, -0.5], [0, 0], color='#06b6d4', alpha=0.1)
ax.axhline(0, color='#06b6d4', linewidth=1)

analyzer = StabilityAnalyzer(10, 3, draft, disp, conditions[1]['KG'])

# Mark points
points = {
    'K (keel)': (0, -draft, '#ef4444'),
    f'B (buoyancy, {analyzer.KB():.2f}m)': (0, -draft + analyzer.KB(), '#3b82f6'),
    f'G (gravity, {analyzer.KG:.2f}m)': (0, -draft + analyzer.KG, '#f59e0b'),
    f'M (metacenter, {analyzer.KM():.2f}m)': (0, -draft + analyzer.KM(), '#22c55e'),
}

for name, (x, y, color) in points.items():
    ax.plot(x, y, 'o', color=color, markersize=8, zorder=5)
    ax.annotate(name, (x, y), textcoords="offset points",
                xytext=(15, 0), color=color, fontsize=8)

# Draw GM arrow
ax.annotate('', xy=(0.3, -draft + analyzer.KM()),
            xytext=(0.3, -draft + analyzer.KG),
            arrowprops=dict(arrowstyle='<->', color='white', lw=2))
ax.text(0.5, -draft + (analyzer.KM() + analyzer.KG) / 2,
        f'GM = {analyzer.GM():.2f}m', color='white', fontsize=9)

ax.set_xlabel('Beam (m)', color='white')
ax.set_ylabel('Height above keel (m)', color='white')
ax.set_title('Stability points (G, B, M)', color='white', fontsize=11)
ax.set_xlim(-2, 3)

# Plot 2: GZ curves for different loading
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

angles = np.linspace(0, 90, 100)
for cond in conditions:
    analyzer = StabilityAnalyzer(10, 3, draft, disp, cond['KG'])
    GZ = analyzer.GZ_curve(angles, mass * g)
    ax.plot(angles, GZ, color=cond['color'], linewidth=2, label=cond['name'])

ax.axhline(0, color='white', linewidth=0.5)
ax.set_xlabel('Heel angle (degrees)', color='white')
ax.set_ylabel('GZ (righting lever, m)', color='white')
ax.set_title('GZ curves (+ = stable)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: GM vs center of gravity height
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

KG_range = np.linspace(0.2, 3.0, 100)
GM_values = []
for kg in KG_range:
    analyzer = StabilityAnalyzer(10, 3, draft, disp, kg)
    GM_values.append(analyzer.GM())

ax.plot(KG_range, GM_values, color='#a855f7', linewidth=2)
ax.axhline(0, color='#ef4444', linestyle='--', linewidth=2, label='Capsize boundary')
ax.fill_between(KG_range, -1, 0, alpha=0.1, color='#ef4444')
ax.fill_between(KG_range, 0, max(GM_values) + 0.5, alpha=0.05, color='#22c55e')

# Mark conditions
for cond in conditions:
    analyzer = StabilityAnalyzer(10, 3, draft, disp, cond['KG'])
    ax.scatter(cond['KG'], analyzer.GM(), c=cond['color'], s=100, zorder=5, edgecolors='white')

ax.set_xlabel('KG (center of gravity height, m)', color='white')
ax.set_ylabel('GM (metacentric height, m)', color='white')
ax.set_title('Stability margin vs cargo height', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Effect of beam width on stability
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

beams = np.linspace(1, 6, 100)
for cond in conditions[:3]:
    GMs = []
    for b in beams:
        d = disp / (10 * b)  # Adjust draft for same displacement
        a = StabilityAnalyzer(10, b, d, disp, cond['KG'])
        GMs.append(a.GM())
    ax.plot(beams, GMs, color=cond['color'], linewidth=2, label=cond['name'])

ax.axhline(0, color='#ef4444', linestyle='--', alpha=0.7)
ax.set_xlabel('Beam width (m)', color='white')
ax.set_ylabel('GM (m)', color='white')
ax.set_title('Wider beam = more stable', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Roll simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

dt = 0.01
t_max = 20
t = np.arange(0, t_max, dt)

for cond in conditions:
    analyzer = StabilityAnalyzer(10, 3, draft, disp, cond['KG'])
    gm = analyzer.GM()

    # Roll equation: I * theta_ddot + c * theta_dot + W * GM * sin(theta) = F_wave
    I_roll = mass * (B/2)**2 / 3  # Approximate roll inertia
    c_roll = 0.1 * 2 * np.sqrt(I_roll * mass * g * max(gm, 0.001))  # Damping

    theta = np.zeros(len(t))
    omega = np.zeros(len(t))
    theta[0] = np.radians(10)  # Initial 10 degree heel

    for i in range(1, len(t)):
        # Wave excitation (small periodic force)
        F_wave = 500 * np.sin(2 * np.pi * 0.3 * t[i])  # 0.3 Hz waves
        torque = -mass * g * gm * np.sin(theta[i-1]) - c_roll * omega[i-1] + F_wave * B/2
        alpha = torque / I_roll
        omega[i] = omega[i-1] + alpha * dt
        theta[i] = theta[i-1] + omega[i] * dt

    ax.plot(t, np.degrees(theta), color=cond['color'], linewidth=1, label=cond['name'])

ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Roll angle (degrees)', color='white')
ax.set_title('Roll response to waves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axhline(0, color='gray', linestyle='-', alpha=0.2)

# Plot 6: Safe loading diagram
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

cargo_mass = np.linspace(0, 15000, 100)
cargo_heights = np.linspace(0, 2, 100)
M, H = np.meshgrid(cargo_mass, cargo_heights)

# Calculate GM for each (mass, height) combination
empty_mass = 3000
empty_KG = 0.4
total_mass = empty_mass + M
combined_KG = (empty_mass * empty_KG + M * (draft + H)) / total_mass

GM_map = np.zeros_like(M)
for i in range(len(cargo_heights)):
    for j in range(len(cargo_mass)):
        tm = total_mass[i, j]
        d = tm / (rho * 10 * 3)
        disp_ij = tm / rho
        a = StabilityAnalyzer(10, 3, d, disp_ij, combined_KG[i, j])
        GM_map[i, j] = a.GM()

im = ax.contourf(cargo_mass / 1000, cargo_heights, GM_map,
                  levels=np.arange(-1, 3, 0.2), cmap='RdYlGn')
ax.contour(cargo_mass / 1000, cargo_heights, GM_map, levels=[0],
           colors='white', linewidths=3)
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('GM (m)', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_xlabel('Cargo mass (tonnes)', color='white')
ax.set_ylabel('Cargo height above deck (m)', color='white')
ax.set_title('Safe loading zone (white = capsize)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Stability Analysis:")
for cond in conditions:
    a = StabilityAnalyzer(10, 3, draft, disp, cond['KG'])
    status = "STABLE" if a.GM() > 0 else "UNSTABLE"
    print(f"{cond['name']:<30} KG={cond['KG']:.1f}m GM={a.GM():.2f}m [{status}]")
print()
print("Rules for the ferryman:")
print("1. Keep heavy cargo LOW — every cm lower improves GM")
print("2. Wider boats are more stable (BM ~ B^2)")
print("3. Never stack cargo above deck height")
print(f"4. Maximum safe KG for this ferry: {KG_range[np.searchsorted(-np.array(GM_values), 0)]:.2f}m")`,
      challenge: 'Add the effect of free water on deck (sloshing). When water collects on deck, it flows to the low side when the boat heels, raising the effective center of gravity. Model this "free surface effect" and show how even a small amount of water on deck dramatically reduces GM.',
      successHint: 'Stability analysis is life-or-death engineering. Ferry capsizing accidents (like the MV Sewol in 2014) are almost always caused by exceeding the safe loading limits — too much cargo too high. Understanding GM, GZ curves, and safe loading zones saves lives.',
    },
    {
      title: 'Fluid flow regimes — laminar, turbulent, and transitional',
      concept: `Water in the Brahmaputra does not flow uniformly. Near the banks it creeps slowly (laminar). In the main channel it churns with eddies and vortices (turbulent). Near sandbanks and bridge piers, the flow **separates** from surfaces and creates recirculation zones. Understanding these **flow regimes** is essential for predicting forces on the ferry and planning safe routes.

**Laminar flow** (Re < 2000 for pipe flow): Fluid moves in smooth, parallel layers. Velocity profile is parabolic. Drag is proportional to velocity (F ~ v). Predictable and well-behaved.

**Turbulent flow** (Re > 4000): Fluid moves chaotically with eddies at all scales. Velocity profile is flatter (more uniform across the channel). Drag is proportional to velocity squared (F ~ v^2). Energy is dissipated much faster.

**Flow separation** occurs when the fluid cannot follow a curved surface (like the stern of a boat or a river bend). The boundary layer detaches, creating a **wake** — a region of low pressure, reverse flow, and high turbulence. Flow separation is the primary cause of **form drag** (pressure drag), which dominates over skin friction for bluff bodies.

For the ferryman, flow separation manifests as:
- **Wake behind the boat**: The turbulent wake consumes energy and creates drag
- **Eddies behind bridge piers**: Dangerous recirculation zones that can trap or spin a boat
- **River bends**: The flow separates from the inner bank, creating shallow, sandy areas
- **Monsoon floods**: The entire river becomes highly turbulent, with standing waves and whirlpools`,
      analogy: 'Think of traffic flow on a highway. Light traffic flows smoothly — cars maintain lanes and speed (laminar). Heavy traffic becomes chaotic — cars bunch up, change lanes unpredictably, and form "eddies" where clusters of cars move together (turbulent). And when the highway narrows to a construction zone, traffic separates from the blocked lane, creating a long backup "wake" behind the construction. The physics of fluid flow and traffic flow are described by similar equations.',
      storyConnection: 'The ferryman knows every eddy and whirlpool in the Brahmaputra. He navigates by reading the water surface — smooth patches indicate laminar flow (safe), boiling patches indicate turbulence (use caution), and swirling patches near banks indicate flow separation (avoid). He uses these flow patterns to find the fastest route across the river, riding favorable currents and avoiding energy-sapping turbulent zones.',
      checkQuestion: 'The Brahmaputra has a depth of 10 m and flows at 4 m/s during monsoon. A bridge pier is 3 m in diameter. What is the Reynolds number based on pier diameter? Will vortices (von Karman street) form behind the pier?',
      checkAnswer: 'Re_pier = rho * U * D / mu = 1000 * 4 * 3 / 0.001 = 1.2 * 10^7. At this Re, the flow is highly turbulent and yes, strong vortex shedding occurs. The Strouhal number St ~ 0.2, giving a shedding frequency f = St * U / D = 0.2 * 4 / 3 = 0.27 Hz — one vortex every 3.7 seconds. These alternating vortices create oscillating lateral forces on the pier and dangerous cross-currents for nearby boats.',
      codeIntro: 'Simulate and visualize different flow regimes and their effects on ferry navigation in the Brahmaputra.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Flow regimes and their effects on river navigation
np.random.seed(42)

rho = 1000
mu = 1e-3

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Velocity profiles — laminar vs turbulent
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

depth = 10  # m
U_mean = 3  # m/s

y = np.linspace(0, depth, 200)

# Laminar: parabolic profile
u_laminar = 1.5 * U_mean * (1 - ((y - depth/2) / (depth/2))**2)

# Turbulent: 1/7 power law
u_turbulent = U_mean * 1.14 * (y / depth)**(1/7)
u_turbulent = np.minimum(u_turbulent, U_mean * 1.2)

ax.plot(u_laminar, y, color='#22c55e', linewidth=2, label='Laminar (parabolic)')
ax.plot(u_turbulent, y, color='#ef4444', linewidth=2, label='Turbulent (1/7 power)')
ax.axvline(U_mean, color='gray', linestyle='--', alpha=0.5, label=f'Mean = {U_mean} m/s')
ax.set_xlabel('Velocity (m/s)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.set_title('River velocity profiles', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Flow past a bridge pier (simplified)
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Create grid
nx, ny = 150, 100
x = np.linspace(-5, 15, nx)
y_g = np.linspace(-5, 5, ny)
X, Y = np.meshgrid(x, y_g)

# Flow past cylinder (potential flow + wake model)
R = 1.5  # pier radius
U_flow = 4.0

r = np.sqrt(X**2 + Y**2)
theta = np.arctan2(Y, X)

# Potential flow outside cylinder
u = np.where(r > R, U_flow * (1 - R**2 / r**2 * np.cos(2 * theta)), 0)
v = np.where(r > R, U_flow * R**2 / r**2 * np.sin(2 * theta), 0)

# Add turbulent wake behind pier
wake_mask = (X > 0) & (np.abs(Y) < R * 2) & (r > R)
wake_decay = np.exp(-(X[wake_mask]) / 5)
u[wake_mask] *= (1 - 0.5 * wake_decay)
# Add random fluctuations in wake
u[wake_mask] += 0.5 * np.random.randn(np.sum(wake_mask)) * wake_decay

speed = np.sqrt(u**2 + v**2)
ax.streamplot(X, Y, u, v, color=speed, cmap='coolwarm', density=2, linewidth=0.5)

# Draw pier
circle = plt.Circle((0, 0), R, color='#94a3b8', alpha=0.8)
ax.add_patch(circle)
ax.text(0, 0, 'PIER', ha='center', va='center', color='white', fontsize=8)

ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title(f'Flow past bridge pier (Re={rho*U_flow*2*R/mu:.0e})', color='white', fontsize=11)
ax.set_aspect('equal')
ax.set_xlim(-5, 15)

# Plot 3: Drag coefficient regimes
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

Re_range = np.logspace(-1, 7, 1000)

# Different body shapes
bodies = {
    'Sphere': {'Cd_low': lambda Re: 24/Re, 'Cd_mid': 0.44, 'Cd_high': 0.1,
               'Re_trans': 2e5, 'color': '#ef4444'},
    'Cylinder': {'Cd_low': lambda Re: 8*np.pi/(Re * (2.002 - np.log(Re/2))),
                 'Cd_mid': 1.2, 'Cd_high': 0.3, 'Re_trans': 3e5, 'color': '#3b82f6'},
    'Streamlined': {'Cd_low': lambda Re: 0.5/Re**0.5, 'Cd_mid': 0.04,
                    'Cd_high': 0.04, 'Re_trans': 1e6, 'color': '#22c55e'},
}

for name, body in bodies.items():
    Cd = np.zeros_like(Re_range)
    for i, Re in enumerate(Re_range):
        if Re < 1:
            Cd[i] = min(body['Cd_low'](max(Re, 0.01)), 100)
        elif Re < body['Re_trans']:
            Cd[i] = body['Cd_mid']
        else:
            Cd[i] = body['Cd_high']
    ax.loglog(Re_range, Cd, color=body['color'], linewidth=2, label=name)

ax.set_xlabel('Reynolds number', color='white')
ax.set_ylabel('Drag coefficient Cd', color='white')
ax.set_title('Cd vs Re for different shapes', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0.01, 100)

# Plot 4: Vortex shedding frequency
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

diameters = np.linspace(0.5, 5, 100)
velocities_vs = [2, 3, 4, 5]
vs_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

St = 0.2  # Strouhal number

for U_vs, color in zip(velocities_vs, vs_colors):
    f_shed = St * U_vs / diameters
    ax.plot(diameters, f_shed, color=color, linewidth=2, label=f'U = {U_vs} m/s')

ax.set_xlabel('Pier diameter (m)', color='white')
ax.set_ylabel('Vortex shedding frequency (Hz)', color='white')
ax.set_title('Vortex shedding behind piers', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Energy dissipation in turbulent river
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Energy dissipation rate vs river conditions
river_depths = np.linspace(2, 20, 100)
river_slopes = [1e-4, 3e-4, 5e-4, 1e-3]  # River bed slope
slope_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

for slope, color in zip(river_slopes, slope_colors):
    # Manning's equation: U = (1/n) * R^(2/3) * S^(1/2)
    n_manning = 0.03  # River bed roughness
    R_hydraulic = river_depths * 200 / (200 + 2 * river_depths)  # Wide channel
    U_manning = (1 / n_manning) * R_hydraulic**(2/3) * slope**0.5

    # Turbulent dissipation rate epsilon ~ U^3 / L
    epsilon = U_manning**3 / river_depths

    ax.semilogy(river_depths, epsilon, color=color, linewidth=2,
                label=f'Slope = {slope:.0e}')

ax.set_xlabel('River depth (m)', color='white')
ax.set_ylabel('Turbulent dissipation rate (W/kg)', color='white')
ax.set_title('Energy dissipation in river', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Navigation hazard map
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Simplified river map with flow features
river_x = np.linspace(0, 500, 200)
bank_north = 100 + 20 * np.sin(2 * np.pi * river_x / 300)
bank_south = -100 - 20 * np.sin(2 * np.pi * river_x / 300 + 1)

ax.fill_between(river_x, bank_south, bank_north, color='#06b6d4', alpha=0.1)
ax.plot(river_x, bank_north, color='#94a3b8', linewidth=2)
ax.plot(river_x, bank_south, color='#94a3b8', linewidth=2)

# Mark flow features
hazards = [
    (100, 0, 'Sandbank', '#f59e0b', 30),
    (250, 50, 'Bridge piers', '#ef4444', 20),
    (250, -50, 'Vortex zone', '#ef4444', 25),
    (400, -30, 'Confluence\\neddies', '#f59e0b', 35),
]

for x, y, name, color, size in hazards:
    ax.scatter(x, y, c=color, s=size * 10, alpha=0.5, zorder=3)
    ax.text(x, y + 15, name, ha='center', color=color, fontsize=7)

# Safe ferry route
route_x = [50, 150, 200, 300, 350, 450]
route_y = [0, -20, -40, -20, 30, 0]
ax.plot(route_x, route_y, 'o-', color='#22c55e', linewidth=2, markersize=5,
        label='Safe route')

ax.set_xlabel('Distance along river (m)', color='white')
ax.set_ylabel('Cross-river position (m)', color='white')
ax.set_title('Navigation hazard map', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Flow Regime Analysis:")
print(f"Brahmaputra: depth={depth}m, velocity={U_mean} m/s")
print(f"River Re = {rho * U_mean * depth / mu:.2e} (highly turbulent)")
print()
print(f"Bridge pier (D=3m): Re = {rho * 4 * 3 / mu:.2e}")
print(f"Vortex shedding: f = {0.2 * 4 / 3:.2f} Hz (one vortex every {3 / (0.2 * 4):.1f}s)")
print()
print("Flow regimes encountered by the ferryman:")
print("  Near banks: slower, less turbulent (Re ~ 10^5)")
print("  Main channel: fast, highly turbulent (Re ~ 10^7)")
print("  Near piers: separated flow, vortex shedding (DANGER)")
print("  Monsoon: extreme turbulence, standing waves")`,
      challenge: 'Calculate the wave drag (Kelvin wake pattern) for the ferry at different speeds. At what speed does wave-making resistance become dominant over viscous drag? This speed is related to the hull\'s Froude number Fr = U / sqrt(g * L), and the transition occurs near Fr = 0.4.',
      successHint: 'Understanding flow regimes lets you predict where dangers lurk and where the smoothest path lies. The ferryman uses this knowledge instinctively; the naval architect uses it mathematically. Both are solving the same problem: how does water behave around my boat?',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fluid mechanics and hydrodynamic engineering</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for fluid dynamics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
