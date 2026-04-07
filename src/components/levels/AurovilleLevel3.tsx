import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AurovilleLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Solar tracking — following the sun across the sky',
      concept: `A parabolic dish must point directly at the sun to focus light onto the absorber. As the sun moves across the sky (about 15 degrees per hour in azimuth, with elevation changing throughout the day), the dish must **track** it continuously. Two-axis tracking adjusts both **azimuth** (compass direction) and **elevation** (angle above horizon).

The solar position at any time can be calculated from three inputs: **latitude**, **day of year** (determines declination), and **time of day** (determines hour angle). From these, we compute the sun's azimuth and elevation, which become the dish pointing commands.

In the code below, you will build a solar tracking algorithm that calculates the required dish pointing angles throughout the day at Auroville's latitude.

*Solar tracking increases energy collection by 25-40% compared to a fixed dish. A fixed dish only points at the sun at one moment; a tracked dish maintains alignment all day. For a concentrated system like Auroville's, tracking is essential — even a 1-degree error defocuses the beam significantly.*`,
      analogy: 'Imagine a sunflower turning to face the sun throughout the day (heliotropism). The solar tracking system does the same thing mechanically — rotating the dish to follow the sun from east to west, and tilting it up and down as the sun rises and sets. The tracking must be smooth and precise, or the focused beam wanders off the boiler.',
      storyConnection: 'The Auroville dish uses a computer-controlled two-axis tracking system. A small sensor on the dish detects the brightest direction and sends correction signals to two motors. The system tracks with an accuracy of about 0.1 degrees — keeping the focused beam centred on the 20 cm absorber even as the sun moves.',
      checkQuestion: 'If the sun moves 15 degrees per hour in azimuth, and the dish must track within 0.5 degrees, how often must the tracking motors update?',
      checkAnswer: '15 degrees/hour = 0.25 degrees/minute. To stay within 0.5 degrees, the motor must update at least every 0.5/0.25 = 2 minutes. In practice, the Auroville system updates every 30 seconds for smoother tracking, consuming very little power (the motors are small).',
      codeIntro: 'Build a solar position calculator and tracking algorithm for the Auroville dish.',
      code: `import numpy as np

def solar_position(latitude_deg, day_of_year, hour):
    """Calculate sun azimuth and elevation.
    Returns (azimuth_deg, elevation_deg).
    Azimuth: 0=North, 90=East, 180=South, 270=West.
    """
    lat = np.radians(latitude_deg)

    # Declination
    decl = np.radians(23.45 * np.sin(np.radians(360 * (284 + day_of_year) / 365)))

    # Hour angle (0 at solar noon, negative morning, positive afternoon)
    ha = np.radians((hour - 12) * 15)

    # Elevation
    sin_elev = np.sin(lat) * np.sin(decl) + np.cos(lat) * np.cos(decl) * np.cos(ha)
    elevation = np.degrees(np.arcsin(np.clip(sin_elev, -1, 1)))

    # Azimuth
    cos_az = (np.sin(decl) - np.sin(lat) * sin_elev) / (np.cos(lat) * np.cos(np.radians(elevation)) + 1e-10)
    azimuth = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
    if hour > 12:
        azimuth = 360 - azimuth

    return azimuth, max(elevation, 0)

def tracking_error(actual_az, actual_el, dish_az, dish_el):
    """Angular error between dish pointing and sun position."""
    # Convert to radians for dot product
    a1 = np.radians(actual_az)
    e1 = np.radians(actual_el)
    a2 = np.radians(dish_az)
    e2 = np.radians(dish_el)

    cos_error = (np.sin(e1) * np.sin(e2) +
                 np.cos(e1) * np.cos(e2) * np.cos(a1 - a2))
    return np.degrees(np.arccos(np.clip(cos_error, -1, 1)))

# Auroville: 12 deg N latitude
latitude = 12.0

# Track sun through a typical day
print("=== Solar Tracking at Auroville (12 N) ===")
print()

for day_name, day in [("Summer Solstice (Jun 21)", 172),
                       ("Equinox (Mar 21)", 80),
                       ("Winter Solstice (Dec 21)", 355)]:
    print(f"--- {day_name} ---")
    header = "Hour   Azimuth(deg)  Elevation(deg)  Az Rate(deg/hr)  El Rate(deg/hr)"
    print(header)

    prev_az, prev_el = None, None
    for hour_x10 in range(60, 185, 5):
        hour = hour_x10 / 10
        az, el = solar_position(latitude, day, hour)
        if el <= 0:
            continue

        if prev_az is not None and hour % 1 == 0:
            az_rate = (az - prev_az) * 2  # per hour (half-hour steps)
            el_rate = (el - prev_el) * 2
            print(f"{hour:>5.0f}   {az:>10.1f}    {el:>12.1f}    {az_rate:>13.1f}    {el_rate:>13.1f}")

        prev_az, prev_el = az, el
    print()

# Tracking accuracy analysis
print("=== Effect of Tracking Error on Concentration ===")
print()

dish_diameter = 15  # m
focal_length = 5    # m
absorber_diameter = 0.20  # m

for error_deg in [0, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0]:
    # Focus spot shifts by: focal_length * tan(error)
    spot_shift_m = focal_length * np.tan(np.radians(error_deg))
    spot_shift_mm = spot_shift_m * 1000

    # Fraction of energy hitting absorber
    if spot_shift_m < absorber_diameter / 2:
        intercept = 1.0
    else:
        # Approximate: energy drops off as Gaussian
        sigma = absorber_diameter / 4
        intercept = np.exp(-0.5 * (spot_shift_m / sigma) ** 2)

    print(f"  Error: {error_deg:>4.1f} deg  Spot shift: {spot_shift_mm:>6.0f} mm  "
          f"Intercept: {intercept:>5.0%}")`,
      challenge: 'Add cloud detection: if solar irradiance suddenly drops (cloud), the tracking should pause (to save motor energy and avoid hunting). Implement a simple cloud detector that monitors power output and pauses tracking when output drops below 30% of expected clear-sky value.',
      successHint: 'You just built a solar tracking algorithm — the same mathematics used in solar power plants, satellite dish pointing, telescope mounts, and spacecraft attitude control. The ability to calculate solar position from latitude, date, and time is fundamental to all solar energy engineering.',
    },
    {
      title: 'Seasonal variation — designing for winter, spring, monsoon, and summer',
      concept: `Solar energy is not constant throughout the year. At Auroville (12 degrees N), the sun is nearly overhead in summer (high elevation, short atmospheric path) but lower in winter (longer path, less energy). The monsoon (June-September) brings clouds that block 40-70% of direct sunlight.

A well-designed solar cooking system must handle these variations: storing excess energy from sunny days, switching to backup fuel during extended cloudy periods, and adjusting cooking schedules seasonally. The system's **annual capacity factor** (actual output / maximum possible output) is typically 40-60% for a tropical location.

In the code below, you will simulate the Solar Kitchen's performance across all seasons and calculate the annual capacity factor, backup fuel requirement, and optimal operating schedule.

*Capacity factor is the key metric for any renewable energy system. Solar PV in India averages 15-22% capacity factor. Concentrated solar (like Auroville) achieves higher because it uses direct sunlight more efficiently but drops to near zero on cloudy days.*`,
      analogy: 'Think of a rain barrel that collects water for a garden. In the wet season, it overflows (more supply than demand). In the dry season, it runs low and you need municipal water as backup. The Solar Kitchen is similar: sunny months produce excess heat (stored in hot water tanks), while monsoon months require backup cooking fuel.',
      storyConnection: 'The Auroville Solar Kitchen has a backup steam boiler that runs on biomass (wood pellets from the Auroville forest). During the monsoon, the backup provides 60-80% of cooking energy. The annual fuel bill for the backup is about one-fifth what a conventional kitchen would spend — the solar dish provides the rest for free.',
      checkQuestion: 'If the Solar Kitchen can cook 1000 meals on a clear day but only 300 during monsoon clouds, and the monsoon lasts 4 months, what is the annual meal shortfall that the backup must cover?',
      checkAnswer: 'Clear months: 8 x 30 x 1000 = 240,000 meals from solar. Monsoon: 4 x 30 x 300 = 36,000 meals from solar. Total solar: 276,000. Annual demand: 12 x 30 x 1000 = 360,000. Shortfall: 360,000 - 276,000 = 84,000 meals from backup (23.3% of total). Solar provides 76.7% of annual cooking energy.',
      codeIntro: 'Simulate year-round performance of the Solar Kitchen with seasonal variation.',
      code: `import numpy as np

def monthly_solar_output(month, dish_area=176.7, peak_efficiency=0.56):
    """Estimate monthly solar cooking energy output (kWh)."""
    # Monthly average peak irradiance (W/m^2) at Auroville
    monthly_irradiance = [850, 900, 950, 900, 850, 600,
                          500, 550, 650, 750, 800, 830]

    # Monthly cloud factor (fraction of clear sky days)
    cloud_factor = [0.85, 0.88, 0.90, 0.82, 0.72, 0.40,
                    0.30, 0.35, 0.50, 0.65, 0.75, 0.82]

    # Effective solar hours per day
    solar_hours = [5.0, 5.5, 6.0, 6.0, 5.5, 4.0,
                   3.5, 4.0, 4.5, 5.0, 5.0, 4.5]

    irr = monthly_irradiance[month]
    cf = cloud_factor[month]
    hours = solar_hours[month]
    days = 30

    # Daily output = irradiance * area * efficiency * cloud * hours
    daily_kWh = irr * dish_area * peak_efficiency * cf * hours / 1000
    monthly_kWh = daily_kWh * days
    daily_meals = daily_kWh / 0.5  # 0.5 kWh per meal

    return {
        "irradiance": irr,
        "cloud_factor": cf,
        "solar_hours": hours,
        "daily_kWh": daily_kWh,
        "monthly_kWh": monthly_kWh,
        "daily_meals": daily_meals,
    }

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

print("=== Auroville Solar Kitchen: Annual Performance ===")
print()

header = "Month  Irr(W/m2)  Cloud  Hours  Daily(kWh)  Meals/Day  Backup Needed"
print(header)
print("-" * len(header))

annual_solar_kWh = 0
annual_meals_solar = 0
annual_backup_meals = 0
target_daily_meals = 1000

for i, month in enumerate(months):
    data = monthly_solar_output(i)
    annual_solar_kWh += data["monthly_kWh"]
    annual_meals_solar += data["daily_meals"] * 30
    shortfall = max(0, target_daily_meals - data["daily_meals"])
    annual_backup_meals += shortfall * 30
    backup_str = f"{shortfall:.0f}" if shortfall > 0 else "-"

    print(f"{month}    {data['irradiance']:>7}    {data['cloud_factor']:>4.2f}  "
          f"{data['solar_hours']:>4.1f}    {data['daily_kWh']:>8.0f}    "
          f"{data['daily_meals']:>7.0f}    {backup_str:>12}")

total_meals = target_daily_meals * 365
solar_fraction = annual_meals_solar / total_meals * 100
capacity_factor = annual_solar_kWh / (176.7 * 1.0 * 0.56 * 6 * 365) * 100

print()
print("=== Annual Summary ===")
print(f"Total annual demand: {total_meals:,} meals")
print(f"Solar-provided meals: {annual_meals_solar:,.0f} ({solar_fraction:.1f}%)")
print(f"Backup required: {annual_backup_meals:,.0f} meals ({100-solar_fraction:.1f}%)")
print(f"Annual solar energy: {annual_solar_kWh:,.0f} kWh")
print(f"Capacity factor: {capacity_factor:.1f}%")

# Backup fuel cost comparison
print()
print("=== Cost Comparison (annual) ===")
backup_kwh = annual_backup_meals * 0.5
lpg_cost = backup_kwh * 0.08  # $0.08/kWh for LPG
biomass_cost = backup_kwh * 0.03  # $0.03/kWh for biomass
full_lpg_cost = total_meals * 0.5 * 0.08
print(f"  Full LPG kitchen: \{full_lpg_cost:,.0f}/year")
print(f"  Solar + LPG backup: \{lpg_cost:,.0f}/year (save {full_lpg_cost-lpg_cost:,.0f})")
print(f"  Solar + biomass backup: \{biomass_cost:,.0f}/year (save {full_lpg_cost-biomass_cost:,.0f})")`,
      challenge: 'Add thermal storage: a 10,000-litre insulated water tank at 90 degrees C can store about 750 kWh. Model the tank charging during sunny hours and discharging during cooking. How many cloudy days can the stored heat cover before the backup is needed?',
      successHint: 'You just performed an annual energy yield analysis — the standard assessment for any renewable energy project. The same methodology is used for solar farms, wind turbines, hydroelectric plants, and biomass generators. Seasonal variation and backup requirements are the key challenges for all renewable energy systems.',
    },
    {
      title: 'Thermal storage — banking heat for cloudy hours',
      concept: `Solar energy is intermittent — available only during clear daylight hours. **Thermal storage** bridges the gap between solar supply and cooking demand by storing excess heat in a medium (usually water or molten salt) that releases the heat later.

The storage capacity depends on mass, specific heat, and temperature range: **E = m x c x delta_T**. A 10,000-litre water tank heated from 30 to 90 degrees C stores: 10,000 x 4.186 x 60 = 2,511,600 kJ = 698 kWh. This is enough to cook about 1400 meals.

In the code below, you will model a thermal storage system for the Auroville Solar Kitchen, simulating the charging (solar) and discharging (cooking) cycles throughout the day.

*Thermal storage is one of the cheapest forms of energy storage — far cheaper per kWh than batteries. Hot water tanks, ice storage, and molten salt systems are used in buildings and power plants worldwide. The Auroville system uses a simple but effective insulated water tank.*`,
      analogy: 'Think of a rechargeable battery for heat. When the sun is strong (midday), the "battery" charges by heating water. When the sun weakens (afternoon clouds), the "battery" discharges by releasing hot water to the kitchen. The insulation is like the battery casing — it prevents self-discharge (heat leaking to the environment).',
      storyConnection: 'The Auroville Solar Kitchen uses an insulated hot water tank that stores excess midday heat for use in late afternoon cooking and pre-heating water for the next morning. This extends the effective cooking window from 4 hours (direct solar) to about 7 hours (solar + storage). On a fully sunny day, the tank can provide 2-3 hours of cooking without any sun.',
      checkQuestion: 'If a 5000-litre tank at 90 degrees C loses heat to the environment at 2% per hour, what is the temperature after 10 hours (overnight)?',
      checkAnswer: 'After each hour, the tank retains 98% of its heat. After 10 hours: T = 30 + (90-30) x 0.98^10 = 30 + 60 x 0.817 = 79 degrees C. The tank only dropped from 90 to 79 degrees C overnight — good insulation makes thermal storage very effective. The stored energy is 5000 x 4.186 x (79-30) = 1026 MJ = 285 kWh.',
      codeIntro: 'Simulate a thermal storage system for the Solar Kitchen.',
      code: `import numpy as np

class ThermalStorage:
    def __init__(self, volume_litres, initial_temp_C=30, insulation_loss_pct_hr=2):
        self.volume = volume_litres
        self.temp = initial_temp_C
        self.loss_rate = insulation_loss_pct_hr / 100
        self.cp = 4.186  # kJ/(kg*K)
        self.ambient = 30  # C
        self.history = []

    def stored_energy_kWh(self):
        return self.volume * self.cp * (self.temp - self.ambient) / 3600

    def charge(self, power_kW, duration_hours):
        """Add heat from solar system."""
        energy_kJ = power_kW * duration_hours * 3600
        delta_T = energy_kJ / (self.volume * self.cp)
        self.temp += delta_T
        self.temp = min(self.temp, 95)  # max 95 C (unpressurized)

    def discharge(self, power_kW, duration_hours):
        """Remove heat for cooking."""
        energy_kJ = power_kW * duration_hours * 3600
        delta_T = energy_kJ / (self.volume * self.cp)
        self.temp -= delta_T
        self.temp = max(self.temp, self.ambient)

    def heat_loss(self, hours=1):
        """Insulation heat loss."""
        loss_fraction = 1 - (1 - self.loss_rate) ** hours
        temp_drop = (self.temp - self.ambient) * loss_fraction
        self.temp -= temp_drop

    def record(self, hour, label=""):
        self.history.append({
            "hour": hour, "temp": self.temp,
            "energy_kWh": self.stored_energy_kWh(),
            "label": label,
        })

# Simulate a day with thermal storage
tank = ThermalStorage(volume_litres=10000, initial_temp_C=50)

print("=== Solar Kitchen + Thermal Storage: Daily Simulation ===")
print(f"Tank: {tank.volume} litres | Initial: {tank.temp} C")
print()

# Hourly schedule
schedule = [
    (6,  "standby",  0,   0,   "Pre-dawn"),
    (7,  "standby",  0,   0,   "Dawn"),
    (8,  "charge",   30,  0,   "Morning sun, no cooking"),
    (9,  "both",     80,  40,  "Strong sun + cooking starts"),
    (10, "both",     120, 60,  "Peak sun + active cooking"),
    (11, "both",     140, 80,  "Peak cooking demand"),
    (12, "both",     150, 100, "Lunch rush"),
    (13, "both",     130, 80,  "Afternoon cooking"),
    (14, "discharge", 0,  60,  "Clouds arriving"),
    (15, "discharge", 0,  40,  "Overcast, cooking from storage"),
    (16, "discharge", 0,  20,  "Late afternoon"),
    (17, "standby",  0,   0,   "Kitchen closing"),
]

header = "Hour  Action      Solar(kW)  Cook(kW)  Tank(C)  Stored(kWh)  Note"
print(header)
print("-" * 75)

for hour, action, solar_kW, cook_kW, note in schedule:
    if action == "charge":
        tank.charge(solar_kW, 1)
    elif action == "discharge":
        tank.discharge(cook_kW, 1)
    elif action == "both":
        net = solar_kW - cook_kW
        if net > 0:
            tank.charge(net, 1)
        else:
            tank.discharge(-net, 1)

    tank.heat_loss(1)
    tank.record(hour, note)

    print(f"{hour:>4}  {action:<10}  {solar_kW:>7}    {cook_kW:>5}    "
          f"{tank.temp:>5.1f}    {tank.stored_energy_kWh():>9.0f}    {note}")

# Overnight
print()
print("=== Overnight Storage ===")
for hour in range(18, 30):
    tank.heat_loss(1)
    display_hour = hour if hour < 24 else hour - 24
    if hour % 3 == 0:
        print(f"  {display_hour:>2}:00  Tank: {tank.temp:.1f} C  Stored: {tank.stored_energy_kWh():.0f} kWh")

print()
print(f"Morning tank temperature: {tank.temp:.1f} C")
print(f"Morning stored energy: {tank.stored_energy_kWh():.0f} kWh")
print(f"Available for pre-solar cooking: {tank.stored_energy_kWh() / 0.5:.0f} meals")`,
      challenge: 'Design a phase-change material (PCM) storage system: instead of water, use a material that melts at 80 degrees C (like paraffin wax). The latent heat of melting stores 3-5x more energy per kg than water in the same temperature range. Calculate the tank size reduction.',
      successHint: 'You built a thermal energy storage simulation. The same principles apply to district heating systems, concentrated solar power plants (which use molten salt to store heat overnight), and building thermal mass. Thermal storage is the cheapest way to make intermittent renewable energy dispatchable.',
    },
    {
      title: 'Solar resource mapping — finding the best locations for solar cooking',
      concept: `Not all locations are equally suited for solar cooking. The key metric is **Direct Normal Irradiance** (DNI) — the solar energy per square metre perpendicular to the sun's rays. DNI is highest in dry, cloud-free locations (deserts) and lowest in humid, cloudy places (tropical coasts during monsoon).

**Global Horizontal Irradiance** (GHI) includes both direct and diffuse (scattered) sunlight. Flat-plate solar panels use GHI, but concentrating systems like the Auroville dish can only use DNI — diffuse light cannot be focused. This makes location selection more critical for concentrating systems.

In the code below, you will compare solar resources across India and find the optimal locations for solar cooking facilities. This connects the Auroville design to the broader question of solar energy deployment.

*India receives 5000 trillion kWh of solar energy per year — enough to meet the country's energy needs many times over. The challenge is converting and storing this energy cost-effectively. Solar cooking is one of the simplest and most direct applications.*`,
      analogy: 'Imagine choosing where to put a garden. You want maximum sunlight, minimum shade, and reliable weather. The "solar resource map" is the gardener\'s guide to sunshine — it shows how much sun each location gets throughout the year, accounting for clouds, dust, and atmospheric conditions.',
      storyConnection: 'Auroville was a good but not ideal choice for solar cooking — its coastal location brings monsoon clouds for 4 months. The Rajasthan desert (Thar) has 40% higher DNI but is far from large populations. The optimal strategy might be to build solar kitchens in medium-DNI locations near cities (like Auroville) and accept seasonal backup rather than locating in remote high-DNI deserts.',
      checkQuestion: 'Location A has DNI of 6 kWh/m^2/day and Location B has DNI of 4 kWh/m^2/day. If the dish costs the same at both locations, which produces more energy per dollar?',
      checkAnswer: 'Location A produces 50% more energy (6/4 = 1.5x). Since the dish cost is the same, the cost per kWh at Location A is 33% lower. However, if Location A is remote and food must be transported, the total cost may favour Location B if it is near the consumers. Energy cost must be balanced against logistics cost.',
      codeIntro: 'Compare solar resources across India and find optimal solar cooking locations.',
      code: `import numpy as np

# Solar resource data for Indian cities (annual average)
cities = [
    {"name": "Jodhpur (Rajasthan)", "lat": 26.3, "dni_kwh_m2_day": 6.2, "ghi": 5.8, "cloud_months": 2},
    {"name": "Jaisalmer (Thar)", "lat": 26.9, "dni_kwh_m2_day": 6.5, "ghi": 6.0, "cloud_months": 1},
    {"name": "Auroville (Tamil Nadu)", "lat": 12.0, "dni_kwh_m2_day": 5.0, "ghi": 5.4, "cloud_months": 4},
    {"name": "Bangalore", "lat": 12.9, "dni_kwh_m2_day": 5.3, "ghi": 5.5, "cloud_months": 3},
    {"name": "Mumbai", "lat": 19.1, "dni_kwh_m2_day": 4.2, "ghi": 5.0, "cloud_months": 5},
    {"name": "Delhi", "lat": 28.6, "dni_kwh_m2_day": 5.0, "ghi": 5.2, "cloud_months": 3},
    {"name": "Kolkata", "lat": 22.6, "dni_kwh_m2_day": 3.8, "ghi": 4.5, "cloud_months": 5},
    {"name": "Leh (Ladakh)", "lat": 34.2, "dni_kwh_m2_day": 6.8, "ghi": 5.5, "cloud_months": 1},
    {"name": "Coimbatore", "lat": 11.0, "dni_kwh_m2_day": 5.4, "ghi": 5.6, "cloud_months": 3},
    {"name": "Hyderabad", "lat": 17.4, "dni_kwh_m2_day": 5.5, "ghi": 5.6, "cloud_months": 3},
]

# Calculate solar cooking potential for each city
dish_area = 176.7  # m^2 (15m dish)
system_eff = 0.56

print("=== Solar Cooking Potential Across India ===")
print(f"Dish: 15m diameter ({dish_area:.0f} m^2) | System efficiency: {system_eff:.0%}")
print()

header = "City                    DNI    Meals/Day  Annual Meals  Solar%  Rank"
print(header)
print("-" * 75)

results = []
for city in cities:
    # Daily cooking energy (kWh)
    daily_energy = city["dni_kwh_m2_day"] * dish_area * system_eff
    daily_meals = daily_energy / 0.5  # 0.5 kWh per meal

    # Annual accounting for cloud months
    clear_months = 12 - city["cloud_months"]
    cloud_meals_factor = 0.35  # 35% output during cloud months
    annual_meals = (daily_meals * clear_months * 30 +
                    daily_meals * cloud_meals_factor * city["cloud_months"] * 30)
    annual_demand = 1000 * 365
    solar_pct = annual_meals / annual_demand * 100

    results.append((city["name"], city["dni_kwh_m2_day"], daily_meals, annual_meals, solar_pct))

# Sort by solar percentage
results.sort(key=lambda x: -x[4])

for rank, (name, dni, meals, annual, pct) in enumerate(results, 1):
    print(f"{name:<24} {dni:>4.1f}  {meals:>8.0f}    {annual:>11,.0f}    {pct:>4.0f}%    {rank}")

print()
print("=== Cost-Benefit Analysis ===")
print("(Dish cost: $100,000 | Lifetime: 25 years)")
print()

dish_cost = 100000
lifetime = 25

for name, dni, meals, annual, pct in results[:5]:
    total_meals = annual * lifetime
    cost_per_meal = dish_cost / total_meals
    lpg_saved = annual * 0.5 * 0.08 * lifetime  # $0.08/kWh LPG
    payback = dish_cost / (annual * 0.5 * 0.08)
    print(f"  {name}:")
    print(f"    Cost per solar meal: \{cost_per_meal:.3f}")
    print(f"    LPG savings (25yr): \{lpg_saved:,.0f}")
    print(f"    Payback period: {payback:.1f} years")
    print()`,
      challenge: 'Add population weighting: multiply solar potential by nearby population (meals needed). A city with moderate DNI but large population might be a better location than a desert with high DNI but few people. Find the top 3 locations when optimizing for total population served rather than per-dish output.',
      successHint: 'You just performed a solar resource assessment — the standard first step for any solar energy project. The same analysis is used by solar farm developers, government energy planners, and NGOs deploying solar cooking in developing countries. Location selection determines whether a solar project succeeds or fails.',
    },
    {
      title: 'Wind effects and structural design of the dish',
      concept: `A 15-metre parabolic dish is essentially a giant sail. Wind forces on the dish can be enormous — a cyclone at 200 km/h creates forces of several tons, enough to tear the dish from its mounts. The structural design must handle wind from any direction, including uplift (wind under the dish).

The wind force depends on the dish's orientation relative to the wind: facing the wind (maximum force), edge-on (minimum force), and face-down (the "stow" position used during storms). The tracking system must be able to move the dish to the stow position quickly when wind speed exceeds a safe threshold.

In the code below, you will calculate wind forces on the Auroville dish at various orientations and wind speeds, and design the structural support system to resist these forces.

*Large solar concentrators are among the most wind-sensitive structures ever built. The Green Bank Telescope (100m dish) was destroyed by wind-induced fatigue in 1988. Modern dish designs use wind sensors and automatic stowing to prevent wind damage.*`,
      analogy: 'Hold an open umbrella in the wind. Face it into the wind and it nearly pulls out of your hand (maximum drag). Turn it sideways and the force drops dramatically. Close and point it into the wind and the force is minimal. The parabolic dish behaves exactly the same way — orientation matters enormously.',
      storyConnection: 'Auroville is in a cyclone-prone zone. The dish is designed to stow face-down in under 2 minutes when the anemometer measures sustained winds above 60 km/h. During Cyclone Thane (2011), the dish was stowed successfully and survived intact while other structures around Auroville suffered major damage.',
      checkQuestion: 'If wind force is proportional to v^2, and the dish can handle 80 km/h winds while tracking, at what wind speed must it stow if the stow position reduces force by 90%?',
      checkAnswer: 'In stow position, force is 10% of tracking position. So stowed force at speed v equals tracking force at v_track when: 0.10 * v^2 = v_track^2. This means v = v_track * sqrt(10) = 80 * 3.16 = 253 km/h. The stow position allows the dish to survive winds of 253 km/h — well above most cyclones. This is why stowing is so effective.',
      codeIntro: 'Analyse wind loads on the parabolic dish and design the stow strategy.',
      code: `import numpy as np

def dish_wind_force(wind_speed_kmh, dish_diameter_m, orientation="facing"):
    """Calculate wind force on parabolic dish.
    orientation: "facing" (max), "edge" (min), "stow" (face down)
    """
    v = wind_speed_kmh / 3.6  # m/s
    rho = 1.225  # kg/m^3
    area = np.pi * (dish_diameter_m / 2) ** 2

    Cd = {"facing": 1.3, "edge": 0.1, "stow": 0.15, "back": 0.8}
    drag_coeff = Cd.get(orientation, 1.0)

    F = 0.5 * rho * v ** 2 * drag_coeff * area
    return F

dish_D = 15  # m
dish_area = np.pi * (dish_D / 2) ** 2

print("=== Wind Force on Auroville Parabolic Dish ===")
print(f"Dish diameter: {dish_D} m | Area: {dish_area:.0f} m^2")
print()

# Force vs wind speed
header = "Wind(km/h)  Facing(kN)  Edge(kN)  Stow(kN)  Category"
print(header)
print("-" * len(header))

for speed in [20, 40, 60, 80, 100, 120, 150, 180, 200, 250]:
    F_face = dish_wind_force(speed, dish_D, "facing")
    F_edge = dish_wind_force(speed, dish_D, "edge")
    F_stow = dish_wind_force(speed, dish_D, "stow")
    cat = ("Normal" if speed < 50 else "Stow recommended" if speed < 80
           else "Must stow" if speed < 120 else "Cyclone")
    print(f"{speed:>8}    {F_face/1000:>8.1f}    {F_edge/1000:>6.1f}    "
          f"{F_stow/1000:>6.1f}    {cat}")

# Overturning analysis
print()
print("=== Overturning Stability (dish on pedestal) ===")
print()

pedestal_height = 5  # m
dish_mass = 3000  # kg
counterweight = 2000  # kg at base
base_width = 4  # m

stabilizing_moment = (dish_mass + counterweight) * 9.81 * base_width / 2

for speed in [60, 80, 100, 120, 150, 200]:
    for orient in ["facing", "stow"]:
        F = dish_wind_force(speed, dish_D, orient)
        overturn_moment = F * pedestal_height
        fos = stabilizing_moment / overturn_moment if overturn_moment > 0 else float('inf')
        status = "SAFE" if fos > 2 else "MARGINAL" if fos > 1 else "TIPS OVER"
        if orient == "facing" or speed >= 120:
            print(f"  {speed:>3} km/h {orient:<7}: Overturn M = {overturn_moment/1000:.0f} kN*m  "
                  f"FOS = {fos:.2f}  [{status}]")

print()
print(f"Stabilizing moment: {stabilizing_moment/1000:.0f} kN*m")
print(f"The dish MUST stow above 80 km/h to prevent overturning.")

# Stow time requirement
print()
print("=== Stow Time Calculation ===")
rotation_speed = 2  # degrees per second
facing_to_stow = 90  # degrees (face horizontal to face down)
stow_time = facing_to_stow / rotation_speed
print(f"Rotation needed: {facing_to_stow} degrees")
print(f"Motor speed: {rotation_speed} deg/s")
print(f"Stow time: {stow_time:.0f} seconds ({stow_time/60:.1f} minutes)")`,
      challenge: 'Add dynamic wind loading: real wind has gusts that can be 30-50% stronger than sustained wind. Model gust factors and calculate the peak force during a gust. Determine if the dish foundation can handle the 3-second peak gust at design wind speed.',
      successHint: 'You performed a wind load and stability analysis for a large solar structure. The same calculations apply to satellite dishes, radar antennas, wind turbines, and any large structure exposed to wind. Wind engineering is a critical speciality that combines fluid dynamics, structural mechanics, and meteorology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Solar tracking, seasonal variation, and thermal storage</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model solar tracking, seasonal performance, thermal storage, and structural design.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
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
