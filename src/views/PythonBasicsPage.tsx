import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, ChevronRight, CheckCircle, Circle, Code2, Sparkles, ArrowLeft } from 'lucide-react';
import MiniLesson from '../components/MiniLesson';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePyodide } from '../contexts/PyodideContext';
import { useBasicsProgress } from '../contexts/BasicsProgressContext';
import {
  PrintDiagram, VariableDiagram, ListDiagram, LoopDiagram,
  ConditionalDiagram, FunctionDiagram, NumpyDiagram, PlotDiagram,
} from '../components/diagrams/PythonBasicsDiagrams';

const lessons = [
  {
    title: 'Your first program — talking to the computer',
    concept: `Every program starts the same way: you write an instruction, and the computer follows it. The most basic instruction is **print** — it tells the computer to display something on screen.

Think of \`print()\` as raising your hand and saying something out loud. Whatever you put inside the parentheses, Python will show it to you.

[diagram]

Text must go inside **quotes** — either single quotes \`'hello'\` or double quotes \`"hello"\`. Without quotes, Python thinks you're referring to a variable (we'll learn about those next).

You can print multiple things by separating them with commas: \`print("My name is", "Tara")\` — Python adds a space between them automatically.`,
    analogy: 'print() is like a parrot. You tell it what to say (in quotes), and it repeats it back exactly. No quotes? The parrot gets confused — it does not know the word, only what you put in quotes.',
    storyConnection: 'In "The Girl Who Spoke to Elephants," Tara learned to communicate with elephants through sounds. Your first Python program communicates with you the same way — through text output. Every scientist, engineer, and programmer started exactly here: making the computer say hello.',
    codeIntro: 'Write your first Python program. Make the computer talk to you.',
    code: `# Your very first Python program!
# Lines starting with # are comments — Python ignores them.
# They are notes for humans reading the code.

print("Hello, world!")
print("My name is Python.")

# You can print numbers too — no quotes needed for numbers
print(42)
print(3.14)

# Print multiple things with commas
print("A banyan tree can live for", 500, "years!")

# Try changing the text inside the quotes and running again!
print("The honey hunter found", 3, "hives today.")`,
    challenge: 'Change the messages to introduce yourself. Print your name, your age, and your favorite animal — each on its own line.',
    successHint: 'You just wrote working code. Every app, game, and website started with someone typing exactly this kind of instruction.',
  },
  {
    title: 'Variables — giving names to things',
    concept: `A **variable** is a name that stores a value. Think of it as a labeled box: you put something in, and later you can use the label to get it back.

[diagram]

\`\`\`
name = "Kavitha"
age = 14
height = 1.55
\`\`\`

The \`=\` sign means "store this value in this name." It does NOT mean "equals" in the math sense — it means **assignment**.

Python figures out the **type** automatically:
- \`"Kavitha"\` — text (called a **string**)
- \`14\` — whole number (called an **integer**)
- \`1.55\` — decimal number (called a **float**)

You can update a variable: \`age = age + 1\` takes the old value (14), adds 1, and stores 15 back into \`age\`.`,
    analogy: 'Variables are like the name tags on jars in a kitchen. The jar labeled "sugar" holds sugar. You can empty it and put salt in instead — the label stays, the contents change. In Python, the variable name stays, but you can change what it holds.',
    storyConnection: 'In "The Fisherman\'s Daughter and the Storm," Kavitha recorded measurements — wind speed, water height, barometric pressure. Each measurement is a variable: \`wind_speed = 85\`, \`water_height = 3.2\`. Without variables, you would have to remember every number. Variables let the computer remember for you.',
    codeIntro: 'Create variables to describe a tree, then use them in calculations.',
    code: `# Variables store values with meaningful names
tree_name = "Great Banyan of Kamakhya"
age_years = 420
height_meters = 23.5
pillar_roots = 185

# Use variables in print statements
print("Tree:", tree_name)
print("Age:", age_years, "years")
print("Height:", height_meters, "meters")
print("Pillar roots:", pillar_roots)

# Do math with variables
age_decades = age_years / 10
print("That is", age_decades, "decades!")

# Update a variable
pillar_roots = pillar_roots + 3  # three new roots this year
print("After this year:", pillar_roots, "roots")

# Combine text with + (only works with strings)
greeting = "Welcome to " + tree_name + "!"
print(greeting)`,
    challenge: 'Create variables for a bee colony: queen_eggs_per_day = 1500, worker_lifespan_days = 42, colony_size = 40000. Calculate how many new workers are born per day (eggs * 0.85 survival rate) and whether the colony is growing or shrinking.',
    successHint: 'Variables are the foundation of all programming. Every app you use — Instagram, Google Maps, your calculator — stores its data in variables.',
  },
  {
    title: 'Lists — storing many things together',
    concept: `A **list** holds multiple values in order, inside square brackets:

\`\`\`
heights = [2.1, 3.5, 5.0, 4.2, 6.1]
animals = ["elephant", "tiger", "rhino"]
\`\`\`

[diagram]

Each item has a position called an **index**, starting from **0** (not 1!):
- \`animals[0]\` is \`"elephant"\`
- \`animals[1]\` is \`"tiger"\`
- \`animals[2]\` is \`"rhino"\`

You can:
- Add items: \`animals.append("deer")\`
- Check length: \`len(animals)\` returns 4
- Get the last item: \`animals[-1]\` returns \`"deer"\`

Lists are essential because real data is always a collection: a year of temperatures, a colony's population each month, the heights of 100 trees.`,
    analogy: 'A list is like a numbered shelf in a library. Shelf 0 has the first book, shelf 1 has the second, and so on. You can add books to the end, count how many you have, or grab any book by its shelf number.',
    storyConnection: 'The honey hunter visits multiple hives over a season. Each hive produces a different amount of honey: [12, 8, 15, 6, 20] kilograms. A list is the natural way to record this — one variable holding many measurements.',
    codeIntro: 'Use lists to track bee colony data over several months.',
    code: `# A list of monthly honey production (kg)
honey_kg = [12, 8, 15, 6, 20, 18, 14]
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

print("Honey production by month:")
print(honey_kg)

# Access individual items (indexing starts at 0!)
print("January production:", honey_kg[0], "kg")
print("July production:", honey_kg[6], "kg")
print("Last month:", honey_kg[-1], "kg")  # -1 means last

# Useful operations
print("Total months:", len(honey_kg))
print("Total honey:", sum(honey_kg), "kg")
print("Best month:", max(honey_kg), "kg")
print("Worst month:", min(honey_kg), "kg")
print("Average:", sum(honey_kg) / len(honey_kg), "kg/month")

# Add a new month
honey_kg.append(16)
months.append("Aug")
print("After August:", honey_kg)

# Slicing — get a range
spring = honey_kg[2:5]  # March, April, May (index 2,3,4)
print("Spring production:", spring)`,
    challenge: 'Create a list of 7 daily temperatures for a week in Ziro Valley: [12, 14, 11, 15, 13, 10, 14]. Find the warmest day, coldest day, and average temperature.',
    successHint: 'Nearly every program you will write uses lists. Weather data, student grades, pixel colors in an image — all stored as lists.',
  },
  {
    title: 'Loops — repeating things without repeating yourself',
    concept: `A **for loop** runs the same code once for each item in a list:

\`\`\`
for animal in ["elephant", "tiger", "rhino"]:
    print(animal)
\`\`\`

This prints each animal on its own line. The indented code (4 spaces) is the **body** of the loop — it runs once per item.

[diagram]

\`range(n)\` generates numbers 0 through n-1:
- \`range(5)\` gives 0, 1, 2, 3, 4
- \`range(1, 6)\` gives 1, 2, 3, 4, 5

**Indentation matters in Python.** The indented lines belong to the loop. When indentation returns to the original level, the loop is done.

You can also **accumulate** results in a loop:
\`\`\`
total = 0
for x in [10, 20, 30]:
    total = total + x
print(total)  # 60
\`\`\``,
    analogy: 'A for loop is like a teacher taking attendance. The teacher has a list of names and says each one out loud, one at a time. "Ravi?" "Here." "Priya?" "Here." Same action (call name, wait for response) repeated for every name on the list.',
    storyConnection: 'The old banyan tree grows one ring per year for 420 years. Writing 420 separate lines of code would be absurd. A loop lets you simulate 420 years in 3 lines: for year in range(420): grow_one_ring(). Loops turn repetition into elegance.',
    codeIntro: 'Simulate a bee colony growing over 12 months using a loop.',
    code: `# Simulate bee colony population over 12 months
population = 10000  # start with 10,000 bees
month_names = ["Jan","Feb","Mar","Apr","May","Jun",
               "Jul","Aug","Sep","Oct","Nov","Dec"]

print("Month-by-month colony growth:")
print("-" * 35)

for month in range(12):
    # Spring/summer: colony grows. Fall/winter: colony shrinks.
    if month < 6:
        growth = 2000  # gaining bees in warm months
    else:
        growth = -1500  # losing bees in cold months

    population = population + growth
    print(f"{month_names[month]:>5}: {population:>7,} bees")

print("-" * 35)
print(f"Final: {population:>7,} bees")

# Using range() to count
print("\\nCounting tree rings:")
total_width = 0
for year in range(1, 11):  # years 1 through 10
    ring_width = 5.0 / year  # rings get thinner as tree ages
    total_width = total_width + ring_width
    print(f"  Year {year:>2}: ring = {ring_width:.2f} mm, total = {total_width:.2f} mm")`,
    challenge: 'Modify the colony simulation: add a "swarming" event — if population exceeds 50,000, it splits in half. Track which month swarming happens.',
    successHint: 'Loops are what make computers powerful. A human could not manually calculate 420 years of tree growth. A computer does it in milliseconds, and the loop is how you tell it to.',
  },
  {
    title: 'Conditionals — making decisions',
    concept: `An **if statement** lets your program choose what to do based on a condition:

\`\`\`
temperature = 35
if temperature > 30:
    print("Too hot for fieldwork!")
\`\`\`

[diagram]

You can add alternatives with **elif** (else if) and **else**:

\`\`\`
if temperature > 35:
    print("Dangerous heat")
elif temperature > 25:
    print("Warm — good for bees")
elif temperature > 10:
    print("Cool — bees stay inside")
else:
    print("Too cold — risk of colony death")
\`\`\`

**Comparison operators**: \`>\` greater, \`<\` less, \`==\` equal, \`!=\` not equal, \`>=\` greater or equal, \`<=\` less or equal.

**Combine conditions** with \`and\`, \`or\`, \`not\`:
\`\`\`
if temperature > 20 and wind_speed < 30:
    print("Bees will forage today")
\`\`\``,
    analogy: 'Conditionals are like a river reaching a fork. The water does not flow down both paths — it checks the terrain (the condition) and follows one branch. If the left bank is lower, water flows left. If not, it flows right. Your program does the same: checks a condition, then follows one path.',
    storyConnection: 'The fisherman\'s daughter watched the barometer before every fishing trip. If pressure drops sharply, stay home — a storm is coming. If pressure is stable and wind is calm, go fishing. That decision process is exactly an if/elif/else chain, and it saved lives.',
    codeIntro: 'Build a weather safety system that classifies conditions for honey hunters.',
    code: `# Weather safety system for honey hunting
temperature = 28    # degrees C
humidity = 65       # percent
wind_speed = 12     # km/h
is_raining = False

print("=== Honey Hunting Safety Check ===")
print(f"Temperature: {temperature} C")
print(f"Humidity: {humidity}%")
print(f"Wind speed: {wind_speed} km/h")
print(f"Raining: {is_raining}")
print()

# Temperature check
if temperature > 40:
    print("DANGER: Heat stroke risk. Do not climb.")
elif temperature > 30:
    print("CAUTION: Hot. Carry extra water.")
elif temperature > 15:
    print("OK: Good temperature for climbing.")
else:
    print("WARNING: Bees are sluggish in cold. Low yield expected.")

# Wind check
if wind_speed > 40:
    print("DANGER: High wind. Climbing is unsafe.")
elif wind_speed > 25:
    print("CAUTION: Gusty. Secure all ropes.")
else:
    print("OK: Wind is manageable.")

# Bee activity prediction
if temperature > 20 and humidity < 80 and not is_raining:
    print("\\nBees will be active — expect defensive behavior.")
    if wind_speed < 15:
        print("Low wind — bees can fly well. Good foraging day.")
    else:
        print("Moderate wind — bees stay close to hive.")
else:
    print("\\nBees will be quiet — safer to approach hive.")

# Overall recommendation
safe = temperature < 40 and wind_speed < 40 and not is_raining
print(f"\\nFinal verdict: {'GO — safe to hunt' if safe else 'STAY — conditions unsafe'}")`,
    challenge: 'Add a "monsoon mode" check: if humidity > 90 AND is_raining is True, print a special warning about slippery tree bark. Also add a "best time" recommendation based on temperature being between 22-28 C with low wind.',
    successHint: 'Conditionals give your programs intelligence. Without them, code is just a recipe — same steps every time. With if/else, code adapts to the situation, just like a skilled honey hunter adapts to the weather.',
  },
  {
    title: 'Functions — building reusable tools',
    concept: `A **function** is a named block of code you can call whenever you need it:

\`\`\`
def greet(name):
    print("Hello, " + name + "!")

greet("Tara")   # prints: Hello, Tara!
greet("Kavitha") # prints: Hello, Kavitha!
\`\`\`

[diagram]

Functions take **parameters** (inputs) and can **return** a result:

\`\`\`
def area_circle(radius):
    return 3.14159 * radius * radius

a = area_circle(5)
print(a)  # 78.53975
\`\`\`

Why functions matter:
- **Reuse**: write once, call many times
- **Clarity**: \`compute_storm_surge(wind, pressure)\` is clearer than 10 lines of math
- **Testing**: you can test each function independently

Name your functions with verbs: \`calculate_area\`, \`check_weather\`, \`count_bees\`.`,
    analogy: 'A function is like a recipe card. The card has a name ("chocolate cake"), a list of ingredients (parameters), and step-by-step instructions (the body). You do not rewrite the recipe every time you bake — you just say "make chocolate cake" and follow the card. Functions work the same way.',
    storyConnection: 'In building the cyclone tracker dashboard, we need the same calculations over and over: convert wind speed to Saffir-Simpson category, compute storm surge from pressure and wind, estimate damage. Each of these becomes a function — a reusable tool in our toolkit.',
    codeIntro: 'Build a toolkit of functions for the honey hunter: calculate honey yield, assess colony health, recommend harvest amount.',
    code: `# Build a toolkit of functions for honey hunting

def honey_yield(hive_population, season_quality):
    """Estimate honey yield in kg from colony size and season quality (0-1)."""
    # A strong colony of 50,000 bees produces about 25 kg in a good season
    base_yield = hive_population / 50000 * 25
    return base_yield * season_quality

def colony_health(population, brood_count, queen_present):
    """Rate colony health as 'strong', 'moderate', or 'weak'."""
    if not queen_present:
        return "critical - queenless!"
    if population > 40000 and brood_count > 5000:
        return "strong"
    elif population > 20000:
        return "moderate"
    else:
        return "weak"

def safe_harvest(total_honey_kg, colony_health_status):
    """How much honey can we take without harming the colony?"""
    if colony_health_status == "strong":
        return total_honey_kg * 0.6  # take 60%, leave 40% for bees
    elif colony_health_status == "moderate":
        return total_honey_kg * 0.3  # take only 30%
    else:
        return 0  # do not harvest from weak colonies

# --- Use the functions ---
print("=== Honey Harvest Planner ===")
print()

# Three hives with different conditions
hives = [
    {"name": "Old Oak Hive", "population": 55000, "brood": 8000, "queen": True, "season": 0.85},
    {"name": "Cliff Hive", "population": 25000, "brood": 3000, "queen": True, "season": 0.7},
    {"name": "Garden Hive", "population": 15000, "brood": 1000, "queen": False, "season": 0.9},
]

total_harvest = 0
for hive in hives:
    health = colony_health(hive["population"], hive["brood"], hive["queen"])
    honey = honey_yield(hive["population"], hive["season"])
    harvest = safe_harvest(honey, health)
    total_harvest = total_harvest + harvest

    print(f"{hive['name']}:")
    print(f"  Population: {hive['population']:,} | Health: {health}")
    print(f"  Estimated honey: {honey:.1f} kg")
    print(f"  Safe to harvest: {harvest:.1f} kg")
    print()

print(f"Total safe harvest: {total_harvest:.1f} kg")
print("Leave the rest for the bees to survive winter.")`,
    challenge: 'Add a function called days_until_harvest(current_month) that returns how many days until the best harvest window (October). Use it to plan each hive\'s harvest schedule.',
    successHint: 'Functions are how professional programmers think. They break big problems into small, named pieces. Every library you will use — numpy, matplotlib, pandas — is just a collection of functions someone else wrote for you to reuse.',
  },
  {
    title: 'Numpy — doing math on entire lists at once',
    concept: `So far, we have used Python lists and loops. For science and data, there is a much faster tool: **numpy** (Numerical Python).

Numpy gives you **arrays** — like lists, but with superpowers:

\`\`\`
import numpy as np
temps = np.array([12, 14, 11, 15, 13, 10, 14])
print(temps.mean())    # 12.71 — average
print(temps.max())     # 15
print(temps - 10)      # [2, 4, 1, 5, 3, 0, 4] — subtract from ALL
\`\`\`

With regular lists, you would need a loop to subtract 10 from each item. With numpy, you just write \`temps - 10\` and it applies to every element. This is called **vectorized operations**.

[diagram]

Key numpy tools:
- \`np.array([...])\` — create an array
- \`np.arange(start, stop, step)\` — like range() but returns an array
- \`np.linspace(start, stop, n)\` — n evenly spaced values
- \`.mean()\`, \`.max()\`, \`.min()\`, \`.sum()\`, \`.std()\` — statistics
- Math works element-wise: \`+\`, \`-\`, \`*\`, \`/\`, \`**\` (power)`,
    analogy: 'Regular Python lists are like doing math problems one at a time with pencil and paper. Numpy is like having a calculator that works on a whole column of numbers at once. You press one button and get all the answers simultaneously.',
    storyConnection: 'When you model 365 days of bee colony population, or 100 years of tree ring widths, or 10,000 storm intensity samples — you cannot write a loop for each one. Numpy handles millions of numbers in the time it takes a loop to do hundreds. Every scientist uses it.',
    codeIntro: 'Use numpy to analyze a full year of daily temperature data from Ziro Valley.',
    code: `import numpy as np

# Generate a year of daily temperatures for Ziro Valley
# (simulated but realistic: cool winters, mild summers, monsoon dip)
np.random.seed(42)
days = np.arange(365)

# Seasonal pattern: warmest in June (day ~170), coolest in January (day ~15)
seasonal = 15 + 10 * np.sin(2 * np.pi * (days - 80) / 365)

# Monsoon cooling in July-September
monsoon = np.zeros(365)
monsoon[180:270] = -3  # cooler during monsoon

# Daily random variation
noise = np.random.normal(0, 2, 365)

# Final temperature
temperature = seasonal + monsoon + noise

# --- Analysis with numpy (no loops needed!) ---
print("=== Ziro Valley Temperature Analysis ===")
print(f"Days of data: {len(temperature)}")
print(f"Annual mean: {temperature.mean():.1f} C")
print(f"Hottest day: {temperature.max():.1f} C (day {temperature.argmax()})")
print(f"Coldest day: {temperature.min():.1f} C (day {temperature.argmin()})")
print(f"Std deviation: {temperature.std():.1f} C")

# Monthly averages (each month ~ 30 days)
print("\\nMonthly averages:")
month_names = ["Jan","Feb","Mar","Apr","May","Jun",
               "Jul","Aug","Sep","Oct","Nov","Dec"]
for m in range(12):
    start = m * 30
    end = min(start + 30, 365)
    monthly_avg = temperature[start:end].mean()
    bar = "#" * int(monthly_avg)
    print(f"  {month_names[m]}: {monthly_avg:>5.1f} C {bar}")

# Boolean indexing — filter without loops!
hot_days = np.sum(temperature > 25)
cold_days = np.sum(temperature < 5)
frost_days = np.sum(temperature < 0)
print(f"\\nDays above 25 C: {hot_days}")
print(f"Days below 5 C: {cold_days}")
print(f"Frost days (below 0 C): {frost_days}")

# Difference between consecutive days
daily_change = np.diff(temperature)
print(f"\\nBiggest day-to-day warming: {daily_change.max():.1f} C")
print(f"Biggest day-to-day cooling: {daily_change.min():.1f} C")`,
    challenge: 'Add a "growing season" analysis: count the number of consecutive days where temperature stays above 10 C. This determines which crops can grow in Ziro Valley.',
    successHint: 'You just analyzed 365 data points with zero loops. Numpy is the reason Python dominates science and data analysis. Every Level 1+ lesson on this platform uses it.',
  },
  {
    title: 'Your first plot — making data visible',
    concept: `Numbers in a table are hard to read. A **plot** turns data into a picture that reveals patterns instantly.

[diagram]

**Matplotlib** is Python's plotting library:

\`\`\`
import matplotlib.pyplot as plt
x = [1, 2, 3, 4, 5]
y = [10, 25, 15, 30, 20]
plt.plot(x, y)
plt.show()
\`\`\`

Key plot types:
- \`plt.plot(x, y)\` — line chart (trends over time)
- \`plt.bar(x, y)\` — bar chart (comparisons)
- \`plt.scatter(x, y)\` — scatter plot (relationships)

Always label your axes and add a title — a plot without labels is meaningless:
\`\`\`
plt.xlabel("Month")
plt.ylabel("Honey (kg)")
plt.title("Annual Honey Production")
\`\`\`

Color and style make plots readable:
\`\`\`
plt.plot(x, y, color='green', linewidth=2, label='Hive A')
plt.legend()  # show the label
\`\`\``,
    analogy: 'A plot is like a map. Raw GPS coordinates (37.7749, -122.4194) mean nothing to most people. Plot those coordinates on a map and instantly everyone sees "San Francisco." Plotting does the same for data — transforms numbers into understanding.',
    storyConnection: 'Every capstone project on this platform produces visualizations: cyclone track maps, HR diagrams, pollination networks, helmet design maps. This lesson teaches you the tool that makes all of those possible. After this, you are ready for Level 1 of any story.',
    codeIntro: 'Create a multi-panel dashboard showing bee colony data through the year — your first real data visualization.',
    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate a year of bee colony data ---
months = np.arange(1, 13)
month_names = ["Jan","Feb","Mar","Apr","May","Jun",
               "Jul","Aug","Sep","Oct","Nov","Dec"]

# Population peaks in summer, dips in winter
population = np.array([12000, 15000, 25000, 38000, 50000, 55000,
                        52000, 48000, 35000, 22000, 16000, 13000])

# Honey stored (kg) — builds up, then harvested in October
honey = np.array([5, 4, 6, 12, 22, 35, 42, 48, 45, 20, 15, 8])

# Temperature
temperature = np.array([5, 8, 14, 20, 25, 28, 27, 26, 22, 16, 10, 6])

# --- Create a 2x2 dashboard ---
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bee Colony Dashboard — Annual Overview',
             color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Population over time (line chart)
ax = axes[0, 0]
ax.plot(months, population / 1000, 'o-', color='#f59e0b', linewidth=2, markersize=6)
ax.fill_between(months, 0, population / 1000, color='#f59e0b', alpha=0.1)
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=7)
ax.set_ylabel('Population (thousands)', color='white')
ax.set_title('Colony Population', color='white', fontsize=11)

# Panel 2: Honey stored (bar chart)
ax = axes[0, 1]
colors = ['#22c55e' if h > 30 else '#f59e0b' if h > 15 else '#ef4444' for h in honey]
ax.bar(months, honey, color=colors, edgecolor='none', width=0.6)
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=7)
ax.set_ylabel('Honey stored (kg)', color='white')
ax.set_title('Honey Reserves', color='white', fontsize=11)

