import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TinyFrogLevel3() {
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
      title: 'Allometry and scaling laws — size shapes everything',
      concept: `**Allometry** is the study of how biological traits scale with body size. When an organism gets larger or smaller, its properties do not scale linearly — they follow **power laws**: Y = a * M^b, where Y is the trait, M is body mass, a is a normalization constant, and b is the **scaling exponent**.

The key insight is that different traits scale with different exponents:
- **Length** scales as M^(1/3) — a 10x heavier animal is about 2.15x longer
- **Surface area** scales as M^(2/3) — it increases more slowly than volume
- **Metabolic rate** scales as M^(3/4) — Kleiber's law, one of biology's most universal patterns
- **Heart rate** scales as M^(-1/4) — smaller animals have faster hearts
- **Lifespan** scales as M^(1/4) — larger animals tend to live longer

These power laws emerge from the **fractal geometry of biological distribution networks** (blood vessels, airways, xylem). The same mathematical framework explains why a mouse's heart beats 600 times per minute while an elephant's beats 30 times — and why a frog the size of a fingernail has physiological challenges that a bullfrog never faces.

For tiny frogs (like *Paedophryne amauensis* at 7.7 mm), miniaturization pushes them to the extreme edge of vertebrate scaling laws, creating unique constraints on their physiology, anatomy, and behavior.`,
      analogy: 'Scaling laws are like resizing a photograph. If you shrink a photo to half its width, the width halves but the area drops to one-quarter — different scaling exponents for length (1) and area (2). Biology works the same way: shrinking an animal by half in length shrinks its weight by 8x (cube law) but its skin by only 4x (square law). This mismatch creates the problems tiny frogs face.',
      storyConnection: 'The tiny frogs of NE India — species like Nyctibatrachus minimus from the Western Ghats and miniaturized species from Meghalaya — live at the edge of vertebrate possibility. Their size, sometimes under 10 mm, means they face physical constraints that most frogs never encounter: desiccation from high surface-area-to-volume ratios, prey limitation (only the smallest invertebrates fit in their mouths), and sound transmission challenges for mating calls.',
      checkQuestion: 'If a frog is 10x lighter than another frog, by what factor do their metabolic rates differ according to Kleiber\'s law?',
      checkAnswer: 'Kleiber\'s law: metabolic rate = a * M^0.75. If M2 = M1/10, then BMR2/BMR1 = (M1/10)^0.75 / M1^0.75 = (1/10)^0.75 = 10^(-0.75) = 0.178. The lighter frog has 17.8% of the heavier frog\'s metabolic rate. But per gram of body weight, the lighter frog\'s mass-specific metabolic rate is 10^0.25 = 1.78x higher. Smaller animals burn more energy per gram — they live faster.',
      codeIntro: 'Explore allometric scaling laws across a range of body sizes, from the tiniest frog to the largest amphibian.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Allometric scaling laws for amphibians
# Y = a * M^b

# Body mass range: 0.01g (tiny frog) to 3000g (giant salamander)
mass_g = np.logspace(-2, 3.5, 500)

# Scaling relationships
def metabolic_rate(M): return 10.5 * M**0.75        # mW
def heart_rate(M): return 200 * M**(-0.25)            # bpm
def lifespan(M): return 3.5 * M**0.25                 # years
def sa_to_vol(M): return 6.0 * M**(-0.33)             # cm2/cm3 (approximate)
def brain_mass(M): return 0.1 * M**0.67               # mg
def jump_distance(M): return 5.0 * M**0.33            # cm

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Allometric Scaling Laws in Amphibians', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Real frog data points for overlay
frogs = {
    'P. amauensis': {'mass': 0.01, 'color': '#ef4444'},
    'NE India miniature': {'mass': 0.1, 'color': '#f59e0b'},
    'Tree frog': {'mass': 5, 'color': '#22c55e'},
    'Bullfrog': {'mass': 500, 'color': '#3b82f6'},
    'Goliath frog': {'mass': 3200, 'color': '#a855f7'},
}

traits = [
    ('Metabolic rate (mW)', metabolic_rate, 0.75),
    ('Heart rate (bpm)', heart_rate, -0.25),
    ('Lifespan (years)', lifespan, 0.25),
    ('SA:Volume ratio', sa_to_vol, -0.33),
    ('Brain mass (mg)', brain_mass, 0.67),
    ('Jump distance (cm)', jump_distance, 0.33),
]

for idx, (title, func, exp) in enumerate(traits):
    ax = axes[idx // 3, idx % 3]
    y_vals = func(mass_g)
    ax.loglog(mass_g, y_vals, color='#22c55e', linewidth=2.5)

    # Mark specific frogs
    for name, info in frogs.items():
        ax.scatter(info['mass'], func(info['mass']), c=info['color'], s=80,
                   zorder=5, edgecolors='white', linewidth=0.5)
        if idx == 0:
            ax.annotate(name, (info['mass'], func(info['mass'])), fontsize=6,
                        color='white', xytext=(5, 5), textcoords='offset points')

    ax.set_xlabel('Body mass (g)', color='white')
    ax.set_ylabel(title, color='white')
    ax.set_title(f'{title}  [M^{exp}]', color='white', fontsize=10)
    ax.grid(True, alpha=0.1)

plt.tight_layout()
plt.show()

# Print specific comparisons
print("Scaling comparison: Tiny frog (0.01g) vs Bullfrog (500g):")
print(f"  Mass ratio: {500/0.01:.0f}x")
for title, func, exp in traits:
    tiny = func(0.01)
    big = func(500)
    print(f"  {title:<25}: {tiny:.2f} vs {big:.2f} (ratio: {big/tiny:.1f}x)")

print(f"\\nPer-gram metabolic rate:")
print(f"  Tiny frog: {metabolic_rate(0.01)/0.01:.0f} mW/g")
print(f"  Bullfrog: {metabolic_rate(500)/500:.2f} mW/g")
print(f"  Tiny frog burns {metabolic_rate(0.01)/0.01 / (metabolic_rate(500)/500):.0f}x more energy per gram!")`,
      challenge: 'Add a seventh trait: call frequency, which scales as M^(-0.33) (smaller frogs call at higher pitches). At what body mass does the call frequency exceed 10 kHz (ultrasonic for some predators)?',
      successHint: 'Allometric scaling laws are among the most universal patterns in biology. They connect physics (geometry, fluid dynamics) to biology (metabolism, lifespan) through elegant power-law relationships.',
    },
    {
      title: 'Surface area to volume ratio — the miniaturization crisis',
      concept: `The most consequential scaling law for tiny animals is the **surface area to volume (SA:V) ratio**. As an organism shrinks, its volume decreases faster than its surface area (volume scales as length^3, area as length^2). The ratio SA:V therefore increases as the animal gets smaller: SA:V proportional to 1/length.

For a tiny frog, the high SA:V ratio creates critical challenges:

**1. Water loss (desiccation)**: Water evaporates through the skin. More skin per unit body mass means faster water loss. A 10mm frog can lose 20% of its body water in under an hour in dry air — lethal for most amphibians. This is why tiny frogs are restricted to permanently humid microhabitats: leaf litter, moss, cloud forests.

**2. Heat exchange**: A high SA:V ratio means the body temperature tracks air temperature almost instantly. Tiny frogs cannot thermoregulate — they are at the mercy of their microclimate. Even a brief exposure to direct sunlight can be fatal.

**3. Gas exchange**: Amphibians breathe partly through their skin (cutaneous respiration). High SA:V actually helps here — more skin area per body volume means more efficient gas exchange. Some tiny frogs have reduced lungs or even lost them entirely, relying 100% on skin breathing.

**4. Structural strength**: Bones become proportionally thinner at small sizes. The skeleton must still support the body against gravity, but the cross-sectional area of bones decreases faster than the weight they support. Tiny frogs compensate with reduced ossification (fewer, smaller bones) and paedomorphic features.`,
      analogy: 'Think of ice cubes. A single large ice cube melts slowly in your drink because it has relatively little surface area for its volume. But crush it into tiny pieces and it melts almost instantly — same total ice, but vastly more surface area exposed to the warm liquid. A tiny frog is like crushed ice: its high surface-to-volume ratio means everything happens faster — water loss, heat exchange, gas exchange.',
      storyConnection: 'NE India\'s cloud forests and Shola grasslands provide the permanently humid conditions that tiny frogs require. Humidity rarely drops below 85% in the leaf litter of Meghalaya\'s forests, creating a microclimate where even a 10mm frog can maintain its water balance. The forest is not just habitat — it is life support, keeping the air humid enough for the frog\'s oversized skin to function.',
      checkQuestion: 'A spherical frog (approximation!) has radius r. Its SA:V ratio is 3/r. If you halve the radius, what happens to the SA:V ratio and the desiccation risk?',
      checkAnswer: 'SA:V = 3/r. If r halves (r/2), SA:V = 3/(r/2) = 6/r — it doubles. The frog loses water through its skin twice as fast per unit body mass. But it also has 8x less water reserves (volume = 4/3 * pi * r^3 scales as r^3). Combined: the tiny frog has 2x the relative evaporation rate with 8x less water to lose. It dries out 16x faster in absolute terms. This is why miniaturization imposes hard limits.',
      codeIntro: 'Model the SA:V consequences for tiny frogs: desiccation rates, thermal dynamics, and gas exchange across body sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# SA:V ratio consequences for miniaturized frogs

# Body sizes (snout-vent length in mm)
svl = np.linspace(5, 150, 200)  # 5mm to 150mm
mass = 0.001 * (svl / 10) ** 3  # rough mass in grams (cube of length)

# SA:V ratio (simplified sphere model)
radius = svl / 2
sa = 4 * np.pi * radius**2  # mm^2
volume = 4/3 * np.pi * radius**3  # mm^3
sa_vol = sa / volume  # mm^-1

# 1. Desiccation rate model
# Water loss = evaporation_coeff * surface_area * (1 - humidity)
humidity = 0.80  # 80% relative humidity
evap_coeff = 0.005  # mg water per mm^2 per minute
water_loss_rate = evap_coeff * sa * (1 - humidity)  # mg/min
body_water = volume * 0.001 * 0.8  # 80% of mass is water (in mg)
time_to_20pct_loss = 0.2 * body_water / water_loss_rate  # minutes to lose 20%

# 2. Thermal equilibration time
# tau = rho * c * V / (h * A)
# rho*c ≈ 4.2 J/(cm^3 K), h ≈ 10 W/(m^2 K) for still air
thermal_tau = 4.2e6 * (volume * 1e-9) / (10 * sa * 1e-6) / 60  # minutes

# 3. Cutaneous gas exchange
# O2 uptake through skin proportional to SA
# Metabolic demand proportional to M^0.75
o2_supply = sa  # arbitrary units (proportional to skin area)
o2_demand = mass**0.75 * 1000  # arbitrary units
breathing_ratio = o2_supply / o2_demand  # higher = skin breathing more sufficient

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Surface Area to Volume: The Tiny Frog\'s Challenge', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Specific frog sizes to mark
frog_sizes = {'P. amauensis (7.7mm)': 7.7, 'NE India mini (12mm)': 12,
              'Common frog (40mm)': 40, 'Bullfrog (150mm)': 150}

# SA:V ratio
axes[0, 0].plot(svl, sa_vol, color='#ef4444', linewidth=2.5)
for name, size in frog_sizes.items():
    idx = np.argmin(np.abs(svl - size))
    axes[0, 0].scatter(svl[idx], sa_vol[idx], c='white', s=80, zorder=5)
    axes[0, 0].annotate(name, (svl[idx], sa_vol[idx]), fontsize=6, color='white',
                          xytext=(5, 5), textcoords='offset points')
axes[0, 0].set_xlabel('Body length (mm)', color='white')
axes[0, 0].set_ylabel('SA:V ratio (mm^-1)', color='white')
axes[0, 0].set_title('SA:V increases with miniaturization', color='white', fontsize=10)

# Desiccation time
axes[0, 1].semilogy(svl, time_to_20pct_loss, color='#3b82f6', linewidth=2.5)
axes[0, 1].axhline(60, color='#f59e0b', linestyle='--', alpha=0.7, label='1 hour')
axes[0, 1].axhline(10, color='#ef4444', linestyle='--', alpha=0.7, label='10 minutes')
for name, size in frog_sizes.items():
    idx = np.argmin(np.abs(svl - size))
    axes[0, 1].scatter(svl[idx], time_to_20pct_loss[idx], c='white', s=60, zorder=5)
axes[0, 1].set_xlabel('Body length (mm)', color='white')
axes[0, 1].set_ylabel('Time to 20% water loss (min)', color='white')
axes[0, 1].set_title(f'Desiccation risk at {humidity*100:.0f}% humidity', color='white', fontsize=10)
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Thermal equilibration
axes[0, 2].plot(svl, thermal_tau, color='#f59e0b', linewidth=2.5)
axes[0, 2].axhline(1, color='gray', linestyle='--', alpha=0.5, label='1 minute')
for name, size in frog_sizes.items():
    idx = np.argmin(np.abs(svl - size))
    axes[0, 2].scatter(svl[idx], thermal_tau[idx], c='white', s=60, zorder=5)
axes[0, 2].set_xlabel('Body length (mm)', color='white')
axes[0, 2].set_ylabel('Thermal time constant (min)', color='white')
axes[0, 2].set_title('Temperature equilibration speed', color='white', fontsize=10)
axes[0, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Skin breathing sufficiency
axes[1, 0].plot(svl, breathing_ratio / breathing_ratio.max(), color='#22c55e', linewidth=2.5)
axes[1, 0].axhline(0.5, color='#f59e0b', linestyle='--', alpha=0.7, label='50% skin breathing')
axes[1, 0].set_xlabel('Body length (mm)', color='white')
axes[1, 0].set_ylabel('Skin O2 sufficiency (norm.)', color='white')
axes[1, 0].set_title('Cutaneous respiration efficiency', color='white', fontsize=10)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Humidity sensitivity
humidities = [0.6, 0.7, 0.8, 0.9, 0.95]
for h in humidities:
    wl = evap_coeff * sa * (1 - h)
    t20 = 0.2 * body_water / wl
    axes[1, 1].semilogy(svl, t20, linewidth=1.5, label=f'{h*100:.0f}%')
axes[1, 1].set_xlabel('Body length (mm)', color='white')
axes[1, 1].set_ylabel('Time to 20% water loss (min)', color='white')
axes[1, 1].set_title('Desiccation vs humidity', color='white', fontsize=10)
axes[1, 1].legend(title='Humidity', fontsize=7, title_fontsize=8,
                    facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Summary comparison
sizes = [7.7, 12, 40, 150]
names_short = ['Tiny', 'Mini', 'Common', 'Bull']
metrics = ['SA:V', 'Desic. risk', 'Thermal eq.', 'Skin O2']
values = np.zeros((4, 4))
for i, s in enumerate(sizes):
    idx = np.argmin(np.abs(svl - s))
    values[i] = [sa_vol[idx]/sa_vol.max(), 1/(time_to_20pct_loss[idx]/time_to_20pct_loss.min()),
                  1/max(thermal_tau[idx], 0.01), breathing_ratio[idx]/breathing_ratio.max()]
    values[i] /= values[i].max()

x = np.arange(4)
for i, name in enumerate(names_short):
    axes[1, 2].bar(x + i*0.2 - 0.3, values[i], 0.18,
                    color=['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'][i], label=f'{name} ({sizes[i]}mm)', alpha=0.8)
axes[1, 2].set_xticks(x)
axes[1, 2].set_xticklabels(metrics, fontsize=8, color='white')
axes[1, 2].set_ylabel('Relative magnitude', color='white')
axes[1, 2].set_title('Miniaturization trade-offs', color='white', fontsize=10)
axes[1, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Critical thresholds for tiny frogs:")
print(f"  At 7.7mm, 80% humidity: lethal desiccation in {time_to_20pct_loss[np.argmin(np.abs(svl-7.7))]:.0f} minutes")
print(f"  At 7.7mm, 95% humidity: safe for {time_to_20pct_loss[np.argmin(np.abs(svl-7.7))] * (1-0.8)/(1-0.95):.0f} minutes")
print(f"  Thermal equilibration at 7.7mm: {thermal_tau[np.argmin(np.abs(svl-7.7))]:.1f} minutes")
print(f"  Conclusion: tiny frogs MUST live in >90% humidity microhabitats")`,
      challenge: 'Model what happens during a brief sun exposure: temperature rises from 22C to 35C over 5 minutes. Calculate the body temperature trajectory for a 8mm vs 50mm frog. Which one overheats first?',
      successHint: 'The SA:V ratio governs the fundamental trade-offs of miniaturization. Every tiny animal — frogs, insects, hummingbirds — faces these same physical constraints. The solutions vary, but the physics is universal.',
    },
    {
      title: 'Metabolic rate scaling — Kleiber\'s law',
      concept: `In 1932, Max Kleiber discovered that **basal metabolic rate (BMR) scales as body mass to the 3/4 power** across all animals: BMR = 70 * M^0.75 (in kcal/day, M in kg). This "3/4 power law" has been confirmed across 18 orders of magnitude, from bacteria to blue whales.

**Why 3/4 and not 2/3?** If metabolic rate were limited by heat dissipation through the surface (SA scales as M^(2/3)), the exponent would be 2/3. The actual 3/4 exponent was explained by West, Brown, and Enquist (1997) using **fractal network theory**: biological distribution networks (blood vessels, airways) are fractal-like space-filling networks that optimize transport efficiency. The geometry of these networks produces the 3/4 scaling.

**Consequences for tiny frogs:**
- **Mass-specific metabolic rate** = BMR/M = 70 * M^(-0.25). Smaller animals burn more energy per gram. A 0.01g frog has a mass-specific rate ~18x higher than a 500g bullfrog.
- **Feeding frequency**: tiny frogs must eat more often relative to their body size
- **Energy storage**: with higher metabolic rates and smaller energy reserves, starvation is a constant threat
- **Oxygen demand**: higher per-gram O2 consumption requires efficient gas exchange

Kleiber\'s law also predicts that **total lifetime energy expenditure** is roughly constant per gram across species: small animals live fast and die young, large animals live slow and die old, but the total energy per gram is similar. This is the "rate of living" theory.`,
      analogy: 'Kleiber\'s law is like fuel economy in cars. A motorcycle (small) gets more miles per gallon than a truck (large) — but per unit of engine displacement, the motorcycle actually burns more fuel. Bigger vehicles are more fuel-efficient per unit mass, just like bigger animals. The 3/4 exponent tells you exactly how this efficiency changes with size.',
      storyConnection: 'The tiny frogs of NE India\'s Western Ghats and Eastern Himalayas must feed almost constantly during their active hours. A 0.1g frog needs to consume roughly 5-10% of its body weight daily in insects — the equivalent of a human eating 4-8 kg of food per day. The lush insect fauna of cloud forests makes this possible; in a drier habitat, the frog would starve.',
      checkQuestion: 'If a tiny frog (0.01g) and a bullfrog (500g) both have the same amount of body fat proportional to their mass (say 5%), which one can survive longer without eating?',
      checkAnswer: 'Fat energy = 0.05 * M * 37 kJ/g (fat has ~37 kJ/g). BMR = 70 * M^0.75 kcal/day = 70 * M^0.75 * 4.184 kJ/day. Survival time = fat_energy / BMR. For the tiny frog: (0.05 * 0.01 * 37) / (70 * 0.01^0.75 * 4.184/1000) = 0.0185 / 0.00165 = 11.2 hours. For the bullfrog: (0.05 * 500 * 37) / (70 * 500^0.75 * 4.184/1000) = 925 / 30.95 = 29.9 days. The tiny frog survives 11 hours; the bullfrog survives 30 days. Scale matters enormously for starvation resistance.',
      codeIntro: 'Explore Kleiber\'s law across vertebrates and calculate the metabolic consequences for miniaturized frogs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Kleiber's law: BMR = a * M^0.75
# Universal across life

mass_kg = np.logspace(-5, 4, 500)  # 10mg to 10,000 kg

# BMR in watts (using the universal constant)
bmr_watts = 3.5 * mass_kg**0.75  # approximate, in watts

# Mass-specific metabolic rate
specific_bmr = bmr_watts / mass_kg  # W/kg

# Lifetime energy (total heartbeats ~1.5 billion for all mammals)
heart_rate = 240 * mass_kg**(-0.25)  # bpm
lifespan_years = 11.8 * mass_kg**0.20  # approximate
total_heartbeats = heart_rate * 60 * 24 * 365 * lifespan_years

# Specific animal data points
animals = {
    'P. amauensis frog': {'mass': 1e-5, 'color': '#ef4444'},
    'NE India mini frog': {'mass': 1e-4, 'color': '#f59e0b'},
    'Hummingbird': {'mass': 3e-3, 'color': '#ec4899'},
    'Mouse': {'mass': 0.025, 'color': '#a855f7'},
    'Tree frog': {'mass': 0.005, 'color': '#22c55e'},
    'Bullfrog': {'mass': 0.5, 'color': '#3b82f6'},
    'Cat': {'mass': 4, 'color': '#06b6d4'},
    'Human': {'mass': 70, 'color': '#f97316'},
    'Elephant': {'mass': 5000, 'color': '#64748b'},
}

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle("Kleiber's Law: Metabolic Rate Scaling", color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: BMR vs mass
axes[0, 0].loglog(mass_kg, bmr_watts, color='#22c55e', linewidth=2.5, label='BMR = 3.5 * M^0.75')
for name, d in animals.items():
    axes[0, 0].scatter(d['mass'], 3.5 * d['mass']**0.75, c=d['color'], s=80, zorder=5,
                        edgecolors='white', linewidth=0.5)
    axes[0, 0].annotate(name, (d['mass'], 3.5*d['mass']**0.75), fontsize=5, color='white',
                          xytext=(5, 3), textcoords='offset points')
axes[0, 0].set_xlabel('Body mass (kg)', color='white')
axes[0, 0].set_ylabel('BMR (watts)', color='white')
axes[0, 0].set_title("Kleiber's Law (3/4 power)", color='white', fontsize=10)

# 2: Mass-specific BMR
axes[0, 1].loglog(mass_kg, specific_bmr, color='#ef4444', linewidth=2.5)
for name, d in animals.items():
    sp = 3.5 * d['mass']**0.75 / d['mass']
    axes[0, 1].scatter(d['mass'], sp, c=d['color'], s=80, zorder=5, edgecolors='white', linewidth=0.5)
axes[0, 1].set_xlabel('Body mass (kg)', color='white')
axes[0, 1].set_ylabel('Specific BMR (W/kg)', color='white')
axes[0, 1].set_title('Per-gram metabolic rate (M^-0.25)', color='white', fontsize=10)

# 3: Heart rate
axes[0, 2].loglog(mass_kg, heart_rate, color='#a855f7', linewidth=2.5)
for name, d in animals.items():
    axes[0, 2].scatter(d['mass'], 240*d['mass']**(-0.25), c=d['color'], s=80, zorder=5,
                        edgecolors='white', linewidth=0.5)
axes[0, 2].set_xlabel('Body mass (kg)', color='white')
axes[0, 2].set_ylabel('Heart rate (bpm)', color='white')
axes[0, 2].set_title('Heart rate scaling (M^-0.25)', color='white', fontsize=10)

# 4: Starvation time (5% body fat reserve)
fat_fraction = 0.05
fat_energy_J = fat_fraction * mass_kg * 37e3  # J (37 kJ/g fat)
starvation_hours = fat_energy_J / (bmr_watts * 3600)
axes[1, 0].loglog(mass_kg, starvation_hours / 24, color='#f59e0b', linewidth=2.5)
axes[1, 0].axhline(1, color='#ef4444', linestyle='--', alpha=0.7, label='1 day')
axes[1, 0].axhline(7, color='#f59e0b', linestyle='--', alpha=0.5, label='1 week')
for name, d in animals.items():
    fe = fat_fraction * d['mass'] * 37e3
    sh = fe / (3.5 * d['mass']**0.75 * 3600) / 24
    axes[1, 0].scatter(d['mass'], sh, c=d['color'], s=80, zorder=5, edgecolors='white', linewidth=0.5)
axes[1, 0].set_xlabel('Body mass (kg)', color='white')
axes[1, 0].set_ylabel('Survival without food (days)', color='white')
axes[1, 0].set_title('Starvation resistance (5% fat)', color='white', fontsize=10)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5: Lifetime heartbeats (surprisingly constant)
axes[1, 1].semilogx(mass_kg, total_heartbeats / 1e9, color='#3b82f6', linewidth=2.5)
axes[1, 1].axhline(1.5, color='gray', linestyle='--', alpha=0.5, label='~1.5 billion')
axes[1, 1].set_xlabel('Body mass (kg)', color='white')
axes[1, 1].set_ylabel('Lifetime heartbeats (billions)', color='white')
axes[1, 1].set_title('Total heartbeats (nearly constant!)', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6: Daily food requirement (% body mass)
# Food needed = BMR * 24h / food_energy_density
food_energy = 5  # kJ per gram of insects (average)
daily_food_g = bmr_watts * 86400 / (food_energy * 1000)
daily_food_pct = daily_food_g / (mass_kg * 1000) * 100  # as % body mass

axes[1, 2].semilogx(mass_kg, daily_food_pct, color='#22c55e', linewidth=2.5)
for name, d in animals.items():
    df = 3.5*d['mass']**0.75 * 86400 / (food_energy*1000) / (d['mass']*1000) * 100
    axes[1, 2].scatter(d['mass'], df, c=d['color'], s=80, zorder=5, edgecolors='white', linewidth=0.5)
axes[1, 2].set_xlabel('Body mass (kg)', color='white')
axes[1, 2].set_ylabel('Daily food (% body mass)', color='white')
axes[1, 2].set_title('Relative food requirement', color='white', fontsize=10)
axes[1, 2].set_ylim(0, 50)

plt.tight_layout()
plt.show()

print("Metabolic consequences of miniaturization:")
for name in ['P. amauensis frog', 'Bullfrog', 'Human']:
    m = animals[name]['mass']
    bmr = 3.5 * m**0.75
    hr = 240 * m**(-0.25)
    sp_bmr = bmr / m
    starv = fat_fraction*m*37e3 / (bmr*3600) / 24
    food = bmr*86400/(food_energy*1000)/(m*1000)*100
    print(f"\\n  {name} ({m*1000:.1f}g):")
    print(f"    BMR: {bmr*1000:.2f} mW, Specific: {sp_bmr:.0f} W/kg")
    print(f"    Heart rate: {hr:.0f} bpm")
    print(f"    Starvation time: {starv:.1f} days")
    print(f"    Daily food: {food:.1f}% body mass")`,
      challenge: 'The 3/4 exponent is debated — some researchers argue it should be 2/3. Plot both scaling laws on the same graph and calculate how predictions differ for a 0.01g frog. Does the difference matter for conservation planning?',
      successHint: 'Kleiber\'s law connects the physics of resource distribution networks to the biology of individual organisms. It predicts metabolic rate, heart rate, lifespan, and food requirements from a single number: body mass.',
    },
    {
      title: 'Miniaturization constraints — how small can vertebrates get?',
      concept: `There is a lower limit to vertebrate body size, and the world\'s smallest frogs are very close to it. Several fundamental constraints set this limit:

**1. Nervous system minimum**: A neuron is about 10-50 micrometers in diameter. A functional brain needs thousands of neurons. At some point, the head cannot shrink further without sacrificing essential neural circuits. The tiniest frogs show significant brain simplification — fewer neurons, simpler neural architecture, reduced sensory processing.

**2. Skeletal constraints**: Bones must resist buckling under the animal\'s weight. The minimum bone thickness for structural integrity is about 50-100 micrometers. Tiny frogs show remarkable skeletal reduction: fewer phalanges (toe bones), fused skull bones, reduced or absent ear structures. Some have lost their middle ear entirely.

**3. Reproductive constraints**: Eggs must contain enough yolk to fuel embryonic development. Below a certain size, eggs become too small to produce viable offspring. Tiny frogs lay very few eggs (sometimes just 1-2) that are relatively large compared to the adult.

**4. Sensory constraints**: Eyes need a minimum number of photoreceptors for useful vision. Inner ear structures need minimum dimensions for sound detection. The tiniest frogs have simplified sensory systems — some cannot hear their own species' mating calls.

**5. Physiological constraints**: Kidneys, liver, and other organs have minimum functional sizes. Below these, metabolism cannot be maintained. The tiniest vertebrates show organ simplification and loss.`,
      analogy: 'Miniaturization constraints are like shrinking a smartphone. You can make it thinner and lighter, but at some point the battery is too small to last a day, the screen is too small to read, and the processor overheats because there is no room for cooling. Each component has a minimum functional size. The same is true for organs in a tiny frog.',
      storyConnection: 'When *Paedophryne amauensis* was discovered in Papua New Guinea at 7.7mm, researchers found it had lost its middle ear bones, had a drastically simplified skeleton with fewer than the normal number of fingers and toes, and had a brain that was proportionally enormous (brain scales as M^0.67 while body scales as M^1, so small animals have relatively larger brains). NE Indian mini frogs like *Nyctibatrachus minimus* show similar reductions.',
      checkQuestion: 'If a frog\'s brain scales as M^0.67, what fraction of body mass is brain in a 0.01g frog vs a 500g frog?',
      checkAnswer: 'Brain mass = a * M^0.67. Brain fraction = a * M^0.67 / M = a * M^(-0.33). For the 0.01g frog: fraction proportional to 0.01^(-0.33) = 4.64. For the 500g frog: 500^(-0.33) = 0.126. Ratio: 4.64/0.126 = 36.8x. The tiny frog\'s brain is 37x larger as a fraction of body mass. This means a disproportionate share of the tiny frog\'s energy and structural budget goes to its brain — it literally cannot afford to be stupid.',
      codeIntro: 'Model the minimum viable size for vertebrates by tracking how organ systems approach their functional limits at small body sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Miniaturization constraints model
# For each organ/system, model functionality as body size decreases

svl_mm = np.linspace(3, 200, 500)
mass_g = 0.001 * (svl_mm / 10)**3  # approximate mass

# Constraint functions (1 = fully functional, 0 = non-functional)

# Brain: needs minimum ~10,000 neurons, each ~20um diameter
# Brain volume scales as M^0.67, neuron size is fixed
def brain_function(mass):
    brain_vol_mm3 = 50 * mass**0.67  # mm^3
    min_neurons = 10000
    neuron_vol = (0.02)**3  # 20um = 0.02mm, cube
    min_brain_vol = min_neurons * neuron_vol * 10  # packing factor
    return np.clip(brain_vol_mm3 / min_brain_vol, 0, 1)

# Skeleton: bone cross-section must support weight
def skeleton_function(mass):
    bone_radius = 0.1 * mass**0.33  # mm, scales with length
    min_bone = 0.05  # mm minimum for structural integrity
    return np.clip((bone_radius - min_bone) / (0.5 - min_bone), 0, 1)

# Kidney: minimum nephron count for waste filtration
def kidney_function(mass):
    nephrons = 1000 * mass**0.85  # approximate
    min_nephrons = 50  # rough functional minimum
    return np.clip(nephrons / min_nephrons, 0, 1)

# Eye: minimum retinal cells for useful vision
def eye_function(mass):
    eye_diameter = 0.5 * mass**0.33  # mm
    retinal_cells = np.pi * (eye_diameter/2)**2 / (0.005)**2  # 5um cell spacing
    min_cells = 5000  # rough minimum for pattern recognition
    return np.clip(retinal_cells / min_cells, 0, 1)

# Ear: tympanic membrane needs minimum area for sound detection
def ear_function(mass):
    tym_area = 0.3 * mass**0.67  # mm^2
    min_area = 0.05  # mm^2 minimum
    return np.clip((tym_area - min_area) / (1.0 - min_area), 0, 1)

# Reproduction: egg must contain enough yolk
def reproduction_function(mass):
    egg_mass = 0.03 * mass**0.85  # g
    min_egg = 0.0001  # g minimum viable
    return np.clip(egg_mass / min_egg, 0, 1)

# Calculate all constraints
constraints = {
    'Brain': brain_function(mass_g),
    'Skeleton': skeleton_function(mass_g),
    'Kidney': kidney_function(mass_g),
    'Vision': eye_function(mass_g),
    'Hearing': ear_function(mass_g),
    'Reproduction': reproduction_function(mass_g),
}

# Overall viability = minimum of all constraints (Liebig's law)
overall = np.ones_like(mass_g)
for v in constraints.values():
    overall = np.minimum(overall, v)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Vertebrate Miniaturization Limits', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

# Individual constraints
for idx, (name, values) in enumerate(constraints.items()):
    ax = axes[idx // 3, idx % 3] if idx < 5 else axes[1, 2]
    ax.semilogx(mass_g, values, color=colors[idx], linewidth=2.5, label=name)
    ax.axhline(0.5, color='gray', linestyle='--', alpha=0.3)
    # Mark critical mass (where function drops below 50%)
    below50 = mass_g[values < 0.5]
    if len(below50) > 0:
        critical = below50[-1]
        ax.axvline(critical, color=colors[idx], linestyle=':', alpha=0.5)
        ax.text(critical * 1.5, 0.6, f'Critical: {critical*1000:.1f}mg',
                color=colors[idx], fontsize=8)

    # Mark real frogs
    ax.axvline(0.01, color='white', linestyle=':', alpha=0.3)
    ax.set_xlabel('Body mass (g)', color='white')
    ax.set_ylabel('Functionality (0-1)', color='white')
    ax.set_title(f'{name} constraint', color=colors[idx], fontsize=10, fontweight='bold')

# Replace last panel with overall viability
axes[1, 2].cla()
axes[1, 2].set_facecolor('#111827')
axes[1, 2].tick_params(colors='gray')
for name, values in constraints.items():
    axes[1, 2].semilogx(mass_g, values, linewidth=1, alpha=0.4,
                          color=colors[list(constraints.keys()).index(name)])
axes[1, 2].semilogx(mass_g, overall, color='white', linewidth=3, label='Overall viability')
axes[1, 2].axhline(0.5, color='gray', linestyle='--', alpha=0.5)
axes[1, 2].axvline(0.01, color='#ef4444', linestyle='--', linewidth=2,
                     label='P. amauensis (10mg)')
axes[1, 2].set_xlabel('Body mass (g)', color='white')
axes[1, 2].set_ylabel('Viability', color='white')
axes[1, 2].set_title('OVERALL VIABILITY (Liebig minimum)', color='white', fontsize=11, fontweight='bold')
axes[1, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Find the limiting constraint at each size
print("Miniaturization analysis:")
for mass_test in [0.01, 0.1, 1.0, 10.0, 100.0]:
    idx = np.argmin(np.abs(mass_g - mass_test))
    limiting = min(constraints.items(), key=lambda x: x[1][idx])
    print(f"\\n  At {mass_test}g ({svl_mm[idx]:.0f}mm):")
    for name, vals in constraints.items():
        status = "OK" if vals[idx] > 0.8 else ("STRESSED" if vals[idx] > 0.3 else "FAILING")
        print(f"    {name:<14}: {vals[idx]:.2f} [{status}]")
    print(f"    Limiting factor: {limiting[0]} ({limiting[1][idx]:.2f})")`,
      challenge: 'Add a "lung capacity" constraint that models the minimum lung volume for effective gas exchange. At what body size do lungs become non-functional? This explains why the smallest frogs rely entirely on skin breathing.',
      successHint: 'Miniaturization in biology is constrained by physics, not just evolution. You cannot evolve a vertebrate smaller than the minimum functional size of its essential organs. The tiniest frogs have found the boundary.',
    },
    {
      title: 'Paedomorphosis — staying young to stay small',
      concept: `Many of the world\'s smallest frogs achieve their tiny size through **paedomorphosis** — retaining juvenile features into adulthood. Instead of growing through all developmental stages to reach full adult size, paedomorphic species truncate development, becoming sexually mature while still physically resembling juveniles.

There are two main mechanisms:
- **Progenesis**: development proceeds at normal speed but sexual maturity arrives early, cutting development short. The individual reproduces while still juvenile-sized.
- **Neoteny**: development is slowed overall, so the organism reaches sexual maturity at a normal age but at a juvenile stage (and size).

In miniaturized frogs, paedomorphosis manifests as:
- **Reduced digit count**: fewer phalanges (toe bones) than typical adult frogs
- **Unfused skull bones**: cranial bones remain separate like in tadpoles
- **Simplified ear**: middle ear structures reduced or absent
- **Reduced tooth count**: some species lose teeth entirely
- **Proportionally large head**: juvenile proportions retained (head is large relative to body)

This is not random simplification — it is a predictable developmental pattern. The **developmental trajectory** is a curve through "morphospace" (the space of possible forms). Paedomorphosis shifts the endpoint of development backward along this curve.

The opposite of paedomorphosis is **peramorphosis** — extending development beyond the normal endpoint. Giant salamanders are peramorphic — they continue growing long past the normal adult stage.`,
      analogy: 'Paedomorphosis is like publishing a book before it is fully edited. A normal book goes through drafts, editing, proofreading, and formatting. A paedomorphic book gets published at the first draft stage — it is shorter, less polished, but it reaches the reader faster. The tiny frog skips the final developmental "editing" to reproduce sooner at a smaller size.',
      storyConnection: 'NE India\'s miniaturized frogs (*Nyctibatrachus* and *Raorchestes* species) show classic paedomorphic traits: simplified skeletons, reduced ossification, and proportionally large eyes and heads. These features were first noticed by herpetologists working in the Western Ghats and later confirmed through developmental studies. The frogs are essentially permanent juveniles that can reproduce.',
      checkQuestion: 'Is paedomorphosis the same as being "less evolved"? Explain why or why not.',
      checkAnswer: 'Absolutely not. Paedomorphosis is an evolved strategy — it requires genetic changes that alter developmental timing. It is not a failure to develop; it is a reprogrammed development that produces smaller adults. The genes controlling developmental timing (heterochrony genes) have been positively selected for. Paedomorphic species are as "evolved" as any other species — they have just evolved to develop differently. Calling them "primitive" would be like calling a haiku less sophisticated than a novel — different form, not lesser form.',
      codeIntro: 'Model developmental trajectories and show how paedomorphosis produces miniaturized adults by truncating the normal growth path.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Developmental trajectory model
# Normal development: organism traverses a path through morphospace
# Paedomorphosis: development stops early on this path

# Developmental time (normalized 0 to 1)
dev_time = np.linspace(0, 1, 200)

# Normal frog development trajectory
# Traits: body_size, skull_fusion, digit_count, ear_complexity, tooth_count
def normal_trajectory(t):
    body_size = 100 * (1 - np.exp(-3 * t))  # sigmoid growth to 100%
    skull_fusion = 100 * t**1.5              # late fusion
    digit_count = 20 + 60 * t**0.8          # gradual addition, % of max
    ear_complexity = 10 + 90 * t**2          # very late development
    tooth_count = 100 * t**1.2               # moderate timing
    return np.array([body_size, skull_fusion, digit_count, ear_complexity, tooth_count])

# Paedomorphic frog: same trajectory but truncated at t=0.4
# Progenetic frog: same trajectory but truncated at t=0.5 (slightly further)
truncation_paedo = 0.35
truncation_progenesis = 0.50

# Calculate trajectories
normal = np.array([normal_trajectory(t) for t in dev_time])
paedo_endpoint = normal_trajectory(truncation_paedo)
prog_endpoint = normal_trajectory(truncation_progenesis)

# Neoteny: slowed development (same time, less progress)
def neotenic_trajectory(t):
    nt = normal_trajectory(t * 0.5)  # half the developmental rate
    return nt

neotenic = np.array([neotenic_trajectory(t) for t in dev_time])

trait_names = ['Body size', 'Skull fusion', 'Digit count', 'Ear complexity', 'Tooth count']

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Paedomorphosis: Developmental Trajectories', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Individual trait development
for i in range(5):
    ax = axes[i // 3, i % 3]
    ax.plot(dev_time, normal[:, i], color='#22c55e', linewidth=2.5, label='Normal')
    ax.plot(dev_time, neotenic[:, i], color='#3b82f6', linewidth=2, label='Neotenic', linestyle='--')

    # Mark truncation points
    ax.scatter(truncation_paedo, paedo_endpoint[i], c='#ef4444', s=120, zorder=5,
               marker='*', label='Paedomorphic adult')
    ax.scatter(truncation_progenesis, prog_endpoint[i], c='#f59e0b', s=100, zorder=5,
               marker='D', label='Progenetic adult')
    ax.scatter(1.0, normal[-1, i], c='#22c55e', s=100, zorder=5, marker='o', label='Normal adult')

    ax.set_xlabel('Developmental time (normalized)', color='white')
    ax.set_ylabel(f'{trait_names[i]} (%)', color='white')
    ax.set_title(trait_names[i], color='white', fontsize=10)
    if i == 0:
        ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6th panel: morphospace projection (2 traits)
ax = axes[1, 2]
ax.plot(normal[:, 0], normal[:, 3], color='#22c55e', linewidth=2.5, label='Normal trajectory')
ax.plot(neotenic[:, 0], neotenic[:, 3], color='#3b82f6', linewidth=2, linestyle='--', label='Neotenic')

ax.scatter(paedo_endpoint[0], paedo_endpoint[3], c='#ef4444', s=150, zorder=5,
           marker='*', label='Paedomorphic')
ax.scatter(prog_endpoint[0], prog_endpoint[3], c='#f59e0b', s=120, zorder=5,
           marker='D', label='Progenetic')
ax.scatter(normal[-1, 0], normal[-1, 3], c='#22c55e', s=120, zorder=5,
           marker='o', label='Normal adult')
ax.scatter(neotenic[-1, 0], neotenic[-1, 3], c='#3b82f6', s=120, zorder=5,
           marker='s', label='Neotenic adult')

ax.annotate('', xy=(paedo_endpoint[0], paedo_endpoint[3]),
            xytext=(normal[-1, 0], normal[-1, 3]),
            arrowprops=dict(arrowstyle='->', color='#ef4444', linewidth=2))

ax.set_xlabel('Body size (%)', color='white')
ax.set_ylabel('Ear complexity (%)', color='white')
ax.set_title('Morphospace: size vs ear development', color='white', fontsize=10)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Quantitative comparison
print("Adult trait comparison (% of maximum):")
print(f"{'Trait':<18} {'Normal':>8} {'Progenetic':>10} {'Paedomorphic':>12} {'Neotenic':>10}")
print("-" * 60)
for i, name in enumerate(trait_names):
    print(f"{name:<18} {normal[-1,i]:>7.0f}% {prog_endpoint[i]:>9.0f}% {paedo_endpoint[i]:>11.0f}% {neotenic[-1,i]:>9.0f}%")

print(f"\\nKey insight: paedomorphic frogs are not 'primitive' —")
print(f"they are normally developed organisms that stop developing early.")
print(f"The trajectory is the same; only the endpoint differs.")`,
      challenge: 'Add a "peramorphic" trajectory where development continues to t=1.3 (30% longer than normal). This models giant amphibians like the Chinese giant salamander. Plot it alongside the other trajectories.',
      successHint: 'Paedomorphosis is a powerful evolutionary strategy: by adjusting the timing of development, organisms can rapidly evolve new body sizes and proportions. Heterochrony (changes in developmental timing) is one of the most important mechanisms in morphological evolution.',
    },
    {
      title: 'Biogeography of NE India amphibians',
      concept: `Northeast India is one of the world\'s **amphibian biodiversity hotspots**, hosting over 130 species with high endemism (species found nowhere else). This extraordinary diversity results from the region\'s unique biogeographic position at the convergence of four major biogeographic realms:

**1. Indo-Malayan realm** (from the south): tropical species extending northward from Southeast Asia through Myanmar
**2. Palearctic realm** (from the north): temperate species reaching their southern limit in the Eastern Himalayas
**3. Sino-Japanese realm** (from the east): species from southern China entering through the Indo-Burma corridor
**4. Indian subcontinent** (from the west): Gondwanan relict species that survived on the Indian plate

The **Eastern Himalayas** create extreme elevational gradients: from lowland tropical forest at 100m to alpine meadows at 4,500m within a 50km horizontal distance. Each elevational band hosts distinct amphibian communities. The mountains also create **rain shadows** and **microhabitats**: one valley may be permanently wet while the adjacent valley is dry — driving speciation by geographic isolation.

**Endemism drivers:**
- **Geographic isolation**: deep valleys and high ridges prevent gene flow
- **Habitat heterogeneity**: enormous variation in temperature, moisture, and vegetation
- **Evolutionary age**: the Eastern Himalayas have been uplifting for 50+ million years
- **Climatic stability**: some areas served as Pleistocene refugia during ice ages

Miniaturized frogs are disproportionately endemic because their tiny size restricts dispersal — a 10mm frog cannot cross a dry ridge or a wide river.`,
      analogy: 'NE India\'s amphibian diversity is like a library where four different book collections got shelved together in one building. The Indo-Malayan collection has tropical titles, the Palearctic collection has cold-climate volumes, the Sino-Japanese section has unique eastern editions. Over millions of years, new editions (endemic species) were written that exist only in this library. The building\'s complex architecture (mountains, valleys, rivers) keeps collections partially separated, preventing them from merging.',
      storyConnection: 'The story\'s tiny frog lives in the mossy cloud forests of NE India — one of the most species-rich amphibian habitats on Earth. Within a single hectare of Meghalaya forest, you might find 15-20 frog species, each adapted to a slightly different microhabitat: some in the canopy, some in leaf litter, some near streams, some in tree holes. This microhabitat partitioning is why so many species coexist.',
      checkQuestion: 'Why do mountains create more species diversity than flat terrain of the same area?',
      checkAnswer: 'Mountains create (1) elevational zonation — different climates at different heights, supporting different species, (2) geographic isolation — ridges and valleys separate populations, preventing gene flow and allowing independent evolution, (3) microhabitats — aspect (north vs south facing), moisture gradients, and microclimates create diverse niches in small areas, (4) climatic refugia — during climate shifts, species can move up or down in elevation rather than going extinct. Flat terrain has none of these mechanisms, so it supports fewer species per unit area.',
      codeIntro: 'Model the elevational distribution of amphibian species in NE India and analyze endemism patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Biogeographic model of NE India amphibians

# Elevational gradient: 100m to 4500m
elevations = np.arange(100, 4600, 100)

# Species richness peaks at mid-elevation (the "mid-domain effect" + tropical origin)
def species_richness(elev):
    # Combination of mid-domain effect and declining temperature
    mid_domain = np.exp(-0.5 * ((elev - 1200) / 800)**2) * 35
    tropical_boost = 10 * np.exp(-elev / 2000)
    return mid_domain + tropical_boost + np.random.poisson(3, len(elev))

# Endemism rate increases with elevation (isolated mountaintops)
def endemism_rate(elev):
    return 0.1 + 0.6 * (1 / (1 + np.exp(-(elev - 2000) / 500))) + np.random.uniform(-0.05, 0.05, len(elev))

# Biogeographic realm contributions
def realm_contribution(elev):
    indo_malayan = np.clip(1 - elev / 3000, 0, 1)
    palearctic = np.clip((elev - 2000) / 2000, 0, 1)
    sino_japanese = np.exp(-0.5 * ((elev - 1500) / 600)**2) * 0.6
    indian_plate = np.clip(0.3 - elev / 5000, 0, 0.3)
    total = indo_malayan + palearctic + sino_japanese + indian_plate
    return (indo_malayan / total, palearctic / total, sino_japanese / total, indian_plate / total)

# Body size distribution by elevation
def mean_body_size(elev):
    # Bergmann's rule modified: tiny species at mid-elevation in humid zones
    return 25 + 0.01 * (elev - 800)**2 / 100 + np.random.normal(0, 3, len(elev))

richness = species_richness(elevations)
endemism = endemism_rate(elevations)
body_sizes = mean_body_size(elevations)
realms = realm_contribution(elevations)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Biogeography of NE India Amphibians', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Species richness by elevation
axes[0, 0].fill_between(elevations, richness, color='#22c55e', alpha=0.3)
axes[0, 0].plot(elevations, richness, color='#22c55e', linewidth=2.5)
axes[0, 0].axvline(1200, color='#f59e0b', linestyle='--', alpha=0.7, label='Peak richness zone')
axes[0, 0].set_xlabel('Elevation (m)', color='white')
axes[0, 0].set_ylabel('Species count', color='white')
axes[0, 0].set_title('Species richness peaks at mid-elevation', color='white', fontsize=10)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Endemism rate
axes[0, 1].fill_between(elevations, endemism * 100, color='#a855f7', alpha=0.3)
axes[0, 1].plot(elevations, endemism * 100, color='#a855f7', linewidth=2.5)
axes[0, 1].set_xlabel('Elevation (m)', color='white')
axes[0, 1].set_ylabel('Endemism rate (%)', color='white')
axes[0, 1].set_title('Endemism increases at higher elevations', color='white', fontsize=10)

# 3: Biogeographic realm contributions
axes[0, 2].stackplot(elevations, [r * 100 for r in realms],
                       labels=['Indo-Malayan', 'Palearctic', 'Sino-Japanese', 'Indian plate'],
                       colors=['#ef4444', '#3b82f6', '#f59e0b', '#22c55e'], alpha=0.7)
axes[0, 2].set_xlabel('Elevation (m)', color='white')
axes[0, 2].set_ylabel('Contribution (%)', color='white')
axes[0, 2].set_title('Biogeographic origins', color='white', fontsize=10)
axes[0, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')

# 4: Body size distribution
axes[1, 0].scatter(elevations, body_sizes, c=richness, cmap='viridis', s=30, alpha=0.7)
axes[1, 0].axhline(12, color='#ef4444', linestyle='--', alpha=0.7, label='Miniaturization threshold')
axes[1, 0].set_xlabel('Elevation (m)', color='white')
axes[1, 0].set_ylabel('Mean body size (mm SVL)', color='white')
axes[1, 0].set_title('Body size by elevation', color='white', fontsize=10)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5: Simulated species-area curve for NE India subregions
areas_km2 = np.array([50, 100, 500, 1000, 5000, 10000, 50000, 100000])
# Species-area relationship: S = c * A^z
z = 0.28  # typical for islands/isolated habitats
c = 5.0
species = c * areas_km2**z
regions = ['Single valley', 'Small range', 'District', 'State', 'Meghalaya',
           'NE India (2 states)', 'All NE India', 'NE India + Myanmar']

axes[1, 1].loglog(areas_km2, species, 'o-', color='#f59e0b', linewidth=2, markersize=8)
for i, name in enumerate(regions):
    axes[1, 1].annotate(name, (areas_km2[i], species[i]), fontsize=6, color='white',
                          xytext=(5, 5), textcoords='offset points')
axes[1, 1].set_xlabel('Area (km²)', color='white')
axes[1, 1].set_ylabel('Species count', color='white')
axes[1, 1].set_title('Species-area relationship', color='white', fontsize=10)

# 6: Conservation priority heatmap
priority = richness * endemism * 100  # species * endemism = conservation value
priority_norm = priority / priority.max()
colors_bar = plt.cm.RdYlGn_r(priority_norm)
bars = axes[1, 2].bar(elevations, priority, width=80, color=colors_bar)
axes[1, 2].set_xlabel('Elevation (m)', color='white')
axes[1, 2].set_ylabel('Conservation priority', color='white')
axes[1, 2].set_title('Priority = richness x endemism', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Biogeographic summary:")
peak_idx = np.argmax(richness)
print(f"  Peak richness: {richness[peak_idx]:.0f} species at {elevations[peak_idx]}m")
print(f"  Highest endemism: {endemism.max()*100:.0f}% at {elevations[np.argmax(endemism)]}m")
print(f"  Conservation priority peak: {elevations[np.argmax(priority)]}m")
print(f"\\n  NE India is exceptional because:")
print(f"    - 4 biogeographic realms converge")
print(f"    - 4400m elevational gradient in 50km")
print(f"    - Pleistocene refugia preserved ancient lineages")
print(f"    - >130 amphibian species, ~40% endemic")`,
      challenge: 'Add climate change projections: if isotherms shift upward by 500m, how does the species richness curve change? Which elevational band loses the most species? What happens to the mountaintop endemics?',
      successHint: 'Biogeography explains why biodiversity is not evenly distributed. NE India\'s extraordinary amphibian diversity results from the convergence of history (plate tectonics), geography (mountains), and climate (monsoon). Understanding these patterns is essential for conservation planning.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Scaling Biology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Allometry, metabolic scaling & miniaturization</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biological scaling models. Click to start.</p>
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
