import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HornbillHelmetLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Materials testing database — storing crash test results',
      concept: `A **materials testing database** stores results from impact tests: material composition, impact velocity, crush distance, peak force, energy absorbed, and pass/fail status.

This database enables:
- Statistical analysis across hundreds of tests
- Identification of best materials for each application
- Quality control (does each batch meet specifications?)
- Regulatory compliance (do results meet safety standards?)

The database schema must capture:
- **materials**: composition, density, structure type
- **test_specimens**: dimensions, preparation method
- **impact_tests**: velocity, force, deformation measurements
- **certifications**: pass/fail against safety standards

📚 *SQLite's CREATE TABLE with FOREIGN KEY constraints ensures data integrity: every test result links to a valid specimen and material.*`,
      analogy: 'A testing database is like a medical records system for materials. Each material has a "health record" — its properties, test history, and certifications. When designing a new helmet, you search the database for materials with the right "health profile" rather than testing everything from scratch.',
      storyConnection: 'Modern helmet certification requires extensive testing records. A company inspired by the hornbill casque must prove their bio-inspired design passes safety standards through systematic testing — and all those test results live in a database.',
      checkQuestion: 'Why store raw test data in a database rather than just summary statistics?',
      checkAnswer: 'Raw data enables re-analysis. If safety standards change (e.g., new impact speed requirement), you can re-evaluate all existing materials against the new standard without re-testing. Raw data also reveals outliers, trends, and failure modes that summary statistics hide. It is always better to store too much data than too little.',
      codeIntro: 'Create a materials testing database and populate it with crash test data.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE materials (
        mat_id INTEGER PRIMARY KEY, name TEXT, density_kg_m3 REAL,
        structure_type TEXT, composition TEXT, bio_inspired INTEGER
    );
    CREATE TABLE specimens (
        spec_id INTEGER PRIMARY KEY, mat_id INTEGER REFERENCES materials(mat_id),
        thickness_mm REAL, area_cm2 REAL, batch TEXT, prep_date TEXT
    );
    CREATE TABLE impact_tests (
        test_id INTEGER PRIMARY KEY, spec_id INTEGER REFERENCES specimens(spec_id),
        test_date TEXT, velocity_ms REAL, peak_force_n REAL,
        crush_mm REAL, energy_j REAL, rebound_pct REAL, pass_fail TEXT
    );
    CREATE TABLE standards (
        std_id INTEGER PRIMARY KEY, name TEXT, max_force_n REAL,
        test_velocity_ms REAL, min_crush_mm REAL
    );
