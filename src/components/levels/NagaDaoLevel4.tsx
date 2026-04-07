import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NagaDaoLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Blacksmith forge database — recording craft knowledge',
      concept: `Traditional blacksmithing knowledge is at risk of being lost as fewer young people learn the craft. A **forge database** preserves this knowledge in a structured, queryable format.

Tables:
- **steels**: composition, source, spark test description
- **recipes**: heat treatment sequences (temperature, time, quench medium)
- **blades**: dimensions, bevel angle, intended use
- **tests**: cutting performance, edge retention, user feedback
- **smiths**: the blacksmiths, their lineage, and specialties

This database becomes a living record of craft knowledge that can be analyzed, taught, and even used to train AI systems.

📚 *sqlite3 in Python provides a complete relational database engine with no external dependencies — perfect for self-contained applications.*`,
      analogy: 'A forge database is like a detailed recipe book that records not just ingredients and steps, but also the chef\'s observations, the diners\' reactions, and the weather that day. Over years, this database reveals patterns that individual memory cannot hold: which recipes work best in monsoon season, which ingredients from which suppliers produce the best results.',
      storyConnection: 'The oldest Naga blacksmiths carry decades of knowledge in their heads — specific techniques, material sources, heat treatment secrets passed from father to son. A database ensures this knowledge survives even as the craft tradition evolves, providing a bridge between traditional practice and modern metallurgical science.',
      checkQuestion: 'What knowledge would be LOST if a master blacksmith retired without a database?',
      checkAnswer: 'Tacit knowledge: the exact color that means "ready to quench," the sound that indicates the right carbon content, the feel of the hammer when the grain is refined enough, the specific scrap metal sources that yield good dao steel, the subtle variations in technique for different seasons (humidity affects quenching). These cannot be written in a textbook because the smith may not even be consciously aware of all the factors they consider. A database that records inputs (process parameters) and outputs (blade quality) captures this knowledge implicitly.',
      codeIntro: 'Create a comprehensive blacksmith forge database with historical records.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE smiths (
        smith_id INTEGER PRIMARY KEY, name TEXT, village TEXT,
        years_experience INTEGER, specialty TEXT, lineage TEXT
    );
    CREATE TABLE steels (
        steel_id INTEGER PRIMARY KEY, source TEXT, carbon_pct REAL,
        spark_description TEXT, smith_assessment TEXT
    );
    CREATE TABLE recipes (
        recipe_id INTEGER PRIMARY KEY, smith_id INTEGER, steel_id INTEGER,
        forge_temp_c INTEGER, forge_time_min INTEGER,
        quench_medium TEXT, temper_temp_c INTEGER, temper_time_min INTEGER,
        notes TEXT
    );
    CREATE TABLE blades (
        blade_id INTEGER PRIMARY KEY, recipe_id INTEGER,
        blade_type TEXT, length_mm INTEGER, thickness_mm REAL,
        bevel_angle_deg REAL, weight_g INTEGER, date_made TEXT
    );
    CREATE TABLE performance (
        perf_id INTEGER PRIMARY KEY AUTOINCREMENT, blade_id INTEGER,
        test_type TEXT, score REAL, notes TEXT
    );