# Panel 3: Temperature (area chart)
ax = axes[1, 0]
ax.plot(months, temperature, 'o-', color='#ef4444', linewidth=2, markersize=6)
ax.fill_between(months, 0, temperature, color='#ef4444', alpha=0.1)
ax.axhline(15, color='#3b82f6', linestyle='--', linewidth=1, alpha=0.5)
ax.text(1, 16, 'Bee flight threshold (15 C)', color='#3b82f6', fontsize=7)
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white', fontsize=7)
ax.set_ylabel('Temperature (C)', color='white')
ax.set_title('Monthly Temperature', color='white', fontsize=11)

# Panel 4: Population vs Temperature (scatter plot)
ax = axes[1, 1]
scatter = ax.scatter(temperature, population / 1000, c=honey, cmap='YlGn',
                      s=100, edgecolors='white', linewidths=0.5)
plt.colorbar(scatter, ax=ax, label='Honey (kg)')
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Population (thousands)', color='white')
ax.set_title('Population vs Temperature', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Dashboard complete!")
print(f"Peak population: {population.max():,} bees in {month_names[population.argmax()]}")
print(f"Peak honey: {honey.max()} kg in {month_names[honey.argmax()]}")
print(f"Harvest month (October): took {honey[8] - honey[9]} kg")
print("\\nYou are now ready for Level 1 of any story!")`,
    challenge: 'Add a fifth panel (change the grid to 3x2) showing a pie chart of where the colony\'s energy goes: 40% brood rearing, 25% foraging, 20% hive maintenance, 15% thermoregulation.',
    successHint: 'You built a 4-panel data dashboard from scratch. This is exactly what scientists, analysts, and engineers do every day. You now have the skills to start Level 1 of any story on this platform.',
  },
];

const COURSE_SLUG = 'python-basics' as const;

export default function PythonBasicsPage() {
  const { ready: pyReady } = usePyodide();
  const { markLessonComplete, isLessonComplete, getCompletedCount, isCourseComplete } = useBasicsProgress();
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const fromSlug = searchParams.get('from');
  const completedCount = getCompletedCount(COURSE_SLUG);
  const courseComplete = isCourseComplete(COURSE_SLUG, lessons.length);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 flex-1 w-full">
        {/* Back link if came from a lesson */}
        {fromSlug && (
          <a href={`/lessons/${fromSlug}`} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to lesson
          </a>
        )}

        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Code2 className="w-4 h-4" /> Prerequisite Course
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Python Basics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Never coded before? Start here. 8 lessons that take you from zero to building
            your first data visualization — using examples from the stories you will explore.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 8 lessons</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> No experience needed</span>
            <span className="flex items-center gap-1"><Code2 className="w-4 h-4" /> Runs in your browser</span>
          </div>
        </div>

        {/* Progress overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{completedCount} / {lessons.length} lessons complete</span>
            {courseComplete && <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Course complete!</span>}
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(completedCount / lessons.length) * 100}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-10">
          {lessons.map((lesson, i) => {
            const done = isLessonComplete(COURSE_SLUG, i);
            return (
              <button
                key={i}
                onClick={() => setExpandedLesson(expandedLesson === i ? null : i)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all
                  ${expandedLesson === i
                    ? 'bg-emerald-600 text-white scale-110 shadow-lg'
                    : done
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400/50'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                  }`}
                title={`${lesson.title}${done ? ' ✓' : ''}`}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </button>
            );
          })}
        </div>

        {/* Lessons */}
        <div className="space-y-6">
          {lessons.map((lesson, i) => {
            const done = isLessonComplete(COURSE_SLUG, i);
            return (
            <div key={i} id={`lesson-${i}`}>
              {/* Lesson header — always visible */}
              <button
                onClick={() => {
                  const opening = expandedLesson !== i;
                  setExpandedLesson(opening ? i : null);
                  if (opening) {
                    setTimeout(() => document.getElementById(`lesson-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }
                }}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex items-center gap-4
                  ${expandedLesson === i
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
                    : done
                      ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0
                  ${expandedLesson === i
                    ? 'bg-emerald-600 text-white'
                    : done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${expandedLesson === i ? 'text-emerald-700 dark:text-emerald-300' : done ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>
                    {lesson.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.codeIntro}</p>
                </div>
                {done && expandedLesson !== i && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">Complete</span>}
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedLesson === i ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded lesson content */}
              {expandedLesson === i && (
                <div className="mt-4 ml-2">
                  <MiniLesson
                    number={i + 1}
                    title={lesson.title}
                    concept={lesson.concept}
                    analogy={lesson.analogy}
                    storyConnection={lesson.storyConnection}
                    codeIntro={lesson.codeIntro}
                    code={lesson.code}
                    challenge={lesson.challenge}
                    successHint={lesson.successHint}
                    diagram={[
                      <PrintDiagram />, <VariableDiagram />, <ListDiagram />, <LoopDiagram />,
                      <ConditionalDiagram />, <FunctionDiagram />, <NumpyDiagram />, <PlotDiagram />,
                    ][i]}
                  />
                  {/* Mark Complete button */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                    {done ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Lesson complete</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => markLessonComplete(COURSE_SLUG, i)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    )}
                    {i < lessons.length - 1 && (
                      <button
                        onClick={() => { if (!done) markLessonComplete(COURSE_SLUG, i); setExpandedLesson(i + 1); }}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        Next lesson <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
          })}
        </div>

        {/* Completion CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready for Level 1</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            After completing these 8 lessons, you have the Python skills to start Level 1 of any story.
            {fromSlug ? ' Head back to continue where you left off:' : ' We recommend starting with one of these:'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {fromSlug && (
              <a
                href={`/lessons/${fromSlug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Continue your story <ChevronRight className="w-4 h-4" />
              </a>
            )}
            {[
              { name: 'The Old Banyan Tree', slug: 'old-banyan-trees-stories' },
              { name: 'The Honey Hunter', slug: 'honey-hunters-lesson' },
              { name: 'Stars Above Ziro', slug: 'stars-above-ziro' },
            ].filter(s => s.slug !== fromSlug).map(s => (
              <a
                key={s.slug}
                href={`/lessons/${s.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-colors"
              >
                {s.name} <ChevronRight className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