''')

# Materials
materials = [
    (1, 'EPS Standard', 80, 'closed-cell foam', 'expanded polystyrene', 0),
    (2, 'EPP Foam', 120, 'closed-cell foam', 'expanded polypropylene', 0),
    (3, 'Bio-Gradient v1', 200, 'gradient cellular', 'ceramic/polymer composite', 1),
    (4, 'Bio-Gradient v2', 180, 'gradient cellular', 'ceramic/polymer optimized', 1),
    (5, 'Honeycomb Al', 50, 'honeycomb', 'aluminum 6061', 0),
    (6, 'Casque-Mimic v1', 250, 'trabecular + shell', 'hydroxyapatite/polymer', 1),
]
c.executemany('INSERT INTO materials VALUES (?,?,?,?,?,?)', materials)

# Standards
standards = [
    (1, 'EN 1078 (Bicycle)', 250*9.81, 5.42, 10),
    (2, 'ECE 22.06 (Motorcycle)', 275*9.81, 7.5, 15),
    (3, 'CPSC (US Bicycle)', 300*9.81, 6.2, 12),
]
c.executemany('INSERT INTO standards VALUES (?,?,?,?,?)', standards)

# Generate test specimens and results
np.random.seed(42)
spec_id = 1
test_id = 1

for mat_id, name, density, stype, comp, bio in materials:
    for batch in ['B001', 'B002', 'B003']:
        for thickness in [20, 25, 30]:
            c.execute('INSERT INTO specimens VALUES (?,?,?,?,?,?)',
                     (spec_id, mat_id, thickness, 25.0, batch, '2025-01-15'))

            # Run multiple tests per specimen type
            for velocity in [5.0, 5.42, 6.2, 7.5]:
                # Physics-based result generation
                base_force = density * 9.81 * thickness / 10
                force_var = np.random.normal(1.0, 0.08)
                peak_force = base_force * velocity * force_var * (1 - 0.3 * bio)
                crush = min(thickness * 0.85, velocity * 3 * (1 + 0.5 * bio))
                energy = peak_force * crush / 2000
                rebound = max(5, 40 - 20 * bio + np.random.normal(0, 5))

                # Check against EN 1078
                pass_fail = 'PASS' if peak_force < 250*9.81 else 'FAIL'

                c.execute('INSERT INTO impact_tests VALUES (?,?,?,?,?,?,?,?,?)',
                         (test_id, spec_id, '2025-02-01', velocity,
                          round(peak_force, 1), round(crush, 1),
                          round(energy, 2), round(rebound, 1), pass_fail))
                test_id += 1
            spec_id += 1

conn.commit()

# Summary
for table in ['materials', 'specimens', 'impact_tests', 'standards']:
    count = c.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
    print(f"Table '{table}': {count} records")

print("\
Material Summary:")
rows = c.execute('''
    SELECT m.name, m.bio_inspired, COUNT(t.test_id),
           ROUND(AVG(t.peak_force_n), 0),
           SUM(CASE WHEN t.pass_fail='PASS' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as pass_rate
    FROM materials m
    JOIN specimens s ON m.mat_id = s.mat_id
    JOIN impact_tests t ON s.spec_id = t.spec_id
    GROUP BY m.name
    ORDER BY pass_rate DESC
''').fetchall()
print(f"{'Material':>25} | {'Bio':>3} | {'Tests':>5} | {'Avg Force':>9} | {'Pass Rate':>9}")
print("-" * 60)
for name, bio, tests, avg_f, rate in rows:
    bio_str = 'Yes' if bio else 'No'
    print(f"  {name:>23} | {bio_str:>3} | {tests:>5} | {avg_f:>7.0f} N | {rate:>7.1f}%")

conn.close()`,
      challenge: 'Add a "failure_mode" column to impact_tests (values: "crush", "shear", "delamination", "densification"). Analyze which failure mode is most common for each material type.',
      successHint: 'You have built a professional materials testing database. Real testing labs use similar schemas to manage thousands of test records and ensure regulatory compliance.',
    },
    {
      title: 'Statistical analysis — are bio-inspired materials actually better?',
      concept: `To claim "bio-inspired materials outperform conventional ones," we need **statistical evidence**, not just a few good test results.

Key statistical tests:
- **t-test**: compares means of two groups (bio vs conventional)
- **ANOVA**: compares means across multiple groups
- **Confidence intervals**: range of plausible values for the true mean
- **Effect size**: how big is the practical difference?

A result is **statistically significant** if the probability of seeing it by chance (p-value) is below a threshold (typically 0.05 or 5%).

But significance alone is not enough. A tiny improvement can be statistically significant with enough data. We also need **practical significance** — is the difference large enough to matter for helmet safety?

📚 *SQL's GROUP BY with aggregate functions (AVG, STDDEV) calculates statistics directly in the database. Python's scipy.stats provides t-tests and other statistical tests.*`,
      analogy: 'Statistical testing is like a fair trial. The null hypothesis ("bio-inspired is NOT better") is assumed true until proven otherwise. The evidence (test data) must be strong enough to reject this assumption "beyond reasonable doubt" (low p-value). A single good test is an anecdote, not proof. Statistical analysis is the proof.',
      storyConnection: 'A startup claiming their hornbill-inspired helmet is superior must convince regulators with data, not stories. Statistical analysis of crash test results provides the rigorous evidence needed for certification and market claims.',
      checkQuestion: 'If bio-inspired foam has lower average peak force but higher variability, is it better?',
      checkAnswer: 'Not necessarily. High variability means some specimens perform poorly. For safety equipment, the WORST case matters more than the average. A material with slightly higher average force but very low variability might be safer because its worst-case performance is more predictable. Safety standards often use the 95th percentile, not the mean — you must pass 95% of the time, not just on average.',
      codeIntro: 'Perform statistical comparison of bio-inspired vs conventional impact materials.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

conn = sqlite3.connect(':memory:')
c = conn.cursor()

# Recreate database (abbreviated)
c.executescript('''
    CREATE TABLE materials (mat_id INTEGER PRIMARY KEY, name TEXT, density REAL, bio INTEGER);
    CREATE TABLE tests (test_id INTEGER PRIMARY KEY, mat_id INTEGER, velocity REAL, peak_force REAL, energy REAL, crush REAL);
''')

np.random.seed(42)
# Conventional materials
for mat_id, name, density in [(1,'EPS',80),(2,'EPP',120),(3,'Honeycomb',50)]:
    c.execute('INSERT INTO materials VALUES (?,?,?,0)', (mat_id, name, density))
    for i in range(100):
        v = np.random.choice([5.42, 6.2, 7.5])
        force = np.random.normal(density * v * 1.8, density * v * 0.25)
        energy = np.random.normal(force * 0.02, 2)
        crush = np.random.normal(15, 3)
        c.execute('INSERT INTO tests VALUES (?,?,?,?,?,?)', (None, mat_id, v, max(100,force), max(1,energy), max(5,crush)))

# Bio-inspired materials
for mat_id, name, density in [(4,'BioGrad-v1',200),(5,'BioGrad-v2',180),(6,'CasqueMimic',250)]:
    c.execute('INSERT INTO materials VALUES (?,?,?,1)', (mat_id, name, density))
    for i in range(100):
        v = np.random.choice([5.42, 6.2, 7.5])
        force = np.random.normal(density * v * 1.1, density * v * 0.15)  # lower force, less variation
        energy = np.random.normal(force * 0.025, 1.5)
        crush = np.random.normal(18, 2.5)
        c.execute('INSERT INTO tests VALUES (?,?,?,?,?,?)', (None, mat_id, v, max(100,force), max(1,energy), max(5,crush)))

conn.commit()

# Statistical analysis
bio_forces = np.array([r[0] for r in c.execute('SELECT t.peak_force FROM tests t JOIN materials m ON t.mat_id=m.mat_id WHERE m.bio=1').fetchall()])
conv_forces = np.array([r[0] for r in c.execute('SELECT t.peak_force FROM tests t JOIN materials m ON t.mat_id=m.mat_id WHERE m.bio=0').fetchall()])

# Manual t-test (no scipy needed)
n1, n2 = len(bio_forces), len(conv_forces)
m1, m2 = np.mean(bio_forces), np.mean(conv_forces)
s1, s2 = np.std(bio_forces, ddof=1), np.std(conv_forces, ddof=1)
se = np.sqrt(s1**2/n1 + s2**2/n2)
t_stat = (m2 - m1) / se  # positive if conventional is higher
df = min(n1, n2) - 1
# Approximate p-value using normal distribution (good for large n)
p_value = 2 * (1 - 0.5 * (1 + np.sign(t_stat) * (1 - np.exp(-2*t_stat**2/np.pi))))
effect_size = (m2 - m1) / np.sqrt((s1**2 + s2**2) / 2)  # Cohen's d

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Histogram comparison
axes[0,0].hist(conv_forces, bins=30, alpha=0.6, color='#f87171', label=f'Conventional (n={n2})', edgecolor='white', linewidth=0.5)
axes[0,0].hist(bio_forces, bins=30, alpha=0.6, color='#10b981', label=f'Bio-inspired (n={n1})', edgecolor='white', linewidth=0.5)
axes[0,0].axvline(x=m2, color='#f87171', linestyle='--', linewidth=2)
axes[0,0].axvline(x=m1, color='#10b981', linestyle='--', linewidth=2)
axes[0,0].set_xlabel('Peak Force (N)', color='white', fontsize=10)
axes[0,0].set_ylabel('Count', color='white', fontsize=10)
axes[0,0].set_title('Force Distribution', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Box plot by material
all_names = [r[0] for r in c.execute('SELECT name FROM materials ORDER BY mat_id').fetchall()]
all_data = []
for mat_id in range(1, 7):
    forces = [r[0] for r in c.execute('SELECT peak_force FROM tests WHERE mat_id=?', (mat_id,)).fetchall()]
    all_data.append(forces)

bp = axes[0,1].boxplot(all_data, labels=[n[:8] for n in all_names], patch_artist=True)
box_colors = ['#f87171']*3 + ['#10b981']*3
for patch, color in zip(bp['boxes'], box_colors):
    patch.set_facecolor(color); patch.set_alpha(0.7)
for element in ['whiskers', 'caps', 'medians']:
    for item in bp[element]: item.set_color('white')
for flier in bp['fliers']: flier.set_markeredgecolor('white')
axes[0,1].set_ylabel('Peak Force (N)', color='white', fontsize=10)
axes[0,1].set_title('Force by Material', color='white', fontsize=12, fontweight='bold')
axes[0,1].tick_params(axis='x', rotation=30)

# Confidence intervals
ci_95_bio = 1.96 * s1 / np.sqrt(n1)
ci_95_conv = 1.96 * s2 / np.sqrt(n2)
categories = ['Conventional', 'Bio-inspired']
means = [m2, m1]
cis = [ci_95_conv, ci_95_bio]
axes[1,0].bar(categories, means, yerr=cis, color=['#f87171', '#10b981'],
              capsize=10, edgecolor='white', linewidth=0.5, error_kw={'color': 'white', 'linewidth': 2})
axes[1,0].set_ylabel('Mean Peak Force (N)', color='white', fontsize=10)
axes[1,0].set_title('Mean ± 95% CI', color='white', fontsize=12, fontweight='bold')

# Percentile comparison (safety-critical)
percentiles = [50, 75, 90, 95, 99]
bio_pcts = [np.percentile(bio_forces, p) for p in percentiles]
conv_pcts = [np.percentile(conv_forces, p) for p in percentiles]
x = np.arange(len(percentiles))
axes[1,1].bar(x - 0.15, conv_pcts, 0.3, color='#f87171', label='Conventional')
axes[1,1].bar(x + 0.15, bio_pcts, 0.3, color='#10b981', label='Bio-inspired')
axes[1,1].set_xticks(x); axes[1,1].set_xticklabels([f'{p}th' for p in percentiles])
axes[1,1].set_ylabel('Peak Force (N)', color='white', fontsize=10)
axes[1,1].set_title('Percentile Comparison', color='white', fontsize=12, fontweight='bold')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

plt.suptitle('Statistical Analysis: Bio-Inspired vs Conventional', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("STATISTICAL SUMMARY")
print("=" * 55)
print(f"Conventional: mean = {m2:.0f} N, std = {s2:.0f} N (n={n2})")
print(f"Bio-inspired: mean = {m1:.0f} N, std = {s1:.0f} N (n={n1})")
print(f"Difference: {m2-m1:.0f} N ({(m2-m1)/m2*100:.1f}% reduction)")
print(f"t-statistic: {t_stat:.2f}")
print(f"Effect size (Cohen's d): {effect_size:.2f} ({'large' if abs(effect_size) > 0.8 else 'medium' if abs(effect_size) > 0.5 else 'small'})")
print(f"95th percentile: conv={np.percentile(conv_forces, 95):.0f}N vs bio={np.percentile(bio_forces, 95):.0f}N")

conn.close()`,
      challenge: 'Test whether bio-inspired materials are also more CONSISTENT (lower coefficient of variation). Calculate CV = std/mean for each material and rank them. Consistency is as important as mean performance for safety.',
      successHint: 'Statistical analysis transforms test data into evidence. The combination of significance testing, effect sizes, and percentile analysis provides a complete picture of material performance.',
    },
    {
      title: 'Certification engine — automated pass/fail against safety standards',
      concept: `Helmet certification requires testing against specific standards:

- **EN 1078** (Europe, bicycle): peak deceleration < 250g at 5.42 m/s
- **ECE 22.06** (Europe, motorcycle): peak force < 275g at 7.5 m/s
- **CPSC** (US, bicycle): peak force < 300g at 6.2 m/s

A **certification engine** automatically evaluates test results against all applicable standards and generates compliance reports.

The engine must:
1. Match each test to applicable standards (by velocity)
2. Compare measured values to limits
3. Calculate pass/fail for each specimen
4. Generate batch-level statistics
5. Flag non-conforming specimens

📚 *SQL CASE WHEN statements enable conditional logic within queries. Combined with JOINs and GROUP BY, they create powerful automated reporting.*`,
      analogy: 'A certification engine is like an automated exam grading system. Each test result (exam paper) is compared against the answer key (safety standard). The system grades every paper, calculates class statistics, and flags failing students — all without human intervention. Hundreds of tests can be evaluated in seconds.',
      storyConnection: 'Before a hornbill-inspired helmet reaches a single customer, it must pass rigorous certification testing. The certification engine ensures nothing slips through — every specimen, every test, every standard is checked automatically.',
      checkQuestion: 'If a material passes 98% of tests but fails 2%, should it be certified?',
      checkAnswer: 'It depends on the standard\'s requirements. Some standards require 100% pass rate on a minimum sample size (e.g., all 6 specimens must pass). Others use statistical criteria (e.g., 95th percentile must be below the limit). The 2% failure rate might be acceptable if it is within statistical expectation for the sample size, or it might be disqualifying if the standard demands zero failures. The certification engine must know and enforce the specific rules of each standard.',
      codeIntro: 'Build an automated certification engine that tests materials against multiple safety standards.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE materials (id INTEGER PRIMARY KEY, name TEXT, bio INTEGER);
    CREATE TABLE standards (id INTEGER PRIMARY KEY, name TEXT, max_g REAL, test_velocity REAL, min_tests INTEGER, required_pass_pct REAL);
    CREATE TABLE tests (id INTEGER PRIMARY KEY, mat_id INTEGER, velocity REAL, peak_g REAL, specimen TEXT);
    CREATE TABLE certifications (id INTEGER PRIMARY KEY AUTOINCREMENT, mat_id INTEGER, std_id INTEGER,
        tests_run INTEGER, tests_passed INTEGER, pass_rate REAL, p95_g REAL, status TEXT, report TEXT);
''')

