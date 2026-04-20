import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'matplotlib',
  title: 'Matplotlib',
  category: 'data-science',
  icon: '📊',
  tagline: 'Turn numbers into charts and graphs',
  relatedStories: ['girl-who-spoke-to-elephants', 'why-the-muga-silk-is-golden', 'dragonfly-and-the-paddy-field', 'boy-who-talked-to-clouds'],

  understand: [
    {
      title: 'Why Visualize Data?',
      beginnerContent:
        'Move the correlation slider in the diagram above. At r = 0, the scatter looks random. Bump it to 0.8 and a trend emerges. That\'s the whole point of visualization — your eyes see patterns in pictures that no amount of staring at numbers can reveal.\n\n' +
        'A table of 500 numbers is hard to interpret. Your eyes glaze over after the first few rows. ' +
        'But plot those same numbers as a line chart and you instantly see trends, spikes, and patterns. ' +
        'A famous example: Anscombe\'s Quartet is four datasets that have identical means, standard ' +
        'deviations, and correlations — but look completely different when plotted. One is a straight ' +
        'line, one is a curve, one has an outlier, and one is a vertical cluster with one stray point. ' +
        'The statistics alone cannot tell them apart, but a single glance at the charts reveals everything. ' +
        'Matplotlib is Python\'s most popular plotting library, used by scientists, data analysts, ' +
        'and engineers worldwide.',
      intermediateContent:
        'Anscombe\'s quartet: four datasets with identical statistical summaries (mean, variance, correlation, regression line) but completely different visual patterns — one linear, one curved, one with an outlier, one vertical cluster. Without plotting, you would think they are identical. The data literacy principle: **always plot your data before computing statistics**. Matplotlib\'s `plt.scatter(x, y)` takes seconds and can reveal patterns, outliers, and non-linearities that summary statistics hide. Box plots (`plt.boxplot(data)`) show median, quartiles, and outliers in one compact visualization.',
      advancedContent:
        '**Tufte\'s principles — how to lie (and not lie) with charts:**\n\n' +
        'Edward Tufte defined the **lie factor** = (size of effect shown in graphic) / (size of effect in data). It should be close to 1.0.\n\n' +
        '**Common distortions:**\n' +
        '| Trick | What it does | Example |\n' +
        '|---|---|---|\n' +
        '| Truncated y-axis | Start y at 98 instead of 0 → a 2% drop looks like a cliff | News channels showing stock market "crashes" |\n' +
        '| 3D pie chart | Perspective makes front slices look bigger | Company reports making their market share look larger |\n' +
        '| Dual y-axes | Overlay two unrelated series and imply correlation | "Ice cream sales" vs "shark attacks" — both rise in summer |\n' +
        '| Area/bubble scaling | Double the radius → 4× the area → perception mismatch | Infographics comparing budgets with circle sizes |\n\n' +
        '**The data-ink ratio:** Every pixel should show data or help interpret it. Remove: background colors, decorative images, 3D effects, redundant gridlines. ' +
        'Keep: data points, axis labels, titles, legends. The best chart is the simplest one that communicates the insight.\n\n' +
        '**Chart type decision tree:**\n' +
        '- Showing change over time → **line chart**\n' +
        '- Comparing two variables → **scatter plot**\n' +
        '- Comparing categories → **bar chart** (horizontal if labels are long)\n' +
        '- Showing distribution → **histogram** or **box plot**\n' +
        '- Showing parts of whole → **stacked bar** (avoid pie charts — humans judge angles poorly)',
      diagram: 'CorrelationDiagram',
    },
    {
      title: 'Chart Types and When to Use Each',
      beginnerContent:
        'Adjust the bin count in the diagram above. A histogram slices one variable into bins and shows how many values fall in each — revealing the SHAPE of your data. Use it when you want to know "how is this distributed?" — as opposed to a line or scatter which asks "how are these two things related?"\n\n' +
        '*Line charts* show how a value changes over time — temperature across months, stock prices ' +
        'across years. Use them when the x-axis has a natural order. *Scatter plots* show the ' +
        'relationship between two variables — study hours vs exam scores. Each dot is one data point. ' +
        '*Bar charts* compare categories — population of different animals, sales by region. Use them ' +
        'when the x-axis is labels, not numbers. *Histograms* show the distribution of a single ' +
        'variable — how many students scored between 70-80, 80-90, etc. *Pie charts* show parts of a ' +
        'whole, but most data scientists avoid them because humans are bad at comparing angles. ' +
        'Choosing the right chart type is half the battle in data visualization.',
      intermediateContent:
        'Essential plot types: plt.plot(x, y) (line), plt.scatter(x, y, c=colors, s=sizes), plt.bar(categories, values), plt.hist(data, bins=30), plt.imshow(matrix, cmap="viridis"). Multi-panel: fig, axes = plt.subplots(2, 2, figsize=(10, 8)). Always label axes: ax.set_xlabel("Distance (km)"), ax.set_ylabel("Count"), ax.set_title("Elephant Sightings"). Save with plt.savefig("plot.png", dpi=150, bbox_inches="tight"). Use plt.tight_layout() to prevent overlapping labels.',
      advancedContent:
        '**When to use which Python plotting library:**\n\n' +
        '| Library | Best for | Syntax | Output |\n' +
        '|---|---|---|---|\n' +
        '| **Matplotlib** | Full control, publication figures, custom layouts | Verbose but flexible | Static PNG/SVG/PDF |\n' +
        '| **Seaborn** | Statistical plots (violin, heatmap, pair plots) | `sns.heatmap(corr, annot=True)` — one line | Static (built on matplotlib) |\n' +
        '| **Plotly** | Interactive exploration (zoom, hover, tooltips) | `px.scatter(df, x="weight", y="height", color="species")` | HTML, runs in browser |\n' +
        '| **Altair** | Declarative grammar of graphics (describe WHAT, not HOW) | `alt.Chart(df).mark_point().encode(x="x", y="y")` | HTML/SVG |\n\n' +
        '**Seaborn\'s statistical plots — what matplotlib can\'t do easily:**\n' +
        '- `sns.violinplot(x="species", y="weight", data=df)` — shows the full distribution shape, not just box/whisker\n' +
        '- `sns.pairplot(df)` — scatter plots of every variable pair + histograms on diagonal. One line reveals ALL pairwise relationships.\n' +
        '- `sns.heatmap(df.corr(), annot=True, cmap="coolwarm")` — correlation matrix with numbers overlaid\n\n' +
        '**The typical workflow:**\n' +
        '1. **Explore** with seaborn/plotly (fast, interactive)\n' +
        '2. **Publish** with matplotlib (full control over fonts, layout, LaTeX labels)\n' +
        '3. **Present** with plotly/altair (interactive dashboards)',
      diagram: 'HistogramDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the chart type to when you should use it',
          pairs: [
            ['Line chart', 'Show how a value changes over time'],
            ['Scatter plot', 'Show the relationship between two variables'],
            ['Bar chart', 'Compare values across categories'],
            ['Histogram', 'Show the distribution of a single variable'],
            ['Pie chart', 'Show parts of a whole (use sparingly)'],
          ],
        },
      },
    },
    {
      title: 'Anatomy of a Plot',
      beginnerContent:
        'Click any part of the chart above — title, label, axis, legend, data line, grid, tick mark. Each piece shows its name AND the matplotlib code that creates it. Learn this vocabulary once and you can read or modify any matplotlib chart ever written.\n\n' +
        'Every Matplotlib chart has a *Figure* (the overall canvas or window) and one or more *Axes* ' +
        '(individual chart areas within the figure). Each Axes has an x-axis and y-axis with tick ' +
        'marks and labels, a title, and the actual data drawn as lines, bars, or dots. You can also ' +
        'add a *legend* (explaining what each color means), *grid lines* (making it easier to read ' +
        'values), *annotations* (arrows or text pointing to specific data points), and a *colorbar* ' +
        '(when colors represent a third variable). Understanding these parts lets you customize ' +
        'every aspect of your chart.',
      intermediateContent:
        'Every matplotlib figure has a hierarchy: **Figure** (the canvas) → **Axes** (a single plot within the figure) → plot elements (lines, markers, text, legends). The object-oriented interface: fig, ax = plt.subplots(). ax.plot(x, y) adds a line. ax.set_xlabel(), ax.set_ylabel(), ax.set_title() label it. ax.legend() shows a key. ax.set_xlim(0, 100), ax.set_ylim(0, 50) control axis ranges. fig.savefig("plot.png", dpi=150) saves. The difference: plt.plot() is the quick "state-based" interface; ax.plot() is the explicit OO interface — use OO for anything beyond a quick look.',
      advancedContent:
        '**Advanced layouts — when subplots aren\'t enough:**\n\n' +
        'Standard `plt.subplots(2, 3)` creates a regular grid. For irregular layouts (one wide plot on top, two smaller plots below), use GridSpec:\n' +
        '```\n' +
        'fig = plt.figure(figsize=(12, 8))\n' +
        'gs = fig.add_gridspec(2, 2, height_ratios=[1, 2])\n' +
        'ax_top = fig.add_subplot(gs[0, :])    # spans full width\n' +
        'ax_bl = fig.add_subplot(gs[1, 0])     # bottom-left\n' +
        'ax_br = fig.add_subplot(gs[1, 1])     # bottom-right\n' +
        '```\n\n' +
        '**The three customization layers (from broad to specific):**\n' +
        '1. **rcParams** — global defaults: `plt.rcParams["font.size"] = 12` affects ALL future plots\n' +
        '2. **Style sheets** — themed presets: `plt.style.use("ggplot")` or `plt.style.use("seaborn-v0_8")` applies a complete visual theme\n' +
        '3. **Per-element kwargs** — override anything: `ax.plot(x, y, color="red", linewidth=3, alpha=0.7)`\n\n' +
        'Each layer overrides the previous. A style sheet sets defaults; individual plot calls override the style.\n\n' +
        '**Animation — plots that move:**\n' +
        '```\n' +
        'from matplotlib.animation import FuncAnimation\n' +
        'fig, ax = plt.subplots()\n' +
        'line, = ax.plot([], [])\n' +
        'def update(frame):\n' +
        '    line.set_data(x[:frame], y[:frame])\n' +
        '    return line,\n' +
        'anim = FuncAnimation(fig, update, frames=100, interval=50)\n' +
        '```\n' +
        'Use cases: real-time sensor dashboards, animated scatter plots showing data arriving over time, wave simulations.',
      diagram: 'PlotAnatomyDiagram',
    },
    {
      title: 'Color, Design, and Readability',
      beginnerContent:
        'A good chart communicates clearly. Bad design choices can confuse or even mislead. ' +
        'Use high-contrast colors (avoid light yellow on white). Use colorblind-friendly palettes — ' +
        'about 8% of men have some form of color blindness, so avoid relying solely on red/green ' +
        'differences. Label your axes with units (not just "x" and "y" — say "Temperature (°C)" ' +
        'and "Days since start"). Keep titles short and descriptive. Remove unnecessary clutter: ' +
        'if grid lines do not help, turn them off. If a legend has only one item, it is redundant. ' +
        'The goal is to make the viewer understand the data in seconds, not minutes.',
      intermediateContent:
        'Color palettes: sequential (light→dark for ordered data: "viridis", "plasma"), diverging (two-color gradient for data with a meaningful center: "coolwarm", "RdBu"), qualitative (distinct colors for categories: "Set2", "tab10"). **Colorblind-safe**: viridis, cividis (avoid red-green). Set color with c= or color= parameter. Marker styles: "o" (circle), "s" (square), "^" (triangle), "+" (plus). Line styles: "-" (solid), "--" (dashed), ":" (dotted). Alpha transparency (alpha=0.5) helps with overlapping data points in scatter plots.',
      advancedContent:
        '**Color perception science — why viridis is better than rainbow:**\n\n' +
        'The human eye perceives luminance (brightness) linearly, but hue (color) unevenly. The "jet" / "rainbow" colormap has perceptual ' +
        'nonuniformities — yellow and cyan bands create false contours that don\'t exist in the data.\n\n' +
        '**Viridis was designed to be:**\n' +
        '1. **Perceptually uniform** — equal data steps = equal visual steps\n' +
        '2. **Colorblind-safe** — still readable by deuteranopes (red-green blind)\n' +
        '3. **Black-and-white printable** — luminance increases monotonically\n\n' +
        '**Design rules for color:**\n' +
        '- **Quantitative data** → sequential colormap (viridis, plasma) — luminance encodes the value\n' +
        '- **Diverging data** (deviation from center) → diverging colormap (coolwarm, RdBu) — two hues diverge from a neutral midpoint\n' +
        '- **Categories** → qualitative colormap (Set2, tab10) — distinct hues, similar brightness\n\n' +
        '**Annotation — guiding the reader\'s eye:**\n' +
        '```\n' +
        'ax.annotate("Peak: 42°C",\n' +
        '    xy=(peak_x, peak_y),           # point to annotate\n' +
        '    xytext=(peak_x + 5, peak_y + 3), # text position\n' +
        '    arrowprops=dict(arrowstyle="->", color="red"),\n' +
        '    fontsize=11, fontweight="bold")\n' +
        '```\n' +
        'Annotations turn data exploration into storytelling — they answer "what should I notice?" for the viewer.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'About 8% of men have some form of color blindness, so you should avoid relying only on red/green differences.', answer: true, explanation: 'Red-green color blindness is common. Use colorblind-friendly palettes and add labels or patterns alongside color.' },
            { text: 'A legend is always necessary, even when the chart shows only one data series.', answer: false, explanation: 'If there is only one series, the legend is redundant. Use the title or axis label to identify the data instead.' },
            { text: 'Axis labels should include units, like "Temperature (C)" instead of just "y".', answer: true, explanation: 'Without units, the reader cannot interpret the values. Always label axes with descriptive names and units.' },
          ],
        },
      },
    },
    {
      title: 'From Quick Plot to Publication Quality',
      beginnerContent:
        'Matplotlib works at two levels. The *pyplot* interface (`plt.plot(x, y)`) is quick for ' +
        'exploration — you get a chart in one line. The *object-oriented* interface (`fig, ax = ' +
        'plt.subplots()`) gives you full control for polished charts. Start with pyplot to explore ' +
        'your data, then switch to the OO interface when you need subplots, dual axes, or custom ' +
        'layouts. You can save charts as PNG, SVG, or PDF using `plt.savefig("chart.png", dpi=150)`. ' +
        'SVG is best for the web; PDF is best for papers and reports.',
      intermediateContent:
        'Publication workflow: (1) fig, ax = plt.subplots(figsize=(6, 4)) for journal-width figure, (2) set font: plt.rcParams.update({"font.size": 11, "font.family": "serif"}), (3) use LaTeX labels: ax.set_xlabel(r"Temperature ($^\\circ$C)"), (4) add error bars: ax.errorbar(x, y, yerr=err, fmt="o", capsize=3), (5) tight_layout() prevents clipping, (6) save as vector: fig.savefig("fig.pdf") for journals or fig.savefig("fig.svg") for web. PDF/SVG scale perfectly at any size; use PNG (dpi=300) only when vector is not supported.',
      advancedContent:
        '**From script to dashboard — making figures interactive:**\n\n' +
        'Matplotlib creates static images. For interactive exploration, you need a framework:\n\n' +
        '| Tool | What it does | Best for |\n' +
        '|---|---|---|\n' +
        '| **Streamlit** | Turns Python scripts into web apps. Add `st.slider()` and your matplotlib plot updates live | Quick internal tools, prototypes |\n' +
        '| **Dash (Plotly)** | Full web app framework with callbacks. More control, more code | Production dashboards |\n' +
        '| **Jupyter widgets** | `%matplotlib widget` makes plots zoomable/pannable in notebooks | Exploration during analysis |\n' +
        '| **Panel** | Works with any plotting library, integrates with Jupyter | Linking multiple plot types |\n\n' +
        '**Matplotlib backends — what renders your plot:**\n' +
        '- **Agg** (default): renders to PNG in memory. Use for scripts, servers, and saved files. No window pops up.\n' +
        '- **TkAgg**: opens an interactive window with zoom/pan tools. Use for desktop exploration.\n' +
        '- **WebAgg**: renders in the browser. Use for remote servers.\n\n' +
        '**Reproducibility:** Always save the script that generated a figure alongside the figure itself. ' +
        'A paper reviewer asks "what happens if you change the bin width?" — re-run the script with one parameter changed. ' +
        'Journals like Nature have specific style guides (font sizes, figure widths, color requirements). ' +
        'Encode these as a matplotlib style sheet file (.mplstyle) and apply with `plt.style.use("nature.mplstyle")` — ' +
        'every figure in your paper automatically conforms.',
      diagram: 'PlotAnatomyDiagram',
    },
  ],

  build: [
    {
      title: 'Line and Scatter Plots',
      beginnerContent:
        'The two most fundamental chart types: line plots for trends, scatter plots for relationships.',
      code: `import matplotlib.pyplot as plt
import numpy as np

# --- Line plot ---
x = np.linspace(0, 10, 50)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y, color="teal", linewidth=2, label="sin(x)")
plt.plot(x, np.cos(x), color="coral", linestyle="--", label="cos(x)")
plt.xlabel("x")
plt.ylabel("y")
plt.title("Trigonometric Functions")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# --- Scatter plot with color-coded values ---
np.random.seed(42)
temps = np.random.normal(28, 3, 30)
days = np.arange(1, 31)

plt.figure(figsize=(8, 4))
scatter = plt.scatter(days, temps, c=temps, cmap="coolwarm",
                     s=80, edgecolors="black", linewidth=0.5)
plt.colorbar(scatter, label="Temperature (°C)")
plt.xlabel("Day of Month")
plt.ylabel("Temperature (°C)")
plt.title("Daily Temperatures — June")
plt.show()`,
    },
    {
      title: 'Bar Charts and Histograms',
      beginnerContent:
        'Bar charts compare categories. Histograms reveal the distribution of continuous data.',
      code: `import matplotlib.pyplot as plt
import numpy as np

# --- Bar chart ---
animals = ["Elephant", "Rhino", "Tiger", "Dolphin"]
counts = [2500, 2700, 180, 800]
colors = ["#718096", "#A0522D", "#F6AD55", "#4299E1"]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

bars = ax1.bar(animals, counts, color=colors, edgecolor="black")
ax1.set_ylabel("Population estimate")
ax1.set_title("Kaziranga Wildlife Census")
# Add value labels on top of each bar
for bar, count in zip(bars, counts):
  ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50,
           str(count), ha="center", fontweight="bold")

# --- Histogram ---
data = np.random.normal(25, 5, 1000)
ax2.hist(data, bins=30, edgecolor="black", alpha=0.7, color="steelblue")
ax2.axvline(np.mean(data), color="red", linestyle="--",
          label=f"Mean: {np.mean(data):.1f}°C")
ax2.set_xlabel("Temperature (°C)")
ax2.set_ylabel("Frequency")
ax2.set_title("Temperature Distribution (1000 readings)")
ax2.legend()

plt.tight_layout()
plt.show()`,
    },
    {
      title: 'Subplots — Multiple Charts in One Figure',
      beginnerContent:
        'Put multiple charts side by side for easy comparison. The object-oriented approach gives you full control.',
      code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
x = np.linspace(0, 2 * np.pi, 100)

# Top-left: line
axes[0, 0].plot(x, np.sin(x), "b-", linewidth=2)
axes[0, 0].set_title("Sine")
axes[0, 0].grid(True, alpha=0.3)

# Top-right: filled area
axes[0, 1].fill_between(x, np.cos(x), alpha=0.3, color="red")
axes[0, 1].plot(x, np.cos(x), "r-")
axes[0, 1].set_title("Cosine (filled)")

# Bottom-left: step function
axes[1, 0].step(x, np.sign(np.sin(x)), "g-", linewidth=2)
axes[1, 0].set_title("Square wave")
axes[1, 0].set_ylim(-1.5, 1.5)

# Bottom-right: multiple lines
for n in range(1, 5):
  axes[1, 1].plot(x, np.sin(n * x) / n, label=f"n={n}")
axes[1, 1].set_title("Harmonic series")
axes[1, 1].legend(fontsize=8)

for ax in axes.flat:
  ax.set_xlabel("x")
  ax.set_ylabel("y")

fig.suptitle("Four Chart Types in One Figure", fontsize=14)
plt.tight_layout()
plt.show()`,
    },
    {
      title: 'Styling and Customization',
      beginnerContent:
        'Control every visual detail: colors, fonts, annotations, and styles.',
      code: `import matplotlib.pyplot as plt
import numpy as np

# Use a built-in style
plt.style.use("seaborn-v0_8-whitegrid")

months = ["Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"]
temps = [18, 20, 25, 30, 34, 35, 33, 32, 30, 27, 22, 19]
rainfall = [10, 15, 30, 60, 120, 280, 350, 300, 200, 80, 20, 8]

fig, ax1 = plt.subplots(figsize=(10, 5))

# Temperature as a line (left y-axis)
color1 = "#E53E3E"
ax1.plot(months, temps, "o-", color=color1, linewidth=2,
       markersize=8, label="Temperature")
ax1.set_ylabel("Temperature (°C)", color=color1, fontsize=12)
ax1.tick_params(axis="y", labelcolor=color1)

# Rainfall as bars (right y-axis)
ax2 = ax1.twinx()
color2 = "#3182CE"
ax2.bar(months, rainfall, alpha=0.3, color=color2, label="Rainfall")
ax2.set_ylabel("Rainfall (mm)", color=color2, fontsize=12)
ax2.tick_params(axis="y", labelcolor=color2)

# Annotation
peak_month = months[np.argmax(rainfall)]
ax2.annotate(f"Monsoon peak\\n{max(rainfall)} mm",
           xy=(peak_month, max(rainfall)),
           xytext=(months[8], max(rainfall) - 50),
           arrowprops=dict(arrowstyle="->", color="black"),
           fontsize=10, fontweight="bold")

ax1.set_title("Guwahati Climate — Temperature & Rainfall", fontsize=14)
fig.legend(loc="upper left", bbox_to_anchor=(0.12, 0.88))
plt.tight_layout()
plt.show()`,
    },
    {
      title: 'Saving Charts',
      beginnerContent:
        'Save your charts as image files for reports, websites, or presentations.',
      code: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x) * np.exp(-x / 5)

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(x, y, "b-", linewidth=2)
ax.fill_between(x, y, alpha=0.2)
ax.set_title("Damped Sine Wave")
ax.set_xlabel("Time (s)")
ax.set_ylabel("Amplitude")
ax.grid(True, alpha=0.3)

# Save as PNG (good for slides and web)
fig.savefig("damped_wave.png", dpi=150, bbox_inches="tight")

# Save as SVG (scales perfectly, good for web)
fig.savefig("damped_wave.svg", bbox_inches="tight")

# Save as PDF (good for papers and print)
fig.savefig("damped_wave.pdf", bbox_inches="tight")

print("Saved: damped_wave.png, .svg, .pdf")
plt.show()`,
    },
  ],
};
