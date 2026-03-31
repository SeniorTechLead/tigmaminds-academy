import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import RedSeaTideDiagram from '../diagrams/RedSeaTideDiagram';
import RedSeaWindSetdownDiagram from '../diagrams/RedSeaWindSetdownDiagram';
import RedSeaCFDDiagram from '../diagrams/RedSeaCFDDiagram';
import RedSeaCrossSectionDiagram from '../diagrams/RedSeaCrossSectionDiagram';
import BuoyancyDiagram from '../diagrams/BuoyancyDiagram';
import TidesDiagram from '../diagrams/TidesDiagram';

export default function RedSeaLevel1() {
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
      title: 'Tides 101 — the Moon pulls the ocean',
      concept: `Every day, the ocean rises and falls along every coastline on Earth. These are **tides**, and they happen because the Moon’s gravity pulls on Earth’s water.

Here is the key idea: the Moon’s gravity is stronger on the side of Earth facing it (closer = stronger pull) and weaker on the far side. This **difference** in gravitational pull stretches the ocean into two bulges — one toward the Moon, one on the opposite side. The areas between the bulges have **low tide**.

As Earth rotates, any given coastline passes through two bulges and two low points every ~24.8 hours. That gives most places **two high tides and two low tides per day**.

The Sun also creates tides, but its tidal effect is only about **46%** of the Moon’s (even though the Sun is far more massive, it is much farther away, and tidal force drops with the cube of distance: 1/r³).

In the code below, you will calculate tidal force as a function of distance and see why the Moon dominates.`,
      analogy: 'Imagine holding a rubber ball between your hands and squeezing from two opposite sides. The ball bulges out at the top and bottom — two bulges, two flat zones. The Moon does this to Earth’s oceans: squeezing the water between the facing and far sides.',
      storyConnection: 'In the Exodus narrative, the waters "parted" to create dry ground. The Gulf of Suez, where the crossing likely occurred, has a tidal range of up to 2 metres. At low tide, shallow ridges in the seabed become very close to the surface. Tides alone could reduce water depth dramatically over a submarine ridge.',
      checkQuestion: 'Why does the Moon create stronger tides than the Sun, even though the Sun is much more massive?',
      checkAnswer: 'Tidal force depends on 1/r³ (the cube of distance), not 1/r² like regular gravity. The Sun is 390 times farther than the Moon. Even though the Sun is 27 million times more massive, 390³ = 59 million, which more than cancels out the mass advantage. Result: the Moon’s tidal force is about 2.2 times the Sun’s.',
      codeIntro: 'Calculate how tidal force changes with distance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tidal force is proportional to Mass / distance^3
# Compare Moon and Sun

moon_mass = 7.35e22    # kg
moon_dist = 3.84e8     # metres
sun_mass = 1.99e30     # kg
sun_dist = 1.50e11     # metres

# Tidal force (arbitrary units, proportional to M/r^3)
moon_tidal = moon_mass / moon_dist**3
sun_tidal = sun_mass / sun_dist**3
ratio = moon_tidal / sun_tidal

print(f"Moon tidal force (relative): {moon_tidal:.4e}")
print(f"Sun tidal force (relative):  {sun_tidal:.4e}")
print(f"Moon / Sun ratio: {ratio:.2f}")
print(f"The Moon creates {ratio:.1f}x stronger tides than the Sun!")
print()

# Plot tidal force vs distance
distances = np.linspace(1, 10, 200)  # in units of Moon distance
tidal = 1 / distances**3

plt.figure(figsize=(10, 5))
plt.plot(distances, tidal, linewidth=2.5, color='#06b6d4')
plt.fill_between(distances, tidal, alpha=0.1, color='#06b6d4')
plt.axvline(1, color='silver', linewidth=1, linestyle='--', label='Moon distance')
plt.axvline(390/39, color='gold', linewidth=1, linestyle='--', label='Sun (scaled)')

plt.xlabel('Distance (multiples of Moon distance)', fontsize=11)
plt.ylabel('Tidal force (relative)', fontsize=11)
plt.title('Tidal Force Drops with 1/r³ — Distance Matters More Than Mass', fontsize=13)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print("The 1/r³ curve drops STEEPLY — even a small increase")
print("in distance dramatically reduces the tidal pull.")`,
      challenge: 'Jupiter is the most massive planet. Calculate its tidal effect on Earth compared to the Moon’s. (Jupiter mass: 1.9 × 10²⁷ kg, distance: 6.3 × 10¹¹ m). Is Jupiter’s tidal force on Earth significant?',
      successHint: 'The 1/r³ relationship is the key insight. It explains why the Moon — a relatively small body — dominates Earth’s tides. Distance matters far more than mass for tidal forces.',
    },
    {
      title: 'Spring tides and neap tides — Sun + Moon alignment',
      concept: `The Moon and Sun both create tidal bulges. When they **align** (new moon or full moon), their tidal forces add together, producing **spring tides** — extra-high highs and extra-low lows.

When they are at right angles (first or third quarter moon), the tidal forces partially cancel, producing **neap tides** — moderate highs and moderate lows.

Spring tides are about **20% higher** than average, and neap tides about 20% lower. In a place like the Gulf of Suez, where the tidal range is already ~2 metres, a spring low tide could lower water by an extra 30–40 cm — significant over a shallow ridge.

The code simulates a full month of tides by combining the Moon’s and Sun’s tidal cycles. You will see the classic pattern: big swings at new/full moon, small swings at quarter moons.

📚 *This is real tidal prediction — harbors use exactly this kind of model to plan ship movements.*`,
      analogy: 'Imagine two people pushing a swing. When they push at the same time (aligned — spring tide), the swing goes extra high. When one pushes forward while the other pushes backward (90° apart — neap tide), the swing barely moves. The Moon and Sun are the two people pushing Earth’s ocean "swing."',
      storyConnection: 'If the Exodus crossing happened during a spring tide at low water, the already-shallow ridge would have been even closer to the surface. Combined with wind effects, the water level drop could have been enough to expose the ridge completely — creating "dry ground" as the text describes.',
      checkQuestion: 'There are approximately 2 spring tides per month. Why not just 1?',
      checkAnswer: 'Spring tides occur when the Sun and Moon are aligned. This happens at BOTH new moon (Sun and Moon on the same side of Earth) AND full moon (Sun and Moon on opposite sides). Both arrangements produce aligned tidal bulges. So spring tides come every ~14.8 days, twice per lunar month.',
      codeIntro: 'Model a month of tides by combining Moon and Sun contributions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate 30 days of tides
hours = np.linspace(0, 30 * 24, 2000)
days = hours / 24

# Moon tide: period = 12.42 hours (semi-diurnal)
moon_period = 12.42
moon_amplitude = 1.0  # metres (dominant)

# Sun tide: period = 12.0 hours
sun_period = 12.0
sun_amplitude = 0.46  # 46% of Moon (known ratio)

# Moon phase cycle: 29.53 days
# At day 0 = new moon (spring), day 7.4 = first quarter (neap)
# day 14.8 = full moon (spring), day 22.1 = third quarter (neap)
moon_tide = moon_amplitude * np.cos(2 * np.pi * hours / moon_period)
sun_tide = sun_amplitude * np.cos(2 * np.pi * hours / sun_period)
total_tide = moon_tide + sun_tide

# Plot
plt.figure(figsize=(12, 5))
plt.plot(days, total_tide, linewidth=1.5, color='#06b6d4', label='Combined tide')
plt.fill_between(days, total_tide, alpha=0.1, color='#06b6d4')

# Mark spring and neap
for d, label, color in [(0, 'Spring\\n(new moon)', 'gold'),
                         (7.4, 'Neap\\n(1st quarter)', 'silver'),
                         (14.8, 'Spring\\n(full moon)', 'gold'),
                         (22.1, 'Neap\\n(3rd quarter)', 'silver')]:
    plt.axvline(d, color=color, linewidth=1, linestyle='--', alpha=0.7)
    plt.text(d + 0.3, 1.3, label, fontsize=8, color=color)

plt.xlabel('Days', fontsize=11)
plt.ylabel('Tide height (metres)', fontsize=11)
plt.title('One Month of Tides — Spring and Neap Cycles', fontsize=13)
plt.legend(fontsize=10, loc='lower right')
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print("Spring tides (gold lines): Moon + Sun aligned → BIG swings")
print("Neap tides (silver lines): Moon + Sun at 90° → small swings")
print()
print("At spring LOW tide in the Gulf of Suez, the water over")
print("the underwater ridge drops to its absolute minimum.")`,
      challenge: 'Extract the maximum and minimum tide heights during a spring tide vs a neap tide. How many centimetres difference is there between the spring-low and neap-low? This matters for the "crossing" scenario.',
      successHint: 'Real tidal prediction adds many more cycles (lunar distance variation, atmospheric pressure, etc.), but this two-component model captures the main pattern. The spring/neap cycle repeats every 14.8 days, as regular as clockwork.',
    },
    {
      title: 'Wind setdown — the wind pushes water aside',
      concept: `Tides alone may not be enough to expose a seabed ridge. But there is another powerful force: **wind**.

When a strong, sustained wind blows across shallow water, it physically pushes the surface water downwind. This lowers the water level on the **upwind side** — a phenomenon called **wind setdown** (the opposite of storm surge, which raises water on the downwind coast).

In 2010, researchers Carl Drews and Weiqing Han at the National Center for Atmospheric Research (NCAR) used computer simulations to show that a **63 mph (101 km/h) east wind** blowing for about **12 hours** across a shallow lagoon in the Gulf of Suez could lower the water by **1.5–2 metres** — enough to expose a submarine ridge and create a temporary land bridge 3–4 km wide.

When the wind stops, the water rushes back in about 30 minutes. The timing is critical.

The code models the relationship between wind speed and water level drop.`,
      analogy: 'Blow across the surface of your tea. Watch the liquid push to the far side of the cup and dip on the near side. Now imagine doing this across kilometres of shallow water with hurricane-force wind. The physics is identical — just scaled up enormously.',
      storyConnection: 'Exodus 14:21 describes "a strong east wind all that night" that "drove the sea back." The NCAR study tested exactly this scenario: an east wind over the precise geography of the northern Gulf of Suez. The physics works. The story’s detail about wind direction and duration matches what fluid dynamics predicts would expose the seabed.',
      checkQuestion: 'Why does wind setdown work better over shallow water than deep water?',
      checkAnswer: 'Wind stress acts on the surface. In deep water, the pushed surface water is replaced by water moving in from below (circulation), so the level barely changes. In shallow water (1–3 metres), there is not enough depth for this replacement flow. The wind literally shoves the entire water column sideways, exposing the bottom. Shallow water amplifies the effect dramatically.',
      codeIntro: 'Model water level drop as a function of wind speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wind setdown formula (simplified):
# Delta_h = (wind_stress * fetch) / (g * depth)
# wind_stress ~ air_density * drag_coeff * wind_speed^2

rho_air = 1.225       # kg/m^3
C_d = 1.5e-3          # drag coefficient (typical over water)
g = 9.81              # m/s^2
depth = 2.0           # metres (shallow ridge area)
fetch = 50000         # metres (50 km — distance wind acts over)

# Range of wind speeds
wind_speeds_ms = np.linspace(0, 35, 200)  # m/s (0 to ~78 mph)
wind_speeds_mph = wind_speeds_ms * 2.237

# Calculate setdown (water level drop)
wind_stress = rho_air * C_d * wind_speeds_ms**2
delta_h = wind_stress * fetch / (g * depth)

# Mark key points
target_wind = 28.2  # m/s = 63 mph
target_drop = rho_air * C_d * target_wind**2 * fetch / (g * depth)

plt.figure(figsize=(10, 5))
plt.plot(wind_speeds_mph, delta_h, linewidth=2.5, color='#f97316')
plt.fill_between(wind_speeds_mph, delta_h, alpha=0.1, color='#f97316')

plt.axhline(depth, color='#3b82f6', linewidth=1.5, linestyle='--',
            label=f'Ridge depth ({depth} m)')
plt.axvline(63, color='silver', linewidth=1, linestyle=':')
plt.plot(63, target_drop, 'o', color='red', markersize=8)
plt.annotate(f'63 mph wind\\nΔh = {target_drop:.1f} m',
             xy=(63, target_drop), xytext=(40, target_drop + 0.3),
             fontsize=10, color='white',
             arrowprops=dict(arrowstyle='->', color='white'))

plt.xlabel('Wind speed (mph)', fontsize=11)
plt.ylabel('Water level drop (metres)', fontsize=11)
plt.title('Wind Setdown: How Much Does the Water Drop?', fontsize=13)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print(f"At 63 mph wind over {fetch/1000:.0f} km fetch, {depth} m depth:")
print(f"  Water drops by {target_drop:.1f} metres")
print(f"  Ridge needs {depth:.1f} m drop to be exposed")
print(f"  Combined with spring low tide (-0.3 m): total drop = {target_drop + 0.3:.1f} m")
print()
print("The Exodus account says the wind blew 'all night' (~12 hours).")
print("The NCAR simulation confirms: 12 hours is enough time.")`,
      challenge: 'Change depth to 4 metres (a deeper part of the sea). How does the wind setdown change? This shows why the crossing had to be at the shallowest point — the ridge.',
      successHint: 'Wind setdown scales with wind speed squared (double the wind = 4x the drop) and inversely with depth. This is why it only works dramatically over shallow water. The Gulf of Suez’s unique geography — a shallow ridge in an elongated bay — makes it one of the few places on Earth where this could happen naturally.',
    },
    {
      title: 'The return — what happens when wind stops',
      concept: `When the wind stops, the displaced water rushes back. This is not a gentle return — it is violent and fast.

The water that was pushed to the sides is now sitting **above equilibrium level** on the downwind side. Gravity pulls it back toward the gap. The returning flow is essentially a **gravity wave** — a wall of water moving at speed:

**c = √(g × h)**

where g = 9.81 m/s² and h is the water depth. For 2-metre-deep water, c ≈ 4.4 m/s ≈ 16 km/h. A 3–4 km wide opening would be flooded in about **15–20 minutes**.

This matches the Exodus narrative remarkably well: the text describes the waters "returning" and engulfing the pursuing army. The physics of gravity waves explains both the timing and the violence of the return.

The code calculates wave speed and flooding time for different water depths.`,
      analogy: 'Fill a bathtub and hold a book upright in the middle, splitting the water into two halves. Now quickly remove the book. The water from both sides crashes into the middle. The deeper the water, the faster the crash. This is exactly what happens when wind stops over the exposed ridge — the "book" (wind force) is removed, and gravity takes over.',
      storyConnection: 'Exodus 14:27–28 says "the sea returned to its normal course" and the water "covered the chariots and the horsemen." A wall of water rushing back at 4+ m/s (faster than a person can run) across a 3 km opening would be exactly as devastating as described.',
      checkQuestion: 'If the water is 5 metres deep instead of 2, how much faster does the return wave travel?',
      checkAnswer: 'c = √(g × h). For h=2m: c = √(9.81×2) = 4.4 m/s. For h=5m: c = √(9.81×5) = 7.0 m/s. That is 60% faster. Deeper water means faster gravity waves. This is also why tsunamis travel at jet-plane speeds in the deep ocean (√(9.81×4000) = 198 m/s = 713 km/h) but slow to walking speed near shore.',
      codeIntro: 'Calculate the speed of the returning water and how fast the gap floods.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.81  # m/s^2

# Gravity wave speed for different water depths
depths = np.linspace(0.5, 10, 200)
wave_speed = np.sqrt(g * depths)

# Flooding time for a 3.5 km gap
gap_width = 3500  # metres
flood_time_minutes = (gap_width / 2) / wave_speed / 60  # water from both sides

plt.figure(figsize=(10, 5))
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Wave speed
ax1.plot(depths, wave_speed, linewidth=2.5, color='#3b82f6')
ax1.fill_between(depths, wave_speed, alpha=0.1, color='#3b82f6')
ax1.axvline(2, color='silver', linewidth=1, linestyle=':', alpha=0.7)
ax1.set_xlabel('Water depth (m)', fontsize=11)
ax1.set_ylabel('Wave speed (m/s)', fontsize=11)
ax1.set_title('Gravity Wave Speed: c = √(g×h)', fontsize=13)
ax1.grid(alpha=0.3)

# Flooding time
ax2.plot(depths, flood_time_minutes, linewidth=2.5, color='#ef4444')
ax2.fill_between(depths, flood_time_minutes, alpha=0.1, color='#ef4444')
ax2.axvline(2, color='silver', linewidth=1, linestyle=':', alpha=0.7)
ax2.axhline(flood_time_minutes[np.argmin(np.abs(depths - 2))], color='silver',
            linewidth=1, linestyle=':', alpha=0.5)
ax2.set_xlabel('Water depth (m)', fontsize=11)
ax2.set_ylabel('Time to flood gap (minutes)', fontsize=11)
ax2.set_title(f'Flooding Time for {gap_width/1000:.1f} km Gap', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

h = 2.0
c = np.sqrt(g * h)
t = (gap_width / 2) / c / 60
print(f"At depth {h} m:")
print(f"  Wave speed: {c:.1f} m/s ({c*3.6:.1f} km/h)")
print(f"  Time to flood {gap_width/1000:.1f} km gap: {t:.0f} minutes")
print(f"  Running speed of a human: ~3 m/s")
print(f"  The water returns FASTER than you can run in deep areas!")
print()
print("This is why the return was so dangerous.")
print("Once the wind stopped, there were only ~15 minutes to escape.")`,
      challenge: 'A tsunami in the deep ocean (depth 4000 m) travels at what speed? Calculate c = √(g×4000). Compare to a commercial airplane speed (~250 m/s). This is why deep-ocean tsunamis arrive so fast.',
      successHint: 'The equation c = √(g×h) is one of the most important in fluid dynamics. It governs tides, tsunamis, storm surges, and canal waves. You will use it repeatedly in the higher levels.',
    },
    {
      title: 'Pressure and depth — the underwater world',
      concept: `Why does water depth matter so much? Because water is **heavy**. Every metre of water above you adds pressure.

The formula is simple: **P = ρ × g × h**

where ρ (rho) is water density (1025 kg/m³ for seawater), g is gravity (9.81 m/s²), and h is depth in metres.

At the surface: atmospheric pressure = 101,325 Pa (1 atmosphere).
At 10 metres depth: pressure doubles to ~2 atmospheres.
At 100 metres: ~11 atmospheres.

For the Red Sea crossing, the ridge was only ~2 metres deep — meaning the water pressure was modest (about 1.2 atmospheres total). But the deeper channels on either side (10+ metres) had significant pressure that would constrain any crossing to the ridge itself.

Understanding pressure vs depth is fundamental to all fluid dynamics, from designing submarines to understanding why your ears hurt when diving.`,
      analogy: 'Stack books on your head. One book is barely noticeable. Five books are heavy. Twenty books would flatten you. Water works the same way: every additional metre of water is another "book" of weight pressing down on everything below.',
      storyConnection: 'The Gulf of Suez has a cross-section like a valley: deep channels (10 m) on either side of a shallow ridge (2 m). Even with wind setdown exposing the ridge, the deep channels would remain filled. The crossing path was constrained by pressure and depth to the narrowest, shallowest line — the ridge itself.',
      checkQuestion: 'Submarines can typically dive to 300 metres. What pressure do they experience? Express it in atmospheres.',
      checkAnswer: 'P = ρgh = 1025 × 9.81 × 300 = 3,016,575 Pa. Divide by 101,325 Pa/atm = 29.8 atm. Add 1 atm for the atmosphere above: ~30.8 atmospheres total. The submarine hull must withstand 30 times normal air pressure. This is why submarines are cylindrical — cylinders distribute pressure evenly.',
      codeIntro: 'Plot pressure vs depth for the Red Sea and mark the ridge and channels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Seawater properties
rho = 1025  # kg/m^3 (seawater is denser than freshwater)
g = 9.81    # m/s^2
P_atm = 101325  # Pa (atmospheric pressure)

# Depths from 0 to 20 metres
depths = np.linspace(0, 20, 200)

# Pressure at each depth (total = atmospheric + water column)
P_water = rho * g * depths
P_total = P_atm + P_water
P_atm_units = P_total / P_atm  # in atmospheres

plt.figure(figsize=(10, 5))
plt.plot(depths, P_atm_units, linewidth=2.5, color='#3b82f6')
plt.fill_between(depths, P_atm_units, 1, alpha=0.1, color='#3b82f6')

# Mark key depths
plt.axvline(2, color='#fbbf24', linewidth=2, linestyle='--', label='Ridge depth (2 m)')
plt.axvline(10, color='#ef4444', linewidth=2, linestyle='--', label='Channel depth (10 m)')

plt.annotate(f'Ridge: {1 + rho*g*2/P_atm:.2f} atm', xy=(2, 1 + rho*g*2/P_atm),
             xytext=(4, 1.1), fontsize=10, color='#fbbf24',
             arrowprops=dict(arrowstyle='->', color='#fbbf24'))
plt.annotate(f'Channel: {1 + rho*g*10/P_atm:.2f} atm', xy=(10, 1 + rho*g*10/P_atm),
             xytext=(12, 1.7), fontsize=10, color='#ef4444',
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.xlabel('Depth (metres)', fontsize=11)
plt.ylabel('Pressure (atmospheres)', fontsize=11)
plt.title('Pressure vs Depth in the Red Sea', fontsize=13)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print(f"At the ridge (2 m): {1 + rho*g*2/P_atm:.2f} atmospheres")
print(f"At the channel (10 m): {1 + rho*g*10/P_atm:.2f} atmospheres")
print(f"Difference: {rho*g*8/P_atm:.2f} extra atmospheres")
print()
print("The ridge is shallow enough for wind to push water away.")
print("The channels are too deep — wind can't expose their floors.")`,
      challenge: 'The deepest point in the ocean is the Mariana Trench at 10,994 metres. Calculate the pressure there in atmospheres. How many times greater is this than at the Red Sea ridge?',
      successHint: 'P = ρgh is beautifully simple and universally applicable. You have now used three fundamental fluid dynamics equations: tidal force (1/r³), wave speed (√(gh)), and hydrostatic pressure (ρgh). These form the foundation for everything in Levels 2–4.',
    },
    {
      title: 'Putting it all together — could it really happen?',
      concept: `Let’s combine every factor we have studied and ask the scientific question: **could natural forces expose a seabed ridge in the Gulf of Suez?**

The answer, supported by the 2010 NCAR study, is **yes — under the right combination of conditions**:

1. **Spring low tide**: reduces water over the ridge by ~30–40 cm
2. **Strong east wind (63 mph, 12 hours)**: reduces water by ~1.5–2 m
3. **Shallow ridge (~2 m deep)**: the combined effect exposes the seabed

Total water removal needed: ~2 metres. Total removal from tide + wind: ~2 metres. It works.

The exposed path would be 3–4 km wide and last about 4 hours. When the wind dies, water returns in ~15–20 minutes.

This doesn’t prove the Exodus happened as described — it proves that the **physics is plausible**. Whether you see this as miracle, coincidence, or storytelling, the fluid dynamics is real.

The code simulates the full timeline: tide + wind setdown over 24 hours.`,
      analogy: 'Think of draining a bathtub with the plug slightly open (tide pulling water away) while someone blows across the surface (wind pushing water aside). Neither alone empties the tub, but together they expose the raised ridge in the middle. Timing and alignment matter.',
      storyConnection: 'The Exodus narrative describes a specific sequence: wind blows all night, water divides, people cross, wind stops, water returns. Every element of this sequence has a fluid dynamics explanation. The story encodes — whether by design or observation — a physically accurate description of wind setdown over a tidal flat.',
      checkQuestion: 'The NCAR study says the path lasts ~4 hours. How does this constrain the number of people who could cross?',
      checkAnswer: 'A 3.5 km crossing at walking speed (~5 km/h) takes ~42 minutes per person. With a 3 km wide path, people walking side by side (1 m spacing) in rows (2 m spacing) could fit ~1500 people per row, with rows taking ~42 minutes to cross. Over 4 hours, ~5–6 batches = 7,500–9,000 people maximum. This is an order-of-magnitude estimate — real conditions would vary.',
      codeIntro: 'Simulate the full 24-hour timeline of tide + wind setdown.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 24, 500)

# Tide component (spring low tide at hour 6)
tide_period = 12.42
tide_amplitude = 0.35  # spring tide extra drop
tide = -tide_amplitude * np.cos(2 * np.pi * (hours - 6) / tide_period)

# Wind setdown (wind starts at hour 2, peaks at hour 10, stops at hour 14)
wind_effect = np.zeros_like(hours)
for i, h in enumerate(hours):
    if 2 < h < 14:
        # Wind builds over ~8 hours, holds, then drops
        if h < 10:
            wind_effect[i] = -1.5 * ((h - 2) / 8) ** 2  # ramp up
        else:
            wind_effect[i] = -1.5  # sustained
    elif 14 <= h < 14.5:
        wind_effect[i] = -1.5 * (1 - (h - 14) / 0.5)  # rapid return

# Total water level over ridge
ridge_depth = 2.0  # metres below sea level
water_level = ridge_depth + tide + wind_effect

plt.figure(figsize=(12, 6))
plt.plot(hours, tide, '--', linewidth=1.5, color='#06b6d4', alpha=0.7, label='Tide only')
plt.plot(hours, wind_effect, '--', linewidth=1.5, color='#f97316', alpha=0.7, label='Wind setdown only')
plt.plot(hours, water_level, linewidth=3, color='#3b82f6', label='Total water level over ridge')
plt.fill_between(hours, water_level, 0, where=(water_level <= 0),
                 color='#fbbf24', alpha=0.3, label='Ridge EXPOSED')
plt.axhline(0, color='#fbbf24', linewidth=2, linestyle='-', alpha=0.8)

plt.xlabel('Time (hours)', fontsize=11)
plt.ylabel('Water level over ridge (metres)', fontsize=11)
plt.title('The Crossing Timeline — Tide + Wind Combined', fontsize=14)
plt.legend(fontsize=9, loc='upper right')
plt.grid(alpha=0.3)

# Annotate crossing window
exposed = hours[water_level <= 0]
if len(exposed) > 0:
    t_start, t_end = exposed[0], exposed[-1]
    plt.annotate(f'Crossing window: {t_end - t_start:.1f} hours',
                 xy=((t_start + t_end)/2, -0.2), fontsize=11, color='#fbbf24',
                 ha='center', fontweight='bold')

plt.tight_layout()
plt.show()

if len(exposed) > 0:
    print(f"Ridge exposed from hour {t_start:.1f} to {t_end:.1f}")
    print(f"Crossing window: {t_end - t_start:.1f} hours")
else:
    print("Ridge not fully exposed in this scenario")
print()
print("Wind stops at hour 14 → water returns in ~15-20 minutes")
print("Anyone still on the ridge after hour 14.5 would be underwater.")`,
      challenge: 'Change ridge_depth to 3.0 (a deeper ridge). Does the crossing still work? What about with stronger wind (-2.0 instead of -1.5)? Find the minimum wind speed needed to expose a 3-metre ridge.',
      successHint: 'You have now built a complete fluid dynamics model of a historical event using real physics: tidal forces, wind stress, gravity waves, and hydrostatic pressure. This is exactly how oceanographers and climate scientists work — combining known equations to model complex natural phenomena.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Tidal physics and wind-driven flow</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for fluid dynamics simulations. Click to start.</p>
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
            diagram={[RedSeaTideDiagram, TidesDiagram, RedSeaWindSetdownDiagram, BuoyancyDiagram, RedSeaCrossSectionDiagram, RedSeaCFDDiagram][i] ? createElement([RedSeaTideDiagram, TidesDiagram, RedSeaWindSetdownDiagram, BuoyancyDiagram, RedSeaCrossSectionDiagram, RedSeaCFDDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