# Standards
stds = [
    (1, 'EN 1078 (Bicycle)', 250, 5.42, 6, 100.0),
    (2, 'ECE 22.06 (Motorcycle)', 275, 7.5, 10, 95.0),
    (3, 'CPSC (US Bicycle)', 300, 6.2, 4, 100.0),
]
c.executemany('INSERT INTO standards VALUES (?,?,?,?,?,?)', stds)

# Materials
mats = [(1,'EPS Standard',0),(2,'EPP Foam',0),(3,'Bio-Gradient v2',1),(4,'Casque-Mimic v1',1)]
c.executemany('INSERT INTO materials VALUES (?,?,?)', mats)

# Generate test data
np.random.seed(42)
test_id = 1
for mat_id, name, bio in mats:
    for std_id, std_name, max_g, velocity, min_tests, req_pct in stds:
        n_tests = min_tests + 4  # run extra tests
        for i in range(n_tests):
            if bio:
                peak_g = np.random.normal(180 - 20*bio, 25)
            else:
                peak_g = np.random.normal(220 + mat_id*10, 35)
            # Velocity affects result
            peak_g *= velocity / 5.42
            peak_g = max(50, peak_g)
            c.execute('INSERT INTO tests VALUES (?,?,?,?,?)',
                     (test_id, mat_id, velocity, round(peak_g, 1), f'S{test_id:03d}'))
            test_id += 1
