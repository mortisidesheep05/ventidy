import os
import sys

# Ensure offline mode is active before loading any AI dependencies
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from rag_engine import chat, metadata_collection, init_llm

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Ventidy AI Server] Initializing AI service...")
    init_llm()
    print("[Ventidy AI Server] Ready to accept chat requests on http://localhost:8000")
    yield

app = FastAPI(
    title="Ventidy AI Chatbot API",
    description="Backend RAG AI Service for Ventidy Solutions Customer Chatbot",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React frontend (allow all local dev origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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
        "documents_count": metadata_collection.count(),
        "ready": True
    }

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

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
