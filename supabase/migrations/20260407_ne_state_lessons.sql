-- Add 23 Northeast state lessons (Mizoram, Manipur, Tripura, Nagaland, Sikkim)
INSERT INTO public.lessons (id, slug, title, stem_title, is_demo) VALUES
  -- Mizoram (5)
  (131, 'cheraw-bamboo-dance', 'The Bamboo Dance of Mizoram', 'Periodic Motion & Rhythm Physics', false),
  (132, 'mautam-bamboo-famine', 'The Mautam — When Bamboo Flowers and Famine Follows', 'Ecology & Population Dynamics', false),
  (133, 'iron-smiths-lushai', 'The Iron Smiths of the Lushai Hills', 'Metallurgy & Chemistry of Iron', false),
  (134, 'hawk-blue-mountain', 'The Hawk of the Blue Mountain', 'Aerodynamics & Soaring Flight', false),
  (135, 'orchids-phawngpui', 'The Orchids of Phawngpui', 'Pollination Biology & Coevolution', false),
  -- Manipur (5)
  (136, 'kangla-fort-manipur', 'The Fortress of Kangla', 'Hydraulic Engineering & Fortification', false),
  (137, 'thang-ta-manipur', 'The Sword and the Spear of Manipur', 'Rotational Dynamics & Biomechanics', false),
  (138, 'ras-lila-manipur', 'The Ras Lila of Manipur', 'Circular Motion & Orbital Mechanics', false),
  (139, 'ima-keithel-market', 'The Mothers'' Market of Imphal', 'Economics & Market Dynamics', false),
  (140, 'polo-manipur', 'The Birthplace of Polo', 'Momentum, Collisions & Projectile Motion', false),
  -- Tripura (5)
  (141, 'neermahal-water-palace', 'The Water Palace of Tripura', 'Structural Engineering & Hydrostatics', false),
  (142, 'fourteen-gods-tripura', 'The Festival of Fourteen Gods', 'Astronomy & Lunar Cycles', false),
  (143, 'rubber-tripura', 'The Rubber Trees of Tripura', 'Polymer Chemistry & Materials Science', false),
  (144, 'cane-weavers-tripura', 'The Cane Weavers of Tripura', 'Symmetry, Tessellations & Algorithmic Thinking', false),
  (145, 'tripura-sundari-temple', 'The Temple on the Turtle''s Back', 'Geology & Plate Tectonics', false),
  -- Nagaland (4)
  (146, 'dzukou-valley-lily', 'The Lily of Dzükou Valley', 'Alpine Botany & Plant Adaptation', false),
  (147, 'stone-pulling-nagaland', 'The Stone Pullers of Nagaland', 'Simple Machines & Mechanical Advantage', false),
  (148, 'hornbill-flight-nagaland', 'The Great Hornbill''s Helmet', 'Materials Science & Impact Engineering', false),
  (149, 'naga-dao-metallurgy', 'The Naga Dao', 'Metallurgy & Edge Engineering', false),
  -- Sikkim (4)
  (150, 'kanchenjunga-five-treasures', 'The Five Treasures of Kanchenjunga', 'Glaciology & Climate Science', false),
  (151, 'red-panda-sikkim', 'The Red Panda of the Rhododendron Forest', 'Thermoregulation & Heat Transfer', false),
  (152, 'cardamom-hills-sikkim', 'The Cardamom Hills of Sikkim', 'Organic Chemistry & Essential Oils', false),
  (153, 'prayer-flags-sikkim', 'The Prayer Flags of Sikkim', 'Materials Degradation & Textile Science', false)
ON CONFLICT (id) DO NOTHING;