conn.commit()

# === CERTIFICATION ENGINE ===
print("╔══════════════════════════════════════════════════════════╗")
print("║         IMPACT MATERIAL CERTIFICATION REPORT            ║")
print("╚══════════════════════════════════════════════════════════╝")

for mat_id, mat_name, bio in mats:
    print(f"\
{'='*55}")
    print(f"  Material: {mat_name} {'(bio-inspired)' if bio else '(conventional)'}")
    print(f"{'='*55}")

    for std_id, std_name, max_g, velocity, min_tests, req_pct in stds:
        # Get test results for this material at this velocity
        results = c.execute('''SELECT peak_g, specimen FROM tests
                              WHERE mat_id=? AND velocity=? ORDER BY peak_g''',
                           (mat_id, velocity)).fetchall()

        if not results:
            continue

        g_values = np.array([r[0] for r in results])
        n_total = len(g_values)
        n_passed = sum(1 for g in g_values if g < max_g)
        pass_rate = n_passed / n_total * 100
        p95 = np.percentile(g_values, 95)
        mean_g = np.mean(g_values)
        std_g = np.std(g_values, ddof=1)

        # Certification decision
        if n_total < min_tests:
            status = "INSUFFICIENT DATA"
        elif pass_rate >= req_pct and p95 < max_g:
            status = "CERTIFIED"
        elif pass_rate >= req_pct:
            status = "CONDITIONAL (95th %ile exceeds limit)"
        else:
            status = "FAILED"

        report = f"Tests: {n_total}, Passed: {n_passed}/{n_total} ({pass_rate:.0f}%), Mean: {mean_g:.0f}g, 95th: {p95:.0f}g"

        c.execute('''INSERT INTO certifications (mat_id, std_id, tests_run, tests_passed,
                     pass_rate, p95_g, status, report) VALUES (?,?,?,?,?,?,?,?)''',
                 (mat_id, std_id, n_total, n_passed, round(pass_rate,1),
                  round(p95,1), status, report))

        marker = "  " if status == "CERTIFIED" else "!!" if "FAIL" in status else "? "
        print(f"  {marker} {std_name:25s} | {status}")
        print(f"     {report}")

        # Show individual failures
        failures = [(r[0], r[1]) for r in results if r[0] >= max_g]
        if failures:
            for g, spec in failures:
                print(f"     FAIL: {spec} at {g:.1f}g (limit: {max_g:.0f}g)")

conn.commit()

# Summary matrix
print(f"\
{'='*55}")
print("CERTIFICATION MATRIX")
print(f"{'='*55}")
print(f"{'Material':>20} | {'EN 1078':>10} | {'ECE 22.06':>10} | {'CPSC':>10}")
print("-" * 55)

for mat_id, mat_name, _ in mats:
    row = [mat_name[:20]]
    for std_id in [1, 2, 3]:
        result = c.execute('SELECT status FROM certifications WHERE mat_id=? AND std_id=?',
                          (mat_id, std_id)).fetchone()
        status = result[0] if result else 'N/A'
        short = 'PASS' if 'CERTIFIED' in status else 'COND' if 'CONDITIONAL' in status else 'FAIL' if 'FAIL' in status else '---'
        row.append(short)
    print(f"  {row[0]:>18} | {row[1]:>10} | {row[2]:>10} | {row[3]:>10}")

