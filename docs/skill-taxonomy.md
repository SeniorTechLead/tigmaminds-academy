# Skill & Track Taxonomy

A hierarchical tagging scheme for lessons. Each lesson gets tagged at **every level** of the hierarchy — a lesson tagged `Programming > Web Development > TypeScript` is also findable under `Programming` and `Programming > Web Development`.

## The Hierarchy

```
Level 1: Discipline       (what field)
  Level 2: Skill          (what you learn to do)
    Level 3: Tool/Tech    (what you use)
      Level 4: Application (what you build — optional, for search/discovery)
```

---

### 1. Programming

Core coding skills — writing, debugging, structuring software.

| Level 2 (Skill) | Level 3 (Tool) | Level 4 (Application) | Example Lessons |
|---|---|---|---|
| Python | Python 3 | CLI tools, scripting | Most lessons |
| Web Development | HTML/CSS | Page structure, styling | Library L3 |
| | JavaScript | DOM manipulation, events | Library L3 |
| | TypeScript | Typed applications | Playground problems |
| | React concepts | Components, state | Library L3 |
| Databases | SQL | Queries, schema design | Library, Elephant, Butterfly, Weather |
| | Data modeling | Entity relationships | Library L4 |
| Algorithms | Sorting & searching | — | Python playground problems |
| | Data structures | Lists, trees, graphs | Python playground problems |

### 2. Data Science

Working with data — collecting, cleaning, analyzing, visualizing, and drawing conclusions.

| Level 2 (Skill) | Level 3 (Tool) | Level 4 (Application) | Example Lessons |
|---|---|---|---|
| Data Analysis | Statistical analysis | Population trends, weather patterns | Butterfly counts, Storm data |
| | Pattern recognition | Time series, correlations | Silk fiber testing, Cyclone tracks |
| Data Visualization | Charts & plots | Bar, line, scatter, histogram | Sunset spectrum, Elephant weights |
| | Scientific figures | Multi-panel, annotated | Most Level 4 capstones |
| | Interactive dashboards | — | Weather dashboard |

### 3. AI & Machine Learning

Training models to learn from data — classification, prediction, pattern detection.

| Level 2 (Skill) | Level 3 (Tool) | Level 4 (Application) | Example Lessons |
|---|---|---|---|
| Machine Learning | Classification | Species ID, mood detection | Elephant rumble classifier |
| | Prediction | Weather forecasting, growth models | Storm track predictor |
| | Clustering | Grouping similar items | — |
| Computer Vision | Image analysis | Crop health, satellite imagery | Dragonfly crop monitor |
| Natural Language | Text processing | — | Talking parrot |
| Reinforcement Learning | Q-learning | Decision making | Angulimala (mythology) |

### 4. Scientific Modeling

Building computational models of physical, biological, or chemical systems.

| Level 2 (Skill) | Level 3 (Tool) | Level 4 (Application) | Example Lessons |
|---|---|---|---|
| Physics simulation | Mechanics | Forces, motion, projectiles | David & Goliath, Ferryman |
| | Optics & light | Scattering, refraction, color | Sunsets, Kingfisher, Golden Deer |
| | Acoustics & sound | Waves, resonance, sonar | Dolphin, Monastery Bells, Woodpecker |
| | Thermodynamics | Heat transfer, phase changes | Agni, Cloud formation |
| | Fluid dynamics | River flow, erosion, weather | River Braid, Siang, Monsoon |
| Biological simulation | Population dynamics | Growth, carrying capacity, conservation | Dancing Deer, Hornbill, Elephant Corridor |
| | Genetics & evolution | DNA, mutation, selection | Bodhi Tree, Orchid, Takin |
| | Ecosystem modeling | Food webs, nutrient cycles | Secret Garden, Wild Orchids |
| | Plant growth | Auxin, meristem, canopy models | Bamboo, Sal Tree, Banyan |
| Chemical simulation | Reactions & kinetics | Combustion, pH, catalysis | Agni, Pitcher Plant |
| | Materials science | Tensile strength, fiber analysis | Muga Silk, Basket Weaver |
| Earth science simulation | Atmospheric models | Pressure, lapse rate, clouds | Altitude, Cloud Weaver, Cloud Namer |
| | Geological processes | Erosion, tectonics, weathering | Lost Temple, Seven Sisters |
| | Hydrological models | Water flow, aquifer dynamics | Zamzam, Lotus Float |

### 5. Electronics & Hardware

Physical computing — circuits, sensors, actuators, and embedded systems.

| Level 2 (Skill) | Level 3 (Tool) | Level 4 (Application) | Example Lessons |
|---|---|---|---|
| Arduino | Digital I/O | LED control, button input | Firefly LED sync |
| | Analog I/O | PWM, sensor reading | Dolphin sonar |
| | Serial communication | Debugging, data logging | All Arduino lessons |
| Circuit Design | Breadboard prototyping | LED circuits, resistor networks | Firefly L2, Festival Lights |
| | PCB design | Permanent circuits | Firefly L3 |
| Sensors | Ultrasonic | Distance measurement | Dolphin sonar |
| | Light sensors | LDR, photodiode | Festival Lights |

---

## How to tag a lesson

1. Pick the **primary discipline** (Level 1) — what is this lesson mainly about?
2. Pick 1-2 **skills** (Level 2) — what will the student learn to do?
3. Pick the **tools** (Level 3) — what specific technology?
4. Optionally add **application** (Level 4) — what domain?

### Examples

| Lesson | L1 | L2 | L3 | L4 |
|---|---|---|---|---|
| Elephant Rumble Classifier | AI & ML | Classification | Python, NumPy | Acoustic analysis |
| Firefly LED Sync | Electronics | Arduino, Circuit Design | Digital I/O, PWM | Bioluminescence |
| Library Management System | Programming | Web Development, Databases | HTML/CSS, JS, SQL | Full-stack app |
| Sunset Color Simulator | Scientific Modeling | Physics simulation | Python | Atmospheric optics |
| Cyclone Track Visualizer | Data Science | Data Visualization | Python, Matplotlib | Weather patterns |
| Silk Fiber Analyzer | Scientific Modeling | Materials science | Python | Tensile testing |
| Dancing Deer Population | Scientific Modeling | Population dynamics | Python | Conservation |

---

## Rules

1. **Each lesson gets exactly 1 primary discipline** (Level 1)
2. **1-2 skills** (Level 2) — the main activities
3. **1-3 tools** (Level 3) — what technology is used
4. **0-1 application** (Level 4) — optional, for discovery
5. **A lesson is searchable at every level** — tagging "Electronics > Arduino > Digital I/O" means it appears when filtering by "Electronics", by "Arduino", or by "Digital I/O"
6. **Don't tag what's incidental** — if a lesson plots one graph as a side output, don't tag it "Data Visualization." Tag it only if visualization IS the lesson.
7. **The filter UI shows Level 1 first**, then expands Level 2 on click, then Level 3.

---

## Adding new skills

When adding a new lesson that introduces a new tool or skill:

1. Check if it fits under an existing Level 1 discipline
2. If yes, add it as a new Level 2 or Level 3 entry
3. If no, consider whether it warrants a new Level 1 (needs 3+ lessons to justify)
4. Update this document
5. Update the `Skill` type in `src/data/lesson-types.ts`
6. Update the `SKILLS` array in `src/data/lessons.ts`
