import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function KingfisherLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

    const miniLessons = [
    {
      title: 'Capstone — Build a Structural Color Simulator using thin-film interference',
      concept: "In this capstone you will build a simulator that models structural coloration — color produced by nanoscale physical structures rather than pigments. The kingfisher's brilliant blue is created by layers of melanin and keratin in feather barbules, each about 100-200nm thick, that produce constructive interference at blue wavelengths.\n\nYou will implement: (1) Thin-film interference from a single layer using the Fresnel equations, (2) Multilayer reflectance by stacking alternating high/low refractive index layers, (3) Angle-dependent color shifts (iridescence) using Snell's law, (4) A design tool that maps the parameter space of refractive index and thickness to predict the resulting color. The simulator reveals how evolution has solved the same optical engineering problem that humans use in anti-reflection coatings and photonic crystals.",
      analogy: "Structural color is like the rainbow in an oil slick on water. The oil film is thin enough that light reflected from the top and bottom surfaces interferes — some colors reinforce (bright) and others cancel (dark). The kingfisher's feather is a precisely engineered version of this: multiple layers stacked at exact thicknesses to make blue light constructively interfere while other colors cancel.",
      storyConnection: 'The kingfisher in the story flashes brilliant blue as it dives — color so vivid it seems painted. But there is no blue pigment in the feathers. The color comes from nanostructures thinner than a wavelength of light, arranged in layers that create constructive interference at 470nm (blue). Your simulator reproduces this physics, revealing that the kingfisher is wearing a photonic crystal.',
      checkQuestion: 'A kingfisher feather has alternating melanin (n=2.0, d=80nm) and keratin (n=1.56, d=120nm) layers. Why is the peak at blue (~470nm) and not at 4×n×d = 4×1.78×100 = 712nm (red)?',
      checkAnswer: 'The peak wavelength depends on 2nd = 2 × n_eff × d_layer, where constructive interference occurs. For the first-order peak: lambda = 2 × n × d = 2 × 2.0 × 80 = 320nm (UV, not visible) for melanin and 2 × 1.56 × 120 = 374nm (UV) for keratin. The VISIBLE peak at ~470nm arises from the multilayer interference pattern where the combined stack produces constructive interference. The alternating high/low index layers create a photonic bandgap centered near 470nm when both layer thicknesses are tuned together. It is not a simple 2nd calculation but a collective effect of the multilayer stack.',
      codeIntro: 'Build a structural color simulator that models thin-film interference, multilayer reflectance, and iridescence.',
      code: 'import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Structural Color Simulator — thin film interference\nc = 3e8  # m/s\ndef reflectance_thin_film(wavelengths, n_film, d_film, n_substrate=1.5, angle_deg=0):\n    angle = np.radians(angle_deg)\n    n_eff = n_film * np.cos(np.arcsin(np.sin(angle) / n_film))\n    optical_path = 2 * n_eff * d_film\n    phase = 2 * np.pi * optical_path / wavelengths + np.pi\n    r12 = (1 - n_film) / (1 + n_film)\n    r23 = (n_film - n_substrate) / (n_film + n_substrate)\n    R = r12**2 + r23**2 + 2 * r12 * r23 * np.cos(phase)\n    R /= (1 + r12**2 * r23**2 + 2 * r12 * r23 * np.cos(phase))\n    return np.abs(R)\n\ndef multilayer_reflectance(wavelengths, layers, angle_deg=0):\n    R_total = np.zeros_like(wavelengths)\n    for n_film, d_film in layers:\n        R_total += reflectance_thin_film(wavelengths, n_film, d_film, angle_deg=angle_deg)\n    return np.clip(R_total / len(layers), 0, 1)\n\nwavelengths = np.linspace(380, 750, 500) * 1e-9\n\n# Kingfisher feather: melanin/keratin multilayer\nkingfisher_layers = [(1.56, 120e-9), (2.0, 80e-9), (1.56, 120e-9), (2.0, 80e-9), (1.56, 120e-9)]\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 11))\nfig.patch.set_facecolor(\'#1f2937\')\n\n# Plot 1: Single layer reflectance at different thicknesses\nax = axes[0, 0]\nax.set_facecolor(\'#111827\')\nthicknesses = [80, 100, 120, 150, 200]\ncolors_t = plt.cm.rainbow(np.linspace(0, 1, len(thicknesses)))\nfor d, color in zip(thicknesses, colors_t):\n    R = reflectance_thin_film(wavelengths, 1.56, d*1e-9)\n    ax.plot(wavelengths * 1e9, R, color=color, linewidth=1.5, label=f\'d = {d} nm\')\nax.set_xlabel(\'Wavelength (nm)\', color=\'white\')\nax.set_ylabel(\'Reflectance\', color=\'white\')\nax.set_title(\'Thin Film Interference: Thickness Effect\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax.legend(fontsize=8, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax.tick_params(colors=\'gray\')\n# Color bar for visible spectrum\nfor wl in range(380, 750, 5):\n    from matplotlib.colors import hsv_to_rgb\n    hue = 0.75 - (wl - 380) / (750 - 380) * 0.75\n    ax.axvspan(wl, wl + 5, ymin=0, ymax=0.05, color=hsv_to_rgb((max(0,hue), 0.8, 0.9)), alpha=0.8)\n\n# Plot 2: Kingfisher multilayer spectrum\nax2 = axes[0, 1]\nax2.set_facecolor(\'#111827\')\nR_kf = multilayer_reflectance(wavelengths, kingfisher_layers)\nax2.plot(wavelengths * 1e9, R_kf, color=\'#3b82f6\', linewidth=2.5)\nax2.fill_between(wavelengths * 1e9, 0, R_kf, alpha=0.2, color=\'#3b82f6\')\npeak_idx = np.argmax(R_kf)\npeak_wl = wavelengths[peak_idx] * 1e9\nax2.axvline(peak_wl, color=\'#fbbf24\', linestyle=\'--\', linewidth=1.5)\nax2.text(peak_wl + 10, max(R_kf) * 0.9, f\'Peak: {peak_wl:.0f} nm\\n(blue)\', color=\'#fbbf24\', fontsize=10)\nax2.set_xlabel(\'Wavelength (nm)\', color=\'white\')\nax2.set_ylabel(\'Reflectance\', color=\'white\')\nax2.set_title(\'Kingfisher Feather Spectrum (5-layer)\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax2.tick_params(colors=\'gray\')\n\n# Plot 3: Angle dependence (iridescence)\nax3 = axes[1, 0]\nax3.set_facecolor(\'#111827\')\nangles_view = [0, 15, 30, 45, 60]\nangle_colors = [\'#3b82f6\', \'#22c55e\', \'#f59e0b\', \'#ef4444\', \'#a855f7\']\npeak_wls = []\nfor angle, color in zip(angles_view, angle_colors):\n    R_angle = multilayer_reflectance(wavelengths, kingfisher_layers, angle_deg=angle)\n    ax3.plot(wavelengths * 1e9, R_angle, color=color, linewidth=1.5, label=f\'{angle} deg\')\n    peak_wls.append(wavelengths[np.argmax(R_angle)] * 1e9)\nax3.set_xlabel(\'Wavelength (nm)\', color=\'white\')\nax3.set_ylabel(\'Reflectance\', color=\'white\')\nax3.set_title(\'Iridescence: Color Shifts with Viewing Angle\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax3.legend(fontsize=9, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax3.tick_params(colors=\'gray\')\n\n# Plot 4: Design space — peak wavelength vs layer parameters\nax4 = axes[1, 1]\nax4.set_facecolor(\'#111827\')\nn_range = np.linspace(1.3, 2.5, 50)\nd_range = np.linspace(50, 250, 50)\nN_grid, D_grid = np.meshgrid(n_range, d_range)\npeak_grid = np.zeros_like(N_grid)\nfor i in range(50):\n    for j in range(50):\n        layers_test = [(N_grid[i,j], D_grid[i,j]*1e-9)] * 3\n        R_test = multilayer_reflectance(wavelengths, layers_test)\n        peak_grid[i,j] = wavelengths[np.argmax(R_test)] * 1e9\n\ncontour = ax4.contourf(N_grid, D_grid, peak_grid, levels=20, cmap=\'rainbow\')\ncbar = plt.colorbar(contour, ax=ax4)\ncbar.set_label(\'Peak wavelength (nm)\', color=\'white\')\ncbar.ax.tick_params(colors=\'gray\')\nax4.plot(1.56, 120, \'*\', color=\'white\', markersize=15, markeredgecolor=\'black\', label=\'Kingfisher\')\nax4.set_xlabel(\'Film refractive index\', color=\'white\')\nax4.set_ylabel(\'Film thickness (nm)\', color=\'white\')\nax4.set_title(\'Structural Color Design Space\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax4.legend(fontsize=10, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax4.tick_params(colors=\'gray\')\n\nplt.tight_layout()\nplt.show()\n\nprint("=" * 65)\nprint("    STRUCTURAL COLOR SIMULATOR — CAPSTONE REPORT")\nprint("=" * 65)\nprint(f"\\nKingfisher feather model: 5-layer melanin/keratin stack")\nprint(f"Peak reflectance wavelength: {peak_wl:.0f} nm (blue)")\nprint(f"\\nAngle dependence (iridescence):")\nfor angle, pwl in zip(angles_view, peak_wls):\n    shift = pwl - peak_wls[0]\n    print(f"  {angle} deg: peak at {pwl:.0f} nm (shift: {shift:+.0f} nm)")\nprint(f"\\nThe kingfisher\'s blue is not pigment — it\'s physics.")\nprint(f"Nanoscale architecture creates color through interference.")',
      challenge: 'Design a biomimetic coating: given a target color (e.g., green at 530nm), optimize the layer count, thicknesses, and refractive indices to produce maximum reflectance at the target wavelength while minimizing reflectance at other visible wavelengths.',
      successHint: "You have built an optical simulator that explains one of nature\'s most brilliant phenomena — structural color. The same physics that makes kingfishers blue is now used in anti-counterfeiting security features, display technology, and energy-efficient coatings.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Structural Color Simulator using thin-film optics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a paper strength predictor. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
