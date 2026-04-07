import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MonsoonHomeLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Global wind patterns — the atmosphere\'s highways',
      concept: `In the story, the monsoon "finds its way home" to Northeast India. But why does wind blow in predictable patterns? The answer starts with the sun.

The sun heats the equator more than the poles. Hot equatorial air rises, creating a low-pressure belt. This rising air moves toward the poles at high altitude, cools, and sinks around 30°N and 30°S (creating high-pressure belts). Surface air flows back toward the equator to replace the rising air. This creates a giant circulation loop called the **Hadley cell**.

**The three major wind belts** (per hemisphere):
- **Trade winds** (0-30°): blow from east to west (deflected by Coriolis), from high-pressure subtropics toward low-pressure equator
- **Westerlies** (30-60°): blow from west to east, driving weather systems in mid-latitudes
- **Polar easterlies** (60-90°): cold air flowing from poles toward mid-latitudes

These winds are not just atmospheric curiosities — they are the highways that the monsoon travels on. The Indian monsoon is essentially a seasonal reversal of the trade winds, driven by the temperature difference between the Indian Ocean and the Asian landmass.`,
      analogy: 'Global wind patterns are like a conveyor belt system in a factory. The equator is the furnace (heat source), the poles are the freezer (heat sink). Air circulates between them like packages on a conveyor — heated, lifted, moved, cooled, dropped, and returned. The Earth\'s rotation tilts the conveyor belts sideways (Coriolis), creating the spiraling wind patterns we see.',
      storyConnection: 'The monsoon in the story travels from the Indian Ocean to Assam. It follows the same route every year because it\'s part of the global wind system — not random but predictable, driven by the sun and Earth\'s rotation. The monsoon "finding its way home" is really the atmosphere following its fundamental circulation rules, modified by the unique geography of South Asia.',
      checkQuestion: 'Why do the trade winds blow from east to west, not just straight from the subtropics to the equator?',
      checkAnswer: 'The Coriolis effect. Air moving from the high-pressure subtropics toward the low-pressure equator is deflected to the RIGHT in the Northern Hemisphere (and left in the Southern). This rightward deflection turns northward-flowing air into northeast-to-southwest flow — the northeast trade winds. Without Earth\'s rotation, winds would blow directly north-south.',
      codeIntro: 'Visualize global wind patterns and the three-cell circulation model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Global wind patterns
latitudes = np.linspace(-90, 90, 200)

# Simplified zonal wind speed (m/s)
# Trade winds (easterly), Westerlies, Polar easterlies
zonal_wind = np.zeros_like(latitudes)
for i, lat in enumerate(latitudes):
    abs_lat = abs(lat)
    if abs_lat < 30:
        # Trade winds (easterly = negative)
        zonal_wind[i] = -8 * np.sin(abs_lat / 30 * np.pi)
    elif abs_lat < 60:
        # Westerlies (positive)
        zonal_wind[i] = 15 * np.sin((abs_lat - 30) / 30 * np.pi)
    else:
        # Polar easterlies
        zonal_wind[i] = -5 * np.sin((abs_lat - 60) / 30 * np.pi)

# Pressure belts
pressure = np.zeros_like(latitudes)
for i, lat in enumerate(latitudes):
    abs_lat = abs(lat)
    if abs_lat < 10:
        pressure[i] = 1008  # equatorial low (ITCZ)
    elif abs_lat < 35:
        pressure[i] = 1008 + 12 * np.sin((abs_lat - 10) / 25 * np.pi / 2)
    elif abs_lat < 65:
        pressure[i] = 1020 - 10 * np.sin((abs_lat - 35) / 30 * np.pi / 2)
    else:
        pressure[i] = 1010 + 10 * np.sin((abs_lat - 65) / 25 * np.pi / 2)

fig, axes = plt.subplots(1, 3, figsize=(16, 7))
fig.patch.set_facecolor('#1f2937')

