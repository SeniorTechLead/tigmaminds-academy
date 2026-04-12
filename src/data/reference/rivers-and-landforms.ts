import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'rivers-and-landforms',
  title: 'Rivers & Landforms',
  category: 'geography',
  icon: '🏞️',
  tagline: 'How rivers carve valleys, build deltas, and create the world\'s largest river island.',
  relatedStories: ['how-majuli-island-was-born', 'river-braid', 'siang-river', 'turtle-mountain', 'ferrymans-riddle'],
  understand: [
    {
      title: 'How Rivers Begin',
      diagram: 'RiverSourceDiagram',
      beginnerContent:
        'Every river starts as a tiny trickle. Rain falls on high ground, collects in small channels, and gravity pulls it downhill. These small streams merge into larger ones, which merge into rivers. The area of land that drains into a single river is called its catchment or watershed. The Brahmaputra\'s watershed is enormous — about 580,000 square kilometres spanning Tibet, India, and Bangladesh. The river begins as the Yarlung Tsangpo high on the Tibetan Plateau, fed by snowmelt and glaciers. It crashes through the deepest gorge on Earth (the Yarlung Tsangpo Grand Canyon, over 5,000 metres deep) before entering Assam as the Siang, then broadening into the mighty Brahmaputra — one of the largest rivers in the world by water volume.',
      intermediateContent:
        'River discharge Q (m³/s) = cross-sectional area A × average velocity v. The **Manning equation** v = (1/n) × R²″³ × S¹′² relates velocity to hydraulic radius R (area/wetted perimeter), channel slope S, and roughness coefficient n (smooth concrete ≈ 0.012; rocky mountain stream ≈ 0.05). The Brahmaputra’s average discharge at Guwahati is about 19,800 m³/s, carrying roughly 735 million tonnes of sediment per year. **Hjulström’s curve** shows that fine clay requires higher velocity to erode than sand (clay particles are cohesive) but lower velocity to transport once entrained. A river’s **long profile** — a plot of elevation against distance from source — is typically concave, steepest near the source and nearly flat near the mouth, reflecting the balance between erosion and deposition along its length.',
      advancedContent:
        'Fluvial geomorphology uses the **stream power equation** Ω = ρgQS (watts per metre of channel) to predict erosion rates, where ρ is water density, g is gravitational acceleration, Q is discharge, and S is slope. Alluvial rivers self-organise toward a **graded profile** where sediment transport capacity matches sediment supply. **Knickpoint retreat** — the upstream migration of waterfalls — propagates base-level changes through river networks at rates modelled by the stream-power incision model dz/dt = −K·A^m·S^n, where A is upstream drainage area and K, m, n are empirical constants. Satellite-based **InSAR** (Interferometric Synthetic Aperture Radar) now measures riverbank erosion to millimetre precision. For the Brahmaputra, morphodynamic models coupling hydrodynamics (Saint-Venant equations) with sediment transport (Meyer-Peter and Müller equation) help predict channel migration and island formation — critical for planning flood defences in Assam.',
    },
    {
      title: 'Erosion — How Rivers Shape the Land',
      beginnerContent:
        'Rivers are powerful sculptors. They shape the landscape through four types of erosion. Hydraulic action: the sheer force of moving water loosens and removes material from the riverbed and banks. Abrasion: rocks and sediment carried by the river act like sandpaper, grinding away the channel. Attrition: rocks tumbling in the current collide with each other and break into smaller, rounder pieces. Solution: slightly acidic river water dissolves certain minerals from the rock. In its upper course, where the gradient is steep, a river cuts downward to create V-shaped valleys, waterfalls, and gorges. The Siang river in Arunachal Pradesh demonstrates this dramatically — it churns through narrow gorges with such force that the roar can be heard from kilometres away.',
      diagram: 'RiverErosionDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each river term to its meaning',
          pairs: [
            ['Meander', 'A curve or bend in a river\'s course'],
            ['Oxbow lake', 'A crescent-shaped lake formed when a meander is cut off'],
            ['Flood plain', 'Flat land beside a river that is covered with silt during floods'],
            ['Delta', 'A fan-shaped deposit of sediment where a river meets the sea'],
            ['Braided river', 'A river split into multiple channels by islands and sandbars'],
            ['Watershed', 'The entire area of land that drains into a single river'],
          ],
        },
      },
    },
    {
      title: 'Transportation and Deposition',
      diagram: 'RiverTransportDiagram',
      beginnerContent:
        'Rivers carry material downstream in several ways. Large boulders are rolled or bounced along the bed (traction and saltation). Sand and silt are carried suspended in the water (suspension). Dissolved minerals are carried invisibly (solution). The faster the river flows, the larger the particles it can carry. When a river slows down — at a bend, where it enters a lake, or where it meets the sea — it drops its load, largest particles first. This deposited material is called sediment or alluvium. The Brahmaputra carries an extraordinary sediment load — about 735 million tonnes per year, making it one of the most sediment-laden rivers on Earth. This sediment builds and reshapes islands, sandbars, and flood plains constantly.',
    },
    {
      title: 'Braided Rivers and River Islands',
      diagram: 'RiverBraidedDiagram',
      beginnerContent:
        'When a river carries a very heavy sediment load across a wide, flat valley, it often splits into multiple channels separated by islands and sandbars. This is a braided river, and the Brahmaputra in Assam is one of the best examples on Earth — at some points, it is over 10 kilometres wide during the monsoon. These braided channels constantly shift. Sand and silt are deposited to form new islands, while existing islands are eroded away. Majuli, situated in the Brahmaputra, is often called the world\'s largest river island. It was once over 1,200 square kilometres but has shrunk to about 350 square kilometres due to erosion. The island\'s communities live with the constant reality that their land is being reshaped by the river — some villages have been relocated multiple times.',
    },
    {
      title: 'Flood Plains — Fertile but Dangerous',
      diagram: 'RiverFloodplainDiagram',
      beginnerContent:
        'When a river floods, it spills over its banks and deposits a layer of fine, nutrient-rich silt across the surrounding flat land — the flood plain. This silt makes flood plains some of the most fertile agricultural land in the world. The Brahmaputra valley in Assam owes its rich tea gardens and rice paddies to millennia of flood-deposited nutrients. But the same flooding that creates this fertility also causes devastation. Assam experiences severe floods almost every monsoon season, displacing millions of people, destroying crops, and washing away roads and bridges. Flood management is one of the most important and difficult challenges facing the region — you cannot simply stop a river that carries the meltwater of the Himalayas.',
    },
    {
      title: 'Deltas — Where Rivers Meet the Sea',
      diagram: 'RiverDeltaDiagram',
      beginnerContent:
        'When a river reaches the sea or a large lake, it slows dramatically and dumps its remaining sediment. Over thousands of years, this builds a fan-shaped landform called a delta. The Ganges-Brahmaputra delta in Bangladesh is the largest delta in the world — about 100,000 square kilometres of incredibly flat, fertile land barely above sea level. Deltas are formed of layers of silt, sand, and clay deposited in a pattern: the heaviest material settles first (near the river mouth) and the finest material is carried furthest out. Deltas are biologically rich — the Sundarbans mangrove forest in the Ganges-Brahmaputra delta is home to Bengal tigers, saltwater crocodiles, and hundreds of bird species. But deltas are also extremely vulnerable to rising sea levels.',
    },
    {
      title: 'Oxbow Lakes and Meanders',
      diagram: 'RiverOxbowDiagram',
      beginnerContent:
        'In its middle and lower course, a river rarely flows in a straight line. Instead, it develops curves called meanders. The water flows faster on the outside of each curve, eroding the bank, while it flows slower on the inside, depositing sediment. Over time, this makes the curves more and more pronounced. Eventually, two outer bends erode so close together that the river breaks through, taking the shorter path. The abandoned curve is cut off, forming a crescent-shaped lake called an oxbow lake. Satellite images of the Brahmaputra valley reveal dozens of oxbow lakes — locally called beels — scattered across the flood plain. These beels are important ecosystems, serving as fish nurseries, bird habitats, and sources of water for agriculture during the dry season.',
    },
  ]
};
