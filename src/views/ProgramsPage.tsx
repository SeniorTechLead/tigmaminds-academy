'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
  Database,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  CheckCircle,
  FileCode2,
  Rocket,
  ShieldCheck,
  Cpu,
  Workflow,
  BrainCircuit,
  Zap,
  Play,
  Activity,
  Radio,
  Check,
  Copy,
  GitBranch,
  RefreshCw,
  Award,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WinterTrainingRegistrationForm from '../components/WinterTrainingRegistrationForm';
import {
  WINTER_TRAINING_MODULES,
  TECH_STACK,
  CAPSTONE_LAYERS,
  GRADUATE_OUTCOMES,
  WINTER_TRAINING_FAQS,
  CurriculumModule,
} from '../data/winter-training';

// ── Interactive Agent Execution Loop Simulator ──────────────────────────
const AGENT_SIMULATION_STEPS = [
  {
    step: 1,
    id: 'intent',
    label: 'Intent Decomp & Schema',
    role: 'Pydantic v2 Contract',
    icon: BrainCircuit,
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/40',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    summary: 'Deconstructs raw user prompt into typed constraints, entities, and query intents.',
    code: `# Step 1: Pydantic Schema Validation
class AgentQueryIntent(BaseModel):
    raw_query: str = Field(min_length=3)
    target_corpus: Literal["policies", "api_specs", "hr_faq"]
    required_confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    requires_tool_execution: bool = True

intent = AgentQueryIntent.model_validate(incoming_payload)`,
    telemetry: {
      latency: '18ms',
      tokens: '48 tokens',
      confidence: '99.4%',
      status: 'VALIDATED_OK',
    },
  },
  {
    step: 2,
    id: 'graph',
    label: 'LangGraph Cognitive Router',
    role: 'Cyclical State Machine',
    icon: Workflow,
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-500/40',
    tagColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    summary: 'StateGraph checks conversation checkpoints and routes to deterministic retrieval tools.',
    code: `# Step 2: LangGraph State Machine Node
def cognitive_router(state: AgentState) -> dict:
    latest_msg = state["messages"][-1]
    # Evaluate memory & intent before hallucinating
    if any(k in latest_msg.content.lower() for k in ["policy", "guideline", "limit"]):
        return {"next_node": "chroma_hybrid_retriever"}
    return {"next_node": "direct_synthesis"}

workflow.add_conditional_edges("router", route_decision)`,
    telemetry: {
      latency: '34ms',
      tokens: '112 tokens',
      checkpoint: 'Thread#88219',
      status: 'ROUTED_TO_TOOLS',
    },
  },
  {
    step: 3,
    id: 'retrieval',
    label: 'Grounded RAG & Vector Memory',
    role: 'ChromaDB + Cosine Search',
    icon: Database,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/40',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    summary: 'Dense cosine similarity retrieval from persistent disk embeddings with exact citations.',
    code: `# Step 3: Cosine Similarity Vector Search
async def execute_grounded_retrieval(query: str, k: int = 4) -> list[DocumentChunk]:
    q_vec = await embedding_model.aembed_query(query)
    results = chroma_collection.query(
        query_embeddings=[q_vec],
        n_results=k,
        where={"doc_status": "verified"}
    )
    return parse_and_rank_citations(results)`,
    telemetry: {
      latency: '42ms',
      retrieved_chunks: '4 citations',
      top_similarity: '0.9412',
      status: 'GROUNDED_PASS',
    },
  },
  {
    step: 4,
    id: 'reflection',
    label: 'Self-Reflection & Guardrails',
    role: 'Evaluator & Refusal Engine',
    icon: ShieldCheck,
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/40',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    summary: 'Evaluates candidate output against retrieved facts. Rejects hallucinations with clean refusal.',
    code: `# Step 4: Self-Correction & Refusal Guardrail
def evaluate_grounding(state: AgentState) -> str:
    draft = state["candidate_response"]
    facts = state["grounded_context"]
    
    score = hallucination_critic(draft=draft, facts=facts)
    if score < 0.88:
        # Loop back for self-healing revision
        return "re_retrieve"
    return "finalize_response"`,
    telemetry: {
      grounding_score: '96.2%',
      hallucination_check: 'ZERO_DETECTED',
      citations: 'Doc#04 §3.1',
      status: 'GUARDRAILS_PASSED',
    },
  },
  {
    step: 5,
    id: 'fastapi',
    label: 'Async FastAPI Stream Delivery',
    role: 'High-Throughput ASGI',
    icon: Terminal,
    color: 'from-amber-400 to-yellow-500',
    borderColor: 'border-amber-400/40',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    summary: 'Non-blocking async StreamingResponse delivers tokens over Server-Sent Events (SSE).',
    code: `# Step 5: Streaming Token Delivery Endpoint
@app.post("/v1/agent/chat/stream")
async def stream_agent(request: ChatRequest):
    async def token_generator():
        async for chunk in agent_graph.astream(request.dict()):
            if chunk.get("token"):
                yield f"data: {json.dumps({'t': chunk['token']})}\\n\\n"
    return StreamingResponse(token_generator(), media_type="text/event-stream")`,
    telemetry: {
      throughput: '124 tokens/s',
      first_token: '92ms',
      http_status: '200 OK',
      status: 'DELIVERED_SUCCESS',
    },
  },
];

