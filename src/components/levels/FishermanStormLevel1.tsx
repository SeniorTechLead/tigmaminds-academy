import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import StormWindPressureDiagram from '../diagrams/StormWindPressureDiagram';
import StormFormationDiagram from '../diagrams/StormFormationDiagram';
import StormAnatomyDiagram from '../diagrams/StormAnatomyDiagram';
import StormCoriolisDiagram from '../diagrams/StormCoriolisDiagram';
import StormSurgeCoastDiagram from '../diagrams/StormSurgeCoastDiagram';
import StormWarningDiagram from '../diagrams/StormWarningDiagram';

export default function FishermanStormLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What causes wind — air on the move',
      concept: `In the story, the fisherman's daughter watched the sky darken and the wind rise before the cyclone hit. But what IS wind? **Wind is air moving from high pressure to low pressure.** That's it. All wind — from a gentle breeze to a 250 km/h cyclone — comes from pressure differences.

Why does pressure differ from place to place?
- The sun heats the Earth unevenly (equator gets more heat than poles)
- Warm air rises (it's less dense), creating low pressure at the surface
- Cool air sinks (it's denser), creating high pressure at the surface
- Air flows from high to low pressure to "fill the gap" — that flow is wind

The bigger the pressure difference over a given distance (the **pressure gradient**), the stronger the wind. A cyclone has an extremely steep pressure gradient between its center and its edges — that's why the winds are devastating.`,
      analogy: 'Wind works like water flowing downhill. High pressure is a hilltop, low pressure is a valley. Water (air) always flows from high to low. A gentle slope (small pressure difference) makes a lazy stream (light breeze). A cliff (steep pressure gradient) makes a waterfall (storm-force wind). The steeper the "pressure slope," the faster the air moves.',
      storyConnection: 'The fisherman\'s daughter felt the wind pick up as the cyclone approached. She was feeling the pressure gradient — the air rushing toward the cyclone\'s low-pressure center. The stronger the wind became, the closer the storm. Fishermen in the Bay of Bengal have used wind changes as storm warnings for centuries, long before weather satellites.',
      checkQuestion: 'On a hot day, you feel a cool breeze coming from the sea toward the land. Why does this happen?',
      checkAnswer: 'Land heats up faster than water (lower specific heat). Hot air over land rises, creating low pressure. Cooler, denser air over the sea flows in to replace it — that\'s the sea breeze. At night, the pattern reverses (land cools faster), creating a land breeze. This daily cycle is a miniature version of the same pressure-driven system that creates cyclones.',
      codeIntro: 'Model pressure-driven airflow and visualize a simple wind field.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a pressure field with a low-pressure center (cyclone)
x = np.linspace(-100, 100, 40)
y = np.linspace(-100, 100, 40)
X, Y = np.meshgrid(x, y)

# Low pressure center
center_x, center_y = 0, 0
pressure = 1013 - 30 * np.exp(-((X - center_x)**2 + (Y - center_y)**2) / 2000)

# Wind = negative pressure gradient (air flows from high to low)
dp_dx = np.gradient(pressure, axis=1)
dp_dy = np.gradient(pressure, axis=0)
wind_u = -dp_dx  # x-component of wind
wind_v = -dp_dy  # y-component of wind
wind_speed = np.sqrt(wind_u**2 + wind_v**2)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Pressure field
ax1.set_facecolor('#111827')
cs = ax1.contourf(X, Y, pressure, levels=20, cmap='RdYlBu_r')
ax1.contour(X, Y, pressure, levels=10, colors='white', linewidths=0.5, alpha=0.3)
plt.colorbar(cs, ax=ax1, label='Pressure (hPa)')
ax1.set_title('Pressure Field (Low Center = Storm)', color='white', fontsize=12)
ax1.set_xlabel('Distance (km)', color='white')
ax1.set_ylabel('Distance (km)', color='white')
ax1.tick_params(colors='gray')

