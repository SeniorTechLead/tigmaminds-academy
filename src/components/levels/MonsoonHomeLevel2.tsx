import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MonsoonHomeLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Sea surface temperature data — reading the ocean\'s thermostat',
      concept: `The monsoon is driven by temperature differences between land and ocean. To predict it, we need precise **sea surface temperature (SST)** measurements.

**How SST is measured:**
- **Ships and buoys**: thermometers in seawater
- **Argo floats**: 4,000 robotic floats diving to 2,000m
- **Satellites**: infrared sensors (1 km resolution, blocked by clouds)
- **Microwave sensors**: see through clouds (lower resolution)

**What SST tells us about the monsoon:**
- Bay of Bengal > 28°C: sufficient for deep convection
- Equatorial Pacific warm (El Nino): weaker monsoon
- Arabian Sea warm anomaly: stronger Somali Jet, more moisture`,
      analogy: 'SST data is like a thermal camera for the ocean. A "hot spot" in the Bay of Bengal powers thunderstorms; a "cold spot" in the equatorial Pacific signals El Nino and monsoon weakness.',
      storyConnection: 'The monsoon in the story draws moisture from the warm Indian Ocean. Measuring that warmth precisely is how meteorologists know whether the monsoon will be strong or weak months before it arrives.',
      checkQuestion: 'Why is SST measured at the surface rather than at depth?',
      checkAnswer: 'Because evaporation happens at the surface — the ocean-atmosphere interface. A warm surface drives evaporation regardless of what\'s below. However, depth of warm water matters for cyclones: if warm water extends to 50m, a cyclone stays strong; shallow warm water gets mixed away.',
      codeIntro: 'Analyze SST patterns in the Indian Ocean and their relationship to monsoon strength.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

lons = np.linspace(40, 100, 60); lats = np.linspace(-20, 30, 50)
LON, LAT = np.meshgrid(lons, lats)
sst_base = 26 + 3 * np.exp(-((LON - 85)**2 / 200 + (LAT - 5)**2 / 100))
sst_june = sst_base + 1.5 * np.exp(-((LAT - 10)**2 / 50))
sst_august = sst_base + 0.5 - 1.5 * np.exp(-((LON - 50)**2 / 30 + (LAT - 5)**2 / 30)) - 0.5 * np.exp(-((LON - 87)**2 / 30 + (LAT - 15)**2 / 30))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
cs = ax1.contourf(LON, LAT, sst_june, levels=np.arange(24, 31, 0.5), cmap='RdYlBu_r')
plt.colorbar(cs, ax=ax1, label='SST (°C)')
ax1.contour(LON, LAT, sst_june, levels=[28], colors='white', linewidths=1.5)
ax1.set_title('June SST (Pre-Monsoon)', color='white', fontsize=12)
ax1.set_xlabel('Longitude', color='white'); ax1.set_ylabel('Latitude', color='white')
ax1.tick_params(colors='gray')

ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
cs = ax2.contourf(LON, LAT, sst_august, levels=np.arange(24, 31, 0.5), cmap='RdYlBu_r')
plt.colorbar(cs, ax=ax2, label='SST (°C)')
ax2.set_title('August SST (Peak Monsoon)', color='white', fontsize=12)
ax2.set_xlabel('Longitude', color='white'); ax2.tick_params(colors='gray')
ax2.annotate('Somali upwelling', xy=(50, 5), color='white', fontsize=8, ha='center')

ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
months = np.arange(1, 13); month_names = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
bob_sst = [26.5, 27, 28, 29, 30, 29.5, 28.5, 28, 28.5, 28.5, 27.5, 26.5]
arab_sst = [25, 25.5, 27, 28.5, 29.5, 28, 27, 26.5, 27, 28, 27, 25.5]
ax3.plot(months, bob_sst, 'o-', color='#ef4444', linewidth=2, label='Bay of Bengal')
ax3.plot(months, arab_sst, 's-', color='#3b82f6', linewidth=2, label='Arabian Sea')
ax3.axhline(28, color='#f59e0b', linestyle='--', alpha=0.5, label='Convection threshold')
ax3.set_xticks(months); ax3.set_xticklabels(month_names, color='white')
ax3.set_ylabel('SST (°C)', color='white')
ax3.set_title('SST Annual Cycle', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8); ax3.tick_params(colors='gray')