// ── Interactive Code Studio Tabs ─────────────────────────────────────────
const CODE_STUDIO_TABS = [
  {
    id: 'graph',
    fileName: 'autonomous_agent.py',
    badge: 'LangGraph StateMachine',
    lang: 'python',
    code: `from typing import Annotated, TypedDict, Literal
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    grounded_docs: list[dict]
    retry_count: int

# Initialize cyclical LangGraph state machine
workflow = StateGraph(AgentState)

# Define architectural nodes
workflow.add_node("reasoner", call_cognitive_llm)
workflow.add_node("retrieval_tool", execute_vector_retrieval)
workflow.add_node("guardrail_eval", evaluate_grounding_score)

# Route conditionally based on real-time decisions
def router(state: AgentState) -> Literal["retrieval_tool", "guardrail_eval", "end"]:
    last_msg = state["messages"][-1]
    if last_msg.tool_calls:
        return "retrieval_tool"
    if state["retry_count"] < 2 and not state["grounded_docs"]:
        return "guardrail_eval"
    return "end"

workflow.add_conditional_edges("reasoner", router)
workflow.add_edge("retrieval_tool", "reasoner")

# Compile with thread memory persistence
app = workflow.compile(checkpointer=MemorySaver())`,
  },
  {
    id: 'rag',
    fileName: 'vector_rag_from_scratch.py',
    badge: 'Vector Math & ChromaDB',
    lang: 'python',
    code: `import numpy as np
import chromadb
from pydantic import BaseModel, Field

class CitedResponse(BaseModel):
    answer: str
    citation_ids: list[str] = Field(default_factory=list)
    confidence_score: float
    refusal_triggered: bool = False

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    """Zero-black-box vector cosine similarity calculation"""
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

async def retrieve_grounded_chunks(query: str, client: chromadb.PersistentClient, k: int = 4):
    collection = client.get_collection("enterprise_knowledge_base")
    query_vector = await compute_dense_embedding(query)
    
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=k,
        include=["documents", "metadatas", "distances"]
    )
    
    # Enforce strict relevance threshold
    ranked = []
    for doc, meta, dist in zip(results['documents'][0], results['metadatas'][0], results['distances'][0]):
        score = 1.0 - (dist / 2.0)
        if score >= 0.72:
            ranked.append({"content": doc, "meta": meta, "score": score})
            
    return ranked`,
  },
  {
    id: 'fastapi',
    fileName: 'api_microservice.py',
    badge: 'Async FastAPI & Pydantic v2',
    lang: 'python',
    code: `from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import json

app = FastAPI(title="TMA Agentic Runtime API", version="2.0.0")

class IngestDocumentRequest(BaseModel):
    title: str = Field(..., max_length=120)
    category: str = Field(..., pattern="^(policy|technical|handbook)$")
    content: str = Field(..., min_length=20)

@app.post("/v1/agent/chat/stream", tags=["Agent Execution"])
async def stream_agent_execution(prompt: str):
    """
    Asynchronous Server-Sent Events (SSE) streaming endpoint.
    Maintains non-blocking ASGI event loop under concurrent load.
    """
    async def event_publisher():
        async for chunk in agent_runtime.astream({"input": prompt}):
            if chunk.get("type") == "token":
                yield f"data: {json.dumps({'token': chunk['text']})}\\n\\n"
            elif chunk.get("type") == "tool_execution":
                yield f"event: telemetry\\ndata: {json.dumps(chunk['payload'])}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(event_publisher(), media_type="text/event-stream")`,
  },
  {
    id: 'test',
    fileName: 'test_agent_guardrails.py',
    badge: 'Pytest & Integration Rigor',
    lang: 'python',
    code: `import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_rag_refusal_when_context_is_absent():
    """Verify that the agent does NOT hallucinate when facts do not exist"""
    out_of_bounds_query = "What is the secret recipe for Martian rocket propellant?"
    response = client.post("/v1/ask", json={"query": out_of_bounds_query})
    
    assert response.status_code == 200
    data = response.json()
    assert data["refusal_triggered"] is True
    assert "Insufficient verified context" in data["answer"]
    assert len(data["citation_ids"]) == 0

def test_pydantic_schema_enforces_required_fields():
    response = client.post("/v1/ingest", json={"title": "Short"})
    assert response.status_code == 422  # Unprocessable Entity validation boundary`,
  },
];