# Wind field
ax2.set_facecolor('#111827')
speed_plot = ax2.contourf(X, Y, wind_speed, levels=15, cmap='hot_r')
plt.colorbar(speed_plot, ax=ax2, label='Wind speed (relative)')
# Wind vectors (subsample for clarity)
skip = 3
ax2.quiver(X[::skip, ::skip], Y[::skip, ::skip],
           wind_u[::skip, ::skip], wind_v[::skip, ::skip],
           color='white', alpha=0.6, scale=30)
ax2.set_title('Wind Field (arrows show direction)', color='white', fontsize=12)
ax2.set_xlabel('Distance (km)', color='white')
ax2.set_ylabel('Distance (km)', color='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key facts:")
print(f"  Background pressure: ~1013 hPa")
print(f"  Low center pressure: {pressure[20, 20]:.0f} hPa")
print(f"  Pressure drop: {1013 - pressure[20, 20]:.0f} hPa")
print(f"  Strongest wind: at the edge of the low, not the center")
print(f"  Wind direction: always from high pressure toward low pressure")`,
      challenge: 'Add a second low-pressure center at (50, 50). How do the wind patterns change? What happens when two storms are close together?',
      successHint: 'Every weather forecast in the world starts with a pressure map. Understanding that wind = pressure difference is the single most important concept in meteorology. Everything else builds on this.',
    },
    {
      title: 'How storms form — from warm water to wild wind',
      concept: `A cyclone doesn't appear from nowhere. It needs specific ingredients — like a recipe:

1. **Warm ocean water** (above 26.5°C to a depth of 50m): this is the fuel. Warm water evaporates, and water vapor carries enormous energy (latent heat)
2. **Atmospheric instability**: warm, moist air must be able to rise rapidly
3. **Low wind shear**: if upper winds are too different from surface winds, they rip the storm apart
4. **Distance from equator** (at least 5° latitude): needed for the Coriolis effect to start rotation
5. **Pre-existing disturbance**: a cluster of thunderstorms to "seed" the system

The process:
- Warm water evaporates → moist air rises → water vapor condenses into clouds → condensation releases latent heat → air rises faster → more water evaporates from the surface → positive feedback loop
- This **heat engine** converts ocean thermal energy into kinetic energy (wind)

The Bay of Bengal, where the story takes place, is one of the world's most cyclone-prone regions because its warm, shallow waters provide perfect fuel.`,
      analogy: 'A cyclone is like a bonfire. The warm ocean is the fuel (wood). Evaporation is the match. Once ignited, the fire (storm) creates its own updraft (chimney effect) that pulls in more air (oxygen), feeding itself. Wind shear is like rain on the fire — it weakens or kills it. No fuel (cold water) = no fire (no cyclone).',
      storyConnection: 'The fisherman\'s daughter knew the storm was coming because she understood the signs: unusually warm water, changing winds, building clouds. Her knowledge — passed down from generations of fisherfolk — mirrors what meteorologists now quantify. The Bay of Bengal\'s warm waters that sustain the fishing in the story are the same warm waters that fuel the cyclone that threatens it.',
      checkQuestion: 'Why do cyclones weaken rapidly when they hit land?',
      checkAnswer: 'They lose their fuel supply. Warm ocean water provides the evaporation that drives the entire system. Over land, there\'s no warm water to evaporate. Friction with the rough land surface also slows the winds. Without energy input and with increased friction, the storm dissipates within 12-24 hours. A cyclone over land is like a bonfire with no more wood — it burns out.',
      codeIntro: 'Model the sea surface temperature threshold and cyclone formation potential.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cyclone potential energy from sea surface temperature
# Genesis Potential Index (simplified)

sst = np.linspace(20, 35, 200)  # sea surface temperature (°C)
threshold = 26.5  # minimum for cyclone formation

# Energy available (proportional to (SST - threshold)^2 when SST > threshold)
energy = np.where(sst > threshold, (sst - threshold) ** 1.5, 0)
energy_normalized = energy / energy.max() * 100

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# SST vs cyclone potential
ax1.set_facecolor('#111827')
ax1.plot(sst, energy_normalized, color='#ef4444', linewidth=2)
ax1.fill_between(sst, energy_normalized, where=sst > threshold, alpha=0.2, color='#ef4444')
ax1.axvline(threshold, color='#f59e0b', linestyle='--', linewidth=2)
ax1.annotate(f'Threshold: {threshold}°C', xy=(threshold, 50), xytext=(threshold-3, 70),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.set_xlabel('Sea surface temperature (°C)', color='white')
ax1.set_ylabel('Cyclone potential (%)', color='white')
ax1.set_title('Sea Surface Temperature vs Cyclone Formation Potential', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Bay of Bengal monthly SST and cyclone frequency
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
bay_sst = [26, 27, 28, 29.5, 30, 29.5, 28.5, 28, 28.5, 29, 28.5, 27]
cyclone_freq = [0.1, 0.1, 0.1, 0.5, 1.5, 0.8, 0.3, 0.3, 0.5, 1.8, 1.5, 0.8]

ax2.set_facecolor('#111827')
ax2_twin = ax2.twinx()

bar_positions = np.arange(12)
ax2.bar(bar_positions - 0.15, bay_sst, width=0.3, color='#ef4444', alpha=0.7, label='SST (°C)')
ax2_twin.bar(bar_positions + 0.15, cyclone_freq, width=0.3, color='#3b82f6', alpha=0.7, label='Cyclone frequency')

ax2.axhline(threshold, color='#f59e0b', linestyle='--', alpha=0.7)
ax2.set_xticks(bar_positions)
ax2.set_xticklabels(months, color='white')
ax2.set_ylabel('Sea surface temperature (°C)', color='#ef4444')
ax2_twin.set_ylabel('Cyclones per month (avg)', color='#3b82f6')
ax2.set_title('Bay of Bengal: SST and Cyclone Season', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='gray')

lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Bay of Bengal cyclone seasons:")
print("  Pre-monsoon (Apr-May): warm water, low shear → cyclones")
print("  Post-monsoon (Oct-Nov): still warm, monsoon retreating → peak season")
print("  Monsoon (Jun-Sep): warm but HIGH wind shear → suppresses cyclones")
print("\\nSST alone doesn't determine cyclones — wind shear matters too.")`,
      challenge: 'Climate models project Bay of Bengal SST rising by 1-2°C by 2100. Recalculate the cyclone potential at each month with SST + 1.5°C. How much does the potential increase?',
      successHint: 'Understanding cyclone formation is literally life-saving knowledge in coastal communities. The same physics that explains why cyclones form also explains why they weaken over land and why some years have more storms than others.',
    },
    {
      title: 'Cyclone anatomy — eye, eyewall, and rainbands',
      concept: `A cyclone is not a uniform mass of wind and rain. It has a precise internal structure, each part with a specific role:

**The eye** (10-60 km diameter):
- Calm, clear, sometimes sunny
- Warmest part of the storm (sinking air warms by compression)
- Lowest pressure (the "drain" at the center)

**The eyewall** (ring of thunderstorms surrounding the eye):
- Contains the strongest winds and heaviest rain
- Where warm, moist air spirals upward most violently
- Wind speeds can exceed 250 km/h in the strongest storms

**Rainbands** (spiral arms extending outward):
- Bands of thunderstorms that spiral inward toward the center
- Can extend 300+ km from the eye
- Bring heavy rain, gusty winds, and sometimes tornadoes
- Separated by relatively calm gaps

**Outflow** (at the top, 10-15 km altitude):
- Air that has risen through the eyewall spreads outward at high altitude
- Visible as the storm's characteristic "disc" shape from space
- This outflow is what allows the storm to keep "breathing in" at the surface`,
      analogy: 'A cyclone is like a giant chimney. The eye is the hollow center. The eyewall is the chimney walls where the fire (upward air) burns hottest. Rainbands are like smoke trails spiraling into the chimney from outside. The outflow at the top is smoke spreading across the ceiling. Without the outflow "exhaust," the chimney would choke on its own smoke and the fire would die.',
      storyConnection: 'In the story, the fisherman\'s daughter survived the eye of the storm — that eerie moment of calm when the sky clears and birds fly overhead. Then the eyewall hit from the opposite direction. Many lives have been lost by people who mistake the eye for the storm\'s end and leave shelter. Understanding the eye-eyewall structure is survival knowledge.',
      checkQuestion: 'Why is the eye of a cyclone calm and clear, when it\'s surrounded by the most violent winds on Earth?',
      checkAnswer: 'The eye is a region of sinking air. As air spirals inward at the surface, the Coriolis effect prevents it from reaching the exact center — it curves around it, creating a wall of rising air (the eyewall). Inside this wall, air descends from the top. Sinking air warms (compression) and dries out, clearing the clouds. The eye is calm because the air is going DOWN, not up.',
      codeIntro: 'Model a cyclone\'s cross-section — wind speed, pressure, and temperature at different radii.',
      code: `import numpy as np

# Holland 1980 cyclone model: pressure and wind vs distance from center
r = np.linspace(1, 400, 200)  # distance in km
Pc = 940   # central pressure (hPa) — lower = stronger
Pn = 1013  # normal atmospheric pressure
Rm = 40    # radius of maximum wind (km)
B = 1.5    # shape parameter

# Pressure rises as you move away from center
pressure = Pc + (Pn - Pc) * np.exp(-(Rm / r) ** B)

# Wind peaks at the eyewall, then drops off both ways
dp_dr = (Pn-Pc) * B * (Rm**B) / (r**(B+1)) * np.exp(-(Rm/r)**B)
wind = np.sqrt(np.maximum(0, dp_dr * 100000 / 1.15)) * 3.6
wind = wind / wind.max() * 220  # scale to realistic Cat 4

# Print the anatomy
print("CYCLONE ANATOMY")
print(f"  Eye: 0-{int(Rm*0.5)} km — calm, clear, sinking air")
print(f"  Eyewall: ~{Rm} km — MAX wind {wind.max():.0f} km/h")
print(f"  Rainbands: 100-300 km — widespread rain, gusty")
print(f"  Central pressure: {Pc} hPa (drop of {Pn-Pc} hPa)")
print()

# How wind varies with distance
for dist in [10, Rm, 100, 200, 300]:
    idx = np.argmin(np.abs(r - dist))
    print(f"  At {dist:3d} km: wind={wind[idx]:5.0f} km/h  pressure={pressure[idx]:.0f} hPa")

print("\\nKey: strongest winds are NOT at the center (eye is calm).")
print("They're in the eyewall — the ring just outside the eye.")`,
      challenge: 'Change the central pressure from 940 to 970 hPa (a weaker storm). How do the wind speeds change? The pressure-wind relationship is not linear — explore why.',
      successHint: 'A cyclone\'s structure is an elegant physical machine. Understanding eye, eyewall, and rainbands is essential for interpreting satellite images, predicting storm impacts, and knowing when the danger is truly past (it\'s not over when the eye passes).',
    },
    {
      title: 'The Coriolis effect — why storms spin',
      concept: `Cyclones spin — counterclockwise in the Northern Hemisphere, clockwise in the Southern. But there's no motor doing this. The spinning comes from the **Coriolis effect**, a consequence of Earth's rotation.

The Earth rotates from west to east. Objects (including air) moving over the Earth's surface appear to curve:
- **Rightward** in the Northern Hemisphere
- **Leftward** in the Southern Hemisphere

This isn't a real force — it's a consequence of observing motion on a rotating surface. But the effect is very real for weather:
- Air rushing toward a low-pressure center doesn't reach it directly; it curves, creating a spiral
- The spiral around a Northern Hemisphere low = counterclockwise rotation
- This is how a tropical disturbance becomes a spinning cyclone

The Coriolis effect is zero at the equator and strongest at the poles. That's why cyclones NEVER form within 5° of the equator — there's not enough Coriolis effect to initiate rotation.`,
      analogy: 'Imagine rolling a ball from the rim of a spinning merry-go-round toward the center. To someone standing on the ground, the ball rolls straight. But to someone sitting ON the merry-go-round, the ball appears to curve. Earth is the merry-go-round. We\'re sitting on it. The "curving" of the wind is the Coriolis effect — it\'s our rotating perspective, not a push on the air.',
      storyConnection: 'The cyclone in the story spiraled across the Bay of Bengal — that spiral is the Coriolis effect made visible. Without Earth\'s rotation, the air would rush straight into the low-pressure center, fill it, and the storm would collapse in minutes. The Coriolis effect keeps the air spiraling, maintaining the storm for days or weeks. Earth\'s rotation is what gives cyclones their destructive longevity.',
      checkQuestion: 'If Earth suddenly stopped rotating, what would happen to all the cyclones on the planet?',
      checkAnswer: 'They would collapse within hours. Without the Coriolis effect, air would flow directly from high to low pressure in straight lines. The low-pressure centers would fill immediately. No rotation = no spiral = no sustained storm. The Coriolis effect is what prevents the pressure equalization that would kill the storm. Earth\'s rotation is literally what keeps cyclones alive.',
      codeIntro: 'Visualize the Coriolis effect on air parcels moving toward a low-pressure center.',
      code: `import numpy as np

# Simulate air parcels spiraling toward a low-pressure center
# The Coriolis parameter controls the deflection

lat = 15  # degrees (Bay of Bengal)
f = 2 * 7.29e-5 * np.sin(np.radians(lat))  # Coriolis parameter

# Without Coriolis: straight inward
# With Coriolis: deflected right (N. Hemisphere) → spiral

print("Coriolis Effect on Cyclone Spin")
print(f"Latitude: {lat}°N")
print(f"Coriolis parameter: {f:.2e} /s")
print()

# Show how deflection increases with latitude
for lat_test in [0, 5, 10, 15, 20, 30]:
    f_test = 2 * 7.29e-5 * np.sin(np.radians(lat_test))
    spin = "NO spin" if lat_test < 5 else f"{'weak' if lat_test < 10 else 'strong'} counterclockwise"
    print(f"  {lat_test:2d}°N: f = {f_test:.2e}  → {spin}")

print()
print("Key: Coriolis = 0 at equator → no cyclones there.")
print("Bay of Bengal (10-20°N) = strong enough to spin storms.")
print("Southern Hemisphere: f is negative → clockwise spin.")`,
      challenge: 'Change the Coriolis parameter to negative (Southern Hemisphere). Does the spiral reverse direction? What if you double f (higher latitude)?',
      successHint: 'The Coriolis effect is why weather exists as we know it. Without Earth\'s rotation, there would be one simple convection cell per hemisphere, no jet stream, no cyclones, and a radically different climate. This "fictitious force" shapes the entire atmosphere.',
    },
    {
      title: 'Storm surge — the sea that swallows the coast',
      concept: `Cyclone winds are deadly, but the biggest killer is often **storm surge** — a massive rise in sea level caused by the storm pushing water toward shore. Storm surge has killed more people in the Bay of Bengal than any other cyclone hazard.

How storm surge forms:
- **Wind push**: sustained onshore winds physically push water toward the coast (the dominant factor)
- **Pressure effect**: low pressure at the storm center allows the sea to "bulge" upward (~1 cm per 1 hPa drop)
- **Wave setup**: breaking waves pile water higher onshore
- **Funnel effect**: V-shaped coastlines and shallow bays amplify the surge (the Bay of Bengal is a funnel)

The 1970 Bhola cyclone in Bangladesh killed 300,000-500,000 people — mostly from storm surge. The 1999 Odisha cyclone drove a 6-meter wall of water 20 km inland. In shallow, funnel-shaped bays, storm surge can reach 10+ meters.

Warning time is critical. Even a 24-hour advance warning can save tens of thousands of lives — but only if people know what "3-meter storm surge" means and have somewhere to go.`,
      analogy: 'Storm surge is like filling a bathtub by blowing across the surface with a hair dryer. The water piles up at the far end. The stronger you blow (higher wind speed), the longer you blow (wider storm), and the shallower the tub (coastal bathymetry), the higher the water stacks. A cyclone is a 400-km-wide hair dryer blowing across a bathtub the size of the Bay of Bengal.',
      storyConnection: 'The fisherman\'s daughter in the story had to escape not just the wind but the rising water. Storm surge arrives silently and fast — it\'s not a wave you can see coming but a gradual, relentless rise that turns dry ground into ocean in minutes. The story\'s depiction of the sea swallowing the coast captures the terrifying reality of storm surge in coastal communities.',
      checkQuestion: 'Why is storm surge in the Bay of Bengal typically worse than storm surge from similar-strength hurricanes hitting, say, the US East Coast?',
      checkAnswer: 'Three reasons: (1) The Bay of Bengal is funnel-shaped — the coastline narrows toward Bangladesh, concentrating the water. (2) The continental shelf is very shallow and wide, allowing water to pile up. (3) Many areas are at or below sea level (river deltas). The same storm that produces 3m surge on a steep coast produces 6-10m surge in the Bay of Bengal funnel.',
      codeIntro: 'Model storm surge height based on wind speed, pressure drop, and coastal geometry.',
      code: `import numpy as np

# Storm surge depends on: wind speed, pressure drop, and coastal shape
# Simple empirical model: surge ≈ wind * factor / (water depth)

wind_speeds = [80, 120, 160, 200, 250]  # km/h
shelf_depth = 20  # metres (Bay of Bengal is shallow!)
funnel_factor = 1.5  # Bay of Bengal's funnel shape amplifies surge

print("STORM SURGE ESTIMATES")
print(f"Coastal shelf depth: {shelf_depth}m (shallow = worse)")
print(f"Funnel amplification: {funnel_factor}x")
print()
print(f"{'Wind (km/h)':>12} {'Surge (m)':>10} {'Danger':>10}")
print("-" * 35)

for wind in wind_speeds:
    # Simplified surge formula
    base_surge = (wind / 100) ** 2 * 2.5  # quadratic relationship
    surge = base_surge * funnel_factor * (30 / shelf_depth)  # shallow = more
    danger = "EXTREME" if surge > 5 else "HIGH" if surge > 3 else "MODERATE"
    print(f"{wind:>12} {surge:>10.1f} {danger:>10}")

print()
print("The 1970 Bhola cyclone: ~200 km/h → 10m surge → 300,000+ dead")
print("Storm surge causes 90% of cyclone deaths, not wind.")
print("Shallow + funnel-shaped Bay of Bengal = worst case.")`,
      challenge: 'If sea level rises by 0.5m due to climate change, how does that change the storm surge impact for a 4-meter surge? Consider: it\'s not just 0.5m higher — the water reaches further inland. Model the additional inundation area for a flat coastal plain.',
      successHint: 'Storm surge is the intersection of physics (wind, pressure, fluid dynamics), geography (coastal shape, depth), and human preparedness (warnings, evacuation, shelters). Understanding it saves lives — literally.',
    },
    {
      title: 'Weather warnings and safety — turning science into survival',
      concept: `All the cyclone science in the world is useless if people don't receive and act on warnings. India's cyclone warning system has improved dramatically:

**India Meteorological Department (IMD)** issues warnings in stages:
- **72 hours out**: Cyclone Watch — general area at risk
- **48 hours out**: Cyclone Warning — specific coastline, expected intensity
- **24 hours out**: Red Alert — maximum warning, evacuations begin
- **12 hours out**: Landfall bulletin — exact timing and location

**Warning categories** (color-coded):
- **Green**: no action needed
- **Yellow**: be aware
- **Orange**: be prepared
- **Red**: take action NOW

The transformation: In 1999 (Odisha super cyclone), 10,000+ died despite the storm being tracked for days — warnings didn't reach fishing villages. By 2013 (Cyclone Phailin, similar intensity), nearly 1 million people were evacuated in 48 hours, and only 45 died. The difference was not better science — it was better communication.`,
      analogy: 'A cyclone warning system is like a fire alarm system in a building. The smoke detector (satellite/radar) detects the threat. The alarm (media/sirens) alerts everyone. The evacuation plan (shelters/routes) saves lives. The best smoke detector in the world is useless if the alarm is broken or if there\'s no evacuation plan. The whole chain must work.',
      storyConnection: 'The fisherman\'s daughter in the story knew the cyclone was coming because of traditional knowledge — reading the sky, the sea, the behavior of birds. Today, this traditional knowledge is complemented by satellite data, computer models, and multi-channel warning systems. The story\'s message — that knowledge saves lives — is the founding principle of disaster preparedness.',
      checkQuestion: 'Why might a fishing community ignore a cyclone warning, even if they receive it in time?',
      checkAnswer: 'Multiple reasons: (1) "Cry wolf" effect — past warnings that didn\'t result in cyclones reduce trust. (2) Economic pressure — leaving means losing a day\'s catch. (3) Language/format — warnings in technical jargon or a different language aren\'t understood. (4) No shelter available — knowing the storm is coming doesn\'t help if there\'s nowhere to go. (5) Belief that "it won\'t hit us." Effective warnings must address ALL these barriers, not just the information gap.',
      codeIntro: 'Visualize a cyclone track forecast with uncertainty cones and warning zones.',
      code: `import numpy as np

# Cyclone track forecast with uncertainty cone
# Real forecasters update every 6 hours as the storm moves

# Simulated cyclone path (Bay of Bengal → Odisha coast)
hours = np.arange(0, 73, 6)  # 0 to 72 hours
lat = 12 + hours * 0.12 + np.random.normal(0, 0.1, len(hours)).cumsum() * 0.05
lon = 88 - hours * 0.03 + np.random.normal(0, 0.05, len(hours)).cumsum() * 0.02

# Uncertainty grows with forecast time
uncertainty_km = 30 + hours * 2.5  # ±30 km at t=0, ±210 km at t=72h

print("CYCLONE TRACK FORECAST")
print(f"{'Hour':>5} {'Lat':>7} {'Lon':>7} {'Uncertainty':>12} {'Action'}")
print("-" * 50)

for i, h in enumerate(hours):
    action = ""
    if h == 0:  action = "← Detection"
    elif h == 24: action = "← Warning issued"
    elif h == 48: action = "← Evacuation begins"
    elif h == 72: action = "← LANDFALL"
    print(f"{h:>5}h {lat[i]:>7.1f}°N {lon[i]:>6.1f}°E  ±{uncertainty_km[i]:>4.0f} km  {action}")

print()
print("At 72h: ±210 km uncertainty = warn 420 km of coast")
print("At 24h: ± 90 km uncertainty = warn 180 km of coast")
print("Better forecast = fewer false alarms = saves money + trust")`,
      challenge: 'The forecast uncertainty at 72 hours is about 200 km. At 24 hours, it\'s about 80 km. Model how much more coastline must be warned at 72 hours vs 24 hours. What\'s the economic cost of this "over-warning" (false alarms for places that don\'t get hit)?',
      successHint: 'Weather warnings are where physical science meets social science, engineering, and politics. The science of forecasting is only half the problem — the other half is making sure warnings reach people, are understood, and lead to action. This is one of the greatest success stories in disaster risk reduction.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Ocean Science & Storm Formation — no prior science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for weather simulations. Click to start.</p>
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
            diagram={[StormWindPressureDiagram, StormFormationDiagram, StormAnatomyDiagram, StormCoriolisDiagram, StormSurgeCoastDiagram, StormWarningDiagram][i] ? createElement([StormWindPressureDiagram, StormFormationDiagram, StormAnatomyDiagram, StormCoriolisDiagram, StormSurgeCoastDiagram, StormWarningDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
