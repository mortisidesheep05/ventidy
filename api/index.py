import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any

# Ensure both api/ and root directory are in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
for p in [current_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from api.rag_engine import chat, get_knowledge_count, init_llm
except ImportError:
    from rag_engine import chat, get_knowledge_count, init_llm

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Ventidy AI Server] Initializing AI service...")
    init_llm()
    port = os.environ.get("PORT", "8000")
    print(f"[Ventidy AI Server] Ready on port {port}")
    yield

app = FastAPI(
    title="Ventidy AI Chatbot API",
    description="Lightweight Backend AI Service for Ventidy Solutions Customer Chatbot",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
frontend_env = os.environ.get("FRONTEND_URL", "").strip()
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

if frontend_env:
    for url in frontend_env.split(","):
        cleaned_url = url.strip().rstrip("/")
        if cleaned_url and cleaned_url not in allowed_origins:
            allowed_origins.append(cleaned_url)
    cors_origins = allowed_origins
    cors_credentials = True
else:
    cors_origins = ["*"]
    cors_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=cors_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: Optional[str] = "user"
    content: Optional[str] = ""

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Any]] = []

class ChatResponse(BaseModel):
    reply: str
    category: str
    document: Optional[str] = None
    status: str = "success"

@app.get("/")
def root():
    return {
        "service": "Ventidy AI Assistant API",
        "status": "online",
        "endpoints": ["/api/chat", "/api/health"]
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "online": True,
        "service": "ventidy-ai",
        "documents_count": get_knowledge_count(),
        "ready": True
    }

@app.post("/chat", response_model=ChatResponse)
@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(request: ChatRequest):
    user_query = request.message.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        result = chat(user_query, return_dict=True)
        if isinstance(result, dict):
            reply_text = result.get("reply", "I don't have that information.")
            cat_text = result.get("category", "general")
            doc_text = result.get("document")
        else:
            reply_text = str(result)
            cat_text = "general"
            doc_text = None

        return ChatResponse(
            reply=reply_text,
            category=cat_text,
            document=doc_text,
            status="success"
        )
    except Exception as e:
        print(f"[Ventidy AI Server] Error processing query '{user_query}': {e}")
        return ChatResponse(
            reply="I don't have that information.",
            category="error",
            status="error"
        )
