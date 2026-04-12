import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'maps-and-navigation',
  title: 'Maps, Coordinates & Navigation',
  category: 'geography',
  icon: '🗺️',
  tagline: 'From ancient star navigation to GPS satellites — how we find our place on Earth.',
  relatedStories: ['map-makers-granddaughter', 'little-train', 'ferrymans-riddle'],
  understand: [
    {
      title: 'Latitude and Longitude',
      beginnerContent:
        'To pinpoint any location on Earth, we use a grid system of imaginary lines called latitude and longitude. Lines of latitude run horizontally around the Earth, parallel to the equator. The equator is 0° latitude, the North Pole is 90°N, and the South Pole is 90°S. Each degree of latitude corresponds to about 111 kilometres on the ground. Lines of longitude (also called meridians) run vertically from pole to pole. The Prime Meridian, which passes through Greenwich, London, is 0° longitude. Longitude ranges from 0° to 180°E and 0° to 180°W, meeting at the International Date Line in the Pacific Ocean.\n\nTogether, latitude and longitude give every point on Earth a unique address. Guwahati, the gateway to Northeast India, sits at approximately 26.14°N latitude and 91.74°E longitude. This tells us it is about 26 degrees north of the equator (in the subtropical zone) and about 92 degrees east of the Prime Meridian. Shillong is at 25.57°N, 91.88°E — slightly south and east of Guwahati. Tawang, high in western Arunachal Pradesh, is at 27.59°N, 91.86°E — noticeably further north and at a much higher altitude, though longitude is similar. Understanding coordinates is essential for everything from reading maps to programming GPS devices to entering locations in Google Earth.\n\nCoordinates can be expressed in degrees-minutes-seconds (DMS) format — like 26°8\'24"N — or in decimal degrees — like 26.14°N. One degree is divided into 60 minutes, and one minute into 60 seconds. Decimal degrees are more convenient for calculations and are used in most digital mapping systems. In the age of smartphones, we take location awareness for granted, but the mathematical framework of latitude and longitude was developed over centuries by astronomers, mathematicians, and navigators. The ancient Greeks knew the Earth was spherical and proposed the grid system, but accurately measuring longitude at sea was not solved until the 18th century with the invention of the marine chronometer.',
      intermediateContent:
        'Coordinate systems rest on a **reference ellipsoid** — a mathematically defined surface approximating Earth’s shape. The WGS 84 ellipsoid (used by GPS) has semi-major axis a = 6,378,137 m and flattening f = 1/298.257. **Geodetic latitude** is the angle between the ellipsoid normal and the equatorial plane — slightly different from geocentric latitude because Earth is oblate. One degree of latitude ≈ 111 km everywhere, but one degree of longitude varies: 111 km × cos(φ), so at Guwahati (26°N) one degree of longitude ≈ 111 × cos(26°) ≈ **99.8 km**. The **Universal Transverse Mercator (UTM)** system divides Earth into 60 zones of 6° longitude each, projecting each zone with minimal distortion, giving coordinates in metres rather than degrees — convenient for engineering and military applications.',
      advancedContent:
        'The **geoid** — the equipotential surface of Earth’s gravity field coinciding with mean sea level — is lumpy, deviating up to ±100 m from the reference ellipsoid due to uneven mass distribution. Satellite gravity missions (GRACE, GOCE) map the geoid to centimetre precision, revealing subsurface density variations. GPS positioning solves a system of equations: for each satellite i, (x − x_i)² + (y − y_i)² + (z − z_i)² = (c × Δt_i)², where c is the speed of light and Δt is signal travel time. Four satellites yield four unknowns (x, y, z, and receiver clock error). **Real-Time Kinematic (RTK)** GPS achieves centimetre accuracy by using a nearby base station to correct atmospheric and orbital errors in real time — used by the Survey of India for cadastral mapping and by precision agriculture pilots in the Brahmaputra valley.',
      diagram: 'LatLongGridDiagram',
    },
    {
      title: 'Map Projections',
      beginnerContent:
        'The Earth is a three-dimensional sphere (technically an oblate spheroid, slightly flattened at the poles), but maps are two-dimensional flat surfaces. Transferring information from a curved surface to a flat one inevitably introduces distortion — you cannot peel the skin off a globe and lay it flat without stretching, tearing, or compressing it somewhere. The mathematical method used to make this transfer is called a map projection, and every projection preserves some properties while distorting others. This is not a flaw in cartography — it is a fundamental geometric impossibility to perfectly represent a sphere on a plane.\n\nThe Mercator projection, created by Gerardus Mercator in 1569, is the most widely recognised map projection. It was designed for maritime navigation because it preserves angles and shapes locally (a property called conformality), meaning a straight line on the map corresponds to a constant compass bearing — incredibly useful for sailors. However, Mercator dramatically distorts area, especially near the poles. Greenland appears roughly the same size as Africa on a Mercator map, but in reality Africa is 14 times larger. Russia looks enormous, far bigger than it actually is relative to equatorial countries. This distortion has been criticised for giving a misleading impression of the relative size and importance of countries, particularly making Northern Hemisphere nations appear much larger than tropical and Southern Hemisphere nations.\n\nAlternative projections address different needs. The Peters (or Gall-Peters) projection preserves area — every country is shown at its true relative size — but distorts shapes, making equatorial regions look vertically stretched. The Robinson projection is a compromise that doesn\'t perfectly preserve anything but looks aesthetically pleasing and is commonly used in atlases. The Winkel Tripel projection, adopted by the National Geographic Society, minimises overall distortion across area, distance, and direction. For NE India, the local Survey of India maps use the Polyconic projection, which is accurate for narrow north-south strips. Understanding projections matters because the map you choose shapes how you see the world — and all maps, however authoritative they look, are interpretive choices.',
      diagram: 'MapProjectionDiagram',
    },
    {
      title: 'Topographic Maps',
      beginnerContent:
        'Topographic maps represent the three-dimensional shape of the terrain on a two-dimensional surface using contour lines — lines that connect points of equal elevation above sea level. If you imagine slicing a mountain horizontally at regular height intervals (say, every 20 metres) and tracing the outline of each slice, you would get a set of contour lines. Where the lines are close together, the slope is steep; where they are far apart, the terrain is gentle. A circular pattern of closed contour lines indicates a hilltop or peak. If the contour lines have small tick marks pointing inward, they indicate a depression rather than a hill.\n\nTopographic maps are indispensable for hikers, engineers, the military, geologists, and urban planners. Reading a topographic map of the Meghalaya plateau, for instance, reveals the dramatic terrain: tightly packed contour lines along the southern escarpment where the plateau drops steeply to the Bangladesh plains, wider spacing on the rolling uplands around Shillong, and intricate patterns around the deep gorges carved by rivers heading south. The contour interval — the vertical distance between adjacent lines — varies by map scale; large-scale maps of mountainous areas might use 20-metre intervals, while small-scale maps of flat plains might use 5-metre intervals. The Survey of India produces topographic maps at various scales (1:25,000, 1:50,000, 1:250,000) that are the foundation for all geographic work in the country, from building roads to planning dams to delineating forest reserves.',
      diagram: 'ContourMapDiagram',
    },
    {
      title: 'GPS and Satellite Navigation',
      diagram: 'MapGPSSatelliteDiagram',
      beginnerContent:
        'The Global Positioning System (GPS) is a network of at least 24 satellites orbiting the Earth at an altitude of about 20,200 kilometres, each completing two orbits per day. These satellites continuously broadcast signals containing their precise position and the exact time (measured by onboard atomic clocks accurate to a few nanoseconds). A GPS receiver on the ground picks up signals from multiple satellites simultaneously and calculates the distance to each satellite based on how long the signal took to arrive (travelling at the speed of light). With distance measurements from at least four satellites, the receiver can determine its precise position in three dimensions — latitude, longitude, and altitude — through a process called trilateration (not triangulation, which uses angles rather than distances).\n\nGPS accuracy for civilian receivers is typically 3–5 metres, but this can be improved to centimetre-level using augmentation systems like DGPS (Differential GPS) or India\'s own GAGAN (GPS Aided GEO Augmented Navigation) system. One fascinating aspect of GPS is that it requires corrections from Einstein\'s theory of relativity to work accurately. The atomic clocks on the satellites tick slightly faster than identical clocks on the ground — about 38 microseconds per day faster — because of two relativistic effects: time dilation from their orbital speed (special relativity, slowing the clocks by 7 microseconds/day) and gravitational time dilation from being further from Earth\'s mass (general relativity, speeding the clocks by 45 microseconds/day). Without correcting for these effects, GPS positions would drift by about 10 kilometres per day.\n\nBeyond the American GPS system, several other satellite navigation constellations now operate: Russia\'s GLONASS, the European Union\'s Galileo, and China\'s BeiDou. India has its own regional system called NavIC (Navigation with Indian Constellation), which uses 7 satellites to provide accurate positioning over India and a region extending about 1,500 kilometres beyond its borders. Modern smartphones use signals from multiple constellations simultaneously for better accuracy and reliability. In NE India, GPS technology is used for everything from vehicle tracking on the winding mountain roads of Arunachal Pradesh to mapping flood-affected areas in the Brahmaputra valley to tracking wildlife in Kaziranga and Manas national parks.',
    },
    {
      title: 'GIS — Geographic Information Systems',
      diagram: 'MapGISLayersDiagram',
      beginnerContent:
        'A Geographic Information System (GIS) is software that captures, stores, analyses, and displays geographic data. Think of it as a set of transparent map layers stacked on top of each other — one layer might show roads, another rivers, another elevation, another population density, another forest cover, another soil type. Each layer is geographically referenced, so the layers align perfectly. By combining and analysing these layers, GIS allows users to answer spatial questions that would be impossible with a single map: Where are the areas with both high flood risk AND dense population? Which villages are more than 10 kilometres from the nearest hospital? How has forest cover changed in Meghalaya over the past 20 years?\n\nGIS has transformed decision-making in fields from urban planning to disaster management to conservation biology. In NE India, GIS is used extensively: the Assam State Disaster Management Authority uses GIS to map flood-prone areas and plan evacuation routes; forest departments use it to monitor deforestation and track encroachment into protected areas; the tea industry uses GIS to map soil quality and optimise planting; and wildlife researchers use GIS to analyse elephant movement corridors between Kaziranga and the Karbi Hills. GIS data comes from many sources — satellite imagery, aerial surveys, GPS ground surveys, census data, and even crowdsourced data from platforms like OpenStreetMap. As India pushes for smart cities and digital governance, GIS literacy is becoming an essential skill for geographers, planners, engineers, and environmental scientists.',
    },
    {
      title: 'Dead Reckoning',
      beginnerContent:
        'Long before GPS satellites orbited the Earth, sailors navigated vast oceans using a technique ' +
        'called **dead reckoning** — tracking their position by calculating where they should be based ' +
        'on where they started, how fast they were moving, and which direction they were heading.\n\n' +
        'The idea is simple: if you know you left port heading due east at 10 kilometres per hour, ' +
        'then after 3 hours you should be 30 kilometres east of port. That calculation — **distance = ' +
        'speed × time** — is the heart of dead reckoning. You update your estimated position ' +
        'continuously as your speed or heading changes.\n\n' +
        'Polynesian wayfinders were masters of dead reckoning. Without any instruments, they tracked ' +
        'their canoe\'s speed by feeling the water flow against the hull, judged direction from stars ' +
        'and wind patterns, and maintained a mental map of their position across thousands of kilometres ' +
        'of open Pacific Ocean. European sailors used a **log line** (a rope with knots at regular ' +
        'intervals, dragged behind the ship) to measure speed and a **compass** for heading.\n\n' +
        'The great weakness of dead reckoning is that errors **accumulate**. Every small mistake in ' +
        'speed or direction adds to previous errors, so your estimated position drifts further and ' +
        'further from your true position over time. Ocean currents push you off course silently. Wind ' +
        'shifts your heading without you noticing. After days at sea, dead reckoning alone could be ' +
        'off by many kilometres. This is why navigators also used **celestial navigation** — taking ' +
        'star and sun sights to reset their position and correct accumulated errors.',
      intermediateContent:
        'Dead reckoning computes position iteratively: **x(t+Δt) = x(t) + v × cos(θ) × Δt**, ' +
        '**y(t+Δt) = y(t) + v × sin(θ) × Δt**, where v is speed and θ is heading. Error grows ' +
        'roughly as √t for random heading errors (random walk) and linearly with t for systematic ' +
        'bias (e.g., uncorrected current). For a speed error of ±5% and heading error of ±3°, after ' +
        '24 hours at 10 knots, the position uncertainty ellipse has semi-axes of roughly 12 nmi ' +
        '(along-track) and 6 nmi (cross-track). Modern **inertial navigation systems** (INS) use ' +
        'accelerometers and gyroscopes for dead reckoning — aircraft INS drifts ~1 nmi/hr; submarine ' +
        'INS ~0.1 nmi/hr. GPS/INS fusion uses Kalman filtering to combine GPS fixes with INS dead ' +
        'reckoning for robust, continuous navigation.',
      advancedContent:
        'The error propagation in dead reckoning is modeled by the covariance matrix P(t) of the ' +
        'state estimate. For a 2D position/heading state, P evolves as P(t+Δt) = F·P(t)·Fᵀ + Q, ' +
        'where F is the state transition Jacobian and Q is the process noise covariance. The **Extended ' +
        'Kalman Filter** (EKF) fuses dead reckoning predictions with periodic position fixes (GPS, ' +
        'celestial, landmark) to bound error growth. In autonomous vehicles, wheel odometry provides ' +
        'dead reckoning that is fused with LIDAR, camera, and GPS data via particle filters or factor ' +
        'graph optimization (GTSAM). The theoretical lower bound on navigation error is given by the ' +
        'Cramér-Rao bound applied to the sensor noise characteristics.',
    },
  ],
};
