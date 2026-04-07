import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MayaAstronomyLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Synodic vs sidereal periods — two ways to measure a planet\'s year',
      concept: `Every planet has two fundamentally different "periods":

1. **Sidereal period** — the time for one full orbit around the Sun, measured against the fixed stars. This is the planet's *actual* orbital period.
2. **Synodic period** — the time between successive identical alignments of the planet, Earth, and the Sun. This is what an observer on Earth *sees*.

They differ because Earth is also moving. The relationship is:

**1/P_synodic = |1/P_planet - 1/P_earth|**

For inner planets (Venus, Mercury), P_planet < P_earth, so P_synodic = 1/(1/P_planet - 1/P_earth).
For outer planets (Mars, Jupiter, Saturn), P_planet > P_earth, so P_synodic = 1/(1/P_earth - 1/P_planet).

Kepler's Third Law connects the sidereal period to the orbital radius: **T² = a³** (with T in years, a in AU). This means if you know how long a planet takes to orbit, you know how far it is from the Sun — and vice versa.

The Maya could measure synodic periods with extraordinary precision (they watched the sky for centuries). But they did not know Kepler's law — they could not convert synodic to sidereal, and thus could not determine orbital distances. Their model was observational, not mechanical.

📚 *The distinction between what you observe (synodic) and what actually happens (sidereal) is fundamental to science. Your vantage point shapes what you see. Correcting for your own motion to find the true motion is what makes astronomy hard — and what makes Kepler's achievement remarkable.*`,
      analogy: 'You\'re on a merry-go-round watching a friend walk around the outside. From your spinning seat, your friend seems to speed up, slow down, and even walk backwards at times. Their actual walking speed (sidereal) never changes — but the apparent speed (synodic) depends on YOUR rotation. Removing your own motion to find their true speed is exactly the synodic-to-sidereal conversion.',
      storyConnection: 'The Maya tracked Mars for centuries and recorded its synodic period as 780 days — modern value: 779.94 days. They noticed Mars\'s retrograde motion (apparent backward drift) but interpreted it through mythology, not orbital mechanics. The data was superb; the explanatory framework was different from ours.',
      checkQuestion: 'Mars has a sidereal period of 687 days. Earth\'s is 365.25 days. Calculate Mars\'s synodic period.',
      checkAnswer: '1/P_synodic = 1/365.25 - 1/687 = 0.002738 - 0.001456 = 0.001282. P_synodic = 1/0.001282 = 780.0 days. The Maya value of 780 matches perfectly. They measured the synodic period to better than 0.01% accuracy without knowing orbital mechanics — purely from centuries of naked-eye observation.',
      codeIntro: 'Calculate synodic and sidereal periods for every visible planet, and use Kepler\'s Third Law to derive orbital distances.',
      code: `import numpy as np

# Sidereal periods of planets visible to the Maya (days)
planets = [
    {"name": "Mercury", "sidereal_days": 87.97,  "maya_synodic": 116},
    {"name": "Venus",   "sidereal_days": 224.70, "maya_synodic": 584},
    {"name": "Mars",    "sidereal_days": 686.97, "maya_synodic": 780},
    {"name": "Jupiter", "sidereal_days": 4332.6, "maya_synodic": 399},
    {"name": "Saturn",  "sidereal_days": 10759.2,"maya_synodic": 378},
]

P_earth = 365.2422  # days

print("=== Synodic vs Sidereal Periods ===")
print(f"{'Planet':<10} {'Sidereal':>10} {'Calc Syn':>10} {'Maya Syn':>10} {'Error':>8} {'a (AU)':>8}")
print("-" * 58)

for p in planets:
    T_sid = p["sidereal_days"]
    # Calculate synodic period
    if T_sid < P_earth:  # inner planet
        P_syn = 1.0 / (1.0/T_sid - 1.0/P_earth)
    else:  # outer planet
        P_syn = 1.0 / (1.0/P_earth - 1.0/T_sid)

    error_days = abs(P_syn - p["maya_synodic"])
    error_pct = error_days / P_syn * 100

    # Kepler's Third Law: T^2 = a^3  (T in years, a in AU)
    T_years = T_sid / 365.2422
    a_au = T_years ** (2/3)

    print(f"{p['name']:<10} {T_sid:>8.1f}d {P_syn:>8.1f}d {p['maya_synodic']:>8.0f}d "
          f"{error_pct:>6.2f}% {a_au:>6.3f}")

print()
print("Kepler's Third Law: T^2 = a^3")
print("If you know the period, you know the distance.")
print()

# Show why synodic periods cluster for outer planets
print("=== Why Outer Planet Synodic Periods Are Similar ===")
for T_sid_yr in [2, 5, 12, 30, 84, 165]:
    P_syn_yr = 1.0 / (1.0 - 1.0/T_sid_yr)
    print(f"  Sidereal: {T_sid_yr:>4} yr  Synodic: {P_syn_yr:.3f} yr = {P_syn_yr*365.25:.0f} days")
print("As sidereal period -> infinity, synodic period -> 1 year")
print("(A very distant planet barely moves; Earth 'laps' it each year)")`,
      challenge: 'Calculate the synodic period of a hypothetical planet at 100 AU. What happens as the orbital distance approaches infinity? Why does this mean all very distant objects have synodic periods near 365.25 days?',
      successHint: 'You\'ve mastered the relationship between what observers see (synodic) and what\'s actually happening (sidereal). This observer-vs-reality distinction pervades all of science — from Doppler shifts in sound to relativistic time dilation. The Maya had the observations; Kepler provided the mechanism.',
    },
    {
      title: 'Eclipse geometry — umbra, penumbra, and the saros cycle',
      concept: `A solar eclipse occurs when the Moon passes directly between the Earth and Sun, casting a shadow. But why don't eclipses happen every month at the new Moon?

Because the Moon's orbit is **tilted 5.14 degrees** relative to Earth's orbit around the Sun. The two orbits intersect at two points called **nodes**. An eclipse can only occur when the Moon is near a node at the time of new or full Moon.

The Moon's shadow has two parts:
- **Umbra** — the dark inner cone where the Sun is completely blocked (total eclipse)
- **Penumbra** — the lighter outer cone where the Sun is partially blocked (partial eclipse)

The umbra is tiny — only ~270 km wide on Earth's surface — which is why total eclipses are rare at any given location.

The **saros cycle** is the key to eclipse prediction: every **6,585.32 days (18 years, 11 days, 8 hours)**, the Sun, Moon, and nodes return to nearly the same relative geometry. This means eclipses repeat in families — each shifted ~120 degrees west (because of the extra 8 hours).

The Maya discovered a related cycle: **405 lunar months = 11,960 days**. This is almost exactly two saros periods (2 x 6,585.32 = 13,170.64 — not exact, but the Maya cycle captures eclipse *seasons* accurately). The Dresden Codex eclipse table covers this 11,960-day span and successfully predicts eclipse warning windows.

📚 *The saros was known to the Babylonians, the Maya independently discovered the 405-month cycle, and the Greeks combined both. Three civilisations, three approaches, same underlying geometry.*`,
      analogy: 'Imagine two hula hoops tilted at a slight angle to each other, overlapping at two points. A ball (the Moon) rolls around one hoop. A light (the Sun) shines from far away. The ball\'s shadow only hits the centre of the other hoop (Earth) when the ball is near one of the two crossing points. Otherwise, the shadow passes above or below.',
      storyConnection: 'Maya eclipse tables in the Dresden Codex list 69 eclipse warning dates over 11,960 days (about 33 years). Not every warning produced a visible eclipse — the table was conservative, flagging every possibility. This is a deliberate engineering choice: better to predict a false alarm than to miss a real eclipse.',
      checkQuestion: 'If the Moon\'s orbit were not tilted relative to Earth\'s, how often would solar eclipses occur?',
      checkAnswer: 'Every single new Moon — roughly every 29.53 days (one synodic month). The 5.14-degree tilt is the ONLY reason eclipses are rare. Without it, we\'d have a solar eclipse every month and a lunar eclipse every month — eclipses would be mundane, not dramatic.',
      codeIntro: 'Model eclipse geometry — calculate umbra/penumbra sizes, node passage conditions, and the saros cycle.',
      code: `import numpy as np

# Physical constants
R_sun = 696340      # km (radius)
R_moon = 1737.4     # km
R_earth = 6371      # km
D_sun = 149597870   # km (Earth-Sun distance, mean)
D_moon = 384400     # km (Earth-Moon distance, mean)

# Angular sizes (radians)
ang_sun = 2 * R_sun / D_sun
ang_moon = 2 * R_moon / D_moon

print("=== Eclipse Geometry ===")
print(f"Sun angular diameter:  {np.degrees(ang_sun)*60:.2f} arcminutes")
print(f"Moon angular diameter: {np.degrees(ang_moon)*60:.2f} arcminutes")
print(f"Ratio (Moon/Sun): {ang_moon/ang_sun:.4f}")
print(f"{'Total eclipse possible' if ang_moon > ang_sun else 'Annular eclipse'}: "
      f"Moon {'larger' if ang_moon > ang_sun else 'smaller'} than Sun in sky")

# Umbra cone length
umbra_length = D_moon * R_moon / (R_sun - R_moon)
print(f"\\nUmbra cone length from Moon: {umbra_length:.0f} km")
print(f"Earth surface is {D_moon:.0f} km from Moon")
umbra_width_km = 2 * R_moon * (1 - D_moon / umbra_length)
# More accurate: shadow width on Earth
shadow_radius = R_moon - D_moon * (R_sun - R_moon) / D_sun
print(f"Umbra width on Earth: ~{abs(2*shadow_radius):.0f} km (typical: 100-270 km)")

# Eclipse node geometry
orbital_tilt_deg = 5.14
moon_synodic = 29.53059  # days (new moon to new moon)
draconic_month = 27.2122  # days (node to node)

# Eclipse is possible when Moon is within ~18.5 degrees of a node
eclipse_limit_deg = 18.5
# How many days near the node?
node_window_days = eclipse_limit_deg / 360 * draconic_month * 2

print(f"\\n=== Node Geometry ===")
print(f"Orbital tilt: {orbital_tilt_deg} degrees")
print(f"Synodic month: {moon_synodic:.2f} days")
print(f"Draconic month: {draconic_month:.2f} days")
print(f"Eclipse window near each node: ~{node_window_days:.0f} days")
print(f"Eclipse seasons per year: ~2 (nodes are 180 degrees apart)")

# Saros cycle
saros_days = 6585.32
saros_months = saros_days / moon_synodic
print(f"\\n=== Saros Cycle ===")
print(f"Saros period: {saros_days:.2f} days = {saros_days/365.25:.2f} years")
print(f"  = {saros_months:.1f} synodic months")
print(f"  = {saros_days/draconic_month:.1f} draconic months")
print(f"  = {saros_days/365.2422:.4f} tropical years")
print(f"Remainder: {saros_days % 1:.2f} days = ~8 hours")
print(f"This 8-hour shift moves each eclipse ~120 degrees west")

# Maya cycle comparison
maya_cycle_days = 11960
maya_months = maya_cycle_days / moon_synodic
print(f"\\n=== Maya Eclipse Cycle (Dresden Codex) ===")
print(f"Maya cycle: {maya_cycle_days} days = {maya_cycle_days/365.25:.2f} years")
print(f"  = {maya_months:.1f} synodic months (Maya used 405)")
print(f"  = {maya_cycle_days/draconic_month:.1f} draconic months")
print(f"Actual 405 months = {405 * moon_synodic:.1f} days")
print(f"Maya approximation error: {abs(maya_cycle_days - 405*moon_synodic):.1f} days")`,
      challenge: 'The Moon\'s distance from Earth varies (356,500 to 406,700 km). Calculate the umbra width at perigee (closest) and apogee (farthest). At apogee, does the umbra reach Earth at all? (Hint: when the umbra cone is too short, you get an annular eclipse instead of a total eclipse.)',
      successHint: 'Eclipse prediction requires knowing three independent cycles (synodic month, draconic month, anomalistic month) and finding when they nearly synchronise. The Maya found one such synchronisation empirically; the Babylonians found the saros; modern astronomers use Besselian elements. The geometry is the same — the methods of discovery differ.',
    },
    {
      title: 'Maya arithmetic — base-20 multiplication and division',
      concept: `The Maya used a **vigesimal (base-20)** number system with only three symbols: a dot (1), a bar (5), and a shell (0). This was one of the earliest uses of **zero as a placeholder** — independently invented, centuries before zero reached Europe from India.

Place values in the Maya system:
- 1st position: 1s (kin)
- 2nd position: 20s (uinal)
- 3rd position: 360s (tun) — NOTE: this is 18×20, not 20×20, because it aligns with their 360-day calendar approximation
- 4th position: 7,200s (katun = 20 × 360)
- 5th position: 144,000s (baktun = 20 × 7,200)

The calendar modification at the 3rd position (18×20 = 360 instead of 20×20 = 400) means Maya numbers are NOT purely base-20 when used for dates. For pure counting, they used strict vigesimal.

Multiplication in base-20 follows the same algorithm as base-10: multiply each digit, carry when the result exceeds 19. Division works the same way too.

📚 *Any positional number system — base-2 (binary), base-10 (decimal), base-16 (hexadecimal), base-20 (vigesimal) — supports the same arithmetic operations. The base changes the digits and carries, but the algorithm is universal.*`,
      analogy: 'Base-10 uses your fingers (10 digits). Base-20 uses your fingers AND toes (20 digits). The arithmetic is identical — you just carry at 20 instead of 10. If you can multiply in base-10, you can multiply in base-20; only the carry threshold changes.',
      storyConnection: 'Maya scribes performed astronomical calculations using base-20 arithmetic scratched on bark paper or carved into stone. The Dresden Codex contains multiplication tables for Venus and Mars cycles — enormous numbers computed by hand in a system most modern people can\'t even read. The computational skill required was extraordinary.',
      checkQuestion: 'Convert the Maya number (7, 11, 3) — meaning 7 in the 360s place, 11 in the 20s place, 3 in the 1s place — to base-10.',
      checkAnswer: '7 × 360 + 11 × 20 + 3 × 1 = 2,520 + 220 + 3 = 2,743. This is the Maya Long Count representation using the calendar place values (1, 20, 360, 7200, 144000).',
      codeIntro: 'Build a complete Maya base-20 arithmetic engine — convert, add, multiply, and divide in the vigesimal system.',
      code: `import numpy as np

def to_maya_pure(n):
    """Convert decimal to pure base-20 (not calendar-modified)."""
    if n == 0:
        return [0]
    digits = []
    while n > 0:
        digits.append(n % 20)
        n //= 20
    return digits[::-1]

def from_maya_pure(digits):
    """Convert pure base-20 to decimal."""
    result = 0
    for d in digits:
        result = result * 20 + d
    return result

def to_maya_calendar(n):
    """Convert day count to Maya Long Count (1, 20, 360, 7200, 144000)."""
    place_values = [144000, 7200, 360, 20, 1]
    digits = []
    for pv in place_values:
        digits.append(n // pv)
        n %= pv
    # Strip leading zeros
    while len(digits) > 1 and digits[0] == 0:
        digits.pop(0)
    return digits

def from_maya_calendar(digits):
    """Convert Maya Long Count to day count."""
    place_values = [1, 20, 360, 7200, 144000]
    # Pad to match place values (right-aligned)
    while len(digits) < len(place_values):
        digits = [0] + digits
    result = 0
    for d, pv in zip(digits, reversed(place_values)):
        result += d * pv
    return result

def maya_symbol(n):
    """Render a Maya digit (0-19) using dots and bars."""
    if n == 0:
        return " (O) "  # shell glyph for zero
    bars = n // 5
    dots = n % 5
    return "." * dots + "|" * bars if dots else "|" * bars

# Demonstrate conversions
print("=== Maya Number System ===")
print(f"{'Decimal':<10} {'Pure Base-20':<18} {'Maya Glyphs':<20} {'Calendar LC':<18}")
print("-" * 68)
for n in [0, 5, 19, 20, 42, 360, 584, 2920, 7200, 144000, 1872000]:
    pure = to_maya_pure(n)
    cal = to_maya_calendar(n)
    glyphs = " ".join(maya_symbol(d) for d in pure)
    print(f"{n:<10} {str(pure):<18} {glyphs:<20} {str(cal):<18}")

# Multiplication in base-20
print("\\n=== Base-20 Multiplication Table (partial) ===")
print(f"{'×':<4}", end="")
for b in range(1, 11):
    print(f"{b:>6}", end="")
print()
for a in [1, 5, 10, 15, 19]:
    print(f"{a:<4}", end="")
    for b in range(1, 11):
        product = a * b
        maya = to_maya_pure(product)
        print(f"{'·'.join(str(d) for d in maya):>6}", end="")
    print()

# Key astronomical numbers in Maya notation
print("\\n=== Astronomical Numbers in Maya Base-20 ===")
astro = [
    ("Venus synodic (584d)", 584),
    ("5 Venus cycles (2920d)", 2920),
    ("Calendar Round (18980d)", 18980),
    ("Maya eclipse cycle (11960d)", 11960),
    ("13 Baktun (1872000d)", 1872000),
]
for name, val in astro:
    pure = to_maya_pure(val)
    cal = to_maya_calendar(val)
    print(f"  {name:<30} base-20: {pure}  LC: {cal}")`,
      challenge: 'Implement base-20 long multiplication: given two Maya numbers as digit arrays, multiply them without converting to decimal first. (Hint: use the same algorithm as base-10 long multiplication, but carry at 20.) Test it with 584 x 5 = 2920.',
      successHint: 'You\'ve built a number system converter and arithmetic engine. The insight: ALL positional number systems are equivalent in computational power. Base-20, base-10, base-2 — they can all represent the same numbers and perform the same operations. The Maya system was as powerful as ours; only the notation differed.',
    },
    {
      title: 'Calendar algebra — the Calendar Round as LCM',
      concept: `The Maya used two interlocking calendars simultaneously:

1. **Tzolk'in** — a 260-day sacred calendar (13 numbers × 20 day names)
2. **Haab'** — a 365-day solar calendar (18 months of 20 days + 5 "unlucky" days)

Every day has BOTH a Tzolk'in designation (like "4 Ahau") and a Haab' designation (like "8 Cumku"). The combination repeats only when both calendars return to the same position simultaneously.

How long is this repeat cycle? It's the **Least Common Multiple (LCM)** of 260 and 365.

To find LCM, first find the **Greatest Common Divisor (GCD)** using the Euclidean algorithm:
- 365 = 1 × 260 + 105
- 260 = 2 × 105 + 50
- 105 = 2 × 50 + 5
- 50 = 10 × 5 + 0
- GCD = 5

**LCM = (260 × 365) / GCD = 94,900 / 5 = 18,980 days = 52 Haab' years**

This 52-year cycle is the **Calendar Round** — the most important cycle in Mesoamerican timekeeping. Every 52 years, the Tzolk'in and Haab' dates repeat, and the Maya held a "New Fire" ceremony.

For longer periods, the Maya used the **Long Count** — a continuous day count from a fixed starting point (August 11, 3114 BCE in the Gregorian calendar). The Long Count can represent any date in history without ambiguity.

📚 *The LCM of two cycles gives the period of the combined cycle. This appears everywhere: gear ratios (when do teeth re-mesh?), scheduling (when do two buses arrive together?), and cryptography (cycle lengths in ciphers).*`,
      analogy: 'Imagine two gears meshing together — one with 260 teeth, one with 365 teeth. You mark the starting position. How many rotations until those exact teeth mesh again? The gear with 260 teeth must complete enough rotations that the total teeth passed is also a whole number of 365-tooth rotations. That\'s the LCM: 18,980 teeth = 73 rotations of the small gear = 52 rotations of the large gear.',
      storyConnection: 'The Calendar Round governed Maya life: religious festivals, agricultural planting, warfare campaigns, and coronations were all scheduled by this 52-year cycle. A Maya person would experience the same Calendar Round date only once in their lifetime (if they lived past 52) — making its return a momentous occasion.',
      checkQuestion: 'Two planets have synodic periods of 584 days and 780 days. After how many days will they return to the same configuration simultaneously?',
      checkAnswer: 'LCM(584, 780). GCD: 780 = 1×584 + 196; 584 = 2×196 + 192; 196 = 1×192 + 4; 192 = 48×4 + 0. GCD = 4. LCM = 584×780/4 = 113,880 days = 311.7 years. Venus and Mars return to the same relative positions roughly every 312 years — a cycle the Maya tracked.',
      codeIntro: 'Implement the Euclidean algorithm, compute Calendar Round periods, and explore LCM relationships between Maya cycles.',
      code: `import numpy as np

def gcd(a, b):
    """Euclidean algorithm for Greatest Common Divisor."""
    steps = []
    while b:
        steps.append(f"  {a} = {a//b} x {b} + {a%b}")
        a, b = b, a % b
    return a, steps

def lcm(a, b):
    """Least Common Multiple via GCD."""
    g, _ = gcd(a, b)
    return a * b // g

# Calendar Round calculation
print("=== Calendar Round: LCM of Tzolk'in and Haab' ===")
tzolkin = 260
haab = 365

g, steps = gcd(tzolkin, haab)
print(f"GCD({tzolkin}, {haab}) via Euclidean algorithm:")
for s in steps:
    print(s)
print(f"GCD = {g}")

calendar_round = lcm(tzolkin, haab)
print(f"\\nLCM({tzolkin}, {haab}) = {tzolkin} x {haab} / {g} = {calendar_round} days")
print(f"  = {calendar_round / haab:.0f} Haab' years (solar)")
print(f"  = {calendar_round / tzolkin:.0f} Tzolk'in cycles (sacred)")
print(f"  = {calendar_round / 365.2422:.1f} tropical years")

# Why 260 and 365?
print("\\n=== Why 260? Factoring the Tzolk'in ===")
print(f"260 = 13 x 20")
print(f"  13: number of levels in Maya heaven")
print(f"  20: base of Maya number system (fingers + toes)")
print(f"  260 ~ human gestation period (266 days)")
print(f"  260 ~ interval between zenith passages of Sun at 15 deg N")

# LCM of astronomical cycles
print("\\n=== LCM of Maya Astronomical Cycles ===")
cycles = [
    ("Tzolk'in", 260),
    ("Haab'", 365),
    ("Venus synodic", 584),
    ("Mars synodic", 780),
    ("Eclipse cycle", 11960),
    ("Lunar months (x6)", 177),  # 6 lunations ~ 177 days
]

print(f"{'Cycle A':<20} {'Cycle B':<20} {'LCM (days)':>12} {'Years':>10}")
print("-" * 64)
for i in range(len(cycles)):
    for j in range(i+1, len(cycles)):
        name_a, val_a = cycles[i]
        name_b, val_b = cycles[j]
        l = lcm(val_a, val_b)
        if l < 5000000:  # skip astronomically large values
            print(f"{name_a:<20} {name_b:<20} {l:>10,} {l/365.25:>10.1f}")

# Calendar Round date calculator
print("\\n=== Calendar Round Position for Day Numbers ===")
tzolkin_names = ["Imix","Ik","Akbal","Kan","Chicchan","Cimi","Manik",
                 "Lamat","Muluc","Oc","Chuen","Eb","Ben","Ix","Men",
                 "Cib","Caban","Etznab","Cauac","Ahau"]
haab_months = ["Pop","Uo","Zip","Zotz","Tzec","Xul","Yaxkin","Mol",
               "Chen","Yax","Zac","Ceh","Mac","Kankin","Muan","Pax",
               "Kayab","Cumku","Wayeb"]

for day in [0, 1, 260, 365, 584, 18980, 1872000]:
    t_num = (day % 13) + 1
    t_name = tzolkin_names[day % 20]
    h_day = day % 365
    h_month_idx = min(h_day // 20, 18)
    h_day_in_month = h_day % 20 if h_month_idx < 18 else h_day - 360
    h_month = haab_months[h_month_idx]
    print(f"  Day {day:>9,}: {t_num:>2} {t_name:<10} {h_day_in_month:>2} {h_month}")`,
      challenge: 'The "Grand Cycle" is the LCM of the Calendar Round (18,980 days) and the Venus cycle (584 days). Calculate it. The Maya actually computed this value and used it in the Dresden Codex. How many years is one Grand Cycle?',
      successHint: 'The LCM is one of the most useful tools in mathematics — it appears in scheduling, cryptography, music theory (when do two rhythms sync?), and gear design. The Maya used it to unify their calendrical and astronomical systems. You just reproduced their mathematics with modern algorithms.',
    },
    {
      title: 'Observational statistics — how averaging reduces error',
      concept: `Maya astronomers achieved extraordinary accuracy — Venus to 0.01%, Mars to 0.008%, the lunar month to 0.004%. How did they do this with no telescopes, no clocks, and no calculators?

The answer is **statistical averaging over very long baselines**.

If you time ONE Venus cycle, your measurement might be off by a day or two (clouds, horizon haze, imprecise timing). Your error is ±1-2 days out of 584 — about 0.3%.

But if you time 65 consecutive Venus cycles (104 years of records passed down through generations) and divide the total by 65, your error drops by a factor of sqrt(65) ≈ 8. Now your per-cycle error is ±0.2 days — accuracy of 0.03%.

This is the **Central Limit Theorem** in action: the error of an average decreases as **1/sqrt(N)**, where N is the number of measurements. Double the observations, reduce error by 30%. Quadruple them, halve the error.

The Maya did exactly this. The Dresden Codex Venus table covers 65 synodic cycles. The error corrections built into the table show they understood that their base value (584 days) was an approximation and applied systematic corrections to prevent drift.

📚 *The Central Limit Theorem is the most important theorem in statistics. It says: no matter what the individual measurement errors look like, the average of many measurements has a nearly normal (Gaussian) distribution, with standard deviation shrinking as 1/sqrt(N).*`,
      analogy: 'Ask one person to estimate the number of beans in a jar — they might be off by 30%. Ask 100 people and average their guesses — the average is usually within 3% of the true number. Each person\'s error is random, but they partially cancel when averaged. More people = more cancellation = more accuracy.',
      storyConnection: 'The Maya priestly astronomers didn\'t just observe — they inherited centuries of records from their predecessors. A single astronomer might live 40-50 years. But the accumulated records spanned 500+ years, covering hundreds of Venus and Mars cycles. This institutional memory, preserved in codices and stone inscriptions, gave them a statistical baseline no individual could achieve.',
      checkQuestion: 'You measure the synodic period 9 times and get: 582, 585, 584, 586, 583, 584, 585, 583, 584 days. What is the mean and standard error?',
      checkAnswer: 'Mean = (582+585+584+586+583+584+585+583+584)/9 = 5256/9 = 584.0 days. Standard deviation ≈ 1.22 days. Standard error = 1.22/sqrt(9) = 0.41 days. So the true value is 584.0 ± 0.4 days (68% confidence). The averaging reduced uncertainty from ±1.2 days to ±0.4 days.',
      codeIntro: 'Simulate Maya observational astronomy — show how averaging over long baselines improves accuracy, and model the error reduction quantitatively.',
      code: `import numpy as np

np.random.seed(42)

# True values
TRUE_VENUS_SYNODIC = 583.9214  # days (modern)
TRUE_MARS_SYNODIC = 779.9361
TRUE_LUNAR_MONTH = 29.53059

# Simulate individual observations with measurement error
def simulate_observations(true_period, n_observations, obs_error_days=1.5):
    """
    Each observation has random error from horizon haze, timing,
    weather, etc. Returns array of measured periods.
    """
    return true_period + np.random.normal(0, obs_error_days, n_observations)

# Show how averaging improves accuracy
print("=== Error Reduction by Averaging ===")
print("(Observation error: ±1.5 days per cycle)\\n")

for name, true_val in [("Venus", TRUE_VENUS_SYNODIC),
                        ("Mars", TRUE_MARS_SYNODIC),
                        ("Lunar month", TRUE_LUNAR_MONTH)]:
    print(f"{name} (true period: {true_val:.4f} days):")
    print(f"  {'N obs':>8} {'Mean':>10} {'Std Error':>10} {'Error %':>10} {'Improvement':>12}")

    base_error = None
    for n in [1, 5, 10, 25, 65, 100, 300, 1000]:
        obs = simulate_observations(true_val, n)
        mean = np.mean(obs)
        std_error = np.std(obs) / np.sqrt(n)
        error_pct = abs(mean - true_val) / true_val * 100
        if base_error is None:
            base_error = std_error
        improvement = base_error / std_error
        print(f"  {n:>8} {mean:>10.4f} {std_error:>10.4f} {error_pct:>9.4f}% {improvement:>10.1f}x")
    print()

# Long baseline method (Maya approach)
print("=== Maya Long-Baseline Method ===")
print("Instead of timing individual cycles, time the total span:\\n")

n_cycles_list = [1, 5, 10, 65, 100]
for n_cycles in n_cycles_list:
    # Measure total time for n_cycles (error only at start and end)
    total_true = TRUE_VENUS_SYNODIC * n_cycles
    # Error is only ±2 days total (beginning and end observations)
    total_measured = total_true + np.random.normal(0, 2.0)
    per_cycle = total_measured / n_cycles
    error = abs(per_cycle - TRUE_VENUS_SYNODIC)
    print(f"  {n_cycles:>3} cycles: total = {total_measured:>10.1f}d, "
          f"per cycle = {per_cycle:.4f}d, error = {error:.4f}d ({error/TRUE_VENUS_SYNODIC*100:.4f}%)")

print()
print("Key insight: timing one LONG span and dividing is more accurate")
print("than averaging many SHORT measurements, because the endpoint")
print("error is fixed regardless of the span length.")
print(f"\\n65 cycles (Dresden Codex): error < 0.03 days/cycle = 43 minutes")
print(f"This matches the documented Maya accuracy for Venus.")`,
      challenge: 'The Maya eclipse cycle spans 405 lunar months (11,960 days). If their endpoint timing error is ±0.5 days, what is their per-month error? Calculate the accuracy in hours. Compare this to the modern value of 29.53059 days — how close did the Maya get?',
      successHint: 'You\'ve discovered why ancient astronomers were so accurate despite primitive instruments: they traded time for precision. A 1-day error spread over 500 years of observation becomes negligible per cycle. The Central Limit Theorem and the long-baseline method are the statistical foundations of all precision measurement — from GPS satellites to gravitational wave detectors.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Orbital mechanics, eclipse geometry, and calendar mathematics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into orbital mechanics, eclipse prediction, Maya base-20 arithmetic, calendar algebra, and observational statistics.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
