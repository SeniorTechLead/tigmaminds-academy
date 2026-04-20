import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'organic-chemistry-intro',
  title: 'Organic Chemistry Intro',
  category: 'chemistry',
  icon: '⚗️',
  tagline: "Carbon's four bonds build the molecules of life — from methane to silk protein.",
  relatedStories: ['why-the-muga-silk-is-golden', 'eri-silk', 'coconut-jackfruit'],
  understand: [
    // ── Section 1: Why Carbon Is Special ──────────────────────────
    {
      title: 'Why Carbon Is Special',
      diagram: 'CarbonBondingDiagram',
      beginnerContent:
        'Imagine a building-block set. Most blocks have one or two connection points — you can make short sticks or simple pairs. Now imagine a block with **four connection points** arranged in 3D. Suddenly you can build chains, branches, rings, cages, sheets — anything. That block is **carbon**.\n\n' +
        'Carbon sits in group 14 of the periodic table with four valence electrons, meaning it can form exactly **four covalent bonds**. Those four bonds point towards the corners of a tetrahedron — like a tripod with a vertical stick — giving carbon a 3D building ability no other element matches.\n\n' +
        '**Why not silicon?** Silicon sits directly below carbon and also has four valence electrons. But Si-Si bonds are weaker and break down in water and air. Carbon-carbon bonds are strong and stable:\n\n' +
        '| Bond | Energy (kJ/mol) | Stable in water? | Stable in air? |\n' +
        '|------|----------------|-----------------|----------------|\n' +
        '| C-C (single) | 346 | Yes | Yes |\n' +
        '| C=C (double) | 614 | Yes | Yes |\n' +
        '| C≡C (triple) | 839 | Yes | Yes |\n' +
        '| Si-Si | 226 | No — hydrolyses | No — oxidises |\n\n' +
        '**The result:** there are over **10 million known organic compounds** — vastly outnumbering the inorganic compounds of all other elements combined.\n\n' +
        '| Carbon chain length | Example | Where you find it |\n' +
        '|--------------------|---------|-------------------|\n' +
        '| 1 carbon | Methane (CH₄) | Natural gas, biogas from paddy fields |\n' +
        '| 2–4 carbons | Ethane, propane, butane | LPG cooking gas |\n' +
        '| 5–12 carbons | Octane | Petrol |\n' +
        '| 12–20 carbons | Hexadecane | Diesel fuel |\n' +
        '| 20–40 carbons | Long-chain alkanes | Paraffin wax, candles |\n' +
        '| 1,000+ carbons | Fibroin protein | **Muga silk** — Assam\'s golden textile |\n\n' +
        'The fibroin protein in Muga silk contains carbon chains thousands of atoms long, folded into beta-sheet structures that give the silk its extraordinary strength and golden luster. From a single methane molecule to a silk fibre — carbon\'s four bonds make it all possible.\n\n' +
        '**Quick check:** Why can carbon form such diverse compounds while most other elements cannot?\n\n' +
        '*Because carbon has exactly four bonding directions arranged tetrahedrally, plus strong and stable C-C bonds. This lets it build chains, branches, and rings of unlimited length — something no other element can do reliably.*',
      intermediateContent:
        '**Orbital hybridisation — the source of carbon\'s flexibility:**\n\n' +
        'Carbon\'s 2s and 2p orbitals can mix ("hybridise") in three different ways, each producing a different geometry:\n\n' +
        '| Hybridisation | Orbitals mixed | Shape | Bond angle | Example |\n' +
        '|--------------|---------------|-------|------------|--------|\n' +
        '| **sp³** | 1s + 3p → 4 equivalent | Tetrahedral | 109.5° | Methane (CH₄), ethane |\n' +
        '| **sp²** | 1s + 2p → 3 equivalent + 1 unhybridised p | Trigonal planar | 120° | Ethene (C₂H₄), benzene |\n' +
        '| **sp** | 1s + 1p → 2 equivalent + 2 unhybridised p | Linear | 180° | Ethyne (C₂H₂) |\n\n' +
        '**What determines the hybridisation?** Count the regions of electron density (bonds + lone pairs) around the carbon:\n\n' +
        '| Regions | Hybridisation | Pi bonds present |\n' +
        '|---------|--------------|------------------|\n' +
        '| 4 | sp³ | 0 |\n' +
        '| 3 | sp² | 1 (in the double bond) |\n' +
        '| 2 | sp | 2 (in the triple bond) |\n\n' +
        '**Electronegativity** (2.55 on the Pauling scale) is moderate — carbon forms stable bonds with both electropositive elements (H, metals) and electronegative ones (O, N, halogens). This versatility means carbon can be the backbone while other atoms provide chemical personality.\n\n' +
        '**Worked example — determine the hybridisation of each carbon in acetic acid (CH₃COOH):**\n\n' +
        '- Carbon 1 (CH₃): bonded to 3H + 1C = 4 regions → **sp³** (tetrahedral)\n' +
        '- Carbon 2 (C=O, -OH): bonded to =O + -OH + CH₃ = 3 regions → **sp²** (trigonal planar)\n\n' +
        'Acetic acid is the key component of vinegar — and every bottle of vinegar has both sp³ and sp² carbons.',
      advancedContent:
        '**Retrosynthetic analysis** — thinking backwards to build forwards:\n\n' +
        'E. J. Corey (Nobel Prize 1990) formalised the idea of working backward from a target molecule to simpler precursors. You identify **disconnection points** — bonds that can be formed by known reactions — and trace back to commercially available starting materials.\n\n' +
        '| Strategy | Notation | What it means |\n' +
        '|----------|---------|---------------|\n' +
        '| Disconnection | ⟹ | "Can be made from..." |\n' +
        '| Synthon | Charged fragment | Idealised reactive piece |\n' +
        '| Reagent | Real chemical | What you actually use |\n' +
        '| FGI | Functional group interconversion | Change one group to another |\n\n' +
        '**Key C-C bond-forming reactions (Nobel Prize 2010 — Suzuki, Heck, Negishi):**\n\n' +
        '| Reaction | What it does | Catalyst | Conditions |\n' +
        '|----------|-------------|----------|------------|\n' +
        '| **Suzuki coupling** | Ar-B(OH)₂ + Ar-X → Ar-Ar | Pd(PPh₃)₄ | Base, aqueous |\n' +
        '| **Heck reaction** | Ar-X + alkene → Ar-alkene | Pd(OAc)₂ | Base, heat |\n' +
        '| **Grignard** | R-MgBr + C=O → R-C-OH | None (stoichiometric) | Dry ether |\n' +
        '| **Aldol condensation** | Enolate + aldehyde → β-hydroxy carbonyl | Base/acid | Mild |\n\n' +
        '**Asymmetric catalysis** produces single enantiomers — critical for pharmaceuticals where one mirror-image form is therapeutic and the other is toxic (thalidomide\'s tragedy).\n\n' +
        '**Carbon allotropes — same element, vastly different properties:**\n\n' +
        '| Allotrope | Hybridisation | Structure | Key property |\n' +
        '|-----------|--------------|-----------|-------------|\n' +
        '| Diamond | sp³ | 3D network | Hardest natural material |\n' +
        '| Graphite | sp² | Stacked sheets | Conductor, lubricant |\n' +
        '| Fullerene (C₆₀) | sp² | Buckyball cage | Drug delivery research |\n' +
        '| Graphene | sp² | Single sheet | 200× stronger than steel |\n' +
        '| Carbon nanotube | sp² | Rolled graphene | Tensile strength 100× steel |\n\n' +
        'Muga silk\'s fibroin is studied by polymer chemists for its beta-sheet nanocrystals — models for designing synthetic fibres with silk-like toughness. The interplay of sp³ and sp² carbon in biological polymers is where organic chemistry meets materials science.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each hybridisation to its geometry and example',
          pairs: [
            ['sp³ hybridisation', 'Tetrahedral (109.5°) — methane, ethane, diamond'],
            ['sp² hybridisation', 'Trigonal planar (120°) — ethene, benzene, graphene'],
            ['sp hybridisation', 'Linear (180°) — ethyne (acetylene), CO₂'],
            ['No hybridisation (atomic carbon)', 'Found in carbon vapour at very high temperatures'],
          ],
        },
      },
    },

    // ── Section 2: Hydrocarbons ───────────────────────────────────
    {
      title: 'Hydrocarbons — The Foundation',
      beginnerContent:
        'Hydrocarbons contain only two elements: **carbon and hydrogen**. They are the simplest organic compounds and the foundation on which all others are built. Think of them as the plain chassis of a car — functional groups (added later) are the engine, seats, and steering wheel.\n\n' +
        'There are four families of hydrocarbons, each with different bonding and different chemistry:\n\n' +
        '| Family | Bond type | General formula | Reactive? | Key use |\n' +
        '|--------|-----------|----------------|-----------|--------|\n' +
        '| **Alkanes** | All single (C-C) | CₙH₂ₙ₊₂ | Low — "saturated" | Fuels (methane, propane, petrol) |\n' +
        '| **Alkenes** | One or more C=C | CₙH₂ₙ | High — addition reactions | Plastics (polyethylene, polypropylene) |\n' +
        '| **Alkynes** | One or more C≡C | CₙH₂ₙ₋₂ | Very high | Welding (acetylene torch, 3,300°C) |\n' +
        '| **Aromatics** | Delocalised ring | CₙHₙ (benzene) | Moderate — substitution | Dyes, medicines, flavourings |\n\n' +
        '**Naming alkanes — a simple pattern:**\n\n' +
        '| # Carbons | Prefix | Name | Formula | Boiling point |\n' +
        '|-----------|--------|------|---------|---------------|\n' +
        '| 1 | Meth- | Methane | CH₄ | −161°C (gas) |\n' +
        '| 2 | Eth- | Ethane | C₂H₆ | −89°C (gas) |\n' +
        '| 3 | Prop- | Propane | C₃H₈ | −42°C (gas) |\n' +
        '| 4 | But- | Butane | C₄H₁₀ | −1°C (gas) |\n' +
        '| 5 | Pent- | Pentane | C₅H₁₂ | 36°C (liquid) |\n' +
        '| 6 | Hex- | Hexane | C₆H₁₄ | 69°C (liquid) |\n' +
        '| 8 | Oct- | Octane | C₈H₁₈ | 126°C (liquid) |\n\n' +
        '**Notice the pattern:** as chains get longer, boiling points rise because longer molecules have stronger intermolecular forces (London dispersion forces). That\'s why methane is a gas you burn on a stove, octane is a liquid you pump into a car, and paraffin wax is a solid.\n\n' +
        'The paddy fields of Assam\'s Brahmaputra valley are significant sources of **methane** — waterlogged rice paddies create anaerobic conditions where bacteria decompose organic matter into CH₄. Rice paddies contribute about 10% of global methane emissions. Meanwhile, **aromatic compounds** give wild orchids their colours (anthocyanin pigments) and give tea its distinctive aroma (aromatic aldehydes and esters).\n\n' +
        '**Quick check:** Ethene (C₂H₄) is far more reactive than ethane (C₂H₆) even though they differ by just two hydrogen atoms. Why?\n\n' +
        '*Because ethene has a C=C double bond. The pi bond in the double bond is electron-rich and exposed, making it a target for electrophilic attack. Ethane has only single bonds with no exposed electrons — nothing to react with easily.*',
      intermediateContent:
        '**Types of reactions for each hydrocarbon family:**\n\n' +
        '| Family | Signature reaction | Mechanism | Example |\n' +
        '|--------|-------------------|-----------|--------|\n' +
        '| Alkanes | **Combustion** | Free radical | CH₄ + 2O₂ → CO₂ + 2H₂O |\n' +
        '| Alkanes | **Substitution** | Free radical | CH₄ + Cl₂ → CH₃Cl + HCl (UV light) |\n' +
        '| Alkenes | **Addition** | Electrophilic | C₂H₄ + HBr → CH₃CH₂Br |\n' +
        '| Alkenes | **Polymerisation** | Addition | n(C₂H₄) → (C₂H₄)ₙ (polyethylene) |\n' +
        '| Alkynes | **Addition** (×2) | Electrophilic | C₂H₂ + 2Br₂ → CHBr₂CHBr₂ |\n' +
        '| Aromatics | **Substitution** | Electrophilic | C₆H₆ + Br₂ → C₆H₅Br + HBr |\n\n' +
        '**Why don\'t aromatics undergo addition like alkenes?**\n\n' +
        'Benzene\'s six pi electrons are **delocalised** — spread evenly across all six carbons in a ring. This delocalisation gives benzene extra stability (about 150 kJ/mol, called the **resonance energy**). An addition reaction would break the delocalisation and destroy this stability. So benzene prefers substitution (replace one H, keep the ring intact) over addition.\n\n' +
        '**Markovnikov\'s rule** for alkene addition: When HX adds across a double bond, the H goes to the carbon that already has more hydrogens ("the rich get richer").\n\n' +
        '**Worked example — propene + HBr:**\n\n' +
        '`CH₃-CH=CH₂ + HBr → CH₃-CHBr-CH₃ (major) NOT CH₃-CH₂-CH₂Br`\n\n' +
        'The H adds to the terminal CH₂ (which has more H\'s), and Br adds to the middle carbon. Why? The intermediate carbocation (CH₃-CH⁺-CH₃) is secondary and more stable than the primary alternative (CH₃-CH₂-CH₂⁺).',
      advancedContent:
        '**Aromaticity — beyond benzene:**\n\n' +
        'Huckel\'s rule: a planar, cyclic, fully conjugated molecule is aromatic if it has **4n+2 pi electrons** (n = 0, 1, 2...):\n\n' +
        '| Molecule | Pi electrons | n | Aromatic? |\n' +
        '|----------|-------------|---|----------|\n' +
        '| Benzene (C₆H₆) | 6 | 1 | Yes |\n' +
        '| Cyclobutadiene (C₄H₄) | 4 | — | **No** (anti-aromatic, very unstable) |\n' +
        '| Cyclooctatetraene (C₈H₈) | 8 | — | No (non-planar, avoids anti-aromaticity) |\n' +
        '| Naphthalene (C₁₀H₈) | 10 | 2 | Yes |\n' +
        '| [18]Annulene | 18 | 4 | Yes |\n' +
        '| Pyridine (C₅H₅N) | 6 | 1 | Yes (N contributes to pi system) |\n\n' +
        '**Electrophilic aromatic substitution (EAS) — the mechanism:**\n\n' +
        '| Step | What happens | Energy |\n' +
        '|------|-------------|--------|\n' +
        '| 1. Generate electrophile | E.g., Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻ | Activation |\n' +
        '| 2. Pi attack | Ring electrons attack electrophile → sigma complex (arenium ion) | ΔG‡ (rate-determining) |\n' +
        '| 3. Proton loss | H⁺ leaves, aromaticity restored | Favourable |\n\n' +
        '**Directing effects — substituents control where the next group goes:**\n\n' +
        '| Existing group | Type | Directs to | Why |\n' +
        '|---------------|------|-----------|-----|\n' +
        '| -OH, -NH₂, -OCH₃ | Activating | ortho/para | Donate electrons into ring |\n' +
        '| -CH₃, -C₂H₅ | Weakly activating | ortho/para | Hyperconjugation |\n' +
        '| -NO₂, -COOH, -CHO | Deactivating | meta | Withdraw electrons from ring |\n' +
        '| -Cl, -Br | Deactivating but ortho/para | ortho/para | Lone pairs donate despite electronegativity |\n\n' +
        'This is how dye chemistry works — the colours in traditional Naga textiles and Assamese *mekhela sador* come from aromatic compounds whose substituents determine which wavelengths of light are absorbed. Indigo, for example, has a cross-conjugated aromatic system with carbonyl and amine groups that absorb red/orange light, so we see blue.',
    },

    // ── Section 3: Functional Groups ──────────────────────────────
    {
      title: 'Functional Groups — The Personality of Molecules',
      diagram: 'FunctionalGroupsDiagram',
      beginnerContent:
        'A functional group is a specific arrangement of atoms that determines how a molecule behaves. The hydrocarbon backbone is the skeleton; the functional group is the personality. **Learn the groups, and you can predict how any organic molecule will react.**\n\n' +
        'Think of it like this: a bicycle frame (hydrocarbon backbone) can have different attachments — a basket (-OH), a bell (-NH₂), a motor (-COOH). Each attachment changes what the bicycle *does*, even though the frame is the same.\n\n' +
        '| Functional group | Structure | Name ending | Example | Where you find it |\n' +
        '|-----------------|-----------|------------|---------|-------------------|\n' +
        '| **Alcohol** | -OH | -ol | Ethanol (C₂H₅OH) | Beverages, sanitiser |\n' +
        '| **Carboxylic acid** | -COOH | -oic acid | Acetic acid (CH₃COOH) | Vinegar |\n' +
        '| **Amine** | -NH₂ | -amine | Methylamine (CH₃NH₂) | Fish smell, neurotransmitters |\n' +
        '| **Aldehyde** | -CHO | -al | Methanal (HCHO) | Preservative (formalin) |\n' +
        '| **Ketone** | C=O (between carbons) | -one | Propanone (acetone) | Nail polish remover |\n' +
        '| **Ester** | -COO- | -oate | Ethyl ethanoate | Fruity smells, **jackfruit aroma** |\n' +
        '| **Ether** | C-O-C | -ether | Diethyl ether | Historical anaesthetic |\n' +
        '| **Amide** | -CONH₂ | -amide | Urea | Fertiliser, body waste |\n\n' +
        '**NE India in your nose:** When you smell ripe **jackfruit** (a beloved fruit in Assam and across NE India), you are detecting a mixture of **esters** — particularly isoamyl acetate and butyl acetate. The sharpness of **khar** (traditional Assamese alkaline ingredient made from burnt banana peel) comes from amines and carboxylate salts. The astringency of fresh **Assam tea** comes from polyphenols — compounds with multiple -OH groups on aromatic rings.\n\n' +
        '**The polarity pattern:** Functional groups with O or N make molecules **polar** (they can form hydrogen bonds with water). More -OH groups = more water-soluble:\n\n' +
        '| Molecule | -OH groups | Soluble in water? | Properties |\n' +
        '|----------|-----------|------------------|------------|\n' +
        '| Hexane (C₆H₁₄) | 0 | No | Oily, non-polar |\n' +
        '| Hexanol (C₆H₁₃OH) | 1 | Slightly | Partly polar |\n' +
        '| Glucose (C₆H₁₂O₆) | 5 (plus ring O) | Very | Sweet, dissolves readily |\n' +
        '| Glycerol (C₃H₈O₃) | 3 | Completely | Thick, sweet, used in soap |\n\n' +
        '**Quick check:** Vinegar (acetic acid, -COOH) mixes with water, but cooking oil (long hydrocarbon chains, no functional groups) does not. Why?\n\n' +
        '*Because the -COOH group in acetic acid can form hydrogen bonds with water molecules, making it miscible. Cooking oil has no polar functional groups — it cannot interact with water, so the two separate.*',
      intermediateContent:
        '**Functional group transformations — one group becomes another:**\n\n' +
        '| Starting group | Reagent | Product group | Example |\n' +
        '|---------------|---------|--------------|--------|\n' +
        '| Alcohol (-OH) | Oxidation (K₂Cr₂O₇/H⁺) | Aldehyde (-CHO) → Acid (-COOH) | Ethanol → ethanal → ethanoic acid |\n' +
        '| Aldehyde (-CHO) | Reduction (NaBH₄) | Alcohol (-OH) | Ethanal → ethanol |\n' +
        '| Acid + Alcohol | H⁺ catalyst | Ester (-COO-) + H₂O | Ethanoic acid + ethanol → ethyl ethanoate |\n' +
        '| Ester | NaOH (hydrolysis) | Acid salt + Alcohol | Ethyl ethanoate → sodium ethanoate + ethanol |\n' +
        '| Alkene | H₂O/H⁺ | Alcohol | Ethene + water → ethanol |\n\n' +
        '**Oxidation ladder — primary alcohols go through three stages:**\n\n' +
        '`Primary alcohol → Aldehyde → Carboxylic acid`\n' +
        '`     R-CH₂OH   →   R-CHO   →    R-COOH`\n\n' +
        'This is why wine turns to vinegar if left open: bacteria oxidise **ethanol** (alcohol) through **acetaldehyde** to **acetic acid** (vinegar). The same chemistry happens when Assam\'s traditional rice wine (*apong* or *xaj*) sours.\n\n' +
        '**Worked example — esterification of salicylic acid:**\n\n' +
        'Salicylic acid (from willow bark) + acetic anhydride → **aspirin** (acetylsalicylic acid) + acetic acid\n\n' +
        '| Reactant | Functional groups | Role |\n' +
        '|----------|------------------|------|\n' +
        '| Salicylic acid | -OH + -COOH | Provides the -OH for ester formation |\n' +
        '| Acetic anhydride | Two -C=O linked by O | Provides the acetyl group |\n' +
        '| Aspirin | -OOCCH₃ + -COOH | Ester formed, free acid remains |\n\n' +
        'This is one of the most famous organic reactions in history — aspirin has been used since 1899.',
      advancedContent:
        '**Infrared (IR) spectroscopy — identifying functional groups by their vibrations:**\n\n' +
        'Every functional group absorbs infrared light at a characteristic frequency. An IR spectrum is like a fingerprint for functional groups:\n\n' +
        '| Functional group | IR absorption (cm⁻¹) | Appearance | Intensity |\n' +
        '|-----------------|---------------------|------------|----------|\n' +
        '| O-H (alcohol) | 3200–3550 | Broad | Strong |\n' +
        '| O-H (carboxylic acid) | 2500–3300 | Very broad | Strong |\n' +
        '| N-H (amine) | 3300–3500 | Medium, 2 peaks (primary) | Medium |\n' +
        '| C=O (carbonyl) | 1680–1750 | Sharp | Strong |\n' +
        '| C=C (alkene) | 1620–1680 | Medium | Variable |\n' +
        '| C-O (ether/ester) | 1000–1300 | Strong | Strong |\n\n' +
        '**Worked example — identify the unknown compound:**\n\n' +
        'An IR spectrum shows: broad absorption at 2500-3300 cm⁻¹ AND a sharp peak at 1710 cm⁻¹.\n\n' +
        '- The broad 2500-3300 = O-H stretch of a **carboxylic acid**\n' +
        '- The sharp 1710 = C=O stretch of a **carboxylic acid**\n' +
        '- Conclusion: the compound is a **carboxylic acid** (both peaks are diagnostic)\n\n' +
        '**Nucleophilic addition to carbonyls:**\n\n' +
        '| Nucleophile | Attacks | Product | Name |\n' +
        '|-------------|---------|---------|------|\n' +
        '| H⁻ (from NaBH₄) | C=O | Alcohol | Reduction |\n' +
        '| CN⁻ | C=O | Cyanohydrin | Nucleophilic addition |\n' +
        '| RMgBr (Grignard) | C=O | Alcohol (new C-C bond) | Grignard reaction |\n' +
        '| R-NH₂ | C=O | Imine (Schiff base) | Condensation |\n\n' +
        'The carbonyl group (C=O) is electrophilic at carbon because oxygen\'s electronegativity pulls electron density away. This makes the carbon a target for nucleophiles — the central theme of intermediate organic chemistry.\n\n' +
        '**Tea chemistry — Assam\'s liquid gold:**\n\n' +
        'The flavour of Assam tea arises from a cascade of functional group transformations during processing. Fresh tea leaves contain **catechins** (polyphenols with multiple -OH groups). During the "fermentation" step (actually enzyme-catalysed oxidation), polyphenol oxidase converts catechins into **theaflavins** (red-orange) and **thearubigins** (brown). The degree of oxidation determines green tea (minimal) vs black tea (full) vs oolong (partial).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each functional group to its characteristic property',
          pairs: [
            ['Alcohol (-OH)', 'Water-soluble, forms hydrogen bonds — found in ethanol, glycerol'],
            ['Carboxylic acid (-COOH)', 'Acidic, sharp smell — found in vinegar, citric acid, fatty acids'],
            ['Amine (-NH₂)', 'Basic, often pungent or fishy — found in amino acids, neurotransmitters'],
            ['Ester (-COO-)', 'Fruity/floral aroma — found in jackfruit, banana, perfumes'],
          ],
        },
      },
    },

    // ── Section 4: Isomers ────────────────────────────────────────
    {
      title: 'Isomers — Same Formula, Different Structure',
      beginnerContent:
        'Imagine you have 4 red blocks and 10 blue blocks. You can arrange them in a straight line, or branch one red block off the side, or make a ring. Each arrangement looks different and behaves differently — even though you used the **exact same pieces**. That\'s isomerism.\n\n' +
        '**Isomers** are molecules with the same molecular formula but different structural arrangements.\n\n' +
        '**Structural isomers of C₄H₁₀ (butane):**\n\n' +
        '| Isomer | Structure | Boiling point | Shape |\n' +
        '|--------|-----------|--------------|-------|\n' +
        '| n-Butane | Straight chain (4C in a row) | −0.5°C | Long, flexible |\n' +
        '| Isobutane | Branched (3C + 1 branch) | −11.7°C | Compact, spherical |\n\n' +
        'Why does branching lower the boiling point? Branched molecules are more compact, so they have less surface area touching their neighbours → weaker intermolecular forces → easier to boil.\n\n' +
        '**The isomer explosion:**\n\n' +
        '| Molecular formula | # Structural isomers | Why it matters |\n' +
        '|-------------------|---------------------|----------------|\n' +
        '| C₄H₁₀ | 2 | Simple enough to draw |\n' +
        '| C₅H₁₂ | 3 | Still manageable |\n' +
        '| C₇H₁₆ | 9 | Getting complex |\n' +
        '| C₁₀H₂₂ | 75 | Hard to enumerate by hand |\n' +
        '| C₂₀H₄₂ | 366,319 | Requires a computer |\n' +
        '| C₃₀H₆₂ | 4,111,846,763 | Over 4 billion! |\n\n' +
        '**Types of isomers — the family tree:**\n\n' +
        '| Type | What differs | Example |\n' +
        '|------|-------------|--------|\n' +
        '| **Structural** (chain) | Order of carbon chain | n-butane vs isobutane |\n' +
        '| **Structural** (position) | Where the functional group sits | 1-propanol vs 2-propanol |\n' +
        '| **Structural** (functional group) | Which functional group | Ethanol (C₂H₅OH) vs dimethyl ether (CH₃OCH₃) |\n' +
        '| **Geometric** (cis-trans) | Arrangement around a double bond | cis-but-2-ene vs trans-but-2-ene |\n' +
        '| **Optical** (enantiomers) | Mirror images | L-alanine vs D-alanine |\n\n' +
        '**Life chooses sides:** Nearly all amino acids in living organisms are the **L-form** (left-handed), and nearly all sugars are the **D-form** (right-handed). The amino acids in **Muga silk fibroin** are exclusively L-amino acids. If you built the same protein from D-amino acids, it would not fold correctly and would lack silk\'s golden luster and strength entirely.\n\n' +
        '**Quick check:** Ethanol (C₂H₅OH, a drink) and dimethyl ether (CH₃OCH₃, an aerosol propellant) have the same formula C₂H₆O. Why do they behave so differently?\n\n' +
        '*Because they have different functional groups — ethanol has an -OH (alcohol) group that can hydrogen bond with water and other molecules, while dimethyl ether has a C-O-C (ether) linkage that cannot. Same atoms, different arrangement, completely different chemistry.*',
      intermediateContent:
        '**Geometric (cis-trans) isomerism — why it requires a double bond:**\n\n' +
        'Single bonds rotate freely. Double bonds **cannot rotate** — the pi bond locks the molecule in place. If two different groups are attached to each end of the double bond, they can be on the same side (cis/Z) or opposite sides (trans/E):\n\n' +
        '| Isomer | Arrangement | Melting point | Boiling point | Polarity |\n' +
        '|--------|------------|--------------|---------------|----------|\n' +
        '| cis-but-2-ene | CH₃ groups same side | −139°C | 4°C | Polar (dipoles add) |\n' +
        '| trans-but-2-ene | CH₃ groups opposite | −106°C | 1°C | Non-polar (dipoles cancel) |\n\n' +
        '**E/Z nomenclature** (replaces cis/trans for complex molecules): assign priorities using Cahn-Ingold-Prelog rules (higher atomic number = higher priority). Z (zusammen, German for "together") = high-priority groups same side. E (entgegen, "opposite") = high-priority groups opposite side.\n\n' +
        '**Optical isomerism — molecules as hands:**\n\n' +
        'A carbon bonded to **four different groups** is a **chiral centre** (or stereocentre). The molecule and its mirror image are non-superimposable, just like your left and right hands.\n\n' +
        '| Property | Enantiomer 1 (R) | Enantiomer 2 (S) |\n' +
        '|----------|-----------------|------------------|\n' +
        '| Melting point | Same | Same |\n' +
        '| Boiling point | Same | Same |\n' +
        '| Chemical reactions (with achiral reagents) | Same | Same |\n' +
        '| Rotation of polarised light | + (dextrorotatory) | − (levorotatory) |\n' +
        '| Biological activity | **Different** | **Different** |\n\n' +
        '**Worked example — identify chiral centres in alanine:**\n\n' +
        'Alanine: CH₃-CH(NH₂)-COOH. The central carbon is bonded to: -CH₃, -NH₂, -COOH, -H — **four different groups** → chiral. L-alanine and D-alanine are enantiomers.',
      advancedContent:
        '**Chirality in drug design — when mirrors matter:**\n\n' +
        '| Drug | Active enantiomer | Inactive/toxic enantiomer | Consequence |\n' +
        '|------|------------------|--------------------------|-------------|\n' +
        '| **Thalidomide** | (R) — sedative | (S) — teratogenic | Birth defects in the 1960s |\n' +
        '| **Ibuprofen** | (S) — anti-inflammatory | (R) — inactive | Body converts R→S slowly |\n' +
        '| **L-DOPA** | (S) — treats Parkinson\'s | (R) — toxic | Must use pure S-form |\n' +
        '| **Naproxen** | (S) — anti-inflammatory | (R) — liver toxin | Sold as single enantiomer |\n\n' +
        '**Determining configuration — Cahn-Ingold-Prelog (CIP) rules:**\n\n' +
        '| Step | Rule | Example |\n' +
        '|------|------|--------|\n' +
        '| 1 | Assign priority by atomic number (higher = higher) | O > N > C > H |\n' +
        '| 2 | If tied, look at next atom along the chain | -CH₂OH > -CH₃ (O beats H at second atom) |\n' +
        '| 3 | Orient molecule with lowest priority (#4) pointing away | H pointing back |\n' +
        '| 4 | Trace 1→2→3: clockwise = **R**, anticlockwise = **S** | |\n\n' +
        '**Conformational analysis — rotation around single bonds:**\n\n' +
        'Single bonds rotate, but not all positions are equally stable:\n\n' +
        '| Conformation | Dihedral angle | Energy | Stability |\n' +
        '|-------------|---------------|--------|----------|\n' +
        '| Staggered (anti) | 180° | Lowest | Most stable |\n' +
        '| Staggered (gauche) | 60° | +3.8 kJ/mol | Stable |\n' +
        '| Eclipsed | 0° | +12.5 kJ/mol | Unstable |\n' +
        '| Eclipsed (CH₃/CH₃) | 0° | +19 kJ/mol | Least stable |\n\n' +
        'In large biological molecules like Muga silk fibroin, conformational preferences at each bond accumulate to determine the overall 3D shape. The beta-sheet structure of silk arises because the peptide backbone adopts an extended (anti) conformation at every residue, allowing hydrogen bonds between adjacent chains.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Structural isomers always have the same boiling point.', answer: false, explanation: 'Structural isomers have different physical properties including different boiling points. For example, n-butane boils at -0.5°C while isobutane boils at -11.7°C.' },
            { text: 'A molecule needs a carbon bonded to four different groups to be optically active.', answer: true, explanation: 'A chiral centre (stereocentre) requires four different substituents on the same carbon. This creates non-superimposable mirror images (enantiomers) that rotate plane-polarised light.' },
            { text: 'Cis-trans isomerism can occur around a single C-C bond.', answer: false, explanation: 'Single bonds rotate freely, so groups can switch sides at any time. Cis-trans isomerism requires a double bond (or ring) that prevents rotation, locking groups on one side or the other.' },
            { text: 'L-amino acids and D-amino acids have identical chemical properties with achiral reagents.', answer: true, explanation: 'Enantiomers react identically with achiral reagents. They differ only in rotating polarised light and in reactions with OTHER chiral molecules — which is why enzymes (chiral) can distinguish them.' },
          ],
        },
      },
    },

    // ── Section 5: Polymers ───────────────────────────────────────
    {
      title: 'Polymers — Building Big from Small',
      diagram: 'PolymerChainDiagram',
      beginnerContent:
        'A polymer is a giant molecule made by linking thousands of small molecules (**monomers**) into a repeating chain. Think of it like a paper-clip chain — each clip is a monomer, and the whole chain is the polymer. The word itself says it: *poly* (many) + *mer* (parts).\n\n' +
        '**Synthetic polymers — the plastics in your life:**\n\n' +
        '| Polymer | Monomer | Use | Properties |\n' +
        '|---------|---------|-----|------------|\n' +
        '| Polyethylene (PE) | Ethene (C₂H₄) | Bags, bottles | Flexible, waterproof |\n' +
        '| Polypropylene (PP) | Propene (C₃H₆) | Containers, rope | Tough, heat-resistant |\n' +
        '| PVC | Vinyl chloride | Pipes, cables | Rigid, durable |\n' +
        '| Polystyrene | Styrene | Cups, insulation | Light, brittle |\n' +
        '| Nylon | Diamine + diacid | Clothing, rope | Strong, elastic |\n' +
        '| Teflon (PTFE) | Tetrafluoroethene | Non-stick pans | Extremely low friction |\n\n' +
        '**Two ways to make polymers:**\n\n' +
        '| Type | How it works | Byproduct | Example |\n' +
        '|------|-------------|-----------|--------|\n' +
        '| **Addition** | Monomers add directly (double bond opens) | None | Polyethylene, PVC, polystyrene |\n' +
        '| **Condensation** | Monomers join, releasing a small molecule | Water (H₂O) | Nylon, polyester, proteins, silk |\n\n' +
        '**Nature is the original polymer chemist:**\n\n' +
        '| Natural polymer | Monomer | Function | Where you find it |\n' +
        '|----------------|---------|----------|--------------------|\n' +
        '| **Cellulose** | Glucose | Plant cell walls — most abundant organic compound on Earth | Bamboo, the structural plant of NE India |\n' +
        '| **Starch** | Glucose (different linkage) | Energy storage in plants | Rice — Assam\'s staple crop |\n' +
        '| **Silk fibroin** | Amino acids (Gly, Ala, Ser) | Structural fibre | **Muga silk** — Assam\'s golden heritage |\n' +
        '| **Rubber** | Isoprene | Elastic waterproofing | Rubber tree plantations |\n' +
        '| **DNA** | Nucleotides | Genetic information | Every living thing |\n\n' +
        '**Muga silk — chemistry makes it golden:**\n\n' +
        'The Muga silkworm (*Antheraea assamensis*) is endemic to Assam and feeds exclusively on *som* and *sualu* trees. Its fibroin protein is a condensation polymer of ~5,000 amino acid residues, dominated by glycine (43%), alanine (30%), and serine (12%). The regular alternation of small amino acids (glycine, alanine) allows the chains to pack tightly into crystalline **beta-sheet** structures, giving Muga silk its tensile strength of ~0.5 GPa — comparable to steel wire of the same diameter. The golden colour comes from a **carotenoid pigment** in the sericin coating, not from the fibroin itself.\n\n' +
        '**Quick check:** Both starch and cellulose are polymers of glucose. Why can you digest starch but not cellulose?\n\n' +
        '*Because the glucose units are linked differently. Starch uses alpha linkages that human amylase enzymes can break. Cellulose uses beta linkages that our enzymes cannot cut. Cows and termites can digest cellulose only because bacteria in their guts have the right enzyme (cellulase).*',
      intermediateContent:
        '**What determines a polymer\'s properties?**\n\n' +
        '| Factor | Effect | Example |\n' +
        '|--------|--------|--------|\n' +
        '| Chain length | Longer → stronger, higher melting point | Short PE = wax, long PE = tough plastic |\n' +
        '| Branching | More branches → weaker intermolecular forces → softer | LDPE (branched, flexible bags) vs HDPE (linear, rigid bottles) |\n' +
        '| Cross-linking | Covalent bonds between chains → rigid or elastic | Vulcanised rubber (cross-linked with sulfur) |\n' +
        '| Crystallinity | Ordered regions → stronger, more opaque | Muga silk beta-sheets are crystalline regions |\n' +
        '| Monomer type | Determines polarity, H-bonding, rigidity | Nylon is strong because amide groups form H-bonds between chains |\n\n' +
        '**Worked example — why is HDPE harder than LDPE?**\n\n' +
        '| Property | LDPE | HDPE |\n' +
        '|----------|------|------|\n' +
        '| Structure | Branched chains | Linear chains |\n' +
        '| Packing | Loose — branches prevent close contact | Tight — chains align closely |\n' +
        '| Crystallinity | ~50% | ~80% |\n' +
        '| Density | 0.91–0.94 g/cm³ | 0.94–0.97 g/cm³ |\n' +
        '| Melting point | ~115°C | ~135°C |\n' +
        '| Use | Plastic bags, cling film | Milk jugs, pipes, hard containers |\n\n' +
        'Linear chains pack like straight pencils in a box; branched chains pack like tangled sticks. Closer packing → stronger intermolecular forces → harder material.\n\n' +
        '**Condensation polymerisation — nylon as a worked example:**\n\n' +
        '`n H₂N-(CH₂)₆-NH₂ + n HOOC-(CH₂)₄-COOH → [-NH-(CH₂)₆-NH-CO-(CH₂)₄-CO-]ₙ + 2n H₂O`\n\n' +
        'Each amine (-NH₂) reacts with each acid (-COOH), releasing water and forming an amide bond (-CONH-). The resulting nylon-6,6 has strong hydrogen bonds between the amide groups of adjacent chains, giving it silk-like strength — in fact, nylon was developed as a synthetic silk substitute.',
      advancedContent:
        '**Polymer crystallography — understanding silk at the molecular level:**\n\n' +
        'Silk fibroin adopts a **beta-sheet** secondary structure. Key features:\n\n' +
        '| Parameter | Value | Significance |\n' +
        '|-----------|-------|-------------|\n' +
        '| Repeat distance (along chain) | 0.70 nm | Two residues per repeat |\n' +
        '| Sheet spacing | 0.53 nm (Gly) / 0.57 nm (Ala) | Small side chains allow tight packing |\n' +
        '| Hydrogen bond length | 0.28–0.30 nm | N-H···O=C between chains |\n' +
        '| Crystallinity | ~40–45% (Muga) | Higher than Mulberry silk (~35%) |\n' +
        '| Tensile strength | ~500 MPa | Comparable to steel wire |\n\n' +
        '**Why Gly-Ala repeats?** Glycine (H side chain) and alanine (CH₃ side chain) are the two smallest amino acids. In the beta-sheet, side chains alternate above and below the sheet plane. If they were bulky (like tryptophan or phenylalanine), the sheets couldn\'t pack tightly. Silk\'s strength comes from its simplicity.\n\n' +
        '**Polymer degradation — the plastic crisis:**\n\n' +
        '| Polymer | Degradation time | Why |\n' +
        '|---------|-----------------|-----|\n' +
        '| Paper (cellulose) | 2–6 weeks | Enzymes from soil bacteria cleave beta-glycosidic bonds |\n' +
        '| Nylon | 30–40 years | Amide bonds slowly hydrolyse |\n' +
        '| PET (plastic bottles) | 450+ years | Ester bonds resist hydrolysis in ambient conditions |\n' +
        '| Polyethylene | 500–1,000 years | No functional groups for enzymes to attack |\n' +
        '| Muga silk | 1–5 years | Protein bonds hydrolysed by soil bacteria |\n\n' +
        '**Biodegradable alternatives:**\n\n' +
        '| Material | Source | Degrades in | Chemistry |\n' +
        '|----------|--------|------------|----------|\n' +
        '| PLA (polylactic acid) | Corn starch | 6–12 months | Condensation polymer of lactic acid |\n' +
        '| PHA (polyhydroxyalkanoates) | Bacterial fermentation | 3–6 months | Bacterial polyester |\n' +
        '| Regenerated cellulose | Wood pulp | Weeks | Same as paper |\n' +
        '| Silk-based films | Silk fibroin dissolved + recast | Months | Protein-based, tunable |\n\n' +
        'Researchers at IIT Guwahati and Assam Agricultural University are exploring Muga silk fibroin as a biomaterial — its biocompatibility, controlled degradation, and mechanical properties make it promising for wound dressings and tissue engineering scaffolds. The chemistry of Assam\'s traditional textile is becoming the chemistry of tomorrow\'s medicine.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Addition polymerisation produces water as a byproduct.', answer: false, explanation: 'Addition polymerisation produces NO byproduct — monomers simply add together by opening their double bonds. Condensation polymerisation produces water (or another small molecule).' },
            { text: 'Cellulose and starch are both polymers of glucose but have different linkages.', answer: true, explanation: 'Starch has alpha-1,4 glycosidic linkages (digestible by amylase), while cellulose has beta-1,4 linkages (indigestible by humans). Same monomer, different bond orientation, completely different properties.' },
            { text: 'Muga silk gets its golden colour from the fibroin protein.', answer: false, explanation: 'The golden colour comes from carotenoid pigments in the sericin coating (the outer layer), not from the fibroin protein itself. When sericin is removed (degumming), the silk becomes lighter.' },
            { text: 'Cross-linking polymer chains makes the material more rigid.', answer: true, explanation: 'Cross-links are covalent bonds between chains that prevent them from sliding past each other. More cross-links = more rigid. Example: vulcanised rubber (cross-linked with sulfur) is much harder than natural rubber.' },
          ],
        },
      },
    },
  ],
};