''')

# Master smiths
smiths = [
    (1, 'Kevichusa', 'Kohima', 45, 'dao and spear', 'Angami tradition, 5th generation'),
    (2, 'Imliakum', 'Tuensang', 30, 'dao specialist', 'Chang tradition, 3rd generation'),
    (3, 'Meren', 'Mokokchung', 55, 'all blades', 'Ao tradition, 7th generation'),
    (4, 'Vilakuo', 'Zunheboto', 25, 'agricultural tools', 'Sumi tradition, 4th generation'),
]
c.executemany('INSERT INTO smiths VALUES (?,?,?,?,?,?)', smiths)

# Steel sources
steels = [
    (1, 'Railroad spike', 0.45, 'Moderate forks, orange sparks', 'Good dao steel'),
    (2, 'Truck leaf spring', 0.65, 'Bushy forks, bright bursts', 'Excellent, hard edge'),
    (3, 'Rebar', 0.25, 'Few forks, long straight', 'Too soft alone, needs carbon'),
    (4, 'Old file', 0.90, 'Dense flowers, white sparks', 'Very hard, must temper carefully'),
    (5, 'Traditional bloom iron', 0.35, 'Some forks, medium', 'Traditional, reliable'),
]
c.executemany('INSERT INTO steels VALUES (?,?,?,?,?)', steels)

# Recipes
np.random.seed(42)
recipes = [
    (1, 1, 2, 900, 30, 'water', 240, 45, 'Spring steel, standard dao recipe'),
    (2, 1, 1, 880, 25, 'water', 220, 40, 'Spike steel, slightly lower heat'),
    (3, 2, 2, 920, 35, 'oil', 260, 50, 'Oil quench for toughness'),
    (4, 2, 4, 850, 20, 'water', 280, 60, 'File steel, careful temper needed'),
    (5, 3, 5, 870, 40, 'water', 230, 45, 'Traditional bloom, time-tested recipe'),
    (6, 3, 2, 910, 30, 'water', 250, 50, 'Modern spring + traditional method'),
    (7, 4, 3, 900, 35, 'water', 200, 30, 'Rebar, needs carbon enrichment'),
    (8, 4, 1, 890, 25, 'oil', 240, 40, 'Spike with oil quench'),
]
c.executemany('INSERT INTO recipes VALUES (?,?,?,?,?,?,?,?,?)', recipes)

# Blades
blade_id = 1
for recipe_id in range(1, 9):
    for i in range(3):  # 3 blades per recipe
        btype = np.random.choice(['jungle dao', 'kitchen dao', 'ceremonial dao'])
        length = np.random.randint(250, 400)
        thickness = np.random.uniform(3, 6)
        bevel = np.random.uniform(22, 35)
        weight = int(length * thickness * 0.4)
        date = f'2024-{np.random.randint(1,13):02d}-{np.random.randint(1,28):02d}'
        c.execute('INSERT INTO blades VALUES (?,?,?,?,?,?,?,?)',
                 (blade_id, recipe_id, btype, length, round(thickness,1), round(bevel,1), weight, date))

        # Performance tests
        hardness = 45 + np.random.normal(5, 3)
        retention = np.random.normal(70, 10)
        user_score = np.random.normal(8, 1)
        c.execute('INSERT INTO performance VALUES (?,?,?,?,?)', (None, blade_id, 'hardness_hrc', round(hardness,1), None))
        c.execute('INSERT INTO performance VALUES (?,?,?,?,?)', (None, blade_id, 'edge_retention_%', round(retention,1), None))
        c.execute('INSERT INTO performance VALUES (?,?,?,?,?)', (None, blade_id, 'user_satisfaction', round(np.clip(user_score,1,10),1), None))
        blade_id += 1

conn.commit()

# Queries
print("NAGA DAO FORGE DATABASE")
print("=" * 55)

for table in ['smiths','steels','recipes','blades','performance']:
    count = c.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
    print(f"  {table}: {count} records")

print("\\\nMaster Smiths:")
for row in c.execute('SELECT name, village, years_experience, specialty FROM smiths ORDER BY years_experience DESC'):
    print(f"  {row[0]:12s} | {row[1]:12s} | {row[2]:>2} years | {row[3]}")

print("\\\nBest Performing Recipes:")
rows = c.execute('''
    SELECT s.name, st.source, r.quench_medium, r.temper_temp_c,
           ROUND(AVG(CASE WHEN p.test_type='hardness_hrc' THEN p.score END), 1) as hardness,
           ROUND(AVG(CASE WHEN p.test_type='user_satisfaction' THEN p.score END), 1) as satisfaction
    FROM recipes r
    JOIN smiths s ON r.smith_id = s.smith_id
    JOIN steels st ON r.steel_id = st.steel_id
    JOIN blades b ON r.recipe_id = b.recipe_id
    JOIN performance p ON b.blade_id = p.blade_id
    GROUP BY r.recipe_id
    ORDER BY satisfaction DESC
