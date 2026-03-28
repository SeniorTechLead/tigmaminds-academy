import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function EriSilkLevel3() {
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
      title: 'Ahimsa silk — the ethics of non-violent silk production',
      concept: `Conventional silk production (sericulture) has an uncomfortable truth: to reel a continuous filament from a Bombyx mori cocoon, the pupa inside is killed by boiling or steaming before the moth can emerge and break the thread. A single silk sari requires killing approximately 50,000 pupae.

**Eri silk** (from Samia ricini) is called **Ahimsa silk** or **peace silk** because the moth is allowed to emerge naturally from the cocoon before the silk is harvested. This is possible because:

1. The Eri silkworm spins an **open-ended cocoon** — unlike Bombyx mori's sealed cocoon, the Eri cocoon has a small opening that the moth uses to exit
2. After emergence, the empty cocoon is collected and the short, broken filaments are **spun** (twisted together) rather than reeled as a continuous thread
3. The resulting yarn has a different texture — more like cotton or wool than the smooth sheen of reeled silk

This creates a real **engineering trade-off**: non-violent production yields a different material. The broken filaments mean lower tensile strength, more texture, and different draping properties. Whether this trade-off is acceptable depends on the application and the values of the producer and consumer.

The ethical dimension connects to a broader question in materials science: **should how a material is produced matter as much as its final properties?**`,
      analogy: 'Consider two identical-looking wooden tables. One was made from old-growth forest timber (the ecosystem was destroyed). The other was made from sustainably managed plantation wood. The tables have the same material properties, but the production process carries different ethical weight. Ahimsa silk poses the same question: is the process part of the product?',
      storyConnection: 'The Eri silkworm (Samia ricini) is deeply embedded in the culture of the Bodo and Mishing communities of Assam. Eri silk garments are not just textiles — they represent a philosophy of coexistence with nature. The warm, woolly Eri shawl carries both physical warmth and an ethical statement.',
      checkQuestion: 'If a company marketed "ahimsa Bombyx mori silk" by letting the moth emerge before harvesting the cocoon, how would the resulting fiber differ from conventional Bombyx silk and from Eri silk?',
      checkAnswer: 'The Bombyx moth would break the continuous filament when emerging (it secretes cocoonase enzyme to dissolve the silk). The resulting short fibers would need to be spun, yielding a texture more like Eri silk than conventional reeled Bombyx. However, the fiber composition would still be Bombyx fibroin (44% glycine, 30% alanine) rather than Eri fibroin (48% alanine, 32% glycine), so the mechanical properties would differ. The product would be a hybrid: Bombyx chemistry with Eri-like processing.',
      codeIntro: 'Quantify the material property differences between conventional (killed-pupa) silk and Ahimsa (moth-emerged) silk processing methods.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Compare reeled (continuous) vs spun (broken) silk fibers
# Reeled: single continuous filament from killed-pupa cocoon
# Spun: short fibers twisted together from moth-emerged cocoon

# Fiber length distributions
reeled_length_m = np.array([400])  # Single 400m filament
spun_lengths_cm = np.random.lognormal(mean=2.5, sigma=0.8, size=500)  # Short fragments

# Mechanical properties comparison
def stress_strain_reeled(strain, strength_MPa=600, modulus_GPa=10, max_strain=18):
    """Continuous filament: higher strength, lower variance."""
    eps = strain / 100
    eps_max = max_strain / 100
    sigma = strength_MPa * (1 - np.exp(-modulus_GPa * 1000 * eps / strength_MPa))
    sigma *= np.clip(1 - (eps / eps_max) ** 2, 0, 1)
    return np.maximum(sigma, 0)

def stress_strain_spun(strain, strength_MPa=350, modulus_GPa=5, max_strain=25):
    """Spun silk: lower strength but more extensible due to fiber slippage."""
    eps = strain / 100
    eps_max = max_strain / 100
    # Spun silk has initial fiber straightening phase
    sigma = strength_MPa * (eps / eps_max) ** 0.7 * np.clip(1 - (eps / eps_max) ** 3, 0, 1)
    return np.maximum(sigma, 0)

strain = np.linspace(0, 30, 300)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Ahimsa Silk: Ethics vs Material Properties',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Stress-strain comparison
ax = axes[0, 0]
stress_r = stress_strain_reeled(strain)
stress_s = stress_strain_spun(strain)
ax.plot(strain, stress_r, color='#ef4444', linewidth=2.5, label='Reeled (killed pupa)')
ax.plot(strain, stress_s, color='#22c55e', linewidth=2.5, label='Spun (Ahimsa)')
ax.fill_between(strain, stress_r, stress_s, alpha=0.1, color='#f59e0b')
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Stress-Strain: Reeled vs Spun', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Property trade-off\\nfor ethical choice', xy=(15, 300),
            color='#f59e0b', fontsize=9, fontweight='bold')

# Plot 2: Fiber length distribution
ax = axes[0, 1]
ax.hist(spun_lengths_cm, bins=40, color='#22c55e', edgecolor='none', alpha=0.8,
        label='Spun silk fibers')