ax4 = axes[1, 1]; ax4.set_facecolor('#111827')
n_years = 40
bob_anomaly = np.random.normal(0, 0.4, n_years)
monsoon_anomaly = 30 * bob_anomaly + np.random.normal(0, 40, n_years)
ax4.scatter(bob_anomaly, monsoon_anomaly, c=bob_anomaly, cmap='RdBu_r', s=50, edgecolors='white', linewidth=0.5)
z = np.polyfit(bob_anomaly, monsoon_anomaly, 1)
ax4.plot([-1.5, 1.5], np.polyval(z, [-1.5, 1.5]), color='#f59e0b', linewidth=2, linestyle='--')
ax4.axhline(0, color='white', linewidth=0.5, alpha=0.3); ax4.axvline(0, color='white', linewidth=0.5, alpha=0.3)
ax4.set_xlabel('BoB SST anomaly (°C)', color='white'); ax4.set_ylabel('Monsoon anomaly (mm)', color='white')
ax4.set_title('Warm Bay = More Rain', color='white', fontsize=12); ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("SST-Monsoon connections:")
print("  Bay of Bengal >28°C: triggers deep convection")
print("  Arabian Sea warm: strengthens Somali Jet")
print("  Equatorial Pacific warm (El Nino): weakens monsoon")`,
      challenge: 'The Indian Ocean has warmed 1°C since 1900. Add this trend and recalculate how many months per year the Bay of Bengal exceeds 28°C. Has the convection season lengthened?',
      successHint: 'SST data is the raw material of monsoon prediction. Every seasonal forecast starts with SST analysis.',
    },
    {
      title: 'Teleconnections — El Nino\'s reach across the globe',
      concept: `The monsoon over Assam is affected by ocean temperatures 15,000 km away in the Pacific. This long-distance link is called a **teleconnection**.

**ENSO (El Nino-Southern Oscillation):**
- **El Nino**: warm Pacific → shifts rising air eastward → suppresses Indian monsoon
- **La Nina**: cool Pacific → stronger monsoon
- **Mechanism**: warm Pacific shifts the Walker circulation, creating descending air over India

