import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PotterLevel2() {
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
      title: 'Phase diagrams — the map of material states',
      concept: `In Level 1, we saw that clay transforms through distinct phases during firing. A **phase diagram** is the map that shows which phase exists at any given temperature and composition. It's the most powerful tool in materials science.

For the SiO₂-Al₂O₃ system (the basis of all ceramics):
- Below ~1587°C: solid mullite + solid cristobalite (two separate crystals coexist)
- At 1587°C: eutectic point — the lowest melting temperature in the system. Here, a liquid phase first appears.
- Above 1587°C: increasing amounts of liquid. The liquid is a silicate melt (molten glass).
- At ~1890°C: pure alumina melts. At 1713°C: pure silica melts (cristobalite form).

The **eutectic** is crucial for potters: it's the temperature where liquid first forms. This liquid fills pores (vitrification), creating dense, waterproof stoneware and porcelain. Below the eutectic, the material remains porous (earthenware).

Phase diagrams also explain **glazing**: a glaze is a composition designed to melt entirely at the firing temperature, flowing over the surface. The body composition is designed to remain solid. The glaze and body must be chosen so the glaze melts but the body doesn't — both on the same phase diagram.`,
      analogy: 'A phase diagram is like a weather map for materials. Instead of temperature and pressure determining rain/snow/sunshine, temperature and composition determine solid/liquid/crystal type. Just as a weather map tells you "at 5°C with 80% humidity, expect fog," a phase diagram tells you "at 1200°C with 30% alumina, expect mullite crystals in a silicate liquid."',
      storyConnection: 'The little potter\'s father discovered empirically what phase diagrams explain theoretically: mixing rice husk ash (high silica) with clay (silica + alumina) and firing at 800°C produced a partly-melted glaze on a still-solid body. He had found a practical eutectic — the ash melted, the clay didn\'t. Two different compositions behaving differently at the same temperature.',
      checkQuestion: 'Why does adding flux (Na₂O) to a glaze lower its melting point, while the body clay without flux remains solid at the same temperature?',
      checkAnswer: 'Na₂O disrupts the SiO₂ network. Pure SiO₂ forms a strong 3D network of Si-O bonds — like a steel cage. Na₂O breaks some of these bonds (Na⁺ ions sit in holes in the network), weakening the structure. Fewer bonds to break = lower melting point. The body clay has no (or less) Na₂O, so its network remains intact and it stays solid. This is the fundamental principle of glass-making: network formers (SiO₂) + network modifiers (Na₂O) = glass at lower temperatures.',
      codeIntro: 'Plot a simplified SiO₂-Al₂O₃ phase diagram and mark the potter\'s working region.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified SiO2-Al2O3 binary phase diagram
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Phase diagram
ax1.set_facecolor('#111827')

al2o3 = np.linspace(0, 100, 200)

# Liquidus curves (simplified)
sio2_liq = 1713 - 2.3 * al2o3[al2o3 <= 5.5]
al2o3_liq = 1587 + 5.1 * (al2o3[al2o3 > 5.5] - 5.5)
al2o3_liq = np.minimum(al2o3_liq, 2072)

liquidus = np.concatenate([sio2_liq, al2o3_liq])

ax1.plot(al2o3, liquidus, color='#ef4444', linewidth=2, label='Liquidus')
ax1.fill_between(al2o3, liquidus, 2200, alpha=0.2, color='#ef4444')
ax1.fill_between(al2o3, 0, liquidus, alpha=0.1, color='#3b82f6')

ax1.text(50, 2000, 'ALL LIQUID', color='#ef4444', fontsize=12, ha='center')
ax1.text(50, 1200, 'SOLID\\n(mullite + cristobalite)', color='#3b82f6', fontsize=10, ha='center')

ax1.plot(5.5, 1587, '*', color='#f59e0b', markersize=15, zorder=5)
ax1.annotate('Eutectic\\n(1587°C, 5.5% Al₂O₃)', xy=(5.5, 1587), xytext=(25, 1500),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax1.axvline(60, color='#22c55e', linestyle='--', linewidth=1, alpha=0.5)
ax1.text(62, 800, 'Mullite\\n(3Al₂O₃·2SiO₂)', color='#22c55e', fontsize=8)

potter_rect = plt.Rectangle((10, 700), 25, 600, fill=False, edgecolor='#f59e0b',
                              linewidth=2, linestyle='--')
ax1.add_patch(potter_rect)
ax1.text(22, 650, 'Potter\'s zone', color='#f59e0b', fontsize=9, ha='center')

ax1.set_xlabel('Al₂O₃ content (%)', color='white')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('SiO₂-Al₂O₃ Phase Diagram (simplified)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 100)
ax1.set_ylim(600, 2200)

# Effect of flux on melting point
ax2.set_facecolor('#111827')

flux_pct = np.linspace(0, 30, 100)
melting_with_flux = 1587 - 25 * flux_pct + 0.2 * flux_pct**2

ax2.plot(flux_pct, melting_with_flux, color='#ef4444', linewidth=2, label='Eutectic temperature')
ax2.fill_between(flux_pct, melting_with_flux, 600, alpha=0.1, color='#3b82f6')
ax2.fill_between(flux_pct, melting_with_flux, 1700, alpha=0.1, color='#ef4444')

ax2.axhline(800, color='#f59e0b', linestyle=':', linewidth=1)
ax2.text(1, 810, 'Dhubri kiln (800°C)', color='#f59e0b', fontsize=8)

a_coef, b_coef, c_coef = 0.2, -25, 1587-800
discriminant = b_coef**2 - 4*a_coef*c_coef
flux_needed = (-b_coef - np.sqrt(discriminant)) / (2*a_coef)
ax2.plot(flux_needed, 800, 'o', color='#f59e0b', markersize=10, zorder=5)
ax2.annotate(f'Need {flux_needed:.0f}% flux', xy=(flux_needed, 800), xytext=(flux_needed+3, 900),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Na₂O flux content (%)', color='white')
ax2.set_ylabel('Eutectic temperature (°C)', color='white')
ax2.set_title('How Flux Lowers Melting Point', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_ylim(600, 1700)

plt.tight_layout()
plt.show()

print("Phase diagram key points:")
print(f"  Pure SiO₂ melts: 1713°C")
print(f"  Pure Al₂O₃ melts: 2072°C")
print(f"  Eutectic (minimum): 1587°C at 5.5% Al₂O₃")
print(f"  Mullite composition: 60% Al₂O₃")
print()
print(f"To melt a glaze at 800°C, need ~{flux_needed:.0f}% Na₂O flux")
print("Wood ash provides Na₂O, K₂O, and CaO as natural fluxes")`,
      challenge: 'The potter\'s rice husk ash is ~90% SiO₂ with ~5% K₂O (a flux). Wood ash is ~30% CaO + ~10% K₂O (more flux). By mixing these, he adjusts the effective flux content. If he uses 60% rice ash + 40% wood ash, what\'s the total flux percentage? Will this melt at 800°C?',
      successHint: 'Phase diagrams are the central tool of materials science. Every alloy (steel, bronze, solder), every ceramic, every glass is designed using phase diagrams. Understanding them gives you the power to predict material behavior from composition and temperature alone.',
    },
    {
      title: 'Thermal expansion — why pots crack in the kiln',
      concept: `The most heartbreaking moment for a potter: opening the kiln to find cracked pots. The culprit is usually **thermal expansion** — materials change size when heated or cooled.

The physics: when temperature increases, atoms vibrate more energetically, pushing their neighbours slightly farther away. The material expands. The expansion is characterized by the **coefficient of thermal expansion** (CTE, symbol α):

**ΔL = L₀ × α × ΔT**

Where ΔL is length change, L₀ is original length, α is the CTE, and ΔT is temperature change.

CTE values (×10⁻⁶ per °C):
- Quartz (crystalline SiO₂): 12.3 (but drops to 0.5 at 573°C — the quartz inversion!)
- Fused silica (amorphous SiO₂): 0.55 (extremely low — used in telescope mirrors)
- Alumina: 8.1
- Typical pottery clay body: 5-8
- Typical pottery glaze: 3-7

The **quartz inversion** at 573°C is a potter's nightmare: crystalline quartz undergoes a sudden 0.45% volume change. If heating or cooling is too fast at this temperature, the sudden expansion/contraction cracks the pot.`,
      analogy: 'Thermal expansion is like a crowd of people in a cold room vs. a hot room. In the cold room, everyone stands still and close together (small volume). In the hot room, everyone fidgets and spreads out (larger volume). The "coefficient of thermal expansion" is how much each person spreads out per degree of warming.',
      storyConnection: 'The little potter always heated his kiln slowly — "a fire that starts patient, ends kind," his father said. He especially lingered around 550-600°C, adding fuel bit by bit. He didn\'t know the words "quartz inversion," but he knew that rushing through that temperature range cracked his pots.',
      checkQuestion: 'A fired pot is accidentally placed in cold water straight from a hot kiln. It shatters. But a Pyrex glass baking dish can go from oven to cold water without breaking. Why the difference?',
      checkAnswer: 'Pyrex (borosilicate glass) has a very low CTE (~3.3 × 10⁻⁶/°C). The thermal shock from hot-to-cold creates small dimensional changes and therefore small stresses — below the glass\'s strength. Pottery has a higher CTE (~6 × 10⁻⁶/°C) AND is more brittle (lower fracture toughness). The same temperature change creates larger stresses in a material less able to withstand them.',
      codeIntro: 'Model thermal expansion, the quartz inversion, and thermal shock in ceramics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

temp = np.linspace(20, 1000, 500)

quartz_expansion = np.zeros_like(temp)
for i, t in enumerate(temp):
    if t < 573:
        quartz_expansion[i] = 12.3e-6 * (t - 20)
    else:
        quartz_expansion[i] = 12.3e-6 * (573 - 20) + 0.0045 + 0.5e-6 * (t - 573)

clay_expansion = 6.0e-6 * (temp - 20)
glaze_matched = 5.5e-6 * (temp - 20)
glaze_high = 8.0e-6 * (temp - 20)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(temp, quartz_expansion * 100, color='#ef4444', linewidth=2, label='Quartz (crystalline)')
ax1.plot(temp, clay_expansion * 100, color='#22c55e', linewidth=2, label='Clay body')
ax1.plot(temp, glaze_matched * 100, color='#3b82f6', linewidth=2, label='Matched glaze', linestyle='--')
ax1.plot(temp, glaze_high * 100, color='#f59e0b', linewidth=2, label='High-CTE glaze', linestyle='--')

ax1.axvline(573, color='#ef4444', linestyle=':', linewidth=1)
ax1.annotate('QUARTZ INVERSION\\n573°C (0.45% jump!)', xy=(573, 0.5), xytext=(650, 0.15),
            color='#ef4444', fontsize=9, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Linear expansion (%)', color='white')
ax1.set_title('Thermal Expansion of Ceramic Materials', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
materials = {
    'Dhubri earthenware': {'sigma': 20, 'E': 30, 'alpha': 6, 'color': '#f59e0b'},
    'Stoneware': {'sigma': 60, 'E': 70, 'alpha': 5.5, 'color': '#22c55e'},
    'Porcelain': {'sigma': 80, 'E': 80, 'alpha': 4, 'color': '#a855f7'},
    'Alumina ceramic': {'sigma': 300, 'E': 380, 'alpha': 8, 'color': '#ef4444'},
    'Fused silica': {'sigma': 50, 'E': 72, 'alpha': 0.55, 'color': '#3b82f6'},
    'Silicon carbide': {'sigma': 400, 'E': 410, 'alpha': 4.5, 'color': '#06b6d4'},
}

names_mat = list(materials.keys())
R_values = [materials[n]['sigma'] / (materials[n]['E'] * materials[n]['alpha'] * 1e-6) * 1e-3
            for n in names_mat]
colors_mat = [materials[n]['color'] for n in names_mat]

bars = ax2.barh(names_mat, R_values, color=colors_mat)
ax2.set_xlabel('Thermal shock resistance R (°C)', color='white')
ax2.set_title('Thermal Shock Resistance (higher = better)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, r in zip(bars, R_values):
    ax2.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
             f'{r:.0f}°C', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Thermal expansion coefficients (×10⁻⁶/°C):")
for name, props in materials.items():
    print(f"  {name}: α={props['alpha']}, σ={props['sigma']}MPa, E={props['E']}GPa → R={props['sigma']/(props['E']*props['alpha']*1e-6)*1e-3:.0f}°C")
print()
print("The quartz inversion at 573°C:")
print("  Volume change: 0.45% (instantaneous)")
print("  Heating rate through 573°C must be < 100°C/hour")`,
      challenge: 'A pot 30cm tall is heated from 20°C to 800°C. Calculate the total height change using CTE = 6×10⁻⁶/°C. Then calculate the mismatch between body and high-CTE glaze at 800°C.',
      successHint: 'Thermal expansion management is critical in engineering: bridge expansion joints, railway tracks, semiconductor chip packaging, and even telescope mirrors.',
    },
    {
      title: 'Thermal shock resistance — why teacups break and engine parts don\'t',
      concept: `Thermal shock is the rapid application of thermal stress — like pouring boiling water into a cold cup. Whether the material survives depends on the **thermal shock resistance parameter**:

**R = σf × k / (E × α)**

Where:
- σf = fracture strength (MPa)
- k = thermal conductivity (W/m·K)
- E = elastic modulus (GPa)
- α = coefficient of thermal expansion (1/°C)

High R materials survive rapid temperature changes. Strategies for improvement:
1. **Reduce α**: use low-expansion materials (fused silica, cordierite)
2. **Increase σf**: eliminate flaws
3. **Increase k**: helps by equalizing temperature quickly
4. **Reduce E**: more flexible = less stress
5. **Add porosity**: cracks stop at pores

The Dhubri potter's earthenware actually has decent thermal shock resistance — its porosity acts as crack-arrest points. Dense porcelain, paradoxically, is MORE susceptible to thermal shock because it has no porosity to stop cracks.`,
      analogy: 'Thermal shock is like suddenly stretching one side of a rubber band while holding the other side. If the rubber is flexible (low E), it absorbs the stretch. If it\'s thick enough (high σf), it doesn\'t break. If it can redistribute the stretch quickly (high k), the stress equalizes.',
      storyConnection: 'The little potter\'s cooking pots are placed directly over open flames — a brutal thermal shock environment. Yet they survive for months. The earthenware\'s porosity creates microscopic "crumple zones" that absorb crack energy. Dense porcelain would crack on the first use.',
      checkQuestion: 'Space shuttle tiles can withstand 1,260°C re-entry but break if you squeeze them. How can something that survives re-entry be so fragile?',
      checkAnswer: 'The tiles have extremely low thermal conductivity and extremely low CTE. Even though they\'re weak (low σf), the denominator of the R equation (E × α) is even smaller. They survive because they barely expand and barely conduct heat — the outer surface can be 1,260°C while the inner surface is only 177°C.',
      codeIntro: 'Simulate thermal shock: temperature distribution and stress in a pot wall during rapid heating.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wall_thickness = 0.008  # 8mm
n_points = 50
dx = wall_thickness / n_points
x = np.linspace(0, wall_thickness * 1000, n_points)  # mm

thermal_diffusivity = 5e-7
CTE = 6e-6
E_modulus = 30e9
strength = 20e6

T_initial = 20.0
T_hot = 200.0

dt = 0.4 * dx**2 / thermal_diffusivity
r = thermal_diffusivity * dt / dx**2
n_steps = int(60 / dt)

T = np.full(n_points, T_initial)
snapshots = []
times = [0, 1, 5, 15, 30, 60]
snapshot_indices = [int(t / dt) for t in times]

for step in range(n_steps + 1):
    if step in snapshot_indices:
        snapshots.append(T.copy())
    T_new = T.copy()
    for i in range(1, n_points - 1):
        T_new[i] = T[i] + r * (T[i+1] - 2*T[i] + T[i-1])
    T_new[0] = T_hot
    T_new[-1] = T_initial
    T = T_new

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
colors_time = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899']

for i, (snapshot, time_val) in enumerate(zip(snapshots, times)):
    ax1.plot(x, snapshot, linewidth=2, color=colors_time[i], label=f't = {time_val}s')

ax1.set_xlabel('Position through wall (mm, inner→outer)', color='white')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('Temperature Distribution During Thermal Shock', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
for i, (snapshot, time_val) in enumerate(zip(snapshots, times)):
    avg_T = np.mean(snapshot)
    stress = E_modulus * CTE * (snapshot - avg_T) / 1e6
    ax2.plot(x, stress, linewidth=2, color=colors_time[i], label=f't = {time_val}s')

ax2.axhline(strength / 1e6, color='white', linestyle=':', linewidth=1)
ax2.axhline(-strength / 1e6, color='white', linestyle=':', linewidth=1)
ax2.text(7, strength / 1e6 + 1, f'Tensile strength ({strength/1e6:.0f} MPa)', color='white', fontsize=8)

ax2.set_xlabel('Position through wall (mm, inner→outer)', color='white')
ax2.set_ylabel('Thermal stress (MPa)', color='white')
ax2.set_title('Stress Distribution (positive = tension)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

max_stress = 0
for snapshot in snapshots:
    avg_T = np.mean(snapshot)
    stress = E_modulus * CTE * (snapshot - avg_T)
    max_stress = max(max_stress, abs(stress.max()), abs(stress.min()))

print("Thermal shock analysis:")
print(f"  Wall thickness: {wall_thickness*1000:.0f} mm")
print(f"  Temperature change: {T_initial}°C → {T_hot}°C (ΔT = {T_hot-T_initial}°C)")
print(f"  Maximum thermal stress: {max_stress/1e6:.1f} MPa")
print(f"  Material strength: {strength/1e6:.0f} MPa")
print(f"  Safety factor: {strength/max_stress:.2f}")
if max_stress > strength:
    print("  FAILURE: pot will crack!")
else:
    print("  SAFE: pot survives this thermal shock")`,
      challenge: 'Double the wall thickness to 16mm and rerun. Does the pot still survive? Thicker walls create larger temperature gradients. This is why thin-walled pottery is actually more thermal-shock resistant.',
      successHint: 'Thermal shock analysis is critical in jet engine design, nuclear reactor design, and dental ceramics. The same equations govern all of them.',
    },
    {
      title: 'Modern ceramics — from semiconductors to superconductors',
      concept: `The little potter of Dhubri and a semiconductor engineer both work with ceramics — but at opposite ends of a vast spectrum. Modern advanced ceramics include:

**Structural ceramics**:
- **Silicon carbide (SiC)**: harder than steel, heat-resistant to 1600°C. Used in brake discs, armor.
- **Silicon nitride (Si₃N₄)**: tough, wear-resistant. Used in ball bearings, cutting tools.
- **Zirconia (ZrO₂)**: "transformation-toughened" — cracks trigger a phase change that compresses the crack tip. Used in dental crowns.

**Electronic ceramics**:
- **Silicon (Si)**: the foundation of all computer chips.
- **Barium titanate (BaTiO₃)**: piezoelectric — squeeze it and it generates voltage. Used in sonar, ultrasound.
- **YBCO**: superconductor below 93K. Zero electrical resistance.

**Bioceramics**:
- **Hydroxyapatite**: the mineral in bones and teeth. Synthetic version used for bone grafts.

All share the same fundamental chemistry as the potter's clay: metal-oxygen bonds, crystalline structure, processed through sintering.`,
      analogy: 'Traditional pottery and modern ceramics are like a log cabin and a skyscraper. Both are "buildings." Both use the same physics. But the skyscraper requires engineered materials, precision manufacturing, and sophisticated design.',
      storyConnection: 'The little potter\'s clay contains kaolinite — the same mineral family as the substrate in the phone you\'re reading this on. The silicon wafer in a chip is processed from quartz sand (SiO₂) — the same material in the potter\'s glaze.',
      checkQuestion: 'Why are ceramics used for cutting tools even though they\'re brittle?',
      checkAnswer: 'Ceramics have much higher hardness than metals (alumina: 2000 HV, steel: 600 HV). They maintain hardness at high temperatures. And they\'re chemically inert. The brittleness is managed by compressive loading, tough metal holders, and toughened ceramics.',
      codeIntro: 'Compare the properties of traditional and modern ceramics across multiple dimensions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

ceramics = {
    'Dhubri earthenware': {'hardness': 3, 'strength': 20, 'toughness': 1.5, 'temp_max': 800, 'cost': 0.1, 'color': '#f59e0b'},
    'Porcelain': {'hardness': 7, 'strength': 80, 'toughness': 2, 'temp_max': 1300, 'cost': 1, 'color': '#a855f7'},
    'Alumina (Al₂O₃)': {'hardness': 9, 'strength': 300, 'toughness': 4, 'temp_max': 1700, 'cost': 10, 'color': '#ef4444'},
    'Silicon carbide': {'hardness': 9.5, 'strength': 400, 'toughness': 4.5, 'temp_max': 1600, 'cost': 50, 'color': '#22c55e'},
    'Zirconia (tough)': {'hardness': 8, 'strength': 600, 'toughness': 12, 'temp_max': 1200, 'cost': 30, 'color': '#3b82f6'},
    'Silicon nitride': {'hardness': 8.5, 'strength': 700, 'toughness': 7, 'temp_max': 1400, 'cost': 80, 'color': '#06b6d4'},
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

names_c = list(ceramics.keys())
properties = ['hardness', 'strength', 'toughness', 'temp_max', 'cost']
prop_labels = ['Hardness', 'Strength', 'Toughness', 'Max Temp', 'Cost']
max_vals = {p: max(ceramics[n][p] for n in names_c) for p in properties}

ax = axes[0, 0]
ax.set_facecolor('#111827')
x_pos = np.arange(len(properties))
width = 0.12
for i, name in enumerate(names_c):
    normalized = [ceramics[name][p] / max_vals[p] for p in properties]
    ax.bar(x_pos + i * width, normalized, width, color=ceramics[name]['color'], label=name, alpha=0.8)
ax.set_xticks(x_pos + width * len(names_c) / 2)
ax.set_xticklabels(prop_labels, color='white', fontsize=8)
ax.set_ylabel('Normalized value', color='white')
ax.set_title('Property Comparison', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=6, ncol=2)
ax.tick_params(colors='gray')

ax = axes[0, 1]
ax.set_facecolor('#111827')
for name in names_c:
    ax.scatter(ceramics[name]['toughness'], ceramics[name]['strength'],
              s=ceramics[name]['hardness'] * 30, c=ceramics[name]['color'],
              alpha=0.8, edgecolors='white', linewidths=1, zorder=3)
    ax.annotate(name.split('(')[0].strip(), (ceramics[name]['toughness'], ceramics[name]['strength']),
               xytext=(5, 5), textcoords='offset points', color=ceramics[name]['color'], fontsize=7)
ax.set_xlabel('Fracture toughness (MPa·√m)', color='white')
ax.set_ylabel('Flexural strength (MPa)', color='white')
ax.set_title('Strength vs Toughness (size = hardness)', color='white', fontsize=11)
ax.tick_params(colors='gray')

ax = axes[1, 0]
ax.set_facecolor('#111827')
innovations = [
    (-8000, 'Unfired pottery', '#8B7355'),
    (-5000, 'Kiln-fired earthenware', '#f59e0b'),
    (-3000, 'Glazed ceramics', '#a855f7'),
    (-1500, 'Porcelain (China)', '#ef4444'),
    (1900, 'Technical alumina', '#22c55e'),
    (1960, 'Silicon IC chips', '#3b82f6'),
    (1980, 'Toughened zirconia', '#06b6d4'),
    (1987, 'YBCO superconductor', '#ec4899'),
    (2010, '3D-printed ceramics', '#f59e0b'),
]
years_inn = [i[0] for i in innovations]
labels_inn = [i[1] for i in innovations]
colors_inn = [i[2] for i in innovations]
ax.scatter(years_inn, range(len(years_inn)), c=colors_inn, s=80, zorder=5)
for i, (year, label, color) in enumerate(innovations):
    year_str = f'{abs(year)} {"BCE" if year < 0 else "CE"}'
    ax.text(year + 100, i, f'{label} ({year_str})', color=color, fontsize=8, va='center')
ax.set_xlabel('Year', color='white')
ax.set_title('10,000 Years of Ceramic Innovation', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_yticks([])

ax = axes[1, 1]
ax.set_facecolor('#111827')
domains = {'Traditional pottery': 5, 'Construction': 15, 'Electronics': 35, 'Automotive': 15, 'Medical': 10, 'Aerospace': 10, 'Energy': 10}
ax.pie(list(domains.values()), labels=list(domains.keys()),
       colors=['#f59e0b', '#8B7355', '#3b82f6', '#ef4444', '#22c55e', '#a855f7', '#06b6d4'],
       autopct='%1.0f%%', textprops={'color': 'white', 'fontsize': 8}, pctdistance=0.8)
ax.set_title('Global Ceramics Market by Sector', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Ceramics: from Dhubri to Silicon Valley")
print()
for name in names_c:
    c = ceramics[name]
    print(f"  {name}: H={c['hardness']}/10, σ={c['strength']}MPa, KIc={c['toughness']}MPa·√m, Tmax={c['temp_max']}°C")
print()
print("Electronics ceramics = 35% of the $300B global ceramics market.")`,
      challenge: 'Zirconia\'s toughness (12 MPa·m^0.5) is 8× the earthenware\'s. This is "transformation toughening" — stress triggers a crystal phase change (tetragonal → monoclinic, 4% volume increase) that compresses crack tips. Research this mechanism.',
      successHint: 'The progression from earthenware to modern ceramics mirrors the progression of human civilization — from survival technology to information technology, all based on the same Si-O-Al chemistry.',
    },
    {
      title: '3D printing with clay — digital pottery',
      concept: `The potter's wheel is 6,500 years old. Now, **3D printing** (additive manufacturing) of ceramics builds any shape layer by layer from a computer model.

How it works:
1. **Design**: create a 3D model in CAD software
2. **Slicing**: divide model into thin layers (0.5-2mm)
3. **Printing**: paste extruder deposits clay through a nozzle, layer by layer
4. **Drying**: same physics as traditional pottery
5. **Firing**: same chemistry as traditional pottery

The key difference: the computer controls the nozzle path, enabling shapes impossible on a wheel — internal channels, lattice structures, interlocking parts.

Current capabilities:
- Resolution: ~0.5mm minimum feature size
- Speed: slower than wheel-throwing for simple shapes, faster for complex ones
- Surface finish: visible layer lines (can be smoothed)
- Strength: comparable to traditionally formed ceramics after firing`,
      analogy: '3D printing clay is like writing with a very thick pen in three dimensions. Each "stroke" is a line of extruded clay. The computer writes one layer, then raises the pen slightly and writes the next layer on top.',
      storyConnection: 'Imagine the little potter with a clay 3D printer. He could reproduce his grandfather\'s best pot exactly — scanning the original and printing copies. He could create water filters with internal channels no wheel could produce. His understanding of clay, firing, and glazing is still essential — the printer just changes how the clay is shaped.',
      checkQuestion: 'A 3D-printed ceramic lattice structure is lighter than solid ceramic but can be just as strong per unit weight. Why?',
      checkAnswer: 'Lattice structures distribute loads through geometry rather than material mass. A solid beam has most material in the center contributing little (stress is highest at surfaces). A lattice puts material only where needed. This is why bones are not solid — they have dense cortex and spongy trabecular interior.',
      codeIntro: 'Simulate a 3D printing toolpath for a ceramic vase and calculate material usage.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure(figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

ax1 = fig.add_subplot(121, projection='3d')
ax1.set_facecolor('#111827')

n_layers = 60
layer_height = 1.5
heights = np.arange(n_layers) * layer_height

radii = 30 + 15 * np.sin(heights / 90 * 2 * np.pi) + 5 * np.cos(heights / 30 * np.pi)
radii = np.maximum(radii, 15)

points_per_layer = 100
all_x, all_y, all_z = [], [], []

for i, (h, r) in enumerate(zip(heights, radii)):
    theta = np.linspace(0, 2*np.pi, points_per_layer)
    all_x.extend(r * np.cos(theta))
    all_y.extend(r * np.sin(theta))
    all_z.extend(np.full_like(theta, h))

all_z_arr = np.array(all_z)
colors_z = plt.cm.viridis(all_z_arr / all_z_arr.max())

for i in range(0, len(all_x) - 1, 5):
    ax1.plot(all_x[i:i+6], all_y[i:i+6], all_z[i:i+6], color=colors_z[i], linewidth=0.5)

ax1.set_xlabel('X (mm)', color='white', fontsize=8)
ax1.set_ylabel('Y (mm)', color='white', fontsize=8)
ax1.set_zlabel('Z (mm)', color='white', fontsize=8)
ax1.set_title('3D Print Toolpath: Ceramic Vase', color='white', fontsize=11)
ax1.tick_params(colors='gray')

ax2 = fig.add_subplot(122)
ax2.set_facecolor('#111827')

nozzle_width = 2
circumferences = 2 * np.pi * radii
volume_per_layer = circumferences * nozzle_width * layer_height
cumulative_volume = np.cumsum(volume_per_layer)

print_speed = 10
time_per_layer = circumferences / print_speed
cumulative_time = np.cumsum(time_per_layer) / 60

ax2.plot(heights, cumulative_volume / 1000, color='#22c55e', linewidth=2, label='Volume (cm³)')
ax2_twin = ax2.twinx()
ax2_twin.plot(heights, cumulative_time, color='#f59e0b', linewidth=2, label='Print time (min)')

ax2.set_xlabel('Height (mm)', color='white')
ax2.set_ylabel('Cumulative volume (cm³)', color='#22c55e')
ax2_twin.set_ylabel('Cumulative time (minutes)', color='#f59e0b')
ax2.set_title('Material Usage & Print Time', color='white', fontsize=11)

lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

ax2.tick_params(axis='y', colors='#22c55e')
ax2_twin.tick_params(axis='y', colors='#f59e0b')
ax2.tick_params(axis='x', colors='gray')

plt.tight_layout()
plt.show()

total_volume = cumulative_volume[-1]
total_time = cumulative_time[-1]
clay_density = 1.8

print("3D Printed Vase Statistics:")
print(f"  Height: {heights[-1]:.0f} mm, Layers: {n_layers}")
print(f"  Clay volume: {total_volume/1000:.1f} cm³, Mass: {total_volume/1000 * clay_density:.0f} g")
print(f"  Print time: {total_time:.0f} minutes")
print(f"  Hand-thrown: ~5 min (but needs years of training)")`,
      challenge: 'Modify the vase profile to create a double-walled vessel with an air gap. This is impossible on a wheel but trivial for a 3D printer. Calculate the air gap\'s insulating effect.',
      successHint: 'Digital fabrication is transforming every manufacturing industry. The fundamental principles of materials science remain unchanged. Only the tools evolve.',
    },
    {
      title: 'Composite materials — mixing for strength',
      concept: `The little potter sometimes adds rice straw or sand to his clay. He's making a **composite material** — two or more constituent materials with different properties that, when combined, produce properties superior to either alone.

Natural composites: bone (hydroxyapatite + collagen), wood (cellulose + lignin), nacre (aragonite + protein — 3,000× tougher than pure aragonite).

Engineered composites: fibre-reinforced concrete, CFRP (carbon fibre + epoxy), ceramic matrix composites (CMC) for jet engines.

The potter's straw-in-clay works because clay shrinks during drying (creating cracks), and straw fibres bridge those cracks. The straw also creates channels for steam escape during firing.

The key equation: **Rule of Mixtures**: E_composite = V_f × E_fibre + V_m × E_matrix`,
      analogy: 'A composite is like a team where each member covers the other\'s weakness. Clay is strong in compression but cracks easily. Straw is flexible but can\'t bear loads alone. Together, they make a material that can bear loads AND resist cracking.',
      storyConnection: 'The little potter mixes sand for cooking pots (thermal shock resistance) and straw for storage vessels (drying crack prevention). His grandmother mixed horsehair into fine clay for thin-walled bowls. "Clay alone is clay," she said. "Clay with friends is pottery."',
      checkQuestion: 'CFRP is stronger than steel but lighter than aluminum. Why isn\'t everything made of CFRP?',
      checkAnswer: 'Cost (10-20× steel), anisotropy (weak perpendicular to fibres), repairability (can\'t weld it), recyclability (thermoset matrix can\'t be reformed), and brittleness (fails suddenly without warning).',
      codeIntro: 'Model composite properties using the Rule of Mixtures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

composites = {
    'Clay + straw': {
        'matrix': {'name': 'Clay', 'E': 5, 'strength': 15},
        'fibre': {'name': 'Rice straw', 'E': 30, 'strength': 80},
    },
    'Clay + sand': {
        'matrix': {'name': 'Clay', 'E': 5, 'strength': 15},
        'fibre': {'name': 'Sand', 'E': 70, 'strength': 50},
    },
    'CFRP': {
        'matrix': {'name': 'Epoxy', 'E': 3.5, 'strength': 80},
        'fibre': {'name': 'Carbon fibre', 'E': 230, 'strength': 3500},
    },
    'CMC': {
        'matrix': {'name': 'SiC matrix', 'E': 400, 'strength': 200},
        'fibre': {'name': 'SiC fibre', 'E': 380, 'strength': 3000},
    },
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
vf = np.linspace(0, 0.7, 100)
colors_comp = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444']

for (name, comp), color in zip(composites.items(), colors_comp):
    E_composite = vf * comp['fibre']['E'] + (1 - vf) * comp['matrix']['E']
    ax1.plot(vf * 100, E_composite, linewidth=2, color=color, label=name)
    typical_vf = 0.05 if 'Clay' in name else 0.6
    E_typical = typical_vf * comp['fibre']['E'] + (1 - typical_vf) * comp['matrix']['E']
    ax1.plot(typical_vf * 100, E_typical, 'o', color=color, markersize=8)

ax1.set_xlabel('Fibre volume fraction (%)', color='white')
ax1.set_ylabel('Composite stiffness E (GPa)', color='white')
ax1.set_title('Rule of Mixtures: Stiffness', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
materials_ashby = {
    'Clay': {'E': 5, 'sigma': 15, 'color': '#8B7355', 'size': 100},
    'Clay+straw': {'E': 6.25, 'sigma': 20, 'color': '#f59e0b', 'size': 120},
    'Porcelain': {'E': 70, 'sigma': 80, 'color': '#a855f7', 'size': 100},
    'CFRP (60%)': {'E': 140, 'sigma': 1500, 'color': '#3b82f6', 'size': 150},
    'CMC': {'E': 390, 'sigma': 500, 'color': '#ef4444', 'size': 150},
    'Steel': {'E': 200, 'sigma': 400, 'color': '#999999', 'size': 100},
    'Wood': {'E': 12, 'sigma': 50, 'color': '#6B8E23', 'size': 100},
}

for name, props in materials_ashby.items():
    ax2.scatter(props['E'], props['sigma'], s=props['size'], c=props['color'],
               alpha=0.8, edgecolors='white', linewidths=1, zorder=3)
    ax2.annotate(name, (props['E'], props['sigma']), xytext=(5, 5),
                textcoords='offset points', color=props['color'], fontsize=7)

ax2.set_xscale('log')
ax2.set_yscale('log')
ax2.set_xlabel('Stiffness E (GPa)', color='white')
ax2.set_ylabel('Strength σ (MPa)', color='white')
ax2.set_title('Ashby Chart: Stiffness vs Strength', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.grid(True, alpha=0.1, which='both')

plt.tight_layout()
plt.show()

print("Composite properties (Rule of Mixtures):")
for name, comp in composites.items():
    typical_vf = 0.05 if 'Clay' in name else 0.6
    E_comp = typical_vf * comp['fibre']['E'] + (1 - typical_vf) * comp['matrix']['E']
    print(f"  {name} (Vf={typical_vf*100:.0f}%): E={E_comp:.1f} GPa ({E_comp/comp['matrix']['E']:.1f}× matrix)")
print()
print("The potter's 5% straw increases stiffness by 25%.")
print("CFRP at 60% carbon fibre increases stiffness by 40×.")`,
      challenge: 'The potter adds 15% sand (E=70 GPa, toughness 0.5 MPa·m^0.5). Calculate composite stiffness. Explain why the pot becomes stiffer but might not become tougher — the Rule of Mixtures doesn\'t apply simply to toughness.',
      successHint: 'Composite materials are everywhere: concrete, plywood, fiberglass, bone, teeth. The potter who mixes straw into clay is applying the same principle engineers use to design aircraft wings. The rule of mixtures is one of the most useful equations in materials science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Materials Engineering — builds on Level 1 concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for materials engineering simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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