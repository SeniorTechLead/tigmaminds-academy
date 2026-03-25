import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CloudRefusedLevel1() {
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
      title: 'Water cycle fundamentals',
      concept: `Water continuously moves between oceans, atmosphere, and land through the **water cycle**: evaporation (liquid to gas), condensation (gas to tiny droplets forming clouds), precipitation (rain/snow), and runoff (back to rivers and oceans).\n\nKey numbers:\n- Earth has 1.4 billion km3 of water\n- Only 2.5% is freshwater\n- Only 0.3% of freshwater is accessible surface water\n- The atmosphere holds about 12,900 km3 of water at any time\n- Average water molecule spends 9 days in the atmosphere before precipitating`,
      analogy: 'The water cycle is like a giant distillery. The ocean is the boiler (evaporation), the atmosphere is the condenser (clouds form), and rain is the distilled water dripping into collection vessels (rivers, lakes). The sun provides the energy to run this planetary-scale distillation.',
      storyConnection: 'The cloud in the story refuses to rain on the parched village. In meteorology, this happens when conditions for precipitation are not met: the cloud may have water droplets but they are too small to fall. Cloud seeding is humanity\'s attempt to convince reluctant clouds to release their water.',
      checkQuestion: 'If the atmosphere always contains 12,900 km3 of water, why do droughts happen?',
      checkAnswer: 'Because atmospheric water is not evenly distributed. It depends on wind patterns, temperature gradients, and geography. A drought occurs not because there is less water globally, but because atmospheric circulation patterns have shifted, directing moisture away from a region. The water is there, just not overhead.',
      codeIntro: 'Model the water cycle: evaporation, atmospheric transport, and precipitation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple water cycle box model
# Reservoirs: ocean, atmosphere, land
days = 365
dt = 1  # day

ocean = np.zeros(days); atmos = np.zeros(days); land = np.zeros(days)
ocean[0] = 1000; atmos[0] = 13; land[0] = 50

evap_rate = 0.003  # fraction of ocean per day
precip_rate = 0.08  # fraction of atmosphere per day
runoff_rate = 0.01  # fraction of land per day

precip_ocean_frac = 0.77  # 77% of precipitation falls on ocean
rain = np.zeros(days)

for t in range(1, days):
    evap = evap_rate * ocean[t-1]
    precip = precip_rate * atmos[t-1]
    runoff = runoff_rate * land[t-1]
    rain[t] = precip * (1 - precip_ocean_frac)
    
    ocean[t] = ocean[t-1] - evap + precip * precip_ocean_frac + runoff
    atmos[t] = atmos[t-1] + evap - precip
    land[t] = land[t-1] + rain[t] - runoff

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(atmos, color='#3b82f6', linewidth=2, label='Atmosphere')
ax1.plot(land, color='#22c55e', linewidth=2, label='Land water')
ax1.set_xlabel('Day', color='white')
ax1.set_ylabel('Water (relative units)', color='white')
ax1.set_title('Water Cycle Reservoirs Over 1 Year', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.plot(rain, color='#3b82f6', linewidth=1, alpha=0.7, label='Daily rainfall on land')
ax2.plot(np.convolve(rain, np.ones(30)/30, mode='same'), color='#f59e0b', linewidth=2, label='30-day average')
ax2.set_xlabel('Day', color='white')
ax2.set_ylabel('Rainfall', color='white')
ax2.set_title('Rainfall Pattern', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Annual evaporation: {evap_rate * ocean[0] * 365:.0f} units")
print(f"Annual precipitation: {precip_rate * atmos[0] * 365:.0f} units")
print(f"Average atmospheric residence time: {atmos.mean() / (precip_rate * atmos.mean()):.0f} days")`,
      challenge: 'Add seasonal variation: multiply evaporation rate by (1 + 0.3*sin(2*pi*t/365)) to simulate summer/winter. How does this change the rainfall pattern?',
      successHint: 'The water cycle is the engine of all weather and climate. Understanding it quantitatively is the foundation for understanding droughts, floods, and cloud seeding.',
    },    {
      title: 'Cloud formation and types',
      concept: `Clouds form when air rises, cools, and its water vapor condenses onto tiny particles called **condensation nuclei** (dust, salt, pollen). The temperature at which this happens is the **dew point**.\n\nCloud types by altitude:\n- **High (6-12 km)**: Cirrus (wispy ice crystals), cirrostratus, cirrocumulus\n- **Middle (2-6 km)**: Altostratus, altocumulus\n- **Low (0-2 km)**: Stratus (flat layers), stratocumulus, nimbostratus (rain)\n- **Vertical**: Cumulus (puffy), cumulonimbus (thunderstorms, up to 15 km)\n\nNot all clouds produce rain. Rain requires droplets to grow large enough to fall. A typical cloud droplet is 10 micrometers; a raindrop is 2,000 micrometers (200x larger). The droplet must grow by a factor of 200 before it can fall as rain.`,
      analogy: 'Cloud formation is like breathing on a cold window. Your warm, moist breath (rising air) hits the cold glass (upper atmosphere) and condenses into tiny droplets. The droplets are the cloud. If enough accumulate, they run down the glass (precipitation).',
      storyConnection: 'The stubborn cloud in the story is described as heavy and dark but refusing to release its water. This is a real phenomenon: a cloud can be saturated but lack the right conditions for droplets to coalesce into raindrops. The cloud needs a trigger to convert its tiny droplets into rain-sized drops.',
      checkQuestion: 'Why are some clouds white and others dark gray?',
      checkAnswer: 'White clouds are thin: light passes through, scattering in all directions (appearing white). Dark clouds are thick: light is absorbed and scattered so many times that little reaches the bottom, making them appear gray or black from below. A dark cloud is not dirty; it is just very thick with water droplets. Ironically, the darkest clouds are often the ones about to produce the most rain.',
      codeIntro: 'Visualize cloud types by altitude and their precipitation potential.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

clouds = [
    ('Cirrus', 9, 0.5, '#e0e7ff', 'Ice crystals, no rain'),
    ('Cirrostratus', 7.5, 1, '#c7d2fe', 'Thin veil, halo around sun'),
    ('Altostratus', 4.5, 1.5, '#a5b4fc', 'Gray sheet, light rain possible'),
    ('Altocumulus', 3.5, 1, '#818cf8', 'Puffy patches, occasionally rain'),
    ('Stratus', 1, 1.5, '#6366f1', 'Flat gray layer, drizzle'),
    ('Stratocumulus', 1.5, 1.5, '#4f46e5', 'Lumpy layer, light rain'),
    ('Cumulus', 2, 3, '#22c55e', 'Fair weather puffy clouds'),
    ('Cumulonimbus', 4, 10, '#ef4444', 'Thunderstorm! Heavy rain, hail'),
    ('Nimbostratus', 2.5, 3, '#3b82f6', 'Thick gray, steady rain'),
]

for name, base, height, color, desc in clouds:
    rect = plt.Rectangle((clouds.index((name, base, height, color, desc)) * 1.3, base),
                          1, height, facecolor=color, alpha=0.6, edgecolor='white', linewidth=0.5)
    ax.add_patch(rect)
    ax.text(clouds.index((name, base, height, color, desc)) * 1.3 + 0.5, base + height/2,
            f'{name}\n{base}-{base+height}km', ha='center', va='center', color='white', fontsize=7, fontweight='bold')

ax.set_xlim(-0.5, 12)
ax.set_ylim(0, 15)
ax.set_xlabel('Cloud type', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Cloud Types by Altitude and Precipitation Potential', color='white', fontsize=14)
ax.tick_params(colors='gray')
ax.set_xticks([])

# Precipitation potential bars
rain_potential = [0, 0.5, 2, 1, 3, 2, 0.5, 10, 7]
ax_twin = ax.twinx()
ax_twin.bar([i * 1.3 + 0.5 for i in range(len(rain_potential))], rain_potential,
            width=0.8, alpha=0.3, color='#3b82f6')
ax_twin.set_ylabel('Rain potential (relative)', color='#3b82f6')
ax_twin.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cloud types and rain potential:")
for name, base, height, _, desc in clouds:
    print(f"  {name}: {base}-{base+height}km - {desc}")`,
      challenge: 'Add temperature and humidity profiles to the chart. At what altitude does the temperature cross the dew point? That is where clouds form.',
      successHint: 'Knowing cloud types tells you what weather to expect. Cirrus means fair weather. Cumulonimbus means run for cover. The story\'s cloud that refuses to rain is likely a cumulus that has not yet developed into a cumulonimbus.',
    },    {
      title: 'Precipitation physics',
      concept: `For rain to fall, tiny cloud droplets (10 micrometers) must grow to raindrop size (2000+ micrometers). Two mechanisms:\n\n**Collision-coalescence** (warm clouds):\n- Larger droplets fall faster than small ones\n- They collide and merge (coalesce) as they fall\n- This snowball effect produces rain in 20-30 minutes\n\n**Ice crystal process** (cold clouds, Bergeron process):\n- At temperatures below 0C, ice crystals and supercooled water droplets coexist\n- Ice crystals grow at the expense of droplets (lower saturation vapor pressure over ice)\n- Crystals grow large enough to fall, melting into rain as they descend\n\nThis is the physics that cloud seeding exploits: adding nuclei to accelerate these natural processes.`,
      analogy: 'Rain formation is like a snowball rolling downhill. A tiny snowball (cloud droplet) picks up more snow (collides with other droplets) as it rolls, growing larger and faster. Below a certain size, friction stops it (droplet stays suspended). Above that size, gravity wins and it falls (rain).',
      storyConnection: 'The cloud in the story is full of tiny droplets but they will not coalesce. In real clouds, coalescence requires droplets of different sizes. If all droplets are the same size, they fall at the same speed and never collide. The cloud needs diversity in droplet size to start the collision-coalescence cascade.',
      checkQuestion: 'Why does it sometimes rain from a clear sky (sun showers)?',
      checkAnswer: 'The rain is falling from a cloud that is either (1) directly overhead but small enough that sunlight comes around it, (2) upwind and the rain is being blown to where you are standing, or (3) at high altitude where it is invisible from below. True clear-sky rain is extremely rare and usually involves virga (rain that evaporates before reaching the ground) from very high, thin clouds.',
      codeIntro: 'Simulate the collision-coalescence process and watch a raindrop grow.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate droplet growth by collision-coalescence
n_steps = 500
n_droplets = 1000

# Initial droplet sizes (log-normal distribution, mean 10 micrometers)
sizes = np.random.lognormal(np.log(10), 0.5, n_droplets)

growth_history = [sizes.copy()]
mean_size = [np.mean(sizes)]
max_size = [np.max(sizes)]

for step in range(n_steps):
    # Larger droplets collect smaller ones
    # Probability of collision proportional to size difference
    for i in range(min(50, len(sizes))):
        idx = np.random.randint(0, len(sizes))
        partner = np.random.randint(0, len(sizes))
        if idx != partner:
            # Collision probability increases with size difference
            p_collision = abs(sizes[idx] - sizes[partner]) / 1000
            if np.random.random() < p_collision:
                sizes[idx] += sizes[partner] * 0.1  # absorb 10% of partner
    
    mean_size.append(np.mean(sizes))
    max_size.append(np.max(sizes))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(mean_size, color='#3b82f6', linewidth=2, label='Mean droplet size')
ax1.plot(max_size, color='#ef4444', linewidth=2, label='Largest droplet')
ax1.axhline(2000, color='#22c55e', linestyle='--', label='Raindrop threshold (2000 um)')
ax1.set_xlabel('Time step', color='white')
ax1.set_ylabel('Droplet size (micrometers)', color='white')
ax1.set_title('Droplet Growth by Collision-Coalescence', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_yscale('log')

ax2.set_facecolor('#111827')
ax2.hist(growth_history[0], bins=30, alpha=0.5, color='#3b82f6', label='Initial', density=True)
ax2.hist(sizes, bins=30, alpha=0.5, color='#ef4444', label='Final', density=True)
ax2.set_xlabel('Droplet size (micrometers)', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('Size Distribution: Before vs After', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Initial mean: {growth_history[0].mean():.0f} um, max: {growth_history[0].max():.0f} um")
print(f"Final mean: {sizes.mean():.0f} um, max: {sizes.max():.0f} um")
print(f"Droplets exceeding rain threshold: {np.sum(sizes > 2000)}")`,
      challenge: 'Start with all droplets exactly the same size (no variation). Does coalescence happen? This demonstrates why droplet size diversity is critical for rain formation.',
      successHint: 'Understanding precipitation physics is the key to cloud seeding. If we know why a cloud is not raining, we can design an intervention that addresses the specific bottleneck.',
    },    {
      title: 'Cloud seeding technology',
      concept: `**Cloud seeding** is the deliberate introduction of particles into clouds to enhance precipitation. The main agents:\n\n- **Silver iodide (AgI)**: crystal structure similar to ice, acts as ice nuclei for the Bergeron process. Delivered by aircraft or ground generators.\n- **Dry ice (solid CO2)**: at -78C, it supercools air instantly, creating ice crystals from existing water vapor.\n- **Hygroscopic salts** (NaCl, KCl): absorb water, creating large droplets that trigger collision-coalescence.\n\nHow it works:\n1. Identify suitable clouds (must already contain moisture)\n2. Deliver seeding agent at the right altitude and temperature\n3. Agent provides nuclei for ice crystal or droplet formation\n4. Enhanced precipitation falls within 15-45 minutes\n\nCloud seeding cannot create rain from clear skies. It can only enhance precipitation from existing clouds by 10-30%.`,
      analogy: 'Cloud seeding is like adding yeast to bread dough. The dough (cloud) already has all the ingredients (water, flour). Yeast (seeding agent) is the catalyst that triggers the rise (precipitation). Without dough, yeast does nothing. Without clouds, seeding agents do nothing.',
      storyConnection: 'The story\'s village elder scatters sacred ash into the wind, calling the cloud to rain. Cloud seeding replaces sacred ash with silver iodide, and ritual incantation with atmospheric science. The impulse is the same: humans trying to bring rain in a drought.',
      checkQuestion: 'If cloud seeding has existed since 1946, why is not every drought solved?',
      checkAnswer: 'Several reasons: (1) It requires existing clouds with sufficient moisture, which droughts lack. (2) Results are modest, 10-30% enhancement, not drought-breaking. (3) It is difficult to prove statistically (how do you know it would not have rained anyway?). (4) It may redistribute rain from downwind areas (robbing Peter to pay Paul). (5) Costs and logistics are significant for uncertain returns. Cloud seeding is a tool, not a solution.',
      codeIntro: 'Model cloud seeding: how adding nuclei changes the droplet size distribution and precipitation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Cloud properties
n_droplets = 10000
# Unseeded: few large droplets, many small ones
unseeded = np.random.lognormal(np.log(15), 0.4, n_droplets)

# Seeded: AgI provides extra nuclei, more medium-sized droplets
seeded_natural = np.random.lognormal(np.log(15), 0.4, n_droplets)
seeded_extra = np.random.lognormal(np.log(25), 0.6, 2000)  # extra nuclei create larger droplets
seeded = np.concatenate([seeded_natural, seeded_extra])

# Growth simulation (simplified)
def grow(droplets, steps=200):
    d = droplets.copy()
    for _ in range(steps):
        for i in range(min(100, len(d))):
            idx = np.random.randint(len(d))
            partner = np.random.randint(len(d))
            if idx != partner and abs(d[idx] - d[partner]) > 5:
                d[idx] += d[partner] * 0.05
    return d

unseeded_grown = grow(unseeded)
seeded_grown = grow(seeded)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.hist(unseeded_grown, bins=50, alpha=0.6, color='#ef4444', density=True, label='Unseeded cloud')
ax1.hist(seeded_grown, bins=50, alpha=0.6, color='#22c55e', density=True, label='Seeded cloud')
ax1.axvline(100, color='#f59e0b', linestyle='--', label='Rain threshold (simplified)')
ax1.set_xlabel('Droplet size (um)', color='white')
ax1.set_ylabel('Density', color='white')
ax1.set_title('Droplet Size After Growth', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 200)

# Precipitation comparison
threshold = 100
rain_unseeded = np.sum(unseeded_grown > threshold) / len(unseeded_grown) * 100
rain_seeded = np.sum(seeded_grown > threshold) / len(seeded_grown) * 100

ax2.set_facecolor('#111827')
bars = ax2.bar(['Unseeded', 'Seeded'], [rain_unseeded, rain_seeded],
               color=['#ef4444', '#22c55e'], width=0.5)
ax2.set_ylabel('Droplets exceeding rain threshold (%)', color='white')
ax2.set_title('Cloud Seeding Effectiveness', color='white', fontsize=13)
ax2.tick_params(colors='gray')
for bar, val in zip(bars, [rain_unseeded, rain_seeded]):
    ax2.text(bar.get_x() + bar.get_width()/2, val + 0.5, f'{val:.1f}%',
             ha='center', color='white', fontsize=12)

enhancement = (rain_seeded - rain_unseeded) / rain_unseeded * 100 if rain_unseeded > 0 else 0
ax2.text(0.5, max(rain_unseeded, rain_seeded) * 0.5,
         f'+{enhancement:.0f}% enhancement', transform=ax2.transAxes,
         ha='center', color='#f59e0b', fontsize=14, fontweight='bold')

plt.tight_layout()
plt.show()

print(f"Unseeded: {rain_unseeded:.1f}% droplets reach rain size")
print(f"Seeded: {rain_seeded:.1f}% droplets reach rain size")
print(f"Enhancement: +{enhancement:.0f}%")
print("Cloud seeding works by shifting the size distribution toward larger droplets.")`,
      challenge: 'Test different seeding intensities: add 500, 1000, 2000, and 5000 extra nuclei. Is there an optimal seeding rate, or does more always mean better? (Hint: too many nuclei can cause over-seeding, where water is spread across too many small droplets.)',
      successHint: 'Cloud seeding is real atmospheric engineering. Understanding the physics of droplet growth, nucleation, and coalescence transforms the story\'s magical rain-calling into actionable science.',
    },    {
      title: 'Weather modification ethics and law',
      concept: `Cloud seeding raises profound ethical and legal questions:\n\n**Who owns the rain?** If Country A seeds clouds that were heading for Country B, is that water theft?\n\n**Transboundary effects**: China\'s massive cloud seeding program may affect rainfall in India and Southeast Asia.\n\n**Equity**: cloud seeding benefits those who can afford it. Rich regions seed clouds while poor regions downwind receive less rain.\n\n**Environmental risks**: silver iodide is toxic in high concentrations. Long-term effects on ecosystems are unknown.\n\n**Verification problem**: it is nearly impossible to prove that a specific rainfall event was caused by seeding rather than natural processes. This makes regulation difficult.\n\nThe UN passed a convention in 1977 banning weather modification for military purposes (ENMOD), but civilian use remains largely unregulated internationally.`,
      analogy: 'Weather modification ethics are like water rights in a shared river. If upstream users divert water, downstream users suffer. Cloud seeding is atmospheric water diversion. Without international agreements, it becomes a tragedy of the atmospheric commons.',
      storyConnection: 'The story\'s moral question is whether the cloud has the right to choose where it rains. In ethical terms, this translates to: who has the right to modify weather, and who bears the consequences? The cloud\'s refusal might be protecting another village downstream that needs the rain more.',
      checkQuestion: 'Country A seeds clouds near its border with Country B. Country B experiences drought. Is Country A liable?',
      checkAnswer: 'This is an unsolved legal question. Under international law, states have sovereignty over their airspace but also a duty not to cause transboundary harm (Trail Smelter principle, 1941). However, proving causation is nearly impossible: you cannot prove that specific rainfall would have fallen on Country B without seeding. This is the fundamental challenge of weather modification governance.',
      codeIntro: 'Model the transboundary effects of cloud seeding on downwind regions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 1D model: wind blows clouds from west to east
# Region A (seeding) is at positions 0-50
# Region B (downwind) is at positions 50-100
n_positions = 100
n_days = 365

# Moisture content as clouds move east
moisture = np.zeros((n_days, n_positions))

# Scenario 1: No seeding
for day in range(n_days):
    moisture_initial = 80 + 20 * np.sin(2 * np.pi * day / 365)  # seasonal
    m = moisture_initial
    for pos in range(n_positions):
        # Natural precipitation: 2% per km
        precip = 0.02 * m
        m -= precip
        moisture[day, pos] = precip

rain_natural = moisture.copy()

# Scenario 2: Region A seeds (positions 20-40)
moisture_seeded = np.zeros((n_days, n_positions))
for day in range(n_days):
    moisture_initial = 80 + 20 * np.sin(2 * np.pi * day / 365)
    m = moisture_initial
    for pos in range(n_positions):
        if 20 <= pos <= 40:
            precip = 0.04 * m  # double precipitation rate (seeding)
        else:
            precip = 0.02 * m
        m -= precip
        moisture_seeded[day, pos] = precip

rain_seeded = moisture_seeded

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Annual rainfall by position
annual_natural = rain_natural.sum(axis=0)
annual_seeded = rain_seeded.sum(axis=0)

ax1.set_facecolor('#111827')
ax1.plot(annual_natural, color='#3b82f6', linewidth=2, label='No seeding')
ax1.plot(annual_seeded, color='#ef4444', linewidth=2, label='Region A seeds')
ax1.axvspan(20, 40, alpha=0.2, color='#22c55e', label='Seeding zone')
ax1.axvspan(50, 100, alpha=0.1, color='#f59e0b', label='Region B')
ax1.set_xlabel('Position (west to east)', color='white')
ax1.set_ylabel('Annual rainfall (relative)', color='white')
ax1.set_title('Rainfall Distribution: Seeding Steals Downwind Rain', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Winners and losers
diff = annual_seeded - annual_natural
ax2.set_facecolor('#111827')
colors_bar = ['#22c55e' if d > 0 else '#ef4444' for d in diff[::5]]
ax2.bar(range(0, 100, 5), diff[::5], color=colors_bar, width=4)
ax2.axhline(0, color='white', linewidth=0.5)
ax2.axvspan(50, 100, alpha=0.1, color='#f59e0b')
ax2.set_xlabel('Position', color='white')
ax2.set_ylabel('Rainfall change', color='white')
ax2.set_title('Winners (green) and Losers (red)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

region_a_gain = annual_seeded[:50].sum() - annual_natural[:50].sum()
region_b_loss = annual_seeded[50:].sum() - annual_natural[50:].sum()

plt.tight_layout()
plt.show()

print(f"Region A (seeder): +{region_a_gain:.0f} units rainfall ({region_a_gain/annual_natural[:50].sum()*100:.1f}% gain)")
print(f"Region B (downwind): {region_b_loss:.0f} units rainfall ({region_b_loss/annual_natural[50:].sum()*100:.1f}% loss)")
print(f"Global total rainfall: unchanged (just redistributed)")
print()
print("Cloud seeding does not create water. It redistributes it.")
print("One region's gain is another region's loss.")`,
      challenge: 'What if Region B also starts seeding? Model both regions seeding simultaneously. Does competitive seeding benefit or harm both? This is the atmospheric equivalent of an arms race.',
      successHint: 'Weather modification is science with political consequences. Understanding both the physics and the ethics is essential for responsible atmospheric engineering.',
    },    {
      title: 'Drought monitoring and prediction',
      concept: `Modern drought monitoring uses multiple data sources:\n\n- **Palmer Drought Severity Index (PDSI)**: combines temperature, precipitation, and soil moisture into a single number\n- **Standardized Precipitation Index (SPI)**: measures precipitation anomaly relative to historical averages\n- **Satellite remote sensing**: GRACE satellite measures groundwater changes from orbit\n- **Soil moisture sensors**: ground-based monitoring of available water\n- **Weather models**: numerical weather prediction (NWP) forecasts precipitation 1-14 days ahead\n\nDrought prediction is harder than flood prediction because droughts develop slowly (weeks to months) and result from persistent atmospheric patterns. Monsoon prediction is critical for South Asia: the Indian Meteorological Department issues monsoon forecasts that affect billions of people.`,
      analogy: 'Drought monitoring is like checking a patient\'s vital signs. Temperature (air temp), blood pressure (atmospheric pressure), hydration (soil moisture), and blood work (satellite data) together give a complete picture. No single measurement tells the whole story.',
      storyConnection: 'The story\'s village has no warning system. They realize the drought only when the well runs dry. Modern monitoring would have detected the declining rainfall pattern months earlier, giving time to conserve water, plant drought-resistant crops, or petition for cloud seeding operations.',
      checkQuestion: 'The Indian monsoon forecast says 95% normal rainfall this year. Should farmers plant their rice?',
      checkAnswer: 'It depends on distribution. 95% of normal averaged over all of India could mean some regions get 120% (flooding) while others get 70% (drought). Spatial and temporal distribution matters as much as the total. A farmer needs LOCAL forecast, not national average. This is why downscaled, regional forecasting is critical for agriculture.',
      codeIntro: 'Build a simple drought index from temperature and precipitation data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 30 years of monthly data
months = 30 * 12
time = np.arange(months)

# Normal precipitation (seasonal pattern)
seasonal = 50 + 40 * np.sin(2 * np.pi * time / 12 - np.pi/2)  # peak in monsoon (July)
precip = seasonal + np.random.normal(0, 15, months)
precip = np.clip(precip, 0, 200)

# Add a drought (years 15-17: reduced precipitation)
drought_start = 15 * 12
drought_end = 17 * 12
precip[drought_start:drought_end] *= 0.5

# Temperature (rising trend + seasonal)
temp = 25 + 8 * np.sin(2 * np.pi * time / 12) + 0.02 * time + np.random.normal(0, 1, months)

# Simple drought index: SPI (standardized precipitation index)
# Rolling 3-month precipitation anomaly
window = 3
rolling_precip = np.convolve(precip, np.ones(window)/window, mode='same')
mean_p = np.mean(rolling_precip)
std_p = np.std(rolling_precip)
spi = (rolling_precip - mean_p) / std_p

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(14, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

years = time / 12

ax1.set_facecolor('#111827')
ax1.bar(years, precip, width=1/12, color='#3b82f6', alpha=0.7)
ax1.set_ylabel('Precipitation (mm)', color='white')
ax1.set_title('Monthly Precipitation (30 years)', color='white', fontsize=13)
ax1.axvspan(15, 17, alpha=0.2, color='#ef4444', label='Drought period')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.plot(years, temp, color='#ef4444', linewidth=1)
ax2.set_ylabel('Temperature (C)', color='white')
ax2.set_title('Temperature (warming trend visible)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

ax3.set_facecolor('#111827')
colors_spi = ['#ef4444' if s < -1 else '#f59e0b' if s < 0 else '#22c55e' for s in spi]
ax3.bar(years, spi, width=1/12, color=colors_spi, alpha=0.8)
ax3.axhline(-1, color='#f59e0b', linestyle='--', label='Moderate drought')
ax3.axhline(-2, color='#ef4444', linestyle='--', label='Severe drought')
ax3.set_xlabel('Year', color='white')
ax3.set_ylabel('SPI (drought index)', color='white')
ax3.set_title('Standardized Precipitation Index', color='white', fontsize=13)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

drought_months = np.sum(spi < -1)
severe = np.sum(spi < -2)
print(f"Total months with moderate drought (SPI < -1): {drought_months}")
print(f"Total months with severe drought (SPI < -2): {severe}")
print(f"Drought detected in years 15-17: SPI drops to {spi[drought_start:drought_end].min():.2f}")`,
      challenge: 'Add a drought early warning system: trigger an alert when SPI drops below -0.5 for 3 consecutive months. How many months of lead time does this give before the severe drought?',
      successHint: 'Drought monitoring is the first line of defense. Cloud seeding, water rationing, and crop insurance all work better with early warning. The story\'s village suffered because they had no warning system. Modern monitoring gives weeks to months of lead time.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Cloud Seeding & Weather Modification</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