''').fetchall()
print(f"  {'Smith':>12} | {'Steel':>18} | {'Quench':>6} | {'Temper':>6} | {'HRC':>5} | {'Rating':>6}")
print("-" * 65)
for row in rows[:5]:
    print(f"  {row[0]:>12} | {row[1]:>18} | {row[2]:>6} | {row[3]:>4}°C | {row[4]:>5} | {row[5]:>5}/10")

conn.close()`,
      challenge: 'Add a "materials_log" table tracking which scrap metal sources produce the best dao. Query to find the best steel source overall and the best source for each smith.',
      successHint: 'You have built a knowledge preservation database for traditional blacksmithing. This type of documentation is critical for intangible cultural heritage conservation.',
    },
    {
      title: 'Recipe optimization — finding the best heat treatment',
      concept: `With historical data in the database, we can use **data-driven optimization** to find the best heat treatment recipe for each steel type.

The approach:
1. Query all recipes and their performance outcomes
2. Build a predictive model: recipe parameters → blade quality
3. Search the parameter space for the optimum
4. Validate by comparing with master smiths\' best results

This combines the empirical knowledge of generations with modern optimization techniques.

📚 *SQL GROUP BY with aggregate functions enables recipe comparison. Python optimization over the parameter space finds combinations that the database reveals as most promising.*`,
      analogy: 'Recipe optimization is like A/B testing in web design. You try different versions (recipes), measure outcomes (blade quality), and statistically determine which version works best. The database is your experiment log, and the optimization algorithm is your analysis tool.',
      storyConnection: 'Master smith Meren has 55 years of experience and intuitively knows the best recipe for each steel type. Our optimization algorithm can discover the same knowledge from the database — validating traditional expertise while potentially uncovering improvements that even an expert might miss.',
      checkQuestion: 'Can an algorithm truly discover knowledge that a 55-year master smith does not already know?',
      checkAnswer: 'Yes, in two ways: (1) The algorithm considers ALL recorded data simultaneously, while human memory is selective and biased toward recent experiences. (2) The algorithm can detect subtle multivariate interactions (e.g., "spring steel + oil quench works better when tempered at exactly 248°C, not the usual 260°C") that humans cannot track mentally. However, the algorithm cannot match the smith\'s ability to adapt in real-time to material variations, weather conditions, or the feel of the hammer.',
      codeIntro: 'Optimize heat treatment recipes using historical forge data.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE recipes (id INTEGER PRIMARY KEY, steel_type TEXT, carbon REAL,
        forge_temp INTEGER, quench TEXT, temper_temp INTEGER, temper_time INTEGER);
    CREATE TABLE results (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id INTEGER,
        hardness REAL, toughness REAL, edge_retention REAL, overall REAL);
''')

# Generate synthetic recipe data based on metallurgical models
np.random.seed(42)
recipe_id = 1

for steel, carbon in [('spike', 0.45), ('spring', 0.65), ('file', 0.90), ('bloom', 0.35)]:
    for forge_temp in range(820, 960, 20):
        for quench in ['water', 'oil']:
            for temper_temp in range(180, 360, 20):
                for temper_time in [30, 45, 60]:
                    c.execute('INSERT INTO recipes VALUES (?,?,?,?,?,?,?)',
                             (recipe_id, steel, carbon, forge_temp, quench, temper_temp, temper_time))

                    # Physics-based outcome model
                    quench_factor = 1.0 if quench == 'water' else 0.85
                    hardness = (20 + 60 * carbon) * quench_factor - 0.08 * (temper_temp - 150)
                    hardness = np.clip(hardness + np.random.normal(0, 2), 20, 65)

                    toughness = 80 - 40 * carbon + 0.12 * (temper_temp - 150) * (1 + 0.2 * (quench == 'oil'))
                    toughness = np.clip(toughness + np.random.normal(0, 3), 10, 100)

                    retention = hardness * 0.6 + temper_time * 0.1 + np.random.normal(0, 2)

                    overall = 0.35 * hardness/65 + 0.35 * toughness/100 + 0.30 * retention/50
                    overall = np.clip(overall + np.random.normal(0, 0.03), 0, 1)

                    c.execute('INSERT INTO results VALUES (?,?,?,?,?,?)',
                             (None, recipe_id, round(hardness,1), round(toughness,1),
                              round(retention,1), round(overall,3)))
                    recipe_id += 1

conn.commit()

# Find optimal recipe for each steel type
print("RECIPE OPTIMIZATION RESULTS")
print("=" * 75)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

steel_types = ['spike', 'spring', 'file', 'bloom']
colors = ['#10b981', '#f59e0b', '#f87171', '#60a5fa']

