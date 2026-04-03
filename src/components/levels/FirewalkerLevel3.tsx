import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FirewalkerLevel3() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: 'Thermal conductivity & heat transfer modes',
      concept: `Heat moves through three mechanisms: **conduction**, **convection**, and **radiation**. When a firewalker steps on hot coals, all three are at play, but conduction is the dominant concern — it is the direct transfer of thermal energy from the coal surface to the skin of the foot through physical contact.

**Fourier's law of heat conduction** states: q = -k * dT/dx, where q is the heat flux (W/m^2), k is the thermal conductivity (W/(m.K)), and dT/dx is the temperature gradient. The key insight for firewalking is that different materials have vastly different thermal conductivities. Metals like iron have k = 80 W/(m.K) — they transfer heat rapidly. Wood charcoal (the material of hot coals) has k = 0.1-0.2 W/(m.K) — roughly 400-800 times less conductive than iron.

This is why firewalking on charcoal is survivable but walking on a hot iron plate would cause instant severe burns. The coal surface might be at 600°C, but its low conductivity means heat flows into the foot slowly. The skin surface might only receive enough energy to raise its temperature by a few degrees during a brief step. The total **heat energy transferred** is Q = k * A * deltaT * t / L, where A is the contact area, deltaT is the temperature difference, t is the contact time, and L is the thickness of the coal layer.

The foot itself has defenses: the callused sole has lower thermal conductivity than normal skin, moisture on the skin can provide evaporative cooling, and the blood circulation acts as a convective heat sink, carrying heat away from the contact surface.`,
      analogy: 'Think of thermal conductivity like water flow through pipes of different widths. A metal is a wide-open fire hose — heat rushes through. Wood charcoal is like a garden soaker hose — heat trickles through slowly. Both are connected to the same "water pressure" (temperature), but the flow rate is completely different. This is why you can briefly touch a 200°C wooden spoon handle but not a 200°C metal pot.',
      storyConnection: 'In the firewalker story, the protagonist walks across a bed of glowing coals. The physics explains why this ancient practice works: the coals are hot but are terrible conductors. The firewalker is not immune to heat — they are exploiting a material property that limits heat transfer to a survivable rate during the brief contact time of each step.',
      checkQuestion: 'A firewalker\'s foot (area 0.015 m^2) contacts a coal at 600°C for 0.5 seconds. If the coal\'s conductivity is 0.15 W/(m.K) and the effective coal thickness is 0.02 m, how much heat is transferred? (Skin temperature = 35°C)',
      checkAnswer: 'Q = k * A * deltaT * t / L = 0.15 * 0.015 * (600 - 35) * 0.5 / 0.02 = 0.15 * 0.015 * 565 * 25 = 31.8 J. To raise 1 cm^3 of skin by 1°C requires about 3.7 J (specific heat of tissue is ~3700 J/(kg.K)). So 31.8 J would raise about 8.6 cm^3 of skin tissue by 1°C — uncomfortable but not dangerous. Walking on iron at the same temperature: Q = 80 * 0.015 * 565 * 25 = 16,950 J — catastrophic burns.',
      codeIntro: 'Model heat transfer from hot coals to a foot, comparing different materials and contact times.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Heat Transfer During Firewalking ---

# Material thermal properties
materials = {
    'Wood charcoal': {'k': 0.15, 'color': '#f59e0b'},
    'Hot sand':       {'k': 0.30, 'color': '#a855f7'},
    'Brick':          {'k': 0.80, 'color': '#ef4444'},
    'Concrete':       {'k': 1.70, 'color': '#ec4899'},
    'Cast iron':      {'k': 52.0, 'color': '#6b7280'},
    'Copper':         {'k': 385.0, 'color': '#f97316'},
}

T_surface = 600  # °C (coal surface)
T_skin = 35      # °C
delta_T = T_surface - T_skin
A_foot = 0.015   # m^2 (contact area of forefoot)
L_material = 0.02  # m (effective thickness)
contact_times = np.linspace(0.01, 2.0, 200)

# Burn thresholds (energy to raise tissue temperature)
# Tissue: rho = 1050 kg/m^3, c = 3700 J/(kg.K), depth = 0.001 m
skin_mass = 1050 * A_foot * 0.001  # kg (1mm deep layer)
skin_c = 3700  # J/(kg.K)
pain_threshold = skin_mass * skin_c * 8  # 8°C rise = pain
burn_threshold = skin_mass * skin_c * 30  # 30°C rise = burn (T_skin -> 65°C)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Heat Transfer Physics of Firewalking',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Heat energy vs time for each material
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in materials.items():
    Q = props['k'] * A_foot * delta_T * contact_times / L_material
    ax.plot(contact_times, Q, color=props['color'], linewidth=2, label=name)
