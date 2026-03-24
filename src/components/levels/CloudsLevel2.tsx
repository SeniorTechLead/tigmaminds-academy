import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CloudsLevel2() {
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
      title: 'Weather data — temperature, humidity, and pressure logging',
      concept: `In Level 1, the Khasi boy read the sky with his eyes. Now we go deeper: measuring the atmosphere with instruments and analysing the numbers. Modern meteorology is built on three key measurements taken continuously at thousands of stations worldwide:

**Temperature** is measured with a thermometer, usually shielded from direct sunlight in a Stevenson screen (a white, ventilated box). Temperature tells you the energy state of the air. We record it every hour, then calculate daily min, max, mean, and range.

**Humidity** describes how much water vapor the air holds. **Relative humidity** (RH) is the percentage of maximum vapor the air can hold at its current temperature. At 100% RH, the air is saturated and fog or clouds form. RH changes with temperature: warm air can hold more vapor, so heating air lowers its RH even if the actual moisture doesn't change. The **dew point** is the temperature at which the current moisture would saturate the air — it's a more stable measure than RH.

**Barometric pressure** is the weight of the atmosphere above you, measured in hectopascals (hPa) or millibars (same unit). Standard sea-level pressure is 1013.25 hPa. Falling pressure signals approaching storms; rising pressure means clearing skies. The rate of change matters as much as the absolute value.

Data analysis transforms raw numbers into understanding: trends, correlations, anomalies. A weather station recording every 15 minutes generates 35,000 data points per variable per year. Making sense of that data is what separates weather science from weather folklore.`,
      analogy: 'A weather station is like a medical check-up for the atmosphere. Temperature is its body temperature, humidity is its hydration level, and pressure is its blood pressure. Just as doctors look for trends (is the fever rising or falling?), meteorologists look for trends in weather data to diagnose what the atmosphere is doing and predict what it will do next.',
      storyConnection: 'The Khasi boy could feel the humidity rise and the pressure drop before a storm — his body was a crude weather station. But instruments are far more precise. If the boy had a barometer, he could have quantified what he felt: "Pressure dropped 5 hPa in the last hour — heavy rain within 2 hours." Data turns intuition into science.',
      checkQuestion: 'On a hot day (35°C, 40% RH), the air feels dry. On a cool evening (20°C, 90% RH), the air feels damp. But which actually has more water vapor?',
      checkAnswer: 'The hot day! At 35°C, the air can hold about 39 g/m³ of water. At 40% RH, it actually holds about 15.6 g/m³. At 20°C, the air can hold about 17 g/m³. At 90% RH, it holds about 15.3 g/m³. The hot day has slightly more absolute moisture — but it feels dry because the air could hold so much more. RH measures comfort, not total moisture.',
      codeIntro: 'Generate and analyse a week of simulated weather station data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 7 days of weather data (readings every 15 minutes)
hours = np.arange(0, 168, 0.25)  # 7 days in 15-min steps
n = len(hours)

# Temperature: daily cycle + trend + noise
day_cycle = 8 * np.sin(2 * np.pi * (hours - 6) / 24)  # peak at noon
trend = -0.02 * hours  # slight cooling trend (front approaching)
temp = 25 + day_cycle + trend + np.random.normal(0, 1, n)

# Pressure: slow decline (approaching low-pressure system)
pressure = 1013 - 0.05 * hours + 2 * np.sin(2 * np.pi * hours / 24) + np.random.normal(0, 0.5, n)

# Humidity: inversely related to temperature + increasing with front
humidity = 60 - 0.8 * day_cycle + 0.08 * hours + np.random.normal(0, 3, n)
humidity = np.clip(humidity, 20, 100)

fig, axes = plt.subplots(3, 1, figsize=(14, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Temperature
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(hours, temp, color='#ef4444', linewidth=0.8, alpha=0.6)
# Daily min/max
for day in range(7):
    mask = (hours >= day*24) & (hours < (day+1)*24)
    day_temps = temp[mask]
    day_hours = hours[mask]
    ax.plot(day_hours[np.argmax(day_temps)], np.max(day_temps), 'v', color='#f59e0b', markersize=6)
    ax.plot(day_hours[np.argmin(day_temps)], np.min(day_temps), '^', color='#3b82f6', markersize=6)
ax.set_ylabel('Temp (°C)', color='white')
ax.set_title('7-Day Weather Station Data (15-min intervals)', color='white', fontsize=13)
ax.tick_params(colors='gray')
ax.legend(['Temperature', 'Daily max', 'Daily min'], facecolor='#1f2937', labelcolor='white', fontsize=8)

# Pressure
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(hours, pressure, color='#3b82f6', linewidth=1)
ax.axhline(1013.25, color='gray', linewidth=0.5, linestyle='--')
ax.set_ylabel('Pressure (hPa)', color='white')
ax.tick_params(colors='gray')
ax.text(2, 1013.5, 'Standard: 1013.25 hPa', color='gray', fontsize=8)

# Humidity
ax = axes[2]
ax.set_facecolor('#111827')
ax.plot(hours, humidity, color='#22c55e', linewidth=1)
ax.axhline(100, color='#ef4444', linewidth=0.5, linestyle='--')
ax.set_ylabel('Humidity (%)', color='white')
ax.set_xlabel('Hour', color='white')
ax.tick_params(colors='gray')
ax.text(2, 98, 'Saturation (100%)', color='#ef4444', fontsize=8)

# Day labels
for day in range(7):
    for a in axes:
        a.axvline(day * 24, color='gray', linewidth=0.3, alpha=0.5)
    axes[2].text(day * 24 + 12, 25, f'Day {day+1}', color='gray', fontsize=8, ha='center')

plt.tight_layout()
plt.show()

# Statistics
print("7-day weather summary:")
print(f"  Temperature: min={temp.min():.1f}°C, max={temp.max():.1f}°C, mean={temp.mean():.1f}°C")
print(f"  Pressure: min={pressure.min():.1f}, max={pressure.max():.1f}, trend={'falling' if pressure[-1] < pressure[0] else 'rising'}")
print(f"  Humidity: mean={humidity.mean():.0f}%, peak={humidity.max():.0f}%")
print(f"\\nPressure dropped {pressure[0]-pressure[-1]:.1f} hPa over 7 days → low pressure system approaching")
print(f"Humidity increased from ~{humidity[:96].mean():.0f}% to ~{humidity[-96:].mean():.0f}% → moisture building → rain likely")`,
      challenge: 'Calculate the correlation between temperature and humidity (use np.corrcoef). Is it positive or negative? Why does that make physical sense?',
      successHint: 'Weather data analysis is the bridge between observation and prediction. Every weather forecast starts with thousands of stations logging these three variables — and algorithms finding patterns in the data that human eyes would miss.',
    },
    {
      title: 'Heat transfer — conduction, convection, radiation',
      concept: `All weather is ultimately driven by heat moving from one place to another. There are exactly three ways heat can transfer, and understanding them explains nearly every weather phenomenon:

**Conduction**: heat moves through direct contact. Touch a hot pan and you feel heat conducted into your hand. In weather, the ground heats the air directly above it by conduction. This is why the air right above a hot road shimmers — that thin layer of air is heated by contact. Conduction is slow and only works over short distances in air (air is a poor conductor).

**Convection**: heat moves by the physical movement of a fluid (liquid or gas). Hot air near the ground becomes less dense, rises, and is replaced by cooler air. This creates convection currents — the engine of weather. Cumulus clouds are visible evidence of convection: each puffy column is a rising thermal. The entire troposphere is mixed by convection, which is why it's called the troposphere (from Greek "tropos" = turning).

**Radiation**: heat moves as electromagnetic waves. The sun radiates energy across 150 million km of vacuum. The Earth absorbs this energy and re-radiates it as infrared (longer wavelength). Greenhouse gases trap some of this infrared radiation, warming the atmosphere. On clear nights, the ground radiates heat into space, causing rapid cooling (frost). On cloudy nights, clouds act like a blanket, reflecting infrared back down.

In weather, all three operate simultaneously. The sun radiates energy to the ground; the ground conducts heat to the air; convection carries the heated air upward, forming clouds and driving wind.`,
      analogy: 'Think of a bonfire. You feel warmth on your face from across the clearing — that\'s radiation (heat traveling as light waves). If you hold a metal stick in the fire, the handle gets hot — that\'s conduction (heat traveling through material). Smoke and hot air swirl upward — that\'s convection (heat traveling via moving fluid). Weather uses the same three mechanisms, just on a planetary scale.',
      storyConnection: 'The Khasi boy understood convection instinctively. He saw mist rise from warm river valleys in the morning (convection carrying moisture upward). He felt the ground warm his bare feet on a sunny day (conduction from solar-heated earth). He watched the sun set behind the hills and felt the rapid cooling (radiation escaping to space). Three mechanisms, one seamless experience.',
      checkQuestion: 'Why do valleys often have frost on clear, calm nights, even when hilltops don\'t?',
      checkAnswer: 'Cold air is denser than warm air, so it flows downhill and pools in valleys — this is called cold air drainage or katabatic flow. On clear nights, the ground radiates heat to space rapidly (no cloud blanket). The coldest, densest air at ground level slides down the slopes and collects in the valley bottom. Hilltops, meanwhile, are exposed to mixing winds that prevent such extreme cooling. This is why frost forms in valleys first.',
      codeIntro: 'Simulate convection: model how a heated ground surface drives air circulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 2D convection simulation (simplified)
# Grid: 50 x 30 (width x height)
nx, ny = 50, 30
temp = np.ones((ny, nx)) * 15.0  # initial temp 15°C everywhere

# Ground temperatures: hot spot in center (sun-heated clearing)
ground_temp = np.ones(nx) * 20
ground_temp[15:35] = 40  # hot clearing in the middle
ground_temp[:10] = 18    # shaded forest on left
ground_temp[40:] = 18    # shaded forest on right

# Simulate 200 time steps of heat diffusion + convection
dt = 0.3
diffusion = 0.15
buoyancy = 0.05

for step in range(200):
    # Ground heating (conduction from surface)
    temp[0, :] = ground_temp

    # Diffusion (simplified heat spreading)
    new_temp = temp.copy()
    for j in range(1, ny-1):
        for i in range(1, nx-1):
            new_temp[j, i] = temp[j, i] + diffusion * (
                temp[j+1, i] + temp[j-1, i] + temp[j, i+1] + temp[j, i-1] - 4*temp[j, i])

    # Convection (hot air rises — swap warmer lower cells with cooler upper cells)
    for j in range(0, ny-2):
        for i in range(nx):
            if new_temp[j, i] > new_temp[j+1, i] + 0.5:  # if lower cell is hotter
                excess = (new_temp[j, i] - new_temp[j+1, i]) * buoyancy
                new_temp[j+1, i] += excess
                new_temp[j, i] -= excess * 0.8  # some heat retained

    temp = new_temp

# Create velocity field for visualization (arrows showing air movement)
vy = np.zeros((ny, nx))
vx = np.zeros((ny, nx))
for j in range(1, ny-1):
    for i in range(1, nx-1):
        # Vertical velocity proportional to temperature excess
        vy[j, i] = (temp[j, i] - temp[j, max(0,i-3):min(nx,i+4)].mean()) * 0.3
        # Horizontal velocity: convergence at bottom, divergence at top
        if j < ny // 3:
            vx[j, i] = -(i - 25) * 0.01 * max(0, temp[0, i] - 25)
        else:
            vx[j, i] = (i - 25) * 0.01 * max(0, temp[j, i] - 18)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Temperature field
ax1.set_facecolor('#111827')
im = ax1.imshow(temp, origin='lower', cmap='inferno', aspect='auto',
                extent=[0, 50, 0, 30], vmin=14, vmax=38)
plt.colorbar(im, ax=ax1, label='Temperature (°C)')

# Velocity arrows
skip = 3
Y, X = np.mgrid[0:ny:skip, 0:nx:skip]
ax1.quiver(X, Y, vx[::skip, ::skip], vy[::skip, ::skip],
           color='white', alpha=0.6, scale=5)

ax1.set_title('Convection: Hot Ground Drives Air Upward', color='white', fontsize=13)
ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.tick_params(colors='gray')

# Labels
ax1.text(25, 1, 'HOT GROUND\\n(sun-heated clearing)', color='white', fontsize=9,
         ha='center', fontweight='bold')
ax1.text(5, 1, 'Shade', color='#94a3b8', fontsize=9, ha='center')
ax1.text(45, 1, 'Shade', color='#94a3b8', fontsize=9, ha='center')

# Temperature profile at center
ax2.set_facecolor('#111827')
center_profile = temp[:, 25]
side_profile = temp[:, 5]
heights = np.arange(ny)

ax2.plot(center_profile, heights, color='#ef4444', linewidth=2, label='Over hot ground (center)')
ax2.plot(side_profile, heights, color='#3b82f6', linewidth=2, label='Over shaded ground (side)')
ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Height (m)', color='white')
ax2.set_title('Vertical Temperature Profiles', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Three heat transfer mechanisms in this simulation:")
print("  Conduction: ground heats the bottom row of air cells")
print("  Convection: hot air rises (arrows going up over hot ground)")
print("  Radiation: (not shown) the sun heated the ground in the first place")
print()
print(f"Ground center temp: {ground_temp[25]:.0f}°C")
print(f"Air at 10m over center: {temp[10, 25]:.1f}°C")
print(f"Air at 10m over shade: {temp[10, 5]:.1f}°C")
print(f"Convection lifted heat {temp[15, 25] - temp[15, 5]:.1f}°C higher over the hot spot")`,
      challenge: 'Make the hot spot wider (indices 5:45 instead of 15:35). Does the convection plume get wider or stronger? In the real world, large parking lots create urban heat islands for the same reason.',
      successHint: 'Every cumulus cloud you see is a convection plume — heated air rising from a warm surface, carrying moisture upward until it condenses. Understanding heat transfer is understanding the engine that drives all weather.',
    },
    {
      title: 'Air pressure systems — high and low pressure, wind patterns',
      concept: `The boy noticed that wind doesn't blow randomly — it follows patterns. The key to wind is **pressure difference**: air always flows from high pressure to low pressure, like water flowing downhill.

**High-pressure systems (anticyclones):**
- Cool, dense air sinks from above, pressing down on the surface
- Skies are clear (sinking air warms and dries out, preventing cloud formation)
- Winds spiral outward from the center — clockwise in the Northern Hemisphere (due to the Coriolis effect)
- Associated with fair, dry weather

**Low-pressure systems (cyclones):**
- Warm air rises from the surface, creating a zone of reduced pressure
- Surrounding air rushes in to fill the gap, spiraling inward — counterclockwise in the Northern Hemisphere
- Rising air cools and condenses, forming clouds and rain
- Associated with storms, rain, and unsettled weather

**The Coriolis effect:** Because Earth rotates, moving air gets deflected. In the Northern Hemisphere, it deflects to the right. This is why winds don't flow straight from high to low pressure — they curve, creating spiral patterns.

**Pressure gradient force:** The closer the isobars (lines of equal pressure) on a weather map, the steeper the pressure gradient, and the stronger the wind. Tightly packed isobars = gale-force winds. Widely spaced isobars = gentle breeze.

The monsoon itself is a giant pressure system: summer heating creates a low over central India, drawing in moisture-laden air from the high-pressure Indian Ocean.`,
      analogy: 'Pressure systems are like hills and valleys on an invisible landscape. High pressure is a hill — air "rolls downhill" away from it. Low pressure is a valley — air "rolls downhill" into it. The Coriolis effect is like the spin of a merry-go-round: if you try to throw a ball straight across, it curves. Wind does the same thing on a spinning Earth.',
      storyConnection: 'The boy noticed that before a storm, the wind always shifted. It came from one direction, paused, then switched. He was observing a low-pressure system approaching: the wind spirals inward, so as the system passes, the wind direction rotates. His grandfather would say, "When the wind can\'t make up its mind, the storm has made up hers."',
      checkQuestion: 'Why do hurricanes (cyclones) spin counterclockwise in the Northern Hemisphere but clockwise in the Southern Hemisphere?',
      checkAnswer: 'The Coriolis effect reverses across the equator. In the Northern Hemisphere, moving air deflects to the right, so inward-flowing air to a low-pressure center curves counterclockwise. In the Southern Hemisphere, it deflects to the left, creating clockwise rotation. At the equator itself, the Coriolis effect is zero, which is why hurricanes never form right on the equator.',
      codeIntro: 'Visualize high and low pressure systems with wind flow patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a grid
x = np.linspace(-5, 5, 40)
y = np.linspace(-5, 5, 40)
X, Y = np.meshgrid(x, y)

# Pressure field: low pressure center at (-2, 0), high pressure at (2, 0)
low_x, low_y = -2, 0
high_x, high_y = 2, 0

# Pressure (Gaussian-shaped systems)
P_low = -15 * np.exp(-((X - low_x)**2 + (Y - low_y)**2) / 3)
P_high = 15 * np.exp(-((X - high_x)**2 + (Y - high_y)**2) / 3)
P = 1013 + P_low + P_high

# Wind: pressure gradient + Coriolis rotation
# Gradient
dPdx = np.gradient(P, axis=1)
dPdy = np.gradient(P, axis=0)

# Geostrophic wind (rotated 90° from gradient due to Coriolis, Northern Hemisphere)
# Wind flows along isobars, not across them (approximately)
coriolis_factor = 0.7
u = -dPdy * coriolis_factor - dPdx * 0.3  # mostly along isobars + some cross-isobar flow
v = dPdx * coriolis_factor - dPdy * 0.3

# Normalize
speed = np.sqrt(u**2 + v**2) + 0.001
u_norm = u / speed
v_norm = v / speed

fig, ax = plt.subplots(figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Pressure contours
levels = np.arange(995, 1030, 2)
cs = ax.contour(X, Y, P, levels=levels, colors='#94a3b8', linewidths=0.8)
ax.clabel(cs, fontsize=7, colors='gray', fmt='%d')

# Pressure fill
ax.contourf(X, Y, P, levels=20, cmap='RdBu_r', alpha=0.3)

# Wind arrows
skip = 2
ax.quiver(X[::skip, ::skip], Y[::skip, ::skip],
          u_norm[::skip, ::skip], v_norm[::skip, ::skip],
          speed[::skip, ::skip], cmap='YlOrRd', scale=25, alpha=0.8)

# Labels
ax.text(low_x, low_y, 'L', color='#ef4444', fontsize=30, fontweight='bold',
        ha='center', va='center')
ax.text(high_x, high_y, 'H', color='#3b82f6', fontsize=30, fontweight='bold',
        ha='center', va='center')

# Annotations
ax.annotate('Low pressure\\nAir rises → clouds\\nCCW rotation (N. Hem.)',
            xy=(low_x, low_y - 0.5), xytext=(low_x - 1.5, low_y - 2.5),
            color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax.annotate('High pressure\\nAir sinks → clear skies\\nCW rotation (N. Hem.)',
            xy=(high_x, high_y + 0.5), xytext=(high_x + 0.5, high_y + 2.5),
            color='#3b82f6', fontsize=9, arrowprops=dict(arrowstyle='->', color='#3b82f6'))

ax.set_xlabel('Distance (arbitrary units)', color='white')
ax.set_ylabel('Distance (arbitrary units)', color='white')
ax.set_title('High & Low Pressure Systems with Wind Flow', color='white', fontsize=14)
ax.tick_params(colors='gray')
ax.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Pressure system summary:")
print(f"  Low center: {P[20, 12]:.0f} hPa (clouds, rain, CCW winds)")
print(f"  High center: {P[20, 28]:.0f} hPa (clear skies, CW winds)")
print(f"  Pressure gradient between them: {P[20, 28] - P[20, 12]:.0f} hPa")
print()
print("Key rules:")
print("  Wind flows from H to L (but curves due to Coriolis)")
print("  Tight isobars = strong wind")
print("  L = storms and rain")
print("  H = clear and calm")`,
      challenge: 'Move the low-pressure center to (0, 0) and remove the high. This simulates a single cyclone. How do the wind patterns change? Add a second low-pressure center nearby — what happens between them?',
      successHint: 'Every weather map you see on the news shows these same H and L patterns with isobars. Now you can read them: find the L, trace the wind spirals, identify where clouds and rain will form. The boy could feel this in the shifting wind; you can see it in the data.',
    },
    {
      title: 'Climate vs weather — long-term patterns vs daily variation',
      concept: `"Climate is what you expect; weather is what you get." This famous saying captures one of the most important distinctions in atmospheric science.

**Weather** is the state of the atmosphere at a specific place and time: today it's 28°C, cloudy, wind from the southwest, 75% humidity. Weather changes hour to hour and day to day. It's chaotic — small differences in initial conditions lead to completely different outcomes. This is why weather forecasts beyond 10 days are unreliable.

**Climate** is the statistical summary of weather over a long period (typically 30 years). Shillong's climate is "cool and wet" — that's the average of thousands of individual weather days. Climate tells you to pack a raincoat for Cherrapunji in July; weather tells you if it's raining right now.

**Key differences:**
- Weather is short-term (hours to days); climate is long-term (decades to centuries)
- Weather is chaotic and unpredictable beyond ~10 days; climate trends are predictable
- Weather varies wildly day to day; climate changes slowly
- A single cold day doesn't disprove global warming, just as a single hot day doesn't prove it

**Variability and extremes:**
Climate includes not just averages but also the range and frequency of extremes. A warming climate doesn't just shift the average temperature — it shifts the entire distribution, making extreme heat events much more likely and extreme cold events less likely.`,
      analogy: 'Weather is your mood — it changes hour by hour, day by day, and is hard to predict. Climate is your personality — the long-term pattern of how you generally behave. A normally cheerful person (warm climate) can have a bad day (cold snap). A normally gloomy person (cold climate) can have a great day (heat wave). One day doesn\'t define your personality, and one day doesn\'t define the climate.',
      storyConnection: 'The Khasi boy knew both weather and climate intimately. He knew that July would be wet (climate) even if one particular July day was dry (weather). He knew the monsoon would arrive in June (climate) even if it was a few days early or late (weather variability). His grandmother had 60 years of observations in her memory — she was a living climate database.',
      checkQuestion: 'If climate is just the average of weather, and we can\'t predict weather beyond 10 days, how can scientists predict climate decades ahead?',
      checkAnswer: 'Different physics. Weather prediction requires knowing exact initial conditions (impossible beyond ~10 days due to chaos). Climate prediction requires knowing the energy balance: how much solar energy comes in vs. how much heat goes out. If you add CO2, more heat is trapped — that\'s physics, not weather forecasting. It\'s like predicting that a pot of water on a stove will boil (climate) without knowing exactly which bubble will form first (weather).',
      codeIntro: 'Visualize the difference between weather (noisy daily data) and climate (the smooth long-term signal).',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 30 years of daily temperature data for Shillong
years = 30
days = np.arange(years * 365)
day_of_year = days % 365

# Climate signal: seasonal cycle + slight warming trend
seasonal = 10 * np.sin(2 * np.pi * (day_of_year - 80) / 365)  # peak in summer
warming_trend = 0.03 * days / 365  # 0.03°C/year warming
climate_signal = 17 + seasonal + warming_trend

# Weather noise: daily variation
weather_noise = np.random.normal(0, 4, len(days))

# Actual "observed" temperature
temperature = climate_signal + weather_noise

# Calculate annual means
annual_means = []
annual_years = []
for yr in range(years):
    start = yr * 365
    end = start + 365
    annual_means.append(np.mean(temperature[start:end]))
    annual_years.append(yr + 1993)  # start from 1993

fig, axes = plt.subplots(3, 1, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Full daily data (weather)
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(days / 365 + 1993, temperature, color='#94a3b8', linewidth=0.1, alpha=0.5)
ax.plot(days / 365 + 1993, climate_signal, color='#ef4444', linewidth=1.5, label='Climate signal')
ax.set_ylabel('Temp (°C)', color='white')
ax.set_title('30 Years of Daily Temperature: Weather vs Climate', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Annual means (climate emerges)
ax = axes[1]
ax.set_facecolor('#111827')
ax.bar(annual_years, annual_means, color='#3b82f6', alpha=0.7, width=0.8)
z = np.polyfit(annual_years, annual_means, 1)
trend_line = np.polyval(z, annual_years)
ax.plot(annual_years, trend_line, color='#ef4444', linewidth=2, linestyle='--',
        label=f'Trend: {z[0]:.3f}°C/year')
ax.set_ylabel('Annual mean (°C)', color='white')
ax.set_title('Annual Averages Reveal the Climate Trend', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Distribution shift
ax = axes[2]
ax.set_facecolor('#111827')
first_decade = temperature[:10*365]
last_decade = temperature[-10*365:]
bins = np.linspace(-5, 40, 60)
ax.hist(first_decade, bins=bins, alpha=0.5, color='#3b82f6', density=True,
        label=f'1993-2002 (mean: {first_decade.mean():.1f}°C)')
ax.hist(last_decade, bins=bins, alpha=0.5, color='#ef4444', density=True,
        label=f'2013-2022 (mean: {last_decade.mean():.1f}°C)')
ax.axvline(35, color='#f59e0b', linewidth=1.5, linestyle='--', label='Extreme heat threshold')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Probability density', color='white')
ax.set_title('Temperature Distribution Shift: Small Mean Change → Big Extreme Change', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Count extremes
hot_first = np.sum(first_decade > 35)
hot_last = np.sum(last_decade > 35)
print(f"Warming trend: {z[0]:.3f}°C per year = {z[0]*30:.1f}°C over 30 years")
print(f"\\nExtreme heat days (>35°C):")
print(f"  First decade: {hot_first} days")
print(f"  Last decade: {hot_last} days")
if hot_first > 0:
    print(f"  Increase: {(hot_last/hot_first - 1)*100:.0f}%")
print("\\nA small shift in the mean causes a LARGE change in extremes.")
print("This is why climate change is dangerous even at 'just' 1-2°C warming.")`,
      challenge: 'Change the warming trend from 0.03°C/year to 0.06°C/year (doubled). How many extreme heat days does the last decade get? This shows the non-linear relationship between average warming and extreme events.',
      successHint: 'The distinction between weather and climate is crucial for understanding climate change. A single cold week doesn\'t contradict warming — you need to look at decades of data. The boy\'s grandmother remembered 60 years of weather; the climate record she carried was more valuable than any single forecast.',
    },
    {
      title: 'Climate change — greenhouse effect, CO2, and temperature trends',
      concept: `The boy's grandmother remembered winters that were colder, monsoons that were more predictable, and rivers that ran fuller. She wasn't imagining it — the climate is changing, and the science is clear on why.

**The greenhouse effect** (the natural one):
Earth's surface absorbs sunlight and re-radiates it as infrared (heat). Greenhouse gases — CO2, methane, water vapor, N2O — absorb some of this infrared radiation and re-emit it in all directions, including back toward the surface. Without this natural greenhouse effect, Earth's average temperature would be -18°C instead of +15°C. The greenhouse effect is essential for life.

**The enhanced greenhouse effect** (the problem):
Since the Industrial Revolution (~1750), humans have burned massive amounts of fossil fuels (coal, oil, gas), releasing CO2 that was locked underground for millions of years. CO2 has risen from 280 ppm to over 420 ppm — a 50% increase. More CO2 means more infrared trapped, means more warming.

**The evidence is overwhelming:**
- Global temperature has risen ~1.2°C since 1880
- CO2 levels are higher than at any point in 800,000 years (ice core data)
- Arctic sea ice is declining, glaciers are retreating, sea level is rising
- The rate of warming is unprecedented in the geological record

**For Northeast India specifically:**
- Monsoon patterns are becoming more erratic (longer dry spells, more intense bursts)
- Temperature extremes are increasing
- Flash floods are becoming more frequent and severe
- Glacial melt in the Himalayas threatens long-term water supply`,
      analogy: 'The greenhouse effect is like wrapping yourself in blankets on a cold night. One blanket (natural CO2) keeps you comfortable. Adding five more blankets (burning fossil fuels) makes you overheat. The blankets don\'t generate heat — they trap the heat your body produces. CO2 doesn\'t generate heat — it traps the heat Earth radiates. We\'ve added too many blankets.',
      storyConnection: 'The boy noticed changes even in his short life: the monsoon arriving later, the dry season lasting longer, streams drying up that his grandmother remembered flowing year-round. "The clouds are confused," his grandmother said. In scientific terms: the climate patterns that Northeast India depended on for millennia are shifting because the global energy balance has changed.',
      checkQuestion: 'CO2 is only 0.04% of the atmosphere. How can such a tiny amount have such a large effect on temperature?',
      checkAnswer: 'Because CO2 absorbs infrared radiation at specific wavelengths that other gases (N2 and O2, which make up 99% of the atmosphere) do not. It\'s like a tiny amount of dye in water — a few drops can change the color of a whole glass. What matters isn\'t the percentage of CO2 but its effectiveness at absorbing heat radiation. Even at 0.04%, it absorbs a huge fraction of outgoing infrared at certain wavelengths.',
      codeIntro: 'Visualize real CO2 and temperature trends to see the correlation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Approximate real-world data
# CO2 (Mauna Loa + ice cores)
years_co2 = np.arange(1750, 2025)
# Pre-industrial: ~280 ppm, slow rise until ~1950, then exponential
co2 = np.where(years_co2 < 1850, 280 + 0.03 * (years_co2 - 1750),
       np.where(years_co2 < 1950, 280 + 0.03 * 100 + 0.2 * (years_co2 - 1850),
                280 + 3 + 20 + 1.8 * (years_co2 - 1950) + 0.015 * (years_co2 - 1950)**2))
# Add some realistic variation
co2 = co2 + np.random.normal(0, 0.5, len(co2))

# Global temperature anomaly (relative to 1951-1980 average)
years_temp = np.arange(1880, 2025)
# Approximate the NASA GISS record
temp_anomaly = (-0.2 + 0.001 * (years_temp - 1880) +
                0.000015 * (years_temp - 1880)**2 +
                0.3 * np.sin(2 * np.pi * (years_temp - 1880) / 60) * 0.15 +  # multidecadal variation
                np.random.normal(0, 0.08, len(years_temp)))  # interannual noise
# Ensure recent years match ~1.2°C anomaly
temp_anomaly = temp_anomaly - np.mean(temp_anomaly[71:101]) + np.linspace(-0.05, 0.05, len(temp_anomaly))

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# CO2 over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(years_co2, co2, color='#ef4444', linewidth=1.5)
ax.fill_between(years_co2, 280, co2, where=co2 > 280, alpha=0.2, color='#ef4444')
ax.axhline(280, color='gray', linewidth=0.5, linestyle='--')
ax.text(1760, 283, 'Pre-industrial level (280 ppm)', color='gray', fontsize=8)
ax.set_ylabel('CO₂ (ppm)', color='white')
ax.set_title('Atmospheric CO₂ Concentration', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Temperature anomaly
ax = axes[0, 1]
ax.set_facecolor('#111827')
colors_bar = ['#3b82f6' if t < 0 else '#ef4444' for t in temp_anomaly]
ax.bar(years_temp, temp_anomaly, color=colors_bar, width=1, alpha=0.7)
# 10-year running mean
window = 10
running_mean = np.convolve(temp_anomaly, np.ones(window)/window, mode='valid')
ax.plot(years_temp[window//2:window//2+len(running_mean)], running_mean,
        color='#f59e0b', linewidth=2, label='10-year average')
ax.axhline(0, color='gray', linewidth=0.5)
ax.set_ylabel('Temp anomaly (°C)', color='white')
ax.set_title('Global Temperature Anomaly (vs 1951-1980)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# CO2 vs Temperature scatter
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Align time periods (1880-2024)
co2_aligned = co2[years_co2 >= 1880][:len(temp_anomaly)]
ax.scatter(co2_aligned, temp_anomaly, c=years_temp[:len(co2_aligned)],
           cmap='plasma', s=10, alpha=0.7)
ax.set_xlabel('CO₂ (ppm)', color='white')
ax.set_ylabel('Temp anomaly (°C)', color='white')
ax.set_title('CO₂ vs Temperature: The Correlation', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Correlation
corr = np.corrcoef(co2_aligned, temp_anomaly[:len(co2_aligned)])[0, 1]
ax.text(0.05, 0.9, f'Correlation: {corr:.2f}', transform=ax.transAxes,
        color='#f59e0b', fontsize=11, fontweight='bold')

# Future projections
ax = axes[1, 1]
ax.set_facecolor('#111827')
future_years = np.arange(2024, 2101)

# Three scenarios
scenarios = {
    'High emissions (BAU)': (3.0, '#ef4444'),
    'Moderate reduction': (1.0, '#f59e0b'),
    'Aggressive reduction': (0.2, '#22c55e'),
}

current_anomaly = temp_anomaly[-1]
for name, (rate, color) in scenarios.items():
    projected = current_anomaly + rate * (future_years - 2024) / (2100 - 2024)
    projected += np.random.normal(0, 0.05, len(future_years)).cumsum() * 0.01
    ax.plot(future_years, projected, color=color, linewidth=2, label=name)
    ax.fill_between(future_years, projected - 0.3, projected + 0.3, alpha=0.1, color=color)

ax.axhline(1.5, color='white', linewidth=0.5, linestyle=':', alpha=0.5)
ax.text(2030, 1.55, '1.5°C Paris target', color='white', fontsize=8, fontstyle='italic')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Projected anomaly (°C)', color='white')
ax.set_title('Future Temperature Projections', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Current CO₂: ~{co2[-1]:.0f} ppm (up from 280 pre-industrial)")
print(f"Current warming: ~{temp_anomaly[-1]:.1f}°C above 1951-1980 average")
print(f"CO₂-Temperature correlation: {corr:.2f}")
print()
print("The science is clear: more CO₂ → more trapped heat → higher temperatures.")
print("The question is not whether warming will continue,")
print("but how much — and that depends on what we do now.")`,
      challenge: 'Plot CO2 for the last 800,000 years using ice core data (hint: it oscillated between 180-280 ppm during ice ages and warm periods). Show that the current 420 ppm is completely unprecedented. What does that tell us about the future?',
      successHint: 'Climate change is the defining challenge of this century. Understanding the physics — greenhouse effect, CO2 absorption, energy balance — is essential. The Khasi boy\'s grandmother saw the climate shift in her lifetime; the data confirms what she felt.',
    },
    {
      title: 'Weather stations — building a simple sensor array',
      concept: `Everything we've learned in Levels 1 and 2 — atmosphere, temperature, humidity, pressure, clouds, monsoons, climate — comes together in one practical device: the **weather station**. A weather station is a collection of sensors that continuously measures atmospheric conditions, logging data that meteorologists use for forecasting and climate scientists use for long-term records.

**Core sensors in a weather station:**
1. **Temperature sensor** (thermistor or DS18B20): resistance changes with temperature. Digital sensors give readings accurate to ±0.5°C.
2. **Humidity sensor** (DHT22 or BME280): measures capacitance change as a polymer absorbs moisture. Gives relative humidity ±2%.
3. **Barometric pressure sensor** (BMP280 or BME280): measures the flex of a tiny silicon membrane under air pressure. Accurate to ±1 hPa.
4. **Anemometer**: cups or a propeller that spin in the wind. Rotation speed = wind speed.
5. **Wind vane**: a balanced arrow that points into the wind. A potentiometer reads the angle.
6. **Rain gauge**: a tipping-bucket mechanism. Each tip = 0.2 mm of rain. A switch counts tips.

**Building with Arduino:**
An Arduino microcontroller can read all these sensors, timestamp the data, and log it to an SD card or transmit it wirelessly. A basic station (temperature + humidity + pressure) needs just one BME280 sensor and an Arduino — about $15 in parts.

**Siting matters:**
Where you place sensors determines data quality. Temperature sensors must be shielded from direct sun and rain (Stevenson screen). Anemometers need open exposure, 10 m above ground. Rain gauges need level ground away from buildings. Professional stations follow WMO (World Meteorological Organization) standards.`,
      analogy: 'A weather station is like a robot that does what the Khasi boy did instinctively — but 24/7, with numbers instead of feelings. The boy felt the humidity rise; the BME280 measures it to 2% accuracy. The boy noticed the wind shift; the anemometer records exact speed and direction. The robot never sleeps, never forgets, and never makes a subjective judgment. But the boy could look at the sky and understand what the numbers meant.',
      storyConnection: 'The boy talked to clouds with his eyes and his instincts. A weather station talks to clouds with sensors and data. Combining both — human pattern recognition with instrument precision — is how modern meteorology works. The boy\'s skills would make him an excellent weather observer, someone who can verify what the instruments say and catch errors that computers miss.',
      checkQuestion: 'Why must a temperature sensor be placed in a white, ventilated box (Stevenson screen) rather than just mounted on a pole?',
      checkAnswer: 'Direct sunlight would heat the sensor far above the actual air temperature (a dark sensor in the sun can read 10-15°C too high). Rain would wet it, cooling it by evaporation. A Stevenson screen is white (reflects sunlight), ventilated (air flows through to give true air temperature), and shielded (protects from rain and direct radiation). Without proper shielding, temperature data is meaningless.',
      codeIntro: 'Simulate an Arduino-based weather station logging data, then analyse the results.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 72 hours of sensor readings (every 5 minutes)
minutes = np.arange(0, 72 * 60, 5)
hours = minutes / 60

# Simulate sensor readings with realistic noise and patterns
# Temperature (BME280): daily cycle + sensor noise
temp_true = 22 + 8 * np.sin(2 * np.pi * (hours - 6) / 24)
temp_sensor = temp_true + np.random.normal(0, 0.3, len(hours))  # ±0.3°C noise

# Humidity (BME280): inversely correlated with temp + noise
humidity_true = 70 - 15 * np.sin(2 * np.pi * (hours - 6) / 24)
humidity_sensor = humidity_true + np.random.normal(0, 1.5, len(hours))
humidity_sensor = np.clip(humidity_sensor, 25, 100)

# Pressure (BMP280): slow change + diurnal tide + noise
pressure_true = 1010 - 0.1 * hours + 1.5 * np.sin(2 * np.pi * hours / 12)  # semidiurnal pressure tide
pressure_sensor = pressure_true + np.random.normal(0, 0.3, len(hours))

# Wind speed (anemometer): gusty, correlated with pressure gradient
wind_base = 5 + 3 * np.sin(2 * np.pi * (hours - 14) / 24)  # stronger in afternoon
wind_speed = np.abs(wind_base + np.random.exponential(2, len(hours)))

# Rain gauge: some events
rain = np.zeros(len(hours))
# Afternoon showers on day 2
rain_mask = (hours > 38) & (hours < 42)
rain[rain_mask] = np.random.exponential(1.5, np.sum(rain_mask))
# Heavy rain on day 3
rain_mask2 = (hours > 58) & (hours < 66)
rain[rain_mask2] = np.random.exponential(3, np.sum(rain_mask2))

fig, axes = plt.subplots(5, 1, figsize=(14, 12), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Arduino Weather Station: 72-Hour Data Log', color='white', fontsize=14, y=0.98)

# Temperature
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(hours, temp_sensor, color='#ef4444', linewidth=0.8, alpha=0.6, label='Sensor reading')
ax.plot(hours, temp_true, color='#f59e0b', linewidth=1.5, linestyle='--', label='True value')
ax.set_ylabel('Temp (°C)', color='white')
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=7, loc='upper right')
ax.tick_params(colors='gray')

# Humidity
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(hours, humidity_sensor, color='#22c55e', linewidth=0.8)
ax.axhline(100, color='#ef4444', linewidth=0.5, linestyle='--', alpha=0.5)
ax.set_ylabel('Humidity (%)', color='white')
ax.tick_params(colors='gray')

# Pressure
ax = axes[2]
ax.set_facecolor('#111827')
ax.plot(hours, pressure_sensor, color='#3b82f6', linewidth=0.8)
ax.set_ylabel('Pressure (hPa)', color='white')
ax.tick_params(colors='gray')
# Mark pressure drops
ax.annotate('Pressure falling\\n→ rain coming', xy=(55, pressure_sensor[660]),
            xytext=(45, pressure_sensor[660] + 3), color='#f59e0b', fontsize=8,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Wind speed
ax = axes[3]
ax.set_facecolor('#111827')
ax.fill_between(hours, wind_speed, alpha=0.3, color='#a855f7')
ax.plot(hours, wind_speed, color='#a855f7', linewidth=0.5)
ax.set_ylabel('Wind (km/h)', color='white')
ax.tick_params(colors='gray')

# Rain
ax = axes[4]
ax.set_facecolor('#111827')
ax.bar(hours, rain, width=5/60, color='#3b82f6', alpha=0.8)
ax.set_ylabel('Rain (mm/5min)', color='white')
ax.set_xlabel('Hours', color='white')
ax.tick_params(colors='gray')

# Day markers
for ax in axes:
    for day in range(4):
        ax.axvline(day * 24, color='gray', linewidth=0.3, alpha=0.3)

plt.tight_layout()
plt.show()

# Summary statistics
print("=== 72-Hour Weather Station Report ===")
print(f"\\nTemperature:")
print(f"  Min: {temp_sensor.min():.1f}°C  Max: {temp_sensor.max():.1f}°C  Mean: {temp_sensor.mean():.1f}°C")
print(f"  Sensor accuracy: ±{np.std(temp_sensor - temp_true):.2f}°C")
print(f"\\nHumidity:")
print(f"  Min: {humidity_sensor.min():.0f}%  Max: {humidity_sensor.max():.0f}%  Mean: {humidity_sensor.mean():.0f}%")
print(f"\\nPressure:")
print(f"  Start: {pressure_sensor[0]:.1f} hPa  End: {pressure_sensor[-1]:.1f} hPa")
print(f"  Trend: {'Falling' if pressure_sensor[-1] < pressure_sensor[0] else 'Rising'} ({pressure_sensor[0] - pressure_sensor[-1]:.1f} hPa drop)")
print(f"\\nWind:")
print(f"  Mean: {wind_speed.mean():.1f} km/h  Max gust: {wind_speed.max():.1f} km/h")
print(f"\\nRainfall:")
print(f"  Total: {rain.sum():.1f} mm")
print(f"  Max intensity: {rain.max():.1f} mm/5min")
print(f"\\n=== Arduino parts list ===")
print(f"  BME280 sensor (temp + humidity + pressure): ~$5")
print(f"  Arduino Nano: ~$5")
print(f"  Anemometer kit: ~$15")
print(f"  Rain gauge (tipping bucket): ~$10")
print(f"  SD card module: ~$3")
print(f"  Total: ~$38 for a complete weather station")`,
      challenge: 'Write pseudocode (or real Python) for an Arduino alert system: if pressure drops more than 3 hPa in 3 hours AND humidity exceeds 85%, print "STORM WARNING." Test it against the simulated data — does it correctly trigger before the rain events?',
      successHint: 'You\'ve gone from the Khasi boy looking at clouds to building instruments that measure the atmosphere quantitatively. This is the arc of science: observation → understanding → measurement → prediction → engineering. The boy who talked to clouds could one day build a weather station network for all of Meghalaya.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 meteorology foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for climate science simulations. Click to start.</p>
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