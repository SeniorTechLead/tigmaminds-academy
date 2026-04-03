import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ElephantMudLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Thermal Comfort Model for Asian Elephants',
      concept: `In Level 3 you mastered thermoregulation physics, evaporative cooling, skin biology, parasite ecology, social behavior, and infrasound. Now you integrate everything into a single predictive model: given environmental conditions (ambient temperature, humidity, wind speed, solar radiation) and behavioral access (mud, water, shade), predict an elephant's core body temperature over time and determine whether it remains within the safe physiological range.

This is not an academic exercise. Conservation teams managing elephant corridors in Assam need to know which habitats provide adequate thermal refugia during heat waves. If a corridor lacks mud wallows or shade canopy at critical points, elephants may avoid it entirely — or worse, overheat during crossing. A thermal comfort model converts physics into actionable conservation planning.

The model architecture has four subsystems. First, a **metabolic heat generator** based on Kleiber's law scaled by activity level. Second, a **heat exchange module** computing radiative, convective, and evaporative fluxes using the environmental state. Third, a **behavioral state machine** that determines what the elephant is doing at each time step (foraging, resting, mud bathing, traveling) based on its current thermal stress. Fourth, a **thermal integration engine** that updates core body temperature using the energy balance equation. The capstone builds each subsystem, validates it against known physiology, then assembles the complete model.`,
      analogy: 'Building this model is like designing a thermostat system for a building, except the building is alive and can choose to walk into a refrigerator (mud wallow) or stand next to a fan (windy ridge). The thermostat (brain) reads the temperature sensor (hypothalamus), compares it to the set point (37 degrees C), and activates cooling systems (behavioral choices). Your model must capture both the physics of the building and the decision logic of the thermostat.',
      storyConnection: 'The elephant in the mud bath story instinctively knows when it must cool down and where to find relief. Your model replicates that instinct computationally. In Kaziranga National Park, elephant herds time their movements to visit specific mud wallows during peak heat — a pattern that emerges naturally from your thermal comfort model when you run it with real Assam climate data.',
      checkQuestion: 'Why must the model include a behavioral state machine rather than just computing physics with fixed parameters?',
      checkAnswer: 'Elephants actively regulate their behavior in response to thermal stress. An elephant that is overheating will reduce activity (lowering metabolic heat), seek shade (reducing solar load), or visit a mud wallow (activating evaporative cooling). Fixed parameters assume the elephant does nothing, which wildly overestimates body temperature. The behavioral feedback loop is what keeps real elephants alive — and what makes the model realistic.',
      codeIntro: 'Define the metabolic heat production subsystem using Kleiber\'s law and activity scaling factors for different behavioral states.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Subsystem 1: Metabolic Heat Generator ---

class MetabolicModel:
    """Predict metabolic heat production based on mass and activity."""

    # Activity multipliers (relative to basal metabolic rate)
    ACTIVITY_MULTIPLIERS = {
        'sleeping': 0.7,
        'resting': 1.0,
        'standing': 1.2,
        'walking_slow': 2.0,
        'walking_fast': 3.5,
        'foraging': 1.8,
        'mud_bathing': 0.6,  # minimal movement
        'swimming': 4.0,
    }

    def __init__(self, mass_kg=5000, age_years=30):
        self.mass = mass_kg
        self.age = age_years
        # Kleiber's law: BMR = 70 * M^0.75 (Watts)
        self.bmr = 70 * mass_kg**0.75
        # Age correction: calves have higher mass-specific BMR
        if age_years < 5:
            self.bmr *= 1.5
        elif age_years > 50:
            self.bmr *= 0.85

    def heat_production(self, activity='resting'):
        """Return metabolic heat in Watts."""
        multiplier = self.ACTIVITY_MULTIPLIERS.get(activity, 1.0)
        return self.bmr * multiplier

    def daily_profile(self, hours):
        """Generate a realistic 24-hour activity profile."""
        activities = []
        heat = []
        for h in hours:
            hr = h % 24
            if 0 <= hr < 4:
                act = 'sleeping'
            elif 4 <= hr < 6:
                act = 'resting'
            elif 6 <= hr < 9:
                act = 'foraging'
            elif 9 <= hr < 11:
                act = 'walking_slow'
            elif 11 <= hr < 13:
                act = 'mud_bathing'
            elif 13 <= hr < 15:
                act = 'resting'
            elif 15 <= hr < 18:
                act = 'foraging'
            elif 18 <= hr < 20:
                act = 'walking_slow'
            else:
                act = 'resting'
            activities.append(act)
            heat.append(self.heat_production(act))
        return activities, np.array(heat)

