import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project design — architecture of a weather forecast dashboard',
      concept: `In Level 3, you learned the physics of clouds, precipitation, fronts, monsoons, and the limits of weather prediction. Now you build something real: a **Weather Forecast Dashboard** that processes historical weather data, makes statistical forecasts, predicts monsoon onset, and visualizes everything in a multi-panel display.

**Dashboard architecture:**
1. **Data layer**: Historical weather observations — temperature, humidity, pressure, rainfall — stored as structured arrays. We simulate realistic Assam weather data with proper seasonal cycles, monsoon onset, and day-to-day variability.
2. **Processing layer**: Clean data, compute derived quantities (dew point, heat index, pressure tendency), detect anomalies.
3. **Forecast layer**: Three models of increasing sophistication — persistence (tomorrow = today), climatological average (use the historical mean for this date), and linear regression (use pressure and humidity trends to predict rainfall).
4. **Monsoon layer**: A specialized model that uses sea surface temperature (SST) and pressure gradient data to predict the monsoon onset date for Assam.
5. **Visualization layer**: Multi-panel dashboard with time series, distributions, and forecast skill metrics.

This is the same architecture used by real weather services, scaled down to run in a browser.`,
      analogy: 'Building a weather dashboard is like building a car. The data layer is the fuel system (raw input). The processing layer is the engine (transforms fuel into motion). The forecast layer is the navigation system (predicts where you are going). The visualization layer is the dashboard/windshield (shows you everything at a glance). Each component is useless without the others.',
      storyConnection: 'The boy who talked to clouds did his forecasting by looking at the sky, feeling the wind, and checking the river level. Our dashboard automates this: temperature sensors replace his skin, barometers replace his sense of humidity, and algorithms replace his pattern-matching intuition. But the goal is the same — predict whether it will rain tomorrow and whether the monsoon will arrive on time.',
      checkQuestion: 'Why do we need three different forecast models (persistence, climatology, regression) instead of just using the best one?',
      checkAnswer: 'Each model serves a different purpose. Persistence is the baseline — any useful forecast must beat "tomorrow = today." Climatology captures seasonal patterns that persistence misses. Regression uses recent trends to make short-term predictions. By comparing all three, you learn which situations favor which approach. In reality, the best forecasts blend multiple models (ensemble averaging). Also, simpler models are easier to understand and debug — essential when a forecast goes wrong.',
      codeIntro: 'Generate a full year of realistic synthetic weather data for Guwahati, Assam, with proper monsoon seasonality.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 365 days of synthetic Guwahati weather data
days = np.arange(365)
day_of_year = days + 1

# --- Temperature (°C) ---
# Seasonal cycle: cool winter, hot pre-monsoon, moderate monsoon
temp_seasonal = 18 + 10 * np.sin(2 * np.pi * (days - 100) / 365)
# Monsoon cooling (clouds reduce daytime temp)
monsoon_mask = (days >= 150) & (days <= 270)  # June-September
temp_seasonal[monsoon_mask] -= 3
# Daily variability
temp = temp_seasonal + np.random.randn(365) * 2.5

# --- Relative Humidity (%) ---
humidity_seasonal = 55 + 25 * np.sin(2 * np.pi * (days - 60) / 365)
humidity_seasonal[monsoon_mask] += 15  # monsoon boost
humidity = np.clip(humidity_seasonal + np.random.randn(365) * 5, 30, 99)

# --- Pressure (hPa) ---
# Lower during monsoon (monsoon trough)
pressure_seasonal = 1012 - 6 * np.sin(2 * np.pi * (days - 60) / 365)
pressure_seasonal[monsoon_mask] -= 4
pressure = pressure_seasonal + np.random.randn(365) * 2

# --- Rainfall (mm) ---
# Highly seasonal: dry winter, heavy monsoon
rain_probability = 0.1 + 0.6 * np.clip((humidity - 70) / 30, 0, 1)
rain_occurs = np.random.rand(365) < rain_probability
rain_intensity = np.random.exponential(scale=15, size=365)
# Boost monsoon rain
rain_intensity[monsoon_mask] *= 2.5
rainfall = np.where(rain_occurs, rain_intensity, 0)
rainfall = np.clip(rainfall, 0, 150)  # cap at 150 mm/day

# --- Derived: Dew point (Magnus formula approximation) ---
a, b = 17.27, 237.7
alpha = (a * temp) / (b + temp) + np.log(humidity / 100)
dew_point = (b * alpha) / (a - alpha)

# --- Derived: Pressure tendency (3-hour proxy: day-to-day change) ---
pressure_tendency = np.diff(pressure, prepend=pressure[0])

# Store as structured data
print("WEATHER DATA GENERATOR — Guwahati, Assam (Synthetic)")
print("=" * 60)
print(f"Period: Day 1 (Jan 1) to Day 365 (Dec 31)")
print(f"Variables: temperature, humidity, pressure, rainfall,")
print(f"           dew_point, pressure_tendency")
print()

# Summary statistics by season
seasons = {
    'Winter (Dec-Feb)': list(range(335, 365)) + list(range(0, 59)),
    'Pre-monsoon (Mar-May)': list(range(59, 152)),
    'Monsoon (Jun-Sep)': list(range(152, 274)),
    'Post-monsoon (Oct-Nov)': list(range(274, 335)),
}

print(f"{'Season':<25} {'Temp °C':>10} {'Humid %':>10} {'Press hPa':>10} {'Rain mm':>10}")
print("-" * 68)
for name, idx in seasons.items():
    print(f"{name:<25} {np.mean(temp[idx]):>10.1f} {np.mean(humidity[idx]):>10.1f} "
          f"{np.mean(pressure[idx]):>10.1f} {np.sum(rainfall[idx]):>10.0f}")

print(f"{'Annual':.<25} {np.mean(temp):>10.1f} {np.mean(humidity):>10.1f} "
      f"{np.mean(pressure):>10.1f} {np.sum(rainfall):>10.0f}")

# Visualize the raw data
fig, axes = plt.subplots(4, 1, figsize=(14, 12), sharex=True)
fig.patch.set_facecolor('#1f2937')

months_ticks = [0, 31, 59, 90, 120, 152, 182, 213, 244, 274, 305, 335]
month_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    # Shade monsoon season
    ax.axvspan(152, 274, alpha=0.08, color='#3b82f6')

# Temperature
axes[0].plot(days, temp, color='#ef4444', linewidth=0.8, alpha=0.7)
axes[0].plot(days, temp_seasonal, color='#ef4444', linewidth=2, label='Seasonal mean')
axes[0].set_ylabel('Temperature (°C)', color='white')
axes[0].set_title('Synthetic Guwahati Weather Data — 1 Year', color='white', fontsize=14)
axes[0].legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Humidity
axes[1].plot(days, humidity, color='#22c55e', linewidth=0.8, alpha=0.7)
axes[1].plot(days, humidity_seasonal, color='#22c55e', linewidth=2)
axes[1].set_ylabel('Humidity (%)', color='white')

# Pressure
axes[2].plot(days, pressure, color='#3b82f6', linewidth=0.8, alpha=0.7)
axes[2].plot(days, pressure_seasonal, color='#3b82f6', linewidth=2)
axes[2].set_ylabel('Pressure (hPa)', color='white')

# Rainfall
axes[3].bar(days, rainfall, color='#a855f7', alpha=0.7, width=1)
axes[3].set_ylabel('Rainfall (mm)', color='white')
axes[3].set_xlabel('Day of year', color='white')

for ax in axes:
    ax.set_xticks(months_ticks)
    ax.set_xticklabels(month_labels, color='gray')

plt.tight_layout()
plt.show()

print()
print(f"Total annual rainfall: {np.sum(rainfall):.0f} mm")
print(f"Monsoon rainfall:      {np.sum(rainfall[152:274]):.0f} mm "
      f"({np.sum(rainfall[152:274])/np.sum(rainfall)*100:.0f}% of annual)")
print(f"Rain days: {np.sum(rain_occurs)} out of 365 ({np.sum(rain_occurs)/365*100:.0f}%)")
print()
print("Data stored in arrays: temp, humidity, pressure, rainfall,")
print("dew_point, pressure_tendency — ready for analysis and forecasting.")`,
      challenge: 'Add wind speed and wind direction to the synthetic data. Wind should be predominantly from the southwest during monsoon (180-270 degrees) and from the northeast during winter (0-90 degrees). Add it as a fifth panel in the visualization.',
      successHint: 'You now have a complete synthetic dataset that captures the key features of Assam weather: hot pre-monsoon, cool monsoon with heavy rain, dry winter. Every number is physically plausible because we built it from the atmospheric physics you learned in Level 3.',
    },
    {
      title: 'Data processing — cleaning, quality control, and derived variables',
      concept: `Real weather data is messy. Sensors malfunction, readings are missing, units get mixed up, and outliers appear. Before any analysis or forecasting, you must **clean and process** the data.

**Quality control checks:**
1. **Range checks**: Temperature in Assam should never be -20 °C or +55 °C. Humidity is 0-100%. Pressure is 950-1050 hPa. Flag anything outside physical limits.
2. **Temporal consistency**: If temperature jumps 20 °C in one hour, something is wrong. Use rate-of-change limits.
3. **Spatial consistency**: If Guwahati reports 5 °C while all neighboring stations report 25 °C, Guwahati's reading is suspect.
4. **Persistence check**: If a sensor reports the exact same value for 24 hours, it is likely stuck.

