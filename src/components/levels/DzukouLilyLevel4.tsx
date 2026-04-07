import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DzukouLilyLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Building a botanical survey database',
      concept: `Real ecological research generates enormous amounts of data: GPS coordinates, species counts, soil measurements, weather readings, photographs. A **relational database** organizes this data so it can be queried efficiently.

For the Dzukou Lily project, we need tables for:
- **sites**: survey locations with coordinates and altitude
- **surveys**: when each survey was conducted, by whom
- **observations**: species counts at each site on each survey date
- **environmental**: temperature, UV, rainfall measurements

**SQL (Structured Query Language)** is the standard language for creating, populating, and querying databases. SQLite is a lightweight database engine built into Python.

📚 *sqlite3 is Python's built-in database module. We create a connection, execute SQL statements, and commit changes. No external server needed.*`,
      analogy: 'A database is like a well-organized filing cabinet. Each drawer (table) holds one type of document. Each folder (row) is one record. The labels on folders (columns) let you find exactly what you need. Without this organization, finding "all lily counts above 2,400 m in July" would mean sifting through a mountain of paper.',
      storyConnection: 'Conservation of the Dzukou Lily depends on long-term monitoring. A properly designed database lets researchers track population trends over decades, correlate declines with environmental changes, and make evidence-based management decisions.',
      checkQuestion: 'Why use a relational database instead of just a spreadsheet for ecological data?',
      checkAnswer: 'Spreadsheets fail at scale: they mix data with formatting, lack referential integrity (you can enter an invalid site ID), cannot handle concurrent users, and slow down with large datasets. A relational database enforces data types, prevents invalid references through foreign keys, handles millions of rows efficiently, and supports complex queries across multiple tables simultaneously.',
      codeIntro: 'Create a botanical survey database with proper relational structure.',
      code: `import sqlite3
import numpy as np

# Create in-memory database
conn = sqlite3.connect(':memory:')
c = conn.cursor()

# Create tables
c.executescript('''
    CREATE TABLE sites (
        site_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        altitude_m INTEGER,
        slope_aspect TEXT,
        habitat_type TEXT
    );

    CREATE TABLE surveys (
        survey_id INTEGER PRIMARY KEY,
        site_id INTEGER REFERENCES sites(site_id),
        survey_date TEXT,
        surveyor TEXT,
        weather TEXT
    );

    CREATE TABLE observations (
        obs_id INTEGER PRIMARY KEY,
        survey_id INTEGER REFERENCES surveys(survey_id),
        species TEXT,
        count INTEGER,
        flowering INTEGER DEFAULT 0,
        health_score REAL
    );

    CREATE TABLE environmental (
        reading_id INTEGER PRIMARY KEY,
        site_id INTEGER REFERENCES sites(site_id),
        date TEXT,
        temp_c REAL,
        uv_index REAL,
        rainfall_mm REAL,
        soil_moisture_pct REAL
    );
''')

# Populate with realistic Dzukou Valley data
np.random.seed(42)
sites_data = [
    (1, 'East Ridge', 25.525, 93.835, 2480, 'E', 'alpine meadow'),
    (2, 'Valley Floor', 25.520, 93.838, 2410, 'flat', 'wet grassland'),
    (3, 'West Slope', 25.518, 93.830, 2520, 'W', 'rocky outcrop'),
    (4, 'North Gully', 25.530, 93.833, 2390, 'N', 'sheltered gully'),
    (5, 'South Face', 25.515, 93.840, 2550, 'S', 'exposed slope'),
]
c.executemany('INSERT INTO sites VALUES (?,?,?,?,?,?,?)', sites_data)

# Generate 3 years of surveys (monthly, May-Oct)
survey_id = 1
for year in [2023, 2024, 2025]:
    for month in range(5, 11):
        for site_id in range(1, 6):
            date = f'{year}-{month:02d}-15'
            weather = np.random.choice(['clear', 'cloudy', 'rain', 'fog'], p=[0.3, 0.3, 0.2, 0.2])
            c.execute('INSERT INTO surveys VALUES (?,?,?,?,?)',
                     (survey_id, site_id, date, 'Dr. Sema', weather))

            # Lily count varies by site, month, and year
            base = [15, 25, 8, 20, 5][site_id - 1]
            seasonal = max(0, 10 * np.sin(np.pi * (month - 4) / 7))
            trend = -1 * (year - 2023)  # slight decline
            count = max(0, int(np.random.poisson(base + seasonal + trend)))
            flowering = 1 if month in [7, 8] else 0
            health = np.clip(np.random.normal(7.5 - 0.3*(year-2023), 1.0), 1, 10)
            c.execute('INSERT INTO observations VALUES (?,?,?,?,?,?)',
                     (None, survey_id, 'Lilium mackliniae', count, flowering, round(health, 1)))

            # Environmental readings
            temp = 12 + 8*np.sin(np.pi*(month-3)/7) + np.random.normal(0, 2)
            uv = 5 + 3*np.sin(np.pi*(month-3)/7) + np.random.normal(0, 0.5)
            rain = max(0, np.random.exponential(50 if month in [6,7,8] else 15))
            soil = np.clip(30 + rain*0.3 + np.random.normal(0, 5), 5, 95)
            c.execute('INSERT INTO environmental VALUES (?,?,?,?,?,?,?)',
                     (None, site_id, date, round(temp,1), round(uv,1), round(rain,1), round(soil,1)))

            survey_id += 1

conn.commit()

# Verify
for table in ['sites', 'surveys', 'observations', 'environmental']:
    count = c.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
    print(f"Table '{table}': {count} rows")

print("\\\nSample sites:")
for row in c.execute('SELECT name, altitude_m, habitat_type FROM sites'):
    print(f"  {row[0]:15s} | {row[1]}m | {row[2]}")

conn.close()
print("\\\nDatabase created successfully!")`,
      challenge: 'Add a "threats" table that records observed threats (tourism, grazing, invasive species) with severity scores at each site. Insert at least 10 threat records.',
      successHint: 'You have designed a real ecological database. The same schema structure is used by biodiversity monitoring programs worldwide.',
    },
    {
      title: 'SQL queries — extracting ecological insights',
      concept: `The power of a database is in its **queries**. SQL lets you ask complex questions across multiple tables using JOINs, GROUP BY, and aggregate functions.

Key SQL operations:
- **JOIN**: combine rows from different tables based on relationships
- **GROUP BY**: aggregate data by categories
- **HAVING**: filter groups after aggregation
- **Subqueries**: nest one query inside another
- **Window functions**: calculate running totals, ranks, moving averages

For conservation, the critical questions are:
1. Is the population increasing or decreasing?
2. Which sites have the healthiest populations?
3. What environmental conditions correlate with high lily counts?
4. Are any sites at risk of local extinction?

📚 *In Python, cursor.execute(sql) runs a query, and cursor.fetchall() returns all matching rows as a list of tuples.*`,
      analogy: 'SQL queries are like asking a librarian very specific questions. "Show me all books published after 2020 by authors from Nagaland, sorted by rating" — the librarian knows exactly where to look across multiple catalogs. Without SQL, you would have to manually cross-reference the book catalog, author catalog, and review catalog yourself.',
      storyConnection: 'A conservation manager at Dzukou needs to write an annual report: which sites are declining? What is driving the decline? SQL queries turn 3 years of raw data into actionable insights that determine whether to restrict tourism, control invasive species, or expand the protected area.',
      checkQuestion: 'Why is GROUP BY important for ecological analysis?',
      checkAnswer: 'Ecological data is inherently grouped: by site, by year, by species, by habitat type. GROUP BY lets you calculate statistics (mean, sum, count) for each group separately. Without it, you could only calculate overall averages, missing crucial variation between sites or years. A declining overall average might hide the fact that one site is thriving while another is collapsing — GROUP BY reveals this.',
      codeIntro: 'Query the survey database to extract conservation-critical information.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

# Recreate and populate database (same as previous lesson)
c.executescript('''
    CREATE TABLE sites (site_id INTEGER PRIMARY KEY, name TEXT, latitude REAL, longitude REAL, altitude_m INTEGER, slope_aspect TEXT, habitat_type TEXT);
    CREATE TABLE surveys (survey_id INTEGER PRIMARY KEY, site_id INTEGER, survey_date TEXT, surveyor TEXT, weather TEXT);
    CREATE TABLE observations (obs_id INTEGER PRIMARY KEY, survey_id INTEGER, species TEXT, count INTEGER, flowering INTEGER, health_score REAL);
    CREATE TABLE environmental (reading_id INTEGER PRIMARY KEY, site_id INTEGER, date TEXT, temp_c REAL, uv_index REAL, rainfall_mm REAL, soil_moisture_pct REAL);
''')

np.random.seed(42)
sites = [(1,'East Ridge',25.525,93.835,2480,'E','alpine meadow'),(2,'Valley Floor',25.520,93.838,2410,'flat','wet grassland'),
         (3,'West Slope',25.518,93.830,2520,'W','rocky outcrop'),(4,'North Gully',25.530,93.833,2390,'N','sheltered gully'),
         (5,'South Face',25.515,93.840,2550,'S','exposed slope')]
c.executemany('INSERT INTO sites VALUES (?,?,?,?,?,?,?)', sites)

sid = 1
for year in [2023, 2024, 2025]:
    for month in range(5, 11):
        for site_id in range(1, 6):
            date = f'{year}-{month:02d}-15'
            weather = np.random.choice(['clear','cloudy','rain','fog'], p=[0.3,0.3,0.2,0.2])
            c.execute('INSERT INTO surveys VALUES (?,?,?,?,?)', (sid, site_id, date, 'Dr. Sema', weather))
            base = [15,25,8,20,5][site_id-1]
            seasonal = max(0, 10*np.sin(np.pi*(month-4)/7))
            trend = -1*(year-2023)
            count = max(0, int(np.random.poisson(base+seasonal+trend)))
            flowering = 1 if month in [7,8] else 0
            health = np.clip(np.random.normal(7.5-0.3*(year-2023), 1.0), 1, 10)
            c.execute('INSERT INTO observations VALUES (?,?,?,?,?,?)', (None, sid, 'Lilium mackliniae', count, flowering, round(health,1)))
            temp = 12+8*np.sin(np.pi*(month-3)/7)+np.random.normal(0,2)
            uv = 5+3*np.sin(np.pi*(month-3)/7)+np.random.normal(0,0.5)
            rain = max(0, np.random.exponential(50 if month in [6,7,8] else 15))
            soil = np.clip(30+rain*0.3+np.random.normal(0,5), 5, 95)
            c.execute('INSERT INTO environmental VALUES (?,?,?,?,?,?,?)', (None, site_id, date, round(temp,1), round(uv,1), round(rain,1), round(soil,1)))
            sid += 1
conn.commit()

# Query 1: Population trend by year
print("=" * 50)
print("QUERY 1: Annual population trend by site")
print("=" * 50)
rows = c.execute('''
    SELECT s.name, substr(sv.survey_date, 1, 4) as year,
           SUM(o.count) as total_count,
           ROUND(AVG(o.health_score), 1) as avg_health
    FROM observations o
    JOIN surveys sv ON o.survey_id = sv.survey_id
    JOIN sites s ON sv.site_id = s.site_id
    GROUP BY s.name, year
    ORDER BY s.name, year
''').fetchall()
current_site = ""
for name, year, total, health in rows:
    if name != current_site:
        print(f"\\\n  {name}:")
        current_site = name
    print(f"    {year}: {total:>4} lilies | health: {health}")

# Query 2: Best month for flowering
print("\\\n" + "=" * 50)
print("QUERY 2: Flowering peak analysis")
print("=" * 50)
rows = c.execute('''
    SELECT substr(sv.survey_date, 6, 2) as month,
           SUM(o.count) as total,
           SUM(CASE WHEN o.flowering = 1 THEN o.count ELSE 0 END) as flowering_count
    FROM observations o
    JOIN surveys sv ON o.survey_id = sv.survey_id
    GROUP BY month ORDER BY month
''').fetchall()
for month, total, flowering in rows:
    pct = flowering/total*100 if total > 0 else 0
    bar = "█" * int(pct / 5)
    print(f"  Month {month}: {total:>4} plants | {flowering:>4} flowering ({pct:.0f}%) {bar}")

# Query 3: Environmental correlations
print("\\\n" + "=" * 50)
print("QUERY 3: High-count sites vs environmental conditions")
print("=" * 50)
rows = c.execute('''
    SELECT s.name, s.altitude_m,
           ROUND(AVG(e.temp_c), 1) as avg_temp,
           ROUND(AVG(e.uv_index), 1) as avg_uv,
           ROUND(AVG(e.soil_moisture_pct), 1) as avg_moisture,
           SUM(o.count) as total_lilies
    FROM sites s
    JOIN environmental e ON s.site_id = e.site_id
    JOIN surveys sv ON s.site_id = sv.site_id
    JOIN observations o ON sv.survey_id = o.survey_id
    GROUP BY s.name
    ORDER BY total_lilies DESC
''').fetchall()
print(f"  {'Site':15s} | {'Alt':>5} | {'Temp':>5} | {'UV':>4} | {'Moist':>5} | {'Lilies':>6}")
print(f"  {'-'*15}-+-{'-'*5}-+-{'-'*5}-+-{'-'*4}-+-{'-'*5}-+-{'-'*6}")
for name, alt, temp, uv, moist, lilies in rows:
    print(f"  {name:15s} | {alt:>5} | {temp:>5} | {uv:>4} | {moist:>5} | {lilies:>6}")

conn.close()`,
      challenge: 'Write a query that finds which weather condition (clear/cloudy/rain/fog) is associated with the highest lily counts. Does weather affect survey accuracy?',
      successHint: 'You can now extract meaningful ecological insights from raw data using SQL. These exact query patterns are used in real biodiversity databases worldwide.',
    },
    {
      title: 'Conservation priority algorithm — which sites to protect first?',
      concept: `With limited conservation resources, managers must **prioritize** which sites to protect. This is a classic optimization problem:

**Maximize** total conservation value
**Subject to** budget constraints

Factors in the priority score:
- **Population size**: larger populations = higher genetic diversity
- **Trend**: declining populations need urgent attention
- **Uniqueness**: sites with rare habitat types score higher
- **Threat level**: sites facing imminent threats need immediate action
- **Connectivity**: isolated sites cannot be recolonized if lost

The **weighted scoring algorithm** assigns weights to each factor and ranks sites. More sophisticated approaches use **integer linear programming** to select the optimal set of sites under a budget.

📚 *Algorithms combine data structures and logic to solve problems. A scoring algorithm assigns numeric values to qualitative factors, making comparison objective.*`,
      analogy: 'Conservation prioritization is like triage in an emergency room. You cannot treat everyone at once, so you assess severity (population decline), urgency (threat level), and likelihood of success (habitat quality). The triage algorithm ensures limited resources save the most lives — or in this case, the most lilies.',
      storyConnection: 'Dzukou Valley has limited conservation funding. Should they protect the Valley Floor (most lilies but least threatened) or the South Face (fewest lilies but declining fastest)? The priority algorithm makes this decision evidence-based rather than emotional.',
      checkQuestion: 'Why might the site with the MOST lilies not be the highest conservation priority?',
      checkAnswer: 'A large, stable population on protected land may not need intervention — it is self-sustaining. A small, declining population on threatened land might go extinct without help. Conservation prioritization weighs the MARGINAL BENEFIT of intervention: where does each dollar of protection save the most lilies? Often, that is at threatened sites with moderate populations, not at the biggest, safest site.',
      codeIntro: 'Build a conservation priority scoring system for Dzukou Valley sites.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

# Create a focused priority analysis database
c.executescript('''
    CREATE TABLE sites (
        site_id INTEGER PRIMARY KEY, name TEXT, altitude_m INTEGER,
        area_hectares REAL, habitat_type TEXT, protected INTEGER
    );
    CREATE TABLE population_data (
        site_id INTEGER, year INTEGER, total_count INTEGER,
        juveniles INTEGER, flowering_pct REAL,
        FOREIGN KEY (site_id) REFERENCES sites(site_id)
    );
    CREATE TABLE threats (
        site_id INTEGER, threat_type TEXT, severity REAL,
        FOREIGN KEY (site_id) REFERENCES sites(site_id)
    );
''')

# Insert site data
sites = [
    (1, 'East Ridge', 2480, 12.5, 'alpine meadow', 1),
    (2, 'Valley Floor', 2410, 25.0, 'wet grassland', 0),
    (3, 'West Slope', 2520, 8.0, 'rocky outcrop', 0),
    (4, 'North Gully', 2390, 15.0, 'sheltered gully', 1),
    (5, 'South Face', 2550, 6.0, 'exposed slope', 0),
]
c.executemany('INSERT INTO sites VALUES (?,?,?,?,?,?)', sites)

# Population trends (3 years)
pop_data = [
    (1,2023,450,80,65.0),(1,2024,430,70,60.0),(1,2025,420,65,58.0),
    (2,2023,800,150,70.0),(2,2024,750,120,65.0),(2,2025,680,100,55.0),
    (3,2023,200,40,50.0),(3,2024,180,30,45.0),(3,2025,150,20,35.0),
    (4,2023,550,100,68.0),(4,2024,560,105,70.0),(4,2025,570,110,72.0),
    (5,2023,120,25,40.0),(5,2024,90,15,30.0),(5,2025,60,8,20.0),
]
c.executemany('INSERT INTO population_data VALUES (?,?,?,?,?)', pop_data)

# Threat assessments
threats = [
    (1,'tourism',3.0),(1,'climate',5.0),
    (2,'tourism',7.0),(2,'grazing',6.0),(2,'invasive_species',4.0),
    (3,'climate',6.0),(3,'erosion',5.0),
    (4,'tourism',2.0),(4,'climate',3.0),
    (5,'climate',8.0),(5,'erosion',7.0),(5,'grazing',5.0),
]
c.executemany('INSERT INTO threats VALUES (?,?,?)', threats)
conn.commit()

# Calculate priority scores
print("CONSERVATION PRIORITY ANALYSIS")
print("=" * 70)

# Weights for each factor (sum to 1.0)
weights = {
    'population': 0.15,    # current population size
    'trend': 0.25,         # population trend (decline = higher priority)
    'juvenile': 0.15,      # juvenile recruitment (proxy for viability)
    'threat': 0.25,        # combined threat level
    'unprotected': 0.10,   # not yet protected = higher priority
    'uniqueness': 0.10,    # unique habitat = higher priority
}

results = []
for site_id, name, alt, area, habitat, protected in sites:
    # Population score (inverse — smaller needs more help)
    pop_2025 = c.execute('SELECT total_count FROM population_data WHERE site_id=? AND year=2025', (site_id,)).fetchone()[0]
    pop_max = 800  # max across all sites
    pop_score = 1 - (pop_2025 / pop_max)  # smaller pop = higher score

    # Trend score (decline rate)
    pops = c.execute('SELECT total_count FROM population_data WHERE site_id=? ORDER BY year', (site_id,)).fetchall()
    pops = [p[0] for p in pops]
    if pops[0] > 0:
        decline_rate = (pops[0] - pops[-1]) / pops[0]
    else:
        decline_rate = 0
    trend_score = max(0, min(1, decline_rate * 3))  # scale to 0-1

    # Juvenile score (low juveniles = high priority)
    juv_2025 = c.execute('SELECT juveniles FROM population_data WHERE site_id=? AND year=2025', (site_id,)).fetchone()[0]
    juv_ratio = juv_2025 / max(pop_2025, 1)
    juv_score = 1 - min(1, juv_ratio * 5)  # low ratio = high score

    # Threat score
    threat_avg = c.execute('SELECT AVG(severity) FROM threats WHERE site_id=?', (site_id,)).fetchone()[0] or 0
    threat_score = threat_avg / 10  # normalize to 0-1

    # Protection score (unprotected = higher priority)
    prot_score = 0 if protected else 1

    # Uniqueness (rare habitat types score higher)
    habitat_counts = c.execute('SELECT COUNT(*) FROM sites WHERE habitat_type=?', (habitat,)).fetchone()[0]
    unique_score = 1 / habitat_counts

    # Weighted total
    total = (weights['population'] * pop_score +
             weights['trend'] * trend_score +
             weights['juvenile'] * juv_score +
             weights['threat'] * threat_score +
             weights['unprotected'] * prot_score +
             weights['uniqueness'] * unique_score)

    results.append((name, total, pop_2025, decline_rate*100, threat_avg, protected))

# Sort by priority (highest first)
results.sort(key=lambda x: -x[1])

print(f"\\\n{'Rank':>4} | {'Site':15s} | {'Score':>5} | {'Pop':>5} | {'Decline':>7} | {'Threat':>6} | {'Protected':>9}")
print(f"{'':>4}-+-{'-'*15}-+-{'-'*5}-+-{'-'*5}-+-{'-'*7}-+-{'-'*6}-+-{'-'*9}")
for rank, (name, score, pop, decline, threat, prot) in enumerate(results, 1):
    status = "Yes" if prot else "NO"
    urgency = "CRITICAL" if score > 0.6 else "HIGH" if score > 0.4 else "MODERATE" if score > 0.25 else "LOW"
    print(f"  {rank:>2} | {name:15s} | {score:5.3f} | {pop:>5} | {decline:>6.1f}% | {threat:>6.1f} | {status:>9} → {urgency}")

print(f"\\\nRECOMMENDATION: Prioritize protection for '{results[0][0]}' (score: {results[0][1]:.3f})")
conn.close()`,
      challenge: 'Add a "budget" constraint: each site costs a different amount to protect. Find the combination of sites that maximizes total priority score without exceeding a budget of 100 units.',
      successHint: 'You have built a decision-support tool used by real conservation organizations. The scoring and ranking approach is the foundation of systematic conservation planning.',
    },
    {
      title: 'Climate projection — modeling future lily habitat',
      concept: `Climate change shifts the environmental conditions that determine where the Dzukou Lily can survive. We need to model:

1. **Temperature increase**: global warming raises mountain temperatures
2. **UV change**: ozone recovery reduces UV, but altitude effects persist
3. **Precipitation shifts**: monsoon patterns are changing
4. **Habitat migration**: as conditions shift upward, suitable habitat shrinks

The key insight: mountains are **cones**. As you go higher, the available area shrinks. A 200 m upward shift in habitat might reduce available area by 40% — even if conditions remain perfect within that narrower band.

📚 *Complex algorithms combine database queries with mathematical models. We query historical data, fit trends, project forward, and store predictions back in the database.*`,
      analogy: 'Imagine the lily lives on a specific floor of a building that is slowly flooding. As water rises (warming climate), it must move to higher floors. But each floor is smaller than the one below (mountain cone shape). Eventually, the floors are too small to sustain the population. Climate change is not just about temperature — it is about shrinking real estate.',
      storyConnection: 'The Dzukou Lily is already near the top of its mountain. Unlike lowland species that can migrate northward or upward, the lily has nowhere to go. Climate projections tell us how much time remains and what interventions might help.',
      checkQuestion: 'Why can the lily not simply migrate to a nearby taller mountain as conditions warm?',
      checkAnswer: 'Three barriers prevent easy migration: (1) Dispersal limitation — lily seeds travel only short distances and cannot cross valleys. (2) Soil requirements — the lily needs specific soil chemistry and mycorrhizal fungi that took millennia to develop. (3) Time lag — even if seeds arrive, establishing a self-sustaining population takes decades. Climate change moves faster than the lily can follow.',
      codeIntro: 'Project the Dzukou Lily habitat area under different climate scenarios.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE climate_projections (
        scenario TEXT, year INTEGER, temp_increase REAL,
        habitat_low_m REAL, habitat_high_m REAL,
        area_fraction REAL, estimated_population INTEGER
    );
