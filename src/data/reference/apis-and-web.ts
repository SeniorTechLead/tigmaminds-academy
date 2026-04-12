import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'apis-and-web',
  title: 'APIs & How the Web Works',
  category: 'language',
  icon: '💻',
  tagline: 'How apps talk to each other — from weather data to social media to your favorite games.',

  understand: [
    {
      title: 'How the Internet Works',
      beginnerContent:
        'When you type "google.com" into your browser and press Enter, a chain of events happens in ' +
        'milliseconds. First, your computer asks a *DNS server* (like a phone book for the internet) ' +
        'to translate "google.com" into an IP address — a numerical address like 142.250.190.78. Then ' +
        'your browser sends an *HTTP request* to that address, asking for the homepage. Google\'s server ' +
        'receives the request, builds the page, and sends back an *HTTP response* containing HTML, CSS, ' +
        'and JavaScript. Your browser renders all of that into the page you see.\n\n' +
        'This is the *client-server* model: your browser is the client (it asks for things), and Google\'s ' +
        'computer is the server (it provides things). HTTP (HyperText Transfer Protocol) is the language ' +
        'they speak. Every URL has a structure: `https://` means use encrypted HTTP, `www.example.com` is ' +
        'the domain name, and `/about` is the path to a specific page. Understanding this flow — DNS ' +
        'lookup, HTTP request, server processing, HTTP response, browser rendering — is the foundation ' +
        'for understanding everything else about web development and APIs.',
      intermediateContent:
        'The internet is a network of networks. Your device → router → ISP → internet backbone → destination server. Data travels as packets: each packet has a source IP, destination IP, and payload. TCP breaks data into ordered packets and ensures delivery (retransmits lost packets). UDP sends without guarantees (faster, used for video streaming and gaming). DNS translates domain names (google.com) to IP addresses (142.250.80.46). HTTP is the protocol web browsers use: a request (GET /page.html) produces a response (200 OK + content).',
      advancedContent:
        'The OSI model describes 7 layers of networking: Physical (cables, radio) → Data Link (Ethernet frames, MAC addresses) → Network (IP packets, routing) → Transport (TCP/UDP, ports) → Session → Presentation → Application (HTTP, SMTP, DNS). In practice, the TCP/IP model collapses these to 4 layers. Content Delivery Networks (CDNs) cache content at servers worldwide — when you access a website, the CDN serves content from the nearest edge server. HTTPS uses TLS encryption: the server presents a certificate (verified by a Certificate Authority), a secure session key is negotiated, and all subsequent data is encrypted. Certificate Transparency logs make it detectable when fake certificates are issued.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each web concept to its role',
          pairs: [
            ['DNS', 'Translates domain names into IP addresses'],
            ['HTTP', 'The protocol browsers and servers use to communicate'],
            ['Client', 'The browser or app that sends requests'],
            ['Server', 'The computer that receives requests and sends responses'],
            ['URL', 'The address that identifies a specific page or resource'],
          ],
        },
      },
    },
    {
      title: 'What Is an API?',
      beginnerContent:
        'An API (Application Programming Interface) is a way for two pieces of software to talk to each ' +
        'other. The classic analogy is a restaurant: you (the client) sit at a table and want food from ' +
        'the kitchen (the server). You do not walk into the kitchen yourself — that would be messy and ' +
        'dangerous. Instead, a waiter (the API) takes your order, brings it to the kitchen, and returns ' +
        'with your food. The waiter defines the *interface* — you can order anything on the menu, but ' +
        'nothing else.\n\n' +
        'In software, APIs work the same way. When a weather app on your phone shows tomorrow\'s forecast, ' +
        'it does not have its own weather satellites. It sends a request to a weather API (like ' +
        'OpenWeatherMap), which returns the data in a structured format. The app then displays it. APIs ' +
        'let developers build on top of existing services without reinventing them. Google Maps has an ' +
        'API that Uber uses for directions. Stripe has an API that online stores use for payments. ' +
        'Almost every modern app is a patchwork of API calls to different services, all stitched together ' +
        'into a seamless user experience.\n\n' +
        'APIs have rules, documented in their API reference: which URLs (called *endpoints*) you can ' +
        'call, what data you must send, and what data you will get back. Following these rules is like ' +
        'ordering from the menu — you get reliable, predictable results.',
      intermediateContent:
        'A REST API uses HTTP methods: **GET** (read data), **POST** (create new data), **PUT** (update existing data), **DELETE** (remove data). Example: `GET /api/elephants` returns a JSON list of elephants. `POST /api/elephants` with body `{"name": "Ranga", "weight": 4500}` creates a new record. `GET /api/elephants/42` returns elephant #42. Response includes a status code: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error). Python: `response = requests.get("https://api.example.com/elephants"); data = response.json()`.',
      advancedContent:
        'API authentication protects resources: **API keys** (simple tokens in headers), **OAuth 2.0** (delegation protocol — "log in with Google" uses OAuth), **JWT** (JSON Web Tokens — self-contained signed tokens encoding user identity). Rate limiting prevents abuse: APIs typically allow 60-1000 requests/minute per key. **GraphQL** (Facebook, 2015) is an alternative to REST: clients specify exactly which fields they need in a query, reducing over-fetching. **WebSocket** provides full-duplex, persistent connections for real-time data (chat, live dashboards, IoT sensor streams). **gRPC** (Google) uses protocol buffers for high-performance, strongly-typed API communication between microservices.',
    },
    {
      title: 'REST APIs: GET, POST, PUT, DELETE, and JSON',
      beginnerContent:
        'REST (Representational State Transfer) is the most common style of API on the web. It uses ' +
        'standard HTTP methods as verbs: *GET* retrieves data (like viewing a profile), *POST* creates ' +
        'new data (like submitting a form), *PUT* updates existing data (like editing your bio), and ' +
        '*DELETE* removes data (like deleting a post). A REST API endpoint looks like a URL: ' +
        '`GET https://api.example.com/students/42` might return the data for student number 42.\n\n' +
        'The data format is almost always *JSON* (JavaScript Object Notation), which looks like this: ' +
        '`{"name": "Ananya", "class": 10, "marks": [85, 92, 78]}`. JSON is human-readable, lightweight, ' +
        'and supported by every programming language. When you call a REST API, you send a request with ' +
        'optional JSON data (for POST/PUT), and you receive a response with a status code (200 means ' +
        'success, 404 means not found, 500 means server error) and a JSON body containing the data.\n\n' +
        'The beauty of REST is its simplicity and universality. Whether the server is written in Python, ' +
        'Java, Go, or Rust, the client does not care — it just sends HTTP requests and reads JSON ' +
        'responses. This separation is why the frontend (what you see) and backend (the server logic) ' +
        'can be built by completely different teams in completely different languages.',
      intermediateContent:
        'Python requests library: resp = requests.get(url, params={"species": "asian"}, headers={"Authorization": "Bearer token"}). Check: resp.status_code, resp.raise_for_status(). Parse: data = resp.json(). POST: requests.post(url, json={"name": "Ranga"}). Handle errors: try/except requests.Timeout. **Pagination**: follow next_url links or increment page parameter. Rate limiting: respect Retry-After headers and implement exponential backoff for 429 (Too Many Requests) responses.',
      advancedContent:
        'Building APIs with FastAPI: @app.get("/elephants/{id}") async def get_elephant(id: int): return db.find(id). Auto-generates OpenAPI docs. **Middleware** adds CORS, logging, auth. Docker packages the API portably. **GraphQL** lets clients specify exactly which fields they need, reducing over-fetching. **WebSocket** provides real-time bidirectional communication. **gRPC** uses protocol buffers for high-performance inter-service communication. API versioning (/api/v1/, /api/v2/) maintains backward compatibility as the API evolves.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each HTTP method to its purpose',
          pairs: [
            ['GET', 'Retrieve data without changing anything'],
            ['POST', 'Create a new resource'],
            ['PUT', 'Update an existing resource'],
            ['DELETE', 'Remove a resource'],
          ],
        },
      },
    },
    {
      title: 'Using APIs in Practice',
      beginnerContent:
        'Let us walk through a real example. OpenWeatherMap provides a free weather API. To get the ' +
        'current weather in Guwahati, you send a GET request to:\n\n' +
        '`https://api.openweathermap.org/data/2.5/weather?q=Guwahati&appid=YOUR_API_KEY`\n\n' +
        'Notice the `appid` parameter — this is your *API key*, a unique token that identifies you. ' +
        'Most APIs require authentication so they can track usage and prevent abuse. You sign up on ' +
        'their website, get a key, and include it in every request. The response comes back as JSON: ' +
        'temperature, humidity, wind speed, weather description, and more. Your app parses this JSON ' +
        'and displays it in a friendly UI.\n\n' +
        'APIs also have *rate limits* — rules about how many requests you can make per minute or per day. ' +
        'A free tier might allow 60 requests per minute; exceeding that returns a 429 ("Too Many ' +
        'Requests") error. This prevents one user from overloading the server. Professional apps handle ' +
        'this by caching responses (storing them temporarily so you do not re-fetch the same data) and ' +
        'implementing retry logic with exponential backoff (wait 1 second, then 2, then 4, etc.).\n\n' +
        'Understanding APIs unlocks an enormous world of data and services. You can pull stock prices, ' +
        'translate text, send SMS messages, generate AI images, and process payments — all by calling ' +
        'the right API with the right parameters. Modern software development is largely about choosing ' +
        'which APIs to use and wiring them together intelligently.',
      intermediateContent:
        'Building a weather dashboard: (1) Get an API key from OpenWeatherMap. (2) Request: requests.get(f"https://api.openweathermap.org/data/2.5/weather?q=Guwahati&appid={key}&units=metric"). (3) Parse: data["main"]["temp"], data["weather"][0]["description"]. (4) Display or store. **Error handling**: check status codes, handle network timeouts, validate response format. **Caching**: save API responses locally to avoid hitting rate limits — store the result with a timestamp and reuse if less than 10 minutes old.',
      advancedContent:
        'API design principles: use nouns for resources (/elephants, /sightings), HTTP verbs for actions (GET=read, POST=create, PUT=update, DELETE=remove), consistent error format ({"error": "message", "code": 404}), pagination (page=2&per_page=20), and versioning (/api/v1/). HATEOAS (Hypermedia as the Engine of Application State) includes links in responses: {"next": "/elephants?page=3"}, allowing clients to discover available actions. API documentation (Swagger/OpenAPI) auto-generates interactive docs where developers can try endpoints directly in the browser.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'An API key is used to identify and authenticate the caller making requests.', answer: true, explanation: 'API keys let the service track who is making requests, enforce rate limits, and bill for usage.' },
            { text: 'Rate limits exist to punish free-tier users.', answer: false, explanation: 'Rate limits protect the server from being overwhelmed. They apply to all users, including paying ones, just at different thresholds.' },
            { text: 'You need to know what programming language the server is written in before you can call its API.', answer: false, explanation: 'That is the whole point of APIs — they use standard HTTP and JSON, so the client and server can use completely different languages.' },
          ],
        },
      },
    },
  ],
};
