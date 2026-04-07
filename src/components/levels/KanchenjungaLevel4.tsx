import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KanchenjungaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Glacier monitoring database — storing field measurements',
      concept: `Real glacier monitoring generates vast amounts of data: stake measurements, weather station readings, satellite images, mass balance records. A **relational database** organizes this data so scientists can query decades of observations efficiently.

Our database schema:
- **glaciers**: id, name, mountain, latitude, longitude, initial_area_km2
- **measurements**: id, glacier_id, date, measurement_type, value, unit
- **stakes**: id, glacier_id, elevation, lat, lon, installed_date
- **mass_balance**: id, glacier_id, year, accumulation, ablation, net_balance

Key SQL operations:
- **CREATE TABLE**: define the structure
- **INSERT**: add new records
- **SELECT ... WHERE**: query specific data
- **JOIN**: combine related tables
- **GROUP BY**: aggregate data (averages, sums by year)
- **ORDER BY**: sort results

The World Glacier Monitoring Service (WGMS) maintains the global glacier database with measurements from over 150,000 glaciers. Our database mimics its structure at a smaller scale.

📚 *We will use Python's sqlite3 module to build a glacier monitoring database from scratch.*`,
      analogy: 'A database is like a filing cabinet with labeled drawers (tables), each containing organized folders (rows) with consistent labels (columns). Without the cabinet, your measurements are scattered loose papers. With it, you can instantly find "all mass balance data for Zemu Glacier in the 2010s" — a query that would take hours by hand.',
      storyConnection: 'The five treasures of Kanchenjunga include sacred texts — records of knowledge. A glacier database is a modern sacred text: it records the health of every glacier, year by year, so future scientists can understand what happened and why. Losing this data would be like losing the treasures themselves.',
      checkQuestion: 'Why use a relational database instead of a simple spreadsheet for glacier monitoring?',
      checkAnswer: 'Three reasons: (1) Relationships — a measurement belongs to a glacier belongs to a mountain. A database enforces these connections. A spreadsheet requires you to repeat the glacier name on every row. (2) Scale — WGMS has millions of measurements. Databases handle this; spreadsheets slow to a crawl. (3) Integrity — databases enforce data types, required fields, and foreign keys. A spreadsheet lets you type "banana" in a temperature column.',
      codeIntro: 'Create a glacier monitoring database and populate it with data for Kanchenjunga\'s glaciers.',
      code: `import sqlite3

# Create in-memory database
db = sqlite3.connect(':memory:')
cursor = db.cursor()

# Create tables
cursor.executescript('''
CREATE TABLE glaciers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    mountain TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    area_km2 REAL,
    max_elevation_m INTEGER,
    min_elevation_m INTEGER
);

CREATE TABLE mass_balance (
    id INTEGER PRIMARY KEY,
    glacier_id INTEGER REFERENCES glaciers(id),
    year INTEGER NOT NULL,
    accumulation_mwe REAL,
    ablation_mwe REAL,
    net_balance_mwe REAL
);

CREATE TABLE stakes (
    id INTEGER PRIMARY KEY,
    glacier_id INTEGER REFERENCES glaciers(id),
    elevation_m INTEGER,
    label TEXT
);

CREATE TABLE stake_readings (
    id INTEGER PRIMARY KEY,
    stake_id INTEGER REFERENCES stakes(id),
    date TEXT,
    ice_loss_cm REAL
);
''')

# Insert Kanchenjunga glaciers
glaciers = [
    (1, 'Zemu', 'Kanchenjunga', 27.72, 88.63, 31.5, 8300, 4400),
    (2, 'Yalung', 'Kanchenjunga', 27.62, 88.12, 24.0, 8200, 4500),
    (3, 'Talung', 'Kanchenjunga', 27.65, 88.15, 18.2, 7800, 4600),
    (4, 'Ramtang', 'Kanchenjunga', 27.75, 88.20, 12.8, 7500, 4800),
    (5, 'Tent Peak', 'Kanchenjunga', 27.70, 88.18, 8.5, 7000, 4900),
]
cursor.executemany('INSERT INTO glaciers VALUES (?,?,?,?,?,?,?,?)', glaciers)

# Insert mass balance data (simulated, 2000-2023)
import random
random.seed(42)
for gid in range(1, 6):
    for year in range(2000, 2024):
        accum = round(random.uniform(0.3, 0.9), 2)
        ablation = round(random.uniform(0.4, 1.2) + 0.01 * (year - 2000), 2)
        net = round(accum - ablation, 2)
        cursor.execute('INSERT INTO mass_balance (glacier_id, year, accumulation_mwe, ablation_mwe, net_balance_mwe) VALUES (?,?,?,?,?)',
                      (gid, year, accum, ablation, net))

db.commit()

# Query 1: All glaciers sorted by area
print("=== Kanchenjunga Glaciers ===")
for row in cursor.execute('SELECT name, area_km2, max_elevation_m, min_elevation_m FROM glaciers ORDER BY area_km2 DESC'):
    print(f"  {row[0]:12s}  {row[1]:5.1f} km²  {row[2]}m - {row[3]}m")

# Query 2: Average mass balance per glacier
print("\\\n=== Average Net Mass Balance (2000-2023) ===")
cursor.execute('''
    SELECT g.name,
           ROUND(AVG(m.net_balance_mwe), 3) as avg_balance,
           ROUND(SUM(m.net_balance_mwe), 1) as total_loss
    FROM glaciers g
    JOIN mass_balance m ON g.id = m.glacier_id
    GROUP BY g.id
    ORDER BY avg_balance
''')
for row in cursor.fetchall():
    print(f"  {row[0]:12s}  avg: {row[1]:+.3f} m w.e./yr  total: {row[2]:+.1f} m w.e.")

# Query 3: Trend over decades
print("\\\n=== Mass Balance by Decade ===")
cursor.execute('''
    SELECT (year/10)*10 as decade,
           ROUND(AVG(net_balance_mwe), 3) as avg_balance,
           COUNT(*) as measurements
    FROM mass_balance
    GROUP BY decade
    ORDER BY decade
''')
for row in cursor.fetchall():
    print(f"  {row[0]}s: {row[1]:+.3f} m w.e./yr  ({row[2]} measurements)")

db.close()`,
      challenge: 'Add a query that finds which glacier had the single worst (most negative) mass balance year. Which glacier was it, and in what year?',
      successHint: 'You have built a normalized relational database with proper foreign keys and executed multi-table JOIN queries. This is exactly how glacier monitoring data is organized in research databases worldwide.',
    },
    {
      title: 'Time series analysis — detecting trends in glacier data',
      concept: `Raw glacier data is noisy — year-to-year variability masks long-term trends. **Time series analysis** extracts the signal from the noise using techniques like:

- **Moving averages**: smooth out short-term fluctuations
- **Linear regression**: fit a trend line (y = mx + b)
- **Change point detection**: find when the trend shifted
- **Cumulative sums**: amplify small consistent trends

For glacier mass balance:
- A single negative year could be a fluke (El Nino, volcanic cooling)
- 5 consecutive negative years is concerning
- 20 consecutive negative years is a trend
- An accelerating trend (getting worse each decade) signals feedback loops

Statistical significance matters. A trend is "statistically significant" when we can be >95% confident it is not due to random chance. The **Mann-Kendall test** is commonly used for environmental time series.

📚 *We will combine sqlite3 queries with numpy/matplotlib analysis to detect and visualize glacier trends.*`,
      analogy: 'Finding a trend in noisy data is like listening for a whisper in a noisy room. Each individual measurement (a shout in the crowd) tells you little. But if you average many measurements (recording the crowd over hours), patterns emerge — the room is getting gradually louder. Statistical tests tell you whether the pattern is real or you are imagining it.',
      storyConnection: 'The glaciers of Kanchenjunga do not disappear in a single dramatic event — they erode year by year, masked by natural variability. Time series analysis is how we detect the slow death of a glacier. The five treasures are not stolen; they are leaked away, one measurement at a time.',
      checkQuestion: 'Why is a 20-year moving average better than a 5-year average for detecting long-term glacier trends?',
      checkAnswer: 'A 5-year average still contains significant interannual noise (El Nino cycles, volcanic effects). A 20-year average smooths these out, revealing only multi-decadal trends. However, a 20-year average delays detection — you need 20 years of data before you see the current trend. There is always a tradeoff between smoothing and responsiveness.',
      codeIntro: 'Query glacier data from a database and perform trend analysis with visualization.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

# Rebuild database with longer time series
db = sqlite3.connect(':memory:')
c = db.cursor()
c.execute('CREATE TABLE mass_balance (glacier TEXT, year INT, net_mwe REAL)')

np.random.seed(42)
years = np.arange(1980, 2024)

# Two glaciers with different trends
for glacier, base, trend, noise in [
    ('Zemu', -0.2, -0.015, 0.3),
    ('Yalung', -0.1, -0.020, 0.25),
]:
    for y in years:
        val = base + trend * (y - 1980) + np.random.normal(0, noise)
        c.execute('INSERT INTO mass_balance VALUES (?,?,?)', (glacier, int(y), round(val, 3)))

db.commit()

# Query all data
c.execute('SELECT glacier, year, net_mwe FROM mass_balance ORDER BY glacier, year')
rows = c.fetchall()

# Organize by glacier
data = {}
for glacier, year, val in rows:
    if glacier not in data:
        data[glacier] = {'years': [], 'vals': []}
    data[glacier]['years'].append(year)
    data[glacier]['vals'].append(val)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Glacier Mass Balance Trend Analysis', color='white', fontsize=14, fontweight='bold')

colors = {'Zemu': '#60a5fa', 'Yalung': '#f472b6'}

# Panel 1: Raw data with trend lines
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
for name, d in data.items():
    y, v = np.array(d['years']), np.array(d['vals'])
    ax.scatter(y, v, c=colors[name], s=15, alpha=0.5)
    # Linear regression
    coeffs = np.polyfit(y, v, 1)
    ax.plot(y, np.polyval(coeffs, y), color=colors[name], linewidth=2,
            label=f'{name}: {coeffs[0]*10:+.3f} m w.e./decade')
ax.axhline(y=0, color='white', linewidth=0.5, alpha=0.5)
ax.set_title('Annual Data + Trend Lines', color='white', fontsize=11)
ax.set_ylabel('Net Balance (m w.e.)', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Moving averages
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
for name, d in data.items():
    v = np.array(d['vals'])
    y = np.array(d['years'])
    for window, ls in [(5, ':'), (11, '-')]:
        ma = np.convolve(v, np.ones(window)/window, mode='valid')
        ax.plot(y[window//2:-(window//2)], ma, color=colors[name],
                linestyle=ls, linewidth=2 if ls == '-' else 1,
                label=f'{name} {window}yr' if name == 'Zemu' else None)
ax.axhline(y=0, color='white', linewidth=0.5, alpha=0.5)
ax.set_title('Moving Averages (dotted=5yr, solid=11yr)', color='white', fontsize=11)
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Cumulative sum
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
for name, d in data.items():
    v = np.array(d['vals'])
    y = np.array(d['years'])
    cumsum = np.cumsum(v)
    ax.plot(y, cumsum, color=colors[name], linewidth=2.5, label=name)
    ax.fill_between(y, cumsum, alpha=0.15, color=colors[name])
ax.set_title('Cumulative Mass Balance', color='white', fontsize=11)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Cumulative (m w.e.)', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Decadal comparison
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
decades = ['1980s', '1990s', '2000s', '2010s', '2020s']
x_pos = np.arange(len(decades))
width = 0.35
for i, (name, d) in enumerate(data.items()):
    v = np.array(d['vals'])
    y = np.array(d['years'])
    dec_means = []
    for start in [1980, 1990, 2000, 2010, 2020]:
        mask = (y >= start) & (y < start + 10)
        dec_means.append(v[mask].mean() if mask.any() else 0)
    ax.bar(x_pos + i*width - width/2, dec_means, width, color=colors[name], alpha=0.8, label=name)
ax.set_xticks(x_pos)
ax.set_xticklabels(decades, color='white')
ax.set_title('Decadal Averages', color='white', fontsize=11)
ax.set_ylabel('Mean Balance (m w.e.)', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')
ax.axhline(y=0, color='white', linewidth=0.5, alpha=0.5)

plt.tight_layout()
plt.savefig('trends.png', dpi=100, facecolor='#1f2937')
plt.show()

# Summary statistics
for name, d in data.items():
    v = np.array(d['vals'])
    y = np.array(d['years'])
    slope = np.polyfit(y, v, 1)[0]
    print(f"{name}: trend = {slope*10:+.3f} m w.e./decade, cumulative = {v.sum():+.1f} m w.e.")

db.close()`,
      challenge: 'Add a change-point detection: split each glacier\'s record at year 2000 and compute separate trends for 1980-1999 and 2000-2023. Is the trend accelerating?',
      successHint: 'You have combined database queries with statistical analysis and multi-panel visualization. The cumulative sum plot is especially powerful — it makes small consistent trends dramatically visible. This is how researchers communicate glacier decline to policymakers.',
    },
    {
      title: 'GLOF hazard assessment — ranking dangerous lakes',
      concept: `Not all glacial lakes are equally dangerous. **Hazard assessment** ranks lakes by their potential to cause catastrophic flooding. Key factors:

1. **Lake volume**: larger lakes produce bigger floods (obvious)
2. **Dam type**: moraine dams are weaker than bedrock dams
3. **Freeboard**: distance from water surface to dam crest (low = risky)
4. **Glacier proximity**: hanging glaciers above the lake can trigger waves
5. **Downstream exposure**: are there settlements, infrastructure?
6. **Dam geometry**: steep, narrow dams fail more suddenly

A scoring system combines these factors:
- Each factor scored 1-5 (5 = most dangerous)
- Weighted sum gives total hazard score
- Lakes above threshold get priority monitoring

In Sikkim, there are 14 potentially dangerous glacial lakes. South Lhonak (the one that burst in 2023) was identified as high-risk years before the disaster — but mitigation was not completed in time.

📚 *We will build a hazard assessment database with scoring algorithms and ranked outputs.*`,
      analogy: 'Hazard assessment is like a doctor\'s triage in an emergency room. You cannot treat every patient simultaneously. You score them: unconscious and bleeding (high priority), broken arm (medium), headache (low). Similarly, we cannot monitor every glacial lake constantly — we rank them and focus on the most dangerous ones first.',
      storyConnection: 'The 2023 Sikkim GLOF was a modern tragedy directly caused by glacier retreat. The five treasures story promised protection, but as glaciers shrink, they create new hazards. Hazard assessment is our attempt to protect Sikkim\'s people when the mountain\'s ancient defenses are failing.',
      checkQuestion: 'South Lhonak Lake was identified as dangerous in 2013 but the GLOF happened in 2023. Why the 10-year gap between warning and disaster?',
      checkAnswer: 'Several factors: (1) Mitigation is expensive — draining a glacial lake requires pumps and siphons at 5,000 m altitude. (2) Political complexity — who funds it, who decides? (3) The lake kept growing as the glacier retreated. (4) The trigger was an unprecedented rock/ice avalanche into the lake. Early warning systems can alert, but preventing the GLOF requires physically lowering the lake level.',
      codeIntro: 'Build a hazard scoring database for Sikkim\'s glacial lakes and rank them by danger.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE glacial_lakes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    glacier TEXT,
    latitude REAL,
    longitude REAL,
    elevation_m INTEGER,
    area_km2 REAL,
    volume_million_m3 REAL,
    dam_type TEXT
);

CREATE TABLE hazard_factors (
    id INTEGER PRIMARY KEY,
    lake_id INTEGER REFERENCES glacial_lakes(id),
    volume_score INTEGER CHECK(volume_score BETWEEN 1 AND 5),
    dam_stability INTEGER CHECK(dam_stability BETWEEN 1 AND 5),
    freeboard_score INTEGER CHECK(freeboard_score BETWEEN 1 AND 5),
    glacier_proximity INTEGER CHECK(glacier_proximity BETWEEN 1 AND 5),
    seismicity INTEGER CHECK(seismicity BETWEEN 1 AND 5),
    downstream_exposure INTEGER CHECK(downstream_exposure BETWEEN 1 AND 5)
);

CREATE TABLE downstream (
    id INTEGER PRIMARY KEY,
    lake_id INTEGER REFERENCES glacial_lakes(id),
    feature TEXT,
    distance_km REAL,
    population INTEGER
);
''')

# Sikkim glacial lakes (based on published surveys)
lakes = [
    (1, 'South Lhonak', 'South Lhonak Gl.', 27.93, 88.20, 5200, 1.08, 42.0, 'moraine'),
    (2, 'Shako Cho', 'Shako Gl.', 27.85, 88.35, 5100, 0.45, 12.0, 'moraine'),
    (3, 'Tso Lhamo', 'Gurudongmar Gl.', 27.95, 88.78, 5330, 0.38, 8.5, 'moraine'),
    (4, 'Khangchung Tso', 'Kanchenjunga Gl.', 27.70, 88.30, 4900, 0.22, 5.0, 'bedrock'),
    (5, 'Lhonak Lake', 'North Lhonak Gl.', 27.90, 88.25, 5150, 0.65, 18.0, 'moraine'),
    (6, 'Gurudongmar', 'Gurudongmar Gl.', 27.97, 88.72, 5148, 0.82, 15.0, 'moraine-bedrock'),
    (7, 'Cholamu', 'Tista Head Gl.', 27.98, 88.70, 5330, 0.15, 3.0, 'bedrock'),
    (8, 'Rathong Chu', 'Rathong Gl.', 27.45, 88.08, 4600, 0.18, 4.0, 'moraine'),
]
c.executemany('INSERT INTO glacial_lakes VALUES (?,?,?,?,?,?,?,?,?)', lakes)

# Hazard scores
hazards = [
    (1, 1, 5, 5, 4, 5, 4, 5),  # South Lhonak — highest risk (confirmed by 2023 event)
    (2, 2, 3, 4, 3, 4, 4, 3),
    (3, 3, 2, 3, 3, 3, 3, 2),
    (4, 4, 2, 2, 2, 3, 3, 3),
    (5, 5, 4, 4, 4, 4, 4, 4),
    (6, 6, 3, 3, 3, 3, 3, 3),
    (7, 7, 1, 1, 2, 2, 3, 1),
    (8, 8, 1, 3, 3, 2, 3, 3),
]
c.executemany('INSERT INTO hazard_factors VALUES (?,?,?,?,?,?,?,?)', hazards)

# Downstream features
downstream = [
    (1, 1, 'Chungthang Dam', 45, 500),
    (2, 1, 'Chungthang Town', 48, 3000),
    (3, 1, 'Mangan', 70, 10000),
    (4, 5, 'Lhonak Valley camps', 5, 50),
    (5, 8, 'Yuksom Town', 25, 2000),
]
c.executemany('INSERT INTO downstream VALUES (?,?,?,?,?)', downstream)
db.commit()

# Weighted hazard scoring
weights = {
    'volume_score': 0.25,
    'dam_stability': 0.25,
    'freeboard_score': 0.15,
    'glacier_proximity': 0.15,
    'seismicity': 0.10,
    'downstream_exposure': 0.10,
}

print("=== GLOF Hazard Assessment — Sikkim ===\\\n")
print(f"{'Lake':20s} {'Vol(Mm³)':>8} {'Dam':>12} {'Hazard':>7} {'Risk Level':>12}")
print("-" * 65)

c.execute('''
    SELECT l.name, l.volume_million_m3, l.dam_type,
           h.volume_score, h.dam_stability, h.freeboard_score,
           h.glacier_proximity, h.seismicity, h.downstream_exposure
    FROM glacial_lakes l
    JOIN hazard_factors h ON l.id = h.lake_id
''')

results = []
for row in c.fetchall():
    name, vol, dam = row[0], row[1], row[2]
    scores = row[3:]
    w = list(weights.values())
    hazard = sum(s * wt for s, wt in zip(scores, w))
    level = 'CRITICAL' if hazard > 4.0 else 'HIGH' if hazard > 3.0 else 'MODERATE' if hazard > 2.0 else 'LOW'
    results.append((name, vol, dam, hazard, level))

results.sort(key=lambda x: -x[3])
for name, vol, dam, hazard, level in results:
    print(f"{name:20s} {vol:8.1f} {dam:>12} {hazard:7.2f} {level:>12}")

# Downstream impact for top-risk lake
print(f"\\\n=== Downstream Impact: {results[0][0]} ===")
c.execute('''
    SELECT d.feature, d.distance_km, d.population
    FROM downstream d
    JOIN glacial_lakes l ON d.lake_id = l.id
    WHERE l.name = ?
    ORDER BY d.distance_km
''', (results[0][0],))
for feature, dist, pop in c.fetchall():
    print(f"  {feature}: {dist:.0f} km downstream, {pop} people")

db.close()`,
      challenge: 'Add a "growth rate" factor: lakes that grew >20% in 10 years get an extra +1 to their hazard score. South Lhonak grew 400% in 20 years. How does this change the ranking?',
      successHint: 'You have built a multi-criteria hazard assessment system backed by a relational database. The South Lhonak Lake tops the ranking — validating the model against the real 2023 disaster. This kind of decision-support system could save lives if deployed and acted upon.',
    },
    {
      title: 'Water resource forecasting — the glacier contribution algorithm',
      concept: `As glaciers shrink, river discharge patterns change. A **water resource forecast** predicts future river flow by combining:

1. **Glacier melt model**: volume of meltwater based on glacier size and temperature
2. **Snowmelt model**: seasonal snow that melts independent of glaciers
3. **Rainfall-runoff**: direct rainfall contribution
4. **Groundwater**: baseflow from subsurface reservoirs

The critical question: when glaciers disappear, how much water do rivers lose?

The Teesta River (fed by Kanchenjunga glaciers) currently gets:
- ~35% from glacier melt in summer
- ~15% from seasonal snowmelt
- ~40% from monsoon rainfall
- ~10% from groundwater

If glaciers halve by 2060, the summer flow drops significantly. But peak flow actually increases initially (more melt from warmer temperatures) before declining — the "peak water" phenomenon.

📚 *We will build a complete water resource model with database storage, algorithmic prediction, and multi-scenario visualization.*`,
      analogy: 'Water resource forecasting is like predicting a household\'s income over decades. The glacier is a savings account (large but finite). Rain is a salary (variable but recurring). Groundwater is a pension (steady and reliable). If the savings account runs dry, the household must survive on salary alone — enough in good months, catastrophic in dry ones.',
      storyConnection: 'The five treasures of Kanchenjunga sustain life downstream. Water is the most fundamental treasure — without it, there is no agriculture, no hydropower, no drinking water. The forecast model tells us how long this treasure will last and what Sikkim must do to adapt.',
      checkQuestion: 'Why does "peak water" (maximum glacier meltwater) occur before the glacier disappears?',
      checkAnswer: 'Peak water occurs when the product of melt rate and glacier area is maximum. Initially, warming increases the melt rate per unit area. But as the glacier shrinks, there is less area to melt. Peak water = the point where rising melt rate can no longer compensate for shrinking area. After peak water, total meltwater declines even as each remaining square meter melts faster.',
      codeIntro: 'Build a multi-component water resource forecast for the Teesta River with database-backed scenarios.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE scenarios (
    id INTEGER PRIMARY KEY,
    name TEXT,
    warming_rate REAL,
    precip_change_pct REAL
);

CREATE TABLE forecasts (
    id INTEGER PRIMARY KEY,
    scenario_id INTEGER REFERENCES scenarios(id),
    year INTEGER,
    glacier_melt REAL,
    snowmelt REAL,
    rainfall REAL,
    groundwater REAL,
    total REAL
);
''')

scenarios = [
    (1, 'Optimistic (RCP 2.6)', 0.015, -2),
    (2, 'Moderate (RCP 4.5)', 0.025, -5),
    (3, 'Pessimistic (RCP 8.5)', 0.045, -10),
]
c.executemany('INSERT INTO scenarios VALUES (?,?,?,?)', scenarios)

# Water resource model
years = np.arange(2024, 2101)
glacier_area_2024 = 80  # km²
base_glacier_melt = 0.5  # km³/yr
base_snowmelt = 0.22
base_rainfall = 0.57
base_groundwater = 0.14

for sid, name, warming, precip_delta in scenarios:
    glacier_area = glacier_area_2024

    for y in years:
        dt = y - 2024
        temp_rise = warming * dt

        # Glacier area decline (exponential)
        glacier_area = glacier_area_2024 * np.exp(-0.008 * temp_rise * dt)
        glacier_area = max(glacier_area, 0)

        # Glacier melt: rate increases with temp, area decreases
        melt_rate = 1 + 0.15 * temp_rise  # melt intensifies
        glacier_melt = base_glacier_melt * (glacier_area / glacier_area_2024) * melt_rate

        # Snowmelt: slightly less (less snow, faster melt)
        snowmelt = base_snowmelt * (1 - 0.005 * temp_rise)

        # Rainfall: changes with scenario
        rainfall = base_rainfall * (1 + precip_delta / 100 * dt / 76)

        # Groundwater: slow decline as recharge decreases
        groundwater = base_groundwater * (1 - 0.002 * dt)

        total = glacier_melt + snowmelt + rainfall + groundwater

        c.execute('INSERT INTO forecasts (scenario_id, year, glacier_melt, snowmelt, rainfall, groundwater, total) VALUES (?,?,?,?,?,?,?)',
                 (sid, int(y), round(glacier_melt, 4), round(snowmelt, 4),
                  round(rainfall, 4), round(groundwater, 4), round(total, 4)))

db.commit()

# Plot results
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Teesta River Water Resource Forecast', color='white', fontsize=14, fontweight='bold')

scenario_colors = ['#22c55e', '#f59e0b', '#ef4444']

# Panel 1: Total discharge by scenario
ax = axes[0]
ax.set_facecolor('#1f2937')
for sid, color in zip([1,2,3], scenario_colors):
    c.execute('SELECT year, total FROM forecasts WHERE scenario_id=? ORDER BY year', (sid,))
    rows = c.fetchall()
    yrs = [r[0] for r in rows]
    totals = [r[1] for r in rows]
    c.execute('SELECT name FROM scenarios WHERE id=?', (sid,))
    label = c.fetchone()[0]
    ax.plot(yrs, totals, color=color, linewidth=2, label=label)
ax.set_title('Total Annual Discharge', color='white', fontsize=11)
ax.set_ylabel('Discharge (km³/yr)', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Components (moderate scenario)
ax = axes[1]
ax.set_facecolor('#1f2937')
c.execute('SELECT year, glacier_melt, snowmelt, rainfall, groundwater FROM forecasts WHERE scenario_id=2 ORDER BY year')
rows = c.fetchall()
yrs = [r[0] for r in rows]
components = list(zip(*[(r[1], r[2], r[3], r[4]) for r in rows]))
labels = ['Glacier melt', 'Snowmelt', 'Rainfall', 'Groundwater']
cols = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b']
ax.stackplot(yrs, *components, labels=labels, colors=cols, alpha=0.8)
ax.set_title('Components (RCP 4.5)', color='white', fontsize=11)
ax.set_ylabel('Discharge (km³/yr)', color='white')
ax.legend(loc='upper right', facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Glacier melt peak water
ax = axes[2]
ax.set_facecolor('#1f2937')
for sid, color in zip([1,2,3], scenario_colors):
    c.execute('SELECT year, glacier_melt FROM forecasts WHERE scenario_id=? ORDER BY year', (sid,))
    rows = c.fetchall()
    yrs = [r[0] for r in rows]
    gm = [r[1] for r in rows]
    peak_yr = yrs[np.argmax(gm)]
    ax.plot(yrs, gm, color=color, linewidth=2)
    ax.axvline(x=peak_yr, color=color, linestyle=':', alpha=0.5)
    ax.annotate(f'Peak: {peak_yr}', xy=(peak_yr, max(gm)), fontsize=8, color=color)
ax.set_title('"Peak Water" — Glacier Melt', color='white', fontsize=11)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Glacier Melt (km³/yr)', color='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('water_forecast.png', dpi=100, facecolor='#1f2937')
plt.show()

# Summary
print("=== Water Resource Summary for 2060 ===\\\n")
for sid in [1, 2, 3]:
    c.execute('SELECT s.name, f.total, f.glacier_melt FROM forecasts f JOIN scenarios s ON f.scenario_id=s.id WHERE f.year=2060 AND f.scenario_id=?', (sid,))
    name, total, gm = c.fetchone()
    pct_glacier = gm / total * 100
    print(f"{name}: {total:.2f} km³/yr (glacier: {pct_glacier:.0f}%)")

db.close()`,
      challenge: 'Add a "drought year" modifier: in years divisible by 7, reduce rainfall by 30%. How does this affect total discharge? Which scenario is most resilient to droughts?',
      successHint: 'You have built a complete water resource forecasting system with database storage, multi-component modeling, and scenario comparison. The "peak water" plot is one of the most important visualizations in Himalayan water science — it shows when communities must transition from glacier-dependent to rain-dependent water systems.',
    },
    {
      title: 'Capstone: Kanchenjunga Glacier Observatory — complete monitoring system',
      concept: `A **glacier observatory** integrates all the components we have built: data storage, analysis, visualization, hazard assessment, and forecasting. Real observatories like the one at Chhota Shigri Glacier (Himachal Pradesh) combine:

- **Automated weather stations**: temperature, wind, humidity, solar radiation
- **Mass balance stakes**: seasonal measurements at multiple elevations
- **GPS stakes**: track glacier flow velocity
- **Lake monitoring**: water level, temperature, turbidity
- **Satellite imagery**: area and terminus position
- **Early warning systems**: downstream sirens triggered by lake level sensors

Our capstone project builds a Python-based observatory dashboard that:
1. Stores all measurement types in a normalized database
2. Computes key indicators (mass balance trend, hazard scores, flow velocities)
3. Generates status reports with recommendations
4. Projects future conditions under different scenarios

📚 *This is a full-stack scientific application combining sqlite3, numpy, matplotlib, and algorithm design.*`,
      analogy: 'The observatory is like a hospital\'s patient monitoring system. Each glacier is a patient. The database stores their medical history. The algorithms are diagnostic tests. The reports are like a doctor\'s chart: vital signs, trend analysis, and a prognosis. Our job is to keep the patient alive.',
      storyConnection: 'This capstone brings together everything: the five treasures of Kanchenjunga are under threat, and only careful monitoring and wise action can preserve them. The observatory is our watchtower — not to guard mythical treasures, but to protect real lives and livelihoods that depend on glacial water.',
      checkQuestion: 'Why is an integrated system better than separate tools for each measurement type?',
      checkAnswer: 'Integration enables cross-referencing: you can correlate a spike in meltwater discharge with a temperature anomaly AND a low albedo measurement AND a thinning stake reading. Separate tools would each show part of the picture. Together, they tell the complete story and enable early warning. The 2023 Sikkim GLOF might have been anticipated if lake level data, seismic data, and glacier velocity data had been analyzed together in real time.',
      codeIntro: 'Build a complete glacier observatory system that generates a health report for Kanchenjunga\'s glaciers.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

class GlacierObservatory:
    def __init__(self):
        self.db = sqlite3.connect(':memory:')
        self._create_schema()
        self._populate_data()

    def _create_schema(self):
        self.db.executescript('''
            CREATE TABLE glaciers (
                id INTEGER PRIMARY KEY, name TEXT, area_km2 REAL,
                length_km REAL, ela_m INTEGER, status TEXT
            );
            CREATE TABLE annual_data (
                glacier_id INTEGER, year INTEGER,
                mass_balance REAL, area_km2 REAL,
                terminus_change_m REAL, max_velocity_m_yr REAL,
                PRIMARY KEY (glacier_id, year)
            );
            CREATE TABLE lake_monitoring (
                lake_name TEXT, glacier_id INTEGER, year INTEGER,
                area_km2 REAL, volume_Mm3 REAL, hazard_score REAL,
                PRIMARY KEY (lake_name, year)
            );
        ''')

    def _populate_data(self):
        np.random.seed(42)
        glaciers = [
            (1, 'Zemu', 31.5, 26.0, 5400, 'retreating'),
            (2, 'Yalung', 24.0, 18.0, 5350, 'retreating'),
            (3, 'Talung', 18.2, 14.0, 5300, 'stable'),
            (4, 'Ramtang', 12.8, 10.0, 5250, 'retreating'),
        ]
        self.db.executemany('INSERT INTO glaciers VALUES (?,?,?,?,?,?)', glaciers)

        for gid, _, base_area, _, _, _ in glaciers:
            area = base_area
            for yr in range(2000, 2024):
                mb = -0.3 - 0.01 * (yr - 2000) + np.random.normal(0, 0.2)
                area *= (1 - 0.003 * abs(mb))
                terminus = -25 - 0.8 * (yr - 2000) + np.random.normal(0, 10)
                velocity = 25 + 0.3 * (yr - 2000) + np.random.normal(0, 3)
                self.db.execute(
                    'INSERT INTO annual_data VALUES (?,?,?,?,?,?)',
                    (gid, yr, round(mb, 3), round(area, 2), round(terminus, 1), round(velocity, 1))
                )

        for yr in range(2000, 2024):
            area = 0.2 + 0.035 * (yr - 2000) + np.random.normal(0, 0.02)
            vol = area * 40
            hazard = min(5, 2 + 0.1 * (yr - 2000))
            self.db.execute('INSERT INTO lake_monitoring VALUES (?,?,?,?,?,?)',
                          ('South Lhonak', 1, yr, round(area, 3), round(vol, 1), round(hazard, 2)))
        self.db.commit()

    def health_report(self):
        print("=" * 60)
        print("  KANCHENJUNGA GLACIER OBSERVATORY — STATUS REPORT")
        print("  Generated: 2024 (latest data: 2023)")
        print("=" * 60)

        c = self.db.cursor()

        # Overall status
        c.execute('''
            SELECT g.name, g.area_km2 as orig_area,
                   a.area_km2 as current_area,
                   ROUND(AVG(a.mass_balance), 3) as avg_mb,
                   ROUND(a.terminus_change_m, 0) as retreat_2023
            FROM glaciers g
            JOIN annual_data a ON g.id = a.glacier_id
            WHERE a.year = 2023
            GROUP BY g.id
        ''')

        print("\\\n--- Glacier Status ---")
        print(f"{'Name':12s} {'Original':>10} {'Current':>10} {'Loss':>8} {'Avg MB':>10}")
        for name, orig, curr, mb, ret in c.fetchall():
            loss = (1 - curr/orig) * 100
            print(f"{name:12s} {orig:>8.1f}km² {curr:>8.1f}km² {loss:>7.1f}% {mb:>+8.3f} mwe")

        # Trend analysis
        print("\\\n--- Trend Analysis (2000-2023) ---")
        c.execute('''
            SELECT g.name,
                   (SELECT mass_balance FROM annual_data WHERE glacier_id=g.id AND year=2023) -
                   (SELECT mass_balance FROM annual_data WHERE glacier_id=g.id AND year=2000) as mb_change
            FROM glaciers g
        ''')
        for name, change in c.fetchall():
            direction = "WORSENING" if change < 0 else "IMPROVING"
            print(f"  {name}: mass balance shifted by {change:+.3f} m w.e. → {direction}")

        # Lake hazard
        print("\\\n--- Glacial Lake Hazard ---")
        c.execute('''
            SELECT lake_name,
                   area_km2 as area_2023,
                   volume_Mm3 as vol_2023,
                   hazard_score
            FROM lake_monitoring
            WHERE year = 2023
        ''')
        for lake, area, vol, hazard in c.fetchall():
            level = 'CRITICAL' if hazard > 4 else 'HIGH' if hazard > 3 else 'MODERATE'
            print(f"  {lake}: {area:.2f} km², {vol:.0f} Mm³, hazard={hazard:.1f} [{level}]")

        # Projections
        print("\\\n--- 2050 Projection (moderate scenario) ---")
        c.execute('SELECT g.name, a.area_km2 FROM glaciers g JOIN annual_data a ON g.id=a.glacier_id WHERE a.year=2023')
        for name, area_2023 in c.fetchall():
            area_2050 = area_2023 * 0.65  # ~35% loss by 2050
            print(f"  {name}: {area_2023:.1f} → {area_2050:.1f} km² (-{(1-0.65)*100:.0f}%)")

        print("\\\n--- RECOMMENDATIONS ---")
        print("  1. URGENT: Drain South Lhonak Lake below critical volume")
        print("  2. Install early warning sirens in Chungthang valley")
        print("  3. Expand stake network on Yalung Glacier (fastest retreat)")
        print("  4. Commission water-sharing agreements for post-peak-water era")
        print("  5. Fund annual satellite monitoring for all 14 glacial lakes")
        print("=" * 60)

# Run the observatory
observatory = GlacierObservatory()
observatory.health_report()

# Generate summary plot
c = observatory.db.cursor()
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')

glacier_colors = {'Zemu': '#60a5fa', 'Yalung': '#f472b6', 'Talung': '#34d399', 'Ramtang': '#fbbf24'}

# Cumulative mass balance
ax = axes[0]
ax.set_facecolor('#1f2937')
for gid, name in [(1,'Zemu'),(2,'Yalung'),(3,'Talung'),(4,'Ramtang')]:
    c.execute('SELECT year, mass_balance FROM annual_data WHERE glacier_id=? ORDER BY year', (gid,))
    rows = c.fetchall()
    yrs = [r[0] for r in rows]
    cumsum = np.cumsum([r[1] for r in rows])
    ax.plot(yrs, cumsum, color=glacier_colors[name], linewidth=2, label=name)
ax.set_title('Cumulative Mass Balance', color='white', fontsize=11, fontweight='bold')
ax.set_ylabel('Cumulative (m w.e.)', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Lake growth
ax = axes[1]
ax.set_facecolor('#1f2937')
c.execute('SELECT year, area_km2, hazard_score FROM lake_monitoring ORDER BY year')
rows = c.fetchall()
yrs, areas, hazards = zip(*rows)
ax.plot(yrs, areas, '#ef4444', linewidth=2)
ax.fill_between(yrs, areas, alpha=0.2, color='#ef4444')
ax.set_title('South Lhonak Lake Growth', color='white', fontsize=11, fontweight='bold')
ax.set_ylabel('Area (km²)', color='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Area change
ax = axes[2]
ax.set_facecolor('#1f2937')
for gid, name in [(1,'Zemu'),(2,'Yalung'),(3,'Talung'),(4,'Ramtang')]:
    c.execute('SELECT year, area_km2 FROM annual_data WHERE glacier_id=? ORDER BY year', (gid,))
    rows = c.fetchall()
    yrs = [r[0] for r in rows]
    areas = [r[1] for r in rows]
    ax.plot(yrs, areas, color=glacier_colors[name], linewidth=2, label=name)
ax.set_title('Glacier Area Decline', color='white', fontsize=11, fontweight='bold')
ax.set_ylabel('Area (km²)', color='white')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('observatory.png', dpi=100, facecolor='#1f2937')
plt.show()

observatory.db.close()`,
      challenge: 'Add a method to the observatory class that computes a single "Kanchenjunga Health Index" (0-100) combining all glacier mass balances, lake hazard levels, and retreat rates. What is the current score?',
      successHint: 'You have built a complete scientific observatory system — from database design to analysis algorithms to visualization to actionable recommendations. This is the kind of tool that could genuinely help protect communities downstream of retreating Himalayan glaciers. The five treasures of Kanchenjunga are worth protecting, and now you have the tools to monitor them.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Glacier monitoring with databases and algorithms</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
