-- Insert all lessons with IDs > 130 into the lessons table.
-- These exist in code (lessons-mythology.ts, lessons-history.ts, lessons-regional.ts)
-- but were never added to the database, causing FK violations on user_progress.

-- Mythology lessons (111-130)
INSERT INTO public.lessons (id, slug, title, is_demo, is_published) VALUES
  (111, 'churning-of-the-ocean', 'The Churning of the Ocean', true, true),
  (112, 'parting-red-sea', 'The Parting of the Red Sea', true, true),
  (113, 'davids-sling', 'David and the Sling', true, true),
  (114, 'flying-chariot-of-ravana', 'The Flying Chariot of Ravana', true, true),
  (115, 'tower-of-babel', 'The Tower of Babel', true, true),
  (116, 'buddhas-light', 'The Light of the Buddha', true, true),
  (117, 'noahs-flood', 'The Great Flood', true, true),
  (118, 'indras-thunderbolt', 'The Thunderbolt of Indra', true, true),
  (119, 'fireflies-dont-burn', 'The Fireflies That Don''t Burn', true, true),
  (120, 'wheel-of-dharma', 'The Wheel of Dharma', true, true),
  (121, 'solomons-temple', 'Solomon''s Temple', true, true),
  (122, 'seven-sisters-of-pleiades', 'The Seven Sisters of Pleiades', true, true),
  (123, 'agnis-fire', 'The Fire of Agni', true, true),
  (124, 'the-loaves-and-fishes', 'The Loaves and Fishes', true, true),
  (125, 'vayu-wind-god', 'Vayu the Wind God', true, true),
  (126, 'the-burning-bush', 'The Burning Bush', true, true),
  (127, 'samudragupta-golden-coins', 'Samudragupta''s Golden Coins', true, true),
  (128, 'walking-on-water', 'Walking on Water', true, true),
  (129, 'stars-of-ziro', 'The Stars of Ziro', true, true),
  (130, 'the-philosophers-stone', 'The Philosopher''s Stone', true, true)
ON CONFLICT (id) DO NOTHING;

-- World History lessons (201-225)
INSERT INTO public.lessons (id, slug, title, is_demo, is_published) VALUES
  (201, 'great-wall-of-china', 'The Great Wall of China', true, true),
  (202, 'panama-canal', 'The Panama Canal', true, true),
  (203, 'library-of-alexandria', 'The Library of Alexandria', true, true),
  (204, 'viking-navigation', 'Viking Navigation', true, true),
  (205, 'building-the-pyramids', 'The Building of the Pyramids', true, true),
  (206, 'apollo-moon-landing', 'The Moon Landing', true, true),
  (207, 'penicillin-discovery', 'The Discovery of Penicillin', true, true),
  (208, 'gutenberg-printing-press', 'The Gutenberg Printing Press', true, true),
  (209, 'inca-road-system', 'The Inca Road System', true, true),
  (210, 'manhattan-project', 'The Manhattan Project', true, true),
  (211, 'roman-aqueducts', 'The Roman Aqueducts', true, true),
  (212, 'greek-fire', 'Greek Fire', true, true),
  (213, 'egyptian-embalming', 'Egyptian Embalming', true, true),
  (214, 'chinese-gunpowder', 'Chinese Gunpowder', true, true),
  (215, 'polynesian-wayfinding', 'Polynesian Wayfinding', true, true),
  (216, 'mesopotamian-irrigation', 'Mesopotamian Irrigation', true, true),
  (217, 'indian-wootz-steel', 'Indian Wootz Steel', true, true),
  (218, 'mayan-astronomy', 'Mayan Astronomy', true, true),
  (219, 'persian-ice-houses', 'Persian Ice Houses', true, true),
  (220, 'zheng-he-fleet', 'Zheng He''s Treasure Fleet', true, true),
  (221, 'gothic-cathedrals', 'The Gothic Cathedrals', true, true),
  (222, 'ibn-al-haytham-optics', 'Ibn al-Haytham and the Science of Light', true, true),
  (223, 'silk-road-network', 'The Silk Road Network', true, true),
  (224, 'leonardo-machines', 'Leonardo''s Machines', true, true),
  (225, 'the-black-death', 'The Black Death', true, true)
ON CONFLICT (id) DO NOTHING;

-- Bengali regional lessons (226-230)
INSERT INTO public.lessons (id, slug, title, is_demo, is_published) VALUES
  (226, 'sundarbans-mangroves', 'The Sundarbans Mangrove', true, true),
  (227, 'kumartuli-pandal-builder', 'The Pandal Builder of Kumartuli', true, true),
  (228, 'hilsa-migration', 'The Hilsa That Swam Upstream', true, true),
  (229, 'kolkata-last-tram', 'The Last Tram of Kolkata', true, true),
  (230, 'bankura-terracotta-horse', 'The Terracotta Horse of Bankura', true, true)
ON CONFLICT (id) DO NOTHING;

-- Telugu regional lessons (231-235)
INSERT INTO public.lessons (id, slug, title, is_demo, is_published) VALUES
  (231, 'kuchipudi-anklet', 'The Kuchipudi Dancer''s Anklet', true, true),
  (232, 'pochampally-ikat-weaver', 'The Ikat Weaver of Pochampally', true, true),
  (233, 'nagarjuna-sagar-dam', 'The Dam at Nagarjuna Sagar', true, true),
  (234, 'bidriware-silver-inlay', 'The Silver Inlay of Bidar', true, true),
  (235, 'charminar-pigeons', 'The Pigeons of Charminar', true, true)
ON CONFLICT (id) DO NOTHING;

-- Tamil regional lessons (236-240)
INSERT INTO public.lessons (id, slug, title, is_demo, is_published) VALUES
  (236, 'swamimalai-bronze-casters', 'The Bronze Casters of Swamimalai', true, true),
  (237, 'mahabalipuram-stone-screens', 'The Stone Screens of Mahabalipuram', true, true),
  (238, 'chettinad-spice-trader', 'The Spice Trader of Chettinad', true, true),
  (239, 'pamban-bridge', 'The Pamban Bridge', true, true),
  (240, 'auroville-solar-kitchen', 'The Solar Kitchen of Auroville', true, true)
ON CONFLICT (id) DO NOTHING;
