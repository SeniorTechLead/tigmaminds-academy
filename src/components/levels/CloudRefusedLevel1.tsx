import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import CloudFormationDiagram from '../diagrams/CloudFormationDiagram';
import CloudRainProcessDiagram from '../diagrams/CloudRainProcessDiagram';
import CloudSeedingDiagram from '../diagrams/CloudSeedingDiagram';
import CloudTypesDiagram from '../diagrams/CloudTypesDiagram';
import ActivityCloudJarDiagram from '../diagrams/ActivityCloudJarDiagram';

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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'How clouds form — evaporation, lapse rate, and dew point',
      concept: `In the story, Meghi the cloud gathered water from the Bay of Bengal and carried it to the Khasi Hills. But what does "gathering water" actually mean physically?

The sun heats water surfaces. Water molecules at the surface gain enough kinetic energy to escape as **vapor** (invisible gas). This vapor rises because warm air is less dense. As it rises, atmospheric pressure drops, so the air expands and cools at a steady rate: roughly **6.5°C per 1,000 metres** — the **environmental lapse rate**.

At some altitude, the air cools to its **dew point**: the temperature where it holds maximum vapor. Below the dew point, vapor must condense. But it needs a surface to condense onto — a **condensation nucleus** (dust, salt, pollen, soot). Water molecules stick to these tiny particles, forming droplets ~10 micrometres across. Billions of these droplets = a visible cloud.

**Key calculation:** If ground temperature is 30°C and dew point is 18°C:
- Cloud base = (30 – 18) / 6.5 × 1000 = **1,846 metres**
- This is why Meghalaya’s clouds hug the hills at a predictable altitude.`,
      analogy: 'Cloud formation is like breathing on a cold window. Your breath (warm, moist air) hits the cold glass (like high altitude). The moisture condenses into visible droplets on the surface (the glass acts as a giant condensation nucleus). The colder the glass, the faster the condensation — just as higher altitude means colder air and more cloud formation.',
      storyConnection: 'Meghi gathered water "all the way from the Bay of Bengal." This is real: monsoon winds carry water vapor thousands of kilometres from the ocean. When this moisture-laden air hits the Khasi Hills and is forced upward (orographic lift), it cools below its dew point and forms the massive clouds that make Meghalaya the wettest region on Earth.',
      checkQuestion: 'On a 35°C day with dew point 20°C, at what altitude will clouds form? And why does Cherrapunji get more rain than Shillong, even though they are only 50 km apart?',
      checkAnswer: 'Cloud base: (35 – 20) / 6.5 × 1000 = 2,308 metres. Cherrapunji gets more rain because it sits at the edge of the Khasi plateau where moist air is forced up most steeply (strongest orographic lift). Shillong is on the plateau top — the air has already released much of its moisture before reaching there.',
      codeIntro: 'Model how temperature drops with altitude and predict where clouds form.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Atmospheric lapse rate model
altitude = np.linspace(0, 5000, 500)  # metres
ground_temp = 30  # °C in Shillong valley
lapse_rate = 6.5  # °C per 1000m

# Temperature decreases with altitude
temp = ground_temp - (lapse_rate / 1000) * altitude

# Dew point (roughly constant in lower atmosphere)
dew_point = 18  # °C

# Cloud forms where temperature = dew point
cloud_base = (ground_temp - dew_point) / lapse_rate * 1000

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Temperature profile
ax1.set_facecolor('#111827')
ax1.plot(temp, altitude, color='#ef4444', linewidth=2, label='Air temperature')
ax1.axhline(cloud_base, color='#60a5fa', linestyle='--', linewidth=1.5, alpha=0.7)
ax1.axvline(dew_point, color='#22c55e', linestyle='--', linewidth=1.5, label=f'Dew point ({dew_point}°C)')
ax1.fill_betweenx(altitude, temp, dew_point, where=temp < dew_point,
                  alpha=0.15, color='#60a5fa', label='Cloud zone')