''')

# Mountain geometry: area decreases with altitude
# Model Dzukou as a rough cone
def area_at_altitude(alt_low, alt_high, peak=3000, base_radius_km=5):
    """Approximate area between two altitudes on a conical mountain."""
    r_low = base_radius_km * (1 - alt_low / peak)
    r_high = base_radius_km * (1 - alt_high / peak)
    r_low = max(r_low, 0)
    r_high = max(r_high, 0)
    return np.pi * (r_low**2 - r_high**2)  # km²

# Current lily habitat: 2400-2600m
current_low, current_high = 2400, 2600
current_area = area_at_altitude(current_low, current_high)
current_pop = 50000

# Climate scenarios (IPCC-based)
scenarios = {
    'RCP 2.6 (optimistic)': {'rate': 0.015, 'color': '#10b981'},   # °C/year
    'RCP 4.5 (moderate)':   {'rate': 0.025, 'color': '#f59e0b'},
    'RCP 8.5 (worst case)': {'rate': 0.045, 'color': '#f87171'},
}

years = np.arange(2025, 2126)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

for name, params in scenarios.items():
    temp_increases = []
    habitat_lows = []
    habitat_highs = []
    areas = []
    populations = []

    for year in years:
        dt = year - 2025
        temp_inc = params['rate'] * dt
        # Habitat shifts upward: ~150m per °C of warming
        shift = 150 * temp_inc
        h_low = current_low + shift
        h_high = min(current_high + shift, 3000)  # mountain peak limit

        area = area_at_altitude(h_low, h_high)
        area_frac = area / current_area if current_area > 0 else 0
        pop = int(current_pop * area_frac * max(0, 1 - 0.005 * dt))  # additional stress

        temp_increases.append(temp_inc)
        habitat_lows.append(h_low)
        habitat_highs.append(h_high)
        areas.append(area)
        populations.append(pop)

        c.execute('INSERT INTO climate_projections VALUES (?,?,?,?,?,?,?)',
                 (name, int(year), round(temp_inc, 2), round(h_low, 0),
                  round(h_high, 0), round(area_frac, 4), pop))

    color = params['color']
    axes[0,0].plot(years, temp_increases, color=color, linewidth=2, label=name)
    axes[0,1].fill_between(years, habitat_lows, habitat_highs, alpha=0.3, color=color, label=name)
    axes[1,0].plot(years, areas, color=color, linewidth=2, label=name)
    axes[1,1].plot(years, populations, color=color, linewidth=2, label=name)

conn.commit()

axes[0,0].set_ylabel('Temperature increase (°C)', color='white', fontsize=10)
axes[0,0].set_title('Warming Trajectory', color='white', fontsize=12, fontweight='bold')
axes[0,1].set_ylabel('Altitude (m)', color='white', fontsize=10)
axes[0,1].set_title('Habitat Band Shift', color='white', fontsize=12, fontweight='bold')
axes[0,1].axhline(y=3000, color='white', linestyle=':', alpha=0.3, label='Mountain peak')
axes[1,0].set_ylabel('Habitat Area (km²)', color='white', fontsize=10)
axes[1,0].set_title('Available Habitat', color='white', fontsize=12, fontweight='bold')
axes[1,1].set_ylabel('Estimated Population', color='white', fontsize=10)
axes[1,1].set_title('Population Projection', color='white', fontsize=12, fontweight='bold')

for ax in axes.flat:
    ax.set_xlabel('Year', color='white', fontsize=10)
    ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

plt.suptitle('Dzukou Lily — Climate Change Impact Projections', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

# Summary from database
print("\\\nProjected status in 2075 and 2125:")
for scenario in scenarios:
    for target_year in [2075, 2125]:
        row = c.execute('''SELECT temp_increase, habitat_low_m, area_fraction, estimated_population
                          FROM climate_projections WHERE scenario=? AND year=?''',
                       (scenario, target_year)).fetchone()
        if row:
            print(f"  {scenario} @ {target_year}: +{row[0]:.1f}°C | habitat floor: {row[1]:.0f}m | "
                  f"area: {row[2]*100:.1f}% | pop: {row[3]:,}")

conn.close()`,
      challenge: 'Add an "assisted migration" scenario where humans transplant lilies to a nearby taller mountain (peak at 3,500 m). How much does this extend the population\'s projected survival?',
      successHint: 'You have built a complete climate impact projection tool that combines database storage with mathematical modeling and visualization. This is the kind of analysis that informs real policy decisions about endangered species.',
    },
    {
      title: 'Capstone — Dzukou Lily conservation decision engine',
      concept: `The **capstone project** integrates everything: database design, complex queries, mathematical models, and visualization into a single conservation decision support system.

The system must:
1. Store and retrieve survey data from a relational database
2. Calculate population trends and viability metrics
3. Run climate projections for multiple scenarios
4. Generate a priority-ranked action plan with cost-benefit analysis
5. Produce a visual report

This mirrors real conservation management systems like the IUCN Red List assessment tool, which combines field data, population models, and threat analyses to classify species and recommend actions.

📚 *A capstone project demonstrates mastery by combining all skills learned across the course. The goal is not just correct code, but a coherent, useful system.*`,
      analogy: 'This capstone is like building a complete weather forecast system. You need the data collection infrastructure (database), the physics models (population dynamics, climate), the analysis tools (queries, statistics), and the communication layer (plots, reports). Each piece alone is useful; together they are a powerful decision engine.',
      storyConnection: 'The Dzukou Lily conservation team needs a single tool that takes raw field data and outputs actionable recommendations. This capstone builds that tool — the same kind of system used by the Wildlife Institute of India and Project Tiger.',
      checkQuestion: 'What is the most important output of a conservation decision engine — data, analysis, or recommendations?',
      checkAnswer: 'Recommendations, because they drive action. Data without analysis is noise. Analysis without recommendations is academic. But recommendations must be traceable back through the analysis to the data, so decision-makers can verify the logic and adjust assumptions. The best systems produce clear recommendations WITH the evidence chain that supports them.',
      codeIntro: 'Build a complete conservation decision engine that generates an actionable report.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

# === DECISION ENGINE ===
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE sites (site_id INTEGER PRIMARY KEY, name TEXT, altitude_m INTEGER, area_ha REAL, protected INTEGER);
    CREATE TABLE annual_surveys (site_id INTEGER, year INTEGER, population INTEGER, health REAL, flowering_pct REAL, juvenile_pct REAL);
    CREATE TABLE site_threats (site_id INTEGER, threat TEXT, severity REAL, mitigation_cost REAL);
    CREATE TABLE actions (action_id INTEGER PRIMARY KEY AUTOINCREMENT, site_id INTEGER, action TEXT, priority TEXT, expected_benefit REAL, cost REAL);
''')

