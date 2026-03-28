import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BambooGrowthLevel3() {
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
      title: 'Cell division rates — the engine of rapid growth',
      concept: `Bamboo holds the world record for the fastest-growing plant: some species add **91 cm (3 feet) in a single day**. To understand how, you need to understand **cell division** — the process by which one cell becomes two.

Every living cell divides through **mitosis**, a cycle that takes roughly 12-24 hours in most plants. But bamboo's intercalary meristems (growth zones at every node) divide much faster — some completing a cycle in just 6-8 hours. More critically, bamboo has **dozens of active meristems** stacked along its culm, all dividing simultaneously.

Consider the math: if a typical tree has 1 meristem (at the tip) producing 1,000 new cells per day, and bamboo has 40 meristems each producing 1,000 cells per day, bamboo generates **40x more new cells**. Each cell then elongates rapidly due to turgor pressure, and the combined effect is explosive vertical growth. This is not magic — it is parallelized cell division.`,
      analogy: 'Imagine building a skyscraper. A normal building has one construction crew working on the top floor. Bamboo is like having 40 crews, one on every floor, all adding bricks simultaneously. The building rises 40 times faster — not because any single crew works faster, but because they all work in parallel.',
      storyConnection: 'In the bamboo groves of Assam\'s Karbi Anglong hills, villagers say you can "hear bamboo growing" on quiet monsoon nights. The rapid cell expansion creates faint cracking sounds as cell walls stretch and new tissue pushes upward. The story captures this wonder — growth so fast it becomes audible.',
      checkQuestion: 'If a bamboo shoot has 30 active meristems, each producing 800 new cells per hour, and each cell elongates to 100 micrometers, how much total length is added per hour?',
      checkAnswer: '30 meristems x 800 cells x 100 micrometers = 2,400,000 micrometers = 2.4 meters per hour. That is 57.6 meters per day — which exceeds real observations because not all cells elongate to their maximum, and division rates slow at night. Real peak rates are about 0.9 m/day, meaning actual efficiency is roughly 1.5% of theoretical maximum.',
      codeIntro: 'Model cell division across multiple meristems and visualize how parallel growth zones produce rapid elongation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Parameters
n_meristems = 40       # number of growth zones (nodes)
division_rate = 0.08   # divisions per cell per hour
cell_length_um = 80    # elongated cell length in micrometers
hours = 72             # simulate 3 days

# Simulate cell production at each meristem
t = np.arange(0, hours, 0.5)
cells_per_meristem = np.zeros((n_meristems, len(t)))

# Each meristem starts with 100 active cells
for m in range(n_meristems):
    cells = 100.0
    for i, h in enumerate(t):
        # Day/night cycle: division rate drops 60% at night
        hour_of_day = h % 24
        rate = division_rate if 6 <= hour_of_day <= 18 else division_rate * 0.4
        cells = cells * (1 + rate * 0.5)  # 0.5h timestep
        # Cap: cells differentiate and stop dividing
        if cells > 5000:
            cells = 5000
        cells_per_meristem[m, i] = cells

# Total new cells across all meristems
total_cells = np.sum(cells_per_meristem, axis=0)
# Convert to growth in cm
growth_cm = total_cells * cell_length_um / 1e4  # um -> cm

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Individual meristem cell counts
for m in [0, 10, 20, 30, 39]:
    axes[0].plot(t, cells_per_meristem[m], linewidth=1.5,
                 label=f'Meristem {m+1}')
axes[0].set_xlabel('Hours', color='white')
axes[0].set_ylabel('Active cells', color='white')
axes[0].set_title('Cell count per meristem', color='white', fontsize=11)
axes[0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Total cells (all meristems combined)
axes[1].plot(t, total_cells, color='#22c55e', linewidth=2)
axes[1].set_xlabel('Hours', color='white')
axes[1].set_ylabel('Total cells (all meristems)', color='white')
axes[1].set_title(f'Parallel growth: {n_meristems} meristems', color='white', fontsize=11)
axes[1].fill_between(t, total_cells, alpha=0.2, color='#22c55e')

# Plot 3: Height growth
axes[2].plot(t, growth_cm, color='#f59e0b', linewidth=2)
axes[2].set_xlabel('Hours', color='white')
axes[2].set_ylabel('Total growth (cm)', color='white')
axes[2].set_title('Cumulative height gain', color='white', fontsize=11)
# Mark day/night
for d in range(3):
    axes[2].axvspan(d*24+18, d*24+30, alpha=0.1, color='blue')

plt.tight_layout()
plt.show()

print(f"After {hours} hours ({hours/24:.0f} days):")
print(f"  Total cells produced: {total_cells[-1]:,.0f}")
print(f"  Total growth: {growth_cm[-1]:,.1f} cm = {growth_cm[-1]/100:.2f} m")
print(f"  Average daily rate: {growth_cm[-1]/(hours/24):.1f} cm/day")
print(f"  Peak hourly rate: {np.max(np.diff(growth_cm)/0.5):.1f} cm/hr")`,
      challenge: 'Try changing n_meristems from 40 to 5 (like a normal tree). How does total growth change? Then change cell_length_um to 200 (larger cells). Which parameter has more impact?',
      successHint: 'Parallelism is the key insight. Bamboo does not grow faster by making individual cells divide faster — it grows faster by running many growth zones simultaneously. The same principle drives parallel computing.',
    },
    {
      title: 'Meristematic tissue — where growth happens',
      concept: `Not all plant cells can divide. In mature tissue, cells are locked into their final form — xylem tubes, bark cells, leaf cells. Growth only happens in specialized regions called **meristems**, where cells remain undifferentiated and retain the ability to divide.

Plants have two main types of meristems:

- **Apical meristems** sit at the tips of shoots and roots. They drive **primary growth** (lengthening). Every tree grows taller from its tips.
- **Lateral meristems** (cambium) wrap around the stem like a sleeve. They drive **secondary growth** (thickening). This is how tree trunks get wider each year.

Bamboo has a third type that makes it special: **intercalary meristems**. These sit at the base of each internode (the segment between two nodes). While a tree pushes growth from the tip only, bamboo pushes growth from **every single node**. A bamboo culm with 40 nodes has 40 independent growth engines.

The intercalary meristems are active only during the initial growth spurt (typically 60-90 days). Once the culm reaches full height, these meristems lignify and stop dividing forever. The bamboo never grows taller after that — it only hardens.`,
      analogy: 'Apical meristems are like a single elevator shaft adding floors at the top of a building. Intercalary meristems are like having an expanding jack at every floor — all floors push upward simultaneously. The building reaches its final height much faster, but once it stops, it stops for good.',
      storyConnection: 'In Assam\'s Barak Valley, bamboo farmers know that the first 60 days after a shoot emerges are critical. If a goat nibbles the shoot tip, the apical meristem is destroyed — but the culm still grows because the intercalary meristems at every node keep pushing. The shoot may be shorter, but it survives. This resilience comes directly from having distributed growth zones.',
      checkQuestion: 'Why can\'t bamboo grow taller after its initial growth spurt, even though trees continue growing for decades?',
      checkAnswer: 'Bamboo\'s intercalary meristems lignify (become woody and rigid) after 60-90 days, permanently losing the ability to divide. Trees retain their apical meristems at branch tips indefinitely, so they can keep adding height year after year. Bamboo trades long-term growth for extreme short-term speed. It is a sprinter, not a marathon runner.',
      codeIntro: 'Simulate the lifecycle of a bamboo culm: rapid growth from intercalary meristems followed by lignification and growth cessation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bamboo culm growth lifecycle
days = np.arange(0, 150, 0.5)
n_nodes = 35

# Each node's meristem has an activation window
# Lower nodes activate first, upper nodes later
node_growth = np.zeros((n_nodes, len(days)))
node_status = np.zeros((n_nodes, len(days)))  # 0=dormant, 1=active, 2=lignified

for node in range(n_nodes):
    # Activation day: lower nodes start first
    activate_day = 5 + node * 1.5
    # Active for ~40 days, then lignify
    lignify_day = activate_day + 40

    for i, d in enumerate(days):
        if d < activate_day:
            node_status[node, i] = 0  # dormant
            node_growth[node, i] = 0
        elif d < lignify_day:
            node_status[node, i] = 1  # active
            # Growth follows a bell curve (slow start, peak, slow end)
            progress = (d - activate_day) / (lignify_day - activate_day)
            growth_rate = 4 * progress * (1 - progress)  # parabola peaking at 0.5
            node_growth[node, i] = growth_rate * 3.0  # cm per half-day
        else:
            node_status[node, i] = 2  # lignified
            node_growth[node, i] = 0

# Cumulative height from all nodes
cumulative_per_node = np.cumsum(node_growth, axis=1) * 0.5
total_height = np.sum(cumulative_per_node, axis=1)

# Count active meristems at each time
active_count = np.sum(node_status == 1, axis=0)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Meristem activity heatmap
im = axes[0, 0].imshow(node_status, aspect='auto', cmap='RdYlGn',
                         extent=[0, 150, n_nodes, 0], vmin=0, vmax=2)
axes[0, 0].set_xlabel('Days', color='white')
axes[0, 0].set_ylabel('Node (bottom to top)', color='white')
axes[0, 0].set_title('Meristem status (green=active, red=lignified)', color='white', fontsize=10)

# Active meristem count over time
axes[0, 1].fill_between(days, active_count, color='#22c55e', alpha=0.6)
axes[0, 1].plot(days, active_count, color='#22c55e', linewidth=2)
axes[0, 1].set_xlabel('Days', color='white')
axes[0, 1].set_ylabel('Active meristems', color='white')
axes[0, 1].set_title('Simultaneous active growth zones', color='white', fontsize=10)

# Growth rate over time
daily_growth = np.sum(node_growth, axis=0)
axes[1, 0].plot(days, daily_growth, color='#f59e0b', linewidth=2)
axes[1, 0].fill_between(days, daily_growth, alpha=0.3, color='#f59e0b')
axes[1, 0].set_xlabel('Days', color='white')
axes[1, 0].set_ylabel('Growth rate (cm/half-day)', color='white')
axes[1, 0].set_title('Growth rate peaks then stops', color='white', fontsize=10)

# Total height
axes[1, 1].plot(days, total_height, color='#a855f7', linewidth=2.5)
axes[1, 1].axhline(total_height[-1], color='gray', linestyle='--', alpha=0.5)
axes[1, 1].set_xlabel('Days', color='white')
axes[1, 1].set_ylabel('Total height (cm)', color='white')
axes[1, 1].set_title(f'Final height: {total_height[-1]:.0f} cm ({total_height[-1]/100:.1f} m)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(f"Peak active meristems: {int(np.max(active_count))} at day {days[np.argmax(active_count)]:.0f}")
print(f"Growth window: ~{days[np.argmax(daily_growth > 0.1)]:.0f} to ~{days[len(days)-1-np.argmax(daily_growth[::-1] > 0.1)]:.0f} days")
print(f"Final height: {total_height[-1]:.0f} cm ({total_height[-1]/100:.1f} m)")
print(f"After lignification: zero further growth — the culm is fixed forever.")`,
      challenge: 'Modify the activation pattern so all nodes activate simultaneously (set activate_day = 5 for all). Compare the growth curve shape. Then try sequential activation with a 5-day gap between nodes. Which pattern matches real bamboo?',
      successHint: 'Real bamboo uses staggered activation — lower nodes start first, creating a wave of growth that moves upward. This ensures structural stability: the base hardens before the top gets heavy.',
    },
    {
      title: 'Growth hormones — auxin and gibberellin',
      concept: `Cell division alone does not explain bamboo\'s growth. After a cell divides, it must **elongate** — sometimes stretching to 10-100x its original length. This elongation is controlled by **plant hormones**, primarily **auxin** and **gibberellin**.

**Auxin** (indole-3-acetic acid, IAA) is the master growth coordinator:
- It loosens cell walls by activating **expansin proteins** that break hydrogen bonds between cellulose fibers
- It follows **polar auxin transport** — moving downward from shoot tips through specialized carrier proteins
- At low concentrations it promotes growth; at high concentrations it inhibits it (the acid growth hypothesis)
- It causes **phototropism** (bending toward light) and **gravitropism** (roots growing down)

**Gibberellin** (GA3 and related compounds) is the elongation accelerator:
- It promotes cell elongation by inducing **alpha-amylase** production, which mobilizes starch reserves for energy
- It triggers the degradation of **DELLA proteins**, which normally act as growth brakes
- Bamboo shoots contain exceptionally high gibberellin levels during their growth spurt
- Dwarf plant varieties typically have mutations in gibberellin synthesis or signaling pathways

Together, auxin says "where and when to grow" and gibberellin says "grow faster." Bamboo floods its intercalary meristems with both hormones during the growth phase.`,
      analogy: 'Think of building a balloon animal. Auxin is the person deciding which sections to inflate and in what order. Gibberellin is the air pump — the more you pump, the faster each section expands. You need both: without direction (auxin), the balloon inflates randomly; without force (gibberellin), nothing expands even if you know the plan.',
      storyConnection: 'Traditional bamboo farmers in Assam\'s Nagaon district discovered empirically that bamboo shoots grown in nutrient-rich floodplain soil grow taller than those on hillsides. The reason: floodplain soil has more nitrogen and phosphorus, which fuel gibberellin synthesis. The farmers did not know the biochemistry, but they knew the pattern — the river\'s gift to bamboo.',
      checkQuestion: 'If you applied pure gibberellin to a bamboo shoot but blocked auxin transport, what would happen?',
      checkAnswer: 'The cells would try to elongate everywhere simultaneously without directional coordination. You would get swollen, distorted tissue rather than organized vertical growth. Gibberellin provides the elongation force, but auxin provides the spatial patterning — telling each cell which direction to elongate. Both signals are needed for normal, directed growth.',
      codeIntro: 'Model hormone-driven cell elongation, showing how auxin and gibberellin concentrations interact to control growth rate.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hormone-driven growth model
# Auxin controls direction/timing, gibberellin controls rate

# Simulate a vertical section of bamboo stem (20 segments)
n_segments = 20
hours = 120  # 5 days
dt = 0.5

# Auxin gradient: high at top (produced by apical meristem), low at bottom
# Flows downward via polar transport
auxin = np.zeros((n_segments, int(hours/dt)))
gibberellin = np.zeros((n_segments, int(hours/dt)))
cell_length = np.ones((n_segments, int(hours/dt))) * 10  # initial 10 um

# Initial conditions
auxin[:, 0] = np.linspace(5.0, 0.5, n_segments)  # top=high, bottom=low
gibberellin[:, 0] = np.ones(n_segments) * 3.0

for t in range(1, int(hours/dt)):
    hour = t * dt

    # Auxin production at tip (segment 0) with day/night cycle
    h_of_day = hour % 24
    production = 2.0 if 6 <= h_of_day <= 18 else 0.5
    auxin[0, t] = auxin[0, t-1] + production * dt

    # Polar auxin transport: flows downward
    for s in range(1, n_segments):
        transport = 0.15 * (auxin[s-1, t-1] - auxin[s, t-1]) * dt
        auxin[s, t] = auxin[s, t-1] + max(0, transport)
        auxin[s-1, t] = auxin[s-1, t-1] - max(0, transport) * 0.5

    # Gibberellin: produced in response to auxin, enhances elongation
    for s in range(n_segments):
        ga_production = 0.3 * auxin[s, t-1] * dt  # auxin induces GA
        ga_decay = 0.02 * gibberellin[s, t-1] * dt
        gibberellin[s, t] = gibberellin[s, t-1] + ga_production - ga_decay

    # Cell elongation: function of both hormones
    for s in range(n_segments):
        # Optimal auxin range for elongation: 1-4 uM
        aux = auxin[s, t]
        if aux < 0.5:
            auxin_effect = aux / 0.5  # too little
        elif aux <= 4.0:
            auxin_effect = 1.0  # optimal range
        else:
            auxin_effect = max(0, 1.0 - (aux - 4.0) / 6.0)  # inhibitory at high conc

        ga_effect = gibberellin[s, t] / (gibberellin[s, t] + 2.0)  # saturating

        growth = 0.3 * auxin_effect * ga_effect * dt  # um per timestep
        cell_length[s, t] = cell_length[s, t-1] + growth

# Calculate total elongation per segment
elongation = cell_length[:, -1] - cell_length[:, 0]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

time_axis = np.arange(0, hours, dt)

# Auxin distribution over time
im1 = axes[0, 0].imshow(auxin, aspect='auto', cmap='YlOrRd',
                          extent=[0, hours, n_segments, 0])
axes[0, 0].set_xlabel('Hours', color='white')
axes[0, 0].set_ylabel('Segment (top=0)', color='white')
axes[0, 0].set_title('Auxin concentration', color='white', fontsize=10)
plt.colorbar(im1, ax=axes[0, 0], label='uM')

# Gibberellin distribution
im2 = axes[0, 1].imshow(gibberellin, aspect='auto', cmap='YlGn',
                          extent=[0, hours, n_segments, 0])
axes[0, 1].set_xlabel('Hours', color='white')
axes[0, 1].set_ylabel('Segment (top=0)', color='white')
axes[0, 1].set_title('Gibberellin concentration', color='white', fontsize=10)
plt.colorbar(im2, ax=axes[0, 1], label='uM')

# Cell elongation profile
axes[1, 0].barh(np.arange(n_segments), elongation, color='#22c55e', alpha=0.8)
axes[1, 0].set_xlabel('Elongation (um)', color='white')
axes[1, 0].set_ylabel('Segment (top=0)', color='white')
axes[1, 0].set_title('Total elongation by position', color='white', fontsize=10)
axes[1, 0].invert_yaxis()

# Growth dynamics at selected segments
for s, label, color in [(2, 'Near tip', '#ef4444'), (10, 'Middle', '#22c55e'), (18, 'Near base', '#3b82f6')]:
    axes[1, 1].plot(time_axis, cell_length[s], color=color, linewidth=2, label=label)
axes[1, 1].set_xlabel('Hours', color='white')
axes[1, 1].set_ylabel('Cell length (um)', color='white')
axes[1, 1].set_title('Cell elongation over time', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Auxin-gibberellin interaction model:")
print(f"  Peak auxin at tip: {auxin[0, -1]:.1f} uM")
print(f"  Peak gibberellin (mid-stem): {gibberellin[10, -1]:.1f} uM")
print(f"  Maximum cell elongation: {np.max(elongation):.1f} um (segment {np.argmax(elongation)})")
print(f"  Minimum cell elongation: {np.min(elongation):.1f} um (segment {np.argmin(elongation)})")
print(f"  The growth zone is in the MIDDLE — not at the tip or base.")
print(f"  Too much auxin at the tip inhibits growth; too little at the base limits it.")`,
      challenge: 'Set all auxin concentrations to a constant 2.0 uM (remove the gradient). How does the elongation profile change? Then try doubling gibberellin production. Which hormone has more control over the spatial pattern of growth?',
      successHint: 'Auxin creates the spatial pattern (where growth happens); gibberellin amplifies the rate. This division of labor between patterning and amplification hormones is a recurring theme in developmental biology.',
    },
    {
      title: 'Exponential vs logistic growth models',
      concept: `When resources are unlimited, populations and organisms grow **exponentially**: each unit produces more units, which produce still more. The equation is simple: N(t) = N0 * e^(rt), where r is the growth rate. Exponential growth produces the classic J-shaped curve.

But nothing grows forever. Eventually, resources run out — space, nutrients, water, light. Growth slows and approaches a maximum called the **carrying capacity** (K). This gives us the **logistic model**: dN/dt = r * N * (1 - N/K). The logistic curve is S-shaped (sigmoid):

- **Phase 1 (lag)**: few cells, slow start
- **Phase 2 (exponential)**: resources abundant, growth accelerates
- **Phase 3 (deceleration)**: approaching capacity, growth slows
- **Phase 4 (plateau)**: at carrying capacity, net growth is zero

Bamboo growth follows a modified logistic curve. The initial shoot emerges slowly (lag), then shoots upward at astonishing rates (exponential), then slows as it approaches genetically determined maximum height (deceleration), and finally stops completely when meristems lignify (plateau — but not due to resource limitation, due to developmental programming).

Understanding which model fits your data tells you something fundamental about the system: is it resource-limited (logistic), developmentally programmed (modified logistic), or truly unconstrained (exponential — rare in nature)?`,
      analogy: 'Exponential growth is like a rumor in a school: each person tells two friends, who each tell two more. Within hours, everyone knows. Logistic growth is the same rumor but in a small village: once most people have heard it, there are fewer new people to tell. The rumor spreads fast initially, then slows as it "fills" the population.',
      storyConnection: 'Bamboo groves in Assam expand logistically. A new grove starts with a few rhizomes, spreads rapidly through underground runners, then slows as the grove fills the available soil. Farmers in the Brahmaputra floodplain know that a bamboo patch reaches "full size" in about 8-10 years, then produces the same number of new shoots each year — a living demonstration of carrying capacity.',
      checkQuestion: 'A bamboo culm reaches 20 meters in 60 days. If it grew exponentially the entire time (no slowdown), approximately how tall would it be at day 90?',
      checkAnswer: 'If growth were truly exponential at the same rate, we can estimate: r = ln(2000/1) / 60 ≈ 0.127 per day (assuming 1 cm start). At day 90: e^(0.127*90) ≈ 89,000 cm = 890 meters. Obviously impossible — this shows why exponential growth cannot persist. The logistic model is essential for realistic predictions. Real bamboo at day 90 would still be 20 meters — it stops growing at day 60.',
      codeIntro: 'Compare exponential, logistic, and bamboo-specific growth models side by side.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Three growth models
days = np.linspace(0, 120, 500)

# Model 1: Pure exponential
r_exp = 0.08  # growth rate per day
N0 = 1.0  # starting height in cm
exponential = N0 * np.exp(r_exp * days)

# Model 2: Logistic
K = 2000  # carrying capacity (20 meters in cm)
r_log = 0.12
logistic = K / (1 + ((K - N0) / N0) * np.exp(-r_log * days))

# Model 3: Bamboo-specific (logistic with developmental cutoff)
cutoff_day = 65  # meristems lignify
r_bam = 0.15
bamboo = np.zeros_like(days)
for i, d in enumerate(days):
    if d <= cutoff_day:
        bamboo[i] = K / (1 + ((K - N0) / N0) * np.exp(-r_bam * d))
    else:
        bamboo[i] = bamboo[i-1]  # no more growth

# Growth rates (derivatives)
exp_rate = r_exp * exponential
log_rate = r_log * logistic * (1 - logistic / K)
bam_rate = np.gradient(bamboo, days[1] - days[0])

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')
for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Height curves
axes[0].plot(days, exponential, color='#ef4444', linewidth=2, label='Exponential')
axes[0].plot(days, logistic, color='#3b82f6', linewidth=2, label='Logistic')
axes[0].plot(days, bamboo, color='#22c55e', linewidth=2.5, label='Bamboo (cutoff)')
axes[0].axhline(K, color='gray', linestyle='--', alpha=0.5, label=f'K = {K} cm')
axes[0].axvline(cutoff_day, color='#22c55e', linestyle=':', alpha=0.5)
axes[0].set_ylim(0, K * 1.2)
axes[0].set_xlabel('Days', color='white')
axes[0].set_ylabel('Height (cm)', color='white')
axes[0].set_title('Growth models compared', color='white', fontsize=11)
axes[0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Growth rates
axes[1].plot(days, np.clip(exp_rate, 0, 500), color='#ef4444', linewidth=2, label='Exponential')
axes[1].plot(days, log_rate, color='#3b82f6', linewidth=2, label='Logistic')
axes[1].plot(days, bam_rate, color='#22c55e', linewidth=2.5, label='Bamboo')
axes[1].set_xlabel('Days', color='white')
axes[1].set_ylabel('Growth rate (cm/day)', color='white')
axes[1].set_title('Rate of growth', color='white', fontsize=11)
axes[1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Log scale comparison
axes[2].semilogy(days, exponential, color='#ef4444', linewidth=2, label='Exponential')
axes[2].semilogy(days, logistic, color='#3b82f6', linewidth=2, label='Logistic')
axes[2].semilogy(days, np.maximum(bamboo, 0.1), color='#22c55e', linewidth=2.5, label='Bamboo')
axes[2].set_xlabel('Days', color='white')
axes[2].set_ylabel('Height (cm, log scale)', color='white')
axes[2].set_title('Log scale reveals model differences', color='white', fontsize=11)
axes[2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Model comparison at key timepoints:")
print(f"{'Day':<8} {'Exponential':>14} {'Logistic':>14} {'Bamboo':>14}")
print("-" * 52)
for d in [10, 30, 50, 65, 90, 120]:
    idx = np.argmin(np.abs(days - d))
    print(f"{d:<8} {exponential[idx]:>12.1f} cm {logistic[idx]:>12.1f} cm {bamboo[idx]:>12.1f} cm")

print(f"\\nExponential at day 120: {exponential[-1]:,.0f} cm = {exponential[-1]/100:,.0f} m (absurd)")
print(f"Logistic at day 120: {logistic[-1]:.0f} cm = {logistic[-1]/100:.1f} m (realistic)")
print(f"Bamboo at day 120: {bamboo[-1]:.0f} cm — stopped growing at day {cutoff_day}")`,
      challenge: 'Add a fourth model: Gompertz growth, where dN/dt = r * N * ln(K/N). This model has a more asymmetric S-curve that often fits biological growth better than logistic. Plot it alongside the others.',
      successHint: 'Model selection matters. The logistic model assumes resource limitation as the growth constraint. Bamboo\'s actual constraint is developmental — the meristems are programmed to shut down. Same curve shape, completely different mechanism.',
    },
    {
      title: 'Turgor pressure and cell expansion',
      concept: `When a plant cell divides, the daughter cells are tiny — maybe 5-10 micrometers across. To build a visible organ like a bamboo culm, these cells must **expand** dramatically, sometimes 100-fold in volume. The force driving this expansion is **turgor pressure**.

**Turgor pressure** is the internal hydrostatic pressure inside a plant cell. It arises because the cell interior is a concentrated solution of sugars, ions, and organic acids. Water flows in by **osmosis** (from low solute concentration outside to high concentration inside), and the rigid **cell wall** prevents the cell from bursting. The result is an inflated cell pressing outward against its wall — like a water balloon inside a cardboard box.

The physics is governed by the **Lockhart equation**: dV/dt = m * (P - Y), where:
- dV/dt is the rate of volume increase
- m is the **wall extensibility** (how easily the wall stretches — auxin increases this)
- P is the turgor pressure
- Y is the **yield threshold** (minimum pressure needed to stretch the wall)

When P > Y, the cell expands. When P < Y, expansion stops. Bamboo cells maintain high turgor pressure through active solute pumping (potassium ions, sugars) and have high wall extensibility due to abundant expansin proteins. The combination produces rapid cell expansion.

Water availability is critical: a bamboo shoot can lose 60% of its growth rate within hours of drought onset, because turgor pressure drops when water is scarce.`,
      analogy: 'Imagine a crowd of people inside a stretchy tent. As more people crowd in (water entering by osmosis), they push on the tent walls. If the tent fabric is stiff (low extensibility), the tent barely expands. If you loosen the seams (what auxin does), the tent stretches easily. Turgor pressure is the crowd pushing; extensibility is how stretchy the fabric is.',
      storyConnection: 'Bamboo farmers along the Brahmaputra know that the tallest bamboo grows during the monsoon when water is abundant. During dry winters, new shoots grow shorter and slower. This is turgor pressure at work — the monsoon floods provide the water needed to maintain high cellular pressure. The river gives bamboo the force to grow.',
      checkQuestion: 'If a plant cell has turgor pressure of 0.5 MPa and the yield threshold is 0.3 MPa, what happens if the plant wilts and turgor drops to 0.2 MPa?',
      checkAnswer: 'Growth stops immediately. With P (0.2 MPa) less than Y (0.3 MPa), the Lockhart equation gives dV/dt = m * (0.2 - 0.3) = negative value, meaning no expansion. In reality, growth rate goes to zero (cells do not shrink, they just stop expanding). This is why wilting plants stop growing even before they show visible drooping.',
      codeIntro: 'Simulate the Lockhart equation for cell expansion under varying turgor pressure and wall extensibility conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lockhart equation: dV/dt = m * max(0, P - Y)
# V = cell volume, m = extensibility, P = turgor, Y = yield threshold

hours = 48
dt = 0.1
time = np.arange(0, hours, dt)

# Scenario 1: Normal bamboo (high turgor, high extensibility)
# Scenario 2: Drought (low turgor)
# Scenario 3: Low extensibility (no auxin)
# Scenario 4: Osmotic boost (extra solutes)

scenarios = {
    'Normal bamboo': {'m': 0.15, 'P_base': 0.8, 'Y': 0.3, 'water': 1.0},
    'Drought stress': {'m': 0.15, 'P_base': 0.8, 'Y': 0.3, 'water': 0.5},
    'Low extensibility': {'m': 0.04, 'P_base': 0.8, 'Y': 0.3, 'water': 1.0},
    'Osmotic boost': {'m': 0.15, 'P_base': 1.2, 'Y': 0.3, 'water': 1.0},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

colors = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']
results = {}

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

for idx, (name, params) in enumerate(scenarios.items()):
    V = np.zeros_like(time)
    V[0] = 100  # initial volume (arbitrary units)
    P_history = np.zeros_like(time)

    for i in range(1, len(time)):
        # Turgor depends on water availability and cell size
        # As cell expands, solute dilutes, reducing turgor
        dilution = V[0] / V[i-1]  # concentration decreases as volume grows
        water_factor = params['water']

        # Day/night water availability
        h = (time[i] % 24)
        if 10 <= h <= 16:  # midday: transpiration pulls water away
            water_factor *= 0.85

        P = params['P_base'] * dilution * water_factor
        P_history[i] = P

        # Lockhart equation
        growth = params['m'] * max(0, P - params['Y']) * dt
        V[i] = V[i-1] + growth

    results[name] = {'V': V, 'P': P_history}

    # Volume growth
    axes[0, 0].plot(time, V, color=colors[idx], linewidth=2, label=name)
    # Turgor pressure
    axes[0, 1].plot(time, P_history, color=colors[idx], linewidth=1.5, label=name)

axes[0, 0].set_xlabel('Hours', color='white')
axes[0, 0].set_ylabel('Cell volume (arb. units)', color='white')
axes[0, 0].set_title('Cell expansion under different conditions', color='white', fontsize=10)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

axes[0, 1].set_xlabel('Hours', color='white')
axes[0, 1].set_ylabel('Turgor pressure (MPa)', color='white')
axes[0, 1].set_title('Turgor pressure dynamics', color='white', fontsize=10)
axes[0, 1].axhline(0.3, color='gray', linestyle='--', alpha=0.5, label='Yield threshold')
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Growth rate comparison
for idx, (name, data) in enumerate(results.items()):
    rate = np.gradient(data['V'], dt)
    axes[1, 0].plot(time, rate, color=colors[idx], linewidth=1.5, label=name)
axes[1, 0].set_xlabel('Hours', color='white')
axes[1, 0].set_ylabel('Growth rate (volume/hr)', color='white')
axes[1, 0].set_title('Expansion rate', color='white', fontsize=10)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Final comparison bar chart
names = list(results.keys())
final_vols = [results[n]['V'][-1] for n in names]
bars = axes[1, 1].barh(names, final_vols, color=colors, alpha=0.8)
axes[1, 1].set_xlabel('Final volume', color='white')
axes[1, 1].set_title('Final cell volume comparison', color='white', fontsize=10)
for bar, v in zip(bars, final_vols):
    axes[1, 1].text(v + 1, bar.get_y() + bar.get_height()/2,
                     f'{v:.0f}', color='white', va='center', fontsize=9)

plt.tight_layout()
plt.show()

print("Cell expansion results after 48 hours:")
for name, data in results.items():
    expansion = data['V'][-1] / data['V'][0]
    print(f"  {name:<22}: {data['V'][-1]:.0f} vol units ({expansion:.1f}x expansion)")
print(f"\\nWater is the dominant factor: drought cuts expansion by ~{(1 - results['Drought stress']['V'][-1]/results['Normal bamboo']['V'][-1])*100:.0f}%")
print(f"Extensibility (auxin) matters too: low m cuts by ~{(1 - results['Low extensibility']['V'][-1]/results['Normal bamboo']['V'][-1])*100:.0f}%")`,
      challenge: 'Add a scenario where the plant pumps in extra potassium ions at hour 12 (increasing P_base by 0.3 for the remaining time). This models active osmotic adjustment. How much extra growth does the cell gain?',
      successHint: 'The Lockhart equation captures a deep truth: growth requires both the force to expand (turgor pressure) and the structural permission to expand (wall extensibility). Biology controls both independently.',
    },
    {
      title: 'Comparative growth rates across species',
      concept: `Bamboo is fast, but how fast compared to everything else? To answer this scientifically, we need to normalize growth rates and compare across species using consistent metrics.

**Absolute growth rate** (AGR): length or mass gained per unit time. Bamboo: ~91 cm/day peak. Giant kelp: ~50 cm/day. Kudzu vine: ~30 cm/day. Oak tree: ~0.3 cm/day.

**Relative growth rate** (RGR): growth per unit existing size per unit time. RGR = (1/W) * dW/dt, where W is current biomass. This normalizes for body size — a bacterium doubling every 20 minutes has an astronomical RGR despite being microscopic. For fair comparison, RGR is the better metric.

**Specific leaf area** (SLA) and **leaf area ratio** (LAR) predict RGR across species: plants with thin, wide leaves (high SLA) capture more light per gram of leaf, enabling faster growth. Bamboo leaves have moderate SLA but compensate with enormous total leaf area on established clumps.

**Growth strategies** vary fundamentally:
- **Ruderals** (weeds, bamboo): fast growth, quick reproduction, short-lived organs
- **Competitors** (trees): moderate growth, invest in structural wood, long-lived
- **Stress-tolerators** (cacti, alpine plants): slow growth, conserve resources, survive harsh conditions

These correspond to the **r/K selection** spectrum: bamboo is an r-strategist in its growth phase (maximize growth rate) but a K-strategist as a clump (stable, competitive).`,
      analogy: 'Comparing absolute growth rates across species is like comparing a cheetah\'s top speed to an ant\'s. The cheetah wins in absolute terms (km/h), but the ant moves 50 body lengths per second while the cheetah moves about 25. Relative to body size, the ant is faster. Similarly, a bacterium\'s relative growth rate dwarfs bamboo\'s, even though bamboo adds more absolute height.',
      storyConnection: 'In the mixed forests of Meghalaya, bamboo grows alongside teak, sal, and pine. After a landslide clears a hillside, bamboo colonizes first — its rapid growth lets it capture sunlight before slower trees can establish. But within 30-50 years, tall trees overtake the bamboo canopy. This succession from fast r-strategists to slow K-strategists plays out on every disturbed hillside in northeast India.',
      checkQuestion: 'A bamboo culm grows 90 cm in a day. A bacterial colony doubles its mass every 20 minutes. Which has the higher relative growth rate?',
      checkAnswer: 'The bacterium, by far. A bamboo culm growing 90 cm from a 500 cm starting height has RGR = 90/500 = 0.18 per day. A bacterium doubling every 20 minutes has RGR = ln(2)/20 min = 0.035 per minute = 50 per day. The bacterium\'s RGR is ~280 times higher than bamboo\'s. Absolute size is misleading — relative growth rate tells the real story.',
      codeIntro: 'Compare growth rates across species using both absolute and relative metrics, and visualize the r/K strategy spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Growth data for diverse species
species_data = {
    'E. coli (bacterium)':  {'agr_cm_day': 0.0001, 'doubling_hr': 0.33, 'max_size_cm': 0.0002, 'strategy': 'r'},
    'Duckweed':             {'agr_cm_day': 0.5, 'doubling_hr': 48, 'max_size_cm': 1, 'strategy': 'r'},
    'Kudzu vine':           {'agr_cm_day': 30, 'doubling_hr': 720, 'max_size_cm': 3000, 'strategy': 'r'},
    'Giant kelp':           {'agr_cm_day': 50, 'doubling_hr': 840, 'max_size_cm': 4500, 'strategy': 'r'},
    'Bamboo (Moso)':        {'agr_cm_day': 91, 'doubling_hr': 360, 'max_size_cm': 2800, 'strategy': 'r/K'},
    'Sunflower':            {'agr_cm_day': 5, 'doubling_hr': 480, 'max_size_cm': 300, 'strategy': 'r'},
    'Corn (maize)':         {'agr_cm_day': 8, 'doubling_hr': 600, 'max_size_cm': 300, 'strategy': 'r'},
    'Pine tree':            {'agr_cm_day': 0.15, 'doubling_hr': 17520, 'max_size_cm': 3000, 'strategy': 'K'},
    'Oak tree':             {'agr_cm_day': 0.08, 'doubling_hr': 26280, 'max_size_cm': 2500, 'strategy': 'K'},
    'Saguaro cactus':       {'agr_cm_day': 0.003, 'doubling_hr': 87600, 'max_size_cm': 1200, 'strategy': 'S'},
    'Bristlecone pine':     {'agr_cm_day': 0.01, 'doubling_hr': 43800, 'max_size_cm': 1500, 'strategy': 'S'},
}

names = list(species_data.keys())
agrs = [species_data[n]['agr_cm_day'] for n in names]
rgrs = [np.log(2) / species_data[n]['doubling_hr'] for n in names]  # per hour
max_sizes = [species_data[n]['max_size_cm'] for n in names]
strategies = [species_data[n]['strategy'] for n in names]

# Color by strategy
strat_colors = {'r': '#ef4444', 'r/K': '#f59e0b', 'K': '#3b82f6', 'S': '#8b5cf6'}
colors = [strat_colors[s] for s in strategies]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Absolute growth rate (log scale)
sorted_idx = np.argsort(agrs)
axes[0, 0].barh([names[i] for i in sorted_idx],
                 [agrs[i] for i in sorted_idx],
                 color=[colors[i] for i in sorted_idx], alpha=0.85)
axes[0, 0].set_xscale('log')
axes[0, 0].set_xlabel('AGR (cm/day, log scale)', color='white')
axes[0, 0].set_title('Absolute Growth Rate', color='white', fontsize=11)
axes[0, 0].tick_params(axis='y', labelsize=8)

# 2: Relative growth rate (log scale)
sorted_idx_r = np.argsort(rgrs)
axes[0, 1].barh([names[i] for i in sorted_idx_r],
                 [rgrs[i] for i in sorted_idx_r],
                 color=[colors[i] for i in sorted_idx_r], alpha=0.85)
axes[0, 1].set_xscale('log')
axes[0, 1].set_xlabel('RGR (per hour, log scale)', color='white')
axes[0, 1].set_title('Relative Growth Rate', color='white', fontsize=11)
axes[0, 1].tick_params(axis='y', labelsize=8)

# 3: AGR vs RGR scatter
for i, name in enumerate(names):
    axes[1, 0].scatter(rgrs[i], agrs[i], color=colors[i], s=100, zorder=5, edgecolors='white', linewidth=0.5)
    axes[1, 0].annotate(name.split('(')[0].strip(), (rgrs[i], agrs[i]),
                         fontsize=6, color='white', xytext=(5, 5), textcoords='offset points')
axes[1, 0].set_xscale('log')
axes[1, 0].set_yscale('log')
axes[1, 0].set_xlabel('RGR (per hour)', color='white')
axes[1, 0].set_ylabel('AGR (cm/day)', color='white')
axes[1, 0].set_title('Absolute vs Relative growth', color='white', fontsize=11)

# 4: Growth curves for selected species
days = np.linspace(0, 90, 500)
selected = ['Bamboo (Moso)', 'Corn (maize)', 'Pine tree', 'Saguaro cactus']
for name in selected:
    d = species_data[name]
    K = d['max_size_cm']
    r = np.log(2) / (d['doubling_hr'] / 24)  # per day
    curve = K / (1 + (K - 1) / 1 * np.exp(-r * days))
    axes[1, 1].plot(days, curve, linewidth=2, label=name,
                     color=strat_colors[d['strategy']])
axes[1, 1].set_xlabel('Days', color='white')
axes[1, 1].set_ylabel('Height (cm)', color='white')
axes[1, 1].set_title('Growth trajectories (90 days)', color='white', fontsize=11)
axes[1, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Growth rate rankings:")
print(f"\\n  By ABSOLUTE rate (cm/day):")
for i in sorted(range(len(names)), key=lambda x: agrs[x], reverse=True)[:5]:
    print(f"    {names[i]:<25} {agrs[i]:>10.3f} cm/day  [{strategies[i]}]")
print(f"\\n  By RELATIVE rate (doublings/day):")
for i in sorted(range(len(names)), key=lambda x: rgrs[x], reverse=True)[:5]:
    print(f"    {names[i]:<25} {rgrs[i]*24:>10.3f} /day  [{strategies[i]}]")
print(f"\\nBamboo wins AGR but bacteria dominate RGR.")
print(f"The metric you choose changes the ranking entirely.")`,
      challenge: 'Add data for two more species you know about. Then calculate "growth efficiency" = final_size / total_growth_days. Which species is most efficient at reaching its maximum size?',
      successHint: 'Comparing across species requires careful normalization. This lesson applies to any comparison problem: raw numbers can be misleading without proper baselines. Relative growth rate is to biology what percentage return is to finance.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Plant Growth Biology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Cell biology, hormones & growth models</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biological modeling. Click to start.</p>
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
