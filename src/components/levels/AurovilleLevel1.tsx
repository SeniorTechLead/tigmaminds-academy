import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AurovilleLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Reflection — how mirrors redirect sunlight',
      concept: `The Auroville Solar Kitchen uses a giant parabolic dish to concentrate sunlight for cooking. The fundamental principle is **reflection**: light bouncing off a surface at the same angle it arrived. The **law of reflection** states: angle of incidence = angle of reflection, both measured from the surface normal (the perpendicular).

A flat mirror simply redirects light. But a **curved mirror** (parabolic shape) can collect light from a large area and focus it to a single point — the **focus**. The Auroville dish is 15 metres in diameter, collecting sunlight from 177 square metres and focusing it to a spot just 20 cm across. This concentration is what produces cooking temperatures.

In the code below, you will trace light rays reflecting off flat and parabolic mirrors, demonstrating how the parabolic shape achieves perfect focusing.

*A parabola has a unique mathematical property: all rays parallel to its axis reflect through a single point (the focus). This is why satellite dishes, radio telescopes, and car headlights all use parabolic shapes.*`,
      analogy: 'Hold a magnifying glass in the sun. It focuses a large circle of sunlight into a tiny bright dot that can burn paper. The parabolic dish does the same thing but on a massive scale — a 15-metre "magnifying glass" that creates temperatures hot enough to cook food for 1000 people.',
      storyConnection: 'The Auroville Solar Kitchen was built in 1996 and cooks lunch for about 1000 people daily using only solar energy. The parabolic dish tracks the sun across the sky, keeping the concentrated beam aimed at a boiler that produces steam. No fossil fuels are burned — it is one of the world\'s largest solar cooking systems.',
      checkQuestion: 'If a parabolic dish has a diameter of 15 metres, what is the collecting area?',
      checkAnswer: 'Area = pi x r squared = pi x 7.5 squared = pi x 56.25 = 176.7 square metres. If the focus spot is 20 cm diameter (area = 0.031 m squared), the concentration ratio is 176.7 / 0.031 = 5700x. This means the energy density at the focus is 5700 times the normal sunlight intensity.',
      codeIntro: 'Trace light rays reflecting off flat and parabolic mirrors to demonstrate focusing.',
      code: `import numpy as np

def parabola_y(x, focal_length):
    """y = x^2 / (4*f) for a parabola with focus at (0, f)."""
    return x ** 2 / (4 * focal_length)

def parabola_normal_angle(x, focal_length):
    """Angle of the surface normal at position x on the parabola."""
    # Slope of parabola: dy/dx = x / (2*f)
    slope = x / (2 * focal_length)
    # Normal is perpendicular to tangent
    normal_angle = np.arctan(-1 / slope) if slope != 0 else np.pi / 2
    return normal_angle

def reflect_ray(incoming_angle, normal_angle):
    """Calculate reflected ray angle using law of reflection."""
    # Angle of incidence = incoming - normal
    incidence = incoming_angle - normal_angle
    # Reflected angle = normal - incidence (opposite side)
    reflected = normal_angle - incidence
    return reflected

# Parabolic dish parameters
focal_length = 5.0  # metres
dish_radius = 7.5   # metres (15m diameter)
dish_area = np.pi * dish_radius ** 2

print("=== Auroville Solar Kitchen: Parabolic Dish Optics ===")
print(f"Dish diameter: {dish_radius * 2} m")
print(f"Focal length: {focal_length} m")
print(f"Collecting area: {dish_area:.1f} m^2")
print()

# Trace parallel rays hitting the dish at different positions
print("=== Ray Tracing (parallel rays from the sun) ===")
print()

header = "Hit Position(m)  Surface Y(m)  Incidence(deg)  Focus Distance(m)  Error(mm)"
print(header)
print("-" * len(header))

for x in np.linspace(-7.0, 7.0, 15):
    if abs(x) < 0.1:
        continue
    y = parabola_y(x, focal_length)

    # Incoming ray is vertical (parallel to axis): angle = pi/2
    incoming = np.pi / 2

    # Normal at this point
    slope = x / (2 * focal_length)
    normal = np.arctan2(1, -slope)  # outward normal

    # Incidence angle
    incidence_deg = np.degrees(abs(incoming - normal))

    # Reflected ray should pass through (0, focal_length)
    # Calculate where reflected ray crosses x=0
    reflected = reflect_ray(incoming, normal)
    # Parametric: from (x, y) in direction of reflected ray
    if abs(np.cos(reflected)) > 0.001:
        t = -x / np.cos(reflected)
        y_focus = y + t * np.sin(reflected)
        error = abs(y_focus - focal_length) * 1000  # mm
    else:
        y_focus = focal_length
        error = 0

    print(f"{x:>14.1f}    {y:>9.2f}    {incidence_deg:>12.1f}    "
          f"{y_focus:>16.3f}    {error:>8.1f}")

print()
print("All rays converge to the focus within millimetres!")
print(f"Focus is at y = {focal_length:.1f} m above the dish centre.")

# Concentration ratio
print()
print("=== Concentration Ratio ===")
focus_diameter = 0.20  # 20 cm
focus_area = np.pi * (focus_diameter / 2) ** 2
concentration = dish_area / focus_area

print(f"Dish area: {dish_area:.1f} m^2")
print(f"Focus area: {focus_area:.4f} m^2 ({focus_diameter*100:.0f} cm diameter)")
print(f"Concentration ratio: {concentration:.0f}x")
print(f"If normal sunlight is 1000 W/m^2,")
print(f"flux at focus: {1000 * concentration / 1000:.0f} kW/m^2")`,
      challenge: 'Model what happens when the dish is 1 degree off-axis (not perfectly aimed at the sun). Calculate how the focus spot shifts and spreads. This is why the Auroville dish needs a tracking system — even a small misalignment dramatically reduces concentration.',
      successHint: 'You just performed ray tracing on a parabolic reflector — the same optical analysis used to design satellite dishes, radio telescopes, car headlights, and laser systems. The law of reflection and the parabolic focus property are two of the most important principles in optics.',
    },
    {
      title: 'The parabola and its focus — why this shape is special',
      concept: `A **parabola** is defined by the equation y = x squared / (4f), where f is the **focal length**. The focus is the point (0, f). The magical property is that every ray parallel to the axis reflects through the focus. No other shape has this property.

Why does this work? Because the parabola is defined as the set of all points equidistant from a fixed point (the focus) and a fixed line (the directrix). This equal-distance property means that all parallel rays travel the same total distance (incoming path + reflected path) to the focus — they arrive **in phase**, constructively interfering and concentrating energy.

In the code below, you will explore parabola geometry, calculate focal lengths for different dish shapes, and see how the f/D ratio (focal length to diameter) affects the dish performance.

*The same parabolic shape is used in reverse for searchlights and satellite transmitters: a source at the focus produces a perfectly parallel beam after reflection. Reflection is reversible — the same shape that focuses parallel light also produces parallel light from a point source.*`,
      analogy: 'Imagine whispering at one end of a parabolic arch (like some museum exhibits). Sound waves travel to the curved surface, reflect, and converge at the focus on the other end — where someone can hear your whisper clearly from 20 metres away. The parabola focuses sound the same way it focuses light.',
      storyConnection: 'The Auroville dish designer chose a specific f/D ratio (about 0.33) to balance two factors: a shorter focal length gives higher concentration but requires a deeper dish (harder to build), while a longer focal length gives a shallower dish but lower concentration. The chosen ratio is a compromise that fits the rooftop space and achieves sufficient cooking temperature.',
      checkQuestion: 'If a parabolic dish has a 10-metre diameter and a focal length of 4 metres, what is the depth of the dish at the edge?',
      checkAnswer: 'At the edge, x = 5 m (radius). Depth y = x^2 / (4f) = 25 / 16 = 1.5625 m. The dish is about 1.56 metres deep at the rim. This is the "sag" of the parabola — larger dishes are proportionally deeper unless the focal length is increased.',
      codeIntro: 'Explore parabola geometry and its relationship to solar concentration.',
      code: `import numpy as np

def parabola_depth(diameter_m, focal_length_m):
    """Depth of a parabolic dish at the rim."""
    r = diameter_m / 2
    return r ** 2 / (4 * focal_length_m)

def f_over_D(focal_length, diameter):
    return focal_length / diameter

def rim_angle(diameter_m, focal_length_m):
    """Angle from focus to rim of dish."""
    r = diameter_m / 2
    depth = parabola_depth(diameter_m, focal_length_m)
    return np.degrees(np.arctan2(r, focal_length_m - depth))

def geometric_concentration(diameter_m, focus_diameter_m=0.20):
    """Maximum geometric concentration ratio."""
    dish_area = np.pi * (diameter_m / 2) ** 2
    focus_area = np.pi * (focus_diameter_m / 2) ** 2
    return dish_area / focus_area

print("=== Parabola Geometry Calculator ===")
print()

# Compare different f/D ratios
print("--- Effect of f/D Ratio ---")
print()

D = 15  # fixed diameter
header = "f/D     Focal(m)  Depth(m)  Rim Angle(deg)  Concentration"
print(header)
print("-" * len(header))

for fD in [0.25, 0.30, 0.33, 0.40, 0.50, 0.60, 0.80, 1.00]:
    f = fD * D
    depth = parabola_depth(D, f)
    angle = rim_angle(D, f)
    conc = geometric_concentration(D)
    print(f"{fD:>4.2f}    {f:>6.1f}    {depth:>6.2f}    {angle:>13.1f}    {conc:>12.0f}")

print(f"\
Auroville dish: f/D = 0.33, f = {0.33 * 15:.1f} m")

# Compare different dish sizes
print()
print("--- Dish Size Comparison ---")
print()

header2 = "Diameter(m)  Area(m2)  Depth(m)  Concentration  Power@1kW/m2"
print(header2)
print("-" * len(header2))

for D in [2, 5, 8, 10, 15, 20, 30]:
    f = 0.33 * D  # fixed f/D ratio
    area = np.pi * (D / 2) ** 2
    depth = parabola_depth(D, f)
    conc = geometric_concentration(D)
    power = area * 1.0  # kW at 1 kW/m^2 solar irradiance
    print(f"{D:>9}    {area:>6.1f}    {depth:>5.2f}    {conc:>12.0f}    {power:>10.1f} kW")

print()
print("=== Parabola Profile (Auroville dish: D=15m, f=5m) ===")
print()
f = 5.0
for x_val in np.linspace(-7.5, 7.5, 16):
    y_val = x_val ** 2 / (4 * f)
    bar_offset = int(y_val * 4)
    bar = " " * bar_offset + "#"
    print(f"  x={x_val:>+5.1f}m  y={y_val:>5.2f}m  {bar}")`,
      challenge: 'Calculate the "intercept factor" — what fraction of reflected rays actually hit the absorber at the focus. If the absorber is a flat plate (not a point), rays from the dish edge hit it at a steep angle and some miss. Plot intercept factor versus absorber size.',
      successHint: 'You just analysed the geometry of parabolic concentrators — the same analysis used for solar power plants, radio telescopes, and satellite communications. The f/D ratio is the single most important design parameter for any parabolic reflector.',
    },
    {
      title: 'Solar irradiance — how much energy does the sun deliver?',
      concept: `The sun delivers about **1000 watts per square metre** (1 kW/m squared) at the Earth's surface on a clear day — this is called the **solar irradiance** or "solar constant" (though it varies with weather, time of day, and season). This means a 1 m squared surface receives 1 kW of power, equivalent to a small space heater.

The actual irradiance depends on several factors: **solar angle** (lower angle = longer path through atmosphere = less energy), **cloud cover**, **dust and humidity**, and **altitude**. At Auroville's latitude (12 degrees N), peak irradiance is about 950-1050 W/m squared depending on season.

In the code below, you will calculate solar irradiance throughout the day and across seasons at Auroville's location. This determines how much cooking energy the Solar Kitchen can produce.

*Solar irradiance at the top of the atmosphere is about 1361 W/m squared. About 30% is reflected or absorbed by the atmosphere, leaving roughly 1000 W/m squared at the surface on a clear day at noon. On cloudy days, it can drop to 100-300 W/m squared.*`,
      analogy: 'Imagine a flashlight shining on a table. Point it straight down and you get a bright, small circle (high irradiance). Tilt it at an angle and the circle spreads out (same light, larger area, lower irradiance per unit area). The sun at noon is like the flashlight pointing straight down; the sun at sunrise is tilted, spreading the light over a larger area.',
      storyConnection: 'The Auroville Solar Kitchen operates from about 9 AM to 2 PM — the hours when solar irradiance is high enough for cooking. On clear winter days, the dish produces enough steam by 10 AM. On monsoon days (June-September), clouds reduce irradiance so much that conventional cooking must supplement the solar system.',
      checkQuestion: 'If solar irradiance is 1000 W/m squared and the Auroville dish is 15 metres in diameter, what is the total solar power intercepted?',
      checkAnswer: 'Area = pi x 7.5 squared = 176.7 m squared. Power = 176.7 x 1000 = 176,700 W = 176.7 kW. After reflection losses (about 90% efficiency), about 159 kW reaches the absorber. This is equivalent to 159 electric kettles boiling water simultaneously.',
      codeIntro: 'Calculate solar irradiance at Auroville throughout the day and year.',
      code: `import numpy as np

def solar_elevation(hour, day_of_year, latitude_deg=12):
    """Calculate sun elevation angle above horizon.
    Simplified model for tropical latitudes.
    """
    # Declination angle (Earth's tilt effect)
    declination = 23.45 * np.sin(np.radians(360 * (284 + day_of_year) / 365))

    # Hour angle (0 at solar noon, 15 deg per hour)
    hour_angle = (hour - 12) * 15

    # Elevation angle
    lat_rad = np.radians(latitude_deg)
    dec_rad = np.radians(declination)
    ha_rad = np.radians(hour_angle)

    sin_elev = (np.sin(lat_rad) * np.sin(dec_rad) +
                np.cos(lat_rad) * np.cos(dec_rad) * np.cos(ha_rad))
    elevation = np.degrees(np.arcsin(np.clip(sin_elev, -1, 1)))
    return max(elevation, 0)

def clear_sky_irradiance(elevation_deg):
    """Direct normal irradiance for clear sky conditions.
    Uses simplified atmospheric transmission model.
    """
    if elevation_deg <= 0:
        return 0
    # Air mass (path length through atmosphere)
    air_mass = 1 / np.sin(np.radians(max(elevation_deg, 1)))
    air_mass = min(air_mass, 40)
    # Beer-Lambert law
    tau = 0.7  # atmospheric transmission factor
    I_0 = 1361  # solar constant W/m^2
    dni = I_0 * tau ** (air_mass ** 0.678)
    return dni

# Daily irradiance profile at Auroville
print("=== Solar Irradiance at Auroville (12 N latitude) ===")
print()

# Summer solstice (day 172) and winter solstice (day 355)
days = [
    ("Summer solstice (Jun 21)", 172),
    ("Equinox (Mar 21)", 80),
    ("Winter solstice (Dec 21)", 355),
]

for name, day in days:
    print(f"--- {name} ---")
    header = "Hour   Elevation(deg)  DNI(W/m2)  Dish Power(kW)"
    print(header)

    daily_energy = 0
    dish_area = np.pi * 7.5 ** 2

    for hour_x10 in range(50, 195, 5):
        hour = hour_x10 / 10
        elev = solar_elevation(hour, day)
        dni = clear_sky_irradiance(elev)
        dish_power = dni * dish_area * 0.90 / 1000  # 90% mirror efficiency
        daily_energy += dish_power * 0.5  # 0.5 hour steps, kWh

        if hour % 1 == 0 and 6 <= hour <= 18:
            print(f"{hour:>5.0f}   {elev:>12.1f}    {dni:>8.0f}    {dish_power:>12.1f}")

    print(f"  Daily energy (clear sky): {daily_energy:.0f} kWh")
    print()

# Monthly average irradiance
print("=== Monthly Peak Irradiance at Solar Noon ===")
print()

header2 = "Month        Day   Noon Elev(deg)  DNI(W/m2)  Dish Power(kW)"
print(header2)
print("-" * len(header2))

months = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

for i, month in enumerate(months):
    mid_day = 15 + i * 30
    elev = solar_elevation(12, mid_day)
    dni = clear_sky_irradiance(elev)
    power = dni * np.pi * 7.5 ** 2 * 0.90 / 1000
    cloud_factor = [0.85, 0.90, 0.90, 0.80, 0.70, 0.40, 0.35, 0.40, 0.50, 0.65, 0.75, 0.80][i]
    print(f"{month:<12} {mid_day:>4}   {elev:>12.1f}    {dni:>8.0f}    "
          f"{power:>12.1f} (x{cloud_factor:.2f} clouds)")`,
      challenge: 'Calculate the total annual energy harvested by the Auroville dish, accounting for cloud cover (use the monthly cloud factors). Compare to the annual cooking energy requirement of 1000 meals/day at 0.5 kWh/meal. What fraction of cooking energy comes from solar?',
      successHint: 'You just calculated solar irradiance profiles — the foundation of all solar energy engineering. The same calculations are used to design solar panels, solar water heaters, and concentrated solar power plants. Understanding the sun\'s geometry is essential for any solar energy project.',
    },
    {
      title: 'Concentration ratio — from weak sunlight to cooking temperatures',
      concept: `The sun delivers about 1000 W/m squared — warm but not hot enough to cook (it heats a dark surface to about 70 degrees C in still air). To reach cooking temperatures (100-250 degrees C), we need to **concentrate** the sunlight. The **concentration ratio** C is the ratio of collector area to absorber area.

The temperature achievable by concentration follows the Stefan-Boltzmann law. Higher concentration gives higher temperature, but with diminishing returns. The theoretical maximum temperature for any solar concentrator is about 5700 degrees C (the sun's surface temperature), but practical limits are much lower due to optical errors and heat losses.

In the code below, you will calculate the equilibrium temperature of an absorber at different concentration ratios and determine the minimum concentration needed for various cooking tasks.

*Concentration ratio limits: a flat plate collector (C=1) reaches about 70 degrees C. A parabolic trough (C=20-80) reaches 150-400 degrees C. A parabolic dish (C=100-10000) reaches 200-3500 degrees C. A solar furnace (C=10000+) can melt steel.*`,
      analogy: 'Imagine collecting rainwater. A 1 m squared tray collects a thin layer (flat plate collector). A funnel with a 10 m squared opening concentrates all the rain into a small bottle (parabolic dish). The amount of water hitting the bottle is 10 times what a small tray would collect — the "concentration ratio" is 10. Similarly, a parabolic dish concentrates the sun\'s energy.',
      storyConnection: 'The Auroville Solar Kitchen dish has a concentration ratio of about 5700x. This is far more than needed for cooking (which requires only C=50-100). The excess concentration is deliberate: it allows cooking even on partially cloudy days when irradiance drops to 30% of clear-sky values. At 30% irradiance, the effective concentration is still 0.30 x 5700 = 1710x — more than enough.',
      checkQuestion: 'If a concentration ratio of 100x raises a surface to 400 degrees C, does 200x raise it to 800 degrees C?',
      checkAnswer: 'No. Temperature does not scale linearly with concentration because heat losses increase with the fourth power of temperature (Stefan-Boltzmann law). Doubling the concentration from 100x to 200x might raise the temperature from 400 to about 500 degrees C — not 800 degrees C. This is the law of diminishing returns for solar concentration.',
      codeIntro: 'Calculate equilibrium temperature at different concentration ratios.',
      code: `import numpy as np

def equilibrium_temperature(concentration, solar_irradiance=1000,
                            absorptivity=0.95, emissivity=0.90):
    """Calculate equilibrium temperature of a solar absorber.

    At equilibrium: absorbed power = radiated power
    alpha * C * G * A = epsilon * sigma * T^4 * A
    T = (alpha * C * G / (epsilon * sigma))^(1/4)
    """
    sigma = 5.67e-8  # Stefan-Boltzmann constant
    T_kelvin = (absorptivity * concentration * solar_irradiance /
                (emissivity * sigma)) ** 0.25
    return T_kelvin - 273.15  # convert to Celsius

# Temperature vs concentration
print("=== Equilibrium Temperature vs Concentration Ratio ===")
print(f"Solar irradiance: 1000 W/m^2 | Absorptivity: 0.95 | Emissivity: 0.90")
print()

header = "Concentration  Temp(C)   Application"
print(header)
print("-" * len(header))

applications = {
    1: "Flat plate (water heating)",
    5: "Evacuated tube collector",
    20: "Parabolic trough (low)",
    50: "Cooking (boiling water)",
    100: "Cooking (frying, baking)",
    500: "Industrial process heat",
    1000: "Steam turbine power",
    5000: "Metal melting",
    5700: "Auroville dish (max)",
    10000: "Solar furnace",
}

for C in sorted(applications.keys()):
    T = equilibrium_temperature(C)
    app = applications[C]
    print(f"{C:>12}    {T:>6.0f}    {app}")

# Cooking requirements
print()
print("=== Minimum Concentration for Cooking Tasks ===")
print()

tasks = [
    ("Warm water (60 C)", 60),
    ("Pasteurize (72 C)", 72),
    ("Boil water (100 C)", 100),
    ("Steam cooking (120 C)", 120),
    ("Deep frying (180 C)", 180),
    ("Baking (200 C)", 200),
    ("Grilling (250 C)", 250),
]

header2 = "Task                   Target(C)  Min Concentration  Auroville Margin"
print(header2)
print("-" * len(header2))

for name, target_C in tasks:
    # Find minimum C for target temperature
    for C in range(1, 10001):
        if equilibrium_temperature(C) >= target_C:
            min_C = C
            break
    margin = 5700 / min_C
    print(f"{name:<23} {target_C:>7}    {min_C:>16}    {margin:>14.0f}x")

# Effect of clouds
print()
print("=== Cloud Effect on Cooking Temperature ===")
print("(Auroville dish at C=5700)")
print()

for cloud_factor in [1.0, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1]:
    effective_irradiance = 1000 * cloud_factor
    T = equilibrium_temperature(5700, effective_irradiance)
    can_cook = "Yes" if T > 120 else "Marginal" if T > 100 else "No"
    print(f"  {cloud_factor*100:>3.0f}% sun ({effective_irradiance:>4.0f} W/m2): {T:>5.0f} C  Cook: {can_cook}")`,
      challenge: 'Add convective heat loss: in reality, wind cools the absorber. Model the total heat loss as radiation + convection: Q_loss = epsilon*sigma*T^4 + h*(T-T_ambient), where h = 10 W/(m^2*K). How does wind affect the equilibrium temperature? At what wind speed does cooking become impossible?',
      successHint: 'You just applied the Stefan-Boltzmann law and radiative equilibrium — the same physics used to calculate the temperature of stars, the Earth\'s climate, and the heat shield of a spacecraft. Solar concentration is one of the most elegant applications of thermodynamics.',
    },
    {
      title: 'Energy balance — how much food can the Solar Kitchen cook?',
      concept: `To determine how many meals the Solar Kitchen can produce, we need an **energy balance**: the solar energy collected must equal the energy needed to cook the food plus all the losses (reflection, absorption, heat transfer, steam losses).

The cooking energy chain is: **solar input** (1000 W/m squared x dish area) -> **mirror reflection** (90% efficient) -> **absorber heating** (95% absorption) -> **steam generation** (80% boiler efficiency) -> **cooking** (heat transferred to food). The overall system efficiency is about 0.90 x 0.95 x 0.80 = 68%.

In the code below, you will calculate the complete energy balance for the Auroville Solar Kitchen and determine how many meals it can cook per hour under different conditions.

*Energy balance is the most fundamental calculation in any engineering system. Input = Output + Losses. If you account for all losses accurately, you can predict exactly how much useful output the system produces.*`,
      analogy: 'Imagine a bucket brigade passing water from a river to a fire. The river (sun) provides unlimited water. But at each hand-off (mirror, absorber, boiler), some water spills (losses). By the time water reaches the fire (cooking pot), only 68% of the original amount remains. Knowing the loss at each step lets you calculate how big the bucket brigade needs to be.',
      storyConnection: 'The Auroville Solar Kitchen was designed to cook lunch for 1000 people. The engineers worked backward from the cooking requirement: 1000 meals x 0.5 kWh per meal = 500 kWh total. Divided by 4 peak solar hours = 125 kW average cooking power. Divided by 68% system efficiency = 184 kW solar input. Divided by 1 kW/m squared irradiance = 184 m squared of dish area. The 15-metre dish provides 177 m squared — just about right.',
      checkQuestion: 'If the dish collects 177 kW of solar power and system efficiency is 68%, how many litres of water can it boil per hour (from 25 degrees C)?',
      checkAnswer: 'Useful power = 177 x 0.68 = 120 kW. Energy to boil 1 litre from 25 degrees C: heating (4.186 kJ/(kg*K) x 75 K = 314 kJ) + vaporization (2260 kJ) = 2574 kJ. Litres per hour = 120,000 W x 3600 s / 2,574,000 J = 168 litres/hour. That is enough for about 1000 cups of rice.',
      codeIntro: 'Calculate the complete energy balance for the Auroville Solar Kitchen.',
      code: `import numpy as np

class SolarKitchenEnergyBalance:
    def __init__(self, dish_diameter_m=15, focal_length_m=5):
        self.dish_area = np.pi * (dish_diameter_m / 2) ** 2
        self.focal_length = focal_length_m

        # Efficiency chain
        self.mirror_reflectivity = 0.90
        self.absorber_absorptivity = 0.95
        self.boiler_efficiency = 0.80
        self.piping_loss = 0.95  # 5% loss in steam pipes

    def overall_efficiency(self):
        return (self.mirror_reflectivity *
                self.absorber_absorptivity *
                self.boiler_efficiency *
                self.piping_loss)

    def useful_power_kW(self, irradiance_W_m2):
        solar_input = self.dish_area * irradiance_W_m2 / 1000  # kW
        return solar_input * self.overall_efficiency()

    def meals_per_hour(self, irradiance_W_m2, energy_per_meal_kWh=0.5):
        power = self.useful_power_kW(irradiance_W_m2)
        return power / energy_per_meal_kWh

    def water_boiled_per_hour(self, irradiance_W_m2, start_temp_C=25):
        power_W = self.useful_power_kW(irradiance_W_m2) * 1000
        energy_per_kg = 4186 * (100 - start_temp_C) + 2260000  # heating + vaporization
        return power_W * 3600 / energy_per_kg  # kg/hour

# Create solar kitchen model
kitchen = SolarKitchenEnergyBalance(dish_diameter_m=15)

print("=== Auroville Solar Kitchen Energy Balance ===")
print(f"Dish diameter: 15 m | Dish area: {kitchen.dish_area:.1f} m^2")
print()
print("Efficiency chain:")
print(f"  Mirror reflectivity:   {kitchen.mirror_reflectivity:.0%}")
print(f"  Absorber absorptivity: {kitchen.absorber_absorptivity:.0%}")
print(f"  Boiler efficiency:     {kitchen.boiler_efficiency:.0%}")
print(f"  Piping (steam losses): {kitchen.piping_loss:.0%}")
print(f"  Overall efficiency:    {kitchen.overall_efficiency():.0%}")
print()

# Performance at different irradiance levels
header = "Irradiance(W/m2)  Solar In(kW)  Useful(kW)  Meals/hr  Water(kg/hr)"
print(header)
print("-" * len(header))

for irr in [200, 400, 600, 800, 900, 1000]:
    solar_in = kitchen.dish_area * irr / 1000
    useful = kitchen.useful_power_kW(irr)
    meals = kitchen.meals_per_hour(irr)
    water = kitchen.water_boiled_per_hour(irr)
    print(f"{irr:>14}    {solar_in:>10.1f}    {useful:>8.1f}    {meals:>6.0f}    {water:>10.0f}")

# Daily cooking schedule
print()
print("=== Daily Cooking Schedule (clear day) ===")
print()

total_meals = 0
total_energy_kWh = 0

for hour in range(8, 15):
    # Approximate irradiance by hour (tropical location)
    hour_factor = {8: 0.5, 9: 0.75, 10: 0.90, 11: 0.98,
                   12: 1.00, 13: 0.95, 14: 0.85}
    irr = 1000 * hour_factor.get(hour, 0)
    useful = kitchen.useful_power_kW(irr)
    meals = kitchen.meals_per_hour(irr)
    total_meals += meals
    total_energy_kWh += useful

    print(f"  {hour:>2}:00  Irr={irr:>4.0f} W/m2  Power={useful:>5.1f} kW  Meals={meals:>4.0f}/hr")

print(f"\
  Total meals (8am-2pm): {total_meals:.0f}")
print(f"  Total energy delivered: {total_energy_kWh:.0f} kWh")
print(f"  Target: 1000 meals  -->  {'MET' if total_meals >= 1000 else 'NOT MET'}")`,
      challenge: 'Add thermal storage: the Solar Kitchen uses an insulated water tank to store excess heat from midday for use in late afternoon. Model the tank temperature over the day (charging when solar exceeds cooking demand, discharging when demand exceeds solar). How many additional meals can be cooked from stored heat?',
      successHint: 'You just performed a complete energy balance for a real solar cooking system. The same analysis applies to solar water heaters, concentrated solar power plants, and any thermal energy system. Energy balance is the universal language of engineering — if the numbers balance, the design works.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Reflection, parabolas, and solar concentration</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model optics, solar irradiance, and energy balance for solar cooking.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