ax.axvline(np.mean(spun_lengths_cm), color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Mean: {np.mean(spun_lengths_cm):.1f} cm')
ax.set_xlabel('Fiber length (cm)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Spun Silk Fiber Length Distribution', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate(f'Reeled: single {400}m\\nfilament (off chart →)',
            xy=(max(spun_lengths_cm) * 0.6, 40), color='#ef4444', fontsize=9)

# Plot 3: Property comparison radar
ax = axes[0, 2]
properties = ['Tensile\\nstrength', 'Softness', 'Drape', 'Warmth', 'Durability', 'Sheen']
reeled_vals = [0.9, 0.5, 0.9, 0.4, 0.8, 0.95]
spun_vals =   [0.5, 0.9, 0.6, 0.9, 0.6, 0.3]
x = np.arange(len(properties))
ax.plot(x, reeled_vals, color='#ef4444', linewidth=2, marker='o', markersize=6, label='Reeled')
ax.plot(x, spun_vals, color='#22c55e', linewidth=2, marker='s', markersize=6, label='Spun (Ahimsa)')
ax.fill_between(x, reeled_vals, alpha=0.1, color='#ef4444')
ax.fill_between(x, spun_vals, alpha=0.1, color='#22c55e')
ax.set_xticks(x)
ax.set_xticklabels(properties, color='white', fontsize=8)
ax.set_ylabel('Score (0-1)', color='white')
ax.set_title('Property Profiles', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Ethical cost per garment
ax = axes[1, 0]
garments = ['Sari', 'Shawl', 'Scarf', 'Shirt']
pupae_killed = [50000, 15000, 5000, 10000]
pupae_survived = [0, 0, 0, 0]  # Ahimsa = 0 killed
x = np.arange(len(garments))
ax.bar(x - 0.15, pupae_killed, 0.3, color='#ef4444', label='Conventional', edgecolor='none')
ax.bar(x + 0.15, pupae_survived, 0.3, color='#22c55e', label='Ahimsa', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(garments, color='white', fontsize=10)
ax.set_ylabel('Pupae killed', color='white')
ax.set_title('Ethical Cost per Garment', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
for i, p in enumerate(pupae_killed):
    ax.text(i - 0.15, p + 1000, f'{p:,}', ha='center', color='white', fontsize=9)

# Plot 5: Global silk production breakdown
ax = axes[1, 1]
types = ['Mulberry\\n(B. mori)', 'Eri\\n(S. ricini)', 'Tasar\\n(A. mylitta)', 'Muga\\n(A. assam.)']
production_tonnes = [150000, 5000, 2000, 150]
colors_silk = ['#e5e7eb', '#22c55e', '#f59e0b', '#fbbf24']
ax.bar(range(len(types)), production_tonnes, color=colors_silk, edgecolor='none', width=0.6)
ax.set_xticks(range(len(types)))
ax.set_xticklabels(types, color='white', fontsize=9)
ax.set_ylabel('Annual production (tonnes)', color='white')
ax.set_yscale('log')
ax.set_title('Global Silk Production by Type', color='white', fontsize=11)
for i, t in enumerate(production_tonnes):
    ax.text(i, t * 1.3, f'{t:,}t', ha='center', color='white', fontsize=9)

# Plot 6: Applications comparison
ax = axes[1, 2]
apps = ['Luxury\\nfashion', 'Thermal\\nwear', 'Medical\\ntextile', 'Upholstery', 'Industrial']
reeled_suit = [0.95, 0.3, 0.7, 0.8, 0.6]
spun_suit =   [0.4, 0.95, 0.8, 0.5, 0.3]
x = np.arange(len(apps))
ax.barh(x - 0.15, reeled_suit, 0.3, color='#ef4444', label='Reeled', edgecolor='none')
ax.barh(x + 0.15, spun_suit, 0.3, color='#22c55e', label='Ahimsa (spun)', edgecolor='none')
ax.set_yticks(x)
ax.set_yticklabels(apps, color='white', fontsize=9)
ax.set_xlabel('Suitability (0-1)', color='white')
ax.set_title('Application Suitability', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Ahimsa Silk: Ethics vs Material Properties")
print("=" * 50)
print()
print("CONVENTIONAL (killed-pupa) silk:")
print(f"  Fiber: continuous filament, 300-500m")
print(f"  Strength: ~600 MPa | Strain: ~18% | Sheen: high")
print(f"  Pupae killed per sari: ~50,000")
print()
print("AHIMSA (moth-emerged) silk:")
print(f"  Fiber: short fragments, 5-30 cm, spun together")
print(f"  Strength: ~350 MPa | Strain: ~25% | Warmth: high")
print(f"  Pupae killed: ZERO")
print()
print("Key insight: Ahimsa silk is not inferior — it is DIFFERENT.")
print("Spun Eri silk excels in warmth, softness, and ethical value.")
print("The 'best' material depends on what you value, not just what you measure.")`,
      challenge: 'Calculate the total number of silkworm lives saved per year if India\'s entire silk industry (32,000 tonnes) switched to Ahimsa production. Assume 50,000 pupae per kg of reeled silk vs 0 for Ahimsa. What would be the trade-off in terms of changed material properties for the end consumer?',
      successHint: 'Material science is not value-free. The choice between reeled and Ahimsa silk is an engineering decision that includes ethical parameters. Learning to quantify and communicate these trade-offs is essential for responsible engineering.',
    },
    {
      title: 'Metamorphosis hormones — ecdysone and juvenile hormone',
      concept: `The silk moth life cycle is orchestrated by two master hormones: **ecdysone** (the molting hormone) and **juvenile hormone (JH)**. Their interaction controls every developmental transition — and understanding this system is key to optimizing silk production.

**Ecdysone** (20-hydroxyecdysone):
- Produced by prothoracic glands in response to brain signals
- Triggers **molting** (shedding of the old exoskeleton)
- At high levels without JH, triggers **metamorphosis** (larva → pupa → adult)
- Chemical structure: steroid hormone (like cortisol in humans)

**Juvenile hormone (JH)**:
- Produced by corpora allata glands
- PREVENTS metamorphosis when present — keeps the larva in larval form
- During larval instars, JH is high → ecdysone triggers molt but larva remains a larva
- JH drops before pupation → ecdysone now triggers the pupal molt

The developmental program:
- **Instars 1-4**: JH HIGH + ecdysone pulses = larval molts (grow bigger, stay caterpillar)
- **Instar 5 end**: JH DROPS + ecdysone pulse = pupation (metamorphosis begins)
- **Pupa**: JH ZERO + ecdysone pulse = adult emergence

For sericulture, the critical moment is the transition from 5th instar to pupa — this is when the silk gland produces the most fibroin. Manipulating hormone levels can extend the silk-producing phase, increasing yield.`,
      analogy: 'Think of a factory assembly line with two managers. Manager E (ecdysone) shouts "CHANGE!" at regular intervals. Manager J (juvenile hormone) holds up a sign that says "stay as you are." When both are present, the workers change their clothes (molt) but keep doing the same job (stay larval). When Manager J leaves and only Manager E shouts "CHANGE," the workers completely transform the factory (metamorphosis).',
      storyConnection: 'The Eri silkworm\'s peaceful cocoon — the one that lets the moth emerge alive — is the final product of this hormonal symphony. Ecdysone triggers the silk-spinning behavior in the 5th instar, and the specific timing of JH withdrawal determines how much silk is produced before pupation. The Ahimsa silk depends on getting this hormonal timing just right.',
      checkQuestion: 'A researcher applies synthetic juvenile hormone to 5th-instar Eri silkworms. What would happen to silk production?',
      checkAnswer: 'The JH would prevent the larva from entering metamorphosis (pupation). The larva would continue eating and growing — potentially undergoing a supernumerary 6th instar. It might produce more silk protein in its enlarged silk glands, but it would NOT spin a cocoon because spinning behavior is triggered by the JH drop + ecdysone combination. You would get a very large caterpillar with silk glands full of fibroin but no cocoon. To get more silk, you would need to briefly raise JH (extend feeding) then drop it sharply (trigger spinning).',
      codeIntro: 'Model the hormonal dynamics of silk moth metamorphosis and simulate how manipulating hormone levels affects silk production.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Hormonal dynamics model for silk moth metamorphosis
# Two hormones: ecdysone (E) and juvenile hormone (JH)

def moth_hormones(days=70, jh_drop_day=35):
    """
    Simulate hormone levels through the silk moth life cycle.
    JH drops sharply before pupation, ecdysone pulses trigger each molt.
    """
    t = np.linspace(0, days, 1000)

    # Juvenile hormone: high during larval stages, drops before pupation
    jh = np.zeros_like(t)
    for i, day in enumerate(t):
        if day < jh_drop_day:
            jh[i] = 80 + 10 * np.sin(2 * np.pi * day / 7)  # fluctuates around 80
        elif day < jh_drop_day + 3:
            jh[i] = 80 * np.exp(-(day - jh_drop_day) / 1.0)  # sharp drop
        else:
            jh[i] = 2  # near zero during metamorphosis

    # Ecdysone: pulses at each molt
    molt_days = [6, 11, 17, 24, 35, 50]  # instar molts + pupation + emergence
    ecdysone = np.zeros_like(t)
    for molt in molt_days:
        pulse = 100 * np.exp(-((t - molt) ** 2) / 1.5)
        ecdysone += pulse

    # Silk production rate: peaks in late 5th instar
    silk_rate = np.zeros_like(t)
    for i, day in enumerate(t):
        if 28 < day < 38:  # Late 5th instar spinning phase
            phase = (day - 28) / 10
            silk_rate[i] = 100 * np.sin(np.pi * phase) * (jh[i] < 50)
        elif 30 < day < 35 and jh[i] > 40:
            silk_rate[i] = 60 * ((day - 30) / 5)

    # Developmental stage
    stages = np.zeros_like(t)
    for i, day in enumerate(t):
        if day < 6: stages[i] = 1
        elif day < 11: stages[i] = 2
        elif day < 17: stages[i] = 3
        elif day < 24: stages[i] = 4
        elif day < 35: stages[i] = 5
        elif day < 50: stages[i] = 6  # Pupa
        else: stages[i] = 7  # Adult

    return t, jh, ecdysone, silk_rate, stages

# Normal development
t, jh, ecdysone, silk_rate, stages = moth_hormones()

# JH manipulation scenarios
t2, jh_ext, ecd_ext, silk_ext, _ = moth_hormones(days=80, jh_drop_day=42)  # Extended JH
t3, jh_early, ecd_early, silk_early, _ = moth_hormones(days=60, jh_drop_day=28)  # Early JH drop

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Metamorphosis Hormones: Ecdysone & Juvenile Hormone',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Hormone levels through life cycle
ax = axes[0, 0]
ax.plot(t, jh, color='#22c55e', linewidth=2.5, label='Juvenile hormone')
ax.plot(t, ecdysone, color='#ef4444', linewidth=2, label='Ecdysone')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Hormone level (a.u.)', color='white')
ax.set_title('Hormone Dynamics During Life Cycle', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
# Stage markers
for day, label in [(3, 'I-1'), (8, 'I-2'), (14, 'I-3'), (20, 'I-4'),
                    (30, 'I-5'), (42, 'Pupa'), (55, 'Adult')]:
    ax.axvline(day, color='gray', linewidth=0.5, linestyle=':')
    ax.text(day, 105, label, color='gray', fontsize=7, ha='center')

# Plot 2: JH determines molt type
ax = axes[0, 1]
# Show decision logic at each ecdysone pulse
molt_days = [6, 11, 17, 24, 35, 50]
molt_jh = [np.interp(d, t, jh) for d in molt_days]
molt_types = ['Larval\\nmolt', 'Larval\\nmolt', 'Larval\\nmolt', 'Larval\\nmolt',
              'Pupation', 'Emergence']
colors_molt = ['#22c55e', '#22c55e', '#22c55e', '#22c55e', '#f59e0b', '#a855f7']
ax.bar(range(len(molt_days)), molt_jh, color=colors_molt, edgecolor='none', width=0.6)
ax.set_xticks(range(len(molt_days)))
ax.set_xticklabels([f'Day {d}\\n{mt}' for d, mt in zip(molt_days, molt_types)],
                    color='white', fontsize=7)
ax.set_ylabel('JH level at molt', color='white')
ax.set_title('JH Level Determines Molt Outcome', color='white', fontsize=11)
ax.axhline(30, color='#ef4444', linewidth=2, linestyle='--', label='JH threshold for metamorphosis')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Silk production rate
ax = axes[0, 2]
ax.fill_between(t, 0, silk_rate, color='#f59e0b', alpha=0.6)
ax.plot(t, silk_rate, color='#f59e0b', linewidth=2)
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Silk production rate (a.u.)', color='white')
ax.set_title('Silk Production Window', color='white', fontsize=11)
ax.annotate('Silk spinning\\nphase', xy=(32, 80), color='white', fontsize=10, fontweight='bold')
total_silk = np.trapz(silk_rate, t)
ax.text(50, 60, f'Total silk: {total_silk:.0f} units', color='#f59e0b', fontsize=10)

# Plot 4: JH manipulation — extended vs normal
ax = axes[1, 0]
ax.plot(t, jh, color='#22c55e', linewidth=2, label='Normal JH')
ax.plot(t2[:len(t)], jh_ext[:len(t)], color='#3b82f6', linewidth=2,
        linestyle='--', label='Extended JH (+7 days)')
ax.plot(t3[:len(t)], jh_early[:len(t)], color='#ef4444', linewidth=2,
        linestyle=':', label='Early JH drop (-7 days)')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('JH level', color='white')
ax.set_title('Hormone Manipulation Scenarios', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Silk yield under different scenarios
ax = axes[1, 1]
# Calculate total silk for each scenario
silk_normal = np.trapz(silk_rate, t)
silk_ext_total = np.trapz(silk_ext[:len(t2)], t2)
silk_early_total = np.trapz(silk_early[:len(t3)], t3)
scenarios = ['Normal', 'Extended JH\\n(+7 days)', 'Early drop\\n(-7 days)']
yields = [silk_normal, silk_ext_total, silk_early_total]
colors_sc = ['#22c55e', '#3b82f6', '#ef4444']
ax.bar(range(len(scenarios)), yields, color=colors_sc, edgecolor='none', width=0.6)
ax.set_xticks(range(len(scenarios)))
ax.set_xticklabels(scenarios, color='white', fontsize=9)
ax.set_ylabel('Total silk produced (a.u.)', color='white')
ax.set_title('Silk Yield Under Manipulation', color='white', fontsize=11)
for i, y in enumerate(yields):
    ax.text(i, y + 10, f'{y:.0f}', ha='center', color='white', fontsize=11)
    pct = (y - silk_normal) / silk_normal * 100
    if pct != 0:
        ax.text(i, y + 35, f'({pct:+.0f}%)', ha='center', color=colors_sc[i], fontsize=9)

# Plot 6: Ecdysone structure and signaling pathway
ax = axes[1, 2]
# Simplified signaling pathway diagram
pathway_y = [0.9, 0.7, 0.5, 0.3, 0.1]
pathway_labels = ['Brain (PTTH)', 'Prothoracic gland', 'Ecdysone synthesis',
                  'Nuclear receptor (EcR)', 'Gene activation\\n→ molt/metamorphosis']
for i, (y, label) in enumerate(zip(pathway_y, pathway_labels)):
    color = ['#a855f7', '#3b82f6', '#ef4444', '#f59e0b', '#22c55e'][i]
    ax.add_patch(plt.Rectangle((0.15, y - 0.07), 0.7, 0.12, facecolor=color,
                                 alpha=0.3, edgecolor=color, linewidth=2, transform=ax.transAxes))
    ax.text(0.5, y, label, transform=ax.transAxes, ha='center', va='center',
            color='white', fontsize=9, fontweight='bold')
    if i < len(pathway_y) - 1:
        ax.annotate('', xy=(0.5, pathway_y[i+1] + 0.08), xytext=(0.5, y - 0.08),
                    arrowprops=dict(arrowstyle='->', color='white', lw=2),
                    xycoords='axes fraction', textcoords='axes fraction')
# JH inhibition arrow
ax.annotate('JH\\nINHIBITS', xy=(0.85, 0.3), xytext=(0.95, 0.6),
            arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2),
            xycoords='axes fraction', textcoords='axes fraction',
            color='#22c55e', fontsize=8, fontweight='bold', ha='center')
ax.set_title('Ecdysone Signaling Pathway', color='white', fontsize=11)
ax.set_xlim(0, 1); ax.set_ylim(0, 1)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Metamorphosis Hormones Summary")
print("=" * 50)
print()
print("Two-hormone model of insect development:")
print("  JH (juvenile hormone): PREVENTS metamorphosis")
print("  Ecdysone: TRIGGERS molting/metamorphosis")
print()
print("Decision logic at each ecdysone pulse:")
print("  JH HIGH + ecdysone → larval molt (grow bigger)")
print("  JH LOW  + ecdysone → pupation (metamorphosis)")
print("  JH ZERO + ecdysone → adult emergence")
print()
print("Silk production implications:")
print(f"  Normal timing: {silk_normal:.0f} silk units")
print(f"  Extended JH:   {silk_ext_total:.0f} silk units ({(silk_ext_total/silk_normal-1)*100:+.0f}%)")
print(f"  Early JH drop: {silk_early_total:.0f} silk units ({(silk_early_total/silk_normal-1)*100:+.0f}%)")
print()
print("Extending the larval phase (more JH) can increase silk gland size,")
print("but the spinning phase depends on JH withdrawal timing.")`,
      challenge: 'Model what happens with a pulsed JH treatment: apply JH for 2 days, withdraw for 1 day, repeat 3 times before final withdrawal. Does this create multiple silk-spinning windows? Could it increase total silk yield without delaying development by a full week?',
      successHint: 'Insect endocrinology is the control system underlying silk production. Understanding ecdysone and JH is not just academic — it is the basis for optimizing sericulture yield through hormone manipulation, a real technique used in commercial silk farming.',
    },
    {
      title: 'Textile fiber properties — engineering the perfect fabric',
      concept: `Silk is a textile fiber, and textile engineering cares about a specific set of properties that go beyond raw material strength:

**Denier**: fiber thickness measured as weight in grams per 9,000 meters of fiber. Eri silk: ~6-8 denier. Bombyx silk: ~1-3 denier. Human hair: ~60 denier. Lower denier = finer fiber.

**Tenacity**: strength per unit thickness (grams per denier). More useful than tensile strength for comparing fibers of different thickness. Eri silk: ~3 g/d. Bombyx silk: ~4 g/d. Kevlar: ~23 g/d.

**Moisture regain**: how much water a fiber absorbs from humid air. Silk: ~11%. Cotton: ~8%. Polyester: ~0.4%. Higher moisture regain = more comfortable in hot weather (absorbs sweat).

**Thermal properties**: Eri silk is uniquely warm among silks — it has a **hollow core** (like wool) that traps air for insulation. This is why Eri silk is traditionally used for winter shawls in Assam. Thermal conductivity: Eri silk ~0.04 W/mK (like wool). Bombyx silk ~0.06 W/mK.

**Draping**: how fabric hangs under its own weight. Determined by fiber stiffness and friction. Reeled silk drapes beautifully (low stiffness, smooth surface). Spun Eri silk has more body and structure (higher friction from short fibers).

**Pilling resistance**: spun fibers can form pills (balls) on fabric surface. Reeled silk rarely pills. Eri silk needs anti-pilling finishing.`,
      analogy: 'Choosing the right textile fiber is like choosing the right athlete for a sport. A sprinter (Kevlar) has explosive strength but limited endurance. A marathon runner (cotton) has stamina but limited power. A triathlete (silk) balances multiple abilities. Eri silk is the winter triathlete — excellent at warmth and comfort, competitive in strength, with the added ethical advantage of being cruelty-free.',
      storyConnection: 'The Eri shawl wrapped around an Assamese grandmother on a winter morning in the Brahmaputra Valley is an engineered thermal system. The hollow-core fibers trap air, the spun texture creates surface friction that holds the shawl in place, and the moisture absorption keeps the wearer comfortable. Every property serves a purpose.',
      checkQuestion: 'An Eri silk fiber has a denier of 7 and a tenacity of 3 g/d. A Bombyx silk fiber has a denier of 2 and a tenacity of 4 g/d. Which fiber would make a stronger thread for a fishing net?',
      checkAnswer: 'For a fishing net, you need total breaking strength, not just tenacity. The Eri fiber\'s breaking force is 7 × 3 = 21 grams per filament. The Bombyx fiber\'s breaking force is 2 × 4 = 8 grams per filament. The thicker Eri fiber is actually 2.6× stronger per filament despite lower tenacity. However, you could use multiple Bombyx filaments to match the thickness. The real question is: do you want one thick, warm, textured fiber or many thin, smooth ones? For a fishing net, the Eri fiber\'s higher moisture regain is actually a disadvantage (it weakens when wet).',
      codeIntro: 'Build a comprehensive textile fiber property comparison database and visualize how different fibers perform across all critical textile parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Textile fiber properties database
# (denier, tenacity_g_d, elongation_%, moisture_regain_%, thermal_cond_W_mK, density_g_cm3)
FIBERS = {
    'Eri silk':     (7.0, 3.0, 25, 11.0, 0.040, 1.30),
    'Muga silk':    (5.0, 3.5, 26, 10.5, 0.050, 1.30),
    'Bombyx silk':  (2.0, 4.0, 18, 11.0, 0.060, 1.35),
    'Cotton':       (1.5, 3.5, 7,  8.5, 0.070, 1.54),
    'Wool':         (5.0, 1.5, 30, 15.0, 0.040, 1.31),
    'Polyester':    (1.5, 5.5, 15, 0.4, 0.140, 1.38),
    'Nylon':        (3.0, 5.0, 25, 4.5, 0.250, 1.14),
    'Linen':        (4.0, 5.5, 3,  12.0, 0.065, 1.50),
    'Kevlar':       (1.5, 23.0, 3, 3.5, 0.040, 1.44),
}

names = list(FIBERS.keys())
denier = np.array([f[0] for f in FIBERS.values()])
tenacity = np.array([f[1] for f in FIBERS.values()])
elongation = np.array([f[2] for f in FIBERS.values()])
moisture = np.array([f[3] for f in FIBERS.values()])
thermal = np.array([f[4] for f in FIBERS.values()])
density = np.array([f[5] for f in FIBERS.values()])

# Derived
breaking_force = denier * tenacity  # grams
warmth = 1 / thermal  # inverse thermal conductivity = insulation

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Textile Fiber Engineering: Eri Silk in Context',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_f = ['#22c55e', '#f59e0b', '#e5e7eb', '#3b82f6', '#a855f7',
            '#ef4444', '#ec4899', '#84cc16', '#64748b']

# Plot 1: Tenacity vs Elongation (textile Ashby plot)
ax = axes[0, 0]
for i, name in enumerate(names):
    size = 250 if 'Eri' in name else 120
    ax.scatter(elongation[i], tenacity[i], s=size, color=colors_f[i],
              edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(name, (elongation[i], tenacity[i]), textcoords='offset points',
                xytext=(8, 5), color=colors_f[i], fontsize=8)
ax.set_xlabel('Elongation at break (%)', color='white')
ax.set_ylabel('Tenacity (g/denier)', color='white')
ax.set_title('Tenacity vs Elongation', color='white', fontsize=11)

# Plot 2: Thermal insulation (warmth factor)
ax = axes[0, 1]
sorted_warmth = np.argsort(warmth)[::-1]
bars = ax.barh(range(len(names)), warmth[sorted_warmth],
               color=[colors_f[i] for i in sorted_warmth], edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_warmth], color='white', fontsize=9)
ax.set_xlabel('Warmth factor (1/thermal conductivity)', color='white')
ax.set_title('Thermal Insulation Ranking', color='white', fontsize=11)
# Highlight Eri
eri_idx = list(sorted_warmth).index(0)
bars[eri_idx].set_edgecolor('#22c55e')
bars[eri_idx].set_linewidth(2)

# Plot 3: Moisture regain (comfort in heat)
ax = axes[0, 2]
sorted_moist = np.argsort(moisture)[::-1]
ax.barh(range(len(names)), moisture[sorted_moist],
        color=[colors_f[i] for i in sorted_moist], edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_moist], color='white', fontsize=9)
ax.set_xlabel('Moisture regain (%)', color='white')
ax.set_title('Moisture Absorption (Comfort)', color='white', fontsize=11)

# Plot 4: Comfort vs Strength trade-off
ax = axes[1, 0]
comfort_score = 0.5 * (moisture / moisture.max()) + 0.5 * (warmth / warmth.max())
strength_score = tenacity / tenacity.max()
for i, name in enumerate(names):
    size = 250 if 'Eri' in name else 120
    ax.scatter(strength_score[i], comfort_score[i], s=size, color=colors_f[i],
              edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(name, (strength_score[i], comfort_score[i]),
                textcoords='offset points', xytext=(8, 5), color=colors_f[i], fontsize=8)
ax.set_xlabel('Strength score', color='white')
ax.set_ylabel('Comfort score (warmth + moisture)', color='white')
ax.set_title('Comfort vs Strength Trade-off', color='white', fontsize=11)
# Draw ideal region
ax.add_patch(plt.Rectangle((0.5, 0.5), 0.5, 0.5, fill=False,
              edgecolor='#f59e0b', linewidth=2, linestyle='--'))
ax.text(0.75, 0.55, 'Ideal zone', color='#f59e0b', fontsize=9, ha='center')

# Plot 5: Denier comparison with cross-section visualization
ax = axes[1, 1]
for i, name in enumerate(names):
    # Circle radius proportional to sqrt(denier)
    r = np.sqrt(denier[i]) * 5
    circle = plt.Circle((i * 25 + 15, 50), r, color=colors_f[i], alpha=0.7)
    ax.add_patch(circle)
    ax.text(i * 25 + 15, 15, f'{name}\\n{denier[i]:.1f}d',
            ha='center', color='white', fontsize=7)
ax.set_xlim(0, len(names) * 25 + 10)
ax.set_ylim(0, 100)
ax.set_title('Fiber Cross-Section Size (by Denier)', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

# Plot 6: Application suitability matrix
ax = axes[1, 2]
applications = ['Winter\\nwear', 'Summer\\nwear', 'Luxury\\nfabric', 'Work\\nwear', 'Medical']
fibers_show = ['Eri silk', 'Bombyx silk', 'Cotton', 'Wool', 'Polyester']
suitability = np.array([
    [0.95, 0.6, 0.5, 0.5, 0.7],  # Eri
    [0.3, 0.8, 0.95, 0.3, 0.6],  # Bombyx
    [0.4, 0.95, 0.5, 0.8, 0.9],  # Cotton
    [0.95, 0.2, 0.6, 0.7, 0.3],  # Wool
    [0.5, 0.3, 0.2, 0.9, 0.4],  # Polyester
])
im = ax.imshow(suitability, cmap='YlGn', aspect='auto', vmin=0, vmax=1)
ax.set_xticks(range(len(applications)))
ax.set_xticklabels(applications, color='white', fontsize=8)
ax.set_yticks(range(len(fibers_show)))
ax.set_yticklabels(fibers_show, color='white', fontsize=9)
ax.set_title('Application Suitability Matrix', color='white', fontsize=11)
for i in range(len(fibers_show)):
    for j in range(len(applications)):
        ax.text(j, i, f'{suitability[i,j]:.1f}', ha='center', va='center',
                color='black' if suitability[i,j] > 0.5 else 'white', fontsize=9)

plt.tight_layout()
plt.show()

print("Textile Fiber Property Comparison")
print("=" * 70)
print(f"{'Fiber':<14} {'Denier':>7} {'Tenacity':>10} {'Elong':>7} {'Moisture':>10} {'Warmth':>8}")
print(f"{'':14} {'':>7} {'(g/d)':>10} {'(%)':>7} {'(%)':>10} {'(1/k)':>8}")
print("-" * 70)
for i, name in enumerate(names):
    print(f"{name:<14} {denier[i]:>7.1f} {tenacity[i]:>10.1f} {elongation[i]:>7.0f} "
          f"{moisture[i]:>10.1f} {warmth[i]:>8.1f}")
print()
print("Eri silk's unique advantage: WARMTH + MOISTURE + ETHICS")
print("It rivals wool in insulation, exceeds polyester in comfort,")
print("and is the only silk produced without killing the moth.")`,
      challenge: 'Design a blended fabric: 60% Eri silk + 40% wool. Calculate the predicted properties using the rule of mixtures. Compare to 100% Eri and 100% wool. For which applications is the blend superior to either pure fiber?',
      successHint: 'Textile engineering is applied material science with human factors. The "best" fiber depends on the application — warmth, comfort, strength, drape, and ethics all matter. Eri silk occupies a unique niche: warm, comfortable, strong enough for daily wear, and cruelty-free.',
    },
    {
      title: 'Sustainable fashion — life cycle assessment of textile fibers',
      concept: `**Life Cycle Assessment (LCA)** is the gold standard for evaluating environmental impact. It tracks a product from "cradle to grave" — from raw material extraction through manufacturing, use, and disposal.

For textile fibers, the LCA stages are:
1. **Raw material**: Growing cotton, raising silkworms, extracting petroleum (polyester)
2. **Fiber production**: Spinning, reeling, or extruding the raw material into fiber
3. **Dyeing and finishing**: Chemical treatments for color, softness, wrinkle resistance
4. **Manufacturing**: Weaving/knitting into fabric, cutting, sewing
5. **Use phase**: Washing, drying, ironing (often the LARGEST impact!)
6. **End of life**: Landfill, incineration, recycling, composting, biodegradation

Key environmental metrics:
- **Carbon footprint** (kg CO2e/kg fiber): polyester ~6, cotton ~5, silk ~20-50, Eri silk ~10-15
- **Water footprint** (L/kg): cotton ~10,000 (!), silk ~1,500, polyester ~50
- **Energy use** (MJ/kg): polyester ~100, cotton ~55, silk ~250
- **Biodegradability**: silk ~2 years, cotton ~5 months, polyester ~200+ years
- **Toxicity**: conventional silk uses formaldehyde, polyester uses antimony catalyst, Eri silk uses minimal chemicals

Eri silk has a surprisingly moderate footprint because:
- No boiling/killing step (saves energy)
- Castor plant (host plant) grows easily, requires minimal pesticides
- Short supply chain (cottage industry in Northeast India)
- Fully biodegradable`,
      analogy: 'LCA is like a full medical checkup for a product. You do not just check the blood pressure (carbon footprint) — you check the heart (water use), lungs (energy), liver (toxicity), and bones (durability). A product might score well on one metric and poorly on another. LCA gives you the complete health picture.',
      storyConnection: 'The Eri silk of Assam is produced in homes and small workshops using traditional methods — a short, local supply chain with minimal industrial processing. When you compare this to a polyester factory or a cotton plantation requiring massive irrigation, the sustainability picture becomes clear. The traditional way is, in many cases, the sustainable way.',
      checkQuestion: 'Cotton has a carbon footprint of ~5 kg CO2e/kg but a water footprint of ~10,000 L/kg. Polyester has ~6 kg CO2e/kg but only ~50 L/kg water. Which is more "sustainable"?',
      checkAnswer: 'Neither — because sustainability is multi-dimensional. In a water-scarce region (like Rajasthan), cotton\'s 10,000 L/kg water use is devastating. In a region with abundant water but high climate concern, polyester\'s fossil fuel origin and 200-year degradation time is worse. There is no single "most sustainable" fiber — it depends on which environmental dimension you prioritize and where on Earth you are. LCA reveals trade-offs; it does not make the choice for you.',
      codeIntro: 'Build a life cycle assessment model for Eri silk and compare it against major textile fibers across all environmental dimensions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Life Cycle Assessment data for textile fibers
# All values per kg of fiber

LCA_DATA = {
    # (CO2_kg, water_L, energy_MJ, land_m2, chemicals_kg, biodegrade_years, microplastic_risk)
    'Eri silk':    (12, 1500, 100, 8,  0.2, 2,   0),
    'Muga silk':   (18, 2000, 150, 10, 0.5, 2,   0),
    'Bombyx silk': (35, 3000, 250, 15, 2.0, 2,   0),
    'Org. cotton': (4,  7000, 50,  12, 0.1, 0.5, 0),
    'Conv. cotton':(5,  10000,55,  12, 3.0, 0.5, 0),
    'Polyester':   (6,  50,   100, 0.1,1.5, 200, 1),
    'Nylon':       (7,  60,   120, 0.1,2.0, 50,  1),
    'Wool':        (25, 6000, 150, 100,0.5, 1,   0),
    'Linen':       (3,  3000, 40,  5,  0.2, 0.3, 0),
    'Viscose':     (8,  2500, 100, 3,  5.0, 3,   0),
}

names = list(LCA_DATA.keys())
co2 = np.array([d[0] for d in LCA_DATA.values()])
water = np.array([d[1] for d in LCA_DATA.values()])
energy = np.array([d[2] for d in LCA_DATA.values()])
land = np.array([d[3] for d in LCA_DATA.values()])
chemicals = np.array([d[4] for d in LCA_DATA.values()])
biodegrade = np.array([d[5] for d in LCA_DATA.values()])
microplastic = np.array([d[6] for d in LCA_DATA.values()])

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Life Cycle Assessment: Eri Silk vs Major Textile Fibers',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_lca = ['#22c55e', '#f59e0b', '#fbbf24', '#4ade80', '#3b82f6',
              '#ef4444', '#ec4899', '#a855f7', '#84cc16', '#06b6d4']

# Plot 1: Carbon footprint
ax = axes[0, 0]
sorted_co2 = np.argsort(co2)
ax.barh(range(len(names)), co2[sorted_co2],
        color=[colors_lca[i] for i in sorted_co2], edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_co2], color='white', fontsize=8)
ax.set_xlabel('Carbon footprint (kg CO₂e/kg)', color='white')
ax.set_title('Carbon Footprint', color='white', fontsize=11)

# Plot 2: Water footprint
ax = axes[0, 1]
sorted_water = np.argsort(water)
ax.barh(range(len(names)), water[sorted_water],
        color=[colors_lca[i] for i in sorted_water], edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_water], color='white', fontsize=8)
ax.set_xlabel('Water footprint (L/kg)', color='white')
ax.set_title('Water Footprint', color='white', fontsize=11)

# Plot 3: Biodegradability
ax = axes[0, 2]
sorted_bio = np.argsort(biodegrade)
colors_bio = ['#22c55e' if b < 5 else '#f59e0b' if b < 50 else '#ef4444'
              for b in biodegrade[sorted_bio]]
ax.barh(range(len(names)), biodegrade[sorted_bio], color=colors_bio,
        edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_bio], color='white', fontsize=8)
ax.set_xlabel('Time to biodegrade (years)', color='white')
ax.set_xscale('log')
ax.set_title('Biodegradability (log scale)', color='white', fontsize=11)

# Plot 4: Multi-dimensional sustainability score
ax = axes[1, 0]
# Normalize each metric (lower = better, so invert for scoring)
scores = np.zeros(len(names))
for metric, weight in [(co2, 0.25), (water, 0.2), (energy, 0.15),
                        (chemicals, 0.15), (biodegrade, 0.15), (microplastic, 0.1)]:
    normalized = 1 - (metric - metric.min()) / (metric.max() - metric.min() + 1e-10)
    scores += weight * normalized

sorted_score = np.argsort(scores)[::-1]
ax.barh(range(len(names)), scores[sorted_score],
        color=[colors_lca[i] for i in sorted_score], edgecolor='none', height=0.6)
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_score], color='white', fontsize=8)
ax.set_xlabel('Sustainability Score (higher = better)', color='white')
ax.set_title('Overall Sustainability Ranking', color='white', fontsize=11)

# Plot 5: Environmental trade-off scatter
ax = axes[1, 1]
for i, name in enumerate(names):
    size = 250 if 'Eri' in name else 100
    ax.scatter(co2[i], water[i], s=size, color=colors_lca[i],
              edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(name, (co2[i], water[i]), textcoords='offset points',
                xytext=(8, 5), color=colors_lca[i], fontsize=7)
ax.set_xlabel('Carbon footprint (kg CO₂e/kg)', color='white')
ax.set_ylabel('Water footprint (L/kg)', color='white')
ax.set_title('Carbon vs Water Trade-off', color='white', fontsize=11)
# Ideal zone
ax.add_patch(plt.Rectangle((0, 0), 15, 3000, fill=True,
              facecolor='#22c55e', alpha=0.08, edgecolor='#22c55e', linewidth=2, linestyle='--'))
ax.text(7, 200, 'Best zone', color='#22c55e', fontsize=9, fontweight='bold')

# Plot 6: Garment lifecycle phases breakdown
ax = axes[1, 2]
phases = ['Raw\\nmaterial', 'Production', 'Dyeing', 'Manufact.', 'Use\\n(washing)', 'End of\\nlife']
# CO2 breakdown per phase for Eri silk garment (estimated, kg CO2e)
eri_phases = [2, 3, 1, 1, 4, 0.5]
cotton_phases = [1, 1, 2, 1, 8, 0.5]
polyester_phases = [3, 2, 1.5, 1, 5, 2]

x = np.arange(len(phases))
width = 0.25
ax.bar(x - width, eri_phases, width, color='#22c55e', label='Eri silk', edgecolor='none')
ax.bar(x, cotton_phases, width, color='#3b82f6', label='Cotton', edgecolor='none')
ax.bar(x + width, polyester_phases, width, color='#ef4444', label='Polyester', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(phases, color='white', fontsize=8)
ax.set_ylabel('CO₂ (kg per garment)', color='white')
ax.set_title('Carbon by Lifecycle Phase', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Use phase\\ndominates!', xy=(4, 7), color='#f59e0b', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.show()

print("Life Cycle Assessment — Textile Fibers")
print("=" * 65)
print(f"{'Fiber':<15} {'CO2':>6} {'Water':>7} {'Energy':>7} {'Chem':>6} {'Biodegrade':>12}")
print(f"{'':15} {'kg':>6} {'L':>7} {'MJ':>7} {'kg':>6} {'years':>12}")
print("-" * 65)
for i, name in enumerate(names):
    print(f"{name:<15} {co2[i]:>6.0f} {water[i]:>7.0f} {energy[i]:>7.0f} "
          f"{chemicals[i]:>6.1f} {biodegrade[i]:>12.1f}")
print()
print("Sustainability ranking (weighted composite score):")
for rank, idx in enumerate(sorted_score):
    print(f"  #{rank+1}: {names[idx]} (score: {scores[idx]:.3f})")
print()
print("Key findings:")
print("  - Eri silk ranks in the top 3 for overall sustainability")
print("  - Cotton's water footprint is 7x higher than Eri silk")
print("  - Polyester never biodegrades; Eri silk decomposes in ~2 years")
print("  - The USE phase (washing) often has the largest carbon impact")
print("  - No single fiber wins on all metrics — LCA reveals trade-offs")`,
      challenge: 'Model the total environmental impact of a wardrobe: 10 cotton shirts (washed 100x each), 5 polyester jackets (washed 50x), and 2 Eri silk shawls (washed 20x). Include the washing impact (0.05 kg CO2e per wash for cotton, 0.08 for polyester due to microplastic filtration, 0.03 for silk). Which garment category has the highest total lifetime footprint?',
      successHint: 'Life Cycle Assessment transforms environmental discussion from opinion to data. When someone says "silk is unsustainable because it uses insects," LCA reveals the full picture: water, carbon, chemicals, biodegradability, and microplastic pollution all matter. Eri silk, with its low-impact production process and full biodegradability, is a strong sustainability performer.',
    },
    {
      title: 'Life cycle assessment methodology — from data to decisions',
      concept: `LCA is not just about collecting numbers — it is a formal methodology governed by ISO 14040/14044 standards. Understanding the methodology helps you critically evaluate environmental claims.

The four phases of LCA:

1. **Goal and scope definition**: What are you comparing? What is the functional unit?
   - Functional unit examples: "one garment that keeps you warm for 5 winters" or "1 kg of fiber"
   - System boundaries: cradle-to-gate (up to factory) vs cradle-to-grave (full lifecycle)

2. **Life Cycle Inventory (LCI)**: Collect all inputs and outputs
   - Inputs: energy, water, raw materials, chemicals
   - Outputs: emissions (CO2, NOx, SOx), wastewater, solid waste
   - Data sources: databases (Ecoinvent, GaBi), industry reports, measurements

3. **Life Cycle Impact Assessment (LCIA)**: Convert inventory to impacts
   - Global Warming Potential (GWP): all greenhouse gases converted to CO2 equivalents
   - Water depletion, eutrophication, acidification, human toxicity, ecotoxicity
   - Characterization factors: e.g., 1 kg CH4 = 28 kg CO2e (GWP100)

4. **Interpretation**: What do the results mean?
   - Sensitivity analysis: how much do results change if assumptions change?
   - Uncertainty analysis: what is the confidence interval?
   - Normalization: compare to a reference (e.g., per-capita annual impact)

The critical insight: **different functional units give different answers**. Comparing "1 kg of Eri silk vs 1 kg of polyester" is misleading if the Eri shawl lasts 20 years and the polyester jacket lasts 3 years. Use-phase duration matters.`,
      analogy: 'LCA methodology is like the scientific method for environmental claims. Just as you would not trust a medical study without knowing the sample size, control group, and statistical methods, you should not trust an environmental claim without knowing the functional unit, system boundary, and data sources. LCA is peer-reviewable environmental science.',
      storyConnection: 'Eri silk garments in Assam are often passed down through generations — a shawl might last 20-30 years with care. This longevity dramatically changes the per-year environmental impact. A garment that lasts 20 years has 1/4 the annual footprint of one that lasts 5 years, even if the production impact is higher. The durability of Eri silk is itself a sustainability feature.',
      checkQuestion: 'Company A claims their polyester jacket has a "lower carbon footprint than silk" based on a cradle-to-gate analysis. Company B claims their Eri silk shawl has a "lower carbon footprint than polyester" based on a cradle-to-grave analysis with a 15-year use phase. Can both claims be true simultaneously?',
      checkAnswer: 'Yes, both can be true. Cradle-to-gate compares only production, where polyester (6 kg CO2e/kg) is indeed lower than silk (12+ kg CO2e/kg). But cradle-to-grave includes the use phase (washing) and end-of-life. Over 15 years, frequent washing of polyester adds significant CO2 (plus microplastic pollution), while silk needs less frequent, gentler washing. The longer lifespan also amortizes the production impact. Different system boundaries yield different conclusions — which is why stating your methodology is essential.',
      codeIntro: 'Implement a formal LCA methodology with functional units, sensitivity analysis, and uncertainty quantification for Eri silk vs competing fibers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# Formal Life Cycle Assessment — ISO 14040 Framework
# =====================================================

# PHASE 1: Goal and Scope
# Functional unit: "one garment that provides warmth for 1 year"
# System boundary: cradle-to-grave

# Garment parameters
GARMENTS = {
    'Eri silk shawl': {
        'weight_kg': 0.5,
        'lifespan_years': 20,
        'washes_per_year': 10,
        'fiber': 'Eri silk',
    },
    'Wool sweater': {
        'weight_kg': 0.6,
        'lifespan_years': 10,
        'washes_per_year': 15,
        'fiber': 'Wool',
    },
    'Cotton flannel': {
        'weight_kg': 0.4,
        'lifespan_years': 5,
        'washes_per_year': 25,
        'fiber': 'Cotton',
    },
    'Polyester fleece': {
        'weight_kg': 0.3,
        'lifespan_years': 3,
        'washes_per_year': 30,
        'fiber': 'Polyester',
    },
}

# PHASE 2: Life Cycle Inventory (per kg of fiber)
LCI = {
    'Eri silk':  {'co2_prod': 12, 'water_prod': 1500, 'co2_wash': 0.03, 'water_wash': 50,
                  'co2_eol': 0.5, 'microplastic_wash_mg': 0, 'biodegrade_yr': 2},
    'Wool':      {'co2_prod': 25, 'water_prod': 6000, 'co2_wash': 0.04, 'water_wash': 50,
                  'co2_eol': 1.0, 'microplastic_wash_mg': 0, 'biodegrade_yr': 1},
    'Cotton':    {'co2_prod': 5, 'water_prod': 10000, 'co2_wash': 0.05, 'water_wash': 60,
                  'co2_eol': 0.3, 'microplastic_wash_mg': 0, 'biodegrade_yr': 0.5},
    'Polyester': {'co2_prod': 6, 'water_prod': 50, 'co2_wash': 0.08, 'water_wash': 60,
                  'co2_eol': 3.0, 'microplastic_wash_mg': 700, 'biodegrade_yr': 200},
}

# PHASE 3: Life Cycle Impact Assessment
def compute_lcia(garment_name, garments=GARMENTS, lci=LCI):
    """Compute lifecycle impacts per functional unit (1 year of warmth)."""
    g = garments[garment_name]
    fiber = lci[g['fiber']]

    # Production phase (per garment, amortized over lifespan)
    co2_prod = fiber['co2_prod'] * g['weight_kg'] / g['lifespan_years']
    water_prod = fiber['water_prod'] * g['weight_kg'] / g['lifespan_years']

    # Use phase (annual)
    co2_use = fiber['co2_wash'] * g['washes_per_year']
    water_use = fiber['water_wash'] * g['washes_per_year']
    microplastic = fiber['microplastic_wash_mg'] * g['washes_per_year'] / 1000  # grams/year

    # End of life (amortized)
    co2_eol = fiber['co2_eol'] * g['weight_kg'] / g['lifespan_years']

    return {
        'co2_total': co2_prod + co2_use + co2_eol,
        'co2_prod': co2_prod,
        'co2_use': co2_use,
        'co2_eol': co2_eol,
        'water_total': water_prod + water_use,
        'water_prod': water_prod,
        'water_use': water_use,
        'microplastic_g_yr': microplastic,
        'biodegrade': fiber['biodegrade_yr'],
    }

results = {name: compute_lcia(name) for name in GARMENTS}

# PHASE 4: Sensitivity analysis
def sensitivity_lifespan(garment_name, lifespans):
    """How does changing lifespan affect the functional unit impact?"""
    impacts = []
    for ls in lifespans:
        g_modified = dict(GARMENTS[garment_name])
        g_modified['lifespan_years'] = ls
        modified_garments = dict(GARMENTS)
        modified_garments[garment_name] = g_modified
        impact = compute_lcia(garment_name, modified_garments)
        impacts.append(impact['co2_total'])
    return impacts

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Life Cycle Assessment: Warmth for 1 Year (ISO 14040)',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

garment_names = list(GARMENTS.keys())
colors_g = ['#22c55e', '#a855f7', '#3b82f6', '#ef4444']

# Plot 1: Total CO2 per functional unit (stacked)
ax = axes[0, 0]
co2_prods = [results[n]['co2_prod'] for n in garment_names]
co2_uses = [results[n]['co2_use'] for n in garment_names]
co2_eols = [results[n]['co2_eol'] for n in garment_names]
x = np.arange(len(garment_names))
ax.bar(x, co2_prods, 0.6, color='#3b82f6', label='Production', edgecolor='none')
ax.bar(x, co2_uses, 0.6, bottom=co2_prods, color='#f59e0b', label='Use (washing)', edgecolor='none')
bottoms = [p + u for p, u in zip(co2_prods, co2_uses)]
ax.bar(x, co2_eols, 0.6, bottom=bottoms, color='#ef4444', label='End of life', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels([n.split()[0] + '\\n' + n.split()[-1] for n in garment_names],
                    color='white', fontsize=8)
ax.set_ylabel('kg CO₂e per year of warmth', color='white')
ax.set_title('Carbon Footprint (functional unit)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Water footprint per functional unit
ax = axes[0, 1]
water_prods = [results[n]['water_prod'] for n in garment_names]
water_uses = [results[n]['water_use'] for n in garment_names]
ax.bar(x, water_prods, 0.6, color='#3b82f6', label='Production', edgecolor='none')
ax.bar(x, water_uses, 0.6, bottom=water_prods, color='#06b6d4', label='Use (washing)', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels([n.split()[0] + '\\n' + n.split()[-1] for n in garment_names],
                    color='white', fontsize=8)
ax.set_ylabel('Liters per year of warmth', color='white')
ax.set_title('Water Footprint (functional unit)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Microplastic pollution
ax = axes[0, 2]
micro = [results[n]['microplastic_g_yr'] for n in garment_names]
ax.bar(x, micro, 0.6, color=colors_g, edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels([n.split()[0] + '\\n' + n.split()[-1] for n in garment_names],
                    color='white', fontsize=8)
ax.set_ylabel('Microplastic release (g/year)', color='white')
ax.set_title('Microplastic Pollution', color='white', fontsize=11)
ax.annotate('Only synthetic\\nfibers release\\nmicroplastic', xy=(3, micro[3] * 0.7),
            color='#ef4444', fontsize=9, fontweight='bold')

# Plot 4: Sensitivity to lifespan
ax = axes[1, 0]
lifespans = np.arange(1, 26)
for i, name in enumerate(garment_names):
    impacts = sensitivity_lifespan(name, lifespans)
    ax.plot(lifespans, impacts, color=colors_g[i], linewidth=2.5,
            label=name.split()[0] + ' ' + name.split()[-1])
ax.set_xlabel('Garment lifespan (years)', color='white')
ax.set_ylabel('CO₂ per year of warmth (kg)', color='white')
ax.set_title('Sensitivity: Lifespan Effect', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Longer lifespan →\\nlower annual impact', xy=(15, 1), color='#f59e0b', fontsize=9)

# Plot 5: Uncertainty analysis (Monte Carlo)
ax = axes[1, 1]
n_mc = 1000
mc_results = {name: [] for name in garment_names}
for _ in range(n_mc):
    for name in garment_names:
        g = GARMENTS[name]
        fiber = LCI[g['fiber']]
        # Add ±20% uncertainty to all parameters
        co2_p = fiber['co2_prod'] * g['weight_kg'] / g['lifespan_years'] * np.random.uniform(0.8, 1.2)
        co2_u = fiber['co2_wash'] * g['washes_per_year'] * np.random.uniform(0.8, 1.2)
        co2_e = fiber['co2_eol'] * g['weight_kg'] / g['lifespan_years'] * np.random.uniform(0.8, 1.2)
        mc_results[name].append(co2_p + co2_u + co2_e)

parts = ax.violinplot([mc_results[n] for n in garment_names], positions=range(len(garment_names)),
                       showmeans=True, showmedians=True)
for i, pc in enumerate(parts['bodies']):
    pc.set_facecolor(colors_g[i])
    pc.set_alpha(0.7)
parts['cmeans'].set_color('white')
parts['cmedians'].set_color('#f59e0b')
ax.set_xticks(range(len(garment_names)))
ax.set_xticklabels([n.split()[0] for n in garment_names], color='white', fontsize=9)
ax.set_ylabel('CO₂ per year (kg)', color='white')
ax.set_title('Uncertainty Analysis (±20%)', color='white', fontsize=11)

# Plot 6: Summary scorecard
ax = axes[1, 2]
ax.axis('off')
metrics = ['CO₂/yr (kg)', 'Water/yr (L)', 'Microplastic', 'Biodegrade', 'RANK']
table_data = [['Metric'] + [n.split()[0] for n in garment_names]]
# CO2
co2_vals = [results[n]['co2_total'] for n in garment_names]
table_data.append(['CO₂/yr (kg)'] + [f'{v:.2f}' for v in co2_vals])
# Water
water_vals = [results[n]['water_total'] for n in garment_names]
table_data.append(['Water/yr (L)'] + [f'{v:.0f}' for v in water_vals])
# Microplastic
table_data.append(['Microplastic'] + [f'{results[n]["microplastic_g_yr"]:.1f}g' for n in garment_names])
# Biodegrade
table_data.append(['Biodegrade'] + [f'{results[n]["biodegrade"]:.0f}yr' for n in garment_names])
# Overall rank (lower total = better)
overall = [co2_vals[i] / max(co2_vals) + water_vals[i] / max(water_vals) for i in range(len(garment_names))]
ranks = [sorted(overall).index(o) + 1 for o in overall]
table_data.append(['RANK'] + [f'#{r}' for r in ranks])

table = ax.table(cellText=table_data, loc='center', cellLoc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
    if key[0] == 5:  # Rank row
        cell.set_facecolor('#1e3a5f')
ax.set_title('LCA Scorecard (per year of warmth)', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("Life Cycle Assessment — Complete Report")
print("=" * 65)
print(f"Functional unit: 1 year of warmth from a single garment")
print(f"System boundary: cradle-to-grave")
print()
print(f"{'Garment':<20} {'CO2/yr':>8} {'Water/yr':>10} {'Microplastic':>12} {'Rank':>6}")
print("-" * 60)
for i, name in enumerate(garment_names):
    r = results[name]
    print(f"{name:<20} {r['co2_total']:>7.2f}kg {r['water_total']:>9.0f}L "
          f"{r['microplastic_g_yr']:>11.1f}g  #{ranks[i]}")
print()
print("KEY FINDING: When normalized to the functional unit (1 year of warmth),")
print("Eri silk has the LOWEST annual carbon footprint because its 20-year")
print("lifespan amortizes the production impact across many years.")
print()
print("Polyester has the lowest per-kg production cost but:")
print("  - Shortest lifespan (3 years) → high annual cost")
print("  - Microplastic pollution: 21g/year into waterways")
print("  - 200+ years to biodegrade in landfill")
print()
print("LCA lesson: the functional unit changes everything.")
print("A durable product can be more sustainable than a cheap one.")`,
      challenge: 'Add a "secondhand" scenario: what if the Eri shawl is passed to a second owner after 10 years (extending total lifespan to 30 years)? And the polyester fleece is donated to thrift after 2 years? Recalculate the functional unit impacts. How does the secondhand economy change the sustainability ranking?',
      successHint: 'You have learned formal LCA methodology — the same framework used by Nike, Patagonia, and the EU for environmental product declarations. The key insight: sustainability cannot be reduced to a single number. Functional units, system boundaries, and multi-dimensional impacts all matter. Eri silk is not the "greenest" fiber on every metric, but its combination of low washing impact, full biodegradability, zero microplastic, and extreme durability makes it a strong sustainability performer.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Entomology & Textile Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (silk biology & chemistry fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biology, textile engineering, and sustainability simulations. Click to start.</p>
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
