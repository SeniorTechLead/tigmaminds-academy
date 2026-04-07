import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AurovilleLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stefan-Boltzmann law — the physics of thermal radiation',
      concept: `Every hot object radiates energy. The power radiated is given by the **Stefan-Boltzmann law**: **P = epsilon x sigma x A x T^4**, where epsilon is emissivity (0-1), sigma is 5.67e-8 W/(m^2*K^4), A is surface area, and T is absolute temperature in Kelvin.

The T^4 dependence is dramatic: doubling the temperature increases radiation by 16 times (2^4). This is why the focused sunlight at the Auroville dish can reach extreme temperatures — and also why heat losses from the absorber increase so rapidly with temperature.

In the code below, you will calculate radiative heat loss from the Solar Kitchen absorber and determine the equilibrium temperature where absorbed solar power equals radiated power.

*The Stefan-Boltzmann law applies to all thermal radiation: infrared from your body, visible light from an incandescent bulb, and X-rays from a star. Only the wavelength changes with temperature — the T^4 power law is universal.*`,
      analogy: 'Imagine a hot coal in a campfire. A warm coal barely glows (low radiation). A hot coal glows bright red (much more radiation). A white-hot coal is blindingly bright (enormous radiation). Each doubling of temperature produces 16 times more light. The Stefan-Boltzmann law quantifies this exponential increase in radiation with temperature.',
      storyConnection: 'At the Auroville dish focus, the absorber reaches about 700 degrees C (973 K). At this temperature, it radiates P = 0.9 x 5.67e-8 x 0.031 x 973^4 = 1.4 kW back into space. This is a small fraction of the 160 kW input, so the system works well. But if you tried to reach 2000 degrees C, losses would dominate.',
      checkQuestion: 'If an absorber at 500 K radiates 2 kW, how much does it radiate at 1000 K (same area and emissivity)?',
      checkAnswer: '(1000/500)^4 = 2^4 = 16 times more. So 2 kW x 16 = 32 kW. The T^4 law means that high-temperature solar systems lose much more energy to radiation. This is the fundamental limit on solar concentration temperature.',
      codeIntro: 'Apply the Stefan-Boltzmann law to the Auroville Solar Kitchen absorber.',
      code: `import numpy as np

sigma = 5.67e-8  # Stefan-Boltzmann constant W/(m^2*K^4)

def radiative_power(T_C, area_m2, emissivity=0.90):
    """Radiated power in watts from a surface at temperature T_C."""
    T_K = T_C + 273.15
    return emissivity * sigma * area_m2 * T_K ** 4

def equilibrium_temp(absorbed_power_W, area_m2, emissivity=0.90):
    """Equilibrium temperature where absorbed = radiated power."""
    T_K = (absorbed_power_W / (emissivity * sigma * area_m2)) ** 0.25
    return T_K - 273.15

# Absorber properties
absorber_area = 0.031  # m^2 (20 cm diameter circle)
emissivity = 0.90

print("=== Stefan-Boltzmann Law: Radiative Heat Loss ===")
print(f"Absorber area: {absorber_area:.4f} m^2 | Emissivity: {emissivity}")
print()

header = "Temp(C)   Temp(K)   Radiated Power(W)   Radiated Power(kW)"
print(header)
print("-" * len(header))

for T_C in [100, 200, 300, 400, 500, 600, 700, 800, 1000, 1500, 2000]:
    P = radiative_power(T_C, absorber_area, emissivity)
    print(f"{T_C:>6}    {T_C+273:>6}    {P:>17.0f}    {P/1000:>16.2f}")

print()
print("=== Equilibrium Temperature vs Absorbed Power ===")
print()

dish_area = np.pi * 7.5 ** 2
mirror_eff = 0.90
absorber_abs = 0.95

header2 = "Irradiance(W/m2)  Absorbed(kW)  Equilibrium(C)  Application"
print(header2)
print("-" * len(header2))

for irr in [200, 400, 600, 800, 1000]:
    absorbed = irr * dish_area * mirror_eff * absorber_abs
    T_eq = equilibrium_temp(absorbed, absorber_area, emissivity)
    app = "Cooking" if T_eq > 200 else "Water heating" if T_eq > 60 else "Minimal"
    print(f"{irr:>14}    {absorbed/1000:>10.1f}    {T_eq:>12.0f}    {app}")

# Heat loss breakdown
print()
print("=== Heat Loss Budget at Operating Temperature (400 C) ===")
T_op = 400  # C
P_rad = radiative_power(T_op, absorber_area, emissivity)
P_conv = 15 * absorber_area * (T_op - 30)  # convective: h*A*dT
P_cond = 2 * (T_op - 30) * 0.01  # conduction through insulation

total_loss = P_rad + P_conv + P_cond
absorbed_total = 1000 * dish_area * mirror_eff * absorber_abs

print(f"  Radiation loss:   {P_rad:>8.0f} W  ({P_rad/absorbed_total*100:.1f}%)")
print(f"  Convection loss:  {P_conv:>8.0f} W  ({P_conv/absorbed_total*100:.1f}%)")
print(f"  Conduction loss:  {P_cond:>8.0f} W  ({P_cond/absorbed_total*100:.1f}%)")
print(f"  Total losses:     {total_loss:>8.0f} W  ({total_loss/absorbed_total*100:.1f}%)")
print(f"  Useful power:     {absorbed_total-total_loss:>8.0f} W")`,
      challenge: 'Model a selective absorber surface: high absorptivity in the visible spectrum (0.95) but low emissivity in the infrared (0.10). Calculate the new equilibrium temperature and compare to a non-selective surface. This is the technology behind modern solar thermal collectors.',
      successHint: 'The Stefan-Boltzmann law is one of the cornerstones of thermal physics. It describes the radiation from every object in the universe, from ice cubes to stars. You just applied it to a real solar energy system — the same calculation solar engineers perform every day.',
    },
    {
      title: 'Heat transfer modes — conduction, convection, and radiation',
      concept: `Heat moves by three mechanisms: **conduction** (through solid material, molecule to molecule), **convection** (carried by moving fluid — air or water), and **radiation** (electromagnetic waves, no medium needed). In the Solar Kitchen, all three play roles.

Each mode has its own equation: conduction follows **Fourier's law** (Q = k*A*dT/dx), convection follows **Newton's cooling law** (Q = h*A*dT), and radiation follows the Stefan-Boltzmann law. The total heat transfer is the sum of all three modes.

In the code below, you will calculate heat transfer rates through the boiler wall of the Solar Kitchen, where concentrated sunlight heats the outer surface and steam forms on the inner surface.

*Understanding which heat transfer mode dominates is key to engineering design. In a vacuum (space), only radiation matters. In a well-insulated wall, conduction dominates. In a windy outdoor setting, convection often dominates.*`,
      analogy: 'Imagine warming your hands: touching a hot mug (conduction), holding them over a fire (radiation), and feeling warm air from a heater (convection). Each mode delivers heat differently. A good engineer knows which mode matters most in each situation and designs accordingly.',
      storyConnection: 'The Auroville boiler wall must conduct heat from the sunlit outer surface (700 degrees C) to the water inside (100-150 degrees C). If the wall is too thick, conduction is slow and the outer surface overheats. If too thin, it cannot withstand the pressure. The engineers chose 3 mm stainless steel — a balance of thermal conductivity and structural strength.',
      checkQuestion: 'If the boiler wall is 3 mm thick stainless steel (k = 15 W/(m*K)) and the temperature difference across it is 500 degrees C, what is the heat flux?',
      checkAnswer: 'q = k * dT / dx = 15 * 500 / 0.003 = 2,500,000 W/m^2 = 2.5 MW/m^2. This is extremely high — but the area is small (0.031 m^2), so the total power through the wall is 2.5e6 * 0.031 = 77.5 kW. This exceeds the useful cooking power, confirming the wall does not limit heat transfer.',
      codeIntro: 'Model all three heat transfer modes in the Solar Kitchen boiler.',
      code: `import numpy as np

def conduction_flux(k, T_hot, T_cold, thickness):
    """Heat flux by conduction (W/m^2)."""
    return k * (T_hot - T_cold) / thickness

def convection_flux(h, T_surface, T_fluid):
    """Heat flux by convection (W/m^2)."""
    return h * (T_surface - T_fluid)

def radiation_flux(epsilon, T_surface_C, T_surround_C):
    """Net radiative heat flux (W/m^2)."""
    sigma = 5.67e-8
    Ts = T_surface_C + 273.15
    Tsur = T_surround_C + 273.15
    return epsilon * sigma * (Ts ** 4 - Tsur ** 4)

# Boiler wall analysis
print("=== Solar Kitchen Boiler Heat Transfer ===")
print()

# Properties
k_steel = 15  # W/(m*K) stainless steel
wall_thickness = 0.003  # 3 mm
h_steam = 5000  # W/(m^2*K) boiling water (very high)
h_air_outside = 15  # W/(m^2*K) natural convection
absorber_area = 0.031  # m^2

# Temperature profile through the wall
T_sun_side = 600  # C (heated by concentrated sunlight)
T_water_side = 150  # C (pressurized steam)

q_conduction = conduction_flux(k_steel, T_sun_side, T_water_side, wall_thickness)
q_steam = convection_flux(h_steam, T_water_side, 130)  # steam at 130 C
q_radiation_loss = radiation_flux(0.90, T_sun_side, 30)

print(f"Wall: {wall_thickness*1000:.0f}mm stainless steel (k={k_steel} W/m*K)")
print(f"Sun side: {T_sun_side} C | Water side: {T_water_side} C")
print()
print(f"  Conduction through wall: {q_conduction/1000:>8.0f} kW/m^2")
print(f"  Convection to steam:     {q_steam/1000:>8.0f} kW/m^2")
print(f"  Radiation loss (outside): {q_radiation_loss/1000:>8.0f} kW/m^2")
print()
print(f"  Total through wall:    {q_conduction * absorber_area / 1000:>6.1f} kW")
print(f"  Total to steam:        {q_steam * absorber_area / 1000:>6.1f} kW")

# Compare materials
print()
print("=== Wall Material Comparison (3mm thick) ===")
print()

materials = [
    ("Copper", 385),
    ("Aluminium", 205),
    ("Steel (mild)", 50),
    ("Stainless steel", 15),
    ("Cast iron", 55),
    ("Glass", 1.0),
    ("Ceramic", 2.0),
]

header = "Material           k(W/m*K)  Wall Flux(kW/m2)  Power(kW)  Adequate?"
print(header)
print("-" * len(header))

required_power = 120  # kW useful cooking power

for name, k in materials:
    q = conduction_flux(k, T_sun_side, T_water_side, wall_thickness)
    power = q * absorber_area / 1000
    adequate = "Yes" if power > required_power else "No"
    print(f"{name:<19} {k:>7.0f}    {q/1000:>13.0f}    {power:>7.1f}    {adequate}")

# Insulation design for steam pipes
print()
print("=== Steam Pipe Insulation Design ===")
print("(Minimise heat loss in pipes from boiler to kitchen)")
print()

pipe_length = 20  # m
pipe_diameter = 0.05  # m
pipe_area = np.pi * pipe_diameter * pipe_length
T_steam = 150  # C
T_ambient = 30  # C

for insulation_mm in [0, 10, 25, 50, 75, 100]:
    if insulation_mm == 0:
        q_loss = convection_flux(h_air_outside, T_steam, T_ambient) * pipe_area
    else:
        k_insulation = 0.04  # W/(m*K) mineral wool
        R_ins = insulation_mm / 1000 / k_insulation
        R_conv = 1 / h_air_outside
        q_loss = pipe_area * (T_steam - T_ambient) / (R_ins + R_conv)

    pct_of_input = q_loss / (120 * 1000) * 100
    print(f"  {insulation_mm:>3}mm insulation: loss = {q_loss:.0f} W ({pct_of_input:.1f}% of cooking power)")`,
      challenge: 'Design a heat exchanger: the hot exhaust steam (150 degrees C) can preheat incoming cold water (25 degrees C). Calculate the heat exchanger area needed to recover 80% of the exhaust heat. How much fuel does this save compared to heating cold water from scratch?',
      successHint: 'You just performed a multi-mode heat transfer analysis — the core skill of thermal engineering. The same calculations are used to design boilers, heat exchangers, electronic cooling systems, and building insulation. Understanding all three heat transfer modes is essential for any thermal system.',
    },
    {
      title: 'Cooking temperature calculation — from steam pressure to pot temperature',
      concept: `The Solar Kitchen generates **pressurized steam** — water vapour at above-atmospheric pressure. The steam temperature depends on pressure: at 1 atm, water boils at 100 degrees C; at 2 atm, it boils at 120 degrees C; at 4 atm, at 144 degrees C. Higher pressure = higher temperature = faster cooking.

The relationship between pressure and boiling point follows the **Clausius-Clapeyron equation**: ln(P2/P1) = (L/R) x (1/T1 - 1/T2), where L is the latent heat of vaporisation, R is the gas constant, and T is in Kelvin.

In the code below, you will calculate steam temperature at different pressures and determine the cooking time for different foods. This is the science behind the pressure cooker — and the Auroville steam cooking system.

*Pressure cooking reduces cooking time dramatically because higher temperature speeds up chemical reactions (roughly doubling for every 10 degrees C increase). Rice that takes 20 minutes at 100 degrees C takes only 8 minutes at 120 degrees C.*`,
      analogy: 'Imagine a crowded room (high pressure). People bump into each other more often and move faster (higher temperature). In the steam system, higher pressure forces water molecules closer together, raising the boiling point and the temperature of the steam. This hotter steam cooks food faster.',
      storyConnection: 'The Auroville Solar Kitchen generates steam at about 3-4 atm (130-140 degrees C). This steam is piped to large cooking vessels where it heats food by condensing on the pot walls. The system can cook 1000 servings of rice in about 45 minutes — faster than conventional gas cooking because the steam temperature is higher than boiling water.',
      checkQuestion: 'If cooking time halves for every 10 degrees C increase, and rice takes 20 minutes at 100 degrees C, how long at 130 degrees C?',
      checkAnswer: 'Temperature increase = 30 degrees C = 3 intervals of 10 degrees C. Cooking time halves 3 times: 20 -> 10 -> 5 -> 2.5 minutes. In practice, rice at 130 degrees C cooks in about 3-4 minutes (the rule is approximate). This dramatic speedup is why pressure cooking and steam cooking are so efficient.',
      codeIntro: 'Calculate steam properties and cooking times for the Solar Kitchen.',
      code: `import numpy as np

def steam_temperature(pressure_atm):
    """Boiling point of water at given pressure using Clausius-Clapeyron.
    Simplified Antoine equation for water.
    """
    # Antoine equation: log10(P_mmHg) = A - B/(C + T_C)
    # For water: A=8.07131, B=1730.63, C=233.426 (valid 1-100 C range)
    # Extended approximation for higher pressures
    P_mmHg = pressure_atm * 760
    T_C = 1730.63 / (8.07131 - np.log10(P_mmHg)) - 233.426
    return T_C

def cooking_time(base_time_min, base_temp_C, actual_temp_C, Q10=2):
    """Estimate cooking time at a different temperature.
    Q10 rule: rate doubles for every 10 C increase.
    """
    delta_T = actual_temp_C - base_temp_C
    factor = Q10 ** (delta_T / 10)
    return base_time_min / factor

# Steam pressure-temperature relationship
print("=== Steam Temperature vs Pressure ===")
print()

header = "Pressure(atm)  Pressure(bar)  Temp(C)   Application"
print(header)
print("-" * len(header))

for p_atm in [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 7.0, 10.0]:
    T = steam_temperature(p_atm)
    if p_atm < 1:
        app = "Vacuum cooking"
    elif p_atm < 1.5:
        app = "Normal boiling"
    elif p_atm < 3:
        app = "Pressure cooker"
    elif p_atm < 5:
        app = "Solar Kitchen steam"
    else:
        app = "Industrial"
    print(f"{p_atm:>11.1f}    {p_atm*1.013:>11.2f}    {T:>5.0f}    {app}")

# Cooking times at different temperatures
print()
print("=== Cooking Time vs Steam Temperature ===")
print()

foods = [
    ("White rice", 20, 100),
    ("Brown rice", 40, 100),
    ("Lentils (dal)", 30, 100),
    ("Chickpeas", 60, 100),
    ("Potatoes", 25, 100),
    ("Vegetables (mixed)", 15, 100),
]

header2 = "Food              At 100C(min)  At 120C  At 130C  At 140C"
print(header2)
print("-" * len(header2))

for name, base_time, base_temp in foods:
    times = [cooking_time(base_time, base_temp, T) for T in [100, 120, 130, 140]]
    print(f"{name:<18} {times[0]:>10.0f}    {times[1]:>6.0f}    {times[2]:>5.0f}    {times[3]:>5.0f}")

# Energy savings from pressure cooking
print()
print("=== Energy Savings: Pressure Cooking vs Normal Boiling ===")
print()

total_meals = 1000
rice_per_meal_kg = 0.15  # 150g dry rice
water_per_kg_rice = 2.0  # litres

total_rice = total_meals * rice_per_meal_kg
total_water = total_rice * water_per_kg_rice

# Energy to heat water + cook
for name, temp, time_min in [("Normal boiling (100 C)", 100, 20),
                              ("Pressure (130 C)", 130, 4)]:
    heat_water = total_water * 4.186 * (temp - 25) / 3600  # kWh
    maintain = total_water * 2.0 * time_min / 60 / 3600  # kWh (approximate)
    total_energy = heat_water + maintain
    print(f"  {name}:")
    print(f"    Heating water: {heat_water:.0f} kWh")
    print(f"    Maintaining temp: {maintain:.1f} kWh")
    print(f"    Total: {total_energy:.0f} kWh")
    print(f"    Time: {time_min} min")
    print()`,
      challenge: 'Model the "flash steam" effect: when pressurized hot water (130 degrees C) is depressurized to 1 atm, some instantly evaporates (flashes to steam). Calculate what fraction flashes and the temperature drop. This recovered steam can preheat incoming water.',
      successHint: 'You just applied the Clausius-Clapeyron equation and the Q10 rule — two fundamental relationships in thermodynamics and chemical kinetics. The same physics governs pressure cookers, industrial steam systems, geothermal power plants, and autoclave sterilization in hospitals.',
    },
    {
      title: 'Boiler design — generating steam from concentrated sunlight',
      concept: `The heart of the Solar Kitchen is the **boiler** — a vessel where concentrated sunlight heats water into steam. The boiler must handle enormous heat flux (over 1 MW/m^2 at the focus spot) while maintaining structural integrity under steam pressure (3-4 atm).

Boiler design involves: (1) choosing the right material (must withstand temperature and pressure), (2) sizing the heat transfer surfaces (enough area to absorb all the solar energy), (3) controlling the water level (too low and the boiler overheats; too high and wet steam carries water droplets), and (4) managing startup and shutdown (thermal shock when concentrated sunlight first hits the cold boiler).

In the code below, you will design a boiler for the Auroville Solar Kitchen, calculating wall thickness, heat transfer rates, and steam production capacity.

*Boiler design is one of the oldest engineering disciplines — James Watt designed improved boilers in the 1770s. Modern boiler codes (ASME, EN) specify rigorous design, fabrication, and testing requirements because boiler explosions can be catastrophic.*`,
      analogy: 'A boiler is like a high-pressure kettle. An ordinary kettle boils water at atmospheric pressure — open the lid and steam escapes freely. A boiler is a sealed kettle where pressure builds up, raising the boiling point and producing hotter steam. The engineering challenge is building a "kettle" that can handle the pressure safely for decades.',
      storyConnection: 'The Auroville boiler is a specially designed cylindrical vessel made of stainless steel. It receives concentrated sunlight through a quartz glass window at the focus of the parabolic dish. The boiler generates about 150 kg/hour of steam at 3 atm, which is piped to the kitchen 20 metres away. The design went through multiple iterations to handle the extreme temperature gradients.',
      checkQuestion: 'If the boiler produces 150 kg/hour of steam at 3 atm (133 degrees C), how much power does the steam carry?',
      checkAnswer: 'Power = mass_flow x (sensible_heat + latent_heat). Sensible heat: 150/3600 x 4186 x (133-25) = 18,900 W. Latent heat: 150/3600 x 2,170,000 = 90,400 W. Total: about 109 kW. This is the useful cooking power delivered to the kitchen.',
      codeIntro: 'Design and analyse a solar-heated steam boiler for the Auroville kitchen.',
      code: `import numpy as np

class SolarBoiler:
    def __init__(self, solar_input_kW, pressure_atm, efficiency=0.85):
        self.solar_input = solar_input_kW * 1000  # W
        self.pressure = pressure_atm
        self.efficiency = efficiency
        self.useful_power = self.solar_input * efficiency

        # Steam properties at operating pressure
        self.T_steam = self._steam_temp(pressure_atm)
        self.latent_heat = 2260000 - 2000 * (self.T_steam - 100)  # J/kg (approximate)

    def _steam_temp(self, p_atm):
        P_mmHg = p_atm * 760
        return 1730.63 / (8.07131 - np.log10(P_mmHg)) - 233.426

    def steam_production(self, feed_water_temp_C=25):
        """Steam production rate in kg/hour."""
        energy_per_kg = (4186 * (self.T_steam - feed_water_temp_C) +
                         self.latent_heat)
        kg_per_second = self.useful_power / energy_per_kg
        return kg_per_second * 3600

    def wall_thickness(self, inner_diameter_m, material_strength_mpa,
                       safety_factor=4):
        """Required wall thickness using thin-wall pressure vessel formula.
        t = P * D / (2 * sigma_allow)
        """
        P_Pa = self.pressure * 101325
        sigma_allow = material_strength_mpa * 1e6 / safety_factor
        t = P_Pa * inner_diameter_m / (2 * sigma_allow)
        return t * 1000  # mm

    def heat_flux(self, absorber_area_m2):
        """Heat flux at the absorber in kW/m^2."""
        return self.solar_input / absorber_area_m2 / 1000

# Design the Auroville boiler
boiler = SolarBoiler(solar_input_kW=160, pressure_atm=3, efficiency=0.85)

print("=== Auroville Solar Boiler Design ===")
print(f"Solar input: 160 kW | Operating pressure: 3 atm")
print(f"Boiler efficiency: 85%")
print(f"Steam temperature: {boiler.T_steam:.0f} C")
print(f"Useful power: {boiler.useful_power/1000:.0f} kW")
print()

# Steam production
steam_rate = boiler.steam_production(25)
print(f"Steam production: {steam_rate:.0f} kg/hour")
print(f"  (at feed water temperature 25 C)")
print()

# Wall thickness
print("=== Boiler Wall Design ===")
materials = [
    ("Mild steel", 250),
    ("Stainless 304", 215),
    ("Stainless 316", 205),
    ("Copper", 70),
]

inner_D = 0.30  # 30 cm inner diameter

header = "Material          Strength(MPa)  Wall Thickness(mm)  Weight(kg/m)"
print(header)
print("-" * len(header))

for name, strength in materials:
    t = boiler.wall_thickness(inner_D, strength)
    # Weight per metre of cylindrical wall
    outer_D = inner_D + 2 * t / 1000
    area = np.pi * (outer_D**2 - inner_D**2) / 4
    weight = area * 7800  # steel density
    print(f"{name:<18} {strength:>11}    {t:>16.1f}    {weight:>12.1f}")

# Heat flux analysis
print()
print("=== Heat Flux at Focus ===")

absorber_areas = [0.01, 0.02, 0.031, 0.05, 0.10]
header2 = "Absorber Area(m2)  Heat Flux(kW/m2)  Manageable?"
print(header2)
print("-" * len(header2))

for area in absorber_areas:
    flux = boiler.heat_flux(area)
    safe = "Yes" if flux < 1000 else "Borderline" if flux < 3000 else "Extreme"
    print(f"{area:>15.3f}    {flux:>14.0f}    {safe}")

# Operating conditions summary
print()
print("=== Operating Summary ===")
print(f"  Solar input:    {boiler.solar_input/1000:.0f} kW")
print(f"  Useful power:   {boiler.useful_power/1000:.0f} kW")
print(f"  Steam output:   {steam_rate:.0f} kg/hr at {boiler.T_steam:.0f} C")
print(f"  Meals possible: {steam_rate * 0.5 / 0.15:.0f}/hour (at 150g rice/meal)")
print(f"  Over 4 hours:   {steam_rate * 0.5 / 0.15 * 4:.0f} meals")`,
      challenge: 'Add thermal stress analysis: when the sun first hits the cold boiler, one side heats rapidly while the other stays cold. Calculate the thermal stress in the wall: sigma = E * alpha * delta_T / (1-nu). Determine the maximum safe heating rate (degrees C per minute) to avoid thermal fatigue cracking.',
      successHint: 'You just designed a pressure vessel and steam generation system — core skills in mechanical and chemical engineering. The same calculations apply to power plant boilers, chemical reactors, and sterilization autoclaves. Boiler engineering saved countless lives when formal design codes replaced trial-and-error in the 19th century.',
    },
    {
      title: 'System efficiency — tracking every watt from sun to plate',
      concept: `The overall efficiency of the Solar Kitchen is the product of many individual efficiencies: mirror reflectivity (90%), solar intercept (95%), absorber absorptivity (95%), boiler heat transfer (85%), steam piping (95%), and cooking vessel heat transfer (90%). The overall efficiency is 0.90 x 0.95 x 0.95 x 0.85 x 0.95 x 0.90 = **56%**.

This means that 56% of the sunlight hitting the dish ends up as useful heat in the food. The rest is lost at each stage. Improving any single stage has a multiplicative effect on the whole system.

In the code below, you will create a complete efficiency waterfall that tracks every watt from the sun to the cooking pot, identifying the biggest loss mechanisms and the most cost-effective improvements.

*System efficiency analysis — also called "exergy analysis" or "Sankey diagram analysis" — is the fundamental tool for improving any energy system. It reveals where the biggest losses are, guiding investment to the most impactful improvements.*`,
      analogy: 'Imagine a series of leaky pipes connecting a reservoir to a garden. Each pipe loses some water through leaks. If pipe 1 loses 10%, pipe 2 loses 5%, and pipe 3 loses 15%, the water reaching the garden is 90% x 95% x 85% = 72.7% of the reservoir flow. The "leakiest" pipe (pipe 3, 15% loss) is the best candidate for repair — fixing it gives the biggest improvement.',
      storyConnection: 'When the Auroville engineers upgraded the dish mirrors from aluminium (85% reflectivity) to silver-coated glass (92% reflectivity), the entire system output increased by 8% — even though only one component was changed. This is the multiplicative effect: improving one link in the chain improves the whole chain.',
      checkQuestion: 'If the mirror reflectivity improves from 90% to 95%, how much does the overall system efficiency increase?',
      checkAnswer: 'Old efficiency: 0.90 x ... = 56%. New efficiency: 0.95 x ... = 56% x (0.95/0.90) = 56% x 1.056 = 59.1%. A 5% improvement in one component gives a 3.1 percentage point (5.6% relative) improvement in overall efficiency. This shows why every component matters in a chain of efficiencies.',
      codeIntro: 'Create a complete efficiency waterfall analysis for the Solar Kitchen.',
      code: `import numpy as np

class EfficiencyWaterfall:
    def __init__(self, solar_input_kW):
        self.input = solar_input_kW
        self.stages = []
        self.current_power = solar_input_kW

    def add_stage(self, name, efficiency):
        loss = self.current_power * (1 - efficiency)
        output = self.current_power * efficiency
        self.stages.append({
            "name": name,
            "efficiency": efficiency,
            "input": self.current_power,
            "output": output,
            "loss": loss,
        })
        self.current_power = output

    def overall_efficiency(self):
        return self.current_power / self.input

    def print_waterfall(self):
        print(f"{'Stage':<25} {'Effic':>6} {'Input(kW)':>10} {'Loss(kW)':>9} {'Output(kW)':>11}")
        print("-" * 63)

        for s in self.stages:
            print(f"{s['name']:<25} {s['efficiency']:>5.0%} {s['input']:>10.1f} {s['loss']:>9.1f} {s['output']:>11.1f}")

        print("-" * 63)
        print(f"{'OVERALL':<25} {self.overall_efficiency():>5.0%} "
              f"{self.input:>10.1f} {self.input - self.current_power:>9.1f} "
              f"{self.current_power:>11.1f}")

# Build the Auroville efficiency chain
dish_area = np.pi * 7.5 ** 2
solar_input = dish_area * 1.0  # kW at 1000 W/m^2

wf = EfficiencyWaterfall(solar_input)
wf.add_stage("Mirror reflectivity", 0.90)
wf.add_stage("Solar intercept", 0.95)
wf.add_stage("Absorber absorptivity", 0.95)
wf.add_stage("Boiler heat transfer", 0.85)
wf.add_stage("Steam piping", 0.95)
wf.add_stage("Cooking vessel", 0.90)

print("=== Auroville Solar Kitchen: Efficiency Waterfall ===")
print(f"Solar irradiance: 1000 W/m^2 | Dish area: {dish_area:.0f} m^2")
print()
wf.print_waterfall()

# Identify improvement priorities
print()
print("=== Improvement Priority Analysis ===")
print("(Impact of 5% improvement at each stage)")
print()

header = "Stage                    Current  Improved  System Gain(kW)  Relative %"
print(header)
print("-" * len(header))

base_output = wf.current_power

for i, stage in enumerate(wf.stages):
    # Calculate system output with this stage improved by 5%
    new_eff = min(stage["efficiency"] + 0.05, 1.0)
    test_wf = EfficiencyWaterfall(solar_input)
    for j, s in enumerate(wf.stages):
        eff = new_eff if j == i else s["efficiency"]
        test_wf.add_stage(s["name"], eff)

    gain = test_wf.current_power - base_output
    relative = gain / base_output * 100
    print(f"{stage['name']:<25} {stage['efficiency']:>5.0%}    {new_eff:>5.0%}    "
          f"{gain:>13.1f}    {relative:>8.1f}%")

# Cost-effectiveness comparison
print()
print("=== Cost-Effectiveness of Improvements ===")
print()

improvements = [
    ("Better mirrors (90->95%)", 0, 0.95, 15000),
    ("Larger absorber (95->98%)", 2, 0.98, 5000),
    ("Boiler upgrade (85->90%)", 3, 0.90, 20000),
    ("Insulate pipes (95->98%)", 4, 0.98, 3000),
    ("Better pots (90->95%)", 5, 0.95, 2000),
]

header2 = "Improvement                  Cost($)  Power Gain(kW)  $/kW Gained"
print(header2)
print("-" * len(header2))

for name, idx, new_eff, cost in improvements:
    test_wf = EfficiencyWaterfall(solar_input)
    for j, s in enumerate(wf.stages):
        eff = new_eff if j == idx else s["efficiency"]
        test_wf.add_stage(s["name"], eff)
    gain = test_wf.current_power - base_output
    cost_per_kw = cost / gain if gain > 0 else float('inf')
    print(f"{name:<29} {cost:>6}    {gain:>12.1f}    {cost_per_kw:>9.0f}")

print()
print("Invest in the cheapest $/kW improvement first!")`,
      challenge: 'Add a second-law (exergy) analysis: not all heat is equally useful. Steam at 130 degrees C has more "quality" than warm water at 60 degrees C. Calculate the exergy efficiency (useful work potential) at each stage and show that the largest exergy destruction occurs at the highest temperature stage.',
      successHint: 'You just performed a system efficiency analysis — the most powerful tool for improving any energy system. The same waterfall approach is used in power plants, factories, buildings, and vehicles. Identifying and fixing the biggest loss mechanism always gives the best return on investment.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Heat transfer, steam generation, and cooking thermodynamics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model heat transfer, steam generation, and boiler design for solar cooking.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
