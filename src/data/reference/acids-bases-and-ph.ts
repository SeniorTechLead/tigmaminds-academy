import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'acids-bases-and-ph',
  title: 'Acids, Bases & pH',
  category: 'chemistry',
  icon: '⚗️',
  tagline: "The chemistry of sour lemons, soapy water, and the soil that grows Assam's tea.",
  relatedStories: ['holi-tea-gardens', 'first-rice', 'grandmothers-pitha'],
  understand: [
    // ── Section 1: The pH Scale ───────────────────────────────────
    {
      title: 'The pH Scale',
      diagram: 'PHScaleDiagram',
      beginnerContent:
        'Imagine a ruler that measures how **sour** or how **soapy** a liquid is. That ruler is the **pH scale**, and it runs from 0 to 14.\n\n' +
        '- **0–6** = acidic (sour, stinging)\n' +
        '- **7** = neutral (pure water — neither acidic nor basic)\n' +
        '- **8–14** = basic / alkaline (bitter, slippery like soap)\n\n' +
        'Think of it like a temperature scale for chemistry. Instead of measuring hot vs cold, pH measures **acidic vs basic**.\n\n' +
        '| Substance | pH | Acid or Base? | How it feels |\n' +
        '|-----------|-----|--------------|-------------|\n' +
        '| Battery acid | 0–1 | Very strong acid | Burns on contact |\n' +
        '| Stomach acid | 1.5–2 | Strong acid | Digests food |\n' +
        '| Lemon juice | 2.0–2.5 | Acid | Sour taste |\n' +
        '| Vinegar | 2.4–3.4 | Acid | Sharp, tangy |\n' +
        '| Assam black tea | 4.5–5.5 | Mild acid | Slightly astringent |\n' +
        '| Pure water | 7.0 | Neutral | No taste |\n' +
        '| Baking soda | 8.3 | Mild base | Slightly bitter |\n' +
        '| Soapy water | 9–10 | Base | Slippery |\n' +
        '| Household ammonia | 11–12 | Strong base | Sharp smell |\n' +
        '| Drain cleaner | 13–14 | Very strong base | Burns on contact |\n\n' +
        'Here\'s the surprising part: the pH scale is **not evenly spaced** like centimetres on a ruler. Each step is **ten times** stronger than the one before. So pH 3 is not "a little more acidic" than pH 4 — it is **10 times more acidic**. And pH 1 is **1,000,000 times** more acidic than pH 7.\n\n' +
        '**Why does this matter in Assam?** Tea garden soil must stay between pH 4.5 and 5.8 — the slightly acidic range where *Camellia sinensis* (the tea plant) thrives. If the soil becomes too alkaline (above pH 6.5), the plants can\'t absorb iron, and their leaves turn yellow. Farmers test soil pH regularly and add sulphur to keep it in the perfect range.\n\n' +
        '| Tea garden soil pH | What happens |\n' +
        '|-------------------|-------------|\n' +
        '| Below 4.0 | Aluminium becomes toxic — roots damaged |\n' +
        '| **4.5–5.8** | **Ideal range — healthy growth, brisk flavour** |\n' +
        '| 6.0–6.5 | Iron deficiency begins — leaves turn pale |\n' +
        '| Above 7.0 | Severe chlorosis — plants struggle to survive |',
      intermediateContent:
        '**The formula behind pH:**\n\n' +
        '`pH = −log₁₀[H⁺]`\n\n' +
        'where [H⁺] is the molar concentration of hydrogen ions.\n\n' +
        '**Worked example 1:** A solution has [H⁺] = 0.01 M (that\'s 10⁻² M).\n' +
        '`pH = −log₁₀(10⁻²) = −(−2) = 2` → strongly acidic.\n\n' +
        '**Worked example 2:** Assam tea soil has pH 5.5. What is [H⁺]?\n' +
        '`[H⁺] = 10⁻⁵·⁵ = 3.16 × 10⁻⁶ M` — a tiny concentration, but enough to keep tea plants happy.\n\n' +
        '| pH | [H⁺] (mol/L) | [OH⁻] (mol/L) | Classification |\n' +
        '|----|--------------|---------------|----------------|\n' +
        '| 1 | 10⁻¹ = 0.1 | 10⁻¹³ | Strong acid |\n' +
        '| 4 | 10⁻⁴ | 10⁻¹⁰ | Weak acid |\n' +
        '| 7 | 10⁻⁷ | 10⁻⁷ | Neutral |\n' +
        '| 10 | 10⁻¹⁰ | 10⁻⁴ | Weak base |\n' +
        '| 13 | 10⁻¹³ | 10⁻¹ = 0.1 | Strong base |\n\n' +
        'The **pOH** scale works the same way for hydroxide ions: `pOH = −log₁₀[OH⁻]`. At 25°C, the relationship is always:\n\n' +
        '`pH + pOH = 14`\n\n' +
        '**Worked example 3:** At pH 5.5, pOH = 14 − 5.5 = 8.5, so [OH⁻] = 10⁻⁸·⁵ = 3.16 × 10⁻⁹ M.\n\n' +
        '| Property | Formula | At 25°C |\n' +
        '|----------|---------|--------|\n' +
        '| pH | −log₁₀[H⁺] | 0–14 scale |\n' +
        '| pOH | −log₁₀[OH⁻] | 0–14 scale |\n' +
        '| Sum rule | pH + pOH | = 14 |\n' +
        '| Ion product of water (Kw) | [H⁺] × [OH⁻] | = 10⁻¹⁴ |\n\n' +
        '**Temperature matters:** Kw increases with temperature. At body temperature (37°C), Kw ≈ 2.4 × 10⁻¹⁴, so neutral pH is about 6.8, not 7.0.',
      advancedContent:
        '**Beyond simple pH — when the scale breaks down:**\n\n' +
        'In very concentrated solutions (above ~1 M), **activity** replaces concentration:\n\n' +
        '`pH = −log(a_H⁺)` where `a = γ × [H⁺]`\n\n' +
        'The activity coefficient γ is calculated via the **Debye-Hückel equation**:\n\n' +
        '`log γ = −A × z² × √I / (1 + B × a × √I)`\n\n' +
        'where I is ionic strength, z is ion charge, and A, B are solvent-dependent constants.\n\n' +
        '| Scenario | Standard pH? | Alternative measure |\n' +
        '|----------|-------------|--------------------|\n' +
        '| Dilute aqueous (< 0.1 M) | Yes — activity ≈ concentration | pH = −log[H⁺] |\n' +
        '| Concentrated (> 1 M) | No — need activity coefficients | pH = −log(γ[H⁺]) |\n' +
        '| Superacids (e.g., HF·SbF₅) | No — pH would be deeply negative | Hammett acidity function H₀ |\n' +
        '| Non-aqueous solvents | No — Kw doesn\'t apply | Solvent-specific scales |\n\n' +
        '**Superacids:** Fluoroantimonic acid (HF·SbF₅) reaches H₀ ≈ −28, making it 10²⁸ times stronger than water. Concentrated H₂SO₄ has an "effective" [H⁺] exceeding 10 M — a negative pH.\n\n' +
        '| Superacid | H₀ value | Times stronger than 100% H₂SO₄ |\n' +
        '|-----------|---------|-------------------------------|\n' +
        '| 100% H₂SO₄ (reference) | −12 | 1× |\n' +
        '| Triflic acid (CF₃SO₃H) | −14.1 | ~100× |\n' +
        '| Magic acid (FSO₃H·SbF₅) | −19.2 | ~10⁷× |\n' +
        '| Fluoroantimonic acid | −28 | ~10¹⁶× |\n\n' +
        'At the research frontier, **single-molecule pH sensing** uses fluorescent dyes whose emission shifts with protonation state. Confocal microscopy can map pH inside individual cellular compartments — mitochondria maintain pH ~8.0 while lysosomes sit at ~4.5, a 3,500-fold difference in [H⁺] within the same cell.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A solution at pH 3 is ten times more acidic than one at pH 4.', answer: true, explanation: 'Each pH step represents a tenfold change. pH 3 has 10× more H⁺ ions than pH 4.' },
            { text: 'Pure water always has a pH of exactly 7.0 regardless of temperature.', answer: false, explanation: 'Neutral pH is 7.0 only at 25°C. At body temperature (37°C), neutral pH is about 6.8 because Kw increases with temperature.' },
            { text: 'Assam tea garden soil is kept alkaline for the best tea growth.', answer: false, explanation: 'Tea plants thrive in acidic soil (pH 4.5–5.8). Alkaline soil above pH 6.5 causes iron deficiency and poor growth.' },
            { text: 'pH stands for "power of hydrogen."', answer: true, explanation: 'From the French "pouvoir d\'hydrogène" — it measures the concentration of hydrogen ions (H⁺) in solution.' },
          ],
        },
      },
    },

    // ── Section 2: Acids & Bases at the Molecular Level ───────────
    {
      title: 'Acids & Bases at the Molecular Level',
      beginnerContent:
        'What actually *makes* something an acid or a base? It all comes down to one tiny particle: the **hydrogen ion** (H⁺).\n\n' +
        '**Acids** release H⁺ ions into water. Think of them as hydrogen donors — they give away their hydrogen like a generous host handing out sweets at Bihu.\n\n' +
        '**Bases** either release OH⁻ ions or grab H⁺ ions from water. They are hydrogen acceptors — they soak up the extra H⁺.\n\n' +
        '| Type | What it does | Example | What happens in water |\n' +
        '|------|-------------|---------|----------------------|\n' +
        '| **Strong acid** | Every molecule releases H⁺ | HCl (hydrochloric acid) | HCl → H⁺ + Cl⁻ (100% split) |\n' +
        '| **Weak acid** | Only some molecules release H⁺ | CH₃COOH (vinegar) | Only ~1% split at any moment |\n' +
        '| **Strong base** | Every molecule releases OH⁻ | NaOH (caustic soda) | NaOH → Na⁺ + OH⁻ (100% split) |\n' +
        '| **Weak base** | Only partially accepts H⁺ | NH₃ (ammonia) | NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ (partial) |\n\n' +
        'The **strength** of an acid has nothing to do with **concentration**. You can have a bucket of weak acid (lots of vinegar) or a drop of strong acid (tiny amount of HCl). What matters is *how completely* it gives up its hydrogen ions.\n\n' +
        'Think of it like sugar dissolving in tea. A strong acid is like sugar that dissolves completely — every grain disappears. A weak acid is like jaggery (*gur*) that only partially dissolves — lumps remain at the bottom.\n\n' +
        '**Khar — Assam\'s traditional base:**\n\n' +
        'In Assamese kitchens, *khar* is an alkaline extract made from dried banana peel ash soaked in water. It contains potassium carbonate and potassium hydroxide — genuine bases with pH 10–11.\n\n' +
        '| Khar property | Chemistry explanation |\n' +
        '|--------------|----------------------|\n' +
        '| Makes dal softer, faster | Alkaline pH breaks down plant cell walls |\n' +
        '| Slippery texture | Bases react with oils in food to form soap-like compounds |\n' +
        '| Bitter-earthy taste | Characteristic of alkaline substances |\n' +
        '| Used for centuries | Practical acid-base chemistry, long before pH was invented |',
      intermediateContent:
        '**Quantifying acid strength — Ka and pKa:**\n\n' +
        'The acid dissociation constant Ka tells you *exactly* how strong an acid is.\n\n' +
        'For acetic acid: `CH₃COOH ⇌ CH₃COO⁻ + H⁺`\n\n' +
        '`Ka = [CH₃COO⁻][H⁺] / [CH₃COOH] = 1.8 × 10⁻⁵`\n\n' +
        '`pKa = −log(Ka) = 4.74`\n\n' +
        '| Acid | Ka | pKa | Strength |\n' +
        '|------|-----|------|----------|\n' +
        '| HCl (hydrochloric) | ~10⁷ | −7 | Very strong (complete dissociation) |\n' +
        '| H₂SO₄ (sulphuric) | ~10³ | −3 | Very strong |\n' +
        '| H₃PO₄ (phosphoric) | 7.1 × 10⁻³ | 2.15 | Moderate |\n' +
        '| CH₃COOH (acetic/vinegar) | 1.8 × 10⁻⁵ | 4.74 | Weak |\n' +
        '| H₂CO₃ (carbonic) | 4.3 × 10⁻⁷ | 6.37 | Very weak |\n' +
        '| HCN (hydrocyanic) | 6.2 × 10⁻¹⁰ | 9.21 | Extremely weak |\n\n' +
        '**Rule:** Larger Ka → stronger acid. Smaller pKa → stronger acid.\n\n' +
        '**Worked example:** Calculate the pH of 0.1 M acetic acid.\n\n' +
        'Set up: Ka = x² / (0.1 − x), where x = [H⁺].\n\n' +
        'Since Ka is small, approximate: x² ≈ 1.8 × 10⁻⁵ × 0.1 = 1.8 × 10⁻⁶\n\n' +
        'x = √(1.8 × 10⁻⁶) = **1.34 × 10⁻³ M**\n\n' +
        'pH = −log(1.34 × 10⁻³) = **2.87**\n\n' +
        '| Quantity | Value |\n' +
        '|----------|-------|\n' +
        '| Initial [CH₃COOH] | 0.1 M |\n' +
        '| [H⁺] at equilibrium | 1.34 × 10⁻³ M |\n' +
        '| % ionised | 1.34% |\n' +
        '| pH | 2.87 |\n\n' +
        'For bases, Kb works identically. Ammonia: Kb = 1.8 × 10⁻⁵. The conjugate acid-base relationship is always: **Ka × Kb = Kw = 10⁻¹⁴**.',
      advancedContent:
        '**Lewis acid-base theory — beyond protons:**\n\n' +
        'The Bronsted-Lowry definition (acid = proton donor, base = proton acceptor) breaks down for reactions with no protons. The **Lewis definition** is broader:\n\n' +
        '- **Lewis acid** = electron-pair acceptor (has an empty orbital)\n' +
        '- **Lewis base** = electron-pair donor (has a lone pair)\n\n' +
        '| Reaction | Lewis acid | Lewis base | Why it matters |\n' +
        '|----------|-----------|-----------|----------------|\n' +
        '| BF₃ + NH₃ → F₃B-NH₃ | BF₃ (empty p-orbital) | NH₃ (lone pair on N) | No protons involved |\n' +
        '| AlCl₃ + Cl⁻ → AlCl₄⁻ | AlCl₃ | Cl⁻ | Friedel-Crafts catalyst |\n' +
        '| Fe³⁺ + 6H₂O → [Fe(H₂O)₆]³⁺ | Fe³⁺ | H₂O | Metal coordination |\n' +
        '| CO₂ + OH⁻ → HCO₃⁻ | CO₂ | OH⁻ | Ocean chemistry |\n\n' +
        '**Hard-Soft Acid-Base (HSAB) theory** (Pearson, 1963) predicts bonding preferences:\n\n' +
        '| Category | Hard | Soft |\n' +
        '|----------|------|------|\n' +
        '| **Properties** | Small, high charge, low polarisability | Large, low charge, high polarisability |\n' +
        '| **Acids** | H⁺, Li⁺, Na⁺, Al³⁺, Fe³⁺ | Cu⁺, Ag⁺, Hg²⁺, Pt²⁺ |\n' +
        '| **Bases** | F⁻, OH⁻, NH₃, H₂O | I⁻, RS⁻, CO, C₂H₄ |\n' +
        '| **Rule** | Hard acids prefer hard bases | Soft acids prefer soft bases |\n\n' +
        'This explains mercury toxicity: Hg²⁺ (soft acid) binds preferentially to sulfur-containing amino acids (soft bases) in proteins, disrupting enzyme function.\n\n' +
        '**Frustrated Lewis Pairs (FLPs)** — current research frontier: bulky Lewis acids and bases that *cannot* form a classical adduct due to steric hindrance can instead cooperatively activate small molecules like H₂ and CO₂ without metal catalysts, offering green chemistry alternatives to expensive platinum-group catalysts.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each substance to its acid-base classification',
          pairs: [
            ['HCl (hydrochloric acid)', 'Strong acid — 100% ionisation in water, releases H⁺ and Cl⁻'],
            ['CH₃COOH (vinegar)', 'Weak acid — only ~1% of molecules ionise at any time'],
            ['NaOH (caustic soda)', 'Strong base — fully dissociates into Na⁺ and OH⁻'],
            ['Khar (banana peel ash)', 'Traditional Assamese base — potassium carbonate/hydroxide, pH 10–11'],
          ],
        },
      },
    },

    // ── Section 3: Neutralisation Reactions ────────────────────────
    {
      title: 'Neutralisation Reactions',
      beginnerContent:
        'When an acid meets a base, something almost magical happens: they **cancel each other out**. The sour acid and the bitter base react to form **salt + water** — both of which are neutral. This is called **neutralisation**.\n\n' +
        'The core reaction is beautifully simple:\n\n' +
        '`H⁺ (from acid) + OH⁻ (from base) → H₂O (water)`\n\n' +
        'Think of it like mixing hot water and cold water — you get lukewarm water. The acid and base "cancel" each other\'s extremes.\n\n' +
        '| Acid | + Base | → Salt | + Water |\n' +
        '|------|--------|--------|--------|\n' +
        '| HCl (hydrochloric acid) | + NaOH (sodium hydroxide) | → NaCl (table salt!) | + H₂O |\n' +
        '| H₂SO₄ (sulphuric acid) | + 2KOH (potassium hydroxide) | → K₂SO₄ (potassium sulphate) | + 2H₂O |\n' +
        '| HCl (stomach acid) | + Mg(OH)₂ (antacid tablet) | → MgCl₂ (magnesium chloride) | + 2H₂O |\n' +
        '| CH₃COOH (vinegar) | + NaHCO₃ (baking soda) | → CH₃COONa + CO₂ ↑ | + H₂O |\n\n' +
        '**Neutralisation is everywhere in daily life:**\n\n' +
        '| Situation | Acid | Base | Why it works |\n' +
        '|-----------|------|------|-------------|\n' +
        '| Antacid tablet | Excess HCl in stomach | Mg(OH)₂ or CaCO₃ in the tablet | Neutralises acid → heartburn relief |\n' +
        '| Insect sting | Formic acid (ant/bee sting) | Baking soda paste | Neutralises the acid → less pain |\n' +
        '| Liming farmland | Acidic soil (Karbi Anglong hills) | Calcium hydroxide (lime) | Raises pH for crops like maize |\n' +
        '| Treating acid rain runoff | Sulphuric/nitric acid in water | Limestone (CaCO₃) in rivers | Restores safe pH for fish |\n\n' +
        'In the **Karbi Anglong hills** of Assam, the soil is naturally acidic (pH 4–5) due to heavy rainfall leaching minerals. Farmers add lime — calcium hydroxide, Ca(OH)₂ — before planting maize and pulses that prefer neutral to mildly alkaline soil. The amount of lime needed depends on both the current soil pH and the soil\'s **buffering capacity** — clay-rich soils need more lime than sandy ones because clay particles hold more H⁺ ions.',
      intermediateContent:
        '**Titration — measuring neutralisation precisely:**\n\n' +
        'In a titration, you add a known-concentration base to an unknown acid (or vice versa) drop by drop until the exact neutralisation point is reached.\n\n' +
        '**The key equation:** `C_a × V_a = C_b × V_b` (for monoprotic acids)\n\n' +
        '**Worked example:** 25 mL of HCl of unknown concentration is neutralised by exactly 20 mL of 0.1 M NaOH.\n\n' +
        '`C_a = (C_b × V_b) / V_a = (0.1 × 20) / 25 = 0.08 M`\n\n' +
        '| Titration component | Purpose |\n' +
        '|--------------------|--------|\n' +
        '| Burette | Delivers known base (or acid) drop by drop |\n' +
        '| Conical flask | Holds the unknown acid (or base) |\n' +
        '| Indicator | Changes colour at or near the equivalence point |\n' +
        '| Equivalence point | Moles of acid = moles of base (exact neutralisation) |\n' +
        '| End point | Where the indicator colour changes (close to equivalence) |\n\n' +
        '**How the titration curve looks:**\n\n' +
        '| Titration type | Equivalence pH | Best indicator | Curve shape |\n' +
        '|---------------|---------------|---------------|-------------|\n' +
        '| Strong acid + strong base | 7.0 | Bromothymol blue | Steep S-curve, symmetric |\n' +
        '| Weak acid + strong base | 8–9 | Phenolphthalein | S-curve shifted up |\n' +
        '| Strong acid + weak base | 5–6 | Methyl orange | S-curve shifted down |\n' +
        '| Weak acid + weak base | ~7 (varies) | None ideal | Gentle curve, hard to detect |\n\n' +
        '**Worked example 2:** How much 0.5 M Ca(OH)₂ is needed to neutralise 50 mL of 0.2 M H₂SO₄?\n\n' +
        'Balanced equation: H₂SO₄ + Ca(OH)₂ → CaSO₄ + 2H₂O (1:1 ratio)\n\n' +
        'Moles of H₂SO₄ = 0.05 L × 0.2 M = 0.01 mol\n\n' +
        'Moles of Ca(OH)₂ needed = 0.01 mol\n\n' +
        'Volume = 0.01 / 0.5 = **0.02 L = 20 mL**',
      advancedContent:
        '**Enthalpy of neutralisation and polyprotic acids:**\n\n' +
        'For any strong acid + strong base reaction, the enthalpy of neutralisation is approximately **ΔH = −57.1 kJ/mol** — the energy released by H⁺ + OH⁻ → H₂O. This is constant because the same net ionic reaction occurs regardless of the specific strong acid/base pair.\n\n' +
        '| Reaction | ΔH (kJ/mol) | Why different? |\n' +
        '|----------|-------------|---------------|\n' +
        '| HCl + NaOH | −57.1 | Reference: strong + strong |\n' +
        '| HNO₃ + KOH | −57.1 | Same net ionic reaction |\n' +
        '| CH₃COOH + NaOH | −55.2 | Energy consumed dissociating weak acid |\n' +
        '| HF + NaOH | −68.6 | Extra energy from breaking strong H-F bond |\n' +
        '| NH₃ + HCl | −52.2 | Energy consumed dissociating weak base |\n\n' +
        '**Polyprotic acids** have multiple Ka values — each successive proton is harder to remove:\n\n' +
        '| Acid | Ka₁ | Ka₂ | Ka₃ | pKa₁ | pKa₂ | pKa₃ |\n' +
        '|------|-----|-----|-----|------|------|------|\n' +
        '| H₂SO₄ | ~10³ | 1.0 × 10⁻² | — | −3 | 1.99 | — |\n' +
        '| H₃PO₄ | 7.1 × 10⁻³ | 6.3 × 10⁻⁸ | 4.2 × 10⁻¹³ | 2.15 | 7.20 | 12.38 |\n' +
        '| H₂CO₃ | 4.3 × 10⁻⁷ | 4.7 × 10⁻¹¹ | — | 6.37 | 10.33 | — |\n\n' +
        'Each successive proton removal costs more energy because you\'re pulling H⁺ away from an increasingly negative anion. Titration curves of polyprotic acids show **multiple equivalence points** — distinct plateaus at each deprotonation step.\n\n' +
        'This is the basis of **phosphate buffer systems** in biological research: mixing H₂PO₄⁻/HPO₄²⁻ (pKa₂ = 7.20) creates a buffer near physiological pH.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Table salt (NaCl) — the same stuff you sprinkle on food — is the product of one of the most dangerous acid (HCl) reacting with one of the most dangerous bases (NaOH). Neutralisation tames both into something completely harmless.',
            'The fizzing when you mix vinegar and baking soda isn\'t just neutralisation — it\'s the CO₂ gas escaping. The same reaction powers "volcano" science experiments worldwide.',
            'Farmers in Assam\'s Karbi Anglong hills sometimes need 2–4 tonnes of lime per hectare to raise soil pH by just one unit — clay-rich soils hold enormous amounts of H⁺.',
          ],
        },
      },
    },

    // ── Section 4: Indicators — Nature's pH Detectors ─────────────
    {
      title: 'Indicators — Nature\'s pH Detectors',
      beginnerContent:
        'How do you *see* pH? You use an **indicator** — a substance that changes colour depending on how acidic or basic a solution is. Indicators are like mood rings for chemistry.\n\n' +
        '| Indicator | In acid | At neutral | In base | Used for |\n' +
        '|-----------|---------|-----------|---------|--------|\n' +
        '| Litmus paper | Red | Purple | Blue | Quick acid/base test |\n' +
        '| Phenolphthalein | Colourless | Colourless | Vivid pink | Titrations (colour change at pH 8.2) |\n' +
        '| Methyl orange | Red | Orange | Yellow | Titrations with strong acids |\n' +
        '| Universal indicator | Red → orange → yellow | Green | Blue → indigo → violet | Estimating pH across full range |\n\n' +
        '**Nature is full of indicators.** Red cabbage juice contains **anthocyanin** pigments that produce a rainbow of colours across the pH scale:\n\n' +
        '| pH range | Colour | Example substance |\n' +
        '|----------|--------|------------------|\n' +
        '| 1–2 (strong acid) | Bright red | Stomach acid |\n' +
        '| 3–4 (weak acid) | Pink | Lemon juice |\n' +
        '| 5–6 (mild acid) | Purple | Black tea |\n' +
        '| 7 (neutral) | Blue-purple | Pure water |\n' +
        '| 8–9 (mild base) | Blue-green | Baking soda |\n' +
        '| 10–11 (base) | Green | Ammonia |\n' +
        '| 12+ (strong base) | Yellow | Drain cleaner |\n\n' +
        '**Assamese food as pH indicator:**\n\n' +
        'Many traditional foods from Assam are informal indicators. The bright red of *ou tenga* (elephant apple) chutney tells you it\'s acidic. The deep brown-green of *khar* tells you it\'s alkaline. Even tea is a mild indicator — squeeze lemon into strong black tea and watch it **lighten noticeably**. The acid changes the shape of theaflavin pigments, shifting their colour.\n\n' +
        'Hydrangea flowers are living pH meters: they bloom **blue** in acidic soil (below pH 6) and **pink** in alkaline soil (above pH 7). The soil pH controls how much aluminium the roots absorb, and aluminium changes the pigment colour.',
      intermediateContent:
        '**How indicators work — they\'re weak acids themselves:**\n\n' +
        'An indicator HIn has two forms with different colours:\n\n' +
        '`HIn (colour A) ⇌ H⁺ + In⁻ (colour B)`\n\n' +
        'The Henderson-Hasselbalch equation applies:\n\n' +
        '`pH = pKa + log([In⁻] / [HIn])`\n\n' +
        'When pH = pKa, [In⁻] = [HIn], and you see a 50/50 mix of both colours — the **transition point**. The visible change spans roughly **pKa ± 1**.\n\n' +
        '| Indicator | pKa | Acid colour | Base colour | Transition range |\n' +
        '|-----------|-----|------------|------------|------------------|\n' +
        '| Thymol blue (1st) | 1.7 | Red | Yellow | 1.2–2.8 |\n' +
        '| Methyl orange | 3.7 | Red | Yellow | 3.1–4.4 |\n' +
        '| Bromothymol blue | 7.0 | Yellow | Blue | 6.0–7.6 |\n' +
        '| Phenolphthalein | 9.4 | Colourless | Pink | 8.2–10.0 |\n' +
        '| Alizarin yellow R | 11.0 | Yellow | Red | 10.1–12.0 |\n\n' +
        '**Choosing the right indicator for a titration:**\n\n' +
        '| Titration type | Equivalence pH | Choose indicator with pKa near... |\n' +
        '|---------------|---------------|----------------------------------|\n' +
        '| Strong acid + strong base | 7.0 | 7 → bromothymol blue |\n' +
        '| Weak acid + strong base | ~8.7 | 9 → phenolphthalein |\n' +
        '| Strong acid + weak base | ~5.3 | 4 → methyl orange |\n\n' +
        '**Universal indicator** is a mixture of ~5 indicators with staggered pKa values, producing continuous colour changes across pH 1–14.',
      advancedContent:
        '**Anthocyanin chemistry — five structures, one pigment:**\n\n' +
        'The anthocyanin pigments in red cabbage (and hydrangeas, blueberries, jamun) undergo structural changes far more complex than simple protonation:\n\n' +
        '| pH range | Dominant form | Structure | Colour |\n' +
        '|----------|--------------|-----------|--------|\n' +
        '| < 3 | Flavylium cation (AH⁺) | Aromatic, planar | Red |\n' +
        '| 4–5 | Carbinol pseudobase | Ring hydrated | Colourless |\n' +
        '| 6–7 | Quinoidal base | Deprotonated ring | Purple |\n' +
        '| 8–9 | Anionic quinoidal base | Further deprotonation | Blue-green |\n' +
        '| > 11 | Chalcone | Ring opened | Yellow |\n\n' +
        'These transitions involve ring-opening, hydration, and tautomerism — not merely adding or removing protons. The equilibria are kinetically complex: the carbinol form takes minutes to establish, while the flavylium ⇌ quinoidal base equilibrium is nearly instantaneous.\n\n' +
        '**Modern pH-sensitive fluorescent probes:**\n\n' +
        '| Probe | Excitation (nm) | Emission (nm) | Useful pH range | Application |\n' +
        '|-------|----------------|--------------|----------------|-------------|\n' +
        '| BCECF | 440/490 | 530 | 6.0–8.0 | Intracellular pH mapping |\n' +
        '| SNARF-1 | 514 | 580/640 | 7.0–8.0 | Ratio-metric imaging |\n' +
        '| pHrodo Red | 560 | 590 | 4.0–7.0 | Endosome/lysosome tracking |\n' +
        '| LysoSensor Green | 443 | 505 | 3.5–6.0 | Lysosome pH |\n\n' +
        'These probes enable real-time pH imaging inside living cells with confocal microscopy. Cancer researchers use them to study how tumour cells maintain an acidic microenvironment (pH ~6.5 extracellular) while keeping intracellular pH normal (~7.4) — a phenomenon called the **Warburg effect** that drives metastasis.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the indicator to its behaviour',
          pairs: [
            ['Litmus paper', 'Red in acid, blue in base — the simplest indicator test'],
            ['Phenolphthalein', 'Colourless in acid, vivid pink above pH 8.2'],
            ['Red cabbage juice', 'Red → purple → green → yellow across the full pH range'],
            ['Hydrangea flowers', 'Blue in acidic soil, pink in alkaline soil'],
          ],
        },
      },
    },

    // ── Section 5: Real-World pH — Soil, Blood, and Tea ───────────
    {
      title: 'Real-World pH — Soil, Blood, and Tea',
      beginnerContent:
        'pH is not just a textbook number — it governs processes from your bloodstream to the ocean floor. Let\'s visit three real-world pH stories.\n\n' +
        '**1. Your blood — a tightly controlled pH**\n\n' +
        'Your blood must stay between pH 7.35 and 7.45 — a window of just 0.1 pH units. Step outside that range and enzymes stop working, organs fail, and you can die. Your body uses **buffers** (chemical sponges that absorb excess H⁺ or OH⁻) to keep blood pH rock-stable.\n\n' +
        '| Condition | Blood pH | Cause | What happens |\n' +
        '|-----------|----------|-------|--------------|\n' +
        '| Normal | 7.35–7.45 | Healthy buffering | Everything works |\n' +
        '| Acidosis | Below 7.35 | Too much CO₂, diabetes, kidney failure | Confusion, coma |\n' +
        '| Alkalosis | Above 7.45 | Hyperventilation, vomiting | Tingling, muscle spasms |\n' +
        '| Death risk | Below 6.8 or above 7.8 | Buffer system overwhelmed | Cardiac arrest |\n\n' +
        'A buffer is like the shock absorber on a car — it smooths out bumps. The main blood buffer is **bicarbonate** (HCO₃⁻), which can absorb extra H⁺ before pH changes.\n\n' +
        '**2. Ocean acidification — the global pH crisis**\n\n' +
        'Ocean pH has dropped from 8.2 to 8.1 since the Industrial Revolution. That sounds tiny, but remember the logarithmic scale — it means a **26% increase** in hydrogen ions. This dissolves the calcium carbonate shells of corals, oysters, and plankton.\n\n' +
        '| Ocean pH change | [H⁺] increase | Impact on marine life |\n' +
        '|----------------|--------------|----------------------|\n' +
        '| 8.2 → 8.1 (already happened) | +26% | Coral bleaching accelerating |\n' +
        '| 8.1 → 8.0 (projected 2050) | +58% total | Shellfish larvae struggle to form shells |\n' +
        '| 8.1 → 7.8 (projected 2100 worst case) | +150% total | Mass coral reef extinction likely |\n\n' +
        '**3. Assam\'s tea gardens — pH is livelihood**\n\n' +
        'The Tocklai Tea Research Institute in Jorhat — the world\'s oldest tea research centre — has found that the finest orthodox teas grow in soil with pH 4.5–5.5.\n\n' +
        '| Factor | Detail |\n' +
        '|--------|-------|\n' +
        '| Ideal pH | 4.5–5.5 for Assam orthodox tea |\n' +
        '| Natural acidification | Tea roots exude organic acids, lowering soil pH over decades |\n' +
        '| Old vs new gardens | Established gardens (50+ years) need less pH management |\n' +
        '| pH correction | Sulphur lowers pH; lime raises it |\n' +
        '| Testing frequency | Every 2–3 years per section of the garden |',
      intermediateContent:
        '**The blood buffer system — Henderson-Hasselbalch in action:**\n\n' +
        'The equilibrium: `CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻`\n\n' +
        'Henderson-Hasselbalch: `pH = 6.1 + log([HCO₃⁻] / [CO₂])`\n\n' +
        '**Worked example:** Normal blood has [HCO₃⁻] = 24 mM and [CO₂] = 1.2 mM.\n\n' +
        '`pH = 6.1 + log(24 / 1.2) = 6.1 + log(20) = 6.1 + 1.30 = 7.40` ✓\n\n' +
        '| Disturbance | What changes | Effect on ratio | pH change | How body compensates |\n' +
        '|-------------|-------------|----------------|-----------|---------------------|\n' +
        '| Hold breath | CO₂ rises to 1.8 mM | 24/1.8 = 13.3 | 6.1 + 1.12 = **7.22** (acidosis) | Kidneys retain HCO₃⁻ |\n' +
        '| Hyperventilate | CO₂ drops to 0.8 mM | 24/0.8 = 30 | 6.1 + 1.48 = **7.58** (alkalosis) | Kidneys excrete HCO₃⁻ |\n' +
        '| Diabetic ketoacidosis | H⁺ consumes HCO₃⁻ to 12 mM | 12/1.2 = 10 | 6.1 + 1.00 = **7.10** (dangerous) | Fast breathing to lower CO₂ |\n\n' +
        '**Compensation timeline:**\n\n' +
        '| System | Speed | Mechanism |\n' +
        '|--------|-------|----------|\n' +
        '| Chemical buffers | Seconds | HCO₃⁻/H₂CO₃, phosphate, proteins absorb H⁺ |\n' +
        '| Lungs | Minutes | Adjust breathing rate to change CO₂ |\n' +
        '| Kidneys | Hours to days | Excrete or retain H⁺ and HCO₃⁻ |\n\n' +
        '**Ocean acidification calculation:** Pre-industrial [H⁺] = 10⁻⁸·¹⁸ = 6.6 × 10⁻⁹ M. Current [H⁺] = 10⁻⁸·⁰⁷ = 8.5 × 10⁻⁹ M. Increase = (8.5 − 6.6) / 6.6 = **29%** — nearly a third more hydrogen ions in just 200 years.',
      advancedContent:
        '**Buffer capacity and the open-system trick:**\n\n' +
        'The **buffer capacity** β = dC_b/dpH (moles of strong base needed to change pH by 1 unit per litre). For a simple buffer:\n\n' +
        '`β = 2.303 × C × Ka × [H⁺] / (Ka + [H⁺])²`\n\n' +
        'Maximum buffer capacity occurs at pH = pKa, where β = 0.576 × C.\n\n' +
        '| Buffer system | pKa | Optimal pH range | Used in |\n' +
        '|--------------|-----|-----------------|--------|\n' +
        '| Acetate (CH₃COOH/CH₃COO⁻) | 4.76 | 3.8–5.8 | Biochemistry labs |\n' +
        '| Phosphate (H₂PO₄⁻/HPO₄²⁻) | 7.20 | 6.2–8.2 | Cell culture, IV fluids |\n' +
        '| Bicarbonate (CO₂/HCO₃⁻) | 6.10 | 5.1–7.1 | Blood (but see below) |\n' +
        '| Tris | 8.07 | 7.1–9.1 | Molecular biology |\n' +
        '| HEPES | 7.55 | 6.6–8.6 | Cell culture |\n\n' +
        '**The bicarbonate paradox:** Blood pH (7.40) is 1.3 units above the bicarbonate pKa (6.10) — far outside the optimal ±1 range. Why does it work? Because the lungs act as an **open system**: CO₂ is continuously exhaled, preventing H₂CO₃ accumulation. The effective buffer capacity is far higher than Henderson-Hasselbalch predicts for a closed system.\n\n' +
        '**Marine carbonate system:**\n\n' +
        '`CO₂(aq) ⇌ HCO₃⁻ ⇌ CO₃²⁻`\n\n' +
        '| Parameter | Pre-industrial | Current | Projected 2100 |\n' +
        '|-----------|---------------|---------|----------------|\n' +
        '| Atmospheric CO₂ | 280 ppm | 420 ppm | 700–1000 ppm |\n' +
        '| Surface ocean pH | 8.18 | 8.07 | 7.77–7.95 |\n' +
        '| [CO₃²⁻] | 200 μmol/kg | 170 μmol/kg | 100–130 μmol/kg |\n' +
        '| Ω_aragonite | 3.4 | 2.8 | 1.2–1.8 |\n\n' +
        'When Ω_aragonite (the saturation state) drops below 1.0, aragonite shells dissolve spontaneously. The solubility product K_sp = 3.3 × 10⁻⁹ for calcite, 6.0 × 10⁻⁹ for aragonite. Some polar waters have already crossed this tipping point — pteropod shells there are visibly dissolving.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Human blood can safely vary between pH 6 and pH 8.', answer: false, explanation: 'Blood pH must stay between 7.35 and 7.45. Even pH 6.8 or 7.8 can be fatal — it\'s a remarkably narrow range.' },
            { text: 'Ocean pH dropping from 8.2 to 8.1 represents a 26% increase in hydrogen ions.', answer: true, explanation: 'Because pH is logarithmic, a 0.1-unit drop means [H⁺] increased by 10^0.1 ≈ 1.26, or a 26% increase.' },
            { text: 'Tea plants prefer alkaline soil above pH 8.', answer: false, explanation: 'Tea plants (Camellia sinensis) thrive in acidic soil at pH 4.5–5.8. Alkaline conditions cause iron deficiency and poor growth.' },
            { text: 'The bicarbonate buffer in blood works well despite being far from its pKa because the lungs constantly remove CO₂.', answer: true, explanation: 'The lungs make it an open system — exhaling CO₂ prevents acid buildup, giving the buffer much greater effective capacity than a closed system.' },
          ],
        },
      },
    },
  ],
};