# Populate with comprehensive data
sites = [(1,'East Ridge',2480,12.5,1),(2,'Valley Floor',2410,25.0,0),(3,'West Slope',2520,8.0,0),(4,'North Gully',2390,15.0,1),(5,'South Face',2550,6.0,0)]
c.executemany('INSERT INTO sites VALUES (?,?,?,?,?)', sites)

np.random.seed(42)
for sid, _, alt, area, _ in sites:
    base_pop = int(area * np.random.uniform(20, 50))
    for yr in range(2020, 2026):
        trend = np.random.normal(-0.02 if sid in [3,5] else 0.01, 0.03)
        pop = max(10, int(base_pop * (1 + trend) ** (yr - 2020)))
        health = np.clip(np.random.normal(7 - 0.5*(sid==5), 1), 1, 10)
        flower = np.clip(np.random.normal(60 - 5*(alt-2400)/100, 10), 10, 95)
        juv = np.clip(np.random.normal(20 + 5*(sid==4), 5), 5, 40)
        c.execute('INSERT INTO annual_surveys VALUES (?,?,?,?,?,?)',
                 (sid, yr, pop, round(health,1), round(flower,1), round(juv,1)))
        base_pop = pop

threats_data = [
    (1,'tourism',3,50),(1,'climate',5,200),
    (2,'tourism',7,80),(2,'grazing',6,40),(2,'invasive',4,60),
    (3,'climate',7,300),(3,'erosion',6,100),
    (4,'tourism',2,30),(4,'climate',3,150),
    (5,'climate',9,400),(5,'erosion',8,120),(5,'overgrazing',6,50),
]
c.executemany('INSERT INTO site_threats VALUES (?,?,?,?)', threats_data)
conn.commit()

