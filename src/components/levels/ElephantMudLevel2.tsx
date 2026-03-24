import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function ElephantMudLevel2() {
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
      title: 'Stefan-Boltzmann law — the physics of radiative cooling',
      concept: `Every object above absolute zero radiates electromagnetic energy. The **Stefan-Boltzmann law** quantifies this:

**P = epsilon * sigma * A * T\u2074**

Where:
- P = radiated power (Watts)
- epsilon = emissivity (0-1; skin \u2248 0.95, polished metal \u2248 0.05)
- sigma = 5.67 \u00d7 10\u207b\u2078 W/m\u00b2/K\u2074 (Stefan-Boltzmann constant)
- A = surface area (m\u00b2)
- T = surface temperature (Kelvin!)

**Key insight: T\u2074 dependence**
A small temperature increase causes a LARGE increase in radiation. Going from 35\u00b0C to 37\u00b0C (308K to 310K) increases radiation by 2.6% \u2014 that is a significant jump for a 20 m\u00b2 elephant.

**For elephants:**
- Skin temperature: ~35\u00b0C (308 K)
- Surface area: ~20 m\u00b2
- Radiated power: 0.95 \u00d7 5.67e-8 \u00d7 20 \u00d7 308\u2074 = ~9,700 W

But the elephant also ABSORBS radiation from the environment (ground, sky, other objects). **Net radiation** = emitted - absorbed. At night, the sky is cold (~-20\u00b0C effective temperature), so net radiation is large. During the day, the ground is hot, so net radiation can be negative (elephant absorbs more than it emits).`,
      analogy: 'The Stefan-Boltzmann law is like the brightness knob on a light. Turn it slightly (small temperature increase) and the brightness (radiated power) changes a LOT \u2014 because brightness scales with the FOURTH power of the knob position. This is why a warm elephant ear is such an effective radiator: a few degrees of warming dramatically increases heat emission.',
      storyConnection: 'At night in Kaziranga, the baby elephant\'s skin radiates infrared into the cold sky. This is when elephants lose the heat stored during the day. The clear monsoon nights (when clouds break) are the most effective for radiative cooling \u2014 the elephant literally glows in the infrared, invisible to our eyes but powerful enough to dump thousands of watts into space.',
      checkQuestion: 'An elephant\'s ear at 38\u00b0C radiates to a night sky at an effective temperature of -20\u00b0C (253K). Calculate the net radiative power from one ear (1.5 m\u00b2, emissivity 0.95).',
      checkAnswer: 'Emitted: 0.95 \u00d7 5.67e-8 \u00d7 1.5 \u00d7 (311)\u2074 = 752 W. Absorbed from sky: 0.95 \u00d7 5.67e-8 \u00d7 1.5 \u00d7 (253)\u2074 = 331 W. Net from one ear: 752 - 331 = 421 W. Two ears: ~842 W. That is like having two 400W heaters running \u2014 except they are cooling the elephant. The ears are remarkably effective nighttime radiators.',
      codeIntro: 'Implement the Stefan-Boltzmann law for elephant thermal radiation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sigma = 5.67e-8  # Stefan-Boltzmann constant
epsilon = 0.95  # skin emissivity

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. T^4 dependence
ax1.set_facecolor('#111827')
temps_C = np.linspace(20, 45, 200)
temps_K = temps_C + 273.15
power_per_m2 = epsilon * sigma * temps_K**4

ax1.plot(temps_C, power_per_m2, color='#ef4444', linewidth=2)
ax1.fill_between(temps_C, power_per_m2, alpha=0.1, color='#ef4444')
ax1.set_xlabel('Surface temperature (\u00b0C)', color='white')
ax1.set_ylabel('Radiated power (W/m\u00b2)', color='white')
ax1.set_title('Stefan-Boltzmann: P \u221d T\u2074', color='white', fontsize=12)
ax1.tick_params(colors='gray')

for T, label in [(35, 'Cool skin'), (37, 'Normal'), (40, 'Hot ears')]:
    P = epsilon * sigma * (T + 273.15)**4
    ax1.scatter(T, P, s=80, color='#f59e0b', zorder=5, edgecolors='white')
    ax1.annotate(f'{label}\\n{P:.0f} W/m\u00b2', xy=(T, P), xytext=(T+1, P+10),
                color='#f59e0b', fontsize=9)

# 2. Net radiation: day vs night
ax2.set_facecolor('#111827')
hours = np.linspace(0, 24, 1440)

sky_temp_K = 253 + 25 * np.sin(np.pi * (hours - 6) / 12)
sky_temp_K = np.clip(sky_temp_K, 240, 290)
ground_temp_K = 288 + 12 * np.sin(np.pi * (hours - 8) / 12)
skin_temp_K = 308 + 2 * np.sin(np.pi * (hours - 14) / 12)

skin_area = 20
emitted = epsilon * sigma * skin_temp_K**4
absorbed_sky = epsilon * sigma * sky_temp_K**4 * 0.5
absorbed_ground = epsilon * sigma * ground_temp_K**4 * 0.5
net = (emitted - absorbed_sky - absorbed_ground) * skin_area

ax2.plot(hours, net, color='#22c55e', linewidth=2)
ax2.fill_between(hours, net, 0, where=net > 0, alpha=0.2, color='#22c55e', label='Net cooling')
ax2.fill_between(hours, net, 0, where=net < 0, alpha=0.2, color='#ef4444', label='Net heating')
ax2.axhline(0, color='gray', linestyle=':', alpha=0.3)
ax2.set_xlabel('Hour of day', color='white')
ax2.set_ylabel('Net radiative power (W)', color='white')
ax2.set_title('24-Hour Net Radiation Budget', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

dt = 24 * 3600 / len(hours)
total_night_cooling = np.sum(net[net > 0]) * dt / 3600
total_day_heating = np.abs(np.sum(net[net < 0])) * dt / 3600
net_daily = (total_night_cooling - total_day_heating) / 1000

print("Stefan-Boltzmann analysis for a 4000 kg elephant:")
print(f"  Skin area: 20 m\u00b2, emissivity: {epsilon}")
print(f"  At 36\u00b0C (309K): emits {epsilon*sigma*20*309**4:.0f} W total")
print(f"  Net nighttime cooling: {total_night_cooling/1000:.1f} kWh")
print(f"  Net daytime heating: {total_day_heating/1000:.1f} kWh")
print(f"  24-hour net: {net_daily:.1f} kWh")`,
      challenge: 'Calculate how much the net radiation budget changes on a cloudy night (sky effective temperature rises from -20\u00b0C to 0\u00b0C). Clouds act as a thermal blanket \u2014 trapping the elephant\'s radiated heat.',
      successHint: 'The Stefan-Boltzmann law governs all thermal radiation \u2014 from elephant ears to stars to industrial furnaces. The T^4 scaling makes it one of the most powerful equations in physics.',
    },
    {
      title: 'Thermal imaging \u2014 seeing heat with technology',
      concept: `**Thermal cameras** detect infrared radiation and convert it into visible images. They literally make the invisible visible.

**How thermal cameras work:**
1. Infrared radiation from objects hits a microbolometer array (detector)
2. Each pixel heats slightly proportional to incident radiation
3. Temperature change \u2192 resistance change \u2192 electrical signal
4. Signal is mapped to a color scale (hot = white/red, cold = blue/black)

**Thermal imaging in elephant research:**
- **Body temperature mapping**: identify hot spots (ears, temporal glands) and cold spots (trunk tip)
- **Health monitoring**: infections create localized heat increases
- **Nighttime observation**: elephants visible in complete darkness
- **Population surveys**: count animals in tall grass from aircraft

**Key insight:** Thermal images show SURFACE temperature, not core temperature. An elephant's skin at 35\u00b0C may have a core of 36.5\u00b0C. The difference reveals blood flow and insulation patterns.`,
      analogy: 'A thermal camera is like X-ray vision for heat. Where your eyes see a gray elephant against a green forest, the thermal camera sees a bright-white warm body against a cool-blue background. The elephant\'s ears glow hot (blood-filled radiators), the trunk tip is cool (exposed to air), and the mud on its back is colder than the skin beneath.',
      storyConnection: 'If you pointed a thermal camera at the baby elephant during its first mud bath, you would see the elephant glowing bright white (hot) before the bath, then gradually dimming as the cool mud covers its body. The ears would remain hot (blood still flowing to dump heat). The whole thermoregulation drama, visible in infrared.',
      checkQuestion: 'A thermal image shows one elephant with bright hot ears and another with cool ears. What might this indicate?',
      checkAnswer: 'Hot ears = vasodilation, blood pumping to ear surfaces for cooling. This elephant is likely heat-stressed or recently active. Cool ears = vasoconstriction, blood diverted away. This elephant may be resting for a long time or in physiological stress. Ear temperature is a non-invasive window into thermoregulatory state.',
      codeIntro: 'Simulate thermal imaging of an elephant.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

size = 100

def create_elephant_thermal(base_temp, ear_temp, mud_coverage=0):
    thermal = np.full((size, size), 25.0)
    cy, cx = 50, 50
    for y in range(size):
        for x in range(size):
            if ((x - cx)**2 / 35**2 + (y - cy)**2 / 20**2) < 1:
                thermal[y, x] = base_temp + np.random.normal(0, 0.3)
    for ear_cx in [20, 80]:
        for y in range(size):
            for x in range(size):
                if ((x - ear_cx)**2 + (y - 35)**2) < 12**2:
                    thermal[y, x] = ear_temp + np.random.normal(0, 0.5)
    for y in range(size):
        for x in range(size):
            if ((x - 50)**2 + (y - 25)**2) < 10**2:
                thermal[y, x] = base_temp - 1 + np.random.normal(0, 0.3)
    for leg_cx in [35, 65]:
        for y in range(70, 95):
            for x in range(size):
                if abs(x - leg_cx) < 6:
                    thermal[y, x] = base_temp - 2 + np.random.normal(0, 0.3)
    if mud_coverage > 0:
        mud_mask = np.random.random((size, size)) < mud_coverage
        body_mask = thermal > 30
        thermal[mud_mask & body_mask] -= 5
    return thermal

titles = ['Normal (no mud)', 'After mud bath', 'Heat stressed']
params = [(35.5, 38.0, 0), (33.0, 37.0, 0.5), (37.5, 40.0, 0)]

for idx, (ax, title, (bt, et, mc)) in enumerate(zip(axes, titles, params)):
    thermal = create_elephant_thermal(bt, et, mc)
    im = ax.imshow(thermal, cmap='inferno', vmin=22, vmax=40, origin='lower')
    ax.set_title(title, color='white', fontsize=11)
    ax.axis('off')
    plt.colorbar(im, ax=ax, label='\u00b0C', shrink=0.7)

plt.tight_layout()
plt.show()

print("Thermal imaging reveals what eyes cannot:")
print("  Normal elephant: ears 38\u00b0C, body 35.5\u00b0C, trunk tip 32\u00b0C")
print("  Post mud bath: body drops 2-5\u00b0C, ears remain hot")
print("  Heat stressed: uniformly hot, no cool zones")
print()
print("  Mud bathing literally makes elephants harder to detect in infrared!")`,
      challenge: 'Design a thermal monitoring system for Kaziranga: how many thermal cameras, at what spacing, to detect every elephant in a 500 km\u00b2 area? Account for detection range and canopy obstruction.',
      successHint: 'Thermal imaging connects the Stefan-Boltzmann law to real-world conservation technology. Every pixel in a thermal image is a measurement of T\u2074 \u2014 the physics you just learned, turned into a practical tool.',
    },
    {
      title: 'Metabolic rate scaling \u2014 Kleiber\'s law',
      concept: `**Kleiber's law** (1932) is one of biology's most remarkable patterns: metabolic rate scales with body mass to the 3/4 power.

**B = B\u2080 \u00d7 M^0.75**

Where B = metabolic rate (W), B\u2080 \u2248 3.5 W/kg^0.75, M = body mass (kg).

**What this means:**
- A 4000 kg elephant produces: 3.5 \u00d7 4000^0.75 \u2248 3100 W of metabolic heat
- A 0.02 kg mouse produces: 3.5 \u00d7 0.02^0.75 \u2248 0.12 W
- Per kg: elephant = 0.78 W/kg, mouse = 6.0 W/kg

**The elephant generates 8x LESS heat per kg than a mouse.** If the elephant had the mouse's per-kg rate, it would produce 24,000 W and cook itself.

**Why 3/4 and not 2/3?**
The naive prediction (based on SA/V) is 2/3. The actual exponent is 3/4 \u2014 slightly higher. This relates to fractal-like branching of blood vessels (West-Brown-Enquist theory, 1997). The circulatory system's fractal geometry sets the 3/4 scaling.`,
      analogy: 'Kleiber\'s law is like fuel efficiency in vehicles. A motorcycle (small) burns more fuel per kg than a freight train (huge), but the train burns more TOTAL fuel. Nature\'s "engines" (metabolisms) follow the same law: bigger animals are more fuel-efficient per unit mass.',
      storyConnection: 'The baby elephant eats constantly \u2014 calves nurse up to 12 hours a day. But as it grows, its metabolic rate per kg drops. An adult in Kaziranga eats ~150 kg daily \u2014 only 3-4% of body weight. A mouse-sized elephant would need 1000 kg per day! Kleiber\'s law makes being an elephant metabolically feasible.',
      checkQuestion: 'If metabolic rate scales as M^0.75 and surface area scales as M^0.67, which grows faster with body size?',
      checkAnswer: 'Heat production (M^0.75) grows faster than heat loss capacity (M^0.67). This gap represents the "thermal debt" large animals must manage with special adaptations. This is the quantitative basis of the elephant thermoregulation challenge.',
      codeIntro: 'Explore Kleiber\'s law across the animal kingdom.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

animals = {
    'Mouse': {'mass': 0.02, 'bmr': 0.12, 'color': '#ef4444'},
    'Rat': {'mass': 0.3, 'bmr': 1.0, 'color': '#f59e0b'},
    'Cat': {'mass': 4, 'bmr': 8, 'color': '#8b5cf6'},
    'Human': {'mass': 70, 'bmr': 80, 'color': '#3b82f6'},
    'Horse': {'mass': 500, 'bmr': 350, 'color': '#22c55e'},
    'Elephant': {'mass': 4000, 'bmr': 3100, 'color': '#14b8a6'},
    'Blue whale': {'mass': 100000, 'bmr': 35000, 'color': '#6b7280'},
}

m_range = np.logspace(-2, 5, 200)

# 1. Kleiber's law
ax1.set_facecolor('#111827')
ax1.plot(m_range, 3.5 * m_range**0.75, '--', color='gray', linewidth=1, label='B = 3.5 \u00d7 M\u2070\u00b7\u2077\u2075')
for name, props in animals.items():
    ax1.scatter(props['mass'], props['bmr'], s=80, color=props['color'], edgecolors='white', zorder=5)
    ax1.annotate(name, xy=(props['mass'], props['bmr']), xytext=(5, 5),
                textcoords='offset points', color=props['color'], fontsize=8)
ax1.set_xscale('log'); ax1.set_yscale('log')
ax1.set_xlabel('Body mass (kg)', color='white')
ax1.set_ylabel('Basal metabolic rate (W)', color='white')
ax1.set_title("Kleiber's Law: B \u221d M\u2070\u00b7\u2077\u2075", color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# 2. Heat production vs heat loss scaling
ax2.set_facecolor('#111827')
heat_prod = 3.5 * m_range**0.75
heat_loss = 10 * m_range**0.67

ax2.plot(m_range, heat_prod, color='#ef4444', linewidth=2, label='Heat production (M\u2070\u00b7\u2077\u2075)')
ax2.plot(m_range, heat_loss, color='#3b82f6', linewidth=2, label='Heat loss capacity (M\u2070\u00b7\u2076\u2077)')
ax2.fill_between(m_range, heat_loss, heat_prod, where=heat_prod > heat_loss,
                alpha=0.2, color='#ef4444', label='Thermal gap')
ax2.set_xscale('log'); ax2.set_yscale('log')
ax2.set_xlabel('Body mass (kg)', color='white')
ax2.set_ylabel('Power (W)', color='white')
ax2.set_title('The Growing Thermal Gap', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Kleiber's law predictions:")
for name, props in animals.items():
    per_kg = props['bmr'] / props['mass']
    print(f"  {name:12s}: {props['mass']:>8.1f}kg, BMR={props['bmr']:>6.0f}W, per kg={per_kg:.2f}W/kg")`,
      challenge: 'Calculate the metabolic rate of a 70-ton Argentinosaurus using Kleiber\'s law. How much food would it need daily? Is this feasible?',
      successHint: 'Kleiber\'s law connects a mouse\'s heartbeat to a whale\'s migration to an elephant\'s mud bath \u2014 all through the elegance of M^0.75. Understanding metabolic scaling is understanding the fundamental constraints of life.',
    },
    {
      title: 'Allometry \u2014 how body proportions scale with size',
      concept: `**Allometry** studies how body proportions change with overall body size. It explains why elephants don't look like scaled-up mice.

**Isometric scaling** (maintaining proportions): doubling a mouse's linear dimensions increases mass 8x (2\u00b3), but leg cross-section only 4x (2\u00b2). The legs would break.

**Allometric solution:** large animals have proportionally THICKER legs. Leg diameter scales as M^0.375 (not M^0.33 for isometric).

**Key allometric relationships:**
- Heart rate \u221d M^(-0.25) \u2014 elephant: 25 bpm, mouse: 600 bpm
- Lifespan \u221d M^(0.25) \u2014 elephant: 60-70 years, mouse: 2 years
- Brain size \u221d M^(0.75) \u2014 elephants have larger brains than predicted

**Amazing consequence:** total heartbeats in a lifetime is roughly CONSTANT across mammals \u2014 about 1 billion. Mice use theirs fast (600/min \u00d7 2 years). Elephants use theirs slowly (25/min \u00d7 70 years).`,
      analogy: 'Allometry is like why skyscrapers don\'t look like scaled-up houses. A house has thin walls because the weight is small. Double the height and you need 8x the weight on 4x the foundation. So skyscrapers have proportionally thicker columns. Nature faces the same engineering challenge.',
      storyConnection: 'The baby elephant has big ears relative to its body, stubby thick legs, and a round belly. As it grows, its proportions will shift allometrically. Its ears will grow faster than its body (for thermoregulation), its legs will thicken disproportionately (to support weight). Growing up is a journey through allometric space.',
      checkQuestion: 'An elephant\'s femur is 10 cm in diameter. If you scaled a mouse\'s femur isometrically to elephant mass, what diameter would it be?',
      checkAnswer: 'A mouse femur is ~1mm at ~20g. Isometrically to 4000 kg (200,000x heavier): linear scale = 200000^(1/3) \u2248 58.5x, diameter = 5.9 cm. Actual elephant femur: 10 cm \u2014 70% thicker. The extra thickness compensates for stress scaling: weight grows as M but bone cross-section only as M^(2/3).',
      codeIntro: 'Explore allometric scaling relationships across mammals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

mammals = {'Mouse': 0.02, 'Rat': 0.3, 'Rabbit': 2, 'Cat': 4,
           'Dog': 15, 'Human': 70, 'Horse': 500, 'Elephant': 4000, 'Blue whale': 100000}
masses = np.array(list(mammals.values()))
names = list(mammals.keys())

# 1. Heart rate scaling
ax1.set_facecolor('#111827')
heart_rates = 250 * masses**(-0.25)
m_range = np.logspace(-2, 5, 200)
ax1.plot(m_range, 250 * m_range**(-0.25), '--', color='#ef4444', alpha=0.5)
ax1.scatter(masses, heart_rates, s=80, color='#ef4444', edgecolors='white', zorder=5)
for name, m, hr in zip(names, masses, heart_rates):
    ax1.annotate(name, xy=(m, hr), xytext=(5, 5), textcoords='offset points', color='white', fontsize=7)
ax1.set_xscale('log'); ax1.set_yscale('log')
ax1.set_xlabel('Body mass (kg)', color='white')
ax1.set_ylabel('Heart rate (bpm)', color='white')
ax1.set_title('Heart Rate \u221d M\u207b\u00b0\u00b7\u00b2\u2075', color='white', fontsize=11)
ax1.tick_params(colors='gray')

# 2. Total heartbeats in lifetime (approximately constant!)
ax2.set_facecolor('#111827')
lifespan_data = {'Mouse': 2, 'Rat': 3, 'Rabbit': 9, 'Cat': 15,
                 'Dog': 12, 'Human': 80, 'Horse': 30, 'Elephant': 65, 'Blue whale': 80}
lifespans = [lifespan_data[n] for n in names]
total_beats = [hr * 60 * 24 * 365 * ls / 1e9 for hr, ls in zip(heart_rates, lifespans)]

colors_b = plt.cm.RdYlGn(np.linspace(0.2, 0.9, len(names)))
bars = ax2.bar(names, total_beats, color=colors_b)
ax2.axhline(np.mean(total_beats), color='#f59e0b', linestyle='--',
           label=f'Average: {np.mean(total_beats):.1f} billion')
ax2.set_ylabel('Total heartbeats (billions)', color='white')
ax2.set_title('~1 Billion Heartbeats Per Lifetime', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.tick_params(axis='x', rotation=35)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Allometric scaling highlights:")
print(f"  Elephant heart rate: ~{250 * 4000**(-0.25):.0f} bpm (human: ~70)")
print(f"  Total heartbeats: roughly 1 billion for ALL mammals")
print()
print("The 3/4 power law connects metabolism, heart rate, lifespan,")
print("and bone structure into a unified theory of body size in biology.")`,
      challenge: 'Plot the relationship between brain mass and body mass (brain \u221d M^0.75). Calculate the encephalization quotient (EQ = actual brain / predicted) for each animal. Which have the highest EQ?',
      successHint: 'Allometry reveals that biology is constrained by physics and geometry into predictable patterns. These scaling laws are among the most robust in all of biology.',
    },
    {
      title: 'Heat stress modeling \u2014 predicting when elephants are in danger',
      concept: `**Heat stress** occurs when cooling mechanisms can't keep up with heat gain. For elephants, this is an urgent conservation concern.

**Heat stress indices:**
- **Heat Index (HI)**: combines temperature and humidity
- **Wet Bulb Globe Temperature (WBGT)**: the gold standard, includes radiation
- At high humidity, evaporative cooling fails \u2014 the most dangerous condition

**For elephants, critical thresholds:**
- Temperature > 35\u00b0C + humidity > 60% \u2192 mild stress
- Temperature > 38\u00b0C + humidity > 70% \u2192 moderate stress
- Temperature > 40\u00b0C + humidity > 80% \u2192 severe stress
- Wet bulb temperature > 35\u00b0C \u2192 potentially lethal

**Heat balance equation:**
dT/dt = (Q_metabolism + Q_solar + Q_environment - Q_radiation - Q_convection - Q_evaporation) / (m \u00d7 c)

When the right side stays positive too long \u2192 body temperature rises \u2192 heat stroke \u2192 organ failure.`,
      analogy: 'Heat stress is like a bank account running a deficit. Income (cooling) must match expenses (heat gain). When expenses consistently exceed income, the balance (thermal margin) drops. Once it hits zero (lethal temperature), the account closes. Heat stress modeling is financial forecasting for thermal budgets.',
      storyConnection: 'In the Brahmaputra valley, Assam\'s high humidity and rising temperatures create perfect conditions for elephant heat stress. The baby elephant\'s first mud bath is not just a childhood memory \u2014 it is the first lesson in a lifelong practice that determines whether Kaziranga\'s elephants can survive summers that are getting hotter year by year.',
      checkQuestion: 'A wet bulb temperature of 35\u00b0C is lethal for humans. What is the elephant\'s threshold, and why?',
      checkAnswer: 'Elephants\' threshold is lower \u2014 probably around 33-34\u00b0C \u2014 because they can\'t sweat efficiently and rely on convective/radiative cooling, which also fails at high humidity. But their large thermal mass gives them a buffer: a 4000 kg elephant takes longer to heat up than a 70 kg human. This buys time but doesn\'t change the outcome if exposure is prolonged.',
      codeIntro: 'Build a heat stress model for elephants.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Heat stress zone map
ax1.set_facecolor('#111827')
temps = np.linspace(25, 45, 100)
humidities = np.linspace(20, 100, 100)
T, H = np.meshgrid(temps, humidities)
stress = T + 0.3 * H - 30
stress = np.clip(stress, 0, 30)

im = ax1.contourf(T, H, stress, levels=20, cmap='RdYlGn_r')
ax1.contour(T, H, stress, levels=[5, 10, 15, 20], colors='white', linewidths=[1, 1, 2, 2])
ax1.set_xlabel('Temperature (\u00b0C)', color='white')
ax1.set_ylabel('Humidity (%)', color='white')
ax1.set_title('Elephant Heat Stress Index', color='white', fontsize=11)
ax1.tick_params(colors='gray')
plt.colorbar(im, ax=ax1, label='Stress index')
ax1.text(28, 40, 'Comfortable', color='white', fontsize=9, fontweight='bold')
ax1.text(38, 75, 'Moderate', color='yellow', fontsize=9)
ax1.text(42, 85, 'SEVERE', color='red', fontsize=10, fontweight='bold')

# 2. Body temperature under different conditions
ax2.set_facecolor('#111827')
hours = np.linspace(0, 12, 720)

scenarios = {
    '35\u00b0C, low humidity': {'T_env': 35, 'RH': 40, 'color': '#22c55e'},
    '38\u00b0C, moderate': {'T_env': 38, 'RH': 60, 'color': '#f59e0b'},
    '40\u00b0C, high humidity': {'T_env': 40, 'RH': 80, 'color': '#ef4444'},
    '42\u00b0C, extreme': {'T_env': 42, 'RH': 85, 'color': '#dc2626'},
}

for name, params in scenarios.items():
    body_temp = [36.0]
    for i in range(1, len(hours)):
        dt = hours[i] - hours[i-1]
        T_env, RH = params['T_env'], params['RH']
        heat_in = 0.02 + 0.05 * max(0, T_env - body_temp[-1]) + 0.03
        cool_out = 0.08 * (1 - RH/100) + 0.02 * max(0, body_temp[-1] - 30) + 0.03 * max(0, body_temp[-1] - T_env)
        mud = 0.1 if (body_temp[-1] > 37.5 and 2 < hours[i] % 6 < 3) else 0
        new_T = body_temp[-1] + (heat_in - cool_out - mud) * dt
        body_temp.append(np.clip(new_T, 34, 44))
    ax2.plot(hours, body_temp, color=params['color'], linewidth=2, label=name)

ax2.axhline(37.5, color='#f59e0b', linestyle=':', alpha=0.5, label='Stress onset')
ax2.axhline(42, color='#ef4444', linestyle='--', linewidth=2, label='LETHAL')
ax2.set_xlabel('Hours of exposure', color='white')
ax2.set_ylabel('Body temperature (\u00b0C)', color='white')
ax2.set_title('Body Temperature Under Heat Stress', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Heat stress zones:")
print("  Comfortable: T < 33\u00b0C or low humidity")
print("  Mild stress: T > 35\u00b0C + RH > 60%")
print("  Severe: T > 40\u00b0C + RH > 80% (lethal risk)")`,
      challenge: 'Add a "wet bulb temperature" calculation and map the lethal zone onto the heat stress chart. At what T and RH combinations does wet bulb exceed 35\u00b0C?',
      successHint: 'Heat stress modeling is where biophysics meets conservation planning. The models combine Stefan-Boltzmann radiation, metabolic scaling, evaporative cooling, and climate projections into a single predictive framework.',
    },
    {
      title: 'Climate change and large mammals \u2014 the future of giants',
      concept: `Large mammals face a perfect storm of climate threats. Everything we have learned converges on one question: can the giants survive a warming world?

**Why large mammals are most vulnerable:**
1. **Low SA/V ratio**: hard to dump excess heat
2. **Low reproductive rate**: one calf every 4-5 years; populations can't bounce back
3. **Large home ranges**: need vast connected habitat
4. **High food/water needs**: 150 kg food + 200 liters water daily
5. **Slow adaptation**: long generation time = slow evolutionary response

**The extinction risk cascade:**
Higher temperatures \u2192 more heat stress \u2192 less feeding time \u2192 reduced reproduction \u2192 smaller populations \u2192 inbreeding \u2192 disease vulnerability \u2192 local extinction

**What science says we need:**
- Maintain connected habitat (corridors between parks)
- Protect water sources and thermal refugia
- Reduce emissions (the only permanent solution)
- Monitor heat stress in real time

**Hope:** Elephants survived previous warm periods (Eocene was 8\u00b0C warmer). But current warming is 10-100x faster than any previous natural event. Conservation action now can buy time for adaptation.`,
      analogy: 'Climate change for large mammals is like slowly draining water from a fish tank. The fish can survive at lower levels for a while \u2014 they adapt, find the deepest spots. But if the water keeps draining and no one refills it, eventually there isn\'t enough. The tank doesn\'t have to go dry for the fish to die \u2014 just below the minimum viable level.',
      storyConnection: 'The baby elephant\'s story ends with a return to the mud wallow \u2014 a daily ritual that has sustained herds in Kaziranga for millennia. Whether that wallow still holds water fifty years from now depends on the choices we make today. The biophysics is clear: without intervention, the mud will dry. With intervention, the baby elephant\'s grandchildren will take their own first mud baths.',
      checkQuestion: 'If warming is limited to 1.5\u00b0C instead of 3\u00b0C, what is the difference for Assam\'s elephants?',
      checkAnswer: 'At 1.5\u00b0C: ~25 heat stress days/year, manageable with habitat protection. Population stable. At 3\u00b0C: ~60+ heat stress days, calf survival drops significantly, water sources dry up seasonally. Population declines 30-50% by 2100. The 1.5\u00b0C difference is the difference between a manageable conservation challenge and potential regional extinction.',
      codeIntro: 'Synthesize everything into a comprehensive climate impact model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

years = np.arange(2025, 2101)
n_years = len(years)

scenarios = {
    'Paris 1.5\u00b0C': {'rate': 0.01, 'conserv': True, 'color': '#22c55e'},
    '2\u00b0C pathway': {'rate': 0.02, 'conserv': True, 'color': '#3b82f6'},
    '3\u00b0C (current)': {'rate': 0.035, 'conserv': False, 'color': '#f59e0b'},
    '4\u00b0C+ (worst)': {'rate': 0.05, 'conserv': False, 'color': '#ef4444'},
}

# 1. Temperature
ax = axes[0, 0]; ax.set_facecolor('#111827')
for name, p in scenarios.items():
    temp = 27 + p['rate'] * (years - 2025) + np.random.normal(0, 0.3, n_years)
    ax.plot(years, temp, color=p['color'], linewidth=2, label=name)
ax.set_xlabel('Year', color='white'); ax.set_ylabel('Mean temp (\u00b0C)', color='white')
ax.set_title('Assam Temperature Projections', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Heat stress days
ax = axes[0, 1]; ax.set_facecolor('#111827')
for name, p in scenarios.items():
    temp = 27 + p['rate'] * (years - 2025)
    stress = 20 + 5 * (temp - 27)**1.5
    if p['conserv']: stress *= 0.6
    stress += np.random.normal(0, 3, n_years)
    ax.plot(years, np.clip(stress, 0, 200), color=p['color'], linewidth=2, label=name)
ax.axhline(50, color='gray', linestyle=':', alpha=0.3)
ax.set_xlabel('Year', color='white'); ax.set_ylabel('Heat stress days', color='white')
ax.set_title('Heat Stress Days', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Population projections
ax = axes[1, 0]; ax.set_facecolor('#111827')
for name, p in scenarios.items():
    pop = 5000; pops = [pop]
    temp = 27 + p['rate'] * (years - 2025)
    for i in range(1, n_years):
        stress = 20 + 5 * (temp[i] - 27)**1.5
        if p['conserv']: stress *= 0.6
        growth = 0.02 - 0.0005 * stress + np.random.normal(0, 0.01)
        pop = max(0, pop * (1 + growth))
        if pop < 1000: pop *= 0.97
        pops.append(pop)
    ax.plot(years, pops, color=p['color'], linewidth=2, label=name)
ax.axhline(1000, color='gray', linestyle=':', alpha=0.3)
ax.set_xlabel('Year', color='white'); ax.set_ylabel('Population', color='white')
ax.set_title('Population Under Climate Scenarios', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Economics
ax = axes[1, 1]; ax.set_facecolor('#111827')
conserv_cost = np.cumsum(np.full(n_years, 50)) / 100
eco_value = np.cumsum(np.full(n_years, 200)) / 100
loss_no_act = np.cumsum(10 * (1.05 ** np.arange(n_years))) / 100

ax.plot(years, conserv_cost, color='#ef4444', linewidth=2, label='Conservation cost')
ax.plot(years, eco_value, color='#22c55e', linewidth=2, label='Ecosystem value')
ax.plot(years, loss_no_act, color='#f59e0b', linewidth=2, label='Cost of inaction')
ax.fill_between(years, conserv_cost, eco_value, alpha=0.1, color='#22c55e')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Cumulative (\u20b9 hundreds crore)', color='white')
ax.set_title('Economics: Conservation Pays for Itself', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate impact synthesis:")
print("=" * 50)
for name, p in scenarios.items():
    temp_2100 = 27 + p['rate'] * 75
    stress_2100 = 20 + 5 * (temp_2100 - 27)**1.5
    if p['conserv']: stress_2100 *= 0.6
    status = "Stable" if stress_2100 < 40 else "Declining" if stress_2100 < 80 else "Critical"
    print(f"  {name}: {temp_2100:.1f}\u00b0C, {stress_2100:.0f} stress days, {status}")
print()
print("Every fraction of a degree matters.")
print("Conservation + emissions reduction = the only viable path.")`,
      challenge: 'Add a tipping point: if population drops below 500, collapse accelerates (Allee effect + inbreeding). Which scenarios cross this threshold? How much earlier must we act to avoid it?',
      successHint: 'You have built a complete biophysics pipeline: from the Stefan-Boltzmann law governing a single elephant ear, through metabolic scaling, to heat stress modeling across populations, to climate projections spanning decades. This is how science connects a baby elephant\'s first mud bath to the fate of a species on a warming planet.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Biophysics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biophysics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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