ax1.plot(dew_point, cloud_base, 'o', color='#f59e0b', markersize=10, zorder=5)
ax1.annotate(f'Cloud base: {cloud_base:.0f}m', xy=(dew_point, cloud_base),
            xytext=(dew_point + 3, cloud_base + 300), color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Altitude (m)', color='white')
ax1.set_title('Where Clouds Form Over Shillong', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Different ground temperatures
ax2.set_facecolor('#111827')
for gt in [25, 28, 30, 33, 36]:
    t = gt - (lapse_rate / 1000) * altitude
    cb = (gt - dew_point) / lapse_rate * 1000
    ax2.plot(t, altitude, linewidth=1.5, label=f'{gt}°C → cloud at {cb:.0f}m')
    ax2.plot(dew_point, cb, 'o', markersize=6)

ax2.axvline(dew_point, color='#22c55e', linestyle='--', linewidth=1, alpha=0.5)
ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Altitude (m)', color='white')
ax2.set_title('Hotter Ground = Higher Cloud Base', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cloud formation physics:")
print(f"  Ground temp: {ground_temp}°C, Dew point: {dew_point}°C")
print(f"  Cloud base: {cloud_base:.0f} metres")
print(f"  Lapse rate: {lapse_rate}°C per 1000m")
print(f"  Hotter days push cloud base HIGHER (more cooling needed)")`,
      challenge: 'During monsoon season, the dew point in Meghalaya rises to 24°C and ground temperature drops to 26°C. Recalculate the cloud base. Why does this explain Meghalaya’s persistent low cloud cover during monsoon?',
      successHint: 'You just derived the lifting condensation level (LCL) formula — the same equation meteorologists use worldwide. Every weather balloon launched carries instruments to measure exactly these numbers.',
      diagram: CloudFormationDiagram,
    },
    {
      title: 'Why some clouds rain and others just sit there',
      concept: `Meghi held her rain for days. Is this realistic? Absolutely. Most clouds never produce rain at all. Here is why.

A cloud droplet is about **10 micrometres** across. A raindrop is about **2,000 micrometres** (2 mm). That is a 200x difference in diameter, or about **one million times** the volume. A raindrop needs ~1 million cloud droplets to merge together.

**Collision-coalescence (warm rain process):** Larger droplets fall faster than small ones. As they fall through the cloud, they collide with and absorb smaller droplets. Each collision makes the drop bigger and faster, triggering more collisions — a chain reaction. This works best in thick clouds with a wide range of droplet sizes.

**Bergeron process (ice-crystal process):** In tall clouds, the top is below 0°C but many droplets remain liquid (**supercooled**). Ice crystals in this zone "steal" water vapor from liquid droplets (because vapor pressure over ice < vapor pressure over liquid). Ice crystals grow rapidly, fall, and melt into rain.

**Why Meghi didn’t rain:** Without enough collisions or ice nuclei, droplets stay tiny. The cloud is full of water but none of it can fall. Cloud seeding solves exactly this problem.`,
      analogy: 'Imagine a room full of thousands of tiny soap bubbles floating in the air. None of them is heavy enough to fall to the floor. But if you start gently pushing bubbles together, they merge into bigger bubbles, and eventually they are heavy enough to sink. That merging process is collision-coalescence, and it is why rain needs TIME and THICKNESS to happen.',
      storyConnection: 'The story says Meghi "grew heavier and heavier" but still did not rain. This is physically accurate: a cloud can contain hundreds of thousands of tonnes of water as microscopic droplets, each too small to overcome air resistance. Meghi was waterlogged but her droplets were too small to fall — she needed the coalescence process or ice nuclei to start the chain reaction.',
      checkQuestion: 'A thin stratus cloud (500 m thick) rarely produces heavy rain, while a cumulonimbus (10 km tall) produces downpours. Explain why using what you know about droplet growth.',
      checkAnswer: 'Three reasons: (1) The cumulonimbus has far more water content — more droplets to collide and merge. (2) The 10 km height means droplets have a much longer fall path through the cloud, giving them more time and distance to collide. (3) The top of the cumulonimbus is well below 0°C, so the Bergeron process activates — ice crystals grow rapidly from supercooled droplets. The thin stratus has none of these advantages.',
      codeIntro: 'Simulate droplet growth through collision-coalescence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate collision-coalescence: how a cloud droplet grows into a raindrop
# A falling drop collides with smaller drops and grows

def simulate_droplet_growth(initial_radius_um, cloud_thickness_m, cloud_lwc_g_m3):
    """Simulate a droplet falling through a cloud, collecting smaller drops."""
    r = initial_radius_um  # micrometres
    height = cloud_thickness_m
    dt = 0.1  # time step (seconds)

    radii = [r]
    heights = [height]
    times = [0]
    t = 0

    while height > 0 and r < 3000:  # stop at ground or max raindrop size
        # Terminal velocity (Stokes' law for small drops, empirical for large)
        if r < 40:
            v_fall = 1.2e-4 * r**2  # cm/s -> roughly
        else:
            v_fall = 0.8 * np.sqrt(r / 10)  # m/s, simplified

        # Collection: drop sweeps a cylinder, collects a fraction of cloud water
        efficiency = min(0.8, 0.01 * r / 10)  # collection efficiency increases with size
        cross_section = np.pi * (r * 1e-6)**2  # m^2
        water_collected = cross_section * v_fall * cloud_lwc_g_m3 * 1e-3 * dt * efficiency

        # Volume growth
        vol = (4/3) * np.pi * (r * 1e-6)**3 * 1000  # grams
        vol += water_collected
        r = ((vol / 1000) / ((4/3) * np.pi))**(1/3) * 1e6  # back to micrometres

        height -= v_fall * dt
        t += dt
        radii.append(r)
        heights.append(max(0, height))
        times.append(t)

    return np.array(times), np.array(radii), np.array(heights)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Different starting sizes
ax1.set_facecolor('#111827')
for r0, color, label in [(10, '#ef4444', '10 µm (typical cloud)'),
                          (30, '#f59e0b', '30 µm (large cloud drop)'),
                          (50, '#22c55e', '50 µm (drizzle seed)')]:
    t, r, h = simulate_droplet_growth(r0, 3000, 0.3)
    ax1.plot(t, r, color=color, linewidth=2, label=label)

ax1.axhline(100, color='gray', linestyle=':', alpha=0.5)
ax1.text(5, 120, 'Drizzle threshold (100 µm)', color='gray', fontsize=8)
ax1.axhline(1000, color='gray', linestyle=':', alpha=0.5)
ax1.text(5, 1100, 'Raindrop (1000 µm)', color='gray', fontsize=8)
ax1.set_xlabel('Time (seconds)', color='white')
ax1.set_ylabel('Droplet radius (µm)', color='white')
ax1.set_title('Droplet Growth by Collision-Coalescence', color='white', fontsize=12)
ax1.set_yscale('log')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Cloud thickness effect
ax2.set_facecolor('#111827')
for thickness, color in [(500, '#ef4444'), (1000, '#f59e0b'),
                         (3000, '#22c55e'), (5000, '#3b82f6')]:
    t, r, h = simulate_droplet_growth(20, thickness, 0.3)
    final_r = r[-1]
    ax2.plot(t, r, color=color, linewidth=2, label=f'{thickness}m cloud → {final_r:.0f} µm')

ax2.axhline(1000, color='gray', linestyle=':', alpha=0.5)
ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_ylabel('Droplet radius (µm)', color='white')
ax2.set_title('Thicker Cloud = Bigger Drops', color='white', fontsize=12)
ax2.set_yscale('log')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key insight:")
print("  Thin clouds (500m): droplets barely grow → no rain")
print("  Thick clouds (3000m+): droplets reach raindrop size")
print("  This is why cumulus humilis (small) = fair weather")
print("  and cumulonimbus (tall) = heavy rain")`,
      challenge: 'Modify the cloud liquid water content (cloud_lwc_g_m3) from 0.1 to 1.0 and see how it affects growth rate. At what thickness does a cloud with low water content (0.1) finally produce rain?',
      successHint: 'The collision-coalescence process is why warm tropical clouds can rain without any ice at all. Understanding droplet growth is the foundation of weather modification — if you can make droplets grow faster, you can make clouds rain sooner.',
      diagram: CloudRainProcessDiagram,
    },
    {
      title: 'Cloud seeding — silver iodide and making rain on demand',
      concept: `If Meghi’s droplets were too small to rain, could someone give them a push? That is exactly what **cloud seeding** does.

Invented in 1946 by Vincent Schaefer, cloud seeding introduces particles into clouds to trigger precipitation. The main agent is **silver iodide (AgI)**, whose crystal structure mimics ice. Supercooled droplets freeze onto AgI particles, triggering the Bergeron process: ice crystals grow at the expense of liquid droplets, become heavy, and fall.

**Methods:**
- Aircraft fly through clouds burning AgI flares (most common)
- Ground generators burn AgI solution; wind carries particles up
- Dry ice (solid CO₂) dropped from planes supercools air instantly

**Effectiveness:** 5–15% rainfall increase under favorable conditions. It ONLY works on clouds that already have moisture and supercooled water — you cannot make rain from clear sky.

**The debate:** Does seeding one region "steal" rain from downwind areas? No one has proven it conclusively, but the concern is real. Who gets to decide where it rains?`,
      analogy: 'Cloud seeding is like adding a catalyst to a chemical reaction. The reactants (water vapor, cold air) are already there, but the reaction (rain) needs a kick-start. Silver iodide is that catalyst — it does not create water; it helps existing water do what it was going to do eventually, just faster and in a specific location.',
      storyConnection: 'The East Wind tells Meghi she has become "a prisoner of what you refuse to release." In meteorological terms, Meghi had supercooled water but lacked ice nuclei to start the Bergeron process. A cloud seeding plane flying through Meghi would release AgI particles, which would act as ice nuclei, causing her water to freeze, grow into crystals, and fall as rain. The East Wind was essentially suggesting natural cloud seeding — the conversation that triggered Meghi’s decision to let go.',
      checkQuestion: 'China deployed 35,000 cloud-seeding rockets before the 2008 Beijing Olympics opening ceremony. Were they trying to MAKE rain or PREVENT rain? Think carefully.',
      checkAnswer: 'They were trying to MAKE rain fall BEFORE the ceremony — by seeding clouds approaching Beijing hours in advance, they hoped to drain the clouds before they reached the stadium. The strategy was: make the clouds rain early (over areas outside the city), so they arrive over the stadium already emptied. This is "rain avoidance" through premature precipitation, not rain prevention.',
      codeIntro: 'Model the Bergeron process: how ice crystals grow at the expense of liquid droplets.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bergeron process: ice crystal growth in a mixed-phase cloud
# The key is that saturation vapor pressure over ice < over liquid

def saturation_vapor_pressure(T_celsius, phase='liquid'):
    """Buck equation for saturation vapor pressure (hPa)."""
    if phase == 'liquid':
        return 6.1121 * np.exp((18.678 - T_celsius / 234.5) * T_celsius / (257.14 + T_celsius))
    else:  # ice
        return 6.1115 * np.exp((23.036 - T_celsius / 333.7) * T_celsius / (279.82 + T_celsius))

temps = np.linspace(-40, 0, 200)
e_liquid = np.array([saturation_vapor_pressure(t, 'liquid') for t in temps])
e_ice = np.array([saturation_vapor_pressure(t, 'ice') for t in temps])
supersaturation = (e_liquid - e_ice) / e_ice * 100  # % supersaturation over ice

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Vapor pressure comparison
ax1.set_facecolor('#111827')
ax1.plot(temps, e_liquid, color='#3b82f6', linewidth=2, label='Over liquid water')
ax1.plot(temps, e_ice, color='#06b6d4', linewidth=2, label='Over ice')
ax1.fill_between(temps, e_ice, e_liquid, alpha=0.15, color='#22c55e', label='Difference (drives Bergeron)')
ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Saturation vapor pressure (hPa)', color='white')
ax1.set_title('Why Ice Crystals Steal Water from Droplets', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Supersaturation over ice
ax2.set_facecolor('#111827')
ax2.plot(temps, supersaturation, color='#22c55e', linewidth=2)
ax2.fill_between(temps, 0, supersaturation, alpha=0.15, color='#22c55e')
peak_idx = np.argmax(supersaturation)
ax2.plot(temps[peak_idx], supersaturation[peak_idx], 'o', color='#f59e0b', markersize=10, zorder=5)
ax2.annotate(f'Peak: {supersaturation[peak_idx]:.1f}% at {temps[peak_idx]:.0f}°C',
            xy=(temps[peak_idx], supersaturation[peak_idx]),
            xytext=(temps[peak_idx] + 8, supersaturation[peak_idx] - 3),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.axvline(-12, color='#ef4444', linestyle='--', alpha=0.5)
ax2.text(-11.5, 2, 'AgI activates\\nhere (-5 to -15°C)', color='#ef4444', fontsize=8)
ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Supersaturation over ice (%)', color='white')
ax2.set_title('Ice Crystal Growth Rate (higher = faster)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bergeron process physics:")
print(f"  Maximum supersaturation: {supersaturation[peak_idx]:.1f}% at {temps[peak_idx]:.0f}°C")
print(f"  This means ice crystals grow FASTEST around {temps[peak_idx]:.0f}°C")
print(f"  Silver iodide works best when cloud temp is -5 to -15°C")
print(f"  Below -40°C: water freezes on its own (no seeding needed)")`,
      challenge: 'At what altitude in a cloud would AgI seeding be most effective? Use the lapse rate (6.5°C/km) to calculate the altitude where cloud temperature is at the peak supersaturation temperature.',
      successHint: 'The gap between the two vapor pressure curves IS the Bergeron process. This single chart explains why clouds rain, why cloud seeding works, and why meteorologists care so much about cloud-top temperature.',
      diagram: CloudSeedingDiagram,
    },
    {
      title: 'Cloud classification — reading weather from the sky',
      concept: `Before satellites and apps, people in Meghalaya predicted weather by reading clouds. Modern meteorology classifies clouds by altitude and shape, and each type tells a different weather story.

**Cirrus** (6–12 km): Thin, wispy ice crystals. Fair now, but if thickening, rain may come in 24–48 hours. Khasi elders call spreading cirrus "the sky combing its hair before rain."

**Cumulus** (1–6 km): Puffy cotton-balls on sunny days. Small ones = fair weather. Growing tall = approaching storms. The flat base marks the altitude where temperature = dew point (the LCL you calculated earlier!).

**Stratus** (below 2 km): Flat grey blankets. Drizzle and gloom, rarely heavy rain. Fog = stratus at ground level.

**Cumulonimbus** (ground to 12+ km): The king of clouds. Produces heavy rain, thunder, lightning, hail. Its anvil-shaped top (where rising air hits the tropopause and spreads sideways) is visible from 100 km away.

**Meghi was a cumulonimbus** — dark, heavy, towering, packed with water, refusing to let go.`,
      analogy: 'Cloud types are like different languages of the sky. Cirrus whispers "something is coming." Cumulus speaks cheerfully of sunny thermals. Stratus drones on monotonously. Cumulonimbus shouts "take shelter NOW." Learning to read these languages is the oldest weather forecasting skill in human history.',
      storyConnection: 'The story describes Meghi as "big, dark, and swollen" with a belly that "sagged until she scraped the tops of the pine trees." Her color turned "from grey to black to a deep, bruised purple." This is a textbook description of a cumulonimbus cloud loaded with water. The progression from grey to dark purple indicates increasing thickness and water content — sunlight can no longer penetrate.',
      checkQuestion: 'You are hiking in the Khasi Hills. In the morning, you see thin cirrus high up. By noon, cumulus clouds have flat bases at 2 km and are growing taller. By 3 PM, one has developed a dark base and an anvil top. What happened and what should you do?',
      checkAnswer: 'The cirrus indicated an approaching weather system. Morning sun heated the ground, creating thermals that formed cumulus. As the atmosphere became more unstable (warm surface + cold upper air from the approaching system), cumulus grew into cumulonimbus. The dark base means heavy water content; the anvil top means it has reached the tropopause. You should seek shelter immediately — heavy rain, lightning, and possibly hail within 15–30 minutes.',
      codeIntro: 'Classify cloud types by altitude and temperature, and predict weather.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cloud classification by altitude, temperature, and weather prediction
cloud_types = {
    'Cirrus': {'base': 6000, 'top': 12000, 'color': '#bfdbfe', 'weather': 'Fair (change in 24-48h)', 'phase': 'Ice'},
    'Cirrostratus': {'base': 5500, 'top': 10000, 'color': '#93c5fd', 'weather': 'Rain approaching', 'phase': 'Ice'},
    'Altostratus': {'base': 2000, 'top': 6000, 'color': '#6b7280', 'weather': 'Rain likely soon', 'phase': 'Mixed'},
    'Cumulus': {'base': 1000, 'top': 3000, 'color': '#fbbf24', 'weather': 'Fair weather', 'phase': 'Liquid'},
    'Stratus': {'base': 0, 'top': 2000, 'color': '#9ca3af', 'weather': 'Drizzle, fog', 'phase': 'Liquid'},
    'Cumulonimbus': {'base': 500, 'top': 12000, 'color': '#ef4444', 'weather': 'Heavy rain, storms!', 'phase': 'Mixed/Ice'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Cloud altitude chart
ax1.set_facecolor('#111827')
for i, (name, info) in enumerate(cloud_types.items()):
    ax1.barh(i, info['top'] - info['base'], left=info['base'], height=0.6,
            color=info['color'], alpha=0.7, edgecolor='white', linewidth=0.5)
    ax1.text(info['top'] + 200, i, f"{info['weather']}", color='white', fontsize=8, va='center')

ax1.set_yticks(range(len(cloud_types)))
ax1.set_yticklabels(cloud_types.keys(), color='white', fontsize=10)
ax1.set_xlabel('Altitude (metres)', color='white')
ax1.set_title('Cloud Types by Altitude', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Temperature at each level
altitude = np.linspace(0, 12000, 100)
lapse_rate = 6.5  # °C per km
ground_temp = 28
temp = ground_temp - (lapse_rate / 1000) * altitude

ax1_twin = ax1.twiny()
ax1_twin.plot(temp, np.interp(altitude, [0, 12000], [-0.5, 5.5]), color='#ef4444',
             linewidth=1.5, linestyle='--', alpha=0.5)
ax1_twin.set_xlabel('Temperature (°C)', color='#ef4444', fontsize=9)
ax1_twin.tick_params(colors='#ef4444', labelsize=8)

# Meghalaya annual cloud patterns
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
rainfall_mm = [15, 30, 65, 160, 500, 2500, 2800, 1800, 1200, 400, 60, 15]
dominant_cloud = ['Stratus', 'Cumulus', 'Cumulus', 'Cb builds', 'Cb dominant',
                  'Cb PEAK', 'Cb PEAK', 'Cb heavy', 'Cb waning', 'Cumulus', 'Cirrus', 'Stratus']

ax2.set_facecolor('#111827')
bars = ax2.bar(months, rainfall_mm, color=['#6b7280', '#fbbf24', '#fbbf24', '#f97316',
               '#ef4444', '#dc2626', '#dc2626', '#ef4444', '#f97316', '#fbbf24', '#bfdbfe', '#6b7280'],
               alpha=0.7, edgecolor='white', linewidth=0.5)

for i, (bar, cloud) in enumerate(zip(bars, dominant_cloud)):
    ax2.text(i, bar.get_height() + 50, cloud, ha='center', va='bottom',
            color='white', fontsize=7, rotation=45)

ax2.set_ylabel('Rainfall (mm)', color='white')
ax2.set_title('Cherrapunji: Monthly Rainfall & Cloud Type', color='white', fontsize=12)
ax2.tick_params(colors='gray')
plt.xticks(rotation=45)

plt.tight_layout()
plt.show()

total = sum(rainfall_mm)
print(f"Cherrapunji annual rainfall: {total:,} mm")
print(f"Monsoon months (Jun-Sep): {sum(rainfall_mm[5:9]):,} mm ({sum(rainfall_mm[5:9])/total*100:.0f}% of total)")
print(f"Dry months (Nov-Feb): {sum(rainfall_mm[10:12]) + sum(rainfall_mm[0:2]):,} mm")
print(f"Cumulonimbus dominates Apr-Sep = the rain season")`,
      challenge: 'Add nimbostratus (rain-bearing flat cloud, 2000–5000m) and altocumulus (patchy mid-level, 2000–7000m) to the classification chart. What weather does each predict?',
      successHint: 'Cloud reading is not just history — pilots, sailors, farmers, and outdoor guides still use it daily. Satellite images are just overhead views of the same cloud types you learned to identify from the ground.',
      diagram: CloudTypesDiagram,
    },
    {
      title: 'Meghalaya’s rain — why the wettest place on Earth is right here',
      concept: `Meghalaya receives more rain than almost anywhere on Earth. Mawsynram: 11,871 mm/year. Cherrapunji: 11,430 mm/year. That is about 10x more than London. Why HERE?

**Orographic precipitation:** The Bay of Bengal heats up during summer. Moist air flows north toward the Himalayas. The Khasi Hills of Meghalaya (1,000–1,500m) sit directly in this airflow’s path. The air is FORCED upward, cools rapidly, and dumps its moisture.

Three factors combine:
1. **Funnel geography:** The Himalayan foothills funnel moist air directly at Meghalaya
2. **Steep terrain:** The southern edge of the Khasi plateau rises abruptly, forcing air up fast
3. **Persistent moisture:** The Bay of Bengal provides unlimited water vapor for months

The result: a natural cloud-making machine that runs from April to October. Meghi’s journey from the Bay of Bengal to the Khasi Hills is the actual monsoon pathway.`,
      analogy: 'Meghalaya’s rainfall works like squeezing a sponge against a wall. The Bay of Bengal soaks the air (sponge) with moisture. The monsoon wind pushes it toward the Khasi Hills (wall). When the sponge hits the wall and is forced upward, the moisture gets squeezed out. The steeper the wall and the wetter the sponge, the more water comes out.',
      storyConnection: 'Meghi carried water "all the way from the Bay of Bengal" and drifted over the Khasi Hills — this is the exact path of the Indian monsoon. The story is set in Meghalaya, which literally means "abode of clouds" in Sanskrit. The pine-covered hills, the village with its garden, and the cloud that refuses to rain are all part of the wettest landscape in the world.',
      checkQuestion: 'If the Khasi Hills were only 200 metres tall instead of 1,500 metres, would Cherrapunji still be the wettest place? And what happens to the air AFTER it passes over the hills?',
      checkAnswer: 'No — 200m hills would not force air high enough to cool below the dew point efficiently. Much less condensation, much less rain. After passing over the hills, the air descends on the other side. Descending air warms (by compression) and becomes drier — this creates a "rain shadow." The area north of the Khasi Hills is indeed much drier. This is why Assam’s Brahmaputra valley, just north of Meghalaya, gets significantly less rainfall than the southern slopes.',
      codeIntro: 'Model orographic precipitation: how terrain forces air up and squeezes out rain.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Orographic precipitation model
# Moist air hits hills, rises, cools, condenses, rains

distance_km = np.linspace(0, 200, 500)

# Terrain profile (simplified Khasi Hills)
terrain = np.zeros_like(distance_km)
# Southern slope of Khasi plateau (steep)
mask1 = (distance_km > 80) & (distance_km < 110)
terrain[mask1] = 1500 * (distance_km[mask1] - 80) / 30
# Plateau top
mask2 = (distance_km >= 110) & (distance_km < 150)
terrain[mask2] = 1500
# Northern descent
mask3 = (distance_km >= 150) & (distance_km < 180)
terrain[mask3] = 1500 * (1 - (distance_km[mask3] - 150) / 30)

# Air parcel trajectory (follows terrain but higher)
air_height = terrain + 500

# Temperature of air parcel
ground_temp = 30  # Bay of Bengal side
lapse_rate = 6.5 / 1000  # per metre
air_temp = ground_temp - lapse_rate * air_height
dew_point = 22  # monsoon air is very moist

# Moisture content (decreases as rain falls)
moisture = np.ones_like(distance_km) * 100  # relative scale
for i in range(1, len(distance_km)):
    if air_temp[i] < dew_point:  # condensation occurring
        rain_rate = (dew_point - air_temp[i]) * 0.3
        moisture[i] = max(0, moisture[i-1] - rain_rate * 0.4)
    else:
        moisture[i] = moisture[i-1]

# Rainfall intensity (proportional to condensation rate)
rainfall = np.zeros_like(distance_km)
for i in range(1, len(distance_km)):
    if air_temp[i] < dew_point and moisture[i] > 5:
        rainfall[i] = (dew_point - air_temp[i]) * moisture[i] / 100

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Terrain + air trajectory + temperature
ax1.set_facecolor('#111827')
ax1.fill_between(distance_km, 0, terrain, color='#6b7280', alpha=0.5, label='Khasi Hills terrain')
ax1.plot(distance_km, air_height, color='#3b82f6', linewidth=2, label='Air parcel path')

# Color the air path by temperature
for i in range(len(distance_km) - 1):
    color = '#ef4444' if air_temp[i] > dew_point else '#60a5fa'
    ax1.plot(distance_km[i:i+2], air_height[i:i+2], color=color, linewidth=3)

ax1.axhline(0, color='white', linewidth=0.5)
ax1.text(10, 200, 'Bay of Bengal\\n(warm, moist)', color='#ef4444', fontsize=9)
ax1.text(110, 1800, 'Cherrapunji', color='#60a5fa', fontsize=9, ha='center')
ax1.text(170, 200, 'Rain shadow\\n(dry)', color='#f59e0b', fontsize=9)
ax1.set_ylabel('Altitude (m)', color='white')
ax1.set_title('Orographic Lift: Why Meghalaya Is the Wettest Place', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Rainfall distribution
ax2.set_facecolor('#111827')
ax2.fill_between(distance_km, 0, rainfall, color='#3b82f6', alpha=0.5)
ax2.plot(distance_km, rainfall, color='#3b82f6', linewidth=2)
ax2.fill_between(distance_km, 0, terrain / terrain.max() * rainfall.max() * 0.3,
                color='#6b7280', alpha=0.3)
ax2.set_xlabel('Distance from Bay of Bengal (km)', color='white')
ax2.set_ylabel('Rainfall intensity', color='white')
ax2.set_title('Rainfall Peaks at the Windward Slope', color='white', fontsize=12)

# Annotate
peak_idx = np.argmax(rainfall)
ax2.annotate(f'Peak rainfall at {distance_km[peak_idx]:.0f} km\\n(southern slope)',
            xy=(distance_km[peak_idx], rainfall[peak_idx]),
            xytext=(distance_km[peak_idx] + 30, rainfall[peak_idx] * 0.8),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Orographic precipitation model:")
print(f"  Peak rainfall at {distance_km[peak_idx]:.0f} km from coast")
print(f"  This matches Cherrapunji's position on the southern Khasi slope")
print(f"  The 'rain shadow' north of the hills gets much less rain")
print(f"  Same process happens worldwide: Seattle (Cascades), Bergen (Norway), Darjeeling")`,
      challenge: 'What would happen if the Khasi Hills were twice as high (3,000m)? Would rainfall increase or decrease, and why? Consider: more lift means more cooling, but also means less moisture left for the top.',
      successHint: 'Orographic precipitation explains not just Meghalaya but every mountain city’s rainfall pattern. Once you understand "air goes up, rain comes out," you can predict wet and dry sides of mountains worldwide.',
      diagram: ActivityCloudJarDiagram,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Cloud Science &amp; Rain Formation</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python to model clouds and rain. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady}
            diagram={lesson.diagram} />
        ))}
      </div>
    </div>
  );
}