# === ANALYSIS ENGINE ===
print("╔══════════════════════════════════════════════════════════╗")
print("║     DZUKOU LILY CONSERVATION DECISION REPORT — 2025    ║")
print("╚══════════════════════════════════════════════════════════╝")

# 1. Population Status
print("\\\n[1] POPULATION STATUS")
print("-" * 55)
site_status = []
for sid, name, alt, area, prot in sites:
    rows = c.execute('SELECT year, population, health, flowering_pct, juvenile_pct FROM annual_surveys WHERE site_id=? ORDER BY year', (sid,)).fetchall()
    pops = [r[1] for r in rows]
    if len(pops) >= 2:
        # Linear regression for trend
        x = np.arange(len(pops))
        slope = np.polyfit(x, pops, 1)[0]
        pct_change = slope / pops[0] * 100
    else:
        pct_change = 0
    latest = rows[-1]
    threat_sum = c.execute('SELECT SUM(severity) FROM site_threats WHERE site_id=?', (sid,)).fetchone()[0] or 0
    status = "CRITICAL" if pct_change < -3 or latest[2] < 5 else "DECLINING" if pct_change < 0 else "STABLE" if pct_change < 2 else "GROWING"
    site_status.append((sid, name, latest[1], pct_change, latest[2], threat_sum, status))
    print(f"  {name:15s} | Pop: {latest[1]:>5} | Trend: {pct_change:>+5.1f}%/yr | Health: {latest[2]:.1f} | {status}")