# Wind profile
ax1 = axes[0]
ax1.set_facecolor('#111827')
ax1.plot(zonal_wind, latitudes, color='#3b82f6', linewidth=2)
ax1.fill_betweenx(latitudes, 0, zonal_wind, where=zonal_wind > 0, alpha=0.2, color='#22c55e', label='Westerly')
ax1.fill_betweenx(latitudes, 0, zonal_wind, where=zonal_wind < 0, alpha=0.2, color='#ef4444', label='Easterly')
ax1.axvline(0, color='white', linewidth=0.5, alpha=0.3)
ax1.set_xlabel('Zonal wind (m/s)', color='white')
ax1.set_ylabel('Latitude (°)', color='white')
ax1.set_title('Wind Speed by Latitude', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Annotations
wind_labels = [
    (15, 'NE Trades', '#ef4444'), (45, 'Westerlies', '#22c55e'), (75, 'Polar Easterlies', '#ef4444'),
    (-15, 'SE Trades', '#ef4444'), (-45, 'Westerlies', '#22c55e'), (-75, 'Polar Easterlies', '#ef4444'),
]
for lat, label, color in wind_labels:
    ax1.text(12 if 'West' in label else -12, lat, label, color=color, fontsize=7, va='center', ha='center')

# Pressure profile
ax2 = axes[1]
ax2.set_facecolor('#111827')
ax2.plot(pressure, latitudes, color='#f59e0b', linewidth=2)
ax2.fill_betweenx(latitudes, 1013, pressure, where=pressure < 1013, alpha=0.15, color='#ef4444')
ax2.fill_betweenx(latitudes, 1013, pressure, where=pressure > 1013, alpha=0.15, color='#3b82f6')
ax2.axvline(1013, color='white', linewidth=0.5, alpha=0.3)
ax2.set_xlabel('Pressure (hPa)', color='white')
ax2.set_title('Pressure Belts', color='white', fontsize=12)
ax2.tick_params(colors='gray')

pressure_labels = [
    (0, 'ITCZ\\n(Low)', '#ef4444'), (30, 'Subtropical\\nHigh', '#3b82f6'),
    (60, 'Subpolar\\nLow', '#ef4444'), (-30, 'Subtropical\\nHigh', '#3b82f6'),
]
for lat, label, color in pressure_labels:
    ax2.annotate(label, xy=(pressure[np.argmin(np.abs(latitudes - lat))], lat),
                xytext=(1025, lat), color=color, fontsize=8, ha='center')

# Circulation cells
ax3 = axes[2]
ax3.set_facecolor('#111827')
# Simplified vertical cross-section
cells = [
    ('Hadley Cell', 0, 30, '#ef4444'),
    ('Ferrel Cell', 30, 60, '#3b82f6'),
    ('Polar Cell', 60, 90, '#22c55e'),
]

for name, lat1, lat2, color in cells:
    # Surface wind (bottom arrow)
    mid = (lat1 + lat2) / 2
    # Hadley: surface toward equator, Ferrel: surface toward pole, Polar: surface toward equator
    if 'Hadley' in name:
        ax3.annotate('', xy=(lat1, 0.1), xytext=(lat2, 0.1),
                    arrowprops=dict(arrowstyle='->', color=color, lw=2))
        ax3.annotate('', xy=(lat2, 0.9), xytext=(lat1, 0.9),
                    arrowprops=dict(arrowstyle='->', color=color, lw=2))
    elif 'Ferrel' in name:
        ax3.annotate('', xy=(lat2, 0.1), xytext=(lat1, 0.1),
                    arrowprops=dict(arrowstyle='->', color=color, lw=2))
        ax3.annotate('', xy=(lat1, 0.9), xytext=(lat2, 0.9),
                    arrowprops=dict(arrowstyle='->', color=color, lw=2))
    else:
        ax3.annotate('', xy=(lat1, 0.1), xytext=(lat2, 0.1),
                    arrowprops=dict(arrowstyle='->', color=color, lw=2))
        ax3.annotate('', xy=(lat2, 0.9), xytext=(lat1, 0.9),
                    arrowprops=dict(arrowstyle='->', color=color, lw=2))

    # Rising/sinking
    ax3.annotate('', xy=(lat1, 0.9), xytext=(lat1, 0.1),
                arrowprops=dict(arrowstyle='->', color=color, lw=1, alpha=0.5))
    ax3.annotate('', xy=(lat2, 0.1), xytext=(lat2, 0.9),
                arrowprops=dict(arrowstyle='->', color=color, lw=1, alpha=0.5))

    ax3.text(mid, 0.5, name, color=color, fontsize=9, ha='center', va='center',
            bbox=dict(boxstyle='round', facecolor='#111827', edgecolor=color, alpha=0.8))

ax3.set_xlabel('Latitude (°N)', color='white')
ax3.set_ylabel('Altitude (relative)', color='white')
ax3.set_title('Three-Cell Circulation Model', color='white', fontsize=12)
ax3.set_xlim(-5, 95)
ax3.set_ylim(-0.05, 1.05)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Global wind pattern summary:")
print("  0-30°: Trade winds (easterly) — powered by Hadley cell")
print("  30-60°: Westerlies — drive mid-latitude weather")
print("  60-90°: Polar easterlies — cold polar air")
print("\\\nThe monsoon is a SEASONAL REVERSAL of the Hadley cell")
print("over South Asia — the key topic of this course.")`,
      challenge: 'The ITCZ migrates north in boreal summer and south in boreal winter. If it reaches 25°N over India in July, how does this change the wind direction over Assam?',
      successHint: 'Global wind patterns are the foundation of all climate and weather. Every monsoon, cyclone, and drought connects back to these three circulation cells. Understanding them is understanding the atmosphere\'s operating system.',
    },
    {
      title: 'Hadley cells — the tropical heat engine',
      concept: `The **Hadley cell** is the largest and most powerful atmospheric circulation pattern. It dominates the tropics (0-30° latitude) and is the engine that ultimately drives the Indian monsoon.

**How it works:**
1. Intense solar heating at the equator warms the surface and the air above it
2. Warm, moist air rises vigorously (forming the Intertropical Convergence Zone, ITCZ)
3. Rising air cools, moisture condenses → massive thunderstorms and heavy rainfall
4. High-altitude air flows poleward (toward 30°N and 30°S)
5. Air cools and sinks at ~30° latitude → clear skies, dry air → world's great deserts
6. Surface air flows back toward the equator → trade winds

**Energy budget:**
- The Hadley cell transports 4 × 10¹⁵ watts of energy from the equator toward the poles
- This is 200x the total power generation of all humans
- Without this heat transport, the equator would be 14°C hotter and the poles 25°C colder

The Indian monsoon is essentially the Hadley cell going "off-script" — instead of the rising branch staying near the equator, the heated Tibetan Plateau pulls it northward over India, creating the monsoon's unique pattern.`,
      analogy: 'The Hadley cell works like a giant lava lamp. Warm fluid (air) rises at the equator (bottom of the lamp), spreads out at the top, cools, sinks at the sides (30° latitude), and flows back along the bottom to be heated again. The lamp is powered by a light bulb (the sun). The Hadley cell is powered by equatorial sunlight.',
      storyConnection: 'The monsoon "finding its way home" in the story is the Hadley cell being modified by India\'s geography. When the Tibetan Plateau heats up in summer, it pulls the ITCZ northward, reversing the trade winds over India and drawing moist ocean air across the subcontinent toward Assam. The monsoon\'s journey home follows the rules of the Hadley cell, redirected by the highest mountains on Earth.',
      checkQuestion: 'The world\'s great deserts (Sahara, Arabian, Thar, Australian) are all located near 30°N or 30°S. Is this a coincidence?',
      checkAnswer: 'Not at all — it\'s a direct consequence of the Hadley cell. Air that rose at the equator sinks at 30° latitude. Sinking air warms by compression and becomes very dry (low relative humidity). Dry sinking air suppresses cloud formation and rainfall. The result: a belt of deserts at 30°N/S around the entire planet. The Thar Desert exists because it sits under the descending branch of the Hadley cell.',
      codeIntro: 'Model the Hadley cell circulation and its effect on temperature and rainfall patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hadley cell model
# Simplified: temperature, rainfall, and vertical velocity by latitude

latitudes = np.linspace(-30, 30, 200)

# Solar heating (peaks at equator)
solar_heating = 400 * np.cos(np.radians(latitudes))  # W/m²

# Surface temperature
sst = 27 + 5 * np.cos(np.radians(latitudes))  # °C

# Vertical velocity (positive = rising)
# Rising at equator (ITCZ), sinking at 30°
omega = -0.05 * np.cos(np.radians(latitudes * 3))  # simplified

# Rainfall (proportional to rising motion)
rainfall = np.maximum(0, -omega * 1000)  # mm/month approximation
rainfall = rainfall * 200  # scale

# Trade wind speed
trade_wind = 8 * np.sin(np.radians(latitudes * 3))

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Temperature and solar input
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(latitudes, sst, color='#ef4444', linewidth=2, label='SST (°C)')
ax1_twin = ax1.twinx()
ax1_twin.plot(latitudes, solar_heating, color='#f59e0b', linewidth=2, linestyle='--', label='Solar input (W/m²)')
ax1.set_xlabel('Latitude', color='white')
ax1.set_ylabel('Temperature (°C)', color='#ef4444')
ax1_twin.set_ylabel('Solar heating (W/m²)', color='#f59e0b')
ax1.set_title('Solar Heating Drives the Hadley Cell', color='white', fontsize=12)
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax1_twin.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1_twin.tick_params(colors='gray')

# Vertical motion and rainfall
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.fill_between(latitudes, 0, rainfall, alpha=0.3, color='#3b82f6')
ax2.plot(latitudes, rainfall, color='#3b82f6', linewidth=2, label='Rainfall')
ax2.set_xlabel('Latitude', color='white')
ax2.set_ylabel('Rainfall (mm/month)', color='white')
ax2.set_title('Rainfall: Rising Air = Rain, Sinking Air = Desert', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Mark zones
ax2.annotate('ITCZ\\n(rain)', xy=(0, rainfall[100]), color='#3b82f6', fontsize=10, ha='center')
ax2.annotate('Desert\\nbelt', xy=(28, 10), color='#ef4444', fontsize=10, ha='center')
ax2.annotate('Desert\\nbelt', xy=(-28, 10), color='#ef4444', fontsize=10, ha='center')

# Hadley cell cross-section
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

# Draw the cell
lat_range = np.linspace(0, 30, 50)
# Streamlines (simplified)
for height_frac in [0.2, 0.4, 0.6, 0.8]:
    # Lower branch: equatorward
    x_low = lat_range
    y_low = np.ones_like(lat_range) * height_frac * 0.3
    ax3.plot(x_low, y_low, color='#ef4444', alpha=0.3, linewidth=1)
    ax3.annotate('', xy=(0, height_frac*0.3), xytext=(10, height_frac*0.3),
                arrowprops=dict(arrowstyle='->', color='#ef4444', lw=1))

    # Upper branch: poleward
    y_high = np.ones_like(lat_range) * (0.7 + height_frac * 0.2)
    ax3.plot(x_low, y_high, color='#3b82f6', alpha=0.3, linewidth=1)
    ax3.annotate('', xy=(30, 0.7+height_frac*0.2), xytext=(20, 0.7+height_frac*0.2),
                arrowprops=dict(arrowstyle='->', color='#3b82f6', lw=1))

# Rising at equator
ax3.annotate('', xy=(0, 0.9), xytext=(0, 0.1),
            arrowprops=dict(arrowstyle='->', color='#22c55e', lw=3))
ax3.text(-3, 0.5, 'RISING\\n(ITCZ)', color='#22c55e', fontsize=10, ha='center')

# Sinking at 30°
ax3.annotate('', xy=(30, 0.1), xytext=(30, 0.9),
            arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=3))
ax3.text(33, 0.5, 'SINKING\\n(Desert)', color='#f59e0b', fontsize=10, ha='center')

ax3.set_xlabel('Latitude (°N)', color='white')
ax3.set_ylabel('Altitude (relative)', color='white')
ax3.set_title('Hadley Cell Cross-Section', color='white', fontsize=12)
ax3.set_xlim(-5, 35)
ax3.tick_params(colors='gray')

# Energy transport
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
lats_full = np.linspace(-90, 90, 200)
# Energy transport (peaks at ~20° latitude)
energy_transport = 5 * np.sin(np.radians(lats_full * 2))  # PW (petawatts)

ax4.plot(lats_full, energy_transport, color='#f59e0b', linewidth=2)
ax4.fill_between(lats_full, 0, energy_transport, where=energy_transport > 0, alpha=0.15, color='#ef4444', label='Northward transport')
ax4.fill_between(lats_full, 0, energy_transport, where=energy_transport < 0, alpha=0.15, color='#3b82f6', label='Southward transport')
ax4.axhline(0, color='white', linewidth=0.5, alpha=0.3)
ax4.set_xlabel('Latitude', color='white')
ax4.set_ylabel('Energy transport (PW)', color='white')
ax4.set_title('Atmospheric Heat Transport', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Hadley cell key facts:")
print("  Rising branch: ITCZ (near equator) → rain, storms")
print("  Sinking branch: ~30° latitude → deserts")
print("  Energy transported: ~5 PW (5 × 10^15 watts)")
print("  Trade wind speed: ~8 m/s (29 km/h)")
print("\\\nThe monsoon modifies the Hadley cell over South Asia")
print("by pulling the ITCZ northward to ~25°N in summer.")`,
      challenge: 'If Earth had no axial tilt (23.5° tilt causes seasons), the ITCZ would stay at the equator year-round. How would this change the monsoon? Would India still have one?',
      successHint: 'The Hadley cell is the atmosphere\'s most powerful engine. Understanding it explains tropical rainfall, deserts, trade winds, and — when modified by continental geography — the monsoon. Every weather pattern in the tropics starts here.',
    },
    {
      title: 'The ITCZ — where the monsoon begins',
      concept: `The **Intertropical Convergence Zone (ITCZ)** is the equatorial belt where the trade winds from the Northern and Southern Hemispheres converge. It\'s visible from space as a band of thunderstorms girdling the Earth.

**Key properties:**
- The ITCZ follows the sun — it migrates north in boreal summer (June-August) and south in boreal winter (December-February)
- Over oceans, the migration is small (±5° latitude)
- Over continents, especially Asia, the migration is HUGE — the ITCZ reaches 25-30°N over India in July

**The ITCZ and the monsoon:**
- In winter, the ITCZ is south of the equator → dry NE winds blow over India
- In summer, solar heating of the Tibetan Plateau and Indian landmass pulls the ITCZ northward
- As the ITCZ crosses the equator, it pulls moist Indian Ocean air with it
- This moist air crosses India as the southwest monsoon, reaching NE India by June

The ITCZ's position determines the monsoon's timing: if the ITCZ shifts north slowly, the monsoon arrives late. If it lingers south, drought conditions persist.`,
      analogy: 'The ITCZ is like the center line of a see-saw. When the Northern Hemisphere heats up (summer), the see-saw tips north, pulling the ITCZ and its rain with it. When the Southern Hemisphere heats up, it tips south. Over India, the see-saw tips so far north that the entire pattern of wind and rain reverses — that reversal IS the monsoon.',
      storyConnection: 'The monsoon in the story "found its way home" to NE India. Meteorologically, it\'s the ITCZ that finds its way north, pulled by the heating of the Tibetan Plateau. The monsoon rains arrive in Assam when the ITCZ reaches ~25°N, crossing Cherrapunji and Mawsynram — two of the wettest places on Earth. The story\'s monsoon journey tracks the ITCZ\'s annual migration.',
      checkQuestion: 'Cherrapunji (Meghalaya) receives 11,777 mm of rainfall per year — one of the highest on Earth. Why does this specific spot get so much rain?',
      checkAnswer: 'Three factors combine: (1) The moist southwest monsoon winds hit the Khasi Hills perpendicularly, forced upward (orographic lifting). (2) The steep south-facing slope forces rapid ascent, causing intense condensation. (3) The funnel-shaped topography of the Bangladesh-Meghalaya border channels and concentrates the moist airflow. It\'s the perfect intersection of monsoon moisture and mountain geography.',
      codeIntro: 'Track the ITCZ migration and its relationship to Indian monsoon onset.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ITCZ migration through the year
months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# ITCZ latitude (approximate, over Indian Ocean / South Asia)
itcz_lat = np.array([-10, -8, -3, 5, 12, 20, 25, 23, 15, 5, -3, -8])

# Indian rainfall (mm/month, all-India average)
india_rainfall = np.array([15, 18, 25, 40, 60, 165, 290, 265, 175, 80, 25, 10])

# NE India rainfall (Assam, much higher)
ne_rainfall = np.array([20, 30, 80, 180, 350, 500, 450, 380, 300, 150, 40, 15])

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# ITCZ migration
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(months, itcz_lat, 'o-', color='#f59e0b', linewidth=2, markersize=8)
ax1.fill_between(months, itcz_lat, 0, where=itcz_lat > 0, alpha=0.15, color='#ef4444', label='North of equator')
ax1.fill_between(months, itcz_lat, 0, where=itcz_lat < 0, alpha=0.15, color='#3b82f6', label='South of equator')
ax1.axhline(0, color='white', linewidth=0.5, alpha=0.5)
ax1.axhline(25, color='white', linestyle=':', alpha=0.3)
ax1.annotate('NE India (25°N)', xy=(7, 25), color='white', fontsize=9)

ax1.set_xticks(months)
ax1.set_xticklabels(month_names, color='white')
ax1.set_ylabel('ITCZ latitude (°N)', color='white')
ax1.set_title('ITCZ Annual Migration', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Rainfall comparison
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.bar(months - 0.15, india_rainfall, width=0.3, color='#3b82f6', alpha=0.7, label='All-India average')
ax2.bar(months + 0.15, ne_rainfall, width=0.3, color='#22c55e', alpha=0.7, label='NE India (Assam)')
ax2.set_xticks(months)
ax2.set_xticklabels(month_names, color='white')
ax2.set_ylabel('Rainfall (mm/month)', color='white')
ax2.set_title('Monsoon Rainfall: India vs NE India', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# ITCZ position vs rainfall correlation
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.scatter(itcz_lat, india_rainfall, s=80, color='#3b82f6', edgecolors='white', linewidth=0.5, label='All-India')
ax3.scatter(itcz_lat, ne_rainfall, s=80, color='#22c55e', edgecolors='white', linewidth=0.5, label='NE India')

# Add month labels
for m, lat, rain_i, rain_ne in zip(month_names, itcz_lat, india_rainfall, ne_rainfall):
    ax3.annotate(m, xy=(lat, rain_i), xytext=(lat+1, rain_i+10), color='#3b82f6', fontsize=7)

ax3.set_xlabel('ITCZ latitude (°N)', color='white')
ax3.set_ylabel('Rainfall (mm/month)', color='white')
ax3.set_title('ITCZ Position Determines Rainfall', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Monsoon onset progression
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Monsoon onset dates across India (approximate day of year)
cities = ['Kerala', 'Mumbai', 'Hyderabad', 'Kolkata', 'Guwahati', 'Delhi', 'Jaipur']
onset_day = [152, 162, 165, 158, 155, 175, 178]  # June 1 = day 152
latitudes_cities = [8.5, 19.1, 17.4, 22.6, 26.1, 28.6, 26.9]

ax4.scatter(onset_day, latitudes_cities, s=100, c=onset_day, cmap='RdYlGn_r', edgecolors='white', linewidth=0.5, zorder=5)
for city, day, lat in zip(cities, onset_day, latitudes_cities):
    month_day = f"Jun {day - 151}"
    ax4.annotate(f'{city} ({month_day})', xy=(day, lat), xytext=(day+2, lat+0.3),
                color='white', fontsize=9)

ax4.set_xlabel('Day of year', color='white')
ax4.set_ylabel('Latitude (°N)', color='white')
ax4.set_title('Monsoon Onset Progression Across India', color='white', fontsize=12)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Monsoon timeline:")
print("  ITCZ crosses equator: ~April")
print("  Monsoon onset Kerala: ~June 1")
print("  Reaches NE India: ~June 5-10")
print("  Reaches Delhi: ~June 25")
print("  Peak rainfall: July-August")
print("  Monsoon withdrawal: October")
print(f"\\\nNE India total monsoon rain: {sum(ne_rainfall[5:10]):.0f} mm (Jun-Oct)")`,
      challenge: 'If the ITCZ arrives 2 weeks late in a given year, how much rainfall does NE India lose? Estimate by shifting the rainfall pattern by 2 weeks. What does this mean for rice planting?',
      successHint: 'The ITCZ is the atmospheric mechanism behind the monsoon. Its position, timing, and strength determine whether 1.4 billion people have enough water for their crops. Tracking the ITCZ is not academic — it\'s a food security issue.',
    },
    {
      title: 'Indian Ocean warming — the monsoon\'s fuel tank',
      concept: `The monsoon needs moisture, and the Indian Ocean provides it. The ocean is the monsoon's fuel tank — its temperature determines how much moisture the atmosphere can absorb.

**How it works:**
- Warmer water evaporates more (exponentially — see Clausius-Clapeyron equation)
- For every 1°C increase in SST, the atmosphere holds ~7% more moisture
- More moisture → more latent heat release when it condenses → stronger monsoon circulation
- But it's complicated: warming can also increase wind shear, which suppresses convection

**Indian Ocean Dipole (IOD):**
- Positive IOD: warm western Indian Ocean, cool eastern → more rain for India
- Negative IOD: cool west, warm east → less rain for India
- IOD explains much of the year-to-year variability in monsoon rainfall

**Climate change concern:**
- The Indian Ocean has warmed by ~1°C since 1900
- Models project continued warming → more moisture → potentially more extreme monsoon events
- But also: more drought in some areas due to changed circulation patterns
- The net effect is not "more rain everywhere" — it's "more extreme events everywhere"`,
      analogy: 'The Indian Ocean is like a steam boiler for the monsoon. Warmer water produces more steam (evaporation). More steam drives a more powerful engine (monsoon circulation). But too much steam can blow the safety valve (extreme flooding). And if the boiler pressure is uneven (IOD), some pipes get too much steam while others get too little.',
      storyConnection: 'The monsoon in the story draws its moisture from the warm Indian Ocean. If the ocean is warmer than usual (positive IOD year), the monsoon rains are heavier — the rivers flood, the rice paddies fill. If the ocean is cooler (negative IOD or El Nino year), the rains weaken and drought threatens. The story\'s monsoon "finding its way home" depends on the ocean being warm enough to fuel the journey.',
      checkQuestion: 'The Clausius-Clapeyron equation says atmospheric moisture increases ~7% per °C. The Indian Ocean has warmed 1°C. Has monsoon rainfall increased by 7%?',
      checkAnswer: 'Not directly. While there IS more atmospheric moisture (measured and confirmed), the monsoon circulation itself has weakened slightly due to reduced land-sea temperature contrast (the land isn\'t warming as fast as expected relative to the ocean in some analyses). The result: more moisture but weaker "pull" = not a simple 7% rainfall increase. Instead, the monsoon has become more erratic — longer dry spells punctuated by more intense rainfall events. Total rainfall hasn\'t changed much, but its distribution has.',
      codeIntro: 'Explore the relationship between sea surface temperature, evaporation, and monsoon strength.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Clausius-Clapeyron relationship
# Saturation vapor pressure: e_s = 6.11 * exp(17.67 * T / (T + 243.5))
# T in °C, e_s in hPa

T = np.linspace(15, 35, 200)
e_sat = 6.11 * np.exp(17.67 * T / (T + 243.5))  # hPa

# Specific humidity at saturation (proportional to e_sat)
q_sat = 0.622 * e_sat / (1013 - e_sat) * 1000  # g/kg

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Clausius-Clapeyron curve
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(T, q_sat, color='#3b82f6', linewidth=2)
ax1.fill_between(T, q_sat, alpha=0.15, color='#3b82f6')

# Mark 7% increase per degree
for t_mark in [25, 26, 27, 28, 29]:
    q1 = 0.622 * 6.11 * np.exp(17.67 * t_mark / (t_mark + 243.5)) / (1013 - 6.11 * np.exp(17.67 * t_mark / (t_mark + 243.5))) * 1000
    q2 = 0.622 * 6.11 * np.exp(17.67 * (t_mark+1) / (t_mark+1 + 243.5)) / (1013 - 6.11 * np.exp(17.67 * (t_mark+1) / (t_mark+1 + 243.5))) * 1000
    pct = (q2 - q1) / q1 * 100
    ax1.plot([t_mark, t_mark+1], [q1, q2], 'o-', color='#ef4444', markersize=5)
    ax1.annotate(f'+{pct:.1f}%', xy=(t_mark+0.5, (q1+q2)/2), xytext=(t_mark+0.5, (q1+q2)/2+1),
                color='#ef4444', fontsize=7)

ax1.set_xlabel('Sea surface temperature (°C)', color='white')
ax1.set_ylabel('Saturation humidity (g/kg)', color='white')
ax1.set_title('Clausius-Clapeyron: Warmer Ocean = More Moisture', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Indian Ocean SST over time
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
years = np.arange(1900, 2026)
# Trend: ~0.1°C per decade
sst_trend = 27 + 0.008 * (years - 1900) + 0.3 * np.sin(years / 10) + np.random.normal(0, 0.15, len(years))

ax2.plot(years, sst_trend, color='#ef4444', linewidth=1, alpha=0.7)
# Decadal smoothing
window = 11
smoothed = np.convolve(sst_trend, np.ones(window)/window, mode='valid')
ax2.plot(years[window//2:-window//2], smoothed, color='#ef4444', linewidth=2, label='11-year average')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Indian Ocean SST (°C)', color='white')
ax2.set_title('Indian Ocean Has Warmed ~1°C Since 1900', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# IOD effect on monsoon
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Simulated IOD index vs monsoon rainfall anomaly
n_years = 50
iod_index = np.random.normal(0, 0.5, n_years)
# Positive IOD → more rain, negative → less
rainfall_anomaly = 80 * iod_index + np.random.normal(0, 30, n_years)

colors_scatter = ['#22c55e' if r > 0 else '#ef4444' for r in rainfall_anomaly]
ax3.scatter(iod_index, rainfall_anomaly, c=colors_scatter, s=50, alpha=0.6, edgecolors='white', linewidth=0.5)
z = np.polyfit(iod_index, rainfall_anomaly, 1)
ax3.plot([-1.5, 1.5], np.polyval(z, [-1.5, 1.5]), color='#f59e0b', linewidth=2, linestyle='--')
ax3.axhline(0, color='white', linewidth=0.5, alpha=0.3)
ax3.axvline(0, color='white', linewidth=0.5, alpha=0.3)
ax3.set_xlabel('IOD index', color='white')
ax3.set_ylabel('Monsoon rainfall anomaly (mm)', color='white')
ax3.set_title('Indian Ocean Dipole vs Monsoon Rainfall', color='white', fontsize=12)
ax3.tick_params(colors='gray')
ax3.annotate('+IOD → more rain', xy=(0.8, 80), color='#22c55e', fontsize=10)
ax3.annotate('-IOD → less rain', xy=(-1.2, -100), color='#ef4444', fontsize=10)

# Future projections
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
future_years = np.arange(2025, 2101)
sst_rcp45 = 28.5 + 0.015 * (future_years - 2025) + np.random.normal(0, 0.1, len(future_years))
sst_rcp85 = 28.5 + 0.03 * (future_years - 2025) + np.random.normal(0, 0.1, len(future_years))

ax4.plot(future_years, sst_rcp45, color='#f59e0b', linewidth=2, label='Moderate emissions (SSP2-4.5)')
ax4.plot(future_years, sst_rcp85, color='#ef4444', linewidth=2, label='High emissions (SSP5-8.5)')
ax4.fill_between(future_years, sst_rcp45 - 0.5, sst_rcp45 + 0.5, alpha=0.1, color='#f59e0b')
ax4.fill_between(future_years, sst_rcp85 - 0.5, sst_rcp85 + 0.5, alpha=0.1, color='#ef4444')
ax4.set_xlabel('Year', color='white')
ax4.set_ylabel('Indian Ocean SST (°C)', color='white')
ax4.set_title('Projected Indian Ocean Warming', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Indian Ocean warming and the monsoon:")
print("  Current SST: ~28.5°C (Bay of Bengal)")
print("  Warming since 1900: ~1°C")
print("  Moisture increase: ~7% per °C")
print("  Effect: more moisture → more intense rainfall events")
print("  But also: changed circulation → more erratic monsoon")
print("\\\nThe monsoon is getting wetter AND more unpredictable.")`,
      challenge: 'Calculate: if the Indian Ocean warms by 2°C (from 28 to 30°C), how much does the saturation humidity increase? Use the Clausius-Clapeyron equation. What does this mean for flood risk in Assam?',
      successHint: 'The Indian Ocean is the monsoon\'s moisture source, and its temperature is the single most important variable for monsoon strength. Understanding the Clausius-Clapeyron relationship — more heat means exponentially more moisture — is key to understanding why climate change makes extreme rainfall more likely.',
    },
    {
      title: 'Monsoon mechanism — the seasonal wind reversal',
      concept: `The Indian monsoon is not just rain — it's a complete **reversal of wind direction** driven by differential heating of land and ocean.

**Winter (October-March): Northeast Monsoon**
- The Tibetan Plateau and Indian landmass are cold (high pressure)
- The Indian Ocean is relatively warm (low pressure)
- Wind blows from land to sea: dry, cold, northeast winds
- India is mostly dry (except Tamil Nadu, which gets rain from the retreating monsoon)

**Summer (June-September): Southwest Monsoon**
- The Tibetan Plateau and Indian landmass heat up intensely (low pressure)
- The Indian Ocean is relatively cooler (higher pressure)
- Wind reverses: moist ocean air is pulled toward the heated land
- The Somali Jet (a low-level wind maximum) channels moisture across the Arabian Sea
- Moisture-laden air crosses India from southwest to northeast
- Orographic lifting over the Western Ghats and Meghalaya Hills causes torrential rainfall

**The Tibetan Plateau's role:**
- At 4,500m elevation, it heats the atmosphere at a much higher altitude than if it were at sea level
- This "elevated heat source" creates an upper-level anticyclone that drives the monsoon circulation
- Without the Himalayas and Tibet, there would be no Indian monsoon as we know it`,
      analogy: 'The monsoon works like a gigantic sea breeze. During the day (summer), land heats up faster than the sea — sea breeze blows inland. At night (winter), land cools faster — land breeze blows seaward. The monsoon is this same mechanism scaled up to continental size and seasonal timescales. The "day" is summer, the "night" is winter, and the "breeze" is a 3-month rainstorm.',
      storyConnection: 'The monsoon "finding its way home" in the story is the southwest monsoon following its annual path from the Indian Ocean across the Arabian Sea, splitting at the Western Ghats, channeling up the Ganges plain, and reaching NE India via the Brahmaputra valley. The monsoon always takes this path because the geography (mountains, valleys, ocean) channels it like water in a riverbed.',
      checkQuestion: 'If the Tibetan Plateau didn\'t exist (imagine it was flat land at sea level), what would happen to the Indian monsoon?',
      checkAnswer: 'The monsoon would be dramatically weaker or might not exist in its current form. The Plateau does three critical things: (1) Acts as an elevated heat source, creating intense upper-level low pressure. (2) Blocks cold Siberian air from reaching India in winter. (3) Creates the upper-level anticyclone (Tibetan High) that drives the monsoon jet stream. Climate models with the Himalayas "removed" show that South Asian rainfall drops by 50-70%. The monsoon is fundamentally a mountain phenomenon.',
      codeIntro: 'Simulate the seasonal reversal of winds and its effect on moisture transport.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monsoon mechanism: seasonal wind reversal
months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Temperature: land vs ocean
land_temp = np.array([15, 18, 25, 32, 38, 36, 33, 32, 32, 28, 22, 16])  # Indian landmass
ocean_temp = np.array([26, 26, 27, 28, 29, 29, 28, 28, 28, 28, 27, 26])  # Indian Ocean
temp_diff = land_temp - ocean_temp  # positive = land warmer = monsoon

# Wind direction (u-component: positive=westerly=monsoon wind)
wind_u = temp_diff * 1.5  # simplified

# Moisture transport
moisture = np.array([5, 5, 8, 15, 25, 60, 80, 75, 55, 20, 8, 5])  # relative

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Temperature comparison
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(months, land_temp, 'o-', color='#ef4444', linewidth=2, markersize=6, label='Land (India)')
ax1.plot(months, ocean_temp, 's-', color='#3b82f6', linewidth=2, markersize=6, label='Ocean (Indian)')
ax1.fill_between(months, land_temp, ocean_temp, where=land_temp > ocean_temp, alpha=0.15, color='#ef4444', label='Land warmer (monsoon)')
ax1.fill_between(months, land_temp, ocean_temp, where=land_temp < ocean_temp, alpha=0.15, color='#3b82f6', label='Ocean warmer (dry)')
ax1.set_xticks(months)
ax1.set_xticklabels(month_names, color='white')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title('The Temperature See-Saw', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

# Wind reversal
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
colors_wind = ['#3b82f6' if w < 0 else '#ef4444' for w in wind_u]
ax2.bar(months, wind_u, color=colors_wind, alpha=0.8)
ax2.axhline(0, color='white', linewidth=0.5, alpha=0.5)
ax2.set_xticks(months)
ax2.set_xticklabels(month_names, color='white')
ax2.set_ylabel('Wind component (+ = SW monsoon, - = NE dry)', color='white')
ax2.set_title('Seasonal Wind Reversal', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.annotate('SW Monsoon\\n(wet)', xy=(7, wind_u[6]), color='#ef4444', fontsize=10, ha='center')
ax2.annotate('NE Winds\\n(dry)', xy=(1, wind_u[0]), color='#3b82f6', fontsize=10, ha='center')

# Moisture transport
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.fill_between(months, moisture, alpha=0.3, color='#22c55e')
ax3.plot(months, moisture, 'o-', color='#22c55e', linewidth=2, markersize=6)
ax3.set_xticks(months)
ax3.set_xticklabels(month_names, color='white')
ax3.set_ylabel('Moisture transport (relative)', color='white')
ax3.set_title('Moisture Transport to India', color='white', fontsize=12)
ax3.tick_params(colors='gray')

# Annotate monsoon season
ax3.axvspan(6, 9, alpha=0.1, color='#22c55e')
ax3.text(7.5, moisture.max() * 0.9, 'MONSOON\\nSEASON', color='#22c55e', fontsize=12, ha='center')

# Schematic of monsoon mechanism
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

# Draw simplified India + Ocean
# Ocean (bottom)
ax4.fill_between([0, 10], [0, 0], [2, 2], color='#3b82f6', alpha=0.2)
ax4.text(5, 1, 'Indian Ocean\\n(warm, moist)', color='#3b82f6', fontsize=10, ha='center')

# Land (middle)
ax4.fill_between([0, 10], [2, 2], [5, 5], color='#f59e0b', alpha=0.2)
ax4.text(5, 3.5, 'Indian Landmass\\n(HOT in summer)', color='#f59e0b', fontsize=10, ha='center')

# Tibet (top)
ax4.fill_between([5, 10], [5, 5], [7, 7], color='#a855f7', alpha=0.3)
ax4.text(7.5, 6, 'Tibetan Plateau\\n(4500m, heated)', color='#a855f7', fontsize=10, ha='center')

# Wind arrows (monsoon)
for y in [1.5, 2.5, 3.5]:
    ax4.annotate('', xy=(8, y+0.5), xytext=(2, y),
                arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2))

ax4.annotate('Moist SW winds\\n(monsoon)', xy=(3, 3), color='#22c55e', fontsize=10)

# Rising air over land
ax4.annotate('', xy=(5, 7), xytext=(5, 3),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))
ax4.text(4, 5.5, 'Hot air\\nrises', color='#ef4444', fontsize=9)

# Rain
for x in [3, 4, 5, 6, 7]:
    ax4.plot(x, 4.5, 'v', color='#3b82f6', markersize=8)
ax4.text(5, 4.7, 'RAIN', color='#3b82f6', fontsize=12, ha='center', fontweight='bold')

ax4.set_xlim(0, 10)
ax4.set_ylim(0, 7.5)
ax4.set_title('Monsoon Mechanism (Summer)', color='white', fontsize=12)
ax4.axis('off')

plt.tight_layout()
plt.show()

print("Indian Monsoon mechanism:")
print("  1. Sun heats Tibetan Plateau and Indian land (Apr-May)")
print("  2. Land becomes hotter than ocean → low pressure over land")
print("  3. Moist ocean air flows toward land (SW monsoon winds)")
print("  4. ITCZ shifts northward to ~25°N")
print("  5. Moisture-laden air rises over hills → condensation → rain")
print("  6. Monsoon arrives NE India by early June")
print("  7. Peak rainfall: July-August")
print("  8. Land cools in October → wind reverses → monsoon retreats")`,
      challenge: 'In the simulation, what happens if you reduce the land-ocean temperature difference by 3°C (simulating a scenario where the land doesn\'t heat as much)? How does this affect wind strength and moisture transport?',
      successHint: 'The Indian monsoon is one of the most complex and consequential weather systems on Earth. It feeds 1.4 billion people. Understanding its mechanism — differential heating, wind reversal, moisture transport, orographic lifting — is understanding the climate system that shapes South Asian life.',
    },
    {
      title: 'Monsoon prediction — reading the future in the data',
      concept: `Can we predict the monsoon months in advance? This question matters enormously — India's agriculture, water management, and disaster planning all depend on knowing whether the monsoon will be strong, normal, or weak.

**Current prediction methods:**
1. **Statistical models**: correlate monsoon rainfall with predictors like SST, snow cover, ENSO state
2. **Dynamical models**: run climate models forward in time (like weather forecasting but for seasonal averages)
3. **Hybrid models**: combine statistical relationships with dynamical model output

**Key predictors of Indian monsoon strength:**
- **ENSO (El Nino/La Nina)**: El Nino years tend to have weaker monsoons; La Nina years stronger
- **Indian Ocean Dipole**: positive IOD → stronger monsoon
- **Eurasian snow cover**: more snow in spring → cooler land → weaker monsoon
- **Pacific Decadal Oscillation**: long-term ocean temperature pattern
- **Quasi-Biennial Oscillation**: stratospheric wind pattern that affects tropical convection

**IMD issues a Long Range Forecast** every April for the June-September monsoon. Typical accuracy: ±5% of normal rainfall. This sounds modest, but ±5% of India's monsoon is the difference between abundance and crisis.`,
      analogy: 'Monsoon prediction is like forecasting a company\'s annual revenue. You can\'t predict the exact amount, but you can identify key indicators (market conditions = ENSO, customer demand = IOD, competition = snow cover) and make a probabilistic forecast. The CEO (IMD) announces: "We expect revenue within 5% of last year." Not a specific number, but enough for planning.',
      storyConnection: 'The monsoon in the story always "found its way home" — but it didn\'t always arrive on time, and it wasn\'t always the same strength. Some years the rains were heavy and the rivers flooded; other years they were weak and the crops suffered. Monsoon prediction is the science of anticipating these variations, giving farmers and communities time to prepare for what\'s coming.',
      checkQuestion: 'IMD predicts "normal monsoon" (±4% of the long-period average). A farmer asks: "Will it rain on my village in July?" Can IMD answer this?',
      checkAnswer: 'No. IMD\'s forecast is for ALL of India over the ENTIRE monsoon season (June-September). It says nothing about specific locations or specific weeks. Rainfall varies enormously within India — Cherrapunji might get 2000mm while Rajasthan gets 100mm in the same month. Seasonal forecasts predict the average, not the details. For specific locations and timing, you need short-range (1-7 day) weather forecasts.',
      codeIntro: 'Build a simple statistical monsoon prediction model using SST and ENSO data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified monsoon prediction model
# Predictors: ENSO index, IOD, Eurasian snow anomaly
n_years = 50
years = np.arange(1975, 2025)

# Generate predictor data
enso = np.random.normal(0, 0.8, n_years)  # El Nino index
iod = np.random.normal(0, 0.4, n_years)   # IOD index
snow = np.random.normal(0, 0.5, n_years)   # snow anomaly

# True monsoon rainfall anomaly (mm, relative to normal)
# Monsoon = a + b*ENSO + c*IOD + d*Snow + noise
true_rainfall = (-50 * enso + 80 * iod - 40 * snow +
                 np.random.normal(0, 30, n_years))

# Normal rainfall
normal = 880  # mm (JJAS all-India average)
actual = normal + true_rainfall

# Prediction model (linear regression using available predictors)
# Using data through year Y-1 to predict year Y
X = np.column_stack([enso, iod, snow, np.ones(n_years)])
coeffs = np.linalg.lstsq(X[:-10], true_rainfall[:-10], rcond=None)[0]
predicted = X @ coeffs
predicted_rainfall = normal + predicted

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Actual vs predicted
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(years, actual, 'o-', color='#3b82f6', linewidth=1.5, markersize=4, label='Actual')
ax1.plot(years, predicted_rainfall, 's--', color='#ef4444', linewidth=1.5, markersize=4, label='Predicted')
ax1.axhline(normal, color='white', linestyle=':', alpha=0.3, label=f'Normal ({normal} mm)')
ax1.fill_between(years, normal - 0.1*normal, normal + 0.1*normal, alpha=0.1, color='white')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('JJAS rainfall (mm)', color='white')
ax1.set_title('Monsoon Rainfall: Actual vs Predicted', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Scatter: predicted vs actual
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.scatter(predicted_rainfall, actual, color='#f59e0b', s=40, alpha=0.6, edgecolors='white', linewidth=0.5)
min_val = min(actual.min(), predicted_rainfall.min()) - 20
max_val = max(actual.max(), predicted_rainfall.max()) + 20
ax2.plot([min_val, max_val], [min_val, max_val], '--', color='white', alpha=0.3, label='Perfect forecast')
r2 = 1 - np.sum((actual - predicted_rainfall)**2) / np.sum((actual - np.mean(actual))**2)
ax2.set_xlabel('Predicted rainfall (mm)', color='white')
ax2.set_ylabel('Actual rainfall (mm)', color='white')
ax2.set_title(f'Prediction Skill (R² = {r2:.2f})', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# ENSO vs monsoon
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
colors_enso = ['#ef4444' if e > 0.5 else '#3b82f6' if e < -0.5 else 'gray' for e in enso]
ax3.scatter(enso, true_rainfall, c=colors_enso, s=50, alpha=0.6, edgecolors='white', linewidth=0.5)
z = np.polyfit(enso, true_rainfall, 1)
ax3.plot([-2, 2], np.polyval(z, [-2, 2]), color='#f59e0b', linewidth=2, linestyle='--')
ax3.axhline(0, color='white', linewidth=0.5, alpha=0.3)
ax3.axvline(0, color='white', linewidth=0.5, alpha=0.3)
ax3.set_xlabel('ENSO index (+ = El Nino)', color='white')
ax3.set_ylabel('Rainfall anomaly (mm)', color='white')
ax3.set_title('El Nino Suppresses the Monsoon', color='white', fontsize=12)
ax3.annotate('El Nino\\n(drought risk)', xy=(1.5, -80), color='#ef4444', fontsize=10, ha='center')
ax3.annotate('La Nina\\n(flood risk)', xy=(-1.5, 80), color='#3b82f6', fontsize=10, ha='center')
ax3.tick_params(colors='gray')

# Prediction skill by category
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Categorize: below normal (<90%), normal (90-110%), above normal (>110%)
categories = []
pred_categories = []
for a, p in zip(actual, predicted_rainfall):
    if a < normal * 0.9: categories.append('Deficit')
    elif a > normal * 1.1: categories.append('Excess')
    else: categories.append('Normal')

    if p < normal * 0.9: pred_categories.append('Deficit')
    elif p > normal * 1.1: pred_categories.append('Excess')
    else: pred_categories.append('Normal')

# Confusion matrix
cats = ['Deficit', 'Normal', 'Excess']
confusion = np.zeros((3, 3))
for true, pred in zip(categories, pred_categories):
    confusion[cats.index(true), cats.index(pred)] += 1

im = ax4.imshow(confusion, cmap='YlOrRd', interpolation='nearest')
plt.colorbar(im, ax=ax4, shrink=0.8)
ax4.set_xticks(range(3))
ax4.set_yticks(range(3))
ax4.set_xticklabels(cats, color='white')
ax4.set_yticklabels(cats, color='white')
ax4.set_xlabel('Predicted category', color='white')
ax4.set_ylabel('Actual category', color='white')
ax4.set_title('Prediction Accuracy by Category', color='white', fontsize=12)
ax4.tick_params(colors='gray')

for i in range(3):
    for j in range(3):
        ax4.text(j, i, f'{int(confusion[i,j])}', ha='center', va='center', color='white', fontsize=14)

accuracy = np.diag(confusion).sum() / confusion.sum() * 100

plt.tight_layout()
plt.show()

print(f"Prediction model:")
print(f"  Predictors: ENSO, IOD, Eurasian snow")
print(f"  R² = {r2:.2f} (explains {r2*100:.0f}% of variance)")
print(f"  Category accuracy: {accuracy:.0f}%")
print(f"\\\nModel coefficients:")
print(f"  ENSO: {coeffs[0]:.1f} mm per unit (El Nino → less rain)")
print(f"  IOD: {coeffs[1]:.1f} mm per unit (positive IOD → more rain)")
print(f"  Snow: {coeffs[2]:.1f} mm per unit (more snow → less rain)")`,
      challenge: 'Add a new predictor: Pacific Decadal Oscillation (PDO). Generate PDO data and add it to the regression. Does the R² improve? At what point does adding more predictors risk overfitting?',
      successHint: 'Monsoon prediction is where atmospheric science meets decision-making. A good seasonal forecast gives farmers, water managers, and disaster planners the lead time they need to prepare. The models are imperfect, but even modest skill saves lives and livelihoods. The monsoon always finds its way home — the question is when, and how strong.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Climate Patterns & Jet Streams — no prior science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for climate simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
