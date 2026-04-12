import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'plant-biology',
  title: 'Plant Biology',
  category: 'botany',
  icon: '🌱',
  tagline: 'How plants make food from sunlight, grow toward the sky, and reproduce.',
  relatedStories: ['old-banyan-trees-stories', 'tejimola-the-girl-who-became-a-plant', 'orchid-colors', 'pitcher-plant', 'bamboo-grows-fast', 'girl-grew-forest'],
  understand: [
    {
      title: 'Photosynthesis — The Engine of Life',
      beginnerContent:
        'Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose (sugar) and oxygen. It happens primarily in the leaves, inside tiny structures called chloroplasts that contain the green pigment chlorophyll. Chlorophyll absorbs red and blue light and reflects green — which is why most leaves look green. The basic equation is: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2. In plain language: six molecules of carbon dioxide plus six molecules of water, powered by light, produce one molecule of glucose and six molecules of oxygen. The glucose fuels the plant\'s growth, and the oxygen is released into the air — the very oxygen you are breathing right now. Nearly all life on Earth depends on photosynthesis, either directly (plants) or indirectly (animals that eat plants, or animals that eat those animals).',
      intermediateContent:
        'Photosynthesis has two stages. The **light-dependent reactions** occur in the thylakoid membranes: chlorophyll absorbs photons and uses that energy to split water (photolysis): **2H₂O → 4H⁺ + 4e⁻ + O₂**. The electrons travel along an electron transport chain (Photosystem II → plastoquinone → cytochrome b6f → Photosystem I → ferredoxin), generating **ATP** via chemiosmosis and **NADPH** via NADP⁺ reductase. The **light-independent reactions** (Calvin cycle) occur in the stroma: the enzyme RuBisCO fixes CO₂ onto ribulose bisphosphate (RuBP), producing 3-phosphoglycerate (3-PGA). ATP and NADPH then reduce 3-PGA to glyceraldehyde-3-phosphate (G3P). For every 3 CO₂ fixed, one G3P exits the cycle — requiring 9 ATP and 6 NADPH per net G3P. Six turns produce one glucose molecule.',
      advancedContent:
        'RuBisCO is the most abundant protein on Earth (~500 million tonnes globally) yet remarkably slow — fixing only ~3 CO₂ molecules per second versus typical enzyme rates of 1,000/s. It also catalyses a wasteful side reaction with O₂ called **photorespiration**, which can reduce photosynthetic efficiency by 25-30%. **C₄ plants** (maize, sugarcane) evolved a CO₂-concentrating mechanism: mesophyll cells fix CO₂ via PEP carboxylase (which has no O₂ affinity) into oxaloacetate, shuttle it to bundle-sheath cells, and release CO₂ at high concentration around RuBisCO, suppressing photorespiration. **CAM plants** (cacti, pineapple) temporally separate CO₂ fixation (night) from the Calvin cycle (day), conserving water. Synthetic biology efforts aim to engineer C₄ pathways into C₃ crops like rice — the C₄ Rice Project at IRRI could boost yields by 50%.',
      diagram: 'PhotosynthesisDiagram',
    },
    {
      title: 'Roots — The Hidden Half',
      beginnerContent:
        'Roots anchor the plant in soil and absorb water and dissolved minerals. Most of the absorption happens through root hairs — tiny, hair-like extensions of root cells that massively increase the surface area in contact with soil. A single rye plant can have over 14 billion root hairs with a combined length of over 10,000 kilometres. Roots also store energy. Carrots, turnips, and cassava are all swollen roots packed with starch that the plant made through photosynthesis. The old banyan trees of Assam are famous for their aerial roots — roots that grow downward from branches into the soil, eventually becoming new trunks. A single banyan tree can spread across an area larger than a football field, supported by hundreds of these pillar-like roots.',
      intermediateContent:
        'Water enters root hairs by **osmosis** — moving from the dilute soil solution (high water potential, Ψ ≈ −0.3 MPa) to the more concentrated cell sap (lower Ψ ≈ −0.7 MPa). The water potential equation is **Ψ = Ψₛ + Ψₚ**, where Ψₛ is solute potential (always negative) and Ψₚ is pressure potential. Once inside the root, water travels via two pathways: the **apoplast** (through cell walls — fast but blocked by the Casparian strip in the endodermis) and the **symplast** (through cytoplasm via plasmodesmata — slower but regulated). The Casparian strip is a waxy barrier of suberin that forces water through endodermal cell membranes, giving the plant control over which minerals enter the xylem. Root pressure (typically 0.1–0.5 MPa) can push water a few metres, but transpiration pull generates tensions of −1 to −2 MPa, sufficient to lift water 100+ metres in tall trees.',
      advancedContent:
        'The **Cohesion-Tension Theory** explains water ascent in tall trees. Transpiration from leaf stomata creates a negative pressure (tension) in xylem sap. Water\'s high cohesion (due to hydrogen bonding) means this tension pulls an unbroken column of water upward. The tensile strength of water is approximately **−30 MPa**, far exceeding the −2 MPa tension needed in the tallest trees (~115 m redwoods). Cavitation (air embolism) can break the water column under drought stress; plants repair cavitated vessels by refilling them with water under positive root pressure at night. **Mycorrhizal networks** extend the root system: ectomycorrhizal fungi increase the absorptive surface area by 100–1,000× and access phosphorus locked in mineral particles via secretion of organic acids and phosphatases. In exchange, the plant transfers 10–30% of its photosynthate to the fungal partner — a carbon cost offset by enormous gains in nutrient acquisition.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A single rye plant can have over 14 billion root hairs with a combined length of over 10,000 km — enough to stretch from India to Brazil.',
            'Banyan trees grow aerial roots that become new trunks. One banyan tree in Kolkata (the Great Banyan) looks like a small forest but is a single organism.',
            'Some roots go deep (a wild fig in South Africa had roots measured at 120 metres below the surface) while others spread wide (a single aspen grove connected by roots can span 40 hectares).',
          ],
        },
      },
    },
    {
      title: 'Stems and Transport',
      beginnerContent:
        'Stems support the plant, hold leaves up toward the light, and contain the vascular system — two types of tubes that transport materials. Xylem tubes carry water and minerals upward from roots to leaves. Phloem tubes carry sugars (made in the leaves by photosynthesis) downward and to wherever the plant needs energy. In trees, the xylem eventually becomes wood. Water moves up through xylem by a combination of root pressure, capillary action, and transpiration pull — as water evaporates from tiny pores in the leaves (called stomata), it creates a suction that pulls more water up from the roots. This system can lift water over 100 metres in the tallest trees without any pump.',
      intermediateContent:
        'Xylem vessels are dead cells with lignified walls arranged end-to-end with perforated end plates, forming continuous tubes. Flow rate follows the **Hagen-Poiseuille equation**: **Q = πr⁴ΔP / 8ηL**, where r is vessel radius, ΔP is pressure difference, η is viscosity, and L is length. Because flow scales with r⁴, a vessel twice as wide carries 16× more water. Phloem transport follows the **Münch pressure-flow hypothesis**: sucrose is actively loaded into sieve tubes at sources (leaves), lowering water potential and drawing water in by osmosis. This creates high turgor pressure that pushes the sap toward sinks (roots, fruits, growing tips) where sucrose is unloaded. Typical phloem flow rates are 0.5–1.0 m/hour. A mature oak tree can transpire 400+ litres per day, creating xylem flow rates of 1–6 m/hour.',
      advancedContent:
        'The evolution of xylem vessels was a key innovation enabling angiosperms to dominate terrestrial ecosystems. Early vascular plants (ferns, conifers) rely on **tracheids** — narrow cells with bordered pits that limit flow but resist cavitation. Angiosperms evolved wider **vessel elements** that sacrifice cavitation resistance for hydraulic efficiency. The **wood density–conductivity trade-off** constrains tree design: tropical trees in wet climates have wide, efficient vessels but are vulnerable to drought-induced embolism, while drought-adapted species have narrow, safe vessels but lower maximum growth rates. **Phloem loading** strategies vary: in many trees, sucrose enters phloem passively through **polymer trapping** (sucrose diffuses into companion cells and is converted to raffinose, which is too large to diffuse back). In herbs, active loading via H⁺/sucrose symporters concentrates sucrose 2–3× above mesophyll levels, generating stronger osmotic gradients. Research into synthetic xylem-inspired microfluidic systems aims to create passive water transport devices for agriculture.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each transport system to what it carries',
          pairs: [
            ['Xylem', 'Carries water and minerals upward from roots to leaves'],
            ['Phloem', 'Carries sugars downward from leaves to the rest of the plant'],
            ['Stomata', 'Tiny pores in leaves that release water vapour, creating transpiration pull'],
            ['Root hairs', 'Absorb water and minerals from the soil into the root'],
          ],
        },
      },
    },
    {
      title: 'Leaves — Solar Panels of the Plant',
      beginnerContent:
        'Leaves are optimised for capturing light. Most are flat and thin, maximising surface area while minimising the distance gases need to diffuse in or out. The upper surface has a waxy cuticle that prevents water loss, while the underside has thousands of tiny pores called stomata that open and close to let carbon dioxide in and oxygen and water vapour out. Inside the leaf, cells are packed with chloroplasts for photosynthesis. Leaves come in extraordinary variety — from the tiny needles of a pine tree (which reduce water loss in cold, dry conditions) to the enormous leaves of the giant water lily that can be two metres across and strong enough to support a child. Bamboo leaves are long and narrow, which helps them flex in wind rather than tearing.',
      intermediateContent:
        'A typical leaf has distinct tissue layers. The **upper epidermis** (with cuticle) transmits light while reducing water loss. Below it, **palisade mesophyll** cells are tightly packed and elongated, each containing 50–100 chloroplasts — this is where most photosynthesis occurs. The **spongy mesophyll** below has irregular cells with large air spaces (up to 50% air by volume) that facilitate gas diffusion. Stomata are bordered by two kidney-shaped **guard cells** that open when turgid (filled with water via K⁺ ion influx) and close when flaccid. A typical leaf has 100–300 stomata per mm² on the lower surface. Stomatal conductance is measured in mmol H₂O m⁻² s⁻¹. The **transpiration ratio** (water lost per CO₂ fixed) is ~500:1 for C₃ plants — meaning plants lose 500 g of water for every 1 g of CO₂ they fix.',
      advancedContent:
        'Leaf economics theory describes a universal **leaf economics spectrum**: leaves invest in either cheap, short-lived tissue (high photosynthetic rate, high nutrient content, short lifespan) or expensive, durable tissue (low photosynthetic rate, thick cell walls, long lifespan). Across 2,548 species worldwide, leaf mass per area (LMA), nitrogen content, photosynthetic capacity, and leaf lifespan form a tightly correlated spectrum. **Optimal stomatal theory** (Cowan & Farquhar, 1977) predicts that stomata should maximize carbon gain for a given water loss: the marginal water cost of carbon (∂E/∂A, where E is transpiration and A is assimilation) should remain constant throughout the day. Modern models couple stomatal conductance to the **Farquhar-von Caemmerer-Berry (FvCB) model** of photosynthesis, which distinguishes RuBisCO-limited (Vcmax) and electron transport-limited (Jmax) assimilation rates. These models underpin vegetation components of global climate models used to project carbon cycle feedbacks.',
      diagram: 'PhotosynthesisDiagram',
    },
    {
      title: 'How Plants Grow — Fast and Slow',
      beginnerContent:
        'Plants grow from special regions called meristems, where cells divide rapidly. The tip of each root and shoot has an apical meristem that drives the plant longer. Trees and woody plants also have a lateral meristem (cambium) that makes them wider — this is what produces tree rings, one ring for each year of growth. Some plants grow astoundingly fast. Bamboo — a grass, not a tree — holds the record: certain species can grow up to 91 centimetres in a single day. Bamboo achieves this because all of its cells elongate simultaneously rather than dividing, and the entire shoot is essentially a pre-formed structure that inflates with water. This rapid growth is why bamboo is such a sustainable building material — you can harvest it and it regrows within years, unlike a hardwood tree that takes decades.',
      intermediateContent:
        'Plant growth is regulated by **hormones**. **Auxin** (IAA) promotes cell elongation and is produced in shoot tips — it causes phototropism (growth toward light) because it migrates to the shaded side of the stem, elongating those cells more. **Gibberellins** stimulate stem elongation and seed germination. **Cytokinins** promote cell division and are produced in root tips. **Abscisic acid (ABA)** inhibits growth and triggers stomatal closure during drought. **Ethylene** (a gas) promotes fruit ripening and leaf drop. The **acid growth hypothesis** explains auxin\'s mechanism: auxin activates H⁺-ATPase pumps in the plasma membrane, acidifying the cell wall to pH ~4.5. The low pH activates **expansins**, proteins that loosen hydrogen bonds between cellulose microfibrils, allowing turgor pressure to stretch the wall irreversibly.',
      advancedContent:
        'Plant meristems are maintained by a feedback loop between the transcription factor **WUSCHEL** (WUS) and the peptide ligand **CLAVATA3** (CLV3). WUS, expressed in the organizing centre, promotes stem cell identity in overlying cells. Those stem cells secrete CLV3, which activates the CLV1 receptor kinase in the organizing centre, repressing WUS — creating a self-regulating population of ~60 stem cells. Disrupting this loop (clv3 mutants) causes massively enlarged meristems and extra organs. **Dendrochronology** exploits annual ring patterns for climate reconstruction: ring width correlates with growing-season temperature and precipitation. Bristlecone pine chronologies extend 9,000+ years, calibrating radiocarbon dating. At the molecular level, secondary growth depends on the **vascular cambium**, where the transcription factors HD-ZIP III and KANADI establish xylem vs. phloem identity on opposite sides of the cambial ring.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Bamboo is a type of tree.', answer: false, explanation: 'Bamboo is actually a grass — the tallest and fastest-growing grass in the world.' },
            { text: 'Tree rings are produced by the lateral meristem (cambium), one ring per year of growth.', answer: true, explanation: 'The cambium produces a ring of new wood each growing season, which is why you can count rings to estimate a tree\'s age.' },
            { text: 'Some bamboo species can grow up to 91 centimetres in a single day.', answer: true, explanation: 'Bamboo achieves this because all its cells elongate simultaneously, inflating with water like a pre-formed structure.' },
          ],
        },
      },
    },
    {
      title: 'Pollination — How Plants Reproduce',
      beginnerContent:
        'Flowers are reproductive structures. The male parts (stamens) produce pollen, and the female part (pistil) contains ovules that become seeds when fertilised. Pollination is the transfer of pollen from stamen to pistil. Many plants rely on animals for this: bees are attracted by bright colors and sweet nectar, hummingbirds by red tubular flowers, and bats by large, pale flowers that open at night. Wind pollinates grasses, corn, and many trees — these plants produce enormous amounts of lightweight pollen (which is what causes hay fever). Some orchids have evolved astonishing tricks: certain species mimic the shape and scent of female insects so precisely that male insects attempt to mate with the flower, getting covered in pollen in the process.',
      intermediateContent:
        'After a pollen grain lands on the stigma, it germinates a **pollen tube** that grows down through the style to the ovule — guided by chemical signals from the embryo sac. The tube can grow 1–3 cm in hours. **Double fertilisation** (unique to angiosperms) occurs when the pollen tube delivers two sperm nuclei: one fuses with the egg to form the **diploid zygote** (2n), and the other fuses with two polar nuclei to form the **triploid endosperm** (3n), which nourishes the developing embryo. Self-pollination is prevented by mechanisms like **self-incompatibility** (S-locus genes cause pollen rejection), **dichogamy** (anthers and stigma mature at different times), and **heterostyly** (stamens and pistils at different heights in different flower morphs). About 75% of crop species depend on animal pollinators, contributing an estimated $235–577 billion annually to global agriculture.',
      advancedContent:
        'The molecular basis of self-incompatibility involves a highly polymorphic **S-locus** with two linked genes: one expressed in pollen (SCR/SP11 in Brassicaceae) and one in the stigma (SRK receptor kinase). When pollen and stigma carry matching S-alleles, SRK is activated, triggering a signalling cascade (ARC1 E3 ubiquitin ligase → degradation of compatibility factors) that blocks pollen hydration and germination. Over 100 S-alleles exist in some species, maintained by **negative frequency-dependent selection** — rare alleles have a fertilisation advantage because fewer potential mates will reject them. **Coevolution** between flowers and pollinators drives extraordinary specialisation: Darwin predicted that the 30 cm nectar spur of the Madagascar orchid *Angraecum sesquipedale* implied a moth with a 30 cm proboscis — the hawk moth *Xanthopan morganii praedicta* was discovered decades later, confirming his prediction.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each pollinator to the flowers it prefers',
          pairs: [
            ['Bees', 'Bright colors (blue, yellow, purple) with sweet nectar and landing platforms'],
            ['Hummingbirds', 'Red tubular flowers with deep nectar reserves'],
            ['Bats', 'Large, pale flowers that open at night with strong scent'],
            ['Wind', 'Small, inconspicuous flowers producing huge amounts of lightweight pollen'],
          ],
        },
      },
    },
    {
      title: 'Seed Dispersal — Spreading to New Places',
      beginnerContent:
        'Once seeds form, the plant needs to spread them away from the parent to avoid competition. Evolution has produced ingenious methods. Dandelion seeds have parachute-like structures that carry them on the wind. Coconuts float across oceans. Berries are eaten by birds who deposit the seeds in their droppings far away. Maple seeds spin like helicopters. Burdock seeds have tiny hooks that cling to animal fur — this design directly inspired the invention of Velcro. Pitcher plants of Meghalaya take a different approach: these carnivorous plants grow in nutrient-poor soil and supplement their diet by trapping insects in slippery, pitcher-shaped leaves filled with digestive fluid. Their seeds are tiny and light, dispersed by wind and rain.',
      intermediateContent:
        'Seed dispersal distance follows predictable physics. A dandelion pappus acts as a **parachute**: its terminal velocity is only ~0.3 m/s because the porous bristle structure creates a **separated vortex ring** above the pappus (discovered 2018), generating drag far more efficiently than a solid disc. A maple samara is an **autorotating wing**: it enters a stable spin at ~10 Hz, with a Reynolds number of ~1,000, generating lift via a **leading-edge vortex** similar to insect wings. Its descent rate is ~0.9 m/s. In a 5 m/s breeze, a dandelion seed can travel >100 km while a maple seed reaches ~100 m. Animal-dispersed seeds must survive gut passage (typically 30 min–24 hr): the scarification of the seed coat by stomach acid and mechanical abrasion actually improves germination rates by 20–80% in many species.',
      advancedContent:
        'Dispersal ecology connects to **metapopulation theory** and **island biogeography**. The probability of a seed reaching distance d from the parent follows a **dispersal kernel** — often modelled as a fat-tailed distribution (e.g., 2Dt kernel: P(d) ∝ (1 + d²/u)^(−p)) rather than a simple exponential, because rare long-distance dispersal events disproportionately shape species range expansion. Genetic evidence (microsatellite markers, parentage analysis) reveals that long-distance dispersal by birds can deposit seeds 100+ km from the source, explaining rapid post-glacial recolonisation rates of 100–500 m/year observed in European tree pollen records. **Ballistic dispersal** in Hura crepitans (sandbox tree) launches seeds at 70 m/s using explosive dehiscence of the fruit — the capsule dries unevenly, building elastic strain energy that is released catastrophically, analogous to a compressed spring.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each seed dispersal method to its example',
          pairs: [
            ['Wind dispersal', 'Dandelion parachutes and maple helicopter seeds'],
            ['Water dispersal', 'Coconuts that float across oceans'],
            ['Animal ingestion', 'Berries eaten by birds, seeds deposited in droppings'],
            ['Animal attachment', 'Burdock hooks that cling to fur — the inspiration for Velcro'],
          ],
        },
      },
    },
    {
      title: 'Plant Parts and Their Functions',
      beginnerContent:
        'Every part of a plant serves a specific purpose in keeping it alive and helping it reproduce. Understanding which part does what is the foundation of botany, agriculture, and even cooking — when you eat a carrot, you are eating a root; when you eat celery, you are eating a stem; when you eat lettuce, you are eating leaves; and when you eat an apple, you are eating the fleshy part of a fruit that surrounds the seeds.',
      intermediateContent:
        'Fruits develop from the ovary wall after fertilisation. A **true fruit** (simple fruit) develops from a single ovary: **drupe** (mango — fleshy outer, stony pit enclosing one seed), **berry** (tomato — fleshy throughout, multiple seeds), **pome** (apple — the fleshy part is the receptacle, not the ovary). An **aggregate fruit** (raspberry) develops from a single flower with multiple ovaries. A **multiple fruit** (pineapple) develops from a cluster of flowers. **Seeds** contain three parts: the **embryo** (the baby plant with radicle, plumule, and cotyledons), the **endosperm** (food reserve — starchy in rice, oily in sunflower), and the **seed coat** (testa). In monocots (rice, maize) there is one cotyledon; in dicots (beans, peas) there are two, which often store the seed\'s food supply after absorbing the endosperm.',
      advancedContent:
        'Fruit development is regulated by the plant hormones **auxin** and **gibberellin** produced by developing seeds. Seedless (parthenocarpic) fruits like bananas result from natural or induced hormone imbalances that trigger fruit growth without fertilisation — commercially exploited in seedless grapes via gibberellin sprays. The **ABC model of flower development** (Coen & Meyerowitz, 1991) explains how three classes of homeotic genes specify floral organ identity: A alone = sepals, A+B = petals, B+C = stamens, C alone = carpels. Loss-of-function mutations produce homeotic conversions (e.g., petals replaced by sepals in AP3 mutants). The model has been extended to ABCE, with E-class genes (SEPALLATA) required for all whorls. Comparative genomics shows these MADS-box transcription factors are conserved across 300 million years of angiosperm evolution, providing molecular evidence for the deep homology of floral organs.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each plant part to its function',
          pairs: [
            ['Roots', 'Absorb water and minerals from the soil, anchor the plant'],
            ['Stem', 'Supports the plant and transports water and sugars'],
            ['Leaves', 'Capture sunlight and perform photosynthesis'],
            ['Flowers', 'Reproductive structures that produce pollen and ovules'],
            ['Fruit', 'Protects seeds and helps with seed dispersal'],
            ['Seeds', 'Contain the embryo and food store for a new plant'],
          ],
        },
      },
    },
  ]
};