# 2. Threat Assessment
print(f"\\\n[2] THREAT ASSESSMENT")
print("-" * 55)
for sid, name, _, _, _ in sites:
    threats = c.execute('SELECT threat, severity, mitigation_cost FROM site_threats WHERE site_id=? ORDER BY severity DESC', (sid,)).fetchall()
    threat_str = ", ".join(f"{t[0]}({t[1]:.0f})" for t in threats)
    total_cost = sum(t[2] for t in threats)
    print(f"  {name:15s} | {threat_str:40s} | Mitigation: \${total_cost:>5.0f}")

# 3. Generate Actions
print(f"\\\n[3] RECOMMENDED ACTIONS")
print("-" * 55)
for sid, name, pop, trend, health, threat_sum, status in site_status:
    if status == "CRITICAL":
        c.execute('INSERT INTO actions (site_id, action, priority, expected_benefit, cost) VALUES (?,?,?,?,?)',
                 (sid, 'Emergency habitat restoration', 'URGENT', 0.3, 500))
        c.execute('INSERT INTO actions (site_id, action, priority, expected_benefit, cost) VALUES (?,?,?,?,?)',
                 (sid, 'Seed bank collection', 'URGENT', 0.2, 100))
    if status in ["CRITICAL", "DECLINING"]:
        c.execute('INSERT INTO actions (site_id, action, priority, expected_benefit, cost) VALUES (?,?,?,?,?)',
                 (sid, 'Threat mitigation program', 'HIGH', 0.25, 300))
    if not [s for s in sites if s[0]==sid][0][4]:  # not protected
        c.execute('INSERT INTO actions (site_id, action, priority, expected_benefit, cost) VALUES (?,?,?,?,?)',
                 (sid, 'Legal protection designation', 'HIGH', 0.15, 200))
