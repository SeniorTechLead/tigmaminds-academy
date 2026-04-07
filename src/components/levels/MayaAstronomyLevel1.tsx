import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MayaAstronomyLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The Venus cycle — tracking the morning and evening star',
      concept: `Venus was the most important celestial object in Maya astronomy after the Sun. The Maya tracked Venus obsessively because its cycle governed warfare, rituals, and political decisions. The Dresden Codex — a surviving Maya manuscript — contains Venus tables accurate to within **2 hours over 481 years**.

Venus orbits the Sun faster than Earth. From our perspective, Venus appears to swing back and forth relative to the Sun, creating a repeating pattern called the **synodic period** — the time between successive appearances at the same position relative to the Sun as seen from Earth.

The cycle has four distinct phases:
1. **Evening star** (~263 days): Venus visible after sunset, moving away from the Sun
2. **Superior conjunction** (~50 days): Venus behind the Sun, invisible
3. **Morning star** (~263 days): Venus visible before sunrise
4. **Inferior conjunction** (~8 days): Venus between Earth and Sun, invisible

The full synodic period averages **583.92 days**. The Maya recorded it as **584 days** — an error of only 0.014%.

The synodic period comes from the orbital periods of Venus (224.7 days) and Earth (365.25 days):

**1/P_synodic = 1/P_venus - 1/P_earth**

📚 *The Maya discovered that 5 Venus cycles = 8 Earth years (5 × 584 = 2920, 8 × 365 = 2920). This 8-year resonance meant Venus returned to the same position in the sky on the same calendar date every 8 years — a pattern they used to verify their tables across generations.*`,
      analogy: 'Imagine two runners on a circular track — one fast (Venus), one slow (Earth). The fast runner laps the slow one periodically. Even though you only see the fast runner when they are on your side of the track, you can predict exactly when they will pass you next by knowing both speeds. The synodic period is the time between passes.',
      storyConnection: 'Maya astronomers at observatories like the Caracol at Chichén Itzá tracked Venus through narrow window slits aligned to its extreme rising and setting positions. The Dresden Codex Venus tables cover 65 synodic cycles (104 years) and include correction factors for accumulated error — showing the Maya understood that 584 days was an approximation.',
      checkQuestion: 'Using 1/P_synodic = 1/P_venus - 1/P_earth with P_venus = 224.7 days and P_earth = 365.25 days, what is the synodic period?',
      checkAnswer: '1/P = 1/224.7 - 1/365.25 = 0.004451 - 0.002738 = 0.001713. P = 1/0.001713 = 583.9 days. The Maya value of 584 days is off by only 0.1 days — 2.4 hours of error per cycle. Over 481 years (301 cycles), the total drift would be about 30 hours, and the Maya applied corrections to compensate.',
      codeIntro: 'Model the Venus synodic cycle — calculate phase durations, the 8-year resonance, and error accumulation over centuries.',
      code: `import numpy as np

# Orbital parameters (days)
P_venus = 224.701  # Venus orbital period
P_earth = 365.2422  # Earth orbital period (tropical year)

# Calculate synodic period from orbital mechanics
P_synodic = 1.0 / (1.0/P_venus - 1.0/P_earth)
print(f"=== Venus Synodic Period ===")
print(f"Venus orbital period: {P_venus} days")
print(f"Earth orbital period: {P_earth} days")
print(f"Calculated synodic period: {P_synodic:.4f} days")
print(f"Maya recorded value: 584 days")
print(f"Error: {abs(P_synodic - 584):.4f} days ({abs(P_synodic - 584)/P_synodic*100:.4f}%)\\\n")

# Phase breakdown of the Venus cycle
phases = [
    ("Evening star (visible after sunset)", 263),
    ("Superior conjunction (behind Sun)", 50),
    ("Morning star (visible before dawn)", 263),
    ("Inferior conjunction (between Earth/Sun)", 8),
]

print("=== Venus Cycle Phases ===")
total = 0
for name, days in phases:
    total += days
    bar = "█" * (days // 5)
    print(f"  {name:<42} {days:>3} days {bar}")
print(f"  {'Total':<42} {total:>3} days\\\n")

# The 8-year resonance
print("=== The 8-Year Resonance ===")
venus_cycles = 5 * 584
earth_years = 8 * 365
print(f"5 Venus cycles: 5 × 584 = {venus_cycles} days")
print(f"8 Earth years:  8 × 365 = {earth_years} days")
print(f"Exact match! Venus returns to the same sky position")
print(f"on the same calendar date every 8 years.\\\n")

# More precise check
precise_venus = 5 * P_synodic
precise_earth = 8 * P_earth
print(f"Precise 5 cycles: {precise_venus:.2f} days")
print(f"Precise 8 years:  {precise_earth:.2f} days")
print(f"Drift per 8 years: {abs(precise_venus - precise_earth):.2f} days\\\n")

# Error accumulation over centuries
print("=== Error Accumulation (Maya 584-day value) ===")
print(f"{'Cycles':>7} {'Years':>7} {'Maya total':>12} {'Actual total':>14} {'Drift':>8}")
print("-" * 52)
for n in [1, 5, 10, 65, 100, 301]:
    maya_total = n * 584
    actual_total = n * P_synodic
    drift = maya_total - actual_total
    years = actual_total / P_earth
    print(f"{n:>7} {years:>7.1f} {maya_total:>10,} d {actual_total:>12,.1f} d {drift:>+7.1f} d")

# Dresden Codex correction scheme
print(f"\\\n=== Dresden Codex Corrections ===")
print(f"The Maya did NOT simply use 584 days forever.")
print(f"The codex applies corrections at specific intervals:\\\n")

corrections = [
    (57, 584, -8, "After 57 cycles, subtract 8 days"),
    (5, 584, -4, "After next 5 cycles, subtract 4 days"),
    (3, 584, -4, "After next 3 cycles, subtract 4 days"),
]

running_cycles = 0
running_maya = 0
running_actual = 0
for cycles, base, correction, note in corrections:
    running_cycles += cycles
    running_maya += cycles * base + correction
    running_actual += cycles * P_synodic
    error = running_maya - running_actual
    print(f"  {note}")
    print(f"    Cumulative: {running_cycles} cycles, error = {error:+.1f} days\\\n")

print(f"With corrections, the Maya tables maintained accuracy")
print(f"of better than 1 day over centuries of predictions.")`,
      challenge: 'The Maya also tracked Mars (synodic period 779.94 days) and Jupiter (398.88 days). Calculate the synodic periods from their orbital periods (Mars: 686.97 days, Jupiter: 4332.59 days) and find any whole-number resonances similar to Venus\'s 5:8 ratio.',
      successHint: 'You derived the synodic period from orbital mechanics — the same formula used by NASA to plan spacecraft transfer orbits, by astronomers to predict planetary conjunctions, and by telescope operators to schedule observation windows. The Maya discovered this relationship through centuries of patient observation; you derived it from Kepler\'s laws.',
    },
    {
      title: 'The invention of zero — the Maya vigesimal number system',
      concept: `The Maya independently invented the concept of **zero** — one of the most important intellectual achievements in human history. Only three civilizations developed zero independently: the Babylonians (placeholder only), the Maya, and the Indians. The Maya zero was a **true zero** — a number, not just a placeholder.

The Maya used a **vigesimal** (base-20) number system, likely originating from counting on both fingers and toes. Digits were written using just three symbols:
- A **dot** = 1
- A **bar** = 5
- A **shell** = 0

Numbers 0-19 were composed from these symbols. For larger numbers, the Maya used **positional notation** — the same concept as our base-10 system, but with place values based on powers of 20:

| Position | Place value |
|----------|------------|
| 1st (bottom) | 1 (20⁰) |
| 2nd | 20 (20¹) |
| 3rd | 400 (20²) |
| 4th | 8,000 (20³) |
| 5th | 160,000 (20⁴) |

So the number written as 3.14.7 in Maya means: 3×400 + 14×20 + 7×1 = 1,200 + 280 + 7 = **1,487**.

📚 *Without zero, positional notation is impossible — you cannot distinguish 207 from 27 without a symbol for "nothing in this position." This is why zero was so revolutionary: it enabled compact representation of arbitrarily large numbers. The Maya calendar used numbers in the millions — impossible without positional zero.*`,
      analogy: 'Imagine a parking garage with 20 spaces per floor. To find car #1,487, you go to floor 3 (floors 0-2 are full = 3×400 = 1,200 cars below), then row 14 on that floor (14×20 = 280 more), then space 7. The Maya number 3.14.7 is literally a parking address — each digit tells you which level to look at. Without a "floor 0" concept, the whole system collapses.',
      storyConnection: 'Maya scribes carved enormous numbers into stone stelae to record calendar dates spanning millions of days. The Long Count date for the creation of the current world is 13.0.0.0.0, which represents 13×144,000 = 1,872,000 days. Writing such numbers required both zero and positional notation — technologies the Maya developed centuries before Europe adopted the Indian zero.',
      checkQuestion: 'Convert the Maya number 9.15.3.12 to decimal. Remember: positions from bottom are 1, 20, 400, 8,000.',
      checkAnswer: '9×8,000 + 15×400 + 3×20 + 12×1 = 72,000 + 6,000 + 60 + 12 = 78,072. The Maya could write this enormous number with just four symbols stacked vertically.',
      codeIntro: 'Build a Maya number converter — translate between decimal and vigesimal notation, and render numbers with Maya symbols.',
      code: `import numpy as np

def decimal_to_maya(n):
    """Convert a decimal number to Maya vigesimal notation."""
    if n == 0:
        return [0]
    digits = []
    remaining = n
    while remaining > 0:
        digits.append(remaining % 20)
        remaining //= 20
    return list(reversed(digits))

def maya_to_decimal(digits):
    """Convert Maya vigesimal digits to decimal."""
    result = 0
    for d in digits:
        result = result * 20 + d
    return result

def render_maya_digit(n):
    """Render a single Maya digit (0-19) using dots and bars."""
    if n == 0:
        return "  (shell) 𝟎  "
    bars = n // 5
    dots = n % 5
    parts = []
    if dots > 0:
        parts.append("  " + "● " * dots)
    for _ in range(bars):
        parts.append("  ━━━━━━━")
    return "\\\n".join(parts)

# Basic conversions
print("=== Maya Vigesimal Number System ===")
print(f"Base: 20 (fingers + toes)")
print(f"Symbols: ● (1), ━━━ (5), 𝟎 shell (0)\\\n")

print("=== Digits 0-19 ===")
for i in range(20):
    bars = i // 5
    dots = i % 5
    dot_str = "●" * dots if dots else ""
    bar_str = "━" * bars if bars else ""
    symbol = f"{dot_str} {'|' if dots and bars else ''} {bar_str}" if i > 0 else "𝟎 (shell)"
    print(f"  {i:>2} = {symbol.strip()}")

# Convert some numbers
print(f"\\\n=== Decimal → Maya Conversion ===")
test_numbers = [0, 19, 20, 42, 365, 584, 1872000, 7200]
for n in test_numbers:
    maya = decimal_to_maya(n)
    maya_str = ".".join(str(d) for d in maya)
    back = maya_to_decimal(maya)
    places = []
    for i, d in enumerate(reversed(maya)):
        pv = 20**i
        places.append(f"{d}×{pv:,}")
    expansion = " + ".join(reversed(places))
    print(f"  {n:>10,} = {maya_str:<15} = {expansion}")
    assert back == n, f"Conversion error: {back} != {n}"

# Place values
print(f"\\\n=== Maya Place Values ===")
for i in range(6):
    pv = 20**i
    print(f"  Position {i+1}: {pv:>10,} (20^{i})")

# Visual rendering of a number
print(f"\\\n=== Visual Rendering: 1,872,000 ===")
print(f"(The Long Count creation date: 13.0.0.0.0)\\\n")
maya = decimal_to_maya(1872000)
place_values = [20**i for i in range(len(maya)-1, -1, -1)]
for i, (digit, pv) in enumerate(zip(maya, place_values)):
    print(f"  Position {len(maya)-i} (×{pv:>7,}): {digit:>2}")
    print(f"    {render_maya_digit(digit)}")
    if i < len(maya) - 1:
        print(f"    {'─' * 14}")

# Compare with other number systems
print(f"\\\n=== Number System Comparison ===")
n = 7200
print(f"The number {n:,} in different bases:\\\n")
systems = [
    ("Binary (base 2)", 2),
    ("Octal (base 8)", 8),
    ("Decimal (base 10)", 10),
    ("Maya (base 20)", 20),
    ("Sexagesimal (base 60)", 60),
]
for name, base in systems:
    digits = []
    temp = n
    while temp > 0:
        digits.append(temp % base)
        temp //= base
    digits.reverse()
    digit_str = ".".join(str(d) for d in digits)
    print(f"  {name:<25} {digit_str:<20} ({len(digits)} digits)")

print(f"\\\nHigher bases need fewer digits — Maya base-20 is")
print(f"very compact. That's why they could carve huge numbers")
print(f"into stone monuments with relatively few symbols.")`,
      challenge: 'The Maya calendar system actually used a modified base-20 for the third position: instead of 20×20 = 400, the third place is 18×20 = 360 (closer to the number of days in a year). Modify the converter to handle this "modified vigesimal" system used in Long Count dates.',
      successHint: 'You built a base conversion system — the same mathematics that underpins all of computing. Binary (base 2) drives CPUs, hexadecimal (base 16) describes memory addresses, and base-64 encoding transmits images over the internet. The Maya vigesimal system proves that the concept of positional notation transcends any particular base.',
    },
    {
      title: 'Eclipse prediction — the 11,960-day cycle',
      concept: `The Maya discovered that solar eclipses follow a repeating pattern over **11,960 days** (approximately 32.7 years). This period contains exactly **405 lunations** (full Moon-to-full-Moon cycles) and brings the Moon back to the same position relative to the Sun and the lunar nodes.

A solar eclipse occurs when the Moon passes directly between the Earth and Sun. But because the Moon's orbit is tilted **5.14°** relative to Earth's orbit, eclipses only happen when the Sun is near a **lunar node** — one of the two points where the Moon's orbit crosses Earth's orbital plane.

Three conditions must align:
1. **New Moon** (Moon between Earth and Sun) — happens every 29.53 days
2. **Sun near a node** — the Sun passes each node every ~173.3 days (the **eclipse season**)
3. **Moon near the same node** — the Moon returns to a node every ~27.21 days (the **draconic month**)

The 11,960-day cycle works because:
- 405 × 29.53 = 11,959.7 days (lunations)
- 69 × 173.31 = 11,958.4 days (eclipse seasons)

Both line up nearly perfectly — so eclipses repeat at this interval.

📚 *The Maya eclipse tables in the Dresden Codex list 69 eclipse warnings over 11,960 days. Not all produce visible eclipses (some occur on the wrong side of Earth), but the tables tell priests when to watch for them. This is predictive astronomy — forecasting celestial events decades in advance.*`,
      analogy: 'Imagine two pendulums swinging at different speeds. Most of the time, they are out of sync. But at regular intervals, they briefly align — swinging through the same point at the same moment. The Moon\'s monthly cycle and the Sun\'s passage past the lunar nodes are the two pendulums; an eclipse is the moment of alignment.',
      storyConnection: 'The Dresden Codex eclipse table begins with a specific eclipse and lists 69 future eclipse windows, each separated by either 148 or 177 days (5 or 6 lunations). Maya astronomers accumulated these records over centuries, passing data from one generation to the next — the longest continuous astronomical observation program in the ancient world.',
      checkQuestion: 'If an eclipse occurs today, when is the next eclipse season (approximately)? Eclipse seasons occur every 173.3 days.',
      checkAnswer: 'The next eclipse season is in about 173.3 days (roughly 5 months and 23 days). But an eclipse will only occur if there is also a new Moon within about ±18 days of this date. On average, about 2-3 eclipse seasons per year produce at least one eclipse somewhere on Earth.',
      codeIntro: 'Model the eclipse prediction cycle — calculate when lunar nodes, new Moons, and eclipse seasons align.',
      code: `import numpy as np

# Fundamental astronomical periods (days)
SYNODIC_MONTH = 29.53059  # new Moon to new Moon
DRACONIC_MONTH = 27.21222  # node to node
ECLIPSE_YEAR = 346.6201   # Sun returns to same node
ECLIPSE_SEASON = 173.3100  # Sun passes a node

print("=== Fundamental Eclipse Periods ===")
print(f"Synodic month (new Moon cycle): {SYNODIC_MONTH:.5f} days")
print(f"Draconic month (node cycle):    {DRACONIC_MONTH:.5f} days")
print(f"Eclipse year (node-to-node):    {ECLIPSE_YEAR:.4f} days")
print(f"Eclipse season (half):          {ECLIPSE_SEASON:.4f} days\\\n")

# The Maya 11,960-day cycle
maya_cycle = 11960
lunations = maya_cycle / SYNODIC_MONTH
eclipse_seasons = maya_cycle / ECLIPSE_SEASON
draconic_months = maya_cycle / DRACONIC_MONTH

print("=== The Maya 11,960-Day Cycle ===")
print(f"Duration: {maya_cycle:,} days = {maya_cycle/365.2422:.1f} years")
print(f"Lunations: {lunations:.2f} (≈ {round(lunations)} synodic months)")
print(f"Eclipse seasons: {eclipse_seasons:.2f} (≈ {round(eclipse_seasons)})")
print(f"Draconic months: {draconic_months:.2f} (≈ {round(draconic_months)})\\\n")

# Check the cycle accuracy
lunar_drift = (405 * SYNODIC_MONTH) - maya_cycle
node_drift = (69 * ECLIPSE_SEASON) - maya_cycle
print(f"Lunar alignment error: {lunar_drift:+.2f} days per cycle")
print(f"Node alignment error:  {node_drift:+.2f} days per cycle")
print(f"Both < 2 days over 32.7 years — remarkably precise.\\\n")

# Simulate eclipse windows
print("=== Eclipse Window Simulation ===")
print("An eclipse can occur when the Sun is within ±18 days of a node")
print("AND a new Moon falls within that window.\\\n")

eclipse_limit = 18  # days from node for eclipse possibility
eclipses_found = []
node_tolerance = eclipse_limit

for month_num in range(405):  # 405 lunations in one Maya cycle
    new_moon_day = month_num * SYNODIC_MONTH
    # Find closest node passage
    nearest_season = round(new_moon_day / ECLIPSE_SEASON)
    node_day = nearest_season * ECLIPSE_SEASON
    distance_from_node = abs(new_moon_day - node_day)

    if distance_from_node < node_tolerance:
        eclipses_found.append({
            'day': new_moon_day,
            'month': month_num,
            'node_dist': distance_from_node,
            'likely': distance_from_node < 10
        })

print(f"Eclipse windows found: {len(eclipses_found)}")
print(f"High-probability eclipses: {sum(1 for e in eclipses_found if e['likely'])}")

# Show first 15 eclipse windows
print(f"\\\n{'#':>3} {'Day':>8} {'Year':>6} {'Node dist':>10} {'Probability'}")
print("-" * 42)
for i, e in enumerate(eclipses_found[:15]):
    year = e['day'] / 365.2422
    prob = "HIGH" if e['likely'] else "possible"
    bar = "█" * int((eclipse_limit - e['node_dist']) / eclipse_limit * 10)
    print(f"{i+1:>3} {e['day']:>8.1f} {year:>6.2f} {e['node_dist']:>8.1f} d  {prob:<8} {bar}")

print(f"  ... ({len(eclipses_found)} total windows over {maya_cycle/365.2422:.1f} years)")

# Compare with the Saros cycle (known to Babylonians)
saros = 6585.32  # days
print(f"\\\n=== Comparison: Maya vs Saros Cycle ===")
print(f"{'':>20} {'Maya':>12} {'Saros':>12}")
print("-" * 46)
print(f"{'Duration (days)':<20} {maya_cycle:>12,} {saros:>12,.2f}")
print(f"{'Duration (years)':<20} {maya_cycle/365.2422:>12.1f} {saros/365.2422:>12.1f}")
print(f"{'Lunations':<20} {405:>12} {223:>12}")
print(f"{'Eclipse seasons':<20} {69:>12} {38:>12}")
print(f"{'Lunar drift':<20} {lunar_drift:>+11.2f}d {(223*SYNODIC_MONTH-saros):>+11.2f}d")

saros_node = (38 * ECLIPSE_SEASON) - saros
print(f"{'Node drift':<20} {node_drift:>+11.2f}d {saros_node:>+11.2f}d")
print(f"\\\nBoth civilizations found the same phenomenon independently.")
print(f"The Maya cycle is longer but covers more eclipses per cycle.")`,
      challenge: 'A total solar eclipse was visible from Maya territory on July 11, 1991. Using the Maya 11,960-day cycle, calculate when the Maya would have predicted the previous and next eclipses in this series. Check against historical records — were eclipses actually recorded near those dates?',
      successHint: 'You modeled orbital mechanics and resonance cycles — the same mathematics NASA uses to predict eclipses centuries ahead, plan satellite orbits to avoid Earth\'s shadow, and design observation schedules for space telescopes. The Maya achieved this with naked-eye observations and arithmetic; you achieved it with code and the same underlying physics.',
    },
    {
      title: 'Calendar accuracy — measuring the year to five decimal places',
      concept: `The Maya Haab calendar uses a year length of **365 days** (18 months of 20 days + 5 "unlucky" days). But Maya astronomers knew this was not exact. Through centuries of observation, they calculated a refined year length that we can infer from their correction tables: approximately **365.2420 days**.

Compare this with other historical calendars:
- **Egyptian**: 365.0000 days (no corrections — drifted 1 day every 4 years)
- **Julian** (46 BC): 365.2500 days (leap year every 4 years)
- **Maya** (~400 AD): 365.2420 days (correction tables in codices)
- **Gregorian** (1582 AD): 365.2425 days (leap year rules refined)
- **Actual tropical year**: 365.2422 days

The Maya value is accurate to **0.0002 days per year** — only 17 seconds off. The Gregorian calendar, introduced over 1,000 years later, is accurate to 0.0003 days — actually *slightly less* accurate than the Maya value.

Calendar drift accumulates: a small annual error becomes days over centuries and months over millennia. The Julian calendar drifted 13 days by 1582, prompting Pope Gregory XIII to reform it. The Egyptian calendar drifted an entire season over 1,460 years.

📚 *The Maya achieved this precision without telescopes, clocks, or decimal arithmetic. Their method: observe the same astronomical event (solstice, equinox, zenith passage) repeatedly over centuries, count the days between observations, and divide. With enough time, even small errors average out.*`,
      analogy: 'Imagine timing a race with a stopwatch that only shows whole seconds. Time one lap and you get "60 seconds" — not very precise. Time 100 laps and get "5,983 seconds" — now you know each lap is 59.83 seconds, precise to hundredths. The Maya did exactly this: they timed not one year but hundreds, making the total error a tiny fraction of the accumulated time.',
      storyConnection: 'Maya astronomers at sites like Uaxactún built specialized observation buildings. Building E-VII-Sub has three temples aligned so that the Sun rises directly over the left temple on the summer solstice, over the center on equinoxes, and over the right on the winter solstice. By recording these dates over centuries, they refined the year length to extraordinary precision.',
      checkQuestion: 'If the Julian calendar drifts by 0.0078 days per year (365.25 - 365.2422), how many days has it drifted since Julius Caesar introduced it in 46 BC (assume current year is 2025 AD)?',
      checkAnswer: '2025 + 46 = 2,071 years. Drift = 2,071 × 0.0078 = 16.15 days. By 1582 (Gregorian reform), the drift was about (1582 + 46) × 0.0078 = 12.7 days — which is why Gregory XIII dropped 10 days (the remainder had been corrected earlier). The current Julian-Gregorian difference is 13 days.',
      codeIntro: 'Compare calendar systems — calculate drift over millennia and see why tiny annual errors become major problems.',
      code: `import numpy as np

# Calendar year lengths (days)
ACTUAL_YEAR = 365.24220  # tropical year

calendars = {
    "Egyptian":   365.00000,
    "Julian":     365.25000,
    "Maya":       365.24200,
    "Gregorian":  365.24250,
    "Actual":     ACTUAL_YEAR,
}

print("=== Calendar Year Lengths ===")
print(f"{'Calendar':<12} {'Year length':>12} {'Error/year':>12} {'Error (seconds)':>16}")
print("-" * 55)
for name, length in calendars.items():
    error = length - ACTUAL_YEAR
    seconds = error * 86400
    print(f"{name:<12} {length:>12.5f} {error:>+12.5f} {seconds:>+14.1f} s")

# Drift over centuries
print(f"\\\n=== Calendar Drift Over Time ===")
print(f"Starting from a perfectly aligned calendar...\\\n")
print(f"{'Year span':>12}", end="")
for name in calendars:
    if name != "Actual":
        print(f" {name:>10}", end="")
print()
print("-" * 55)

for years in [10, 50, 100, 500, 1000, 2000, 5000, 10000]:
    print(f"{years:>10} yr", end="")
    for name, length in calendars.items():
        if name != "Actual":
            drift = (length - ACTUAL_YEAR) * years
            print(f" {drift:>+9.1f}d", end="")
    print()

# The Gregorian reform
print(f"\\\n=== The Gregorian Reform (1582 AD) ===")
julian_years = 1582 + 46  # from 46 BC to 1582 AD
julian_drift = (365.25 - ACTUAL_YEAR) * julian_years
print(f"Julian calendar used for {julian_years} years")
print(f"Accumulated drift: {julian_drift:.1f} days")
print(f"Gregory XIII dropped 10 days (Oct 4 → Oct 15, 1582)")
print(f"and added leap year exceptions:\\\n")

print(f"Leap year rules comparison:")
print(f"  Julian:    every 4 years (no exceptions)")
print(f"  Gregorian: every 4 years EXCEPT centuries,")
print(f"             UNLESS divisible by 400")
print(f"  Example: 1900 = not leap, 2000 = leap, 2100 = not leap\\\n")

# How many leap years in different systems?
def count_leaps(start, end, system):
    count = 0
    for y in range(start, end):
        if system == "julian":
            if y % 4 == 0:
                count += 1
        elif system == "gregorian":
            if y % 4 == 0 and (y % 100 != 0 or y % 400 == 0):
                count += 1
    return count

span_start, span_end = 2000, 2400
jul_leaps = count_leaps(span_start, span_end, "julian")
greg_leaps = count_leaps(span_start, span_end, "gregorian")
print(f"Leap years from {span_start}-{span_end}:")
print(f"  Julian:    {jul_leaps} leap years")
print(f"  Gregorian: {greg_leaps} leap years")
print(f"  Difference: {jul_leaps - greg_leaps} fewer = 3 days less drift\\\n")

# Maya precision analysis
print(f"=== Maya Precision: How Did They Do It? ===")
print(f"Method: count days between identical astronomical events\\\n")

observations = [50, 100, 200, 500, 1000]
true_year = ACTUAL_YEAR

for n_years in observations:
    total_days = n_years * true_year
    # Simulating integer-day counting (can't measure fractional days)
    counted_days = round(total_days)
    derived_year = counted_days / n_years
    error = abs(derived_year - true_year)
    print(f"  {n_years:>4} years observed: {counted_days:>7,} days counted")
    print(f"    Derived year = {derived_year:.5f} (error: {error:.5f} days)\\\n")

print(f"With ~500+ years of records, Maya astronomers could")
print(f"determine the year length to ±0.0002 days — matching")
print(f"the precision of the Gregorian reform 1,000 years later.")`,
      challenge: 'Design a "Maya-style" leap year rule for a vigesimal calendar. If the year is 365.2420 days, how often would you need to add a leap day to keep the calendar aligned? Compare the drift of your rule against the Gregorian rule over 10,000 years.',
      successHint: 'You analyzed precision measurement and error accumulation — fundamental concepts in metrology (the science of measurement). The same principles apply to atomic clocks (drift of 1 second per 300 million years), GPS timing (nanosecond precision required), and climate records (calibrating temperature measurements across centuries).',
    },
    {
      title: 'The Long Count — converting between Maya and Gregorian dates',
      concept: `The Maya Long Count is one of the most sophisticated date-keeping systems ever devised. It counts days from a fixed starting point — August 11, 3114 BC (or August 13, depending on the correlation used) — and expresses any date as five numbers:

**Baktun.Katun.Tun.Uinal.Kin**

Each position uses a modified vigesimal system:
- **1 Kin** = 1 day
- **1 Uinal** = 20 Kin = 20 days
- **1 Tun** = 18 Uinal = 360 days (≈ 1 year)
- **1 Katun** = 20 Tun = 7,200 days (≈ 19.7 years)
- **1 Baktun** = 20 Katun = 144,000 days (≈ 394.3 years)

Note the exception: the third position counts to 18 (not 20), making a Tun close to a solar year — a practical concession to astronomy.

The "2012 phenomenon" came from the Long Count date **13.0.0.0.0** — the completion of 13 Baktuns (1,872,000 days = 5,125.36 years from the start date). This fell on **December 21, 2012**. Some claimed this was the "end of the Maya calendar," but it was simply the end of one cycle — like an odometer rolling over from 99,999 to 100,000. Maya inscriptions reference dates far beyond 13.0.0.0.0, proving they did not consider it an endpoint.

📚 *The Long Count is conceptually similar to the Julian Day Number used in modern astronomy — a continuous count of days from a fixed epoch. Astronomers use Julian Day Numbers to avoid the complexity of calendar systems when computing time intervals. The Maya had the same idea 2,000 years earlier.*`,
      analogy: 'The Long Count is like a car odometer. When it hits 100,000 miles, the digits roll over to 000,000 — but the car does not stop existing. Similarly, 13.0.0.0.0 is an odometer moment for the Maya calendar, not an apocalypse. And just as your odometer measures total distance from when the car was made, the Long Count measures total days from the Maya creation date.',
      storyConnection: 'The stela at Quiriguá in Guatemala records a Long Count date of 13.0.0.0.0 4 Ahau 8 Cumku — the mythological creation date when the gods set the current world in motion. Maya kings carved Long Count dates on monuments to place their reigns within the vast sweep of cosmic time, connecting their authority to the gods who created the calendar itself.',
      checkQuestion: 'Convert the Long Count date 9.15.0.0.0 to a total day count from the Maya epoch.',
      checkAnswer: '9×144,000 + 15×7,200 + 0×360 + 0×20 + 0×1 = 1,296,000 + 108,000 = 1,404,000 days. This corresponds to approximately August 18, 731 AD — the height of the Classic Maya period.',
      codeIntro: 'Build a Maya Long Count converter — translate dates between the Long Count, day counts, and the Gregorian calendar.',
      code: `import numpy as np

# Long Count place values
KIN = 1
UINAL = 20
TUN = 360        # 18 × 20 (modified vigesimal)
KATUN = 7200     # 20 × 360
BAKTUN = 144000  # 20 × 7200

# GMT correlation constant (most widely accepted)
# Julian Day Number of the Maya epoch (Aug 11, 3114 BC)
GMT_CORRELATION = 584283

def long_count_to_days(baktun, katun, tun, uinal, kin):
    """Convert Long Count date to total days since Maya epoch."""
    return (baktun * BAKTUN + katun * KATUN +
            tun * TUN + uinal * UINAL + kin * KIN)

def days_to_long_count(total_days):
    """Convert total days to Long Count components."""
    remaining = total_days
    baktun = remaining // BAKTUN; remaining %= BAKTUN
    katun = remaining // KATUN; remaining %= KATUN
    tun = remaining // TUN; remaining %= TUN
    uinal = remaining // UINAL; remaining %= UINAL
    kin = remaining
    return (baktun, katun, tun, uinal, kin)

def lc_to_string(lc):
    return ".".join(str(x) for x in lc)

def days_to_julian_day(maya_days):
    """Convert Maya day count to Julian Day Number."""
    return maya_days + GMT_CORRELATION

def julian_day_to_gregorian(jd):
    """Convert Julian Day Number to Gregorian calendar date."""
    # Algorithm from Meeus, Astronomical Algorithms
    jd = jd + 0.5
    z = int(jd)
    a = z
    if z >= 2299161:
        alpha = int((z - 1867216.25) / 36524.25)
        a = z + 1 + alpha - alpha // 4
    b = a + 1524
    c = int((b - 122.1) / 365.25)
    d = int(365.25 * c)
    e = int((b - d) / 30.6001)
    day = b - d - int(30.6001 * e)
    month = e - 1 if e < 14 else e - 13
    year = c - 4716 if month > 2 else c - 4715
    return (year, month, day)

def gregorian_to_julian_day(year, month, day):
    """Convert Gregorian date to Julian Day Number."""
    if month <= 2:
        year -= 1
        month += 12
    a = year // 100
    b = 2 - a + a // 4
    return int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + b - 1524.5

# Print Long Count place values
print("=== Long Count Place Values ===")
places = [("Kin", KIN), ("Uinal", UINAL), ("Tun", TUN),
          ("Katun", KATUN), ("Baktun", BAKTUN)]
for name, val in places:
    years = val / 365.2422
    print(f"  1 {name:<8} = {val:>8,} days ({years:>8.2f} years)")

# Convert famous Long Count dates
print(f"\\\n=== Famous Maya Long Count Dates ===\\\n")
famous_dates = [
    ((13, 0, 0, 0, 0), "Creation date (Maya epoch)"),
    ((8, 14, 3, 1, 12), "Earliest known Long Count inscription"),
    ((9, 0, 0, 0, 0), "Start of Classic Period"),
    ((9, 15, 0, 0, 0), "Height of Classic Maya"),
    ((9, 17, 0, 0, 0), "Peak of Palenque (Pakal's era)"),
    ((10, 4, 0, 0, 0), "Classic Maya collapse begins"),
    ((13, 0, 0, 0, 0), "2012 'end of cycle' (13 Baktuns)"),
]

print(f"{'Long Count':<16} {'Days':>10} {'Gregorian':>15} {'Event'}")
print("-" * 65)
for lc, event in famous_dates:
    days = long_count_to_days(*lc)
    jd = days_to_julian_day(days)
    year, month, day = julian_day_to_gregorian(jd)
    era = "BC" if year <= 0 else "AD"
    display_year = abs(year) + (1 if year <= 0 else 0)
    months = ["", "Jan","Feb","Mar","Apr","May","Jun",
              "Jul","Aug","Sep","Oct","Nov","Dec"]
    greg = f"{months[month]} {day}, {display_year} {era}"
    print(f"{lc_to_string(lc):<16} {days:>10,} {greg:>15} {event}")

# Convert today's date to Long Count
print(f"\\\n=== Today in the Long Count ===")
today_jd = gregorian_to_julian_day(2026, 4, 5)
today_maya_days = int(today_jd - GMT_CORRELATION)
today_lc = days_to_long_count(today_maya_days)
print(f"Gregorian: April 5, 2026 AD")
print(f"Julian Day: {today_jd:.1f}")
print(f"Maya day count: {today_maya_days:,}")
print(f"Long Count: {lc_to_string(today_lc)}")

# The 2012 myth
print(f"\\\n=== The 2012 Myth: Debunked ===")
cycle_13 = long_count_to_days(13, 0, 0, 0, 0)
jd_2012 = days_to_julian_day(cycle_13)
y, m, d = julian_day_to_gregorian(jd_2012)
print(f"13.0.0.0.0 = {cycle_13:,} days = Dec 21, 2012")
print(f"\\\nThis is NOT the end of the calendar:")
print(f"  13.0.0.0.1 = Dec 22, 2012 (the next day)")
print(f"  14.0.0.0.0 = {long_count_to_days(14,0,0,0,0):,} days")
jd_14 = days_to_julian_day(long_count_to_days(14, 0, 0, 0, 0))
y14, m14, d14 = julian_day_to_gregorian(jd_14)
print(f"             = {['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m14]} {d14}, {y14} AD")
print(f"\\\nMaya inscriptions at Palenque reference dates like")
print(f"1.0.0.0.0.0.0.0 — a 20-Baktun cycle. They clearly")
print(f"did not think the calendar ended at 13.0.0.0.0.")`,
      challenge: 'Calculate your own birthday in the Maya Long Count. Then find the next "round" Long Count date (one where the last three positions are all zero, like X.Y.0.0.0) and calculate what Gregorian date that falls on.',
      successHint: 'You built a calendar conversion system — the same challenge faced by historians, archaeologists, and software engineers. Date conversion between calendar systems is notoriously tricky (time zones, leap years, epoch differences), and it\'s a core function of every database, operating system, and programming language. The Maya Long Count, with its fixed epoch and continuous day count, is actually simpler and more elegant than the Gregorian system.',
    },
    {
      title: 'Naked-eye precision — how patience defeats technology',
      concept: `The Maya achieved measurements rivaling early telescopic astronomy — using nothing but their eyes, counting systems, and centuries of patience. The key insight is that **measurement precision improves with the square root of the number of observations**.

If a single observation has an uncertainty of ±σ, the average of N independent observations has uncertainty ±σ/√N. This is the **Central Limit Theorem** in action — one of the most important results in statistics.

For the Maya:
- A single solstice observation: ±1-2 days uncertainty (hard to tell exact day)
- Average of 100 solstice observations: ±0.1-0.2 days uncertainty
- Average of 1,000 observations over centuries: ±0.03-0.06 days uncertainty

This explains their extraordinary calendar precision. The tropical year is 365.2422 days. To measure this to ±0.0002 days, you need:
- Single observation error: ~±1 day
- Required improvement: 5,000×
- Observations needed: 5,000² = 25,000,000? No — you need 25 million *independent* single-day measurements, OR just **~500 years** of tracking annual events (each year gives one independent measurement, and 1/√500 ≈ 0.045 days).

📚 *This principle — averaging to reduce error — is universal. It's why clinical trials need many patients, why opinion polls survey thousands, why GPS averages multiple satellite signals, and why astronomical surveys photograph the same star field hundreds of times. The Maya understood this empirically long before the mathematics was formalized.*`,
      analogy: 'Ask one person to guess the number of jelly beans in a jar — they might be off by 200. Ask 100 people and average their guesses — the average is usually within 20 of the true count. Ask 10,000 people and the average is within 2. Each individual is noisy, but the collective is precise. Maya astronomers were a collective spread across centuries.',
      storyConnection: 'Maya observatories were multi-generational institutions. An astronomer at Copán in 500 AD inherited records from predecessors going back centuries. Each generation added observations, refined tables, and corrected errors. The result was a cumulative precision no single lifetime could achieve — the original "standing on the shoulders of giants."',
      checkQuestion: 'If one solstice observation has ±1 day uncertainty, how many years of observations are needed to determine the year length to ±0.01 days?',
      checkAnswer: 'σ/√N = 0.01, so √N = 1/0.01 = 100, so N = 10,000. That\'s 10,000 years! But we can be cleverer: instead of measuring one year at a time, measure the interval between observations 100 years apart. Now each measurement spans 100 years, so ±1 day / 100 = ±0.01 days per year. With just a few such long-baseline measurements, you reach ±0.001 days. This is what the Maya actually did — long baselines, not many short ones.',
      codeIntro: 'Model how averaging observations reduces error — and show why the Maya needed centuries, not millennia.',
      code: `import numpy as np

np.random.seed(42)

TRUE_YEAR = 365.24220  # actual tropical year length

print("=== The Central Limit Theorem in Astronomy ===")
print(f"True tropical year: {TRUE_YEAR} days\\\n")

# Simulate individual observations with noise
def simulate_observations(n_obs, single_error_std=1.0):
    """Simulate measuring the year length n times."""
    measurements = np.random.normal(TRUE_YEAR, single_error_std, n_obs)
    return measurements

# Show how averaging improves precision
print("=== Method 1: Average Many Single-Year Measurements ===")
print(f"Each observation: ±1.0 day uncertainty\\\n")
print(f"{'Observations':>14} {'Mean':>12} {'Std Error':>10} {'Error':>10} {'Improvement'}")
print("-" * 60)

for n in [1, 5, 10, 25, 50, 100, 250, 500, 1000]:
    obs = simulate_observations(n, single_error_std=1.0)
    mean = np.mean(obs)
    std_err = np.std(obs) / np.sqrt(n)
    error = abs(mean - TRUE_YEAR)
    improvement = 1.0 / np.sqrt(n)
    print(f"{n:>14} {mean:>12.5f} {std_err:>10.5f} {error:>10.5f} {improvement:>10.4f}×")

# The long-baseline method (what Maya actually used)
print(f"\\\n=== Method 2: Long-Baseline Measurement (Maya Method) ===")
print(f"Instead of measuring one year at a time, measure the")
print(f"interval between events MANY years apart.\\\n")

def long_baseline_measurement(baseline_years, obs_error=1.0):
    """
    Measure year length by timing events far apart.
    Error in each event timing: ±obs_error days
    Year length = interval / baseline_years
    """
    # Two observations, each with error
    start_error = np.random.normal(0, obs_error)
    end_error = np.random.normal(0, obs_error)
    actual_interval = baseline_years * TRUE_YEAR
    measured_interval = actual_interval + end_error - start_error
    derived_year = measured_interval / baseline_years
    return derived_year

print(f"{'Baseline':>10} {'Derived year':>14} {'Error':>12} {'Error (sec)':>12}")
print("-" * 52)

for baseline in [1, 5, 10, 25, 50, 100, 200, 500, 1000]:
    # Average multiple baseline measurements
    results = [long_baseline_measurement(baseline) for _ in range(20)]
    mean_year = np.mean(results)
    error = abs(mean_year - TRUE_YEAR)
    error_sec = error * 86400
    print(f"{baseline:>8} yr {mean_year:>14.5f} {error:>11.5f} d {error_sec:>10.1f} s")

# Monte Carlo: required observation time for target precision
print(f"\\\n=== How Long to Reach Maya Precision? ===")
print(f"Target: ±0.0002 days (Maya achieved this)\\\n")

target = 0.0002
n_trials = 1000

for baseline in [50, 100, 200, 300, 500]:
    errors = []
    for _ in range(n_trials):
        # 5 independent baseline measurements, averaged
        measurements = [long_baseline_measurement(baseline) for _ in range(5)]
        mean = np.mean(measurements)
        errors.append(abs(mean - TRUE_YEAR))
    median_error = np.median(errors)
    success_rate = np.mean([e < target for e in errors])
    bar = "█" * int(success_rate * 20)
    print(f"  {baseline:>3}-year baseline, 5 measurements:")
    print(f"    Median error: {median_error:.5f} days")
    print(f"    Achieves target: {success_rate:.0%} of the time {bar}\\\n")

# Comparison: naked eye vs early telescopes
print(f"=== Naked Eye vs Early Telescopes ===")
print(f"{'Method':<30} {'Year length':>12} {'Error':>10} {'Era'}")
print("-" * 60)
comparisons = [
    ("Egyptian (no correction)", 365.00000, "~3000 BC"),
    ("Babylonian", 365.25000, "~500 BC"),
    ("Hipparchus (Greek)", 365.24667, "~130 BC"),
    ("Maya astronomers", 365.24200, "~400 AD"),
    ("Al-Battani (Islamic)", 365.24220, "~900 AD"),
    ("Copernicus (telescope era)", 365.24270, "1543 AD"),
    ("Gregorian reform", 365.24250, "1582 AD"),
    ("Modern value", TRUE_YEAR, "present"),
]

for name, value, era in comparisons:
    error = abs(value - TRUE_YEAR)
    print(f"  {name:<28} {value:>12.5f} {error:>10.5f} {era}")

print(f"\\\nThe Maya value (365.24200) is MORE accurate than")
print(f"Copernicus (365.24270) who had telescopes!")
print(f"\\\nLesson: patience + systematic records can rival")
print(f"or exceed technology. Precision is about method,")
print(f"not just instruments.")`,
      challenge: 'Simulate 500 years of a Maya observatory: each year, an astronomer records the solstice day with ±1 day error. At each generation (every 50 years), compute the running best estimate of the year length. Plot how the estimate converges toward the true value over centuries. At what generation does it first achieve ±0.001-day precision?',
      successHint: 'You demonstrated the Central Limit Theorem — one of the pillars of statistics and data science. This principle drives everything from medical research (clinical trials need large samples) to machine learning (more training data = better models) to financial risk management (diversification reduces portfolio variance). The Maya were empirical statisticians, achieving through centuries of patience what we now derive from mathematical theory.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Maya astronomy and naked-eye precision through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model Venus cycles, vigesimal arithmetic, eclipse prediction, calendar accuracy, Long Count dates, and statistical precision.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
