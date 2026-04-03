import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LotusFloatLevel2() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Surface tension math — the Young-Laplace equation',
      concept: `Level 1 introduced surface tension qualitatively. Now we formalize it.

The **Young-Laplace equation** describes the pressure difference across a curved liquid surface:

**delta_P = gamma * (1/R1 + 1/R2)**

Where:
- delta_P = pressure difference across the surface (Pa)
- gamma = surface tension (0.0728 N/m for water)
- R1, R2 = the two principal radii of curvature

For a spherical droplet (R1 = R2 = R): **delta_P = 2*gamma/R**

This explains why:
- Small drops have higher internal pressure than large drops
- Bubbles are spherical (the shape that minimizes surface area for a given volume)
- Very small drops evaporate faster (higher internal pressure pushes molecules out)
- Capillary rise depends on tube radius

For a water drop of radius 1 mm: delta_P = 2 * 0.0728 / 0.001 = 145.6 Pa (tiny)
For a drop of radius 1 micrometer: delta_P = 145,600 Pa (1.4 atmospheres!)

The smaller the drop, the more powerful surface tension becomes. This is why surface tension dominates at the scale of plant cells but is negligible at human scale.`,
      analogy: 'The Young-Laplace equation is like the tension in a balloon. A small balloon requires more pressure to inflate than a large one (try blowing up a new balloon vs. an already-inflated one). The tighter the curvature, the more the surface resists. This is why bubbles start hard to blow and get easier once they\'re bigger.',
      storyConnection: 'Every water drop that rolls off a lotus leaf is a tiny sphere held together by the Young-Laplace equation. The drop\'s curvature determines its internal pressure, which determines how it interacts with the leaf surface. The physics of a rolling raindrop on a lotus leaf is governed by this equation — even when the story just describes it as "water sliding off like mercury."',
      checkQuestion: 'Two soap bubbles of different sizes are connected by a tube. Which direction does air flow? (Hint: think about the pressure inside each bubble.)',
      checkAnswer: 'Air flows from the SMALLER bubble to the LARGER one. The smaller bubble has higher internal pressure (delta_P = 4*gamma/R for a soap bubble, which has two surfaces). So the small bubble deflates into the large one. This is counterintuitive — you might expect the big bubble to pop. It\'s a direct consequence of the Young-Laplace equation and has implications for lung mechanics (alveoli surfactant prevents small alveoli from collapsing into large ones).',
      codeIntro: 'Calculate and visualize the pressure inside water drops of different sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Young-Laplace equation for spherical drops
gamma = 0.0728  # N/m (water surface tension)

# Radius range from 1 nm to 1 cm
radii = np.logspace(-9, -2, 500)  # meters
delta_P = 2 * gamma / radii  # Pa

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Pressure vs radius (log-log)
ax1.set_facecolor('#111827')
ax1.loglog(radii * 1e6, delta_P, color='#3b82f6', linewidth=2)
ax1.fill_between(radii * 1e6, delta_P, alpha=0.1, color='#3b82f6')

# Mark key scales
scales = [
    (0.001, '1 nm (molecule)', '#ef4444'),
    (0.01, '10 nm (nanoparticle)', '#f59e0b'),
    (1, '1 um (cell)', '#22c55e'),
    (100, '100 um (hair)', '#a855f7'),
    (1000, '1 mm (raindrop)', '#3b82f6'),
]
for r_um, label, color in scales:
    r_m = r_um * 1e-6
    p = 2 * gamma / r_m
    ax1.plot(r_um, p, 'o', color=color, markersize=8)
    ax1.annotate(f'{label}\\n{p:.0f} Pa', xy=(r_um, p),
                 xytext=(10, 10), textcoords='offset points',
                 color=color, fontsize=8)