**Derived variables:**
Raw observations are not always the most useful quantities:
- **Dew point**: Calculated from temperature and humidity. Tells you how close the air is to saturation.
- **Heat index**: Combines temperature and humidity into "feels like" temperature. Critical for heat wave warnings.
- **Pressure tendency**: The 3-hour change in pressure. Falling pressure warns of approaching bad weather; rising pressure signals clearing.
- **Growing degree days**: Accumulated heat above a threshold (e.g., 10 °C). Used by farmers to predict crop maturity.

**Handling missing data:**
- **Linear interpolation**: Fill short gaps (1-2 hours) by drawing a line between known values.
- **Climatological fill**: Replace long gaps with the historical average for that date/time.
- **Leave as NaN**: For analysis that cannot tolerate imputed values (e.g., extreme event detection).`,
      analogy: 'Data processing is like preparing ingredients before cooking. A chef does not toss unwashed vegetables straight into the pot — they wash, trim, peel, and cut first. A bad ingredient (spoiled data point) ruins the entire dish (forecast). Quality control is the chef inspecting each ingredient before it goes in.',
      storyConnection: 'The India Meteorological Department operates weather stations across Assam — Guwahati, Tezpur, Dibrugarh, Silchar. Each station transmits data hourly. But during the monsoon, power outages and communication failures are common. Processing this data reliably — filling gaps without introducing artifacts — is essential for the flood forecasting that protects millions of people in the Brahmaputra floodplain.',
      checkQuestion: 'A weather station reports humidity of 105% and temperature of 32 °C at the same timestamp. The previous hour showed 94% and 31 °C. How should you handle this?',
      checkAnswer: 'Humidity cannot exceed 100% — this is a sensor error. The simplest fix: cap at 100% (physical limit). Better: interpolate between the previous valid reading (94%) and the next valid reading. Do NOT delete the entire record — the temperature of 32 °C is probably fine. Flag the humidity as quality-controlled so downstream analysis knows it was adjusted. Always keep the original raw value stored separately.',
      codeIntro: 'Implement a full data processing pipeline: inject realistic errors into our synthetic data, detect them, clean them, and compute derived variables.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Re-generate base data (same as project design)
days = np.arange(365)
temp_seasonal = 18 + 10 * np.sin(2 * np.pi * (days - 100) / 365)
monsoon_mask = (days >= 150) & (days <= 270)
temp_seasonal[monsoon_mask] -= 3
temp_clean = temp_seasonal + np.random.randn(365) * 2.5

humidity_seasonal = 55 + 25 * np.sin(2 * np.pi * (days - 60) / 365)
humidity_seasonal[monsoon_mask] += 15
humidity_clean = np.clip(humidity_seasonal + np.random.randn(365) * 5, 30, 99)

pressure_seasonal = 1012 - 6 * np.sin(2 * np.pi * (days - 60) / 365)
pressure_seasonal[monsoon_mask] -= 4
pressure_clean = pressure_seasonal + np.random.randn(365) * 2

# --- Step 1: Inject realistic errors ---
temp_dirty = temp_clean.copy()
humidity_dirty = humidity_clean.copy()
pressure_dirty = pressure_clean.copy()

# Spike errors (sensor glitches)
spike_days = [45, 120, 200, 310]
temp_dirty[spike_days] = [-15, 55, 48, -8]  # impossible values

# Humidity exceeding 100%
humidity_dirty[[160, 170, 180]] = [105, 112, 103]

# Missing data (NaN)
missing_days = [80, 81, 82, 83, 84, 250, 251, 252]
temp_dirty[missing_days] = np.nan
pressure_dirty[missing_days] = np.nan

# Stuck sensor (same value repeated)
pressure_dirty[130:138] = 1010.0  # 8 days stuck

print("DATA QUALITY CONTROL PIPELINE")
print("=" * 55)
print(f"Injected errors:")
print(f"  Temperature spikes: days {spike_days}")
print(f"  Humidity > 100%: days [160, 170, 180]")
print(f"  Missing data (NaN): days {missing_days}")
print(f"  Stuck pressure sensor: days 130-137")
print()

# --- Step 2: Detect errors ---
def detect_range_errors(data, vmin, vmax, name):
    """Flag values outside physical range."""
    errors = np.where((data < vmin) | (data > vmax))[0]
    errors = errors[~np.isnan(data[errors])]  # exclude NaN
    return errors

def detect_stuck_sensor(data, window=5):
    """Detect constant values over a window (stuck sensor)."""
    stuck = []
    for i in range(len(data) - window):
        segment = data[i:i+window]
        if not np.any(np.isnan(segment)) and np.std(segment) < 0.01:
            stuck.extend(range(i, i+window))
    return sorted(set(stuck))

def detect_spikes(data, threshold=3):
    """Detect values more than threshold std from rolling mean."""
    spikes = []
    for i in range(2, len(data) - 2):
        if np.isnan(data[i]):
            continue
        neighbors = [data[j] for j in range(i-2, i+3) if j != i and not np.isnan(data[j])]
        if len(neighbors) >= 2:
            local_mean = np.mean(neighbors)
            local_std = max(np.std(neighbors), 1.0)
            if abs(data[i] - local_mean) > threshold * local_std:
                spikes.append(i)
    return spikes

temp_range = detect_range_errors(temp_dirty, -5, 48, 'temp')
humidity_range = detect_range_errors(humidity_dirty, 0, 100, 'humidity')
pressure_stuck = detect_stuck_sensor(pressure_dirty)
temp_spikes = detect_spikes(temp_dirty)

print("Detected errors:")
print(f"  Temperature out of range [-5, 48°C]: {list(temp_range)}")
print(f"  Temperature spikes: {temp_spikes}")
print(f"  Humidity out of range [0, 100%]: {list(humidity_range)}")
print(f"  Pressure stuck sensor: {pressure_stuck[:8]}...")
print(f"  Missing values (temp): {list(np.where(np.isnan(temp_dirty))[0])}")
print()

# --- Step 3: Clean data ---
temp_processed = temp_dirty.copy()
humidity_processed = humidity_dirty.copy()
pressure_processed = pressure_dirty.copy()

# Fix range errors and spikes: replace with interpolated values
for idx in list(temp_range) + temp_spikes:
    temp_processed[idx] = np.nan  # mark for interpolation

# Clamp humidity
humidity_processed = np.clip(humidity_processed, 0, 100)

# Fix stuck sensor: mark as NaN for interpolation
for idx in pressure_stuck:
    pressure_processed[idx] = np.nan

# Interpolate all NaN values
def interpolate_nans(data):
    nans = np.isnan(data)
    if not np.any(nans):
        return data
    x = np.arange(len(data))
    data[nans] = np.interp(x[nans], x[~nans], data[~nans])
    return data

temp_processed = interpolate_nans(temp_processed)
humidity_processed = interpolate_nans(humidity_processed)
pressure_processed = interpolate_nans(pressure_processed)

# --- Step 4: Compute derived variables ---
# Dew point (Magnus formula)
a, b = 17.27, 237.7
alpha = (a * temp_processed) / (b + temp_processed) + np.log(humidity_processed / 100)
dew_point = (b * alpha) / (a - alpha)

# Heat index (simplified Rothfusz formula for T > 27°C, RH > 40%)
hi = temp_processed.copy()
hot = temp_processed > 27
hi[hot] = (-8.785 + 1.611 * temp_processed[hot] + 2.339 * humidity_processed[hot]
           - 0.01461 * temp_processed[hot]**2 - 0.01231 * humidity_processed[hot]**2
           - 0.02354 * temp_processed[hot] * humidity_processed[hot]
           + 0.0002 * temp_processed[hot]**2 * humidity_processed[hot]
           + 0.0009 * temp_processed[hot] * humidity_processed[hot]**2
           - 0.0000036 * temp_processed[hot]**2 * humidity_processed[hot]**2)

# Pressure tendency (day-to-day change)
pressure_tendency = np.diff(pressure_processed, prepend=pressure_processed[0])

print("Derived variables computed:")
print(f"  Dew point: range [{np.nanmin(dew_point):.1f}, {np.nanmax(dew_point):.1f}] °C")
print(f"  Heat index: max {np.nanmax(hi):.1f} °C (feels-like temperature)")
print(f"  Pressure tendency: range [{np.nanmin(pressure_tendency):.1f}, {np.nanmax(pressure_tendency):.1f}] hPa/day")
print()

# --- Visualization ---
fig, axes = plt.subplots(3, 2, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Before/after temperature
axes[0, 0].plot(days, temp_dirty, color='#ef4444', linewidth=0.8, alpha=0.5, label='Raw (with errors)')
axes[0, 0].plot(days, temp_processed, color='#22c55e', linewidth=1, label='Cleaned')
for idx in list(temp_range) + temp_spikes:
    axes[0, 0].axvline(x=idx, color='#f59e0b', alpha=0.3, linewidth=0.5)
axes[0, 0].set_ylabel('Temperature (°C)', color='white')
axes[0, 0].set_title('Temperature: Before & After QC', color='white', fontsize=11)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Before/after pressure
axes[0, 1].plot(days, pressure_dirty, color='#3b82f6', linewidth=0.8, alpha=0.5, label='Raw')
axes[0, 1].plot(days, pressure_processed, color='#22c55e', linewidth=1, label='Cleaned')
axes[0, 1].set_ylabel('Pressure (hPa)', color='white')
axes[0, 1].set_title('Pressure: Stuck Sensor Fixed', color='white', fontsize=11)
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Dew point vs temperature
axes[1, 0].plot(days, temp_processed, color='#ef4444', linewidth=1, alpha=0.7, label='Temperature')
axes[1, 0].plot(days, dew_point, color='#3b82f6', linewidth=1, alpha=0.7, label='Dew point')
axes[1, 0].fill_between(days, dew_point, temp_processed, alpha=0.1, color='#22c55e')
axes[1, 0].set_ylabel('°C', color='white')
axes[1, 0].set_title('Temperature vs Dew Point (gap = dryness)', color='white', fontsize=11)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Heat index
axes[1, 1].plot(days, temp_processed, color='#3b82f6', linewidth=1, alpha=0.7, label='Actual temp')
axes[1, 1].plot(days, hi, color='#ef4444', linewidth=1, alpha=0.7, label='Heat index (feels like)')
axes[1, 1].fill_between(days, temp_processed, hi, where=hi > temp_processed,
                          alpha=0.2, color='#ef4444', label='Heat stress')
axes[1, 1].set_ylabel('°C', color='white')
axes[1, 1].set_title('Heat Index — Humidity Makes It Feel Hotter', color='white', fontsize=11)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Pressure tendency histogram
axes[2, 0].hist(pressure_tendency, bins=30, color='#a855f7', alpha=0.7, edgecolor='white', linewidth=0.3)
axes[2, 0].axvline(x=0, color='white', linestyle='--', alpha=0.3)
axes[2, 0].axvline(x=-3, color='#ef4444', linestyle='--', alpha=0.7, label='Rapid fall (storm)')
axes[2, 0].axvline(x=3, color='#22c55e', linestyle='--', alpha=0.7, label='Rapid rise (clearing)')
axes[2, 0].set_xlabel('Pressure change (hPa/day)', color='white')
axes[2, 0].set_ylabel('Count', color='white')
axes[2, 0].set_title('Pressure Tendency Distribution', color='white', fontsize=11)
axes[2, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# QC summary
qc_stats = {
    'Range errors': len(temp_range) + len(list(np.where((humidity_dirty < 0) | (humidity_dirty > 100))[0])),
    'Spike errors': len(temp_spikes),
    'Missing values': len(missing_days),
    'Stuck sensor': len(set(pressure_stuck)),
}
bars = axes[2, 1].bar(qc_stats.keys(), qc_stats.values(),
                        color=['#ef4444', '#f59e0b', '#3b82f6', '#a855f7'], alpha=0.8)
axes[2, 1].set_ylabel('Count', color='white')
axes[2, 1].set_title('Errors Detected & Fixed', color='white', fontsize=11)
for bar, val in zip(bars, qc_stats.values()):
    axes[2, 1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                     str(val), ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("QC Summary:")
total_errors = sum(qc_stats.values())
print(f"  Total errors detected: {total_errors}")
print(f"  Total data points: {365 * 3} (3 variables x 365 days)")
print(f"  Error rate: {total_errors / (365*3) * 100:.1f}%")
print(f"  All errors fixed by interpolation and clamping.")`,
      challenge: 'Add a "growing degree days" calculation. Use a base temperature of 10 °C (common for rice). Compute the cumulative growing degree days over the year and plot it. When does it reach 2500 GDD (approximate requirement for rice maturity)? How does this relate to Assam\'s rice growing season?',
      successHint: 'Data quality control is unglamorous but essential. In real weather services, automated QC catches about 90% of errors, but the remaining 10% require human review. A single bad data point that passes QC can ruin a forecast or trigger a false flood warning.',
    },
    {
      title: 'Statistical forecasting — three baselines every forecaster must beat',
      concept: `Before deploying any fancy machine learning model, you must establish **baselines** — simple forecast methods that set the minimum bar for skill. If your complex model cannot beat a simple baseline, it is adding complexity without value.

**1. Persistence forecast ("tomorrow = today"):**
The simplest possible forecast. If it is 30 °C today, predict 30 °C tomorrow. For rainfall: if it rained today, predict rain tomorrow. Persistence works well for 1-2 day forecasts because weather changes slowly. It fails for longer horizons and at season transitions.

**2. Climatological forecast ("use the historical average"):**
For any date, predict the long-term average for that date. Example: the average July 15 temperature in Guwahati is 29.5 °C — predict that every year. Climatology captures the seasonal cycle perfectly but misses day-to-day variations. It is the baseline for seasonal forecasts.

**3. Linear regression forecast:**
Use recent observations to predict the next value. For example: if pressure has been falling for 3 days and humidity has been rising, predict rain tomorrow. Regression captures trends and relationships between variables. It is better than persistence or climatology for 1-5 day forecasts when conditions are changing.

**Forecast verification metrics:**
- **MAE** (Mean Absolute Error): average of |forecast - observed|. Easy to interpret.
- **RMSE** (Root Mean Squared Error): penalizes large errors more than MAE.
- **Skill score**: (1 - MAE_model / MAE_reference) x 100%. Positive = better than reference; 0 = no better; negative = worse.`,
      analogy: 'Baselines are like par in golf. Par is the expected number of strokes for a hole. Beating par means you played well. In forecasting, persistence and climatology are "par." Your model must score under par (lower error) to be considered useful. A model that shoots double-bogey on every hole is worse than useless, no matter how complex it is.',
      storyConnection: 'Assam\'s farmers have used climatological forecasting for centuries — they know the monsoon arrives around early June and plant rice accordingly. Their "persistence forecast" is reading today\'s sky to predict tomorrow\'s weather. Any modern forecast system that serves the Brahmaputra Valley must demonstrably beat these traditional baselines to earn farmers\' trust.',
      checkQuestion: 'A new ML model predicts Guwahati temperature with an MAE of 2.1 °C. The persistence forecast has an MAE of 2.3 °C. Is the ML model useful?',
      checkAnswer: 'Barely. The skill score is (1 - 2.1/2.3) x 100% = 8.7% — only 8.7% better than the trivial "tomorrow = today" forecast. For the added complexity, computational cost, and maintenance burden of an ML model, this marginal improvement may not be worth it. A useful forecast model should show at least 15-20% improvement over persistence. The ML model might be overfitting or missing important features.',
      codeIntro: 'Implement all three baseline forecast methods, evaluate them rigorously, and visualize where each one succeeds and fails.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate data (same as before)
days = np.arange(365)
temp_seasonal = 18 + 10 * np.sin(2 * np.pi * (days - 100) / 365)
monsoon_mask = (days >= 150) & (days <= 270)
temp_seasonal[monsoon_mask] -= 3
temp = temp_seasonal + np.random.randn(365) * 2.5

humidity_seasonal = 55 + 25 * np.sin(2 * np.pi * (days - 60) / 365)
humidity_seasonal[monsoon_mask] += 15
humidity = np.clip(humidity_seasonal + np.random.randn(365) * 5, 30, 99)

pressure_seasonal = 1012 - 6 * np.sin(2 * np.pi * (days - 60) / 365)
pressure_seasonal[monsoon_mask] -= 4
pressure = pressure_seasonal + np.random.randn(365) * 2

rain_prob = 0.1 + 0.6 * np.clip((humidity - 70) / 30, 0, 1)
rain_occurs = np.random.rand(365) < rain_prob
rain_intensity = np.random.exponential(scale=15, size=365)
rain_intensity[monsoon_mask] *= 2.5
rainfall = np.where(rain_occurs, rain_intensity, 0)
rainfall = np.clip(rainfall, 0, 150)

# --- Forecast methods ---
# Use first 200 days for "training", last 165 for evaluation
train_end = 200
eval_days = np.arange(train_end, 365)

# 1. PERSISTENCE: forecast(day) = observed(day-1)
temp_persistence = temp[eval_days - 1]
rain_persistence = rainfall[eval_days - 1]

# 2. CLIMATOLOGY: forecast(day) = mean of that day from "historical" data
# Use seasonal curve as proxy for multi-year climatology
temp_climatology = temp_seasonal[eval_days]
# For rainfall, use smoothed probability
rain_clim_rate = np.convolve(rain_prob, np.ones(15)/15, mode='same')
rain_climatology = rain_clim_rate[eval_days] * np.mean(rainfall[rainfall > 0])

# 3. LINEAR REGRESSION: use previous 3 days of temp, humidity, pressure
def regression_forecast(target, predictors_list, train_end, lookback=3):
    """Simple multivariate linear regression for 1-day-ahead forecast."""
    # Build training data
    X_train, y_train = [], []
    for i in range(lookback, train_end):
        features = []
        for pred in predictors_list:
            for lag in range(1, lookback + 1):
                features.append(pred[i - lag])
        X_train.append(features)
        y_train.append(target[i])

    X_train = np.array(X_train)
    y_train = np.array(y_train)

    # Solve normal equation: w = (X^T X)^-1 X^T y
    X_b = np.column_stack([X_train, np.ones(len(X_train))])
    w = np.linalg.lstsq(X_b, y_train, rcond=None)[0]

    # Generate forecasts for eval period
    forecasts = []
    for i in eval_days:
        features = []
        for pred in predictors_list:
            for lag in range(1, lookback + 1):
                features.append(pred[i - lag])
        features.append(1)  # bias
        forecasts.append(np.dot(features, w))

    return np.array(forecasts)

temp_regression = regression_forecast(temp, [temp, humidity, pressure], train_end)
rain_regression = regression_forecast(rainfall, [rainfall, humidity, pressure], train_end)
rain_regression = np.clip(rain_regression, 0, None)  # no negative rain

# --- Evaluation ---
def compute_metrics(observed, forecast, name, reference=None):
    mae = np.mean(np.abs(observed - forecast))
    rmse = np.sqrt(np.mean((observed - forecast)**2))
    correlation = np.corrcoef(observed, forecast)[0, 1]
    skill = None
    if reference is not None:
        mae_ref = np.mean(np.abs(observed - reference))
        skill = (1 - mae / mae_ref) * 100
    return {'name': name, 'mae': mae, 'rmse': rmse, 'corr': correlation, 'skill': skill}

temp_obs = temp[eval_days]
rain_obs = rainfall[eval_days]

temp_metrics = [
    compute_metrics(temp_obs, temp_persistence, 'Persistence'),
    compute_metrics(temp_obs, temp_climatology, 'Climatology', temp_persistence),
    compute_metrics(temp_obs, temp_regression, 'Regression', temp_persistence),
]

print("STATISTICAL FORECAST VERIFICATION")
print("=" * 65)
print(f"Evaluation period: days {train_end}-364 ({len(eval_days)} days)")
print()
print("TEMPERATURE FORECASTS:")
print(f"{'Method':<15} {'MAE (°C)':>10} {'RMSE (°C)':>10} {'Corr':>8} {'Skill vs Pers':>15}")
print("-" * 60)
for m in temp_metrics:
    skill_str = f"{m['skill']:.1f}%" if m['skill'] is not None else "baseline"
    print(f"{m['name']:<15} {m['mae']:>10.2f} {m['rmse']:>10.2f} {m['corr']:>8.3f} {skill_str:>15}")

fig, axes = plt.subplots(2, 2, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Temperature forecast comparison
ax = axes[0, 0]
ax.plot(eval_days, temp_obs, color='white', linewidth=1, alpha=0.8, label='Observed')
ax.plot(eval_days, temp_persistence, color='#ef4444', linewidth=0.8, alpha=0.5, label='Persistence')
ax.plot(eval_days, temp_climatology, color='#3b82f6', linewidth=1.5, label='Climatology')
ax.plot(eval_days, temp_regression, color='#22c55e', linewidth=0.8, alpha=0.7, label='Regression')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Temperature Forecast Comparison', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Error over time
ax = axes[0, 1]
ax.plot(eval_days, np.abs(temp_obs - temp_persistence), color='#ef4444', linewidth=0.8, alpha=0.5, label='Persistence')
ax.plot(eval_days, np.abs(temp_obs - temp_climatology), color='#3b82f6', linewidth=0.8, alpha=0.5, label='Climatology')
ax.plot(eval_days, np.abs(temp_obs - temp_regression), color='#22c55e', linewidth=0.8, alpha=0.5, label='Regression')
ax.set_ylabel('Absolute Error (°C)', color='white')
ax.set_title('Error Over Time — Which Method Fails When?', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Scatter: observed vs forecast (regression)
ax = axes[1, 0]
ax.scatter(temp_obs, temp_regression, color='#22c55e', alpha=0.4, s=20)
ax.plot([10, 35], [10, 35], '--', color='white', alpha=0.5, label='Perfect forecast')
ax.set_xlabel('Observed (°C)', color='white')
ax.set_ylabel('Forecast (°C)', color='white')
ax.set_title('Regression: Observed vs Forecast', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Skill score bar chart
ax = axes[1, 1]
methods = ['Persistence\
(baseline)', 'Climatology', 'Regression']
skills = [0] + [m['skill'] for m in temp_metrics[1:]]
colors = ['#9ca3af', '#3b82f6', '#22c55e']
bars = ax.bar(methods, skills, color=colors, alpha=0.8, edgecolor='white', linewidth=0.5)
ax.axhline(y=0, color='white', linestyle='--', alpha=0.3)
for bar, val in zip(bars, skills):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f"{val:.1f}%", ha='center', color='white', fontsize=11, fontweight='bold')
ax.set_ylabel('Skill Score vs Persistence (%)', color='white')
ax.set_title('Forecast Skill — Higher Is Better', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print()
print("Key insights:")
print(f"  Persistence MAE: {temp_metrics[0]['mae']:.2f}°C — the bar to beat")
print(f"  Regression MAE:  {temp_metrics[2]['mae']:.2f}°C — beats persistence by {temp_metrics[2]['skill']:.1f}%")
print(f"  Climatology works best at season transitions (large day-to-day changes)")
print(f"  Regression works best during stable periods (uses recent trends)")`,
      challenge: 'Extend the forecast horizon: instead of 1-day-ahead, try 3-day and 7-day forecasts. Plot how the skill score degrades with lead time for each method. At what lead time does regression become no better than climatology?',
      successHint: 'You now understand the fundamentals of forecast verification. Every weather service in the world uses these same metrics (MAE, RMSE, skill score) to evaluate their models. A forecast without verification is just a guess.',
    },
    {
      title: 'Monsoon onset predictor — forecasting Assam\'s most important date',
      concept: `For farmers, fishers, and flood managers in Assam, the most important weather forecast of the year is: **when will the monsoon arrive?** Getting this right by even a few days can save crops and lives.

**What drives monsoon onset timing?**
1. **Sea Surface Temperature (SST)**: Warmer Bay of Bengal SSTs provide more moisture fuel. Above-normal SSTs in April-May correlate with earlier onset.
2. **Land-sea pressure gradient**: The monsoon begins when the thermal low over northwest India becomes deep enough to draw moisture-laden air from the ocean. The gradient between ocean pressure and land pressure is the trigger.
3. **El Nino / La Nina**: El Nino (warm eastern Pacific) tends to delay and weaken the Indian monsoon. La Nina strengthens and advances it.
4. **Madden-Julian Oscillation (MJO)**: A 30-60 day wave of convection that circles the tropics. When an active MJO phase reaches the Indian Ocean, it can trigger monsoon onset.

**Our predictor:**
We build a simple regression model that uses April-May SST anomaly and the May pressure gradient to predict the monsoon onset date (day of year) for the northeast (Assam/Meghalaya). Historical average onset: around June 5-10 (day 156-161).

This is a real approach — IMD uses statistical models alongside NWP for their official Long Range Forecast.`,
      analogy: 'Predicting monsoon onset is like predicting when a pot of water will boil. You can measure the current temperature (SST), the heat being applied (solar heating of the land), and the lid on the pot (pressure gradient). Each measurement narrows your prediction. But just like boiling, the exact moment of onset involves a phase transition — the atmosphere "snaps" from dry to wet in just a few days.',
      storyConnection: 'The Brahmaputra Valley\'s rice farmers traditionally plant their seedlings based on the monsoon\'s expected arrival. Plant too early and the seedlings dry out; too late and the growing season is cut short. A 7-day advance warning of monsoon onset — better than the traditional "around June first week" guess — could improve yields for millions of farming families across Assam.',
      checkQuestion: 'An El Nino event is developing in the Pacific during April. Bay of Bengal SSTs are 0.5 °C below normal. What would you predict for the monsoon onset date in Assam, and why?',
      checkAnswer: 'Predict a delayed onset, perhaps 7-14 days late (around June 15-20 instead of June 5-10). El Nino weakens the monsoon circulation by altering the Walker circulation and reducing the land-sea thermal contrast. Below-normal Bay of Bengal SSTs mean less moisture is available to fuel early monsoon convection. Both factors point to late onset. This is exactly the type of reasoning our statistical model captures with regression coefficients.',
      codeIntro: 'Build a monsoon onset predictor using synthetic historical data: SST anomalies, pressure gradients, and onset dates for 30 years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 30 years of synthetic monsoon data
n_years = 30
years = np.arange(1994, 1994 + n_years)

# April-May Bay of Bengal SST anomaly (°C, relative to normal 29°C)
sst_anomaly = np.random.randn(n_years) * 0.6  # std ~0.6°C

# May land-sea pressure gradient (hPa, higher = stronger monsoon forcing)
# Correlated with SST (warmer ocean + hotter land = bigger gradient)
pressure_gradient = 8 + 0.5 * sst_anomaly + np.random.randn(n_years) * 1.5

# El Nino index (Nino3.4 SST anomaly): positive = El Nino
enso = np.random.randn(n_years) * 0.8
# Make a few strong El Nino / La Nina years
enso[5] = 2.1   # strong El Nino
enso[15] = -1.8  # strong La Nina
enso[22] = 1.7   # moderate El Nino

# Monsoon onset day (day of year): driven by SST, pressure, ENSO + noise
# Normal onset: ~day 157 (June 6)
onset_day = (157
             - 3.0 * sst_anomaly        # warmer SST -> earlier onset
             - 1.5 * (pressure_gradient - 8)  # stronger gradient -> earlier
             + 4.0 * enso               # El Nino -> later onset
             + np.random.randn(n_years) * 3)  # weather noise

onset_day = np.round(onset_day).astype(int)

print("MONSOON ONSET PREDICTOR — Northeast India")
print("=" * 55)
print(f"Training data: {n_years} years ({years[0]}-{years[-1]})")
print(f"Mean onset: day {np.mean(onset_day):.0f} (June {np.mean(onset_day)-152:.0f})")
print(f"Range: day {np.min(onset_day)}-{np.max(onset_day)} "
      f"(May {np.min(onset_day)-121} to June {np.max(onset_day)-152})")
print()

# --- Build regression model ---
# Leave last 5 years for testing
train_n = 25
X_train = np.column_stack([sst_anomaly[:train_n], pressure_gradient[:train_n], enso[:train_n]])
y_train = onset_day[:train_n]
X_test = np.column_stack([sst_anomaly[train_n:], pressure_gradient[train_n:], enso[train_n:]])
y_test = onset_day[train_n:]

# Add bias column
X_train_b = np.column_stack([X_train, np.ones(train_n)])
X_test_b = np.column_stack([X_test, np.ones(n_years - train_n)])

# Solve: w = (X^T X)^-1 X^T y
w = np.linalg.lstsq(X_train_b, y_train, rcond=None)[0]

# Predictions
y_pred_train = X_train_b @ w
y_pred_test = X_test_b @ w

# Metrics
mae_train = np.mean(np.abs(y_train - y_pred_train))
mae_test = np.mean(np.abs(y_test - y_pred_test))
rmse_test = np.sqrt(np.mean((y_test - y_pred_test)**2))

# Climatology baseline: always predict mean onset day
clim_pred = np.full_like(y_test, np.mean(y_train), dtype=float)
mae_clim = np.mean(np.abs(y_test - clim_pred))
skill = (1 - mae_test / mae_clim) * 100

print("Model coefficients:")
print(f"  SST anomaly:       {w[0]:+.2f} days/°C (warmer = earlier)")
print(f"  Pressure gradient: {w[1]:+.2f} days/hPa (stronger = earlier)")
print(f"  ENSO index:        {w[2]:+.2f} days/unit (El Nino = later)")
print(f"  Intercept:         {w[3]:.1f} (baseline onset day)")
print()
print(f"Training MAE: {mae_train:.1f} days")
print(f"Test MAE:     {mae_test:.1f} days")
print(f"Test RMSE:    {rmse_test:.1f} days")
print(f"Climatology MAE: {mae_clim:.1f} days")
print(f"Skill vs climatology: {skill:.1f}%")
print()

fig, axes = plt.subplots(2, 2, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Historical onset dates
ax = axes[0, 0]
colors = ['#ef4444' if e > 0.5 else '#3b82f6' if e < -0.5 else '#9ca3af' for e in enso]
ax.bar(years, onset_day - 152, color=colors, alpha=0.8, edgecolor='white', linewidth=0.3)
ax.axhline(y=np.mean(onset_day) - 152, color='#22c55e', linestyle='--', linewidth=2,
           label=f'Mean onset: June {np.mean(onset_day)-152:.0f}')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Onset date (days after June 1)', color='white')
ax.set_title('Historical Monsoon Onset (red=El Nino, blue=La Nina)', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 2: Scatter — predictors vs onset
ax = axes[0, 1]
sc = ax.scatter(sst_anomaly, onset_day, c=enso, cmap='RdBu_r', s=60, edgecolors='white',
                linewidth=0.5, vmin=-2, vmax=2)
plt.colorbar(sc, ax=ax, label='ENSO index')
ax.set_xlabel('Bay of Bengal SST anomaly (°C)', color='white')
ax.set_ylabel('Onset day of year', color='white')
ax.set_title('SST vs Onset (color = ENSO)', color='white', fontsize=11)

# Panel 3: Predicted vs observed
ax = axes[1, 0]
all_pred = np.concatenate([y_pred_train, y_pred_test])
all_obs = np.concatenate([y_train, y_test])
ax.scatter(y_train, y_pred_train, color='#3b82f6', alpha=0.6, s=40, label='Train')
ax.scatter(y_test, y_pred_test, color='#ef4444', alpha=0.8, s=60, label='Test', edgecolors='white')
ax.plot([145, 175], [145, 175], '--', color='white', alpha=0.5, label='Perfect prediction')
ax.set_xlabel('Observed onset day', color='white')
ax.set_ylabel('Predicted onset day', color='white')
ax.set_title('Observed vs Predicted Onset', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 4: Test year detail
ax = axes[1, 1]
test_years = years[train_n:]
bar_width = 0.3
ax.bar(np.arange(len(test_years)) - bar_width/2, y_test - 152, bar_width,
       color='#3b82f6', label='Observed', alpha=0.8)
ax.bar(np.arange(len(test_years)) + bar_width/2, y_pred_test - 152, bar_width,
       color='#ef4444', label='Predicted', alpha=0.8)
ax.set_xticks(np.arange(len(test_years)))
ax.set_xticklabels(test_years, color='gray')
ax.set_ylabel('Days after June 1', color='white')
ax.set_title('Test Years: Observed vs Predicted Onset', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Add error annotations
for i, (obs, pred) in enumerate(zip(y_test, y_pred_test)):
    error = pred - obs
    ax.text(i, max(obs, pred) - 152 + 1, f"{error:+.0f}d",
            ha='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Test year predictions:")
for yr, obs, pred in zip(test_years, y_test, y_pred_test):
    error = pred - obs
    print(f"  {yr}: Observed June {obs-152}, Predicted June {pred-152:.0f} (error: {error:+.0f} days)")
print()
print(f"Average error: {mae_test:.1f} days — good enough to help farmers")
print(f"plan rice planting with a week's advance notice.")`,
      challenge: 'Add a leave-one-out cross-validation: for each of the 30 years, train on the other 29 and predict the held-out year. Plot the error distribution. Is the model robust or does performance depend heavily on which year is held out?',
      successHint: 'You have built a real statistical prediction system. IMD\'s actual Long Range Forecast for monsoon onset uses similar predictors (Pacific SST, pressure patterns, snow cover). The model is simple, but the physics it captures — differential heating, moisture supply, large-scale circulation — is profound.',
    },
    {
      title: 'Visualization dashboard — multi-panel weather display',
      concept: `A weather dashboard must convey complex, multi-variable information at a glance. The best dashboards follow principles from information visualization:

**Design principles for weather displays:**
1. **Overview first, details on demand**: The main view shows the big picture (trends, forecasts). Users drill down for specifics.
2. **Color encodes meaning**: Red = hot/danger, blue = cold/rain, green = normal. Never use color arbitrarily.
3. **Time is the primary axis**: Weather is a time series. Most panels share a time axis for easy cross-referencing.
4. **Show uncertainty**: A forecast without confidence bounds is misleading. Ensemble spread, probability bars, or shaded confidence intervals communicate what we do not know.
5. **Context anchors understanding**: Historical averages, records, and thresholds (e.g., flood danger level) help users interpret current values.

**Our dashboard panels:**
1. Temperature trend with forecast and confidence interval
2. Rainfall distribution (bar chart + cumulative)
3. Pressure time series with frontal passage markers
4. Humidity and dew point (monsoon readiness)
5. Forecast skill metrics (how good are our predictions?)
6. Monsoon onset probability distribution

This is the type of display that IMD and state disaster management agencies use during flood season in Assam.`,
      analogy: 'A weather dashboard is like the cockpit of an airplane. A pilot does not need to understand every instrument in detail at every moment — they scan the dashboard for anomalies (red lights, unusual readings). Normal conditions require a glance; abnormal conditions demand attention. Similarly, a weather dashboard should make normal weather boring to look at and dangerous weather impossible to miss.',
      storyConnection: 'During Assam\'s annual floods, the Central Water Commission monitors Brahmaputra river levels at stations from Dibrugarh to Dhubri. Their dashboards show real-time water levels, rainfall in the catchment, and forecasted river rise. When the boy who talked to clouds watched the river rise, he was doing manual dashboarding — integrating rainfall observations, cloud patterns, and river conditions into a mental model of flood risk.',
      checkQuestion: 'A dashboard shows the current Brahmaputra water level at Guwahati is 49.5 m, the danger level is 49.68 m, and the forecast shows the river rising at 0.1 m/hour. What action should be triggered and when?',
      checkAnswer: 'The river will reach the danger level in (49.68 - 49.5) / 0.1 = 1.8 hours. A flood warning should be issued immediately — not when the danger level is reached, but with lead time for evacuation. The dashboard should show: (1) current level as orange/warning color, (2) time-to-danger-level countdown, (3) upstream rainfall that will sustain the rise. The 1.8-hour window is tight — this is why real-time dashboards with automatic alerting are critical.',
      codeIntro: 'Build the complete multi-panel weather dashboard combining all our data, forecasts, and monsoon predictions.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec

np.random.seed(42)

# --- Regenerate all data ---
days = np.arange(365)
temp_seasonal = 18 + 10 * np.sin(2 * np.pi * (days - 100) / 365)
monsoon_mask = (days >= 150) & (days <= 270)
temp_seasonal[monsoon_mask] -= 3
temp = temp_seasonal + np.random.randn(365) * 2.5

humidity_seasonal = 55 + 25 * np.sin(2 * np.pi * (days - 60) / 365)
humidity_seasonal[monsoon_mask] += 15
humidity = np.clip(humidity_seasonal + np.random.randn(365) * 5, 30, 99)

pressure_seasonal = 1012 - 6 * np.sin(2 * np.pi * (days - 60) / 365)
pressure_seasonal[monsoon_mask] -= 4
pressure = pressure_seasonal + np.random.randn(365) * 2

rain_prob = 0.1 + 0.6 * np.clip((humidity - 70) / 30, 0, 1)
rain_occurs = np.random.rand(365) < rain_prob
rain_intensity = np.random.exponential(scale=15, size=365)
rain_intensity[monsoon_mask] *= 2.5
rainfall = np.where(rain_occurs, rain_intensity, 0)
rainfall = np.clip(rainfall, 0, 150)

# Dew point
a, b = 17.27, 237.7
alpha_dp = (a * temp) / (b + temp) + np.log(humidity / 100)
dew_point = (b * alpha_dp) / (a - alpha_dp)

# Simple forecasts (7-day ahead from "today" = day 200)
today = 200
forecast_horizon = 14
fc_days = np.arange(today + 1, today + forecast_horizon + 1)

# Regression-based forecast with uncertainty
fc_temp_mean = temp_seasonal[fc_days] + 0.5 * (temp[today] - temp_seasonal[today])
fc_temp_std = 1.5 + 0.3 * np.arange(forecast_horizon)  # growing uncertainty
fc_rain_prob = rain_prob[fc_days]

months_ticks = [0, 31, 59, 90, 120, 152, 182, 213, 244, 274, 305, 335]
month_labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

# --- BUILD DASHBOARD ---
fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('WEATHER FORECAST DASHBOARD — Guwahati, Assam', color='white',
             fontsize=18, fontweight='bold', y=0.98)

gs = GridSpec(3, 3, figure=fig, hspace=0.35, wspace=0.3)

# --- Panel 1: Temperature with forecast (large, top-left) ---
ax1 = fig.add_subplot(gs[0, :2])
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')

ax1.plot(days[:today+1], temp[:today+1], color='#ef4444', linewidth=0.8, alpha=0.8, label='Observed')
ax1.plot(days, temp_seasonal, color='#ef4444', linewidth=1.5, alpha=0.3, linestyle='--', label='Climatology')
ax1.plot(fc_days, fc_temp_mean, color='#f59e0b', linewidth=2, label='Forecast')
ax1.fill_between(fc_days, fc_temp_mean - 2*fc_temp_std, fc_temp_mean + 2*fc_temp_std,
                  alpha=0.15, color='#f59e0b', label='95% confidence')
ax1.axvline(x=today, color='white', linestyle='-', alpha=0.5, linewidth=2)
ax1.text(today+1, np.max(temp)+2, 'TODAY', color='white', fontsize=9, fontweight='bold')
ax1.set_xticks(months_ticks)
ax1.set_xticklabels(month_labels, color='gray')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('Temperature — Observed + 14-Day Forecast', color='white', fontsize=12)
ax1.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=4)
ax1.axvspan(152, 274, alpha=0.05, color='#3b82f6')

# --- Panel 2: Current conditions (top-right) ---
ax2 = fig.add_subplot(gs[0, 2])
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 10)
ax2.set_xticks([])
ax2.set_yticks([])
ax2.set_title('Current Conditions', color='white', fontsize=12)

conditions = [
    (f"Temp: {temp[today]:.1f}°C", '#ef4444', 8.5),
    (f"Humidity: {humidity[today]:.0f}%", '#22c55e', 7.0),
    (f"Pressure: {pressure[today]:.1f} hPa", '#3b82f6', 5.5),
    (f"Dew point: {dew_point[today]:.1f}°C", '#a855f7', 4.0),
    (f"Rain today: {rainfall[today]:.1f} mm", '#f59e0b', 2.5),
    (f"Day: {today} (July {today-182+1})", 'white', 1.0),
]
for text, color, y in conditions:
    ax2.text(5, y, text, ha='center', va='center', color=color, fontsize=13, fontweight='bold')

# Status indicator
status = "MONSOON ACTIVE" if monsoon_mask[today] else "DRY SEASON"
status_color = '#3b82f6' if monsoon_mask[today] else '#f59e0b'
ax2.text(5, 9.5, status, ha='center', va='center', color=status_color,
         fontsize=14, fontweight='bold',
         bbox=dict(boxstyle='round,pad=0.5', facecolor=status_color, alpha=0.2))

# --- Panel 3: Rainfall (middle-left) ---
ax3 = fig.add_subplot(gs[1, 0])
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

ax3.bar(days, rainfall, color='#3b82f6', alpha=0.7, width=1)
ax3.axvline(x=today, color='white', linewidth=2, alpha=0.5)
ax3.set_xticks(months_ticks)
ax3.set_xticklabels(month_labels, color='gray')
ax3.set_ylabel('Rainfall (mm)', color='white')
ax3.set_title('Daily Rainfall', color='white', fontsize=11)

# Cumulative on twin axis
ax3b = ax3.twinx()
ax3b.plot(days[:today+1], np.cumsum(rainfall[:today+1]), color='#22c55e', linewidth=2)
ax3b.set_ylabel('Cumulative (mm)', color='#22c55e')
ax3b.tick_params(colors='#22c55e')

# --- Panel 4: Pressure + fronts (middle-center) ---
ax4 = fig.add_subplot(gs[1, 1])
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')

ax4.plot(days[:today+1], pressure[:today+1], color='#a855f7', linewidth=1)
ax4.plot(days, pressure_seasonal, color='#a855f7', linewidth=1.5, alpha=0.3, linestyle='--')

# Mark rapid pressure drops (potential fronts)
ptend = np.diff(pressure, prepend=pressure[0])
front_days = np.where(ptend < -3)[0]
front_days = front_days[front_days <= today]
for fd in front_days:
    ax4.axvline(x=fd, color='#ef4444', alpha=0.3, linewidth=0.5)
ax4.scatter(front_days, pressure[front_days], color='#ef4444', s=20, zorder=5, label='Rapid drops (fronts?)')

ax4.axvline(x=today, color='white', linewidth=2, alpha=0.5)
ax4.set_xticks(months_ticks)
ax4.set_xticklabels(month_labels, color='gray')
ax4.set_ylabel('Pressure (hPa)', color='white')
ax4.set_title('Pressure + Frontal Passages', color='white', fontsize=11)
ax4.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 5: Humidity + dew point (middle-right) ---
ax5 = fig.add_subplot(gs[1, 2])
ax5.set_facecolor('#111827')
ax5.tick_params(colors='gray')

ax5.plot(days[:today+1], humidity[:today+1], color='#22c55e', linewidth=1, label='Humidity')
ax5.axhline(y=85, color='#ef4444', linestyle='--', alpha=0.5, label='Monsoon threshold (85%)')
ax5.fill_between(days[:today+1], 85, humidity[:today+1],
                  where=humidity[:today+1] > 85, alpha=0.15, color='#ef4444')
ax5.axvline(x=today, color='white', linewidth=2, alpha=0.5)
ax5.set_xticks(months_ticks)
ax5.set_xticklabels(month_labels, color='gray')
ax5.set_ylabel('Relative Humidity (%)', color='white')
ax5.set_title('Humidity — Monsoon Readiness', color='white', fontsize=11)
ax5.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 6: Forecast rain probability (bottom-left) ---
ax6 = fig.add_subplot(gs[2, 0])
ax6.set_facecolor('#111827')
ax6.tick_params(colors='gray')

colors_rain = ['#3b82f6' if p > 0.5 else '#9ca3af' for p in fc_rain_prob]
ax6.bar(range(forecast_horizon), fc_rain_prob * 100, color=colors_rain, alpha=0.8,
        edgecolor='white', linewidth=0.3)
ax6.axhline(y=50, color='#ef4444', linestyle='--', alpha=0.5, label='50% threshold')
ax6.set_xticks(range(forecast_horizon))
ax6.set_xticklabels([f'+{i+1}d' for i in range(forecast_horizon)], color='gray', fontsize=7)
ax6.set_ylabel('Rain probability (%)', color='white')
ax6.set_title('14-Day Rain Probability Forecast', color='white', fontsize=11)
ax6.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 7: Forecast skill metrics (bottom-center) ---
ax7 = fig.add_subplot(gs[2, 1])
ax7.set_facecolor('#111827')
ax7.tick_params(colors='gray')

# Skill degradation with lead time
lead_times = np.arange(1, 15)
skill_vals = 85 * np.exp(-lead_times * 0.15) + 10
ax7.plot(lead_times, skill_vals, 'o-', color='#22c55e', linewidth=2, markersize=5)
ax7.fill_between(lead_times, 0, skill_vals, alpha=0.1, color='#22c55e')
ax7.axhline(y=50, color='#f59e0b', linestyle='--', alpha=0.7, label='Useful skill threshold')
ax7.axhline(y=30, color='#ef4444', linestyle='--', alpha=0.7, label='No skill')
useful_limit = lead_times[np.argmin(np.abs(skill_vals - 50))]
ax7.axvline(x=useful_limit, color='#f59e0b', linestyle=':', alpha=0.5)
ax7.text(useful_limit + 0.3, 55, f'~{useful_limit} day limit', color='#f59e0b', fontsize=9)
ax7.set_xlabel('Lead time (days)', color='white')
ax7.set_ylabel('Forecast skill (%)', color='white')
ax7.set_title('Forecast Skill vs Lead Time', color='white', fontsize=11)
ax7.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 8: Monsoon onset distribution (bottom-right) ---
ax8 = fig.add_subplot(gs[2, 2])
ax8.set_facecolor('#111827')
ax8.tick_params(colors='gray')

# Simulated onset probability distribution
onset_mean = 157  # June 6
onset_std = 5
onset_range = np.arange(145, 175)
onset_pdf = np.exp(-0.5 * ((onset_range - onset_mean) / onset_std)**2) / (onset_std * np.sqrt(2*np.pi))

ax8.fill_between(onset_range, onset_pdf, alpha=0.3, color='#3b82f6')
ax8.plot(onset_range, onset_pdf, color='#3b82f6', linewidth=2)
ax8.axvline(x=onset_mean, color='#22c55e', linewidth=2, label=f'Mean: June {onset_mean-152}')
ax8.axvline(x=152, color='white', linewidth=1, alpha=0.3)
ax8.text(152, max(onset_pdf)*0.9, 'June 1', color='white', fontsize=8)

ax8.set_xlabel('Day of year', color='white')
ax8.set_ylabel('Probability density', color='white')
ax8.set_title('Monsoon Onset Probability (NE India)', color='white', fontsize=11)
ax8.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.savefig('/dev/null', format='png')  # force render
plt.show()

print("DASHBOARD SUMMARY — Day {}, Guwahati".format(today))
print("=" * 55)
print(f"Status: {'MONSOON ACTIVE' if monsoon_mask[today] else 'DRY SEASON'}")
print(f"Temperature: {temp[today]:.1f}°C (normal: {temp_seasonal[today]:.1f}°C)")
print(f"Humidity: {humidity[today]:.0f}% | Pressure: {pressure[today]:.1f} hPa")
print(f"Rain today: {rainfall[today]:.1f} mm")
print(f"Cumulative rainfall: {np.sum(rainfall[:today+1]):.0f} mm")
print(f"Monsoon rain so far: {np.sum(rainfall[152:today+1]):.0f} mm")
print(f"Forecast: rain likely {np.sum(fc_rain_prob > 0.5)}/{forecast_horizon} of next 14 days")
print(f"Useful forecast horizon: ~{useful_limit} days")`,
      challenge: 'Add interactivity: let the user change the "today" variable and regenerate the dashboard. Add a "yesterday vs today" comparison panel that shows which variables changed significantly overnight. Add color-coded alert levels (green/yellow/orange/red) for each variable.',
      successHint: 'You have built a complete weather dashboard from scratch — data generation, quality control, forecasting, and visualization. This is the same workflow used by operational weather services worldwide. The difference is scale: they process millions of observations from thousands of stations, satellites, and radar, and run on supercomputers.',
    },
    {
      title: 'Portfolio — your complete Weather Forecast Dashboard',
      concept: `You have built a weather forecasting system from the ground up. Here is what your portfolio project contains:

**1. Data layer** (Lesson 1): Synthetic but physically realistic weather data for Guwahati — temperature, humidity, pressure, rainfall — with proper monsoon seasonality, the Brahmaputra cycle, and day-to-day variability.

**2. Processing layer** (Lesson 2): Quality control pipeline that detects range errors, spikes, stuck sensors, and missing data. Derived variables: dew point, heat index, pressure tendency. All implemented from scratch.

**3. Forecast layer** (Lesson 3): Three baseline models — persistence, climatology, and linear regression — with rigorous verification using MAE, RMSE, and skill scores. The regression model beats persistence by a meaningful margin.

**4. Monsoon predictor** (Lesson 4): A specialized model using SST anomalies, pressure gradients, and ENSO to predict the monsoon onset date for northeast India. Verified against held-out test years.

**5. Dashboard** (Lesson 5): A multi-panel visualization that integrates all components — current conditions, forecasts with confidence intervals, historical context, and monsoon onset probability.

**What you have demonstrated:**
- Data science: generation, cleaning, quality control, derived variables
- Statistical modeling: regression, cross-validation, skill assessment
- Domain knowledge: cloud physics, precipitation, fronts, monsoon dynamics
- Visualization: effective multi-panel dashboard design
- Scientific thinking: baselines, uncertainty quantification, verification

**Where this goes next:**
- Real data from IMD or weather APIs instead of synthetic data
- Machine learning models (random forests, neural networks) for rainfall prediction
- Satellite imagery integration for real-time cloud classification
- River level forecasting for Brahmaputra flood warning`,
      analogy: 'Your weather dashboard is like building a house. Level 3 gave you the materials science (physics of clouds, rain, fronts). Level 4 lesson by lesson constructed the foundation (data), plumbing (processing), electrical system (forecasting), interior design (visualization), and finally the finished home (portfolio). You did not just read about houses — you built one.',
      storyConnection: 'The boy who talked to clouds understood weather through observation and intuition, honed over years of watching the Brahmaputra Valley sky. Your dashboard captures the same understanding in code — adiabatic cooling, cloud classification, precipitation physics, frontal systems, and the monsoon. The difference is that code scales: your dashboard can monitor weather 24/7, issue alerts automatically, and improve its forecasts as more data arrives. The boy\'s wisdom plus computational power — that is modern meteorology.',
      checkQuestion: 'If you were asked to deploy this dashboard for real flood warning in Assam, what would be the three most critical improvements needed beyond what we built?',
      checkAnswer: 'Three critical improvements: (1) Real-time data ingestion from IMD weather stations and satellites instead of synthetic data — the system must process live observations automatically. (2) River hydrological modeling — translating rainfall into river level rise requires a catchment model that accounts for soil saturation, tributary flows, and dam releases. (3) Alert system with communication — automatic SMS/mobile alerts to downstream communities when river levels are forecast to exceed danger marks. A dashboard that nobody sees during a flood is useless. The technology must reach the people who need it.',
      codeIntro: 'Generate the final portfolio summary: a comprehensive report card showing all components working together with key metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec

np.random.seed(42)

# === REGENERATE ALL DATA AND MODELS ===
days = np.arange(365)
temp_seasonal = 18 + 10 * np.sin(2 * np.pi * (days - 100) / 365)
monsoon_mask = (days >= 150) & (days <= 270)
temp_seasonal[monsoon_mask] -= 3
temp = temp_seasonal + np.random.randn(365) * 2.5

humidity_seasonal = 55 + 25 * np.sin(2 * np.pi * (days - 60) / 365)
humidity_seasonal[monsoon_mask] += 15
humidity = np.clip(humidity_seasonal + np.random.randn(365) * 5, 30, 99)

pressure_seasonal = 1012 - 6 * np.sin(2 * np.pi * (days - 60) / 365)
pressure_seasonal[monsoon_mask] -= 4
pressure = pressure_seasonal + np.random.randn(365) * 2

rain_prob = 0.1 + 0.6 * np.clip((humidity - 70) / 30, 0, 1)
rain_occurs = np.random.rand(365) < rain_prob
rain_intensity = np.random.exponential(scale=15, size=365)
rain_intensity[monsoon_mask] *= 2.5
rainfall = np.where(rain_occurs, rain_intensity, 0)
rainfall = np.clip(rainfall, 0, 150)

# Forecasts
train_end = 200
eval_days_arr = np.arange(train_end, 365)
temp_obs = temp[eval_days_arr]
temp_persist = temp[eval_days_arr - 1]
temp_clim = temp_seasonal[eval_days_arr]

# Regression
def build_regression(target, predictors, train_end, lookback=3):
    X_train, y_train = [], []
    for i in range(lookback, train_end):
        features = []
        for pred in predictors:
            for lag in range(1, lookback + 1):
                features.append(pred[i - lag])
        X_train.append(features)
        y_train.append(target[i])
    X_b = np.column_stack([X_train, np.ones(len(X_train))])
    w = np.linalg.lstsq(X_b, np.array(y_train), rcond=None)[0]
    forecasts = []
    for i in eval_days_arr:
        features = []
        for pred in predictors:
            for lag in range(1, lookback + 1):
                features.append(pred[i - lag])
        features.append(1)
        forecasts.append(np.dot(features, w))
    return np.array(forecasts)

temp_regr = build_regression(temp, [temp, humidity, pressure], train_end)

# Metrics
mae_persist = np.mean(np.abs(temp_obs - temp_persist))
mae_clim = np.mean(np.abs(temp_obs - temp_clim))
mae_regr = np.mean(np.abs(temp_obs - temp_regr))
skill_clim = (1 - mae_clim / mae_persist) * 100
skill_regr = (1 - mae_regr / mae_persist) * 100

# Monsoon predictor
n_years = 30
sst_anom = np.random.randn(n_years) * 0.6
pg = 8 + 0.5 * sst_anom + np.random.randn(n_years) * 1.5
enso = np.random.randn(n_years) * 0.8
onset = np.round(157 - 3*sst_anom - 1.5*(pg-8) + 4*enso + np.random.randn(n_years)*3).astype(int)

X_m = np.column_stack([sst_anom[:25], pg[:25], enso[:25], np.ones(25)])
w_m = np.linalg.lstsq(X_m, onset[:25], rcond=None)[0]
X_test_m = np.column_stack([sst_anom[25:], pg[25:], enso[25:], np.ones(5)])
onset_pred = X_test_m @ w_m
mae_onset = np.mean(np.abs(onset[25:] - onset_pred))

# === PORTFOLIO REPORT CARD ===
print("=" * 65)
print("   WEATHER FORECAST DASHBOARD — PORTFOLIO REPORT CARD")
print("   The Boy Who Talked to Clouds | TigmaMinds Academy")
print("=" * 65)
print()
print("PROJECT: Weather Forecast Dashboard for Guwahati, Assam")
print("LEVELS COMPLETED: Level 3 (Meteorology) + Level 4 (Capstone)")
print()
print("COMPONENT SUMMARY")
print("-" * 65)
print()
print("1. DATA GENERATION")
print(f"   Variables: temperature, humidity, pressure, rainfall")
print(f"   Duration: 365 days with monsoon seasonality")
print(f"   Rain days: {np.sum(rain_occurs)}/365 ({np.sum(rain_occurs)/365*100:.0f}%)")
print(f"   Annual rainfall: {np.sum(rainfall):.0f} mm")
print(f"   Monsoon share: {np.sum(rainfall[152:274])/np.sum(rainfall)*100:.0f}%")
print()
print("2. DATA QUALITY CONTROL")
print(f"   Error types handled: range, spike, missing, stuck sensor")
print(f"   Methods: clamping, interpolation, rolling-window detection")
print(f"   Derived variables: dew point, heat index, pressure tendency")
print()
print("3. STATISTICAL FORECASTING (temperature, 1-day ahead)")
print(f"   Persistence MAE:  {mae_persist:.2f}°C (baseline)")
print(f"   Climatology MAE:  {mae_clim:.2f}°C (skill: {skill_clim:+.1f}%)")
print(f"   Regression MAE:   {mae_regr:.2f}°C (skill: {skill_regr:+.1f}%)")
print(f"   Best model: {'Regression' if mae_regr < mae_clim else 'Climatology'}")
print()
print("4. MONSOON ONSET PREDICTOR")
print(f"   Predictors: SST anomaly, pressure gradient, ENSO index")
print(f"   Training: 25 years | Test: 5 years")
print(f"   Test MAE: {mae_onset:.1f} days")
print(f"   Mean onset: June {np.mean(onset)-152:.0f} (day {np.mean(onset):.0f})")
print()
print("5. VISUALIZATION DASHBOARD")
print(f"   Panels: 8 (temp forecast, rain, pressure, humidity,")
print(f"           rain probability, skill metrics, monsoon onset, status)")
print(f"   Features: confidence intervals, alerts, historical context")
print()

# === FINAL VISUALIZATION: Project summary ===
fig = plt.figure(figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('PORTFOLIO: Weather Forecast Dashboard — Complete System',
             color='white', fontsize=16, fontweight='bold')

gs = GridSpec(2, 3, figure=fig, hspace=0.35, wspace=0.3)

# 1. Annual data overview
ax1 = fig.add_subplot(gs[0, 0])
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
ax1.plot(days, temp, color='#ef4444', linewidth=0.5, alpha=0.5)
ax1.plot(days, temp_seasonal, color='#ef4444', linewidth=2)
ax1b = ax1.twinx()
ax1b.bar(days, rainfall, color='#3b82f6', alpha=0.3, width=1)
ax1b.tick_params(colors='#3b82f6')
ax1.set_title('1. Data: Full Year Overview', color='white', fontsize=11)
ax1.axvspan(152, 274, alpha=0.05, color='#3b82f6')
months_t = [0, 59, 152, 274, 335]
ax1.set_xticks(months_t)
ax1.set_xticklabels(['Jan', 'Mar', 'Jun', 'Oct', 'Dec'], color='gray', fontsize=8)

# 2. QC impact
ax2 = fig.add_subplot(gs[0, 1])
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
qc_categories = ['Range', 'Spike', 'Missing', 'Stuck']
qc_counts = [4, 4, 8, 8]
bars = ax2.bar(qc_categories, qc_counts, color=['#ef4444', '#f59e0b', '#3b82f6', '#a855f7'], alpha=0.8)
for bar, val in zip(bars, qc_counts):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
             str(val), ha='center', color='white', fontsize=11)
ax2.set_title('2. QC: Errors Detected & Fixed', color='white', fontsize=11)
ax2.set_ylabel('Count', color='white')

# 3. Forecast skill comparison
ax3 = fig.add_subplot(gs[0, 2])
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
methods = ['Persist', 'Climate', 'Regress']
maes = [mae_persist, mae_clim, mae_regr]
colors_bar = ['#9ca3af', '#3b82f6', '#22c55e']
bars = ax3.bar(methods, maes, color=colors_bar, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, val in zip(bars, maes):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
             f'{val:.2f}°C', ha='center', color='white', fontsize=10)
ax3.set_title('3. Forecast: MAE Comparison', color='white', fontsize=11)
ax3.set_ylabel('MAE (°C)', color='white')

# 4. Monsoon onset
ax4 = fig.add_subplot(gs[1, 0])
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
test_years = np.arange(2019, 2024)
bw = 0.3
ax4.bar(np.arange(5)-bw/2, onset[25:]-152, bw, color='#3b82f6', label='Observed', alpha=0.8)
ax4.bar(np.arange(5)+bw/2, onset_pred-152, bw, color='#ef4444', label='Predicted', alpha=0.8)
ax4.set_xticks(np.arange(5))
ax4.set_xticklabels(test_years, color='gray')
ax4.set_title(f'4. Monsoon Onset (MAE={mae_onset:.1f}d)', color='white', fontsize=11)
ax4.set_ylabel('Days after June 1', color='white')
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5. Skill vs lead time
ax5 = fig.add_subplot(gs[1, 1])
ax5.set_facecolor('#111827')
ax5.tick_params(colors='gray')
leads = np.arange(1, 15)
skill_curve = 85 * np.exp(-leads * 0.15) + 10
ax5.fill_between(leads, 0, skill_curve, alpha=0.15, color='#22c55e')
ax5.plot(leads, skill_curve, 'o-', color='#22c55e', linewidth=2, markersize=4)
ax5.axhline(y=50, color='#f59e0b', linestyle='--', alpha=0.7)
ax5.set_xlabel('Lead time (days)', color='white')
ax5.set_ylabel('Skill (%)', color='white')
ax5.set_title('5. Predictability Limit', color='white', fontsize=11)

# 6. Skills learned (radar chart approximation using bar)
ax6 = fig.add_subplot(gs[1, 2])
ax6.set_facecolor('#111827')
ax6.tick_params(colors='gray')
skills_names = ['Data\
Science', 'Statistics', 'Physics', 'Coding', 'Viz', 'Domain']
skills_scores = [85, 80, 90, 85, 88, 92]
colors_skills = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7', '#ec4899']
bars = ax6.barh(skills_names, skills_scores, color=colors_skills, alpha=0.7)
for bar, val in zip(bars, skills_scores):
    ax6.text(val + 1, bar.get_y() + bar.get_height()/2, f'{val}%',
             va='center', color='white', fontsize=9)
ax6.set_xlim(0, 100)
ax6.set_title('6. Skills Demonstrated', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("SKILLS DEMONSTRATED")
print("-" * 65)
print(f"  Data Science:     Data generation, cleaning, quality control")
print(f"  Statistics:       Regression, cross-validation, verification")
print(f"  Physics:          Cloud formation, precipitation, monsoon dynamics")
print(f"  Coding:           Python, numpy, matplotlib — all from scratch")
print(f"  Visualization:    Multi-panel dashboards, uncertainty displays")
print(f"  Domain Knowledge: Indian monsoon, Brahmaputra floods, Assam weather")
print()
print("NEXT STEPS")
print("-" * 65)
print(f"  1. Replace synthetic data with real IMD observations")
print(f"  2. Add ML models (random forest, LSTM) for rainfall prediction")
print(f"  3. Integrate satellite imagery for cloud classification")
print(f"  4. Build river level forecasting for Brahmaputra flood warning")
print(f"  5. Deploy as a web app with real-time data feeds")
print()
print("=" * 65)
print("   The boy who talked to clouds now speaks their language in code.")
print("=" * 65)`,
      challenge: 'Package this entire project as a reusable module: create a WeatherStation class that encapsulates data generation, QC, forecasting, and visualization. A user should be able to create a station with station = WeatherStation("Guwahati", lat=26.14, lon=91.73) and call station.generate_data(), station.run_qc(), station.forecast(), and station.dashboard().',
      successHint: 'You have completed the full journey — from "why do clouds form?" to a working weather forecast dashboard. This is real data science: understanding the domain, generating and cleaning data, building models, verifying them rigorously, and presenting results clearly. The boy who talked to clouds would be proud.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Weather Forecast Dashboard
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (meteorology & weather science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete weather forecast dashboard. Click to start.</p>
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
