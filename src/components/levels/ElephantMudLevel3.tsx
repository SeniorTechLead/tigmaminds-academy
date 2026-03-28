import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function ElephantMudLevel3() {
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
      title: 'Thermoregulation in megafauna — the physics of staying cool when you weigh 5 tonnes',
      concept: `Large animals face a fundamental physics problem: heat production scales with body volume (mass^1), but heat dissipation scales with body surface area (mass^2/3). This is the **surface-area-to-volume ratio** problem.

For a 5000 kg elephant:
- Volume ~ 5 m3, Surface area ~ 15 m2
- SA:V ratio ~ 3 m^-1

For a 0.02 kg mouse:
- Volume ~ 0.00002 m3, Surface area ~ 0.003 m2
- SA:V ratio ~ 150 m^-1

The mouse has 50x more surface area per unit volume. It loses heat so fast that it must eat constantly to maintain body temperature. The elephant has the opposite problem — it generates enormous metabolic heat and has relatively little surface area to dump it.

**Thermoregulation strategies for megafauna**:
- **Evaporative cooling**: sweating (humans), panting (dogs). Elephants cannot sweat effectively due to their thick skin.
- **Radiative cooling**: exposing skin to cool surfaces. Mud baths exploit this — wet mud is cooler than air.
- **Convective cooling**: wind over wet skin. Elephant ears act as radiators — large, thin, heavily vascularized.
- **Behavioral thermoregulation**: seeking shade, mud wallowing, bathing, adjusting activity to cooler hours.

The mud bath is a multi-mechanism cooling strategy: it provides evaporative cooling (as mud dries), reduces solar radiation absorption (mud reflects more than dark skin), and protects against ectoparasites.`,
      analogy: 'Think of a thermos versus a coffee cup. The thermos (elephant) retains heat extremely well because it has a low surface-area-to-volume ratio and is well-insulated. Cooling it down is hard. The coffee cup (mouse) loses heat rapidly through its thin walls and large opening. An elephant taking a mud bath is like putting the thermos in a bucket of ice water — using an external medium to overcome the insulation problem.',
      storyConnection: 'The elephant in the story does not take a mud bath for fun — it takes one for survival. In the heat of an Assam summer, with temperatures above 35 degrees C and high humidity, a 5-tonne elephant generates enough metabolic heat to raise its body temperature by 1 degree C per hour without cooling. The mud bath is an engineering solution to a life-threatening physics problem.',
      checkQuestion: 'Baby elephants have a much higher surface-area-to-volume ratio than adults. Do they need mud baths more or less than adults, and why?',
      checkAnswer: 'Baby elephants lose heat more easily through their skin (higher SA:V ratio), so they are less prone to overheating in mild conditions. However, they are also more vulnerable to hypothermia on cold nights. Adults need mud baths more because their low SA:V ratio traps metabolic heat. But in extreme heat, even calves benefit from mud because it blocks solar radiation, which heats all animals regardless of size.',
      codeIntro: 'Model the heat balance of an elephant and predict how body temperature changes with and without cooling behaviors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Elephant thermal model
class ElephantThermalModel:
    def __init__(self, mass_kg=5000):
        self.mass = mass_kg
        self.specific_heat = 3500  # J/(kg*K) — similar to water/tissue
        # Geometric approximation: elephant as a cylinder
        self.radius = (mass_kg / (1000 * np.pi * 2.0))**0.5  # ~0.89 m
        self.length = 2.0 * self.radius * 2.5  # body length
        self.surface_area = 2 * np.pi * self.radius * self.length  # ~15 m2
        self.ear_area = 2.0  # m2 (both ears combined)

    def metabolic_heat(self, activity_level=1.0):
        """Metabolic heat production (Watts). Kleiber's law: P = 70 * M^0.75"""
        basal = 70 * (self.mass)**0.75  # ~7500 W for 5000 kg
        return basal * activity_level

    def radiative_exchange(self, T_body, T_env, solar_flux=800, albedo=0.3):
        """Net radiative heat exchange (W). Stefan-Boltzmann law."""
        sigma = 5.67e-8
        emissivity = 0.95
        # Thermal radiation out
        rad_out = emissivity * sigma * self.surface_area * (T_body + 273.15)**4
        # Thermal radiation in from environment
        rad_in = emissivity * sigma * self.surface_area * (T_env + 273.15)**4
        # Solar radiation absorbed
        solar_absorbed = solar_flux * (1 - albedo) * self.surface_area * 0.3  # 30% exposed
        return rad_out - rad_in - solar_absorbed

    def convective_cooling(self, T_body, T_air, wind_speed=1.0):
        """Convective heat loss (W). Newton's law of cooling."""
        h = 10 * wind_speed**0.5  # convection coefficient
        # Body surface
        body_conv = h * self.surface_area * (T_body - T_air)
        # Ears: enhanced convection (thinner, more blood flow)
        ear_conv = h * 3 * self.ear_area * (T_body - T_air)
        return body_conv + ear_conv

    def evaporative_cooling(self, T_body, humidity, mud_wet=False):
        """Evaporative heat loss (W). Latent heat of vaporization."""
        latent_heat = 2.4e6  # J/kg water
        # Base evaporation from skin (elephants have minimal sweat glands)
        base_rate = 0.0001 * self.surface_area  # kg/s — very low
        if mud_wet:
            # Wet mud dramatically increases evaporation
            base_rate = 0.001 * self.surface_area * (1 - humidity)
        return latent_heat * base_rate

# Simulate 24 hours
model = ElephantThermalModel(mass_kg=5000)
hours = np.linspace(0, 24, 289)  # 5-minute steps
dt = 300  # seconds per step

# Environmental conditions (tropical day in Assam)
def env_temperature(hour):
    return 25 + 10 * np.sin(np.pi * (hour - 6) / 12) * (1 if 6 <= hour % 24 <= 18 else 0.3)

def solar_flux(hour):
    h = hour % 24
    if 6 < h < 18:
        return 800 * np.sin(np.pi * (h - 6) / 12)
    return 0

# Scenario 1: No cooling behavior
T_no_cool = [36.5]  # starting body temp
for i in range(1, len(hours)):
    h = hours[i]
    T_env = env_temperature(h)
    solar = solar_flux(h)
    T = T_no_cool[-1]

    Q_met = model.metabolic_heat(1.2 if 6 < h % 24 < 18 else 0.8)
    Q_rad = model.radiative_exchange(T, T_env, solar)
    Q_conv = model.convective_cooling(T, T_env, wind_speed=1.0)
    Q_evap = model.evaporative_cooling(T, 0.7, mud_wet=False)

    dQ = Q_met - Q_rad - Q_conv - Q_evap
    dT = dQ * dt / (model.mass * model.specific_heat)
    T_no_cool.append(T + dT)

# Scenario 2: Mud bath at noon and 3pm
T_mud = [36.5]
mud_active = np.zeros(len(hours))
for i in range(1, len(hours)):
    h = hours[i]
    T_env = env_temperature(h)
    solar = solar_flux(h)
    T = T_mud[-1]

    # Mud bath: 11-13h and 14-16h
    is_mud = (11 <= h % 24 <= 13) or (14 <= h % 24 <= 16)
    mud_active[i] = 1 if is_mud else 0

    albedo = 0.5 if is_mud else 0.3  # mud reflects more
    activity = 0.6 if is_mud else (1.2 if 6 < h % 24 < 18 else 0.8)

    Q_met = model.metabolic_heat(activity)
    Q_rad = model.radiative_exchange(T, T_env, solar, albedo)
    Q_conv = model.convective_cooling(T, T_env, wind_speed=0.5 if is_mud else 1.0)
    Q_evap = model.evaporative_cooling(T, 0.7, mud_wet=is_mud)

    dQ = Q_met - Q_rad - Q_conv - Q_evap
    dT = dQ * dt / (model.mass * model.specific_heat)
    T_mud.append(T + dT)

# Scenario 3: Shade only
T_shade = [36.5]
for i in range(1, len(hours)):
    h = hours[i]
    T_env = env_temperature(h)
    solar = solar_flux(h)
    T = T_shade[-1]

    is_shade = 10 <= h % 24 <= 16
    effective_solar = solar * 0.2 if is_shade else solar

    Q_met = model.metabolic_heat(0.8 if is_shade else 1.2 if 6 < h % 24 < 18 else 0.8)
    Q_rad = model.radiative_exchange(T, T_env, effective_solar)
    Q_conv = model.convective_cooling(T, T_env, wind_speed=0.5)
    Q_evap = model.evaporative_cooling(T, 0.7, mud_wet=False)

    dQ = Q_met - Q_rad - Q_conv - Q_evap
    dT = dQ * dt / (model.mass * model.specific_heat)
    T_shade.append(T + dT)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Body temperature comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(hours, T_no_cool, color='#ef4444', linewidth=2, label='No cooling')
ax.plot(hours, T_shade, color='#f59e0b', linewidth=2, label='Shade only')
ax.plot(hours, T_mud, color='#22c55e', linewidth=2, label='Mud bath')
ax.axhline(40, color='#ef4444', linestyle=':', alpha=0.5, label='Hyperthermia risk (40C)')
ax.axhline(36.5, color='gray', linestyle=':', alpha=0.5)
ax.fill_between(hours, 0, 50, where=mud_active > 0, alpha=0.1, color='#22c55e', label='Mud bath time')
ax.set_xlim(0, 24)
ax.set_ylim(35, 42)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Body temperature (C)', color='white')
ax.set_title('Elephant body temperature over 24 hours', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Environmental conditions
ax = axes[0, 1]
ax.set_facecolor('#111827')
env_temps = [env_temperature(h) for h in hours]
solar_vals = [solar_flux(h) for h in hours]
ax.plot(hours, env_temps, color='#ef4444', linewidth=2, label='Air temperature')
ax2 = ax.twinx()
ax2.plot(hours, solar_vals, color='#f59e0b', linewidth=2, label='Solar flux')
ax.set_xlim(0, 24)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Temperature (C)', color='#ef4444')
ax2.set_ylabel('Solar flux (W/m2)', color='#f59e0b')
ax.set_title('Environmental conditions (tropical Assam)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 3: Heat budget components
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Calculate heat budget for mud scenario at peak hour (1pm)
T_peak = 37.5
T_env_peak = env_temperature(13)
solar_peak = solar_flux(13)
components = {
    'Metabolic': model.metabolic_heat(0.6),
    'Radiative': -model.radiative_exchange(T_peak, T_env_peak, solar_peak, 0.5),
    'Convective': -model.convective_cooling(T_peak, T_env_peak, 0.5),
    'Evaporative': -model.evaporative_cooling(T_peak, 0.7, True),
}
colors_bar = ['#ef4444', '#3b82f6', '#f59e0b', '#22c55e']
bars = ax.bar(range(len(components)), list(components.values()), color=colors_bar, edgecolor='none')
ax.set_xticks(range(len(components)))
ax.set_xticklabels(list(components.keys()), color='white', fontsize=9)
ax.set_ylabel('Heat flow (W)', color='white')
ax.set_title('Heat budget during mud bath (1pm)', color='white', fontsize=11)
ax.axhline(0, color='gray', linestyle=':', linewidth=1)
for bar, val in zip(bars, components.values()):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height(),
            f'{val:.0f}W', ha='center', va='bottom' if val > 0 else 'top',
            color='white', fontsize=9)
ax.tick_params(colors='gray')

# Plot 4: SA:V ratio across species
ax = axes[1, 1]
ax.set_facecolor('#111827')
species = ['Mouse\\n(20g)', 'Cat\\n(4kg)', 'Human\\n(70kg)', 'Horse\\n(500kg)', 'Elephant\\n(5000kg)']
masses = [0.02, 4, 70, 500, 5000]
sav_ratios = [(3 * m / 1000)**(1/3) for m in masses]  # simplified
sav_ratios = [m**(-1/3) * 6 for m in masses]  # cube approximation
ax.bar(range(len(species)), sav_ratios, color='#a855f7', edgecolor='none')
ax.set_xticks(range(len(species)))
ax.set_xticklabels(species, color='white', fontsize=8)
ax.set_ylabel('SA:V ratio (relative)', color='white')
ax.set_title('Surface-area-to-volume ratio by species', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Thermal model results:")
print(f"  Peak temp (no cooling): {max(T_no_cool):.1f} C at hour {hours[np.argmax(T_no_cool)]:.1f}")
print(f"  Peak temp (shade only): {max(T_shade):.1f} C at hour {hours[np.argmax(T_shade)]:.1f}")
print(f"  Peak temp (mud bath):   {max(T_mud):.1f} C at hour {hours[np.argmax(T_mud)]:.1f}")
print(f"  Temperature reduction from mud bath: {max(T_no_cool) - max(T_mud):.1f} C")
print()
print("Without cooling, body temperature enters the hyperthermia danger zone.")
print("Mud baths reduce peak temperature through evaporation and solar reflection.")
print("This is why elephants MUST have access to water or mud — it is not optional.")`,
      challenge: 'Model an elephant in different climates: dry heat (40C, 20% humidity) vs. humid heat (35C, 90% humidity). In which climate is the mud bath more effective? Why does humidity matter so much for evaporative cooling?',
      successHint: 'Thermoregulation is a constraint that shapes every aspect of elephant behavior: when they eat, where they travel, how fast they move, and how social groups are organized. Understanding the physics lets you predict behavior and design conservation strategies around thermal refugia.',
    },
    {
      title: 'Evaporative cooling physics — why mud beats water',
      concept: `Evaporative cooling is the most powerful cooling mechanism available to terrestrial animals. When water transitions from liquid to vapor, it absorbs **latent heat**: 2.26 MJ per kg of water evaporated. This energy comes from the surface being cooled.

The rate of evaporation depends on:
- **Vapor pressure deficit**: the difference between the saturation vapor pressure at the surface temperature and the actual vapor pressure in the air. Higher deficit = faster evaporation.
- **Wind speed**: moving air carries away the humid boundary layer, maintaining the vapor pressure gradient.
- **Surface area**: more wet area = more evaporation.
- **Temperature**: warmer surfaces have higher saturation vapor pressure, driving faster evaporation.

**Why mud is better than plain water for elephants**:
1. **Retention time**: Water runs off quickly. Mud adheres to skin for hours, providing sustained evaporative cooling.
2. **Controlled evaporation rate**: Mud releases water slowly as it dries. This prevents rapid heat loss followed by no cooling — it spreads the benefit over time.
3. **Solar reflectance**: Dried mud is lighter in color than elephant skin, reflecting more solar radiation (higher albedo).
4. **Insect protection**: The mud layer physically blocks biting insects from reaching skin.

The Penman equation models evaporation from a wet surface:
E = (s*Rn + rho*cp*VPD/ra) / (s + gamma*(1 + rs/ra))

where s is the slope of the saturation vapor pressure curve, Rn is net radiation, VPD is vapor pressure deficit, ra is aerodynamic resistance, rs is surface resistance, and gamma is the psychrometric constant.`,
      analogy: 'Mud on an elephant works like a slow-release medication patch on human skin. A splash of water is like swallowing a pill — intense effect but short-lived. The mud patch releases its cooling effect steadily over hours. And just as a medication patch is engineered to control the release rate, the viscosity and water content of different muds control the evaporation rate.',
      storyConnection: 'The elephant in the story chooses thick, clay-rich mud over thin, watery mud. This is not random — thick mud clings better, dries slower, and provides longer-lasting cooling. Elephants in Kaziranga have been observed walking past water sources to reach specific mud wallows with the right consistency. They are selecting their thermoregulation medium with precision.',
      checkQuestion: 'On a day with 95% relative humidity, an elephant takes a mud bath but gains almost no cooling benefit. Why?',
      checkAnswer: 'At 95% humidity, the vapor pressure deficit is nearly zero. Evaporation requires a gradient — water vapor must move from the wet surface into drier air. When the air is already saturated, the mud cannot evaporate, and no latent heat is removed. This is why humid tropical heat is far more dangerous for elephants than dry desert heat. In dry air, even moderate temperatures allow efficient evaporative cooling.',
      codeIntro: 'Model the drying and cooling dynamics of a mud layer on elephant skin vs. a plain water layer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Evaporative cooling model: mud vs water on elephant skin

def saturation_vapor_pressure(T):
    """Saturation vapor pressure (kPa) using Magnus formula."""
    return 0.6108 * np.exp(17.27 * T / (T + 237.3))

def evaporation_rate(T_surface, T_air, humidity, wind_speed, is_mud=False):
    """Evaporation rate in kg/(m2*s)."""
    e_sat = saturation_vapor_pressure(T_surface)
    e_air = humidity * saturation_vapor_pressure(T_air)
    vpd = max(e_sat - e_air, 0)  # vapor pressure deficit (kPa)

    # Aerodynamic conductance
    ra = 50 / max(wind_speed, 0.1)  # s/m

    # Surface resistance (mud has higher resistance = slower evaporation)
    rs = 200 if is_mud else 10  # s/m

    # Simplified Penman-Monteith
    rho = 1.2  # air density kg/m3
    cp = 1005  # specific heat of air J/(kg*K)
    gamma = 0.066  # psychrometric constant kPa/K
    latent = 2.26e6  # J/kg

    evap = rho * cp * vpd / (ra * gamma * latent * (1 + rs/ra))
    return max(evap, 0)

# Simulate drying over 6 hours
hours = np.linspace(0, 6, 360)
dt = 60  # seconds per step (1 minute)

T_air = 35  # ambient temperature (C)
humidity = 0.6
wind = 1.5  # m/s

# Water layer: 0.5 mm thick
water_thickness = 0.0005  # meters
water_density = 1000  # kg/m3
water_mass_per_m2 = water_thickness * water_density  # 0.5 kg/m2

# Mud layer: 3 mm thick, 60% water by mass
mud_thickness = 0.003  # meters
mud_density = 1500  # kg/m3
mud_water_fraction = 0.6
mud_water_mass_per_m2 = mud_thickness * mud_density * mud_water_fraction  # 2.7 kg/m2

latent_heat = 2.26e6  # J/kg

# Simulate both
water_remaining = [water_mass_per_m2]
mud_water_remaining = [mud_water_mass_per_m2]
water_cooling = [0]  # cumulative cooling (W/m2 average)
mud_cooling = [0]
water_instant_cool = [0]
mud_instant_cool = [0]
skin_temp_water = [36.5]
skin_temp_mud = [36.5]
skin_temp_dry = [36.5]

# Skin thermal properties
skin_heat_capacity = 3500 * 50  # J/(m2*K) — 50 kg of tissue per m2 depth

for i in range(1, len(hours)):
    # Water layer
    if water_remaining[-1] > 0:
        evap_w = evaporation_rate(skin_temp_water[-1], T_air, humidity, wind, False)
        evap_w = min(evap_w, water_remaining[-1] / dt)
        water_remaining.append(max(water_remaining[-1] - evap_w * dt, 0))
        cooling_w = evap_w * latent_heat
    else:
        water_remaining.append(0)
        cooling_w = 0
    water_instant_cool.append(cooling_w)

    # Mud layer
    if mud_water_remaining[-1] > 0:
        # As mud dries, surface resistance increases
        dry_fraction = 1 - mud_water_remaining[-1] / mud_water_mass_per_m2
        evap_m = evaporation_rate(skin_temp_mud[-1], T_air, humidity, wind, True)
        evap_m *= (1 - 0.5 * dry_fraction)  # slower as it dries
        evap_m = min(evap_m, mud_water_remaining[-1] / dt)
        mud_water_remaining.append(max(mud_water_remaining[-1] - evap_m * dt, 0))
        cooling_m = evap_m * latent_heat
    else:
        mud_water_remaining.append(0)
        cooling_m = 0
    mud_instant_cool.append(cooling_m)

    # Skin temperatures
    solar_in = 400  # W/m2 absorbed
    metabolic = 50  # W/m2
    convective = 10 * wind**0.5 * (skin_temp_water[-1] - T_air)

    dT_water = (solar_in + metabolic - convective - cooling_w) * dt / skin_heat_capacity
    dT_mud = (solar_in * 0.7 + metabolic - convective - cooling_m) * dt / skin_heat_capacity  # mud reflects 30% more
    dT_dry = (solar_in + metabolic - convective) * dt / skin_heat_capacity

    skin_temp_water.append(skin_temp_water[-1] + dT_water)
    skin_temp_mud.append(skin_temp_mud[-1] + dT_mud)
    skin_temp_dry.append(skin_temp_dry[-1] + dT_dry)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Water/mud remaining
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(hours, np.array(water_remaining) * 1000, color='#3b82f6', linewidth=2, label='Water layer')
ax.plot(hours, np.array(mud_water_remaining) * 1000, color='#f59e0b', linewidth=2, label='Mud water content')
ax.set_xlabel('Hours after application', color='white')
ax.set_ylabel('Water remaining (g/m2)', color='white')
ax.set_title('Drying rate: water vs mud', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Instantaneous cooling power
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(hours, water_instant_cool, color='#3b82f6', linewidth=2, label='Water')
ax.plot(hours, mud_instant_cool, color='#f59e0b', linewidth=2, label='Mud')
ax.set_xlabel('Hours after application', color='white')
ax.set_ylabel('Cooling power (W/m2)', color='white')
ax.set_title('Instantaneous evaporative cooling', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Skin temperature
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(hours, skin_temp_dry, color='#ef4444', linewidth=2, label='Dry skin')
ax.plot(hours, skin_temp_water, color='#3b82f6', linewidth=2, label='Water-cooled')
ax.plot(hours, skin_temp_mud, color='#22c55e', linewidth=2, label='Mud-cooled')
ax.axhline(40, color='#ef4444', linestyle=':', alpha=0.5, label='Hyperthermia')
ax.set_xlabel('Hours after application', color='white')
ax.set_ylabel('Skin temperature (C)', color='white')
ax.set_title('Skin temperature comparison', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Cumulative energy removed
ax = axes[1, 1]
ax.set_facecolor('#111827')
cum_water = np.cumsum(water_instant_cool) * dt / 1000  # kJ/m2
cum_mud = np.cumsum(mud_instant_cool) * dt / 1000
ax.plot(hours, cum_water, color='#3b82f6', linewidth=2, label=f'Water: {cum_water[-1]:.0f} kJ/m2')
ax.plot(hours, cum_mud, color='#f59e0b', linewidth=2, label=f'Mud: {cum_mud[-1]:.0f} kJ/m2')
ax.set_xlabel('Hours after application', color='white')
ax.set_ylabel('Cumulative energy removed (kJ/m2)', color='white')
ax.set_title('Total cooling delivered', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

water_dry_time = hours[np.argmax(np.array(water_remaining) < 0.001)]
mud_dry_time = hours[np.argmax(np.array(mud_water_remaining) < 0.001)]
if mud_dry_time == 0: mud_dry_time = hours[-1]

print("Evaporative cooling comparison:")
print(f"  Water layer dries in: {water_dry_time:.1f} hours")
print(f"  Mud layer dries in:   {mud_dry_time:.1f} hours (or more)")
print(f"  Water total cooling:  {cum_water[-1]:.0f} kJ/m2")
print(f"  Mud total cooling:    {cum_mud[-1]:.0f} kJ/m2")
print(f"  Mud delivers {cum_mud[-1]/max(cum_water[-1],1):.1f}x more total cooling energy")
print()
print("Mud wins because it stores more water and releases it slowly.")
print("Plus it reflects solar radiation, reducing heat gain by ~30%.")`,
      challenge: 'Vary humidity from 20% to 95% and plot the total cooling delivered by mud at each humidity level. Find the humidity above which mud baths become ineffective (total cooling drops below 50% of dry-air value).',
      successHint: 'Evaporative cooling is the same physics behind air conditioning, swamp coolers, and human sweating. The elephant mud bath is a passive cooling system that requires no energy input and lasts for hours. Engineers study biological cooling to design more efficient buildings and cooling systems.',
    },
    {
      title: 'Skin as an organ — dermis, epidermis, and glands',
      concept: `Elephant skin is the largest organ of the largest land animal. It is a remarkable multi-functional barrier.

**Skin layers**:
- **Epidermis** (outer): 2-5 mm thick in elephants (10x thicker than human skin). Made of keratinized cells. The surface has a network of deep wrinkles and channels.
- **Dermis** (inner): contains blood vessels, nerves, and connective tissue. Elephants have extensive dermal vasculature for heat dissipation.
- **Hypodermis**: fat layer for insulation and energy storage.

**Key adaptations**:
- **Wrinkled surface**: Elephant skin has a fracture network of channels that retain water and mud. These cracks increase the effective surface area by 3-5x for evaporative cooling. They are not a sign of dryness — they are an evolutionary adaptation.
- **No sweat glands**: Elephants have almost no functional sweat glands. They rely entirely on external water/mud for evaporative cooling.
- **Few hair follicles**: Sparse hairs act as tactile sensors, not insulation. Each hair connects to nerve endings that detect vibrations, wind direction, and contact.
- **Thick but sensitive**: Despite being thick, elephant skin is highly innervated. They can feel a fly landing on their skin.
- **Melanin distribution**: Skin pigmentation varies. Darker areas absorb more solar radiation but also radiate heat more effectively.

The wrinkle pattern is mathematically similar to **mud crack patterns** in dried clay — they form by tensile stress as the skin grows and stretches over the expanding body. The crack spacing follows a power law related to layer thickness.`,
      analogy: 'Elephant skin wrinkles work like the texture on a sponge. A flat sponge holds little water, but a textured sponge with channels and crevices holds many times more. The wrinkles are not imperfections — they are water reservoirs. Evolution engineered the same solution that sponge manufacturers use: increase surface texture to increase fluid retention.',
      storyConnection: 'When the elephant in the story rolls in mud, the mud fills every wrinkle and channel in its skin. This is not incidental — the wrinkle network is specifically adapted to retain mud and water for extended cooling. A smooth-skinned elephant would shed mud in minutes. The wrinkled elephant stays cool for hours.',
      checkQuestion: 'If you could genetically modify an elephant to have smooth, wrinkle-free skin, what would be the thermoregulation consequences?',
      checkAnswer: 'The smooth-skinned elephant would retain 70-80% less water and mud on its surface. Evaporative cooling duration would drop from hours to minutes. The elephant would need to visit water sources 5-10x more frequently, restricting its home range. It would also be more vulnerable to sunburn (no mud protection) and parasites. The wrinkles are not cosmetic — they are critical survival infrastructure.',
      codeIntro: 'Model the fracture pattern of elephant skin wrinkles and calculate how much additional surface area they provide for evaporative cooling.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model elephant skin wrinkle patterns and their effect on water retention

# Generate a 2D wrinkle pattern using Voronoi-like tessellation
def generate_wrinkle_pattern(size=50, n_centers=200, crack_width=0.3):
    """Generate a 2D wrinkle pattern and calculate properties."""
    grid = np.zeros((size, size))

    # Random centers (growth points)
    centers_x = np.random.uniform(0, size, n_centers)
    centers_y = np.random.uniform(0, size, n_centers)

    # For each pixel, find distance to nearest center
    for i in range(size):
        for j in range(size):
            dists = np.sqrt((centers_x - i)**2 + (centers_y - j)**2)
            sorted_dists = np.sort(dists)
            # Wrinkle (crack) forms at boundaries between Voronoi cells
            # Boundary is where two nearest centers are almost equidistant
            diff = sorted_dists[1] - sorted_dists[0]
            if diff < crack_width:
                grid[i, j] = 1  # crack
            else:
                grid[i, j] = 0  # smooth skin

    return grid, centers_x, centers_y

# Generate patterns with different wrinkle densities
sizes = [50, 50, 50]
densities = [50, 200, 500]  # number of growth centers
names = ['Young elephant\n(few wrinkles)', 'Adult elephant\n(moderate)', 'Old elephant\n(dense wrinkles)']

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

crack_fractions = []
surface_area_multipliers = []

for col, (n_centers, name) in enumerate(zip(densities, names)):
    pattern, cx, cy = generate_wrinkle_pattern(sizes[col], n_centers)

    # Calculate crack fraction
    crack_frac = pattern.sum() / pattern.size
    crack_fractions.append(crack_frac)

    # Surface area multiplier: cracks add depth
    crack_depth = 2.0  # mm average crack depth
    # Each crack pixel adds 2 * depth to the surface area (both walls)
    sa_multiplier = 1 + 2 * crack_depth * crack_frac / 1.0  # per unit flat area
    surface_area_multipliers.append(sa_multiplier)

    # Plot pattern
    ax = axes[0, col]
    ax.set_facecolor('#111827')
    ax.imshow(pattern, cmap='bone_r', interpolation='nearest')
    ax.set_title(f'{name}\nCrack fraction: {crack_frac:.1%}', color='white', fontsize=10)
    ax.set_xticks([])
    ax.set_yticks([])

# Plot 4: Water retention model
ax = axes[1, 0]
ax.set_facecolor('#111827')
crack_depths = np.linspace(0, 5, 50)  # mm
crack_widths_avg = [0.5, 1.0, 2.0]  # mm
colors = ['#22c55e', '#3b82f6', '#a855f7']

for width, color in zip(crack_widths_avg, colors):
    # Water volume per m2 of skin = crack_fraction * depth * width * crack_length_per_m2
    # Simplified: retention = crack_depth * crack_fraction * density_factor
    crack_frac = 0.15  # typical adult
    crack_length_density = 500  # meters of crack per m2 of skin
    retention = crack_depths * width * crack_length_density / 1e6  # liters/m2
    ax.plot(crack_depths, retention * 1000, color=color, linewidth=2,
            label=f'Width {width} mm')

ax.set_xlabel('Crack depth (mm)', color='white')
ax.set_ylabel('Water retention (mL/m2)', color='white')
ax.set_title('Water retained in skin wrinkles', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Cooling duration vs wrinkle density
ax = axes[1, 1]
ax.set_facecolor('#111827')
wrinkle_densities = np.linspace(50, 800, 50)
cooling_durations = []
for n in wrinkle_densities:
    # More wrinkles = more water retained = longer cooling
    crack_frac = min(0.3, n / 2000)
    water_per_m2 = crack_frac * 2.0 * 500 / 1e6 * 1.0  # kg/m2
    total_water = water_per_m2 * 15  # 15 m2 skin
    evap_rate = 0.0005  # kg/m2/s at moderate conditions
    duration_hours = water_per_m2 / evap_rate / 3600
    cooling_durations.append(duration_hours)

ax.plot(wrinkle_densities, cooling_durations, color='#22c55e', linewidth=2)
ax.set_xlabel('Wrinkle density (cracks per m2)', color='white')
ax.set_ylabel('Cooling duration (hours)', color='white')
ax.set_title('Wrinkle density vs cooling time', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Surface area multiplier comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
bars = ax.bar(range(3), surface_area_multipliers, color=['#3b82f6', '#22c55e', '#f59e0b'],
              edgecolor='none', width=0.6)
ax.set_xticks(range(3))
ax.set_xticklabels(['Young', 'Adult', 'Old'], color='white')
ax.set_ylabel('Surface area multiplier', color='white')
ax.set_title('Effective skin surface area', color='white', fontsize=11)
for bar, val in zip(bars, surface_area_multipliers):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
            f'{val:.2f}x', ha='center', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Elephant skin wrinkle analysis:")
for i, name in enumerate(['Young', 'Adult', 'Old']):
    print(f"  {name}: crack fraction = {crack_fractions[i]:.1%}, SA multiplier = {surface_area_multipliers[i]:.2f}x")
print()
print(f"An adult elephant's wrinkles increase effective surface area by ~{surface_area_multipliers[1]:.1f}x")
print("This means ~{:.0f}% more water retention and evaporative cooling.".format((surface_area_multipliers[1]-1)*100))
print("Wrinkles are not aging — they are a thermoregulation adaptation.")`,
      challenge: 'Model how wrinkle depth varies across body regions (ears: shallow, back: deep, belly: moderate) and calculate the total water retention for the whole body. Which region contributes most to cooling?',
      successHint: 'A 2019 paper in Nature Communications showed that elephant skin cracks follow the same fracture mechanics as drying mud. The pattern is not genetically encoded directly — it emerges from mechanical stress in growing skin. Biology and physics produce the same solutions to the same problems.',
    },
    {
      title: 'Parasite ecology — the arms race on elephant skin',
      concept: `Elephants host a diverse community of ectoparasites — organisms that live on the external surface. The mud bath is a key defense mechanism against these parasites.

**Common elephant ectoparasites**:
- **Ticks** (Ixodidae): blood-feeding arachnids that can transmit diseases. Elephants can carry hundreds of ticks, especially in skin folds.
- **Lice** (Haematomyzus elephantis): elephant-specific lice that feed on blood and skin secretions.
- **Bot flies** (Oestridae): larvae burrow into skin and develop internally.
- **Mosquitoes and biting flies**: temporary parasites that take blood meals and can transmit diseases.

**Parasite population dynamics** follow the Lotka-Volterra predator-prey model adapted for host-parasite systems:

dP/dt = r*P*(1 - P/K) - mu*P - d*P*B

where P is parasite population, r is reproduction rate, K is carrying capacity (limited by host skin area), mu is natural mortality, d is removal rate, and B is the frequency of mud bathing or grooming.

**The mud bath defense**:
- Physical barrier: dried mud prevents new parasites from reaching skin
- Suffocation: mud clogs the breathing apparatus of ticks and lice
- Mechanical removal: as mud dries and flakes off, attached parasites are pulled off too
- Chemical deterrence: some mud types contain minerals or compounds that repel insects

This creates an evolutionary arms race: parasites evolve to resist removal, while elephant behavior and skin morphology evolve to enhance removal efficiency.`,
      analogy: 'The mud bath is like an ancient castle defense system. The mud layer is the moat and wall — it prevents new attackers (parasites) from landing. As the mud dries and cracks, pieces fall off carrying parasites with them — like defenders pushing siege ladders off the walls. Regular re-application (multiple mud baths per day) is like maintaining the fortifications. Neglect them and the castle is overrun.',
      storyConnection: 'The elephant in the story shakes off dried mud, and we can imagine ticks and flies falling with it. This is not just grooming — it is a parasite control strategy that has been refined over millions of years. Each mud bath episode resets the parasite load, keeping it below the level that causes disease.',
      checkQuestion: 'If an elephant is prevented from mud bathing for a month (e.g., in captivity without mud access), predict what happens to its ectoparasite load using the population dynamics model.',
      checkAnswer: 'Without mud bathing, the removal term (d*P*B) drops to near zero. The parasite population grows logistically toward carrying capacity K, limited only by natural mortality and available skin space. We would expect a 5-10x increase in tick load within weeks. This actually happens in captive elephants without mud access — they develop chronic skin infections, allergies, and behavioral distress. Mud is not a luxury; it is healthcare.',
      codeIntro: 'Model parasite population dynamics on elephant skin with and without mud bath interventions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Host-parasite population dynamics on elephant skin

def simulate_parasites(days, mud_frequency, initial_pop=50):
    """
    Simulate ectoparasite population on an elephant.
    mud_frequency: mud baths per day (0 = none, 2 = twice daily)
    """
    dt = 0.01  # days
    steps = int(days / dt)

    P = np.zeros(steps)
    P[0] = initial_pop

    # Parasite parameters
    r = 0.15       # intrinsic growth rate (per day)
    K = 500        # carrying capacity (max parasites)
    mu = 0.02      # natural mortality rate
    d = 0.3        # removal effectiveness per mud bath
    recolonization = 5  # new parasites per day from environment

    # Mud bath effect: periodic impulse
    mud_interval = 1.0 / max(mud_frequency, 0.01)  # days between baths
    next_mud = mud_interval

    for i in range(1, steps):
        t = i * dt

        # Logistic growth + immigration - mortality
        dP = r * P[i-1] * (1 - P[i-1] / K) + recolonization - mu * P[i-1]

        P[i] = max(P[i-1] + dP * dt, 0)

        # Mud bath events (discrete removal)
        if mud_frequency > 0 and t >= next_mud:
            P[i] *= (1 - d)  # remove fraction d of parasites
            next_mud += mud_interval

    time = np.arange(steps) * dt
    return time, P

# Simulate different mud bath frequencies
frequencies = [0, 0.5, 1, 2, 3]
freq_labels = ['No mud bath', '1 per 2 days', '1 per day', '2 per day', '3 per day']
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Parasite population over 60 days
ax = axes[0, 0]
ax.set_facecolor('#111827')
final_pops = []
for freq, label, color in zip(frequencies, freq_labels, colors):
    time, pop = simulate_parasites(60, freq)
    ax.plot(time, pop, color=color, linewidth=1.5, label=label)
    final_pops.append(pop[-1])
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Parasite count', color='white')
ax.set_title('Parasite population dynamics', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Equilibrium parasite load vs mud frequency
ax = axes[0, 1]
ax.set_facecolor('#111827')
test_freqs = np.linspace(0, 5, 50)
equil_pops = []
for f in test_freqs:
    _, pop = simulate_parasites(120, f)
    equil_pops.append(np.mean(pop[-1000:]))

ax.plot(test_freqs, equil_pops, color='#22c55e', linewidth=2)
ax.set_xlabel('Mud baths per day', color='white')
ax.set_ylabel('Equilibrium parasite count', color='white')
ax.set_title('Parasite control vs bathing frequency', color='white', fontsize=11)
# Mark diminishing returns
ax.axhline(50, color='#f59e0b', linestyle='--', linewidth=1, label='Low-impact threshold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Multi-parasite species competition
ax = axes[1, 0]
ax.set_facecolor('#111827')

# Simulate 3 parasite species with different traits
n_days = 90
dt = 0.1
steps = int(n_days / dt)
time = np.arange(steps) * dt

species = {
    'Ticks': {'r': 0.08, 'K': 200, 'mu': 0.01, 'mud_vuln': 0.4, 'color': '#ef4444'},
    'Lice': {'r': 0.2, 'K': 300, 'mu': 0.05, 'mud_vuln': 0.2, 'color': '#f59e0b'},
    'Flies': {'r': 0.5, 'K': 100, 'mu': 0.15, 'mud_vuln': 0.8, 'color': '#3b82f6'},
}

mud_freq = 1.5  # baths per day
mud_interval = 1.0 / mud_freq
next_mud = mud_interval

pops = {name: np.zeros(steps) for name in species}
for name in species:
    pops[name][0] = 20

for i in range(1, steps):
    t = i * dt
    is_mud = False
    if t >= next_mud:
        is_mud = True
        next_mud += mud_interval

    for name, params in species.items():
        P = pops[name][i-1]
        dP = params['r'] * P * (1 - P / params['K']) + 2 - params['mu'] * P
        pops[name][i] = max(P + dP * dt, 0)
        if is_mud:
            pops[name][i] *= (1 - params['mud_vuln'])

for name, params in species.items():
    ax.plot(time, pops[name], color=params['color'], linewidth=1.5, label=name)
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Multi-species parasite dynamics (1.5 baths/day)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Health impact model
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Health score decreases with parasite load
total_load_range = np.linspace(0, 800, 100)
# Each parasite contributes to: blood loss, infection risk, energy cost
blood_loss = 0.1 * total_load_range  # mL/day
infection_risk = 1 - np.exp(-0.005 * total_load_range)
energy_cost = 0.5 * total_load_range  # kcal/day from immune response
health_score = 100 * np.exp(-0.003 * total_load_range)

ax.plot(total_load_range, health_score, color='#22c55e', linewidth=2, label='Health score')
ax.fill_between(total_load_range, 0, health_score, alpha=0.1, color='#22c55e')
ax.axvline(100, color='#f59e0b', linestyle='--', label='Typical (with mud)')
ax.axvline(400, color='#ef4444', linestyle='--', label='No mud access')
ax.set_xlabel('Total ectoparasite load', color='white')
ax.set_ylabel('Health score (0-100)', color='white')
ax.set_title('Parasite load vs elephant health', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Parasite ecology summary:")
print(f"{'Mud frequency':<20} {'Equilibrium parasites':>22}")
print("-" * 44)
for label, pop in zip(freq_labels, final_pops):
    print(f"{label:<20} {pop:>20.0f}")
print()
print("Key findings:")
print("  1. Without mud baths, parasites reach carrying capacity (~500)")
print("  2. Even one daily mud bath reduces load by >60%")
print("  3. Diminishing returns above 2-3 baths/day")
print("  4. Different species respond differently to mud removal")`,
      challenge: 'Add a seasonal component: parasite reproduction rate doubles during the monsoon (warm, humid). Model how the elephant should adjust its mud bath frequency seasonally to maintain a constant parasite load.',
      successHint: 'Parasite ecology is a window into coevolution. Every defense the elephant evolves, parasites counter-evolve against. The mud bath is an arms race strategy that works because it is a general-purpose mechanical defense — parasites cannot evolve resistance to being physically removed.',
    },
    {
      title: 'Elephant social behavior and communication — herds as information networks',
      concept: `Elephants have the most complex social structures of any land mammal. Understanding their social behavior reveals principles of **network theory**, **information transfer**, and **collective decision-making**.

**Social structure**:
- **Matriarchal family units**: 6-12 related females led by the oldest female (matriarch). She holds decades of ecological knowledge.
- **Bond groups**: 2-5 family units that associate regularly. Shared knowledge and mutual defense.
- **Clans**: larger aggregations of bond groups that share a home range.
- **Males**: leave family at 12-15 years. Form loose bachelor groups. Periodically enter musth (hormonal state for mating).

**Communication modalities**:
- **Vocalizations**: rumbles (infrasonic, 14-35 Hz), trumpets, roars. Infrasound travels 10+ km.
- **Seismic signals**: foot stomping creates ground vibrations detectable by other elephants through their feet (Rayleigh waves).
- **Chemical signals**: pheromones in urine, temporal gland secretions, and breath.
- **Tactile**: trunk touching, body rubbing, ear flapping.
- **Visual**: body posture, ear position, tail position.

**Network analysis of elephant herds**:
- Elephants form **scale-free networks** where the matriarch has many connections (hub node).
- Information spreads through the network following **cascade dynamics** — the matriarch's alarm call triggers immediate response in the whole group.
- The network is **resilient** — removal of peripheral individuals has little effect, but loss of the matriarch can cause group fragmentation.`,
      analogy: 'An elephant herd is like a well-run corporation. The matriarch is the CEO — she makes strategic decisions (where to migrate, when to flee). Bond group leaders are department heads. Each elephant is an employee with a role. Communication flows through the hierarchy but also laterally (elephants share information with peers). When the CEO is removed, the whole organization suffers — just like when a matriarch is poached, the family may split and lose critical survival knowledge.',
      storyConnection: 'The mud bath in the story is a social event. Elephants do not just cool individually — they communicate, bond, and share information at the wallow. Calves learn the location of water sources. Families meet bond group members. The mud wallow is simultaneously a thermoregulation station, a pharmacy (parasite control), and a social club.',
      checkQuestion: 'A herd of 20 elephants approaches a mud wallow that can comfortably hold 10. What social behaviors would you predict based on the hierarchical social structure?',
      checkAnswer: 'The matriarch and her closest family members would access the wallow first (dominance hierarchy). Calves would be given priority by their mothers (kin selection). Lower-ranking females and juveniles would wait on the periphery. Bachelor males, if present, would wait until the family unit finishes. Access would not be random or first-come-first-served — it would follow the social network structure. This is actually observed in field studies.',
      codeIntro: 'Model an elephant social network and simulate information propagation (alarm calls) through the herd.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Elephant social network model

class ElephantNetwork:
    def __init__(self, n_elephants=25):
        self.n = n_elephants
        # Assign roles
        self.roles = []
        self.ages = []
        self.families = []

        # Create family structure
        family_id = 0
        i = 0
        while i < n_elephants:
            # Matriarch
            self.roles.append('matriarch')
            self.ages.append(np.random.randint(40, 60))
            self.families.append(family_id)
            i += 1

            # Family members (3-6 per family)
            n_members = min(np.random.randint(3, 7), n_elephants - i)
            for _ in range(n_members):
                if np.random.random() < 0.3:
                    self.roles.append('juvenile')
                    self.ages.append(np.random.randint(2, 12))
                else:
                    self.roles.append('female')
                    self.ages.append(np.random.randint(15, 40))
                self.families.append(family_id)
                i += 1
            family_id += 1

        self.n = len(self.roles)  # actual count
        self.roles = np.array(self.roles)
        self.ages = np.array(self.ages)
        self.families = np.array(self.families)

        # Build adjacency matrix
        self.adj = np.zeros((self.n, self.n))
        for i in range(self.n):
            for j in range(i+1, self.n):
                # Same family: strong connection
                if self.families[i] == self.families[j]:
                    self.adj[i, j] = self.adj[j, i] = np.random.uniform(0.7, 1.0)
                # Matriarch-to-matriarch: moderate (bond group)
                elif self.roles[i] == 'matriarch' and self.roles[j] == 'matriarch':
                    self.adj[i, j] = self.adj[j, i] = np.random.uniform(0.2, 0.5)
                # Cross-family: weak
                else:
                    if np.random.random() < 0.1:
                        self.adj[i, j] = self.adj[j, i] = np.random.uniform(0.05, 0.2)

    def propagate_signal(self, source, threshold=0.3, max_steps=10):
        """Simulate information cascade from source elephant."""
        reached = np.zeros(self.n, dtype=bool)
        reached[source] = True
        activation_time = np.full(self.n, -1)
        activation_time[source] = 0

        signal_strength = np.zeros(self.n)
        signal_strength[source] = 1.0

        history = [reached.copy()]

        for step in range(1, max_steps):
            new_reached = reached.copy()
            for i in range(self.n):
                if reached[i]:
                    continue
                # Sum of signals from reached neighbors
                incoming = np.sum(self.adj[i, :] * signal_strength * reached)
                if incoming > threshold:
                    new_reached[i] = True
                    activation_time[i] = step
                    signal_strength[i] = min(incoming, 1.0)

            if np.array_equal(new_reached, reached):
                break  # no new activations
            reached = new_reached
            history.append(reached.copy())

        return activation_time, history

# Create network
net = ElephantNetwork(25)

# Find a matriarch for signal source
matriarch_idx = np.where(net.roles == 'matriarch')[0][0]

# Propagate alarm from matriarch
activation_time, history = net.propagate_signal(matriarch_idx)

# Also try from a random juvenile
juvenile_idx = np.where(net.roles == 'juvenile')[0]
if len(juvenile_idx) > 0:
    act_time_juv, hist_juv = net.propagate_signal(juvenile_idx[0])

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Social network visualization
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Layout using spring embedding (simplified)
angles = np.linspace(0, 2 * np.pi, net.n, endpoint=False)
# Group by family
x_pos = np.zeros(net.n)
y_pos = np.zeros(net.n)
for fam in np.unique(net.families):
    members = np.where(net.families == fam)[0]
    center_angle = 2 * np.pi * fam / (net.families.max() + 1)
    cx, cy = 3 * np.cos(center_angle), 3 * np.sin(center_angle)
    for k, m in enumerate(members):
        a = center_angle + (k - len(members)/2) * 0.3
        r = 1.0 + 0.3 * k
        x_pos[m] = cx + r * np.cos(a) * 0.5
        y_pos[m] = cy + r * np.sin(a) * 0.5

# Draw edges
for i in range(net.n):
    for j in range(i+1, net.n):
        if net.adj[i, j] > 0.1:
            ax.plot([x_pos[i], x_pos[j]], [y_pos[i], y_pos[j]],
                    color='gray', alpha=net.adj[i, j] * 0.5, linewidth=net.adj[i, j] * 2)

# Draw nodes
role_colors = {'matriarch': '#ef4444', 'female': '#22c55e', 'juvenile': '#3b82f6'}
role_sizes = {'matriarch': 150, 'female': 80, 'juvenile': 50}
for role in ['juvenile', 'female', 'matriarch']:
    mask = net.roles == role
    ax.scatter(x_pos[mask], y_pos[mask], s=role_sizes[role], c=role_colors[role],
               label=role.capitalize(), edgecolors='white', linewidths=0.5, zorder=5)

ax.set_title('Elephant social network', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xticks([])
ax.set_yticks([])

# Plot 2: Information cascade timing
ax = axes[0, 1]
ax.set_facecolor('#111827')
reached_per_step = [h.sum() for h in history]
if len(juvenile_idx) > 0:
    reached_per_step_juv = [h.sum() for h in hist_juv]
    ax.plot(range(len(reached_per_step_juv)), reached_per_step_juv,
            'o-', color='#3b82f6', linewidth=2, label='From juvenile')
ax.plot(range(len(reached_per_step)), reached_per_step,
        'o-', color='#ef4444', linewidth=2, label='From matriarch')
ax.set_xlabel('Time steps', color='white')
ax.set_ylabel('Elephants reached', color='white')
ax.set_title('Information cascade speed', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Degree distribution
ax = axes[1, 0]
ax.set_facecolor('#111827')
degrees = (net.adj > 0.1).sum(axis=1)
for role, color in role_colors.items():
    mask = net.roles == role
    if mask.sum() > 0:
        ax.hist(degrees[mask], bins=range(0, int(degrees.max())+2), alpha=0.6,
                color=color, label=role.capitalize(), edgecolor='none')
ax.set_xlabel('Number of connections', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Degree distribution by role', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Network resilience (remove individuals and measure connectivity)
ax = axes[1, 1]
ax.set_facecolor('#111827')

def network_connectivity(adj_matrix):
    """Measure: fraction of pairs that can reach each other."""
    n = len(adj_matrix)
    reachable = adj_matrix > 0.1
    # Floyd-Warshall-like propagation
    for k in range(min(n, 5)):
        reachable = reachable | (reachable @ reachable)
    return reachable.sum() / (n * (n - 1))

base_connectivity = network_connectivity(net.adj)

# Remove by role
removal_results = {'Random': [], 'Matriarchs first': [], 'Juveniles first': []}
for frac in np.linspace(0, 0.4, 10):
    n_remove = max(1, int(frac * net.n))

    # Random removal
    remove_idx = np.random.choice(net.n, n_remove, replace=False)
    adj_mod = net.adj.copy()
    adj_mod[remove_idx, :] = 0
    adj_mod[:, remove_idx] = 0
    removal_results['Random'].append(network_connectivity(adj_mod))

    # Matriarch-first removal
    matriarch_indices = np.where(net.roles == 'matriarch')[0]
    other_indices = np.where(net.roles != 'matriarch')[0]
    remove_idx = np.concatenate([matriarch_indices, other_indices])[:n_remove]
    adj_mod = net.adj.copy()
    adj_mod[remove_idx, :] = 0
    adj_mod[:, remove_idx] = 0
    removal_results['Matriarchs first'].append(network_connectivity(adj_mod))

    # Juvenile-first removal
    juv_indices = np.where(net.roles == 'juvenile')[0]
    other_indices = np.where(net.roles != 'juvenile')[0]
    remove_idx = np.concatenate([juv_indices, other_indices])[:n_remove]
    adj_mod = net.adj.copy()
    adj_mod[remove_idx, :] = 0
    adj_mod[:, remove_idx] = 0
    removal_results['Juveniles first'].append(network_connectivity(adj_mod))

fracs = np.linspace(0, 0.4, 10)
for strategy, color in [('Random', '#f59e0b'), ('Matriarchs first', '#ef4444'), ('Juveniles first', '#3b82f6')]:
    ax.plot(fracs * 100, removal_results[strategy], 'o-', color=color, linewidth=2, label=strategy)
ax.set_xlabel('% of herd removed', color='white')
ax.set_ylabel('Network connectivity', color='white')
ax.set_title('Network resilience to removal', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Social network analysis:")
print(f"  Herd size: {net.n}")
print(f"  Families: {net.families.max() + 1}")
print(f"  Matriarchs: {(net.roles == 'matriarch').sum()}")
matriarch_from = (activation_time >= 0).sum()
juvenile_from = (act_time_juv >= 0).sum() if len(juvenile_idx) > 0 else 0
print(f"  Signal from matriarch reaches: {matriarch_from}/{net.n} elephants")
print(f"  Signal from juvenile reaches:  {juvenile_from}/{net.n} elephants")
print()
print("Matriarchs are hub nodes. Removing them fragments the network.")
print("This is why poaching of matriarchs is so devastating to elephant herds.")`,
      challenge: 'Add a "knowledge" attribute to each elephant (e.g., location of water sources). Simulate knowledge transfer through the network over 100 time steps. Which elephants end up with the most knowledge? How does removing the matriarch affect group knowledge?',
      successHint: 'Social network analysis is used to study everything from elephant herds to human organizations to the spread of diseases. The math is identical — only the nodes and edges change. Understanding elephant social networks directly informs conservation strategy: protect the matriarchs, protect the network.',
    },
    {
      title: 'Infrasound — communication below human hearing',
      concept: `Elephants communicate using **infrasound** — sound waves below the 20 Hz threshold of human hearing. These low-frequency vocalizations can travel over 10 km through both air and ground.

**Physics of infrasound propagation**:
- **Frequency range**: 14-35 Hz for elephant rumbles (human hearing: 20-20,000 Hz)
- **Wavelength**: at 20 Hz, wavelength = 340/20 = 17 meters. Long wavelengths diffract around obstacles (trees, hills) that would block higher frequencies.
- **Atmospheric attenuation**: Low frequencies attenuate much less than high frequencies. At 20 Hz, attenuation is ~0.001 dB/km. At 4000 Hz (bird song), it is ~4 dB/km. This is why infrasound travels so far.
- **Ground coupling**: Elephant foot stomps generate Rayleigh surface waves (seismic waves) that travel at ~250 m/s through soil. Other elephants detect these vibrations through specialized receptors in their feet (Pacinian corpuscles).
- **Temperature inversion**: At dawn and dusk, temperature inversions create an acoustic duct near the ground that channels infrasound even further — possibly 30+ km.

**Detection mechanisms**:
- **Ears**: Elephants have massive ear canals tuned to low frequencies. The large pinna (ear flap) acts as a directional antenna.
- **Feet**: Bone conduction through the legs to the inner ear. Elephants sometimes freeze with one foot lifted — they are "listening" through the ground.
- **Trunk**: Sensitive to vibrations placed against the ground.

The combination of airborne and seismic infrasound creates a redundant communication channel that works across distances no other land animal can match.`,
      analogy: 'Infrasound is like a radio frequency that only elephants can tune into. Just as AM radio (low frequency) travels farther than FM radio (high frequency) and can be received over mountains and through buildings, elephant infrasound passes through forests and over hills that would block bird songs or monkey calls. The elephant is broadcasting on a channel with almost no interference and very long range.',
      storyConnection: 'When the elephant in the story takes its mud bath, it might also be communicating with herds kilometers away through low rumbles that humans cannot hear. The mud wallow might serve as a "broadcast station" — a location where the ground is wet and soft, perhaps transmitting seismic signals differently. The story captures one visible behavior, but the invisible communication network extends far beyond what any observer can detect.',
      checkQuestion: 'Two elephant herds are 8 km apart. Herd A sends an infrasonic contact call at dawn. Would Herd B detect it? What if the call was sent at noon instead?',
      checkAnswer: 'At dawn, a temperature inversion likely exists near the ground (cool surface air under warmer air above). This creates an acoustic waveguide that channels infrasound along the ground surface, greatly reducing attenuation. Herd B would likely detect the call. At noon, the ground is hot and air temperature decreases with altitude — the opposite gradient, which refracts sound upward away from the ground. The call would attenuate faster and might not reach 8 km. This is why elephants are observed to call more at dawn and dusk.',
      codeIntro: 'Model infrasound propagation, comparing atmospheric conditions and demonstrating why elephants communicate at specific times of day.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Infrasound propagation model

def atmospheric_attenuation(frequency, distance_km, temperature=20, humidity=50):
    """Atmospheric absorption of sound (dB) — simplified ISO 9613-1."""
    # Low frequencies have dramatically less attenuation
    f = frequency
    T = temperature + 273.15
    h = humidity

    # Simplified absorption coefficient (dB/km)
    # Very rough approximation capturing the frequency dependence
    alpha = 0.001 * (f / 100)**1.7 * (1 + 0.01 * h) * (293.15 / T)**0.5
    return alpha * distance_km

def geometric_spreading(distance_m, source_level_dB=100):
    """Geometric spreading loss (spherical, then cylindrical in duct)."""
    if distance_m < 1:
        distance_m = 1
    return source_level_dB - 20 * np.log10(distance_m)

def temperature_inversion_gain(distance_km, has_inversion=True):
    """Additional gain from temperature inversion ducting."""
    if has_inversion:
        # Cylindrical spreading instead of spherical after ~1 km
        return min(10, 5 * np.log10(max(distance_km, 0.1)))
    return 0

# Compare different frequencies
frequencies = [15, 20, 30, 100, 500, 2000, 5000]  # Hz
distances = np.linspace(0.1, 20, 200)  # km
source_level = 103  # dB SPL (measured for elephant rumbles)
detection_threshold = 40  # dB SPL (approximate elephant hearing threshold at these frequencies)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Sound level vs distance for different frequencies
ax = axes[0, 0]
ax.set_facecolor('#111827')
freq_colors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#ec4899', '#6b7280']
max_distances = []
for f, color in zip(frequencies, freq_colors):
    levels = []
    for d in distances:
        geom = geometric_spreading(d * 1000, source_level)
        atm = atmospheric_attenuation(f, d)
        level = geom - atm
        levels.append(level)
    levels = np.array(levels)
    ax.plot(distances, levels, color=color, linewidth=1.5, label=f'{f} Hz')
    # Find max detection distance
    above = np.where(levels >= detection_threshold)[0]
    max_dist = distances[above[-1]] if len(above) > 0 else 0
    max_distances.append(max_dist)

ax.axhline(detection_threshold, color='gray', linestyle='--', linewidth=1, label='Detection threshold')
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Sound level (dB SPL)', color='white')
ax.set_title('Sound propagation by frequency', color='white', fontsize=10)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)
ax.tick_params(colors='gray')

# Plot 2: Maximum detection distance by frequency
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.bar(range(len(frequencies)), max_distances, color=freq_colors, edgecolor='none')
ax.set_xticks(range(len(frequencies)))
ax.set_xticklabels([f'{f} Hz' for f in frequencies], color='white', fontsize=8, rotation=45)
ax.set_ylabel('Max detection distance (km)', color='white')
ax.set_title('Why elephants use infrasound', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 3: Dawn vs noon comparison (temperature inversion effect)
ax = axes[0, 2]
ax.set_facecolor('#111827')
f_elephant = 20  # Hz

dawn_levels = []
noon_levels = []
for d in distances:
    geom = geometric_spreading(d * 1000, source_level)
    atm = atmospheric_attenuation(f_elephant, d, temperature=18, humidity=80)
    dawn_level = geom - atm + temperature_inversion_gain(d, True)
    dawn_levels.append(dawn_level)

    atm_noon = atmospheric_attenuation(f_elephant, d, temperature=35, humidity=40)
    noon_level = geom - atm_noon + temperature_inversion_gain(d, False)
    noon_levels.append(noon_level)

ax.plot(distances, dawn_levels, color='#3b82f6', linewidth=2, label='Dawn (inversion)')
ax.plot(distances, noon_levels, color='#ef4444', linewidth=2, label='Noon (no inversion)')
ax.axhline(detection_threshold, color='gray', linestyle='--', linewidth=1)
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Sound level (dB SPL)', color='white')
ax.set_title(f'Dawn vs noon ({f_elephant} Hz elephant rumble)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Seismic wave propagation
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Rayleigh wave speed and attenuation through different soils
soil_types = ['Wet clay', 'Sandy soil', 'Hard rock', 'Mud/wallow']
rayleigh_speeds = [150, 250, 500, 100]  # m/s
rayleigh_atten = [0.5, 0.3, 0.1, 0.8]  # dB/m (much higher than air)

seismic_distances = np.linspace(0, 2000, 200)  # meters
source_seismic = 90  # dB

for soil, speed, atten, color in zip(soil_types, rayleigh_speeds, rayleigh_atten,
                                      ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7']):
    levels = source_seismic - 10 * np.log10(np.maximum(seismic_distances, 1)) - atten * seismic_distances / 100
    ax.plot(seismic_distances, levels, color=color, linewidth=2, label=f'{soil} ({speed} m/s)')

ax.axhline(30, color='gray', linestyle='--', linewidth=1, label='Foot detection threshold')
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Seismic level (dB)', color='white')
ax.set_title('Seismic (ground) wave propagation', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Communication range map (top-down view)
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simulated landscape with elephant positions
n_herds = 5
herd_x = np.random.uniform(-15, 15, n_herds)
herd_y = np.random.uniform(-15, 15, n_herds)

# Draw communication ranges
theta = np.linspace(0, 2 * np.pi, 100)
for i in range(n_herds):
    # Dawn range: ~10 km
    ax.plot(herd_x[i] + 10 * np.cos(theta), herd_y[i] + 10 * np.sin(theta),
            color='#3b82f6', alpha=0.3, linewidth=1)
    # Noon range: ~4 km
    ax.plot(herd_x[i] + 4 * np.cos(theta), herd_y[i] + 4 * np.sin(theta),
            color='#ef4444', alpha=0.3, linewidth=1)
    ax.scatter(herd_x[i], herd_y[i], s=100, c='#22c55e', zorder=5)
    ax.annotate(f'Herd {i+1}', (herd_x[i]+0.5, herd_y[i]+0.5), color='white', fontsize=8)

# Draw connections (herds within range)
for i in range(n_herds):
    for j in range(i+1, n_herds):
        dist = np.sqrt((herd_x[i]-herd_x[j])**2 + (herd_y[i]-herd_y[j])**2)
        if dist < 10:
            ax.plot([herd_x[i], herd_x[j]], [herd_y[i], herd_y[j]],
                    color='#3b82f6', alpha=0.4, linestyle='--')
        if dist < 4:
            ax.plot([herd_x[i], herd_x[j]], [herd_y[i], herd_y[j]],
                    color='#22c55e', alpha=0.6, linewidth=2)

ax.set_xlim(-20, 20)
ax.set_ylim(-20, 20)
ax.set_xlabel('km', color='white')
ax.set_ylabel('km', color='white')
ax.set_title('Communication range map\\n(blue=dawn, red=noon)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Plot 6: Frequency spectrum of elephant call
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Simulate elephant rumble spectrum
freqs = np.linspace(1, 200, 1000)
# Fundamental at 15 Hz + harmonics
spectrum = np.zeros_like(freqs)
for harmonic in [15, 30, 45, 60]:
    spectrum += (1.0 / (harmonic/15)) * np.exp(-((freqs - harmonic)**2) / (2 * 3**2))
# Add some broadband noise
spectrum += 0.05 * np.random.random(len(freqs))

ax.plot(freqs, spectrum, color='#22c55e', linewidth=1.5)
ax.fill_between(freqs, 0, spectrum, alpha=0.2, color='#22c55e')
ax.axvline(20, color='#ef4444', linestyle='--', linewidth=1, label='Human hearing limit (20 Hz)')
ax.axvspan(0, 20, alpha=0.1, color='#ef4444', label='Infrasonic range')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Elephant rumble frequency spectrum', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Infrasound propagation analysis:")
print(f"{'Frequency':<12} {'Max detection distance':>24}")
print("-" * 38)
for f, d in zip(frequencies, max_distances):
    print(f"{f:>8} Hz {d:>22.1f} km")
print()
print(f"Dawn advantage: infrasound travels ~{max(dawn_levels)/max(noon_levels)*100-100:.0f}% farther at dawn")
print("This explains why elephants vocalize most at dawn and dusk.")
print("The physics of low-frequency sound creates a private communication channel.")`,
      challenge: 'Model a relay system: Herd A sends a call, Herd B receives it and re-broadcasts, Herd C receives the relay. Calculate the maximum total distance for a relayed message vs. a single call. How many relay hops could span 50 km?',
      successHint: 'Infrasound research has practical applications beyond elephant biology. Infrasound monitoring is used to detect nuclear tests, volcanic eruptions, and meteorite impacts. The same physics that lets elephants talk across savannas lets scientists monitor the whole planet.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Biophysicist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology & physics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biophysical modeling. Click to start.</p>
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