ax.axhline(pain_threshold, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.axhline(burn_threshold, color='#ef4444', linewidth=1, linestyle='--', alpha=0.5)
ax.text(1.5, pain_threshold * 1.1, 'Pain threshold', color='white', fontsize=8)
ax.text(1.5, burn_threshold * 1.1, 'Burn threshold', color='#ef4444', fontsize=8)
ax.set_xlabel('Contact time (s)', color='white')
ax.set_ylabel('Heat transferred (J)', color='white')
ax.set_title('Heat transfer vs contact time by material', color='white')
ax.set_yscale('log')
ax.legend(fontsize=7, loc='upper left')

# Panel 2: Safe contact time for each material
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
safe_times_pain = []
safe_times_burn = []
mat_names = []
for name, props in materials.items():
    # Time to reach pain threshold: Q = k*A*dT*t/L => t = Q*L/(k*A*dT)
    t_pain = pain_threshold * L_material / (props['k'] * A_foot * delta_T)
    t_burn = burn_threshold * L_material / (props['k'] * A_foot * delta_T)
    safe_times_pain.append(min(t_pain, 10))
    safe_times_burn.append(min(t_burn, 10))
    mat_names.append(name)

x = np.arange(len(mat_names))
bars1 = ax.bar(x - 0.2, safe_times_pain, 0.35, color='#f59e0b', alpha=0.8, label='Time to pain')
bars2 = ax.bar(x + 0.2, safe_times_burn, 0.35, color='#ef4444', alpha=0.8, label='Time to burn')
ax.set_xticks(x)
ax.set_xticklabels(mat_names, rotation=45, ha='right', fontsize=8, color='white')
ax.set_ylabel('Time (seconds)', color='white')
ax.set_title('Safe contact time at 600°C', color='white')
ax.legend(fontsize=9)
ax.set_yscale('log')

# Panel 3: Temperature profile through coal thickness
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
x_coal = np.linspace(0, L_material * 100, 100)  # cm
for t_contact, color, label in [(0.1, '#22c55e', '0.1s'), (0.5, '#f59e0b', '0.5s'),
                                  (1.0, '#ef4444', '1.0s')]:
    # Approximate: linear temperature drop for thin layer
    # More accurately: T(x,t) involves error function for semi-infinite solid
    alpha_coal = 0.15 / (400 * 800)  # thermal diffusivity = k/(rho*c)
    xi = x_coal / 100 / (2 * np.sqrt(alpha_coal * max(t_contact, 0.001)))
    T_profile = T_skin + delta_T * (1 - np.clip(xi / max(xi.max(), 1), 0, 1))
    ax.plot(x_coal, T_profile, color=color, linewidth=2, label=f't = {label}')
ax.set_xlabel('Depth into coal (cm)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Temperature profile in coal layer', color='white')
ax.legend(fontsize=9)

# Panel 4: Conductivity comparison (bar chart)
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names = list(materials.keys())
k_values = [materials[n]['k'] for n in names]
colors = [materials[n]['color'] for n in names]
bars = ax.barh(names, k_values, color=colors, alpha=0.8)
ax.set_xlabel('Thermal conductivity k (W/(m·K))', color='white')
ax.set_title('Why material matters: conductivity spans 2500x', color='white')
ax.set_xscale('log')
for bar, k in zip(bars, k_values):
    ax.text(bar.get_width() * 1.1, bar.get_y() + bar.get_height()/2,
            f'{k:.1f}', color='white', fontsize=9, va='center')

plt.tight_layout()
plt.show()

print("Firewalking heat transfer analysis:")
print(f"  Coal temperature: {T_surface}°C | Skin temperature: {T_skin}°C")
print(f"  Contact area: {A_foot*10000:.0f} cm²")
print(f"  Pain threshold: {pain_threshold:.1f} J | Burn threshold: {burn_threshold:.1f} J")
print()
for name, props in materials.items():
    t_burn = burn_threshold * L_material / (props['k'] * A_foot * delta_T)
    print(f"  {name}: k = {props['k']:.2f} W/(m·K) | burn in {t_burn:.3f} s")`,
      challenge: 'Add moisture effects: if the foot has a thin layer of sweat (0.1 mm, latent heat of vaporization = 2260 kJ/kg), how much additional energy is absorbed before the skin starts heating? Calculate the effective "bonus time" this gives the firewalker.',
      successHint: 'Thermal conductivity is the single most important physics concept in firewalking. The difference between coal (k = 0.15) and iron (k = 52) is why one is a cultural practice and the other would be a trip to the hospital.',
    },
    {
      title: 'The Leidenfrost effect',
      concept: `The **Leidenfrost effect** occurs when a liquid contacts a surface significantly hotter than its boiling point. Instead of boiling away rapidly on contact, the liquid forms a thin vapor layer that insulates it from the hot surface, causing droplets to "dance" and persist far longer than expected.

The critical temperature is the **Leidenfrost point** — for water on a clean metal surface, this is approximately 200-300°C (depending on the surface material and texture). Below this temperature, water boils violently on contact (nucleate boiling, very rapid heat transfer). Above it, the vapor cushion forms and heat transfer actually *decreases* — a counterintuitive result.

For firewalking, the Leidenfrost effect is debated but potentially relevant. If the foot is slightly moist (from sweat or deliberate wetting), and the coal surface exceeds the Leidenfrost temperature, a thin steam cushion could form between foot and coal, dramatically reducing conductive heat transfer. The vapor layer has a thermal conductivity of only k = 0.025 W/(m.K) — even lower than the coal itself — creating an additional insulating barrier.

The physics of the Leidenfrost layer can be described by the Stefan problem: a moving boundary between liquid and vapor, governed by the balance between heat conduction through the vapor layer and the rate of evaporation at the liquid-vapor interface. The equilibrium vapor layer thickness is typically 10-100 micrometers — thinner than a human hair but sufficient to reduce heat transfer by an order of magnitude.`,
      analogy: 'The Leidenfrost effect is like an air hockey puck floating on its cushion of air. The puck (water droplet or moist foot) never actually touches the table (hot surface) because the air cushion (steam layer) holds it up. The "air" in this case is steam generated by the very heat the cushion is protecting against — a beautiful self-regulating feedback loop.',
      storyConnection: 'Some traditions of firewalking involve wetting the feet beforehand, or walking immediately after rain. The Leidenfrost effect provides a scientific explanation: the moisture creates a protective steam barrier. The firewalker story hints at this when the protagonist notices that morning dew makes the coal walk easier — an empirical observation of the Leidenfrost effect.',
      checkQuestion: 'A water droplet on a 400°C surface has a Leidenfrost vapor layer 50 micrometers thick. What is the heat flux through this steam layer? (k_steam = 0.025 W/(m.K), water boils at 100°C)',
      checkAnswer: 'Heat flux q = k * deltaT / L = 0.025 * (400 - 100) / (50 x 10^-6) = 0.025 * 300 / 0.00005 = 150,000 W/m^2. This sounds enormous, but compare to nucleate boiling (direct contact) which can reach 1,000,000 W/m^2. The Leidenfrost layer reduces heat transfer by 85%. For a 1 cm^2 droplet area, that is 15 W vs 100 W — the difference between a droplet lasting 2 seconds and evaporating in 0.3 seconds.',
      codeIntro: 'Model the Leidenfrost effect: plot heat transfer rate vs surface temperature showing the dramatic dip above the Leidenfrost point.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- The Leidenfrost Effect ---

# Boiling curve: heat flux vs surface temperature
T_surface = np.linspace(100, 600, 500)
T_sat = 100  # boiling point of water
delta_T = T_surface - T_sat

# Approximate boiling regimes
def boiling_curve(dT):
    """Approximate heat flux through water boiling regimes."""
    q = np.zeros_like(dT)
    for i, dt in enumerate(dT):
        if dt < 5:
            # Natural convection
            q[i] = 500 * dt**1.25
        elif dt < 30:
            # Nucleate boiling (steep increase)
            q[i] = 1000 * dt**3 / 30**2
        elif dt < 120:
            # Transition boiling (decreasing — partial film)
            q_max = 1000 * 30**3 / 30**2  # critical heat flux
            q_min = q_max * 0.1
            frac = (dt - 30) / (120 - 30)
            q[i] = q_max * (1 - frac) + q_min * frac
        else:
            # Film boiling (Leidenfrost — low, slowly increasing due to radiation)
            q_min = 1000 * 30**3 / 30**2 * 0.1
            q[i] = q_min * (1 + 0.002 * (dt - 120))
    return q

heat_flux = boiling_curve(delta_T)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('The Leidenfrost Effect: Counterintuitive Heat Transfer',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Boiling curve
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(T_surface, heat_flux, color='#f59e0b', linewidth=2.5)
ax.set_xlabel('Surface temperature (°C)', color='white')
ax.set_ylabel('Heat flux (W/m²)', color='white')
ax.set_title('Boiling curve: 4 regimes of heat transfer', color='white')
# Annotate regimes
ax.annotate('Natural\\nconvection', xy=(108, 2000), color='#22c55e', fontsize=9)
ax.annotate('Nucleate\\nboiling\\n(max heat\\ntransfer)', xy=(120, heat_flux.max()*0.7),
            color='#3b82f6', fontsize=9)
ax.annotate('Transition', xy=(180, heat_flux.max()*0.4), color='#a855f7', fontsize=9)
ax.annotate('LEIDENFROST\\n(film boiling)\\nLOW heat transfer!',
            xy=(350, heat_flux.min()*2), color='#ef4444', fontsize=9, fontweight='bold')
# Mark Leidenfrost point
leidenfrost_idx = np.argmin(heat_flux[200:]) + 200
ax.scatter([T_surface[leidenfrost_idx]], [heat_flux[leidenfrost_idx]],
           color='#ef4444', s=100, zorder=10)
ax.annotate('Leidenfrost\\npoint', (T_surface[leidenfrost_idx], heat_flux[leidenfrost_idx]),
            textcoords="offset points", xytext=(20, 20), color='#ef4444',
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Panel 2: Vapor layer thickness vs temperature
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
T_leid = np.linspace(220, 600, 100)
k_vapor = 0.025  # W/(m.K) for steam
# Equilibrium layer thickness: increases with temperature
# delta = k_vapor * (T - 100) / q_film
q_film = heat_flux[leidenfrost_idx]  # approximately constant
layer_thickness = k_vapor * (T_leid - 100) / max(q_film, 1) * 1e6  # micrometers
ax.plot(T_leid, layer_thickness, color='#3b82f6', linewidth=2.5)
ax.set_xlabel('Surface temperature (°C)', color='white')
ax.set_ylabel('Vapor layer thickness (μm)', color='white')
ax.set_title('Steam cushion thickness in Leidenfrost regime', color='white')
ax.axhline(100, color='gray', linewidth=1, linestyle='--', alpha=0.5)
ax.text(400, 105, 'Human hair diameter (~100 μm)', color='gray', fontsize=8)

# Panel 3: Droplet lifetime vs surface temperature
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
T_range = np.linspace(100, 500, 200)
# Approximate droplet lifetime (1 mL droplet)
droplet_mass = 0.001  # kg
L_vap = 2260e3  # J/kg (latent heat of vaporization)
droplet_area = 0.0001  # m^2 (1 cm^2 contact area)
lifetimes = []
for T in T_range:
    dT = T - T_sat
    if dT < 1:
        lifetimes.append(100)
    else:
        q = boiling_curve(np.array([dT]))[0]
        if q > 0:
            evap_rate = q * droplet_area / L_vap  # kg/s
            lifetimes.append(droplet_mass / max(evap_rate, 1e-10))
        else:
            lifetimes.append(100)

ax.plot(T_range, lifetimes, color='#22c55e', linewidth=2.5)
ax.set_xlabel('Surface temperature (°C)', color='white')
ax.set_ylabel('Droplet lifetime (s)', color='white')
ax.set_title('Water droplet lifetime (1 mL on surface)', color='white')
ax.set_ylim(0, min(max(lifetimes), 60))
ax.axvline(220, color='#ef4444', linewidth=1.5, linestyle='--', alpha=0.7)
ax.text(230, max(lifetimes)*0.8, 'Leidenfrost point\\n(droplet "dances")',
        color='#ef4444', fontsize=9)

# Panel 4: Application to firewalking — heat transfer with and without Leidenfrost
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
contact_times = np.linspace(0, 1.0, 100)
k_coal = 0.15
k_steam = 0.025
A = 0.015
dT_coal = 565  # 600 - 35
L_coal = 0.02
L_steam = 50e-6  # 50 micrometer vapor layer

# Without Leidenfrost (direct contact)
Q_direct = k_coal * A * dT_coal * contact_times / L_coal

# With Leidenfrost (series resistance: coal + steam layer)
# R_total = R_coal + R_steam = L_coal/(k_coal*A) + L_steam/(k_steam*A)
R_coal = L_coal / (k_coal * A)
R_steam = L_steam / (k_steam * A)
Q_leidenfrost = dT_coal * contact_times / (R_coal + R_steam)

# Burn threshold
burn_threshold = 1050 * A * 0.001 * 3700 * 30

ax.plot(contact_times, Q_direct, color='#ef4444', linewidth=2.5, label='Direct contact (dry foot)')
ax.plot(contact_times, Q_leidenfrost, color='#22c55e', linewidth=2.5, label='With Leidenfrost (moist foot)')
ax.axhline(burn_threshold, color='white', linewidth=1.5, linestyle='--', alpha=0.7)
ax.text(0.6, burn_threshold * 1.1, f'Burn threshold ({burn_threshold:.0f} J)', color='white', fontsize=9)
ax.set_xlabel('Contact time (s)', color='white')
ax.set_ylabel('Heat transferred (J)', color='white')
ax.set_title('Firewalking: Leidenfrost protection', color='white')
ax.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Leidenfrost effect analysis:")
print(f"  Leidenfrost temperature: ~220°C for water on coal")
print(f"  Vapor layer conductivity: {k_steam} W/(m·K)")
print(f"  Direct contact: burn in {burn_threshold * L_coal / (k_coal * A * dT_coal):.3f} s")
print(f"  With Leidenfrost: burn in {burn_threshold * (R_coal + R_steam) / dT_coal:.3f} s")
print(f"  Protection factor: {(R_coal + R_steam) / R_coal:.2f}x longer safe time")`,
      challenge: 'Model how the Leidenfrost vapor layer collapses if the surface temperature drops below the Leidenfrost point (e.g., when the coal starts to cool). Plot the transition from film boiling to nucleate boiling and show the sudden spike in heat transfer that occurs — explaining why lingering on cooling coals is more dangerous than walking on very hot ones.',
      successHint: 'The Leidenfrost effect is one of the most counterintuitive phenomena in thermal physics: hotter surfaces can transfer LESS heat to a liquid than cooler ones. This explains the paradox of firewalking and also has practical applications in industrial cooling, nuclear reactor safety, and spray coating.',
    },
    {
      title: 'Pain physiology & thermal damage thresholds',
      concept: `The human body has a sophisticated thermal warning system. **Thermoreceptors** in the skin detect temperature changes and send signals to the brain via nerve fibers. There are two types relevant to firewalking: **warm receptors** (active from 30-45°C, peaking at 40°C) and **nociceptors** (pain receptors, activated above 43°C for heat pain).

Thermal damage to tissue follows an Arrhenius-type relationship: the rate of damage doubles for approximately every 1°C increase above 43°C. At 45°C, damage begins after about 1 hour of exposure. At 50°C, damage occurs in about 2 minutes. At 55°C, damage occurs in about 20 seconds. At 60°C, damage occurs in about 5 seconds. At 70°C, damage is nearly instantaneous.

The **burn depth** depends on both temperature and exposure time. First-degree burns affect only the epidermis (outer 0.1 mm) — painful but heal completely. Second-degree burns penetrate into the dermis (0.1-2 mm) — blistering and scarring. Third-degree burns destroy the full skin thickness (>2 mm) — require medical intervention.

For firewalking, the contact time (typically 0.3-0.5 seconds per step) and the low conductivity of coal together keep the skin surface temperature below the critical 60°C threshold. The thermal diffusion depth during a 0.5 second contact is approximately sqrt(alpha * t) where alpha is the thermal diffusivity of skin (~1.5 x 10^-7 m^2/s), giving a penetration depth of about 0.27 mm — confined to the outermost layer of callused skin.`,
      analogy: 'Thermal damage is like sunburn: it is not just about how bright the sun is (temperature) but also how long you stay in it (exposure time). A brief flash of intense light causes no damage, but prolonged moderate exposure causes a burn. The Arrhenius relationship means that the "timer" speeds up exponentially with temperature — a small increase in temperature dramatically shortens the safe exposure time.',
      storyConnection: 'The firewalker in the story does not rush across the coals in panic — they walk at a measured pace, spending about 0.3-0.5 seconds per step. This pace is not arbitrary; it is the result of generations of empirical optimization. Too slow, and the thermal penetration depth reaches sensitive tissue. Too fast, and the walker might stumble and increase contact time on one spot. The traditional pace is a biomechanical solution to a heat transfer equation.',
      checkQuestion: 'Skin surface reaches 48°C during a firewalking step. The thermal diffusivity of skin is 1.5 x 10^-7 m^2/s. If the step lasts 0.4 seconds, to what depth does the heat penetrate? Will this cause damage to the dermis (starts at 0.1 mm)?',
      checkAnswer: 'Penetration depth = sqrt(alpha * t) = sqrt(1.5e-7 * 0.4) = sqrt(6e-8) = 2.45 x 10^-4 m = 0.245 mm. This reaches into the upper dermis. However, at 48°C, the Arrhenius damage rate requires about 10 minutes of sustained exposure to cause injury. The 0.4 second contact provides only 0.067% of the required damage integral, so no thermal injury occurs despite the heat reaching the dermis.',
      codeIntro: 'Model thermal damage using the Arrhenius damage integral and visualize the relationship between temperature, time, and burn severity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Thermal Damage & Pain Physiology ---

# Arrhenius damage model
# Omega(t) = integral of A * exp(-Ea/(R*T)) dt
# Where A = frequency factor, Ea = activation energy
# Simplified: damage time halves for each 1°C above 43°C

def damage_time(T_celsius, threshold=1.0):
    """Time (seconds) to reach damage threshold at constant temperature."""
    if T_celsius < 43:
        return np.inf
    # Henriques & Moritz (1947) model
    # At 44°C: ~6 hours to damage. Rate doubles per degree.
    t_44 = 6 * 3600  # seconds at 44°C
    return t_44 / (2 ** (T_celsius - 44))

# Temperature range
T_range = np.linspace(35, 80, 200)
damage_times = np.array([damage_time(T) for T in T_range])

# Nerve response rates
warm_response = np.exp(-0.5 * ((T_range - 40) / 5)**2) * 100  # warm receptors
pain_response = np.where(T_range > 43, (T_range - 43)**1.5 * 10, 0)  # nociceptors

# Skin temperature during firewalking step
# Model: semi-infinite solid solution
# T(x,t) = T_initial + (T_surface - T_initial) * erfc(x / (2*sqrt(alpha*t)))
alpha_skin = 1.5e-7  # m^2/s thermal diffusivity
T_initial = 35.0
T_coal_surface = 600.0
k_coal = 0.15
k_skin = 0.50
contact_time = 0.4

# Interface temperature (contact between coal and skin)
# T_interface = (k_coal * T_coal + k_skin * T_skin) / (k_coal + k_skin)
# Accounting for thermal effusivity (sqrt(k*rho*c))
e_coal = np.sqrt(0.15 * 400 * 800)  # effusivity of coal
e_skin = np.sqrt(0.50 * 1050 * 3700)  # effusivity of skin
T_interface = (e_coal * T_coal_surface + e_skin * T_initial) / (e_coal + e_skin)

# Temperature profile in skin at end of contact
from math import erfc as _erfc
def erfc_array(x):
    return np.array([_erfc(xi) for xi in x])

x_skin = np.linspace(0, 0.005, 100)  # 0 to 5 mm
T_skin_profile = T_initial + (T_interface - T_initial) * erfc_array(
    x_skin / (2 * np.sqrt(alpha_skin * contact_time)))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Thermal Damage Physiology: Burns, Pain & Safe Limits',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Damage time vs temperature
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
valid = damage_times < 1e6
ax.plot(T_range[valid], damage_times[valid], color='#ef4444', linewidth=2.5)
ax.set_yscale('log')
ax.set_xlabel('Tissue temperature (°C)', color='white')
ax.set_ylabel('Time to damage (seconds)', color='white')
ax.set_title('Arrhenius burn model: time vs temperature', color='white')
# Add reference lines
for T_ref, t_ref, label in [(45, 3600, '45°C: 1 hour'), (50, 120, '50°C: 2 min'),
                              (55, 20, '55°C: 20 sec'), (60, 5, '60°C: 5 sec'),
                              (70, 0.1, '70°C: instant')]:
    if T_ref < T_range[valid][-1]:
        ax.scatter([T_ref], [t_ref], color='white', s=50, zorder=10)
        ax.annotate(label, (T_ref, t_ref), textcoords="offset points",
                    xytext=(10, 5), color='white', fontsize=8)

# Panel 2: Nerve response profiles
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(T_range, warm_response, color='#f59e0b', linewidth=2.5, label='Warm receptors')
ax.plot(T_range, pain_response, color='#ef4444', linewidth=2.5, label='Pain nociceptors')
ax.axvline(43, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.text(43.5, max(pain_response)*0.9, 'Pain threshold\\n(43°C)', color='white', fontsize=9)
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Nerve firing rate (arbitrary)', color='white')
ax.set_title('Thermoreceptor response curves', color='white')
ax.legend(fontsize=9)

# Panel 3: Temperature profile in skin during firewalking step
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(x_skin * 1000, T_skin_profile, color='#f59e0b', linewidth=2.5)
ax.axhline(43, color='#ef4444', linewidth=1, linestyle='--', alpha=0.7, label='Pain threshold (43°C)')
ax.axhline(60, color='#ef4444', linewidth=2, linestyle='--', alpha=0.7, label='Burn threshold (60°C)')
ax.axvspan(0, 0.1, color='#f59e0b', alpha=0.2, label='Epidermis')
ax.axvspan(0.1, 2.0, color='#a855f7', alpha=0.1, label='Dermis')
ax.set_xlabel('Depth into skin (mm)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title(f'Skin temp profile after {contact_time}s on coal', color='white')
ax.legend(fontsize=7, loc='upper right')
ax.set_xlim(0, 3)

# Panel 4: Burn severity zones (temperature-time diagram)
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
T_plot = np.linspace(44, 75, 100)
t_1st = np.array([damage_time(T) * 0.3 for T in T_plot])  # 30% of damage time
t_2nd = np.array([damage_time(T) * 1.0 for T in T_plot])  # full damage time
t_3rd = np.array([damage_time(T) * 3.0 for T in T_plot])  # 3x damage time

ax.fill_between(T_plot, 0.01, np.clip(t_1st, 0.01, 1e4), color='#22c55e', alpha=0.3, label='Safe (no burn)')
ax.fill_between(T_plot, np.clip(t_1st, 0.01, 1e4), np.clip(t_2nd, 0.01, 1e4),
                color='#f59e0b', alpha=0.3, label='1st degree')
ax.fill_between(T_plot, np.clip(t_2nd, 0.01, 1e4), np.clip(t_3rd, 0.01, 1e4),
                color='#ef4444', alpha=0.3, label='2nd degree')
ax.fill_between(T_plot, np.clip(t_3rd, 0.01, 1e4), 1e4,
                color='#991b1b', alpha=0.3, label='3rd degree')

# Mark firewalking conditions
ax.scatter([T_interface], [contact_time], color='white', s=150, zorder=10, marker='*')
ax.annotate(f'Firewalking\\nT={T_interface:.0f}°C, t={contact_time}s',
            (T_interface, contact_time), textcoords="offset points",
            xytext=(15, 15), color='white', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='white'))

ax.set_xlabel('Tissue temperature (°C)', color='white')
ax.set_ylabel('Exposure time (seconds)', color='white')
ax.set_title('Burn severity zones', color='white')
ax.set_yscale('log')
ax.set_ylim(0.01, 10000)
ax.legend(fontsize=8)

plt.tight_layout()
plt.show()

print(f"Firewalking thermal analysis:")
print(f"  Coal surface: {T_coal_surface}°C")
print(f"  Coal effusivity: {e_coal:.1f} W·s^0.5/(m²·K)")
print(f"  Skin effusivity: {e_skin:.1f} W·s^0.5/(m²·K)")
print(f"  Contact interface temperature: {T_interface:.1f}°C")
print(f"  Contact time: {contact_time} s")
print(f"  Thermal penetration depth: {np.sqrt(alpha_skin * contact_time)*1000:.3f} mm")
print(f"  Max skin temperature at surface: {T_skin_profile[0]:.1f}°C")
print(f"  Damage assessment: {'SAFE' if T_interface < 55 else 'AT RISK'}")`,
      challenge: 'Model the cumulative damage over a 5-meter coal walk (about 12 steps of 0.4 seconds each, with 0.3 seconds between steps for the foot to cool). Track the Arrhenius damage integral Omega across all steps and determine whether the total damage exceeds the threshold for a first-degree burn.',
      successHint: 'The burn physiology analysis shows why firewalking works within a narrow window: the combination of low-conductivity coal, brief contact time, and thermal penetration physics keeps tissue temperature below the critical damage threshold. Moving too slowly or using high-conductivity materials would shift the conditions into the burn zone.',
    },
    {
      title: 'Heat transfer calculations: 1D transient conduction',
      concept: `Real heat transfer during firewalking is a **transient** (time-dependent) problem. The temperature at any point in the foot changes over time as heat diffuses inward from the contact surface. This is governed by the **heat equation**: dT/dt = alpha * d^2T/dx^2, where alpha = k/(rho*c) is the thermal diffusivity.

For the firewalking problem, we model the skin as a **semi-infinite solid** — valid because the thermal penetration depth during a brief contact (< 1 mm) is much smaller than the total tissue thickness. The analytical solution involves the complementary error function: T(x,t) = T_i + (T_s - T_i) * erfc(x / (2*sqrt(alpha*t))), where T_i is the initial tissue temperature, T_s is the surface temperature (determined by the coal-skin interface condition), x is the depth into the tissue, and t is the elapsed time.

The **error function** erfc(z) transitions smoothly from 1 (at z=0, the surface) to 0 (deep in the tissue, unaffected). The characteristic depth where the temperature has changed by about 50% of the surface change is x_50 = sqrt(alpha*t) — this is the thermal penetration depth, and it grows as the square root of time. Doubling the contact time increases penetration by only 41% (factor of sqrt(2)), which is favorable for the firewalker.

For numerical solutions (needed when the geometry is more complex or material properties vary with temperature), we use the **finite difference method**: discretize space into thin layers and time into small steps, then update each layer's temperature based on heat flow from neighboring layers.`,
      analogy: 'The heat equation is like ink diffusing in water. Drop a spot of ink (the hot surface temperature) at the edge. It spreads inward over time, but the wavefront moves as the square root of time — initially fast, then slowing down. After 1 second, the "ink" has reached 1 unit deep. After 4 seconds, only 2 units deep. After 9 seconds, only 3 units deep. This square-root spreading is why brief contacts are disproportionately safer than slightly longer ones.',
      storyConnection: 'The transient nature of heat conduction is what makes firewalking possible as a walk rather than a stand. Each step begins a new heat diffusion process. When the foot lifts off, the surface immediately begins cooling (heat redistributes from the hot surface layer into the cooler interior and dissipates to the air). By the time the foot lands again, the surface has partially recovered. The walk is a series of thermal pulses, not a sustained exposure.',
      checkQuestion: 'During a 0.4-second contact, the skin surface reaches 50°C (from an initial 35°C). Using alpha = 1.5 x 10^-7 m^2/s, at what depth is the temperature still at 40°C (halfway between initial and surface)?',
      checkAnswer: 'T(x,t) = 35 + 15 * erfc(x / (2*sqrt(1.5e-7 * 0.4))). We want T = 40, so erfc(z) = (40-35)/15 = 0.333. erfc(z) = 0.333 means z = 0.70 (from tables). x = 0.70 * 2 * sqrt(6e-8) = 0.70 * 2 * 2.45e-4 = 3.43e-4 m = 0.343 mm. The halfway temperature is at only 0.34 mm depth — confirming that heat barely penetrates during a brief step.',
      codeIntro: 'Solve the 1D transient heat equation for the firewalking problem using finite differences, showing temperature evolution through skin layers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- 1D Transient Heat Conduction in Skin ---

# Material properties
k_skin = 0.50       # W/(m·K)
rho_skin = 1050     # kg/m^3
c_skin = 3700       # J/(kg·K)
alpha_skin = k_skin / (rho_skin * c_skin)  # m^2/s

# Grid setup
L = 0.005  # 5 mm skin depth
nx = 100
dx = L / (nx - 1)
x = np.linspace(0, L, nx)

# Time setup
total_time = 2.0  # seconds (contact + recovery)
contact_time = 0.4  # seconds on coal
dt = 0.0001  # time step (must satisfy stability: dt < dx^2/(2*alpha))
nt = int(total_time / dt)

# Stability check
stability = alpha_skin * dt / dx**2
print(f"Stability parameter (must be < 0.5): {stability:.4f}")

# Initial and boundary conditions
T_initial = 35.0  # °C
T_coal_interface = 52.0  # °C (interface temperature from effusivity calculation)
T_air = 25.0  # °C (air temperature after foot lifts)
h_air = 10.0  # W/(m^2·K) (convective cooling)

# Solve using explicit finite difference
T = np.full(nx, T_initial)
T_history = [T.copy()]
times_save = [0]

save_interval = int(0.05 / dt)  # save every 50 ms

for n in range(1, nt + 1):
    T_new = T.copy()
    current_time = n * dt

    # Interior nodes: explicit scheme
    for i in range(1, nx - 1):
        T_new[i] = T[i] + alpha_skin * dt / dx**2 * (T[i+1] - 2*T[i] + T[i-1])

    # Boundary conditions
    if current_time <= contact_time:
        # Contact with coal: fixed surface temperature
        T_new[0] = T_coal_interface
    else:
        # After liftoff: convective cooling at surface
        T_new[0] = T_new[1] + h_air * dx / k_skin * (T_air - T_new[1])
        T_new[0] = T_new[0] / (1 + h_air * dx / k_skin)

    T_new[-1] = T_initial  # deep tissue stays at body temperature

    T = T_new
    if n % save_interval == 0:
        T_history.append(T.copy())
        times_save.append(current_time)

T_history = np.array(T_history)
times_save = np.array(times_save)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('1D Transient Heat Conduction: Firewalking Step',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Temperature profiles at different times
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
time_indices = [0, 4, 8, 12, 20, 30, 39]  # ~0, 0.2, 0.4, 0.6, 1.0, 1.5, 2.0 s
cmap = plt.cm.plasma
for idx in time_indices:
    if idx < len(times_save):
        color = cmap(idx / max(time_indices))
        ax.plot(x * 1000, T_history[idx], color=color, linewidth=2,
                label=f't = {times_save[idx]:.2f} s')
ax.axhline(43, color='#ef4444', linewidth=1, linestyle='--', alpha=0.5)
ax.text(3, 44, 'Pain threshold', color='#ef4444', fontsize=8)
ax.axvline(contact_time * 1000 * 0, color='gray', linewidth=0.5)
ax.set_xlabel('Depth into skin (mm)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Temperature profiles at different times', color='white')
ax.legend(fontsize=7, loc='upper right')
ax.set_xlim(0, 3)

# Panel 2: Surface temperature over time
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(times_save, T_history[:, 0], color='#ef4444', linewidth=2.5, label='Surface (x=0)')
ax.plot(times_save, T_history[:, nx//20], color='#f59e0b', linewidth=2, label=f'x={x[nx//20]*1000:.2f} mm')
ax.plot(times_save, T_history[:, nx//10], color='#22c55e', linewidth=2, label=f'x={x[nx//10]*1000:.2f} mm')
ax.plot(times_save, T_history[:, nx//5], color='#3b82f6', linewidth=2, label=f'x={x[nx//5]*1000:.2f} mm')
ax.axvline(contact_time, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.text(contact_time + 0.05, T_coal_interface - 2, 'Foot lifts', color='white', fontsize=9)
ax.axhline(43, color='#ef4444', linewidth=0.5, linestyle=':', alpha=0.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Temperature at different depths over time', color='white')
ax.legend(fontsize=8)

# Panel 3: Heat map (temperature vs depth and time)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
X, Tsave = np.meshgrid(x * 1000, times_save)
im = ax.pcolormesh(X[:, :nx//3], Tsave[:, :nx//3], T_history[:, :nx//3],
                    cmap='hot', shading='auto')
plt.colorbar(im, ax=ax, label='Temperature (°C)')
ax.axhline(contact_time, color='white', linewidth=1, linestyle='--', alpha=0.7)
ax.set_xlabel('Depth (mm)', color='white')
ax.set_ylabel('Time (s)', color='white')
ax.set_title('Temperature evolution (heat map)', color='white')

# Panel 4: Total heat absorbed vs time
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
heat_absorbed = np.array([
    rho_skin * c_skin * np.trapz(T_history[i] - T_initial, x)
    for i in range(len(times_save))
])
ax.plot(times_save, heat_absorbed, color='#a855f7', linewidth=2.5)
ax.axvline(contact_time, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Total heat absorbed (J/m²)', color='white')
ax.set_title('Cumulative heat absorption', color='white')
ax.text(contact_time + 0.05, heat_absorbed.max() * 0.9, 'Foot lifts →\\nheat redistributes',
        color='white', fontsize=9)

plt.tight_layout()
plt.show()

print(f"Transient conduction results:")
print(f"  Contact duration: {contact_time} s")
print(f"  Interface temperature: {T_coal_interface}°C")
print(f"  Max surface temperature: {T_history[:, 0].max():.1f}°C")
print(f"  Thermal penetration depth (at liftoff): ~{np.sqrt(alpha_skin * contact_time)*1000:.3f} mm")
print(f"  Max heat absorbed: {heat_absorbed.max():.1f} J/m^2")
print(f"  Surface temp at t=2s: {T_history[-1, 0]:.1f}°C (recovery)")`,
      challenge: 'Model a full coal walk: 12 consecutive steps of 0.4 s contact + 0.3 s recovery each. Track the temperature at the skin surface and at 0.2 mm depth throughout the entire walk. Does the temperature ratchet upward with each step, or does the recovery period fully reset the temperature?',
      successHint: 'The 1D heat equation reveals why speed matters in firewalking. The square-root dependence of penetration depth on time means that doubling the step time only increases penetration by 41% — but the effect on burn severity is dramatic because the Arrhenius damage rate is exponential in temperature.',
    },
    {
      title: 'Thermal properties of materials: why coal is special',
      concept: `The physics of firewalking depends critically on the **thermal properties** of charcoal. Three properties matter: thermal conductivity (k), density (rho), and specific heat capacity (c). Together, they determine two compound properties that govern transient heat transfer.

**Thermal diffusivity** alpha = k/(rho*c) determines how fast temperature changes propagate through a material. High alpha means heat spreads quickly (metals: alpha = 10-100 x 10^-6 m^2/s). Low alpha means heat spreads slowly (wood charcoal: alpha = 0.5 x 10^-6 m^2/s).

**Thermal effusivity** (or thermal inertia) e = sqrt(k*rho*c) determines how much heat a material can exchange with another material at its surface. When two materials at different temperatures are brought into contact, the interface temperature depends on the ratio of their effusivities: T_interface = (e1*T1 + e2*T2) / (e1 + e2). A material with low effusivity (like charcoal, e = 220 W*s^0.5/(m^2*K)) will barely change the temperature of a material with high effusivity (like skin, e = 1390 W*s^0.5/(m^2*K)) it contacts.

This effusivity ratio is the single most important factor in firewalking safety. When charcoal at 600°C contacts skin at 35°C, the interface temperature is (220*600 + 1390*35) / (220 + 1390) = (132000 + 48650) / 1610 = 112°C. Wait — that seems too high! But this is the *instantaneous* interface temperature. In practice, the finite thickness of the coal and the Leidenfrost effect significantly reduce this. For thin, powdery coal layers, the effective interface temperature is much lower because the coal layer cools rapidly as it gives up its limited stored energy.`,
      analogy: 'Effusivity is like a handshake between a hot person and a cold person. If the hot person has "weak thermal handshake" (low effusivity, like charcoal), they barely warm the cold person. If the hot person has "strong thermal handshake" (high effusivity, like iron), they rapidly transfer their heat. The temperature they settle at depends on who has the stronger "grip" — and charcoal has a very weak grip despite being very hot.',
      storyConnection: 'The firewalker story takes place in a culture that has performed this ritual for generations. The empirical knowledge accumulated over centuries — use well-burned hardwood, ensure the coals are fully ashed over, walk at a steady pace — all correspond to optimizing the thermal properties for safety. Well-burned hardwood charcoal has lower density (more air pockets = lower conductivity) and an ash layer that adds further insulation.',
      checkQuestion: 'Steel has k = 50 W/(m.K), rho = 7800 kg/m^3, c = 500 J/(kg.K). Charcoal has k = 0.15, rho = 400, c = 800. Calculate the effusivity of each and the interface temperature when each at 600°C contacts skin (e_skin = 1390, T_skin = 35°C).',
      checkAnswer: 'Steel: e = sqrt(50 * 7800 * 500) = sqrt(1.95e8) = 13,964 W.s^0.5/(m^2.K). Interface: (13964*600 + 1390*35)/(13964+1390) = (8,378,400 + 48,650)/15,354 = 549°C. Charcoal: e = sqrt(0.15 * 400 * 800) = sqrt(48,000) = 219. Interface: (219*600 + 1390*35)/(219+1390) = (131,400 + 48,650)/1609 = 112°C. Steel gives an interface temperature of 549°C (instant severe burn). Charcoal gives 112°C (still hot, but survivable with brief contact and Leidenfrost protection). The effusivity ratio explains everything.',
      codeIntro: 'Compare thermal properties of materials and show why charcoal uniquely enables firewalking through low effusivity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Thermal Material Properties ---

materials = {
    'Copper':        {'k': 385, 'rho': 8940, 'c': 385, 'color': '#f97316'},
    'Aluminum':      {'k': 205, 'rho': 2700, 'c': 900, 'color': '#6b7280'},
    'Steel':         {'k': 50,  'rho': 7800, 'c': 500, 'color': '#3b82f6'},
    'Granite':       {'k': 2.5, 'rho': 2700, 'c': 800, 'color': '#a855f7'},
    'Brick':         {'k': 0.8, 'rho': 1920, 'c': 835, 'color': '#ec4899'},
    'Dry wood':      {'k': 0.12,'rho': 600,  'c': 1200,'color': '#22c55e'},
    'Charcoal':      {'k': 0.15,'rho': 400,  'c': 800, 'color': '#f59e0b'},
    'Charcoal+ash':  {'k': 0.08,'rho': 300,  'c': 700, 'color': '#fbbf24'},
    'Aerogel':       {'k': 0.015,'rho': 50,  'c': 1000,'color': '#06b6d4'},
}

# Skin properties
e_skin = np.sqrt(0.50 * 1050 * 3700)
T_skin = 35
T_hot = 600

# Compute derived properties
for name, props in materials.items():
    props['alpha'] = props['k'] / (props['rho'] * props['c'])
    props['effusivity'] = np.sqrt(props['k'] * props['rho'] * props['c'])
    props['T_interface'] = (props['effusivity'] * T_hot + e_skin * T_skin) / (props['effusivity'] + e_skin)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Material Thermal Properties: Why Charcoal Enables Firewalking',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Conductivity vs effusivity (log-log)
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in materials.items():
    ax.scatter(props['k'], props['effusivity'], color=props['color'],
               s=100, zorder=10)
    ax.annotate(name, (props['k'], props['effusivity']),
                textcoords="offset points", xytext=(5, 5),
                color=props['color'], fontsize=8)
ax.set_xlabel('Thermal conductivity k (W/(m·K))', color='white')
ax.set_ylabel('Thermal effusivity (W·s^0.5/(m²·K))', color='white')
ax.set_title('Conductivity vs Effusivity', color='white')
ax.set_xscale('log'); ax.set_yscale('log')

# Panel 2: Interface temperature at 600°C
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names = list(materials.keys())
T_interfaces = [materials[n]['T_interface'] for n in names]
colors = [materials[n]['color'] for n in names]
bars = ax.barh(names, T_interfaces, color=colors, alpha=0.8)
ax.axvline(60, color='#ef4444', linewidth=2, linestyle='--', label='Burn limit (60°C)')
ax.axvline(43, color='#f59e0b', linewidth=2, linestyle='--', label='Pain threshold (43°C)')
for bar, T in zip(bars, T_interfaces):
    ax.text(min(bar.get_width() + 5, 550), bar.get_y() + bar.get_height()/2,
            f'{T:.0f}°C', color='white', fontsize=9, va='center')
ax.set_xlabel('Interface temperature when touching at 600°C (°C)', color='white')
ax.set_title('Contact temperature: skin vs materials at 600°C', color='white')
ax.legend(fontsize=8)

# Panel 3: Thermal diffusivity comparison
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
alphas = [materials[n]['alpha'] * 1e6 for n in names]
bars = ax.barh(names, alphas, color=colors, alpha=0.8)
for bar, a in zip(bars, alphas):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{a:.2f}', color='white', fontsize=9, va='center')
ax.set_xlabel('Thermal diffusivity α (×10⁻⁶ m²/s)', color='white')
ax.set_title('How fast heat spreads through the material', color='white')

# Panel 4: Energy stored in thin surface layer
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
layer_thickness = 0.005  # 5 mm surface layer
A = 0.015  # foot contact area
energy_stored = [materials[n]['rho'] * materials[n]['c'] * layer_thickness * A * (T_hot - T_skin)
                 for n in names]
bars = ax.barh(names, energy_stored, color=colors, alpha=0.8)
ax.set_xlabel('Thermal energy in 5mm surface layer (J)', color='white')
ax.set_title('Energy available to transfer to foot', color='white')
for bar, e in zip(bars, energy_stored):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{e:.0f} J', color='white', fontsize=8, va='center')

plt.tight_layout()
plt.show()

print("Material comparison for firewalking at 600°C:")
print("=" * 75)
print(f"{'Material':<15} {'k':>6} {'e':>8} {'T_int':>7} {'alpha':>10} {'Verdict'}")
print(f"{'':15} {'W/mK':>6} {'':>8} {'°C':>7} {'×10⁻⁶':>10}")
print("-" * 75)
for name, props in materials.items():
    verdict = 'SAFE' if props['T_interface'] < 60 else 'RISKY' if props['T_interface'] < 200 else 'LETHAL'
    print(f"{name:<15} {props['k']:>6.2f} {props['effusivity']:>8.0f} "
          f"{props['T_interface']:>7.0f} {props['alpha']*1e6:>10.3f} {verdict}")`,
      challenge: 'Model a "layered coal bed": 2 mm of ash (k=0.08) on top of 10 mm of charcoal (k=0.15) on top of 20 mm of unburned wood (k=0.12). Solve the multi-layer heat equation and show how the ash layer dramatically reduces the interface temperature compared to bare charcoal.',
      successHint: 'The material properties of charcoal — low conductivity, low density, low effusivity — are what make firewalking physically possible. No amount of mental preparation or spiritual belief changes the thermal physics. The same charcoal properties that make it a poor heat conductor also make it an excellent cooking fuel (it radiates heat efficiently without conducting it to its surroundings).',
    },
    {
      title: 'Building a comprehensive thermal safety model',
      concept: `We now have all the components needed for a comprehensive **thermal safety model** for firewalking: conductive heat transfer (Fourier's law), the Leidenfrost effect, the Arrhenius burn model, transient heat diffusion in skin, and material thermal properties.

A complete safety analysis requires combining these factors into a single framework. The inputs are: coal surface temperature, coal type (determining k, rho, c), walking speed (determining contact time per step), foot moisture level (determining Leidenfrost protection), skin thickness and callusing (determining thermal resistance), and ambient conditions (air temperature, humidity).

The model computes: (1) the coal-skin interface temperature from effusivity ratios, (2) the Leidenfrost reduction factor if applicable, (3) the transient temperature field in the skin using the heat equation, (4) the Arrhenius damage integral at each depth, (5) the cumulative damage over the entire walk.

The safety margin is defined as: SM = 1 - (Omega_actual / Omega_burn), where Omega is the Arrhenius damage integral. SM > 0.5 means safe with good margin. SM between 0 and 0.5 means risky. SM < 0 means a burn is predicted.

This model reveals the interplay of all variables: high coal temperature is offset by low conductivity; long walks accumulate damage even when individual steps are safe; moisture provides critical protection but evaporates over time; and ambient wind increases convective cooling during the recovery phase between steps.`,
      analogy: 'The thermal safety model is like a flight plan for an airplane. Many variables — fuel load, wind speed, altitude, temperature, payload — all interact to determine whether the plane can safely complete its journey. No single variable tells the whole story. The safety margin is like the fuel reserve: you want plenty of margin because individual variables are uncertain.',
      storyConnection: 'The accumulated wisdom of firewalking traditions represents an empirical thermal safety model developed over centuries. The rules — "use well-burned hardwood," "walk at an even pace," "do not run," "prepare the coals properly" — each correspond to optimizing specific physical variables. Our mathematical model makes this implicit knowledge explicit and quantitative.',
      checkQuestion: 'A firewalking model predicts Omega = 0.35 for a 4-meter walk. What is the safety margin? If the walk is extended to 6 meters and damage scales roughly linearly with distance, what happens?',
      checkAnswer: 'SM = 1 - 0.35/1.0 = 0.65 (good safety margin). At 6 meters: Omega = 0.35 * (6/4) = 0.525, SM = 1 - 0.525 = 0.475 (still safe but margin is thin). At 8 meters: Omega = 0.70, SM = 0.30 (risky). At ~11.4 meters: Omega = 1.0, SM = 0 (burn threshold reached). This shows why firewalks are typically kept to 3-5 meters.',
      codeIntro: 'Build the comprehensive thermal safety model that combines all physics into a single predictive framework with visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erfc

# =========================================
# COMPREHENSIVE THERMAL SAFETY MODEL
# =========================================

g = 9.81

# Default parameters
class FirewalkParams:
    # Coal properties
    T_coal = 600          # °C
    k_coal = 0.15         # W/(m·K)
    rho_coal = 400        # kg/m^3
    c_coal = 800          # J/(kg·K)

    # Skin properties
    T_skin = 35           # °C
    k_skin = 0.50
    rho_skin = 1050
    c_skin = 3700
    callus_thickness = 0.0005  # 0.5 mm callus

    # Walk parameters
    walk_length = 4.0     # meters
    step_length = 0.35    # meters
    contact_time = 0.4    # seconds per step
    recovery_time = 0.3   # seconds between steps
    foot_area = 0.015     # m^2

    # Leidenfrost
    moisture_present = True
    leidenfrost_factor = 0.4  # heat transfer reduction

def run_safety_model(params):
    """Run the complete thermal safety analysis."""
    p = params

    # Derived properties
    e_coal = np.sqrt(p.k_coal * p.rho_coal * p.c_coal)
    e_skin = np.sqrt(p.k_skin * p.rho_skin * p.c_skin)
    alpha_skin = p.k_skin / (p.rho_skin * p.c_skin)

    # Interface temperature
    T_interface = (e_coal * p.T_coal + e_skin * p.T_skin) / (e_coal + e_skin)

    # Leidenfrost reduction
    if p.moisture_present and T_interface > 100:
        T_effective = p.T_skin + (T_interface - p.T_skin) * p.leidenfrost_factor
    else:
        T_effective = T_interface

    # Number of steps
    n_steps = int(p.walk_length / p.step_length)
    step_cycle = p.contact_time + p.recovery_time
    total_time = n_steps * step_cycle

    # Simulate skin temperature at surface over entire walk
    dt_sim = 0.01
    t_sim = np.arange(0, total_time, dt_sim)
    T_surface = np.zeros_like(t_sim)
    T_02mm = np.zeros_like(t_sim)  # temperature at 0.2 mm depth
    damage_integral = np.zeros_like(t_sim)

    current_T_surface = p.T_skin
    current_T_02mm = p.T_skin

    for i, t in enumerate(t_sim):
        step_num = int(t / step_cycle)
        time_in_cycle = t - step_num * step_cycle

        if time_in_cycle < p.contact_time:
            # Contact phase: surface temperature rises
            t_contact = time_in_cycle
            current_T_surface = p.T_skin + (T_effective - p.T_skin) * (
                1 - np.exp(-3 * t_contact / p.contact_time))
            depth = 0.0002  # 0.2 mm
            z = depth / (2 * np.sqrt(alpha_skin * max(t_contact, 0.001)))
            current_T_02mm = p.T_skin + (T_effective - p.T_skin) * erfc(min(z, 5))
        else:
            # Recovery phase: convective cooling
            t_recovery = time_in_cycle - p.contact_time
            current_T_surface = p.T_skin + (current_T_surface - p.T_skin) * np.exp(-5 * t_recovery)
            current_T_02mm = p.T_skin + (current_T_02mm - p.T_skin) * np.exp(-2 * t_recovery)

        T_surface[i] = current_T_surface
        T_02mm[i] = current_T_02mm

        # Arrhenius damage rate
        if current_T_surface > 43:
            t_damage = 6 * 3600 / (2 ** (current_T_surface - 44))
            damage_integral[i] = damage_integral[max(0, i-1)] + dt_sim / t_damage
        elif i > 0:
            damage_integral[i] = damage_integral[i-1]

    safety_margin = 1.0 - damage_integral[-1]

    return {
        'T_interface': T_interface,
        'T_effective': T_effective,
        'n_steps': n_steps,
        'total_time': total_time,
        't_sim': t_sim,
        'T_surface': T_surface,
        'T_02mm': T_02mm,
        'damage_integral': damage_integral,
        'safety_margin': safety_margin,
        'e_coal': e_coal,
        'e_skin': e_skin,
    }

# Run default model
params = FirewalkParams()
results = run_safety_model(params)

# Sensitivity analysis: vary key parameters
sensitivities = {}
for var_name, var_values, var_label in [
    ('T_coal', [400, 500, 600, 700, 800], 'Coal temperature (°C)'),
    ('contact_time', [0.2, 0.3, 0.4, 0.5, 0.7], 'Contact time (s)'),
    ('k_coal', [0.08, 0.12, 0.15, 0.25, 0.50], 'Coal conductivity'),
    ('walk_length', [2, 3, 4, 5, 7], 'Walk length (m)'),
]:
    margins = []
    for val in var_values:
        p = FirewalkParams()
        setattr(p, var_name, val)
        r = run_safety_model(p)
        margins.append(r['safety_margin'])
    sensitivities[var_label] = (var_values, margins)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('THERMAL SAFETY MODEL: Firewalking Risk Assessment',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Surface temperature over walk
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(results['t_sim'], results['T_surface'], color='#ef4444', linewidth=1.5, label='Surface')
ax.plot(results['t_sim'], results['T_02mm'], color='#f59e0b', linewidth=1.5, label='0.2mm depth')
ax.axhline(43, color='white', linewidth=0.5, linestyle='--', alpha=0.5)
ax.axhline(60, color='#ef4444', linewidth=0.5, linestyle='--', alpha=0.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title(f'Skin temperature during {params.walk_length}m walk', color='white')
ax.legend(fontsize=8)

# Panel 2: Damage integral
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(results['t_sim'], results['damage_integral'], color='#a855f7', linewidth=2.5)
ax.axhline(1.0, color='#ef4444', linewidth=2, linestyle='--', label='Burn threshold (Ω=1)')
ax.axhline(0.5, color='#f59e0b', linewidth=1, linestyle='--', label='Caution (Ω=0.5)')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Damage integral Ω', color='white')
ax.set_title(f'Cumulative damage (SM = {results["safety_margin"]:.2f})', color='white')
ax.legend(fontsize=9)

# Panel 3: Sensitivity analysis
ax = axes[0, 2]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
colors_sens = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']
for (label, (vals, margins)), color in zip(sensitivities.items(), colors_sens):
    normalized_vals = np.array(vals) / vals[len(vals)//2]  # normalize to middle value
    ax.plot(normalized_vals, margins, 'o-', color=color, linewidth=2, label=label, markersize=6)
ax.axhline(0, color='#ef4444', linewidth=2, linestyle='--', alpha=0.5)
ax.axhline(0.5, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.3)
ax.set_xlabel('Parameter (normalized to default)', color='white')
ax.set_ylabel('Safety margin', color='white')
ax.set_title('Sensitivity analysis', color='white')
ax.legend(fontsize=7)

# Panel 4: Coal temperature effect
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
vals, margins = sensitivities['Coal temperature (°C)']
bar_colors = ['#22c55e' if m > 0.5 else '#f59e0b' if m > 0 else '#ef4444' for m in margins]
bars = ax.bar([str(v) for v in vals], margins, color=bar_colors, alpha=0.8)
ax.axhline(0, color='#ef4444', linewidth=2, linestyle='--')
ax.set_xlabel('Coal temperature (°C)', color='white')
ax.set_ylabel('Safety margin', color='white')
ax.set_title('Effect of coal temperature', color='white')

# Panel 5: Moisture effect comparison
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
p_dry = FirewalkParams(); p_dry.moisture_present = False
p_wet = FirewalkParams(); p_wet.moisture_present = True
r_dry = run_safety_model(p_dry)
r_wet = run_safety_model(p_wet)
ax.plot(r_dry['t_sim'], r_dry['damage_integral'], color='#ef4444', linewidth=2, label='Dry foot')
ax.plot(r_wet['t_sim'], r_wet['damage_integral'], color='#22c55e', linewidth=2, label='Moist foot (Leidenfrost)')
ax.axhline(1.0, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Damage integral Ω', color='white')
ax.set_title('Leidenfrost protection: dry vs moist', color='white')
ax.legend(fontsize=9)

# Panel 6: Summary report
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
status = 'SAFE' if results['safety_margin'] > 0.5 else 'CAUTION' if results['safety_margin'] > 0 else 'DANGER'
status_color = '#22c55e' if status == 'SAFE' else '#f59e0b' if status == 'CAUTION' else '#ef4444'
report = [
    f"THERMAL SAFETY REPORT",
    f"",
    f"Coal: {params.T_coal}°C, k={params.k_coal}",
    f"Walk: {params.walk_length}m ({results['n_steps']} steps)",
    f"Contact: {params.contact_time}s/step",
    f"Moisture: {'Yes' if params.moisture_present else 'No'}",
    f"",
    f"Interface T: {results['T_interface']:.0f}°C",
    f"Effective T: {results['T_effective']:.0f}°C",
    f"Final Ω: {results['damage_integral'][-1]:.3f}",
    f"Safety margin: {results['safety_margin']:.2f}",
    f"",
    f"STATUS: {status}",
]
for i, line in enumerate(report):
    color = status_color if 'STATUS' in line else 'white'
    weight = 'bold' if i == 0 or 'STATUS' in line else 'normal'
    ax.text(0.05, 0.95 - i * 0.07, line, color=color, fontsize=10,
            transform=ax.transAxes, fontfamily='monospace', fontweight=weight)

plt.tight_layout()
plt.show()

print("THERMAL SAFETY MODEL — COMPLETE REPORT")
print("=" * 50)
print(f"Status: {status}")
print(f"Safety margin: {results['safety_margin']:.3f}")
print(f"Interface temperature: {results['T_interface']:.1f}°C")
print(f"Effective (with Leidenfrost): {results['T_effective']:.1f}°C")
print(f"Steps: {results['n_steps']} over {params.walk_length}m")
print(f"Total walk time: {results['total_time']:.1f}s")
print(f"Peak skin surface temp: {results['T_surface'].max():.1f}°C")`,
      challenge: 'Add a Monte Carlo simulation: vary coal temperature (+/- 50°C), contact time (+/- 0.1s), and conductivity (+/- 20%) randomly over 1000 simulations. Plot the distribution of safety margins and calculate the probability of a burn (SM < 0). This represents uncertainty in real-world conditions.',
      successHint: 'You have built a complete thermal safety model that combines five areas of physics — conduction, material properties, the Leidenfrost effect, burn physiology, and transient heat transfer — into a single predictive framework. This is the kind of multi-physics modeling that engineers use to design everything from spacecraft heat shields to kitchen cookware.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Thermal Physics & Heat Transfer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (energy fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real thermal physics simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