for idx, (steel, color) in enumerate(zip(steel_types, colors)):
    ax = axes[idx // 2][idx % 2]

    # Get all results for this steel
    rows = c.execute('''
        SELECT r.temper_temp, r.quench, res.hardness, res.toughness, res.overall
        FROM recipes r JOIN results res ON r.id = res.recipe_id
        WHERE r.steel_type = ?
    ''', (steel,)).fetchall()

    water = [(r[0], r[4]) for r in rows if r[1] == 'water']
    oil = [(r[0], r[4]) for r in rows if r[1] == 'oil']

    # Bin by temper temp and average
    temps_w = sorted(set(t for t, _ in water))
    avg_w = [np.mean([s for t, s in water if t == temp]) for temp in temps_w]
    temps_o = sorted(set(t for t, _ in oil))
    avg_o = [np.mean([s for t, s in oil if t == temp]) for temp in temps_o]

    ax.plot(temps_w, avg_w, 'o-', color='#60a5fa', linewidth=2, markersize=4, label='Water quench')
    ax.plot(temps_o, avg_o, 's-', color='#f59e0b', linewidth=2, markersize=4, label='Oil quench')

    # Mark optimum
    best_w_idx = np.argmax(avg_w)
    best_o_idx = np.argmax(avg_o)
    ax.scatter([temps_w[best_w_idx]], [avg_w[best_w_idx]], s=150, color='#60a5fa', edgecolors='white', zorder=5)
    ax.scatter([temps_o[best_o_idx]], [avg_o[best_o_idx]], s=150, color='#f59e0b', edgecolors='white', zorder=5)

    carbon = c.execute('SELECT carbon FROM recipes WHERE steel_type=? LIMIT 1', (steel,)).fetchone()[0]
    ax.set_title(f'{steel.title()} Steel ({carbon*100:.0f}% C)', color='white', fontsize=11, fontweight='bold')
    ax.set_xlabel('Temper Temperature (°C)', color='white', fontsize=9)
    ax.set_ylabel('Overall Score', color='white', fontsize=9)
    ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

    # Print best recipe
    best = c.execute('''
        SELECT r.forge_temp, r.quench, r.temper_temp, r.temper_time,
               res.hardness, res.toughness, res.overall
        FROM recipes r JOIN results res ON r.id = res.recipe_id
        WHERE r.steel_type = ?
        ORDER BY res.overall DESC LIMIT 1
    ''', (steel,)).fetchone()

    print(f"\\\n  {steel.upper()} STEEL ({carbon*100:.0f}% C):")
    print(f"    Best: forge {best[0]}°C → {best[1]} quench → temper {best[2]}°C for {best[3]}min")
    print(f"    Result: {best[4]:.0f} HRC, toughness {best[5]:.0f}, overall {best[6]:.3f}")

plt.suptitle('Optimal Heat Treatment by Steel Type', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

conn.close()`,
      challenge: 'Add a "cost" metric to the optimization (oil quench is 2x more expensive than water). Find the most cost-effective recipe that still achieves a minimum overall score of 0.7.',
      successHint: 'Data-driven recipe optimization combines traditional knowledge (the database) with modern analysis. The results validate what master smiths know while quantifying the exact optima.',
    },
    {
      title: 'Quality control system — ensuring every dao meets standards',
      concept: `A **quality control (QC) system** automates the testing and grading of each blade:

1. **Incoming steel inspection**: spark test, hardness check
2. **In-process checks**: temperature monitoring, time tracking
3. **Final inspection**: edge geometry, hardness profile, visual inspection
4. **Performance testing**: cutting test, impact test
5. **Grading**: A (excellent), B (good), C (acceptable), F (reject)

Statistical Process Control (SPC) uses control charts to detect when the process drifts from optimal:
- **X-bar chart**: tracks average quality over batches
- **R chart**: tracks variation within batches
- **Control limits**: ±3σ from the mean (99.7% of normal variation)

Points outside control limits signal a problem requiring investigation.

📚 *Control charts combine SQL queries (to extract batch data) with statistical calculations (mean, std, control limits) and visualization.*`,
      analogy: 'Quality control is like a school testing system. Each blade (student) is tested. Individual scores vary naturally (some days are better than others). But if the class average drops below a threshold (control limit), something systemic is wrong — maybe the teacher changed methods (steel supplier changed) or the classroom is too hot (forge temperature drifted). SPC detects these systemic problems early.',
      storyConnection: 'As Naga dao production scales from individual artisan to small workshop, quality control becomes essential. Without QC, occasional bad blades damage the reputation of all Naga blacksmiths. A systematic QC process ensures every blade bearing the Naga stamp meets a minimum quality standard.',
      checkQuestion: 'Is it possible to have zero defects (100% pass rate)?',
      checkAnswer: 'Theoretically no, because natural variation exists in every process — steel composition varies batch to batch, forge temperature fluctuates, quenching conditions change with ambient temperature. Practically, you can approach zero defects by: (1) tighter process control, (2) better raw material screening, (3) more skilled operators, and (4) statistical process control that catches drift early. The goal is not zero variation but variation within acceptable limits.',
      codeIntro: 'Build a quality control system with statistical process control charts.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE batches (batch_id INTEGER PRIMARY KEY, date TEXT, smith TEXT, steel_source TEXT);
    CREATE TABLE blades_qc (blade_id INTEGER PRIMARY KEY AUTOINCREMENT, batch_id INTEGER,
        edge_hardness REAL, spine_toughness REAL, bevel_angle REAL, weight_g REAL,
        visual_grade TEXT, cutting_test REAL, grade TEXT);
''')

np.random.seed(42)

# Simulate 30 batches of production
batch_data = []
blade_data = []
batch_id = 1

print("QUALITY CONTROL SYSTEM — NAGA DAO WORKSHOP")
print("=" * 55)

for month in range(1, 31):
    smith = np.random.choice(['Kevichusa', 'Imliakum', 'Meren'])
    steel = np.random.choice(['spring', 'spike', 'bloom'])
    date = f'2025-{(month-1)//3+1:02d}-{(month-1)%3*10+5:02d}'
    batch_data.append((batch_id, date, smith, steel))

    # Process drift: introduce a problem at batch 20 (steel supplier changed)
    drift = 0 if batch_id < 20 else -5

    blades_per_batch = np.random.randint(4, 8)
    for i in range(blades_per_batch):
        hardness = np.random.normal(52 + drift, 3)
        toughness = np.random.normal(40, 5)
        bevel = np.random.normal(28, 2)
        weight = np.random.normal(350, 20)
        cutting = np.random.normal(75 + drift * 0.8, 8)

        visual = np.random.choice(['excellent', 'good', 'acceptable', 'poor'],
                                  p=[0.3, 0.4, 0.25, 0.05])

        # Grading
        if hardness >= 48 and toughness >= 30 and cutting >= 65 and visual != 'poor':
            grade = 'A' if hardness >= 52 and cutting >= 75 else 'B'
        elif hardness >= 42 and cutting >= 55 and visual != 'poor':
            grade = 'C'
        else:
            grade = 'F'

        blade_data.append((batch_id, round(hardness,1), round(toughness,1),
                          round(bevel,1), int(weight), visual, round(cutting,1), grade))

    batch_id += 1

c.executemany('INSERT INTO batches VALUES (?,?,?,?)', batch_data)
c.executemany('INSERT INTO blades_qc (batch_id, edge_hardness, spine_toughness, bevel_angle, weight_g, visual_grade, cutting_test, grade) VALUES (?,?,?,?,?,?,?,?)', blade_data)
conn.commit()

# Grade distribution
print("\\\nGrade Distribution:")
for grade in ['A', 'B', 'C', 'F']:
    count = c.execute('SELECT COUNT(*) FROM blades_qc WHERE grade=?', (grade,)).fetchone()[0]
    total = c.execute('SELECT COUNT(*) FROM blades_qc').fetchone()[0]
    bar = "█" * int(count / total * 50)
    print(f"  Grade {grade}: {count:>3} ({count/total*100:.1f}%) {bar}")

# Control charts
fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# X-bar chart for hardness
batch_means = []
batch_ranges = []
for bid in range(1, 31):
    vals = [r[0] for r in c.execute('SELECT edge_hardness FROM blades_qc WHERE batch_id=?', (bid,)).fetchall()]
    if vals:
        batch_means.append(np.mean(vals))
        batch_ranges.append(np.max(vals) - np.min(vals))

overall_mean = np.mean(batch_means)
overall_std = np.std(batch_means)
ucl = overall_mean + 3 * overall_std
lcl = overall_mean - 3 * overall_std

axes[0,0].plot(range(1, 31), batch_means, 'o-', color='#10b981', linewidth=1.5, markersize=4)
axes[0,0].axhline(y=overall_mean, color='white', linestyle='-', alpha=0.5, label=f'Mean: {overall_mean:.1f}')
axes[0,0].axhline(y=ucl, color='#f87171', linestyle='--', label=f'UCL: {ucl:.1f}')
axes[0,0].axhline(y=lcl, color='#f87171', linestyle='--', label=f'LCL: {lcl:.1f}')
# Highlight out-of-control points
for i, m in enumerate(batch_means):
    if m < lcl or m > ucl:
        axes[0,0].scatter([i+1], [m], s=100, color='#f87171', edgecolors='white', zorder=5)
axes[0,0].axvline(x=20, color='#f59e0b', linestyle=':', alpha=0.5, label='Supplier change')
axes[0,0].set_xlabel('Batch', color='white', fontsize=10)
axes[0,0].set_ylabel('Mean Hardness (HRC)', color='white', fontsize=10)
axes[0,0].set_title('X-bar Chart: Hardness', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Pass rate by batch
pass_rates = []
for bid in range(1, 31):
    total = c.execute('SELECT COUNT(*) FROM blades_qc WHERE batch_id=?', (bid,)).fetchone()[0]
    passed = c.execute("SELECT COUNT(*) FROM blades_qc WHERE batch_id=? AND grade != 'F'", (bid,)).fetchone()[0]
    pass_rates.append(passed / total * 100 if total > 0 else 0)

bar_colors = ['#10b981' if r >= 90 else '#f59e0b' if r >= 80 else '#f87171' for r in pass_rates]
axes[0,1].bar(range(1, 31), pass_rates, color=bar_colors, edgecolor='white', linewidth=0.3)
axes[0,1].axhline(y=90, color='white', linestyle=':', alpha=0.5, label='Target: 90%')
axes[0,1].set_xlabel('Batch', color='white', fontsize=10)
axes[0,1].set_ylabel('Pass Rate (%)', color='white', fontsize=10)
axes[0,1].set_title('Batch Pass Rate', color='white', fontsize=12, fontweight='bold')
axes[0,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Smith comparison
smith_stats = c.execute('''
    SELECT b.smith, COUNT(*), ROUND(AVG(q.edge_hardness),1),
           SUM(CASE WHEN q.grade IN ('A','B') THEN 1 ELSE 0 END)*100.0/COUNT(*)
    FROM blades_qc q JOIN batches b ON q.batch_id = b.batch_id
    GROUP BY b.smith
''').fetchall()
smith_names = [r[0] for r in smith_stats]
smith_quality = [r[3] for r in smith_stats]
axes[1,0].bar(smith_names, smith_quality, color=['#10b981', '#f59e0b', '#60a5fa'], edgecolor='white')
axes[1,0].set_ylabel('A+B Grade Rate (%)', color='white', fontsize=10)
axes[1,0].set_title('Smith Performance', color='white', fontsize=12, fontweight='bold')

# Trend detection
axes[1,1].plot(range(1, 31), batch_means, 'o-', color='#10b981', linewidth=2, label='Hardness trend')
# Add trend line
z = np.polyfit(range(30), batch_means, 1)
p = np.poly1d(z)
axes[1,1].plot(range(1, 31), p(range(30)), '--', color='#f87171', linewidth=2, label=f'Trend: {z[0]:.2f} HRC/batch')
axes[1,1].axvline(x=20, color='#f59e0b', linestyle=':', label='Supplier change')
axes[1,1].set_xlabel('Batch', color='white', fontsize=10)
axes[1,1].set_ylabel('Mean Hardness', color='white', fontsize=10)
axes[1,1].set_title('Trend Analysis', color='white', fontsize=12, fontweight='bold')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

plt.suptitle('Quality Control Dashboard — Naga Dao Workshop', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

# Detect the problem
print("\\\nPROCESS ALERT:")
ooc = [i+1 for i, m in enumerate(batch_means) if m < lcl]
if ooc:
    print(f"  Batches below LCL: {ooc}")
    print(f"  Investigation: steel supplier changed at batch 20")
    print(f"  Root cause: new supplier's spring steel has lower carbon")
    print(f"  Action: verify carbon content of incoming steel (spark test)")

conn.close()`,
      challenge: 'Add a CUSUM (cumulative sum) chart that detects small persistent shifts earlier than the X-bar chart. At which batch does CUSUM first signal the quality drift?',
      successHint: 'Statistical process control catches quality problems that individual blade inspection misses. The drift at batch 20 (supplier change) would have gone undetected for weeks without the control chart.',
    },
    {
      title: 'Capstone — Naga metallurgy knowledge platform',
      concept: `The **capstone** integrates all metallurgy knowledge into a single platform:

1. **Knowledge database**: smiths, steels, recipes, results
2. **Materials science engine**: phase diagrams, diffusion, grain analysis
3. **Recipe optimizer**: finds best heat treatment for each steel
4. **Quality control**: SPC charts, grading, alerts
5. **Design tool**: multi-objective blade optimization
6. **Reporting dashboard**: visual summary for workshops

This platform preserves and extends the metallurgical knowledge of Nagaland's blacksmithing tradition.

📚 *The capstone demonstrates full-stack engineering: database design, physics modeling, statistical analysis, optimization, and visualization — all serving a real-world need.*`,
      analogy: 'The complete platform is like equipping a traditional forge with modern instruments while preserving the artisan\'s skill. The thermometer does not replace the smith\'s eye for color — it validates and refines it. The database does not replace oral tradition — it preserves and extends it. Technology and tradition working together.',
      storyConnection: 'This capstone represents a bridge between ancient Naga metallurgy and modern materials science. The same principles that Naga blacksmiths discovered through generations of practice — carbon content affects hardness, tempering color indicates temperature, grain refinement requires hammering — are formalized in equations and databases that ensure this knowledge survives and grows.',
      checkQuestion: 'What is the most important thing this platform preserves?',
      checkAnswer: 'The RELATIONSHIPS between variables that exist in the master smith\'s intuition. A master smith knows that spring steel from the old railroad depot, quenched in the stream behind the forge on a cool morning, tempered until the flat turns the color of ripe rice, makes the best jungle dao. The platform captures each of these factors (steel source, quench temperature, temper color) as queryable data, preserving the relationship even after the smith retires.',
      codeIntro: 'Build the complete Naga metallurgy knowledge platform.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

# === COMPLETE PLATFORM ===
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE steel_library (id INTEGER PRIMARY KEY, name TEXT, carbon REAL, source TEXT, optimal_temper INTEGER);
    CREATE TABLE blade_designs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, steel_id INTEGER,
        bevel REAL, thickness REAL, hardness_target REAL, toughness_target REAL, score REAL);
    CREATE TABLE production_log (id INTEGER PRIMARY KEY AUTOINCREMENT, design_id INTEGER,
        date TEXT, hardness_actual REAL, toughness_actual REAL, grade TEXT);
''')

# Steel library with empirical knowledge
steels = [
    (1, 'Railroad Spike', 0.45, 'Kohima rail yard', 240),
    (2, 'Truck Spring', 0.65, 'Dimapur salvage', 250),
    (3, 'Old File', 0.90, 'Workshop scrap', 280),
    (4, 'Bloom Iron', 0.35, 'Traditional smelting', 230),
    (5, 'Rebar', 0.25, 'Construction site', 210),
]
c.executemany('INSERT INTO steel_library VALUES (?,?,?,?,?)', steels)

# Generate optimized designs
np.random.seed(42)
for steel_id, name, carbon, source, opt_temper in steels:
    for use in ['Jungle clearing', 'Food prep', 'Ceremonial']:
        if use == 'Jungle clearing':
            bevel, thick = 30, 5.0
            h_target, t_target = 50, 45
        elif use == 'Food prep':
            bevel, thick = 20, 3.5
            h_target, t_target = 56, 30
        else:
            bevel, thick = 25, 4.0
            h_target, t_target = 52, 40

        hardness_pred = 20 + 60 * carbon - 0.08 * (opt_temper - 150)
        toughness_pred = 80 - 40 * carbon + 0.12 * (opt_temper - 150)
        score = 0.4 * min(1, hardness_pred/h_target) + 0.4 * min(1, toughness_pred/t_target) + 0.2 * (1 - bevel/45)

        c.execute('INSERT INTO blade_designs (name, steel_id, bevel, thickness, hardness_target, toughness_target, score) VALUES (?,?,?,?,?,?,?)',
                 (f'{name} — {use}', steel_id, bevel, thick, h_target, t_target, round(score, 3)))

# Simulate production
design_count = c.execute('SELECT COUNT(*) FROM blade_designs').fetchone()[0]
for month in range(1, 13):
    for design_id in np.random.choice(range(1, design_count+1), size=5, replace=True):
        design = c.execute('SELECT hardness_target, toughness_target FROM blade_designs WHERE id=?', (design_id,)).fetchone()
        if design:
            h_actual = design[0] + np.random.normal(0, 3)
            t_actual = design[1] + np.random.normal(0, 4)
            grade = 'A' if abs(h_actual - design[0]) < 3 and abs(t_actual - design[1]) < 5 else 'B' if abs(h_actual - design[0]) < 5 else 'C'
            c.execute('INSERT INTO production_log (design_id, date, hardness_actual, toughness_actual, grade) VALUES (?,?,?,?,?)',
                     (design_id, f'2025-{month:02d}-15', round(h_actual,1), round(t_actual,1), grade))
conn.commit()

# === DASHBOARD ===
print("╔══════════════════════════════════════════════════════════════╗")
print("║       NAGA METALLURGY KNOWLEDGE PLATFORM — DASHBOARD       ║")
print("╚══════════════════════════════════════════════════════════════╝")

# Steel library
print("\\\n[STEEL LIBRARY]")
for row in c.execute('SELECT name, carbon, source, optimal_temper FROM steel_library ORDER BY carbon'):
    print(f"  {row[0]:18s} | {row[1]*100:.0f}% C | {row[2]:25s} | temper: {row[3]}°C")

# Top designs
print("\\\n[TOP BLADE DESIGNS]")
rows = c.execute('''SELECT d.name, s.name as steel, d.bevel, d.score
                    FROM blade_designs d JOIN steel_library s ON d.steel_id = s.id
                    ORDER BY d.score DESC LIMIT 8''').fetchall()
for name, steel, bevel, score in rows:
    bar = "█" * int(score * 20)
    print(f"  {name:35s} | {bevel:.0f}° bevel | score: {score:.3f} {bar}")

# Production summary
print("\\\n[PRODUCTION SUMMARY]")
for grade in ['A', 'B', 'C']:
    count = c.execute('SELECT COUNT(*) FROM production_log WHERE grade=?', (grade,)).fetchone()[0]
    print(f"  Grade {grade}: {count} blades")

# Visualization
fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Steel comparison
steel_names = [r[0] for r in c.execute('SELECT name FROM steel_library ORDER BY carbon')]
carbons = [r[0]*100 for r in c.execute('SELECT carbon FROM steel_library ORDER BY carbon')]
opt_temps = [r[0] for r in c.execute('SELECT optimal_temper FROM steel_library ORDER BY carbon')]

axes[0,0].bar(range(len(steel_names)), carbons, color='#10b981', edgecolor='white', linewidth=0.5)
ax_twin = axes[0,0].twinx()
ax_twin.plot(range(len(steel_names)), opt_temps, 'o-', color='#f59e0b', linewidth=2, markersize=8)
axes[0,0].set_xticks(range(len(steel_names)))
axes[0,0].set_xticklabels([n[:10] for n in steel_names], fontsize=8, rotation=15)
axes[0,0].set_ylabel('Carbon %', color='#10b981', fontsize=10)
ax_twin.set_ylabel('Optimal Temper (°C)', color='#f59e0b', fontsize=10)
ax_twin.tick_params(colors='#f59e0b')
axes[0,0].set_title('Steel Library Overview', color='white', fontsize=12, fontweight='bold')

# Design space
designs = c.execute('SELECT hardness_target, toughness_target, score, bevel FROM blade_designs').fetchall()
for h, t, s, b in designs:
    color = '#10b981' if s > 0.7 else '#f59e0b' if s > 0.5 else '#f87171'
    axes[0,1].scatter(h, t, s=b*3, c=color, alpha=0.7, edgecolors='white', linewidths=0.5)
axes[0,1].set_xlabel('Hardness Target (HRC)', color='white', fontsize=10)
axes[0,1].set_ylabel('Toughness Target', color='white', fontsize=10)
axes[0,1].set_title('Design Space (size=bevel, color=score)', color='white', fontsize=12, fontweight='bold')

# Production quality over time
months = range(1, 13)
monthly_quality = []
for m in months:
    total = c.execute("SELECT COUNT(*) FROM production_log WHERE date LIKE ?", (f'2025-{m:02d}%',)).fetchone()[0]
    grade_a = c.execute("SELECT COUNT(*) FROM production_log WHERE date LIKE ? AND grade='A'", (f'2025-{m:02d}%',)).fetchone()[0]
    monthly_quality.append(grade_a / total * 100 if total > 0 else 0)
axes[1,0].plot(list(months), monthly_quality, 'o-', color='#10b981', linewidth=2, markersize=6)
axes[1,0].axhline(y=np.mean(monthly_quality), color='white', linestyle=':', alpha=0.5)
axes[1,0].set_xlabel('Month', color='white', fontsize=10)
axes[1,0].set_ylabel('Grade A Rate (%)', color='white', fontsize=10)
axes[1,0].set_title('Monthly Quality Trend', color='white', fontsize=12, fontweight='bold')

# Knowledge summary
axes[1,1].axis('off')
summary_text = """PLATFORM KNOWLEDGE SUMMARY

Steel types cataloged: 5
Blade designs optimized: {}
Production blades logged: {}

Key insights from data:
• Truck spring (0.65% C) is the most
  versatile dao steel
• Water quench + 250°C temper gives
  optimal hardness-toughness balance
• 28° bevel angle provides best all-day
  edge retention for jungle work

Traditional knowledge VALIDATED by data.
""".format(design_count, c.execute('SELECT COUNT(*) FROM production_log').fetchone()[0])

axes[1,1].text(0.1, 0.9, summary_text, transform=axes[1,1].transAxes,
              color='white', fontsize=10, verticalalignment='top', fontfamily='monospace',
              bbox=dict(boxstyle='round,pad=0.5', facecolor='#374151', edgecolor='#4b5563'))
axes[1,1].set_title('Knowledge Summary', color='white', fontsize=12, fontweight='bold')

plt.suptitle('Naga Metallurgy Knowledge Platform', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("\\\n  Platform complete.")
print("  Traditional Naga metallurgy preserved in database,")
print("  validated by materials science, extended by optimization.")
print("  From forge fire to database — knowledge endures.")

conn.close()`,
      challenge: 'Add a "training module" that generates quiz questions from the database: "What temper temperature is optimal for truck spring steel?" with the answer pulled from the data. Build 5 random quiz questions.',
      successHint: 'You have built a complete metallurgy knowledge platform. It preserves traditional Naga blacksmithing knowledge in a structured database, validates it with materials science, optimizes it through data analysis, and monitors it through quality control. The craft tradition is now encoded in a system that will outlast any individual practitioner.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Metallurgy Data Systems</span>
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
