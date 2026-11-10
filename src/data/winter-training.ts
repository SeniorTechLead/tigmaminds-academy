export interface CurriculumModule {
  id: string;
  badge: string;
  title: string;
  focus: string;
  description: string;
  topics: string[];
  lab: {
    title: string;
    description: string;
    endpoints?: string[];
    skills: string[];
  };
}

export interface TechStackItem {
  name: string;
  role: string;
  description: string;
  badge: string;
}

export interface CapstoneLayer {
  step: string;
  title: string;
  route?: string;
  description: string;
  keyFeature: string;
}

export interface WinterTrainingFAQ {
  question: string;
  answer: string;
}

export const WINTER_TRAINING_MODULES: CurriculumModule[] = [
  {
    id: 'module-1',
    badge: 'Module 1',
    title: 'Modern Python & Asynchronous Systems',
    focus: 'Language Mastery & Async Foundations',
    description:
      'Master modern Python 3.11+ tooling, type discipline, and asynchronous execution essential for high-throughput AI services.',
    topics: [
      'Virtual environments, modern packaging & clean project architecture',
      'Strict type hints, dataclasses, structured error handling & pathlib',
      'Asynchronous programming with async/await, asyncio.gather & event loops',
      'Concurrent HTTP requests with HTTPX and secure environment configuration',
    ],
    lab: {
      title: 'Concurrent Document Fetcher & Corpus Processor',
      description:
        'Build a robust asynchronous pipeline to fetch multiple resources concurrently, parse JSON payloads, validate Document records, and enforce strict error boundaries.',
      skills: ['Python 3.11+', 'asyncio', 'httpx', 'Dataclasses', 'Typing'],
    },
  },
  {
    id: 'module-2',
    badge: 'Module 2',
    title: 'Production-Grade FastAPI & Pydantic v2',
    focus: 'Microservice Design & Typed Contracts',
    description:
      'Architect robust REST microservices with automated documentation, dependency injection, and strict request/response data contracts.',
    topics: [
      'FastAPI application structure, path operations, query parameters & Uvicorn',
      'Interactive documentation with auto-generated OpenAPI & Swagger UI',
      'Pydantic v2 BaseModels, Field validation, custom validators & pydantic-settings',
      'FastAPI Depends injection, multipart file uploads & SQLite metadata persistence',
      'HTTP status code discipline, CORS middleware, and TestClient integration testing',
    ],
    lab: {
      title: 'Typed Document Ingestion Service & Test Suite',
      description:
        'Implement POST /ingest for file uploads with metadata extraction, SQLite tracking, and a comprehensive TestClient test suite validating health checks and bad-input rejection.',
      endpoints: ['GET /health', 'POST /ingest', 'GET /documents'],
      skills: ['FastAPI', 'Pydantic v2', 'SQLite', 'TestClient', 'OpenAPI'],
    },
  },
  {
    id: 'module-3',
    badge: 'Module 3',
    title: 'LLMs, Embeddings & Grounded RAG from Scratch',
    focus: 'Vector Semantics & Deterministic Pipelines',
    description:
      'Deconstruct the complete Retrieval-Augmented Generation pipeline step-by-step without framework black-boxes so every mechanical piece is transparent.',
    topics: [
      'Chat completions, system/user prompting, temperature tuning & token budgets',
      'Structured model outputs parsed directly into typed Pydantic models',
      'Vector representations, cosine similarity ranking, chunk size and overlap trade-offs',
      'Chroma vector database setup on disk, document metadata & top-k retrieval',
      'RAG by hand: retrieve-then-generate, grounded prompts, inline citations & refusal logic',
    ],
    lab: {
      title: 'Handcrafted RAG Engine with Exact Citations',
      description:
        'Build a vector chunking and search pipeline with Chroma, ranking chunks with cosine similarity, and expose POST /ask with verified citations and strict refusals when context is insufficient.',
      endpoints: ['POST /chat', 'POST /ask'],
      skills: ['Vector Embeddings', 'Chroma DB', 'RAG Architecture', 'Cosine Similarity', 'Prompt Engineering'],
    },
  },
  {
    id: 'module-4',
    badge: 'Module 4',
    title: 'LangChain & Autonomous LangGraph Agents',
    focus: 'Chains, Memory & Stateful Multi-Step Workflows',
    description:
      'Elevate raw pipelines into composable LCEL runnables and build autonomous, cyclical decision-making agents with persistent state.',
    topics: [
      'LangChain Expression Language (LCEL): prompt | model | parser runnable composition',
      'Document loaders, text splitters, and contextual vector-store retrievers',
      'Conversational memory and contextual chat over document history',
      'LangGraph StateGraph architecture: typed state, nodes, edges & conditional branching',
      'Tool schemas, dynamic tool execution nodes, cyclical loops & MemorySaver thread checkpoints',
    ],
    lab: {
      title: 'Multi-Step Knowledge Agent with Dynamic Tool Routing',
      description:
        'Construct a stateful LangGraph agent that inspects queries, routes between direct answers and knowledge-base search tools, retains conversation memory, and prevents infinite loops.',
      endpoints: ['POST /chat (LangGraph Agent)'],
      skills: ['LangChain (LCEL)', 'LangGraph', 'StateGraph', 'Custom Tools', 'MemorySaver'],
    },
  },
  {
    id: 'module-5',
    badge: 'Module 5',
    title: 'Capstone: Production Company Knowledge Assistant',
    focus: 'Collaborative End-to-End Enterprise Build',
    description:
      'Synthesize every tier into a production-ready knowledge assistant capable of multi-document ingest, semantic search inspection, cited answering, and agentic tool invocation.',
    topics: [
      'Repository scaffolding, environment config, Pydantic contracts & health endpoints',
      'Multi-document ingestion pipeline with SQLite metadata and Chroma upserts',
      'Pre-generation search verification: POST /search with scores to eliminate retrieval bugs',
      'Grounded RAG answering with verifiable citations and strict refusal fallbacks',
      'Full LangGraph agent integration with knowledge search and document summarization tools',
      'Five-question verification benchmark and reproducible virtual environment showcase',
    ],
    lab: {
      title: 'Demo-Ready Company Knowledge Assistant',
      description:
        'Deliver and demonstrate a complete, running service tested against realistic business documents (company policies, technical docs, FAQs) with clean README reproduction.',
      endpoints: ['GET /health', 'POST /ingest', 'POST /search', 'POST /ask', 'POST /chat'],
      skills: ['Full-Stack AI Engineering', 'FastAPI', 'LangGraph', 'Chroma', 'Production Verification'],
    },
  },
];

