import type { Problem } from '../playground-problems';

export const problems: Problem[] = [
{
    id: 172, slug: 'sql-count-per-park', title: 'Count per Park',
    story: 'The Girl Who Spoke to Elephants', storySlug: 'girl-who-spoke-to-elephants',
    description: 'Write a query to count how many elephants are in each park.',
    difficulty: 'easy', topic: 'sql-aggregate', language: 'sql',
    tiers: [
      { tier: 1, tierName: 'Solve It', goal: 'Count elephants grouped by park.', hint: 'Use GROUP BY park with COUNT(*).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Count elephants per park\n',
        testCases: [
          { input: '', expected: '[["Kaziranga",3],["Manas",2]]', label: 'Kaziranga=3, Manas=2' },
        ] },
      { tier: 2, tierName: 'Clean It', goal: 'Show average weight per park too.', hint: 'Add ROUND(AVG(weight), 0) to the SELECT.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Count and average weight per park\n',
        testCases: [
          { input: '', expected: '[["Kaziranga",3,4600.0],["Manas",2,3500.0]]', label: 'Count + avg weight per park' },
        ] },
      { tier: 3, tierName: 'Optimize It', goal: 'Only show parks with more than 2 elephants.', hint: 'Add HAVING COUNT(*) > 2 after GROUP BY.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Parks with more than 2 elephants\n',
        testCases: [
          { input: '', expected: '[["Kaziranga",3]]', label: 'Only Kaziranga qualifies' },
        ] },
    ],
  },
{
    id: 173, slug: 'sql-heaviest-lightest', title: 'Heaviest and Lightest',
    story: 'The Girl Who Spoke to Elephants', storySlug: 'girl-who-spoke-to-elephants',
    description: 'Write a query to find the heaviest and lightest elephant in each park.',
    difficulty: 'medium', topic: 'sql-aggregate', language: 'sql',
    tiers: [
      { tier: 1, tierName: 'Solve It', goal: 'Use MIN and MAX with GROUP BY.', hint: 'SELECT park, MIN(weight), MAX(weight) FROM elephants GROUP BY park.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Heaviest and lightest per park\n',
        testCases: [
          { input: '', expected: '[["Kaziranga",4100,5200],["Manas",3200,3800]]', label: 'Min and max weight per park' },
        ] },
      { tier: 2, tierName: 'Clean It', goal: 'Also show the weight range (max - min).', hint: 'Add MAX(weight) - MIN(weight) AS range.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Weight range per park\n',
        testCases: [
          { input: '', expected: '[["Kaziranga",4100,5200,1100],["Manas",3200,3800,600]]', label: 'Min, max, and range' },
        ] },
      { tier: 3, tierName: 'Optimize It', goal: 'Find the single heaviest elephant across all parks (name and weight).', hint: 'ORDER BY weight DESC LIMIT 1 — no GROUP BY needed.', hintRef: { slug: 'databases-and-sql', section: 'sql-select', label: 'SELECT in the Library' },
        starterCode: '-- The heaviest elephant overall\n',
        testCases: [
          { input: '', expected: '[["Gaja",5200]]', label: 'Gaja at 5200' },
        ] },
    ],
  },
{
    id: 180, slug: 'sql-books-by-author', title: 'Books by Author',
    story: 'The Boy Who Built a Library', storySlug: 'boy-who-built-library',
    description: 'Write a query to count how many books each author has in the library and find unborrowed books.',
    difficulty: 'easy', topic: 'sql-aggregate', language: 'sql',
    tiers: [
      { tier: 1, tierName: 'Solve It', goal: 'GROUP BY author with COUNT.', hint: 'SELECT author, COUNT(*) FROM books GROUP BY author.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Count books per author\n',
        testCases: [
          { input: '', expected: '[["A.P.J. Abdul Kalam",2],["Arundhati Roy",1],["Jawaharlal Nehru",1],["M.K. Gandhi",1],["Rabindranath Tagore",1],["Rudyard Kipling",1],["Stephen Hawking",1]]', label: 'Kalam has 2, rest have 1' },
        ] },
      { tier: 2, tierName: 'Clean It', goal: 'Find the most borrowed book.', hint: 'JOIN books with loans, GROUP BY title, ORDER BY COUNT DESC LIMIT 1.', hintRef: { slug: 'databases-and-sql', section: 'sql-joins', label: 'Joins in the Library' },
        starterCode: '-- Most borrowed book\n',
        testCases: [
          { input: '', expected: '[["The Jungle Book",2]]', label: 'Jungle Book borrowed twice' },
        ] },
      { tier: 3, tierName: 'Optimize It', goal: 'Find books that have NEVER been borrowed.', hint: 'LEFT JOIN loans, WHERE loans.id IS NULL.', hintRef: { slug: 'databases-and-sql', section: 'sql-joins', label: 'Joins in the Library' },
        starterCode: '-- Books never borrowed\n',
        testCases: [
          { input: '', expected: '[["Discovery of India"]]', label: 'Discovery of India has no loans' },
        ] },
    ],
  },
{
    id: 181, slug: 'sql-reader-analytics', title: 'Reader Analytics',
    story: 'The Boy Who Built a Library', storySlug: 'boy-who-built-library',
    description: 'Analyze the library\'s reading patterns — who reads what genre most.',
    difficulty: 'medium', topic: 'sql-aggregate', language: 'sql',
    tiers: [
      { tier: 1, tierName: 'Solve It', goal: 'Find the average age of members.', hint: 'SELECT ROUND(AVG(age), 1) FROM members.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Average age of library members\n',
        testCases: [
          { input: '', expected: '[[13.0]]', label: 'Average age is 13' },
        ] },
      { tier: 2, tierName: 'Clean It', goal: 'Find how many books each member has borrowed total.', hint: 'LEFT JOIN loans on member_id, GROUP BY name.', hintRef: { slug: 'databases-and-sql', section: 'sql-joins', label: 'Joins in the Library' },
        starterCode: '-- Total loans per member\n',
        testCases: [
          { input: '', expected: '[["Anamika",2],["Priya",2],["Rishi",2],["Dev",1],["Meera",1]]', label: 'Loan count per member' },
        ] },
      { tier: 3, tierName: 'Optimize It', goal: 'Find which genre is most popular (most borrowed).', hint: 'JOIN books with loans, GROUP BY genre, ORDER BY COUNT DESC.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Most popular genre by loan count\n',
        testCases: [
          { input: '', expected: '[["fiction",3],["autobiography",2],["science",2],["poetry",1]]', label: 'Fiction leads with 3 loans' },
        ] },
    ],
  },
{
    id: 183, slug: 'sql-butterfly-hotspot', title: 'Butterfly Hotspots',
    story: 'The Boy Who Counted Butterflies', storySlug: 'boy-who-counted-butterflies',
    description: 'Find which locations have the most butterfly sightings and the largest single sighting.',
    difficulty: 'medium', topic: 'sql-aggregate', language: 'sql',
    tiers: [
      { tier: 1, tierName: 'Solve It', goal: 'Total butterflies per location.', hint: 'GROUP BY location with SUM(count).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Total butterflies counted per location\n',
        testCases: [
          { input: '', expected: '[["Kaziranga Edge",26],["Manas Buffer",20],["Namdapha",18],["Hollongapar",6],["Eaglenest",4]]', label: 'Locations ranked by total count' },
        ] },
      { tier: 2, tierName: 'Clean It', goal: 'Count different species per location.', hint: 'COUNT(DISTINCT butterfly_id) per location.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Species diversity per location\n',
        testCases: [
          { input: '', expected: '[["Eaglenest",2],["Kaziranga Edge",2],["Manas Buffer",2],["Namdapha",2],["Hollongapar",1]]', label: 'Distinct species per location' },
        ] },
      { tier: 3, tierName: 'Optimize It', goal: 'Find the single largest sighting with species and observer.', hint: 'JOIN butterflies, ORDER BY count DESC LIMIT 1.', hintRef: { slug: 'databases-and-sql', section: 'sql-joins', label: 'Joins in the Library' },
        starterCode: '-- Largest single sighting\n',
        testCases: [
          { input: '', expected: '[["Common Jezebel","Priya","Kaziranga Edge",22]]', label: '22 Common Jezebels by Priya' },
        ] },
    ],
  },
{
    id: 184, slug: 'sql-storm-day', title: 'The Storm Day',
    story: "The Fisherman's Daughter and the Storm", storySlug: 'fishermans-daughter-storm',
    description: 'Find the day with the highest average wind speed across all stations — the storm day.',
    difficulty: 'medium', topic: 'sql-aggregate', language: 'sql',
    tiers: [
      { tier: 1, tierName: 'Solve It', goal: 'Average wind speed per day.', hint: 'GROUP BY date, AVG(wind_kph), ORDER BY avg DESC.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Average wind speed per day across all stations\n',
        testCases: [
          { input: '', expected: '[["2026-06-03",38.75],["2026-06-02",18.875],["2026-06-01",9.75]]', label: 'June 3 was the storm day' },
        ] },
      { tier: 2, tierName: 'Clean It', goal: "Show each station's readings on the storm day.", hint: "WHERE date = '2026-06-03' JOIN weather_stations.", hintRef: { slug: 'databases-and-sql', section: 'sql-joins', label: 'Joins in the Library' },
        starterCode: "-- Station readings for the storm day\n",
        testCases: [
          { input: '', expected: '[["Jorhat AWS",28.5,35.0,120.8],["Majuli Island",27.0,48.0,185.3],["Kaziranga Gate",29.0,30.0,95.6],["Tezpur North",28.0,42.0,155.0]]', label: 'All 4 stations on June 3' },
        ] },
      { tier: 3, tierName: 'Optimize It', goal: 'Find which station had the most total rainfall.', hint: 'GROUP BY station_id, SUM(rainfall_mm).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates in the Library' },
        starterCode: '-- Total rainfall per station\n',
        testCases: [
          { input: '', expected: '[["Majuli Island",223.8],["Tezpur North",185.0],["Jorhat AWS",166.0],["Kaziranga Gate",117.6]]', label: 'Majuli got the most rain' },
        ] },
    ],
  },
{ id: 206, slug: 'sql-sighting-groups', title: 'Group Sizes', story: 'The Girl Who Spoke to Elephants', storySlug: 'girl-who-spoke-to-elephants', description: 'Analyze the group_size data from sightings.', difficulty: 'easy', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Find total, average, min, and max group_size.', hint: 'SUM, AVG, MIN, MAX on group_size.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Group size stats\n', testCases: [{ input: '', expected: '[[23,3.8,1,8]]', label: 'Sum=23, avg=3.8, min=1, max=8' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Average group size per elephant.', hint: 'GROUP BY elephant_id with JOIN.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Avg group size per elephant\n', testCases: [{ input: '', expected: '[["Ranga",4.0],["Mohini",2.0],["Gaja",6.0],["Bala",1.0]]', label: 'Gaja seen in largest groups' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Find sightings with group_size above the average group_size.', hint: 'WHERE group_size > (SELECT AVG(group_size) FROM sightings).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Above-average group sizes\n', testCases: [{ input: '', expected: '[["Ranga","2026-02-20",5],["Gaja","2026-03-01",8],["Gaja","2026-03-15",4]]', label: '3 above avg (3.8)' }] },
  ] },
{ id: 207, slug: 'sql-book-stats', title: 'Library Statistics', story: 'The Boy Who Built a Library', storySlug: 'boy-who-built-library', description: 'Calculate statistics about the book collection.', difficulty: 'easy', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Total books, average pages, oldest and newest year.', hint: 'COUNT, AVG, MIN, MAX on books.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Collection stats\n', testCases: [{ input: '', expected: '[[8,301.25,1894,2002]]', label: '8 books, avg 301 pages, 1894-2002' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Books per genre sorted by count.', hint: 'GROUP BY genre ORDER BY COUNT DESC.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Books per genre\n', testCases: [{ input: '', expected: '[["autobiography",2],["fiction",2],["science",2],["history",1],["poetry",1]]', label: 'Genre distribution' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Average pages per genre, only genres with avg > 200.', hint: 'HAVING AVG(pages) > 200.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Genres with avg > 200 pages\n', testCases: [{ input: '', expected: '[["autobiography",330.0],["fiction",299.0],["history",595.0],["science",227.0]]', label: 'Poetry excluded (103 avg)' }] },
  ] },
{ id: 208, slug: 'sql-butterfly-monthly', title: 'Monthly Counts', story: 'The Boy Who Counted Butterflies', storySlug: 'boy-who-counted-butterflies', description: 'Analyze butterfly sightings by date.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Total butterflies sighted per date.', hint: 'GROUP BY date, SUM(count).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Daily totals\n', testCases: [{ input: '', expected: '[["2026-03-15",17],["2026-03-18",4],["2026-03-20",1],["2026-03-22",30],["2026-03-25",3],["2026-03-28",6],["2026-04-01",1],["2026-04-02",12]]', label: '8 days of data' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Find the busiest day (most butterflies).', hint: 'ORDER BY SUM(count) DESC LIMIT 1.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Busiest day\n', testCases: [{ input: '', expected: '[["2026-03-22",30]]', label: 'March 22 with 30' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Running total of butterflies sighted over time.', hint: 'SUM(count) OVER (ORDER BY date).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Running total\n', testCases: [{ input: '', expected: '[["2026-03-15",17,17],["2026-03-18",4,21],["2026-03-20",1,22],["2026-03-22",30,52],["2026-03-25",3,55],["2026-03-28",6,61],["2026-04-01",1,62],["2026-04-02",12,74]]', label: 'Cumulative count' }] },
  ] },
{ id: 209, slug: 'sql-humidity-bands', title: 'Humidity Bands', story: "The Fisherman's Daughter and the Storm", storySlug: 'fishermans-daughter-storm', description: 'Group weather readings by humidity ranges.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: "Classify readings as 'dry' (<85%), 'humid' (85-92%), or 'saturated' (>92%).", hint: "CASE WHEN humidity_pct > 92 THEN 'saturated' ...", hintRef: { slug: 'databases-and-sql', section: 'sql-select', label: 'SELECT' }, starterCode: '-- Classify by humidity\n', testCases: [{ input: '', expected: '[["2026-06-01",85,"humid"],["2026-06-02",92,"humid"],["2026-06-03",95,"saturated"],["2026-06-01",82,"dry"],["2026-06-02",90,"humid"],["2026-06-03",98,"saturated"],["2026-06-01",78,"dry"],["2026-06-02",88,"humid"],["2026-06-03",94,"saturated"],["2026-06-01",80,"dry"],["2026-06-02",86,"humid"],["2026-06-03",96,"saturated"]]', label: 'Each reading classified' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Count readings per humidity band.', hint: 'GROUP BY the CASE expression.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Count per band\n', testCases: [{ input: '', expected: '[["dry",3],["humid",5],["saturated",4]]', label: '3 dry, 5 humid, 4 saturated' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Average wind speed per humidity band.', hint: 'AVG(wind_kph) grouped by band.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Avg wind per humidity band\n', testCases: [{ input: '', expected: '[["dry",9.0],["humid",17.5],["saturated",38.75]]', label: 'Saturated band has highest wind' }] },
  ] },
{ id: 223, slug: 'sql-cross-story-summary', title: 'Sighting Summary', story: 'The Boy Who Counted Butterflies', storySlug: 'boy-who-counted-butterflies', description: 'Create a summary comparing observers, species, and locations.', difficulty: 'hard', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'For each observer, show: total sightings, total individuals, distinct species.', hint: 'COUNT(*), SUM(count), COUNT(DISTINCT butterfly_id) GROUP BY observer.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Observer summary\n', testCases: [{ input: '', expected: '[["Arjun",4,28,4],["Meera",2,14,2],["Priya",2,27,2]]', label: 'Full observer stats but note Priya has 3 sightings' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Percentage of total individuals each observer spotted.', hint: 'SUM(count) * 100.0 / (SELECT SUM(count) FROM butterfly_sightings).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Observer percentage\n', testCases: [{ input: '', expected: '[["Arjun",44.6],["Priya",36.5],["Meera",18.9]]', label: 'Percentages sum to ~100' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Rank observers by total individuals using DENSE_RANK.', hint: 'DENSE_RANK() OVER (ORDER BY SUM(count) DESC).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Ranked observers\n', testCases: [{ input: '', expected: '[["Arjun",33,1],["Priya",27,2],["Meera",14,3]]', label: 'Ranked by total count' }] },
  ] },
{ id: 224, slug: 'sql-weather-extremes', title: 'Weather Extremes', story: "The Fisherman's Daughter and the Storm", storySlug: 'fishermans-daughter-storm', description: 'Find extreme weather conditions across all stations.', difficulty: 'hard', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Find the station with the highest wind reading ever.', hint: 'JOIN with ORDER BY wind_kph DESC LIMIT 1.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Highest wind reading\n', testCases: [{ input: '', expected: '[["Majuli Island","2026-06-03",48.0]]', label: 'Majuli at 48 kph' }] },
    { tier: 2, tierName: 'Clean It', goal: 'For each station, find its most extreme day (highest wind).', hint: 'Window function: ROW_NUMBER() OVER (PARTITION BY station_id ORDER BY wind_kph DESC).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Worst day per station\n', testCases: [{ input: '', expected: '[["Jorhat AWS","2026-06-03",35.0],["Majuli Island","2026-06-03",48.0],["Kaziranga Gate","2026-06-03",30.0],["Tezpur North","2026-06-03",42.0]]', label: 'One extreme day per station' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Calculate a "danger score" = wind_kph + rainfall_mm/10. Find top 3 most dangerous readings.', hint: 'wind_kph + rainfall_mm / 10.0 AS danger_score ORDER BY DESC LIMIT 3.', hintRef: { slug: 'databases-and-sql', section: 'sql-select', label: 'SELECT' }, starterCode: '-- Top 3 danger scores\n', testCases: [{ input: '', expected: '[["Majuli Island","2026-06-03",66.53],["Tezpur North","2026-06-03",57.5],["Jorhat AWS","2026-06-03",47.08]]', label: 'Top 3 by danger score' }] },
  ] },
{ id: 235, slug: 'sql-conditional-count', title: 'Conditional Counting', story: 'The Girl Who Spoke to Elephants', storySlug: 'girl-who-spoke-to-elephants', description: 'Count with conditions using CASE inside aggregate functions.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Count elephants above and below 4000kg in one query.', hint: "SUM(CASE WHEN weight > 4000 THEN 1 ELSE 0 END) AS heavy.", hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Heavy vs light count\n', testCases: [{ input: '', expected: '[[3,2]]', label: '3 heavy, 2 light' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Per park, count sighted vs unsighted elephants.', hint: 'GROUP BY park, SUM(CASE WHEN last_seen IS NOT NULL ...).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Sighted vs unsighted per park\n', testCases: [{ input: '', expected: '[["Kaziranga",2,1],["Manas",1,1]]', label: 'Sighted/unsighted per park' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Create a single-row dashboard: total elephants, total parks, total sightings, avg weight.', hint: 'Subqueries for each count.', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Dashboard row\n', testCases: [{ input: '', expected: '[[5,3,6,4160.0]]', label: 'Full dashboard' }] },
  ] },
{ id: 236, slug: 'sql-group-having-complex', title: 'Active Locations', story: 'The Boy Who Counted Butterflies', storySlug: 'boy-who-counted-butterflies', description: 'Find locations with significant butterfly activity.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Find locations with more than 10 total butterflies.', hint: 'GROUP BY location HAVING SUM(count) > 10.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Active locations (>10 total)\n', testCases: [{ input: '', expected: '[["Kaziranga Edge",26],["Manas Buffer",20],["Namdapha",18]]', label: '3 active locations' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Find locations with more than 1 different species AND more than 5 total.', hint: 'HAVING COUNT(DISTINCT butterfly_id) > 1 AND SUM(count) > 5.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Diverse and active locations\n', testCases: [{ input: '', expected: '[["Kaziranga Edge",26,2],["Manas Buffer",20,2],["Namdapha",18,2]]', label: '3 locations with diversity' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Find the location with the highest average count per sighting.', hint: 'AVG(count) GROUP BY location ORDER BY DESC LIMIT 1.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Highest average per sighting\n', testCases: [{ input: '', expected: '[["Kaziranga Edge",13.0]]', label: 'Kaziranga Edge at 13 avg' }] },
  ] },
{ id: 237, slug: 'sql-weather-aggregate', title: 'Climate Summary', story: "The Fisherman's Daughter and the Storm", storySlug: 'fishermans-daughter-storm', description: 'Create comprehensive weather summaries.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Show min, max, avg temperature across all readings.', hint: 'MIN, MAX, ROUND(AVG, 1) on temp_c.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Temperature summary\n', testCases: [{ input: '', expected: '[[27.0,34.0,30.9]]', label: 'Min 27, max 34, avg 30.9' }] },
    { tier: 2, tierName: 'Clean It', goal: 'For each station, show total rainfall and max wind.', hint: 'GROUP BY station_id with JOIN.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Station summary\n', testCases: [{ input: '', expected: '[["Jorhat AWS",166.0,35.0],["Kaziranga Gate",117.6,30.0],["Majuli Island",223.8,48.0],["Tezpur North",185.0,42.0]]', label: 'Station summaries' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Find which day had the biggest change in avg temp from the previous day.', hint: 'Use a subquery or window function to compare consecutive days.', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Biggest day-to-day temp change\n', testCases: [{ input: '', expected: '[["2026-06-03",-3.125]]', label: 'Day with biggest change' }] },
  ] },
{ id: 243, slug: 'sql-sighting-frequency', title: 'Sighting Frequency', story: 'The Girl Who Spoke to Elephants', storySlug: 'girl-who-spoke-to-elephants', description: 'Analyze how frequently each elephant is sighted.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Count sightings per elephant per park.', hint: 'JOIN sightings, GROUP BY elephant name and park.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Sightings per elephant per park\n', testCases: [{ input: '', expected: '[["Ranga","Kaziranga",2],["Mohini","Manas",1],["Gaja","Kaziranga",2],["Bala","Manas",1]]', label: 'Elephant-park sighting counts' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Find elephants sighted at more than one location.', hint: 'HAVING COUNT(DISTINCT location) > 1.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Multi-location elephants\n', testCases: [{ input: '', expected: '[["Ranga",2],["Gaja",2]]', label: 'Ranga and Gaja seen at 2 locations' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Find the elephant most recently sighted at each location.', hint: 'Window: ROW_NUMBER() OVER (PARTITION BY location ORDER BY date DESC).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Last elephant at each location\n', testCases: [{ input: '', expected: '[["Gaja","Kaziranga East","2026-03-01"],["Ranga","Kaziranga Central","2026-02-20"],["Gaja","Kaziranga West","2026-03-15"],["Mohini","Manas NP","2026-01-22"],["Bala","Manas South","2026-02-10"]]', label: 'Most recent per location' }] },
  ] },
{ id: 246, slug: 'sql-rainy-stations', title: 'Rainy Stations', story: "The Fisherman's Daughter and the Storm", storySlug: 'fishermans-daughter-storm', description: 'Find stations with the most rainy days.', difficulty: 'easy', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Count days with rainfall > 0 per station.', hint: 'WHERE rainfall_mm > 0 GROUP BY station_id.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Rainy days per station\n', testCases: [{ input: '', expected: '[["Jorhat AWS",2],["Kaziranga Gate",2],["Majuli Island",2],["Tezpur North",2]]', label: 'All have 2 rainy days' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Find stations where ALL readings had rain.', hint: 'HAVING COUNT(*) = COUNT(CASE WHEN rainfall_mm > 0 ...).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Stations with rain every day\n', testCases: [{ input: '', expected: '[]', label: 'None — all had a dry day (June 1)' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Percentage of readings with rainfall per station.', hint: 'COUNT(CASE WHEN rainfall > 0 ...) * 100.0 / COUNT(*).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Rain percentage per station\n', testCases: [{ input: '', expected: '[["Jorhat AWS",66.7],["Kaziranga Gate",66.7],["Majuli Island",66.7],["Tezpur North",66.7]]', label: 'All at 66.7%' }] },
  ] },
{ id: 264, slug: 'sql-count-distinct', title: 'Distinct Counts', story: 'The Girl Who Spoke to Elephants', storySlug: 'girl-who-spoke-to-elephants', description: 'Practice COUNT(DISTINCT ...) for unique value counting.', difficulty: 'easy', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Count distinct locations in the sightings table.', hint: 'SELECT COUNT(DISTINCT location) FROM sightings.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Unique sighting locations\n', testCases: [{ input: '', expected: '[[5]]', label: '5 distinct locations' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Count distinct elephants sighted per park.', hint: 'COUNT(DISTINCT elephant_id) GROUP BY park_id.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Distinct elephants per park\n', testCases: [{ input: '', expected: '[["Kaziranga",2],["Manas",2]]', label: 'Distinct per park' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Find the park with the most diverse elephant visitors.', hint: 'ORDER BY COUNT(DISTINCT elephant_id) DESC LIMIT 1.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Most diverse park\n', testCases: [{ input: '', expected: '[["Kaziranga",2]]', label: 'Park with most species' }] },
  ] },
{ id: 265, slug: 'sql-total-pages', title: 'Reading Challenge', story: 'The Boy Who Built a Library', storySlug: 'boy-who-built-library', description: 'Calculate total pages read by each member.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Total pages borrowed by each member (sum of book pages for their loans).', hint: 'JOIN loans, books, members, SUM(pages) GROUP BY name.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Total pages per member\n', testCases: [{ input: '', expected: '[["Anamika",457],["Dev",480],["Meera",103],["Priya",519],["Rishi",533]]', label: 'Pages per reader' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Find the member who borrowed the most total pages.', hint: 'ORDER BY SUM(pages) DESC LIMIT 1.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Top reader by pages\n', testCases: [{ input: '', expected: '[["Rishi",533]]', label: 'Rishi reads most' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Average pages per loan for each member.', hint: 'ROUND(AVG(pages), 0) GROUP BY member.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Avg pages per loan\n', testCases: [{ input: '', expected: '[["Anamika",229],["Dev",480],["Meera",103],["Priya",260],["Rishi",267]]', label: 'Avg per loan' }] },
  ] },
{ id: 266, slug: 'sql-sighting-gap', title: 'Sighting Gaps', story: 'The Boy Who Counted Butterflies', storySlug: 'boy-who-counted-butterflies', description: 'Find gaps between consecutive sightings.', difficulty: 'hard', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Show each sighting with the previous sighting date.', hint: 'LAG(date) OVER (ORDER BY date).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Each sighting with previous date\n', testCases: [{ input: '', expected: '[["2026-03-15",null],["2026-03-15","2026-03-15"],["2026-03-18","2026-03-15"],["2026-03-20","2026-03-18"],["2026-03-22","2026-03-20"],["2026-03-22","2026-03-22"],["2026-03-25","2026-03-22"],["2026-03-28","2026-03-25"],["2026-04-01","2026-03-28"],["2026-04-02","2026-04-01"]]', label: 'Dates with LAG' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Calculate days between consecutive sightings.', hint: 'julianday(date) - julianday(LAG(date) OVER ...).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Days between sightings\n', testCases: [{ input: '', expected: '[["2026-03-15",null],["2026-03-15",0.0],["2026-03-18",3.0],["2026-03-20",2.0],["2026-03-22",2.0],["2026-03-22",0.0],["2026-03-25",3.0],["2026-03-28",3.0],["2026-04-01",4.0],["2026-04-02",1.0]]', label: 'Gap in days' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Find the longest gap between any two consecutive sightings.', hint: 'MAX of the gap calculation.', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Longest gap\n', testCases: [{ input: '', expected: '[["2026-04-01",4.0]]', label: 'Longest gap found' }] },
  ] },
{ id: 267, slug: 'sql-rainfall-percentile', title: 'Rainfall Analysis', story: "The Fisherman's Daughter and the Storm", storySlug: 'fishermans-daughter-storm', description: 'Analyze rainfall distribution across stations.', difficulty: 'hard', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Rank all readings by rainfall amount.', hint: 'RANK() OVER (ORDER BY rainfall_mm DESC).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Rank by rainfall\n', testCases: [{ input: '', expected: '[["Majuli Island","2026-06-03",185.3,1],["Tezpur North","2026-06-03",155.0,2],["Jorhat AWS","2026-06-03",120.8,3],["Kaziranga Gate","2026-06-03",95.6,4],["Jorhat AWS","2026-06-02",45.2,5],["Majuli Island","2026-06-02",38.5,6],["Tezpur North","2026-06-02",30.0,7],["Kaziranga Gate","2026-06-02",22.0,8],["Jorhat AWS","2026-06-01",0.0,9],["Kaziranga Gate","2026-06-01",0.0,9],["Majuli Island","2026-06-01",0.0,9],["Tezpur North","2026-06-01",0.0,9]]', label: 'All 12 ranked' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Show percentage of total rainfall each reading contributes.', hint: 'rainfall_mm * 100.0 / SUM(rainfall_mm) OVER ().', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Rainfall percentage\n', testCases: [{ input: '', expected: '[["Majuli Island","2026-06-03",185.3,26.8],["Tezpur North","2026-06-03",155.0,22.4],["Jorhat AWS","2026-06-03",120.8,17.4],["Kaziranga Gate","2026-06-03",95.6,13.8],["Jorhat AWS","2026-06-02",45.2,6.5],["Majuli Island","2026-06-02",38.5,5.6],["Tezpur North","2026-06-02",30.0,4.3],["Kaziranga Gate","2026-06-02",22.0,3.2],["Jorhat AWS","2026-06-01",0.0,0.0],["Kaziranga Gate","2026-06-01",0.0,0.0],["Majuli Island","2026-06-01",0.0,0.0],["Tezpur North","2026-06-01",0.0,0.0]]', label: 'Percentage contribution' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Cumulative rainfall percentage (running sum as % of total).', hint: 'SUM(rainfall_mm) OVER (ORDER BY rainfall_mm DESC) / SUM(rainfall_mm) OVER ().', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Cumulative % of rainfall\n', testCases: [{ input: '', expected: '[["Majuli Island","2026-06-03",185.3,26.8],["Tezpur North","2026-06-03",155.0,49.1],["Jorhat AWS","2026-06-03",120.8,66.6],["Kaziranga Gate","2026-06-03",95.6,80.4],["Jorhat AWS","2026-06-02",45.2,86.9],["Majuli Island","2026-06-02",38.5,92.5],["Tezpur North","2026-06-02",30.0,96.8],["Kaziranga Gate","2026-06-02",22.0,100.0]]', label: 'Pareto-style analysis' }] },
  ] },
{ id: 275, slug: 'sql-group-concat', title: 'List Aggregation', story: 'The Girl Who Spoke to Elephants', storySlug: 'girl-who-spoke-to-elephants', description: 'Use GROUP_CONCAT to combine values from multiple rows into one string.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'List all elephant names per park as a comma-separated string.', hint: "GROUP_CONCAT(name, ', ') GROUP BY park.", hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Names per park\n', testCases: [{ input: '', expected: '[["Kaziranga","Ranga,Gaja,Tara"],["Manas","Mohini,Bala"]]', label: 'Comma-separated names' }] },
    { tier: 2, tierName: 'Clean It', goal: 'List sighting locations per elephant.', hint: 'JOIN sightings, GROUP_CONCAT(DISTINCT location).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Locations per elephant\n', testCases: [{ input: '', expected: '[["Ranga","Kaziranga East,Kaziranga Central"],["Mohini","Manas NP"],["Gaja","Kaziranga East,Kaziranga West"],["Bala","Manas South"]]', label: 'Locations listed' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'List parks visited per elephant with first_seen dates.', hint: "GROUP_CONCAT(p.name || ' (' || pe.first_seen || ')').", hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Parks with dates\n', testCases: [{ input: '', expected: '[["Ranga","Kaziranga (2020-03-15),Manas (2022-06-10)"],["Mohini","Manas (2019-11-01)"],["Gaja","Kaziranga (2021-01-20)"],["Tara","Kaziranga (2023-05-05)"],["Bala","Manas (2024-02-14)"]]', label: 'Parks and dates combined' }] },
  ] },
{ id: 276, slug: 'sql-genre-diversity', title: 'Genre Diversity Score', story: 'The Boy Who Built a Library', storySlug: 'boy-who-built-library', description: 'Calculate a reading diversity score for each member.', difficulty: 'hard', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Count distinct genres each member has borrowed.', hint: 'COUNT(DISTINCT genre) from loans JOIN books GROUP BY member.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Genre diversity per member\n', testCases: [{ input: '', expected: '[["Anamika",2],["Dev",1],["Meera",1],["Priya",2],["Rishi",2]]', label: 'Distinct genre counts' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Calculate diversity as percentage: genres_read / total_genres * 100.', hint: 'COUNT(DISTINCT genre) * 100.0 / (SELECT COUNT(DISTINCT genre) FROM books).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Diversity percentage\n', testCases: [{ input: '', expected: '[["Anamika",40.0],["Dev",20.0],["Meera",20.0],["Priya",40.0],["Rishi",40.0]]', label: 'Diversity scores' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Rank members by diversity score.', hint: 'RANK() OVER (ORDER BY COUNT(DISTINCT genre) DESC).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Ranked by diversity\n', testCases: [{ input: '', expected: '[["Anamika",2,1],["Priya",2,1],["Rishi",2,1],["Dev",1,4],["Meera",1,4]]', label: 'Diversity ranking' }] },
  ] },
{ id: 277, slug: 'sql-endangered-ratio', title: 'Endangered Ratio', story: 'The Boy Who Counted Butterflies', storySlug: 'boy-who-counted-butterflies', description: 'Compare sighting ratios between endangered and non-endangered species.', difficulty: 'hard', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Total individuals sighted: endangered vs non-endangered.', hint: 'GROUP BY endangered, SUM(count).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Endangered vs not totals\n', testCases: [{ input: '', expected: '[[0,67],[1,7]]', label: 'Non-endangered: 67, endangered: 7' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Percentage of total sightings that are endangered species.', hint: 'Endangered sum * 100.0 / total sum.', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Endangered percentage\n', testCases: [{ input: '', expected: '[[9.5]]', label: 'About 9.5%' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'For each observer, what percentage of their sightings were endangered species.', hint: 'Conditional SUM per observer.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Observer endangered percentage\n', testCases: [{ input: '', expected: '[["Arjun",18.2],["Meera",0.0],["Priya",3.7]]', label: 'Per-observer ratios' }] },
  ] },
{ id: 278, slug: 'sql-correlation-weather', title: 'Wind-Rain Correlation', story: "The Fisherman's Daughter and the Storm", storySlug: 'fishermans-daughter-storm', description: 'Explore the relationship between wind speed and rainfall.', difficulty: 'hard', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Show wind and rainfall together for all readings, sorted by wind.', hint: 'SELECT wind_kph, rainfall_mm ORDER BY wind_kph.', hintRef: { slug: 'databases-and-sql', section: 'sql-select', label: 'SELECT' }, starterCode: '-- Wind vs rainfall\n', testCases: [{ input: '', expected: '[[8.0,0.0],[9.0,0.0],[10.0,0.0],[12.0,0.0],[15.0,22.0],[18.5,45.2],[20.0,30.0],[22.0,38.5],[30.0,95.6],[35.0,120.8],[42.0,155.0],[48.0,185.3]]', label: 'Wind-rainfall pairs' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Calculate average rainfall at different wind levels: low (<15), medium (15-30), high (>30).', hint: 'GROUP BY CASE for wind bands, AVG(rainfall_mm).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Rainfall by wind level\n', testCases: [{ input: '', expected: '[["high",153.7],["low",0.0],["medium",46.26]]', label: 'Rainfall increases with wind' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Find readings where rainfall was disproportionately high relative to wind.', hint: 'WHERE rainfall_mm / wind_kph > threshold.', hintRef: { slug: 'databases-and-sql', section: 'sql-select', label: 'SELECT' }, starterCode: '-- Disproportionate rainfall\n', testCases: [{ input: '', expected: 'true', label: 'Unusual readings identified' }] },
  ] },
{ id: 284, slug: 'sql-rain-vs-no-rain', title: 'Rain Impact', story: "The Fisherman's Daughter and the Storm", storySlug: 'fishermans-daughter-storm', description: 'Compare weather metrics on rainy vs dry days.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Average wind speed on rainy days vs dry days.', hint: "AVG(wind_kph) GROUP BY (CASE WHEN rainfall_mm > 0 THEN 'rainy' ELSE 'dry' END).", hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Wind on rainy vs dry\n', testCases: [{ input: '', expected: '[["dry",9.75],["rainy",28.8125]]', label: 'Rainy days windier' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Average temperature on rainy vs dry days.', hint: 'Same grouping, AVG(temp_c).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Temp on rainy vs dry\n', testCases: [{ input: '', expected: '[["dry",33.25],["rainy",29.6875]]', label: 'Rainy days cooler' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Full comparison: avg temp, avg wind, avg humidity for rainy vs dry.', hint: 'Multiple aggregates in one GROUP BY.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Full rainy vs dry comparison\n', testCases: [{ input: '', expected: '[["dry",33.25,9.75,81.25],["rainy",29.6875,28.8125,92.375]]', label: 'Complete comparison' }] },
  ] },
{ id: 285, slug: 'sql-total-weight-park', title: 'Park Weight Budget', story: 'The Girl Who Spoke to Elephants', storySlug: 'girl-who-spoke-to-elephants', description: 'Calculate total elephant weight per park.', difficulty: 'easy', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Sum of weights per park.', hint: 'SUM(weight) GROUP BY park.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Total weight per park\n', testCases: [{ input: '', expected: '[["Kaziranga",13800],["Manas",7000]]', label: 'Kaziranga: 13800' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Show as percentage of total weight.', hint: 'SUM(weight) * 100.0 / (SELECT SUM(weight) FROM elephants).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Weight percentage per park\n', testCases: [{ input: '', expected: '[["Kaziranga",66.3],["Manas",33.7]]', label: 'Percentages' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Estimated daily food budget (each elephant eats 150kg/day × weight/4500).', hint: 'SUM(150.0 * weight / 4500) per park.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Daily food estimate per park\n', testCases: [{ input: '', expected: '[["Kaziranga",460.0],["Manas",233.3]]', label: 'Food budget per park' }] },
  ] },
{ id: 533, slug: 'sql-firefly-growth', title: 'Population Growth', story: 'The Firefly Festival of Majuli', storySlug: 'firefly-festival-of-majuli', description: 'Track firefly population growth over the survey period.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Total fireflies counted per date across all surveys.', hint: 'SELECT date, SUM(count) GROUP BY date ORDER BY date.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Daily totals\n', testCases: [{ input: '', expected: '[["2026-02-10",550],["2026-02-12",80],["2026-02-15",120],["2026-02-18",45],["2026-03-01",650],["2026-03-05",30],["2026-03-10",220],["2026-03-15",860],["2026-03-20",25]]', label: 'Population peaks in March' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Average count per survey for each location.', hint: 'AVG(count) GROUP BY location ORDER BY avg DESC.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Avg per location\n', testCases: [{ input: '', expected: '[["Majuli North Bank",405.0],["Majuli South Bank",240.0],["Kaziranga Edge",70.0],["Manas Riverbank",35.0],["Hollongapar Forest",30.0]]', label: 'Majuli North Bank highest' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Find the peak survey (highest count) for each species using a window function.', hint: 'ROW_NUMBER() OVER (PARTITION BY species_id ORDER BY count DESC).', hintRef: { slug: 'databases-and-sql', section: 'sql-subqueries', label: 'Subqueries' }, starterCode: '-- Peak survey per species\n', testCases: [{ input: '', expected: '[["Pteroptyx malaccae","Majuli North Bank",800],["Luciola praeusta","Majuli South Bank",150],["Asymmetricata circumdata","Majuli South Bank",220],["Colophotia brevis","Manas Riverbank",45],["Luciola ficta","Hollongapar Forest",30]]', label: 'Peak location per species' }] },
  ] },
{ id: 541, slug: 'sql-sonar-depth', title: 'Depth vs Sonar', story: "The River Dolphin's Secret", storySlug: 'river-dolphins-secret', description: 'Analyze how water depth affects echolocation behavior.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Find min, max, and average depth across all recordings.', hint: 'MIN(depth_m), MAX(depth_m), ROUND(AVG(depth_m), 1).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Depth stats\n', testCases: [{ input: '', expected: '[[2.5,6.2,4.29]]', label: 'Range 2.5-6.2m, avg 4.29m' }] },
    { tier: 2, tierName: 'Clean It', goal: 'Average click duration per dolphin, ordered longest first.', hint: 'ROUND(AVG(duration_ms), 3) GROUP BY name ORDER BY avg DESC.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Avg click duration\n', testCases: [{ input: '', expected: '[["Jala",0.16],["Sisu",0.14],["Dhara",0.115],["Ganga",0.1],["Makara",0.067]]', label: 'Jala uses longest clicks (shallow water)' }] },
    { tier: 3, tierName: 'Optimize It', goal: "Classify recordings by depth: 'shallow' (<3m), 'medium' (3-5m), 'deep' (>5m). Show avg frequency per band.", hint: 'CASE WHEN depth_m > 5 THEN ... GROUP BY band.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Frequency by depth band\n', testCases: [{ input: '', expected: '[["deep",80.17],["medium",64.72],["shallow",57.5]]', label: 'Higher frequency in deeper water' }] },
  ] },
{ id: 548, slug: 'sql-silk-year-comparison', title: 'Year-over-Year Growth', story: 'Why the Muga Silk Is Golden', storySlug: 'muga-silk-golden', description: 'Compare silk production between 2024 and 2025 to track industry growth.', difficulty: 'medium', topic: 'sql-aggregate', language: 'sql', tiers: [
    { tier: 1, tierName: 'Solve It', goal: 'Total cocoons and raw silk per year.', hint: 'SUM(cocoons_kg), SUM(raw_silk_kg) GROUP BY year.', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Yearly totals\n', testCases: [{ input: '', expected: '[[2024,975.0,65.8],[2025,1060.0,72.4]]', label: 'Both growing' }] },
    { tier: 2, tierName: 'Clean It', goal: 'For each weaver, show their 2024 vs 2025 raw silk production side by side.', hint: 'Use conditional aggregation: SUM(CASE WHEN year=2024 THEN raw_silk_kg END).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Weaver year comparison\n', testCases: [{ input: '', expected: '[["Bina Borah",8.5,10.2],["Hema Gogoi",6.8,7.9],["Juri Phukan",5.5,7.0],["Lakshmi Devi",22.0,23.0],["Moni Kalita",11.0,10.8],["Rina Das",12.0,13.5]]', label: 'Most weavers grew' }] },
    { tier: 3, tierName: 'Optimize It', goal: 'Calculate each weaver\'s growth rate: (2025 - 2024) / 2024 * 100, rounded to 1 decimal.', hint: 'ROUND((SUM(CASE 2025) - SUM(CASE 2024)) / SUM(CASE 2024) * 100, 1).', hintRef: { slug: 'databases-and-sql', section: 'sql-aggregate', label: 'Aggregates' }, starterCode: '-- Growth rate per weaver\n', testCases: [{ input: '', expected: '[["Bina Borah",20.0],["Hema Gogoi",16.2],["Juri Phukan",27.3],["Lakshmi Devi",4.5],["Moni Kalita",-1.8],["Rina Das",12.5]]', label: 'Juri Phukan grew fastest' }] },
  ] },
];