# Compare metabolic heat across elephant sizes
masses = [500, 1500, 3000, 5000]  # calf, juvenile, female, bull
labels = ['Calf (500kg)', 'Juvenile (1500kg)', 'Adult female (3000kg)', 'Bull (5000kg)']
hours = np.linspace(0, 24, 289)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: BMR vs mass (Kleiber's law)
ax = axes[0, 0]
ax.set_facecolor('#111827')
m_range = np.linspace(100, 6000, 100)
bmr_range = 70 * m_range**0.75
ax.plot(m_range, bmr_range, color='#f59e0b', linewidth=2)
for m, lab in zip(masses, labels):
    ax.plot(m, 70 * m**0.75, 'o', color='#22c55e', markersize=10)
    ax.annotate(lab, (m, 70 * m**0.75), textcoords='offset points',
                xytext=(10, 10), color='white', fontsize=7)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Basal metabolic rate (W)', color='white')
ax.set_title("Kleiber's Law: BMR = 70 * M^0.75", color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Activity multipliers
ax = axes[0, 1]
ax.set_facecolor('#111827')
acts = list(MetabolicModel.ACTIVITY_MULTIPLIERS.keys())
mults = list(MetabolicModel.ACTIVITY_MULTIPLIERS.values())
colors_bar = ['#6366f1', '#8b5cf6', '#a78bfa', '#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#06b6d4']
ax.barh(range(len(acts)), mults, color=colors_bar[:len(acts)], edgecolor='none')
ax.set_yticks(range(len(acts)))
ax.set_yticklabels(acts, color='white', fontsize=9)
ax.set_xlabel('Multiplier (x BMR)', color='white')
ax.set_title('Activity multipliers for metabolic rate', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: 24-hour metabolic heat for a bull elephant
ax = axes[1, 0]
ax.set_facecolor('#111827')
model = MetabolicModel(mass_kg=5000)
activities, heat_profile = model.daily_profile(hours)
ax.fill_between(hours, heat_profile, alpha=0.3, color='#ef4444')
ax.plot(hours, heat_profile, color='#ef4444', linewidth=2)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Metabolic heat (W)', color='white')
ax.set_title('24-hour metabolic heat: 5000 kg bull', color='white', fontsize=11)
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')
# Annotate activities
prev_act = ''
for i, (h, act) in enumerate(zip(hours, activities)):
    if act != prev_act:
        ax.axvline(h, color='gray', linewidth=0.5, alpha=0.5)
        ax.text(h + 0.2, max(heat_profile) * 0.95, act.replace('_', '\\n'),
                color='white', fontsize=6, rotation=45, va='top')
        prev_act = act

# Plot 4: Mass-specific metabolic rate
ax = axes[1, 1]
ax.set_facecolor('#111827')
specific_bmr = 70 * m_range**0.75 / m_range  # W/kg
ax.plot(m_range, specific_bmr, color='#a855f7', linewidth=2)
for m, lab in zip(masses, labels):
    sp = 70 * m**0.75 / m
    ax.plot(m, sp, 'o', color='#22c55e', markersize=10)
    ax.annotate(f'{sp:.2f} W/kg', (m, sp), textcoords='offset points',
                xytext=(10, 5), color='white', fontsize=8)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Mass-specific BMR (W/kg)', color='white')
ax.set_title('Larger animals produce less heat per kg', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Metabolic model summary (5000 kg bull elephant):")
print(f"  Basal metabolic rate: {model.bmr:.0f} W")
print(f"  Sleeping: {model.heat_production('sleeping'):.0f} W")
print(f"  Foraging: {model.heat_production('foraging'):.0f} W")
print(f"  Walking fast: {model.heat_production('walking_fast'):.0f} W")
print(f"  Mud bathing: {model.heat_production('mud_bathing'):.0f} W")
print()
print("Key insight: mud bathing reduces metabolic heat by 40% vs basal rate")
print("because the elephant is nearly motionless. This compounds with the")
print("evaporative cooling effect — double benefit from a single behavior.")`,
      challenge: 'Add a pregnancy state that increases BMR by 25% and restricts activity to walking_slow or slower. How does pregnancy change the daily heat budget?',
      successHint: 'Pregnant elephants are more thermally stressed, which partly explains why they prefer habitats with abundant shade and water access during gestation.',
    },
    {
      title: 'Heat Exchange Module — radiative, convective, and evaporative fluxes',
      concept: `The heat exchange module is the physics engine of the thermal comfort model. It computes three fluxes: radiative exchange with the environment and sun, convective exchange with moving air, and evaporative cooling from wet skin or mud.

**Radiative exchange** follows the Stefan-Boltzmann law. The elephant emits thermal radiation proportional to the fourth power of its surface temperature. It absorbs thermal radiation from the environment (ground, vegetation, sky) and direct/diffuse solar radiation. The net radiative balance depends on the elephant's emissivity (about 0.95 for skin), the albedo of its surface (0.15 for bare skin, 0.35 to 0.50 for mud-coated skin), and the view factor to the sky versus ground. Solar radiation follows a sinusoidal daily cycle modified by cloud cover.

**Convective exchange** follows Newton's law of cooling. The convection coefficient depends on wind speed raised to the 0.5 power, and the driving force is the temperature difference between the skin surface and the ambient air. The elephant's ears function as dedicated radiators — they are thin, heavily vascularized, and can be flapped to increase the convection coefficient by a factor of 3 to 5. Ear flapping is a thermoregulatory behavior that the model must capture.

**Evaporative cooling** is governed by the vapor pressure deficit between the skin surface and the ambient air. Elephants lack functional sweat glands, so evaporative cooling comes almost entirely from externally applied water or mud. The Penman-Monteith equation models this flux. Critically, humidity modulates the effectiveness: at 90% relative humidity, evaporative cooling drops to 10% of its dry-air value. This is why humid heat is far more dangerous than dry heat for elephants.`,
      analogy: 'Think of the elephant as a hot kettle in a room. The kettle radiates heat (you can feel warmth from across the room — that is radiation). A fan blowing on the kettle removes heat faster (convection). And if you drape a wet towel over the kettle, the evaporating water pulls heat away most effectively of all. The model computes exactly how much heat each mechanism removes, given the room conditions.',
      storyConnection: 'When the elephant in the story wallows in the mud of an Assam riverbank, all three heat exchange mechanisms are at work simultaneously. The mud reflects sunlight (reducing radiative gain), the Brahmaputra valley breeze provides convective cooling, and the slow evaporation of water from the mud layer provides the most powerful cooling of all. Your model quantifies each contribution.',
      checkQuestion: 'An elephant stands in full sun with a 2 m/s breeze. Its skin temperature is 36 degrees C and the air is 38 degrees C. Is convective exchange cooling or heating the elephant?',
      checkAnswer: 'Convective exchange is HEATING the elephant. Convection moves heat from warmer to cooler bodies. Since the air (38 degrees C) is warmer than the skin surface (36 degrees C), convection transfers heat INTO the elephant. This reversal happens whenever air temperature exceeds skin temperature — common during Assam summers. In this regime, the elephant can only cool down through evaporation and by reducing solar radiative gain (seeking shade or applying mud).',
      codeIntro: 'Build the heat exchange module with all three flux calculations, parameterized by environmental conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Subsystem 2: Heat Exchange Module ---

class HeatExchangeModel:
    """Compute radiative, convective, and evaporative heat fluxes."""

    STEFAN_BOLTZMANN = 5.67e-8  # W/(m2*K4)
    LATENT_HEAT = 2.26e6  # J/kg

    def __init__(self, surface_area=18.0, ear_area=2.0):
        self.sa = surface_area
        self.ear_area = ear_area
        self.emissivity = 0.95

    def solar_flux(self, hour, cloud_cover=0.3):
        """Solar irradiance (W/m2) at given hour."""
        h = hour % 24
        if 6 < h < 18:
            peak = 1000 * (1 - 0.7 * cloud_cover)
            return peak * np.sin(np.pi * (h - 6) / 12)
        return 0

    def radiative_exchange(self, T_skin, T_env, hour, albedo=0.15, cloud_cover=0.3):
        """Net radiative heat exchange (W). Positive = heat loss."""
        sigma = self.STEFAN_BOLTZMANN
        Tk_skin = T_skin + 273.15
        Tk_env = T_env + 273.15
        # Longwave emission minus absorption
        lw_net = self.emissivity * sigma * self.sa * (Tk_skin**4 - Tk_env**4)
        # Solar absorption
        solar = self.solar_flux(hour, cloud_cover)
        solar_absorbed = solar * (1 - albedo) * self.sa * 0.25  # 25% cross-section
        return lw_net - solar_absorbed

    def convective_exchange(self, T_skin, T_air, wind_speed=1.0, ear_flapping=False):
        """Convective heat exchange (W). Positive = heat loss."""
        h_conv = 10 * wind_speed**0.5
        body_conv = h_conv * self.sa * (T_skin - T_air)
        ear_mult = 4.0 if ear_flapping else 1.0
        ear_conv = h_conv * ear_mult * self.ear_area * (T_skin - T_air)
        return body_conv + ear_conv

    def evaporative_cooling(self, T_skin, T_air, humidity, is_wet=False, is_mud=False):
        """Evaporative heat loss (W). Always positive or zero."""
        if not is_wet and not is_mud:
            # Dry skin: minimal transepidermal water loss
            return 0.00005 * self.sa * self.LATENT_HEAT

        e_sat_skin = 0.6108 * np.exp(17.27 * T_skin / (T_skin + 237.3))
        e_air = humidity * 0.6108 * np.exp(17.27 * T_air / (T_air + 237.3))
        vpd = max(e_sat_skin - e_air, 0)

        # Surface resistance: mud dries slower than water
        rs = 300 if is_mud else 50
        ra = 50  # aerodynamic resistance

        rho = 1.2
        cp = 1005
        gamma = 0.066

        evap_rate = rho * cp * vpd / (ra * gamma * self.LATENT_HEAT * (1 + rs / ra))
        return max(evap_rate, 0) * self.sa * self.LATENT_HEAT

# --- Visualize heat fluxes across conditions ---

hx = HeatExchangeModel()
hours = np.linspace(0, 24, 289)

# Scenario: hot Assam day, 36C skin, variable air temp
T_skin = 36.0

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Three fluxes over 24 hours (dry skin, no mud)
ax = axes[0, 0]
ax.set_facecolor('#111827')
T_air_profile = 25 + 12 * np.sin(np.pi * (hours - 6) / 12) * np.where((hours % 24 > 6) & (hours % 24 < 18), 1, 0.3)
rad = [hx.radiative_exchange(T_skin, T_air_profile[i], hours[i]) for i in range(len(hours))]
conv = [hx.convective_exchange(T_skin, T_air_profile[i], 1.5) for i in range(len(hours))]
evap = [hx.evaporative_cooling(T_skin, T_air_profile[i], 0.7) for i in range(len(hours))]
ax.plot(hours, rad, color='#ef4444', linewidth=2, label='Radiative (net)')
ax.plot(hours, conv, color='#3b82f6', linewidth=2, label='Convective')
ax.plot(hours, evap, color='#22c55e', linewidth=2, label='Evaporative')
ax.axhline(0, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Heat flux (W)', color='white')
ax.set_title('Heat fluxes: dry skin, no mud', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 2: Same but with mud coating
ax = axes[0, 1]
ax.set_facecolor('#111827')
rad_mud = [hx.radiative_exchange(T_skin, T_air_profile[i], hours[i], albedo=0.45) for i in range(len(hours))]
evap_mud = [hx.evaporative_cooling(T_skin, T_air_profile[i], 0.7, is_mud=True) for i in range(len(hours))]
ax.plot(hours, rad_mud, color='#ef4444', linewidth=2, label='Radiative (mud albedo)')
ax.plot(hours, conv, color='#3b82f6', linewidth=2, label='Convective')
ax.plot(hours, evap_mud, color='#22c55e', linewidth=2, label='Evaporative (mud)')
ax.axhline(0, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Heat flux (W)', color='white')
ax.set_title('Heat fluxes: mud-coated skin', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 3: Evaporative cooling vs humidity
ax = axes[1, 0]
ax.set_facecolor('#111827')
humidities = np.linspace(0.1, 0.95, 50)
evap_by_hum_water = [hx.evaporative_cooling(36, 35, h, is_wet=True) for h in humidities]
evap_by_hum_mud = [hx.evaporative_cooling(36, 35, h, is_mud=True) for h in humidities]
ax.plot(humidities * 100, evap_by_hum_water, color='#3b82f6', linewidth=2, label='Water on skin')
ax.plot(humidities * 100, evap_by_hum_mud, color='#a855f7', linewidth=2, label='Mud on skin')
ax.set_xlabel('Relative humidity (%)', color='white')
ax.set_ylabel('Evaporative cooling (W)', color='white')
ax.set_title('Evaporation collapses at high humidity', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Convection reversal at high air temp
ax = axes[1, 1]
ax.set_facecolor('#111827')
T_airs = np.linspace(20, 45, 50)
conv_normal = [hx.convective_exchange(36, t, 1.5) for t in T_airs]
conv_flap = [hx.convective_exchange(36, t, 1.5, ear_flapping=True) for t in T_airs]
ax.plot(T_airs, conv_normal, color='#3b82f6', linewidth=2, label='Ears relaxed')
ax.plot(T_airs, conv_flap, color='#f59e0b', linewidth=2, label='Ears flapping')
ax.axhline(0, color='#ef4444', linestyle='--', linewidth=1, label='Zero (reversal point)')
ax.axvline(36, color='gray', linestyle=':', linewidth=1)
ax.text(36.5, max(conv_normal) * 0.8, 'T_skin = 36C', color='gray', fontsize=9)
ax.set_xlabel('Air temperature (C)', color='white')
ax.set_ylabel('Convective heat loss (W)', color='white')
ax.set_title('Convection reverses when air > skin temp', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Heat exchange analysis at peak conditions (1pm, 37C air, 70% humidity):")
print(f"  Radiative (dry skin):  {hx.radiative_exchange(36, 37, 13):.0f} W")
print(f"  Radiative (mud coat):  {hx.radiative_exchange(36, 37, 13, albedo=0.45):.0f} W")
print(f"  Convective (1.5 m/s):  {hx.convective_exchange(36, 37, 1.5):.0f} W")
print(f"  Evaporative (dry):     {hx.evaporative_cooling(36, 37, 0.7):.0f} W")
print(f"  Evaporative (mud):     {hx.evaporative_cooling(36, 37, 0.7, is_mud=True):.0f} W")
print()
print("Mud coating improves radiative balance AND provides evaporative cooling.")
print("At 70% humidity, evaporation is already reduced but still significant.")`,
      challenge: 'Add a shade parameter that reduces solar flux by 80% and compare heat budgets for an elephant in sun vs. shade vs. mud in shade. What combination provides the most cooling?',
      successHint: 'The combination of shade plus mud is the most effective thermal strategy, which is why elephants in Kaziranga preferentially mud-bathe under tree canopy rather than in open areas.',
    },
    {
      title: 'Behavioral State Machine — how elephants decide what to do',
      concept: `Real elephants do not follow a fixed schedule. They continuously assess their thermal state and adjust behavior accordingly. When core temperature rises above a threshold, they shift from foraging to seeking shade or water. When temperature drops to comfortable levels, they resume normal activity. This feedback loop is a **state machine** — a computational model where the system transitions between discrete states based on conditions.

The states in our elephant behavioral model are: FORAGING (eating, high metabolic heat), TRAVELING (moving between resources, moderate heat), RESTING (standing or lying in shade, low heat), MUD_BATHING (in a wallow, minimal heat plus active cooling), and SLEEPING (nighttime, minimal heat). Transitions are governed by three variables: **time of day** (elephants are crepuscular — most active at dawn and dusk), **core body temperature** (triggers cooling behavior above 37.5 degrees C), and **resource proximity** (an elephant cannot mud-bathe if no wallow is nearby).

The state machine introduces a critical concept in ecological modeling: **behavioral thermoregulation creates negative feedback**. As temperature rises, the elephant shifts to cooling behaviors, which reduce temperature, which allows return to normal activity. This feedback stabilizes body temperature within a narrow range — unless environmental conditions overwhelm the cooling capacity. Heat waves, habitat loss (removing shade trees), or drainage of wetlands (removing wallows) can break this feedback loop, leading to thermal stress and, in extreme cases, death.

The model must also capture **hysteresis**: an elephant does not leave the mud wallow the instant its temperature drops to 37.5 degrees C. It stays until temperature drops well below the threshold (say, 37.0 degrees C). This prevents rapid oscillation between states and reflects real behavior — elephants spend 30 to 60 minutes in wallows even after cooling down.`,
      analogy: 'The behavioral state machine works like a home thermostat with multiple modes. Below 20 degrees C, the heater turns on. Above 25, the air conditioner activates. But the AC does not turn off at 24.9 — it runs until 23 to avoid cycling. The elephant similarly overshoots its cooling behavior to build a thermal buffer. And just as a thermostat can only activate the AC if it is installed, the elephant can only mud-bathe if a wallow exists in its range.',
      storyConnection: 'The story describes the elephant choosing the deepest, muddiest part of the riverbank. This is not random — it is the state machine selecting the highest-quality thermal resource available. Elephants in the Brahmaputra floodplain have been tracked choosing specific wallow sites repeatedly, just as a person has a favorite shady spot in a park. The state machine encodes this preference for quality resources.',
      checkQuestion: 'If you remove all mud wallows from the model but keep shade trees, what happens to the elephant\'s peak body temperature on a 40 degree C day?',
      checkAnswer: 'Peak body temperature rises significantly because shade only reduces solar radiative gain — it does not provide evaporative cooling. On a 40 degree C day, convection is also reversed (heating the elephant). Without evaporative cooling from mud or water, the only available mechanism is reduced activity (lowering metabolic heat) plus whatever small radiative loss occurs. The elephant would likely exceed 39 degrees C, entering physiological stress. This is why conservation planning must preserve water access, not just forest cover.',
      codeIntro: 'Implement the behavioral state machine with temperature-triggered transitions and hysteresis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Subsystem 3: Behavioral State Machine ---

class BehavioralStateMachine:
    """Elephant behavioral state transitions based on thermal stress and time."""

    STATES = ['sleeping', 'resting', 'foraging', 'traveling', 'mud_bathing']

    # Thermal thresholds
    HEAT_STRESS_THRESHOLD = 37.5   # trigger cooling behavior
    COMFORT_THRESHOLD = 37.0       # return to normal behavior (hysteresis)
    DANGER_THRESHOLD = 39.0        # emergency cooling

    def __init__(self, has_mud_wallow=True, has_shade=True):
        self.state = 'sleeping'
        self.has_mud = has_mud_wallow
        self.has_shade = has_shade
        self.time_in_state = 0
        self.min_mud_time = 30  # minutes minimum in wallow

    def update(self, hour, T_core, dt_minutes=5):
        """Determine next behavioral state."""
        hr = hour % 24
        self.time_in_state += dt_minutes
        prev_state = self.state

        # Night: sleeping (override most conditions)
        if hr < 4 or hr >= 22:
            self.state = 'sleeping'
        # Emergency: seek mud immediately if available
        elif T_core >= self.DANGER_THRESHOLD:
            if self.has_mud:
                self.state = 'mud_bathing'
            elif self.has_shade:
                self.state = 'resting'
            else:
                self.state = 'resting'  # best available option
        # Heat stress: shift to cooling
        elif T_core >= self.HEAT_STRESS_THRESHOLD:
            if self.state == 'mud_bathing':
                # Stay in wallow (hysteresis + minimum time)
                if T_core < self.COMFORT_THRESHOLD and self.time_in_state > self.min_mud_time:
                    self.state = 'resting'
                # else stay in mud
            elif self.has_mud:
                self.state = 'mud_bathing'
            elif self.has_shade:
                self.state = 'resting'
            else:
                self.state = 'resting'
        # Comfortable: normal daily pattern
        elif T_core < self.COMFORT_THRESHOLD:
            if self.state == 'mud_bathing' and self.time_in_state < self.min_mud_time:
                pass  # stay in wallow until minimum time
            elif 4 <= hr < 6 or 20 <= hr < 22:
                self.state = 'resting'
            elif 6 <= hr < 9 or 15 <= hr < 18:
                self.state = 'foraging'
            elif 9 <= hr < 11 or 18 <= hr < 20:
                self.state = 'traveling'
            elif 11 <= hr < 15:
                if self.has_shade:
                    self.state = 'resting'
                else:
                    self.state = 'foraging'

        if self.state != prev_state:
            self.time_in_state = 0

        return self.state

# --- Simulate behavioral responses to synthetic temperature profiles ---

hours = np.linspace(0, 24, 289)
dt_min = 5

# Create three temperature profiles to show state machine behavior
def make_temp_profile(base, amplitude, name):
    """Synthetic core temperature profile (before feedback)."""
    return base + amplitude * np.sin(np.pi * (hours - 6) / 12) * np.where((hours % 24 > 6) & (hours % 24 < 18), 1, 0.2)

profiles = {
    'Cool day (peak 37.0C)': make_temp_profile(36.0, 1.0, 'cool'),
    'Hot day (peak 38.5C)': make_temp_profile(36.5, 2.0, 'hot'),
    'Extreme day (peak 40C)': make_temp_profile(36.5, 3.5, 'extreme'),
}

fig, axes = plt.subplots(3, 2, figsize=(14, 14))
fig.patch.set_facecolor('#1f2937')

state_colors = {
    'sleeping': '#6366f1',
    'resting': '#8b5cf6',
    'foraging': '#22c55e',
    'traveling': '#f59e0b',
    'mud_bathing': '#3b82f6',
}

for row, (label, temps) in enumerate(profiles.items()):
    # Left: temperature profile with thresholds
    ax = axes[row, 0]
    ax.set_facecolor('#111827')
    ax.plot(hours, temps, color='#ef4444', linewidth=2)
    ax.axhline(37.5, color='#f59e0b', linestyle='--', linewidth=1, label='Heat stress')
    ax.axhline(37.0, color='#22c55e', linestyle='--', linewidth=1, label='Comfort')
    ax.axhline(39.0, color='#ef4444', linestyle='--', linewidth=1, label='Danger')
    ax.set_ylabel('Core temp (C)', color='white')
    ax.set_title(label, color='white', fontsize=11)
    ax.set_xlim(0, 24)
    ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax.tick_params(colors='gray')
    if row == 2:
        ax.set_xlabel('Hour of day', color='white')

    # Right: behavioral states
    ax = axes[row, 1]
    ax.set_facecolor('#111827')
    sm = BehavioralStateMachine(has_mud_wallow=True, has_shade=True)
    states = []
    for i, h in enumerate(hours):
        s = sm.update(h, temps[i], dt_min)
        states.append(s)

    # Color-coded state timeline
    state_nums = [list(state_colors.keys()).index(s) for s in states]
    for i in range(len(hours) - 1):
        ax.axvspan(hours[i], hours[i+1], color=state_colors[states[i]], alpha=0.7)
    ax.set_xlim(0, 24)
    ax.set_ylim(0, 1)
    ax.set_yticks([])
    ax.set_title(f'Behavioral states', color='white', fontsize=11)
    if row == 2:
        ax.set_xlabel('Hour of day', color='white')
    ax.tick_params(colors='gray')

# Legend for states
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor=c, label=s) for s, c in state_colors.items()]
axes[0, 1].legend(handles=legend_elements, fontsize=7, facecolor='#1f2937',
                   edgecolor='gray', labelcolor='white', loc='upper right')

plt.tight_layout()
plt.show()

print("State machine behavior:")
print("  Cool day: normal foraging/traveling pattern, minimal mud use")
print("  Hot day: extended mud bathing during midday, reduced foraging")
print("  Extreme day: emergency mud bathing dominates, minimal foraging time")
print()
print("This is why heat waves threaten elephants — not through direct overheating,")
print("but by stealing foraging time. An elephant that spends 6+ hours cooling")
print("cannot eat the 150-200 kg of food it needs daily.")`,
      challenge: 'Set has_mud_wallow=False and rerun the extreme day scenario. Count how many hours the elephant spends above 38 degrees C compared to when mud is available.',
      successHint: 'Without mud, the elephant is trapped in a resting state with no evaporative cooling. Core temperature stays elevated for hours longer, demonstrating why mud wallows are critical infrastructure for elephant survival.',
    },
    {
      title: 'Thermal Integration Engine — the energy balance equation',
      concept: `The thermal integration engine is where everything comes together. It solves the energy balance equation at each time step:

dT/dt = (Q_metabolic - Q_radiative - Q_convective - Q_evaporative) / (m * c_p)

where m is body mass, c_p is the specific heat capacity of tissue (about 3500 J/(kg*K)), and Q values are the heat fluxes computed by the previous subsystems. The metabolic heat depends on the behavioral state (from the state machine), and the cooling fluxes depend on environmental conditions and whether the elephant is in a wallow.

This is a first-order ordinary differential equation (ODE) solved by **Euler's method**: at each time step, compute the net heat flux, divide by thermal mass to get the rate of temperature change, and update the temperature. The time step must be small enough for numerical stability — 5 minutes works well for this system because the thermal mass of a 5000 kg elephant is enormous, so temperature changes slowly.

The integration creates the **feedback loop** that makes the model realistic. Rising temperature triggers the state machine to switch to mud bathing, which activates evaporative cooling in the heat exchange module, which reduces the net heat flux in the energy balance, which lowers the temperature change rate. This negative feedback stabilizes temperature — exactly as it does in real elephants.

A crucial validation check: the model should produce core temperatures between 35.5 and 37.5 degrees C under normal conditions, with brief excursions to 38 degrees C during peak heat. Values outside this range indicate parameter errors. Real elephants maintain remarkably stable core temperatures of 36 to 37 degrees C, varying by only 1 to 2 degrees over 24 hours.`,
      analogy: 'The integration engine is like a bank account balance. Your salary (metabolic heat) is deposited regularly. Bills (cooling mechanisms) withdraw money. The balance (body temperature) goes up when income exceeds expenses and down when expenses exceed income. The state machine is your financial advisor, telling you to cut spending (stop foraging) when the balance gets too high. The whole system finds a dynamic equilibrium.',
      storyConnection: 'The elephant in the story survives the Assam heat because its thermal integration is balanced — enough mud, enough shade, enough water. The model predicts that removing any one of these resources tips the balance, just as removing income or increasing bills unbalances a budget. This is the quantitative argument for preserving complete habitats, not just patches of forest.',
      checkQuestion: 'If you double the time step from 5 minutes to 10 minutes, what happens to the simulation accuracy and why?',
      checkAnswer: 'Larger time steps reduce accuracy because the Euler method assumes constant flux over the time step, but fluxes change as temperature changes. With a 5000 kg elephant, the thermal inertia is so large that 10-minute steps would still be acceptably accurate — temperature only changes about 0.01 degrees C per step. But for a 500 kg calf with lower thermal inertia, a 10-minute step could introduce noticeable oscillation. The safe practice is to halve the time step and check that results do not change significantly.',
      codeIntro: 'Build the integration engine that couples all three subsystems and runs a full 24-hour simulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Full Thermal Comfort Model ---

class ThermalComfortModel:
    """Complete elephant thermal comfort model integrating all subsystems."""

    ACTIVITY_HEAT = {
        'sleeping': 0.7, 'resting': 1.0, 'foraging': 1.8,
        'traveling': 2.0, 'mud_bathing': 0.6,
    }

    def __init__(self, mass_kg=5000, has_mud=True, has_shade=True):
        self.mass = mass_kg
        self.cp = 3500  # J/(kg*K)
        self.bmr = 70 * mass_kg**0.75
        self.sa = 0.1 * mass_kg**0.67  # allometric surface area
        self.ear_area = 2.0 if mass_kg > 3000 else 1.0

        # State machine
        self.state = 'sleeping'
        self.time_in_state = 0
        self.has_mud = has_mud
        self.has_shade = has_shade
        self.T_core = 36.5

    def env_temperature(self, hour, T_min=24, T_max=38):
        h = hour % 24
        if 6 < h < 18:
            return T_min + (T_max - T_min) * np.sin(np.pi * (h - 6) / 12)
        else:
            return T_min + (T_max - T_min) * 0.1

    def solar(self, hour, cloud=0.3):
        h = hour % 24
        if 6 < h < 18:
            return 1000 * (1 - 0.7 * cloud) * np.sin(np.pi * (h - 6) / 12)
        return 0

    def update_state(self, hour, dt_min=5):
        hr = hour % 24
        self.time_in_state += dt_min
        prev = self.state

        if hr < 4 or hr >= 22:
            self.state = 'sleeping'
        elif self.T_core >= 39.0:
            self.state = 'mud_bathing' if self.has_mud else 'resting'
        elif self.T_core >= 37.5:
            if self.state == 'mud_bathing':
                if self.T_core < 37.0 and self.time_in_state > 30:
                    self.state = 'resting'
            elif self.has_mud:
                self.state = 'mud_bathing'
            else:
                self.state = 'resting'
        elif self.T_core < 37.0:
            if self.state == 'mud_bathing' and self.time_in_state < 30:
                pass
            elif 6 <= hr < 9 or 15 <= hr < 18:
                self.state = 'foraging'
            elif 9 <= hr < 11 or 18 <= hr < 20:
                self.state = 'traveling'
            else:
                self.state = 'resting'

        if self.state != prev:
            self.time_in_state = 0

    def compute_fluxes(self, hour, humidity=0.7, wind=1.5):
        T_env = self.env_temperature(hour)
        sol = self.solar(hour)
        sigma = 5.67e-8

        # Metabolic heat
        Q_met = self.bmr * self.ACTIVITY_HEAT.get(self.state, 1.0)

        # Radiative
        is_mud = self.state == 'mud_bathing'
        is_shade = self.state == 'resting' and self.has_shade and 10 <= hour % 24 <= 16
        albedo = 0.45 if is_mud else 0.15
        effective_solar = sol * 0.2 if is_shade else sol

        Tk = self.T_core + 273.15
        Tke = T_env + 273.15
        lw_net = 0.95 * sigma * self.sa * (Tk**4 - Tke**4)
        solar_abs = effective_solar * (1 - albedo) * self.sa * 0.25
        Q_rad = lw_net - solar_abs

        # Convective
        h_conv = 10 * wind**0.5
        ear_flap = self.T_core > 37.5
        ear_mult = 4.0 if ear_flap else 1.0
        Q_conv = h_conv * (self.sa * (self.T_core - T_env) +
                           ear_mult * self.ear_area * (self.T_core - T_env))

        # Evaporative
        if is_mud:
            e_sat = 0.6108 * np.exp(17.27 * self.T_core / (self.T_core + 237.3))
            e_air = humidity * 0.6108 * np.exp(17.27 * T_env / (T_env + 237.3))
            vpd = max(e_sat - e_air, 0)
            evap_rate = 1.2 * 1005 * vpd / (50 * 0.066 * 2.26e6 * (1 + 300/50))
            Q_evap = max(evap_rate, 0) * self.sa * 2.26e6
        else:
            Q_evap = 0.00005 * self.sa * 2.26e6

        return Q_met, Q_rad, Q_conv, Q_evap, T_env

    def simulate(self, hours_array, humidity=0.7, wind=1.5, dt=300):
        records = {'T': [], 'state': [], 'T_env': [], 'Q_met': [], 'Q_cool': []}
        self.T_core = 36.5
        self.state = 'sleeping'
        self.time_in_state = 0

        for h in hours_array:
            self.update_state(h)
            Q_met, Q_rad, Q_conv, Q_evap, T_env = self.compute_fluxes(h, humidity, wind)
            Q_net = Q_met - Q_rad - Q_conv - Q_evap
            dT = Q_net * dt / (self.mass * self.cp)
            self.T_core += dT
            self.T_core = np.clip(self.T_core, 34.0, 42.0)

            records['T'].append(self.T_core)
            records['state'].append(self.state)
            records['T_env'].append(T_env)
            records['Q_met'].append(Q_met)
            records['Q_cool'].append(Q_rad + Q_conv + Q_evap)

        return {k: np.array(v) if k != 'state' else v for k, v in records.items()}

# --- Run four scenarios ---
hours = np.linspace(0, 24, 289)

scenarios = {
    'Full resources (mud + shade)': ThermalComfortModel(5000, has_mud=True, has_shade=True),
    'Shade only (no mud)': ThermalComfortModel(5000, has_mud=False, has_shade=True),
    'Mud only (no shade)': ThermalComfortModel(5000, has_mud=True, has_shade=False),
    'No resources': ThermalComfortModel(5000, has_mud=False, has_shade=False),
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

scenario_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
state_colors = {'sleeping': '#6366f1', 'resting': '#8b5cf6', 'foraging': '#22c55e',
                'traveling': '#f59e0b', 'mud_bathing': '#3b82f6'}

# Plot 1: Temperature comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
results = {}
for (name, model), color in zip(scenarios.items(), scenario_colors):
    r = model.simulate(hours)
    results[name] = r
    ax.plot(hours, r['T'], color=color, linewidth=2, label=name)
ax.axhline(37.5, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.5)
ax.axhline(39.0, color='#ef4444', linestyle='--', linewidth=1, alpha=0.5)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Core temperature (C)', color='white')
ax.set_title('Core temperature: four resource scenarios', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 2: Environmental temperature
ax = axes[0, 1]
ax.set_facecolor('#111827')
r0 = results['Full resources (mud + shade)']
ax.plot(hours, r0['T_env'], color='#ef4444', linewidth=2, label='Air temp')
ax.plot(hours, r0['T'], color='#22c55e', linewidth=2, label='Core temp (full resources)')
ax.fill_between(hours, r0['T_env'], r0['T'], alpha=0.15, color='#3b82f6')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Temperature (C)', color='white')
ax.set_title('Core vs environmental temperature', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 24)
ax.tick_params(colors='gray')

# Plot 3: Behavioral state timeline (full resources)
ax = axes[1, 0]
ax.set_facecolor('#111827')
states = r0['state']
for i in range(len(hours) - 1):
    ax.axvspan(hours[i], hours[i+1], color=state_colors.get(states[i], 'gray'), alpha=0.8)
ax.set_xlim(0, 24)
ax.set_ylim(0, 1)
ax.set_yticks([])
ax.set_xlabel('Hour of day', color='white')
ax.set_title('Behavioral states (full resources)', color='white', fontsize=11)
ax.tick_params(colors='gray')
from matplotlib.patches import Patch
legend_els = [Patch(facecolor=c, label=s) for s, c in state_colors.items()]
ax.legend(handles=legend_els, fontsize=7, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white', loc='upper right', ncol=3)

# Plot 4: Peak temperature comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
names = list(results.keys())
peaks = [np.max(r['T']) for r in results.values()]
bars = ax.bar(range(len(names)), peaks, color=scenario_colors, edgecolor='none')
ax.set_xticks(range(len(names)))
ax.set_xticklabels([n.split('(')[0].strip() for n in names], color='white', fontsize=8, rotation=15)
ax.set_ylabel('Peak core temperature (C)', color='white')
ax.set_title('Peak temperature by resource availability', color='white', fontsize=11)
ax.axhline(37.5, color='#f59e0b', linestyle='--', linewidth=1)
ax.axhline(39.0, color='#ef4444', linestyle='--', linewidth=1)
for bar, peak in zip(bars, peaks):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
            f'{peak:.1f}C', ha='center', color='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Thermal integration results:")
for name, r in results.items():
    peak = np.max(r['T'])
    stress_hours = np.sum(np.array(r['T']) > 37.5) * 5 / 60
    print(f"  {name}: peak {peak:.1f}C, {stress_hours:.1f}h above stress threshold")`,
      challenge: 'Run the model with T_max=42 (extreme heat wave) and humidity=0.9 (monsoon). Even with full resources, does the elephant stay safe? What additional intervention might help?',
      successHint: 'Under extreme conditions, even mud and shade may be insufficient. Artificial cooling measures (sprinklers along corridors, deepened wallows) become necessary — this is the kind of actionable recommendation the model enables.',
    },
    {
      title: 'Sensitivity Analysis — which parameters matter most?',
      concept: `A model is only useful if you understand which inputs matter most. Sensitivity analysis systematically varies each parameter while holding others constant, measuring how much the output (peak body temperature) changes. Parameters with large effects are **sensitive** — they drive the system and must be measured accurately. Parameters with small effects can be estimated roughly.

For the elephant thermal comfort model, the candidate parameters are: ambient temperature range, humidity, wind speed, cloud cover, body mass, mud availability (hours of access), shade availability, and activity level. We perform a **one-at-a-time (OAT) sensitivity analysis**: vary each parameter across its realistic range while holding all others at baseline values, and record the change in peak core temperature.

This analysis reveals which conservation interventions have the highest impact. If the model is most sensitive to mud access, then maintaining wallows is the top priority. If it is most sensitive to shade, then preventing deforestation is paramount. If humidity dominates, then the model predicts that climate change (increasing humidity in monsoon regions) poses an unavoidable threat that no local intervention can fully mitigate.

Beyond OAT, there are **interaction effects**: the impact of removing mud depends on the humidity level. At low humidity, dry skin still provides some evaporative cooling, so mud is less critical. At high humidity, mud is the only effective cooling mechanism, so removing it is catastrophic. Capturing these interactions requires a more sophisticated approach — a **factorial sensitivity analysis** that varies multiple parameters simultaneously.`,
      analogy: 'Sensitivity analysis is like a doctor determining which vital signs matter most for a patient. Blood pressure, heart rate, oxygen saturation, and temperature are all important, but for a heat stroke patient, the doctor focuses on core temperature and hydration status because those are the sensitive variables. Similarly, our analysis identifies which environmental variables are the thermal vital signs for elephants.',
      storyConnection: 'Understanding which parameters matter most tells us what made the elephant in the story survive. It was not just the mud — it was the combination of mud access, moderate humidity (Assam is humid but not saturated during pre-monsoon), and the availability of shade near the wallow. The sensitivity analysis quantifies how much each factor contributed to keeping the elephant alive.',
      checkQuestion: 'If sensitivity analysis shows that humidity is the most sensitive parameter but it is also the one we cannot control, what is the practical value of that finding?',
      checkAnswer: 'Knowing that humidity is uncontrollable but dominant tells us two things. First, during high-humidity periods (monsoon), other cooling interventions become critical — we must ensure mud and shade are available because evaporative cooling is already compromised. Second, it identifies which future climate scenarios are most dangerous for elephants. If climate models predict increasing humidity in Assam, we know elephants will face increasing thermal stress regardless of habitat quality. This shapes long-term conservation strategy.',
      codeIntro: 'Run a full sensitivity analysis varying each parameter across its realistic range and rank them by impact on peak body temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Redefine the model compactly for sensitivity analysis
class QuickThermalModel:
    def __init__(self, mass=5000, has_mud=True, has_shade=True):
        self.mass = mass
        self.cp = 3500
        self.bmr = 70 * mass**0.75
        self.sa = 0.1 * mass**0.67
        self.has_mud = has_mud
        self.has_shade = has_shade

    def simulate_peak(self, T_max=38, T_min=24, humidity=0.7, wind=1.5,
                      cloud=0.3, mud_hours=4, activity_mult=1.0):
        hours = np.linspace(0, 24, 289)
        dt = 300
        T = 36.5
        peak_T = T

        for h in hours:
            hr = h % 24
            # Environment
            if 6 < hr < 18:
                T_env = T_min + (T_max - T_min) * np.sin(np.pi * (hr - 6) / 12)
                sol = 1000 * (1 - 0.7 * cloud) * np.sin(np.pi * (hr - 6) / 12)
            else:
                T_env = T_min
                sol = 0

            # Activity
            if hr < 4 or hr >= 22:
                act = 0.7
            elif 6 <= hr < 9 or 15 <= hr < 18:
                act = 1.8 * activity_mult
            else:
                act = 1.0

            # Mud: available during midday for specified hours
            mud_start = 12 - mud_hours / 2
            mud_end = 12 + mud_hours / 2
            is_mud = self.has_mud and mud_start <= hr <= mud_end and T > 37.0

            # Shade
            is_shade = self.has_shade and 10 <= hr <= 16 and not is_mud

            if is_mud:
                act = 0.6

            Q_met = self.bmr * act
            albedo = 0.45 if is_mud else 0.15
            eff_sol = sol * 0.2 if is_shade else sol

            sigma = 5.67e-8
            Tk = T + 273.15
            Tke = T_env + 273.15
            Q_rad = 0.95 * sigma * self.sa * (Tk**4 - Tke**4) - eff_sol * (1 - albedo) * self.sa * 0.25
            Q_conv = 10 * wind**0.5 * self.sa * (T - T_env)

            if is_mud:
                e_sat = 0.6108 * np.exp(17.27 * T / (T + 237.3))
                e_air = humidity * 0.6108 * np.exp(17.27 * T_env / (T_env + 237.3))
                vpd = max(e_sat - e_air, 0)
                evap = max(1.2 * 1005 * vpd / (50 * 0.066 * 2.26e6 * 7), 0) * self.sa * 2.26e6
            else:
                evap = 0.00005 * self.sa * 2.26e6

            dT = (Q_met - Q_rad - Q_conv - evap) * dt / (self.mass * self.cp)
            T += dT
            T = np.clip(T, 34, 42)
            peak_T = max(peak_T, T)

        return peak_T

# --- One-at-a-time sensitivity analysis ---

baseline = {'T_max': 38, 'T_min': 24, 'humidity': 0.7, 'wind': 1.5,
            'cloud': 0.3, 'mud_hours': 4, 'activity_mult': 1.0}

param_ranges = {
    'T_max': np.linspace(30, 45, 20),
    'humidity': np.linspace(0.2, 0.95, 20),
    'wind': np.linspace(0.1, 5.0, 20),
    'cloud': np.linspace(0.0, 0.9, 20),
    'mud_hours': np.linspace(0, 8, 20),
    'activity_mult': np.linspace(0.5, 2.0, 20),
}

param_labels = {
    'T_max': 'Max air temp (C)',
    'humidity': 'Relative humidity',
    'wind': 'Wind speed (m/s)',
    'cloud': 'Cloud cover fraction',
    'mud_hours': 'Mud access (hours)',
    'activity_mult': 'Activity multiplier',
}

model = QuickThermalModel(5000, has_mud=True, has_shade=True)
baseline_peak = model.simulate_peak(**baseline)

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

sensitivities = {}

for idx, (param, values) in enumerate(param_ranges.items()):
    ax = axes[idx // 3, idx % 3]
    ax.set_facecolor('#111827')

    peaks = []
    for v in values:
        kwargs = baseline.copy()
        kwargs[param] = v
        peaks.append(model.simulate_peak(**kwargs))

    ax.plot(values, peaks, color='#3b82f6', linewidth=2)
    ax.axhline(baseline_peak, color='gray', linestyle=':', linewidth=1)
    ax.axhline(37.5, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.5)
    ax.axhline(39.0, color='#ef4444', linestyle='--', linewidth=1, alpha=0.5)
    ax.set_xlabel(param_labels[param], color='white')
    ax.set_ylabel('Peak core temp (C)', color='white')
    ax.set_title(f'Sensitivity: {param}', color='white', fontsize=10)
    ax.tick_params(colors='gray')

    sensitivity = max(peaks) - min(peaks)
    sensitivities[param] = sensitivity
    ax.text(0.05, 0.95, f'Range: {sensitivity:.2f}C', transform=ax.transAxes,
            color='#22c55e', fontsize=9, va='top')

plt.tight_layout()
plt.show()

print("Sensitivity ranking (by peak temperature range):")
for param, sens in sorted(sensitivities.items(), key=lambda x: -x[1]):
    print(f"  {param_labels[param]:30s}: {sens:.2f} C range")
print()
print(f"Baseline peak temperature: {baseline_peak:.2f} C")
print("Parameters with the largest range are the most important controls.")`,
      challenge: 'Run a two-way interaction analysis between humidity and mud_hours. Create a 2D heatmap showing peak temperature as a function of both parameters simultaneously. Where is the dangerous zone?',
      successHint: 'The interaction reveals that high humidity plus low mud access is the most dangerous combination — the zone where peak temperature exceeds 39 degrees C. This defines the critical conservation threshold for habitat quality.',
    },
    {
      title: 'Conservation Application — mapping thermal refugia across a landscape',
      concept: `The capstone culminates in a practical conservation application: given a landscape map of an elephant corridor with varying shade, mud access, and microclimate conditions, predict which areas provide adequate thermal comfort and which areas are thermal barriers.

A **thermal refugium** is a location where environmental conditions (shade, water, mud, wind exposure) allow an elephant to maintain safe body temperature even during peak heat. The opposite is a **thermal barrier** — an open, shadeless stretch with no water access where an elephant would overheat during midday. Corridors that force elephants through thermal barriers are dangerous and may be avoided entirely, fragmenting populations.

The application works by dividing the corridor into grid cells, assigning environmental parameters to each cell (canopy cover, distance to nearest wallow, elevation, aspect), running the thermal model for each cell under worst-case summer conditions, and classifying each cell as refugium, marginal, or barrier based on predicted peak temperature. The output is a thermal comfort map that conservation planners can use to prioritize habitat restoration.

This is not hypothetical. Elephant corridors in Assam, such as the Kaziranga-Karbi Anglong corridor, pass through a mosaic of forest, tea gardens, paddy fields, and settlements. The forest patches provide shade and wallows. The tea gardens and paddy fields are open, hot, and shadeless. By mapping thermal comfort, we can identify where to plant shade trees, dig artificial wallows, or schedule elephant crossings for cooler hours. The thermal model converts physics into land-use recommendations.`,
      analogy: 'This is like a city heat map for urban planning. Cities map surface temperatures to identify heat islands where people suffer most during heat waves. They then target those areas for tree planting, reflective surfaces, and cooling centers. We are doing the same for elephants — mapping the landscape thermal environment and targeting interventions where they matter most.',
      storyConnection: 'The elephant in the story found its mud wallow along the riverbank — a thermal refugium embedded in the broader landscape. If that wallow were drained for agriculture, the elephant would need to cross an additional 3 km of open terrain to reach the next one. Your thermal map identifies exactly how dangerous that 3 km gap would be and whether planting shade trees could make it survivable.',
      checkQuestion: 'A proposed highway would bisect an elephant corridor, replacing 500 m of forest with asphalt. Using the thermal model, how would you assess the impact?',
      checkAnswer: 'Model the 500 m crossing as a thermal barrier: no shade, no mud, high surface temperature from asphalt (which can reach 60 degrees C, radiating heat upward). Calculate how long an elephant takes to cross 500 m (about 8 to 10 minutes at walking speed). Run the thermal model for that duration under worst-case conditions. If core temperature rises by more than 0.5 degrees C during crossing, it is a significant thermal stressor. If the elephant must queue at a traffic gap for 30+ minutes in the open, the impact compounds. The model provides quantitative data for the environmental impact assessment.',
      codeIntro: 'Generate a synthetic elephant corridor landscape and produce a thermal comfort map showing refugia, marginal zones, and barriers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Landscape Thermal Comfort Mapping ---

# Generate a synthetic corridor landscape (20 km x 5 km)
nx, ny = 40, 10  # grid cells (each 500m x 500m)
corridor_length_km = 20
corridor_width_km = 5

# Landscape features
canopy_cover = np.zeros((ny, nx))
mud_access = np.zeros((ny, nx))
elevation = np.zeros((ny, nx))

# Create realistic landscape patches
# Dense forest on edges
canopy_cover[:3, :] = 0.7 + 0.2 * np.random.rand(3, nx)
canopy_cover[-3:, :] = 0.7 + 0.2 * np.random.rand(3, nx)

# Forest fragments in middle
for _ in range(8):
    cx, cy = np.random.randint(5, 35), np.random.randint(2, 8)
    r = np.random.randint(1, 3)
    for i in range(max(0, cy-r), min(ny, cy+r+1)):
        for j in range(max(0, cx-r), min(nx, cx+r+1)):
            canopy_cover[i, j] = 0.6 + 0.3 * np.random.rand()

# Tea gardens (low canopy)
tea_mask = (canopy_cover < 0.3) & (np.random.rand(ny, nx) > 0.5)
canopy_cover[tea_mask] = 0.1

# River running through corridor (with mud wallows)
river_y = ny // 2 + (np.sin(np.linspace(0, 2*np.pi, nx)) * 1.5).astype(int)
for x in range(nx):
    ry = np.clip(river_y[x], 0, ny-1)
    mud_access[ry, x] = 1.0
    if ry > 0: mud_access[ry-1, x] = 0.5
    if ry < ny-1: mud_access[ry+1, x] = 0.5

# Elevation (gentle hills)
for i in range(ny):
    for j in range(nx):
        elevation[i, j] = 50 + 30 * np.sin(j * np.pi / 10) + 20 * np.cos(i * np.pi / 5)

# --- Run thermal model for each grid cell ---

class CellThermalModel:
    def __init__(self, canopy, mud, elev):
        self.canopy = canopy
        self.mud = mud > 0.3
        self.elev = elev

    def peak_temperature(self, T_max_base=40, humidity=0.75):
        # Temperature decreases with elevation (lapse rate)
        T_max = T_max_base - self.elev * 0.006
        T_min = T_max - 14

        mass = 5000
        cp = 3500
        bmr = 70 * mass**0.75
        sa = 0.1 * mass**0.67

        T = 36.5
        peak = T
        hours = np.linspace(0, 24, 145)  # 10-min steps
        dt = 600

        for h in hours:
            hr = h % 24
            if 6 < hr < 18:
                T_env = T_min + (T_max - T_min) * np.sin(np.pi * (hr - 6) / 12)
                sol = 1000 * np.sin(np.pi * (hr - 6) / 12)
            else:
                T_env = T_min
                sol = 0

            # Activity
            is_hot = T > 37.0
            if hr < 4 or hr >= 22:
                act = 0.7
            elif is_hot and self.mud:
                act = 0.6
            elif is_hot:
                act = 0.8
            elif 6 <= hr < 18:
                act = 1.5
            else:
                act = 1.0

            Q_met = bmr * act

            # Shade reduces solar
            eff_sol = sol * (1 - 0.8 * self.canopy)
            albedo = 0.45 if (self.mud and is_hot) else 0.15

            sigma = 5.67e-8
            Tk = T + 273.15
            Tke = T_env + 273.15
            Q_rad = 0.95 * sigma * sa * (Tk**4 - Tke**4) - eff_sol * (1 - albedo) * sa * 0.25
            Q_conv = 10 * 1.5**0.5 * sa * (T - T_env)

            if self.mud and is_hot:
                e_sat = 0.6108 * np.exp(17.27 * T / (T + 237.3))
                e_air = humidity * 0.6108 * np.exp(17.27 * T_env / (T_env + 237.3))
                vpd = max(e_sat - e_air, 0)
                evap = max(1.2 * 1005 * vpd / (50 * 0.066 * 2.26e6 * 7), 0) * sa * 2.26e6
            else:
                evap = 0.00005 * sa * 2.26e6

            dT = (Q_met - Q_rad - Q_conv - evap) * dt / (mass * cp)
            T += dT
            T = np.clip(T, 34, 42)
            peak = max(peak, T)

        return peak

# Compute thermal comfort for each cell
peak_temps = np.zeros((ny, nx))
for i in range(ny):
    for j in range(nx):
        cell = CellThermalModel(canopy_cover[i, j], mud_access[i, j], elevation[i, j])
        peak_temps[i, j] = cell.peak_temperature()

# Classify cells
REFUGIUM = 37.5
MARGINAL = 38.5
thermal_class = np.zeros_like(peak_temps)
thermal_class[peak_temps <= REFUGIUM] = 0  # refugium
thermal_class[(peak_temps > REFUGIUM) & (peak_temps <= MARGINAL)] = 1  # marginal
thermal_class[peak_temps > MARGINAL] = 2  # barrier

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')

x_km = np.linspace(0, corridor_length_km, nx)
y_km = np.linspace(0, corridor_width_km, ny)

# Plot 1: Canopy cover
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(canopy_cover, extent=[0, corridor_length_km, 0, corridor_width_km],
               aspect='auto', cmap='Greens', vmin=0, vmax=1, origin='lower')
plt.colorbar(im, ax=ax, label='Canopy cover')
ax.set_title('Canopy cover', color='white', fontsize=11)
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Width (km)', color='white')
ax.tick_params(colors='gray')

# Plot 2: Mud access
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(mud_access, extent=[0, corridor_length_km, 0, corridor_width_km],
               aspect='auto', cmap='Blues', vmin=0, vmax=1, origin='lower')
plt.colorbar(im, ax=ax, label='Mud access')
ax.set_title('Mud/water access', color='white', fontsize=11)
ax.set_xlabel('Distance (km)', color='white')
ax.tick_params(colors='gray')

# Plot 3: Elevation
ax = axes[0, 2]
ax.set_facecolor('#111827')
im = ax.imshow(elevation, extent=[0, corridor_length_km, 0, corridor_width_km],
               aspect='auto', cmap='terrain', origin='lower')
plt.colorbar(im, ax=ax, label='Elevation (m)')
ax.set_title('Elevation', color='white', fontsize=11)
ax.set_xlabel('Distance (km)', color='white')
ax.tick_params(colors='gray')

# Plot 4: Peak temperature map
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(peak_temps, extent=[0, corridor_length_km, 0, corridor_width_km],
               aspect='auto', cmap='RdYlGn_r', vmin=36.5, vmax=40, origin='lower')
plt.colorbar(im, ax=ax, label='Peak core temp (C)')
ax.set_title('Predicted peak body temperature', color='white', fontsize=11)
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Width (km)', color='white')
ax.tick_params(colors='gray')

# Plot 5: Thermal classification
ax = axes[1, 1]
ax.set_facecolor('#111827')
from matplotlib.colors import ListedColormap
cmap_class = ListedColormap(['#22c55e', '#f59e0b', '#ef4444'])
im = ax.imshow(thermal_class, extent=[0, corridor_length_km, 0, corridor_width_km],
               aspect='auto', cmap=cmap_class, vmin=-0.5, vmax=2.5, origin='lower')
from matplotlib.patches import Patch
legend_els = [Patch(facecolor='#22c55e', label='Refugium (<37.5C)'),
              Patch(facecolor='#f59e0b', label='Marginal (37.5-38.5C)'),
              Patch(facecolor='#ef4444', label='Barrier (>38.5C)')]
ax.legend(handles=legend_els, fontsize=7, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white', loc='upper right')
ax.set_title('Thermal classification', color='white', fontsize=11)
ax.set_xlabel('Distance (km)', color='white')
ax.tick_params(colors='gray')

# Plot 6: Summary statistics
ax = axes[1, 2]
ax.set_facecolor('#111827')
categories = ['Refugium', 'Marginal', 'Barrier']
counts = [(thermal_class == i).sum() for i in range(3)]
total = sum(counts)
pcts = [c / total * 100 for c in counts]
colors_bar = ['#22c55e', '#f59e0b', '#ef4444']
bars = ax.bar(categories, pcts, color=colors_bar, edgecolor='none')
for bar, pct, cnt in zip(bars, pcts, counts):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{pct:.0f}%\\n({cnt} cells)', ha='center', color='white', fontsize=9)
ax.set_ylabel('Percentage of corridor', color='white')
ax.set_title('Corridor thermal composition', color='white', fontsize=11)
ax.set_ylim(0, 70)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Corridor thermal analysis:")
print(f"  Total cells: {total}")
print(f"  Refugia:  {counts[0]} cells ({pcts[0]:.0f}%) — safe for midday rest")
print(f"  Marginal: {counts[1]} cells ({pcts[1]:.0f}%) — passable but stressful")
print(f"  Barriers: {counts[2]} cells ({pcts[2]:.0f}%) — dangerous at midday")
print()
print("Conservation recommendations:")
print("  1. Plant shade trees in barrier cells adjacent to existing forest")
print("  2. Create artificial wallows at 3-5 km intervals along the corridor")
print("  3. Schedule elephant crossing of barrier sections for dawn/dusk hours")
print("  4. Monitor real-time thermal conditions at bottleneck points")`,
      challenge: 'Simulate the impact of a proposed intervention: adding 5 artificial wallows (set mud_access to 1.0 at 5 strategic barrier cells) and planting shade trees (set canopy_cover to 0.6) in a 1 km stretch. Recalculate the thermal map and quantify how many barrier cells become refugia.',
      successHint: 'Targeted interventions can convert barrier cells to marginal or refugia cells, creating a connected safe passage through the corridor. This is precision conservation — using physics to decide exactly where to invest limited resources for maximum benefit.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone project: Thermal Comfort Model for elephants</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete thermal comfort model using Python with numpy and matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}