ax1.axhline(101325, color='#ef4444', linestyle='--', linewidth=1, label='1 atmosphere')
ax1.set_xlabel('Radius (micrometers)', color='white')
ax1.set_ylabel('Internal pressure excess (Pa)', color='white')
ax1.set_title('Young-Laplace: Pressure vs Droplet Size', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Connected bubbles demonstration
ax2.set_facecolor('#111827')
# Two soap bubbles (4*gamma/R because two surfaces)
gamma_soap = 0.025  # N/m for soapy water
R_small = np.linspace(0.005, 0.02, 100)  # 5mm to 20mm
R_large = 0.05  # 50mm

P_small = 4 * gamma_soap / R_small
P_large = 4 * gamma_soap / R_large

ax2.plot(R_small * 1000, P_small, color='#ef4444', linewidth=2, label='Small bubble pressure')
ax2.axhline(P_large, color='#22c55e', linestyle='--', linewidth=2, label=f'Large bubble pressure ({P_large:.1f} Pa)')
ax2.fill_between(R_small * 1000, P_small, P_large, where=P_small > P_large,
                 alpha=0.15, color='#ef4444', label='Pressure drives air: small -> large')

ax2.set_xlabel('Small bubble radius (mm)', color='white')
ax2.set_ylabel('Internal pressure (Pa)', color='white')
ax2.set_title('Connected Bubbles: Small Inflates Large', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Young-Laplace equation: deltaP = 2*gamma/R")
print()
print("Pressure inside water drops:")
for r_um, label, _ in scales:
    r_m = r_um * 1e-6
    p = 2 * gamma / r_m
    atm = p / 101325
    print(f"  R = {label}: {p:,.0f} Pa ({atm:.2f} atm)")
print()
print("Key insight: surface tension is NEGLIGIBLE at human scale")
print("but DOMINANT at cellular/nanoscale.")
print("This is why plants and insects 'feel' surface tension but we don't.")`,
      challenge: 'Calculate the minimum pressure needed to push air through a wet pore of radius 1 micrometer (like in a Gore-Tex membrane). This explains how waterproof-breathable fabrics work: water drops can\'t enter (high pressure needed) but water vapor molecules pass freely.',
      successHint: 'The Young-Laplace equation is deceptively simple but incredibly powerful. It governs everything from raindrop formation to lung mechanics to waterproof fabrics to inkjet printing.',
    },
    {
      title: 'Capillary action — water that climbs uphill',
      concept: `**Capillary action** is the ability of a liquid to flow through narrow spaces without external forces, even against gravity. It's driven by the interplay of:

1. **Adhesion**: Attraction between liquid and tube wall (water "likes" glass)
2. **Cohesion**: Attraction between liquid molecules (water "likes" water)
3. **Surface tension**: Pulls the liquid surface upward along the wall

The **Jurin's law** gives the height of capillary rise:

**h = 2*gamma*cos(theta) / (rho*g*r)**

Where:
- gamma = surface tension (0.0728 N/m)
- theta = contact angle (0 degrees for water-glass)
- rho = liquid density (1000 kg/m^3 for water)
- g = 9.8 m/s^2
- r = tube radius

For a 1mm tube: h = 2 * 0.0728 / (1000 * 9.8 * 0.001) = 14.9 mm
For a 10 micrometer tube: h = 1.49 m
For a 1 micrometer tube: h = 14.9 m!

This is how plants move water from roots to leaves. The xylem vessels in plants are tubes of 20-200 micrometers diameter. Capillary action alone can lift water several meters. For taller trees, additional mechanisms (transpiration pull, root pressure) are needed.`,
      analogy: 'Capillary action is like a crowd of people at a concert pulling each other forward. The people at the front (adhesion — water touching the tube wall) are pulled toward the stage. They grab the people behind them (cohesion — water molecules pulling each other). The whole crowd surges forward and upward. The narrower the corridor (smaller tube), the stronger the pull relative to the crowd\'s weight.',
      storyConnection: 'The lotus in our story grows from roots in mud through a meter of water to leaves at the surface. Water and nutrients must travel upward through the stem against gravity. Capillary action in the xylem provides the initial lift. For the lotus, with relatively short stems, capillary action plus root pressure is sufficient. For a 100-meter redwood, it\'s just the starting mechanism.',
      checkQuestion: 'A coastal redwood is 100 meters tall. Capillary action in a 20-micrometer xylem vessel can lift water about 0.75 meters. How does water reach the top?',
      checkAnswer: 'Transpiration pull (the cohesion-tension theory). As water evaporates from leaf stomata, it creates negative pressure (tension) in the xylem. This tension pulls the entire column of water upward, like sucking through a very long straw. The water column holds together because of cohesion between water molecules (hydrogen bonds). The maximum tension before the column breaks is about -3 MPa, which can theoretically lift water to ~300 meters. Capillary action just starts the process; transpiration pull does the heavy lifting.',
      codeIntro: 'Model capillary rise in tubes of different sizes and compare to plant xylem.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Capillary rise: Jurin's law
gamma = 0.0728  # N/m
theta = 0  # degrees (complete wetting for water-glass)
rho = 1000  # kg/m^3
g = 9.8  # m/s^2

# Tube radius range
radii = np.logspace(-7, -2, 500)  # 100nm to 1cm
height = 2 * gamma * np.cos(np.radians(theta)) / (rho * g * radii)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Capillary height vs radius
ax1.set_facecolor('#111827')
ax1.loglog(radii * 1e6, height, color='#3b82f6', linewidth=2)
ax1.fill_between(radii * 1e6, height, alpha=0.1, color='#3b82f6')

# Mark plant xylem ranges
plants = [
    ('Lotus xylem', 50, '#22c55e'),
    ('Oak xylem', 100, '#f59e0b'),
    ('Conifer tracheid', 15, '#a855f7'),
    ('Glass tube', 500, '#6b7280'),
]
for name, r_um, color in plants:
    r_m = r_um * 1e-6
    h = 2 * gamma / (rho * g * r_m)
    ax1.plot(r_um, h, 'o', color=color, markersize=10)
    ax1.annotate(f'{name}\\nr={r_um}um, h={h:.2f}m', xy=(r_um, h),
                 xytext=(10, 10), textcoords='offset points', color=color, fontsize=9)

ax1.set_xlabel('Tube radius (micrometers)', color='white')
ax1.set_ylabel('Capillary rise height (m)', color='white')
ax1.set_title('Jurin\'s Law: Height vs Tube Radius', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Water transport in plants: capillary + transpiration
ax2.set_facecolor('#111827')
plant_heights = np.array([0.5, 1, 3, 10, 30, 100])  # meters
plant_names = ['Grass', 'Lotus', 'Shrub', 'Apple\\ntree', 'Pine', 'Redwood']
capillary_reach = np.array([0.3, 0.3, 0.3, 0.3, 0.5, 0.75])
root_pressure = np.array([0.2, 0.5, 0.5, 1.0, 0.5, 0.5])
transpiration = plant_heights - capillary_reach - root_pressure
transpiration = np.maximum(transpiration, 0)

x = np.arange(len(plant_names))
width = 0.6
ax2.bar(x, capillary_reach, width, label='Capillary action', color='#3b82f6')
ax2.bar(x, root_pressure, width, bottom=capillary_reach, label='Root pressure', color='#22c55e')
ax2.bar(x, transpiration, width, bottom=capillary_reach + root_pressure,
        label='Transpiration pull', color='#f59e0b')

ax2.set_xticks(x)
ax2.set_xticklabels(plant_names, color='white', fontsize=9)
ax2.set_ylabel('Height contribution (m)', color='white')
ax2.set_title('How Plants Lift Water', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Capillary rise by xylem size:")
for name, r_um, _ in plants:
    r_m = r_um * 1e-6
    h = 2 * gamma / (rho * g * r_m)
    print(f"  {name}: radius {r_um}um -> rise {h:.2f}m")
print()
print("For tall trees, capillary action provides < 1% of total lift.")
print("Transpiration pull provides the rest — up to 100+ meters.")
print("The water column is held together by hydrogen bonds (cohesion).")`,
      challenge: 'Mercury has a contact angle of 140 degrees with glass (it repels glass). Calculate the capillary depression (negative height) of mercury in a 1mm glass tube. This is why mercury thermometers have a meniscus that curves downward.',
      successHint: 'Capillary action connects surface tension to plant physiology. Understanding Jurin\'s law explains how plants move water, how paper towels absorb, and why narrow cracks in rock fill with water.',
    },
    {
      title: 'Wetting and contact angles — how surfaces interact with liquids',
      concept: `The **contact angle** (theta) is the angle where a liquid-air interface meets a solid surface. It tells you everything about how the liquid interacts with that surface:

- **theta = 0 degrees**: Complete wetting (liquid spreads perfectly)
- **theta < 90 degrees**: Hydrophilic (liquid likes the surface)
- **theta > 90 degrees**: Hydrophobic (liquid avoids the surface)
- **theta > 150 degrees**: Superhydrophobic (lotus effect)

The contact angle is determined by **Young's equation**:

**cos(theta) = (gamma_SG - gamma_SL) / gamma_LG**

Where:
- gamma_SG = solid-gas surface energy
- gamma_SL = solid-liquid surface energy
- gamma_LG = liquid-gas surface tension

In plain language: the contact angle balances three forces:
1. Surface wants to attract the liquid (pull it down = spread)
2. Liquid wants to minimize its surface area (pull it up = bead)
3. The result is a compromise angle

The lotus achieves theta ~160 degrees through:
- Low surface energy wax (chemical factor)
- Micro/nano roughness (geometric factor)

The **Cassie-Baxter equation** extends Young's equation for rough surfaces:
**cos(theta*) = f * cos(theta) + f - 1**
where f = fraction of surface actually in contact with the liquid.`,
      analogy: 'Contact angle is like how comfortable a person is at a party. A contact angle of 0 means they spread out across the room (very comfortable — hydrophilic). A contact angle of 180 would mean they curl into a ball in the corner (extremely uncomfortable — superhydrophobic). Most people are somewhere in between. The host\'s personality (surface chemistry) and the room layout (surface roughness) both affect comfort level.',
      storyConnection: 'When water rolls off a lotus leaf in our story, it\'s because the contact angle is ~160 degrees — water is extremely "uncomfortable" on the leaf surface. The waxy papillae create a surface where water touches almost nothing solid. This is the molecular explanation for the lotus\'s legendary purity: water and dirt physically cannot stay.',
      checkQuestion: 'Can you make a surface with a contact angle greater than 180 degrees? What would that mean physically?',
      checkAnswer: 'No — 180 degrees is the theoretical maximum, meaning the drop would be a perfect sphere touching the surface at a single point. In practice, even the best superhydrophobic surfaces max out around 175 degrees because some molecular-level contact is unavoidable. Beyond 180 degrees would mean the surface actively repels the drop upward — which would require an energy source, not just passive surface chemistry.',
      codeIntro: 'Visualize how contact angle changes with surface chemistry and roughness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Contact angle physics

# Young's equation: cos(theta) = (gamma_SG - gamma_SL) / gamma_LG
gamma_LG = 0.0728  # water surface tension

# Different materials
materials = {
    'Clean glass': {'gamma_SG': 0.500, 'gamma_SL': 0.430, 'color': '#3b82f6'},
    'Steel': {'gamma_SG': 0.400, 'gamma_SL': 0.350, 'color': '#6b7280'},
    'Plastic (PE)': {'gamma_SG': 0.033, 'gamma_SL': 0.010, 'color': '#f59e0b'},
    'Wax': {'gamma_SG': 0.025, 'gamma_SL': 0.005, 'color': '#a855f7'},
    'Teflon': {'gamma_SG': 0.020, 'gamma_SL': 0.002, 'color': '#ef4444'},
}

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Contact angles for different materials
ax1.set_facecolor('#111827')
mat_names = []
thetas = []
mat_colors = []
for name, props in materials.items():
    cos_theta = (props['gamma_SG'] - props['gamma_SL']) / gamma_LG
    cos_theta = np.clip(cos_theta, -1, 1)
    theta = np.degrees(np.arccos(cos_theta))
    mat_names.append(name)
    thetas.append(theta)
    mat_colors.append(props['color'])

bars = ax1.bar(mat_names, thetas, color=mat_colors, width=0.6)
ax1.axhline(90, color='white', linestyle='--', linewidth=1, label='Hydrophilic/phobic boundary')
ax1.axhline(150, color='#22c55e', linestyle='--', linewidth=1, label='Superhydrophobic threshold')
ax1.set_ylabel('Contact angle (degrees)', color='white')
ax1.set_title('Contact Angle by Material (Young\'s Equation)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_xticklabels(mat_names, color='white', fontsize=8, rotation=15)
for bar, t in zip(bars, thetas):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{t:.0f}deg', ha='center', color='white', fontsize=9)

# Cassie-Baxter: roughness enhances hydrophobicity
ax2.set_facecolor('#111827')
theta_flat_range = np.linspace(90, 120, 4)  # only works for hydrophobic surfaces
f_range = np.linspace(0.01, 1.0, 200)

for theta_f in theta_flat_range:
    cos_star = f_range * np.cos(np.radians(theta_f)) + f_range - 1
    theta_star = np.degrees(np.arccos(np.clip(cos_star, -1, 1)))
    ax2.plot(f_range * 100, theta_star, linewidth=2,
             label=f'Flat angle = {theta_f:.0f}deg')

ax2.axhline(150, color='#22c55e', linestyle='--', linewidth=1, label='Superhydrophobic')
ax2.plot(3, 160, '*', color='#22c55e', markersize=15, label='Lotus leaf')
ax2.set_xlabel('Surface contact fraction (%)', color='white')
ax2.set_ylabel('Apparent contact angle (degrees)', color='white')
ax2.set_title('Cassie-Baxter: Roughness Effect', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Drop shape visualization
ax3.set_facecolor('#111827')
display_angles = [30, 90, 120, 160]
display_colors = ['#3b82f6', '#f59e0b', '#a855f7', '#22c55e']
display_labels = ['Hydrophilic (30deg)', 'Neutral (90deg)', 'Hydrophobic (120deg)', 'Lotus (160deg)']

for i, (angle, color, label) in enumerate(zip(display_angles, display_colors, display_labels)):
    ca_rad = np.radians(angle)
    # Generate drop profile
    if angle <= 90:
        t = np.linspace(0, np.pi, 100)
        r = 0.4
        cx = i * 1.2
        x = cx + r * np.cos(t)
        y = r * np.sin(t) * (1 - np.cos(ca_rad)) / 2 + 0.01
        ax3.fill(x, y, alpha=0.5, color=color)
        ax3.plot(x, y, color=color, linewidth=2)
    else:
        t = np.linspace(0, 2 * np.pi, 100)
        r = 0.3
        cx = i * 1.2
        squeeze = np.sin(ca_rad / 2)
        x = cx + r * np.cos(t) * squeeze
        y = r * np.sin(t) * 0.5 + r * 0.5 + 0.01
        y = np.maximum(y, 0.01)
        visible = y > 0.02
        ax3.fill(x[visible], y[visible], alpha=0.5, color=color)
        ax3.plot(x[visible], y[visible], color=color, linewidth=2)

    ax3.text(cx, -0.15, label, ha='center', color=color, fontsize=8)

ax3.axhline(0, color='gray', linewidth=1)
ax3.set_ylim(-0.3, 0.6)
ax3.set_xlim(-0.5, 4.5)
ax3.set_title('Drop Shape at Different Contact Angles', color='white', fontsize=12)
ax3.set_aspect('equal')
ax3.axis('off')

# Sliding angle vs contact angle
ax4.set_facecolor('#111827')
contact_angles = np.linspace(90, 175, 100)
# Sliding angle decreases as contact angle increases (empirical)
sliding_angles = 90 * np.exp(-(contact_angles - 90) / 20)

ax4.plot(contact_angles, sliding_angles, color='#3b82f6', linewidth=2)
ax4.fill_between(contact_angles, sliding_angles, alpha=0.1, color='#3b82f6')
ax4.plot(160, 2, 'o', color='#22c55e', markersize=12, label='Lotus (~2deg slide)')
ax4.set_xlabel('Contact angle (degrees)', color='white')
ax4.set_ylabel('Sliding angle (degrees)', color='white')
ax4.set_title('Sliding Angle: When Drops Roll Off', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Contact angle determines surface behavior:")
print("  < 10 deg: water spreads (windshield wiper fluid)")
print("  ~30 deg: hydrophilic (clean glass)")
print("  ~90 deg: neutral (most plastics)")
print("  ~110 deg: hydrophobic (wax)")
print("  ~160 deg: superhydrophobic (lotus leaf)")
print()
print("Young's equation: surface chemistry")
print("Cassie-Baxter: surface chemistry + roughness")
print("Both are needed for the lotus effect.")`,
      challenge: 'A gecko\'s feet are superhydrophobic but also super-adhesive. How is this possible? (Hint: the gecko uses van der Waals forces, not wetting.) Research the difference between adhesion via wetting and adhesion via van der Waals forces.',
      successHint: 'Contact angle is the single most informative measurement of a surface\'s interaction with liquids. It encodes chemistry and geometry in one number. Mastering Young\'s and Cassie-Baxter equations lets you design surfaces for any application.',
    },
    {
      title: 'Superhydrophobic surfaces — engineering the lotus effect',
      concept: `Creating artificial superhydrophobic surfaces (contact angle > 150 degrees) requires two things:

**1. Low surface energy chemistry**: The coating must be hydrophobic at the molecular level.
- Fluorocarbons (Teflon-like): gamma ~18 mN/m
- Silicones: gamma ~22 mN/m
- Waxes: gamma ~25 mN/m
- But even the most hydrophobic flat surface only reaches ~120 degrees

**2. Hierarchical roughness**: Micro AND nanoscale texture (like the lotus).
- Microscale bumps (1-100 micrometers): create the primary roughness
- Nanoscale features on each bump (10-100 nm): create air-trapping pockets
- Both levels are essential — one level alone doesn't work well

**Fabrication methods**:
- Spray coating: nanoparticle suspension sprayed onto surface
- Electrospinning: creating nanofibrous mats
- Lithography: precise etching of micro-pillars
- Chemical etching: acid creates random roughness
- Sol-gel coating: silica nanoparticles self-assemble

**The durability problem**: Most superhydrophobic coatings are fragile. The nanoscale features that make them work are easily damaged by abrasion. The lotus replaces its wax continuously; artificial surfaces cannot. Current research focuses on self-healing coatings and mechanically robust structures.`,
      analogy: 'Making a superhydrophobic surface is like making a bed of nails. One nail (smooth hydrophobic surface) is just a pointy surface you sit on. Thousands of nails (micro-roughness) spread your weight. Tiny barbs on each nail tip (nano-roughness) reduce contact further. The magic requires BOTH scales of structure working together — neither alone creates the effect.',
      storyConnection: 'The lotus in our story stays pristine in muddy water. Engineers trying to replicate this have learned that copying the lotus isn\'t enough — you need to understand WHY it works at multiple scales. The dual hierarchy (micro papillae + nano wax tubules) is the key insight. Nature\'s design documents are written in nanometers.',
      checkQuestion: 'If a superhydrophobic coating wears off after 1 year of outdoor use, but the lotus renews its wax continuously, how could we engineer a self-healing superhydrophobic surface?',
      checkAnswer: 'Several approaches: (1) Embed hydrophobic molecules in a porous matrix — as the surface wears, fresh molecules migrate to the surface (like a slow-release drug). (2) Use materials that inherently regenerate roughness (certain polymers re-crystallize their surface). (3) Microencapsulated wax — tiny capsules of wax in the coating break when scratched, releasing fresh hydrophobic material. (4) Living coatings — engineer bacteria or fungi to continuously produce hydrophobic molecules. Approach 1 is closest to commercialization.',
      codeIntro: 'Model the relationship between surface roughness parameters and hydrophobicity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Superhydrophobic surface design space

# Two key parameters: roughness factor (r) and solid fraction (f)
# Wenzel model: cos(theta_W) = r * cos(theta_Y)  (liquid fills grooves)
# Cassie-Baxter: cos(theta_CB) = f * cos(theta_Y) + f - 1  (air trapped)

theta_Y = 110  # degrees (flat hydrophobic surface)
cos_Y = np.cos(np.radians(theta_Y))

# Roughness factor r (ratio of actual to projected area)
r_range = np.linspace(1, 5, 200)
cos_W = r_range * cos_Y
theta_W = np.degrees(np.arccos(np.clip(cos_W, -1, 1)))

# Solid fraction f
f_range = np.linspace(0.01, 1.0, 200)
cos_CB = f_range * cos_Y + f_range - 1
theta_CB = np.degrees(np.arccos(np.clip(cos_CB, -1, 1)))

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Wenzel vs Cassie-Baxter
ax1.set_facecolor('#111827')
ax1.plot(r_range, theta_W, color='#ef4444', linewidth=2, label='Wenzel (liquid fills grooves)')
ax1.axhline(theta_Y, color='#6b7280', linestyle='--', linewidth=1, label=f'Flat surface ({theta_Y}deg)')
ax1.set_xlabel('Roughness factor r', color='white')
ax1.set_ylabel('Apparent contact angle (degrees)', color='white')
ax1.set_title('Wenzel Model: Roughness Effect', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.plot(f_range * 100, theta_CB, color='#22c55e', linewidth=2, label='Cassie-Baxter (air trapped)')
ax2.axhline(150, color='#a855f7', linestyle='--', linewidth=1, label='Superhydrophobic threshold')
ax2.plot(3, 160, '*', color='#22c55e', markersize=15, label='Lotus')
ax2.set_xlabel('Solid fraction f (%)', color='white')
ax2.set_ylabel('Apparent contact angle (degrees)', color='white')
ax2.set_title('Cassie-Baxter: Air Trapping Effect', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Design space map (f vs theta_Y)
ax3.set_facecolor('#111827')
theta_Y_range = np.linspace(70, 130, 200)
f_values = [0.03, 0.1, 0.3, 0.5, 1.0]
f_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']

for f, fc in zip(f_values, f_colors):
    cos_star = f * np.cos(np.radians(theta_Y_range)) + f - 1
    theta_star = np.degrees(np.arccos(np.clip(cos_star, -1, 1)))
    ax3.plot(theta_Y_range, theta_star, linewidth=2, color=fc, label=f'f = {f}')

ax3.axhline(150, color='white', linestyle='--', linewidth=1, alpha=0.5)
ax3.axvline(90, color='white', linestyle=':', linewidth=1, alpha=0.5)
ax3.set_xlabel('Flat surface contact angle (degrees)', color='white')
ax3.set_ylabel('Apparent contact angle with roughness (degrees)', color='white')
ax3.set_title('Design Space: Chemistry x Roughness', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

# Durability comparison
ax4.set_facecolor('#111827')
abrasion_cycles = np.arange(0, 1001)
coatings = {
    'Spray nanoparticle': 160 * np.exp(-abrasion_cycles / 100) + 90 * (1 - np.exp(-abrasion_cycles / 100)),
    'Etched aluminum': 155 * np.exp(-abrasion_cycles / 300) + 100 * (1 - np.exp(-abrasion_cycles / 300)),
    'Self-healing polymer': 158 * np.exp(-abrasion_cycles / 800) + 140 * (1 - np.exp(-abrasion_cycles / 800)),
    'Lotus (biological)': np.full(1001, 160.0),  # self-renewing
}
coat_colors = {'Spray nanoparticle': '#ef4444', 'Etched aluminum': '#f59e0b',
               'Self-healing polymer': '#a855f7', 'Lotus (biological)': '#22c55e'}

for name, angles in coatings.items():
    ax4.plot(abrasion_cycles, angles, linewidth=2, color=coat_colors[name], label=name)

ax4.axhline(150, color='white', linestyle='--', linewidth=1, alpha=0.5, label='Superhydrophobic threshold')
ax4.set_xlabel('Abrasion cycles', color='white')
ax4.set_ylabel('Contact angle (degrees)', color='white')
ax4.set_title('Coating Durability Under Wear', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key engineering parameters for superhydrophobic surfaces:")
print(f"  Required: contact angle > 150 deg AND sliding angle < 10 deg")
print(f"  Lotus achieves: ~160 deg contact, ~2 deg sliding")
print()
print("Design rules:")
print("  1. Start with hydrophobic chemistry (theta_Y > 90 deg)")
print("  2. Add microscale roughness (reduce f to ~10%)")
print("  3. Add nanoscale features on micro bumps (reduce f to ~3%)")
print("  4. The biggest unsolved problem: DURABILITY")`,
      challenge: 'Design a superhydrophobic coating for smartphone screens. Requirements: transparent, durable, fingerprint-resistant. What material would you choose? What roughness structure? What are the trade-offs between hydrophobicity and optical clarity?',
      successHint: 'Superhydrophobic surface engineering is one of the most active areas of materials science. The lotus provided the blueprint; engineers are still working on making it practical, durable, and scalable.',
    },
    {
      title: 'Microfluidics — controlling liquids at the lotus scale',
      concept: `**Microfluidics** is the science of manipulating tiny volumes of liquid (nanoliters to microliters) in channels with dimensions of 10-100 micrometers — the same scale as lotus leaf papillae and plant xylem.

At this scale, physics changes:
- **Laminar flow dominates**: Fluids don't mix by turbulence. Two streams flowing side by side stay separate (Reynolds number << 1).
- **Surface tension dominates**: Gravity becomes negligible. Capillary forces control liquid movement.
- **Diffusion is fast**: Molecules cross a 100-micrometer channel in about 1 second.

Applications:
- **Lab-on-a-chip**: Complete chemical analysis on a chip the size of a credit card
- **Point-of-care diagnostics**: COVID tests, pregnancy tests, blood analysis
- **Drug screening**: Test thousands of drug compounds using microliters of reagent
- **Single-cell analysis**: Isolate and study individual cells

Connection to plants: Plant xylem IS a microfluidic system. Water flows through channels of 20-200 micrometers, driven by capillary action and transpiration pull. The lotus's aerenchyma is a gas-phase microfluidic network. Plants have been doing microfluidics for 450 million years.`,
      analogy: 'Microfluidics is like plumbing for an ant-sized house. At human scale, water gushes from faucets, mixes turbulently, and gravity pulls it down drains. At ant scale, water barely moves without being pushed, doesn\'t mix even when two streams meet, and surface tension holds it in tiny channels against gravity. The rules of plumbing completely change — and those new rules are what microfluidics exploits.',
      storyConnection: 'The lotus moves water at two scales: macro (drops rolling off leaves) and micro (xylem transporting water from roots). Our story captures the macro — water sliding off like mercury. But inside the lotus, an equally remarkable micro-story plays out: precise fluid control in channels narrower than a hair, driven by surface tension and evaporation. The lotus is both a macro-engineering and micro-engineering marvel.',
      checkQuestion: 'In a microfluidic channel, two different colored streams flow side by side without mixing. At our scale, two rivers meeting (like the Amazon and Negro) mix within kilometers. Why the difference?',
      checkAnswer: 'Reynolds number (Re). At our scale, Re >> 1000, so flow is turbulent — chaotic eddies mix fluids rapidly. In microfluidic channels, Re < 1, so flow is laminar — fluids slide past each other in smooth layers. Mixing only happens by diffusion, which is slow. To mix fluids in microfluidics, you need to engineer mixing structures (zigzag channels, herringbone grooves) that fold the streams over each other, increasing the diffusion interface.',
      codeIntro: 'Simulate laminar flow and diffusion in a microfluidic channel.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Microfluidic flow simulation

# Laminar flow in a rectangular channel (Poiseuille flow)
# Velocity profile: parabolic
channel_width = 100e-6  # 100 micrometers
y = np.linspace(-channel_width/2, channel_width/2, 200)

# Velocity profile (parabolic)
v_max = 0.01  # m/s (typical microfluidic velocity)
velocity = v_max * (1 - (2 * y / channel_width)**2)

# Diffusion of a dye across the channel
# Two streams meeting: left = dye, right = clear
D = 1e-9  # diffusion coefficient (m^2/s) for typical dye
x_positions = [0, 0.001, 0.005, 0.01, 0.05]  # meters along channel

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Velocity profile
ax1.set_facecolor('#111827')
ax1.plot(velocity * 1000, y * 1e6, color='#3b82f6', linewidth=2)
ax1.fill_betweenx(y * 1e6, velocity * 1000, alpha=0.15, color='#3b82f6')
ax1.axhline(0, color='gray', linewidth=0.5)
ax1.set_xlabel('Velocity (mm/s)', color='white')
ax1.set_ylabel('Position across channel (um)', color='white')
ax1.set_title('Parabolic Velocity Profile (Laminar Flow)', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Diffusion at different distances
ax2.set_facecolor('#111827')
colors_diff = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for x_pos, color in zip(x_positions, colors_diff):
    if x_pos == 0:
        # Step function at inlet
        conc = np.where(y < 0, 1, 0)
    else:
        # Time for fluid to reach this position: t = x / v_avg
        v_avg = v_max * 2 / 3  # average velocity for Poiseuille flow
        t = x_pos / v_avg
        # Error function solution to diffusion equation
        from numpy import sqrt, pi
        conc = 0.5 * (1 - np.array([2/sqrt(pi) * np.trapz(np.exp(-t_arr**2),
               np.linspace(0, yi / (2 * sqrt(D * t)), 100)) if t > 0 else (0 if yi > 0 else 1)
               for yi in y]))
        # Simplified: use complementary error function approximation
        conc = 0.5 * (1 - np.tanh(y / (2 * np.sqrt(D * t + 1e-20)) * 2))

    ax2.plot(y * 1e6, conc, color=color, linewidth=2, label=f'x = {x_pos*1000:.0f} mm')

ax2.set_xlabel('Position across channel (um)', color='white')
ax2.set_ylabel('Dye concentration', color='white')
ax2.set_title('Diffusion: Two Streams Mixing Slowly', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Reynolds number comparison
ax3.set_facecolor('#111827')
scenarios = {
    'Microfluidic chip': {'v': 0.01, 'L': 100e-6, 'nu': 1e-6},
    'Plant xylem': {'v': 0.001, 'L': 50e-6, 'nu': 1e-6},
    'Blood capillary': {'v': 0.001, 'L': 8e-6, 'nu': 3e-6},
    'Garden hose': {'v': 2, 'L': 0.02, 'nu': 1e-6},
    'River': {'v': 1, 'L': 10, 'nu': 1e-6},
}
Re_names = list(scenarios.keys())
Re_values = [s['v'] * s['L'] / s['nu'] for s in scenarios.values()]
Re_colors = ['#22c55e' if re < 2000 else '#ef4444' for re in Re_values]

bars3 = ax3.barh(Re_names, Re_values, color=Re_colors, height=0.6)
ax3.set_xscale('log')
ax3.axvline(2000, color='#f59e0b', linestyle='--', linewidth=1, label='Turbulence threshold')
ax3.set_xlabel('Reynolds number (log scale)', color='white')
ax3.set_title('Reynolds Number: Laminar vs Turbulent', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.set_yticklabels(Re_names, color='white', fontsize=9)

for bar, re in zip(bars3, Re_values):
    flow = "Laminar" if re < 2000 else "Turbulent"
    ax3.text(re * 1.5, bar.get_y() + bar.get_height()/2,
             f'Re = {re:.2g} ({flow})', va='center', color='white', fontsize=9)

# Lab-on-chip applications
ax4.set_facecolor('#111827')
applications = ['Blood test', 'DNA\\nanalysis', 'Drug\\nscreening', 'Cell\\nsorting', 'Water\\ntesting']
sample_traditional = [5000, 1000, 10000, 5000, 50000]  # microliters needed
sample_microfluidic = [1, 0.1, 10, 5, 100]

x = np.arange(len(applications))
width = 0.35
ax4.bar(x - width/2, sample_traditional, width, label='Traditional lab', color='#ef4444')
ax4.bar(x + width/2, sample_microfluidic, width, label='Microfluidic chip', color='#22c55e')
ax4.set_xticks(x)
ax4.set_xticklabels(applications, color='white', fontsize=9)
ax4.set_ylabel('Sample volume needed (uL, log)', color='white')
ax4.set_yscale('log')
ax4.set_title('Sample Savings: Traditional vs Microfluidic', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Microfluidics key numbers:")
print(f"  Channel width: 10-100 micrometers")
print(f"  Reynolds number: 0.001 - 10 (always laminar)")
print(f"  Sample volume: nanoliters to microliters")
print(f"  Flow velocity: 0.1-10 mm/s")
print()
print("Plants have been doing microfluidics for 450 million years.")
print("We've been doing it for about 30.")`,
      challenge: 'Design a microfluidic device that mixes two streams in the shortest possible distance. You can\'t create turbulence (Re is too low). What channel geometry would you use? Research "herringbone mixer" and "Dean flow" designs.',
      successHint: 'Microfluidics connects the physics of surface tension and capillary action to practical biotechnology. The lotus and other plants are natural microfluidic engineers — and understanding their systems inspires human designs.',
    },
    {
      title: 'Water treatment inspired by plants — cleaning water nature\'s way',
      concept: `Plants have been purifying water for 450 million years. Modern water treatment is increasingly learning from them:

**1. Constructed wetlands** (inspired by natural wetlands):
- Plants like reeds, cattails, and water hyacinths absorb heavy metals and nutrients
- Root-zone bacteria break down organic pollutants
- 90% removal of BOD (biological oxygen demand) at 10% the cost of conventional treatment
- Used for municipal wastewater, industrial effluent, and agricultural runoff

**2. Phytoremediation** (plants cleaning contaminated soil/water):
- Sunflowers accumulate radioactive cesium and strontium (used at Chernobyl)
- Willow trees absorb heavy metals from contaminated groundwater
- Water lettuce and duckweed absorb excess nitrogen and phosphorus

**3. Biomimetic membranes** (inspired by plant cell membranes):
- Aquaporins: protein channels in cell membranes that allow water through but block ions
- Aquaporin Inside membranes (by Aquaporin A/S): artificial membranes with biological aquaporins embedded
- 10-100x more efficient than conventional reverse osmosis

**4. Lotus-effect water harvesting**:
- Superhydrophobic surfaces collect fog and dew
- Desert plants (Namib beetle, cactus) inspire fog-harvesting structures
- Could provide water in arid regions

Plants don't just live in water — they CLEAN water. And they do it with zero energy input and zero toxic byproducts.`,
      analogy: 'Plant-based water treatment is like hiring a living factory that runs on sunlight. A conventional water treatment plant requires concrete, steel, electricity, chemicals, and engineers. A constructed wetland requires: plants, gravel, and sunshine. The plants are the machinery, sunlight is the power, and bacteria are the workers. The "factory" is alive, self-repairing, and beautiful.',
      storyConnection: 'The lotus in our story floats clean above murky water. But it\'s also cleaning that water — absorbing nutrients, providing oxygen, hosting root-zone bacteria that break down pollutants. The story\'s image of purity emerging from mud is biologically accurate: the lotus literally purifies its environment. Biomimicry here isn\'t copying a product; it\'s copying a process.',
      checkQuestion: 'If constructed wetlands cost 10% of conventional treatment plants and remove 90% of pollutants, why don\'t all cities use them?',
      checkAnswer: 'Three main reasons: (1) Land area — constructed wetlands need 5-10x more land than conventional plants, which is expensive in cities. (2) Climate dependence — plant-based treatment slows dramatically in winter (cold climates). (3) Consistency — natural systems have variable performance; cities need guaranteed treatment levels. The best approach is hybrid: conventional treatment for the core + constructed wetlands for polishing and overflow handling. Many European cities now use this combination.',
      codeIntro: 'Model the pollutant removal efficiency of a constructed wetland vs. conventional treatment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Constructed wetland vs conventional water treatment

# Pollutant removal over time/distance
distance = np.linspace(0, 100, 500)  # meters through wetland

# First-order decay: C = C0 * exp(-k * d)
pollutants = {
    'BOD (organics)': {'k_wetland': 0.05, 'k_conventional': 0.15, 'inlet': 200},
    'Nitrogen': {'k_wetland': 0.03, 'k_conventional': 0.10, 'inlet': 50},
    'Phosphorus': {'k_wetland': 0.02, 'k_conventional': 0.08, 'inlet': 10},
    'Heavy metals': {'k_wetland': 0.04, 'k_conventional': 0.12, 'inlet': 5},
}

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Removal through wetland
ax1.set_facecolor('#111827')
colors_p = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
for (name, params), color in zip(pollutants.items(), colors_p):
    conc = params['inlet'] * np.exp(-params['k_wetland'] * distance)
    removal_pct = (1 - conc / params['inlet']) * 100
    ax1.plot(distance, removal_pct, color=color, linewidth=2, label=name)

ax1.axhline(90, color='white', linestyle='--', linewidth=1, alpha=0.5, label='90% target')
ax1.set_xlabel('Distance through wetland (m)', color='white')
ax1.set_ylabel('Removal efficiency (%)', color='white')
ax1.set_title('Pollutant Removal in Constructed Wetland', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Cost comparison
ax2.set_facecolor('#111827')
treatment_types = ['Conventional\\nplant', 'Constructed\\nwetland', 'Hybrid\\n(conv + wetland)', 'Aquaporin\\nmembrane']
capital_cost = [1000, 200, 700, 1500]  # $/person
operating_cost = [50, 5, 30, 20]  # $/person/year
energy_use = [0.5, 0.02, 0.3, 0.1]  # kWh/m3

x = np.arange(len(treatment_types))
width = 0.25
ax2.bar(x - width, [c/100 for c in capital_cost], width, label='Capital ($100s)', color='#ef4444')
ax2.bar(x, operating_cost, width, label='Operating ($/yr)', color='#f59e0b')
ax2.bar(x + width, [e * 100 for e in energy_use], width, label='Energy (x100 kWh/m3)', color='#3b82f6')
ax2.set_xticks(x)
ax2.set_xticklabels(treatment_types, color='white', fontsize=9)
ax2.set_ylabel('Relative cost/energy', color='white')
ax2.set_title('Treatment Cost Comparison', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Plant species and their specialties
ax3.set_facecolor('#111827')
plants_wt = ['Reed', 'Water\\nhyacinth', 'Duckweed', 'Cattail', 'Lotus']
bod_removal = [85, 90, 80, 75, 70]
n_removal = [60, 75, 85, 55, 50]
metal_removal = [40, 70, 60, 30, 45]

x3 = np.arange(len(plants_wt))
width3 = 0.25
ax3.bar(x3 - width3, bod_removal, width3, label='BOD removal %', color='#22c55e')
ax3.bar(x3, n_removal, width3, label='Nitrogen removal %', color='#3b82f6')
ax3.bar(x3 + width3, metal_removal, width3, label='Metal removal %', color='#a855f7')
ax3.set_xticks(x3)
ax3.set_xticklabels(plants_wt, color='white', fontsize=9)
ax3.set_ylabel('Removal efficiency (%)', color='white')
ax3.set_title('Plant Species: Pollutant Specialization', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

# Aquaporin membrane vs RO
ax4.set_facecolor('#111827')
pressure = np.linspace(0, 60, 200)  # bar
# Reverse osmosis flux (proportional to pressure above osmotic)
osmotic_pressure = 25  # bar for seawater
ro_flux = np.maximum(0, 2 * (pressure - osmotic_pressure))  # L/m2/h
# Aquaporin membrane (lower pressure needed)
aq_flux = np.maximum(0, 8 * (pressure - osmotic_pressure * 0.6))

ax4.plot(pressure, ro_flux, color='#ef4444', linewidth=2, label='Conventional RO')
ax4.plot(pressure, aq_flux, color='#22c55e', linewidth=2, label='Aquaporin membrane')
ax4.axvline(osmotic_pressure, color='#f59e0b', linestyle=':', linewidth=1,
            label=f'Seawater osmotic pressure ({osmotic_pressure} bar)')
ax4.set_xlabel('Applied pressure (bar)', color='white')
ax4.set_ylabel('Water flux (L/m2/h)', color='white')
ax4.set_title('Aquaporin vs RO: Water Flux', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Plant-inspired water treatment:")
print("  Constructed wetlands: 90% pollutant removal at 10% cost")
print("  Phytoremediation: living plants clean contaminated sites")
print("  Aquaporin membranes: 5x more efficient than RO")
print()
print("The lotus connection:")
print("  - Lotus roots oxygenate surrounding water (aerenchyma)")
print("  - Lotus rhizome bacteria break down organic pollutants")
print("  - Lotus leaf runoff carries nutrients back to the pond")
print("  - A lotus pond is a self-cleaning ecosystem")
print()
print("From surface tension to capillary action to wetting to")
print("superhydrophobic surfaces to microfluidics to water treatment —")
print("the lotus has taught us fluid mechanics at every scale.")`,
      challenge: 'Design a water treatment system for a rural Indian village of 500 people. Budget: $50,000. Available land: 0.5 hectares. Which combination of technologies (conventional, wetland, membrane) gives the best result? Model the trade-offs.',
      successHint: 'From surface tension math to capillary action to wetting angles to superhydrophobic surfaces to microfluidics to water treatment — you\'ve built a complete fluid mechanics toolkit, all inspired by a plant that learned to float in a muddy pond.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 buoyancy and plant adaptation foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for fluid mechanics and materials science simulations. Click to start.</p>
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