**Other teleconnections:**
- **IOD**: can amplify or counteract ENSO
- **MJO**: 30-60 day intraseasonal oscillation
- **PDO**: 20-30 year Pacific cycle`,
      analogy: 'Teleconnections are like dominoes. An El Nino event in the Pacific shifts circulation over Indonesia, changes the Walker circulation over the Indian Ocean, and weakens the monsoon over India. The Pacific "sneeze" and India "catches a cold."',
      storyConnection: 'The monsoon arrives faithfully every year but varies in strength. In El Nino years, the Pacific "steals" atmospheric energy from the Indian monsoon. In La Nina years, the monsoon arrives supercharged.',
      checkQuestion: 'The 2015 El Nino caused 14% below-normal monsoon rainfall. The 1997 El Nino (also very strong) saw only 2% below-normal. Why?',
      checkAnswer: 'In 1997, a strong positive IOD counteracted El Nino — warm western Indian Ocean boosted moisture transport. In 2015, the IOD was neutral, so there was no compensating factor. Multiple teleconnections interact; ENSO alone doesn\'t determine the monsoon.',
      codeIntro: 'Map the ENSO teleconnection to the Indian monsoon and explore multi-factor interactions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_years = 70; years = np.arange(1955, 2025)
enso = np.random.normal(0, 0.8, n_years)
iod = np.random.normal(0, 0.4, n_years) + 0.2 * enso
monsoon_rainfall = 880 + (-45 * enso + 70 * iod + np.random.normal(0, 35, n_years))
el_nino = enso > 0.5; la_nina = enso < -0.5; neutral = ~(el_nino | la_nina)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
ax1.fill_between(years, 0, enso, where=enso > 0.5, alpha=0.4, color='#ef4444', label='El Nino')
ax1.fill_between(years, 0, enso, where=enso < -0.5, alpha=0.4, color='#3b82f6', label='La Nina')
ax1.fill_between(years, 0, enso, where=neutral, alpha=0.2, color='gray', label='Neutral')
ax1.plot(years, enso, color='white', linewidth=1)
ax1.set_xlabel('Year', color='white'); ax1.set_ylabel('ENSO index', color='white')
ax1.set_title('ENSO Time Series', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax1.tick_params(colors='gray')

ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
bp = ax2.boxplot([monsoon_rainfall[el_nino], monsoon_rainfall[neutral], monsoon_rainfall[la_nina]],
                labels=['El Nino', 'Neutral', 'La Nina'], patch_artist=True, widths=0.5)
for patch, color in zip(bp['boxes'], ['#ef4444', 'gray', '#3b82f6']): patch.set_facecolor(color); patch.set_alpha(0.5)
for e in bp['whiskers'] + bp['caps']: e.set_color('white')
for m in bp['medians']: m.set_color('#f59e0b'); m.set_linewidth(2)
ax2.axhline(880, color='white', linestyle=':', alpha=0.3)
ax2.set_ylabel('JJAS rainfall (mm)', color='white')
ax2.set_title('Monsoon by ENSO Phase', color='white', fontsize=12); ax2.tick_params(colors='gray')

ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
sc = ax3.scatter(enso, iod, c=monsoon_rainfall, cmap='RdYlGn', s=50, edgecolors='white', linewidth=0.5)
plt.colorbar(sc, ax=ax3, label='Rainfall (mm)')
ax3.axhline(0, color='white', linewidth=0.5, alpha=0.3); ax3.axvline(0, color='white', linewidth=0.5, alpha=0.3)
ax3.set_xlabel('ENSO index', color='white'); ax3.set_ylabel('IOD index', color='white')
ax3.set_title('ENSO-IOD Interaction', color='white', fontsize=12); ax3.tick_params(colors='gray')
ax3.text(1, 0.6, 'Mixed', color='#f59e0b', fontsize=9, ha='center')
ax3.text(1, -0.6, 'DROUGHT', color='#ef4444', fontsize=9, ha='center')
ax3.text(-1, 0.6, 'FLOOD', color='#3b82f6', fontsize=9, ha='center')

ax4 = axes[1, 1]; ax4.set_facecolor('#111827'); ax4.axis('off')
ax4.text(0.5, 0.95, 'Walker Circulation & Monsoon', color='white', fontsize=12, transform=ax4.transAxes, ha='center', fontweight='bold')
ax4.text(0.1, 0.75, 'NORMAL: Rising over Indian Ocean → Strong monsoon', color='#22c55e', fontsize=10, transform=ax4.transAxes)
ax4.text(0.1, 0.55, 'EL NINO: Rising shifts to Pacific → Sinking over India → Weak monsoon', color='#ef4444', fontsize=10, transform=ax4.transAxes)
ax4.text(0.1, 0.35, 'LA NINA: Enhanced rising over Indian Ocean → Strong monsoon', color='#3b82f6', fontsize=10, transform=ax4.transAxes)
ax4.text(0.1, 0.15, f'Correlation ENSO-Monsoon: {np.corrcoef(enso, monsoon_rainfall)[0,1]:.2f}', color='#f59e0b', fontsize=11, transform=ax4.transAxes)

plt.tight_layout()
plt.show()

print(f"El Nino years: mean = {np.mean(monsoon_rainfall[el_nino]):.0f} mm")
print(f"Neutral years: mean = {np.mean(monsoon_rainfall[neutral]):.0f} mm")
print(f"La Nina years: mean = {np.mean(monsoon_rainfall[la_nina]):.0f} mm")`,
      challenge: 'The 2019 monsoon had both a weak El Nino AND a positive IOD. Predict the rainfall using the model. The actual was 10% above normal. Does the model capture this?',
      successHint: 'Teleconnections reveal that Earth\'s climate is a single connected system. What happens in the Pacific reaches India within weeks.',
    },
    {
      title: 'Climate oscillations — the monsoon\'s rhythm',
      concept: `The monsoon oscillates on multiple timescales. These **climate oscillations** modulate monsoon strength:

1. **MJO (30-60 days)**: active/break phases within a season
2. **QBO (~28 months)**: stratospheric wind alternation
3. **ENSO (2-7 years)**: Pacific temperature cycle
4. **IOD (1-2 year events)**: Indian Ocean temperature pattern
5. **PDO (20-30 years)**: Pacific decadal pattern
6. **AMO (60-80 years)**: Atlantic multidecadal pattern

Each oscillation is like a radio frequency the monsoon "listens" to simultaneously. When multiple channels reinforce, extremes result.`,
      analogy: 'Climate oscillations are like radio frequencies. The monsoon listens to the MJO channel (30-60 days), the ENSO channel (2-7 years), and the PDO channel (20-30 years). When all channels send "loud" signals at once, the monsoon responds dramatically.',
      storyConnection: 'The monsoon in the story always comes, but it\'s never exactly the same. The 30-60 day breaks within the season are the MJO\'s signature — something farmers notice as "the rains paused for a fortnight, then returned."',
      checkQuestion: 'The monsoon has "active" and "break" phases — 2-3 weeks of rain followed by 1-2 weeks of dry. What causes these?',
      checkAnswer: 'The MJO. This 30-60 day pulse of enhanced convection circles the tropics. When the MJO\'s active phase is over the Indian Ocean, monsoon intensifies. When it moves to the Pacific, India experiences a "break." These are the monsoon\'s natural rhythm.',
      codeIntro: 'Decompose monsoon rainfall into its oscillatory components.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_days = 365 * 30; days = np.arange(n_days)
annual = 8 * np.sin(2 * np.pi * days / 365 - np.pi/3)
mjo = 3 * np.sin(2 * np.pi * days / 40) * (1 + 0.5 * np.sin(2 * np.pi * days / 365 - np.pi/3))
enso_signal = 4 * np.sin(2 * np.pi * days / (3.5 * 365))
decadal = 2 * np.sin(2 * np.pi * days / (15 * 365))
rainfall = np.maximum(0, 5 + annual + mjo - enso_signal + decadal + np.random.normal(0, 2, n_days))
month_of_year = (days % 365) / 30.44
rainfall[month_of_year < 5] *= 0.1; rainfall[month_of_year > 9] *= 0.1

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
year_5 = rainfall[5*365:6*365]
ax1.fill_between(range(365), year_5, alpha=0.4, color='#3b82f6')
ax1.plot(range(365), year_5, color='#3b82f6', linewidth=0.5)
for d in range(150, 270, 40):
    ax1.axvspan(d, d+20, alpha=0.1, color='#22c55e')
    ax1.axvspan(d+20, d+40, alpha=0.1, color='#ef4444')
ax1.set_xlabel('Day of year', color='white'); ax1.set_ylabel('Rainfall (mm/day)', color='white')
ax1.set_title('Daily Rainfall with Active/Break Phases', color='white', fontsize=12); ax1.tick_params(colors='gray')

ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
jjas_indices = (month_of_year >= 5) & (month_of_year <= 9)
jjas_rain = rainfall[jjas_indices]
n_fft = min(4096, len(jjas_rain))
fft_vals = np.abs(np.fft.fft(jjas_rain[:n_fft]))**2
freqs = np.fft.fftfreq(n_fft, d=1)
periods = 1 / np.abs(freqs[1:n_fft//2])
window = 5
smoothed = np.convolve(fft_vals[1:n_fft//2], np.ones(window)/window, mode='valid')
ax2.semilogy(periods[window//2:-window//2], smoothed, color='#f59e0b', linewidth=2)
for period, label, color in [(40, 'MJO', '#22c55e'), (365, 'Annual', '#3b82f6'), (365*3.5, 'ENSO', '#ef4444')]:
    if period < periods.max():
        ax2.axvline(period, color=color, linestyle='--', alpha=0.5)
        ax2.text(period * 1.1, smoothed.max() * 0.5, label, color=color, fontsize=8)
ax2.set_xlabel('Period (days)', color='white'); ax2.set_ylabel('Power', color='white')
ax2.set_title('Spectral Analysis', color='white', fontsize=12); ax2.set_xlim(10, 5000); ax2.tick_params(colors='gray')

ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
annual_totals = [rainfall[y*365+150:y*365+270].sum() for y in range(30)]
ax3.bar(range(30), annual_totals, color='#3b82f6', alpha=0.7)
mean_total = np.mean(annual_totals)
ax3.axhline(mean_total, color='#f59e0b', linestyle='--', linewidth=2, label=f'Mean: {mean_total:.0f} mm')
ax3.set_xlabel('Year', color='white'); ax3.set_ylabel('JJAS rainfall (mm)', color='white')
ax3.set_title('30-Year Monsoon Variability', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax3.tick_params(colors='gray')

ax4 = axes[1, 1]; ax4.set_facecolor('#111827')
t = np.arange(365 * 3)
ax4.plot(t/365, 8 * np.sin(2*np.pi*t/365 - np.pi/3), color='#3b82f6', linewidth=1.5, label='Annual', alpha=0.7)
ax4.plot(t/365, 3 * np.sin(2*np.pi*t/40) * (1+0.5*np.sin(2*np.pi*t/365-np.pi/3)), color='#22c55e', linewidth=1, label='MJO', alpha=0.5)
ax4.plot(t/365, 4 * np.sin(2*np.pi*t/(3.5*365)), color='#ef4444', linewidth=1.5, label='ENSO', alpha=0.7)
ax4.set_xlabel('Year', color='white'); ax4.set_ylabel('Anomaly (mm/day)', color='white')
ax4.set_title('Multi-Scale Decomposition', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7); ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate oscillations affecting the monsoon:")
print("  MJO: 30-60 day → active/break phases")
print("  ENSO: 2-7 years → year-to-year strength")
print("  PDO: 20-30 years → decadal trends")`,
      challenge: 'Filter the data to isolate just the MJO signal (30-60 day bandpass). Count active/break phases per season. Is it always 3-4 of each?',
      successHint: 'Climate oscillations are the heartbeat of the Earth system. Understanding them is like understanding the frequencies in music — each instrument contributes to the overall sound.',
    },
    {
      title: 'Monsoon variability — why no two monsoons are alike',
      concept: `India receives about 880 mm during June-September. But individual years range from 650 mm (drought) to 1,100 mm (floods). Climate change is not simply making the monsoon wetter or drier — it's making it more **variable** and more **extreme**.

**Trends:**
- Total rainfall: no clear trend (slight decline since 1950)
- Extreme events: INCREASING (more intense single-day rainfall)
- Dry spells: INCREASING (longer breaks between rain events)
- Onset: more variable

The same total rainfall arrives in fewer, more intense bursts — causing both floods AND water shortages in the same season.`,
      analogy: 'Monsoon variability is like salary variability. A salaried worker gets steady paychecks (reliable monsoon). A freelancer gets nothing for weeks, then a huge payment (extreme events). Both earn the same total, but the freelancer\'s life is harder to manage. The monsoon is becoming more "freelance."',
      storyConnection: 'The monsoon in the story arrives reliably. But in real life, increasing variability means communities must prepare not for an "average" monsoon but for a wider range of possibilities.',
      checkQuestion: 'Total monsoon rainfall hasn\'t changed much in 100 years. Does this mean climate change hasn\'t affected the monsoon?',
      checkAnswer: 'No. Looking at totals hides real changes: (1) More intense single-day events (up 12%/decade). (2) Longer dry spells. (3) Later onset. (4) More spatial variability. The distribution in time and space has become much less uniform.',
      codeIntro: 'Analyze monsoon variability trends: totals, extremes, and distribution changes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_years = 100; years = np.arange(1925, 2025)
total_rainfall = 880 - 0.3 * (years - 1975) + np.random.normal(0, 50, n_years)
extreme_days = 5 + 0.05 * (years - 1925) + np.random.normal(0, 1.5, n_years)
dry_spells = 7 + 0.03 * (years - 1925) + np.random.normal(0, 2, n_years)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
colors_rain = ['#ef4444' if r < 880*0.9 else '#3b82f6' if r > 880*1.1 else '#22c55e' for r in total_rainfall]
ax1.bar(years, total_rainfall, color=colors_rain, alpha=0.6)
z = np.polyfit(years, total_rainfall, 1)
ax1.plot(years, np.polyval(z, years), color='#f59e0b', linewidth=2, label=f'Trend: {z[0]:.1f} mm/yr')
ax1.axhline(880, color='white', linestyle=':', alpha=0.3)
ax1.set_xlabel('Year', color='white'); ax1.set_ylabel('JJAS rainfall (mm)', color='white')
ax1.set_title('Total Rainfall', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8); ax1.tick_params(colors='gray')

ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
ax2.scatter(years, extreme_days, color='#ef4444', s=20, alpha=0.5)
z_ext = np.polyfit(years, extreme_days, 1)
ax2.plot(years, np.polyval(z_ext, years), color='#ef4444', linewidth=2, label=f'+{z_ext[0]:.2f} days/yr')
window = 11
running = np.convolve(extreme_days, np.ones(window)/window, mode='valid')
ax2.plot(years[window//2:-window//2], running, color='#f59e0b', linewidth=2, label='11-yr avg')
ax2.set_xlabel('Year', color='white'); ax2.set_ylabel('Days >100mm', color='white')
ax2.set_title('Extreme Events: INCREASING', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8); ax2.tick_params(colors='gray')

ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
ax3.scatter(years, dry_spells, color='#f59e0b', s=20, alpha=0.5)
z_dry = np.polyfit(years, dry_spells, 1)
ax3.plot(years, np.polyval(z_dry, years), color='#f59e0b', linewidth=2, label=f'+{z_dry[0]:.2f} days/yr')
ax3.set_xlabel('Year', color='white'); ax3.set_ylabel('Max dry spell (days)', color='white')
ax3.set_title('Dry Spells: INCREASING', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax3.tick_params(colors='gray')

ax4 = axes[1, 1]; ax4.set_facecolor('#111827')
days_season = 122
old_rain = np.random.exponential(7, days_season)
new_rain = np.zeros(days_season)
for start in [10, 35, 55, 80, 100]:
    bl = np.random.randint(3, 8)
    new_rain[start:start+bl] = np.random.exponential(25, bl)
new_rain = new_rain * old_rain.sum() / (new_rain.sum() + 0.001)
ax4.bar(range(days_season), old_rain, color='#22c55e', alpha=0.5, label='Past (steady)')
ax4.bar(range(days_season), -new_rain, color='#ef4444', alpha=0.5, label='Now (extreme+dry)')
ax4.axhline(0, color='white', linewidth=0.5)
ax4.set_xlabel('Day of season', color='white'); ax4.set_ylabel('Rainfall (mm/day)', color='white')
ax4.set_title(f'Same Total ({old_rain.sum():.0f}mm), Different Pattern', color='white', fontsize=11)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Trends: total {z[0]:.1f} mm/yr, extremes +{z_ext[0]:.2f} days/yr, dry spells +{z_dry[0]:.2f} days/yr")
print("The monsoon is becoming more EXTREME, not simply wetter or drier.")`,
      challenge: 'Calculate the 30-year running standard deviation. Is variability itself increasing?',
      successHint: 'The shift toward more extreme events within the same seasonal total is one of climate change\'s most consequential impacts — and least visible in average statistics.',
    },
    {
      title: 'Climate projections — the monsoon in 2100',
      concept: `**IPCC projections for the Indian monsoon (AR6):**
- Total rainfall: likely INCREASE (5-20% depending on emissions)
- Extreme events: increase FASTER than mean (20-30% more intense)
- Dry spells: also lengthen (10-15%)
- Onset: more variable

**Why more rain AND more drought:**
- Clausius-Clapeyron: warmer air holds more moisture → more rain when it rains
- Weakened circulation: reduced land-sea contrast → weaker monsoon pull
- Net: intensifies when active, stalls more frequently`,
      analogy: 'The future monsoon is like a faucet with a broken handle. Instead of steady flow, you get alternating bursts (flooding) and trickles (drought). The total water might be the same, but the uneven flow makes it much harder to fill your bucket.',
      storyConnection: 'The monsoon will still come home — but it may arrive late, deliver rain in violent bursts, and leave gaps that stress crops. Communities must adapt to a more volatile monsoon.',
      checkQuestion: 'If total rainfall and extreme events both increase, but so do dry spells, is this net positive or negative for agriculture?',
      checkAnswer: 'Net negative for current practices. Intense bursts cause waterlogging; longer dry spells stress crops. Adaptation requires: flood-resistant varieties, better drainage, water storage for dry gaps, and flexible planting calendars.',
      codeIntro: 'Compare current and projected monsoon patterns and their agricultural impacts.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
current = np.array([20, 30, 80, 180, 350, 500, 450, 380, 300, 150, 40, 15])
projected_2050 = current * np.array([1.0, 1.0, 0.9, 1.05, 1.1, 1.15, 1.12, 1.1, 1.08, 1.05, 1.0, 1.0])
projected_2100 = current * np.array([0.95, 0.95, 0.85, 1.1, 1.2, 1.25, 1.2, 1.18, 1.15, 1.1, 0.95, 0.9])

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
x = np.arange(12)
ax1.bar(x - 0.2, current, width=0.2, color='#22c55e', alpha=0.8, label='Current')
ax1.bar(x, projected_2050, width=0.2, color='#f59e0b', alpha=0.8, label='2050')
ax1.bar(x + 0.2, projected_2100, width=0.2, color='#ef4444', alpha=0.8, label='2100')
ax1.set_xticks(x); ax1.set_xticklabels(month_names, color='white')
ax1.set_ylabel('Rainfall (mm)', color='white')
ax1.set_title('NE India Rainfall Projections', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8); ax1.tick_params(colors='gray')

ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
current_daily = np.concatenate([np.random.exponential(15, 10000), np.random.pareto(2, 100) * 50 + 100])
future_daily = np.concatenate([np.random.exponential(18, 10000), np.random.pareto(1.5, 200) * 70 + 100])
bins = np.arange(0, 300, 5)
ax2.hist(current_daily, bins=bins, color='#22c55e', alpha=0.5, label='Current', density=True)
ax2.hist(future_daily, bins=bins, color='#ef4444', alpha=0.5, label='2100', density=True)
ax2.axvline(100, color='#f59e0b', linestyle='--', label='Extreme (100mm)')
ax2.set_xlabel('Daily rainfall (mm)', color='white'); ax2.set_ylabel('Density', color='white')
ax2.set_title('Daily Rainfall: Fatter Tails', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.set_xlim(0, 250); ax2.tick_params(colors='gray')

ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
crop_need = np.array([0, 0, 10, 50, 80, 100, 120, 100, 80, 40, 0, 0])
drainage = 200
excess_current = np.maximum(0, current - crop_need - drainage)
excess_2100 = np.maximum(0, projected_2100 - crop_need - drainage)
deficit_current = np.maximum(0, crop_need - current)
deficit_2100 = np.maximum(0, crop_need - projected_2100)
ax3.bar(x - 0.15, deficit_current, width=0.3, color='#f59e0b', alpha=0.8, label='Deficit (now)')
ax3.bar(x + 0.15, deficit_2100, width=0.3, color='#ef4444', alpha=0.8, label='Deficit (2100)')
ax3.bar(x - 0.15, -excess_current, width=0.3, color='#3b82f6', alpha=0.5)
ax3.bar(x + 0.15, -excess_2100, width=0.3, color='#a855f7', alpha=0.5)
ax3.axhline(0, color='white', linewidth=0.5)
ax3.set_xticks(x); ax3.set_xticklabels(month_names, color='white')
ax3.set_ylabel('Deficit (+) / Excess (-) mm', color='white')
ax3.set_title('Water Balance: Surplus AND Deficit', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8); ax3.tick_params(colors='gray')

ax4 = axes[1, 1]; ax4.set_facecolor('#111827'); ax4.axis('off')
strategies = [
    ('Flood-resistant rice (Sub1)', '#22c55e'), ('Micro-irrigation for dry spells', '#3b82f6'),
    ('Rainwater harvesting', '#f59e0b'), ('Flexible planting calendar', '#a855f7'),
    ('Weather-indexed crop insurance', '#ef4444'), ('MJO-based 2-week forecasts', '#ec4899'),
]
ax4.text(0.05, 0.95, 'Adaptation Strategies for NE India', color='white', fontsize=13, transform=ax4.transAxes, fontweight='bold')
for i, (s, c) in enumerate(strategies):
    ax4.text(0.08, 0.8 - i * 0.12, f'  {s}', color=c, fontsize=11, transform=ax4.transAxes)

plt.tight_layout()
plt.show()

print(f"JJAS totals: Current {sum(current[5:10]):.0f}, 2050 {sum(projected_2050[5:10]):.0f}, 2100 {sum(projected_2100[5:10]):.0f} mm")
print(f"Extreme days (>100mm): current {(current_daily>100).sum()/len(current_daily)*100:.1f}%, 2100 {(future_daily>100).sum()/len(future_daily)*100:.1f}%")`,
      challenge: 'Design a "monsoon readiness score" combining rainfall change, extreme frequency, dry spell length, and onset variability into a single 0-100 index.',
      successHint: 'Climate projections show the monsoon becoming more extreme. Understanding these projections is essential for agriculture, water management, and disaster planning in monsoon-dependent regions.',
    },
    {
      title: 'Impact on agriculture — feeding 1.4 billion in a changing monsoon',
      concept: `The monsoon grows 55% of India's food. Changes to the monsoon directly impact food security for 1.4 billion people.

**How monsoon changes affect crops:**
- Late onset: delays sowing → reduced growing season
- Early withdrawal: insufficient water during grain-filling
- Extreme rainfall: waterlogging destroys standing crops
- Dry spells: water stress during critical growth stages

**Adaptation imperative:**
- Current varieties were bred for 20th-century patterns
- 21st-century patterns require new varieties, new practices, new infrastructure
- The gap between changing climate and adapting agriculture is growing`,
      analogy: 'Monsoon agriculture is like a relay race where the handoff timing keeps changing. Current varieties are trained for a predictable starting gun; the new monsoon fires unpredictably. Adaptation means training runners who can handle any starting signal.',
      storyConnection: 'The monsoon\'s arrival transforms Assam — rivers fill, fields green. But when the monsoon changes, so must the agriculture built around it. Communities must prepare for a monsoon that no longer behaves as their grandparents knew it.',
      checkQuestion: 'A farmer\'s rice variety needs 120 days and 800mm. Projections show the same rain concentrated in 80 days instead of 120. Can the farmer continue?',
      checkAnswer: 'No. Intense bursts cause waterlogging; dry gaps cause stress. Solutions: switch to flood-tolerant variety (Swarna-Sub1), build drainage, invest in small irrigation. The variety that worked for 30 years won\'t work for the next 30.',
      codeIntro: 'Model rice crop response to different monsoon scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

stages = [('Seedling', 30, 0.6), ('Tillering', 30, 0.8), ('Flowering', 20, 1.0), ('Grain-fill', 40, 0.7)]
daily_need = np.zeros(120); sensitivity = np.zeros(120); d = 0
needs = [5, 8, 10, 6]
for i, (name, dur, sens) in enumerate(stages):
    daily_need[d:d+dur] = needs[i]; sensitivity[d:d+dur] = sens; d += dur

def gen_scenario(pattern, total=800):
    rain = np.zeros(120)
    if pattern == 'steady': rain = np.random.exponential(total/120, 120); rain *= total/rain.sum()
    elif pattern == 'burst':
        for s in [10, 45, 80]: rain[s:s+10] = total/30 + np.random.normal(0, 3, 10)
    elif pattern == 'late': rain[30:] = np.random.exponential(total/90, 90); rain *= total/(rain.sum()+0.001)
    elif pattern == 'early': rain[:90] = np.random.exponential(total/90, 90); rain *= total/(rain.sum()+0.001)
    return np.maximum(rain, 0)

scenarios = {'Steady': gen_scenario('steady'), 'Burst (2050)': gen_scenario('burst'),
             'Late onset': gen_scenario('late'), 'Early withdrawal': gen_scenario('early')}

def calc_yield(rain, dn, sens, max_y=6.0):
    yf = 1.0
    for d in range(120):
        wr = rain[d] / (dn[d] + 0.1)
        if wr < 0.5: yf -= (0.5 - wr) * sens[d] * 0.02
        elif wr > 3.0: yf -= (wr - 3.0) * sens[d] * 0.005
    return max(0, min(max_y, max_y * yf))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
colors_s = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']

ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
for (name, rain), color in zip(scenarios.items(), colors_s):
    ax1.plot(range(120), rain, color=color, linewidth=1.5, alpha=0.7, label=name)
ax1.plot(range(120), daily_need, color='white', linewidth=1, linestyle=':', label='Crop need')
ax1.set_xlabel('Day after planting', color='white'); ax1.set_ylabel('Rainfall (mm/day)', color='white')
ax1.set_title('Scenarios vs Crop Water Need', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7); ax1.tick_params(colors='gray')

ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
yields = {n: calc_yield(r, daily_need, sensitivity) for n, r in scenarios.items()}
bars = ax2.barh(list(yields.keys()), list(yields.values()), color=colors_s, alpha=0.8)
for bar, y in zip(bars, yields.values()):
    ax2.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2, f'{y:.1f} t/ha', color='white', fontsize=10, va='center')
ax2.set_xlabel('Yield (t/ha)', color='white')
ax2.set_title('Yield Under Different Scenarios', color='white', fontsize=12)
ax2.tick_params(colors='gray'); ax2.set_yticklabels(list(yields.keys()), color='white', fontsize=9)

ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
burst_rain = scenarios['Burst (2050)']
normal_yield = calc_yield(burst_rain, daily_need, sensitivity)
sub1_yield = calc_yield(burst_rain, daily_need, sensitivity * 0.3)
drought_yield = calc_yield(burst_rain, daily_need * 0.7, sensitivity)
varieties = ['Standard', 'Flood-tolerant\
(Sub1)', 'Drought-tolerant']
vy = [normal_yield, sub1_yield, drought_yield]
ax3.bar(varieties, vy, color=['#ef4444', '#22c55e', '#3b82f6'], alpha=0.8)
for bar, y in zip(ax3.patches, vy):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f'{y:.1f}', color='white', fontsize=11, ha='center')
ax3.set_ylabel('Yield under burst (t/ha)', color='white')
ax3.set_title('Better Varieties for New Monsoon', color='white', fontsize=12)
ax3.tick_params(colors='gray'); ax3.set_xticklabels(varieties, color='white')

ax4 = axes[1, 1]; ax4.set_facecolor('#111827')
area_Mha = 4; price = 20000
incomes = {n: y * area_Mha * price / 1e9 for n, y in yields.items()}
baseline = list(incomes.values())[0]
losses = {n: baseline - inc for n, inc in incomes.items()}
ax4.bar(list(losses.keys()), list(losses.values()), color=colors_s, alpha=0.8)
ax4.set_ylabel('Income loss (billion INR)', color='white')
ax4.set_title('Economic Impact on NE India Rice', color='white', fontsize=12)
ax4.tick_params(colors='gray'); ax4.set_xticklabels(list(losses.keys()), color='white', fontsize=7, rotation=15)

plt.tight_layout()
plt.show()

print("Yield by scenario:")
for n, y in yields.items(): print(f"  {n}: {y:.1f} t/ha")
print(f"\
Sub1 variety recovers {sub1_yield - normal_yield:.1f} t/ha under burst scenario")
print(f"Value: INR {(sub1_yield-normal_yield)*area_Mha*price/1e9:.0f}B additional income")`,
      challenge: 'Design a climate-smart farm combining flood-tolerant rice, backup crop, rainwater harvesting, and insurance. Calculate cost vs expected return under the 2050 scenario.',
      successHint: 'The monsoon-agriculture nexus is where climate science becomes personal. Every projection ultimately comes down to whether a farmer in Assam can feed their family. The monsoon always finds its way home; the question is whether agriculture can keep up with how home is changing.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Climate Modeling — builds on Level 1 monsoon science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for climate modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
