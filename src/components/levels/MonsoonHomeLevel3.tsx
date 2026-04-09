import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MonsoonHomeLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Thermal mass & heat storage',
      concept: `**Thermal mass** is the ability of a material to absorb, store, and release heat. Dense materials like stone, brick, and concrete have high thermal mass — they absorb heat slowly during the day and release it slowly at night, moderating temperature swings. This is the fundamental principle behind traditional monsoon architecture in Northeast India.

The heat stored in a material is Q = m * c * deltaT, where m is mass (kg), c is specific heat capacity (J/(kg.K)), and deltaT is the temperature change. A 30 cm thick mud wall (density 1800 kg/m^3, c = 900 J/(kg.K)) per square meter has thermal mass = 0.3 * 1800 * 900 = 486,000 J/K. This means it absorbs 486 kJ for every 1 degree Celsius rise — acting as a massive thermal battery.

The **time lag** is how long it takes for a temperature wave to travel through the wall. For a homogeneous wall: time_lag = L^2 / (2 * alpha), where L is thickness and alpha is thermal diffusivity. A 30 cm mud wall has a time lag of about 8-10 hours — meaning the afternoon heat peak arrives at the interior wall surface at night, when outdoor temperatures have already dropped. This natural phase shift is the essence of passive cooling.`,
      analogy: `Thermal mass is like a large water tank in your garden. During a rainstorm (hot afternoon), the tank slowly fills (absorbs heat). After the storm passes (evening), the tank slowly drains (releases heat). A small bucket fills and empties quickly (low thermal mass — like sheet metal). A large tank buffers the fluctuations — you never get flooding (overheating) or drought (overcooling).`,
      storyConnection: `The monsoon home in the story uses thick mud walls and a deep veranda — traditional architecture that embodies thermal mass principles. The walls absorb the fierce afternoon heat and release it gently at night, keeping the interior comfortable without any mechanical cooling. This ancestral engineering is now recognized as world-class passive design.`,
      checkQuestion: `A mud wall is 25 cm thick with density 1800 kg/m^3 and thermal diffusivity 5.0 x 10^-7 m^2/s. What is the thermal time lag?`,
      checkAnswer: `Time lag = L^2 / (2 * alpha) = 0.25^2 / (2 * 5e-7) = 0.0625 / 1e-6 = 62,500 seconds = 17.4 hours. This exceeds a full day-night cycle, meaning the wall effectively averages out daily temperature fluctuations entirely. A thinner 15 cm wall: 0.15^2 / 1e-6 = 22,500 s = 6.3 hours — the heat peak arrives at night, providing a useful phase shift.`,
      codeIntro: `Model the thermal time lag for different wall materials and thicknesses, comparing mud, brick, concrete, and wood.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Thermal Mass & Time Lag Analysis ---

materials = {
    'Mud/Adobe': {'k': 0.75, 'rho': 1800, 'c': 900, 'color': '#f59e0b'},
    'Fired brick': {'k': 0.80, 'rho': 1920, 'c': 835, 'color': '#ef4444'},
    'Concrete': {'k': 1.70, 'rho': 2300, 'c': 880, 'color': '#6b7280'},
    'Stone': {'k': 2.50, 'rho': 2700, 'c': 800, 'color': '#a855f7'},
    'Wood': {'k': 0.12, 'rho': 600, 'c': 1200, 'color': '#22c55e'},
    'Bamboo mat': {'k': 0.15, 'rho': 400, 'c': 1000, 'color': '#3b82f6'},
}

thicknesses = np.linspace(0.05, 0.50, 100)  # meters

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Thermal Mass & Time Lag in Monsoon Architecture',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Time lag vs thickness
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in materials.items():
    alpha = props['k'] / (props['rho'] * props['c'])
    time_lag_hours = thicknesses**2 / (2 * alpha) / 3600
    ax.plot(thicknesses * 100, time_lag_hours, color=props['color'],
            linewidth=2.5, label=name)
ax.axhline(12, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.text(40, 12.5, 'Half-day shift (ideal)', color='gray', fontsize=8)
ax.set_xlabel('Wall thickness (cm)', color='white')
ax.set_ylabel('Thermal time lag (hours)', color='white')
ax.set_title('How thick walls delay heat penetration', color='white')
ax.legend(fontsize=7)

# Panel 2: Thermal mass per m^2
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in materials.items():
    mass_per_m2 = thicknesses * props['rho'] * props['c'] / 1000  # kJ/K per m^2
    ax.plot(thicknesses * 100, mass_per_m2, color=props['color'],
            linewidth=2.5, label=name)
ax.set_xlabel('Wall thickness (cm)', color='white')
ax.set_ylabel('Thermal mass (kJ/K per m²)', color='white')
ax.set_title('Heat storage capacity per square meter of wall', color='white')
ax.legend(fontsize=7)

# Panel 3: Indoor temperature simulation (24-hour cycle)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
hours = np.linspace(0, 48, 500)
T_outdoor = 28 + 8 * np.sin(2 * np.pi * (hours - 14) / 24)  # peak at 2pm

for name, props in [('No wall (outdoor)', {'k': 100, 'rho': 1, 'c': 1, 'color': '#ef4444'}),
                     ('Bamboo mat (5cm)', {'k': 0.15, 'rho': 400, 'c': 1000, 'color': '#3b82f6'}),
                     ('Mud wall (25cm)', {'k': 0.75, 'rho': 1800, 'c': 900, 'color': '#f59e0b'}),
                     ('Stone wall (40cm)', {'k': 2.50, 'rho': 2700, 'c': 800, 'color': '#a855f7'})]:
    if name.startswith('No'):
        ax.plot(hours, T_outdoor, color=props['color'], linewidth=1.5, linestyle='--', label=name)
    else:
        thickness = float(name.split('(')[1].split('cm')[0]) / 100
        alpha = props['k'] / (props['rho'] * props['c'])
        lag = thickness**2 / (2 * alpha) / 3600  # hours
        decrement = np.exp(-thickness * np.sqrt(np.pi / (24*3600 * alpha)))
        T_indoor = 28 + 8 * decrement * np.sin(2 * np.pi * (hours - 14 - lag) / 24)
        ax.plot(hours, T_indoor, color=props['color'], linewidth=2.5, label=name)

ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Indoor temperature: effect of wall material', color='white')
ax.legend(fontsize=7)
ax.set_xlim(0, 48)

# Panel 4: Decrement factor (amplitude reduction)
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in materials.items():
    alpha = props['k'] / (props['rho'] * props['c'])
    decrement = np.exp(-thicknesses * np.sqrt(np.pi / (24*3600 * alpha)))
    ax.plot(thicknesses * 100, decrement * 100, color=props['color'],
            linewidth=2.5, label=name)
ax.set_xlabel('Wall thickness (cm)', color='white')
ax.set_ylabel('Temperature swing retained (%)', color='white')
ax.set_title('Decrement factor: how much swing passes through', color='white')
ax.legend(fontsize=7)
ax.axhline(10, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.text(40, 12, 'Target: <10% swing', color='gray', fontsize=8)

plt.tight_layout()
plt.show()

print("Thermal mass analysis:")
for name, props in materials.items():
    alpha = props['k'] / (props['rho'] * props['c'])
    lag_25cm = 0.25**2 / (2 * alpha) / 3600
    decr_25cm = np.exp(-0.25 * np.sqrt(np.pi / (24*3600 * alpha)))
    print(f"  {name}: alpha={alpha:.2e} m^2/s, lag(25cm)={lag_25cm:.1f}h, swing retained={decr_25cm*100:.1f}%")`,
      challenge: `Extend the model to include a 2-layer wall: outer brick (10cm) + inner mud plaster (5cm). Calculate the composite time lag and compare to a single-material wall of equal thickness.`,
      successHint: `Thermal mass is the unsung hero of traditional architecture. Before air conditioning, every culture in hot climates independently discovered that thick, dense walls moderate temperature extremes — physics enforcing the same solution worldwide.`,
    },
    {
      title: 'Passive ventilation & stack effect',
      concept: `**Passive ventilation** uses natural forces — wind and thermal buoyancy — to move air through a building without fans or electricity. The **stack effect** (or chimney effect) is the primary mechanism: warm air inside the building rises and exits through high openings, drawing cool air in through low openings. The driving pressure is: deltaP = rho * g * h * (T_inside - T_outside) / T_outside, where h is the height difference between inlet and outlet.

For a typical Assam house with 3 m floor-to-ceiling height, if the indoor air is 3 degrees warmer than outdoor air (30°C vs 27°C), the stack pressure is approximately: 1.2 * 9.81 * 3 * 3 / 300 = 0.35 Pa. This tiny pressure drives a surprising amount of airflow: through a 1 m^2 opening, it generates about 0.4 m^3/s of airflow — enough to provide 8 air changes per hour in a 50 m^2 room.

**Cross-ventilation** supplements the stack effect using wind pressure. When wind hits a building, it creates positive pressure on the windward side and negative pressure on the leeward side. The pressure difference is deltaP = 0.5 * Cp * rho * v^2, where Cp is the pressure coefficient (typically 0.6 windward, -0.3 leeward). Even a gentle 2 m/s breeze creates about 1.1 Pa — three times the stack pressure.

Monsoon architecture combines both: high-pitched roofs create strong stack effects, while strategic window placement captures cross-ventilation. The deep veranda creates a wind shadow that draws air through the house.`,
      analogy: `The stack effect is like a chimney. Hot air rises (like smoke in a chimney), creating suction at the bottom that pulls in fresh air. The taller the chimney (higher ceiling), the stronger the pull. Cross-ventilation is like opening windows on both sides of a car — the wind pushes air in one side and sucks it out the other, creating a refreshing breeze with zero energy input.`,
      storyConnection: `The monsoon home in the story has a high-pitched thatched roof and open windows on all sides. This is not just aesthetic — it is an optimized passive ventilation system. The high roof peak acts as a thermal chimney, the open sides enable cross-ventilation, and the veranda creates pressure differentials that pull air through living spaces.`,
      checkQuestion: `A room has 3.5 m ceilings, inlet at 0.5 m height, outlet at 3.2 m. Indoor temp is 32 degrees C, outdoor is 28 degrees C. What is the stack-driven airflow rate through a 0.5 m^2 opening?`,
      checkAnswer: `Height difference h = 3.2 - 0.5 = 2.7 m. deltaP = 1.2 * 9.81 * 2.7 * (32-28) / (28+273) = 1.2 * 9.81 * 2.7 * 4/301 = 0.42 Pa. Flow velocity v = sqrt(2 * deltaP / rho) = sqrt(2 * 0.42 / 1.2) = 0.84 m/s. Flow rate Q = v * A = 0.84 * 0.5 = 0.42 m^3/s. For a 40 m^3 room, this provides 0.42/40 * 3600 = 37.8 air changes per hour — excellent ventilation.`,
      codeIntro: `Simulate passive ventilation in a monsoon house: model the stack effect and cross-ventilation, and calculate the resulting indoor air temperature.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Passive Ventilation: Stack Effect + Cross-Ventilation ---
g = 9.81
rho_air = 1.2  # kg/m^3

# House parameters
floor_area = 50  # m^2
ceiling_height = 3.5  # m
room_volume = floor_area * ceiling_height
inlet_height = 0.5  # m
outlet_height = 3.2  # m
h_stack = outlet_height - inlet_height
opening_area = 0.8  # m^2 (total inlet area)
Cd = 0.65  # discharge coefficient

# Outdoor conditions (24-hour cycle, monsoon)
hours = np.linspace(0, 24, 200)
T_outdoor = 27 + 5 * np.sin(2 * np.pi * (hours - 14) / 24)  # peak at 2pm
wind_speed = 1.5 + 1.0 * np.sin(2 * np.pi * (hours - 10) / 24)  # afternoon breeze

# Simulate indoor temperature with passive ventilation
T_indoor = np.zeros_like(hours)
T_indoor[0] = 28  # initial
dt = hours[1] - hours[0]  # hours
thermal_mass = 200000  # J/K (furniture + walls)
internal_gains = 200  # W (occupants + cooking)

for i in range(1, len(hours)):
    T_in = T_indoor[i-1]
    T_out = T_outdoor[i]
    v_wind = wind_speed[i]

    # Stack effect pressure
    if T_in > T_out:
        dP_stack = rho_air * g * h_stack * (T_in - T_out) / (T_out + 273)
    else:
        dP_stack = 0

    # Wind pressure (cross-ventilation)
    Cp_diff = 0.9  # windward - leeward coefficient
    dP_wind = 0.5 * Cp_diff * rho_air * v_wind**2

    # Total driving pressure
    dP_total = dP_stack + dP_wind

    # Airflow rate
    v_flow = Cd * np.sqrt(2 * max(dP_total, 0) / rho_air)
    Q = v_flow * opening_area  # m^3/s

    # Air changes per hour
    ACH = Q * 3600 / room_volume

    # Heat balance
    Q_ventilation = Q * rho_air * 1005 * (T_out - T_in)  # W (cooling if T_out < T_in)
    Q_internal = internal_gains  # W
    dT = (Q_ventilation + Q_internal) / thermal_mass * dt * 3600  # degrees per time step
    T_indoor[i] = T_in + dT

# Calculate ACH over time
ACH_arr = np.zeros_like(hours)
for i in range(len(hours)):
    T_in = T_indoor[i]; T_out = T_outdoor[i]; v = wind_speed[i]
    dP = max(rho_air * g * h_stack * max(T_in - T_out, 0) / (T_out + 273) + 0.5 * 0.9 * rho_air * v**2, 0)
    Q_i = Cd * np.sqrt(2 * dP / rho_air) * opening_area
    ACH_arr[i] = Q_i * 3600 / room_volume

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Passive Ventilation in Monsoon Architecture',
             color='white', fontsize=14, fontweight='bold')

ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours, T_outdoor, color='#ef4444', linewidth=2, label='Outdoor')
ax.plot(hours, T_indoor, color='#22c55e', linewidth=2.5, label='Indoor (passive)')
ax.fill_between(hours, T_outdoor, T_indoor, where=T_outdoor > T_indoor,
                color='#22c55e', alpha=0.2, label='Cooling effect')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Indoor vs outdoor temperature', color='white')
ax.legend(fontsize=9)

ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours, ACH_arr, color='#3b82f6', linewidth=2.5)
ax.axhline(6, color='#22c55e', linewidth=1, linestyle='--', label='Minimum recommended (6 ACH)')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Air changes per hour', color='white')
ax.set_title('Ventilation rate (ACH)', color='white')
ax.legend(fontsize=9)

ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours, wind_speed, color='#f59e0b', linewidth=2.5)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Wind speed (m/s)', color='white')
ax.set_title('Wind speed profile', color='white')

ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
openings = np.linspace(0.1, 3.0, 50)
for v_w, color, label in [(0.5, '#3b82f6', '0.5 m/s'), (1.5, '#f59e0b', '1.5 m/s'), (3.0, '#ef4444', '3.0 m/s')]:
    dP = rho_air * g * h_stack * 3 / 300 + 0.5 * 0.9 * rho_air * v_w**2
    Q_flow = Cd * np.sqrt(2 * dP / rho_air) * openings
    ACH_calc = Q_flow * 3600 / room_volume
    ax.plot(openings, ACH_calc, color=color, linewidth=2.5, label=f'Wind = {label}')
ax.axhline(6, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlabel('Total opening area (m²)', color='white')
ax.set_ylabel('Air changes per hour', color='white')
ax.set_title('Ventilation vs opening size at different wind speeds', color='white')
ax.legend(fontsize=9)

plt.tight_layout()
plt.show()

print(f"Passive ventilation summary:")
print(f"  Peak cooling effect: {(T_outdoor - T_indoor).max():.1f}°C below outdoor peak")
print(f"  Average ACH: {np.mean(ACH_arr):.1f}")
print(f"  Max indoor temp: {T_indoor.max():.1f}°C vs outdoor max: {T_outdoor.max():.1f}°C")`,
      challenge: `Add a monsoon rain cooling effect: when rain falls on the roof, evaporative cooling reduces the effective outdoor temperature. Model a 2-hour afternoon rainfall that drops the roof temperature by 10 degrees and show the cascading effect on indoor temperature.`,
      successHint: `Passive ventilation is not primitive — it is sophisticated engineering that exploits the same physics as modern HVAC systems, using thermal buoyancy and wind pressure instead of electricity. The best monsoon architecture achieves comfort levels that mechanical systems struggle to match in humid climates.`,
    },
    {
      title: 'Evaporative cooling & humidity management',
      concept: `In hot-humid climates like monsoon Assam, **evaporative cooling** faces a challenge: it only works well when the air is dry enough to absorb moisture. The wet-bulb temperature sets the theoretical minimum achievable by evaporative cooling: T_wb = T_db - (T_db - T_dp) * (0.66 * P / 101.325), approximately. When relative humidity exceeds 80%, the cooling potential drops below 2-3 degrees — insufficient for comfort.

Traditional monsoon architecture addresses this through **dehumidification strategies**: (1) cross-ventilation to replace humid indoor air with dryer outdoor air during low-humidity periods, (2) hygroscopic materials (mud plaster, lime wash) that absorb moisture when humidity is high and release it when humidity drops, (3) raised floors that keep living spaces above ground-level moisture, and (4) deep verandas that shed rain and prevent direct moisture ingress.

The **psychrometric chart** is the engineer's tool for understanding air-water vapor interactions. It plots dry-bulb temperature vs humidity ratio, with curves for relative humidity, wet-bulb temperature, and enthalpy. Every passive cooling strategy can be represented as a path on this chart: evaporative cooling moves left along a constant wet-bulb line, ventilation moves the operating point toward outdoor conditions, and dehumidification moves downward at constant temperature.`,
      analogy: `Think of air as a sponge. Hot dry air is a wrung-out sponge — it can absorb a lot of water (evaporative cooling works well). Hot humid air is an already-soaked sponge — it cannot absorb more water (evaporative cooling fails). Monsoon architecture must deal with a soaked sponge, so it uses strategies to squeeze the sponge out (ventilation) or wait until the sponge dries naturally (nighttime humidity drop).`,
      storyConnection: `The monsoon home story features thick bamboo screens that are periodically wetted — a traditional evaporative cooling technique called 'khus screens' in South Asian architecture. The story also shows the house raised on stilts, keeping living spaces above ground moisture. These are not decorative choices but empirically optimized responses to the psychrometric challenges of monsoon climate.`,
      checkQuestion: `Outdoor air is at 35 degrees C and 40% relative humidity. What is the maximum temperature drop achievable through evaporative cooling? (Hint: the wet-bulb temperature at these conditions is approximately 25 degrees C)`,
      checkAnswer: `Maximum evaporative cooling = T_dry_bulb - T_wet_bulb = 35 - 25 = 10°C. The cooled air would be at 25°C but near 100% humidity. For a real system with 80% effectiveness: actual cooling = 0.80 * 10 = 8°C, giving 27°C at about 85% humidity. This is significant and comfortable. But during monsoon (35°C at 85% RH), the wet-bulb is about 33°C, giving only 2°C of cooling potential — nearly useless. This is why evaporative cooling alone cannot solve monsoon comfort.`,
      codeIntro: `Model the psychrometric limits of evaporative cooling across a range of monsoon conditions.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Evaporative Cooling & Psychrometrics ---

def wet_bulb_approx(T_db, RH):
    """Approximate wet-bulb temperature using Stull (2011) formula."""
    return T_db * np.arctan(0.151977 * (RH + 8.313659)**0.5) + \
           np.arctan(T_db + RH) - np.arctan(RH - 1.676331) + \
           0.00391838 * RH**1.5 * np.arctan(0.023101 * RH) - 4.686035

T_db_range = np.linspace(25, 45, 100)
RH_levels = [30, 50, 70, 85, 95]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Evaporative Cooling Potential in Monsoon Climate',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Cooling potential vs temperature at different humidities
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
colors_rh = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
for RH, color in zip(RH_levels, colors_rh):
    T_wb = wet_bulb_approx(T_db_range, RH)
    cooling = T_db_range - T_wb
    ax.plot(T_db_range, cooling, color=color, linewidth=2.5, label=f'RH = {RH}%')
ax.axhline(3, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.text(40, 3.3, 'Minimum useful cooling (3°C)', color='gray', fontsize=8)
ax.set_xlabel('Outdoor temperature (°C)', color='white')
ax.set_ylabel('Maximum cooling (°C)', color='white')
ax.set_title('Evaporative cooling potential', color='white')
ax.legend(fontsize=8)

# Panel 2: Comfort zones on a simplified psychrometric chart
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
T_range = np.linspace(15, 45, 100)
for RH in [20, 40, 60, 80, 100]:
    # Humidity ratio (approximate)
    P_sat = 610.78 * np.exp(17.27 * T_range / (T_range + 237.3))
    w = 0.622 * (RH/100 * P_sat) / (101325 - RH/100 * P_sat) * 1000  # g/kg
    ax.plot(T_range, w, color='gray', linewidth=0.5, alpha=0.5)
    ax.text(T_range[-1]+0.3, w[-1], f'{RH}%', color='gray', fontsize=7)
# Comfort zone
comfort_T = [20, 26, 26, 20]
comfort_w = [4, 4, 12, 12]
ax.fill(comfort_T, comfort_w, color='#22c55e', alpha=0.2, label='Comfort zone')
# Typical monsoon conditions
monsoon_conditions = [(35, 20), (32, 18), (28, 16), (30, 22)]
labels_mc = ['Afternoon', 'Evening', 'Night', 'Rainy afternoon']
for (T, w), label, color in zip(monsoon_conditions, labels_mc,
                                 ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7']):
    ax.scatter(T, w, color=color, s=80, zorder=10)
    ax.annotate(label, (T, w), textcoords="offset points", xytext=(5, 5),
                color=color, fontsize=8)
ax.set_xlabel('Dry-bulb temperature (°C)', color='white')
ax.set_ylabel('Humidity ratio (g/kg)', color='white')
ax.set_title('Simplified psychrometric chart', color='white')
ax.legend(fontsize=8)

# Panel 3: 24-hour humidity and temperature cycle (monsoon)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
hours = np.linspace(0, 24, 200)
T_monsoon = 28 + 5 * np.sin(2 * np.pi * (hours - 14) / 24)
RH_monsoon = 80 - 15 * np.sin(2 * np.pi * (hours - 14) / 24)  # inverse of temp
ax2 = ax.twinx()
ax.plot(hours, T_monsoon, color='#ef4444', linewidth=2.5, label='Temperature')
ax2.plot(hours, RH_monsoon, color='#3b82f6', linewidth=2.5, label='Humidity')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Temperature (°C)', color='#ef4444')
ax2.set_ylabel('Relative humidity (%)', color='#3b82f6')
ax.set_title('Typical monsoon day: T and RH', color='white')
ax.legend(loc='upper left', fontsize=8)
ax2.legend(loc='upper right', fontsize=8)

# Panel 4: Strategy comparison
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
strategies = {
    'Evaporative cooling\\n(dry period, RH<50%)': 8,
    'Cross-ventilation\\n(breezy, dT>2°C)': 4,
    'Thermal mass\\n(24-hour averaging)': 5,
    'Night flush\\n(cool night air)': 6,
    'Evaporative cooling\\n(monsoon, RH>80%)': 1.5,
    'Dehumidification\\n(desiccant)': 3,
}
names_s = list(strategies.keys())
values_s = list(strategies.values())
colors_s = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4']
bars = ax.barh(names_s, values_s, color=colors_s, alpha=0.8)
for bar, v in zip(bars, values_s):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
            f'{v:.1f}°C', color='white', fontsize=9, va='center')
ax.set_xlabel('Temperature reduction (°C)', color='white')
ax.set_title('Cooling strategy effectiveness', color='white')

plt.tight_layout()
plt.show()

print("Monsoon cooling strategy comparison:")
for name, val in strategies.items():
    print(f"  {name.replace(chr(10), ' ')}: {val:.1f}°C reduction")`,
      challenge: `Model a composite strategy: thermal mass walls + night ventilation + limited evaporative cooling during dry hours. Simulate a full 48-hour monsoon period and show that the combination achieves comfort when no single strategy could.`,
      successHint: `Monsoon architecture cannot rely on any single cooling strategy. The humid climate defeats evaporative cooling, thermal mass alone cannot handle peak loads, and ventilation depends on wind. The genius of traditional design is combining all three in a building that works across all monsoon conditions.`,
    },
    {
      title: 'Roof design & solar gain control',
      concept: `The roof is the most critical element in tropical building design because it receives the most solar radiation — up to 800 W/m^2 at peak on a horizontal surface in Assam. A poorly designed roof turns the house into an oven. A well-designed roof provides shade, reflects heat, and ventilates the attic space.

**Solar heat gain** through a roof is: Q_solar = alpha * I * A, where alpha is the solar absorptance (0.95 for dark surfaces, 0.25 for white/reflective), I is the solar irradiance (W/m^2), and A is the roof area. For a 50 m^2 dark roof at noon: Q = 0.95 * 800 * 50 = 38,000 W — enough to raise the room temperature by several degrees per hour.

Traditional monsoon roofs use multiple strategies: (1) **high albedo** materials (thatch, whitewashed surfaces) that reflect solar radiation, (2) **ventilated double roofs** where an air gap between inner and outer roof allows hot air to escape, (3) **steep pitch** that sheds monsoon rain and reduces the projected horizontal area receiving solar radiation, (4) **deep eaves** that shade the walls from direct sun, and (5) **attic ventilation** that removes trapped hot air before it can conduct into living spaces.

The **sol-air temperature** concept combines solar radiation and outdoor air temperature into a single equivalent temperature: T_sol = T_air + (alpha * I - epsilon * delta_R) / h_o, where epsilon is the surface emissivity, delta_R is the long-wave radiation exchange with the sky, and h_o is the outdoor combined heat transfer coefficient. For a dark roof in summer, T_sol can exceed air temperature by 20-30 degrees C.`,
      analogy: `A dark roof in the sun is like wearing a black t-shirt at the beach — it absorbs almost all the solar energy and gets scorching hot. A white or reflective roof is like wearing a white t-shirt — it bounces most of the energy back into the sky. The ventilated double roof is like wearing a loose white shirt with the collar open — it reflects heat AND allows air to carry away whatever heat does get through.`,
      storyConnection: `The monsoon home story describes a thatched roof with a steep pitch and wide eaves. Thatch has naturally low solar absorptance (light-colored, rough surface) and excellent insulation (trapped air in the straw). The steep pitch serves double duty: shedding monsoon rain AND reducing the horizontal projected area that receives solar radiation. Every feature is simultaneously solving multiple problems.`,
      checkQuestion: `A 60 m^2 roof receives 700 W/m^2 of solar radiation. Compare the heat gain for absorptance values of 0.90 (dark tile), 0.50 (aged thatch), and 0.25 (white-painted metal).`,
      checkAnswer: `Dark tile: Q = 0.90 * 700 * 60 = 37,800 W. Aged thatch: Q = 0.50 * 700 * 60 = 21,000 W. White paint: Q = 0.25 * 700 * 60 = 10,500 W. The white roof reduces heat gain by 72% compared to dark tile — a massive difference. In a house with 200 kJ/K thermal mass, the dark roof would raise indoor temperature by 37,800 / 200,000 = 0.19°C per second, or about 11°C per minute without any cooling. This is why roof design dominates tropical building physics.`,
      codeIntro: `Model the solar heat gain through different roof systems and compare traditional monsoon roof designs.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Roof Design & Solar Gain ---

# Solar radiation profile (clear day in Assam, ~26°N latitude)
hours = np.linspace(0, 24, 200)
solar_peak = 800  # W/m^2
solar_radiation = np.maximum(0, solar_peak * np.sin(np.pi * (hours - 6) / 12))
solar_radiation[hours < 6] = 0; solar_radiation[hours > 18] = 0

roof_area = 60  # m^2

# Roof types
roofs = {
    'Dark clay tile': {'alpha': 0.90, 'U': 5.0, 'ventilated': False, 'color': '#ef4444'},
    'Aged thatch (30cm)': {'alpha': 0.50, 'U': 0.8, 'ventilated': True, 'color': '#f59e0b'},
    'White metal + insulation': {'alpha': 0.25, 'U': 1.5, 'ventilated': False, 'color': '#3b82f6'},
    'Ventilated double roof': {'alpha': 0.30, 'U': 0.5, 'ventilated': True, 'color': '#22c55e'},
    'Green roof (vegetation)': {'alpha': 0.35, 'U': 0.7, 'ventilated': False, 'color': '#84cc16'},
}

T_outdoor = 28 + 5 * np.sin(2 * np.pi * (hours - 14) / 24)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Roof Design: Solar Gain Control in Monsoon Architecture',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Solar heat gain comparison
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in roofs.items():
    Q_solar = props['alpha'] * solar_radiation * roof_area
    vent_factor = 0.5 if props['ventilated'] else 1.0
    Q_net = Q_solar * vent_factor
    ax.plot(hours, Q_net / 1000, color=props['color'], linewidth=2.5, label=name)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Solar heat gain (kW)', color='white')
ax.set_title('Heat entering through roof', color='white')
ax.legend(fontsize=7)

# Panel 2: Sol-air temperature
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
h_o = 20  # W/(m^2.K) outdoor heat transfer coefficient
for name, props in roofs.items():
    T_sol = T_outdoor + props['alpha'] * solar_radiation / h_o
    ax.plot(hours, T_sol, color=props['color'], linewidth=2.5, label=name)
ax.plot(hours, T_outdoor, color='white', linewidth=1.5, linestyle='--', label='Air temperature')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Sol-air temperature (°C)', color='white')
ax.set_title('Effective temperature the roof "feels"', color='white')
ax.legend(fontsize=7)

# Panel 3: Indoor temperature with different roofs
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
thermal_mass = 300000  # J/K
ventilation_cooling = 500  # W (from passive ventilation)
for name, props in roofs.items():
    T_indoor = np.zeros_like(hours)
    T_indoor[0] = 28
    dt_h = hours[1] - hours[0]
    vent_factor = 0.5 if props['ventilated'] else 1.0
    for i in range(1, len(hours)):
        Q_roof = props['alpha'] * solar_radiation[i] * roof_area * vent_factor * props['U'] / 5
        Q_vent = ventilation_cooling * max(T_indoor[i-1] - T_outdoor[i], 0)
        dT = (Q_roof - Q_vent) / thermal_mass * dt_h * 3600
        T_indoor[i] = T_indoor[i-1] + dT
    ax.plot(hours, T_indoor, color=props['color'], linewidth=2.5, label=name)
ax.plot(hours, T_outdoor, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Indoor temperature (°C)', color='white')
ax.set_title('Indoor temperature by roof type', color='white')
ax.legend(fontsize=7)

# Panel 4: Daily heat gain totals
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names_r = list(roofs.keys())
daily_gains = []
for name, props in roofs.items():
    Q = props['alpha'] * solar_radiation * roof_area
    vent = 0.5 if props['ventilated'] else 1.0
    daily = np.trapz(Q * vent, hours * 3600) / 1e6  # MJ
    daily_gains.append(daily)
colors_r = [roofs[n]['color'] for n in names_r]
bars = ax.barh(names_r, daily_gains, color=colors_r, alpha=0.8)
for bar, v in zip(bars, daily_gains):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{v:.1f} MJ', color='white', fontsize=9, va='center')
ax.set_xlabel('Daily solar heat gain (MJ)', color='white')
ax.set_title('Total daily heat entering through roof', color='white')

plt.tight_layout()
plt.show()

print("Roof performance comparison:")
for name, gain in zip(names_r, daily_gains):
    print(f"  {name}: {gain:.1f} MJ/day ({gain/daily_gains[0]*100:.0f}% of worst)")`,
      challenge: `Add a monsoon rain cooling effect to the roof model: when rain falls (random 2-3 hour afternoon bursts), the evaporative cooling on the roof surface drops the sol-air temperature by 15-20 degrees. Model a week of alternating dry and rainy afternoons.`,
      successHint: `The roof is the building's first line of defense against solar heat. Traditional monsoon roofs combine low absorptance, insulation, ventilation, and steep pitch to reduce solar gain by 60-80% compared to modern dark roofs — passive engineering that modern "cool roof" technology is only now rediscovering.`,
    },
    {
      title: 'Vernacular building materials & their thermal properties',
      concept: `Vernacular building materials — mud, bamboo, thatch, stone, lime — have thermal properties that are remarkably well-suited to their climates. This is not coincidence: centuries of building practice selected materials that performed well and abandoned those that did not. This empirical optimization achieved results that thermal engineering analysis confirms as near-optimal.

**Mud/adobe** (k = 0.75 W/(m.K), rho = 1800 kg/m^3, c = 900 J/(kg.K)): Moderate conductivity provides reasonable insulation while high density gives excellent thermal mass. The combination produces time lags of 8-12 hours for typical wall thicknesses — perfectly matched to the diurnal cycle.

**Bamboo** (k = 0.12 W/(m.K), rho = 600 kg/m^3, c = 1200 J/(kg.K)): Very low conductivity makes it an excellent insulator but low density means poor thermal mass. Bamboo construction works best in climates where insulation matters more than thermal mass — humid tropical forests where temperature swings are small.

**Thatch** (k = 0.07 W/(m.K), rho = 240 kg/m^3, c = 1400 J/(kg.K)): The best natural insulator, with conductivity comparable to fiberglass. The trapped air in straw provides the insulation (air itself has k = 0.025). Thatch roofs in Assam can be 30-40 cm thick, giving R-values of 4-6 m^2.K/W — equivalent to modern insulated roofs.

**Lime plaster** absorbs moisture when humidity is high (hygroscopic buffering) and releases it when humidity drops, providing passive humidity regulation. The moisture buffering capacity of lime-plastered mud walls can absorb 70-100 g of water per square meter per day — significant in monsoon climates.`,
      analogy: `Vernacular materials are like evolved organisms — shaped by their environment over centuries. Mud walls in hot-dry climates are like desert cacti (store thermal 'water' for release at night). Bamboo houses in humid forests are like tree canopy (shade and ventilate without storing heat). Thatch roofs are like animal fur (trap air for insulation). Each material is optimized for its climate niche.`,
      storyConnection: `The monsoon home in the story uses a combination of all these materials: bamboo frame for structure and insulation, mud and lime plaster for thermal mass and humidity buffering, and thatch for roof insulation. This multi-material approach is not primitive — it is a sophisticated composite system where each material contributes the property it does best.`,
      checkQuestion: `Compare the thermal resistance (R-value) of: 25 cm mud wall, 5 cm bamboo wall, and 35 cm thatch roof. Which provides the best insulation per unit thickness?`,
      checkAnswer: `R = thickness / k. Mud: R = 0.25 / 0.75 = 0.33 m^2.K/W. Bamboo: R = 0.05 / 0.12 = 0.42 m^2.K/W. Thatch: R = 0.35 / 0.07 = 5.0 m^2.K/W. Per unit thickness: Mud = 1.33 m^2.K/W per meter. Bamboo = 8.33. Thatch = 14.3. Thatch is the best insulator per unit thickness by far, followed by bamboo. But mud's value is thermal mass, not insulation — it stores heat, which bamboo and thatch cannot.`,
      codeIntro: `Create a comprehensive comparison of vernacular building materials with radar charts showing multiple thermal properties.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Vernacular Building Materials Comparison ---

materials = {
    'Mud/Adobe': {'k': 0.75, 'rho': 1800, 'c': 900, 'cost': 1, 'moisture_buffer': 60, 'color': '#f59e0b'},
    'Fired brick': {'k': 0.80, 'rho': 1920, 'c': 835, 'cost': 3, 'moisture_buffer': 30, 'color': '#ef4444'},
    'Bamboo': {'k': 0.12, 'rho': 600, 'c': 1200, 'cost': 2, 'moisture_buffer': 20, 'color': '#22c55e'},
    'Thatch': {'k': 0.07, 'rho': 240, 'c': 1400, 'cost': 1, 'moisture_buffer': 80, 'color': '#84cc16'},
    'Stone': {'k': 2.50, 'rho': 2700, 'c': 800, 'cost': 4, 'moisture_buffer': 5, 'color': '#a855f7'},
    'Lime plaster': {'k': 0.70, 'rho': 1600, 'c': 840, 'cost': 2, 'moisture_buffer': 90, 'color': '#06b6d4'},
    'Concrete': {'k': 1.70, 'rho': 2300, 'c': 880, 'cost': 5, 'moisture_buffer': 10, 'color': '#6b7280'},
    'Steel sheet': {'k': 50.0, 'rho': 7800, 'c': 500, 'cost': 6, 'moisture_buffer': 0, 'color': '#374151'},
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Vernacular Building Materials: Thermal Properties',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Insulation vs thermal mass
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in materials.items():
    R_per_m = 1 / props['k']  # R-value per meter
    thermal_mass = props['rho'] * props['c'] / 1000  # kJ/(m^3.K)
    ax.scatter(R_per_m, thermal_mass, color=props['color'], s=120, zorder=10)
    ax.annotate(name, (R_per_m, thermal_mass), textcoords="offset points",
                xytext=(5, 5), color=props['color'], fontsize=8)
ax.set_xlabel('Insulation (R per meter, m².K/W per m)', color='white')
ax.set_ylabel('Thermal mass (kJ/(m³·K))', color='white')
ax.set_title('Insulation vs thermal mass', color='white')
ax.set_xscale('log')

# Panel 2: Time lag for 25cm wall
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names_m = list(materials.keys())
lags = []
for name in names_m:
    p = materials[name]
    alpha = p['k'] / (p['rho'] * p['c'])
    lag = 0.25**2 / (2 * alpha) / 3600  # hours
    lags.append(min(lag, 100))
colors_m = [materials[n]['color'] for n in names_m]
bars = ax.barh(names_m, lags, color=colors_m, alpha=0.8)
for bar, v in zip(bars, lags):
    ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
            f'{v:.1f}h', color='white', fontsize=8, va='center')
ax.set_xlabel('Time lag for 25cm wall (hours)', color='white')
ax.set_title('Thermal time lag (25cm thickness)', color='white')
ax.axvline(12, color='white', linewidth=0.5, linestyle='--', alpha=0.3)

# Panel 3: Moisture buffering capacity
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
moisture = [materials[n]['moisture_buffer'] for n in names_m]
bars = ax.barh(names_m, moisture, color=colors_m, alpha=0.8)
for bar, v in zip(bars, moisture):
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{v} g/m²/day', color='white', fontsize=8, va='center')
ax.set_xlabel('Moisture buffering (g/m²/day)', color='white')
ax.set_title('Humidity regulation capacity', color='white')

# Panel 4: Cost vs performance index
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for name, props in materials.items():
    alpha = props['k'] / (props['rho'] * props['c'])
    # Performance index: combination of insulation, mass, and moisture control
    perf = (1/props['k']) * (props['rho'] * props['c'] / 1e6) * (props['moisture_buffer'] / 50)
    ax.scatter(props['cost'], perf, color=props['color'], s=150, zorder=10)
    ax.annotate(name, (props['cost'], perf), textcoords="offset points",
                xytext=(5, 5), color=props['color'], fontsize=8)
ax.set_xlabel('Relative cost', color='white')
ax.set_ylabel('Composite performance index', color='white')
ax.set_title('Cost vs thermal performance', color='white')

plt.tight_layout()
plt.show()

print("Material comparison for monsoon climate:")
print(f"{'Material':<15} {'k':>6} {'Thermal mass':>12} {'Lag(25cm)':>10} {'Moisture':>10} {'Cost':>5}")
for name in names_m:
    p = materials[name]
    alpha = p['k'] / (p['rho'] * p['c'])
    lag = min(0.25**2 / (2 * alpha) / 3600, 100)
    print(f"{name:<15} {p['k']:>6.2f} {p['rho']*p['c']/1000:>10.0f} {lag:>10.1f}h {p['moisture_buffer']:>8}g {p['cost']:>5}")`,
      challenge: `Design an optimal wall assembly for Assam monsoon climate using a combination of materials: outer layer for weather protection, middle layer for thermal mass, inner layer for humidity buffering. Compare your composite wall to a single-material wall of equal total thickness.`,
      successHint: `Vernacular materials were selected by evolutionary pressure — centuries of building and rebuilding until the best-performing combinations survived. Modern material science confirms that these empirical choices are thermally optimal for their climates, often outperforming modern materials in passive performance.`,
    },
    {
      title: 'Integrated passive design: putting it all together',
      concept: `A complete passive building design integrates thermal mass, ventilation, evaporative cooling, solar gain control, and material selection into a single coherent system. The challenge is that these strategies can conflict: thick walls for thermal mass impede ventilation; large windows for ventilation increase solar gain; raised floors for moisture protection reduce thermal coupling to the ground.

The **bioclimatic design** methodology resolves these conflicts by prioritizing strategies based on the local climate. For monsoon Assam (hot, humid, heavy rain), the priority order is: (1) ventilation (essential for humidity control), (2) solar gain control (roof design dominates), (3) thermal mass (for nighttime comfort), (4) moisture protection (raised floors, wide eaves), and (5) limited evaporative cooling (only during dry spells).

The **adaptive comfort model** recognizes that thermal comfort in naturally ventilated buildings differs from air-conditioned buildings. Occupants in naturally ventilated buildings tolerate and prefer higher temperatures (up to 30-31 degrees C) compared to AC buildings (24-26 degrees C) because of physiological and psychological adaptation. This wider comfort band makes passive design more feasible — the building does not need to achieve the same low temperatures as an AC system.

A well-designed passive monsoon house can maintain indoor temperatures 3-5 degrees C below outdoor peaks, with air change rates of 10-30 per hour, relative humidity moderated by 10-15%, and zero energy consumption for cooling. This is not theoretical — it describes the actual performance of traditional Assam houses that have been tested with modern instruments.`,
      analogy: `Designing a passive building is like conducting an orchestra. Each instrument (strategy) has its strengths and limitations. The conductor (architect/engineer) must coordinate them so they complement rather than compete. The thermal mass is the bass section (steady, slow, foundational). Ventilation is the winds (dynamic, responsive). The roof is the percussion (dominant, sets the rhythm). The materials are the strings (nuanced, filling in details).`,
      storyConnection: `The monsoon home in the story is the orchestra in full performance: thick mud walls providing thermal bass, open windows singing with cross-ventilation, the thatched roof keeping out the solar percussion, and bamboo screens adding the nuanced detail of humidity control. No single element is remarkable; the composition is extraordinary.`,
      checkQuestion: `A passive monsoon house achieves 3 degrees C below outdoor peak, while an AC house maintains 24 degrees C. If outdoor peak is 35 degrees C, which provides better comfort? (Hint: consider the adaptive comfort model)`,
      checkAnswer: `Passive house: 35 - 3 = 32°C. AC house: 24°C. The AC house is clearly cooler. But the adaptive comfort model shows that naturally ventilated occupants find 30-31°C acceptable with adequate air movement (>0.5 m/s). At 32°C with a ceiling fan (1 m/s air speed), the effective temperature drops to about 29°C — within the comfort zone. Moreover, the AC house creates a 11°C shock when occupants go outside (24 to 35), while the passive house creates only a 3°C transition. For health and energy, the passive house is often superior.`,
      codeIntro: `Build a complete passive design simulation that integrates all strategies and evaluates comfort over a monsoon week.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Integrated Passive Design Simulation ---

# Week-long monsoon simulation (7 days, hourly data)
hours = np.linspace(0, 168, 168 * 4)  # 15-min steps
day_hour = hours % 24

# Weather generation (typical monsoon week)
np.random.seed(42)
T_outdoor = 28 + 5 * np.sin(2 * np.pi * (day_hour - 14) / 24)
T_outdoor += np.random.normal(0, 0.5, len(hours))  # noise
rain = np.zeros_like(hours)
# Random afternoon rain bursts
for day in range(7):
    if np.random.random() < 0.6:  # 60% chance of rain
        rain_start = day * 24 + np.random.uniform(13, 16)
        rain_duration = np.random.uniform(1, 3)
        rain[(hours >= rain_start * 4) & (hours < (rain_start + rain_duration) * 4)] = 1
        # Rain cools outdoor temp
        rain_mask = (hours >= rain_start * 4) & (hours < (rain_start + rain_duration) * 4)
        T_outdoor[rain_mask] -= 5

RH_outdoor = 75 + 10 * np.sin(2 * np.pi * (day_hour - 4) / 24) + rain * 15
RH_outdoor = np.clip(RH_outdoor, 40, 98)
wind = 1.0 + 1.5 * np.sin(2 * np.pi * (day_hour - 12) / 24) + np.random.normal(0, 0.3, len(hours))
wind = np.clip(wind, 0, 5)
solar = np.maximum(0, 800 * np.sin(np.pi * (day_hour - 6) / 12) * (1 - rain * 0.8))
solar[day_hour < 6] = 0; solar[day_hour > 18] = 0

# Three building types
buildings = {
    'Traditional monsoon house': {
        'roof_alpha': 0.40, 'wall_mass': 400000, 'wall_U': 2.5,
        'vent_area': 2.0, 'roof_vent': True, 'raised': True,
    },
    'Modern concrete box': {
        'roof_alpha': 0.85, 'wall_mass': 250000, 'wall_U': 4.0,
        'vent_area': 0.5, 'roof_vent': False, 'raised': False,
    },
    'Optimized passive design': {
        'roof_alpha': 0.25, 'wall_mass': 500000, 'wall_U': 1.5,
        'vent_area': 3.0, 'roof_vent': True, 'raised': True,
    },
}

roof_area = 60
floor_area = 50
room_vol = floor_area * 3.5
dt_sec = 900  # 15 min

results = {}
for bname, bprops in buildings.items():
    T_in = np.zeros_like(hours)
    T_in[0] = 28
    for i in range(1, len(hours)):
        # Solar gain through roof
        vent_factor = 0.5 if bprops['roof_vent'] else 1.0
        Q_solar = bprops['roof_alpha'] * solar[i] * roof_area * vent_factor

        # Ventilation cooling
        dP = 1.2 * 9.81 * 3.0 * max(T_in[i-1] - T_outdoor[i], 0) / 300
        dP += 0.5 * 0.9 * 1.2 * wind[i]**2
        Q_vent_flow = 0.65 * np.sqrt(max(2 * dP / 1.2, 0)) * bprops['vent_area']
        Q_vent = Q_vent_flow * 1.2 * 1005 * (T_outdoor[i] - T_in[i-1])

        # Conduction through walls
        Q_wall = bprops['wall_U'] * (floor_area * 0.6) * (T_outdoor[i] - T_in[i-1])

        # Internal gains
        Q_internal = 200  # W

        # Net heat flow
        Q_net = Q_solar + Q_vent + Q_wall + Q_internal
        dT = Q_net / bprops['wall_mass'] * dt_sec
        T_in[i] = T_in[i-1] + dT

    results[bname] = T_in

# Comfort analysis (adaptive model)
T_comfort_upper = 31  # naturally ventilated comfort limit
T_comfort_lower = 24

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Integrated Passive Design: One-Week Monsoon Simulation',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Temperature comparison
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours/24, T_outdoor, color='gray', linewidth=1, alpha=0.5, label='Outdoor')
colors_b = ['#22c55e', '#ef4444', '#3b82f6']
for (name, T_in), color in zip(results.items(), colors_b):
    ax.plot(hours/24, T_in, color=color, linewidth=2, label=name)
ax.axhspan(T_comfort_lower, T_comfort_upper, color='white', alpha=0.05)
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Indoor temperature over 7-day monsoon period', color='white')
ax.legend(fontsize=7)

# Panel 2: Comfort hours comparison
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
comfort_pct = {}
for name, T_in in results.items():
    comfortable = np.sum((T_in >= T_comfort_lower) & (T_in <= T_comfort_upper)) / len(T_in) * 100
    comfort_pct[name] = comfortable
bars = ax.barh(list(comfort_pct.keys()), list(comfort_pct.values()), color=colors_b, alpha=0.8)
for bar, v in zip(bars, comfort_pct.values()):
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{v:.1f}%', color='white', fontsize=10, va='center')
ax.set_xlabel('Hours within comfort zone (%)', color='white')
ax.set_title('Comfort performance (24-31°C)', color='white')

# Panel 3: Peak temperature comparison
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for day in range(7):
    mask = (hours >= day * 24 * 4) & (hours < (day + 1) * 24 * 4)
    day_T_out = T_outdoor[mask].max()
    for j, (name, T_in) in enumerate(results.items()):
        day_T_in = T_in[mask].max()
        offset = (j - 1) * 0.25
        bar_color = colors_b[j]
        ax.bar(day + offset, day_T_out - day_T_in, 0.2, bottom=0,
               color=bar_color, alpha=0.8)
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Peak cooling below outdoor (°C)', color='white')
ax.set_title('Daily peak cooling performance', color='white')

# Panel 4: Summary
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
lines = ['PERFORMANCE SUMMARY (7-day monsoon):', '']
for name, T_in in results.items():
    peak_reduction = T_outdoor.max() - T_in.max()
    avg_reduction = np.mean(T_outdoor - T_in)
    comfort = comfort_pct[name]
    lines.append(f"{name}:")
    lines.append(f"  Peak cooling: {peak_reduction:.1f}°C below outdoor max")
    lines.append(f"  Avg cooling: {avg_reduction:.1f}°C below outdoor avg")
    lines.append(f"  Comfort hours: {comfort:.1f}%")
    lines.append(f"  Energy cost: $0 (fully passive)")
    lines.append('')
for i, line in enumerate(lines):
    weight = 'bold' if i == 0 or (line.endswith(':') and not line.startswith(' ')) else 'normal'
    color = '#f59e0b' if weight == 'bold' else 'white'
    ax.text(0.02, 0.97 - i * 0.06, line, color=color, fontsize=9,
            transform=ax.transAxes, fontfamily='monospace', fontweight=weight)

plt.tight_layout()
plt.show()

print("7-day monsoon simulation complete")
for name, T_in in results.items():
    print(f"  {name}: max={T_in.max():.1f}°C, comfort={comfort_pct[name]:.1f}%")`,
      challenge: `Add an AC comparison: model an air-conditioned building maintaining 24 degrees C at all times. Calculate the energy consumption in kWh for the week, the electricity cost, and compare the carbon footprint to the zero-energy passive buildings.`,
      successHint: `The integrated passive design simulation proves that traditional monsoon architecture, when properly understood and optimized, provides comfort comparable to mechanical systems at zero energy cost. The secret is not any single strategy but the orchestrated combination of thermal mass, ventilation, solar control, and climate-adapted materials.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Building Science & Passive Cooling
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (heat and materials fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for building physics and thermal simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