conn.commit()

actions = c.execute('''
    SELECT s.name, a.action, a.priority, a.expected_benefit, a.cost
    FROM actions a JOIN sites s ON a.site_id = s.site_id
    ORDER BY CASE a.priority WHEN 'URGENT' THEN 1 WHEN 'HIGH' THEN 2 ELSE 3 END, a.cost
''').fetchall()
total_cost = 0
for name, action, priority, benefit, cost in actions:
    print(f"  [{priority:>6}] {name:15s} → {action:35s} (benefit: +{benefit*100:.0f}%, cost: \${cost:.0f})")
    total_cost += cost

print(f"\\\n  Total budget required: \${total_cost:,.0f}")

# 4. Visualization
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')
for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

colors_map = {'CRITICAL':'#f87171','DECLINING':'#f59e0b','STABLE':'#60a5fa','GROWING':'#10b981'}
for sid, name, pop, trend, health, threat, status in site_status:
    rows = c.execute('SELECT year, population FROM annual_surveys WHERE site_id=? ORDER BY year', (sid,)).fetchall()
    yrs = [r[0] for r in rows]
    pops = [r[1] for r in rows]
    axes[0].plot(yrs, pops, 'o-', color=colors_map[status], linewidth=2, markersize=4, label=f'{name} ({status})')

