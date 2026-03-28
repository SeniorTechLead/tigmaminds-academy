import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AltitudeProfileDiagram from '../diagrams/AltitudeProfileDiagram';
import HeatTransferDiagram from '../diagrams/HeatTransferDiagram';
import ClimateFactorsDiagram from '../diagrams/ClimateFactorsDiagram';
import MonsoonDiagram from '../diagrams/MonsoonDiagram';
import AdaptationDiagram from '../diagrams/AdaptationDiagram';
import NEIndiaBiomesDiagram from '../diagrams/NEIndiaBiomesDiagram';

export default function SnowLeopardLevel1() {
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
      title: 'Atmospheric pressure vs altitude — why your ears pop on mountains',
      concept: `In the story, the snow leopard prowls the peaks of Sikkim above 4,000 metres. At that altitude, the air itself is different. **Atmospheric pressure** — the weight of the air column above you — drops as you climb higher because there is simply less air above you.

At sea level, atmospheric pressure is about **101,325 Pa** (1 atmosphere). At 4,000 m, it drops to roughly **61,600 Pa** — only 61% of sea-level pressure. At the summit of Everest (8,849 m), it's about **33,700 Pa** — a third of what you feel at the beach.

The relationship follows the **barometric formula**:
- P = P₀ × e^(−Mgh / RT)
- P₀ = sea-level pressure, M = molar mass of air, g = gravity, h = altitude, R = gas constant, T = temperature

This exponential decay is why pressure drops quickly at low altitudes and more slowly higher up — there's less air left to "lose."`,
      analogy: 'Imagine a stack of 100 blankets. The bottom blanket is crushed under the weight of all 99 above it. The top blanket feels almost no weight. Atmospheric pressure works the same way — air at sea level is compressed by all the air above it; air at mountaintop level has much less weight pressing down.',
      storyConnection: 'The snow leopard lives where the air is thin. Its large nasal passages and powerful chest are built to extract enough oxygen from air that has 40% less pressure than the valleys below. Every breath at 4,000 metres delivers less oxygen than a breath at sea level — yet the leopard hunts, leaps, and thrives.',
      checkQuestion: 'If atmospheric pressure at sea level is 101,325 Pa and it halves roughly every 5,500 metres, what would the pressure be at 11,000 metres (cruising altitude of a jet)?',
      checkAnswer: 'About 25,331 Pa — roughly one quarter of sea-level pressure. That is why aircraft cabins are pressurised. Without pressurisation, passengers would lose consciousness in minutes due to oxygen deprivation. The cabin is typically pressurised to the equivalent of about 1,800-2,400 m altitude.',
      codeIntro: 'Plot atmospheric pressure vs altitude using the barometric formula.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Barometric formula: P = P0 * exp(-Mgh / RT)
P0 = 101325      # sea-level pressure (Pa)
M = 0.029        # molar mass of air (kg/mol)
g = 9.81         # gravity (m/s^2)
R = 8.314        # gas constant (J/(mol*K))
T = 288.15       # average temperature (K) ~15°C

altitudes = np.linspace(0, 12000, 500)  # 0 to 12 km
pressure = P0 * np.exp(-M * g * altitudes / (R * T))

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(altitudes / 1000, pressure / 1000, color='#22c55e', linewidth=2)
ax.fill_between(altitudes / 1000, pressure / 1000, alpha=0.1, color='#22c55e')

# Mark key altitudes
markers = [
    (0, 'Sea level'),
    (2000, 'Gangtok (1,650m)'),
    (4000, 'Snow leopard habitat'),
    (5364, 'Everest Base Camp'),
    (8849, 'Everest summit'),
    (10668, 'Jet cruising altitude'),
]
for alt, label in markers:
    p = P0 * np.exp(-M * g * alt / (R * T)) / 1000
    ax.plot(alt / 1000, p, 'o', color='#f59e0b', markersize=7)
    ax.annotate(label, xy=(alt / 1000, p), xytext=(alt / 1000 + 0.3, p + 3),
                color='#f59e0b', fontsize=8)

ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Pressure (kPa)', color='white')
ax.set_title('Atmospheric Pressure vs Altitude', color='white', fontsize=13)
ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print("Pressure at key altitudes:")
for alt, label in markers:
    p = P0 * np.exp(-M * g * alt / (R * T))
    pct = p / P0 * 100
    print(f"  {label}: {p/1000:.1f} kPa ({pct:.0f}% of sea level)")`,
      challenge: 'The formula assumes constant temperature, but real air gets colder with altitude. Modify T to decrease by 6.5°C per 1000m (T = 288.15 - 0.0065 * alt). How does this change the curve?',
      successHint: 'The barometric formula is used in aviation, mountaineering, and weather forecasting. Altimeters in aircraft actually measure pressure and convert it to altitude — which is why pilots must calibrate them regularly.',
    },
    {
      title: 'Temperature lapse rate — why mountains are cold',
      concept: `Everyone knows mountains are cold, but why? The sun is closer up there (by a trivial amount), and hot air rises — so shouldn't mountains be warmer? The answer is the **temperature lapse rate**: air cools as it rises because it expands.

As air moves upward, atmospheric pressure decreases. Lower pressure allows the air to expand. Expansion requires energy, which comes from the air's own heat. So the air cools. This is **adiabatic cooling** — cooling without losing heat to the surroundings.

The **dry adiabatic lapse rate** is about **9.8°C per 1,000 m**. Moist air cools more slowly (about **5-6°C per 1,000 m**) because water vapour releases heat as it condenses into clouds.

The **environmental lapse rate** (average observed) is about **6.5°C per 1,000 m** in the troposphere. So if it's 25°C at sea level, it's about **-1°C** at the snow leopard's 4,000 m habitat.`,
      analogy: 'Think of a bicycle pump. When you compress air into a tyre, the pump gets hot — you are adding energy to the air by squishing it. The reverse happens on a mountain: as air rises and expands, it gives up energy and gets colder. The mountain does not cool the air; the air cools itself by expanding.',
      storyConnection: 'The snow leopard\'s thick fur — the thickest of any big cat — is a direct consequence of the lapse rate. At 4,000 m, temperatures regularly plunge below -20°C in winter. The leopard\'s fur is 12 cm thick on the belly and 5 cm on the back, an insulation system evolved to survive the cold that the lapse rate guarantees.',
      checkQuestion: 'If the environmental lapse rate is 6.5°C/km and a city at 200 m elevation is 30°C, what temperature would you expect at a mountain peak 3,200 m above?',
      checkAnswer: 'The altitude difference is 3,000 m (3 km). Temperature drop = 6.5 × 3 = 19.5°C. So the peak temperature would be about 30 - 19.5 = 10.5°C. This is a rough estimate — actual temperature depends on humidity, wind, time of day, and season.',
      codeIntro: 'Compare dry, moist, and environmental lapse rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

altitudes = np.linspace(0, 6000, 300)  # 0 to 6 km
T_surface = 25  # °C at sea level

# Lapse rates (°C per 1000 m)
dry_rate = 9.8
moist_rate = 5.5
env_rate = 6.5

T_dry = T_surface - dry_rate * altitudes / 1000
T_moist = T_surface - moist_rate * altitudes / 1000
T_env = T_surface - env_rate * altitudes / 1000

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(T_dry, altitudes / 1000, color='#ef4444', linewidth=2, label=f'Dry adiabatic ({dry_rate}°C/km)')
ax.plot(T_moist, altitudes / 1000, color='#3b82f6', linewidth=2, label=f'Moist adiabatic ({moist_rate}°C/km)')
ax.plot(T_env, altitudes / 1000, color='#22c55e', linewidth=2, linestyle='--', label=f'Environmental avg ({env_rate}°C/km)')

# Mark freezing line
freeze_alt_env = (T_surface - 0) / env_rate * 1000
ax.axhline(freeze_alt_env / 1000, color='#94a3b8', linestyle=':', linewidth=1)
ax.annotate(f'Freezing line ({freeze_alt_env/1000:.1f} km)', xy=(0, freeze_alt_env / 1000),
            xytext=(5, freeze_alt_env / 1000 + 0.2), color='#94a3b8', fontsize=9)

# Snow leopard zone
ax.axhspan(3.5, 5.5, alpha=0.1, color='#a855f7')
ax.annotate('Snow leopard zone', xy=(T_surface - 10, 4.5), color='#a855f7', fontsize=10, fontweight='bold')

ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Temperature Lapse Rates', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.axvline(0, color='gray', linewidth=0.5, linestyle=':')
plt.tight_layout()
plt.show()

print("At the snow leopard's habitat (4,000 m):")
print(f"  Dry lapse:  {T_surface - dry_rate * 4:.1f}°C")
print(f"  Moist lapse: {T_surface - moist_rate * 4:.1f}°C")
print(f"  Env average: {T_surface - env_rate * 4:.1f}°C")
print()
print("The lapse rate explains why:")
print("  - Mountain peaks have snow year-round")
print("  - Clouds form at specific altitudes")
print("  - Weather changes rapidly in mountains")`,
      challenge: 'Add an inversion layer: between 1 km and 1.5 km, make the temperature increase by 2°C/km instead of decreasing. This is a temperature inversion — it traps pollution in valleys. Plot it as a fourth line.',
      successHint: 'The lapse rate is fundamental to meteorology, aviation, and mountain ecology. It explains cloud formation, weather patterns, snow lines, and why the snow leopard needs that incredible fur.',
    },
    {
      title: 'Thin air and oxygen — breathing at altitude',
      concept: `At 4,000 metres, there's about 40% less atmospheric pressure than at sea level. The percentage of oxygen in the air stays the same (20.9%), but because the air is less dense, each breath delivers **40% fewer oxygen molecules** to your lungs.

This is the problem of **hypoxia** — insufficient oxygen. Your body responds with:
1. **Increased breathing rate**: more breaths per minute to compensate
2. **Increased heart rate**: pump blood faster to deliver what oxygen is available
3. **Acclimatisation** (over days/weeks): your body produces more red blood cells, each carrying more haemoglobin, to grab every available oxygen molecule

The partial pressure of oxygen (pO₂) at sea level is about **21.2 kPa**. At 4,000 m it drops to about **12.7 kPa**. At Everest's summit, it's only **7.0 kPa** — just a third of normal. Below about 6.3 kPa, humans cannot survive even with acclimatisation. This boundary at roughly 8,000 m is called the **death zone**.`,
      analogy: 'Imagine fishing in a pond. At sea level, the pond is full of fish (oxygen molecules) — every cast catches something. At 4,000 m, the same pond has 40% fewer fish. You cast the same net (your lungs), but catch fewer fish each time. You must cast more often (breathe faster) and use a better net (more haemoglobin) to survive.',
      storyConnection: 'The snow leopard\'s barrel chest isn\'t just for show. It houses enlarged lungs with a greater surface area for gas exchange, and the leopard\'s blood carries a variant of haemoglobin that binds oxygen more efficiently at low partial pressures. The leopard doesn\'t gasp at 5,000 m — its biology evolved for thin air over millions of years.',
      checkQuestion: 'Athletes train at high altitude to improve performance at sea level. Why does this work?',
      checkAnswer: 'Training at altitude triggers the body to produce more red blood cells (erythropoietin response). When the athlete returns to sea level, they temporarily have more oxygen-carrying capacity than someone who trained only at low altitude. This is legal "blood doping" — and it\'s why the best long-distance runners often train in places like Kenya\'s highlands (2,400 m) or Colorado\'s mountains.',
      codeIntro: 'Calculate and plot oxygen availability at different altitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

P0 = 101325  # sea level pressure (Pa)
M = 0.029; g = 9.81; R = 8.314; T = 273.15 + 15
O2_fraction = 0.209

altitudes = np.linspace(0, 10000, 500)
pressure = P0 * np.exp(-M * g * altitudes / (R * T))
pO2 = pressure * O2_fraction / 1000  # kPa

# Effective oxygen as percentage of sea level
O2_pct = (pressure / P0) * 100

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Partial pressure of oxygen
ax1.set_facecolor('#111827')
ax1.plot(altitudes / 1000, pO2, color='#3b82f6', linewidth=2)
ax1.fill_between(altitudes / 1000, pO2, alpha=0.1, color='#3b82f6')
ax1.axhline(6.3, color='#ef4444', linestyle='--', linewidth=1.5, label='Death zone threshold')
ax1.axhspan(0, 6.3, alpha=0.05, color='#ef4444')
ax1.set_xlabel('Altitude (km)', color='white')
ax1.set_ylabel('pO₂ (kPa)', color='white')
ax1.set_title('Oxygen Partial Pressure vs Altitude', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Effective oxygen percentage
ax2.set_facecolor('#111827')
ax2.plot(altitudes / 1000, O2_pct, color='#22c55e', linewidth=2)
ax2.fill_between(altitudes / 1000, O2_pct, alpha=0.1, color='#22c55e')

zones = [
    (0, 2.5, 'Comfortable', '#22c55e'),
    (2.5, 4.0, 'Mild effects', '#f59e0b'),
    (4.0, 5.5, 'Acclimatisation needed', '#f97316'),
    (5.5, 8.0, 'Dangerous', '#ef4444'),
    (8.0, 10.0, 'Death zone', '#991b1b'),
]
for lo, hi, label, color in zones:
    mid = (lo + hi) / 2
    pct = P0 * np.exp(-M * g * mid * 1000 / (R * T)) / P0 * 100
    ax2.annotate(label, xy=(mid, pct), color=color, fontsize=8, ha='center', fontweight='bold')

ax2.set_xlabel('Altitude (km)', color='white')
ax2.set_ylabel('Effective O₂ (% of sea level)', color='white')
ax2.set_title('Oxygen Available vs Altitude', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Oxygen at key altitudes:")
for alt_m, label in [(0,'Sea level'),(2500,'Gangtok'),(4000,'Snow leopard zone'),
                      (5364,'Everest Base Camp'),(8000,'Death zone start'),(8849,'Everest summit')]:
    p = P0 * np.exp(-M * g * alt_m / (R * T))
    po2 = p * O2_fraction
    print(f"  {label} ({alt_m}m): pO2 = {po2/1000:.1f} kPa, effective O2 = {p/P0*100:.0f}%")`,
      challenge: 'Add a line showing how breathing rate must increase to maintain the same oxygen intake. If sea-level breathing is 15 breaths/min, and rate scales inversely with pressure ratio, plot breaths/min vs altitude.',
      successHint: 'Oxygen availability is the single biggest constraint on life at altitude. It determines where snow leopards hunt, where humans can live permanently (rarely above 5,500 m), and why Everest climbers use supplemental oxygen.',
    },
    {
      title: 'Mountain weather — why storms form on peaks',
      concept: `Mountains don't just sit in the weather — they **create** weather. When wind hits a mountain, it's forced upward. As the air rises, it cools (lapse rate) and its moisture condenses into clouds and precipitation. This is **orographic lift**, and it explains why mountains are often cloudy and wet on one side.

Key mountain weather phenomena:
- **Orographic precipitation**: the windward side (facing the wind) gets heavy rain/snow
- **Rain shadow**: the leeward side (sheltered) is dry because the air has already lost its moisture
- **Katabatic winds**: cold, dense air slides downhill at night, sometimes reaching 100+ km/h
- **Mountain-valley breezes**: during the day, warm air rises up slopes; at night, cold air sinks down
- **Sudden storms**: mountains can trigger convection, creating thunderstorms that develop in minutes

Sikkim receives over **5,000 mm** of rain annually on its southern slopes — one of the wettest places on Earth — due to the Himalayas forcing monsoon air upward.`,
      analogy: 'A mountain is like a speed bump for wind. When a car hits a speed bump, it bounces up — and so does a packet of moist air hitting a mountain. As it goes up, it cools (like the air conditioning in your car kicking in), water condenses (like fog on your windscreen), and it rains on the windward side. By the time the air crosses over, it is dry.',
      storyConnection: 'The snow leopard in the story navigates between storms that appear from nowhere. Mountain weather is genuinely dangerous and unpredictable — clouds can form around a peak in 15 minutes, temperatures can drop 20°C when a katabatic wind arrives, and blizzards can strike on clear-sky days when orographic lift triggers sudden condensation.',
      checkQuestion: 'The Cherrapunji region of Meghalaya is one of the wettest places on Earth (~11,000 mm/year), but it also experiences water shortages. How is that possible?',
      checkAnswer: 'Most of the rain falls in just 4-5 months (June-September monsoon). The rain runs off steep terrain quickly, and there is limited infrastructure to store it. Deforestation has reduced the land\'s ability to absorb and slowly release water. So the region floods during monsoons and runs dry in winter — a paradox of abundance and scarcity.',
      codeIntro: 'Model orographic precipitation: how a mountain forces rain on one side and creates a rain shadow on the other.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Mountain profile
x = np.linspace(-50, 50, 500)  # km from peak
mountain = 4000 * np.exp(-x**2 / 200)  # Gaussian mountain

# Air moisture content (starts high on windward side)
# Wind blows from left to right
moisture = np.zeros_like(x)
initial_moisture = 100  # relative units
current = initial_moisture
precipitation = np.zeros_like(x)

for i in range(len(x)):
    alt = mountain[i]
    # Moisture drops as altitude increases (condensation)
    if i > 0:
        alt_change = mountain[i] - mountain[i-1]
        if alt_change > 0:  # rising air
            loss = current * 0.0008 * alt_change  # condensation rate
            precipitation[i] = loss
            current -= loss
        else:  # descending air (leeward) - dry, no precip
            precipitation[i] = max(0, current * 0.00005 * abs(alt_change))
            current -= precipitation[i]
    moisture[i] = current

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Mountain profile
ax1.set_facecolor('#111827')
ax1.fill_between(x, 0, mountain, color='#6b7280', alpha=0.6)
ax1.plot(x, mountain, color='white', linewidth=1.5)
ax1.annotate('WINDWARD\\n(wet)', xy=(-25, 500), color='#3b82f6', fontsize=11, fontweight='bold', ha='center')
ax1.annotate('LEEWARD\\n(dry)', xy=(25, 500), color='#f59e0b', fontsize=11, fontweight='bold', ha='center')
ax1.annotate('<-- Wind', xy=(-40, 3000), color='#94a3b8', fontsize=10)
ax1.set_ylabel('Elevation (m)', color='white')
ax1.set_title('Orographic Precipitation Model', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Moisture content
ax2.set_facecolor('#111827')
ax2.plot(x, moisture, color='#3b82f6', linewidth=2)
ax2.fill_between(x, moisture, alpha=0.15, color='#3b82f6')
ax2.set_ylabel('Air moisture', color='white')
ax2.tick_params(colors='gray')

# Precipitation
ax3.set_facecolor('#111827')
ax3.bar(x[::5], precipitation[::5], width=0.8, color='#22c55e', alpha=0.8)
ax3.set_xlabel('Distance from peak (km)', color='white')
ax3.set_ylabel('Precipitation', color='white')
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

windward_precip = np.sum(precipitation[x < 0])
leeward_precip = np.sum(precipitation[x > 0])
ratio = windward_precip / max(leeward_precip, 0.01)
print(f"Windward precipitation: {windward_precip:.1f} units")
print(f"Leeward precipitation:  {leeward_precip:.1f} units")
print(f"Ratio: {ratio:.1f}x more rain on windward side")
print()
print("This is the rain shadow effect.")
print("Sikkim's south slopes: >5,000 mm/year (windward)")
print("Tibet plateau behind:  ~300 mm/year (rain shadow)")`,
      challenge: 'Change the mountain height from 4,000 m to 2,000 m. How does the rain shadow change? Try 6,000 m as well. Taller mountains create more extreme rain shadows.',
      successHint: 'Orographic lift explains rainfall patterns across every mountain range on Earth. It determines where forests grow, where deserts form, and where the snow leopard\'s prey (bharal, marmots) can find food.',
    },
    {
      title: 'Adaptation to altitude — how bodies cope with thin air',
      concept: `Humans who move to high altitude feel terrible for days: headaches, nausea, fatigue. This is **acute mountain sickness (AMS)**, caused by sudden exposure to low oxygen. But over days and weeks, the body **acclimatises**:

Short-term (hours-days):
- Breathing rate increases (hyperventilation)
- Heart rate increases
- Blood vessels in the lungs constrict to improve gas exchange

Medium-term (days-weeks):
- Kidneys produce **erythropoietin (EPO)**, which stimulates red blood cell production
- Haemoglobin concentration increases from ~15 g/dL to 18-20 g/dL
- Capillary density increases in muscles

Long-term (generations):
- Tibetans have a gene variant (EPAS1) that prevents overproduction of red blood cells (which can cause blood thickening)
- Andean people have barrel chests and larger lung capacity
- Ethiopian highlanders have higher haemoglobin-oxygen affinity

The snow leopard has had millions of years to adapt. Its haemoglobin variant, enlarged lungs, and efficient oxygen extraction are genetic adaptations, not acclimatisation.`,
      analogy: 'Acclimatisation is like upgrading your internet plan. At first (sea level), you have a fast connection and everything runs smoothly. When you move to altitude, it is like your bandwidth drops 40%. Your computer (body) tries to compensate by running fewer background tasks (reducing non-essential functions) and compressing data (making more efficient red blood cells). Over time, you find workarounds. But the snow leopard was born with a mountain-optimised connection.',
      storyConnection: 'The promise in the story is about endurance — the snow leopard\'s vow to protect the mountain. In reality, the snow leopard\'s body is a masterpiece of altitude adaptation. Every organ has been fine-tuned by natural selection: lungs for thin air, fur for cold, wide paws for snow, a long tail for balance on steep terrain.',
      checkQuestion: 'Why is it dangerous if your body produces too many red blood cells at altitude?',
      checkAnswer: 'Too many red blood cells make the blood thick and viscous (high haematocrit). This increases the risk of blood clots, stroke, and heart failure. This condition is called polycythaemia. Tibetans evolved the EPAS1 gene variant specifically to prevent this — their bodies produce just enough extra red blood cells, not too many. It is one of the fastest known examples of human evolution.',
      codeIntro: 'Simulate the body\'s acclimatisation response over time at altitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Acclimatisation timeline at 4,000 m
days = np.arange(0, 30, 0.5)

# Breathing rate (breaths/min) — increases quickly
breath_base = 15
breath_max = 22
breath_rate = breath_base + (breath_max - breath_base) * (1 - np.exp(-days / 1.5))

# Heart rate (bpm) — increases then slowly normalises
hr_base = 70
hr_peak = 100
hr = hr_base + (hr_peak - hr_base) * np.exp(-((days - 2)**2) / 8) + 5 * (1 - np.exp(-days / 0.5))
hr = np.clip(hr, hr_base, hr_peak)

# Haemoglobin (g/dL) — slow increase over weeks
hb_base = 15
hb_max = 19
haemoglobin = hb_base + (hb_max - hb_base) * (1 - np.exp(-days / 12))

# SpO2 (blood oxygen saturation %)
spo2_base = 98
spo2_min = 85
spo2 = spo2_min + (spo2_base - spo2_min) * (1 - np.exp(-days / 8))

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Acclimatisation at 4,000 m Over 30 Days', color='white', fontsize=14)

params = [
    (axes[0,0], breath_rate, 'Breathing Rate', 'breaths/min', '#3b82f6'),
    (axes[0,1], hr, 'Heart Rate', 'bpm', '#ef4444'),
    (axes[1,0], haemoglobin, 'Haemoglobin', 'g/dL', '#22c55e'),
    (axes[1,1], spo2, 'Blood O₂ Saturation', '%', '#f59e0b'),
]

for ax, data, title, ylabel, color in params:
    ax.set_facecolor('#111827')
    ax.plot(days, data, color=color, linewidth=2)
    ax.fill_between(days, data, data.min(), alpha=0.1, color=color)
    ax.set_title(title, color='white', fontsize=11)
    ax.set_ylabel(ylabel, color='white')
    ax.set_xlabel('Days at altitude', color='white')
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Acclimatisation timeline at 4,000 m:")
print("  Day 0: Breathing increases immediately, SpO2 drops to ~85%")
print("  Day 1-3: Heart rate peaks, headaches and fatigue common")
print("  Day 7: SpO2 recovering, breathing stabilising")
print("  Day 14: Haemoglobin noticeably higher, energy improving")
print("  Day 21-30: Well acclimatised, performance approaching normal")
print()
print("The snow leopard skips all of this — it was born adapted.")`,
      challenge: 'Add a 5th subplot showing exercise capacity (VO2 max) dropping to 60% on day 0 and recovering to about 85% by day 30. VO2 max at altitude never fully reaches sea-level values.',
      successHint: 'Understanding acclimatisation saves lives — every mountaineer, trekker, and high-altitude worker must manage this process. Rushing altitude gain causes AMS, which can progress to fatal pulmonary or cerebral oedema.',
    },
    {
      title: 'Snow leopard biology — anatomy of a mountain predator',
      concept: `The snow leopard (*Panthera uncia*) is perhaps the most perfectly adapted mountain predator on Earth. Every feature of its body is a solution to a physics or biology problem:

- **Wide, fur-covered paws**: distribute weight on snow (low pressure = less sinking, same physics as snowshoes)
- **Long, thick tail** (nearly as long as its body): stores fat, provides balance on cliffs, wraps around face for warmth while sleeping
- **Short, rounded ears**: minimise heat loss (surface-area-to-volume ratio — small extremities lose less heat)
- **Enlarged nasal passages**: warm and humidify cold, dry mountain air before it reaches the lungs
- **Powerful hind legs**: can leap 15 metres horizontally and 6 metres vertically — essential for navigating cliff terrain
- **Grey-white rosette fur**: camouflage against rock and snow, thick undercoat for insulation

Population: only **4,000-6,500** remain in the wild across 12 countries. They are classified as **Vulnerable** by the IUCN. Threats include habitat loss, prey depletion, poaching, and climate change pushing their habitat upward.`,
      analogy: 'The snow leopard is like an all-terrain vehicle designed for one specific terrain. A Formula 1 car is fast but useless off-road. A tractor is powerful but slow. The snow leopard is the mountain equivalent — every feature is a trade-off optimised for steep, cold, rocky, oxygen-poor terrain. Put it in a jungle and it would struggle. On its home ground, nothing matches it.',
      storyConnection: 'The snow leopard\'s promise in the story — to protect the mountain — reflects a real ecological truth. As an apex predator, the snow leopard regulates prey populations (bharal, ibex, marmots), which prevents overgrazing, which preserves mountain vegetation, which holds soil, which prevents erosion, which protects watersheds. Remove the leopard and the whole mountain ecosystem degrades. The promise is real.',
      checkQuestion: 'Snow leopards have proportionally shorter legs than tigers or lions. Why is this an advantage in steep terrain?',
      checkAnswer: 'A lower centre of gravity provides better stability on steep, uneven surfaces. Short, powerful legs also allow crouching close to rocks for ambush hunting and navigating narrow ledges. Longer legs would make the leopard top-heavy and more likely to fall. This is the same reason mountain goats have short legs and racing horses have long ones — terrain dictates limb design.',
      codeIntro: 'Build a comparative anatomy radar chart: snow leopard vs tiger vs cheetah.',
      code: `import numpy as np
import matplotlib.pyplot as plt

categories = ['Cold\\ntolerance', 'Climbing\\nability', 'Sprint\\nspeed', 'Leap\\ndistance', 'Camouflage', 'Altitude\\ntolerance']
N = len(categories)

cats = {
    'Snow leopard': [10, 10, 4, 9, 9, 10],
    'Tiger': [5, 3, 7, 5, 7, 2],
    'Cheetah': [2, 1, 10, 3, 6, 1],
    'Clouded leopard': [4, 9, 3, 6, 7, 3],
}
colors = {'Snow leopard': '#94a3b8', 'Tiger': '#f59e0b', 'Cheetah': '#22c55e', 'Clouded leopard': '#a855f7'}

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for name, values in cats.items():
    vals = values + values[:1]
    ax.plot(angles, vals, 'o-', linewidth=2, label=name, color=colors[name])
    ax.fill(angles, vals, alpha=0.1, color=colors[name])

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=9)
ax.set_ylim(0, 10)
ax.set_yticks([2, 4, 6, 8, 10])
ax.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax.tick_params(colors='gray')
ax.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1), facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_title('Big Cat Adaptation Profiles', color='white', fontsize=13, pad=20)

plt.tight_layout()
plt.show()

print("Each cat is optimised for its environment:")
print("  Snow leopard: cold, high-altitude, steep rocky terrain")
print("  Tiger: warm/temperate forest, versatile hunter")
print("  Cheetah: open savanna, pure speed specialist")
print("  Clouded leopard: tropical forest, arboreal (tree) specialist")
print()
print("Snow leopard key stats:")
print("  Weight: 25-55 kg")
print("  Tail: 80-105 cm (nearly body length)")
print("  Leap: up to 15 m horizontal")
print("  Habitat: 3,000-5,500 m altitude")
print("  Population: ~4,000-6,500 wild")
print("  Status: Vulnerable (IUCN)")`,
      challenge: 'Add a domestic cat to the chart (short legs, moderate climbing, low cold/altitude tolerance, moderate speed). How does it compare? Domestic cats share 95.6% of their DNA with tigers — small genetic changes produce big physical differences.',
      successHint: 'The snow leopard demonstrates that physics governs biology. Every adaptation — paw size, ear shape, leg length, fur thickness — is a solution to a physics problem (pressure, heat transfer, stability, aerodynamics). Understanding the physics helps us protect the animal.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Altitude, Temperature & Mountain Physics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for physics simulations. Click to start.</p>
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
            diagram={[AltitudeProfileDiagram, HeatTransferDiagram, ClimateFactorsDiagram, MonsoonDiagram, AdaptationDiagram, NEIndiaBiomesDiagram][i] ? createElement([AltitudeProfileDiagram, HeatTransferDiagram, ClimateFactorsDiagram, MonsoonDiagram, AdaptationDiagram, NEIndiaBiomesDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
