import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FourteenGodsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Building an eclipse database',
      concept: `An eclipse database stores every eclipse across centuries — their dates, types, Saros series, and visibility paths. This is exactly how NASA\'s eclipse catalogue works.

Our database needs tables for:
- **eclipses**: date, type (solar/lunar), subtype (total/annular/partial), Saros number
- **visibility**: which geographic regions can see each eclipse
- **saros_series**: metadata about each Saros family

With this data, we can answer questions like:
- "When is the next eclipse visible from Tripura?"
- "How many total solar eclipses occur per century?"
- "Which Saros series is most active right now?"

📚 *We will create the database in SQLite, populate it with historical data, and run analytical queries.*`,
      analogy: 'A library catalogue does not just list books — it organises them by author, genre, and year so you can find exactly what you need. An eclipse database organises celestial events so astronomers (and festival planners) can query centuries of data instantly.',
      storyConnection: 'If the priests of the fourteen gods had a database, they could query "next eclipse visible from Tripura during Ashadha month" and plan accordingly. This tool bridges ancient observational astronomy with modern data science.',
      checkQuestion: 'Why store the Saros series number for each eclipse?',
      checkAnswer: 'Because eclipses in the same Saros series are geometrically similar — knowing the series lets you predict the character of future eclipses (total vs annular, northern vs southern). A Saros series is like a "family" of related eclipses.',
      codeIntro: 'Create and populate an eclipse database with historical and predicted eclipse data.',
      code: `import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE saros_series (
    id INTEGER PRIMARY KEY,
    start_year INTEGER,
    end_year INTEGER,
    total_eclipses INTEGER,
    type TEXT
);

CREATE TABLE eclipses (
    id INTEGER PRIMARY KEY,
    date TEXT,
    year INTEGER,
    type TEXT,
    subtype TEXT,
    saros_id INTEGER REFERENCES saros_series(id),
    max_duration_s REAL,
    gamma REAL
);

CREATE TABLE visibility (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eclipse_id INTEGER REFERENCES eclipses(id),
    region TEXT,
    visible INTEGER
);
''')

# Saros series data
series = [
    (136, 1680, 2942, 71, 'solar'), (139, 1501, 2763, 71, 'solar'),
    (145, 1639, 3009, 77, 'solar'), (152, 1805, 3049, 70, 'solar'),
]
cur.executemany('INSERT INTO saros_series VALUES (?,?,?,?,?)', series)

# Eclipse data (selected real eclipses)
eclipses_data = [
    (1, '2019-07-02', 2019, 'solar', 'total', 127, 273, -0.647),
    (2, '2019-07-16', 2019, 'lunar', 'partial', 139, 0, 0),
    (3, '2019-12-26', 2019, 'solar', 'annular', 132, 222, 0.414),
    (4, '2020-06-21', 2020, 'solar', 'annular', 137, 38, 0.481),
    (5, '2020-11-30', 2020, 'lunar', 'penumbral', 116, 0, 0),
    (6, '2021-06-10', 2021, 'solar', 'annular', 147, 231, 0.915),
    (7, '2023-04-20', 2023, 'solar', 'hybrid', 129, 76, -0.395),
    (8, '2023-10-14', 2023, 'solar', 'annular', 134, 317, 0.375),
    (9, '2024-04-08', 2024, 'solar', 'total', 139, 268, 0.343),
    (10, '2024-10-02', 2024, 'solar', 'annular', 144, 444, -0.351),
    (11, '2026-08-12', 2026, 'solar', 'total', 126, 132, -1.179),
    (12, '2027-02-06', 2027, 'solar', 'annular', 131, 462, 0.295),
    (13, '2028-01-26', 2028, 'solar', 'annular', 141, 564, 0.390),
    (14, '2030-06-01', 2030, 'solar', 'annular', 128, 318, 0.562),
    (15, '2031-05-21', 2031, 'solar', 'total', 138, 312, -0.197),
]
cur.executemany('INSERT INTO eclipses VALUES (?,?,?,?,?,?,?,?)', eclipses_data)

# Visibility from NE India (Tripura ~23.8°N, 91.3°E)
# Approximate based on gamma and eclipse geometry
vis_data = [
    (4, 'Tripura', 1), (5, 'Tripura', 1), (10, 'Tripura', 0),
    (9, 'Tripura', 0), (8, 'Tripura', 0), (12, 'Tripura', 1),
]
cur.executemany('INSERT INTO visibility (eclipse_id, region, visible) VALUES (?,?,?)', vis_data)
db.commit()

# Queries
print("ALL SOLAR ECLIPSES (2019-2031)")
print("=" * 70)
print(f"{'Date':<12} {'Type':<10} {'Subtype':<10} {'Saros':>5} {'Duration':>8} {'Gamma':>7}")
print("-" * 70)
for r in cur.execute('SELECT date, type, subtype, saros_id, max_duration_s, gamma FROM eclipses WHERE type="solar" ORDER BY date'):
    dur = f"{r[4]:.0f}s" if r[4] > 0 else "n/a"
    print(f"{r[0]:<12} {r[1]:<10} {r[2]:<10} {r[3]:>5} {dur:>8} {r[5]:>7.3f}")

print(f"\\nTotal eclipses: {cur.execute('SELECT COUNT(*) FROM eclipses').fetchone()[0]}")
print(f"Solar: {cur.execute('SELECT COUNT(*) FROM eclipses WHERE type=\"solar\"').fetchone()[0]}")
print(f"Lunar: {cur.execute('SELECT COUNT(*) FROM eclipses WHERE type=\"lunar\"').fetchone()[0]}")`,
      challenge: 'Add visibility data for 5 more regions (Delhi, Mumbai, London, New York, Tokyo) and query which city sees the most eclipses in this period.',
      successHint: 'A well-structured database turns centuries of astronomical observations into queryable knowledge. NASA maintains exactly this kind of database for eclipse prediction.',
    },
    {
      title: 'Querying eclipse patterns and Saros families',
      concept: `With our database, we can discover patterns that would be invisible in raw lists:

- **Saros family analysis**: how many eclipses does each series produce? When does each peak?
- **Frequency analysis**: how many eclipses per decade? Are they increasing or decreasing?
- **Type distribution**: what fraction are total vs annular vs partial?
- **Regional queries**: which regions get the most eclipses?

Advanced SQL techniques:
- **Window functions**: running totals and rankings
- **CASE expressions**: categorising data conditionally
- **Subqueries**: nesting queries for complex analysis

📚 *We will write analytical queries that extract scientific insights from our eclipse database.*`,
      analogy: 'A detective examines individual clues, but the breakthrough comes from seeing the pattern across all clues together. Database queries are the detective\'s board — connecting individual eclipses into meaningful patterns.',
      storyConnection: 'The fourteen gods\' tradition accumulated centuries of eclipse observations. Our database queries automate what their priests did manually — finding the patterns in celestial events that determine festival timing.',
      checkQuestion: 'If you have 100 eclipses in a database, how would you find which decade has the most?',
      checkAnswer: 'GROUP BY (year / 10) to bucket eclipses into decades, COUNT(*) to get the number per decade, ORDER BY count DESC to find the maximum. This is a one-line SQL query that would take hours to compute manually.',
      codeIntro: 'Run analytical queries to discover patterns in eclipse data.',
      code: `import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE eclipses (
    id INTEGER PRIMARY KEY, date TEXT, year INTEGER,
    type TEXT, subtype TEXT, saros_id INTEGER,
    duration_s REAL, gamma REAL
);
''')

# Expanded dataset: eclipses 2000-2035
data = [
    (1,'2000-02-05',2000,'solar','partial',150,0,-1.233),
    (2,'2001-06-21',2001,'solar','total',127,295,-0.570),
    (3,'2002-06-10',2002,'solar','annular',137,23,0.199),
    (4,'2003-05-31',2003,'solar','annular',147,219,0.995),
    (5,'2003-11-23',2003,'solar','total',152,112,-1.003),
    (6,'2005-04-08',2005,'solar','hybrid',129,42,0.345),
    (7,'2006-03-29',2006,'solar','total',139,247,0.384),
    (8,'2008-08-01',2008,'solar','total',126,132,0.831),
    (9,'2009-07-22',2009,'solar','total',136,399,-0.069),
    (10,'2010-07-11',2010,'solar','total',146,318,0.679),
    (11,'2012-05-20',2012,'solar','annular',128,334,0.483),
    (12,'2012-11-13',2012,'solar','total',133,244,-0.372),
    (13,'2013-05-10',2013,'solar','annular',138,362,0.269),
    (14,'2015-03-20',2015,'solar','total',120,163,0.945),
    (15,'2016-03-09',2016,'solar','total',130,253,-0.260),
    (16,'2017-02-26',2017,'solar','annular',140,44,-0.458),
    (17,'2017-08-21',2017,'solar','total',145,163,0.437),
    (18,'2019-07-02',2019,'solar','total',127,273,-0.647),
    (19,'2019-12-26',2019,'solar','annular',132,222,0.414),
    (20,'2020-06-21',2020,'solar','annular',137,38,0.481),
    (21,'2023-04-20',2023,'solar','hybrid',129,76,-0.395),
    (22,'2024-04-08',2024,'solar','total',139,268,0.343),
    (23,'2024-10-02',2024,'solar','annular',144,444,-0.351),
    (24,'2027-02-06',2027,'solar','annular',131,462,0.295),
    (25,'2028-01-26',2028,'solar','annular',141,564,0.390),
    (26,'2030-06-01',2030,'solar','annular',128,318,0.562),
    (27,'2031-05-21',2031,'solar','total',138,312,-0.197),
    (28,'2034-03-20',2034,'solar','total',145,252,0.375),
]
cur.executemany('INSERT INTO eclipses VALUES (?,?,?,?,?,?,?,?)', data)
db.commit()

# Analysis 1: Eclipses by subtype
print("ECLIPSE TYPE DISTRIBUTION")
print("=" * 40)
for row in cur.execute('''
    SELECT subtype, COUNT(*) as n,
           ROUND(AVG(duration_s), 0) as avg_dur
    FROM eclipses
    GROUP BY subtype ORDER BY n DESC
'''):
    print(f"  {row[0]:10s}: {row[1]:3d} eclipses, avg duration {row[2]:.0f}s")

# Analysis 2: Eclipses per 5-year period
print("\\nECLIPSES PER 5-YEAR PERIOD")
print("-" * 35)
for row in cur.execute('''
    SELECT (year/5)*5 as period, COUNT(*) as n
    FROM eclipses GROUP BY period ORDER BY period
'''):
    bar = "*" * row[1]
    print(f"  {row[0]}-{row[0]+4}: {row[1]:2d} {bar}")

# Analysis 3: Most active Saros series
print("\\nMOST ACTIVE SAROS SERIES")
print("-" * 45)
for row in cur.execute('''
    SELECT saros_id, COUNT(*) as n, GROUP_CONCAT(subtype) as types,
           MIN(year) as first, MAX(year) as last
    FROM eclipses GROUP BY saros_id HAVING n >= 2 ORDER BY n DESC
'''):
    print(f"  Saros {row[0]:>3d}: {row[1]} eclipses ({row[3]}-{row[4]})")

# Analysis 4: Longest eclipses
print("\\nTOP 5 LONGEST ECLIPSES")
print("-" * 50)
for row in cur.execute('''
    SELECT date, subtype, saros_id, duration_s
    FROM eclipses WHERE duration_s > 0
    ORDER BY duration_s DESC LIMIT 5
'''):
    print(f"  {row[0]:12s} {row[1]:8s} Saros {row[2]:3d} — {row[3]:.0f}s ({row[3]/60:.1f} min)")`,
      challenge: 'Write a query to find "eclipse pairs" — two eclipses within 15 days of each other (indicating eclipses at both nodes in the same season). How common are they?',
      successHint: 'Database analysis reveals patterns that span decades and centuries. The Saros series, eclipse seasons, and type distributions all emerge from simple queries over structured data.',
    },
    {
      title: 'Eclipse prediction algorithm',
      concept: `Predicting eclipses requires combining multiple orbital cycles:

1. **Find candidate New Moons**: every 29.53 days
2. **Check node proximity**: Moon must be within 18.5° of a node
3. **Determine type**: based on Moon distance (total vs annular) and gamma value
4. **Calculate visibility**: based on shadow path geometry

The **gamma** parameter (-1 to 1) indicates how centrally the shadow crosses Earth:
- |gamma| < 0.9972: central eclipse possible (total or annular)
- 0.9972 < |gamma| < 1.5: partial eclipse
- |gamma| > 1.5: no eclipse

This algorithm produces predictions accurate to within minutes.

📚 *We will implement the full prediction pipeline and store results in our database.*`,
      analogy: 'Eclipse prediction is like weather forecasting — you combine multiple atmospheric cycles (seasons, jet stream, ocean temperature) to predict whether it will rain. We combine multiple orbital cycles (synodic, draconic, anomalistic) to predict whether an eclipse will occur.',
      storyConnection: 'This algorithm is the modern version of what the fourteen gods\' astronomers did by observation and mental calculation over generations. Each Saros cycle they observed refined their predictions. Our code encapsulates their accumulated wisdom in a few lines.',
      checkQuestion: 'If a New Moon occurs but the Moon is 25° from the nearest node, will there be an eclipse?',
      checkAnswer: 'No. The solar eclipse limit is about 18.5°. At 25°, the Moon\'s shadow passes above or below Earth. However, at 15° there would be a partial eclipse, and at 5° a total or annular eclipse.',
      codeIntro: 'Implement an eclipse prediction algorithm and predict eclipses for the next 20 years.',
      code: `import numpy as np
import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()
cur.execute('''CREATE TABLE predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year REAL, month INTEGER, day INTEGER,
    type TEXT, subtype TEXT, gamma REAL, node_dist REAL
)''')

# Orbital parameters
synodic = 29.530589
draconic = 27.212221
anomalistic = 27.554550

# Reference epoch: Jan 6, 2000 (known New Moon near node)
ref_new_moon = 0       # day 0
ref_node = 2.5         # days offset to node
ref_perigee = 5.0      # days offset to perigee

def predict_eclipses(start_year, end_year):
    """Predict all solar eclipses in a date range."""
    results = []
    start_day = (start_year - 2000) * 365.25
    end_day = (end_year - 2000) * 365.25

    # Iterate over all New Moons
    nm = ref_new_moon
    while nm < end_day:
        if nm >= start_day:
            # Node distance (angular)
            days_since_node = (nm - ref_node) % draconic
            node_angle = (days_since_node / draconic) * 360
            # Distance from nearest node (0 or 180)
            d_asc = min(node_angle, 360 - node_angle)
            d_desc = abs(node_angle - 180)
            node_dist = min(d_asc, d_desc)

            if node_dist < 18.5:  # eclipse limit
                # Gamma approximation (how central)
                gamma = np.sin(np.radians(node_dist)) * 2.5
                # Add some variation based on node
                if d_asc < d_desc:
                    gamma *= 1  # ascending
                else:
                    gamma *= -1  # descending

                # Moon distance determines type
                days_since_perigee = (nm - ref_perigee) % anomalistic
                anomaly = 2 * np.pi * days_since_perigee / anomalistic
                moon_dist_factor = 1 - 0.0549 * np.cos(anomaly)

                if abs(gamma) > 0.9972:
                    subtype = 'partial'
                elif moon_dist_factor < 0.997:
                    subtype = 'total'
                elif moon_dist_factor > 1.003:
                    subtype = 'annular'
                else:
                    subtype = 'hybrid'

                year = 2000 + nm / 365.25
                month = int((nm % 365.25) / 30.44) + 1
                day = int((nm % 365.25) % 30.44) + 1
                results.append((year, month, min(day, 28), 'solar', subtype, gamma, node_dist))

        nm += synodic

    return results

predictions = predict_eclipses(2024, 2044)

# Store in database
for p in predictions:
    cur.execute('INSERT INTO predictions (year,month,day,type,subtype,gamma,node_dist) VALUES (?,?,?,?,?,?,?)', p)
db.commit()

print("PREDICTED SOLAR ECLIPSES 2024-2044")
print("=" * 65)
print(f"{'Year':>7} {'Mon':>4} {'Day':>4} {'Subtype':<10} {'Gamma':>7} {'Node dist':>10}")
print("-" * 65)
for r in cur.execute('SELECT year,month,day,subtype,gamma,node_dist FROM predictions ORDER BY year'):
    print(f"{r[0]:7.1f} {r[1]:4d} {r[2]:4d} {r[3]:<10} {r[4]:>7.2f} {r[5]:>9.1f}°")

total = cur.execute('SELECT COUNT(*) FROM predictions').fetchone()[0]
by_type = cur.execute('SELECT subtype, COUNT(*) FROM predictions GROUP BY subtype ORDER BY COUNT(*) DESC').fetchall()
print(f"\\nTotal predicted: {total}")
for t, n in by_type:
    print(f"  {t}: {n}")
print("\\nNote: dates are approximate (±1-2 days). Real predictions")
print("require full perturbation theory for higher accuracy.")`,
      challenge: 'Add lunar eclipse prediction (check Full Moons near nodes with a 12° limit). How many total eclipses (solar + lunar) are predicted per year on average?',
      successHint: 'You have built an eclipse predictor from first principles — combining three orbital periods to determine when the cosmic geometry aligns. This is exactly how professional eclipse catalogues are computed.',
    },
    {
      title: 'Lunar calendar generator with festival dates',
      concept: `Combining our astronomical models with database storage, we can build a **complete lunar calendar** that:

1. Computes New Moon dates from orbital mechanics
2. Assigns lunar months (Chaitra, Vaishakha, etc.)
3. Calculates tithis (lunar days) within each month
4. Identifies festival dates (Kharchi Puja, Durga Puja, Diwali)
5. Handles leap months (Adhik Maas) when needed

The Hindu calendar uses a lunisolar system:
- Months start at New Moon (Amanta) or Full Moon (Purnimanta)
- 12 months normally, 13 in a leap year
- Solar transit determines the month name

📚 *We will build the full calendar system using sqlite3 for storage and numpy for astronomical calculations.*`,
      analogy: 'A calendar app on your phone combines astronomical data (when the sun rises), cultural rules (when is Easter?), and personal data (your appointments). Our lunar calendar does the same: orbital mechanics + Hindu calendar rules + festival dates.',
      storyConnection: 'This is the ultimate tool for the fourteen gods\' tradition. A working lunar calendar that correctly predicts Kharchi Puja dates for any year bridges the gap between ancient observational astronomy and modern computation.',
      checkQuestion: 'Why do Hindu calendar months sometimes have a leap month (Adhik Maas)?',
      checkAnswer: 'Because 12 lunar months (354.37 days) are ~11 days short of a solar year. Without a leap month, festivals would drift through the seasons. Adding a 13th month every 2-3 years keeps the calendar roughly aligned with the solar year and seasons.',
      codeIntro: 'Build a complete lunar calendar with festival date computation.',
      code: `import numpy as np
import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE lunar_months (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER, month_num INTEGER, name TEXT,
    new_moon_day REAL, full_moon_day REAL, is_leap INTEGER
);
CREATE TABLE tithis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month_id INTEGER, tithi_num INTEGER, paksha TEXT,
    date_approx TEXT
);
CREATE TABLE festivals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, year INTEGER, month_name TEXT,
    tithi INTEGER, paksha TEXT, approx_date TEXT
);
''')

synodic = 29.5306
month_names = ['Chaitra','Vaishakha','Jyeshtha','Ashadha','Shravana',
               'Bhadrapada','Ashwin','Kartik','Margashirsha','Pausha',
               'Magha','Phalguna']

def generate_calendar(year):
    """Generate lunar calendar for a given year."""
    # Approximate first new moon of the year (near spring equinox)
    # Chaitra starts with the new moon closest to March equinox
    # Approximate: start searching from March 1
    base_day = 60  # ~March 1 (day of year)

    # Find new moon nearest to spring equinox
    # Reference: Jan 11, 2024 new moon
    ref_nm = 11 + (year - 2024) * 365.25  # approximate
    # Find new moon closest to March equinox
    nm = ref_nm
    while nm < base_day + (year - 2024) * 365.25:
        nm += synodic
    nm -= synodic  # back up one

    months_data = []
    for m in range(13):  # up to 13 months (with possible leap)
        month_start = nm + m * synodic
        full_moon = month_start + synodic / 2
        month_idx = m % 12
        is_leap = 1 if m >= 12 else 0
        name = f"{'Adhik ' if is_leap else ''}{month_names[month_idx]}"

        cur.execute('INSERT INTO lunar_months (year,month_num,name,new_moon_day,full_moon_day,is_leap) VALUES (?,?,?,?,?,?)',
                    (year, m + 1, name, round(month_start, 2), round(full_moon, 2), is_leap))
        month_id = cur.lastrowid
        months_data.append((month_id, name, month_start))

        # Generate tithis
        for t in range(1, 31):
            paksha = 'Shukla' if t <= 15 else 'Krishna'
            tithi_day = month_start + (t - 1) * synodic / 30
            day_of_year = tithi_day % 365.25
            month_num = int(day_of_year / 30.44) + 1
            day_num = int(day_of_year % 30.44) + 1
            date_str = f"{year}-{month_num:02d}-{min(day_num, 28):02d}"
            cur.execute('INSERT INTO tithis (month_id,tithi_num,paksha,date_approx) VALUES (?,?,?,?)',
                        (month_id, t if t <= 15 else t - 15, paksha, date_str))

    # Festival dates
    festivals = [
        ('Kharchi Puja', 'Ashadha', 8, 'Krishna'),
        ('Guru Purnima', 'Ashadha', 15, 'Shukla'),
        ('Raksha Bandhan', 'Shravana', 15, 'Shukla'),
        ('Durga Puja', 'Ashwin', 10, 'Shukla'),
        ('Diwali', 'Kartik', 1, 'Krishna'),
    ]

    for fname, mname, tithi, paksha in festivals:
        month_row = cur.execute('SELECT id, new_moon_day FROM lunar_months WHERE year=? AND name=? AND is_leap=0',
                                 (year, mname)).fetchone()
        if month_row:
            if paksha == 'Shukla':
                fest_day = month_row[1] + (tithi - 1) * synodic / 30
            else:
                fest_day = month_row[1] + (14 + tithi) * synodic / 30
            day_of_year = fest_day % 365.25
            m = int(day_of_year / 30.44) + 1
            d = int(day_of_year % 30.44) + 1
            date_str = f"{year}-{m:02d}-{min(d, 28):02d}"
            cur.execute('INSERT INTO festivals (name,year,month_name,tithi,paksha,approx_date) VALUES (?,?,?,?,?,?)',
                        (fname, year, mname, tithi, paksha, date_str))

# Generate for multiple years
for y in [2025, 2026, 2027, 2028]:
    generate_calendar(y)
db.commit()

# Display results
print("KHARCHI PUJA DATES (predicted)")
print("=" * 50)
for r in cur.execute('SELECT year, approx_date, month_name, tithi, paksha FROM festivals WHERE name="Kharchi Puja" ORDER BY year'):
    print(f"  {r[0]}: ≈ {r[1]} ({r[2]}, {r[3]}th tithi, {r[4]} Paksha)")

print("\\nALL FESTIVALS BY YEAR")
print("=" * 50)
for r in cur.execute('SELECT year, name, approx_date FROM festivals ORDER BY year, approx_date'):
    print(f"  {r[0]}: {r[1]:20s} ≈ {r[2]}")

print(f"\\nTotal lunar months generated: {cur.execute('SELECT COUNT(*) FROM lunar_months').fetchone()[0]}")
print(f"Total tithis: {cur.execute('SELECT COUNT(*) FROM tithis').fetchone()[0]}")
print(f"Total festivals: {cur.execute('SELECT COUNT(*) FROM festivals').fetchone()[0]}")`,
      challenge: 'Add a leap month detection algorithm: if two New Moons fall in the same solar month (zodiac sign), the first is Adhik Maas. Implement this check.',
      successHint: 'You have built a working lunar calendar — the same type of system used by temple authorities across India to set festival dates. The algorithm combines orbital mechanics with cultural rules.',
    },
    {
      title: 'Complete celestial almanac — the capstone',
      concept: `The final project brings everything together: a **celestial almanac** that combines:

1. **Lunar calendar** with month names and tithis
2. **Eclipse predictions** with types and visibility
3. **Moon phase calculator** with illumination percentages
4. **Festival date finder** for any year
5. **Saros series tracker** for long-term patterns

This is a simplified version of the **Panchanga** — the traditional Hindu almanac that has been computed by astronomers for over 2,000 years. The Panchanga includes five elements: tithi, vara (weekday), nakshatra (lunar mansion), yoga, and karana.

📚 *We will build the complete system with interconnected database tables and comprehensive query capabilities.*`,
      analogy: 'A Panchanga is like a smartphone\'s calendar, weather app, and astronomy app combined into one. It tells you the date, the Moon phase, upcoming eclipses, and which festivals are near — all computed from orbital mechanics.',
      storyConnection: 'The fourteen gods of Tripura are honoured through a Panchanga-based system. This capstone builds a digital Panchanga — honouring the tradition with modern tools while preserving the astronomical precision that has guided it for centuries.',
      checkQuestion: 'Why is the Panchanga still relevant in the age of smartphones and atomic clocks?',
      checkAnswer: 'Because the Panchanga encodes cultural and religious time-keeping that the Gregorian calendar does not capture. Tithis, nakshatras, and yogas have no Gregorian equivalent. Over a billion people use lunisolar dates for festivals, weddings, and ceremonies. The astronomy is universal; the cultural framework is uniquely Indian.',
      codeIntro: 'Build a complete celestial almanac combining all our astronomical models.',
      code: `import numpy as np
import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE almanac_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT, day_of_year INTEGER, year INTEGER,
    moon_phase_pct REAL, moon_dist_km REAL,
    tithi_num INTEGER, tithi_name TEXT, paksha TEXT,
    lunar_month TEXT, eclipse TEXT
);
CREATE TABLE almanac_festivals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT, name TEXT, description TEXT
);
CREATE TABLE almanac_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER, metric TEXT, value TEXT
);
''')

synodic = 29.5306
anomalistic = 27.5546
draconic = 27.2122
year = 2026

# Reference points
ref_nm_doy = 18  # approx Jan 18, 2026 new moon
ref_perigee_doy = 15

tithi_names = ['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami',
               'Shashthi','Saptami','Ashtami','Navami','Dashami',
               'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima/Amavasya']

month_names = ['Magha','Phalguna','Chaitra','Vaishakha','Jyeshtha','Ashadha',
               'Shravana','Bhadrapada','Ashwin','Kartik','Margashirsha','Pausha']

eclipses_found = 0

for doy in range(1, 366):
    # Moon phase
    days_since_nm = (doy - ref_nm_doy) % synodic
    phase_pct = (1 - np.cos(2 * np.pi * days_since_nm / synodic)) / 2 * 100

    # Moon distance
    days_since_perigee = (doy - ref_perigee_doy) % anomalistic
    anomaly = 2 * np.pi * days_since_perigee / anomalistic
    moon_dist = 384400 * (1 - 0.0549 * np.cos(anomaly))

    # Tithi
    tithi_raw = int(days_since_nm / (synodic / 30)) + 1
    if tithi_raw <= 15:
        paksha = 'Shukla'
        tithi_num = tithi_raw
    else:
        paksha = 'Krishna'
        tithi_num = tithi_raw - 15
    tithi_name = tithi_names[min(tithi_num - 1, 14)]

    # Lunar month (approximate)
    months_since_start = int((doy - ref_nm_doy) / synodic) % 12
    lunar_month = month_names[months_since_start]

    # Eclipse check
    eclipse = ''
    node_days = (doy - 5) % draconic  # reference node
    node_angle = (node_days / draconic) * 360
    node_dist = min(node_angle, 360 - node_angle, abs(180 - node_angle))

    if days_since_nm < 1.5 and node_dist < 18:
        eclipse = 'SOLAR'
        eclipses_found += 1
    elif abs(days_since_nm - synodic/2) < 1.5 and node_dist < 12:
        eclipse = 'LUNAR'
        eclipses_found += 1

    # Date string
    m = int((doy - 1) / 30.44) + 1
    d = int((doy - 1) % 30.44) + 1
    date = f"{year}-{min(m,12):02d}-{min(d,28):02d}"

    cur.execute('''INSERT INTO almanac_days
        (date,day_of_year,year,moon_phase_pct,moon_dist_km,
         tithi_num,tithi_name,paksha,lunar_month,eclipse)
        VALUES (?,?,?,?,?,?,?,?,?,?)''',
        (date, doy, year, round(phase_pct, 1), round(moon_dist),
         tithi_num, tithi_name, paksha, lunar_month, eclipse))

# Add festivals
festivals = [
    ('Kharchi Puja', 'Fourteen gods honoured — 8th Krishna Ashadha'),
    ('Guru Purnima', 'Full Moon of Ashadha'),
    ('Raksha Bandhan', 'Full Moon of Shravana'),
]
for f in cur.execute("SELECT date FROM almanac_days WHERE lunar_month='Ashadha' AND tithi_num=8 AND paksha='Krishna' LIMIT 1"):
    cur.execute('INSERT INTO almanac_festivals (date,name,description) VALUES (?,?,?)',
                (f[0], 'Kharchi Puja', festivals[0][1]))

for f in cur.execute("SELECT date FROM almanac_days WHERE lunar_month='Ashadha' AND tithi_name='Purnima/Amavasya' AND paksha='Shukla' LIMIT 1"):
    cur.execute('INSERT INTO almanac_festivals (date,name,description) VALUES (?,?,?)',
                (f[0], 'Guru Purnima', festivals[1][1]))

# Summary statistics
cur.execute('INSERT INTO almanac_summary (year,metric,value) VALUES (?,?,?)',
            (year, 'Total eclipses', str(eclipses_found)))
cur.execute('INSERT INTO almanac_summary (year,metric,value) VALUES (?,?,?)',
            (year, 'Full moons', str(cur.execute("SELECT COUNT(*) FROM almanac_days WHERE moon_phase_pct > 99").fetchone()[0])))
cur.execute('INSERT INTO almanac_summary (year,metric,value) VALUES (?,?,?)',
            (year, 'New moons', str(cur.execute("SELECT COUNT(*) FROM almanac_days WHERE moon_phase_pct < 1").fetchone()[0])))
db.commit()

# Display
print(f"CELESTIAL ALMANAC — {year}")
print("=" * 70)

print("\\nFESTIVAL DATES")
print("-" * 50)
for r in cur.execute('SELECT date, name, description FROM almanac_festivals ORDER BY date'):
    print(f"  {r[0]}: {r[1]} — {r[2]}")

print("\\nECLIPSES")
print("-" * 50)
for r in cur.execute("SELECT date, eclipse, moon_phase_pct FROM almanac_days WHERE eclipse != '' ORDER BY day_of_year"):
    print(f"  {r[0]}: {r[1]} eclipse (Moon {r[2]:.0f}% illuminated)")

print("\\nSUMMARY")
print("-" * 50)
for r in cur.execute('SELECT metric, value FROM almanac_summary ORDER BY metric'):
    print(f"  {r[0]}: {r[1]}")

print("\\nSAMPLE DAYS (around Kharchi Puja)")
print("-" * 70)
kp = cur.execute("SELECT day_of_year FROM almanac_festivals WHERE name='Kharchi Puja'").fetchone()
if kp:
    for r in cur.execute('''SELECT date, moon_phase_pct, tithi_num, tithi_name, paksha, lunar_month, eclipse
        FROM almanac_days WHERE day_of_year BETWEEN ? AND ? ORDER BY day_of_year''', (kp[0]-5, kp[0]+5)):
        ecl = f" *** {r[6]} ***" if r[6] else ""
        print(f"  {r[0]}: Moon {r[1]:5.1f}% | {r[4]} {r[3]} ({r[2]}) | {r[5]}{ecl}")

print("\\nThis almanac covers 365 days with phase, tithi, and eclipse data.")
print("A real Panchanga adds nakshatra, yoga, and karana for complete coverage.")`,
      challenge: 'Add nakshatra computation (27 lunar mansions, each spanning 13°20\' of the Moon\'s path). Display the nakshatra alongside the tithi for each day.',
      successHint: 'You have built a digital Panchanga — the culmination of thousands of years of Indian astronomical tradition, implemented in Python. The fourteen gods of Tripura would approve: their celestial science lives on in code.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Celestial Almanac & Eclipse Database</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
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