// ── Interactive Module Blueprint Component ──────────────────────────────
function ModuleBlueprintCard({
  module,
  index,
  isExpanded,
  onToggle,
}: {
  module: CurriculumModule;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const phaseNumbers = ['01', '02', '03', '04', '05'];

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-xl ${
        isExpanded
          ? 'bg-slate-900/90 border-amber-500/60 shadow-xl shadow-amber-500/10'
          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/70'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
              PHASE {phaseNumbers[index]}
            </span>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              // ARCHITECTURE
            </span>
          </div>

          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight truncate flex items-center gap-2">
              <span>{module.title}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 truncate">
              {module.focus}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 mt-1 sm:mt-0">
          {module.lab.endpoints && module.lab.endpoints.length > 0 && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              {module.lab.endpoints[0]}
            </span>
          )}
          <span className="text-xs font-medium text-amber-400 hidden sm:inline">
            {isExpanded ? 'Collapse' : 'Inspect Architecture'}
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 text-slate-400 border border-slate-700 transition-transform duration-300 ${
              isExpanded ? 'rotate-180 bg-amber-500/20 text-amber-400 border-amber-500/40' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-slate-800/80 space-y-5 animate-fade-in">
          <p className="text-sm text-slate-300 leading-relaxed">
            {module.description}
          </p>

          {/* Topics Covered */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Architectural Implementations</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {module.topics.map((topic, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hands-On Lab Card */}
          <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Mission Lab Deliverable
                </span>
              </div>
              {module.lab.endpoints && module.lab.endpoints.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {module.lab.endpoints.map((ep) => (
                    <span
                      key={ep}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    >
                      {ep}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h6 className="text-sm font-bold text-white mb-1.5">
              {module.lab.title}
            </h6>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {module.lab.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {module.lab.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FAQ Item Component ───────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-md transition-colors">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <span className="text-sm sm:text-base font-bold text-slate-200 pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-amber-400 flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180 text-amber-300' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-3 animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

// ── MAIN PROGRAM VIEW ────────────────────────────────────────────────────
export default function ProgramsPage() {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [selectedAgentStep, setSelectedAgentStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeCodeTab, setActiveCodeTab] = useState<string>('graph');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Auto-run simulator loop when toggled
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setInterval(() => {
      setSelectedAgentStep((prev) => (prev + 1) % AGENT_SIMULATION_STEPS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isSimulating]);

  const activeStepData = AGENT_SIMULATION_STEPS[selectedAgentStep];
  const activeCodeData = CODE_STUDIO_TABS.find((t) => t.id === activeCodeTab) || CODE_STUDIO_TABS[0];

  const handleCopyCode = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(activeCodeData.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 font-sans relative overflow-x-hidden">
      <Header />

      {/* ── High-Tech Cyber Ambient Lighting & Background Grid ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-[600px] left-[-150px] w-[600px] h-[600px] bg-sky-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[1300px] right-[-150px] w-[650px] h-[650px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-[2200px] left-1/3 w-[700px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" />
        {/* Subtle Cyberpunk Mesh Grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245, 158, 11, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.25) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ===================== HERO SECTION ===================== */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-mono font-semibold mb-8 shadow-lg shadow-amber-500/10 backdrop-blur-md animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE COHORT 2026 // AGENTIC SYSTEMS MASTERCLASS</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 font-sans flex items-center gap-1">
                Hands-On Engineering
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
            </div>

            {/* Main Cybernetic Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-5xl mx-auto mb-6">
              Engineer{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                Autonomous AI Agents
              </span>
              <br />
              <span className="text-white">With Python &amp; FastAPI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
              Move beyond toy ChatGPT wrapper scripts. Master <strong>cyclical LangGraph state machines</strong>,
              deconstruct <strong>vector RAG from mathematical scratch</strong>, and deploy
              high-throughput <strong>async FastAPI microservices</strong> with zero black boxes.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
                <span>Claim Your Spot &middot; &#8377;1</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#agent-simulator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white hover:border-amber-500/50 font-semibold text-base backdrop-blur-md transition-all cursor-pointer"
              >
                <Cpu className="w-5 h-5 text-amber-400" />
                <span>Simulate Agent Runtime</span>
              </a>
            </div>

            {/* High-Impact Stat Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left max-w-5xl mx-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">01 // PEDAGOGY</span>
                  <Terminal className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-0.5">2-Hour Daily Labs</div>
                <p className="text-xs text-slate-400">40m architectural breakdown + 70m intensive live coding.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-sky-400">02 // MECHANICS</span>
                  <Workflow className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-0.5">Zero Black Boxes</div>
                <p className="text-xs text-slate-400">Implement vector embeddings &amp; cosine math before frameworks.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">03 // QUALITY</span>
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-0.5">Production Rigor</div>
                <p className="text-xs text-slate-400">Pydantic v2 data contracts, ASGI streaming &amp; Pytest suites.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-purple-400">04 // OUTCOME</span>
                  <Rocket className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-0.5">Live Capstone</div>
                <p className="text-xs text-slate-400">Deploy an enterprise knowledge assistant demo to your GitHub.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== INTERACTIVE AGENT LOOP SIMULATOR ===================== */}
        <section id="agent-simulator" className="py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-800/80 bg-slate-950/70 relative scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Interactive Architecture Visualizer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                How an Autonomous Agent Thinks &amp; Executes
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Click any node in the cognitive loop to inspect the live execution graph, Pydantic schema validation, and real-time telemetry.
              </p>
            </div>

            {/* Simulation Controls & Stepper */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>LANGGRAPH STATE MACHINE // v2.4-RELEASE</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulating(!isSimulating)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSimulating
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auto-Cycling (Click to Pause)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Simulate Agent Flow</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual Node Pipeline Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
              {AGENT_SIMULATION_STEPS.map((s, idx) => {
                const IconComponent = s.icon;
                const isSelected = selectedAgentStep === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setIsSimulating(false);
                      setSelectedAgentStep(idx);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        NODE 0{s.step}
                      </span>
                      <IconComponent
                        className={`w-4 h-4 ${
                          isSelected ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      />
                    </div>
                    <div className="text-xs font-bold text-white mb-0.5 truncate">
                      {s.label}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      {s.role}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Node Inspector Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
              {/* Left Column: Architectural Explanation & Telemetry */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border ${activeStepData.tagColor}`}>
                      NODE 0{activeStepData.step} &middot; {activeStepData.role}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {activeStepData.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeStepData.summary}
                  </p>
                </div>

                {/* Simulated Telemetry Metrics */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-2">
                  <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] pb-1 border-b border-slate-800/80">
                    Live Telemetry Metrics
                  </div>
                  {Object.entries(activeStepData.telemetry).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-slate-400">{key.replace('_', ' ')}:</span>
                      <span className="text-amber-300 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Code Snippet Console */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col">
                <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="font-mono text-xs text-slate-400 ml-2">
                      agent_kernel_{activeStepData.id}.py
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    PYTHON 3.11+
                  </span>
                </div>
                <div className="p-4 sm:p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed flex-1">
                  <pre className="text-amber-100/90 whitespace-pre">
                    <code>{activeStepData.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== PARADIGM SHIFT: GENAI 1.0 VS AGENTIC 2.0 ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                The 2026 Architectural Shift
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 mb-3">
                Why Toy Wrappers Fail in Production
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Comparing standard YouTube tutorial bots against the enterprise-grade agentic systems you will construct in this cohort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old GenAI 1.0 */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-red-500/20 backdrop-blur-md relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                    Legacy GenAI 1.0 (Toy Bots)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                    Fragile
                  </span>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-base leading-none">&times;</span>
                    <span>Single-shot prompt wrappers with no decision loops or self-healing.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-base leading-none">&times;</span>
                    <span>Silent hallucinations when information is missing from documents.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-base leading-none">&times;</span>
                    <span>Synchronous blocking web routes that crash under 5+ concurrent users.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-base leading-none">&times;</span>
                    <span>Opaque frameworks where you cannot debug embeddings or vector cosine math.</span>
                  </li>
                </ul>
              </div>

              {/* Modern Agentic AI 2.0 */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden shadow-xl shadow-emerald-500/5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Modern Agentic AI (What You Build)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                    Deterministic &middot; Tested
                  </span>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Cyclical LangGraph state machines</strong> with tool-calling and checkpoint memory.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Deterministic RAG with exact citations</strong> and strict refusal fallbacks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Async FastAPI + ASGI streaming</strong> serving hundreds of concurrent tokens smoothly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Automated Pytest test suites</strong> testing edge cases and Pydantic schema boundaries.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== INTERACTIVE CODE STUDIO TERMINAL ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-800/80 bg-slate-950/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-widest">
                Hands-On Code Preview
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 mb-3">
                Inspect the Real Python You Will Write
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                No high-level fluff. Browse the actual production architectures, LangGraph states, and FastAPI endpoints built throughout the 5 phases.
              </p>
            </div>

            {/* Code Studio Window */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Tab Bar */}
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {CODE_STUDIO_TABS.map((tab) => {
                    const isActive = activeCodeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveCodeTab(tab.id)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <FileCode2 className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span>{tab.fileName}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {activeCodeData.badge}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Copy Code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed max-h-[460px] overflow-y-auto">
                <pre className="text-amber-100/90 whitespace-pre">
                  <code>{activeCodeData.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== CURRICULUM SYLLABUS SECTION ===================== */}
        <section id="curriculum" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Structured Engineering Progression</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                The 5 Architectural Milestones
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Every phase pairs foundational systems theory with an intensive live lab. You code, inspect execution traces, and debug real edge cases.
              </p>
            </div>

            {/* Module Blueprints */}
            <div className="space-y-4">
              {WINTER_TRAINING_MODULES.map((module, idx) => (
                <ModuleBlueprintCard
                  key={module.id}
                  module={module}
                  index={idx}
                  isExpanded={activeModuleIndex === idx}
                  onToggle={() => setActiveModuleIndex(activeModuleIndex === idx ? -1 : idx)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CAPSTONE ENTERPRISE SHOWCASE ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/70 border-t border-slate-800/80">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <Rocket className="w-3.5 h-3.5" />
                <span>Featured Capstone Project</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Production Company Knowledge Assistant
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Synthesize all 5 modules into a production-grade AI knowledge copilot built over real document corpuses with strict factual grounding.
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                      Live Portfolio Demonstration
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                      End-to-End System Blueprint
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs text-slate-300">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>FastAPI + Chroma + LangGraph</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 divide-y divide-slate-800/80">
                {CAPSTONE_LAYERS.map((layer) => (
                  <div key={layer.step} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {layer.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="text-base font-bold text-white">
                          {layer.title}
                        </h4>
                        {layer.route && (
                          <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-amber-300 border border-slate-700">
                            {layer.route}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                        {layer.description}
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{layer.keyFeature}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== PRODUCTION TECH STACK ===================== */}
        <section className="py-20 border-y border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                Industry Standard Arsenal
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                The Modern Agentic AI Tech Stack
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TECH_STACK.map((item) => (
                <div
                  key={item.name}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-sm hover:border-amber-500/40 transition duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-amber-400 mb-1.5">
                    {item.role}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== GRADUATE CAPABILITIES & OUTCOMES ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Career Portfolio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                What You Will Own &amp; Demonstrate
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Concrete engineering capabilities you walk away with — ready to showcase in technical interviews and deploy in production.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GRADUATE_OUTCOMES.map((outcome, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {outcome}
                  </p>
                </div>
              ))}

              {/* Bonus Portfolio Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 flex items-start gap-3.5 md:col-span-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Production-Grade GitHub Repository &amp; Verified Credential
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Walk away with a clean, documented GitHub repository featuring virtual environment setup, Pydantic data models, vector retrieval benchmarks, and a running FastAPI ASGI service you can demonstrate live during company hiring rounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== REGISTRATION PORTAL WITH FORM ===================== */}
        <section id="register" className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-16">
          <div className="max-w-3xl mx-auto">
            {/* Header Badge & Callout */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-mono font-bold mb-3 shadow-lg shadow-amber-500/10">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>WINTER 2026 COHORT // ENROLLMENT PORTAL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Secure Your Seat in the Cohort
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                All-inclusive &#8377;1 test pass. Complete curriculum, daily interactive coding labs, verified certificate, and full capstone repository.
              </p>
            </div>

            {/* Glowing Cyber Registration Container */}
            <div className="rounded-3xl border border-amber-500/30 bg-slate-950/90 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-amber-500/10 relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-mono text-[11px] font-bold uppercase tracking-wider shadow-md">
                &#9679; 30 SEATS MAXIMUM
              </div>
              <WinterTrainingRegistrationForm />
            </div>
          </div>
        </section>

        {/* ===================== FREQUENTLY ASKED QUESTIONS ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/60">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-400">
                Key details about schedule, live code reviews, and technology requirements.
              </p>
            </div>

            <div className="space-y-3">
              {WINTER_TRAINING_FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* ===================== OTHER TMA ACADEMY PROGRAMS ===================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Explore Other Academy Offerings
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                From continuous school STEM curricula to comprehensive 24-week career bootcamps.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div id="school-program" className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Grades 6–12
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1 mb-2">
                    12-Month Mentored Curriculum
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    Continuous year-round STEM learning across Robotics, Arduino, Python, and Creative Coding with dedicated cohorts and monthly projects.
                  </p>
                </div>
                <Link
                  href="/curriculum"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 hover:underline"
                >
                  View 12-Month Curriculum <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div id="bootcamp" className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                    Career Changers &amp; Grads
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1 mb-2">
                    24-Week Career Bootcamp
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    Full-Stack Development, AI &amp; Machine Learning, or Cloud &amp; DevOps. Production portfolio, mock interviews, and industry job referrals.
                  </p>
                </div>
                <Link
                  href="/curriculum/bootcamp"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-400 hover:underline"
                >
                  View 24-Week Bootcamp <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