axes[0].set_xlabel('Year', color='white', fontsize=11)
axes[0].set_ylabel('Population', color='white', fontsize=11)
axes[0].set_title('Population Trends by Site', color='white', fontsize=13, fontweight='bold')
axes[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Priority matrix
names = [s[1] for s in site_status]
threats_vals = [s[5] for s in site_status]
pops_vals = [s[2] for s in site_status]
status_colors = [colors_map[s[6]] for s in site_status]
axes[1].scatter(threats_vals, pops_vals, c=status_colors, s=200, edgecolors='white', linewidths=1.5, zorder=5)
for i, name in enumerate(names):
    axes[1].annotate(name, (threats_vals[i], pops_vals[i]), textcoords="offset points",
                    xytext=(8, 5), color='white', fontsize=9)
axes[1].set_xlabel('Total Threat Score', color='white', fontsize=11)
axes[1].set_ylabel('Current Population', color='white', fontsize=11)
axes[1].set_title('Priority Matrix: Threat vs Population', color='white', fontsize=13, fontweight='bold')

plt.suptitle('Dzukou Lily Conservation Dashboard', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

conn.close()
print("\\\n✓ Decision report complete. All data stored and queryable.")`,
      challenge: 'Add a 5-year budget allocation optimizer: given $1,000 total budget over 5 years, which actions in which years maximize the total population in 2030? Use a greedy algorithm to find the best allocation.',
      successHint: 'You have built a complete conservation decision support system from scratch. This capstone demonstrates mastery of databases, algorithms, mathematical modeling, and data visualization — the same skills used by professional conservation biologists.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Conservation Data Science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with sqlite3, numpy, and matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
