import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function OrchidLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {title:'Capstone overview — Flower Color Analyzer',concept:`In this capstone you will build a **Flower Color Analyzer** that models how pigment concentrations produce different colors and predicts flower color from gene expression levels. The system combines biochemistry (pigment absorption spectra), physics (Beer-Lambert law, color perception), and genetics (biosynthesis pathway) into a unified prediction pipeline.\n\nYour analyzer will:\n1. Take gene expression levels as input (CHS, DFR, ANS, etc.)\n2. Simulate the anthocyanin biosynthesis pathway to predict pigment concentrations\n3. Calculate the reflectance spectrum using Beer-Lambert law\n4. Convert the spectrum to perceived color (RGB) using human cone responses\n5. Predict how the color appears to different pollinators (bee, butterfly, moth)\n6. Identify which gene mutations produce specific target colors`,analogy:'The Color Analyzer is like a virtual paint mixing studio. Instead of mixing paints by trial and error, you calculate the exact proportions needed from first principles. Give it "2x CHS, 0.5x DFR, pH 4.5" and it predicts the exact shade of pink — no experiments needed.',storyConnection:'NE India orchid breeders spend years crossing varieties to achieve desired colors. Your analyzer can predict the color of offspring from parent gene expression levels, dramatically accelerating the breeding process.',checkQuestion:'If you want to create a blue orchid, which genes would you need to modify and why?',checkAnswer:'You need high anthocyanin production (upregulate CHS, ANS, UFGT), the F3\'5\'H enzyme to produce delphinidin (blue anthocyanidin instead of red cyanidin), and elevated vacuolar pH (near 7) or metal ion copigmentation (Al3+). Blue is the hardest flower color to engineer because it requires simultaneous control of pigment type, concentration, and chemical environment.',codeIntro:'Build the gene-to-color prediction engine.',code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
wavelengths = np.linspace(380, 750, 300)

def pathway_simulate(chs=1, dfr=1, ans=1, ufgt=1):
    """Simplified: gene expression -> anthocyanin concentration."""
    rate = min(chs, dfr, ans, ufgt) * 0.7 + 0.3 * (chs*dfr*ans*ufgt)**0.25
    return np.clip(rate * 0.003, 0, 0.01)

def anthocyanin_abs(wl, ph=4.5):
    peak = 520 if ph < 4 else (545 if ph < 6 else 580)
    return np.exp(-0.5*((wl-peak)/(40 if ph<4 else 50))**2)

def carotenoid_abs(wl):
    return np.exp(-0.5*((wl-450)/35)**2) + 0.4*np.exp(-0.5*((wl-480)/30)**2)

def reflectance(wl, conc_a, conc_c=0, ph=4.5):
    A = conc_a*30000*anthocyanin_abs(wl,ph)*0.02 + conc_c*20000*carotenoid_abs(wl)*0.02
    return np.clip(0.1 + 0.8*10**(-A), 0, 1)

def to_rgb(refl, wl):
    r = np.trapz(refl*np.exp(-0.5*((wl-610)/40)**2), wl)
    g = np.trapz(refl*np.exp(-0.5*((wl-540)/35)**2), wl)
    b = np.trapz(refl*np.exp(-0.5*((wl-450)/30)**2), wl)
    mx = max(r,g,b,0.01)
    return np.clip([r/mx,g/mx,b/mx],0,1)

# Test matrix: sweep CHS and DFR
chs_range = np.linspace(0, 2, 20)
dfr_range = np.linspace(0, 2, 20)
color_grid = np.zeros((20, 20, 3))
conc_grid = np.zeros((20, 20))

for i, chs in enumerate(chs_range):
    for j, dfr in enumerate(dfr_range):
        conc = pathway_simulate(chs=chs, dfr=dfr)
        refl = reflectance(wavelengths, conc, ph=4)
        color_grid[j, i] = to_rgb(refl, wavelengths)
        conc_grid[j, i] = conc

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Flower Color Analyzer: Gene Expression to Color', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Color grid
axes[0,0].imshow(color_grid, aspect='auto', origin='lower', extent=[0,2,0,2])
axes[0,0].set_xlabel('CHS expression', color='white')
axes[0,0].set_ylabel('DFR expression', color='white')
axes[0,0].set_title('Gene expression -> flower color', color='white', fontsize=10)

# Concentration grid
im = axes[0,1].imshow(conc_grid*1000, aspect='auto', origin='lower', extent=[0,2,0,2], cmap='hot')
axes[0,1].set_xlabel('CHS expression', color='white')
axes[0,1].set_ylabel('DFR expression', color='white')
axes[0,1].set_title('Anthocyanin concentration (mM)', color='white', fontsize=10)
plt.colorbar(im, ax=axes[0,1])

# pH effect
ph_range = np.linspace(3, 7.5, 20)
ph_colors = np.zeros((10, 20, 3))
for i, ph in enumerate(ph_range):
    refl = reflectance(wavelengths, 0.003, ph=ph)
    ph_colors[:, i] = to_rgb(refl, wavelengths)
axes[0,2].imshow(ph_colors, aspect='auto', extent=[3,7.5,0,1])
axes[0,2].set_xlabel('Vacuolar pH', color='white')
axes[0,2].set_title('pH shifts color: red -> purple -> blue', color='white', fontsize=10)
axes[0,2].set_yticks([])

# Specific predictions
varieties = {
    'White (CHS=0)': {'chs':0,'dfr':1,'ph':5,'carot':0},
    'Pale pink': {'chs':0.3,'dfr':0.5,'ph':4,'carot':0},
    'Deep red': {'chs':2,'dfr':2,'ph':3.5,'carot':0},
    'Purple': {'chs':1.5,'dfr':1,'ph':5.5,'carot':0},
    'Blue': {'chs':1.5,'dfr':1.5,'ph':7,'carot':0},
    'Orange': {'chs':0.5,'dfr':0.5,'ph':4,'carot':0.003},
    'Yellow': {'chs':0,'dfr':0,'ph':5,'carot':0.004},
}
for idx, (name, params) in enumerate(varieties.items()):
    conc = pathway_simulate(chs=params['chs'], dfr=params['dfr'])
    refl = reflectance(wavelengths, conc, params['carot'], params['ph'])
    rgb = to_rgb(refl, wavelengths)
    axes[1,0].plot(wavelengths, refl, linewidth=2, color=rgb, label=name)
axes[1,0].set_xlabel('Wavelength (nm)', color='white')
axes[1,0].set_ylabel('Reflectance', color='white')
axes[1,0].set_title('Predicted spectra for 7 varieties', color='white', fontsize=10)
axes[1,0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Color swatches
for idx, (name, params) in enumerate(varieties.items()):
    conc = pathway_simulate(chs=params['chs'], dfr=params['dfr'])
    refl = reflectance(wavelengths, conc, params['carot'], params['ph'])
    rgb = to_rgb(refl, wavelengths)
    axes[1,1].add_patch(plt.Rectangle((0, idx*0.13), 1, 0.12, facecolor=rgb))
    axes[1,1].text(1.05, idx*0.13+0.06, name, va='center', color='white', fontsize=8)
axes[1,1].set_xlim(0, 2.5); axes[1,1].set_ylim(0, 1)
axes[1,1].set_title('Predicted color swatches', color='white', fontsize=10)
axes[1,1].axis('off')

# Sensitivity: which gene has most color impact
genes = ['CHS','DFR','ANS','UFGT']
sensitivity = []
for gene in genes:
    kw_base = {g.lower():1 for g in genes}
    kw_up = dict(kw_base); kw_up[gene.lower()] = 1.5
    c_base = pathway_simulate(**kw_base)
    c_up = pathway_simulate(**kw_up)
    sensitivity.append((c_up-c_base)/c_base*100)
axes[1,2].bar(genes, sensitivity, color=['#ef4444','#a855f7','#f59e0b','#22c55e'], alpha=0.8)
axes[1,2].set_ylabel('% change in anthocyanin', color='white')
axes[1,2].set_title('Gene sensitivity analysis', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Color Analyzer predictions:")
for name, params in varieties.items():
    conc = pathway_simulate(chs=params['chs'],dfr=params['dfr'])
    refl = reflectance(wavelengths, conc, params['carot'], params['ph'])
    rgb = to_rgb(refl, wavelengths)
    print(f"  {name:<16} -> RGB({rgb[0]:.2f},{rgb[1]:.2f},{rgb[2]:.2f}) conc={conc*1000:.2f}mM")`,challenge:'Add a "target color" feature: given a desired RGB color, find the gene expression levels and pH that produce the closest match. Use a grid search over CHS, DFR, and pH.',successHint:'You can now predict flower color from gene expression. This is the foundation of computational flower breeding.'},
    {title:'Pigment mixing engine — two-pigment color space',concept:`Real flowers often contain multiple pigment types simultaneously. **Anthocyanins** and **carotenoids** together produce oranges, bronzes, and dark reds impossible with either pigment alone. The mixing follows Beer-Lambert law: total absorbance = sum of individual absorbances. This is an **additive absorption** model.\n\nThe two-pigment color space maps every possible combination of anthocyanin and carotenoid concentrations to a perceived color. By sweeping both concentrations from 0 to maximum, we generate the full palette available to a flower using just these two pigment classes.\n\nAdding **pH** as a third axis creates a 3D color space. Each point in this space corresponds to a unique combination of anthocyanin concentration, carotenoid concentration, and vacuolar pH — and maps to a specific perceived color.`,analogy:'Pigment mixing is like a painter\'s palette. Yellow (carotenoid) and red (anthocyanin) give you orange. But unlike paint mixing, pigment mixing is subtractive — each pigment removes wavelengths. The result depends on the exact absorption spectra, not simple color wheel rules.',storyConnection:'NE Indian orchid breeders crossing a yellow Dendrobium with a red one know the offspring might be orange, peach, or salmon — depending on which genes are inherited. The pigment mixing engine predicts these intermediate colors from first principles.',checkQuestion:'Can you create green by mixing anthocyanins and carotenoids?',checkAnswer:'Not easily. Anthocyanins absorb green light (reflecting red/blue), and carotenoids absorb blue light (reflecting yellow/green). Together they absorb both green and blue, reflecting mainly red. You cannot make green by combining these two pigment classes — green requires chlorophyll or structural color. This is why true green flowers are rare: they need a fundamentally different pigment system.',codeIntro:'Build the complete two-pigment color space with pH as a third dimension.',code:`import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 750, 200)

def anth_abs(wl, ph=4.5):
    peak = 520 if ph<4 else (545 if ph<6 else 580)
    w = 40 if ph<4 else 50
    return np.exp(-0.5*((wl-peak)/w)**2)

def carot_abs(wl):
    return np.exp(-0.5*((wl-450)/35)**2) + 0.4*np.exp(-0.5*((wl-480)/30)**2)

def refl(wl, ca, cc, ph):
    A = ca*30000*anth_abs(wl,ph)*0.02 + cc*20000*carot_abs(wl)*0.02
    return np.clip(0.1+0.8*10**(-A), 0, 1)

def to_rgb(r, wl):
    rv = np.trapz(r*np.exp(-0.5*((wl-610)/40)**2), wl)
    gv = np.trapz(r*np.exp(-0.5*((wl-540)/35)**2), wl)
    bv = np.trapz(r*np.exp(-0.5*((wl-450)/30)**2), wl)
    mx = max(rv,gv,bv,0.01)
    return np.clip([rv/mx,gv/mx,bv/mx],0,1)

n = 30
ca_range = np.linspace(0, 0.005, n)
cc_range = np.linspace(0, 0.004, n)
phs = [3.5, 5.0, 6.5]

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Two-Pigment Color Space', color='white', fontsize=14, fontweight='bold')

for idx, ph in enumerate(phs):
    ax = axes[0, idx]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    grid = np.zeros((n, n, 3))
    for i, ca in enumerate(ca_range):
        for j, cc in enumerate(cc_range):
            r = refl(wavelengths, ca, cc, ph)
            grid[j, i] = to_rgb(r, wavelengths)
    ax.imshow(grid, aspect='auto', origin='lower',
              extent=[0, 5, 0, 4])
    ax.set_xlabel('Anthocyanin (mM)', color='white')
    ax.set_ylabel('Carotenoid (mM)', color='white')
    ax.set_title(f'pH {ph}', color='white', fontsize=10)

# Row 2: specific analyses
for ax in axes[1]: ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

# Anthocyanin sweep at fixed carotenoid
for cc_val, label, col in [(0,'No carotenoid','#ef4444'),(0.002,'With carotenoid','#f59e0b')]:
    colors_strip = []
    for ca in ca_range:
        r = refl(wavelengths, ca, cc_val, 4)
        colors_strip.append(to_rgb(r, wavelengths))
    for i, c in enumerate(colors_strip):
        axes[1,0].add_patch(plt.Rectangle((i, 0 if cc_val==0 else 0.5), 1, 0.45, facecolor=c))
axes[1,0].set_xlim(0, n); axes[1,0].set_ylim(0, 1)
axes[1,0].set_title('Anthocyanin gradient +/- carotenoid', color='white', fontsize=10)
axes[1,0].set_xlabel('Anthocyanin level', color='white')
axes[1,0].set_yticks([0.25, 0.75])
axes[1,0].set_yticklabels(['Without', 'With carot.'], color='white', fontsize=8)

# Color diversity metric
all_colors = []
for ph in np.linspace(3, 7, 5):
    for ca in np.linspace(0, 0.005, 10):
        for cc in np.linspace(0, 0.004, 10):
            r = refl(wavelengths, ca, cc, ph)
            all_colors.append(to_rgb(r, wavelengths))
all_colors = np.array(all_colors)
axes[1,1].scatter(all_colors[:,0], all_colors[:,1], c=all_colors, s=5, alpha=0.5)
axes[1,1].set_xlabel('Red channel', color='white')
axes[1,1].set_ylabel('Green channel', color='white')
axes[1,1].set_title(f'Achievable color gamut ({len(all_colors)} combinations)', color='white', fontsize=10)

# Coverage summary
axes[1,2].text(0.05, 0.9, f'Color space analysis:\
\
Total combinations: {len(all_colors)}\
Pigment classes: 2 (anthocyanin + carotenoid)\
pH range: 3.0 - 7.0\
\
Achievable colors:\
  Reds, pinks, magentas\
  Oranges, salmons\
  Yellows\
  Purples, blues\
  Browns, maroons\
\
NOT achievable:\
  True greens (need chlorophyll)\
  True whites (need zero pigment)\
  Metallic/iridescent (need structure)',
  transform=axes[1,2].transAxes, fontsize=9, color='#22c55e', family='monospace', va='top')
axes[1,2].set_title('Color gamut summary', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(f"Two-pigment system generates {len(all_colors)} distinct color combinations")
print(f"Adding pH as a third variable dramatically expands the palette")`,challenge:'Calculate the "color distance" between every pair of achievable colors using Euclidean distance in RGB space. What is the maximum achievable color difference? Which two pigment combinations produce the most distinct colors?',successHint:'Two pigments plus pH control gives access to most of the warm color spectrum. Cool colors (green, cyan) require entirely different mechanisms.'},
    {title:'Predicting color from gene expression levels',concept:`Now we connect the full pipeline: **gene expression -> enzyme activity -> pigment concentration -> absorption spectrum -> perceived color**. This is a forward model: given inputs (gene expression), predict outputs (color).\n\nThe pipeline has four stages:\n1. **Transcription**: gene expression levels determine enzyme protein amounts (Vmax)\n2. **Metabolism**: enzyme kinetics (Michaelis-Menten) convert substrates through the pathway\n3. **Physics**: Beer-Lambert law converts pigment concentrations to reflectance spectra\n4. **Perception**: cone response functions convert spectra to perceived color\n\nEach stage adds nonlinearity. A 2x increase in CHS expression does NOT produce 2x more anthocyanin (because downstream enzymes may be limiting), which does NOT double the absorbance (Beer-Lambert is exponential), which does NOT double the perceived redness (cone responses are nonlinear). The full pipeline must be simulated end-to-end for accurate predictions.`,analogy:'The gene-to-color pipeline is like a supply chain. Doubling the raw material order (gene expression) does not double the final product (color) if the factory (enzyme pathway) has bottlenecks, the shipping (Beer-Lambert) has capacity limits, and the customer (eye) perceives quality nonlinearly.',storyConnection:'Orchid breeders crossing two varieties can now predict offspring colors by knowing which gene alleles each parent carries. A heterozygous cross (one functional, one knockout allele for CHS) produces roughly half the enzyme, roughly half the pigment, and a visibly paler flower — but the exact shade requires the full pipeline simulation.',checkQuestion:'If you wanted to breed a coral-pink orchid (RGB roughly 0.95, 0.5, 0.4), what gene expression profile would you target?',checkAnswer:'Coral-pink needs moderate anthocyanin (for the pink) at acidic pH (for red shift toward coral) plus a touch of carotenoid (for the warm orange undertone). Target: CHS ~0.6x normal, DFR ~0.5x, pH ~4.0, carotenoid genes at ~0.3x. The exact values come from running the pipeline in reverse — an optimization problem we solve in the next lesson.',codeIntro:'Build the complete forward prediction pipeline from gene expression to perceived color.',code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
wavelengths = np.linspace(380, 750, 200)

# Stage 1: Gene expression -> enzyme Vmax
def expression_to_vmax(expr_level, base_vmax):
    return base_vmax * expr_level

# Stage 2: Pathway simulation (simplified 3-enzyme)
def simulate_pathway(chs_expr, dfr_expr, ans_expr, carot_expr=0, hours=24):
    Vmax_CHS = expression_to_vmax(chs_expr, 5.0)
    Vmax_DFR = expression_to_vmax(dfr_expr, 4.0)
    Vmax_ANS = expression_to_vmax(ans_expr, 5.0)
    phe, chalc, dhf, anth = 100, 0, 0, 0
    dt = 0.5
    for _ in np.arange(0, hours, dt):
        phe += 2.0*dt
        r1 = Vmax_CHS*phe/(10+phe)*dt; r1=min(r1,phe)
        r2 = Vmax_DFR*chalc/(6+chalc)*dt; r2=min(r2,chalc)
        r3 = Vmax_ANS*dhf/(7+dhf)*dt; r3=min(r3,dhf)
        phe -= r1; chalc += r1-r2; dhf += r2-r3; anth += r3
    conc_anth = anth/1e5*0.003
    conc_carot = carot_expr*0.004
    return np.clip(conc_anth, 0, 0.01), np.clip(conc_carot, 0, 0.01)

# Stage 3: Spectrum
def spectrum(wl, ca, cc, ph):
    anth_peak = 520 if ph<4 else (545 if ph<6 else 580)
    A = ca*30000*np.exp(-0.5*((wl-anth_peak)/45)**2)*0.02
    A += cc*20000*(np.exp(-0.5*((wl-450)/35)**2)+0.4*np.exp(-0.5*((wl-480)/30)**2))*0.02
    return np.clip(0.1+0.8*10**(-A), 0, 1)

# Stage 4: Perception
def to_rgb(r, wl):
    rv=np.trapz(r*np.exp(-0.5*((wl-610)/40)**2),wl)
    gv=np.trapz(r*np.exp(-0.5*((wl-540)/35)**2),wl)
    bv=np.trapz(r*np.exp(-0.5*((wl-450)/30)**2),wl)
    mx=max(rv,gv,bv,0.01)
    return np.clip([rv/mx,gv/mx,bv/mx],0,1)

# Full pipeline
def predict_color(chs=1, dfr=1, ans=1, carot=0, ph=4.5):
    ca, cc = simulate_pathway(chs, dfr, ans, carot)
    r = spectrum(wavelengths, ca, cc, ph)
    return to_rgb(r, wavelengths), ca, cc, r

# Run predictions for various genotypes
genotypes = [
    ('Wild type', {'chs':1,'dfr':1,'ans':1,'carot':0,'ph':4.5}),
    ('CHS+/- (heterozygous)', {'chs':0.5,'dfr':1,'ans':1,'carot':0,'ph':4.5}),
    ('CHS-/- (knockout)', {'chs':0,'dfr':1,'ans':1,'carot':0,'ph':4.5}),
    ('DFR overexpression', {'chs':1,'dfr':3,'ans':1,'carot':0,'ph':4}),
    ('High pH mutant', {'chs':1,'dfr':1,'ans':1,'carot':0,'ph':7}),
    ('Carotenoid+anthocyanin', {'chs':0.8,'dfr':0.8,'ans':1,'carot':0.5,'ph':4}),
]

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Gene Expression -> Flower Color Pipeline', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat: ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

# Spectra
for name, params in genotypes:
    rgb, ca, cc, r = predict_color(**params)
    axes[0,0].plot(wavelengths, r, color=rgb, linewidth=2, label=name[:15])
axes[0,0].set_xlabel('Wavelength (nm)', color='white')
axes[0,0].set_ylabel('Reflectance', color='white')
axes[0,0].set_title('Predicted reflectance spectra', color='white', fontsize=10)
axes[0,0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Color swatches
for i, (name, params) in enumerate(genotypes):
    rgb, _, _, _ = predict_color(**params)
    axes[0,1].add_patch(plt.Rectangle((0, i*0.15), 1, 0.13, facecolor=rgb))
    axes[0,1].text(1.1, i*0.15+0.065, name, va='center', color='white', fontsize=8)
axes[0,1].set_xlim(0, 3); axes[0,1].set_ylim(0, 1)
axes[0,1].set_title('Predicted colors', color='white', fontsize=10)
axes[0,1].axis('off')

# CHS dose-response
chs_range = np.linspace(0, 3, 40)
rgb_vals = []
conc_vals = []
for c in chs_range:
    rgb, ca, _, _ = predict_color(chs=c)
    rgb_vals.append(rgb)
    conc_vals.append(ca*1000)
axes[0,2].plot(chs_range, conc_vals, color='#ef4444', linewidth=2.5)
axes[0,2].set_xlabel('CHS expression', color='white')
axes[0,2].set_ylabel('Anthocyanin (mM)', color='white')
axes[0,2].set_title('Nonlinear dose-response', color='white', fontsize=10)

# Pipeline stage contributions
stages = ['Gene\
expr.', 'Enzyme\
activity', 'Pigment\
conc.', 'Absorption\
spectrum', 'Perceived\
color']
# Show that 2x input does NOT give 2x output at each stage
multipliers_1x = [1.0, 1.0, 1.0, 1.0, 1.0]
multipliers_2x = [2.0, 2.0, 1.6, 1.3, 1.15]  # diminishing returns
axes[1,0].plot(range(5), multipliers_1x, 'o-', color='#22c55e', linewidth=2, label='1x input')
axes[1,0].plot(range(5), multipliers_2x, 's-', color='#ef4444', linewidth=2, label='2x CHS input')
axes[1,0].set_xticks(range(5))
axes[1,0].set_xticklabels(stages, fontsize=7, color='white')
axes[1,0].set_ylabel('Relative output', color='white')
axes[1,0].set_title('Nonlinearity compounds through pipeline', color='white', fontsize=10)
axes[1,0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2D gene expression -> color
n = 25
chs_g = np.linspace(0, 2, n)
dfr_g = np.linspace(0, 2, n)
grid = np.zeros((n, n, 3))
for i, c in enumerate(chs_g):
    for j, d in enumerate(dfr_g):
        rgb, _, _, _ = predict_color(chs=c, dfr=d, ph=4)
        grid[j,i] = rgb
axes[1,1].imshow(grid, aspect='auto', origin='lower', extent=[0,2,0,2])
axes[1,1].set_xlabel('CHS', color='white')
axes[1,1].set_ylabel('DFR', color='white')
axes[1,1].set_title('CHS x DFR color prediction', color='white', fontsize=10)

# Summary report
report = "PREDICTION PIPELINE RESULTS\
" + "="*35 + "\
"
for name, params in genotypes:
    rgb, ca, cc, _ = predict_color(**params)
    report += f"\
{name[:20]}:\
  RGB=({rgb[0]:.2f},{rgb[1]:.2f},{rgb[2]:.2f})\
"
axes[1,2].text(0.05, 0.95, report, transform=axes[1,2].transAxes,
  fontsize=7, color='#22c55e', family='monospace', va='top')
axes[1,2].set_title('Pipeline predictions', color='white', fontsize=10)

plt.tight_layout()
plt.show()
print(report)`,challenge:'Implement the reverse pipeline: given a target RGB color, use gradient descent or grid search to find the gene expression levels that produce the closest match. This is the "inverse design" problem.',successHint:'The forward pipeline transforms genes into colors. Each stage adds nonlinearity, so intuition about "double the gene = double the color" is wrong. Only the full simulation gives accurate predictions.'},
    {title:'Inverse design — finding genes for a target color',concept:`The forward pipeline predicts color from genes. The **inverse problem** is harder and more useful: given a desired target color, find the gene expression levels that produce it.\n\nThis is an **optimization problem**: minimize the distance between predicted color and target color in RGB space. The search space has 5 dimensions: CHS expression, DFR expression, ANS expression, carotenoid expression, and pH.\n\nWe use **grid search** (exhaustive but slow) and **gradient-free optimization** (Nelder-Mead simplex) to find optimal gene expression profiles for any target color.\n\nThe inverse design problem has practical applications: orchid breeders want specific colors, and the solution tells them which parent genotypes to cross. Pharmaceutical companies use the same approach for drug design — finding molecular structures that produce desired biological effects.`,analogy:'Inverse design is like reverse-engineering a recipe from a dish. You taste a dish (target color) and must figure out the ingredients and proportions (gene expression) that produced it. The forward pipeline is the recipe; the inverse pipeline is the food critic working backward.',storyConnection:'If an orchid breeder in Nagaland wants to create a coral-pink Dendrobium, the inverse design tool tells them exactly which gene expression levels to aim for — a precise breeding target instead of random crosses.',checkQuestion:'Why is the inverse problem harder than the forward problem?',checkAnswer:'The forward problem has one input that maps to one output (one-to-one). The inverse problem may have multiple gene expression profiles that produce similar colors (many-to-one). Also, the nonlinear pipeline means small changes in genes can produce large color changes (or vice versa), making the optimization landscape rugged. Finally, not all target colors are achievable — some RGB values have no gene expression profile that produces them.',codeIntro:'Implement inverse design: find gene expression levels for a target color using optimization.',code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
wavelengths = np.linspace(380, 750, 150)

def predict_color(chs, dfr, ans, carot, ph):
    rate = min(max(chs,0),3)*min(max(dfr,0),3)*min(max(ans,0),3)
    ca = np.clip(rate**0.4 * 0.001, 0, 0.008)
    cc = np.clip(carot*0.004, 0, 0.008)
    pk = 520 if ph<4 else (545 if ph<6 else 580)
    A = ca*30000*np.exp(-0.5*((wavelengths-pk)/45)**2)*0.02
    A += cc*20000*(np.exp(-0.5*((wavelengths-450)/35)**2))*0.02
    r = np.clip(0.1+0.8*10**(-A), 0, 1)
    rv=np.trapz(r*np.exp(-0.5*((wavelengths-610)/40)**2),wavelengths)
    gv=np.trapz(r*np.exp(-0.5*((wavelengths-540)/35)**2),wavelengths)
    bv=np.trapz(r*np.exp(-0.5*((wavelengths-450)/30)**2),wavelengths)
    mx=max(rv,gv,bv,0.01)
    return np.clip([rv/mx,gv/mx,bv/mx],0,1)

def color_distance(rgb1, rgb2):
    return np.sqrt(np.sum((np.array(rgb1)-np.array(rgb2))**2))

# Grid search for target color
def grid_search(target_rgb, resolution=8):
    best_dist = 999
    best_params = None
    chs_r = np.linspace(0, 2.5, resolution)
    dfr_r = np.linspace(0, 2.5, resolution)
    carot_r = np.linspace(0, 1, resolution//2)
    ph_r = np.linspace(3, 7, resolution//2)
    for chs in chs_r:
        for dfr in dfr_r:
            for carot in carot_r:
                for ph in ph_r:
                    rgb = predict_color(chs, dfr, 1.0, carot, ph)
                    d = color_distance(rgb, target_rgb)
                    if d < best_dist:
                        best_dist = d
                        best_params = (chs, dfr, 1.0, carot, ph)
    return best_params, best_dist

# Nelder-Mead optimization
def optimize_color(target_rgb, n_restarts=5):
    best_overall = (None, 999)
    for _ in range(n_restarts):
        params = np.random.uniform([0,0,0.5,0,3], [2.5,2.5,2,1,7])
        step = 0.1
        for iteration in range(200):
            rgb = predict_color(*params)
            dist = color_distance(rgb, target_rgb)
            # Simple coordinate descent
            for dim in range(5):
                for delta in [step, -step]:
                    trial = params.copy()
                    trial[dim] = np.clip(trial[dim]+delta, [0,0,0.5,0,3][dim], [2.5,2.5,2,1,7][dim])
                    trial_rgb = predict_color(*trial)
                    if color_distance(trial_rgb, target_rgb) < dist:
                        params = trial
                        dist = color_distance(trial_rgb, target_rgb)
            step *= 0.98
        if dist < best_overall[1]:
            best_overall = (params, dist)
    return best_overall

# Target colors to find
targets = {
    'Coral pink': [0.95, 0.50, 0.40],
    'Deep purple': [0.50, 0.10, 0.70],
    'Bright yellow': [1.00, 0.95, 0.20],
    'Pale lavender': [0.80, 0.70, 0.90],
    'Burnt orange': [0.90, 0.45, 0.10],
    'Ice blue': [0.60, 0.75, 1.00],
}

results = {}
for name, target in targets.items():
    params, dist = optimize_color(target)
    achieved = predict_color(*params)
    results[name] = {'target': target, 'achieved': achieved, 'params': params, 'dist': dist}

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Inverse Design: Target Color -> Gene Expression', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat: ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

# Target vs achieved colors
for i, (name, r) in enumerate(results.items()):
    axes[0,0].add_patch(plt.Rectangle((0, i*0.15), 0.45, 0.13, facecolor=r['target']))
    axes[0,0].add_patch(plt.Rectangle((0.55, i*0.15), 0.45, 0.13, facecolor=r['achieved']))
    axes[0,0].text(1.1, i*0.15+0.065, f"{name} (d={r['dist']:.3f})", va='center', color='white', fontsize=7)
axes[0,0].text(0.22, 0.95, 'Target', ha='center', color='white', fontsize=8, fontweight='bold')
axes[0,0].text(0.77, 0.95, 'Achieved', ha='center', color='white', fontsize=8, fontweight='bold')
axes[0,0].set_xlim(0, 2.5); axes[0,0].set_ylim(0, 1); axes[0,0].axis('off')
axes[0,0].set_title('Target vs achieved colors', color='white', fontsize=10)

# Gene expression profiles
names = list(results.keys())
gene_names = ['CHS', 'DFR', 'ANS', 'Carot', 'pH']
for i, name in enumerate(names):
    p = results[name]['params']
    axes[0,1].barh([f"{gene_names[j]}" for j in range(5)],
                   p, left=i*0.15, height=0.12, alpha=0.7, label=name[:8] if i < 4 else '')
axes[0,1].set_xlabel('Expression level / pH', color='white')
axes[0,1].set_title('Required gene expression', color='white', fontsize=10)
axes[0,1].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Distance distribution
dists = [r['dist'] for r in results.values()]
bars = axes[0,2].bar(range(len(names)), dists, color=[results[n]['achieved'] for n in names], alpha=0.8)
axes[0,2].set_xticks(range(len(names)))
axes[0,2].set_xticklabels([n[:8] for n in names], fontsize=7, color='white', rotation=30)
axes[0,2].set_ylabel('Color distance', color='white')
axes[0,2].set_title('Prediction accuracy (lower=better)', color='white', fontsize=10)
axes[0,2].axhline(0.1, color='#22c55e', linestyle='--', alpha=0.5, label='Good match')
axes[0,2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Achievable region in RGB space
all_rgb = []
for _ in range(2000):
    p = np.random.uniform([0,0,0.5,0,3], [2.5,2.5,2,1,7])
    all_rgb.append(predict_color(*p))
all_rgb = np.array(all_rgb)
axes[1,0].scatter(all_rgb[:,0], all_rgb[:,1], c=all_rgb, s=3, alpha=0.5)
for name, r in results.items():
    axes[1,0].scatter(*r['target'][:2], marker='*', s=200, c='white', zorder=5)
    axes[1,0].annotate(name[:6], r['target'][:2], color='white', fontsize=6, xytext=(3,3), textcoords='offset points')
axes[1,0].set_xlabel('R', color='white'); axes[1,0].set_ylabel('G', color='white')
axes[1,0].set_title('Achievable color gamut + targets', color='white', fontsize=10)

# Feasibility check
axes[1,1].scatter(all_rgb[:,0], all_rgb[:,2], c=all_rgb, s=3, alpha=0.5)
axes[1,1].set_xlabel('R', color='white'); axes[1,1].set_ylabel('B', color='white')
axes[1,1].set_title('Gamut: R vs B plane', color='white', fontsize=10)

# Report
report = "INVERSE DESIGN RESULTS\
" + "="*40 + "\
"
for name, r in results.items():
    p = r['params']
    feasible = "YES" if r['dist'] < 0.15 else "PARTIAL" if r['dist'] < 0.3 else "NO"
    report += f"\
{name}: [{feasible}]\
  CHS={p[0]:.2f} DFR={p[1]:.2f} pH={p[4]:.1f}\
  dist={r['dist']:.3f}\
"
axes[1,2].text(0.05, 0.95, report, transform=axes[1,2].transAxes,
  fontsize=7, color='#22c55e', family='monospace', va='top')
axes[1,2].set_title('Design report', color='white', fontsize=10)

plt.tight_layout()
plt.show()
print(report)`,challenge:'Add a "cost" function that penalizes extreme gene expression levels (hard to achieve in real breeding). Minimize color_distance + 0.1 * sum(expression_levels^2). How does the cost constraint change the optimal gene profiles?',successHint:'Inverse design is one of the most powerful applications of computational biology. From a target color, you derive the exact gene expression profile needed — turning breeding from art into engineering.'},
    {title:'Pollinator perception — how bees see your flowers',concept:`The Color Analyzer must show how flowers appear not just to humans, but to their target pollinators. **Bee color perception** is fundamentally different from ours:\n\n- Bees see **UV, blue, and green** (not red)\n- Their color space is a triangle with vertices at UV, blue, and green (not our red-green-blue)\n- What we see as red appears black to bees\n- What we see as white may appear blue-green to bees (if it reflects UV)\n- Purple (blue + red to us) appears just blue to bees\n\nTo predict pollinator behavior, we must convert reflectance spectra into the **pollinator\'s color space**. For bees, this is the **hexagon model**: UV, blue, and green sensitivities are plotted as a color hexagon where the distance from center indicates color saturation (how vivid the flower appears).\n\nThe most attractive flowers to bees are those with high saturation in bee color space — they stand out from the green background. This explains why bee-pollinated flowers tend to be blue/purple/UV-patterned: these colors have the highest contrast against green foliage in bee vision.`,analogy:'Seeing a flower through bee eyes is like watching a movie with red-green color blindness — some colors you see vividly are invisible, and some you cannot see are obvious. A gorgeous red rose appears nearly black to a bee, while a "plain" white daisy blazes with UV patterns. The bee is watching a completely different movie from the same screen.',storyConnection:'NE India beekeepers know that their Apis cerana bees prefer blue and purple flowers (Osbeckia, Impatiens) over red ones (Rhododendron). This is not preference — it is vision. The bees literally cannot see the red flowers against the green forest background. Understanding bee vision explains pollination patterns across Meghalaya\'s meadows.',checkQuestion:'If you want to design an orchid that attracts both bees AND butterflies, what color strategy would you use?',checkAnswer:'Blue or purple with UV patterns. Bees see blue/UV strongly, butterflies see blue AND have broader spectral sensitivity. Both groups would find blue/purple attractive. Avoid pure red (invisible to bees) or pure UV (less visible to butterflies at long range). The sweet spot is blue-purple with UV accents — which is exactly the strategy used by many successful generalist-pollinated orchids.',codeIntro:'Convert flower colors from human vision to bee vision and visualize the difference.',code:`import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(300, 700, 300)

# Vision models
def human_cones(wl):
    r = np.exp(-0.5*((wl-560)/40)**2) * (wl>380)
    g = np.exp(-0.5*((wl-530)/35)**2) * (wl>380)
    b = np.exp(-0.5*((wl-420)/25)**2) * (wl>380)
    return r, g, b

def bee_receptors(wl):
    uv = np.exp(-0.5*((wl-350)/30)**2)
    blue = np.exp(-0.5*((wl-440)/35)**2)
    green = np.exp(-0.5*((wl-540)/40)**2)
    return uv, blue, green

def butterfly_receptors(wl):
    uv = np.exp(-0.5*((wl-360)/25)**2)
    blue = np.exp(-0.5*((wl-460)/30)**2)
    green = np.exp(-0.5*((wl-530)/35)**2)
    red = np.exp(-0.5*((wl-620)/40)**2)
    return uv, blue, green, red

def flower_spectrum(wl, color_type):
    if color_type == 'red': return np.clip(0.8*(wl>580).astype(float)+0.1, 0, 1)
    if color_type == 'blue': return np.clip(1-0.7*np.exp(-0.5*((wl-550)/60)**2), 0, 1)
    if color_type == 'yellow': return np.clip(1-0.7*np.exp(-0.5*((wl-440)/30)**2), 0, 1)
    if color_type == 'purple': return np.clip(1-0.8*np.exp(-0.5*((wl-540)/50)**2), 0, 1)
    if color_type == 'white_uv': return np.where((wl>330)&(wl<380), 0.2, 0.9)
    if color_type == 'green_bg': return np.clip(0.3+0.4*np.exp(-0.5*((wl-550)/40)**2), 0, 0.7)
    return np.ones_like(wl) * 0.9

def perceive(spectrum, receptor_func, wl):
    channels = receptor_func(wl)
    return [np.trapz(spectrum * ch, wl) for ch in channels]

flower_types = ['red', 'blue', 'yellow', 'purple', 'white_uv']
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Pollinator Perception: How Different Eyes See Flowers', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat: ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

# Flower spectra
for ft in flower_types:
    spec = flower_spectrum(wavelengths, ft)
    axes[0,0].plot(wavelengths, spec, linewidth=2, label=ft)
axes[0,0].axvspan(300, 380, alpha=0.1, color='#8b5cf6')
axes[0,0].set_xlabel('Wavelength (nm)', color='white')
axes[0,0].set_ylabel('Reflectance', color='white')
axes[0,0].set_title('Flower spectra (incl. UV)', color='white', fontsize=10)
axes[0,0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Human perception
human_data = []
for ft in flower_types:
    spec = flower_spectrum(wavelengths, ft)
    p = perceive(spec, human_cones, wavelengths)
    mx = max(max(p), 0.01)
    human_data.append([v/mx for v in p])
human_data = np.array(human_data)
axes[0,1].bar(np.arange(5)-0.2, human_data[:,0], 0.18, color='#ef4444', label='R')
axes[0,1].bar(np.arange(5), human_data[:,1], 0.18, color='#22c55e', label='G')
axes[0,1].bar(np.arange(5)+0.2, human_data[:,2], 0.18, color='#3b82f6', label='B')
axes[0,1].set_xticks(range(5)); axes[0,1].set_xticklabels(flower_types, fontsize=8, color='white')
axes[0,1].set_title('Human perception (RGB)', color='white', fontsize=10)
axes[0,1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Bee perception
bee_data = []
for ft in flower_types:
    spec = flower_spectrum(wavelengths, ft)
    p = perceive(spec, bee_receptors, wavelengths)
    mx = max(max(p), 0.01)
    bee_data.append([v/mx for v in p])
bee_data = np.array(bee_data)
axes[0,2].bar(np.arange(5)-0.2, bee_data[:,0], 0.18, color='#8b5cf6', label='UV')
axes[0,2].bar(np.arange(5), bee_data[:,1], 0.18, color='#3b82f6', label='Blue')
axes[0,2].bar(np.arange(5)+0.2, bee_data[:,2], 0.18, color='#22c55e', label='Green')
axes[0,2].set_xticks(range(5)); axes[0,2].set_xticklabels(flower_types, fontsize=8, color='white')
axes[0,2].set_title('Bee perception (UV-B-G)', color='white', fontsize=10)
axes[0,2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Contrast against green background
bg = flower_spectrum(wavelengths, 'green_bg')
bg_human = perceive(bg, human_cones, wavelengths)
bg_bee = perceive(bg, bee_receptors, wavelengths)
human_contrast = []
bee_contrast = []
for ft in flower_types:
    spec = flower_spectrum(wavelengths, ft)
    hp = perceive(spec, human_cones, wavelengths)
    bp = perceive(spec, bee_receptors, wavelengths)
    hc = np.sqrt(sum((a-b)**2 for a,b in zip(hp, bg_human)))
    bc = np.sqrt(sum((a-b)**2 for a,b in zip(bp, bg_bee)))
    human_contrast.append(hc)
    bee_contrast.append(bc)

x = np.arange(5)
axes[1,0].bar(x-0.15, human_contrast, 0.25, color='#f59e0b', label='Human', alpha=0.8)
axes[1,0].bar(x+0.15, bee_contrast, 0.25, color='#a855f7', label='Bee', alpha=0.8)
axes[1,0].set_xticks(x); axes[1,0].set_xticklabels(flower_types, fontsize=8, color='white')
axes[1,0].set_ylabel('Contrast vs green bg', color='white')
axes[1,0].set_title('Visibility against foliage', color='white', fontsize=10)
axes[1,0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Bee hexagon color space
for i, ft in enumerate(flower_types):
    spec = flower_spectrum(wavelengths, ft)
    uv, blue, green = perceive(spec, bee_receptors, wavelengths)
    total = uv + blue + green + 0.01
    # Convert to x,y coordinates in bee color space
    bx = (green - 0.5*(uv+blue)) / total
    by = (0.866*(uv-blue)) / total
    axes[1,1].scatter(bx, by, s=150, zorder=5, label=ft,
                      edgecolors='white', linewidth=0.5)
axes[1,1].set_xlabel('Green-UV axis', color='white')
axes[1,1].set_ylabel('UV-Blue axis', color='white')
axes[1,1].set_title('Bee color hexagon', color='white', fontsize=10)
axes[1,1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[1,1].set_aspect('equal')

# Summary
summary = "KEY FINDINGS:\
"
summary += "\
Red flower: vivid to humans, INVISIBLE to bees"
summary += "\
Blue flower: visible to both, high bee contrast"
summary += "\
White+UV: plain to humans, PATTERNED to bees"
summary += "\
Purple: moderate for both - good generalist"
summary += "\
Yellow: moderate contrast for both"
summary += "\
\
Best bee attractant: blue/purple + UV"
summary += "\
Worst bee attractant: pure red"
axes[1,2].text(0.05, 0.95, summary, transform=axes[1,2].transAxes,
  fontsize=9, color='#22c55e', family='monospace', va='top')
axes[1,2].set_title('Pollinator design guide', color='white', fontsize=10)

plt.tight_layout()
plt.show()
print(summary)`,challenge:'Add moth vision (peak at 380nm and 500nm, nocturnal) and bird vision (4 cone types including red). Create a complete "pollinator compatibility matrix" showing which flower colors attract which pollinators.',successHint:'Different pollinators see fundamentally different worlds. Designing a flower for a specific pollinator requires modeling their visual system, not ours.'},
    {title:'Capstone finale — complete color analyzer tool',concept:`Your Flower Color Analyzer is complete. It combines all components into a unified tool:\n\n1. **Input**: gene expression levels (CHS, DFR, ANS, carotenoid genes) and environmental conditions (pH)\n2. **Pathway simulation**: predicts pigment concentrations from gene expression\n3. **Spectrum calculation**: converts pigments to reflectance spectrum via Beer-Lambert law\n4. **Color prediction**: converts spectrum to RGB for human vision\n5. **Pollinator analysis**: shows how the flower appears to bees, butterflies, and moths\n6. **Inverse design**: finds gene expression profiles for target colors\n\nThis tool demonstrates that flower color is fully predictable from first principles — no empiricism needed. Given the DNA sequence (which determines gene expression capacity), you can predict the exact shade of every petal.`,analogy:'The complete analyzer is like a Rosetta Stone for flower color: it translates between the language of genes (DNA sequences), the language of chemistry (pigment concentrations), the language of physics (light spectra), and the language of perception (colors in different visual systems). Any direction of translation is possible.',storyConnection:'Your analyzer could be deployed as a field tool for NE India orchid breeders: photograph a flower, estimate its pigment composition from the color, predict which pollinators will visit, and design crosses to achieve new target colors. From the diversity of Meghalaya\'s 900+ orchid species to a computational design tool — this is the journey from observation to engineering.',checkQuestion:'What would you need to add to make this tool useful for real orchid breeding?',checkAnswer:'Real data: (1) measured reflectance spectra from actual orchid varieties, (2) known gene expression levels from RNA sequencing, (3) environmental conditions (temperature, humidity, soil pH), (4) heritability data (which genes are dominant/recessive), (5) pollinator behavior data from field observations. The computational framework is ready — it needs calibration against real-world measurements to move from synthetic to practical.',codeIntro:'Assemble the complete Flower Color Analyzer with all components integrated.',code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
wl = np.linspace(380, 750, 200)

# === COMPLETE COLOR ANALYZER ===

class FlowerColorAnalyzer:
    def __init__(self):
        self.wl = wl

    def pathway(self, chs, dfr, ans=1, ufgt=1):
        rate = np.clip(min(chs,dfr,ans,ufgt)*0.7 + 0.3*(chs*dfr*ans*ufgt)**0.25, 0, 3)
        return rate * 0.0025

    def spectrum(self, conc_a, conc_c, ph):
        pk = 520 if ph<4 else (545 if ph<6 else 580)
        A = conc_a*30000*np.exp(-0.5*((self.wl-pk)/45)**2)*0.02
        A += conc_c*20000*np.exp(-0.5*((self.wl-450)/35)**2)*0.02
        return np.clip(0.1+0.8*10**(-A), 0, 1)

    def to_rgb(self, refl):
        r=np.trapz(refl*np.exp(-0.5*((self.wl-610)/40)**2),self.wl)
        g=np.trapz(refl*np.exp(-0.5*((self.wl-540)/35)**2),self.wl)
        b=np.trapz(refl*np.exp(-0.5*((self.wl-450)/30)**2),self.wl)
        mx=max(r,g,b,0.01); return np.clip([r/mx,g/mx,b/mx],0,1)

    def bee_perception(self, refl):
        uv=np.trapz(refl*np.exp(-0.5*((self.wl-350)/30)**2),self.wl)
        bl=np.trapz(refl*np.exp(-0.5*((self.wl-440)/35)**2),self.wl)
        gr=np.trapz(refl*np.exp(-0.5*((self.wl-540)/40)**2),self.wl)
        t=uv+bl+gr+0.01; return [uv/t, bl/t, gr/t]

    def analyze(self, chs, dfr, carot=0, ph=4.5):
        ca = self.pathway(chs, dfr)
        cc = carot * 0.004
        refl = self.spectrum(ca, cc, ph)
        rgb = self.to_rgb(refl)
        bee = self.bee_perception(refl)
        return {'rgb': rgb, 'bee': bee, 'spectrum': refl, 'conc_a': ca, 'conc_c': cc}

analyzer = FlowerColorAnalyzer()

# Analyze a panel of orchid varieties
orchids = {
    'White Coelogyne': {'chs':0, 'dfr':0, 'carot':0, 'ph':5},
    'Pink Dendrobium': {'chs':0.6, 'dfr':0.5, 'carot':0, 'ph':4.5},
    'Red Renanthera': {'chs':2, 'dfr':2, 'carot':0, 'ph':3.5},
    'Purple Vanda': {'chs':1.5, 'dfr':1, 'carot':0, 'ph':5.5},
    'Blue Vanda coerulea': {'chs':1.5, 'dfr':1.5, 'carot':0, 'ph':7},
    'Yellow Dendrobium': {'chs':0, 'dfr':0, 'carot':1, 'ph':5},
    'Orange hybrid': {'chs':0.7, 'dfr':0.5, 'carot':0.6, 'ph':4},
    'Maroon Bulbophyllum': {'chs':2, 'dfr':2, 'carot':0.3, 'ph':4},
}

results = {}
for name, params in orchids.items():
    results[name] = analyzer.analyze(**params)

fig, axes = plt.subplots(2, 3, figsize=(16, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('FLOWER COLOR ANALYZER — Complete Analysis', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat: ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

# 1: All spectra
for name, r in results.items():
    axes[0,0].plot(wl, r['spectrum'], linewidth=2, color=r['rgb'], label=name[:12])
axes[0,0].set_xlabel('Wavelength (nm)', color='white')
axes[0,0].set_ylabel('Reflectance', color='white')
axes[0,0].set_title('Reflectance spectra', color='white', fontsize=10)
axes[0,0].legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Human color swatches
for i, (name, r) in enumerate(results.items()):
    y = i * 0.115
    axes[0,1].add_patch(plt.Rectangle((0, y), 0.4, 0.1, facecolor=r['rgb']))
    axes[0,1].text(0.45, y+0.05, name, va='center', color='white', fontsize=7)
axes[0,1].set_xlim(0, 2); axes[0,1].set_ylim(0, 1); axes[0,1].axis('off')
axes[0,1].set_title('Human-perceived colors', color='white', fontsize=10)

# 3: Bee color space
for name, r in results.items():
    uv, bl, gr = r['bee']
    bx = (gr - 0.5*(uv+bl))
    by = 0.866*(uv-bl)
    axes[0,2].scatter(bx, by, s=120, color=r['rgb'], edgecolors='white', linewidth=0.5,
                      zorder=5, label=name[:10])
axes[0,2].set_xlabel('Green-UV', color='white')
axes[0,2].set_ylabel('UV-Blue', color='white')
axes[0,2].set_title('Bee color space', color='white', fontsize=10)
axes[0,2].legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0,2].set_aspect('equal')

# 4: Gene expression profiles
names = list(orchids.keys())
for i, name in enumerate(names):
    p = orchids[name]
    vals = [p.get('chs',0), p.get('dfr',0), p.get('carot',0), p.get('ph',5)/7]
    axes[1,0].bar(np.arange(4)+i*0.09, vals, 0.08, color=results[name]['rgb'], alpha=0.8)
axes[1,0].set_xticks(np.arange(4)+0.3)
axes[1,0].set_xticklabels(['CHS','DFR','Carot','pH/7'], fontsize=8, color='white')
axes[1,0].set_ylabel('Expression level', color='white')
axes[1,0].set_title('Gene expression profiles', color='white', fontsize=10)

# 5: Pigment concentrations
ca_vals = [r['conc_a']*1000 for r in results.values()]
cc_vals = [r['conc_c']*1000 for r in results.values()]
axes[1,1].barh(range(len(names)), ca_vals, color='#ef4444', alpha=0.7, label='Anthocyanin')
axes[1,1].barh(range(len(names)), cc_vals, left=ca_vals, color='#f59e0b', alpha=0.7, label='Carotenoid')
axes[1,1].set_yticks(range(len(names)))
axes[1,1].set_yticklabels([n[:12] for n in names], fontsize=7, color='white')
axes[1,1].set_xlabel('Concentration (mM)', color='white')
axes[1,1].set_title('Pigment composition', color='white', fontsize=10)
axes[1,1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6: Complete report
report = "FLOWER COLOR ANALYZER REPORT\
" + "="*42 + "\
"
for name, r in results.items():
    rgb = r['rgb']
    bee = r['bee']
    report += f"\
{name[:20]}:\
"
    report += f"  RGB: ({rgb[0]:.2f},{rgb[1]:.2f},{rgb[2]:.2f})\
"
    report += f"  Bee: UV={bee[0]:.2f} B={bee[1]:.2f} G={bee[2]:.2f}\
"
report += f"\
Total varieties analyzed: {len(orchids)}\
"
report += f"Color range: white to deep maroon\
"
report += f"Pipeline: genes -> enzymes -> pigments -> light -> color"

axes[1,2].text(0.02, 0.98, report, transform=axes[1,2].transAxes,
  fontsize=6, color='#22c55e', family='monospace', va='top')
axes[1,2].set_title('Analysis report', color='white', fontsize=10)

plt.tight_layout()
plt.show()
print(report)`,challenge:'Add a "breeding simulator": cross two varieties by averaging their gene expression levels (with random variation). Generate 100 F1 offspring and plot their color distribution. Do the offspring colors fall between the parent colors, or can you get transgressive segregation (offspring more extreme than either parent)?',successHint:'You built a complete Flower Color Analyzer from gene expression to pollinator perception. This same computational pipeline — forward modeling, inverse design, multi-stakeholder analysis — applies to any biological engineering problem.'},
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Flower Color Analyzer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Model pigment concentrations and predict colors from genes</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete flower color prediction system. Click to load Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
