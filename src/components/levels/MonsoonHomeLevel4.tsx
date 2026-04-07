import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MonsoonHomeLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Passive Cooling House Designer',
      concept: `Our capstone is a **Passive Cooling House Designer** — a computational tool that takes climate data (temperature, humidity, solar radiation, wind) and building parameters (materials, dimensions, orientation) and predicts indoor conditions throughout the year. The tool optimizes the design for maximum comfort with zero mechanical cooling. This is real building physics software used by architects and engineers worldwide. Our version focuses on monsoon climates of Northeast India, where the combination of high heat, extreme humidity, and heavy rain creates unique design challenges. The six capstone lessons build: (1) climate data processing, (2) thermal simulation engine, (3) ventilation model, (4) comfort evaluation, (5) design optimization, and (6) final integrated tool with visualization.`,
      analogy: `Building this designer is like creating a flight simulator for houses. Just as a flight simulator models aerodynamics, weather, and pilot actions to predict whether a plane will fly safely, our designer models thermodynamics, climate, and architectural choices to predict whether a house will stay cool passively.`,
      storyConnection: `The monsoon home story describes a house that stays cool naturally — comfortable even during the hottest, most humid days. Our designer can now predict, quantify, and optimize that comfort for any house in any monsoon climate location.`,
      checkQuestion: `Why is a computational design tool necessary — why can\'t architects just copy traditional designs?`,
      checkAnswer: `Traditional designs are optimized for specific local conditions. A house that works in the Brahmaputra Valley (hot, flat, humid) may not work in the Meghalaya highlands (cool, hilly, extremely wet). Computational tools allow architects to adapt designs to any microclimate, test modifications before building, and quantify performance improvements. They also enable optimization — finding the best combination from thousands of possible material and dimension choices that would be impossible to evaluate by intuition alone.`,
      codeIntro: `Define the climate data format and build the climate processing module.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# === PASSIVE COOLING HOUSE DESIGNER — Climate Module ===

class ClimateData:
    """Generate and process climate data for monsoon regions."""
    def __init__(self, location='guwahati'):
        self.location = location
        self.profiles = {
            'guwahati': {'lat': 26.1, 'T_mean': 25, 'T_amp': 7, 'RH_mean': 78, 'rain_prob': 0.5},
            'shillong': {'lat': 25.6, 'T_mean': 18, 'T_amp': 5, 'RH_mean': 82, 'rain_prob': 0.7},
            'imphal': {'lat': 24.8, 'T_mean': 22, 'T_amp': 6, 'RH_mean': 75, 'rain_prob': 0.45},
        }
        self.params = self.profiles.get(location, self.profiles['guwahati'])

    def generate_hourly(self, n_days=7):
        p = self.params; np.random.seed(42)
        hours = np.arange(n_days * 24)
        day_hour = hours % 24
        day_num = hours // 24
        # Seasonal variation
        season = 1 + 0.3 * np.sin(2 * np.pi * day_num / 365)
        # Diurnal temperature
        T = p['T_mean'] * season + p['T_amp'] * np.sin(2 * np.pi * (day_hour - 14) / 24)
        T += np.random.normal(0, 0.5, len(hours))
        # Humidity (inverse of temperature)
        RH = p['RH_mean'] - 10 * np.sin(2 * np.pi * (day_hour - 14) / 24)
        RH = np.clip(RH + np.random.normal(0, 3, len(hours)), 30, 98)
        # Solar radiation
        solar = np.maximum(0, 800 * np.sin(np.pi * (day_hour - 6) / 12))
        solar[day_hour < 6] = 0; solar[day_hour > 18] = 0
        # Rain
        rain = np.zeros(len(hours))
        for d in range(n_days):
            if np.random.random() < p['rain_prob']:
                start = d * 24 + int(np.random.uniform(12, 17))
                dur = int(np.random.uniform(1, 4))
                rain[start:start+dur] = np.random.uniform(5, 30)
                T[start:start+dur] -= 4; solar[start:start+dur] *= 0.2; RH[start:start+dur] += 10
        RH = np.clip(RH, 30, 98)
        # Wind
        wind = 1.0 + 1.5 * np.sin(2 * np.pi * (day_hour - 12) / 24)
        wind = np.clip(wind + np.random.normal(0, 0.3, len(hours)), 0, 8)
        return {'hours': hours, 'T': T, 'RH': RH, 'solar': solar, 'rain': rain, 'wind': wind}

# Generate and visualize
locations = ['guwahati', 'shillong', 'imphal']
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Passive House Designer — Climate Data Module', color='white', fontsize=14, fontweight='bold')

colors_loc = ['#ef4444', '#3b82f6', '#22c55e']
for loc, color in zip(locations, colors_loc):
    climate = ClimateData(loc)
    data = climate.generate_hourly(7)
    axes[0,0].plot(data['hours']/24, data['T'], color=color, linewidth=1, alpha=0.8, label=loc.title())
    axes[0,1].plot(data['hours']/24, data['RH'], color=color, linewidth=1, alpha=0.8, label=loc.title())
    axes[1,0].plot(data['hours']/24, data['solar'], color=color, linewidth=1, alpha=0.5, label=loc.title())
    axes[1,1].plot(data['hours']/24, data['wind'], color=color, linewidth=1, alpha=0.8, label=loc.title())

for ax, title, ylabel in zip(axes.flat, ['Temperature', 'Humidity', 'Solar radiation', 'Wind speed'],
                              ['°C', '%', 'W/m²', 'm/s']):
    ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
    ax.set_xlabel('Day', color='white'); ax.set_ylabel(ylabel, color='white')
    ax.set_title(title, color='white'); ax.legend(fontsize=8)
plt.tight_layout(); plt.show()
print("Climate module ready: 3 locations, hourly resolution")`,
      challenge: `Add climate data for Tawang (high altitude, cold winters, cool summers) and Dibrugarh (low-lying, extreme monsoon). Compare the passive cooling challenges across all 5 locations.`,
      successHint: `The climate module transforms raw weather into structured data that the thermal simulation engine can process. Different monsoon locations have dramatically different challenges, and the designer must adapt to each.`,
    },
    {
      title: 'Thermal Simulation Engine',
      concept: `The thermal simulation engine is the computational core: it solves the heat balance equation for the building at every time step. The equation is: C * dT_in/dt = Q_solar + Q_ventilation + Q_conduction + Q_internal + Q_evaporative, where C is the building's total thermal capacitance (J/K). Each term is computed from the building geometry, material properties, and current climate conditions. The engine uses an explicit Euler time-stepping scheme with adaptive step sizing to ensure numerical stability. For multi-zone buildings, the engine solves coupled equations for each zone simultaneously.`,
      analogy: `The thermal engine is like a weather forecast model for the inside of a building. Just as weather models compute temperature, wind, and humidity at millions of grid points in the atmosphere, our engine computes temperature at every surface and air zone in the building. The physics is identical — heat transfer — just at a smaller scale.`,
      storyConnection: `The monsoon home's thermal behavior — cool in the morning, warming slowly through the afternoon, releasing stored heat at night — is exactly what our simulation engine predicts. The engine makes the invisible heat flows visible and quantifiable.`,
      checkQuestion: `If a building has thermal capacitance of 500 kJ/K and net heat gain of 2 kW, how long until the temperature rises by 1 degree?`,
      checkAnswer: `Time = C * deltaT / Q = 500,000 / 2000 = 250 seconds = 4.2 minutes. This shows why thermal mass matters: a lightweight building (C = 50 kJ/K) would heat up in 25 seconds — 10x faster.`,
      codeIntro: `Build the thermal simulation engine and validate it against the climate data.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Thermal Simulation Engine ===
class ThermalEngine:
    def __init__(self, floor_area=50, ceiling_height=3.5, wall_k=0.75, wall_thick=0.25,
                 wall_rho=1800, wall_c=900, roof_alpha=0.4, vent_area=2.0):
        self.floor_area = floor_area
        self.volume = floor_area * ceiling_height
        self.wall_area = np.sqrt(floor_area) * 4 * ceiling_height
        self.wall_U = wall_k / wall_thick
        self.thermal_mass = wall_rho * wall_c * wall_thick * self.wall_area
        self.roof_alpha = roof_alpha
        self.vent_area = vent_area
        self.ceiling_height = ceiling_height

    def simulate(self, climate_data, internal_gain=200):
        T = climate_data['T']; solar = climate_data['solar']
        wind = climate_data['wind']; n = len(T)
        T_in = np.zeros(n); T_in[0] = T[0]
        dt = 3600  # 1 hour

        for i in range(1, n):
            Q_solar = self.roof_alpha * solar[i] * self.floor_area * 0.5
            dP = max(1.2*9.81*self.ceiling_height*max(T_in[i-1]-T[i],0)/(T[i]+273) + 0.5*0.9*1.2*wind[i]**2, 0)
            Q_flow = 0.65 * np.sqrt(max(2*dP/1.2, 0)) * self.vent_area
            Q_vent = Q_flow * 1.2 * 1005 * (T[i] - T_in[i-1])
            Q_wall = self.wall_U * self.wall_area * (T[i] - T_in[i-1])
            Q_net = Q_solar + Q_vent + Q_wall + internal_gain
            T_in[i] = T_in[i-1] + Q_net / self.thermal_mass * dt
        return T_in

# Compare three building designs
designs = {
    'Traditional (thick mud, thatch, ventilated)': ThermalEngine(50, 3.5, 0.75, 0.25, 1800, 900, 0.40, 2.5),
    'Modern (thin concrete, metal roof)': ThermalEngine(50, 3.0, 1.70, 0.15, 2300, 880, 0.85, 0.5),
    'Optimized passive': ThermalEngine(50, 4.0, 0.50, 0.30, 2000, 1000, 0.25, 3.0),
}

np.random.seed(42)
hours = np.arange(7 * 24); dh = hours % 24
T_out = 28 + 5*np.sin(2*np.pi*(dh-14)/24) + np.random.normal(0, 0.5, len(hours))
solar = np.maximum(0, 800*np.sin(np.pi*(dh-6)/12)); solar[dh<6]=0; solar[dh>18]=0
wind = np.clip(1+1.5*np.sin(2*np.pi*(dh-12)/24)+np.random.normal(0,0.3,len(hours)), 0, 5)
climate = {'T': T_out, 'solar': solar, 'wind': wind, 'hours': hours}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Thermal Simulation Engine — 7-Day Validation', color='white', fontsize=14, fontweight='bold')

colors_d = ['#22c55e', '#ef4444', '#3b82f6']
ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours/24, T_out, color='gray', linewidth=1, alpha=0.5, label='Outdoor')
for (name, engine), color in zip(designs.items(), colors_d):
    T_in = engine.simulate(climate)
    ax.plot(hours/24, T_in, color=color, linewidth=2, label=name[:25])
ax.set_xlabel('Day', color='white'); ax.set_ylabel('°C', color='white')
ax.set_title('Indoor temperatures', color='white'); ax.legend(fontsize=7)

ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for (name, engine), color in zip(designs.items(), colors_d):
    T_in = engine.simulate(climate)
    cooling = T_out - T_in
    ax.plot(hours/24, cooling, color=color, linewidth=2, label=name[:25])
ax.axhline(0, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlabel('Day', color='white'); ax.set_ylabel('Cooling below outdoor (°C)', color='white')
ax.set_title('Cooling performance', color='white'); ax.legend(fontsize=7)

ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names = list(designs.keys())
maxT = [designs[n].simulate(climate).max() for n in names]
bars = ax.barh([n[:25] for n in names], maxT, color=colors_d, alpha=0.8)
for bar, v in zip(bars, maxT): ax.text(bar.get_width()+0.1, bar.get_y()+bar.get_height()/2, f'{v:.1f}°C', color='white', fontsize=9, va='center')
ax.set_xlabel('Peak indoor temperature (°C)', color='white'); ax.set_title('Peak performance', color='white')

ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
comfort = [np.sum((designs[n].simulate(climate)>=24)&(designs[n].simulate(climate)<=31))/len(hours)*100 for n in names]
bars = ax.barh([n[:25] for n in names], comfort, color=colors_d, alpha=0.8)
for bar, v in zip(bars, comfort): ax.text(bar.get_width()+0.5, bar.get_y()+bar.get_height()/2, f'{v:.1f}%', color='white', fontsize=9, va='center')
ax.set_xlabel('Comfort hours (%)', color='white'); ax.set_title('Comfort performance (24-31°C)', color='white')

plt.tight_layout(); plt.show()
for n in names: T_in = designs[n].simulate(climate); print(f"  {n[:30]}: max={T_in.max():.1f}°C, comfort={np.sum((T_in>=24)&(T_in<=31))/len(hours)*100:.1f}%")`,
      challenge: `Add humidity tracking to the simulation: model moisture generation from occupants (50 g/h per person) and removal via ventilation. Track indoor relative humidity alongside temperature.`,
      successHint: `The thermal engine transforms building physics into predictions. It shows that traditional monsoon houses outperform modern concrete boxes — validating centuries of empirical design knowledge with computational evidence.`,
    },
    {
      title: 'Ventilation & Comfort Model',
      concept: `The ventilation model computes airflow rates from buoyancy (stack effect) and wind pressure, then evaluates thermal comfort using the adaptive comfort standard. Comfort depends not just on temperature but on air velocity, humidity, clothing, and metabolic rate. The PMV-PPD model (Predicted Mean Vote - Predicted Percentage Dissatisfied) quantifies comfort on a -3 to +3 scale. For naturally ventilated buildings, the adaptive model is more appropriate: T_comfort = 0.31 * T_running_mean_outdoor + 17.8, with an acceptable band of +/- 3.5 degrees C.`,
      analogy: `Comfort is like a Goldilocks problem with five variables. Temperature must be not too hot, not too cold. Humidity must be not too dry, not too muggy. Air movement must be not too still, not too drafty. Add clothing and activity level, and you have a five-dimensional comfort space that the model must evaluate.`,
      storyConnection: `The monsoon home provides comfort through air movement — ceiling fans and cross-ventilation create a cooling effect that makes 30 degrees C feel like 27 degrees C. Our comfort model quantifies this effect.`,
      checkQuestion: `At 30 degrees C with 0.5 m/s air movement, the effective temperature is about 28 degrees C. If air speed increases to 1.5 m/s, what is the effective temperature?`,
      checkAnswer: `The cooling effect of air movement is approximately: delta_T = 3.6 * sqrt(v) - 3.6 * sqrt(0.1) for v > 0.1 m/s. At 0.5 m/s: delta_T = 3.6*(0.71 - 0.32) = 1.4°C, effective T = 28.6°C. At 1.5 m/s: delta_T = 3.6*(1.22 - 0.32) = 3.2°C, effective T = 26.8°C. The 1 m/s increase in air speed provides nearly 2°C of additional cooling — equivalent to a significant reduction in air conditioning setpoint.`,
      codeIntro: `Model the comfort conditions in the passive house and visualize on a psychrometric-style chart.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Ventilation & Comfort Model ===

def adaptive_comfort(T_outdoor_running_mean):
    T_neutral = 0.31 * T_outdoor_running_mean + 17.8
    return T_neutral - 3.5, T_neutral + 3.5

def effective_temp(T_air, v_air, RH=60):
    if v_air > 0.1:
        cooling = 3.6 * (np.sqrt(v_air) - np.sqrt(0.1))
    else:
        cooling = 0
    return T_air - cooling

# Generate week of data
np.random.seed(42); hours = np.arange(168); dh = hours % 24
T_out = 28+5*np.sin(2*np.pi*(dh-14)/24)+np.random.normal(0,0.5,168)
wind = np.clip(1+1.5*np.sin(2*np.pi*(dh-12)/24)+np.random.normal(0,0.3,168),0,5)
T_in = T_out - 3 + np.random.normal(0, 0.5, 168)  # simplified passive house
v_indoor = wind * 0.3  # 30% of outdoor wind

T_eff = np.array([effective_temp(T_in[i], max(v_indoor[i], 0.5)) for i in range(168)])
T_rm = np.convolve(T_out, np.ones(24)/24, mode='same')
comfort_low, comfort_high = adaptive_comfort(T_rm)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Ventilation & Comfort Analysis', color='white', fontsize=14, fontweight='bold')

ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours/24, T_in, color='#f59e0b', linewidth=2, label='Air temperature')
ax.plot(hours/24, T_eff, color='#22c55e', linewidth=2, label='Effective temperature')
ax.fill_between(hours/24, comfort_low, comfort_high, color='#3b82f6', alpha=0.15, label='Comfort band')
ax.set_xlabel('Day', color='white'); ax.set_ylabel('°C', color='white')
ax.set_title('Air movement cooling effect', color='white'); ax.legend(fontsize=8)

ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
v_range = np.linspace(0, 3, 100)
for T in [28, 30, 32, 34]:
    T_effs = [effective_temp(T, v) for v in v_range]
    ax.plot(v_range, T_effs, linewidth=2, label=f'T_air = {T}°C')
ax.axhspan(24, 31, color='#22c55e', alpha=0.1, label='Comfort zone')
ax.set_xlabel('Air velocity (m/s)', color='white'); ax.set_ylabel('Effective temp (°C)', color='white')
ax.set_title('Air speed cooling effect', color='white'); ax.legend(fontsize=8)

ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
comfortable_air = np.sum((T_in >= comfort_low) & (T_in <= comfort_high))/168*100
comfortable_eff = np.sum((T_eff >= comfort_low) & (T_eff <= comfort_high))/168*100
bars = ax.bar(['Without\\nair movement', 'With\\nair movement'], [comfortable_air, comfortable_eff],
              color=['#ef4444', '#22c55e'], alpha=0.8)
for bar, v in zip(bars, [comfortable_air, comfortable_eff]):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+1, f'{v:.1f}%', color='white', fontsize=12, ha='center')
ax.set_ylabel('Comfort hours (%)', color='white'); ax.set_title('Impact of ventilation on comfort', color='white')

ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours/24, v_indoor, color='#3b82f6', linewidth=2)
ax.axhline(0.5, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlabel('Day', color='white'); ax.set_ylabel('Indoor air speed (m/s)', color='white')
ax.set_title('Indoor air velocity from passive ventilation', color='white')

plt.tight_layout(); plt.show()
print(f"Comfort improvement from air movement: {comfortable_eff-comfortable_air:.1f} percentage points")`,
      challenge: `Add a ceiling fan option: a constant 1.2 m/s air movement during occupied hours (7am-10pm). How much does this improve comfort compared to passive ventilation alone? Calculate the fan energy cost.`,
      successHint: `Air movement is the most effective passive comfort strategy in humid climates. A 1 m/s breeze provides 2-3 degrees of cooling effect — equivalent to lowering the thermostat by 2-3 degrees in an air-conditioned building, but at a fraction of the energy cost.`,
    },
    {
      title: 'Design Optimization Algorithm',
      concept: `The optimization algorithm searches the design space — wall thickness, material choice, roof type, window area, orientation — to find the combination that maximizes comfort hours while respecting budget and construction constraints. We use a grid search over discrete options (practical for construction) combined with local optimization for continuous parameters. The objective function is: maximize comfort_hours / total_cost, subject to constraints: total_cost < budget, structural_integrity > minimum, and buildability (local material availability).`,
      analogy: `The optimizer is like a chef creating a recipe. The ingredients (materials) have fixed properties. The chef must find the right combination and proportions to create the best dish (most comfortable house) within a budget (cost constraint) using available ingredients (local materials).`,
      storyConnection: `The monsoon home story describes a house that 'breathes with the seasons.' Our optimizer finds the design parameters that enable this breathing — the wall thickness, window placement, and roof design that together create a house perfectly adapted to its specific monsoon microclimate.`,
      checkQuestion: `Why is grid search appropriate for building design optimization rather than gradient-based methods?`,
      checkAnswer: `Building design involves discrete choices (brick vs mud vs bamboo, thatch vs metal roof) that cannot be optimized with gradients. The parameter space has about 5-8 dimensions with 3-5 options each — giving roughly 10,000-100,000 combinations, which is easily searchable by brute force. Gradient methods would also miss the global optimum in this discontinuous landscape (switching from mud to concrete causes a step change in properties). Grid search guarantees finding the global optimum within the discrete option set.`,
      codeIntro: `Implement the design optimizer and find the best passive house for Guwahati monsoon climate.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Design Optimization ===
np.random.seed(42); hours = np.arange(168); dh = hours % 24
T_out = 28+5*np.sin(2*np.pi*(dh-14)/24)+np.random.normal(0,0.5,168)
solar = np.maximum(0,800*np.sin(np.pi*(dh-6)/12)); solar[dh<6]=0; solar[dh>18]=0
wind = np.clip(1+1.5*np.sin(2*np.pi*(dh-12)/24)+np.random.normal(0,0.3,168),0,5)

def simulate_design(wall_k, wall_thick, wall_rho, wall_c, roof_alpha, vent_area, ceiling_h):
    floor_area = 50; wall_area = np.sqrt(floor_area)*4*ceiling_h
    thermal_mass = wall_rho*wall_c*wall_thick*wall_area
    wall_U = wall_k/wall_thick
    T_in = np.zeros(168); T_in[0] = T_out[0]
    for i in range(1, 168):
        Q_s = roof_alpha*solar[i]*floor_area*0.5
        dP = max(1.2*9.81*ceiling_h*max(T_in[i-1]-T_out[i],0)/(T_out[i]+273)+0.5*0.9*1.2*wind[i]**2,0)
        Q_v = 0.65*np.sqrt(max(2*dP/1.2,0))*vent_area*1.2*1005*(T_out[i]-T_in[i-1])
        Q_w = wall_U*wall_area*(T_out[i]-T_in[i-1])
        T_in[i] = T_in[i-1] + (Q_s+Q_v+Q_w+200)/thermal_mass*3600
    comfort = np.sum((T_in>=24)&(T_in<=31))/168*100
    return T_in, comfort

# Design options
wall_options = [
    ('Mud 25cm', 0.75, 0.25, 1800, 900, 50),
    ('Brick 20cm', 0.80, 0.20, 1920, 835, 80),
    ('Concrete 15cm', 1.70, 0.15, 2300, 880, 100),
    ('Mud 35cm', 0.75, 0.35, 1800, 900, 65),
]
roof_options = [('Thatch', 0.40, 20), ('Metal white', 0.25, 60), ('Dark tile', 0.85, 50), ('Green', 0.35, 90)]
vent_options = [(1.0, 'Small'), (2.0, 'Medium'), (3.0, 'Large')]
ceil_options = [(3.0, 'Standard'), (3.5, 'Medium'), (4.0, 'Tall')]

best_comfort = 0; best_design = None; all_results = []
for wall in wall_options:
    for roof in roof_options:
        for vent_a, vent_n in vent_options:
            for ceil_h, ceil_n in ceil_options:
                T_in, comfort = simulate_design(wall[1], wall[2], wall[3], wall[4], roof[1], vent_a, ceil_h)
                cost = wall[5] + roof[2] + vent_a*20 + ceil_h*10
                score = comfort / max(cost, 1) * 100
                result = {'wall': wall[0], 'roof': roof[0], 'vent': vent_n, 'ceiling': ceil_n,
                          'comfort': comfort, 'cost': cost, 'score': score, 'T_in': T_in}
                all_results.append(result)
                if comfort > best_comfort: best_comfort = comfort; best_design = result

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Design Optimization Results', color='white', fontsize=14, fontweight='bold')

ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
comforts = [r['comfort'] for r in all_results]; costs = [r['cost'] for r in all_results]
ax.scatter(costs, comforts, c=comforts, cmap='RdYlGn', s=20, alpha=0.5)
if best_design: ax.scatter([best_design['cost']], [best_design['comfort']], color='white', s=200, marker='*', zorder=10, label='OPTIMAL')
ax.set_xlabel('Cost (relative)', color='white'); ax.set_ylabel('Comfort hours (%)', color='white')
ax.set_title('Design space exploration', color='white'); ax.legend(fontsize=9)

ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours/24, T_out, color='gray', linewidth=1, alpha=0.5, label='Outdoor')
if best_design: ax.plot(hours/24, best_design['T_in'], color='#22c55e', linewidth=2.5, label=f"Optimal ({best_design['comfort']:.1f}%)")
worst = min(all_results, key=lambda r: r['comfort'])
ax.plot(hours/24, worst['T_in'], color='#ef4444', linewidth=2, label=f"Worst ({worst['comfort']:.1f}%)")
ax.set_xlabel('Day', color='white'); ax.set_ylabel('°C', color='white')
ax.set_title('Best vs worst design', color='white'); ax.legend(fontsize=8)

ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
wall_avg = {}
for r in all_results:
    w = r['wall']; wall_avg.setdefault(w, []).append(r['comfort'])
wall_names = list(wall_avg.keys()); wall_means = [np.mean(wall_avg[w]) for w in wall_names]
ax.barh(wall_names, wall_means, color='#f59e0b', alpha=0.8)
ax.set_xlabel('Average comfort (%)', color='white'); ax.set_title('Wall material ranking', color='white')

ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.axis('off')
if best_design:
    spec = [f"OPTIMAL DESIGN:", '', f"Wall: {best_design['wall']}", f"Roof: {best_design['roof']}",
            f"Ventilation: {best_design['vent']}", f"Ceiling: {best_design['ceiling']}",
            '', f"Comfort: {best_design['comfort']:.1f}%", f"Cost: {best_design['cost']:.0f} (relative)",
            f"Score: {best_design['score']:.2f}"]
    for i, line in enumerate(spec):
        w = 'bold' if i == 0 else 'normal'; c = '#22c55e' if i == 0 else 'white'
        ax.text(0.1, 0.95-i*0.08, line, color=c, fontsize=11, transform=ax.transAxes, fontfamily='monospace', fontweight=w)
plt.tight_layout(); plt.show()
print(f"Evaluated {len(all_results)} designs. Best: {best_design['wall']}, {best_design['roof']}, comfort={best_design['comfort']:.1f}%")`,
      challenge: `Add a Pareto front visualization showing designs where no other design is simultaneously cheaper AND more comfortable. Identify the "knee" of the Pareto front as the recommended design.`,
      successHint: `The optimizer reveals that traditional material choices (thick mud walls, thatch roofs, large openings) consistently rank among the top performers — validating centuries of empirical optimization with computational evidence.`,
    },
    {
      title: 'Multi-Zone Simulation & Advanced Features',
      concept: `Real buildings have multiple zones (rooms) with different thermal conditions. A bedroom on the east side heats up in the morning; a kitchen generates internal heat from cooking; a veranda provides a thermal buffer between outdoors and indoors. The multi-zone model treats each room as a separate thermal node connected to adjacent zones through internal walls and doors. The heat balance becomes a system of coupled differential equations: C_i * dT_i/dt = sum_j(U_ij * A_ij * (T_j - T_i)) + Q_external_i + Q_internal_i, where i indexes zones and j indexes adjacent zones. Inter-zone airflow through doors and openings further couples the zones.`,
      analogy: `A multi-zone building is like a network of connected water tanks. Each tank (room) has its own input (heat gains) and output (cooling). But the tanks are connected by pipes (doors, internal walls), so water (heat) flows between them. The system reaches equilibrium when all the flows balance.`,
      storyConnection: `The monsoon home has distinct zones: the open veranda (semi-outdoor), the main living space, the kitchen (high heat generation), and the sleeping area (needs nighttime cooling). Each zone has different comfort requirements and different thermal loads.`,
      checkQuestion: `A 3-zone house has a kitchen at 35 degrees C, living room at 30 degrees C, and bedroom at 28 degrees C, connected by open doors. Which direction does heat flow and why?`,
      checkAnswer: `Heat flows from high to low temperature: kitchen -> living room -> bedroom. The rate of flow depends on the temperature difference and the thermal conductance between zones (door size, wall properties). The kitchen acts as a heat source that warms the rest of the house — which is why traditional monsoon kitchens are detached or placed on the downwind side, so cooking heat vents outside rather than heating the living spaces.`,
      codeIntro: `Implement a simplified multi-zone thermal model for a monsoon house.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Multi-Zone Thermal Model ===
np.random.seed(42); hours = np.arange(48); dh = hours % 24
T_out = 28+5*np.sin(2*np.pi*(dh-14)/24)+np.random.normal(0,0.5,48)
solar = np.maximum(0,800*np.sin(np.pi*(dh-6)/12)); solar[dh<6]=0; solar[dh>18]=0

# 4 zones: veranda, living, kitchen, bedroom
zones = {
    'Veranda': {'C': 50000, 'ext_UA': 100, 'solar_frac': 0.05, 'internal': 0},
    'Living room': {'C': 300000, 'ext_UA': 30, 'solar_frac': 0.3, 'internal': 150},
    'Kitchen': {'C': 200000, 'ext_UA': 20, 'solar_frac': 0.2, 'internal': 0},
    'Bedroom': {'C': 250000, 'ext_UA': 25, 'solar_frac': 0.15, 'internal': 50},
}

# Inter-zone connections (UA values through doors/walls)
connections = [
    ('Veranda', 'Living room', 50),
    ('Living room', 'Kitchen', 30),
    ('Living room', 'Bedroom', 25),
]

# Cooking schedule (kitchen gains)
cooking = np.zeros(48)
cooking[(dh >= 7) & (dh <= 9)] = 500
cooking[(dh >= 17) & (dh <= 19)] = 800

zone_names = list(zones.keys())
n_zones = len(zone_names)
T_zones = {name: np.zeros(48) for name in zone_names}
for name in zone_names: T_zones[name][0] = 28

for i in range(1, 48):
    for name, props in zones.items():
        # External heat exchange
        Q_ext = props['ext_UA'] * (T_out[i] - T_zones[name][i-1])
        Q_solar = props['solar_frac'] * solar[i] * 50 * 0.4
        Q_int = props['internal'] + (cooking[i] if name == 'Kitchen' else 0)
        # Inter-zone heat exchange
        Q_inter = 0
        for z1, z2, UA in connections:
            if z1 == name: Q_inter += UA * (T_zones[z2][i-1] - T_zones[name][i-1])
            elif z2 == name: Q_inter += UA * (T_zones[z1][i-1] - T_zones[name][i-1])
        Q_net = Q_ext + Q_solar + Q_int + Q_inter
        T_zones[name][i] = T_zones[name][i-1] + Q_net / props['C'] * 3600

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Multi-Zone Thermal Model: Monsoon House', color='white', fontsize=14, fontweight='bold')

ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours, T_out, color='gray', linewidth=1, linestyle='--', label='Outdoor')
colors_z = ['#06b6d4', '#22c55e', '#ef4444', '#a855f7']
for (name, T), color in zip(T_zones.items(), colors_z):
    ax.plot(hours, T, color=color, linewidth=2.5, label=name)
ax.set_xlabel('Hour', color='white'); ax.set_ylabel('°C', color='white')
ax.set_title('Zone temperatures over 48 hours', color='white'); ax.legend(fontsize=8)

ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours, cooking, color='#ef4444', linewidth=2.5, label='Kitchen heat gain')
ax.fill_between(hours, 0, cooking, color='#ef4444', alpha=0.2)
ax.set_xlabel('Hour', color='white'); ax.set_ylabel('Heat gain (W)', color='white')
ax.set_title('Cooking schedule', color='white'); ax.legend(fontsize=9)

ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
# Temperature difference between zones
ax.plot(hours, T_zones['Kitchen'] - T_zones['Living room'], color='#ef4444', linewidth=2, label='Kitchen - Living')
ax.plot(hours, T_zones['Living room'] - T_zones['Bedroom'], color='#3b82f6', linewidth=2, label='Living - Bedroom')
ax.axhline(0, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlabel('Hour', color='white'); ax.set_ylabel('Temperature difference (°C)', color='white')
ax.set_title('Inter-zone temperature gradients', color='white'); ax.legend(fontsize=9)

ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
peak_temps = [T_zones[n].max() for n in zone_names]
bars = ax.barh(zone_names, peak_temps, color=colors_z, alpha=0.8)
for bar, v in zip(bars, peak_temps): ax.text(bar.get_width()+0.1, bar.get_y()+bar.get_height()/2, f'{v:.1f}°C', color='white', fontsize=9, va='center')
ax.set_xlabel('Peak temperature (°C)', color='white'); ax.set_title('Peak temperatures by zone', color='white')

plt.tight_layout(); plt.show()
print("Multi-zone simulation complete")
for name in zone_names: print(f"  {name}: max={T_zones[name].max():.1f}°C, mean={T_zones[name].mean():.1f}°C")`,
      challenge: `Add a detached kitchen option: move the kitchen zone so it has no thermal connection to the living room. Compare indoor temperatures in the living room and bedroom with attached vs detached kitchen.`,
      successHint: `The multi-zone model reveals that a kitchen's cooking heat significantly warms adjacent rooms. Traditional monsoon architecture addresses this by placing kitchens on the periphery or in detached structures — a design choice our model validates quantitatively.`,
    },
    {
      title: 'Final Integration: Passive Cooling House Designer Tool',
      concept: `The capstone concludes with the complete Passive Cooling House Designer — integrating climate data, thermal simulation, ventilation modeling, comfort evaluation, and design optimization into a single tool. The designer takes a location, budget, and comfort requirements as inputs, and outputs the optimal building design with performance predictions. This is portfolio-quality work demonstrating physics, engineering, computation, and visualization.`,
      analogy: `The complete designer is like a GPS navigation system: it takes your starting point (location/climate), your destination (comfort targets), your constraints (budget), and finds the optimal route (building design). It considers all possible paths (design options) and selects the one that best balances comfort, cost, and feasibility.`,
      storyConnection: `The monsoon home story has come full circle. We started with wonder at a house that stays cool without electricity. We now understand the physics (thermal mass, ventilation, solar control), can simulate the performance, and can design new houses that achieve the same result anywhere in monsoon Asia.`,
      checkQuestion: `What is the most important output of the designer tool — the optimal design parameters, the predicted temperatures, or the comfort percentage?`,
      checkAnswer: `All three, but for different audiences. The architect needs the design parameters (wall thickness = 30cm mud, roof = white metal, etc.) to draw plans. The client needs the comfort percentage (95% of hours within comfort zone) to evaluate whether to invest. The engineer needs the predicted temperatures to verify that structural materials and finishes can handle the thermal cycling. A good tool serves all three audiences.`,
      codeIntro: `Build the final integrated Passive Cooling House Designer with dashboard output.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

# =============================================
# PASSIVE COOLING HOUSE DESIGNER — FINAL TOOL
# =============================================

np.random.seed(42)
def generate_climate(n_days=7):
    hours = np.arange(n_days*24); dh = hours%24
    T = 28+5*np.sin(2*np.pi*(dh-14)/24)+np.random.normal(0,0.5,len(hours))
    solar = np.maximum(0,800*np.sin(np.pi*(dh-6)/12)); solar[dh<6]=0; solar[dh>18]=0
    wind = np.clip(1+1.5*np.sin(2*np.pi*(dh-12)/24)+np.random.normal(0,0.3,len(hours)),0,5)
    return hours, T, solar, wind

def simulate(T_out, solar, wind, wall_k, wall_t, wall_rho, wall_c, roof_a, vent_a, ceil_h):
    fa=50; wa=np.sqrt(fa)*4*ceil_h; tm=wall_rho*wall_c*wall_t*wa; wU=wall_k/wall_t
    Ti=np.zeros(len(T_out)); Ti[0]=T_out[0]
    for i in range(1,len(T_out)):
        Qs=roof_a*solar[i]*fa*0.5
        dP=max(1.2*9.81*ceil_h*max(Ti[i-1]-T_out[i],0)/(T_out[i]+273)+0.5*0.9*1.2*wind[i]**2,0)
        Qv=0.65*np.sqrt(max(2*dP/1.2,0))*vent_a*1.2*1005*(T_out[i]-Ti[i-1])
        Qw=wU*wa*(T_out[i]-Ti[i-1])
        Ti[i]=Ti[i-1]+(Qs+Qv+Qw+200)/tm*3600
    return Ti

hours, T_out, solar, wind = generate_climate(7)

# Optimization
designs = []
for wn,wk,wt,wr,wc,wcost in [('Mud 30cm',.75,.30,1800,900,55),('Brick 20cm',.80,.20,1920,835,80),('Bamboo+mud 15cm',.40,.15,1200,1000,40)]:
    for rn,ra,rcost in [('Thatch',.40,20),('White metal',.25,60),('Green roof',.35,90)]:
        for va in [1.5, 2.5, 3.5]:
            for ch in [3.0, 3.5, 4.0]:
                Ti = simulate(T_out,solar,wind,wk,wt,wr,wc,ra,va,ch)
                comfort = np.sum((Ti>=24)&(Ti<=31))/len(Ti)*100
                cost = wcost+rcost+va*15+ch*8
                designs.append({'wall':wn,'roof':rn,'vent':va,'ceil':ch,'comfort':comfort,'cost':cost,'Ti':Ti})

best = max(designs, key=lambda d: d['comfort'])
best_value = max(designs, key=lambda d: d['comfort']/d['cost'])

fig = plt.figure(figsize=(18,12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('PASSIVE COOLING HOUSE DESIGNER — FINAL REPORT', color='white', fontsize=16, fontweight='bold', y=0.98)
gs = fig.add_gridspec(3, 4, hspace=0.4, wspace=0.35)

ax = fig.add_subplot(gs[0, 0:2]); ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(hours/24, T_out, color='gray', linewidth=1, alpha=0.5, label='Outdoor')
ax.plot(hours/24, best['Ti'], color='#22c55e', linewidth=2.5, label=f"Optimal ({best['comfort']:.0f}%)")
worst = min(designs, key=lambda d: d['comfort'])
ax.plot(hours/24, worst['Ti'], color='#ef4444', linewidth=1.5, alpha=0.7, label=f"Worst ({worst['comfort']:.0f}%)")
ax.axhspan(24, 31, color='#22c55e', alpha=0.05)
ax.set_xlabel('Day', color='white'); ax.set_ylabel('°C', color='white')
ax.set_title('Temperature Performance', color='white'); ax.legend(fontsize=8)

ax = fig.add_subplot(gs[0, 2:4]); ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
costs = [d['cost'] for d in designs]; comforts = [d['comfort'] for d in designs]
sc = ax.scatter(costs, comforts, c=comforts, cmap='RdYlGn', s=15, alpha=0.5)
ax.scatter([best['cost']], [best['comfort']], color='white', s=200, marker='*', zorder=10, label='Best comfort')
ax.scatter([best_value['cost']], [best_value['comfort']], color='#f59e0b', s=150, marker='D', zorder=10, label='Best value')
ax.set_xlabel('Cost', color='white'); ax.set_ylabel('Comfort %', color='white')
ax.set_title('Design Space', color='white'); ax.legend(fontsize=8)

ax = fig.add_subplot(gs[1, 0:2]); ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
wall_perf = {}
for d in designs: wall_perf.setdefault(d['wall'], []).append(d['comfort'])
wn = list(wall_perf.keys()); wm = [np.mean(wall_perf[w]) for w in wn]
ax.barh(wn, wm, color=['#f59e0b','#ef4444','#22c55e'], alpha=0.8)
ax.set_xlabel('Avg comfort %', color='white'); ax.set_title('Wall Material Ranking', color='white')

ax = fig.add_subplot(gs[1, 2:4]); ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
roof_perf = {}
for d in designs: roof_perf.setdefault(d['roof'], []).append(d['comfort'])
rn = list(roof_perf.keys()); rm = [np.mean(roof_perf[r]) for r in rn]
ax.barh(rn, rm, color=['#f59e0b','#3b82f6','#22c55e'], alpha=0.8)
ax.set_xlabel('Avg comfort %', color='white'); ax.set_title('Roof Type Ranking', color='white')

ax = fig.add_subplot(gs[2, 0:2]); ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
daily_peaks_best = [best['Ti'][d*24:(d+1)*24].max() for d in range(7)]
daily_peaks_out = [T_out[d*24:(d+1)*24].max() for d in range(7)]
x = np.arange(7)
ax.bar(x-0.2, daily_peaks_out, 0.35, color='#ef4444', alpha=0.6, label='Outdoor peak')
ax.bar(x+0.2, daily_peaks_best, 0.35, color='#22c55e', alpha=0.8, label='Indoor peak (optimal)')
ax.set_xlabel('Day', color='white'); ax.set_ylabel('Peak °C', color='white')
ax.set_title('Daily Peak Temperatures', color='white'); ax.legend(fontsize=8)

ax = fig.add_subplot(gs[2, 2:4]); ax.set_facecolor('#111827'); ax.axis('off')
spec = ['OPTIMAL DESIGN SPEC:', '', f"Wall: {best['wall']}", f"Roof: {best['roof']}",
        f"Ventilation: {best['vent']:.1f} m² openings", f"Ceiling: {best['ceil']:.1f} m",
        '', f"Comfort hours: {best['comfort']:.1f}%", f"Peak indoor: {best['Ti'].max():.1f}°C",
        f"Peak cooling: {T_out.max()-best['Ti'].max():.1f}°C below outdoor",
        f"Cost index: {best['cost']:.0f}", f"Energy cost: $0/year", '',
        f"Designs evaluated: {len(designs)}"]
for i, line in enumerate(spec):
    w = 'bold' if i == 0 else 'normal'; c = '#22c55e' if i == 0 else 'white'
    ax.text(0.05, 0.95-i*0.065, line, color=c, fontsize=10, transform=ax.transAxes, fontfamily='monospace', fontweight=w)

plt.tight_layout(); plt.show()
print(f"PASSIVE COOLING HOUSE DESIGNER — COMPLETE")
print(f"Best design: {best['wall']}, {best['roof']}, comfort={best['comfort']:.1f}%")
print(f"Designs evaluated: {len(designs)}")`,
      challenge: `Add a climate change scenario: increase average temperatures by 2 degrees C and increase monsoon intensity by 20%. Rerun the optimizer and determine whether the optimal design changes — and by how much comfort is reduced.`,
      successHint: `You have built a complete Passive Cooling House Designer — a tool that combines thermal physics, building science, climate analysis, and optimization into a practical engineering deliverable. This is the kind of tool that can help communities in monsoon regions build comfortable, zero-energy houses adapted to their specific climate.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (building science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Passive Cooling House Designer. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