export const TECH_STACK: TechStackItem[] = [
  {
    name: 'Python 3.11+',
    role: 'Core Language',
    description: 'Modern asynchronous runtime, strict typing, dataclasses, and concurrent execution.',
    badge: 'Runtime',
  },
  {
    name: 'FastAPI',
    role: 'API Framework',
    description: 'High-performance async web framework with automated Swagger UI and dependency injection.',
    badge: 'Backend',
  },
  {
    name: 'Pydantic v2',
    role: 'Data Validation',
    description: 'Ultra-fast type validation, request/response schema enforcement, and settings management.',
    badge: 'Schemas',
  },
  {
    name: 'Chroma DB',
    role: 'Vector Database',
    description: 'Persistent embedded vector store with disk storage, metadata filtering, and top-k search.',
    badge: 'Vector DB',
  },
  {
    name: 'LangChain & LCEL',
    role: 'Pipeline Composition',
    description: 'Declarative runnable chains, document splitters, and modular retrieval workflows.',
    badge: 'Orchestration',
  },
  {
    name: 'LangGraph',
    role: 'Agentic Workflows',
    description: 'Cyclical graphs, state persistence with MemorySaver, and autonomous tool calling.',
    badge: 'Agents',
  },
  {
    name: 'OpenAI-Compatible LLMs',
    role: 'Foundational Models',
    description: 'Chat completions, streaming tokens, structured JSON extraction, and dense vector embeddings.',
    badge: 'Intelligence',
  },
  {
    name: 'TestClient & Pytest',
    role: 'API Testing',
    description: 'Automated integration test suites ensuring health, validation error boundaries, and reliability.',
    badge: 'Quality',
  },
];

