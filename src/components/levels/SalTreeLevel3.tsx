import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SalTreeLevel3() {
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
      title: 'Deciduous forest ecology — why sal forests shed their leaves',
      concept: `Sal (Shorea robusta) forms the dominant deciduous forests across much of South Asia. These forests follow a seasonal rhythm: full canopy during monsoon, leaf drop in late winter/spring, and explosive regrowth when rains return.

**Deciduousness** is an adaptation to seasonal drought. Keeping leaves alive through the dry season costs water — water that the tree cannot afford to lose. By dropping leaves, the sal tree:
1. **Eliminates transpiration loss** — no leaves = no water loss through stomata
2. **Recycles nutrients** — before dropping, the tree reabsorbs ~50% of leaf nitrogen and phosphorus
3. **Reduces pathogen load** — fungi and insects that colonize leaves are shed with them
4. **Opens the forest floor** to light, enabling an understory community that depends on seasonal gaps

Sal forests are classified as **tropical dry deciduous** forests. They receive 1000-2000 mm of rainfall annually, but almost entirely during the 4-month monsoon (June-September). The remaining 8 months have little to no rain.

The forest exists as a **community**, not just a collection of trees. Sal forms the canopy layer (25-35m). Below it: teak, palash, and mahua in the sub-canopy. Below that: shrubs, grasses, and the famous sal leaf plates (used across India for serving food). Each layer depends on the others.`,
      analogy: 'A deciduous forest is like a business that operates seasonally — a ski resort that closes in summer. Rather than paying expensive staff (leaves) year-round, it shuts down, conserves resources, and reopens when conditions are right. The "off-season" is not death — it is strategic dormancy.',
      storyConnection: 'The sal tree in our story stood through every season — massive in monsoon with its full crown of leaves, skeletal in spring when it shed everything. The villagers knew the seasons by the sal: when the new leaves came, pink and translucent, the rains would follow.',
      checkQuestion: 'If sal trees could keep their leaves year-round (like an evergreen), would they outcompete deciduous individuals? Why or why not?',
      checkAnswer: 'In their current habitat, no. Keeping leaves through the 8-month dry season would cost more water than the leaves could earn through photosynthesis. Stomata must open for CO2 uptake, but open stomata lose water. With soil moisture near zero in the dry season, an evergreen sal would desiccate and die. Deciduousness is the optimal water budget strategy for seasonal drought.',
      codeIntro: 'Model the seasonal water and carbon budget of a sal forest to show why deciduousness is optimal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Seasonal model: 12 months
months = np.arange(12)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Rainfall pattern (monsoon: Jun-Sep)
rainfall = np.array([10, 5, 15, 20, 50, 250, 400, 350, 200, 60, 15, 10])  # mm/month

# Soil moisture model (simplified)
def soil_moisture_model(rainfall, et_rate, capacity=300):
    """Track soil moisture over a year."""
    moisture = [capacity * 0.5]  # start at 50%
    for i in range(12):
        new_m = moisture[-1] + rainfall[i] - et_rate[i]
        moisture.append(np.clip(new_m, 0, capacity))
    return np.array(moisture[1:])

# Strategy 1: Deciduous (shed leaves in dry season)
# Leaf area index (LAI) varies seasonally
deciduous_lai = np.array([0.5, 0.2, 0.1, 0.1, 0.5, 3.0, 5.0, 5.0, 4.5, 3.0, 1.5, 0.8])
# Transpiration = LAI * base_rate * moisture_factor
deciduous_et = deciduous_lai * 30  # mm/month per unit LAI (simplified)

# Strategy 2: Evergreen (keeps leaves year-round)
evergreen_lai = np.full(12, 3.5)
evergreen_et = evergreen_lai * 30

# Photosynthesis: proportional to LAI * light * moisture * temperature
light = np.array([0.6, 0.7, 0.8, 0.9, 0.9, 0.7, 0.5, 0.5, 0.6, 0.7, 0.7, 0.6])
temperature_factor = np.array([0.6, 0.7, 0.8, 0.9, 1.0, 0.95, 0.9, 0.9, 0.9, 0.85, 0.75, 0.65])

soil_deciduous = soil_moisture_model(rainfall, deciduous_et)
soil_evergreen = soil_moisture_model(rainfall, evergreen_et)

moisture_factor_d = np.clip(soil_deciduous / 150, 0, 1)
moisture_factor_e = np.clip(soil_evergreen / 150, 0, 1)

photo_deciduous = deciduous_lai * light * moisture_factor_d * temperature_factor * 10  # gC/m2/month
photo_evergreen = evergreen_lai * light * moisture_factor_e * temperature_factor * 10

# Carbon cost of maintaining leaves
leaf_maint_d = deciduous_lai * 5  # gC/m2/month
leaf_maint_e = evergreen_lai * 5

# Cost of growing new leaves each year
leaf_growth_cost_d = 40  # gC/m2/year (must regrow full canopy)
leaf_growth_cost_e = 10  # gC/m2/year (only replaces old leaves)

net_carbon_d = photo_deciduous - leaf_maint_d
net_carbon_e = photo_evergreen - leaf_maint_e

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Rainfall and soil moisture
ax = axes[0, 0]
ax.bar(months, rainfall, color='#3b82f6', alpha=0.6, label='Rainfall')
ax.plot(months, soil_deciduous, 'o-', color='#22c55e', linewidth=2, label='Soil moisture (deciduous)')
ax.plot(months, soil_evergreen, 's-', color='#ef4444', linewidth=2, label='Soil moisture (evergreen)')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('mm', color='white')
ax.set_title('Rainfall & Soil Moisture', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Leaf area index
ax = axes[0, 1]
ax.plot(months, deciduous_lai, 'o-', color='#22c55e', linewidth=2, label='Deciduous (sal)')
ax.plot(months, evergreen_lai, 's-', color='#ef4444', linewidth=2, label='Evergreen')
ax.fill_between(months, deciduous_lai, alpha=0.15, color='#22c55e')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Leaf Area Index', color='white')
ax.set_title('Seasonal Leaf Display', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Photosynthesis
ax = axes[0, 2]
ax.plot(months, photo_deciduous, 'o-', color='#22c55e', linewidth=2, label='Deciduous')
ax.plot(months, photo_evergreen, 's-', color='#ef4444', linewidth=2, label='Evergreen')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Photosynthesis (gC/m²/month)', color='white')
ax.set_title('Carbon Fixation', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Net carbon balance
ax = axes[1, 0]
ax.bar(months - 0.2, net_carbon_d, 0.35, color='#22c55e', label='Deciduous')
ax.bar(months + 0.2, net_carbon_e, 0.35, color='#ef4444', label='Evergreen')
ax.axhline(0, color='gray', linestyle=':', linewidth=0.5)
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Net carbon (gC/m²/month)', color='white')
ax.set_title('Monthly Carbon Balance', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Cumulative annual carbon
ax = axes[1, 1]
cum_d = np.cumsum(net_carbon_d) - leaf_growth_cost_d * np.arange(12) / 12
cum_e = np.cumsum(net_carbon_e) - leaf_growth_cost_e * np.arange(12) / 12
ax.plot(months, cum_d, 'o-', color='#22c55e', linewidth=2, label=f'Deciduous (total: {cum_d[-1]:.0f} gC)')
ax.plot(months, cum_e, 's-', color='#ef4444', linewidth=2, label=f'Evergreen (total: {cum_e[-1]:.0f} gC)')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Cumulative net carbon (gC/m²)', color='white')
ax.set_title('Annual Carbon Budget', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Water stress indicator
ax = axes[1, 2]
water_stress_d = np.where(soil_deciduous < 50, 1 - soil_deciduous / 50, 0)
water_stress_e = np.where(soil_evergreen < 50, 1 - soil_evergreen / 50, 0)
ax.fill_between(months, water_stress_e, color='#ef4444', alpha=0.4, label='Evergreen stress')
ax.fill_between(months, water_stress_d, color='#22c55e', alpha=0.4, label='Deciduous stress')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=8)
ax.set_ylabel('Water stress index (0=none, 1=severe)', color='white')
ax.set_title('Drought Stress', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Deciduous vs Evergreen in Seasonal Drought:")
print(f"  Annual net carbon — Deciduous: {np.sum(net_carbon_d) - leaf_growth_cost_d:.0f} gC/m²")
print(f"  Annual net carbon — Evergreen: {np.sum(net_carbon_e) - leaf_growth_cost_e:.0f} gC/m²")
print(f"  Months of water stress — Deciduous: {np.sum(water_stress_d > 0)}")
print(f"  Months of water stress — Evergreen: {np.sum(water_stress_e > 0)}")
print(f"  The deciduous strategy wins because it avoids the dry-season carbon deficit.")`,
      challenge: 'Increase rainfall by 50% (simulating a wetter climate). At what total annual rainfall does the evergreen strategy become better than deciduous? This explains why rainforests are evergreen and dry forests are deciduous.',
      successHint: 'Deciduousness is an optimization strategy — shed the expensive parts (leaves) when they cannot earn their keep. Sal forests exist at the boundary where seasonal drought makes this trade-off worthwhile.',
    },
    {
      title: 'Leaf phenology & photoperiod — the clock inside a tree',
      concept: `How does a sal tree "know" when to drop its leaves and when to grow new ones? It uses **photoperiod** — day length — as its primary calendar, supplemented by temperature and moisture signals.

**Phenology** is the study of periodic life cycle events (leaf flush, flowering, fruiting) and their relationship to climate. For sal trees:
- **Leaf fall**: January-March (dry season), triggered by decreasing soil moisture
- **Leaf flush**: April-May, triggered by increasing photoperiod and rising temperature
- **Flowering**: March-April, before the new leaf canopy forms (so pollinators can reach flowers)
- **Fruiting**: June-July, timed so seeds disperse at the start of monsoon (optimal germination conditions)

The photoperiod signal is detected by **phytochrome** proteins in leaves and buds. These proteins exist in two forms: Pr (absorbs red light, inactive) and Pfr (absorbs far-red light, active). During daytime, sunlight converts Pr to Pfr. During darkness, Pfr slowly reverts to Pr. The ratio Pfr/Pr acts as a timer — long nights = low Pfr/Pr = winter signal.

This system is remarkably precise. Sal trees within the same population flush leaves within a 2-week window, despite individual variation in water access and microclimate. The photoperiod signal overrides local conditions to synchronize the population — important for cross-pollination and predator satiation of seeds.`,
      analogy: 'The phytochrome system is like an hourglass that resets each sunrise. During the day, sand (Pfr) accumulates in the bottom. During the night, it slowly flows back. If the night is long enough (winter), the hourglass empties completely — the tree reads this as "time to shut down." When nights shorten (spring), the hourglass never empties — the tree reads this as "time to grow."',
      storyConnection: 'The sal tree in our story seemed to know things the villagers did not — it dropped its leaves before the drought hit and flushed new green before the first rains. It was reading the sky, counting the hours of light, using a molecular clock older than any civilization.',
      checkQuestion: 'If you transplanted a sal tree to the equator where day length is constant (12 hours year-round), what would happen to its phenology?',
      checkAnswer: 'Without the photoperiod signal, the tree would lose its seasonal timing. It might become effectively evergreen (no signal to drop leaves), or its phenology might become erratic, triggered only by irregular moisture signals. Some transplanted deciduous trees at the equator do become semi-evergreen, confirming that photoperiod is the master clock.',
      codeIntro: 'Model the phytochrome signaling system and phenological timing across latitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Day length model for different latitudes
def day_length(day_of_year, latitude):
    """Calculate day length in hours for a given latitude and day of year."""
    P = np.arcsin(0.39795 * np.cos(0.2163108 + 2 * np.arctan(0.9671396 * np.tan(0.00860 * (day_of_year - 186)))))
    D = 24 - (24 / np.pi) * np.arccos(
        (np.sin(0.8333 * np.pi / 180) + np.sin(latitude * np.pi / 180) * np.sin(P)) /
        (np.cos(latitude * np.pi / 180) * np.cos(P) + 1e-10)
    )
    return np.clip(D, 0, 24)

days = np.arange(1, 366)

# Phytochrome model
def phytochrome_ratio(day_length_hours):
    """Simplified Pfr/Pr ratio — increases with day length."""
    # During day: Pr -> Pfr (rate proportional to light intensity)
    # During night: Pfr -> Pr (thermal reversion, rate ~0.1/hour)
    night_hours = 24 - day_length_hours
    # Pfr fraction after night = Pfr_day * exp(-k * night_hours)
    k_reversion = 0.15  # reversion rate
    Pfr_day = 0.85  # Pfr fraction at end of day
    Pfr_night = Pfr_day * np.exp(-k_reversion * night_hours)
    return Pfr_night

# Phenological events triggered by phytochrome thresholds
LEAF_DROP_THRESHOLD = 0.25    # below this, trigger leaf drop
LEAF_FLUSH_THRESHOLD = 0.35   # above this (and rising), trigger leaf flush
FLOWERING_THRESHOLD = 0.30    # intermediate, triggers flowering

# Soil moisture model (simplified)
def soil_moisture_annual(day_of_year, latitude=24):
    """Simplified soil moisture for sal habitat."""
    # Monsoon: day 150-270 (Jun-Sep)
    moisture = 30 + 170 * np.exp(-((day_of_year - 210)**2) / 3000)
    return moisture

# Compute for Assam latitude (~26°N)
latitude = 26
dl = np.array([day_length(d, latitude) for d in days])
pfr = np.array([phytochrome_ratio(dl_h) for dl_h in dl])
moisture = np.array([soil_moisture_annual(d) for d in days])

# Determine phenological events
phenology_signal = pfr * np.clip(moisture / 100, 0.3, 1.0)  # combined signal

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Day length across latitudes
ax = axes[0, 0]
for lat, color, label in [(10, '#f59e0b', '10°N (tropics)'),
                           (26, '#22c55e', '26°N (Assam)'),
                           (40, '#3b82f6', '40°N (temperate)'),
                           (55, '#a855f7', '55°N (boreal)')]:
    dl_lat = [day_length(d, lat) for d in days]
    ax.plot(days, dl_lat, color=color, linewidth=2, label=label)
ax.axhline(12, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Day length (hours)', color='white')
ax.set_title('Photoperiod Across Latitudes', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Phytochrome ratio (Assam)
ax = axes[0, 1]
ax.plot(days, pfr, color='#22c55e', linewidth=2)
ax.axhline(LEAF_DROP_THRESHOLD, color='#ef4444', linestyle='--', label='Leaf drop trigger')
ax.axhline(LEAF_FLUSH_THRESHOLD, color='#3b82f6', linestyle='--', label='Leaf flush trigger')
ax.fill_between(days, pfr, where=pfr < LEAF_DROP_THRESHOLD, alpha=0.2, color='#ef4444')
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Pfr/Ptotal ratio', color='white')
ax.set_title('Phytochrome Signal (26°N)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Combined phenology signal
ax = axes[0, 2]
ax.plot(days, phenology_signal, color='#a855f7', linewidth=2, label='Phenology signal')
ax.plot(days, moisture / 300, color='#3b82f6', linewidth=1.5, linestyle='--', label='Soil moisture (norm)')
ax.plot(days, pfr, color='#22c55e', linewidth=1.5, linestyle=':', label='Phytochrome')
# Mark events
ax.axvspan(30, 80, alpha=0.15, color='#ef4444', label='Leaf drop')
ax.axvspan(100, 140, alpha=0.15, color='#f59e0b', label='Flowering')
ax.axvspan(120, 150, alpha=0.15, color='#22c55e', label='Leaf flush')
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Signal strength', color='white')
ax.set_title('Sal Phenology Calendar', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Leaf area through the year
ax = axes[1, 0]
# LAI model based on phenology signal
lai = np.zeros(365)
for i in range(365):
    d = days[i]
    if d < 30 or d > 340:
        lai[i] = max(1.0, 5 * phenology_signal[i])
    elif 30 <= d < 100:
        lai[i] = max(0.2, 5 * (1 - (d - 30) / 70))  # leaf drop
    elif 100 <= d < 150:
        lai[i] = 0.2 + 4.8 * ((d - 100) / 50)  # leaf flush
    else:
        lai[i] = min(5.0, 5 * np.clip(moisture[i] / 150, 0.5, 1.0))

ax.fill_between(days, lai, color='#22c55e', alpha=0.4)
ax.plot(days, lai, color='#22c55e', linewidth=2)
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Leaf Area Index', color='white')
ax.set_title('Sal Leaf Canopy Through Year', color='white', fontsize=11)

# Plot 5: Phenology shift with climate change
ax = axes[1, 1]
# Warming: spring comes earlier, autumn later
shifts = [0, 5, 10, 15]  # days earlier leaf flush
for shift, color in zip(shifts, ['#22c55e', '#f59e0b', '#ef4444', '#a855f7']):
    shifted_lai = np.roll(lai, -shift)
    ax.plot(days, shifted_lai, color=color, linewidth=1.5,
            label=f'+{shift*0.3:.1f}°C warming' if shift > 0 else 'Current')
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('LAI', color='white')
ax.set_title('Phenology Shift Under Warming', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Phenology calendar visualization
ax = axes[1, 2]
events = [
    ('Leaf drop', 30, 90, '#ef4444'),
    ('Bare canopy', 60, 110, '#6b7280'),
    ('Flowering', 90, 130, '#f59e0b'),
    ('Leaf flush', 110, 150, '#22c55e'),
    ('Full canopy', 150, 280, '#059669'),
    ('Fruiting', 170, 220, '#a855f7'),
    ('Seed dispersal', 200, 250, '#3b82f6'),
    ('Senescence', 300, 365, '#dc2626'),
]
for i, (name, start, end, color) in enumerate(events):
    ax.barh(i, end - start, left=start, color=color, edgecolor='none', height=0.6)
    ax.text(start + 2, i, name, va='center', color='white', fontsize=8, fontweight='bold')

month_starts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
ax.set_xticks(month_starts)
ax.set_xticklabels(month_names, color='white', fontsize=7)
ax.set_yticks([])
ax.set_title('Sal Annual Phenology Calendar', color='white', fontsize=11)
ax.set_xlim(1, 365)

plt.tight_layout()
plt.show()

print("Phenology is the heartbeat of the forest — every event precisely timed.")
print(f"At latitude {latitude}°N, day length varies {min(dl):.1f} - {max(dl):.1f} hours")
print(f"Phytochrome ratio varies {min(pfr):.3f} - {max(pfr):.3f}")
print("The tree integrates photoperiod + moisture + temperature into a single decision.")`,
      challenge: 'Model what happens if monsoon arrival shifts 30 days later (climate change scenario). The tree flushes leaves on the old schedule (photoperiod-driven) but rain arrives late. What happens to the carbon balance during the "gap" period?',
      successHint: 'Phenology is one of the most visible impacts of climate change. When the photoperiod clock and the moisture clock get out of sync, forests suffer. Understanding these signals is critical for predicting how forests will respond to a warming world.',
    },
    {
      title: 'Transpiration & the water cycle — trees as water pumps',
      concept: `A large sal tree can transpire **200-400 liters of water per day** through its leaves. A sal forest transpires so much water that it measurably increases local rainfall — trees do not just respond to the water cycle, they DRIVE it.

**Transpiration** is the evaporation of water from stomata (tiny pores on leaf surfaces). It is powered by the sun and driven by water potential gradients:
1. Sun heats leaf surfaces, evaporating water from mesophyll cells
2. This creates negative water potential in the leaf
3. Water is pulled upward through xylem by **cohesion-tension** — the hydrogen bonds between water molecules form a continuous column from root to leaf
4. Root water potential drops, drawing water from the soil

The numbers are staggering:
- A mature sal tree has ~200,000 leaves
- Each leaf has ~100,000 stomata per cm^2
- Total stomatal area: ~20 m^2 (for a tree with 100 m^2 of leaf area)
- Water must be lifted 25-35 meters against gravity — requiring tensions of -2 to -3 MPa

The **Penman-Monteith equation** models transpiration: ET = (Delta * Rn + rho * cp * VPD / ra) / (Delta + gamma * (1 + rs/ra)), where Rn is net radiation, VPD is vapor pressure deficit, rs is stomatal resistance, and ra is aerodynamic resistance.`,
      analogy: 'A transpiring tree is like a skyscraper with millions of tiny exhaust fans (stomata) on every floor. Each fan pulls air through, and as it does, it draws water up from the basement (roots) through pipes (xylem). The building does not have a pump — the fans at the top create enough suction to pull water up 30 stories by tension alone.',
      storyConnection: 'The villagers noticed that the air around the sal forest was always cooler and more humid than the fields beyond. The forest was not just sitting in the water cycle — it was actively pumping water from the ground into the atmosphere, creating its own microclimate.',
      checkQuestion: 'If a sal forest transpires 3 mm/day over a 100 km^2 area, how much water is that in liters? How does this compare to a medium-sized river?',
      checkAnswer: '3 mm/day * 100 km^2 = 3e-3 m * 1e8 m^2 = 300,000 m^3 = 300 million liters per day. A medium river like the Manas might flow at ~100 m^3/s = 8.64 million m^3/day. So the forest transpires about 3.5% of the river\'s flow — significant! This "invisible river" of water vapor directly feeds regional rainfall.',
      codeIntro: 'Model transpiration, the water column tension, and the forest\'s contribution to regional rainfall.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tree parameters
tree_height = 30  # meters
leaf_area = 150   # m^2 total leaf area
stomatal_density = 1e8  # stomata per m^2 (lower surface)
stomatal_aperture = 10e-6  # meters (when open)

# Environmental parameters
g = 9.81
rho_water = 998  # kg/m^3
rho_air = 1.225
cp = 1005  # specific heat of air (J/kg/K)

# Daily weather cycle (typical monsoon day)
hours = np.linspace(0, 24, 200)
# Temperature
temp = 25 + 8 * np.sin(np.pi * (hours - 6) / 12)
temp = np.where((hours < 6) | (hours > 18), 22 + 3 * np.sin(np.pi * hours / 24), temp)
# Relative humidity
rh = 0.85 - 0.25 * np.sin(np.pi * (hours - 6) / 12)
rh = np.where((hours < 6) | (hours > 18), 0.9, rh)
# Solar radiation (W/m^2)
solar = np.maximum(0, 800 * np.sin(np.pi * (hours - 6) / 12))
solar = np.where((hours < 6) | (hours > 18), 0, solar)

# Stomatal conductance: opens with light, closes at night, reduces under drought
def stomatal_conductance(solar_rad, vpd, soil_moisture_frac):
    """Stomatal conductance (mol/m^2/s)."""
    # Light response
    g_light = 0.4 * solar_rad / (solar_rad + 200)
    # VPD response (closes when air is very dry)
    g_vpd = np.where(vpd > 3.0, 0.1, 1.0 - 0.2 * vpd)
    # Soil moisture response
    g_soil = np.clip(soil_moisture_frac / 0.3, 0, 1)
    return 0.3 * g_light * g_vpd * g_soil  # mol/m^2/s

# Vapor pressure deficit
def calc_vpd(temp_c, rh_frac):
    """Vapor pressure deficit in kPa."""
    es = 0.6108 * np.exp(17.27 * temp_c / (temp_c + 237.3))
    return es * (1 - rh_frac)

vpd = calc_vpd(temp, rh)
gs = stomatal_conductance(solar, vpd, 0.6)

# Transpiration rate (simplified Penman-Monteith)
# E = gs * VPD / P (approximately)
P_atm = 101.3  # kPa
transpiration_rate = gs * vpd / P_atm * 18 * 3600  # g H2O/m^2/hour (rough)
transpiration_rate = np.maximum(transpiration_rate, 0)

# Total tree transpiration
tree_transpiration = transpiration_rate * leaf_area / 1000  # liters/hour
daily_total = np.trapz(tree_transpiration, hours)  # liters

# Water column tension
def xylem_tension(height, transpiration_rate_avg):
    """Water potential in xylem at given height (MPa)."""
    # Gravity component
    gravity = -rho_water * g * height / 1e6  # MPa
    # Friction component (increases with flow rate)
    friction = -0.02 * height * transpiration_rate_avg  # simplified
    # Soil water potential
    soil_psi = -0.5  # MPa
    return soil_psi + gravity + friction

heights = np.linspace(0, tree_height, 100)
avg_transp = np.mean(transpiration_rate[solar > 0]) if np.any(solar > 0) else 1
tensions = [xylem_tension(h, avg_transp) for h in heights]

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Daily weather
ax = axes[0, 0]
ax.plot(hours, temp, color='#ef4444', linewidth=2, label='Temperature (°C)')
ax.plot(hours, rh * 100, color='#3b82f6', linewidth=2, label='RH (%)')
ax2 = ax.twinx()
ax2.plot(hours, solar, color='#f59e0b', linewidth=2, linestyle='--', label='Solar (W/m²)')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Temp / RH', color='white')
ax2.set_ylabel('Solar radiation', color='#f59e0b')
ax.set_title('Daily Weather Cycle', color='white', fontsize=11)
ax.legend(fontsize=7, loc='upper left', facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 2: Stomatal conductance and VPD
ax = axes[0, 1]
ax.plot(hours, gs, color='#22c55e', linewidth=2, label='Stomatal conductance')
ax2 = ax.twinx()
ax2.plot(hours, vpd, color='#ef4444', linewidth=2, linestyle='--', label='VPD (kPa)')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Conductance (mol/m²/s)', color='#22c55e')
ax2.set_ylabel('VPD (kPa)', color='#ef4444')
ax.set_title('Stomatal Response', color='white', fontsize=11)
ax.legend(fontsize=8, loc='upper left', facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Transpiration rate
ax = axes[0, 2]
ax.fill_between(hours, tree_transpiration, color='#3b82f6', alpha=0.4)
ax.plot(hours, tree_transpiration, color='#3b82f6', linewidth=2)
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Transpiration (L/hour)', color='white')
ax.set_title(f'Tree Transpiration (total: {daily_total:.0f} L/day)', color='white', fontsize=11)

# Plot 4: Xylem tension profile
ax = axes[1, 0]
ax.plot(tensions, heights, color='#a855f7', linewidth=2)
ax.fill_betweenx(heights, tensions, 0, alpha=0.15, color='#a855f7')
ax.axvline(-3.0, color='#ef4444', linestyle='--', label='Cavitation threshold')
ax.set_xlabel('Water potential (MPa)', color='white')
ax.set_ylabel('Height in tree (m)', color='white')
ax.set_title('Xylem Water Tension', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Forest-scale water recycling
ax = axes[1, 1]
forest_area = 100  # km^2
trees_per_ha = 200
total_trees = trees_per_ha * forest_area * 100  # hectares
forest_daily_liters = total_trees * daily_total
forest_daily_mm = forest_daily_liters / (forest_area * 1e6) * 1  # mm

# Water cycle budget
components = ['Rainfall\\n(monsoon)', 'Transpiration', 'Evaporation\\n(soil)', 'Runoff', 'Groundwater\\nrecharge']
fluxes = [8, forest_daily_mm, 1.5, 3, 1.5]  # mm/day during monsoon
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#6b7280']
bars = ax.bar(components, fluxes, color=colors, edgecolor='none', width=0.6)
for bar, f in zip(bars, fluxes):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
            f'{f:.1f}', ha='center', color='white', fontsize=9)
ax.set_ylabel('Water flux (mm/day)', color='white')
ax.set_title('Forest Water Budget (monsoon)', color='white', fontsize=11)

# Plot 6: Transpiration vs drought
ax = axes[1, 2]
soil_moisture_levels = np.linspace(0.05, 1.0, 50)
daily_transpiration_by_moisture = []
for sm in soil_moisture_levels:
    gs_sm = stomatal_conductance(500, 1.5, sm)  # midday conditions
    et = gs_sm * 1.5 / P_atm * 18 * 3600 * leaf_area / 1000 * 8  # rough daily total
    daily_transpiration_by_moisture.append(et)
ax.plot(soil_moisture_levels * 100, daily_transpiration_by_moisture, color='#3b82f6', linewidth=2)
ax.set_xlabel('Soil moisture (%)', color='white')
ax.set_ylabel('Daily transpiration (L)', color='white')
ax.set_title('Transpiration vs Soil Moisture', color='white', fontsize=11)
ax.axvline(30, color='#ef4444', linestyle='--', label='Wilting threshold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"Sal Tree Water Budget:")
print(f"  Daily transpiration: {daily_total:.0f} liters per tree")
print(f"  Forest ({forest_area} km²): {forest_daily_liters/1e6:.0f} million liters/day")
print(f"  That is {forest_daily_mm:.1f} mm/day returned to the atmosphere")
print(f"  Trees are not passive — they actively drive the water cycle.")`,
      challenge: 'Model deforestation: remove 50% of the trees and calculate the reduction in regional transpiration. If transpiration contributes 30% of local rainfall, how much does rainfall decrease? This cascading effect explains why deforestation causes drought.',
      successHint: 'Trees are the largest pumps on Earth. A single sal tree moves more water than most mechanical pumps. Understanding this connection between forests and rainfall is one of the most important insights in climate science.',
    },
    {
      title: 'Wood anatomy — xylem, phloem, and cambium under the microscope',
      concept: `Cut a sal tree trunk and you see rings — each one a year of growth. But what creates those rings, and what do the tissues do?

**Wood anatomy** from outside to inside:
1. **Bark** (outer bark): dead protective tissue, waterproof and fire-resistant
2. **Phloem** (inner bark): living tissue that transports sugars DOWNWARD from leaves to roots
3. **Cambium**: a single-cell-thick ring of stem cells — the growth engine. It divides outward to make phloem and inward to make xylem
4. **Sapwood** (young xylem): living xylem that actively conducts water upward
5. **Heartwood** (old xylem): dead xylem packed with resins — structural support only

**Xylem** cells are the water pipes. In sal, they are predominantly **vessels** — large (up to 300 micrometers diameter) hollow tubes formed by cell death. Water flows through them at 1-10 m/hour. The flow rate follows the **Hagen-Poiseuille equation**: Q = (pi * r^4 * deltaP) / (8 * mu * L). This means doubling vessel diameter increases flow by 16x (r^4 dependence!).

**Phloem** cells (sieve tubes) transport sugars. Unlike xylem, phloem flow is bidirectional and pressurized (by osmosis). The Munch flow hypothesis: sugars are loaded into phloem at the leaves (source), raising osmotic pressure, drawing in water, and pushing sugar-rich sap toward roots and fruits (sinks).

**Tree rings** form because spring growth (earlywood) produces large, thin-walled xylem cells (high water capacity), while summer/autumn growth (latewood) produces small, thick-walled cells (high strength). The transition is visible as a ring boundary.`,
      analogy: 'A tree trunk is like a building\'s infrastructure. The xylem is the water supply system (wider pipes = more flow). The phloem is the postal system (delivers sugar packages up and down). The cambium is the construction crew (continuously adding new floors). Heartwood is retired infrastructure — no longer functional but still holding the building up.',
      storyConnection: 'When the villager cut into the sal tree to count its rings, each ring told a story — thin rings from drought years, wide rings from good monsoons, fire scars from the year lightning struck. The wood was a chronicle written in cells.',
      checkQuestion: 'A sal tree has xylem vessels 200 micrometers in diameter. A pine tree has tracheids only 30 micrometers in diameter. How much more water can a single sal vessel conduct compared to a single pine tracheid, assuming the same pressure gradient? (Hint: Hagen-Poiseuille, flow proportional to r^4)',
      checkAnswer: 'Flow ratio = (200/30)^4 = (6.67)^4 = 1975x. A single sal vessel conducts nearly 2000x more water than a single pine tracheid! This is why hardwoods (like sal) can support large crowns with high transpiration rates. But there is a trade-off: larger vessels are more vulnerable to cavitation (air bubbles that block flow).',
      codeIntro: 'Model xylem hydraulics, tree ring formation, and the trade-off between conductivity and safety.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hagen-Poiseuille flow
def hp_flow(radius_m, pressure_drop_Pa, length_m, viscosity=1e-3):
    """Volume flow rate through a cylindrical vessel (m^3/s)."""
    return np.pi * radius_m**4 * pressure_drop_Pa / (8 * viscosity * length_m)

# Vessel parameters
radii = np.linspace(5e-6, 200e-6, 200)  # 5-200 micrometers
dP = 1e6  # 1 MPa pressure drop (typical for 30m tree)
L = 30    # 30m vessel length

flow_rates = hp_flow(radii, dP, L)
flow_rates_per_hour = flow_rates * 3600 * 1e6  # microliters per hour

# Different species
species = [
    ('Sal (Shorea)', 150e-6, '#22c55e'),      # large vessels
    ('Oak', 120e-6, '#3b82f6'),                 # medium vessels
    ('Maple', 60e-6, '#f59e0b'),               # small vessels
    ('Pine (tracheids)', 20e-6, '#ef4444'),    # tiny tracheids
]

# Tree ring model
def generate_tree_rings(n_years, good_years_frac=0.6):
    """Generate radial growth pattern (ring widths)."""
    np.random.seed(42)
    rings = []
    for yr in range(n_years):
        # Base growth + random weather variation
        is_good = np.random.random() < good_years_frac
        base_width = 3.0 if is_good else 1.0  # mm
        width = base_width + np.random.randn() * 0.5
        rings.append(max(0.3, width))
    return np.array(rings)

# Cavitation vulnerability
def cavitation_probability(vessel_radius_m, water_potential_MPa):
    """Probability of cavitation (air embolism) in a vessel."""
    # Larger vessels cavitate at less negative water potentials
    P50 = -2.0 + 15e6 * vessel_radius_m  # MPa where 50% vessels cavitate
    # Sigmoid vulnerability curve
    slope = 2.0
    return 1 / (1 + np.exp(slope * (water_potential_MPa - P50)))

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Hagen-Poiseuille flow vs vessel diameter
ax = axes[0, 0]
ax.semilogy(radii * 1e6, flow_rates_per_hour, color='#3b82f6', linewidth=2)
for name, r, color in species:
    flow = hp_flow(r, dP, L) * 3600 * 1e6
    ax.plot(r * 1e6, flow, 'o', color=color, markersize=10, zorder=5)
    ax.annotate(name, (r * 1e6, flow), textcoords='offset points', xytext=(5, 5),
                color=color, fontsize=8)
ax.set_xlabel('Vessel diameter (μm)', color='white')
ax.set_ylabel('Flow rate (μL/hour)', color='white')
ax.set_title('Hagen-Poiseuille: Flow vs Diameter (r⁴!)', color='white', fontsize=10)

# Plot 2: Conductivity-safety trade-off
ax = axes[0, 1]
water_potentials = np.linspace(-5, 0, 100)
for name, r, color in species:
    cav_prob = [cavitation_probability(r, wp) for wp in water_potentials]
    ax.plot(water_potentials, cav_prob, color=color, linewidth=2, label=name)
ax.set_xlabel('Water potential (MPa)', color='white')
ax.set_ylabel('Fraction cavitated', color='white')
ax.set_title('Cavitation Vulnerability Curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Tree ring visualization
ax = axes[0, 2]
rings = generate_tree_rings(40)
cumulative = np.cumsum(rings)
max_radius = cumulative[-1]

# Draw concentric circles
for i in range(len(rings)):
    r = cumulative[i]
    color_val = 0.3 + 0.4 * (rings[i] / max(rings))
    circle = plt.Circle((0, 0), r, fill=False, color=(0.4, color_val, 0.2), linewidth=0.8)
    ax.add_patch(circle)
    if i % 5 == 0:
        ax.annotate(f'{i}', (r * 0.7, r * 0.7), color='white', fontsize=6)

# Mark cambium
ax.add_patch(plt.Circle((0, 0), max_radius, fill=False, color='#22c55e', linewidth=2, linestyle='--'))
ax.text(max_radius * 0.5, -max_radius * 0.9, 'Cambium →', color='#22c55e', fontsize=8)

ax.set_xlim(-max_radius * 1.2, max_radius * 1.2)
ax.set_ylim(-max_radius * 1.2, max_radius * 1.2)
ax.set_aspect('equal')
ax.set_title(f'Cross Section: {len(rings)} Annual Rings', color='white', fontsize=11)

# Plot 4: Ring width chronology
ax = axes[1, 0]
years = np.arange(len(rings))
ax.bar(years, rings, color=np.where(rings > 2, '#22c55e', '#ef4444'), edgecolor='none', width=0.8)
ax.axhline(np.mean(rings), color='#f59e0b', linestyle='--', label=f'Mean: {np.mean(rings):.1f} mm')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Ring width (mm)', color='white')
ax.set_title('Dendrochronology', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Wood anatomy cross-section diagram
ax = axes[1, 1]
# Radial strip showing tissue layers
tissues = [
    ('Outer bark', 5, '#6b4c3b'),
    ('Inner bark\\n(phloem)', 3, '#8b6c5c'),
    ('Cambium', 0.5, '#22c55e'),
    ('Sapwood\\n(active xylem)', 15, '#c4a882'),
    ('Heartwood\\n(dead xylem)', 25, '#8b7355'),
    ('Pith', 2, '#ddd'),
]
left = 0
for name, width, color in tissues:
    ax.barh(0, width, left=left, height=3, color=color, edgecolor='white', linewidth=0.5)
    ax.text(left + width/2, 0, name, ha='center', va='center', color='white', fontsize=7,
            fontweight='bold')
    left += width
ax.set_xlim(0, left)
ax.set_ylim(-2, 2)
ax.set_xlabel('Distance from bark (mm)', color='white')
ax.set_title('Wood Tissue Layers (radial section)', color='white', fontsize=11)
ax.set_yticks([])

# Plot 6: Earlywood vs latewood comparison
ax = axes[1, 2]
cell_types = ['Earlywood\\nvessel', 'Latewood\\nvessel', 'Earlywood\\nfiber', 'Latewood\\nfiber']
diameters = [200, 80, 30, 15]  # micrometers
wall_thickness = [3, 8, 4, 10]  # micrometers
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

x_pos = np.arange(len(cell_types))
width = 0.35
ax.bar(x_pos - width/2, diameters, width, color=[c for c in colors], label='Diameter (μm)')
ax2 = ax.twinx()
ax2.bar(x_pos + width/2, wall_thickness, width, color=[c for c in colors], alpha=0.5, label='Wall thickness (μm)')
ax.set_xticks(x_pos)
ax.set_xticklabels(cell_types, color='white', fontsize=8)
ax.set_ylabel('Cell diameter (μm)', color='white')
ax2.set_ylabel('Wall thickness (μm)', color='white')
ax.set_title('Earlywood vs Latewood Cells', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Wood Anatomy Summary:")
print(f"  Sal vessel diameter: ~150 μm (among the largest in tropical hardwoods)")
print(f"  Flow rate per vessel: {hp_flow(150e-6, dP, L)*3600*1e6:.1f} μL/hour")
print(f"  Pine tracheid flow:   {hp_flow(20e-6, dP, L)*3600*1e6:.3f} μL/hour")
print(f"  Sal conducts {hp_flow(150e-6, dP, L)/hp_flow(20e-6, dP, L):.0f}x more per conduit")
print(f"  Trade-off: sal's large vessels are more vulnerable to drought cavitation")`,
      challenge: 'Model a drought event: water potential drops to -3 MPa. Calculate the percentage of vessels cavitated for each species. Then model recovery — how many new vessels must the cambium produce to restore full conductivity?',
      successHint: 'Wood anatomy is living engineering — xylem vessels are optimized pipes, cambium is a 3D printer of new cells, and the heartwood-sapwood transition is planned obsolescence. Every ring records the tree\'s response to its environment.',
    },
    {
      title: 'Timber economics & sustainable forestry — when ecology meets economics',
      concept: `Sal is one of India's most valuable timber species. Its wood is hard, durable, and termite-resistant — ideal for construction, railway sleepers, and furniture. But the economics of sal forests create a tension between short-term profit and long-term sustainability.

**Rotation age** is the key economic concept: the age at which harvesting a tree maximizes profit per year. For sal, this is typically 80-120 years, but economic pressure pushes toward shorter rotations (40-60 years) that harvest smaller, less valuable trees.

The **Faustmann formula** calculates the optimal rotation: maximize (Revenue - Cost) / (1 + r)^T, summed over infinite rotations, where r is the discount rate and T is the rotation age. Higher discount rates favor shorter rotations (take the money now).

Sustainable forestry principles:
- **Sustained yield**: harvest volume <= growth volume (never deplete the stock)
- **Selection harvesting**: remove individual trees, not clear-cut (preserves forest structure)
- **Natural regeneration**: sal regenerates well from coppice (stump sprouts) and seeds
- **Non-timber forest products (NTFPs)**: sal leaves, resin, and seeds generate income without felling — often more valuable than timber over the long term

The tragedy: India has lost ~40% of its sal forests since 1950. Short-rotation timber extraction, conversion to agriculture, and urbanization are the main drivers.`,
      analogy: 'Sustainable forestry is like managing a savings account. The forest is your principal (capital). Growth is interest. If you withdraw (harvest) only the interest, the principal stays intact and keeps generating returns forever. If you withdraw more than the interest, you erode the principal, and eventually the account is empty.',
      storyConnection: 'The sal tree in our story was ancient — 200 years old, its trunk too large for one person to wrap their arms around. The villagers protected it not from sentiment but from wisdom: they knew that the old tree produced more sal leaf plates, seeds, and resin each year than any young replacement. The tree was more valuable alive than dead.',
      checkQuestion: 'A sal tree at age 40 has 2 cubic meters of timber worth 50,000 INR. At age 80, it has 6 cubic meters worth 180,000 INR. If the discount rate is 5% per year, which is more profitable to harvest?',
      checkAnswer: 'Present value at age 40: 50,000 INR (harvested now). Present value of waiting to age 80: 180,000 / (1.05)^40 = 180,000 / 7.04 = 25,568 INR (discounted back to today). At 5% discount rate, harvesting NOW is more profitable! This is the fundamental problem: high discount rates incentivize premature harvest. Sustainable forestry requires either low discount rates (patient investors) or valuing non-timber services.',
      codeIntro: 'Model forest growth, optimal rotation age, and the economics of sustainable vs extractive forestry.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sal tree growth model
def tree_volume(age):
    """Volume of a sal tree (m^3) as a function of age."""
    # Logistic growth: slow start, fast middle, plateaus
    max_vol = 8.0  # m^3 for a mature sal
    k = 0.05       # growth rate
    t0 = 60        # inflection point (fastest growth)
    return max_vol / (1 + np.exp(-k * (age - t0)))

def timber_value(volume, age):
    """Value of timber (INR/m^3) — increases with size."""
    # Larger, older timber commands premium prices
    base_price = 15000  # INR/m^3
    size_premium = 1 + 0.5 * np.clip((volume - 2) / 4, 0, 1)
    return volume * base_price * size_premium

ages = np.arange(1, 201)
volumes = np.array([tree_volume(a) for a in ages])
values = np.array([timber_value(tree_volume(a), a) for a in ages])

# NTFP (non-timber forest product) value
def ntfp_annual_value(age, volume):
    """Annual value from leaves, resin, seeds (INR)."""
    # Increases with canopy size
    leaf_income = 200 * np.clip(volume / 3, 0, 1)  # leaf plates
    resin_income = 300 * np.clip((age - 30) / 50, 0, 1)  # resin tapping
    seed_income = 150 * np.clip((age - 20) / 40, 0, 1)  # seeds
    return leaf_income + resin_income + seed_income

ntfp_cumulative = np.cumsum([ntfp_annual_value(a, tree_volume(a)) for a in ages])

# Faustmann formula: optimal rotation age
def faustmann_npv(rotation_age, discount_rate=0.05, n_rotations=5):
    """Net present value of timber harvesting over multiple rotations."""
    vol = tree_volume(rotation_age)
    revenue = timber_value(vol, rotation_age)
    planting_cost = 2000  # INR

    npv = 0
    for i in range(n_rotations):
        year = (i + 1) * rotation_age
        discount = (1 + discount_rate) ** year
        npv += (revenue - planting_cost) / discount
    return npv

discount_rates = [0.02, 0.05, 0.08, 0.12]
rotation_ages = np.arange(20, 161)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Tree growth curve
ax = axes[0, 0]
ax.plot(ages, volumes, color='#22c55e', linewidth=2, label='Volume')
ax.plot(ages, np.gradient(volumes), color='#3b82f6', linewidth=2, linestyle='--', label='Growth rate')
ax.axvline(60, color='gray', linestyle=':', alpha=0.5, label='Max growth rate')
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Volume (m³) / Growth rate', color='white')
ax.set_title('Sal Tree Growth', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Timber value vs age
ax = axes[0, 1]
ax.plot(ages, values / 1000, color='#f59e0b', linewidth=2, label='Timber value')
ax.plot(ages, ntfp_cumulative / 1000, color='#22c55e', linewidth=2, linestyle='--', label='Cumulative NTFP')
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Value (thousand INR)', color='white')
ax.set_title('Timber vs NTFP Value', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Faustmann NPV for different discount rates
ax = axes[0, 2]
for dr, color in zip(discount_rates, ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']):
    npvs = [faustmann_npv(a, dr) for a in rotation_ages]
    best_age = rotation_ages[np.argmax(npvs)]
    ax.plot(rotation_ages, npvs, color=color, linewidth=2,
            label=f'r={dr:.0%} (opt={best_age}yr)')
ax.set_xlabel('Rotation age (years)', color='white')
ax.set_ylabel('NPV (INR)', color='white')
ax.set_title('Faustmann Rotation Analysis', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Sustainable yield simulation
ax = axes[1, 0]
years_sim = 200
# Forest of 1000 trees with age distribution
n_trees = 1000
forest_ages = np.random.randint(1, 120, n_trees)

sustainable_harvest = []
extractive_harvest = []
sus_standing_vol = []
ext_standing_vol = []

forest_sus = forest_ages.copy()
forest_ext = forest_ages.copy()

for yr in range(years_sim):
    # All trees age
    forest_sus += 1
    forest_ext += 1
    # New seedlings replace harvested
    forest_sus = np.append(forest_sus, np.ones(max(0, n_trees - len(forest_sus)), dtype=int))
    forest_ext = np.append(forest_ext, np.ones(max(0, n_trees - len(forest_ext)), dtype=int))

    # Sustainable: harvest only trees > 100 years, max 2% per year
    old_mask = forest_sus >= 100
    n_harvest = min(int(0.02 * len(forest_sus)), np.sum(old_mask))
    if n_harvest > 0:
        old_indices = np.where(old_mask)[0][:n_harvest]
        harvest_vol = sum(tree_volume(forest_sus[i]) for i in old_indices)
        sustainable_harvest.append(harvest_vol)
        forest_sus = np.delete(forest_sus, old_indices)
    else:
        sustainable_harvest.append(0)

    # Extractive: harvest any tree > 40 years, 5% per year
    mature_mask = forest_ext >= 40
    n_harvest = min(int(0.05 * len(forest_ext)), np.sum(mature_mask))
    if n_harvest > 0:
        mature_indices = np.where(mature_mask)[0][:n_harvest]
        harvest_vol = sum(tree_volume(forest_ext[i]) for i in mature_indices)
        extractive_harvest.append(harvest_vol)
        forest_ext = np.delete(forest_ext, mature_indices)
    else:
        extractive_harvest.append(0)

    sus_standing_vol.append(sum(tree_volume(a) for a in forest_sus))
    ext_standing_vol.append(sum(tree_volume(a) for a in forest_ext))

ax.plot(range(years_sim), np.cumsum(sustainable_harvest), color='#22c55e', linewidth=2,
        label='Sustainable (cumulative)')
ax.plot(range(years_sim), np.cumsum(extractive_harvest), color='#ef4444', linewidth=2,
        label='Extractive (cumulative)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Cumulative harvest (m³)', color='white')
ax.set_title('Harvest Over 200 Years', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Standing volume over time
ax = axes[1, 1]
ax.plot(range(years_sim), sus_standing_vol, color='#22c55e', linewidth=2, label='Sustainable')
ax.plot(range(years_sim), ext_standing_vol, color='#ef4444', linewidth=2, label='Extractive')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Standing volume (m³)', color='white')
ax.set_title('Forest Stock Over Time', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = f"""Timber Economics Summary
============================

Faustmann optimal rotation ages:
  2% discount rate: ~120 years
  5% discount rate: ~80 years
  12% discount rate: ~40 years

Higher discount rates → shorter rotations
→ smaller trees → less valuable timber
→ forest degradation

NTFP alternative:
  A 100-year sal tree earns ~{ntfp_annual_value(100, tree_volume(100)):.0f} INR/yr
  from leaves, resin, and seeds
  Over 50 years: {sum(ntfp_annual_value(a, tree_volume(a)) for a in range(50,100)):.0f} INR
  vs timber value: {timber_value(tree_volume(100), 100):.0f} INR

For patient owners, keeping the tree
alive earns more than cutting it down."""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Key insight: Discount rates drive deforestation.")
print("When money tomorrow is worth much less than money today,")
print("cutting trees now always beats waiting for them to grow.")
print("Sustainable forestry requires valuing the future — exactly what")
print("traditional communities did by protecting old-growth sal trees.")`,
      challenge: 'Add a carbon credit revenue stream: each tree earns INR 500 per ton of CO2 stored per year. Recalculate the Faustmann NPV including carbon credits. At what carbon price does it become more profitable to keep trees standing than to harvest them?',
      successHint: 'Timber economics reveals a fundamental tension between individual profit and collective good. The discount rate is where ecology meets economics — and understanding it is essential for anyone working on forest conservation.',
    },
    {
      title: 'Forest carbon accounting — trees as climate warriors',
      concept: `Forests are the largest terrestrial carbon sink, absorbing about 2.6 billion tons of CO2 per year — roughly 30% of human emissions. Carbon accounting measures exactly how much carbon a forest stores and how fast it accumulates.

Carbon stocks in a sal forest:
- **Aboveground biomass**: trunk, branches, leaves — about 150-250 tC/ha for mature sal
- **Belowground biomass**: roots — typically 20-30% of aboveground
- **Soil organic carbon**: decomposed organic matter — often MORE than the trees themselves (100-200 tC/ha)
- **Dead wood**: fallen trunks, branches — 10-30 tC/ha
- **Litter**: leaf litter, fallen seeds — 5-10 tC/ha

Total carbon stock: 300-500 tC/ha for a mature sal forest.

**Carbon sequestration rate** (annual addition): a growing sal forest adds 5-10 tC/ha/year. An old-growth forest is near equilibrium (growth ≈ decomposition), so net sequestration slows.

The **allometric equation** relates measurable tree dimensions to biomass: Biomass (kg) = a * DBH^b * Height^c, where DBH is diameter at breast height. For sal: Biomass ≈ 0.5 * exp(-1.499 + 2.148 * ln(DBH) + 0.207 * ln(H) - 0.0281 * (ln(DBH))^2). These equations are derived from destructive sampling of felled trees — a necessary sacrifice for non-destructive estimation of millions of standing trees.`,
      analogy: 'Forest carbon accounting is like doing inventory in a warehouse. The standing trees are your stock on shelves. New growth is incoming shipments. Decomposition is outgoing shipments. The net change tells you whether your warehouse is filling up (carbon sink) or emptying out (carbon source). Deforestation is like a fire that destroys the warehouse and releases all stock at once.',
      storyConnection: 'The sal tree in our story was not just a tree — it was a carbon vault. In its 200-year life, it had pulled roughly 5 tons of CO2 from the atmosphere and locked it into wood. The entire sal forest around the village stored more carbon than the village would produce in a thousand years. Cutting the forest was not just losing trees — it was releasing a century of stored carbon.',
      checkQuestion: 'A sal forest stores 300 tC/ha. Converting it to farmland releases all aboveground carbon and 50% of soil carbon. If the forest is 10,000 ha, how much CO2 is released? (Remember: 1 ton C = 3.67 tons CO2)',
      checkAnswer: 'Aboveground + belowground: ~200 tC/ha. Soil loss: 50% of 100 = 50 tC/ha. Total: 250 tC/ha * 10,000 ha = 2,500,000 tC = 2.5 million tons of carbon = 9.2 million tons of CO2. That equals the annual emissions of a city of ~1 million people. This is why avoiding deforestation is one of the most cost-effective climate interventions.',
      codeIntro: 'Build a forest carbon accounting model from tree-level allometry to landscape-scale stocks and fluxes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Allometric equations for sal (Shorea robusta)
def tree_biomass_kg(dbh_cm, height_m):
    """Aboveground biomass using tropical hardwood allometry."""
    # Chave et al. (2014) pantropical model, simplified
    wood_density = 0.72  # g/cm^3 for sal
    return 0.0673 * (wood_density * dbh_cm**2 * height_m)**0.976

def dbh_from_age(age):
    """DBH (cm) as function of age for sal."""
    return 80 * (1 - np.exp(-0.025 * age))

def height_from_dbh(dbh):
    """Height (m) from DBH using allometric relationship."""
    return 40 * (1 - np.exp(-0.04 * dbh))

# Generate a sal forest
n_trees_per_ha = 250
n_hectares = 100  # 1 km^2

# Age distribution — mix of young and old
tree_ages = np.concatenate([
    np.random.exponential(30, int(n_trees_per_ha * 0.5)),  # many young
    np.random.normal(80, 20, int(n_trees_per_ha * 0.3)),   # some mature
    np.random.normal(150, 30, int(n_trees_per_ha * 0.2)),  # few old-growth
])
tree_ages = np.clip(tree_ages, 1, 300).astype(int)

dbhs = np.array([dbh_from_age(a) for a in tree_ages])
heights = np.array([height_from_dbh(d) for d in dbhs])
biomasses = np.array([tree_biomass_kg(d, h) for d, h in zip(dbhs, heights)])

# Carbon is ~50% of biomass
tree_carbon_kg = biomasses * 0.5

# Carbon pools (per hectare)
agb_per_ha = np.sum(tree_carbon_kg) / 1000  # tonnes C per ha
bgb_per_ha = agb_per_ha * 0.25  # belowground (roots)
soil_c_per_ha = 120  # tonnes C/ha (soil organic carbon)
deadwood_per_ha = agb_per_ha * 0.1
litter_per_ha = 5  # tonnes C/ha
total_per_ha = agb_per_ha + bgb_per_ha + soil_c_per_ha + deadwood_per_ha + litter_per_ha

# Annual carbon flux model
def annual_sequestration(age_distribution, growth_years=1):
    """Net annual carbon sequestration for a forest stand."""
    new_ages = age_distribution + growth_years
    old_biomass = sum(tree_biomass_kg(dbh_from_age(a), height_from_dbh(dbh_from_age(a))) for a in age_distribution)
    new_biomass = sum(tree_biomass_kg(dbh_from_age(a), height_from_dbh(dbh_from_age(a))) for a in new_ages)
    return (new_biomass - old_biomass) * 0.5 / 1000  # tonnes C

annual_seq = annual_sequestration(tree_ages)

# Project forward 100 years
years_forward = 100
cumulative_seq = []
annual_seq_history = []
total_stock = [total_per_ha]

current_ages = tree_ages.copy()
for yr in range(years_forward):
    seq = annual_sequestration(current_ages)
    annual_seq_history.append(seq)
    cumulative_seq.append(sum(annual_seq_history))
    current_ages = current_ages + 1
    # Some trees die, new ones sprout
    mortality = np.random.random(len(current_ages)) < 0.01
    current_ages[mortality] = 1
    total_stock.append(total_per_ha + cumulative_seq[-1])

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Tree size distribution
ax = axes[0, 0]
ax.hist(dbhs, bins=30, color='#22c55e', edgecolor='none', alpha=0.7)
ax.set_xlabel('DBH (cm)', color='white')
ax.set_ylabel('Number of trees', color='white')
ax.set_title('DBH Distribution (1 ha)', color='white', fontsize=11)

# Plot 2: Allometric relationships
ax = axes[0, 1]
ages_plot = np.arange(1, 250)
dbhs_plot = [dbh_from_age(a) for a in ages_plot]
biomass_plot = [tree_biomass_kg(dbh_from_age(a), height_from_dbh(dbh_from_age(a))) for a in ages_plot]
ax.plot(ages_plot, np.array(biomass_plot) * 0.5 / 1000, color='#22c55e', linewidth=2)
ax.set_xlabel('Tree age (years)', color='white')
ax.set_ylabel('Carbon per tree (tonnes C)', color='white')
ax.set_title('Carbon Accumulation per Tree', color='white', fontsize=11)

# Plot 3: Carbon pools (pie chart style)
ax = axes[0, 2]
pools = ['Aboveground\\nbiomass', 'Belowground\\n(roots)', 'Soil organic\\ncarbon', 'Dead wood', 'Litter']
pool_values = [agb_per_ha, bgb_per_ha, soil_c_per_ha, deadwood_per_ha, litter_per_ha]
colors = ['#22c55e', '#8b6c5c', '#6b4c3b', '#a855f7', '#f59e0b']
bars = ax.bar(pools, pool_values, color=colors, edgecolor='none', width=0.6)
for bar, val in zip(bars, pool_values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
            f'{val:.0f} tC', ha='center', color='white', fontsize=9)
ax.set_ylabel('Carbon stock (tC/ha)', color='white')
ax.set_title(f'Carbon Pools (total: {total_per_ha:.0f} tC/ha)', color='white', fontsize=11)
ax.tick_params(axis='x', labelsize=7)

# Plot 4: Annual sequestration over time
ax = axes[1, 0]
ax.plot(range(years_forward), annual_seq_history, color='#22c55e', linewidth=2)
ax.axhline(0, color='gray', linestyle=':', linewidth=0.5)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Net sequestration (tC/ha/yr)', color='white')
ax.set_title('Annual Carbon Sequestration', color='white', fontsize=11)

# Plot 5: Cumulative stock
ax = axes[1, 1]
ax.plot(range(years_forward + 1), total_stock, color='#3b82f6', linewidth=2, label='Growing forest')
# Deforestation scenario: release at year 50
deforested_stock = total_stock[:50] + [total_stock[50] * 0.3] * (years_forward - 49)
ax.plot(range(years_forward + 1), deforested_stock[:years_forward + 1],
        color='#ef4444', linewidth=2, linestyle='--', label='Deforested at year 50')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total carbon stock (tC/ha)', color='white')
ax.set_title('Carbon Stock Trajectory', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Landscape-scale numbers
ax = axes[1, 2]
ax.axis('off')
total_forest_c = total_per_ha * n_hectares
total_forest_co2 = total_forest_c * 3.67
annual_emissions_city = 8  # tCO2 per person per year
people_equivalent = total_forest_co2 / annual_emissions_city

text = f"""Forest Carbon Accounting
{n_hectares} hectares of sal forest
============================

STOCKS:
  Per hectare: {total_per_ha:.0f} tC ({total_per_ha * 3.67:.0f} tCO2eq)
  Total forest: {total_forest_c:,.0f} tC ({total_forest_co2:,.0f} tCO2eq)

ANNUAL FLUX:
  Sequestration: {annual_seq:.1f} tC/ha/yr
  Forest total:  {annual_seq * n_hectares:,.0f} tC/yr

EQUIVALENCE:
  Stores CO2 equal to annual emissions
  of {people_equivalent:,.0f} people

  Deforestation releases {total_per_ha * 0.7 * 3.67:.0f} tCO2/ha
  = {total_per_ha * 0.7 * 3.67 / 8:.0f} person-years of emissions"""

ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Forest carbon accounting complete.")
print(f"  This {n_hectares}-ha sal forest stores {total_forest_co2:,.0f} tonnes CO2.")
print(f"  Protecting forests is climate action. Planting new ones is too — but it")
print(f"  takes 50-100 years to rebuild what can be destroyed in a day.")`,
      challenge: 'Model a reforestation scenario: plant 100 ha of degraded land with sal seedlings. How many years until the new forest stores the same amount of carbon as the mature forest? Plot the growth trajectory. This reveals why avoided deforestation is more effective than reforestation in the short term.',
      successHint: 'Forest carbon accounting connects individual trees to global climate through a chain of allometric equations, growth models, and scaling. Every sal tree you see is actively pulling CO2 from the atmosphere and locking it into wood. Understanding this quantitatively is essential for climate policy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Forest Ecology & Carbon Science
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology & earth science fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for ecological and carbon modeling. Click to start.</p>
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
