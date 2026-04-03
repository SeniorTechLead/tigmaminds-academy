import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CloudsLevel1() {
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
      title: 'The atmosphere — layers of air around Earth',
      concept: `The boy in the Khasi hills looked up and wondered: what is the sky made of? The answer is the **atmosphere** — a thin blanket of gases surrounding Earth, held in place by gravity. It's only about 100 km thick (the edge of space), but without it, Earth would be a frozen, airless rock.

The atmosphere has five main layers, each with distinct properties:
- **Troposphere** (0-12 km): where all weather happens, where we live, where clouds form. Temperature drops about 6.5°C for every 1 km you climb.
- **Stratosphere** (12-50 km): contains the ozone layer that blocks UV radiation. Temperature actually increases here because ozone absorbs sunlight.
- **Mesosphere** (50-80 km): coldest layer (-90°C), where meteors burn up.
- **Thermosphere** (80-700 km): very hot but very thin air, where the aurora and ISS orbit.
- **Exosphere** (700-10,000 km): fades into space.

Air pressure — the weight of all the air above you — decreases as you go higher. At sea level, you have the entire atmosphere pressing down. On a mountaintop, much of the air is below you, so the pressure is lower. This is why your ears pop on a plane and why it's hard to breathe on Everest.`,
      analogy: 'The atmosphere is like a stack of blankets on a bed. The bottom blanket (troposphere) is compressed by all the weight above it — it\'s dense and warm. Each blanket above is less compressed, thinner, and cooler. All weather — rain, wind, clouds — happens in that bottom blanket.',
      storyConnection: 'The Khasi boy lived in the hills of Meghalaya, one of the wettest places on Earth. Every day he watched clouds form, build, and release rain. His first lesson was understanding what he was looking at: the troposphere — the thin, turbulent bottom layer of the atmosphere where all weather is born.',
      checkQuestion: 'Shillong (altitude ~1,500 m) is cooler than Guwahati (altitude ~55 m), even though they\'re only 100 km apart. Why?',
      checkAnswer: 'Temperature drops about 6.5°C per 1,000 m of altitude in the troposphere (the lapse rate). Shillong is about 1,450 m higher than Guwahati, so it\'s roughly 9-10°C cooler. The air is thinner at higher altitude, so it holds less heat. This is why hill stations are popular summer retreats.',
      codeIntro: 'Model how atmospheric pressure and temperature change with altitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Altitude range (0 to 100 km)
alt = np.linspace(0, 100, 1000)

# Pressure model: exponential decay
# P = P0 * exp(-alt/H), H = scale height (~8.5 km)
P0 = 1013.25  # sea level pressure in hPa
H = 8.5  # scale height in km
pressure = P0 * np.exp(-alt / H)

# Temperature model (simplified)
temp = np.piecewise(alt,
    [alt <= 12, (alt > 12) & (alt <= 50), (alt > 50) & (alt <= 80), alt > 80],
    [lambda a: 15 - 6.5 * a,          # troposphere
     lambda a: -56.5 + 1.5 * (a - 12), # stratosphere
     lambda a: -56.5 + 1.5 * 38 - 2.5 * (a - 50),  # mesosphere
     lambda a: -90 + 3.0 * (a - 80)])  # thermosphere (simplified)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')

# Pressure plot
ax1.set_facecolor('#111827')
ax1.plot(pressure, alt, color='#3b82f6', linewidth=2)
ax1.fill_betweenx(alt, pressure, alpha=0.1, color='#3b82f6')
ax1.set_xlabel('Pressure (hPa)', color='white')
ax1.set_ylabel('Altitude (km)', color='white')
ax1.set_title('Atmospheric Pressure vs Altitude', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Mark key altitudes
marks = [(0, 'Sea level'), (1.5, 'Shillong'), (8.85, 'Everest'), (12, 'Troposphere top')]
for a, label in marks:
    p = P0 * np.exp(-a / H)
    ax1.plot(p, a, 'o', color='#f59e0b', markersize=6)
    ax1.annotate(f'{label}\\n{p:.0f} hPa', xy=(p, a), xytext=(p + 80, a + 3),
                 color='#f59e0b', fontsize=8, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Temperature plot
ax2.set_facecolor('#111827')
ax2.plot(temp, alt, color='#ef4444', linewidth=2)
ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Altitude (km)', color='white')
ax2.set_title('Temperature vs Altitude', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Mark layers
layers = [(0, 12, 'Troposphere', '#22c55e'), (12, 50, 'Stratosphere', '#3b82f6'),
          (50, 80, 'Mesosphere', '#a855f7'), (80, 100, 'Thermosphere', '#ef4444')]
for low, high, name, c in layers:
    mid = (low + high) / 2
    ax2.axhspan(low, high, alpha=0.08, color=c)
    ax2.text(40, mid, name, color=c, fontsize=9, fontweight='bold', va='center')

plt.tight_layout()
plt.show()

print("Key facts:")
print(f"  Sea level pressure: {P0} hPa")
print(f"  Shillong (~1.5 km): {P0 * np.exp(-1.5/H):.0f} hPa, ~{15 - 6.5*1.5:.0f}°C")
print(f"  Everest (~8.85 km): {P0 * np.exp(-8.85/H):.0f} hPa, ~{15 - 6.5*8.85:.0f}°C")
print(f"  Pressure drops by half every {H * np.log(2):.1f} km")`,
      challenge: 'Add Cherrapunji (altitude ~1,300 m) and Mawsynram (altitude ~1,400 m) to the pressure plot. These are the two wettest places on Earth. What is the pressure at each?',
      successHint: 'The boy\'s first insight was that the sky isn\'t just "up there" — it\'s a physical thing with weight, layers, and structure. Understanding the atmosphere is the foundation for understanding every weather phenomenon.',
    },
    {
      title: 'Temperature and heat — why hilltops are cold and valleys are warm',
      concept: `The Khasi boy noticed something puzzling: the sun heats the ground, and hot air rises — so shouldn't mountaintops be warmer, being closer to the sun? In fact, they're colder. Why?

The answer involves two key ideas:

**1. The sun heats the ground, not the air directly.** Sunlight passes through the atmosphere mostly without warming it. The ground absorbs sunlight, heats up, and then warms the air above it by contact (conduction) and by radiating infrared heat. So the warmest air is at the bottom, near the heated ground.

**2. Rising air expands and cools.** When a parcel of air rises, the pressure around it decreases (less atmosphere above). Lower pressure allows the gas to expand. Expanding gas cools — this is the **adiabatic lapse rate**, about 9.8°C per km for dry air and ~6.5°C per km for moist air.

This is why:
- Valleys are hot (compressed, near-heated ground)
- Hilltops are cold (expanded, thin air)
- The Khasi hills at 1,500 m are ~10°C cooler than the Brahmaputra valley below`,
      analogy: 'Think of a bicycle pump. When you compress air (push the pump), it heats up — touch the bottom of the pump after inflating a tire and it\'s warm. When air expands (going uphill), it cools. The atmosphere is one giant pump: compressed and warm at the bottom, expanded and cold at the top.',
      storyConnection: 'The boy would climb from his village in the valley, where mornings were warm and humid, up to the hilltops where fog clung to the trees and the air was cold and thin. He learned that altitude and temperature are linked — the higher you go, the colder it gets — and this controls where clouds form.',
      checkQuestion: 'If dry air cools at 9.8°C/km but moist air cools at only ~6.5°C/km, why the difference?',
      checkAnswer: 'When moist air rises and cools, the water vapor starts to condense into droplets. Condensation releases latent heat (the reverse of evaporation, which absorbs heat). This released heat partially offsets the cooling from expansion, so moist air cools more slowly. This is why clouds form — and why the cooling rate changes once condensation begins.',
      codeIntro: 'Compare the temperature profiles of dry and moist rising air.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Altitude range
alt = np.linspace(0, 5, 500)  # 0 to 5 km

# Starting temperature at surface
T_surface = 30  # °C (typical Brahmaputra valley)

# Dry adiabatic lapse rate: 9.8°C/km
dry_lapse = 9.8
T_dry = T_surface - dry_lapse * alt

# Moist (saturated) adiabatic lapse rate: ~6.5°C/km
moist_lapse = 6.5
T_moist = T_surface - moist_lapse * alt

# Environmental lapse rate (actual measured, varies)
env_lapse = 6.5
T_env = T_surface - env_lapse * alt

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(T_dry, alt, color='#ef4444', linewidth=2, label=f'Dry adiabatic ({dry_lapse}°C/km)')
ax.plot(T_moist, alt, color='#3b82f6', linewidth=2, label=f'Moist adiabatic ({moist_lapse}°C/km)')
ax.plot(T_env, alt, color='#f59e0b', linewidth=2, linestyle='--', label=f'Typical environment ({env_lapse}°C/km)')

# Mark key locations
locations = [(0, T_surface, 'Brahmaputra Valley\\n(~55 m)'),
             (1.5, T_surface - env_lapse * 1.5, 'Shillong\\n(~1,500 m)'),
             (3, T_surface - env_lapse * 3, 'High peaks\\n(~3,000 m)')]
for a, t, label in locations:
    ax.plot(t, a, 'o', color='#22c55e', markersize=8)
    ax.annotate(label, xy=(t, a), xytext=(t + 3, a + 0.2),
                color='#22c55e', fontsize=9, arrowprops=dict(arrowstyle='->', color='#22c55e'))

ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('How Temperature Drops with Altitude', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')
ax.set_xlim(-5, 35)

# Shade the zone where condensation happens
condensation_alt = 1.2  # approximate cloud base
ax.axhspan(condensation_alt, 5, alpha=0.05, color='#3b82f6')
ax.text(28, condensation_alt + 0.1, 'Cloud zone', color='#3b82f6', fontsize=9, fontstyle='italic')

plt.tight_layout()
plt.show()

print(f"Surface temperature: {T_surface}°C")
print(f"At 1,500 m (Shillong): {T_surface - env_lapse * 1.5:.1f}°C")
print(f"At 3,000 m: {T_surface - env_lapse * 3:.1f}°C")
print(f"Difference between dry and moist at 3 km: {(dry_lapse - moist_lapse) * 3:.1f}°C")
print("The moist air is warmer because condensation releases heat.")`,
      challenge: 'Change the surface temperature to 40°C (a hot summer day in the valley). At what altitude does the temperature reach 0°C (freezing)? This is where snow forms in clouds.',
      successHint: 'The lapse rate is the key to weather prediction. When you know how fast temperature drops with altitude, you can predict where clouds will form, how high they\'ll grow, and whether a storm will develop.',
    },
    {
      title: 'Water cycle — evaporation, condensation, precipitation',
      concept: `The Khasi boy asked his grandmother: "Where does rain come from?" She told him the clouds are the sky's water pots. The scientific answer is the **water cycle** — the continuous movement of water between Earth's surface and atmosphere.

The cycle has four main stages:
1. **Evaporation**: the sun heats water in rivers, lakes, and oceans. Water molecules gain enough energy to escape into the air as invisible vapor. Warm air can hold more water vapor than cold air.
2. **Transpiration**: plants release water vapor through tiny pores in their leaves (stomata). A single large tree can transpire 400 liters per day. In heavily forested regions like Meghalaya, transpiration adds enormous amounts of moisture to the air.
3. **Condensation**: as moist air rises and cools, the water vapor condenses into tiny droplets around dust or pollen particles (condensation nuclei). Billions of these droplets form a cloud.
4. **Precipitation**: when cloud droplets collide and merge, they grow heavy enough to fall as rain (or snow, sleet, hail depending on temperature).

The total amount of water on Earth never changes — it just moves between ocean, atmosphere, ice, and land. The water you drink today may have been rain in Meghalaya a thousand years ago, or part of a glacier ten thousand years ago.`,
      analogy: 'The water cycle is like a giant distillation system. The sun is the heater (evaporating water), the atmosphere is the pipe (carrying vapor upward), the cold upper air is the condenser (turning vapor back to liquid), and gravity is the collector (rain falls back down). Nature has been running this distillery for 4 billion years.',
      storyConnection: 'The boy watched the cycle play out daily: morning sun heated the valleys, moist air rose up the hillsides, clouds formed at the hilltops by afternoon, and rain fell by evening. He could see the water cycle happening in real time — evaporation from the rivers below, clouds building above, rain returning the water to the rivers.',
      checkQuestion: 'If warm air holds more water vapor than cold air, why do tropical regions get more rain than polar regions?',
      checkAnswer: 'Tropical oceans are warm, so huge amounts of water evaporate. The warm tropical air can hold all that moisture. When this air rises (due to convection or mountains), it cools rapidly, and the vapor condenses as heavy rain. Polar air is cold, so very little water evaporates, and the air holds very little vapor. Cold regions get less precipitation overall — Antarctica is technically a desert!',
      codeIntro: 'Simulate the water cycle: track water as it moves between ocean, atmosphere, and land.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified water cycle simulation over 365 days
days = np.arange(0, 365)

# Solar energy drives evaporation (seasonal cycle)
solar = 1 + 0.3 * np.sin(2 * np.pi * (days - 80) / 365)  # peaks in summer

# Evaporation rate (proportional to solar energy)
evaporation = 4.0 * solar  # mm/day

# Temperature (controls how much vapor air can hold)
temp = 20 + 10 * np.sin(2 * np.pi * (days - 80) / 365)

# Max vapor the air can hold (Clausius-Clapeyron, simplified)
max_vapor = 5 * np.exp(0.06 * temp)

# Simulate atmospheric moisture and precipitation
moisture = np.zeros(365)
precipitation = np.zeros(365)
moisture[0] = 20  # starting moisture in mm

for i in range(1, 365):
    moisture[i] = moisture[i-1] + evaporation[i]
    # When moisture exceeds capacity, it rains
    if moisture[i] > max_vapor[i]:
        precipitation[i] = moisture[i] - max_vapor[i] * 0.7  # rain brings it below max
        moisture[i] -= precipitation[i]

fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Evaporation
axes[0].set_facecolor('#111827')
axes[0].fill_between(days, evaporation, alpha=0.3, color='#f59e0b')
axes[0].plot(days, evaporation, color='#f59e0b', linewidth=1.5)
axes[0].set_ylabel('Evaporation\\n(mm/day)', color='white')
axes[0].set_title('The Water Cycle Over One Year', color='white', fontsize=13)
axes[0].tick_params(colors='gray')

# Atmospheric moisture
axes[1].set_facecolor('#111827')
axes[1].fill_between(days, moisture, alpha=0.3, color='#3b82f6')
axes[1].plot(days, moisture, color='#3b82f6', linewidth=1.5, label='Moisture')
axes[1].plot(days, max_vapor, color='#ef4444', linewidth=1, linestyle='--', label='Max capacity')
axes[1].set_ylabel('Atmospheric\\nmoisture (mm)', color='white')
axes[1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[1].tick_params(colors='gray')

# Precipitation
axes[2].set_facecolor('#111827')
axes[2].bar(days, precipitation, color='#22c55e', alpha=0.8, width=1)
axes[2].set_ylabel('Precipitation\\n(mm/day)', color='white')
axes[2].set_xlabel('Day of year', color='white')
axes[2].tick_params(colors='gray')

# Month labels
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
for i, m in enumerate(months):
    axes[2].text(i * 30.4 + 15, axes[2].get_ylim()[1] * 0.9 if axes[2].get_ylim()[1] > 0 else 1,
                 m, color='gray', fontsize=7, ha='center')

plt.tight_layout()
plt.show()

total_evap = np.sum(evaporation)
total_precip = np.sum(precipitation)
print(f"Total evaporation: {total_evap:.0f} mm/year")
print(f"Total precipitation: {total_precip:.0f} mm/year")
print(f"Peak precipitation month: summer (when evaporation is highest)")
print(f"\\nFor comparison, Cherrapunji gets ~11,777 mm/year!")`,
      challenge: 'Increase evaporation by 50% (multiply by 1.5) to simulate what happens when ocean temperatures rise. How does total precipitation change? This is one effect of climate change.',
      successHint: 'The water cycle is Earth\'s most important circulation system. Every drop of rain, every river, every glass of water you drink is part of this cycle. Understanding it is the first step to understanding why some places are wet and others are dry.',
    },
    {
      title: 'Cloud types — cumulus, stratus, cirrus, cumulonimbus',
      concept: `Clouds aren't random puffs of white — they come in distinct types, and each type tells you something specific about what the atmosphere is doing. The Khasi boy learned to read clouds the way we read a book.

The four main cloud families:

**Cumulus** (Latin for "heap"): puffy, flat-bottomed clouds that look like cotton balls. They form when warm air rises in columns (thermals). Fair weather cumulus means sunny skies. If they grow tall, they can become storms.

**Stratus** (Latin for "layer"): flat, gray, blanket-like clouds that cover the sky. They form when a large mass of moist air is gently lifted. Stratus clouds bring drizzle and overcast days. Fog is just stratus cloud at ground level.

**Cirrus** (Latin for "curl of hair"): thin, wispy clouds high up (above 6 km). Made of ice crystals, not water droplets. They often signal that weather will change in the next 12-24 hours.

**Cumulonimbus** (cumulus + nimbus, meaning "rain"): the giant thunderstorm cloud. It can tower from 2 km up to 15 km, punching into the stratosphere. These bring heavy rain, lightning, hail, and sometimes tornadoes. The flat top (anvil shape) forms when the rising air hits the stratosphere and spreads sideways.

Cloud altitude also matters:
- Low clouds (0-2 km): stratus, stratocumulus, nimbostratus
- Mid clouds (2-6 km): altostratus, altocumulus (prefix "alto")
- High clouds (6-12 km): cirrus, cirrocumulus, cirrostratus (prefix "cirro")`,
      analogy: 'Clouds are like a weather report written in the sky. Cumulus clouds are like scattered sticky notes — small bits of rising air. Stratus is like a full-page printout — uniform, wide, boring. Cirrus is like pencil marks on a whiteboard — thin and high. Cumulonimbus is like a huge poster board — impossible to ignore and means something dramatic.',
      storyConnection: 'The boy learned to name every cloud. When he saw cumulus growing taller through the morning, he knew afternoon rain was likely. When he saw high cirrus streaming in from the south, he knew the monsoon was approaching. When a cumulonimbus towered over the hills, he warned his family: a storm was coming. Reading clouds was his first weather forecast.',
      checkQuestion: 'Why are cloud bases flat (especially cumulus clouds) while their tops are puffy and irregular?',
      checkAnswer: 'The flat base marks the altitude where rising air cools enough for water vapor to condense — the condensation level. All rising air parcels in the same area reach this temperature at the same altitude, so the cloud base is uniform. Above the base, condensation releases heat, making the air buoyant, so it keeps rising unevenly — creating the puffy, irregular tops.',
      codeIntro: 'Visualize cloud types at their typical altitudes with their characteristics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#0c1220')

# Cloud types with altitude ranges and characteristics
clouds = [
    {'name': 'Stratus', 'alt_low': 0.2, 'alt_high': 1.5, 'x': 1, 'color': '#94a3b8',
     'weather': 'Drizzle, overcast', 'shape': 'Flat blanket'},
    {'name': 'Cumulus', 'alt_low': 1.0, 'alt_high': 3.0, 'x': 3, 'color': '#f1f5f9',
     'weather': 'Fair weather', 'shape': 'Puffy heaps'},
    {'name': 'Stratocumulus', 'alt_low': 0.5, 'alt_high': 2.0, 'x': 5, 'color': '#cbd5e1',
     'weather': 'Light rain possible', 'shape': 'Lumpy blanket'},
    {'name': 'Altocumulus', 'alt_low': 2.0, 'alt_high': 5.0, 'x': 7, 'color': '#e2e8f0',
     'weather': 'Weather change ahead', 'shape': 'Mid-level puffs'},
    {'name': 'Cirrus', 'alt_low': 6.0, 'alt_high': 10.0, 'x': 9, 'color': '#dbeafe',
     'weather': 'Change in 12-24h', 'shape': 'Wispy ice crystals'},
    {'name': 'Cumulonimbus', 'alt_low': 1.0, 'alt_high': 14.0, 'x': 11, 'color': '#64748b',
     'weather': 'STORM: rain, lightning', 'shape': 'Towering anvil'},
]

for c in clouds:
    height = c['alt_high'] - c['alt_low']
    rect = plt.Rectangle((c['x'] - 0.6, c['alt_low']), 1.2, height,
                          facecolor=c['color'], alpha=0.4, edgecolor=c['color'], linewidth=1.5)
    ax.add_patch(rect)

    # Cloud name at top
    ax.text(c['x'], c['alt_high'] + 0.3, c['name'], color=c['color'],
            fontsize=10, fontweight='bold', ha='center')

    # Altitude range
    ax.text(c['x'], c['alt_low'] - 0.3, f"{c['alt_low']}-{c['alt_high']} km",
            color='gray', fontsize=7, ha='center')

    # Weather meaning
    mid = (c['alt_low'] + c['alt_high']) / 2
    ax.text(c['x'], mid, c['weather'], color='white', fontsize=7,
            ha='center', va='center', fontstyle='italic')

# Altitude bands
bands = [(0, 2, 'Low clouds', '#22c55e'), (2, 6, 'Mid clouds', '#f59e0b'), (6, 14, 'High clouds', '#3b82f6')]
for low, high, label, color in bands:
    ax.axhspan(low, high, alpha=0.03, color=color)
    ax.text(12.8, (low + high) / 2, label, color=color, fontsize=9, va='center', fontweight='bold')

ax.set_xlim(-0.5, 13.5)
ax.set_ylim(-1, 16)
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Cloud Types and Their Altitudes', color='white', fontsize=14)
ax.set_xticks([])
ax.tick_params(colors='gray')

# Tropopause line
ax.axhline(12, color='#ef4444', linestyle='--', linewidth=1, alpha=0.5)
ax.text(6, 12.3, 'Tropopause (~12 km) — top of weather zone', color='#ef4444',
        fontsize=8, ha='center', fontstyle='italic')

plt.tight_layout()
plt.show()

print("Cloud reading cheat sheet:")
print("  Cumulus (small) → fair weather, enjoy the sun")
print("  Cumulus (growing tall) → afternoon rain likely")
print("  Stratus → gray, drizzly day ahead")
print("  Cirrus → weather change in 12-24 hours")
print("  Cumulonimbus → SEEK SHELTER — storm coming")
print("  Altocumulus in morning → thunderstorms by afternoon")`,
      challenge: 'Add nimbostratus (2-4 km, continuous heavy rain) and cirrostratus (6-9 km, halo around sun) to the chart. What weather does each predict?',
      successHint: 'Being able to look at the sky and name the clouds is a superpower that most people don\'t have. Each cloud type is a data point telling you what the atmosphere is doing right now and what it will do next.',
    },
    {
      title: 'Weather prediction — reading the sky like the Khasi boy',
      concept: `Long before weather apps and satellites, people predicted weather by observing the sky. The Khasi boy learned these patterns from his elders, and they match the physics perfectly:

**Signs of good weather:**
- Morning fog that burns off by 10 AM (stable, dry air)
- Small, scattered cumulus clouds that don't grow tall
- Red sky at sunset (dust particles in dry air to the west — fair weather coming)
- Dew on the grass in early morning (clear skies overnight allowed heat to radiate away)

**Signs of rain coming:**
- Halo around the sun or moon (cirrostratus ice crystals — a warm front approaching)
- Clouds lowering and thickening through the day
- Wind shifting from west/northwest to south/southwest
- Sudden drop in barometric pressure
- Cumulus clouds growing taller through the morning

**Signs of a storm:**
- Cumulonimbus clouds building rapidly (towering columns)
- Dark, greenish sky (hail possible)
- Sudden calm after wind (the storm is pulling air inward)
- Rapid pressure drop (more than 3 hPa in 3 hours)

Modern weather prediction uses the same principles but with data from thousands of weather stations, satellites, radar, and supercomputer models. The physics is the same — we just have more data points.`,
      analogy: 'Weather prediction is like detective work. Each observation — cloud type, wind direction, pressure change, temperature trend — is a clue. One clue means little. But put them together and a clear picture emerges. The Khasi boy was a weather detective, collecting clues from the sky every day.',
      storyConnection: 'The boy\'s grandmother would say: "When the clouds sit on the hills like a blanket, rain is two hours away." She was describing orographic lifting — moist air forced upward by terrain, cooling and condensing. Her folk wisdom encoded the same physics that meteorologists use. The boy learned to combine multiple signs: cloud type + wind direction + pressure feel = accurate forecast.',
      checkQuestion: 'The saying "Red sky at night, sailor\'s delight; red sky in morning, sailor\'s warning" — is it scientifically valid?',
      checkAnswer: 'Yes, in mid-latitudes where weather generally moves west to east. A red sunset means dust and dry air to the west (where tomorrow\'s weather comes from) — good weather ahead. A red sunrise means dry air has already passed to the east and moist air is approaching from the west — rain likely. It doesn\'t work perfectly in the tropics or near the equator where weather patterns differ.',
      codeIntro: 'Build a simple weather predictor based on observable signs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple weather prediction model based on observations
# Each factor scores from -10 (storm) to +10 (clear)

def predict_weather(pressure_trend, cloud_type, wind_dir, humidity):
    """
    pressure_trend: 'rising', 'steady', 'falling', 'falling_fast'
    cloud_type: 'clear', 'cirrus', 'cumulus_small', 'cumulus_tall', 'stratus', 'cumulonimbus'
    wind_dir: 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'
    humidity: 0-100%
    """
    score = 0

    # Pressure trend (most important factor)
    pressure_scores = {'rising': 8, 'steady': 4, 'falling': -4, 'falling_fast': -9}
    score += pressure_scores.get(pressure_trend, 0)

    # Cloud type
    cloud_scores = {'clear': 10, 'cirrus': 2, 'cumulus_small': 6,
                    'cumulus_tall': -3, 'stratus': -2, 'cumulonimbus': -10}
    score += cloud_scores.get(cloud_type, 0)

    # Wind direction (for NE India: SW monsoon brings rain)
    wind_scores = {'N': 4, 'NE': 3, 'E': 1, 'SE': -1, 'S': -3, 'SW': -6, 'W': -2, 'NW': 2}
    score += wind_scores.get(wind_dir, 0)

    # Humidity
    score += (50 - humidity) / 10  # high humidity = lower score

    return score

# Test various scenarios
scenarios = [
    ('Clear morning', 'rising', 'clear', 'NW', 30),
    ('Cirrus appearing', 'steady', 'cirrus', 'SW', 50),
    ('Clouds building', 'falling', 'cumulus_tall', 'SW', 70),
    ('Monsoon arrival', 'falling_fast', 'cumulonimbus', 'SW', 95),
    ('After storm', 'rising', 'cumulus_small', 'NW', 45),
    ('Foggy morning', 'steady', 'stratus', 'E', 85),
]

names = []
scores = []
for name, pressure, cloud, wind, humidity in scenarios:
    s = predict_weather(pressure, cloud, wind, humidity)
    names.append(name)
    scores.append(s)

fig, ax = plt.subplots(figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

colors = ['#22c55e' if s > 5 else '#f59e0b' if s > -5 else '#ef4444' for s in scores]
bars = ax.barh(names, scores, color=colors, edgecolor='none', height=0.6)

# Add labels
for bar, score in zip(bars, scores):
    label = 'CLEAR' if score > 5 else 'CHANGING' if score > -5 else 'RAIN/STORM'
    x = bar.get_width() + 0.5 if bar.get_width() >= 0 else bar.get_width() - 0.5
    ax.text(x, bar.get_y() + bar.get_height()/2, f'{score:.0f} → {label}',
            color='white', fontsize=9, va='center',
            ha='left' if bar.get_width() >= 0 else 'right')

ax.axvline(0, color='gray', linewidth=0.5)
ax.axvline(5, color='#22c55e', linewidth=0.5, linestyle=':', alpha=0.5)
ax.axvline(-5, color='#ef4444', linewidth=0.5, linestyle=':', alpha=0.5)
ax.set_xlabel('Weather Score (negative = rain likely)', color='white')
ax.set_title('Simple Weather Predictor Based on Observations', color='white', fontsize=13)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Prediction rules:")
print("  Score > 5:  Clear skies likely")
print("  Score -5 to 5: Weather changing, watch closely")
print("  Score < -5: Rain or storm likely")
print()
print("The boy used these same factors instinctively:")
print("  Pressure feel (ears popping, heavy air)")
print("  Cloud reading (type, height, growth)")
print("  Wind direction (monsoon from SW)")
print("  Humidity feel (sticky air = moisture)")`,
      challenge: 'Add a "season" factor to the model: during June-September (monsoon), add -5 to the score because rain is almost guaranteed. How does this change the predictions?',
      successHint: 'This simple scoring system captures the essence of weather prediction: combine multiple independent observations to build confidence. Modern numerical weather models do the same thing with millions of data points instead of six.',
    },
    {
      title: 'Monsoons — why Northeast India gets so much rain',
      concept: `Cherrapunji and Mawsynram in Meghalaya receive over 11,000 mm of rain per year — among the highest rainfall on Earth. The Khasi boy lived in this extraordinary place and understood why. The answer is the **monsoon** — one of the most powerful weather systems on the planet.

**How the Indian monsoon works:**

1. **Differential heating**: In summer, the vast Indian landmass heats up much faster than the Indian Ocean. Hot air over land rises, creating a zone of low pressure.
2. **Ocean moisture**: Cooler, moisture-laden air from the Indian Ocean rushes in to fill the low-pressure zone. This wind reversal is the monsoon.
3. **Southwest winds**: From June to September, winds blow from the southwest, carrying enormous amounts of moisture from the Arabian Sea and Bay of Bengal.
4. **Orographic lifting**: When this moisture-heavy air hits the Khasi Hills and the Eastern Himalayas, it's forced upward. As it rises, it cools, and all that moisture condenses as rain — massive, torrential rain.

**Why Cherrapunji specifically?**
- It sits on the southern edge of the Khasi Hills, directly facing the moisture-laden winds from the Bay of Bengal
- The hills form a funnel shape that concentrates the airflow
- Moist air is forced up nearly 1,500 m in a short horizontal distance
- The result: one of the wettest places on Earth

The monsoon isn't just weather — it's the lifeblood of South Asia. Over a billion people depend on it for agriculture, drinking water, and river flow.`,
      analogy: 'The monsoon is like a giant see-saw. In summer, the land heats up and the see-saw tips: air flows from ocean to land, bringing rain. In winter, the land cools and the see-saw tips back: air flows from land to ocean, bringing dry weather. The Khasi Hills are like a wall at the edge of the see-saw — they force the moisture up and wring it out like squeezing a wet sponge.',
      storyConnection: 'The boy could tell when the monsoon was arriving: first the cirrus clouds appeared, then the wind shifted to the southwest, then the air became thick with humidity. Within days, the rain began — and didn\'t stop for months. He learned that the monsoon wasn\'t random; it was a predictable, powerful cycle driven by the sun, the ocean, and the mountains he called home.',
      checkQuestion: 'Cherrapunji gets over 11,000 mm of rain per year, but just 50 km north, on the other side of the hills, rainfall drops to under 2,000 mm. Why?',
      checkAnswer: 'This is the rain shadow effect. The moist air drops most of its water on the southern (windward) side of the hills as it\'s forced upward. By the time it crosses the ridge and descends on the northern (leeward) side, it\'s lost most of its moisture. The descending air also warms (adiabatic heating), further reducing its relative humidity. So one side is drenched; the other side is relatively dry.',
      codeIntro: 'Visualize the monsoon\'s seasonal rainfall pattern and compare Cherrapunji with other cities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monthly rainfall data (approximate, in mm)
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

cities = {
    'Cherrapunji': [15, 40, 150, 600, 1200, 2500, 2700, 1800, 1200, 500, 50, 15],
    'Guwahati': [10, 20, 60, 180, 280, 320, 350, 280, 220, 130, 20, 5],
    'Delhi': [15, 20, 15, 10, 25, 70, 200, 220, 120, 20, 5, 5],
    'Chennai': [30, 10, 5, 15, 30, 45, 90, 120, 140, 260, 350, 140],
}

colors = {'Cherrapunji': '#3b82f6', 'Guwahati': '#22c55e', 'Delhi': '#f59e0b', 'Chennai': '#ef4444'}

fig, axes = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Bar chart comparison
ax = axes[0]
ax.set_facecolor('#111827')
x = np.arange(12)
width = 0.2
for i, (city, data) in enumerate(cities.items()):
    ax.bar(x + i * width, data, width, label=city, color=colors[city], alpha=0.8)

ax.set_xticks(x + 1.5 * width)
ax.set_xticklabels(months)
ax.set_ylabel('Monthly rainfall (mm)', color='white')
ax.set_title('Monthly Rainfall: Monsoon Pattern Across India', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Cumulative rainfall
ax2 = axes[1]
ax2.set_facecolor('#111827')
for city, data in cities.items():
    cumulative = np.cumsum(data)
    ax2.plot(x, cumulative, 'o-', color=colors[city], linewidth=2, label=city)
    ax2.annotate(f'{cumulative[-1]:,} mm', xy=(11, cumulative[-1]),
                 xytext=(11.3, cumulative[-1]), color=colors[city], fontsize=9)

ax2.set_xticks(x)
ax2.set_xticklabels(months)
ax2.set_ylabel('Cumulative rainfall (mm)', color='white')
ax2.set_title('Cumulative Rainfall Through the Year', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Annual rainfall totals:")
for city, data in cities.items():
    total = sum(data)
    monsoon = sum(data[5:9])  # Jun-Sep
    pct = monsoon / total * 100
    print(f"  {city}: {total:,} mm/year ({pct:.0f}% falls in Jun-Sep monsoon)")

print()
print("Notice how Chennai is different: it gets its rain from the")
print("NORTHEAST monsoon (Oct-Dec), not the southwest monsoon.")
print("Geography shapes everything.")`,
      challenge: 'Add Mawsynram (even wetter than Cherrapunji: roughly 20% more in each month) to the chart. Then add a horizontal line at 1,000 mm/year — this is considered the threshold for a "wet" climate. How many cities exceed it?',
      successHint: 'The monsoon is a perfect example of how large-scale physics (differential heating of land and ocean) combines with local geography (the Khasi Hills) to create extraordinary weather. The boy who talked to clouds understood this dance between the global and the local.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior weather science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for weather simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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