conn.close()`,
      challenge: 'Add a "batch consistency" check: if the coefficient of variation within a batch exceeds 15%, flag it as a manufacturing quality issue regardless of pass/fail. How many batches would be flagged?',
      successHint: 'You have built an automated certification system. This is exactly how safety testing labs operate — automated evaluation against standards with full traceability of every test result.',
    },
    {
      title: 'Product lifecycle database — from lab to market to recycling',
      concept: `A complete product database tracks the helmet from material testing through manufacturing, sales, use, and end-of-life:

- **Materials**: sourcing, testing, certification
- **Manufacturing**: production batches, quality control
- **Distribution**: inventory, sales, warranty
- **Field performance**: accident reports, insurance claims
- **End of life**: recycling, environmental impact

This **lifecycle assessment (LCA)** database enables:
- Tracing any defect back to its source
- Monitoring real-world performance vs lab tests
- Calculating environmental footprint
- Improving future designs based on field data

📚 *Complex SQL queries with multiple JOINs and subqueries can traverse the entire lifecycle, answering questions like "What material was in the helmet that failed in the March 3 accident?"*`,
      analogy: 'A lifecycle database is like a detailed biography of every helmet produced. From its "birth" (raw materials) through "education" (testing), "career" (protecting a rider), and "retirement" (recycling), every event is recorded. If something goes wrong, you can trace the entire history to find what happened and prevent it from happening again.',
      storyConnection: 'A bio-inspired helmet company must track not just performance but sustainability. If the hornbill casque inspires the design, the company has a responsibility to ensure the product\'s environmental footprint honors the natural world that inspired it.',
      checkQuestion: 'Why is traceability from accident back to raw material important?',
      checkAnswer: 'If a helmet fails in an accident, you need to determine: was it a material defect (bad batch), a design flaw (all helmets of this model are affected), a manufacturing error (one production line), or misuse (the rider modified it)? Each answer requires a different response — from recalling a batch to redesigning the product to updating user instructions. Without traceability, you cannot determine the cause or the appropriate response.',
      codeIntro: 'Build a complete product lifecycle database for the bio-inspired helmet.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE materials (id INTEGER PRIMARY KEY, name TEXT, supplier TEXT, carbon_kg_per_kg REAL);
    CREATE TABLE production_batches (batch_id TEXT PRIMARY KEY, mat_id INTEGER, date TEXT, quantity INTEGER, qc_pass_rate REAL);
    CREATE TABLE helmets (helmet_id TEXT PRIMARY KEY, batch_id TEXT, model TEXT, size TEXT, manufacture_date TEXT);
    CREATE TABLE sales (sale_id INTEGER PRIMARY KEY AUTOINCREMENT, helmet_id TEXT, sale_date TEXT, retailer TEXT, price REAL);
    CREATE TABLE incidents (inc_id INTEGER PRIMARY KEY AUTOINCREMENT, helmet_id TEXT, date TEXT, type TEXT, speed_kmh REAL, outcome TEXT, helmet_condition TEXT);
    CREATE TABLE recycling (rec_id INTEGER PRIMARY KEY AUTOINCREMENT, helmet_id TEXT, date TEXT, method TEXT, material_recovered_pct REAL);
''')

# Populate lifecycle data
np.random.seed(42)

materials = [
    (1, 'Bio-Gradient Foam', 'NagaTech Materials', 3.2),
    (2, 'Polycarbonate Shell', 'ShellCorp India', 5.8),
    (3, 'Comfort Liner', 'SoftPad Inc', 1.5),
    (4, 'Retention System', 'BuckleWorks', 4.0),
]
c.executemany('INSERT INTO materials VALUES (?,?,?,?)', materials)

# Production batches
batches = []
for month in range(1, 13):
    for mat_id in [1, 2]:
        batch_id = f'B{2025}{month:02d}-M{mat_id}'
        qty = np.random.randint(500, 2000)
        qc = np.random.uniform(96, 100)
        batches.append((batch_id, mat_id, f'2025-{month:02d}-01', qty, round(qc, 1)))
c.executemany('INSERT INTO production_batches VALUES (?,?,?,?,?)', batches)

# Helmets
models = ['BioShield Sport', 'BioShield Pro', 'BioShield Urban']
sizes = ['S', 'M', 'L', 'XL']
helmet_count = 0
for batch_id, mat_id, date, qty, qc in batches[:6]:  # first 6 batches
    for i in range(min(100, qty)):
        hid = f'H{helmet_count:06d}'
        model = np.random.choice(models, p=[0.3, 0.5, 0.2])
        size = np.random.choice(sizes, p=[0.15, 0.35, 0.35, 0.15])
        c.execute('INSERT INTO helmets VALUES (?,?,?,?,?)', (hid, batch_id, model, size, date))
        helmet_count += 1

# Sales
for i in range(400):
    hid = f'H{np.random.randint(0, helmet_count):06d}'
    month = np.random.randint(1, 13)
    retailer = np.random.choice(['BikeZone Delhi', 'CycleHub Mumbai', 'PedalPower Kolkata', 'RideShop Kohima'])
    price = np.random.choice([2999, 4999, 7999], p=[0.3, 0.5, 0.2])
    c.execute('INSERT INTO sales VALUES (?,?,?,?,?)', (None, hid, f'2025-{month:02d}-15', retailer, price))

# Incidents
incident_types = ['fall', 'vehicle collision', 'obstacle impact', 'multi-surface']
for i in range(25):
    hid = f'H{np.random.randint(0, helmet_count):06d}'
    month = np.random.randint(3, 13)
    inc_type = np.random.choice(incident_types, p=[0.4, 0.3, 0.2, 0.1])
    speed = np.random.uniform(10, 45)
    outcome = 'no injury' if speed < 25 else np.random.choice(['minor injury', 'no injury'], p=[0.3, 0.7])
    condition = 'cracked' if speed > 20 else 'scuffed'
    c.execute('INSERT INTO incidents VALUES (?,?,?,?,?,?,?)',
             (None, hid, f'2025-{month:02d}-{np.random.randint(1,28):02d}', inc_type, round(speed,1), outcome, condition))

# Recycling
for i in range(50):
    hid = f'H{np.random.randint(0, helmet_count):06d}'
    method = np.random.choice(['grinding + reuse', 'chemical recycling', 'energy recovery'])
    recovered = np.random.uniform(40, 85) if 'reuse' in method else np.random.uniform(20, 60)
    c.execute('INSERT INTO recycling VALUES (?,?,?,?,?)',
             (None, hid, f'2025-{np.random.randint(6,13):02d}-01', method, round(recovered, 1)))

conn.commit()

# === LIFECYCLE ANALYTICS ===
print("╔══════════════════════════════════════════════════════════╗")
print("║      BIO-INSPIRED HELMET — LIFECYCLE DASHBOARD          ║")
print("╚══════════════════════════════════════════════════════════╝")

# Production
total_helmets = c.execute('SELECT COUNT(*) FROM helmets').fetchone()[0]
total_sold = c.execute('SELECT COUNT(*) FROM sales').fetchone()[0]
total_incidents = c.execute('SELECT COUNT(*) FROM incidents').fetchone()[0]
revenue = c.execute('SELECT SUM(price) FROM sales').fetchone()[0]

print(f"\
[PRODUCTION] {total_helmets} helmets manufactured")
print(f"[SALES]      {total_sold} sold | Revenue: Rs {revenue:,.0f}")
print(f"[INCIDENTS]  {total_incidents} reported")

# Safety performance
print(f"\
[SAFETY ANALYSIS]")
rows = c.execute('''SELECT i.type, COUNT(*), ROUND(AVG(i.speed_kmh),1),
                    SUM(CASE WHEN i.outcome='no injury' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
                    FROM incidents i GROUP BY i.type ORDER BY COUNT(*) DESC''').fetchall()
print(f"  {'Type':>20} | {'Count':>5} | {'Avg Speed':>9} | {'No-injury %':>11}")
print(f"  {'-'*20}-+-{'-'*5}-+-{'-'*9}-+-{'-'*11}")
for typ, count, avg_spd, safe_pct in rows:
    print(f"  {typ:>20} | {count:>5} | {avg_spd:>7.1f}kph | {safe_pct:>9.1f}%")

# Traceability example
print(f"\
[TRACEABILITY EXAMPLE]")
incident = c.execute('''SELECT i.inc_id, i.helmet_id, i.date, i.type, i.speed_kmh, i.outcome, i.helmet_condition
                        FROM incidents i WHERE i.outcome != 'no injury' LIMIT 1''').fetchone()
if incident:
    inc_id, hid, date, typ, speed, outcome, condition = incident
    print(f"  Incident #{inc_id}: {typ} at {speed:.0f} km/h on {date}")
    print(f"  Outcome: {outcome} | Helmet: {condition}")

    helmet = c.execute('SELECT batch_id, model, size, manufacture_date FROM helmets WHERE helmet_id=?', (hid,)).fetchone()
    if helmet:
        batch, model, size, mfg_date = helmet
        print(f"  Helmet: {model} ({size}), manufactured {mfg_date}")
        print(f"  Production batch: {batch}")

        batch_info = c.execute('SELECT mat_id, qc_pass_rate FROM production_batches WHERE batch_id=?', (batch,)).fetchone()
        if batch_info:
            mat = c.execute('SELECT name, supplier FROM materials WHERE id=?', (batch_info[0],)).fetchone()
            print(f"  Material: {mat[0]} from {mat[1]}")
            print(f"  Batch QC pass rate: {batch_info[1]}%")
            print(f"  → Full traceability: incident → helmet → batch → material → supplier")

# Environmental footprint
print(f"\
[ENVIRONMENTAL FOOTPRINT]")
avg_recovery = c.execute('SELECT ROUND(AVG(material_recovered_pct),1) FROM recycling').fetchone()[0]
by_method = c.execute('SELECT method, COUNT(*), ROUND(AVG(material_recovered_pct),1) FROM recycling GROUP BY method').fetchall()
for method, count, recovery in by_method:
    print(f"  {method:>25}: {count} helmets | {recovery}% material recovered")
print(f"  Average material recovery: {avg_recovery}%")

conn.close()
print("\
  Lifecycle database complete. Full traceability from material to recycling.")`,
      challenge: 'Calculate the total carbon footprint of the helmet lifecycle: material production + manufacturing + distribution + end-of-life. Which phase has the highest environmental impact?',
      successHint: 'You have built a complete product lifecycle management system. This is the same infrastructure used by companies like Trek, Bell, and Shoei to manage helmet safety, quality, and sustainability.',
    },
    {
      title: 'Capstone — biomimetic impact protection research platform',
      concept: `The **capstone** integrates the entire course into a single research platform:

1. **Materials database**: properties of biological and synthetic materials
2. **Physics engine**: impact simulation with gradient structures
3. **Testing module**: statistical analysis of crash test results
4. **Certification engine**: automated standards compliance
5. **Design optimizer**: finds optimal gradient profiles
6. **Reporting dashboard**: visualizes everything

This platform represents the complete workflow of a biomimetic materials research lab — from studying the hornbill casque to certifying a commercial product.

📚 *The capstone demonstrates integration: each module feeds data to the next, creating a pipeline from raw materials to certified products.*`,
      analogy: 'The complete platform is like a self-contained research laboratory. You can study a natural specimen (hornbill casque), understand its physics (simulation), design a synthetic version (optimization), test it (crash tests), certify it (standards), and track it through its entire life (lifecycle database). All from a single integrated system.',
      storyConnection: 'This capstone represents the full journey from admiring the hornbill in Nagaland\'s forests to engineering a product that saves human lives — inspired by the same bird that the Naga people have revered for generations. Science and culture converge in biomimetic engineering.',
      checkQuestion: 'What is the most important thing this capstone demonstrates?',
      checkAnswer: 'Integration. Each individual skill (databases, physics, statistics, visualization) is useful alone. But the real power comes from connecting them into a pipeline where data flows from observation to understanding to design to product. This integration is what separates a student who knows techniques from an engineer who can solve problems.',
      codeIntro: 'Build the complete biomimetic impact protection research platform.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

# === RESEARCH PLATFORM ===
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
    CREATE TABLE bio_specimens (id INTEGER PRIMARY KEY, species TEXT, structure TEXT, density REAL, toughness REAL, self_healing INTEGER);
    CREATE TABLE synthetic_materials (id INTEGER PRIMARY KEY, name TEXT, inspired_by INTEGER, density REAL, toughness REAL, cost_per_kg REAL);
    CREATE TABLE design_candidates (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, mat_id INTEGER, gradient TEXT, thickness_mm REAL, mass_g REAL, peak_force_n REAL, pass_en1078 INTEGER);
    CREATE TABLE research_log (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, entry TEXT, category TEXT);
''')

# Biological specimens
bio = [
    (1, 'Great Hornbill', 'gradient cellular casque', 285, 0.45, 1),
    (2, 'Woodpecker', 'multi-layer spongy bone', 400, 0.30, 1),
    (3, 'Bighorn Ram', 'pneumatized frontal bone', 1200, 0.60, 1),
    (4, 'Mantis Shrimp', 'helicoidal composite', 1800, 0.80, 1),
    (5, 'Coconut', 'fibrous shell + endocarp', 800, 0.35, 0),
]
c.executemany('INSERT INTO bio_specimens VALUES (?,?,?,?,?,?)', bio)

# Synthetic materials inspired by each
synth = [
    (1, 'CasqueForm-A', 1, 200, 0.38, 45),
    (2, 'CasqueForm-B', 1, 180, 0.42, 60),
    (3, 'WoodPeck-1', 2, 250, 0.28, 35),
    (4, 'ShrimpArmor', 4, 600, 0.70, 120),
    (5, 'CocoShield', 5, 400, 0.32, 25),
    (6, 'Standard EPS', None, 80, 0.20, 15),
    (7, 'Standard EPP', None, 120, 0.25, 20),
]
c.executemany('INSERT INTO synthetic_materials VALUES (?,?,?,?,?,?)', synth)

# Design and evaluate candidates
np.random.seed(42)
safety_limit = 250 * 9.81  # EN 1078

def evaluate_design(name, mat_id, density, toughness, thickness_mm, gradient_type):
    area = 0.04  # m²
    mass = density * thickness_mm / 1000 * area * 1000  # grams

    # Shell mass
    shell_mass = 1200 * 0.002 * area * 1000
    total_mass = mass + shell_mass

    # Impact simulation (simplified)
    head_mass = 5.0; velocity = 5.42
    KE = 0.5 * head_mass * velocity**2
    energy_capacity = toughness * 1e6 * thickness_mm / 1000 * 0.005  # J

    if gradient_type == 'gradient':
        efficiency = 0.85
    elif gradient_type == 'multi-layer':
        efficiency = 0.75
    else:
        efficiency = 0.65

    absorbed = min(KE, energy_capacity * efficiency)
    remaining = KE - absorbed
    peak_force = remaining / 0.005 + np.random.normal(0, 50)  # N
    peak_force = max(100, peak_force)

    passes = peak_force < safety_limit
    return total_mass, peak_force, passes

gradients = {1: 'gradient', 2: 'gradient', 3: 'multi-layer', 4: 'multi-layer', 5: 'uniform', 6: 'uniform', 7: 'uniform'}

for mat_id, name, inspired, density, toughness, cost in synth:
    for thickness in [20, 25, 30]:
        grad = gradients[mat_id]
        mass, force, passes = evaluate_design(name, mat_id, density, toughness, thickness, grad)
        design_name = f'{name} {thickness}mm'
        c.execute('INSERT INTO design_candidates (name, mat_id, gradient, thickness_mm, mass_g, peak_force_n, pass_en1078) VALUES (?,?,?,?,?,?,?)',
                 (design_name, mat_id, grad, thickness, round(mass,1), round(force,1), 1 if passes else 0))

conn.commit()

# Log research milestones
logs = [
    ('2025-01-15', 'CT scanned hornbill casque specimen — gradient structure confirmed', 'observation'),
    ('2025-02-20', 'Gibson-Ashby scaling validated for casque cellular bone', 'analysis'),
    ('2025-03-10', 'First CasqueForm-A prototype produced', 'development'),
    ('2025-04-05', 'CasqueForm-B passes EN 1078 at 25mm thickness', 'milestone'),
    ('2025-05-15', 'Statistical comparison confirms bio-inspired > conventional (p<0.001)', 'analysis'),
    ('2025-06-01', 'Patent filed for gradient cellular helmet foam', 'milestone'),
]
c.executemany('INSERT INTO research_log (date, entry, category) VALUES (?,?,?)', logs)
conn.commit()

# === DASHBOARD ===
print("╔══════════════════════════════════════════════════════════════╗")
print("║    BIOMIMETIC IMPACT PROTECTION — RESEARCH DASHBOARD       ║")
print("╚══════════════════════════════════════════════════════════════╝")

# Bio-inspiration mapping
print("\
[BIOLOGICAL INSPIRATIONS]")
for row in c.execute('''SELECT b.species, b.structure, s.name, s.toughness
                        FROM bio_specimens b LEFT JOIN synthetic_materials s ON b.id = s.inspired_by
                        WHERE s.id IS NOT NULL''').fetchall():
    print(f"  {row[0]:>15} ({row[1][:25]}) → {row[2]} (toughness: {row[3]})")

# Design leaderboard
print("\
[DESIGN LEADERBOARD — EN 1078 Certified]")
rows = c.execute('''SELECT d.name, s.name as material, d.gradient, d.thickness_mm, d.mass_g, d.peak_force_n
                    FROM design_candidates d JOIN synthetic_materials s ON d.mat_id = s.id
                    WHERE d.pass_en1078 = 1
                    ORDER BY d.peak_force_n ASC LIMIT 10''').fetchall()
print(f"  {'Design':>25} | {'Gradient':>10} | {'mm':>4} | {'Mass':>6} | {'Force':>7}")
print(f"  {'-'*25}-+-{'-'*10}-+-{'-'*4}-+-{'-'*6}-+-{'-'*7}")
for name, mat, grad, thick, mass, force in rows:
    print(f"  {name:>25} | {grad:>10} | {thick:>4.0f} | {mass:>5.1f}g | {force:>6.0f}N")

# Visualization
fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Bio specimens: toughness vs density
for bid, species, struct, dens, tough, heal in bio:
    axes[0,0].scatter(dens, tough, s=150, color='#10b981', edgecolors='white', linewidths=1.5, zorder=5)
    axes[0,0].annotate(species.split()[-1], (dens, tough), textcoords="offset points", xytext=(5,5), color='white', fontsize=8)
for sid, sname, insp, dens, tough, cost in synth:
    c_color = '#60a5fa' if insp else '#f87171'
    axes[0,0].scatter(dens, tough, s=100, color=c_color, edgecolors='white', linewidths=1, marker='s', zorder=4)
axes[0,0].set_xlabel('Density (kg/m³)', color='white', fontsize=10)
axes[0,0].set_ylabel('Toughness (MJ/m³)', color='white', fontsize=10)
axes[0,0].set_title('Materials Property Space', color='white', fontsize=12, fontweight='bold')

# Design candidates: mass vs force
all_designs = c.execute('SELECT mass_g, peak_force_n, gradient, pass_en1078 FROM design_candidates').fetchall()
for mass, force, grad, passes in all_designs:
    color = '#10b981' if passes else '#f87171'
    marker = 'o' if grad == 'gradient' else 's' if grad == 'multi-layer' else '^'
    axes[0,1].scatter(mass, force, c=color, marker=marker, s=50, alpha=0.7, edgecolors='white', linewidths=0.5)
axes[0,1].axhline(y=safety_limit, color='#f59e0b', linestyle='--', label=f'EN 1078 limit ({safety_limit:.0f}N)')
axes[0,1].set_xlabel('Mass (g)', color='white', fontsize=10)
axes[0,1].set_ylabel('Peak Force (N)', color='white', fontsize=10)
axes[0,1].set_title('Design Space (green=pass, red=fail)', color='white', fontsize=12, fontweight='bold')
axes[0,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Pass rate by gradient type
grad_stats = c.execute('''SELECT gradient, COUNT(*), SUM(pass_en1078)*100.0/COUNT(*)
                          FROM design_candidates GROUP BY gradient''').fetchall()
grad_names = [r[0] for r in grad_stats]
pass_rates = [r[2] for r in grad_stats]
grad_colors = ['#10b981' if 'gradient' in g else '#f59e0b' if 'multi' in g else '#f87171' for g in grad_names]
axes[1,0].bar(grad_names, pass_rates, color=grad_colors, edgecolor='white', linewidth=0.5)
axes[1,0].set_ylabel('EN 1078 Pass Rate (%)', color='white', fontsize=10)
axes[1,0].set_title('Pass Rate by Structure Type', color='white', fontsize=12, fontweight='bold')

# Research timeline
log_entries = c.execute('SELECT date, entry, category FROM research_log ORDER BY date').fetchall()
y_pos = np.arange(len(log_entries))
cat_colors = {'observation': '#60a5fa', 'analysis': '#f59e0b', 'development': '#10b981', 'milestone': '#a78bfa'}
for i, (date, entry, cat) in enumerate(log_entries):
    axes[1,1].barh(i, 1, color=cat_colors.get(cat, '#9ca3af'), height=0.6)
    axes[1,1].text(0.05, i, f'{date}: {entry[:40]}', color='white', fontsize=7, va='center')
axes[1,1].set_yticks([]); axes[1,1].set_xticks([])
axes[1,1].set_title('Research Timeline', color='white', fontsize=12, fontweight='bold')

plt.suptitle('Biomimetic Impact Protection Research Platform', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

# Final statistics
total_designs = c.execute('SELECT COUNT(*) FROM design_candidates').fetchone()[0]
passing = c.execute('SELECT COUNT(*) FROM design_candidates WHERE pass_en1078=1').fetchone()[0]
best = c.execute('SELECT name, peak_force_n, mass_g FROM design_candidates WHERE pass_en1078=1 ORDER BY peak_force_n LIMIT 1').fetchone()

print(f"\
PLATFORM SUMMARY:")
print(f"  Biological specimens studied: {len(bio)}")
print(f"  Synthetic materials developed: {len(synth)}")
print(f"  Design candidates evaluated: {total_designs}")
print(f"  EN 1078 certified designs: {passing}")
if best:
    print(f"  Best design: {best[0]} ({best[1]:.0f}N, {best[2]:.0f}g)")
print(f"\
  From hornbill to helmet — biomimetic engineering complete.")

conn.close()`,
      challenge: 'Add a cost optimization module: find the design that minimizes cost while still passing EN 1078. Is the cheapest passing design bio-inspired or conventional?',
      successHint: 'You have built a complete biomimetic research platform. This capstone integrates every skill from the course: databases, physics simulation, statistical analysis, certification, optimization, and visualization. The journey from observing a hornbill in Nagaland to engineering a certified helmet product is complete.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Impact Engineering Data Systems</span>
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
