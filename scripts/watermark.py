#!/usr/bin/env python3
"""
Watermark raw Midjourney illustrations with "TigmaMinds Academy"
and save with friendly names. Also compresses to WebP.

Usage: python3 scripts/watermark.py
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Paths
RAW_DIR = Path("content/illustrations-raw")
OUT_PNG_DIR = Path("content/illustrations")
OUT_WEBP_DIR = Path("public/content/illustrations")

WATERMARK_TEXT = "tigmaminds.academy"

# Mapping: raw filename (partial match on UUID) -> friendly name
MAPPING = {
    "17ea0de9": "tejimola",
    "ebea385e": "fun-facts",
    "96172511": "majuli-born",
    "de543fe7": "rhino-horn",
    "675c7da1": "dancing-deer",
    "fc88b74f": "elephant-ant",
    "aa7ca883": "golden-deer",
    "d3cbbd0d": "bridge-grew",
    "ad653a13": "brahmaputra-angry",
    "090552bb": "gibbon-song",
    "d3467046": "boy-clouds",
    "5377d054": "tea-leaf-fly",
    "fe7775a6": "bamboo-flute",
    "64c4013e": "weaver-girl",  # has a duplicate "(1)" file, we'll just use the first match
    # These two raws have no current friendly name:
    "4bdb5359": "rhino-children-bridge",  # new: colorful rhino with children on red bridge
    "414b18a7": "brahmaputra-flood",      # new: flooding river through villages

    # 100 Stories illustrations (upscaled from Midjourney)
    "27047fa0": "girl-who-spoke-to-elephants",   # young Karbi girl pressing ear to ground
    "38242f38": "river-dolphins-secret",          # Gangetic river dolphin surfacing
    "f5b754b4": "clouded-leopard",                # Naga boy with clouded leopard cub
    "fdaccdea": "snow-leopards-promise",          # Sikkimese child freeing snow leopard
    "80abaeab": "little-elephants-mud-bath",      # baby elephant belly-flopping mud
    "ba9fd15c": "magic-japi-hat",                 # boy holding ornate japi
    "bb39ab42": "fishermans-daughter-storm",       # brave girl steering boat through storm
    "002676d5": "talking-parrot-hajo",             # green parrot on temple pillar
    "648269e2": "secret-garden-loktak",            # child discovering floating phumdi island
    "ff988e24": "little-potter-dhubri",            # child at potter's wheel making lamps
    "1e828b0d": "pitcher-plant",                   # large Nepenthes in Meghalaya forest
    "d767892f": "brave-mithun",                    # large mithun leading villagers through snow
    "c154e57d": "peacock-dance",                   # peacock with full tail spread
    "533c88c7": "tortoise-and-hare",               # turtle sliding past stuck hare
    "130fe847": "red-panda-mask",                  # red panda on mossy branch
    "324a3023": "little-boat-brahmaputra",         # paper boat on Brahmaputra
    "28a1213c": "orange-sunsets-assam",            # spirit woman painting sky orange
    "239b6f18": "little-monk-tawang",              # young monk at Tawang monastery
    "36072d15": "singing-bamboo-mizoram",          # Mizo boy playing flute in bamboo grove
    "39680c86": "cloud-weaver-tawang",             # Monpa girl on stone wall above clouds
    "31aea4b7": "map-makers-granddaughter",        # girl drawing map of NE India
    "f5521625": "cuckoo-calls-dawn",               # Asian koel singing at dawn
    "6500c505": "grandmothers-pitha",              # elderly woman making pithas
    "8ddee4f9": "star-fell-deepor",                # golden lotuses on Deepor Beel
    "0c61e8e7": "festival-lights-river",           # clay lamps floating on Brahmaputra
    "a6e2f8a6": "monkey-bridge-namdapha",          # monkeys forming living bridge
    "6e248e78": "seven-sisters-states",            # seven women in traditional attire
    "0a1d50f2": "fish-jump-barak",                 # silver fish leaping from Barak River
    "8f2b7509": "lost-temple-madan-kamdev",        # children discovering ancient ruins
    "3dc58a92": "orchid-colors",                   # vibrant orchids on tree branches
    "33243340": "muga-silk-golden",                  # tiny golden silkworm on som tree
    "f492fdac": "firefly-festival-majuli",           # young boy in dark paddy field with fireflies
    "70667638": "hornbills-crown",                   # majestic great Indian hornbill
    "37a5b464": "girl-who-painted-rain",             # young Khasi girl under root bridge

    # Batch 2 — Stories 35-100
    "a544d402": "kite-festival-guwahati",              # boy flying kite above Guwahati
    "240687a5": "old-banyan-tree",                     # enormous ancient banyan tree
    "845f28b0": "holi-tea-gardens",                    # tea workers celebrating Holi
    "071e4ea2": "postman-hills",                       # postman on Meghalaya mountain path
    "c5782b62": "turtle-carried-mountain",             # turtle carrying stone up hillside
    "21d8a280": "sal-tree-never-bends",                # sal tree standing firm in storm
    "bc4d81fd": "rainbow-fish-umiam",                  # rainbow fish in Umiam Lake
    "880d89b0": "monsoon-found-home",                  # monsoon clouds over tea gardens
    "f2d91008": "tiny-frog-rainforest",                # tiny frog on leaf
    "5b33b950": "grandmother-remembered",              # grandmother telling stories on veranda
    "c9e03e2c": "stars-ziro-valley",                   # Apatani child under Milky Way
    "c5d4a053": "little-train-hills",                  # narrow-gauge train through hills
    "2efc32c3": "dragonfly-paddy-field",               # dragonfly over golden paddy
    "f1525a4f": "mishing-learned-fish",                # Mishing boy watching heron
    "c9c521d4": "coconut-jackfruit",                   # coconut looking up at jackfruit
    "23e966cc": "night-market-imphal",                 # child exploring Ima Keithel
    "50dbab7f": "rivers-braid-near-sea",               # aerial braided Brahmaputra
    "0f6b2a9a": "tigers-whisker-naga",                 # Naga girl near tiger
    "aefadf8f": "boy-counted-butterflies",             # boy with butterflies in Namdapha
    "3a8c3c7d": "music-dimasa-kingdom",                # Dimasa princess listening to forest
    "44d6c71d": "seed-traveled-thousand",              # seed traveling across landscapes
    "e7624b2e": "moonlit-boat-race",                   # boats racing under full moon
    "c5e775db": "kingfisher-blue-coat",                # kingfisher diving into river
    "52c04e91": "witch-doctor-apprentice",             # boy learning medicinal plants
    "ed413112": "lotus-learned-float",                 # lotus bud on pond surface
    "dbe827d3": "turtles-slow-land",                   # turtle swimming vs walking split
    "bc45a204": "girl-grew-forest",                    # girl planting sapling, forest timeline
    "97a0dc0f": "boy-built-library",                   # boy arranging books in bamboo hut
    "58c9e588": "flying-squirrel-hollongapar",         # flying squirrel gliding at night
    "54125825": "owl-wisest-bird",                     # owl at moonlit forest council
    "b679c527": "dhol-drum-thunder",                   # Bihu drummer with thunder clouds
    "6c3e660e": "golden-hilsa-fisherman",              # fisherman releasing golden hilsa
    "caaa0bdf": "market-day-tura",                     # Garo child at Tura market
    "ee834556": "frogs-sing-rain",                     # frogs singing on lily pads
    "3fee8d92": "eri-silk-moth",                       # eri silk moth emerging from cocoon

    # Batch 3 — newly upscaled
    "e99dcea8": "honey-hunters-lesson",                # Khasi boy sitting near beehive
    "f81cb2a4": "cloud-namer",                         # Khasi child on hill pointing at clouds
    "69bebc11": "dancer-floating-market",              # Manipuri girl dancing on floating island
    "e9e8861a": "mountain-echoes",                     # Naga child shouting into valley
    "68f949bc": "fireflies-dont-burn",                 # curious child holding glowing firefly
    "b86033fd": "paper-umbrella",                      # girl holding silk umbrella in rain
    "fc24dbd0": "elephant-corridor",                   # herd of elephants through corridor
    "92d3848e": "story-garden",                        # magical garden with glowing books
    "86d17bbe": "takin-face",                          # takin looking at reflection
    "c76443f3": "woodpeckers-drum",                    # woodpecker drumming forest concert
    "55f9bbe4": "little-chef",                         # child making pithas
    "aff48cab": "guwahati-name",                       # ancient betel nut market
    "42780af6": "seed-keeper",                         # Naga grandmother showing seeds
    "5b8941f8": "wild-orchids-trees",                  # orchids growing on tree branches
    "c0273b3b": "kaziranga-grass",                     # tall elephant grass with rhino

    # Batch 4
    "7cbf80b1": "basket-weavers-song",                 # Manipuri girl weaving bamboo basket
    "14db62f2": "cloud-refused-rain",                  # stubborn cloud over Shillong
    "b2afa93c": "first-rice",                          # Tiwa girl watching birds drop seeds
    "edaab891": "night-jasmine",                       # white night jasmine blooming moonlit

    # Mythology stories
    "c3a99f39": "ravanas-ten-heads",
    "766cedd0": "churning-of-the-ocean",
    "ea1be9e2": "sand-mandala",
    "32ef6cd4": "angulimala-change",
    "50054dbd": "monastery-bells",
    "2025c81f": "wheel-of-dharma",
    "49996d04": "bodhi-tree",
    "89289df8": "agni-science-of-fire",
    "6f728edb": "pushpaka-vimana",
    "843a3e4c": "hanuman-lifted-mountain",
    "37819aeb": "well-of-zamzam",
    "15ba5a48": "al-khwarizmi-algebra",
    "57caf638": "the-astrolabe",
    "10f01b0f": "noahs-ark",
    "766c300f": "david-and-goliath",
    "2e95cfa9": "star-of-bethlehem",
    "4797cee6": "parting-red-sea",
    "4bc733f5": "muezzins-call",
    "1b288cec": "geometry-of-alhambra",
    "4ed639eb": "tower-of-babel",

    # Batch 5 — re-runs and new stories
    "2a2cd096": "silk-route-caterpillars",              # three silk caterpillars (re-run)
    "abf86f0c": "bamboo-taught-wind",                  # bamboo and wind dance (re-run)
    "c453c5a8": "girl-python-kaziranga",               # calm girl with python on veranda
    "ffc9b7ac": "boy-raced-brahmaputra",               # boy pedaling bicycle along river
    "e9373eb8": "ferrymans-riddle",                    # old ferryman asking riddle
    "59b3c92f": "firewalker",                            # young Rabha girl at village gathering
    "60c9c39b": "bamboo-grows-fast",                     # bamboo shoot racing beside teak tree
    "7db6c6d0": "moonlit-boat-race",                    # boats racing under full moon
    "610c7a92": "little-river-joined",                  # small stream merging into Brahmaputra
    "8ef6647b": "haflong-blue-mountains",               # blue hills of Haflong at twilight
    "e71a482b": "kite-eagle-dimapur",                   # paper kite and eagle over Dimapur

    # NE State stories (Mizoram, Manipur, Tripura, Nagaland, Sikkim)
    "a2e7457a": "cheraw-bamboo-dance",                   # Mizo girls leaping between bamboo poles
    "1198d58a": "mautam-bamboo-famine",                  # Mizoram hillside with bamboo flowers
    "e71cb565": "iron-smiths-lushai",                    # Mizo blacksmith hammering blade
    "180e2b05": "hawk-blue-mountain",                    # crested Jerdon's Baza hawk soaring
    "49e55b66": "orchids-phawngpui",                     # moss-draped cloud forest orchids
    "998f1337": "kangla-fort-manipur",                   # ancient Kangla Fort with moat
    "383ec557": "thang-ta-manipur",                      # young Manipuri Thang-Ta warrior mid-spin
    "40a86a3f": "ras-lila-manipur",                      # twelve Manipuri dancers in circle
    "c18f748e": "ima-keithel-market",                    # bustling Ima Keithel market
    "371cc489": "polo-manipur",                          # two Manipuri polo players on ponies
    "f5ec2676": "neermahal-water-palace",                # Neermahal palace reflected in lake
    "811fccf1": "fourteen-gods-tripura",                 # ancient Chaturdasha temple at night
    "d8812e6b": "rubber-tripura",                        # neat rows of rubber trees with latex
    "1489d5f7": "cane-weavers-tripura",                  # Riang tribal woman weaving cane
    "2f06b2b9": "tripura-sundari-temple",                # aerial view temple on turtle hillock
    "773c02f5": "dzukou-valley-lily",                    # wide alpine valley carpeted in pink lilies
    "c2cee55b": "stone-pulling-nagaland",                # Angami Naga warriors pulling megalith
    "27a25d5f": "hornbill-flight-nagaland",              # magnificent Great Hornbill with casque
    "6e0e0538": "naga-dao-metallurgy",                   # Konyak Naga smith forging blade
    "64f6af23": "kanchenjunga-five-treasures",           # Kanchenjunga's five snow peaks
    "faf41cf2": "red-panda-sikkim",                      # red panda curled on rhododendron branch
    "3a4d2455": "cardamom-hills-sikkim",                 # shaded cardamom plantation
    "95e8b215": "prayer-flags-sikkim",                   # prayer flags across mountain pass

    # Extras (not yet matched to stories)
    "45029776": "astrolabe-brass",                       # beautifully crafted brass astrolabe
    "64fa6094": "powerful-monk-bell",                    # powerful monk striking bell

    # World History stories
    "edb5b6f5": "great-wall-of-china",                   # sweeping view of Great Wall
    "55619c75": "panama-canal",                           # cargo ship in canal locks
    "3f9d9fa2": "library-of-alexandria",                  # interior of Great Library
    "32788ecc": "viking-navigation",                      # Viking longship with sunstone
    "dc540ccb": "building-the-pyramids",                  # Great Pyramid under construction
    "7d27cbf8": "apollo-moon-landing",                    # Apollo 11 on Moon surface
    "322d9521": "penicillin-discovery",                   # Fleming's lab bench with petri dish
    "7bc5baea": "gutenberg-printing-press",               # Gutenberg at printing press
    "d499904f": "inca-road-system",                       # Inca stone road with chasqui runner
    "9658037e": "manhattan-project",                      # physicists at Los Alamos chalkboard
    "a3220757": "roman-aqueducts",                        # Pont du Gard aqueduct
    "c8a71e97": "greek-fire",                             # Byzantine warship launching Greek fire
    "7c7670ad": "egyptian-embalming",                     # Egyptian embalming workshop
    "f3841073": "chinese-gunpowder",                      # Song Dynasty alchemist workshop
    "ea95b474": "polynesian-wayfinding",                  # Polynesian canoe under Milky Way
    "f52cc725": "mesopotamian-irrigation",                # Mesopotamian irrigation channels
    "0a1f3fa7": "indian-wootz-steel",                     # Indian smith pouring wootz steel
    "315aec84": "mayan-astronomy",                        # Mayan astronomer at Caracol observatory
    "f31d8fe2": "persian-ice-houses",                     # Persian yakhchal dome
    "a94019c6": "zheng-he-fleet",                         # Zheng He treasure ship with red sails
    "37775049": "gothic-cathedrals",                      # Gothic cathedral interior ribbed vaults
    "dd8583ed": "ibn-al-haytham-optics",                  # Ibn al-Haytham camera obscura experiment
    "a6c5f8db": "leonardo-machines",                      # Leonardo workshop with ornithopter
    "b9a27b20": "silk-road-network",                      # Silk Road camel caravan
    "67f625ff": "the-black-death",                        # plague doctor with lantern

    # Bengali stories
    "180bef4a": "sundarbans-mangroves",                   # Sundarbans mangrove forest with tiger
    "59e6c391": "kumartuli-pandal-builder",               # Kumartuli artisans sculpting Durga
    "59694869": "hilsa-migration",                        # hilsa fish swimming upstream
    "f3206450": "kolkata-last-tram",                      # old Kolkata tram on tree-lined avenue
    "07c5a288": "bankura-terracotta-horse",               # Bankura potter shaping terracotta horse

    # Telugu stories
    "4c053abc": "kuchipudi-anklet",                       # Kuchipudi dancer on brass plate
    "716749c4": "pochampally-ikat-weaver",                # Pochampally weaver at pit loom
    "9d1bed4c": "nagarjuna-sagar-dam",                    # Nagarjuna Sagar Dam with spillway
    "eb042653": "bidriware-silver-inlay",                  # Bidar craftsman pressing silver wire
    "326d69b8": "charminar-pigeons",                      # pigeons swirling around Charminar

    # Tamil stories
    "786eea74": "swamimalai-bronze-casters",              # Swamimalai bronze caster pouring metal
    "ee5b80b9": "mahabalipuram-stone-screens",            # stone carver at Mahabalipuram jali
    "b1a8202e": "chettinad-spice-trader",                 # Chettinad mansion spice trader
    "fe05c39e": "pamban-bridge",                          # Pamban railway bridge over Palk Strait
    "8bb8aaa5": "auroville-solar-kitchen",                # Auroville Solar Kitchen parabolic dish
}

# Skip duplicates (the "(1)" file)
SKIP_DUPLICATES = True


def add_watermark(img: Image.Image, text: str) -> Image.Image:
    """Add semi-transparent watermarks: four corners + center."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Try to find a good font, fall back to default
    font_size = max(18, img.width // 45)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype("/System/Library/Fonts/SFNSMono.ttf", font_size)
        except (OSError, IOError):
            font = ImageFont.load_default()

    # Measure text
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    margin = max(20, img.width // 30)
    shadow_color = (0, 0, 0, 35)
    text_color = (255, 255, 255, 55)

    # 5 positions: four corners + center
    positions = [
        (margin, margin),                                           # top-left
        (img.width - text_w - margin, margin),                     # top-right
        (margin, img.height - text_h - margin),                    # bottom-left
        (img.width - text_w - margin, img.height - text_h - margin),  # bottom-right
        ((img.width - text_w) // 2, (img.height - text_h) // 2),  # center
    ]

    for (x, y) in positions:
        draw.text((x + 2, y + 2), text, font=font, fill=shadow_color)
        draw.text((x, y), text, font=font, fill=text_color)

    # Composite
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    watermarked = Image.alpha_composite(img, overlay)
    return watermarked


def process(only_slugs: list[str] | None = None):
    """Process raw images. If only_slugs is provided, process ONLY those slugs."""
    os.makedirs(OUT_PNG_DIR, exist_ok=True)
    os.makedirs(OUT_WEBP_DIR, exist_ok=True)

    raw_files = sorted(RAW_DIR.glob("*.png"))
    processed = set()
    stats = {"watermarked": 0, "skipped": 0, "webp_total_kb": 0, "png_total_kb": 0}

    for raw_file in raw_files:
        # Find matching friendly name by UUID
        friendly = None
        for uuid_part, name in MAPPING.items():
            if uuid_part in raw_file.name:
                friendly = name
                break

        if not friendly:
            if not only_slugs:
                print(f"  SKIP (no mapping): {raw_file.name}")
            stats["skipped"] += 1
            continue

        # If --only is set, skip anything not in the list
        if only_slugs and friendly not in only_slugs:
            continue

        # Skip duplicates
        if friendly in processed and SKIP_DUPLICATES:
            print(f"  SKIP (duplicate): {raw_file.name} -> {friendly}")
            stats["skipped"] += 1
            continue

        processed.add(friendly)
        print(f"  {raw_file.name[:60]}... -> {friendly}")

        # Load
        img = Image.open(raw_file)
        original_kb = raw_file.stat().st_size // 1024

        # Watermark
        watermarked = add_watermark(img, WATERMARK_TEXT)

        # Save PNG (for archival)
        png_path = OUT_PNG_DIR / f"{friendly}.png"
        watermarked_rgb = watermarked.convert("RGB")
        watermarked_rgb.save(png_path, "PNG", optimize=True)
        png_kb = png_path.stat().st_size // 1024
        stats["png_total_kb"] += png_kb

        # Save WebP (for web)
        webp_path = OUT_WEBP_DIR / f"{friendly}.webp"
        watermarked_rgb.save(webp_path, "WEBP", quality=82, method=6)
        webp_kb = webp_path.stat().st_size // 1024
        stats["webp_total_kb"] += webp_kb

        print(f"    Raw: {original_kb:,}KB -> PNG: {png_kb:,}KB -> WebP: {webp_kb:,}KB ({100*webp_kb//original_kb}%)")
        stats["watermarked"] += 1

    print(f"\nDone: {stats['watermarked']} watermarked, {stats['skipped']} skipped")
    print(f"Total PNG: {stats['png_total_kb']:,}KB ({stats['png_total_kb']//1024}MB)")
    print(f"Total WebP: {stats['webp_total_kb']:,}KB ({stats['webp_total_kb']//1024}MB)")


if __name__ == "__main__":
    import sys
    # Usage: python3 scripts/watermark.py                    → process ALL
    #        python3 scripts/watermark.py --only slug1 slug2  → process only these slugs
    if "--only" in sys.argv:
        idx = sys.argv.index("--only")
        slugs = sys.argv[idx + 1:]
        if not slugs:
            print("Error: --only requires at least one slug")
            sys.exit(1)
        print(f"Processing {len(slugs)} specific slugs: {', '.join(slugs)}")
        process(only_slugs=slugs)
    else:
        process()
