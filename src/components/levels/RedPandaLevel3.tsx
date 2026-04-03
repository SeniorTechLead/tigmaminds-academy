import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function RedPandaLevel3() {
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
      title: 'Thermoregulation in mammals — maintaining the internal fire',
      concept: `The red panda lives at elevations of 2,200-4,800 meters where temperatures regularly drop below freezing. Yet its core body temperature stays near 37°C. How?

**Thermoregulation** is the balance between heat production and heat loss, governed by physics:

- **Metabolic heat production**: every cell generates heat from biochemical reactions. The **basal metabolic rate (BMR)** scales with body mass as BMR ∝ M^0.75 (Kleiber's law). Small animals produce more heat per gram than large ones.
- **Heat loss**: follows Newton's law of cooling — the rate of heat loss is proportional to the temperature difference between body and environment, and to the surface area exposed.
- **Surface-area-to-volume ratio (SA:V)**: smaller animals have higher SA:V, meaning they lose heat faster relative to their ability to generate it. This is why small mammals in cold climates need thick fur, high metabolic rates, or behavioral thermoregulation.

The **thermoneutral zone (TNZ)** is the temperature range where an animal can maintain body temperature through basal metabolism alone. Below the TNZ's lower critical temperature, the animal must increase metabolic rate (shivering, non-shivering thermogenesis). Above the upper critical temperature, it must actively cool (panting, sweating).

For the red panda (mass ~5 kg), the TNZ is relatively narrow, making its dense fur critically important.`,
      analogy: 'Your house in winter is a thermoregulation system. The furnace (metabolism) produces heat. Insulation (fur) slows heat loss. Windows and doors (surface area) let heat escape. A small house loses heat faster relative to its volume than a large warehouse. The thermostat (hypothalamus) detects temperature and adjusts the furnace. The red panda\'s body works exactly the same way.',
      storyConnection: 'The red panda in the story wrapped its bushy tail around itself on cold mountain nights. That tail is not decoration — it is a thermal blanket that reduces exposed surface area by up to 30%, directly cutting heat loss. The story captured a real survival behavior rooted in thermodynamics.',
      checkQuestion: 'A red panda (5 kg) and a giant panda (100 kg) both live in cold mountain forests. Which needs relatively more food per kilogram of body weight to stay warm, and why?',
      checkAnswer: 'The red panda needs more food per kg. Its higher SA:V ratio means it loses heat proportionally faster. By Kleiber\'s law, its mass-specific metabolic rate (BMR/mass) is higher. A 5 kg animal\'s BMR per gram is about 2.7x higher than a 100 kg animal\'s. This is why small mammals must eat constantly — the red panda eats bamboo for up to 13 hours per day.',
      codeIntro: 'Model thermoregulation: simulate body temperature as a function of ambient temperature, body mass, metabolic rate, and insulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Biophysical thermoregulation model
def thermoregulation(body_mass_kg, ambient_temps, fur_thickness_cm,
                     fur_conductivity=0.04, target_temp=37.0):
    """
    Model core body temperature and metabolic cost across ambient temperatures.

    Heat balance: M_heat + M_shiver = h * A * (T_body - T_ambient)
    where h = conductivity / fur_thickness (thermal conductance)
    """
    # Kleiber's law: BMR in watts
    bmr = 3.5 * (body_mass_kg ** 0.75)  # watts

    # Surface area (Meeh's formula for mammals): A = 0.1 * M^0.67 (m²)
    surface_area = 0.1 * (body_mass_kg ** 0.67)

    # Thermal conductance through fur (W/m²/°C)
    conductance = fur_conductivity / (fur_thickness_cm / 100)

    # Total thermal conductance
    total_h = conductance * surface_area  # W/°C

    # Lower critical temperature
    lct = target_temp - bmr / total_h

    results = {
        'ambient': ambient_temps,
        'body_temp': np.full_like(ambient_temps, target_temp),
        'metabolic_rate': np.zeros_like(ambient_temps),
        'heat_loss': np.zeros_like(ambient_temps),
        'bmr': bmr,
        'lct': lct,
        'surface_area': surface_area,
    }

    for i, t_amb in enumerate(ambient_temps):
        heat_loss_needed = total_h * (target_temp - t_amb)

        if t_amb >= lct:
            # In thermoneutral zone: BMR covers heat loss
            results['metabolic_rate'][i] = bmr
            results['heat_loss'][i] = heat_loss_needed
        else:
            # Below LCT: must increase metabolism
            results['metabolic_rate'][i] = heat_loss_needed
            results['heat_loss'][i] = heat_loss_needed

            # If metabolic rate > 5x BMR, hypothermia risk
            if heat_loss_needed > 5 * bmr:
                results['body_temp'][i] = target_temp - (heat_loss_needed - 5*bmr) / total_h

    return results

temps = np.linspace(-20, 35, 200)

# Red panda: 5 kg, 4 cm thick fur
rp = thermoregulation(5.0, temps, 4.0)

# Compare: naked (no fur), thin fur, thick fur
rp_naked = thermoregulation(5.0, temps, 0.3)
rp_thin = thermoregulation(5.0, temps, 1.5)
rp_thick = thermoregulation(5.0, temps, 6.0)

# Compare: different body sizes with same fur
small = thermoregulation(2.0, temps, 4.0)   # red panda cub
medium = thermoregulation(5.0, temps, 4.0)  # red panda adult
large = thermoregulation(100.0, temps, 4.0) # giant panda sized

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Metabolic rate vs temperature (fur comparison)
ax = axes[0, 0]
ax.set_facecolor('#111827')
for data, label, color in [
    (rp_naked, 'No fur (0.3 cm)', '#ef4444'),
    (rp_thin, 'Thin fur (1.5 cm)', '#f59e0b'),
    (rp, 'Normal fur (4 cm)', '#22c55e'),
    (rp_thick, 'Thick fur (6 cm)', '#3b82f6')
]:
    ax.plot(temps, data['metabolic_rate'], color=color, linewidth=2, label=label)
ax.axhline(rp['bmr'], color='gray', linestyle=':', alpha=0.5, label='BMR')
ax.set_xlabel('Ambient temperature (°C)', color='white')
ax.set_ylabel('Metabolic rate (W)', color='white')
ax.set_title('Metabolic cost vs fur insulation (5 kg mammal)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Body temperature maintenance
ax = axes[0, 1]
ax.set_facecolor('#111827')
for data, label, color in [
    (rp_naked, 'No fur', '#ef4444'),
    (rp, 'Normal fur', '#22c55e'),
    (rp_thick, 'Thick fur', '#3b82f6')
]:
    ax.plot(temps, data['body_temp'], color=color, linewidth=2, label=label)
ax.axhline(37, color='gray', linestyle=':', alpha=0.5)
ax.axhline(30, color='#ef4444', linestyle='--', alpha=0.5, label='Hypothermia')
ax.set_xlabel('Ambient temperature (°C)', color='white')
ax.set_ylabel('Core body temperature (°C)', color='white')
ax.set_title('Body temperature maintenance', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Size comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
for data, label, color in [
    (small, '2 kg (cub)', '#f59e0b'),
    (medium, '5 kg (adult)', '#22c55e'),
    (large, '100 kg (giant panda)', '#3b82f6')
]:
    ax.plot(temps, data['metabolic_rate'] / float(label.split()[0]), color=color, linewidth=2, label=label)
ax.set_xlabel('Ambient temperature (°C)', color='white')
ax.set_ylabel('Mass-specific metabolic rate (W/kg)', color='white')
ax.set_title('Metabolic cost per kg vs body size', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Thermoneutral zones
ax = axes[1, 1]
ax.set_facecolor('#111827')
species = ['Red panda\\n(5 kg)', 'Giant panda\\n(100 kg)', 'Mouse\\n(0.03 kg)', 'Elephant\\n(5000 kg)']
lcts = [
    thermoregulation(5, temps, 4.0)['lct'],
    thermoregulation(100, temps, 3.0)['lct'],
    thermoregulation(0.03, temps, 0.5)['lct'],
    thermoregulation(5000, temps, 1.0)['lct'],
]
colors = ['#ef4444', '#3b82f6', '#f59e0b', '#a855f7']
for i, (sp, lct, c) in enumerate(zip(species, lcts, colors)):
    ax.barh(i, 35 - lct, left=lct, color=c, alpha=0.7, height=0.6)
    ax.text(lct - 1, i, f'{lct:.0f}°C', ha='right', va='center', color='white', fontsize=9)
ax.set_yticks(range(len(species)))
ax.set_yticklabels(species, color='white', fontsize=9)
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_title('Thermoneutral zones (LCT to 35°C)', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Thermoregulation analysis:")
print(f"  Red panda BMR: {rp['bmr']:.1f} W")
print(f"  Surface area:  {rp['surface_area']:.3f} m²")
print(f"  Lower critical temp: {rp['lct']:.1f}°C")
print(f"  At -10°C: metabolic rate = {rp['metabolic_rate'][np.argmin(np.abs(temps+10))]:.1f} W ({rp['metabolic_rate'][np.argmin(np.abs(temps+10))]/rp['bmr']:.1f}x BMR)")
print(f"  Without fur at -10°C: {rp_naked['metabolic_rate'][np.argmin(np.abs(temps+10))]:.1f} W ({rp_naked['metabolic_rate'][np.argmin(np.abs(temps+10))]/rp['bmr']:.1f}x BMR)")
print()
print("Fur reduces metabolic cost at -10°C by {:.0f}%".format(
    100 * (1 - rp['metabolic_rate'][np.argmin(np.abs(temps+10))] /
           rp_naked['metabolic_rate'][np.argmin(np.abs(temps+10))])))`,
      challenge: 'Model the tail-wrapping behavior: when the red panda wraps its tail around itself, surface area decreases by 30%. Add this to the model and compute how much metabolic energy it saves over an 8-hour cold night at -10°C.',
      successHint: 'Thermoregulation is where physics meets biology. Every adaptation — fur thickness, body size, behavioral postures — can be understood as an engineering solution to the heat balance equation.',
    },
    {
      title: 'Counter-current heat exchange — the engineering of warm blood',
      concept: `The red panda walks on snow with bare foot pads. Why don\'t its feet freeze? The answer is **counter-current heat exchange** — one of evolution's most elegant engineering solutions.

In the legs of many mammals, arteries carrying warm blood from the core run parallel and close to veins carrying cold blood back from the extremities. Heat transfers from the warm artery to the cool vein through the vessel walls:

- At the **proximal end** (near body): artery is 37°C, vein warms to ~35°C
- At the **distal end** (near feet): artery cools to ~5°C, vein is ~3°C

The result: the foot receives just enough blood to prevent tissue death (~5°C), but very little heat escapes to the environment. Without this system, the artery would deliver 37°C blood to the foot, which would radiate that heat to the snow — massive energy waste.

The mathematics: heat transfer rate Q = U × A × ΔT, where U is the heat transfer coefficient, A is the exchange surface area, and ΔT is the temperature difference. In a counter-current system, ΔT is maintained along the entire length, unlike a co-current system where ΔT drops to zero as temperatures equilibrate.

Counter-current systems achieve **much higher efficiency** than co-current systems — the same principle is used in industrial heat exchangers, HVAC systems, and even CPU cooling.`,
      analogy: 'Imagine two trains passing each other on parallel tracks, one carrying hot coffee and the other carrying iced tea. If they pass in opposite directions (counter-current), the coffee train starts hot and gradually cools while the tea train starts cold and gradually warms — heat transfers efficiently the entire length. If they traveled the same direction (co-current), they would quickly reach the same temperature and stop exchanging heat. Counter-current keeps the gradient going.',
      storyConnection: 'The red panda in the story walked barefoot across snowy branches without flinching. Children reading the story might wonder how. The answer is counter-current heat exchange in its legs — arterial blood arrives at the paw just warm enough to prevent frostbite, but the system recovers most of the heat before it escapes to the snow.',
      checkQuestion: 'If you could magically remove the counter-current system (separate the arteries from the veins in the legs), what would happen to the red panda on a cold day?',
      checkAnswer: 'Two things: (1) the feet would receive 37°C blood, feel warm, but radiate enormous heat to the environment — the animal would burn through its energy reserves rapidly. (2) Cold blood would return to the core without being pre-warmed, cooling the vital organs. The animal would face both energy depletion AND core cooling. Counter-current exchange solves both problems simultaneously.',
      codeIntro: 'Simulate counter-current vs co-current heat exchange in a red panda\'s leg, computing temperature profiles and energy efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def heat_exchange_simulation(mode='counter', n_segments=100, T_artery_in=37.0,
                              T_vein_in=2.0, U=50.0, vessel_length=0.3):
    """
    Simulate heat exchange between artery and vein along a limb.

    mode: 'counter' (opposing flow) or 'co' (same direction)
    U: heat transfer coefficient (W/m²/°C)
    """
    dx = vessel_length / n_segments
    contact_area_per_seg = 0.001 * dx  # m² per segment

    T_art = np.zeros(n_segments + 1)
    T_ven = np.zeros(n_segments + 1)

    if mode == 'counter':
        # Artery flows proximal -> distal (index 0 -> N)
        # Vein flows distal -> proximal (index N -> 0)
        T_art[0] = T_artery_in

        # Iterative solution (Gauss-Seidel style)
        T_ven[-1] = T_vein_in  # vein enters at distal end

        for iteration in range(200):  # converge
            old_art = T_art.copy()
            for i in range(n_segments):
                Q = U * contact_area_per_seg * (T_art[i] - T_ven[i+1])
                T_art[i+1] = T_art[i] - Q / 0.01  # flow rate effect
                T_art[i+1] = max(T_art[i+1], T_vein_in)

            for i in range(n_segments-1, -1, -1):
                Q = U * contact_area_per_seg * (T_art[i] - T_ven[i])
                T_ven[i] = T_ven[i+1] - Q / 0.01
                T_ven[i] = min(T_ven[i], T_artery_in)

            if np.max(np.abs(T_art - old_art)) < 0.01:
                break
    else:
        # Co-current: both flow same direction (proximal -> distal)
        T_art[0] = T_artery_in
        T_ven[0] = T_vein_in

        for i in range(n_segments):
            Q = U * contact_area_per_seg * (T_art[i] - T_ven[i])
            T_art[i+1] = T_art[i] - Q / 0.01
            T_ven[i+1] = T_ven[i] + Q / 0.01

    positions = np.linspace(0, vessel_length * 100, n_segments + 1)  # in cm
    return positions, T_art, T_ven

# Run both modes
pos_cc, art_cc, ven_cc = heat_exchange_simulation('counter')
pos_co, art_co, ven_co = heat_exchange_simulation('co')

# Also simulate different U values (insulation)
_, art_lowU, ven_lowU = heat_exchange_simulation('counter', U=20)
_, art_highU, ven_highU = heat_exchange_simulation('counter', U=100)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Counter-current
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(pos_cc, art_cc, color='#ef4444', linewidth=2.5, label='Artery (→ foot)')
ax.plot(pos_cc, ven_cc, color='#3b82f6', linewidth=2.5, label='Vein (→ body)')
ax.fill_between(pos_cc, art_cc, ven_cc, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Position along leg (cm, body→foot)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Counter-current heat exchange', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(-5, 42)

# Co-current
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(pos_co, art_co, color='#ef4444', linewidth=2.5, label='Artery (→ foot)')
ax.plot(pos_co, ven_co, color='#3b82f6', linewidth=2.5, label='Vein (→ foot)')
ax.fill_between(pos_co, art_co, ven_co, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Position along leg (cm)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Co-current heat exchange (hypothetical)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(-5, 42)

# Efficiency comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Heat lost to environment = heat in artery at foot
heat_lost_cc = art_cc[-1] - 2  # temp at foot minus ambient
heat_lost_co = art_co[-1] - 2
heat_recovered_cc = ven_cc[0] - 2  # vein temp returning to body
heat_recovered_co = ven_co[-1] - 2
eff_cc = 100 * (1 - (art_cc[-1] - 2) / (37 - 2))
eff_co = 100 * (1 - (art_co[-1] - 2) / (37 - 2))

bars = ax.bar(['Counter-current', 'Co-current'], [eff_cc, eff_co],
              color=['#22c55e', '#f59e0b'], edgecolor='none', width=0.5)
ax.set_ylabel('Heat recovery efficiency (%)', color='white')
ax.set_title('Heat recovery efficiency', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, eff in zip(bars, [eff_cc, eff_co]):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{eff:.0f}%', ha='center', color='white', fontsize=14, fontweight='bold')
ax.set_ylim(0, 110)

# Temperature gradient sensitivity
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(pos_cc, art_lowU, '--', color='#ef4444', linewidth=1.5, alpha=0.6, label='Low U (loose vessels)')
ax.plot(pos_cc, art_cc, '-', color='#ef4444', linewidth=2.5, label='Normal U')
ax.plot(pos_cc, art_highU, ':', color='#ef4444', linewidth=1.5, alpha=0.6, label='High U (tight vessels)')
ax.plot(pos_cc, ven_lowU, '--', color='#3b82f6', linewidth=1.5, alpha=0.6)
ax.plot(pos_cc, ven_cc, '-', color='#3b82f6', linewidth=2.5)
ax.plot(pos_cc, ven_highU, ':', color='#3b82f6', linewidth=1.5, alpha=0.6)
ax.set_xlabel('Position along leg (cm)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Effect of vessel proximity (U parameter)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Counter-current heat exchange analysis:")
print(f"  Artery arrives at foot: {art_cc[-1]:.1f}°C (counter) vs {art_co[-1]:.1f}°C (co)")
print(f"  Vein returns to body:   {ven_cc[0]:.1f}°C (counter) vs {ven_co[-1]:.1f}°C (co)")
print(f"  Heat recovery: {eff_cc:.0f}% (counter) vs {eff_co:.0f}% (co)")
print()
print("The red panda's foot stays at ~{:.0f}°C — cold enough to minimize".format(art_cc[-1]))
print("heat loss to snow, but warm enough to prevent tissue damage.")
print("Evolution converged on the same solution as industrial engineers.")`,
      challenge: 'Simulate what happens when the red panda exercises (increases blood flow rate by 3x). The faster flow means less time for heat exchange per segment. Does the foot get warmer? Does efficiency drop? This is why exercising animals can overheat their extremities.',
      successHint: 'Counter-current heat exchange appears in fish gills, whale flippers, bird legs, and the human nasal passages. Once you understand the physics, you see it everywhere — evolution reinvents good engineering repeatedly.',
    },
    {
      title: 'Fur insulation physics — thermal conductivity in biological materials',
      concept: `Red panda fur is a marvel of insulation engineering. Understanding WHY it works requires knowing how heat moves through materials:

**Three modes of heat transfer in fur:**

1. **Conduction**: heat flows through solid hair shafts and trapped air between them. Air is a poor conductor (k = 0.026 W/m/K), so trapping still air is the key to insulation. Fur traps tiny pockets of air, each too small for convection.

2. **Radiation**: warm skin emits infrared radiation that can pass through fur gaps. Dark-pigmented fur absorbs and re-radiates this energy, slowing its escape. The red panda's dark undercoat acts as a radiation shield.

3. **Convection**: wind penetrates fur, replacing trapped warm air with cold air. Guard hairs (the long outer layer) break wind; underfur (dense short layer) holds the air. Wind speed dramatically affects heat loss.

**Effective thermal conductivity** of fur depends on:
- Hair density (fibers/cm²): more hairs = smaller air pockets = less convection
- Hair length (cm): thicker fur layer = longer conduction path
- Wind speed (m/s): wind compresses fur and forces air exchange
- Moisture: wet fur conducts 25x better than dry fur (water k = 0.6 vs air k = 0.026)

The red panda has two fur layers: dense underfur (~800 fibers/cm²) for insulation and long guard hairs for wind and water protection.`,
      analogy: 'Fur insulation works like a down jacket. The down feathers trap tiny pockets of still air — the insulation comes from the AIR, not the feathers themselves. Compress the jacket (wind) and you lose air pockets, losing insulation. Get it wet and water replaces air, and water conducts heat 25 times better. The red panda\'s fur is a down jacket that never needs washing.',
      storyConnection: 'The red panda\'s distinctive reddish-brown fur is described in the story as a beautiful mask. But that fur is functional engineering: the color absorbs solar radiation for warmth during cold mountain days, the dense underfur traps insulating air, and the oily guard hairs shed rain and snow that would destroy the insulation.',
      checkQuestion: 'Why would a wet red panda be in serious danger even at a temperature that is normally comfortable (say 5°C)?',
      checkAnswer: 'Water replaces trapped air in the fur. Since water conducts heat 25x better than air, the effective insulation drops dramatically. At 5°C, dry fur might keep the animal comfortable, but wet fur would make it equivalent to being naked at 5°C — well below the thermoneutral zone. The animal would need to dramatically increase its metabolic rate to compensate, and if it cannot eat enough to fuel that metabolism, hypothermia follows. This is why many mammals have water-repellent guard hairs.',
      codeIntro: 'Model heat transfer through fur: compute effective thermal conductivity as a function of fur properties, wind, and moisture.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def fur_thermal_model(fur_length_cm=4.0, hair_density=800, wind_speed=0.0,
                      wetness=0.0, T_skin=37.0, T_ambient=0.0):
    """
    Compute effective thermal conductivity and heat loss through fur.

    Parameters:
    - fur_length_cm: total fur thickness
    - hair_density: fibers per cm²
    - wind_speed: m/s (compresses fur, forces convection)
    - wetness: 0.0 (dry) to 1.0 (saturated)
    - T_skin, T_ambient: temperatures in °C
    """
    k_air = 0.026    # W/m/K
    k_hair = 0.26    # W/m/K (keratin)
    k_water = 0.60   # W/m/K
    hair_diameter = 0.005  # cm
    surface_area = 0.1 * (5.0 ** 0.67)  # m² for 5 kg animal

    # Volume fraction of hair vs air
    hair_area_fraction = hair_density * np.pi * (hair_diameter/2)**2  # fraction of cross-section that is hair
    hair_area_fraction = min(hair_area_fraction, 0.8)
    air_fraction = 1 - hair_area_fraction

    # Wind effect: compresses fur, reduces effective length
    wind_compression = 1.0 / (1.0 + 0.3 * wind_speed)
    effective_length = fur_length_cm * wind_compression / 100  # meters

    # Wind-forced convection in fur
    wind_convection_boost = 1.0 + 0.5 * wind_speed  # multiplier on air conductivity

    # Effective conductivity of air-hair matrix
    k_fluid = k_air * (1 - wetness) + k_water * wetness
    k_effective = (hair_area_fraction * k_hair +
                   air_fraction * k_fluid * wind_convection_boost)

    # Heat flux (W/m²)
    heat_flux = k_effective * (T_skin - T_ambient) / effective_length

    # Total heat loss (W)
    total_heat_loss = heat_flux * surface_area

    return {
        'k_effective': k_effective,
        'heat_flux': heat_flux,
        'total_heat_loss': total_heat_loss,
        'effective_length_cm': effective_length * 100,
        'wind_compression': wind_compression,
    }

# Experiment 1: Fur thickness
thicknesses = np.linspace(0.5, 8, 50)
loss_by_thickness = [fur_thermal_model(fur_length_cm=t)['total_heat_loss'] for t in thicknesses]

# Experiment 2: Wind speed
winds = np.linspace(0, 15, 50)
loss_by_wind = [fur_thermal_model(wind_speed=w)['total_heat_loss'] for w in winds]

# Experiment 3: Wetness
wets = np.linspace(0, 1, 50)
loss_by_wet = [fur_thermal_model(wetness=w)['total_heat_loss'] for w in wets]

# Experiment 4: Combined conditions
conditions = [
    ('Calm, dry', 0, 0.0),
    ('Light wind (3 m/s)', 3, 0.0),
    ('Strong wind (10 m/s)', 10, 0.0),
    ('Calm, light rain', 0, 0.3),
    ('Calm, heavy rain', 0, 0.8),
    ('Wind + rain (worst)', 10, 0.8),
]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Fur thickness
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(thicknesses, loss_by_thickness, color='#22c55e', linewidth=2)
ax.axvline(4.0, color='#f59e0b', linestyle='--', label='Red panda (4 cm)')
ax.axhline(fur_thermal_model(fur_length_cm=4.0)['total_heat_loss'],
           color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Fur thickness (cm)', color='white')
ax.set_ylabel('Heat loss at 0°C (W)', color='white')
ax.set_title('Heat loss vs fur thickness', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Wind speed
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(winds, loss_by_wind, color='#3b82f6', linewidth=2)
bmr = 3.5 * (5.0 ** 0.75)
ax.axhline(bmr, color='#ef4444', linestyle='--', label=f'BMR ({bmr:.1f} W)')
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Heat loss at 0°C (W)', color='white')
ax.set_title('Wind chill effect on insulation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Wetness
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(wets * 100, loss_by_wet, color='#a855f7', linewidth=2)
ax.axhline(bmr, color='#ef4444', linestyle='--', label=f'BMR ({bmr:.1f} W)')
ax.set_xlabel('Fur saturation (%)', color='white')
ax.set_ylabel('Heat loss at 0°C (W)', color='white')
ax.set_title('Effect of wet fur on heat loss', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Combined conditions
ax = axes[1, 1]
ax.set_facecolor('#111827')
cond_names = [c[0] for c in conditions]
cond_losses = [fur_thermal_model(wind_speed=c[1], wetness=c[2])['total_heat_loss'] for c in conditions]
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#ef4444']
bars = ax.barh(range(len(conditions)), cond_losses, color=colors, edgecolor='none', height=0.6)
ax.axvline(bmr, color='white', linestyle='--', linewidth=2, label=f'BMR = {bmr:.0f} W')
ax.set_yticks(range(len(conditions)))
ax.set_yticklabels(cond_names, color='white', fontsize=9)
ax.set_xlabel('Heat loss (W)', color='white')
ax.set_title('Heat loss under different conditions', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
for bar, loss in zip(bars, cond_losses):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{loss:.0f} W', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

base = fur_thermal_model()
worst = fur_thermal_model(wind_speed=10, wetness=0.8)
print("Fur insulation analysis (at 0°C ambient):")
print(f"  Base (calm, dry):  k_eff={base['k_effective']:.4f} W/m/K, loss={base['total_heat_loss']:.1f} W")
print(f"  Worst case:        k_eff={worst['k_effective']:.4f} W/m/K, loss={worst['total_heat_loss']:.1f} W")
print(f"  Worst/base ratio:  {worst['total_heat_loss']/base['total_heat_loss']:.1f}x more heat loss")
print(f"  BMR:               {bmr:.1f} W")
print()
print(f"  At worst conditions, heat loss is {worst['total_heat_loss']/bmr:.1f}x BMR")
print(f"  The animal would need to increase metabolism by {worst['total_heat_loss']/bmr:.1f}x just to survive.")
print(f"  This is why mountain mammals seek shelter from wind and rain.")`,
      challenge: 'Compare red panda fur (4 cm, 800 fibers/cm²) with polar bear fur (5 cm, 1200 fibers/cm², but hollow hairs that trap extra air). Model hollow hairs by reducing the effective hair conductivity. Which adaptation provides better insulation per gram of fur?',
      successHint: 'You now understand why fur structure matters at the microscopic level. Conservation efforts that understand the physics of survival can better predict which environmental changes will threaten a species.',
    },
    {
      title: 'Phylogenetics — why the red panda is in a family of its own',
      concept: `The red panda was historically classified with raccoons (Procyonidae) and then with bears (Ursidae). Modern molecular phylogenetics placed it in its own unique family: **Ailuridae**. How do biologists determine evolutionary relationships?

**Molecular phylogenetics** compares DNA or protein sequences across species:

1. **Sequence alignment**: line up homologous sequences, inserting gaps where insertions or deletions occurred
2. **Distance computation**: count the number of differences between each pair of species
3. **Tree construction**: build a tree that best explains the observed distances

Common tree-building methods:
- **UPGMA (Unweighted Pair Group Method with Arithmetic mean)**: simple hierarchical clustering. Assumes a molecular clock (equal rates of evolution in all lineages).
- **Neighbor-joining**: relaxes the molecular clock assumption. More accurate for real data.
- **Maximum likelihood**: finds the tree that maximizes the probability of observing the data under a model of sequence evolution.

**Convergent evolution** explains why the red panda looks like a raccoon (facial markings, ringed tail) despite being distantly related — similar environmental pressures produced similar physical solutions independently. The DNA tells the true story.

The red panda diverged from its nearest relatives (weasels and raccoons in superfamily Musteloidea) approximately 40 million years ago — making Ailuridae one of the oldest carnivore families.`,
      analogy: 'Imagine comparing manuscripts of an ancient text copied by different scribes over centuries. Each copy introduces unique errors (mutations). By comparing which errors are shared between copies, you can reconstruct the copying history — which copies were made from which originals. DNA sequences are nature\'s manuscripts, mutations are the copying errors, and phylogenetics reconstructs the family tree.',
      storyConnection: 'The story calls the red panda mysterious — neither bear nor raccoon. That mystery is resolved by phylogenetics. Its DNA sequence distances from bears and raccoons are both large, placing it on its own ancient branch. The red panda\'s uniqueness is not just poetic; it is quantifiable in every nucleotide.',
      checkQuestion: 'If the red panda looks like a raccoon (face mask, ringed tail) but is not closely related, what does this tell us about using physical appearance for classification?',
      checkAnswer: 'Physical appearance (morphology) can be misleading because of convergent evolution — unrelated species can evolve similar features in response to similar environments. The red panda and raccoon both are arboreal, omnivorous, and forest-dwelling, so similar selective pressures produced similar body plans. This is why modern taxonomy relies on molecular data (DNA) rather than morphology alone. The molecules do not lie about evolutionary history.',
      codeIntro: 'Build a phylogenetic tree from DNA sequence distances using UPGMA, showing why the red panda branches off alone.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated genetic distances (substitutions per site) between species
# Based on real phylogenetic relationships in Carnivora
species = [
    'Red panda',      # Ailuridae
    'Giant panda',    # Ursidae
    'Grizzly bear',   # Ursidae
    'Raccoon',        # Procyonidae
    'Coati',          # Procyonidae
    'Weasel',         # Mustelidae
    'Otter',          # Mustelidae
    'Dog',            # Canidae
]

# Distance matrix (symmetric, 0 diagonal)
# Distances reflect real evolutionary relationships
D = np.array([
    [0.00, 0.35, 0.36, 0.28, 0.29, 0.25, 0.26, 0.40],  # Red panda
    [0.35, 0.00, 0.08, 0.34, 0.35, 0.33, 0.34, 0.38],  # Giant panda
    [0.36, 0.08, 0.00, 0.35, 0.36, 0.34, 0.35, 0.39],  # Grizzly
    [0.28, 0.34, 0.35, 0.00, 0.10, 0.22, 0.23, 0.36],  # Raccoon
    [0.29, 0.35, 0.36, 0.10, 0.00, 0.23, 0.24, 0.37],  # Coati
    [0.25, 0.33, 0.34, 0.22, 0.23, 0.00, 0.12, 0.35],  # Weasel
    [0.26, 0.34, 0.35, 0.23, 0.24, 0.12, 0.00, 0.36],  # Otter
    [0.40, 0.38, 0.39, 0.36, 0.37, 0.35, 0.36, 0.00],  # Dog
])

# ---- UPGMA Algorithm ----
def upgma(dist_matrix, names):
    """Build a UPGMA tree from a distance matrix."""
    n = len(names)
    D = dist_matrix.copy()
    clusters = {i: {'name': names[i], 'height': 0, 'members': [i]} for i in range(n)}
    tree = []  # list of (merged_from, merged_to, height)
    active = list(range(n))
    next_id = n

    while len(active) > 1:
        # Find minimum distance pair
        min_d = np.inf
        mi, mj = -1, -1
        for i in range(len(active)):
            for j in range(i+1, len(active)):
                if D[active[i], active[j]] < min_d:
                    min_d = D[active[i], active[j]]
                    mi, mj = i, j

        ci, cj = active[mi], active[mj]
        new_height = min_d / 2

        # Create new cluster
        clusters[next_id] = {
            'name': f'({clusters[ci]["name"]}, {clusters[cj]["name"]})',
            'height': new_height,
            'members': clusters[ci]['members'] + clusters[cj]['members'],
            'left': ci, 'right': cj,
        }
        tree.append((ci, cj, new_height, next_id))

        # Update distance matrix (expand if needed)
        new_D = np.zeros((next_id+1, next_id+1))
        new_D[:D.shape[0], :D.shape[1]] = D
        ni = len(clusters[ci]['members'])
        nj = len(clusters[cj]['members'])
        for k in active:
            if k != ci and k != cj:
                new_D[next_id, k] = (ni * D[ci, k] + nj * D[cj, k]) / (ni + nj)
                new_D[k, next_id] = new_D[next_id, k]
        D = new_D

        active.remove(ci)
        active.remove(cj)
        active.append(next_id)
        next_id += 1

    return clusters, tree

clusters, tree = upgma(D, species)

# ---- Draw the tree ----
fig, axes = plt.subplots(1, 2, figsize=(16, 7))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Distance matrix heatmap
ax = axes[0]
ax.set_facecolor('#111827')
im = ax.imshow(D[:8, :8], cmap='YlOrRd_r', vmin=0, vmax=0.45)
ax.set_xticks(range(8))
ax.set_yticks(range(8))
ax.set_xticklabels([s[:8] for s in species], rotation=45, ha='right', color='white', fontsize=8)
ax.set_yticklabels([s[:8] for s in species], color='white', fontsize=8)
for i in range(8):
    for j in range(8):
        ax.text(j, i, f'{D[i,j]:.2f}', ha='center', va='center',
                color='white' if D[i,j] > 0.25 else 'black', fontsize=7)
ax.set_title('Genetic distance matrix', color='white', fontsize=11)
plt.colorbar(im, ax=ax, label='Substitutions per site')

# Plot 2: UPGMA dendrogram (manual drawing)
ax = axes[1]
ax.set_facecolor('#111827')

# Assign y positions to leaves
leaf_names = species
leaf_y = {i: i for i in range(len(species))}
family_colors = {
    'Red panda': '#ef4444',     # Ailuridae (unique!)
    'Giant panda': '#3b82f6', 'Grizzly bear': '#3b82f6',   # Ursidae
    'Raccoon': '#f59e0b', 'Coati': '#f59e0b',               # Procyonidae
    'Weasel': '#22c55e', 'Otter': '#22c55e',                 # Mustelidae
    'Dog': '#a855f7',                                          # Canidae
}

node_y = {}
node_x = {}

# Leaves
for i, name in enumerate(species):
    node_y[i] = i
    node_x[i] = 0

# Internal nodes
for ci, cj, height, nid in tree:
    y_new = (node_y[ci] + node_y[cj]) / 2
    node_y[nid] = y_new
    node_x[nid] = height

    # Draw horizontal lines from children to their height
    ax.plot([node_x[ci], height], [node_y[ci], node_y[ci]], color='white', linewidth=1.5)
    ax.plot([node_x[cj], height], [node_y[cj], node_y[cj]], color='white', linewidth=1.5)
    # Vertical connector
    ax.plot([height, height], [node_y[ci], node_y[cj]], color='white', linewidth=1.5)

# Label leaves
for i, name in enumerate(species):
    color = family_colors[name]
    ax.text(-0.01, i, f'  {name}', ha='right', va='center', color=color,
            fontsize=10, fontweight='bold')

# Family labels
ax.text(0.21, 1.5, 'Ursidae', color='#3b82f6', fontsize=8, fontstyle='italic')
ax.text(0.21, 3.5, 'Procyonidae', color='#f59e0b', fontsize=8, fontstyle='italic')
ax.text(0.21, 5.5, 'Mustelidae', color='#22c55e', fontsize=8, fontstyle='italic')
ax.text(0.21, 0, 'Ailuridae', color='#ef4444', fontsize=8, fontstyle='italic', fontweight='bold')

ax.set_xlabel('Genetic distance (substitutions/site)', color='white')
ax.set_title('UPGMA phylogenetic tree', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_yticks([])
ax.invert_xaxis()

plt.tight_layout()
plt.show()

# Print tree structure
print("UPGMA phylogenetic tree:")
print("  Merge order and divergence times:")
for ci, cj, height, nid in tree:
    n1 = clusters[ci]['name'] if ci < 8 else f"cluster_{ci}"
    n2 = clusters[cj]['name'] if cj < 8 else f"cluster_{cj}"
    mya = height * 200  # rough calibration: 0.2 subs/site ~ 40 MYA
    print(f"  {n1} + {n2} at distance {height:.3f} (~{mya:.0f} MYA)")

print()
print("Key finding: Red panda (Ailuridae) branches off ALONE.")
print("It is not grouped with bears or raccoons.")
print("Closest relatives: Musteloidea (weasels, otters) but still very distant.")
print("This confirms Ailuridae as a distinct, ancient carnivore family.")`,
      challenge: 'Add snow leopard and house cat to the distance matrix. Both are Felidae (cats). The red panda should be equidistant from all cats and all dogs — because it diverged before these families split. Verify this with the UPGMA tree.',
      successHint: 'Phylogenetics resolved a centuries-old classification debate. The red panda is a living fossil — the sole survivor of a once-diverse family that diverged 40 million years ago. Understanding its unique evolutionary position strengthens the case for its conservation.',
    },
    {
      title: 'Convergent evolution — when unrelated species invent the same solution',
      concept: `The red panda looks like a raccoon (face mask, ringed tail, arboreal lifestyle) but is not closely related. This is **convergent evolution** — the independent evolution of similar traits in unrelated lineages due to similar selective pressures.

Convergent evolution is powerful evidence that natural selection is not random — it consistently finds the same solutions to the same problems:

- **Eye**: evolved independently 40+ times (vertebrates, cephalopods, insects, box jellyfish)
- **Wings**: birds, bats, insects, pterosaurs — four independent origins of flight
- **Echolocation**: bats and dolphins evolved it independently, using remarkably similar neural circuits
- **Bamboo diet**: red panda and giant panda both evolved a pseudo-thumb (enlarged radial sesamoid bone) for gripping bamboo — from completely different starting points

We can quantify convergence using **phenotypic distance** vs **phylogenetic distance**:
- **Convergent**: phenotypically similar but phylogenetically distant (red panda ↔ raccoon)
- **Divergent**: phenotypically different but phylogenetically close (human ↔ chimpanzee)
- **Parallel**: closely related species evolving in the same direction (Darwin's finches)

The C-index measures convergence: C = 1 - (phenotypic distance / phylogenetic distance). High C means strong convergence.`,
      analogy: 'Imagine engineers in different countries, with no communication, independently designing cars. They would all converge on similar solutions: 4 wheels, steering wheel, engine in front, seats facing forward. Not because they copied each other, but because physics and human ergonomics constrain the design. Evolution works the same way — similar ecological niches produce similar body plans.',
      storyConnection: 'The mask on the red panda\'s face echoes the raccoon\'s mask, yet they are separated by 40 million years of independent evolution. Both face the same challenge: being small, arboreal omnivores in forested habitats. The mask likely serves the same function in both — reducing glare, aiding night vision, or serving as a species-recognition signal — evolved twice from scratch.',
      checkQuestion: 'The giant panda and the red panda both have a "pseudo-thumb" for gripping bamboo. If this evolved independently, what would you expect to find if you compared the genes controlling thumb development?',
      checkAnswer: 'You would expect DIFFERENT genetic pathways producing the same structural outcome. And that is exactly what researchers found: different genes, different developmental mechanisms, same functional result. This is the hallmark of true convergence — same problem, same solution, different molecular implementation. If the same genes were involved, it might suggest a shared ancestral trait (homology) rather than convergence.',
      codeIntro: 'Quantify convergent evolution: compute phenotypic similarity vs phylogenetic distance for multiple species pairs and identify true convergence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Species data: phenotypic traits and phylogenetic distances
species_pairs = [
    # (Species A, Species B, traits_A, traits_B, phylo_distance, relationship)
    # Traits: [body_mass_log, diet_score, arboreality, face_mask, tail_rings, pseudo_thumb]
    ('Red panda', 'Raccoon',
     [0.7, 0.6, 0.9, 1.0, 1.0, 1.0],
     [0.8, 0.7, 0.8, 1.0, 1.0, 0.0],
     0.28, 'Convergent'),

    ('Red panda', 'Giant panda',
     [0.7, 0.6, 0.9, 1.0, 1.0, 1.0],
     [2.0, 0.5, 0.1, 1.0, 0.0, 1.0],
     0.35, 'Convergent (pseudo-thumb)'),

    ('Giant panda', 'Grizzly bear',
     [2.0, 0.5, 0.1, 1.0, 0.0, 1.0],
     [2.3, 0.7, 0.1, 0.0, 0.0, 0.0],
     0.08, 'Divergent'),

    ('Raccoon', 'Coati',
     [0.8, 0.7, 0.8, 1.0, 1.0, 0.0],
     [0.6, 0.6, 0.7, 0.5, 1.0, 0.0],
     0.10, 'Parallel'),

    ('Weasel', 'Otter',
     [0.3, 0.9, 0.3, 0.0, 0.0, 0.0],
     [1.0, 0.95, 0.0, 0.0, 0.0, 0.0],
     0.12, 'Divergent'),

    ('Bat', 'Bird',
     [0.1, 0.5, 0.0, 0.0, 0.0, 0.0],
     [0.2, 0.5, 0.0, 0.0, 0.0, 0.0],
     0.50, 'Convergent (flight)'),

    ('Dolphin', 'Shark',
     [2.5, 1.0, 0.0, 0.0, 0.0, 0.0],
     [2.3, 1.0, 0.0, 0.0, 0.0, 0.0],
     0.80, 'Convergent (streamlining)'),
]

# Compute phenotypic and phylogenetic distances
pheno_dists = []
phylo_dists = []
labels = []
categories = []

for sp_a, sp_b, traits_a, traits_b, phylo_d, cat in species_pairs:
    pheno_d = np.sqrt(np.sum((np.array(traits_a) - np.array(traits_b))**2))
    pheno_dists.append(pheno_d)
    phylo_dists.append(phylo_d)
    labels.append(f'{sp_a} vs\n{sp_b}')
    categories.append(cat)

pheno_dists = np.array(pheno_dists)
phylo_dists = np.array(phylo_dists)

# Convergence index: C = 1 - (pheno_dist / expected_pheno_at_phylo_dist)
# Expected: pheno_dist proportional to phylo_dist under neutral evolution
expected_pheno = phylo_dists * (pheno_dists.max() / phylo_dists.max())
C_index = 1 - pheno_dists / (expected_pheno + 0.01)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Phenotypic vs phylogenetic distance
ax = axes[0, 0]
ax.set_facecolor('#111827')
color_map = {'Convergent': '#ef4444', 'Convergent (pseudo-thumb)': '#f59e0b',
             'Divergent': '#3b82f6', 'Parallel': '#22c55e',
             'Convergent (flight)': '#ef4444', 'Convergent (streamlining)': '#ef4444'}
for i, (pd, phd, lab, cat) in enumerate(zip(pheno_dists, phylo_dists, labels, categories)):
    c = color_map.get(cat, 'gray')
    ax.scatter(phd, pd, s=120, color=c, edgecolors='white', linewidth=1, zorder=3)
    ax.annotate(lab, (phd, pd), textcoords="offset points", xytext=(8, 5),
                fontsize=7, color='white')

# Neutral expectation line
x_line = np.linspace(0, 0.9, 100)
ax.plot(x_line, x_line * 3, '--', color='gray', alpha=0.5, label='Neutral expectation')
ax.fill_between(x_line, x_line * 1, x_line * 3, alpha=0.05, color='white')
ax.set_xlabel('Phylogenetic distance', color='white')
ax.set_ylabel('Phenotypic distance', color='white')
ax.set_title('Convergence detection', color='white', fontsize=11)
ax.text(0.6, 0.5, 'CONVERGENT\n(similar despite\ndistant ancestry)', color='#ef4444',
        fontsize=8, fontstyle='italic')
ax.text(0.05, 2.0, 'DIVERGENT\n(different despite\nclose ancestry)', color='#3b82f6',
        fontsize=8, fontstyle='italic')
ax.tick_params(colors='gray')

# Convergence index
ax = axes[0, 1]
ax.set_facecolor('#111827')
bar_colors = [color_map.get(c, 'gray') for c in categories]
bars = ax.barh(range(len(C_index)), C_index, color=bar_colors, edgecolor='none', height=0.6)
ax.set_yticks(range(len(labels)))
ax.set_yticklabels(labels, color='white', fontsize=8)
ax.axvline(0, color='gray', linestyle='-', linewidth=0.5)
ax.set_xlabel('Convergence index (C)', color='white')
ax.set_title('Convergence index by species pair', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Trait comparison: Red panda vs Raccoon vs Giant panda
ax = axes[1, 0]
ax.set_facecolor('#111827')
trait_names = ['Body mass', 'Diet score', 'Arboreality', 'Face mask', 'Tail rings', 'Pseudo-thumb']
rp_traits = [0.7, 0.6, 0.9, 1.0, 1.0, 1.0]
raccoon_traits = [0.8, 0.7, 0.8, 1.0, 1.0, 0.0]
gp_traits = [2.0, 0.5, 0.1, 1.0, 0.0, 1.0]

x = np.arange(len(trait_names))
width = 0.25
ax.bar(x - width, rp_traits, width, color='#ef4444', label='Red panda', edgecolor='none')
ax.bar(x, raccoon_traits, width, color='#f59e0b', label='Raccoon', edgecolor='none')
ax.bar(x + width, gp_traits, width, color='#3b82f6', label='Giant panda', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(trait_names, rotation=30, ha='right', color='white', fontsize=8)
ax.set_ylabel('Trait value (normalized)', color='white')
ax.set_title('Trait comparison: convergent species', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Convergence timeline
ax = axes[1, 1]
ax.set_facecolor('#111827')
events = [
    (40, 'Red panda lineage diverges', '#ef4444'),
    (35, 'Bears & raccoons split', '#3b82f6'),
    (25, 'Red panda adapts to bamboo', '#ef4444'),
    (20, 'Giant panda adapts to bamboo', '#3b82f6'),
    (15, 'Pseudo-thumb evolves (red panda)', '#ef4444'),
    (8, 'Pseudo-thumb evolves (giant panda)', '#3b82f6'),
    (5, 'Face mask evolves (raccoon)', '#f59e0b'),
]
for mya, event, color in events:
    ax.barh(event, mya, color=color, alpha=0.7, height=0.6)
    ax.text(mya + 0.5, event, f'{mya} MYA', va='center', color='white', fontsize=8)
ax.set_xlabel('Million years ago', color='white')
ax.set_title('Timeline of convergent trait evolution', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)
ax.invert_xaxis()

plt.tight_layout()
plt.show()

print("Convergent evolution analysis:")
print(f"  Red panda vs Raccoon: C = {C_index[0]:.2f} (HIGH convergence — similar looks, distant genes)")
print(f"  Red panda vs Giant panda: C = {C_index[1]:.2f} (pseudo-thumb convergence)")
print(f"  Giant panda vs Grizzly: C = {C_index[2]:.2f} (DIVERGENT — same family, different diet)")
print()
print("The red panda independently evolved:")
print("  1. Raccoon-like face mask and ringed tail (visual convergence)")
print("  2. Giant panda-like pseudo-thumb (functional convergence)")
print("  3. Both are bamboo feeders despite 40 MY divergence")`,
      challenge: 'Add 3 more convergent pairs: (1) dolphins and ichthyosaurs (streamlined body), (2) cacti and euphorbs (succulent stems), (3) marsupial and placental moles. The trait vectors should show high phenotypic similarity but large phylogenetic distance.',
      successHint: 'Convergent evolution is one of the strongest arguments for natural selection as a predictable force. When the same solution evolves independently in different lineages, it tells us the solution is optimal — not accidental.',
    },
    {
      title: 'IUCN threat assessment — quantifying extinction risk',
      concept: `The red panda is classified as **Endangered** on the IUCN Red List. But how is that classification determined? The **IUCN Red List Categories and Criteria** provide a rigorous, quantitative framework:

**Five quantitative criteria** (any one is sufficient for listing):

- **Criterion A**: Population size reduction (>50% decline in 10 years → Endangered)
- **Criterion B**: Geographic range size (extent of occurrence <5000 km² AND fragmented → Endangered)
- **Criterion C**: Small population size (<2500 mature individuals AND declining → Endangered)
- **Criterion D**: Very small population (<250 mature individuals → Endangered)
- **Criterion E**: Quantitative analysis predicts >20% probability of extinction within 20 years → Endangered

The categories, from least to most threatened:
LC (Least Concern) → NT (Near Threatened) → VU (Vulnerable) → EN (Endangered) → CR (Critically Endangered) → EW (Extinct in Wild) → EX (Extinct)

For the red panda:
- Population: ~10,000 mature individuals (Criterion C)
- Range: fragmented across Nepal, India, Bhutan, Myanmar, China
- Decline: ~50% over 3 generations (~18 years) due to habitat loss
- Primary threats: deforestation, bamboo die-off, poaching, climate change

The assessment combines quantitative thresholds with population viability analysis (PVA) — a simulation of future population trajectories under different scenarios.`,
      analogy: 'The IUCN system is like a hospital triage system for species. Just as ER doctors use vital signs (blood pressure, heart rate, oxygen level) with specific thresholds to categorize patients (stable, serious, critical), the IUCN uses population metrics with specific thresholds to categorize species. Both systems must be standardized and quantitative so that different assessors reach the same conclusion.',
      storyConnection: 'The red panda in the story lives in a shrinking forest. The IUCN assessment quantifies that shrinkage: how many individuals remain, how fast the population is declining, and how fragmented their habitat has become. Without these numbers, conservation is guesswork. With them, governments can prioritize which species need immediate intervention.',
      checkQuestion: 'A species has 3000 mature individuals, no observed decline, and a large continuous range. Which IUCN category does it qualify for under the criteria?',
      checkAnswer: 'Likely Least Concern (LC). Criterion C requires <2500 AND decline for Endangered, so 3000 with no decline does not qualify. Criterion B requires small range AND fragmentation, which a large continuous range does not meet. Criterion A requires observed decline. None of the criteria for threatened categories are met. However, "Near Threatened" might apply if the species is close to a threshold — say if population is expected to drop below 2500 soon.',
      codeIntro: 'Build an IUCN threat assessment tool: evaluate species against all five criteria and simulate population viability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class IUCNAssessment:
    """Evaluate a species against IUCN Red List criteria."""

    def __init__(self, name, population, pop_trend_pct, generation_years,
                 extent_km2, area_km2, n_locations, fragmented,
                 decline_rate_per_year=None):
        self.name = name
        self.population = population
        self.pop_trend_pct = pop_trend_pct  # % change over 3 generations
        self.gen_years = generation_years
        self.extent = extent_km2       # extent of occurrence
        self.area = area_km2           # area of occupancy
        self.n_locations = n_locations
        self.fragmented = fragmented
        if decline_rate_per_year is None:
            self.annual_decline = 1 - (1 + pop_trend_pct/100) ** (1/(3*generation_years))
        else:
            self.annual_decline = decline_rate_per_year

    def criterion_a(self):
        """Population reduction over 3 generations."""
        decline = -self.pop_trend_pct
        if decline >= 80: return 'CR'
        if decline >= 50: return 'EN'
        if decline >= 30: return 'VU'
        if decline >= 20: return 'NT'
        return 'LC'

    def criterion_b(self):
        """Geographic range."""
        # B1: Extent of occurrence
        if self.extent < 100 and self.fragmented: return 'CR'
        if self.extent < 5000 and self.fragmented: return 'EN'
        if self.extent < 20000 and self.fragmented: return 'VU'
        # B2: Area of occupancy
        if self.area < 10 and self.fragmented: return 'CR'
        if self.area < 500 and self.fragmented: return 'EN'
        if self.area < 2000 and self.fragmented: return 'VU'
        return 'LC'

    def criterion_c(self):
        """Small population + decline."""
        declining = self.pop_trend_pct < 0
        if self.population < 250 and declining: return 'CR'
        if self.population < 2500 and declining: return 'EN'
        if self.population < 10000 and declining: return 'VU'
        return 'LC'

    def criterion_d(self):
        """Very small population."""
        if self.population < 50: return 'CR'
        if self.population < 250: return 'EN'
        if self.population < 1000: return 'VU'
        return 'LC'

    def criterion_e(self, n_simulations=1000, years=60):
        """Quantitative analysis: extinction probability."""
        extinct_count = 0
        for _ in range(n_simulations):
            pop = float(self.population)
            for y in range(years):
                # Stochastic decline
                growth = -self.annual_decline + np.random.normal(0, 0.05)
                pop = pop * (1 + growth)
                if np.random.random() < 0.02:  # catastrophe (disease, fire)
                    pop *= 0.7
                if pop < 2:  # functional extinction
                    extinct_count += 1
                    break
        p_extinct = extinct_count / n_simulations
        if p_extinct >= 0.50: return 'CR', p_extinct
        if p_extinct >= 0.20: return 'EN', p_extinct
        if p_extinct >= 0.10: return 'VU', p_extinct
        return 'LC', p_extinct

    def overall_assessment(self):
        """Most threatened category across all criteria."""
        order = {'EX': 7, 'EW': 6, 'CR': 5, 'EN': 4, 'VU': 3, 'NT': 2, 'LC': 1}
        results = {
            'A': self.criterion_a(),
            'B': self.criterion_b(),
            'C': self.criterion_c(),
            'D': self.criterion_d(),
        }
        e_cat, e_prob = self.criterion_e()
        results['E'] = e_cat
        worst = max(results.values(), key=lambda x: order.get(x, 0))
        return worst, results, e_prob

# Assess the Red Panda
rp = IUCNAssessment(
    name='Red Panda (Ailurus fulgens)',
    population=10000,
    pop_trend_pct=-50,  # 50% decline over 3 generations
    generation_years=6,
    extent_km2=15000,
    area_km2=3500,
    n_locations=30,
    fragmented=True,
)

overall, criteria, ext_prob = rp.overall_assessment()

# Compare multiple species
assessments = [
    IUCNAssessment('Red Panda', 10000, -50, 6, 15000, 3500, 30, True),
    IUCNAssessment('Giant Panda', 1800, -10, 10, 25000, 5000, 20, True),
    IUCNAssessment('Snow Leopard', 4000, -20, 8, 1800000, 50000, 50, True),
    IUCNAssessment('Amur Leopard', 100, -30, 8, 5000, 2000, 5, True),
    IUCNAssessment('House Cat', 600000000, 5, 5, 100000000, 50000000, 10000, False),
]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Criteria results for red panda
ax = axes[0, 0]
ax.set_facecolor('#111827')
cat_colors = {'CR': '#ef4444', 'EN': '#f59e0b', 'VU': '#eab308', 'NT': '#22c55e', 'LC': '#3b82f6'}
crit_names = list(criteria.keys())
crit_cats = list(criteria.values())
colors = [cat_colors.get(c, 'gray') for c in crit_cats]
bars = ax.bar(crit_names, [{'LC':1,'NT':2,'VU':3,'EN':4,'CR':5}[c] for c in crit_cats],
              color=colors, edgecolor='none', width=0.5)
ax.set_yticks([1,2,3,4,5])
ax.set_yticklabels(['LC', 'NT', 'VU', 'EN', 'CR'], color='white')
ax.set_xlabel('IUCN Criterion', color='white')
ax.set_title(f'Red Panda assessment: {overall}', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, cat in zip(bars, crit_cats):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
            cat, ha='center', color='white', fontweight='bold', fontsize=12)

# Population viability simulation
ax = axes[0, 1]
ax.set_facecolor('#111827')
years = 60
n_sims = 50
for sim in range(n_sims):
    pop = float(rp.population)
    trajectory = [pop]
    for y in range(years):
        growth = -rp.annual_decline + np.random.normal(0, 0.05)
        pop = pop * (1 + growth)
        if np.random.random() < 0.02:
            pop *= 0.7
        pop = max(pop, 0)
        trajectory.append(pop)
    color = '#ef4444' if trajectory[-1] < 100 else '#22c55e'
    ax.plot(range(years+1), trajectory, color=color, alpha=0.2, linewidth=0.8)

ax.axhline(2500, color='#f59e0b', linestyle='--', label='EN threshold (2500)')
ax.axhline(250, color='#ef4444', linestyle='--', label='CR threshold (250)')
ax.set_xlabel('Years from now', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Population viability analysis (50 simulations)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Multi-species comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
sp_names = []
sp_cats = []
for a in assessments:
    o, c, _ = a.overall_assessment()
    sp_names.append(a.name)
    sp_cats.append(o)
sp_colors = [cat_colors.get(c, 'gray') for c in sp_cats]
sp_scores = [{'LC':1,'NT':2,'VU':3,'EN':4,'CR':5}[c] for c in sp_cats]
bars = ax.barh(range(len(sp_names)), sp_scores, color=sp_colors, edgecolor='none', height=0.6)
ax.set_yticks(range(len(sp_names)))
ax.set_yticklabels(sp_names, color='white', fontsize=9)
ax.set_xticks([1,2,3,4,5])
ax.set_xticklabels(['LC', 'NT', 'VU', 'EN', 'CR'], color='white')
ax.set_title('IUCN status comparison', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, cat in zip(bars, sp_cats):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
            cat, va='center', color='white', fontweight='bold')

# Extinction probability
ax = axes[1, 1]
ax.set_facecolor('#111827')
ext_probs = []
for a in assessments:
    _, _, ep = a.overall_assessment()
    ext_probs.append(ep * 100)
bars = ax.barh(range(len(sp_names)), ext_probs, color=sp_colors, edgecolor='none', height=0.6)
ax.set_yticks(range(len(sp_names)))
ax.set_yticklabels(sp_names, color='white', fontsize=9)
ax.set_xlabel('Extinction probability in 60 years (%)', color='white')
ax.set_title('Extinction risk (Criterion E)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.axvline(20, color='#f59e0b', linestyle='--', alpha=0.5, label='EN threshold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("IUCN Red List Assessment: Red Panda")
print("=" * 50)
print(f"  Overall status: {overall}")
print(f"  Criterion A (population decline): {criteria['A']}")
print(f"  Criterion B (geographic range):   {criteria['B']}")
print(f"  Criterion C (small + declining):  {criteria['C']}")
print(f"  Criterion D (very small):         {criteria['D']}")
print(f"  Criterion E (extinction prob):    {criteria['E']} ({ext_prob*100:.1f}%)")
print()
print("The red panda qualifies as Endangered under Criteria A and C.")
print("Primary drivers: habitat loss, fragmentation, and population decline.")`,
      challenge: 'Model a conservation intervention: what if habitat loss is halted (decline rate reduced by half) and a captive breeding program adds 200 individuals per decade? Rerun the PVA and see how the extinction probability changes. This is how conservation plans are evaluated.',
      successHint: 'The IUCN Red List is the world\'s most comprehensive inventory of species conservation status. Understanding its quantitative criteria allows you to evaluate any species — and to design interventions that move species from Endangered toward Least Concern.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Conservation Biologist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real biology simulations. Click to start.</p>
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