export const CAPSTONE_LAYERS: CapstoneLayer[] = [
  {
    step: '1',
    title: 'Document Ingestion Pipeline',
    route: 'POST /ingest',
    description:
      'Accepts uploaded documents (.txt, docs), stores structured metadata in SQLite, splits text into overlapping chunks, generates embeddings, and upserts into Chroma vector store.',
    keyFeature: 'Input validation (400 on malformed payloads) + persistent storage',
  },
  {
    step: '2',
    title: 'Pre-Generation Search Verification',
    route: 'POST /search',
    description:
      'Returns top-k chunks with direct source attribution and similarity scores before wiring the LLM, ensuring retrieval bugs are caught and tuned early.',
    keyFeature: 'Similarity scoring & chunk inspection prior to generation',
  },
  {
    step: '3',
    title: 'Grounded RAG with Inline Citations',
    route: 'POST /ask',
    description:
      'Injects retrieved context into prompts, generates answers with verifiable citations, and enforces strict refusal when context is irrelevant or empty.',
    keyFeature: 'Zero hallucination guardrail: model refuses when context is missing',
  },
  {
    step: '4',
    title: 'Stateful LangGraph Agent',
    route: 'POST /chat',
    description:
      'An autonomous StateGraph agent with tools: semantic knowledge search, corpus summarizer by title, and multi-turn conversational memory via MemorySaver thread IDs.',
    keyFeature: 'Autonomous tool routing with loop limits and session continuity',
  },
  {
    step: '5',
    title: 'Evaluation Suite & Clean Virtual Env Demo',
    route: 'GET /health & Benchmark',
    description:
      'Rigorous 5-question acceptance check (3 answerable, 2 out-of-domain) and complete README instructions demonstrating setup from a fresh virtual environment.',
    keyFeature: 'Reproducible in 1 command with zero hidden dependencies',
  },
];

export const GRADUATE_OUTCOMES: string[] = [
  'Write typed Python and a small async FastAPI service with Pydantic request and response models.',
  'Chunk text, embed it, store it in Chroma, and retrieve top-k with metadata filters.',
  'Explain RAG as retrieve-then-generate, and ship it behind POST /ask with citations and a refusal path.',
  'Call that retrieval from a stateful LangGraph agent exposed as POST /chat.',
  'Demo the complete assistant from a clean virtual environment using only the project README.',
];

export const WINTER_TRAINING_FAQS: WinterTrainingFAQ[] = [
  {
    question: 'Who is this winter training program designed for?',
    answer:
      'This program is built for programmers, software developers, and CS/engineering students who already know basic programming logic and want to master production Python, APIs, and modern Generative AI application engineering.',
  },
  {
    question: 'What are the technical prerequisites?',
    answer:
      'You should be comfortable with programming fundamentals in any language (variables, functions, loops, basic data structures). Prior experience with Python is helpful but not strictly required, as Module 1 rapidly establishes modern Python conventions, typing, and async architecture.',
  },
  {
    question: 'What is the program duration and session format?',
    answer:
      'The winter training is an intensive 1-month program structured across 5 progressive engineering phases. Each session combines architectural deep-dives with live hands-on coding in the lab where you implement production systems from scratch, followed by mentor code reviews and capstone engineering sprints.',
  },
  {
    question: 'How does this compare to video tutorials or generic courses?',
    answer:
      'Unlike tutorials that rely on high-level wrappers or toy scripts, you build the core RAG and vector retrieval pipeline by hand first before introducing LangChain or LangGraph. You will learn the mechanics of chunking, cosine distance, metadata filtering, API dependency injection, and stateful agents directly in code.',
  },
  {
    question: 'What is the program fee and how does the registration fee deduction work?',
    answer:
      'The comprehensive program fee is ₹4,999 (all-inclusive: 1-month intensive program across 5 architectural phases, daily live hands-on labs, mentor code reviews, capstone repository, and verified credentials). Early registrations qualify for exclusive launch discounts. To reserve and confirm your seat today, you pay a ₹499 registration fee, which will be 100% deducted from the final program fee of ₹4,999 when the cohort commences.',
  },
  {
    question: 'Where will the offline classes and hands-on labs be held?',
    answer:
      'The offline program will be conducted at our office location: TigmaMinds Pvt Ltd, 4th Floor, Prithvi Centre, GS Rd, South Sarania, Lachit Nagar, Guwahati, Assam 781007. The facility is equipped with dedicated high-speed development lab setups for interactive architecture sessions and capstone sprints.',
  },
  {
    question: 'What project will I showcase in my portfolio?',
    answer:
      'You will design, build, and deploy a demo-ready Enterprise Company Knowledge Assistant with multi-format ingestion, Chroma vector search, citation-backed question answering, and a LangGraph autonomous agent with tool routing and thread memory.',
  },
];

